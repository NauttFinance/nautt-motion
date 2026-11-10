import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useLang} from '../../brand/lang';
import {VoCtx, useCue} from '../../brand/vo';
import {
  C,
  Chip,
  Eyebrow,
  Icon,
  Line,
  Logo,
  Money,
  Split,
  StatusChip,
  UsdtMark,
  card,
  mix,
  ms,
  p,
  pulse,
  soft,
  useF,
} from '../../brand/ui';
import {STR, type Strings} from './copy';

const useT = () => STR[useLang()];

// VO line (0-based) each cue phrase lives in.
const LINE: Record<keyof Strings['cue'], number> = {
  hookQ: 0,
  split: 1,
  net: 1,
  email: 1,
  convert: 2,
  balance: 2,
  lock: 2,
  reserve: 3,
  release: 3,
  same: 3,
  noNew: 3,
  chargeback: 3,
  example: 4,
  row1: 4,
  row2: 4,
  total: 4,
  open: 5,
  order: 5,
  tranche: 5,
  amount: 5,
  status: 5,
  date: 5,
  mail: 5,
  credits: 5,
};

/** Scene-local frame where a cue phrase is spoken. */
const useAt = () => {
  const t = useT();
  const cue = useCue();
  return (k: keyof Strings['cue']) => cue(LINE[k], t.cue[k]);
};

const AMBER = {bg: '#fef3c7', fg: '#92400e', line: '#f59e0b'};
const BRAND_TINT = 'rgba(72,204,133,0.10)';

/** Fade a whole scene in/out (240ms soft crossfade). */
export const SceneFade: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  const o = Math.min(p(f, 0, ms(240)), 1 - p(f, dur - ms(240), ms(240)));
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

/** Fade + 12px rise from `at`. */
const Appear: React.FC<{at: number; style?: React.CSSProperties; children: React.ReactNode}> = ({at, style, children}) => {
  const f = useF();
  const o = p(f, at, ms(300));
  return <div style={{...style, opacity: o * (style?.opacity === undefined ? 1 : Number(style.opacity)), transform: `${style?.transform ?? ''} translateY(${(1 - o) * 12}px)`}}>{children}</div>;
};

const Usdt: React.FC<{value: string; size?: number; color?: string}> = ({value, size = 44, color}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.3}}>
    <UsdtMark size={size * 0.85} />
    <Money value={value} size={size} color={color} />
    <span style={{fontSize: size * 0.45, fontWeight: 500, color: C.body}}>USDT</span>
  </div>
);

/** Rate pill; turns brand-dark with a lock once `lockT` reaches 1. */
const RatePill: React.FC<{label: string; rate: string; lockT: number; lockedLabel?: string; size?: number}> = ({
  label,
  rate,
  lockT,
  lockedLabel,
  size = 22,
}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      padding: `${size * 0.5}px ${size * 0.9}px`,
      borderRadius: 999,
      background: lockT > 0.5 ? C.brandDark : C.surface,
      border: `1px solid ${lockT > 0.5 ? C.brandDark : C.border}`,
      color: lockT > 0.5 ? '#fff' : C.fg,
      fontSize: size,
      fontWeight: 500,
      whiteSpace: 'nowrap',
      transform: `scale(${1 + 0.06 * Math.sin(Math.PI * lockT)})`,
    }}
  >
    {lockT > 0.5 && <Icon name="lock" size={size} color="#fff" />}
    <span style={{opacity: 0.75}}>{label}</span>
    <span style={{fontWeight: 600, fontVariantNumeric: 'tabular-nums'}}>{rate}</span>
    {lockT > 0.5 && lockedLabel && (
      <span style={{fontSize: size * 0.75, padding: '4px 10px', borderRadius: 999, background: 'rgba(255,255,255,0.16)'}}>
        {lockedLabel}
      </span>
    )}
  </div>
);

/** Receivable tranche card: tranche label, BRL amount, when. */
const Tranche: React.FC<{
  label: string;
  amount: string;
  when?: React.ReactNode;
  tone: 'brand' | 'amber';
  width?: number;
  style?: React.CSSProperties;
}> = ({label, amount, when, tone, width = 400, style}) => (
  <div
    style={{
      ...card({width, padding: '26px 30px', display: 'flex', flexDirection: 'column', gap: 14}),
      background: tone === 'brand' ? BRAND_TINT : '#fffbeb',
      borderColor: tone === 'brand' ? 'rgba(72,204,133,0.45)' : 'rgba(245,158,11,0.45)',
      ...style,
    }}
  >
    <span style={{fontSize: 22, fontWeight: 600, color: tone === 'brand' ? C.brandDark : AMBER.fg}}>{label}</span>
    <Money value={amount} size={48} />
    {when}
  </div>
);

const When: React.FC<{text: string}> = ({text}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 10, color: C.body, fontSize: 20}}>
    <Icon name="clock" size={22} color={C.body} />
    {text}
  </div>
);

/** Horizontal arrow that draws from left to right. */
const Arrow: React.FC<{t: number; width: number; style?: React.CSSProperties}> = ({t, width, style}) => (
  <svg width={width} height={24} style={{overflow: 'visible', ...style}}>
    <line x1={0} y1={12} x2={(width - 6) * t} y2={12} stroke={C.brandDark} strokeWidth={2.5} strokeLinecap="round" />
    <path
      d={`M${width - 14} 4 L${width - 4} 12 L${width - 14} 20`}
      fill="none"
      stroke={C.brandDark}
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={t > 0.95 ? 1 : 0}
    />
  </svg>
);

// ───────────────────────── 0 · Hook

export const Hook: React.FC = () => {
  const f = useF();
  const t = useT();
  const at = useAt();
  const q = at('hookQ');
  const arrowT = p(f, 30, ms(600), soft);
  const qPulse = 0.55 + 0.45 * pulse(f);
  return (
    <Split
      text={
        <>
          <Eyebrow at={4}>{t.hook.eyebrow}</Eyebrow>
          <Line at={8}>{t.hook.l1}</Line>
          <Line at={q - 6} size={40} weight={400} color={C.body} mt={20}>
            {t.hook.l2}
          </Line>
        </>
      }
    >
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', gap: 36}}>
        <Appear at={10}>
          <div style={{...card({width: 520, padding: 32, display: 'flex', flexDirection: 'column', gap: 18})}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 14, color: C.fg, fontSize: 22}}>
              <Icon name="card" size={30} color={C.brandDark} />
              <Chip tone="brand" label={t.hook.sale} size={18} />
            </div>
            <Money value={t.fmt.gross} size={64} />
          </div>
        </Appear>
        <svg width={24} height={90} style={{overflow: 'visible'}}>
          <line x1={12} y1={0} x2={12} y2={90 * arrowT} stroke="#bdbdbd" strokeWidth={2} strokeDasharray="6 8" />
        </svg>
        <Appear at={36}>
          <div style={{...card({width: 520, padding: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between'})}}>
            <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
              <span style={{fontSize: 20, color: C.body}}>{t.hook.balance}</span>
              <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                <UsdtMark size={40} />
                <Money value="—" size={52} color={C.body} />
              </div>
            </div>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 999,
                background: AMBER.bg,
                color: AMBER.fg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 36,
                fontWeight: 600,
                opacity: p(f, q - 6, ms(300)) * qPulse,
              }}
            >
              ?
            </div>
          </div>
        </Appear>
      </AbsoluteFill>
    </Split>
  );
};

// ───────────────────────── 1 · Day 0: one sale, two receivables

export const Day0: React.FC = () => {
  const f = useF();
  const t = useT();
  const at = useAt();
  const split = at('split');
  const net = at('net');
  const email = at('email');
  const s = p(f, split, ms(600), soft);
  const branch = p(f, split, ms(500));
  return (
    <Split
      text={
        <>
          <Eyebrow at={4}>{t.day0.eyebrow}</Eyebrow>
          <Line at={split - 4}>{t.day0.l1}</Line>
          <Line at={split + 20} color={C.body} mt={12}>
            {t.day0.l2}
          </Line>
        </>
      }
    >
      <div style={{position: 'absolute', left: 0, top: 150, width: 1000, display: 'flex', justifyContent: 'center'}}>
        <Appear at={8}>
          <div style={{...card({width: 560, padding: '28px 34px', display: 'flex', flexDirection: 'column', gap: 12})}}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 20, color: C.body}}>
              <span>
                {t.day0.order} <b style={{color: C.heading, fontWeight: 600}}>{t.fmt.order}</b>
              </span>
              <span>{t.day0.netAmount}</span>
            </div>
            <Money value={t.fmt.gross} size={56} />
            <div style={{opacity: p(f, net, ms(300))}}>
              <Chip tone="neutral" label={t.day0.net} size={17} />
            </div>
          </div>
        </Appear>
      </div>

      {/* branches */}
      <svg width={1000} height={1080} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
        {[270, 730].map((x) => (
          <path
            key={x}
            d={`M500 372 C500 420 ${x} 410 ${x} 470`}
            fill="none"
            stroke="#cfcfcf"
            strokeWidth={2}
            strokeDasharray={400}
            strokeDashoffset={400 * (1 - branch)}
          />
        ))}
      </svg>

      <div
        style={{
          position: 'absolute',
          top: 480,
          left: 0,
          width: 1000,
          display: 'flex',
          justifyContent: 'center',
          gap: mix(-200, 60, s),
          opacity: s,
        }}
      >
        <Tranche label={t.day0.principal} amount={t.fmt.p90} tone="brand" when={<When text={t.day0.whenPrincipal} />} />
        <Tranche label={t.day0.reserve} amount={t.fmt.p10} tone="amber" when={<When text={t.day0.whenReserve} />} />
      </div>

      <Appear at={email} style={{position: 'absolute', top: 790, left: 0, width: 1000, display: 'flex', justifyContent: 'center'}}>
        <div style={{...card({padding: '18px 26px', display: 'flex', alignItems: 'center', gap: 14, borderRadius: 999})}}>
          <Icon name="mail" size={26} color={C.brandDark} />
          <span style={{fontSize: 22, color: C.fg}}>{t.day0.email}</span>
        </div>
      </Appear>
    </Split>
  );
};

// ───────────────────────── 2 · Next business day: 90% converts, rate locks

export const D1: React.FC = () => {
  const f = useF();
  const t = useT();
  const at = useAt();
  const convert = at('convert');
  const balance = at('balance');
  const lock = at('lock');
  const arrowT = p(f, convert, ms(600), soft);
  const usdtO = p(f, convert + ms(500), ms(300));
  const lockT = p(f, lock, ms(900));
  const released = p(f, balance + 10, ms(200));
  return (
    <Split
      text={
        <>
          <Eyebrow at={4}>{t.d1.eyebrow}</Eyebrow>
          <Line at={8}>{t.d1.l1}</Line>
          <Line at={convert} mt={12}>
            {t.d1.l2}
          </Line>
          <Line at={lock} color={C.brandDark} mt={12}>
            {t.d1.l3}
          </Line>
        </>
      }
    >
      <div style={{position: 'absolute', top: 250, left: 0, width: 1040, display: 'flex', alignItems: 'center', gap: 24}}>
        <Appear at={6}>
          <Tranche label={t.day0.principal} amount={t.fmt.p90} tone="brand" width={330} />
        </Appear>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: 220}}>
          <div style={{opacity: p(f, convert, ms(300))}}>
            <RatePill label={t.d1.rate} rate={t.fmt.rate} lockT={lockT} size={18} />
          </div>
          <Arrow t={arrowT} width={200} />
        </div>
        <div style={{...card({padding: '30px 30px', width: 380}), opacity: usdtO, transform: `translateY(${(1 - usdtO) * 12}px)`}}>
          <Usdt value={t.fmt.u90} size={44} />
        </div>
      </div>

      <Appear at={balance} style={{position: 'absolute', top: 560, left: 0, width: 1040, display: 'flex', justifyContent: 'center'}}>
        <div style={{...card({width: 640, padding: '26px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'})}}>
          <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            <span style={{fontSize: 20, color: C.body}}>{t.d1.balance}</span>
            <Usdt value={`+${t.fmt.u90}`} size={38} color={C.brandDark} />
          </div>
          <StatusChip t={released} from={{tone: 'neutral', label: '…'}} to={{tone: 'brand', label: t.d1.released}} size={18} />
        </div>
      </Appear>

      <div
        style={{
          position: 'absolute',
          top: 780,
          left: 0,
          width: 1040,
          display: 'flex',
          justifyContent: 'center',
          opacity: p(f, lock, ms(300)),
        }}
      >
        <RatePill label={t.d1.rate} rate={t.fmt.rate} lockT={lockT} lockedLabel={t.d1.locked} size={26} />
      </div>
    </Split>
  );
};

// ───────────────────────── 3 · After 30 days: reserve at the same rate

export const D30: React.FC = () => {
  const f = useF();
  const t = useT();
  const at = useAt();
  const release = at('release');
  const same = at('same');
  const noNew = at('noNew');
  const chargeback = at('chargeback');
  const fill = p(f, 20, Math.max(release - 20, 1), soft);
  const rel = p(f, release, ms(200));
  const W = 900;
  return (
    <Split
      text={
        <>
          <Eyebrow at={4}>{t.d30.eyebrow}</Eyebrow>
          <Line at={release}>{t.d30.l1}</Line>
          <Line at={same} color={C.brandDark} mt={12}>
            {t.d30.l2}
          </Line>
          <Line at={noNew} size={36} weight={400} color={C.body} mt={18}>
            {t.d30.l3}
          </Line>
        </>
      }
    >
      {/* timeline */}
      <Appear at={6} style={{position: 'absolute', top: 210, left: 60, width: W}}>
        <div style={{position: 'relative', height: 80}}>
          <div style={{position: 'absolute', top: 18, left: 0, right: 0, height: 6, borderRadius: 999, background: C.raised}} />
          <div style={{position: 'absolute', top: 18, left: 0, width: `${fill * 100}%`, height: 6, borderRadius: 999, background: C.brand}} />
          {[
            {x: 0, label: t.d30.day1},
            {x: 1, label: t.d30.day30},
          ].map(({x, label}) => (
            <div key={label} style={{position: 'absolute', left: `${x * 100}%`, top: 8, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12}}>
              <div style={{width: 26, height: 26, borderRadius: 999, background: x === 0 || fill > 0.99 ? C.brand : C.surface, border: `2px solid ${C.brand}`}} />
              <span style={{fontSize: 20, color: C.body, whiteSpace: 'nowrap'}}>{label}</span>
            </div>
          ))}
        </div>
      </Appear>

      <div style={{position: 'absolute', top: 360, left: 60, width: W, display: 'flex', alignItems: 'center', gap: 24}}>
        <Appear at={10}>
          <Tranche
            label={t.day0.reserve}
            amount={t.fmt.p10}
            tone={rel > 0.5 ? 'brand' : 'amber'}
            width={330}
            when={
              <StatusChip t={rel} from={{tone: 'amber', label: t.d30.inReserve}} to={{tone: 'brand', label: t.d30.released}} size={18} />
            }
          />
        </Appear>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, width: 220}}>
          <div style={{opacity: p(f, same, ms(300))}}>
            <RatePill label={t.d1.rate} rate={t.fmt.rate} lockT={p(f, same, ms(900))} size={18} />
          </div>
          <Arrow t={p(f, same, ms(600), soft)} width={200} />
        </div>
        <div style={{...card({padding: 30, width: 330}), opacity: p(f, same + ms(500), ms(300))}}>
          <Usdt value={t.fmt.u10} size={42} />
        </div>
      </div>

      <Appear at={same + 20} style={{position: 'absolute', top: 640, left: 60, width: W, display: 'flex', justifyContent: 'center'}}>
        <Chip tone="brand" label={`${t.d30.sameRate} · ${t.fmt.rate}`} size={22} icon={<Icon name="lock" size={22} color={C.brandDark} />} />
      </Appear>

      <Appear at={chargeback} style={{position: 'absolute', top: 760, left: 60, width: W, display: 'flex', justifyContent: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, color: C.body}}>
          <Icon name="info" size={24} color={C.body} />
          {t.d30.note}
        </div>
      </Appear>
    </Split>
  );
};

// ───────────────────────── 4 · Worked example

const Row: React.FC<{at: number; label: string; brl: string; rate: string; usdt: string; strong?: boolean}> = ({
  at,
  label,
  brl,
  rate,
  usdt,
  strong,
}) => {
  const f = useF();
  const o = p(f, at, ms(300));
  const cell: React.CSSProperties = {fontSize: strong ? 40 : 34, fontVariantNumeric: 'tabular-nums', color: strong ? C.brandDark : C.heading, fontWeight: strong ? 600 : 500};
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '230px 310px 60px 150px 60px 1fr',
        alignItems: 'center',
        padding: '22px 36px',
        borderRadius: 16,
        background: strong ? BRAND_TINT : 'transparent',
        opacity: o,
        transform: `translateY(${(1 - o) * 12}px)`,
      }}
    >
      <span style={{fontSize: 24, color: strong ? C.brandDark : C.body, fontWeight: strong ? 600 : 400}}>{label}</span>
      <span style={cell}>{brl}</span>
      <span style={{...cell, color: C.body, fontWeight: 400}}>÷</span>
      <span style={cell}>{rate}</span>
      <span style={{...cell, color: C.body, fontWeight: 400}}>=</span>
      <span style={{...cell, display: 'flex', alignItems: 'center', gap: 12}}>
        <UsdtMark size={strong ? 38 : 32} />
        {usdt}
        <span style={{fontSize: 20, color: C.body, fontWeight: 500}}>USDT</span>
      </span>
    </div>
  );
};

export const Example: React.FC = () => {
  const f = useF();
  const t = useT();
  const at = useAt();
  const ex = at('example');
  const total = at('total');
  const rate = t.fmt.rate.replace('R$', '').trim();
  return (
    <AbsoluteFill style={{padding: '110px 160px', display: 'flex', flexDirection: 'column'}}>
      <Eyebrow at={4}>{t.ex.eyebrow}</Eyebrow>
      <Appear at={ex}>
        <div style={{display: 'flex', gap: 16, marginBottom: 28}}>
          <Chip tone="neutral" label={`${t.day0.order} ${t.fmt.order}`} size={20} />
          <Chip tone="neutral" label={`${t.day0.netAmount} ${t.fmt.gross}`} size={20} />
          <Chip tone="neutral" label={`${t.d1.rate} ${t.fmt.rate}`} size={20} />
        </div>
      </Appear>
      <div style={{...card({padding: '18px 0'}), opacity: p(f, ex, ms(300))}}>
        <Row at={at('row1')} label={`90% · ${t.d30.day1}`} brl={t.fmt.p90} rate={rate} usdt={t.fmt.u90} />
        <div style={{height: 1, background: C.border, margin: '0 36px'}} />
        <Row at={at('row2')} label={`10% · ${t.d30.day30}`} brl={t.fmt.p10} rate={rate} usdt={t.fmt.u10} />
        <div style={{height: 2, background: C.fg, margin: '8px 36px', opacity: p(f, total, ms(300))}} />
        <Row at={total} label={t.ex.total} brl={t.fmt.gross} rate={rate} usdt={t.fmt.uTotal} strong />
      </div>
      <div style={{marginTop: 40}}>
        <Line at={total + 30} size={52}>
          {t.ex.l1}
        </Line>
        <Line at={total + 50} size={30} weight={400} color={C.body} mt={10}>
          {t.ex.l2}
        </Line>
      </div>
      <div style={{position: 'absolute', right: 160, bottom: 70, fontSize: 18, color: C.body, opacity: p(f, ex, ms(300))}}>
        {t.ex.illustrative}
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── 5 · Where to track

const COLS = [150, 230, 190, 200, 200];

export const Track: React.FC = () => {
  const f = useF();
  const t = useT();
  const at = useAt();
  const open = at('open');
  const colAt = [at('order'), at('tranche'), at('amount'), at('status'), at('date')];
  const mail = at('mail');
  const credits = at('credits');
  // highlight follows the column being named, then fades before the e-mail beat
  const active = colAt.reduce((acc, c, i) => (f >= c ? i : acc), -1);
  const hlO = p(f, colAt[0], ms(200)) * (1 - p(f, mail - 10, ms(300)));
  const hlX = COLS.slice(0, Math.max(active, 0)).reduce((a, b) => a + b, 0);
  const cols = [t.track.cols.order, t.track.cols.tranche, t.track.cols.amount, t.track.cols.status, t.track.cols.date];
  const rows = [
    {tranche: t.day0.principal, amount: t.fmt.p90, status: {tone: 'brand' as const, label: t.track.released}, date: t.fmt.d1},
    {tranche: t.day0.reserve, amount: t.fmt.p10, status: {tone: 'amber' as const, label: t.track.review}, date: t.fmt.d30},
  ];
  return (
    <Split
      text={
        <>
          <Eyebrow at={4}>{t.track.eyebrow}</Eyebrow>
          <Line at={open} size={52}>
            {t.track.l1}
          </Line>
          <Line at={colAt[1]} size={36} weight={400} color={C.body} mt={18}>
            {t.track.l2}
          </Line>
        </>
      }
    >
      <Appear at={open} style={{position: 'absolute', top: 280, left: 0}}>
        <div style={{...card({width: 1030, padding: '30px 32px'})}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24}}>
            <Chip tone="brand" label={t.track.nav} size={17} icon={<Icon name="card" size={18} color={C.brandDark} />} />
            <span style={{fontSize: 30, fontWeight: 600, color: C.heading}}>{t.track.title}</span>
          </div>
          <div style={{position: 'relative'}}>
            <div
              style={{
                position: 'absolute',
                top: -8,
                bottom: -8,
                left: hlX,
                width: COLS[Math.max(active, 0)],
                borderRadius: 12,
                background: BRAND_TINT,
                border: '1px solid rgba(72,204,133,0.5)',
                opacity: hlO,
              }}
            />
            <div style={{display: 'flex', fontSize: 18, color: C.body, padding: '0 0 14px', position: 'relative'}}>
              {cols.map((c, i) => (
                <div key={c} style={{width: COLS[i], paddingLeft: 14, fontWeight: active === i && hlO > 0.5 ? 600 : 400, color: active === i && hlO > 0.5 ? C.brandDark : C.body}}>
                  {c}
                </div>
              ))}
            </div>
            {rows.map((r, i) => (
              <div key={i} style={{display: 'flex', alignItems: 'center', fontSize: 21, color: C.fg, borderTop: `1px solid ${C.border}`, height: 76, position: 'relative'}}>
                <div style={{width: COLS[0], paddingLeft: 14, fontWeight: 500}}>{t.fmt.order}</div>
                <div style={{width: COLS[1], paddingLeft: 14}}>{r.tranche}</div>
                <div style={{width: COLS[2], paddingLeft: 14, fontVariantNumeric: 'tabular-nums', fontWeight: 600}}>{r.amount}</div>
                <div style={{width: COLS[3], paddingLeft: 14}}>
                  <Chip tone={r.status.tone} label={r.status.label} size={16} />
                </div>
                <div style={{width: COLS[4], paddingLeft: 14, fontVariantNumeric: 'tabular-nums'}}>{r.date}</div>
              </div>
            ))}
          </div>
        </div>
      </Appear>

      <div style={{position: 'absolute', top: 680, left: 0, width: 1030, display: 'flex', gap: 24}}>
        <Appear at={mail} style={{flex: 1}}>
          <div style={{...card({padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14, height: 200})}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
              <Icon name="mail" size={28} color={C.brandDark} />
              <span style={{fontSize: 22, fontWeight: 500, color: C.heading}}>{t.track.mail}</span>
            </div>
            <span style={{fontSize: 19, color: C.body}}>
              {t.day0.principal} · {t.day0.order} {t.fmt.order}
            </span>
            <span style={{fontSize: 19, color: C.body}}>
              {t.day0.reserve} · {t.day0.order} {t.fmt.order}
            </span>
          </div>
        </Appear>
        <Appear at={credits} style={{flex: 1}}>
          <div style={{...card({padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14, height: 200})}}>
            <span style={{fontSize: 22, fontWeight: 500, color: C.heading}}>{t.track.credits}</span>
            {[
              {v: t.fmt.u90, d: t.fmt.d1, k: '90%'},
              {v: t.fmt.u10, d: t.fmt.d30, k: '10%'},
            ].map((c, i) => (
              <div key={c.k} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: p(f, credits + 8 + i * 12, ms(300))}}>
                <span style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 22, fontWeight: 600, color: C.brandDark, fontVariantNumeric: 'tabular-nums'}}>
                  <UsdtMark size={26} />+{c.v} USDT
                </span>
                <span style={{fontSize: 18, color: C.body}}>
                  {c.k} · {c.d}
                </span>
              </div>
            ))}
          </div>
        </Appear>
      </div>
    </Split>
  );
};

// ───────────────────────── 6 · Close

export const EndCard: React.FC = () => {
  const f = useF();
  const t = useT();
  const vo = React.useContext(VoCtx);
  const voEnd = 8 + Math.ceil((vo?.durations[6] ?? 4) * 30);
  const textIn = p(f, 8, ms(300));
  const textOut = p(f, voEnd + 10, ms(300));
  const logoIn = p(f, voEnd + 28, ms(300) + 6, soft);
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
        <div style={{fontSize: 40, color: 'rgba(255,255,255,0.8)', marginTop: 20, opacity: p(f, 30, ms(300))}}>{t.end.l2}</div>
      </div>
      <div style={{position: 'absolute', opacity: logoIn, transform: `scale(${mix(0.98, 1, logoIn)})`}}>
        <Logo file="logo-brand-white.svg" height={260} />
      </div>
    </AbsoluteFill>
  );
};
