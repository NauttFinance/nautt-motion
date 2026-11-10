---
name: nautt-video
description: Plan, script, build, voice and render Nautt Finance explainer videos in the nautt-motion Remotion repo. Use for any request to create or change a Nautt video ("vídeo explicativo", roteiro, explainer, cutdown, 9:16, voiceover, legendas), to add a production under productions/<slug>, or to translate a video to EN / PT-BR / ES.
---

# nautt-video — explainer videos for Nautt clients

`nautt-motion` turns React (Remotion) into MP4 explainers that Nautt Finance sends to its **clients**
(merchants and companies that use the Nautt dashboard and API). Every video teaches one product flow
or explains one event, in the Nautt brand, with a voiceover.

Nautt has clients in Brazil and across Latin America and abroad, so **every production ships in three
languages by default: EN, PT-BR and LatAm ES**. A production may ship in fewer languages only when the
brief says the audience speaks a single language (e.g. a Brazil-only feature → PT-BR only). Write that
decision in the brief; never drop a language silently.

This file works for any AI runtime (Claude Code, Codex, Cursor, opencode, Gemini). Read the repo
`README.md` for commands and `productions/web3auth-maintenance/` as the reference production.

## Workflow (do the steps in order, stop for approval where marked)

1. **Brief** — create `productions/<slug>/README.md` from [references/brief-template.md](references/brief-template.md).
   Gather facts from the source of truth, not memory: the panel copy (`nautt-painel-v2/messages/{pt,en,es}.json`),
   public API docs (`nautt-v2-docs/README.md`), the request thread (Slack / ClickUp). List open questions.
2. **Script** — write `productions/<slug>/SCRIPT.md`: scene table (goal, on-screen, visual) + full VO in
   PT-BR first, then EN and ES. Target 60–100 s for EN; PT/ES run ~10–20 % longer.
   **Stop: the script is approved by a human (product + legal/compliance when money or promises are involved) before scene work.**
3. **Copy** — move the approved text into `productions/<slug>/copy.ts` (`STR = {en, pt, es}`, each with
   `vo: string[]` one entry per scene, plus every on-screen string, `cue` phrases, demo money values).
   Plain data, no imports — `scripts/gen-vo.mjs` imports it directly.
4. **Scenes** — `scenes.tsx` + `Film.tsx` + `index.tsx` built from `brand/` (`ui.tsx`, `Dashboard.tsx`, `vo.ts`).
   Register in `src/Root.tsx`. Assets go in `public/<slug>/`. Preview with `pnpm studio`.
5. **Voiceover** — `pnpm vo <slug> <lang>` per language, then `pnpm vo:check <slug> <lang>` (speech-to-text)
   and `pnpm vo:stats <slug> <lang>`. Fix a single line with `--line N`.
6. **Render** — `pnpm typecheck`, then `pnpm render <slug> [en pt es]` → `out/<slug>/<slug>-<lang>.mp4` at -16 LUFS.
7. **Publish** — never commit MP4s. Create a GitHub Release `<slug>-v<n>` with the finals and link it in the README.

## Writing rules (all languages)

- One idea per scene, one sentence per beat. Speak to the client as "you" (PT: "você"; ES: **usted**).
- Translate meaning, not words. Each language must sound native: PT-BR never European Portuguese;
  ES neutral Latin American (works for AR / CL / PY / MX), no vosotros, no Spain idioms.
- Use the product's own labels exactly as the dashboard shows them in that language (take them from
  `messages/<lang>.json`), so the client recognises the screen.
- Numbers: PT/ES `R$ 1.250,00`, EN `R$1,250.00`; USDT always written `USDT`. Say business-day terms the
  dashboard uses (PT "D+1 (próximo dia útil)", EN "next business day", ES "siguiente día hábil").
- English product or partner names inside PT/ES VO go in `SPEAK_AS` (TTS respelling) and `VO_CHECKS`
  (regex the transcript must match); the screen keeps the real spelling.
- End card: short brand line + logo. Links, support contacts and legal fine print go in the video
  description, not on screen (the video is not clickable).

## Compliance guardrails (non-negotiable)

- Nautt is a **technology platform, not a licensed financial institution**. Never say "banco", "bank account
  at Nautt", "Nautt guarantees", or promise returns. Custody and accounts sit with authorized partners.
- Card acquirers and other providers are generic: say "provider" / "parceiro" — never name the acquirer.
- Never promise fixed rates, dates or amounts that vary per account. Fees: "according to your fee table";
  FX: converted at the rate when the funds settle, so the credited amount may vary.
- No incident vocabulary ("hack", "breach", "leak", "incident") unless legal approved the exact wording.
- Every claim must be true in production today. If the code or panel does not do it, it is not in the video.

## Brand and motion

Follow the README "Brand rules": Sora only, light theme (`#f0f0f0` bg, `#fff` surfaces, brand `#48cc85`,
brand-dark `#1a453a`), radius 12/20/8, hairline borders, amber = pending, green = paid/ok, red rare.
Motion uses `ease` `cubic-bezier(0.4,0,0.2,1)`: 200 ms state, 300 ms surfaces, one 900 ms emphasis per key beat.
No neon, purple gradients, glassmorphism, spinning coins, bounce or confetti. Never recolor or box the logo.
Prefer UI mocks of the real dashboard over abstract illustrations. Use `useF()`/`ms()`/`p()` from
`brand/ui.tsx` and `useCue()` from `brand/vo.ts` so animations land on the spoken word.

## Remotion technique

- Every animation is driven by the frame (`useCurrentFrame`/`useF` + `interpolate`/`p`). CSS animations,
  transitions, `Math.random()` and timers do not render deterministically — never use them.
- Read fps from `useVideoConfig()` in new code; do not assume 30.
- If the official Remotion skills (`remotion-dev/skills`, router `remotion-best-practices`) are installed,
  use them for API details; this skill wins on Nautt rules (brand, copy, guardrails).
- Planned upgrades and their priority live in `docs/ROADMAP.md` — check it before refactoring `brand/` or scripts.

## Voices (ElevenLabs)

EN Alice `Xb7hH8MSUJpSbSDYk0k2` · PT-BR Roberta `RGymW84CSmfVugnA5tvA` · ES Tatiana `2rigMbVWLdqtBSCahJFX`.
Per-language defaults (speed, respellings such as USDT) live in `brand/voice.ts`; production `copy.ts` can override.
**For any PT-BR voiceover, also follow the `nautt-voice-ptbr` skill** (`.agents/skills/nautt-voice-ptbr/SKILL.md`): pace 1.2, one-word respellings, numbers written out, review loop.
The API key lives only in the gitignored `.env` (`ELEVENLABS_API_KEY`). Never print or commit it.

## Single-language productions

Default is `LANGS` from `brand/lang.ts` (en, pt, es). For a one-language video, register only that
composition in the production's `index.tsx` (e.g. `(['pt'] as const).map(...)`), skip the other `vo/` files,
and render with `pnpm render <slug> pt`. State the reason in the brief.

## Definition of done

- Brief + approved script in the production folder; `copy.ts` matches the approved script in every language.
- `pnpm typecheck` passes; every language renders; `vo:check` transcripts match the script.
- Finals on a GitHub Release, linked from the production README with durations and approval status.
