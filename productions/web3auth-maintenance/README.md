# web3auth-maintenance

Customer explainer for the Web3Auth partner maintenance (Nov 2026). 16:9, EN / PT-BR / LatAm ES.
Used as an unlisted YouTube video and in the dashboard modal.

## Story (6 scenes)

| # | Scene | Message |
|---|-------|---------|
| 0 | Hook | Web3Auth, one of our partners, is under maintenance. Nautt explains. |
| 1 | What happened | Wallet infrastructure partner put its service into maintenance and paused operations. |
| 2 | How Nautt protects you | 3-layer wallet: Nautt key + your password + Web3Auth. No single provider can rebuild it. |
| 3 | What this means for you | Usual (wallet-signed) withdrawal path on hold; balance stays in place; deposits tracked. |
| 4 | When can I withdraw? | Right now: request in the dashboard, Nautt pays from its own funds; when Web3Auth is back we settle, adjust the routes, service available again. |
| 5 | Close | "Nautt is on it." then the logo. |

## Copy guardrails (decided with the team)

- Never say "incident", "security incident", "hacked", "breach", "drain" or "leaked". Frame it as **partner maintenance / paused operations**.
- No restoration date. Never imply Nautt can move client wallet funds while Web3Auth is down.
- Must not sound like the service stays down after Web3Auth returns: say routes are adjusted and service is available again.
- Support and status details live only in the YouTube description, not on screen (the video is not clickable).
- "Web3Auth" is always pronounced in American English (see `SPEAK_AS` / `VO_CHECKS` in `copy.ts`).

## Durations (current VO)

EN ≈ 1:43 · PT ≈ 1:49 · ES ≈ 2:01

## Status

- Reviewed internally (Cari, Evan); CTO review of the YouTube texts pending.
- Pending: legal/finance sign-off on "Right now" (backup withdrawal path live for all clients) and the "Protected" chip.
- Not done: ambient music bed, 9:16 version, 30s cutdown, captions (.srt).

## Release

Finals: [GitHub Release `web3auth-maintenance-v1`](https://github.com/NauttFinance/nautt-motion/releases/tag/web3auth-maintenance-v1) (PT / ES / EN MP4s).
