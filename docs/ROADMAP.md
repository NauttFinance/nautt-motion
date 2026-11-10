# nautt-motion — improvement roadmap

Research of 2026-11-10 (Remotion docs, remotion-dev/skills, npm). Nothing here is applied yet.
Priority: P0 = do before the next production ships, P1 = next sprint, P2 = when needed.

| # | Prio | What | Why | Where / how | Effort |
|---|------|------|-----|-------------|--------|
| 1 | P0 | Remotion Company License | Free tier only covers orgs ≤ 3 people; "Creators" seat is per person writing Remotion code (agents included) | remotion.pro → `--license-key` in render | decision (CTO) |
| 2 | P0 | Read fps from `useVideoConfig()` | `brand/vo.ts` (`starts[idx] * 30`) and `brand/ui.tsx` (`FPS = 30`) hardcode 30 fps; a 25/60 fps variant silently desyncs cues | `brand/vo.ts`, `brand/ui.tsx` | 15 min |
| 3 | P0 | Upgrade 4.0.300 → latest 4.0.x (4.0.542 on 2026-11-09) | bug fixes, `@remotion/media`, newer APIs; same major | `pnpm exec remotion upgrade`, keep exact pins, typecheck + render 3 langs | 1 h |
| 4 | P0 | Install official Remotion agent skills | `remotion-best-practices` router + markup rules (voiceover, calculate-metadata, transitions, measuring-text) for every AI runtime | `npx skills add remotion-dev/skills` (verify install path) | 10 min |
| 5 | P1 | `<Audio>` from `@remotion/media` | recommended component; core `<Audio>` is now `<Html5Audio>` | `npx remotion add @remotion/media`, `Film.tsx` | 30 min |
| 6 | P1 | Duration via `calculateMetadata` | per-language duration + scene starts from VO in one place; `defaultOutName` `<slug>-<lang>` | each production `index.tsx` / `Film.tsx` | 2–3 h |
| 7 | P1 | `<TransitionSeries>` + `fade()` / `linearTiming` | replaces hand-rolled `starts[]` + `SceneFade` | `Film.tsx` | 2 h |
| 8 | P1 | SRT captions per language | accessibility + YouTube; timestamps already in `vo/<lang>.json` | `@remotion/captions` `serializeSrt()` → `out/<slug>/<slug>-<lang>.srt`, attach to Release | 2 h |
| 9 | P1 | `scripts/render.mjs` (bundle once, `selectComposition` + `renderMedia` per lang) | avoids rebundling 3×; keep ffmpeg loudnorm step | replaces `scripts/render.sh` | 2 h |
| 10 | P1 | Render flags | finals `--crf=18`; drafts `--hardware-acceleration=if-possible --video-bitrate=8M --scale=0.5` (HW accel incompatible with `--crf`) | `render` / `render:draft` scripts | 30 min |
| 11 | P1 | ESLint `@remotion/eslint-plugin` | catches non-deterministic animation (CSS animations, `Math.random`) | `eslint.config.mjs` + `lint` script | 30 min |
| 12 | P1 | Preview stills per language | review copy without full render | `remotion still <id> --frame=N` script | 1 h |
| 13 | P1 | 9:16 / 1:1 formats | social cutdowns; dashboard mock is wide → needs responsive `format` prop, not crop | `<slug>-<lang>-<format>` compositions | 1–2 days |
| 14 | P2 | `fitText` (`@remotion/layout-utils`) | long PT/ES headings overflow | after `waitUntilDone()` of Sora | 1 h |
| 15 | P2 | CI on PR | typecheck, lint, `remotion compositions`, one still per composition (no ElevenLabs key needed) | `.github/workflows/ci.yml` | 2–3 h |
| 16 | P2 | `engines.node >= 22.6` | scripts import `copy.ts` natively | `package.json` | 5 min |

Lambda rendering: not worth it (60–120 s videos, 3 languages, local is enough).

Not verified: install path of `npx skills add`; React 19 support in 4.0.542 (stay on 18); Remotion 5 timeline.

Sources: remotion.dev/docs/upgrading · /docs/media/audio · /docs/calculate-metadata · /docs/transitions/transitionseries ·
/docs/captions/serialize-srt · /docs/hardware-acceleration · /docs/eslint-plugin · /docs/ai/skills · github.com/remotion-dev/skills ·
github.com/remotion-dev/remotion/blob/main/LICENSE.md · /docs/license/faq
