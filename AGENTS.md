# AGENTS.md — nautt-motion

Remotion repo that produces explainer videos for **Nautt Finance clients**. One folder per production
(`productions/<slug>/`), one shared brand layer (`brand/`). Videos ship in **EN, PT-BR and LatAm ES**
unless the brief says the audience speaks a single language.

**Before any video work, read and follow the skill `.agents/skills/nautt-video/SKILL.md`** (workflow,
writing rules, compliance guardrails, brand, voices). For PT-BR voiceover also follow
`.agents/skills/nautt-voice-ptbr/SKILL.md` (pace, pronunciation, review loop). Commands and layout: `README.md`.
Reference production: `productions/web3auth-maintenance/`.

## Rules for every agent

- Brief → script → **human approval** → copy.ts → scenes → VO → render → GitHub Release. No scene work before the script is approved.
- All on-screen text and VO live in `productions/<slug>/copy.ts`; never hardcode strings in scenes.
- Nautt is a technology platform, not a bank. Never name card acquirers or other providers. Only claim what production does today.
- Never commit `.env`, MP4s or `out/`. Never print the ElevenLabs key.
- Package manager: pnpm. Node 22.6+. Check with `pnpm typecheck` before committing.
- Code, commits and docs in English; the team talks in Portuguese.
