# credit-card-flow

Client explainer: how money from a card sale reaches the client and how to reconcile it —
one order, 90 % on D+1 + 10 % reserve on D+30, both at the rate locked on D+1. Script: [SCRIPT.md](SCRIPT.md).

## Origin

Slack thread C0B3R98AEUA / p1794317793276249 (2026-11-10). Walter (sales): clients "never manage to reconcile"
card sales; asked where they see the 10 % entering, at which rate, how much USDT, linked to the original order.
Marlon mapped today's journey; Gabriel suggested a video; Walter wants to send the video link to clients and show
it in an unmissable dashboard card (like the registration-update card, closes only on dismiss). Fish (Dener)
will rework the receivables screens.

## Brief

- **Audience:** Nautt clients already selling by credit card (BRL payment links).
- **Goal:** after watching, the client can reconcile any card sale: order → 90 % (D+1) + 10 % (D+30) = total,
  same rate, and knows where each piece shows up — so "não bate as contas" tickets go down.
- **Key messages:**
  1. One approved card sale = two receivables of the same order: 90 % principal + 10 % reserve, already net of the card fee.
  2. 90 % is released on the next business day; that is when BRL converts to USDT, and that rate is locked for the whole order.
  3. 10 % stays in reserve 30 days against chargebacks; released at the **same D+1 rate** — no new quote on day 30.
  4. Worked example closes the math.
  5. Where to track: Saldo em Cartão → Cartão de Crédito → Saldo a Receber (Pedido, Tranche, Valor, Status, Libera em), one e-mail per release, two USDT credits.
- **Flow to show:** day 0 split → D+1 conversion + lock → D+30 reserve release → example → dashboard screens.
- **Out of scope (possible separate video):** how to enable card, payment-link card settings (Absorb / Pass through, installments).
- **Languages:** EN / PT-BR / LatAm ES (clients outside Brazil also sell to Brazilian payers).
- **Format and length:** 16:9 master, ~90–105 s. 9:16 + 30 s cutdown after master approval.
- **Where it will be used:** unmissable dashboard card with the video (dismiss to close — separate panel task),
  link sent by sales/support, YouTube unlisted.
- **Sources of truth:**
  - Panel copy `nautt-painel-v2/messages/{pt,en,es}.json` → `CardPayments.*`, `CreatePaymentLink.creditCardStep.*`, `PaymentLinkDetails.infoTab.creditCardSettings.*`
  - Panel feature notes `nautt-painel-v2/src/feature/card-payments/README.md`
  - Public API docs `nautt-v2-docs/README.md` → Payment Links + Webhooks (card timeline)
  - Panel `Receivables.*` (drawer columns, tranche and status labels)
  - Request thread: Slack `C0B3R98AEUA` / `p1794317793276249` (read 2026-11-10)
- **Guardrails (this production):**
  - Never name the card acquirer; say "card" / "provider".
  - No real fee percentages or real rates on screen; the example is labelled illustrative.
  - D+1 = next business day after capture, not "tomorrow". The rate is set on D+1, not on the payment day.
  - Show only screens that exist today; rework fields are marked **[after rework]** in the script.
- **Open questions (block script approval):**
  1. ~~Ship v1 now or wait for Fish's rework?~~ Decided 2026-11-10: v1 now with today's screens; v2 after the rework.
  2. Confirm with backend: the 10 % USDT uses exactly the D+1 rate (thread says yes) and rounding per tranche.
  3. Confirm the D+1 and D+30 e-mails exist for every card order in prod (thread lists them; earlier `order.paid` notify gap — see api#336).
  4. Sign-off: Walter (sales voice), product, legal/compliance for the chargeback wording.

## Durations (VO)

EN ≈ 1:53 · PT ≈ 2:02 · ES ≈ 2:14 (VO only; film adds ~10 s of breaths and the logo hold)

## Status

- [x] Brief drafted (2026-11-10)
- [x] Brief aligned with Slack thread (script v1, 2026-11-10)
- [x] v1 build approved by Marlon (today's screens, not waiting for the rework)
- [ ] Script reviewed by Walter + product + compliance
- [x] Copy + scenes built (`copy.ts`, `scenes.tsx`, `Film.tsx`)
- [x] VO generated and checked (en / pt / es) — PT line 6 regenerated (TTS added a filler "né")
- [ ] Rendered, reviewed
- [ ] Released (`credit-card-flow-v1`)
