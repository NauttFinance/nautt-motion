import React from 'react';
import {Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

// Nautt Finance design tokens (light theme)
export const C = {
  bg: '#f0f0f0',
  surface: '#ffffff',
  raised: '#e9e9e9',
  border: 'rgba(212,212,212,0.7)',
  heading: '#000000',
  fg: '#262626',
  body: '#666666',
  brand: '#48cc85',
  brandDark: '#1a453a',
};
export const SHADOW_XS = '0 1px 2px rgba(0,0,0,0.05)';

export const FPS = 30;

/** Per-scene time scale so animation cues follow the VO pace (cues were authored at r=1). */
export const TimeScale = React.createContext(1);
export const useF = () => useCurrentFrame() / React.useContext(TimeScale);
export const ms = (m: number) => Math.round((m / 1000) * FPS);

// cubic-bezier(0.4, 0, 0.2, 1) standard; softer ease for protection reveals
export const ease = Easing.bezier(0.4, 0, 0.2, 1);
export const soft = Easing.bezier(0.25, 0.1, 0.25, 1);

/** 0..1 progress from `start` over `dur` frames. */
export const p = (frame: number, start: number, dur: number, easing = ease) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing,
  });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Slow 2s opacity pulse, 0..1. */
export const pulse = (frame: number) => (Math.sin((frame / (2 * FPS)) * Math.PI * 2) + 1) / 2;

// ───────────────────────── Chips

type Tone = 'amber' | 'brand' | 'neutral' | 'blue';
const TONES: Record<Tone, {bg: string; fg: string; dot: string}> = {
  amber: {bg: '#fef3c7', fg: '#92400e', dot: '#f59e0b'},
  brand: {bg: 'rgba(72,204,133,0.16)', fg: C.brandDark, dot: C.brand},
  neutral: {bg: C.raised, fg: C.fg, dot: '#a3a3a3'},
  blue: {bg: '#dbeafe', fg: '#1e40af', dot: '#3b82f6'},
};

export const Chip: React.FC<{tone: Tone; label: string; size?: number; dim?: number; icon?: React.ReactNode}> = ({
  tone,
  label,
  size = 20,
  dim = 0,
  icon,
}) => {
  const t = TONES[tone];
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: size * 0.45,
        padding: `${size * 0.38}px ${size * 0.8}px`,
        borderRadius: 999,
        background: t.bg,
        color: t.fg,
        fontSize: size,
        fontWeight: 500,
        whiteSpace: 'nowrap',
        opacity: 1 - 0.3 * dim,
        lineHeight: 1,
      }}
    >
      {icon ?? <span style={{width: size * 0.42, height: size * 0.42, borderRadius: 999, background: t.dot}} />}
      {label}
    </div>
  );
};

/** Chip that switches state at t=0.5 with a quick dip (~200ms). */
export const StatusChip: React.FC<{
  from: {tone: Tone; label: string};
  to: {tone: Tone; label: string};
  t: number;
  size?: number;
  dim?: number;
}> = ({from, to, t, size, dim}) => {
  const cur = t < 0.5 ? from : to;
  const o = Math.abs(1 - 2 * t);
  return (
    <div style={{opacity: mix(0.15, 1, o), transform: `scale(${mix(0.96, 1, o)})`, display: 'inline-flex'}}>
      <Chip tone={cur.tone} label={cur.label} size={size} dim={dim} />
    </div>
  );
};

// ───────────────────────── Text

export const Eyebrow: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const f = useF();
  const t = p(f, at, ms(300));
  return (
    <div
      style={{
        fontSize: 26,
        fontWeight: 500,
        color: C.brandDark,
        opacity: t,
        transform: `translateY(${(1 - t) * 8}px)`,
        marginBottom: 24,
      }}
    >
      {children}
    </div>
  );
};

/** Headline line with soft mask reveal from the left (~240ms + settle). */
export const Line: React.FC<{
  at: number;
  children: React.ReactNode;
  size?: number;
  weight?: number;
  color?: string;
  dimAt?: number;
  mt?: number;
}> = ({at, children, size = 60, weight = 500, color = C.heading, dimAt, mt = 0}) => {
  const f = useF();
  const t = p(f, at, ms(240) + 6, soft);
  const d = dimAt !== undefined ? p(f, dimAt, ms(300)) : 0;
  return (
    <div
      style={{
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.18,
        letterSpacing: '-0.02em',
        color,
        marginTop: mt,
        opacity: t * (1 - 0.6 * d),
        clipPath: `inset(-10% ${100 - t * 100}% -10% 0)`,
        transform: `translateY(${(1 - t) * 10}px)`,
      }}
    >
      {children}
    </div>
  );
};

/** Left text column + right visual stage. */
export const Split: React.FC<{text: React.ReactNode; children: React.ReactNode}> = ({text, children}) => (
  <div style={{position: 'absolute', inset: 0}}>
    <div
      style={{
        position: 'absolute',
        left: 120,
        top: 0,
        bottom: 0,
        width: 640,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {text}
    </div>
    <div style={{position: 'absolute', left: 820, right: 0, top: 0, bottom: 0}}>{children}</div>
  </div>
);

// ───────────────────────── Surfaces

export const card = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  background: C.surface,
  border: `1px solid ${C.border}`,
  borderRadius: 20,
  boxShadow: SHADOW_XS,
  ...extra,
});

export const Skel: React.FC<{w: number | string; h?: number; o?: number}> = ({w, h = 14, o = 1}) => (
  <div style={{width: w, height: h, borderRadius: 8, background: C.raised, opacity: o}} />
);

// Same asset the panel's BalanceCard uses (nautt-painel-v2/public/icons/chains/usdt.svg).
export const UsdtMark: React.FC<{size?: number}> = ({size = 40}) => (
  <Img src={staticFile('brand/usdt.svg')} style={{width: size, height: size, flexShrink: 0, display: 'block'}} />
);

export const Money: React.FC<{value: string; size?: number; color?: string}> = ({value, size = 56, color = C.heading}) => (
  <span style={{fontSize: size, fontWeight: 600, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em', color}}>
    {value}
  </span>
);

export const Logo: React.FC<{file: string; height: number; style?: React.CSSProperties}> = ({file, height, style}) => (
  <Img src={staticFile(`brand/${file}`)} style={{height, width: 'auto', display: 'block', ...style}} />
);

// ───────────────────────── Icons (1.5px stroke family)

const ICONS: Record<string, React.ReactNode> = {
  key: (
    <>
      <circle cx="8" cy="15" r="4" />
      <path d="M10.85 12.15 19 4M17 6l2 2M14.5 8.5l2 2" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  wallet: (
    <>
      <rect x="3" y="6" width="18" height="14" rx="3" />
      <path d="M3 10h18M16 15h2" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16h.01" />
    </>
  ),
  withdraw: <path d="M12 4v12M6 10l6 6 6-6M5 20h14" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  card: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="M2.5 10h19M6.5 15h4" />
    </>
  ),
  node: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4" />
      <path d="M9 12h6M12 9v6" />
    </>
  ),
};

export const Icon: React.FC<{name: keyof typeof ICONS; size?: number; color?: string}> = ({
  name,
  size = 28,
  color = 'currentColor',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{flexShrink: 0}}
  >
    {ICONS[name]}
  </svg>
);
