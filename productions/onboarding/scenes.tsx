import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {useLang} from '../../brand/lang';
import {
  C,
  Chip,
  Eyebrow,
  Icon,
  Line,
  Logo,
  Split,
  card,
  mix,
  ms,
  p,
  soft,
  useF,
} from '../../brand/ui';
import {STR} from './copy';

const useT = () => STR[useLang()];

/** Fade a whole scene in/out (240ms soft crossfade). Uses wall-clock frames (outside TimeScale). */
export const SceneFade: React.FC<{dur: number; children: React.ReactNode; bg?: string}> = ({dur, children, bg}) => {
  const f = useCurrentFrame();
  const o = Math.min(p(f, 0, ms(240)), 1 - p(f, dur - ms(240), ms(240)));
  return <AbsoluteFill style={{opacity: o, background: bg}}>{children}</AbsoluteFill>;
};

const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>{children}</AbsoluteFill>
);

const rise = (o: number): React.CSSProperties => ({
  opacity: o,
  transform: `translateY(${(1 - o) * 14}px) scale(${mix(0.96, 1, o)})`,
});

const PART_ICONS = ['building', 'file', 'camera', 'clock'] as const;

// ───────────────────────── 0 · Hook

export const Hook: React.FC = () => {
  const f = useF();
  const t = useT();
  const panel = p(f, 20, ms(300));
  return (
    <Split
      text={
        <>
          <Eyebrow at={4}>{t.hook.eyebrow}</Eyebrow>
          <Line at={10}>{t.hook.l1}</Line>
          <Line at={55} size={32} weight={400} color={C.body} mt={22}>
            {t.hook.l2}
          </Line>
        </>
      }
    >
      <Stage>
        <div
          style={{
            ...card({width: 480, padding: 40, display: 'flex', flexDirection: 'column', gap: 28, alignItems: 'center'}),
            ...rise(panel),
          }}
        >
          <Logo file="isotipo.svg" height={48} />
          <div style={{display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center'}}>
            <div style={{opacity: p(f, 45, ms(240))}}>
              <Chip tone="neutral" label={t.hook.youSide} size={16} icon={<Icon name="user" size={16} color={C.fg} />} />
            </div>
            <div style={{opacity: p(f, 70, ms(240))}}>
              <Chip tone="brand" label={t.hook.ourSide} size={16} icon={<Icon name="lock" size={16} color={C.brandDark} />} />
            </div>
          </div>
        </div>
      </Stage>
    </Split>
  );
};

// ───────────────────────── 1 · Map (four parts)

export const Map: React.FC = () => {
  const f = useF();
  const t = useT();
  return (
    <Split
      text={
        <>
          <Eyebrow at={4}>{t.map.eyebrow}</Eyebrow>
          <Line at={10}>{t.map.title}</Line>
        </>
      }
    >
      <Stage>
        <div style={{display: 'flex', flexDirection: 'column', gap: 14, width: 520}}>
          {t.map.parts.map((part, i) => {
            const o = p(f, 24 + i * 28, ms(280));
            return (
              <div
                key={part.label}
                style={{
                  ...card({padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 18}),
                  ...rise(o),
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: i === 3 ? 'rgba(72,204,133,0.16)' : C.raised,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon name={PART_ICONS[i]} size={24} color={C.brandDark} />
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: 4, flex: 1}}>
                  <span style={{fontSize: 22, fontWeight: 500, color: C.heading}}>
                    {i + 1}. {part.label}
                  </span>
                  <span style={{fontSize: 16, color: C.body}}>{part.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Stage>
    </Split>
  );
};

// ───────────────────────── 2 · Info & documents (you + why)

export const InfoDocs: React.FC = () => {
  const f = useF();
  const t = useT();
  const youO = p(f, 20, ms(300));
  const whyO = p(f, 110, ms(300));
  return (
    <Split
      text={
        <>
          <Eyebrow at={4}>{t.info.eyebrow}</Eyebrow>
          <Line at={10} dimAt={100}>
            {t.info.title}
          </Line>
          <Line at={40} size={28} weight={400} color={C.fg} mt={24} dimAt={110}>
            {t.info.you}
          </Line>
          <Line at={110} size={28} weight={400} color={C.brandDark} mt={20}>
            {t.info.why}
          </Line>
        </>
      }
    >
      <Stage>
        <div style={{display: 'flex', flexDirection: 'column', gap: 18, width: 520}}>
          <div style={{...card({padding: 28, display: 'flex', flexDirection: 'column', gap: 16}), ...rise(youO)}}>
            <Chip tone="neutral" label={t.info.youChip} size={15} icon={<Icon name="user" size={15} color={C.fg} />} />
            <div style={{display: 'flex', gap: 12}}>
              <div
                style={{
                  flex: 1,
                  ...card({padding: 20, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', boxShadow: 'none'}),
                  background: C.bg,
                }}
              >
                <Icon name="building" size={28} color={C.brandDark} />
                <span style={{fontSize: 16, fontWeight: 500, color: C.fg, textAlign: 'center'}}>{t.map.parts[0].label}</span>
              </div>
              <div
                style={{
                  flex: 1,
                  ...card({padding: 20, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center', boxShadow: 'none'}),
                  background: C.bg,
                }}
              >
                <Icon name="file" size={28} color={C.brandDark} />
                <span style={{fontSize: 16, fontWeight: 500, color: C.fg, textAlign: 'center'}}>{t.map.parts[1].label}</span>
              </div>
            </div>
          </div>
          <div
            style={{
              ...card({
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                border: `1.5px solid ${C.brand}`,
              }),
              ...rise(whyO),
            }}
          >
            <Chip tone="brand" label={t.info.whyChip} size={15} icon={<Icon name="lock" size={15} color={C.brandDark} />} />
            <span style={{fontSize: 20, fontWeight: 500, color: C.brandDark, lineHeight: 1.35}}>{t.info.why}</span>
          </div>
        </div>
      </Stage>
    </Split>
  );
};

// ───────────────────────── 3 · Liveness

export const Liveness: React.FC = () => {
  const f = useF();
  const t = useT();
  const face = p(f, 24, ms(300));
  const whyO = p(f, 100, ms(300));
  const ok = p(f, 150, ms(240));
  return (
    <Split
      text={
        <>
          <Eyebrow at={4}>{t.live.eyebrow}</Eyebrow>
          <Line at={10} dimAt={95}>
            {t.live.title}
          </Line>
          <Line at={40} size={28} weight={400} color={C.fg} mt={24} dimAt={100}>
            {t.live.you}
          </Line>
          <Line at={100} size={28} weight={400} color={C.brandDark} mt={20}>
            {t.live.why}
          </Line>
        </>
      }
    >
      <Stage>
        <div style={{display: 'flex', flexDirection: 'column', gap: 18, width: 420, alignItems: 'center'}}>
          <div
            style={{
              ...card({
                width: 280,
                height: 320,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 20,
              }),
              ...rise(face),
            }}
          >
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 999,
                border: `2px solid ${ok > 0.5 ? C.brand : C.border}`,
                background: C.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name="camera" size={40} color={ok > 0.5 ? C.brandDark : C.body} />
            </div>
            <Chip tone={ok > 0.5 ? 'brand' : 'neutral'} label={t.live.youChip} size={15} />
          </div>
          <div style={{opacity: whyO, width: '100%'}}>
            <div style={{...card({padding: 22, border: `1.5px solid ${C.brand}`}), ...rise(whyO)}}>
              <Chip tone="brand" label={t.live.whyChip} size={14} icon={<Icon name="lock" size={14} color={C.brandDark} />} />
              <div style={{marginTop: 12, fontSize: 18, fontWeight: 500, color: C.brandDark, lineHeight: 1.35}}>{t.live.why}</div>
            </div>
          </div>
        </div>
      </Stage>
    </Split>
  );
};

// ───────────────────────── 4 · Timeline

export const Timeline: React.FC = () => {
  const f = useF();
  const t = useT();
  return (
    <Split
      text={
        <>
          <Eyebrow at={4}>{t.timeline.eyebrow}</Eyebrow>
          <Line at={10}>{t.timeline.title}</Line>
          <Line at={160} size={26} weight={400} color={C.body} mt={28}>
            {t.timeline.wallet}
          </Line>
        </>
      }
    >
      <Stage>
        <div style={{display: 'flex', flexDirection: 'column', gap: 0, width: 520, position: 'relative'}}>
          <div
            style={{
              position: 'absolute',
              left: 31,
              top: 36,
              bottom: 80,
              width: 2,
              background: C.raised,
            }}
          />
          {t.timeline.steps.map((step, i) => {
            const o = p(f, 20 + i * 32, ms(280));
            const done = p(f, 40 + i * 32, ms(200));
            return (
              <div
                key={step.label}
                style={{
                  display: 'flex',
                  gap: 18,
                  alignItems: 'flex-start',
                  paddingBottom: 22,
                  opacity: o,
                  transform: `translateX(${(1 - o) * 12}px)`,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 999,
                    background: done > 0.5 ? C.brand : C.raised,
                    border: `2px solid ${done > 0.5 ? C.brand : C.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    zIndex: 1,
                  }}
                >
                  {done > 0.5 ? <Icon name="check" size={14} color={C.brandDark} /> : null}
                </div>
                <div style={{...card({flex: 1, padding: '16px 20px'}), ...rise(o)}}>
                  <div style={{fontSize: 20, fontWeight: 500, color: C.heading}}>{step.label}</div>
                  <div style={{fontSize: 15, color: C.body, marginTop: 4}}>{step.sub}</div>
                </div>
              </div>
            );
          })}
          <div style={{opacity: p(f, 160, ms(300)), marginLeft: 46}}>
            <Chip tone="brand" label={t.timeline.wallet} size={14} icon={<Icon name="wallet" size={14} color={C.brandDark} />} />
          </div>
        </div>
      </Stage>
    </Split>
  );
};

// ───────────────────────── 5 · Close

export const EndCard: React.FC = () => {
  const f = useF();
  const t = useT();
  const textIn = p(f, 8, ms(300));
  const textOut = p(f, 100, ms(300));
  const logoIn = p(f, 118, ms(300) + 6, soft);
  return (
    <AbsoluteFill style={{background: C.brandDark, alignItems: 'center', justifyContent: 'center'}}>
      <div
        style={{
          position: 'absolute',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 18,
          opacity: textIn * (1 - textOut),
          transform: `translateY(${(1 - textIn) * 10}px)`,
        }}
      >
        <div style={{fontSize: 56, fontWeight: 500, color: '#fff', letterSpacing: '-0.02em', textAlign: 'center'}}>
          {t.close.l1}
        </div>
        <div style={{fontSize: 28, color: 'rgba(255,255,255,0.8)', opacity: p(f, 24, ms(300))}}>{t.close.l2}</div>
      </div>
      <div style={{position: 'absolute', opacity: logoIn, transform: `scale(${mix(0.98, 1, logoIn)})`}}>
        <Logo file="logo-brand-white.svg" height={240} />
      </div>
    </AbsoluteFill>
  );
};
