// Generate a production's voiceover with ElevenLabs.
// Usage: pnpm vo <production> <en|pt|es> [--line N] [--stability 0.5] [--style 0.15] [--speed 1] [--boost] [--voice id]
//   --line regenerates one line (1-based) and keeps the others.
// Text comes from productions/<production>/copy.ts (STR[lang].vo, optional SPEAK_AS / VO_CHECKS).
// Reads ELEVENLABS_API_KEY from the environment or ./.env (never printed).
// Writes public/<production>/vo/<lang>/vo{n}.mp3 (trailing breath trimmed) and
// productions/<production>/vo/<lang>.json (durations + per-character start times for on-screen cues).
import {existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync} from 'node:fs';
import {execFileSync} from 'node:child_process';

if (!process.env.ELEVENLABS_API_KEY && existsSync('.env')) process.loadEnvFile('.env');
const key = process.env.ELEVENLABS_API_KEY;
if (!key) {
  console.error('ELEVENLABS_API_KEY not set (env or .env)');
  process.exit(1);
}

const PROD = process.argv[2];
const LANG = process.argv[3];
if (!PROD || !existsSync(`productions/${PROD}/copy.ts`) || !['en', 'pt', 'es'].includes(LANG)) {
  console.error('usage: pnpm vo <production> <en|pt|es> [options]');
  process.exit(1);
}
const copy = await import(`../productions/${PROD}/copy.ts`);
const brand = await import('../brand/voice.ts');

// Brand voices from the ElevenLabs library: Alice (EN), Roberta (Brazilian PT), Tatiana (neutral LatAm ES).
// PT must never sound like Portugal; ES must sound native, not a foreigner speaking Spanish.
const DEFAULT_VOICE = {en: 'Xb7hH8MSUJpSbSDYk0k2', pt: 'RGymW84CSmfVugnA5tvA', es: '2rigMbVWLdqtBSCahJFX'};
const arg = (name, def) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > 0 ? process.argv[i + 1] : def;
};
const VOICE = arg('voice', DEFAULT_VOICE[LANG]);
const ONLY_LINE = arg('line') ? Number(arg('line')) - 1 : null;
// Defaults: brand/voice.ts VOICE_SETTINGS, then the production's VO_SETTINGS, then CLI flags.
const DEF = {stability: 0.5, style: 0.15, speed: 1.0, ...brand.VOICE_SETTINGS?.[LANG], ...copy.VO_SETTINGS?.[LANG]};
const STABILITY = Number(arg('stability', DEF.stability));
const STYLE = Number(arg('style', DEF.style));
const SPEED = Math.min(Number(arg('speed', DEF.speed)), 1.2); // ElevenLabs accepts 0.7–1.2
// Per-line overrides from the production (copy.ts VO_LINE_SETTINGS[lang][lineNumber], 1-based); CLI flags still win.
const lineSettings = (i) => {
  const o = copy.VO_LINE_SETTINGS?.[LANG]?.[i + 1] ?? {};
  const pick = (name, base) => (process.argv.includes(`--${name}`) || o[name] === undefined ? base : o[name]);
  return {stability: pick('stability', STABILITY), style: pick('style', STYLE), speed: Math.min(pick('speed', SPEED), 1.2)};
};
const LINES = copy.STR[LANG].vo;
const audioDir = `public/${PROD}/vo/${LANG}`;
mkdirSync(audioDir, {recursive: true});
mkdirSync(`productions/${PROD}/vo`, {recursive: true});

const MODEL = 'eleven_multilingual_v2';

// English brand/product names inside PT/ES lines: SPEAK_AS respells them for the TTS only (the screen keeps
// the real name), and VO_CHECKS re-transcribes each take with English STT, regenerating it (up to 4 takes)
// until every occurrence was heard right. See productions/web3auth-maintenance/copy.ts for an example.
// Respellings come from brand/voice.ts PRONUNCIATION, overridden by the production's SPEAK_AS.
// A value is either a string (PT and ES) or {pt, es} per language.
const SPEAK_AS = {...brand.PRONUNCIATION, ...(copy.SPEAK_AS ?? {})};
const VO_CHECKS = copy.VO_CHECKS ?? [];
const respell = (to) => (typeof to === 'string' ? to : to?.[LANG]);
const speak = (text) =>
  LANG === 'en'
    ? text
    : Object.entries(SPEAK_AS).reduce((t, [from, to]) => (respell(to) ? t.replaceAll(from, respell(to)) : t), text);

const heardOk = async (audio, line) => {
  const checks = VO_CHECKS.filter((c) => line.includes(c.term));
  if (checks.length === 0) return true;
  const form = new FormData();
  form.append('model_id', 'scribe_v1');
  // English STT by default (English names inside PT/ES); a check with stt: 'auto' lets STT detect the language.
  if (!checks.some((c) => c.stt === 'auto')) form.append('language_code', 'en');
  form.append('file', new Blob([audio]), 'a.mp3');
  const r = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {method: 'POST', headers: {'xi-api-key': key}, body: form});
  const {text} = await r.json();
  const ok = checks.every((c) => (text.match(new RegExp(c.heard, 'gi')) || []).length >= line.split(c.term).length - 1);
  if (!ok) console.log(`  retry: heard "${text.slice(0, 120)}"`);
  return ok;
};

const probe = (f) =>
  Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim());

const outJson = `productions/${PROD}/vo/${LANG}.json`;
const prev = ONLY_LINE !== null && existsSync(outJson) ? JSON.parse(readFileSync(outJson, 'utf8')) : null;
const durations = prev ? [...prev.durations] : [];
const alignment = prev ? [...prev.alignment] : [];
for (let i = 0; i < LINES.length; i++) {
  if (ONLY_LINE !== null && i !== ONLY_LINE) continue;
  let json;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE}/with-timestamps?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {'xi-api-key': key, 'Content-Type': 'application/json'},
        body: JSON.stringify({
          text: speak(LINES[i]),
          model_id: MODEL,
          // previous_text only: next_text makes the line end with a "to be continued" rise.
          previous_text: i > 0 ? speak(LINES[i - 1]) : undefined,
          voice_settings: {...lineSettings(i), similarity_boost: 0.8, use_speaker_boost: process.argv.includes('--boost')},
        }),
      },
    );
    if (!res.ok) {
      console.error(`vo${i + 1} failed: HTTP ${res.status} ${(await res.text()).slice(0, 300)}`);
      process.exit(1);
    }
    json = await res.json();
    if (await heardOk(Buffer.from(json.audio_base64, 'base64'), LINES[i])) break;
    if (attempt === 4) console.log(`  vo${i + 1}: pronunciation still off after 4 takes, kept last take`);
  }

  const raw = `${audioDir}/raw${i + 1}.mp3`;
  const file = `${audioDir}/vo${i + 1}.mp3`;
  writeFileSync(raw, Buffer.from(json.audio_base64, 'base64'));

  // Cut the audio right after the last spoken character (drops the trailing breath),
  // keep a short tail and fade it out.
  const a = json.alignment;
  const lastEnd = Math.max(...a.character_end_times_seconds);
  const cut = Math.min(probe(raw), lastEnd + 0.18);
  execFileSync('ffmpeg', [
    '-y', '-loglevel', 'error', '-i', raw,
    '-af', `atrim=0:${cut.toFixed(3)},afade=t=out:st=${(cut - 0.12).toFixed(3)}:d=0.12`,
    '-b:a', '128k', file,
  ]);
  unlinkSync(raw);

  const d = probe(file);
  durations[i] = d;
  alignment[i] = {text: a.characters.join(''), starts: a.character_start_times_seconds};
  console.log(`vo${i + 1}: ${d.toFixed(2)}s (speed ${lineSettings(i).speed})`);
}
writeFileSync(outJson, JSON.stringify({voice: VOICE, durations, alignment}));
console.log(`done (speed ${SPEED}, stability ${STABILITY}, style ${STYLE})`);
