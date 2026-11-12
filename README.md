# nautt-motion

Motion videos for Nautt Finance, built with [Remotion](https://www.remotion.dev/) (React → MP4).
One folder per production, one shared brand layer, voiceover in EN / PT-BR / LatAm ES via ElevenLabs.

## Layout

```
brand/                      shared by every production
  ui.tsx                    Nautt DS tokens (colors, radius, easing), Chip, Line, Split, Icon, Logo, Money…
  Dashboard.tsx             mock of the Nautt dashboard (balance card, withdraw/deposit, status chips)
  font.ts                   Sora (400 / 500 / 600)
  lang.ts                   Lang = en | pt | es, LangCtx / useLang
  vo.ts                     VoCtx + useCue(): sync on-screen cues to the exact word in the voiceover
productions/<slug>/
  README.md                 brief, decisions, status, approvals
  copy.ts                   every on-screen string + VO line per language (plain data)
  scenes.tsx / Film.tsx     the film
  index.tsx                 registers <slug>-en / -pt / -es compositions in a <Folder>
  vo/<lang>.json            generated: VO durations + per-character timestamps
public/
  brand/                    logos, USDT mark (copied from nautt-painel-v2/public)
  <slug>/vo/<lang>/*.mp3    generated voiceover clips
scripts/                    gen-vo, check-vo, vo-stats, render (all take the production slug)
src/Root.tsx                registers every production
```

## Setup (team install)

Prereqs: **Node 22.6+**, **pnpm**, **ffmpeg** + **ffprobe** on PATH, and an ElevenLabs API key
(shared privately — never commit `.env`).

```bash
git clone https://github.com/NauttFinance/nautt-motion.git
cd nautt-motion
pnpm install
cp .env.example .env   # paste ELEVENLABS_API_KEY
pnpm studio            # http://localhost:3000 — every production in the browser
```

Smoke check after install:

```bash
pnpm typecheck
pnpm exec remotion compositions src/index.ts   # lists onboarding / web3auth / credit-card × langs
```

Agent skills ship in-repo (see `AGENTS.md`): Nautt rules + Remotion best-practices under
`.agents/skills/`, with Claude/Cursor symlinks in `.claude/skills/` and `.cursor/skills/`.

## Workflow

```bash
pnpm vo <slug> pt                          # generate PT voiceover (also en / es)
pnpm vo <slug> es --line 5 --stability 0.75 --style 0 --boost   # redo one line, matching tone
pnpm vo:stats <slug> es                    # chars/sec + loudness per line, to spot tone drift
pnpm vo:check <slug> pt                    # speech-to-text transcript of every line
pnpm render <slug>                         # out/<slug>/<slug>-{en,pt,es}.mp4, normalized to -16 LUFS
pnpm typecheck
```

Scenes stretch to fit each VO line, so after regenerating audio just render again.

## Adding a production

1. Create `productions/<yyyy-mm-or-plain-slug>/` with a `README.md` brief (see `credit-card-flow/`).
2. Write `copy.ts` (copy `web3auth-maintenance/copy.ts` as a starting point: `STR = {en, pt, es}`, each with `vo: [...]` lines).
3. Build `scenes.tsx`, `Film.tsx` and `index.tsx` from `brand/` components; put assets under `public/<slug>/`.
4. Register it in `src/Root.tsx`.
5. `pnpm vo <slug> en|pt|es`, then `pnpm render <slug>`.

## Brand rules (Nautt design system)

- Sora only. Light theme: background `#f0f0f0`, surfaces `#fff`, brand `#48cc85`, brand-dark `#1a453a`.
- Radius 12 (controls) / 20 (cards) / 8 (items), pill chips; flat + hairline borders, shadow-xs only.
- Status: amber = pending/maintenance, brand green = protected/paid/ok, red only sparingly.
- Motion: 200ms state, 300ms surfaces, 240ms masks, one 900ms emphasis sweep per key beat; `cubic-bezier(0.4, 0, 0.2, 1)`.
- No neon, purple gradients, glassmorphism, spinning coins, bounce or confetti. Never recolor or box the logo.

## Voices

| Lang | Voice | Notes |
|------|-------|-------|
| EN | Alice (`Xb7hH8MSUJpSbSDYk0k2`) | clear, calm narration |
| PT-BR | Roberta (`RGymW84CSmfVugnA5tvA`) | native Brazilian; PT must never sound like Portugal |
| ES | Tatiana (`2rigMbVWLdqtBSCahJFX`) | neutral Latin American, *usted*; works for AR / CL / PY |

Shared defaults (PT speed 1.2, USDT → "uéssedetê") live in `brand/voice.ts`; PT-BR voice rules: `.agents/skills/nautt-voice-ptbr/SKILL.md`.

English names inside PT/ES lines (e.g. Web3Auth) go in the production's `SPEAK_AS` + `VO_CHECKS`:
the generator respells them for the TTS only and re-transcribes each take until they sound right.

## Publishing finals

Rendered MP4s are not committed. Attach them to a GitHub Release per production version
(e.g. tag `web3auth-maintenance-v1`) and link that release in the production README.

## License note

Remotion is free for individuals and companies of up to 3 people; beyond that a
[Remotion Company License](https://www.remotion.pro/license) is required.
