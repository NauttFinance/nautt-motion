import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Dashboard, usePush} from '../../brand/Dashboard';
import {useLang} from '../../brand/lang';
import {useCue} from '../../brand/vo';
import {STR, type Strings} from './copy';

const useT = () => STR[useLang()];
const dashLabels = (t: Strings) => ({
  ...t.dash,
  maintenance: t.maintenance,
  balance: t.money.balance,
  depositAmount: t.money.deposit,
});
import {
  C,
  Chip,
  Eyebrow,
  Icon,
  Line,
  Logo,
  Money,
  Skel,
  Split,
  StatusChip,
  card,
  mix,
  ms,
  p,
  pulse,
  soft,
  useF,
} from '../../brand/ui';

/** Fade a whole scene in/out (240ms soft crossfade). */
export const SceneFade: React.FC<{dur: number; children: React.ReactNode; bg?: string}> = ({dur, children, bg}) => {
  const f = useCurrentFrame();
  const o = Math.min(p(f, 0, ms(240)), 1 - p(f, dur - ms(240), ms(240)));
  return <AbsoluteFill style={{opacity: o, background: bg}}>{children}</AbsoluteFill>;
};

// ───────────────────────── 1 · Hook (6s)

export const Hook: React.FC = () => {
  const f = useF();
  const t = useT();
  const partnerT = p(f, 60, ms(200));
  const push = usePush(60, 120);
  return (
    <Split
      text={
        <>
          <Eyebrow at={4}>{t.hook.eyebrow}</Eyebrow>
          <Line at={8} dimAt={75}>
            {t.hook.l1}
          </Line>
          <Line at={75} mt={18}>
            {t.hook.l2}
          </Line>
        </>
      }
    >
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{transform: `scale(${push})`, transformOrigin: '88% 8%'}}>
          <Dashboard labels={dashLabels(t)} enterAt={0} partnerT={partnerT} />
        </div>
      </AbsoluteFill>
    </Split>
  );
};

// ───────────────────────── 2 · What happened (12.5s)

const HUB = {x: 510, y: 540, rx: 380, ry: 330};
const TILE_W = 132;
const TILE_H = 96;
const TILES = Array.from({length: 8}, (_, i) => {
  const a = Math.PI + (i * Math.PI * 2) / 8; // tile 0 = Nautt, on the left
  return {x: HUB.x + HUB.rx * Math.cos(a), y: HUB.y + HUB.ry * Math.sin(a)};
});

export const Ecosystem: React.FC = () => {
  const f = useF();
  const t = useT();
  const zoom = mix(1.8, 1, p(f, 0, 20, soft));
  const maint = p(f, 175, ms(200));
  const pul = maint > 0.5 ? pulse(f) : 0;

  return (
    <Split
      text={
        <>
          <Eyebrow at={4}>{t.eco.eyebrow}</Eyebrow>
          <Line at={10} dimAt={160}>
            {t.eco.l1}
          </Line>
          <Line at={40} size={28} weight={400} color={C.body} mt={18} dimAt={160}>
            {t.eco.sub}
          </Line>
          <Line at={160} mt={36}>
            {t.eco.l2}
          </Line>
          <Line at={172} color={C.body}>
            {t.eco.l3}
          </Line>
        </>
      }
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${zoom})`,
          transformOrigin: `${TILES[0].x}px ${HUB.y}px`,
        }}
      >
        <svg width={1100} height={1080} style={{position: 'absolute', inset: 0}}>
          {TILES.map((t, i) => {
            const len = Math.hypot(t.x - HUB.x, t.y - HUB.y);
            const draw = p(f, 14 + i * 3, ms(240));
            const wave = p(f, 175 + i * 3, 6);
            return (
              <g key={i}>
                <line
                  x1={HUB.x}
                  y1={HUB.y}
                  x2={t.x}
                  y2={t.y}
                  stroke="#cfcfcf"
                  strokeWidth={2}
                  strokeDasharray={len}
                  strokeDashoffset={len * (1 - draw)}
                  opacity={1 - wave}
                />
                <line
                  x1={HUB.x}
                  y1={HUB.y}
                  x2={t.x}
                  y2={t.y}
                  stroke="#d9a441"
                  strokeWidth={2}
                  strokeDasharray="8 10"
                  opacity={0.55 * wave}
                />
              </g>
            );
          })}
        </svg>

        {TILES.map((t, i) => {
          const o = i === 0 ? 1 : p(f, 10 + i * 3, ms(300));
          return (
            <div
              key={i}
              style={{
                ...card({
                  position: 'absolute',
                  left: t.x - TILE_W / 2,
                  top: t.y - TILE_H / 2,
                  width: TILE_W,
                  height: TILE_H,
                  padding: 16,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: 10,
                  alignItems: i === 0 ? 'center' : 'flex-start',
                }),
                opacity: o * (maint > 0 ? mix(1, 0.85, maint) : 1),
                transform: `scale(${mix(0.94, 1, o)})`,
                border: i === 0 ? `1.5px solid ${C.brand}` : `1px solid ${C.border}`,
              }}
            >
              {i === 0 ? (
                <>
                  <Logo file="isotipo.svg" height={30} />
                  <span style={{fontSize: 15, fontWeight: 500, color: C.brandDark}}>Nautt</span>
                </>
              ) : (
                <>
                  <div style={{width: 26, height: 26, borderRadius: 8, background: C.raised}} />
                  <Skel w={80} h={10} />
                  <Skel w={56} h={10} o={0.7} />
                </>
              )}
            </div>
          );
        })}

        {/* partner node */}
        <div
          style={{
            ...card({
              position: 'absolute',
              left: HUB.x - 130,
              top: HUB.y - 62,
              width: 260,
              height: 124,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
            }),
            opacity: p(f, 6, ms(300)),
            border: maint > 0.5 ? '1.5px solid #f5c56b' : `1px solid ${C.border}`,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 26, fontWeight: 500, color: C.heading}}>
            <Icon name="node" size={26} color={C.body} />
            Web3Auth
          </div>
          <StatusChip
            t={maint}
            from={{tone: 'neutral', label: t.eco.partner}}
            to={{tone: 'amber', label: t.maintenance}}
            size={17}
            dim={pul}
          />
        </div>
      </div>
    </Split>
  );
};

// ───────────────────────── 3 · Three layers (18s) — hero

const VAULT = {x: 190, y: 250, w: 640, h: 560};
const PLATES = [
  {label: 'Nautt key', sub: 'Held by Nautt', icon: 'key' as const, at: 188, from: {x: -520, y: 0}},
  {label: 'Your password', sub: 'Only you know it', icon: 'lock' as const, at: 218, from: {x: 0, y: 420}},
  {label: 'Web3Auth', sub: 'Login partner', icon: 'node' as const, at: 248, from: {x: 520, y: 0}},
];

export const Layers: React.FC = () => {
  const f = useF();
  const t = useT();
  const lockAt = 278;
  const proofAt = 322;
  const backAt = 398;

  const lock = p(f, lockAt, ms(200));
  const sweep = interpolate(f, [lockAt, lockAt + ms(900)], [-0.4, 1.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const proof = p(f, proofAt, ms(300)) * (1 - p(f, backAt, ms(300)));
  const solid = lock * (1 - proof);

  return (
    <Split
      text={
        <>
          <Eyebrow at={4}>{t.layers.eyebrow}</Eyebrow>
          <Line at={8}>{t.layers.title}</Line>
          <div style={{marginTop: 36, display: 'flex', flexDirection: 'column', gap: 14}}>
            {PLATES.map((pl, i) => (
              <Line key={t.layers.plates[i].label} at={pl.at} size={34} weight={500} color={C.fg}>
                <span style={{color: C.brand, fontWeight: 600, marginRight: 16, fontVariantNumeric: 'tabular-nums'}}>{i + 1}</span>
                {t.layers.plates[i].label}
              </Line>
            ))}
          </div>
          <Line at={lockAt} size={34} color={C.brandDark} mt={36} dimAt={proofAt}>
            {t.layers.required}
          </Line>
          <Line at={proofAt} size={34} color={C.heading} mt={10} dimAt={backAt + 40}>
            {t.layers.alone}
          </Line>
          <Line at={backAt + 40} size={34} color={C.brandDark} mt={10}>
            {t.layers.purpose}
          </Line>
        </>
      }
    >
      {/* vault */}
      <div
        style={{
          position: 'absolute',
          left: VAULT.x,
          top: VAULT.y,
          width: VAULT.w,
          height: VAULT.h,
          borderRadius: 20,
          overflow: 'hidden',
          opacity: p(f, 20, ms(300)),
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 20,
            border: '2px dashed #cfcfcf',
            opacity: 1 - solid,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 20,
            border: `2px solid ${C.brandDark}`,
            background: C.surface,
            opacity: solid,
          }}
        />
        {/* emphasis sweep, once */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '45%',
            left: `${sweep * 100}%`,
            transform: 'translateX(-50%)',
            background: 'linear-gradient(90deg, rgba(72,204,133,0) 0%, rgba(72,204,133,0.28) 50%, rgba(72,204,133,0) 100%)',
            opacity: f >= lockAt && f <= lockAt + ms(900) ? 1 : 0,
          }}
        />
        {/* header */}
        <div
          style={{
            position: 'absolute',
            left: 32,
            top: 26,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 24,
            fontWeight: 500,
            color: C.brandDark,
            opacity: mix(0.25, 1, solid),
          }}
        >
          <Icon name="wallet" size={28} color={C.brandDark} />
          {t.layers.wallet}
        </div>
      </div>

      {/* plates */}
      {PLATES.map((pl, i) => {
        const enter = p(f, pl.at, 12);
        const dimmed = i < 2 ? proof : 0;
        const snap = mix(8, 0, lock); // 8px stagger, flush on lock
        const x = VAULT.x + 50 + (i - 1) * snap + pl.from.x * (1 - enter) - 70 * dimmed;
        const y = VAULT.y + 100 + i * 140 + pl.from.y * (1 - enter);
        const dark = i === 0;
        return (
          <div
            key={t.layers.plates[i].label}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: VAULT.w - 100,
              height: 112,
              borderRadius: 20,
              background: dark ? C.brandDark : C.surface,
              border: dark ? 'none' : i === 1 ? `1.5px solid ${C.brand}` : `1px solid ${C.border}`,
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              padding: '0 28px',
              opacity: enter * (1 - 0.75 * dimmed),
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                background: dark ? 'rgba(255,255,255,0.1)' : i === 1 ? 'rgba(72,204,133,0.14)' : C.raised,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name={pl.icon} size={30} color={dark ? '#fff' : i === 1 ? C.brandDark : C.fg} />
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 4, flex: 1}}>
              <span style={{fontSize: 28, fontWeight: 500, color: dark ? '#fff' : C.heading}}>{t.layers.plates[i].label}</span>
              <span style={{fontSize: 18, color: dark ? 'rgba(255,255,255,0.7)' : C.body}}>{t.layers.plates[i].sub}</span>
            </div>
            {i === 2 && <Chip tone="amber" label={t.maintenance} size={16} />}
          </div>
        );
      })}

      {/* chips under the vault */}
      <div
        style={{
          position: 'absolute',
          left: VAULT.x,
          width: VAULT.w,
          top: VAULT.y + VAULT.h + 28,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div style={{position: 'relative', height: 44}}>
          <div style={{opacity: lock * (1 - proof), clipPath: `inset(0 ${100 - lock * 100}% 0 0)`}}>
            <Chip tone="brand" label={t.layers.protected} size={20} icon={<Icon name="lock" size={20} color={C.brandDark} />} />
          </div>
          <div style={{position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', opacity: proof}}>
            <Chip tone="neutral" label={t.layers.notEnough} size={20} />
          </div>
        </div>
      </div>
    </Split>
  );
};

// ───────────────────────── 4 · What this means for you (synced to VO 4)

export const Impact: React.FC = () => {
  const f = useF();
  const t = useT();
  const cue = useCue();
  const paused = cue(3, t.cue.impactPaused);
  const balance = cue(3, t.cue.impactBalance);
  const deposits = cue(3, t.cue.impactDeposits);
  return (
    <Split
      text={
        <>
          <Eyebrow at={4}>{t.impact.eyebrow}</Eyebrow>
          <Line at={paused} dimAt={balance}>
            {t.impact.l1}
          </Line>
          <Line at={balance} mt={28} color={C.brandDark} dimAt={deposits}>
            {t.impact.l2}
          </Line>
          <Line at={deposits} mt={28} size={34} color={C.fg}>
            {t.impact.l3}
          </Line>
        </>
      }
    >
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <Dashboard
          labels={dashLabels(t)}
          partnerT={1}
          bannerT={p(f, 20, ms(300))}
          pausedT={p(f, paused, ms(200))}
          protectedT={p(f, balance, ms(240) + 6, soft)}
          depositT={p(f, deposits, ms(300))}
        />
      </AbsoluteFill>
    </Split>
  );
};

// ───────────────────────── 5 · When can I withdraw? (synced to VO 5)

const ROW_Y = 420;
const COL = [170, 500, 830]; // centers within right stage
const NODE_W = 260;

const FlowCard: React.FC<{x: number; y: number; o: number; dark?: boolean; children: React.ReactNode; w?: number}> = ({
  x,
  y,
  o,
  dark,
  children,
  w = NODE_W,
}) => (
  <div
    style={{
      ...card({
        position: 'absolute',
        left: x - w / 2,
        top: y - 90,
        width: w,
        height: 180,
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }),
      background: dark ? C.brandDark : C.surface,
      border: dark ? 'none' : `1px solid ${C.border}`,
      opacity: o,
      transform: `translateY(${(1 - o) * 12}px)`,
    }}
  >
    {children}
  </div>
);

export const Continuity: React.FC = () => {
  const f = useF();
  const t = useT();
  const cue = useCue();
  const ask = cue(4, t.cue.ask);
  const now = cue(4, t.cue.now);
  const request = cue(4, t.cue.request);
  const pays = cue(4, t.cue.pays);
  const balance = cue(4, t.cue.amount);
  const later = cue(4, t.cue.later);
  const back = cue(4, t.cue.back);
  const settle = cue(4, t.cue.settle);
  const routes = cue(4, t.cue.routes);
  const nothing = cue(4, t.cue.nothing);

  const reqO = p(f, request, ms(300));
  const liqO = p(f, pays, ms(300));
  const recO = p(f, pays + 10, ms(300));
  const leg1 = p(f, pays + 14, 27);
  const leg2 = p(f, pays + 41, 27);
  const paid = p(f, pays + 70, ms(200));
  const debitO = p(f, balance, ms(300));
  const partnerO = p(f, later, ms(300));
  const online = p(f, back, ms(200));
  const settled = p(f, settle, ms(200));
  const availableT = p(f, routes, ms(240) + 6, soft);

  const e1 = COL[0] + NODE_W / 2;
  const s2 = COL[1] - NODE_W / 2;
  const e2 = COL[1] + NODE_W / 2;
  const s3 = COL[2] - NODE_W / 2;
  const dotX = leg2 > 0 ? mix(e2, s3, leg2) : mix(e1, s2, leg1);
  const dotOn = (leg1 > 0 && leg1 < 1) || (leg2 > 0 && leg2 < 1);
  const lowY = ROW_Y + 260;

  return (
    <Split
      text={
        <>
          <Eyebrow at={4}>{t.cont.eyebrow}</Eyebrow>
          <Line at={ask} dimAt={request}>
            {t.cont.ask}
          </Line>
          <Line at={now} size={88} weight={600} color={C.brandDark} mt={8}>
            {t.cont.now}
          </Line>
          <div style={{marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12}}>
            <Line at={request} size={30} weight={400} color={C.fg} dimAt={later}>
              {t.cont.request}
            </Line>
            <Line at={pays} size={30} weight={400} color={C.fg} dimAt={later}>
              {t.cont.pays}
            </Line>
            <Line at={later} size={30} weight={400} color={C.fg} dimAt={nothing}>
              {t.cont.later}
            </Line>
            <Line at={routes} size={30} weight={500} color={C.brandDark} dimAt={nothing}>
              {t.cont.routes}
            </Line>
            <Line at={nothing} size={30} weight={500} color={C.brandDark}>
              {t.cont.nothing}
            </Line>
          </div>
        </>
      }
    >
      <svg width={1100} height={1080} style={{position: 'absolute', inset: 0}}>
        <line x1={e1} y1={ROW_Y} x2={s2} y2={ROW_Y} stroke="#cfcfcf" strokeWidth={2} opacity={liqO} />
        <line x1={e2} y1={ROW_Y} x2={s3} y2={ROW_Y} stroke="#cfcfcf" strokeWidth={2} opacity={recO} />
        {dotOn && <circle cx={dotX} cy={ROW_Y} r={8} fill={C.brand} />}
        <line
          x1={COL[1] + 170}
          y1={lowY}
          x2={COL[2] - 120}
          y2={lowY}
          stroke={online > 0.5 ? C.brand : '#d9a441'}
          strokeWidth={2}
          strokeDasharray={online > 0.5 ? undefined : '8 10'}
          opacity={partnerO * (online > 0.5 ? 1 : 0.6)}
        />
      </svg>

      <FlowCard x={COL[0]} y={ROW_Y} o={reqO}>
        <Icon name="withdraw" size={30} color={C.body} />
        <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          <span style={{fontSize: 20, fontWeight: 500, color: C.heading}}>{t.cont.yourWithdrawal}</span>
          <Money value={t.money.withdrawal} size={20} color={C.fg} />
        </div>
        <div>
          <StatusChip t={paid} from={{tone: 'amber', label: t.cont.requested}} to={{tone: 'brand', label: t.cont.paid}} size={16} />
        </div>
      </FlowCard>

      <FlowCard x={COL[1]} y={ROW_Y} o={liqO} dark>
        <Logo file="isotipo-white.svg" height={34} />
        <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          <span style={{fontSize: 20, fontWeight: 500, color: '#fff'}}>{t.cont.funds}</span>
          <span style={{fontSize: 16, color: 'rgba(255,255,255,0.7)'}}>{t.cont.paysNow}</span>
        </div>
        <div style={{height: 2, width: 48, background: C.brand, borderRadius: 2}} />
      </FlowCard>

      <FlowCard x={COL[2]} y={ROW_Y} o={recO}>
        <Icon name="check" size={30} color={paid > 0.5 ? C.brandDark : '#bdbdbd'} />
        <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          <span style={{fontSize: 20, fontWeight: 500, color: C.heading}}>{t.cont.receive}</span>
          <span style={{fontSize: 16, color: C.body}}>{t.cont.toAccount}</span>
        </div>
        <div>
          <StatusChip t={paid} from={{tone: 'neutral', label: t.cont.onTheWay}} to={{tone: 'brand', label: t.cont.received}} size={16} />
        </div>
      </FlowCard>

      <div
        style={{
          ...card({
            position: 'absolute',
            left: COL[0] - NODE_W / 2,
            top: lowY - 60,
            width: COL[1] + 170 - (COL[0] - NODE_W / 2),
            height: 120,
            padding: '0 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }),
          opacity: debitO,
          transform: `translateY(${(1 - debitO) * 12}px)`,
        }}
      >
        <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
          <span style={{fontSize: 20, fontWeight: 500, color: C.heading}}>{t.cont.deducted}</span>
          <span style={{fontSize: 16, color: C.body}}>{t.cont.sameAs}</span>
        </div>
        <StatusChip t={settled} from={{tone: 'neutral', label: t.cont.recorded}} to={{tone: 'brand', label: t.cont.settled}} size={16} />
      </div>

      <div
        style={{
          ...card({
            position: 'absolute',
            left: COL[2] - 120,
            top: lowY - 60,
            width: 250,
            height: 120,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }),
          opacity: partnerO,
          transform: `translateY(${(1 - partnerO) * 12}px)`,
        }}
      >
        <span style={{fontSize: 20, fontWeight: 500, color: C.heading}}>Web3Auth</span>
        <StatusChip t={online} from={{tone: 'amber', label: t.maintenance}} to={{tone: 'brand', label: t.online}} size={16} />
      </div>

      {/* routes adjusted: normal service is back */}
      <div
        style={{
          position: 'absolute',
          left: COL[0] - NODE_W / 2,
          width: COL[2] + NODE_W / 2 - (COL[0] - NODE_W / 2),
          top: lowY + 96,
          display: 'flex',
          justifyContent: 'center',
          opacity: availableT,
          transform: `translateY(${(1 - availableT) * 10}px)`,
        }}
      >
        <Chip tone="brand" label={t.cont.available} size={22} icon={<Icon name="check" size={22} color={C.brandDark} />} />
      </div>
    </Split>
  );
};

// ───────────────────────── 6 · Close (8s)

export const EndCard: React.FC = () => {
  const f = useF();
  const t = useT();
  // 1st: message fades in, holds, fades out. 2nd: larger logo fades in and holds.
  const textIn = p(f, 8, ms(300));
  const textOut = p(f, 120, ms(300));
  const logoIn = p(f, 138, ms(300) + 6, soft);
  return (
    <AbsoluteFill style={{background: C.brandDark, alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: textIn * (1 - textOut),
          transform: `translateY(${(1 - textIn) * 10}px)`,
        }}
      >
        <div style={{fontSize: 72, fontWeight: 500, color: '#fff', letterSpacing: '-0.02em'}}>{t.end.l1}</div>
        <div style={{fontSize: 32, color: 'rgba(255,255,255,0.8)', marginTop: 20, opacity: p(f, 20, ms(300))}}>
          {t.end.l2}
        </div>
      </div>
      <div style={{position: 'absolute', opacity: logoIn, transform: `scale(${mix(0.98, 1, logoIn)})`}}>
        <Logo file="logo-brand-white.svg" height={260} />
      </div>
    </AbsoluteFill>
  );
};
