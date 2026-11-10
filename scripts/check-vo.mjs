// Transcribe a production's VO clips with ElevenLabs speech-to-text (sanity check of wording/pronunciation).
// Usage: pnpm vo:check <production> <en|pt|es>
import {existsSync, readFileSync, readdirSync} from 'node:fs';

if (!process.env.ELEVENLABS_API_KEY && existsSync('.env')) process.loadEnvFile('.env');
const [PROD, LANG] = process.argv.slice(2);
const dir = `public/${PROD}/vo/${LANG}`;
if (!PROD || !LANG || !existsSync(dir)) {
  console.error('usage: pnpm vo:check <production> <en|pt|es>');
  process.exit(1);
}
const files = readdirSync(dir).filter((f) => /^vo\d+\.mp3$/.test(f)).sort((a, b) => parseInt(a.slice(2)) - parseInt(b.slice(2)));
for (const f of files) {
  const form = new FormData();
  form.append('model_id', 'scribe_v1');
  form.append('language_code', LANG);
  form.append('file', new Blob([readFileSync(`${dir}/${f}`)]), f);
  const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
    method: 'POST',
    headers: {'xi-api-key': process.env.ELEVENLABS_API_KEY},
    body: form,
  });
  if (!res.ok) {
    console.error(`${f}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
    process.exit(1);
  }
  console.log(`${f}: ${(await res.json()).text}`);
}
