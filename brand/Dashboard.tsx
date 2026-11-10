import React from 'react';
import {C, Chip, Icon, Logo, Money, Skel, StatusChip, UsdtMark, card, mix, ms, p, pulse, soft, useF} from './ui';

/** Simplified Nautt dashboard. Every state is a 0..1 progress so scenes can drive it. */
/** Every visible string of the mock dashboard, supplied by the production's copy. */
export type DashLabels = {
  connected: string;
  maintenance: string;
  banner: string;
  available: string;
  protected: string;
  withdraw: string;
  deposit: string;
  paused: string;
  incoming: string;
  toReceive: string;
  pending: string;
  balance: string;
  depositAmount: string;
};

export const Dashboard: React.FC<{
  labels: DashLabels;
  enterAt?: number; // stagger-in start frame; undefined = already visible
  partnerT: number; // 0 connected → 1 maintenance
  bannerT?: number;
  pausedT?: number;
  protectedT?: number;
  depositT?: number;
}> = ({labels, enterAt, partnerT, bannerT = 0, pausedT = 0, protectedT = 0, depositT = 0}) => {
  const f = useF();
  const enter = (i: number) => (enterAt === undefined ? 1 : p(f, enterAt + i * 3, ms(300)));
  const rise = (i: number): React.CSSProperties => ({
    opacity: enter(i),
    transform: `translateY(${(1 - enter(i)) * 14}px)`,
  });
  const pul = partnerT > 0.5 ? pulse(f) : 0;

  return (
    <div style={{...card({width: 1000, height: 660, overflow: 'hidden', display: 'flex', flexDirection: 'column'}), ...rise(0)}}>
      {/* header */}
      <div
        style={{
          height: 76,
          flexShrink: 0,
          borderBottom: `1px solid ${C.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 28px',
        }}
      >
        <Logo file="wordmark-bicolor.svg" height={24} />
        <div style={{display: 'flex', alignItems: 'center', gap: 12, ...rise(1)}}>
          <span style={{fontSize: 18, color: C.body, fontWeight: 500}}>Web3Auth</span>
          <StatusChip
            t={partnerT}
            from={{tone: 'neutral', label: labels.connected}}
            to={{tone: 'amber', label: labels.maintenance}}
            size={17}
            dim={pul}
          />
        </div>
      </div>

      {/* maintenance banner */}
      <div style={{height: 84 * bannerT, overflow: 'hidden', flexShrink: 0}}>
        <div
          style={{
            margin: '16px 24px 0',
            height: 60,
            borderRadius: 20,
            background: '#fffbeb',
            border: '1px solid #f5c56b',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '0 20px',
            color: '#92400e',
            fontSize: 19,
            fontWeight: 500,
            opacity: bannerT,
          }}
        >
          <Icon name="info" size={24} color="#d97706" />
          {labels.banner}
        </div>
      </div>

      {/* body */}
      <div style={{flex: 1, display: 'flex', gap: 24, padding: 24, minHeight: 0}}>
        <div style={{width: 180, display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 8, ...rise(2)}}>
          <Skel w={140} h={16} />
          <Skel w={110} />
          <Skel w={124} />
          <Skel w={96} />
          <Skel w={118} />
        </div>
        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 20}}>
          {/* balance card */}
          <div style={{...card({padding: 28}), ...rise(3)}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <span style={{fontSize: 18, color: C.body}}>{labels.available}</span>
              <div
                style={{
                  opacity: protectedT,
                  clipPath: `inset(0 ${100 - protectedT * 100}% 0 0)`,
                }}
              >
                <Chip tone="brand" label={labels.protected} size={17} icon={<Icon name="lock" size={18} color={C.brandDark} />} />
              </div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 16, marginTop: 14}}>
              <UsdtMark size={44} />
              <Money value={labels.balance} size={56} />
              <span style={{fontSize: 22, color: C.body, fontWeight: 500, marginTop: 12}}>USDT</span>
            </div>
            <div style={{display: 'flex', gap: 12, marginTop: 24, alignItems: 'center'}}>
              <div
                style={{
                  height: 48,
                  padding: '0 22px',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 18,
                  fontWeight: 500,
                  background: pausedT > 0.5 ? C.raised : C.brandDark,
                  color: pausedT > 0.5 ? C.body : '#fff',
                }}
              >
                <Icon name="withdraw" size={20} />
                {labels.withdraw}
              </div>
              <div
                style={{
                  height: 48,
                  padding: '0 22px',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 18,
                  fontWeight: 500,
                  border: `1px solid ${C.border}`,
                  color: C.fg,
                }}
              >
                {labels.deposit}
              </div>
              <div style={{opacity: pausedT, transform: `translateX(${(1 - pausedT) * -8}px)`}}>
                <Chip tone="amber" label={labels.paused} size={17} />
              </div>
            </div>
          </div>

          {/* rows: skeleton → incoming deposit */}
          <div style={{...card({padding: '20px 24px', position: 'relative'}), ...rise(4)}}>
            <div style={{opacity: 1 - depositT, display: 'flex', flexDirection: 'column', gap: 14}}>
              <Skel w="70%" />
              <Skel w="45%" o={0.7} />
            </div>
            <div
              style={{
                position: 'absolute',
                inset: '0 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: depositT,
                transform: `translateY(${(1 - depositT) * 8}px)`,
              }}
            >
              <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
                <span style={{fontSize: 18, color: C.fg, fontWeight: 500}}>{labels.incoming}</span>
                <span style={{fontSize: 16, color: C.body}}>{labels.toReceive}</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                <Money value={labels.depositAmount} size={24} color={C.fg} />
                <Chip tone="amber" label={labels.pending} size={16} />
              </div>
            </div>
          </div>
          <div style={{...card({padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 14}), ...rise(5)}}>
            <Skel w="60%" />
            <Skel w="35%" o={0.7} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const usePush = (start: number, dur: number, amount = 0.04) => {
  const f = useF();
  return mix(1, 1 + amount, p(f, start, dur, soft));
};
