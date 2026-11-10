# credit-card-flow — script v1 (built as v1 with today's screens, 2026-11-10; awaiting team review)

Rewritten after the Slack thread (C0B3R98AEUA, 2026-11-10, Walter / Marlon / Gabriel / Fish): clients "never manage
to reconcile" card sales, especially the 10 % reserve released after 30 days. The video's job is to make the
math obvious: **order → 90 % (D+1) + 10 % (D+30) = total, all at the same rate, locked on D+1.**

PT-BR is the master. EN and ES are adaptations. Dashboard labels are quoted exactly as each language shows them
(`nautt-painel-v2/messages/<lang>.json` → `CardPayments.*`, `Receivables.*`).
Estimated VO: EN ~90 s · PT ~100 s · ES ~105 s.

Only screens that exist **today** are shown. Items the planned rework adds (effective release date, rate and USDT
per tranche, reserve ↔ order link in the statement) are marked **[after rework]** and stay out of v1 unless the
rework ships first.

## Scenes

| # | Scene | Goal | On screen | Visual |
|---|-------|------|-----------|--------|
| 0 | Hook | Name the pain | "Vendeu no cartão?" → "Quando o dinheiro chega — e como bater as contas." | Card sale chip → USDT balance with a "?" |
| 1 | Day 0 — sale approved | One sale becomes two receivables | Pedido #… · "90% (Principal)" · "10% (Reserva)" · "valor líquido (já sem a taxa do cartão)" | Sale amount splits into two blocks; e-mail chip "datas previstas" |
| 2 | D+1 — principal | 90 % + **the rate is locked here** | "D+1 (próximo dia útil)" · BRL → USDT · lock icon "cotação definida" | 90 % block converts to USDT and drops into balance; rate pill locks |
| 3 | D+30 — reserve | 10 % uses the **same rate**, no new quote; chargeback logic | "10% retido por 30 dias" · "mesma cotação do D+1" · status "Liberado" / "Chargeback" | 30-day timeline; reserve block converts with the same locked pill |
| 4 | Worked example | Close the math | R$ 1.000,00 líquido · cotação de exemplo R$ 5,40 · 166,67 + 18,52 = 185,19 USDT | Equation builds line by line, total highlights green. Footer: "valores ilustrativos" |
| 5 | Where to track | Map the screens | Home "Saldo em Cartão" → Cartão de Crédito → "Saldo a Receber": Pedido · Tranche · Valor · Status · Libera em · e-mail por liberação · 2 créditos no saldo USDT | Dashboard mock; highlight sweeps each column; two balance credits tagged 90 % / 10 % |
| 6 | Close | Brand | "Mesmo pedido. Mesma cotação. Duas liberações." → logo | Logo |

## VO — PT-BR (master)

0. Vendeu no cartão de crédito pela Nautt? Veja quando o dinheiro chega na sua conta e como bater as contas de cada venda.
1. Quando o cartão do seu cliente é aprovado, aquela venda vira dois recebíveis do mesmo pedido: noventa por cento, o principal, e dez por cento, a reserva. Os valores já são líquidos, com a taxa do cartão descontada. Você recebe um e-mail com as datas previstas das duas liberações.
2. No próximo dia útil, os noventa por cento são liberados. É nesse momento que o valor em reais é convertido para USDT e cai no seu saldo. E atenção: a cotação usada aqui fica definida para o pedido inteiro.
3. Os dez por cento ficam em reserva por trinta dias, como proteção contra contestações no cartão. Sem contestação, a reserva é liberada automaticamente, com a mesma cotação do primeiro dia útil. Não existe uma nova cotação no dia trinta. Se houver uma contestação, o valor pode ser descontado dessa reserva.
4. Vamos a um exemplo. Uma venda com mil reais líquidos e uma cotação de exemplo de cinco reais e quarenta. No primeiro dia útil, novecentos reais viram cento e sessenta e seis vírgula sessenta e sete USDT. No dia trinta, cem reais viram dezoito vírgula cinquenta e dois USDT. Somando, cento e oitenta e cinco vírgula dezenove USDT: o mesmo valor que a venda inteira daria na mesma cotação.
5. Para acompanhar, abra Cartão de Crédito no painel. Em Saldo a Receber, cada linha mostra o pedido, a tranche, noventa ou dez por cento, o valor, o status e a data de liberação. A cada liberação, você também recebe um e-mail com o número do pedido. E no seu saldo em USDT, cada venda aparece em dois créditos: um no primeiro dia útil e outro depois de trinta dias.
6. Mesmo pedido, mesma cotação, duas liberações. Nautt.

## VO — EN

0. Sold by credit card with Nautt? Here's when the money reaches your account, and how to reconcile every sale.
1. When your customer's card is approved, that sale becomes two receivables from the same order: ninety percent, the principal, and ten percent, the reserve. Amounts are already net of the card fee. You get an email with the expected date of each release.
2. On the next business day, the ninety percent is released. That's when the amount in reais is converted to USDT and lands in your balance. And note: the rate used here is locked for the whole order.
3. The ten percent stays in reserve for thirty days, to cover card chargebacks. With no chargeback, the reserve is released automatically, at the same rate as the first business day. There is no new rate on day thirty. If a chargeback happens, it may be deducted from this reserve.
4. Let's take an example: a sale of one thousand reais net, with an example rate of five forty. On the first business day, nine hundred reais become one hundred sixty-six point six seven USDT. On day thirty, one hundred reais become eighteen point five two USDT. Together, one hundred eighty-five point one nine USDT: exactly what the whole sale is worth at that same rate.
5. To track it, open Credit Card in your dashboard. Under Receivables, each line shows the order, the tranche, ninety or ten percent, the amount, the status and the release date. Every release also sends you an email with the order number. And in your USDT balance, each sale shows up as two credits: one on the first business day, and one after thirty days.
6. Same order, same rate, two releases. Nautt.

## VO — ES (LatAm, usted)

0. ¿Vendió con tarjeta de crédito a través de Nautt? Vea cuándo llega el dinero a su cuenta y cómo cuadrar cada venta.
1. Cuando se aprueba la tarjeta de su cliente, esa venta se convierte en dos cuentas por cobrar del mismo pedido: el noventa por ciento, el principal, y el diez por ciento, la reserva. Los montos ya son netos, con la comisión de la tarjeta descontada. Usted recibe un correo con las fechas previstas de las dos liberaciones.
2. El siguiente día hábil se libera el noventa por ciento. En ese momento, el monto en reales se convierte a USDT y llega a su saldo. Y atención: la cotización que se usa aquí queda fijada para todo el pedido.
3. El diez por ciento queda en reserva por treinta días, como protección contra contracargos. Si no hay contracargo, la reserva se libera automáticamente, con la misma cotización del primer día hábil. No hay una nueva cotización el día treinta. Si hay un contracargo, el monto puede descontarse de esta reserva.
4. Veamos un ejemplo: una venta de mil reales netos, con una cotización de ejemplo de cinco con cuarenta. El primer día hábil, novecientos reales se convierten en ciento sesenta y seis coma sesenta y siete USDT. El día treinta, cien reales se convierten en dieciocho coma cincuenta y dos USDT. En total, ciento ochenta y cinco coma diecinueve USDT: lo mismo que vale la venta completa con esa misma cotización.
5. Para seguirlo, abra Tarjeta de Crédito en su panel. En Saldo por Cobrar, cada línea muestra el pedido, el tramo, noventa o diez por ciento, el monto, el estado y la fecha de liberación. Con cada liberación también recibe un correo con el número del pedido. Y en su saldo en USDT, cada venta aparece en dos créditos: uno el primer día hábil y otro después de treinta días.
6. Mismo pedido, misma cotización, dos liberaciones. Nautt.

## Worked example (check before render)

| | BRL net | Rate (example) | USDT |
|---|---|---|---|
| 90 % · D+1 | 900,00 | 5,40 | 166,67 |
| 10 % · D+30 | 100,00 | 5,40 | 18,52 |
| Total | 1.000,00 | 5,40 | 185,19 |

1000 / 5,40 = 185,185… → 185,19 ✓ (rounding per tranche matches the total here; pick numbers that keep it that way).

## [after rework] — line 5 variant

If Fish's rework ships first (per release: effective date/time, tranche, net BRL, rate used, USDT credited,
`receivable_uuid` ↔ `order_uuid`, "view original order" link, statement line "Liberação reserva 10% — pedido XYZ"),
replace line 5 with: "…each release shows the date it was credited, the rate used and the USDT added, linked
to the original order." and show those fields in scene 5.

## TTS notes (for copy.ts)

- `USDT` → `SPEAK_AS` PT/ES "U S D T"; `VO_CHECKS` regex `u\.?\s?s\.?\s?d\.?\s?t`.
- Numbers are written out in the VO lines above on purpose (TTS reads "166,67" inconsistently).
- "D+1" is never read aloud: "próximo dia útil" / "next business day" / "siguiente día hábil".

## Description (YouTube / dashboard card, not on screen)

- Fees per installment: dashboard → Credit Card → fee table.
- Integrators: card is only available via the hosted payment-link checkout; `order.processing` = card captured,
  `order.completed` = USDT sent (a second `order.completed` comes for the 10 % with `display_amount`).
- Support: WhatsApp from the Credit Card page.
