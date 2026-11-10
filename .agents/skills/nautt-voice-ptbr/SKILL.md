---
name: nautt-voice-ptbr
description: Make Nautt video voiceovers in Brazilian Portuguese sound natural — pace, pronunciation of English/financial terms (USDT, Pix, D+1…), number reading and tone — using ElevenLabs in the nautt-motion repo. Use whenever writing, generating, reviewing or fixing PT-BR voiceover ("narração", "locução", "VO em português", "fala muito pausada", "pronúncia"), or adding a term the PT voice mispronounces.
---

# nautt-voice-ptbr — the PT-BR voice we want

Target: a Brazilian product narrator explaining a feature to a client. Warm, confident, **conversational
pace**, never robotic, never European Portuguese. The client should feel it was recorded by a person from
São Paulo, not read letter by letter by a machine.

Voice: Roberta (`RGymW84CSmfVugnA5tvA`, native BR) on `eleven_multilingual_v2`. Defaults live in
`brand/voice.ts` and are applied by `scripts/gen-vo.mjs` automatically.

## 1. Pace

- Default **speed 1.2** (`VOICE_SETTINGS.pt` in `brand/voice.ts`). ElevenLabs caps at 1.2; the generator clamps.
  At 1.0 Roberta sounds slow and over-articulated (team review 2026-11-10: "pronúncia boa, mas muito pausada").
- Healthy range in `pnpm vo:stats <slug> pt`: **~17–24 chars/s** on normal lines. Lines with numbers written out
  read lower (~15) — that is expected. Below ~14 on a normal line = too slow; regenerate it.
- **Opening lines (hook + first explanation) stay at 1.0.** The viewer is still settling in; 1.2 there felt
  rushed, while 1.2 from the third line on felt right (review 2026-11-10, credit-card-flow).
  Persist it per line in `copy.ts` so regenerations keep it:
  `export const VO_LINE_SETTINGS = {pt: {1: {speed: 1.0}, 2: {speed: 1.0}}};` (1-based line numbers).
- Whole production override: `export const VO_SETTINGS = {pt: {speed: 1.15}}`.
  One-off test of a line: `pnpm vo <slug> pt --line N --speed 1.15` (CLI flags beat both).

## 2. Pronunciation (respell for the TTS, never on screen)

Terms go in `PRONUNCIATION` (`brand/voice.ts`, shared by every video) or in the production's `SPEAK_AS`
(`copy.ts`, one video only). The screen always keeps the real spelling.

**Write the respelling as one word, the way a Brazilian says it.** Spaced letters (`U S D T`) make the voice
stop between letters — that is what made USDT sound "pausado".

| Term | PT respelling | Notes |
|------|---------------|-------|
| USDT | `uéssedetê` | in `brand/voice.ts` |
| Web3Auth | `Web Three Auth` | English on purpose (web3auth-maintenance) |
| Pix | — | Portuguese word already, no respelling |
| Nautt | — | brand name; listen for "nóti" vs "náut" and confirm with the team before respelling |

When a new term sounds wrong: add it here **and** in `PRONUNCIATION`, regenerate only the affected lines,
and add a `VO_CHECKS` entry in the production (`{term, heard: <regex>, stt: 'auto'}`) so the generator
re-transcribes each take and retries until it is heard right. Use `stt: 'auto'` for Portuguese respellings
(STT writes "uéssedetê" back as "USDT"); omit it for English names inside PT, which are checked with English STT.

## 3. Writing lines for the ear

- **Never read symbols.** "D+1" → "próximo dia útil"; "10%" → "dez por cento"; "R$ 5,40" → "cinco reais e quarenta".
- **Write numbers out in full** in the VO line ("cento e sessenta e seis vírgula sessenta e sete"); the TTS reads
  digits inconsistently. The screen shows the digits.
- Commas create pauses. Use them where a person breathes, not after every clause. Prefer two short sentences
  over one with four commas. A colon gives a short, natural beat before a list.
- Speak like the dashboard, in "você". Brazilian contractions are fine in the text only if the team approves
  ("pra" vs "para") — the voice already relaxes "para" to "pra" on its own.
- No fillers. If a take adds words that are not in the text ("né", "tá", "então"), regenerate that line
  (seen 2026-11-10: "90 ou 10%, né"). `pnpm vo:check <slug> pt` shows the transcript of every line.
- Cue phrases (`copy.ts` → `cue`) must stay verbatim in the line; if you respell a word inside a cue phrase,
  the cue must use the respelled form (cues are searched in the spoken text).

## 4. Review loop (every PT generation)

1. `pnpm vo <slug> pt` — prints the speed/stability/style used.
2. `pnpm vo:check <slug> pt` — read every transcript: extra words, wrong terms, Portugal accent signs
   ("estás", "fixe", "telemóvel").
3. `pnpm vo:stats <slug> pt` — pace within range and loudness within ~2 LUFS between lines.
4. Fix single lines with `--line N` (match the others: same speed; `--stability 0.7 --style 0` calms a line
   that came out too emotional or invented words).
5. Re-render (`pnpm render <slug> pt`) — scenes resize to the new durations automatically.
6. A human listens to the full PT video before release. Record new learnings in this file.

## 5. Changing a brand default

Changing `brand/voice.ts` affects every production the **next time** its PT VO is regenerated (existing MP3s
do not change). Say so in the PR and regenerate the productions you want aligned.
