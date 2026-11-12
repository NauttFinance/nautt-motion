import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {fontFamily} from '../../brand/font';
import {LangCtx, type Lang} from '../../brand/lang';
import {C, TimeScale} from '../../brand/ui';
import {VO_OFFSET, VoCtx, type VoData} from '../../brand/vo';
import {EndCard, Hook, InfoDocs, Liveness, Map, SceneFade, Timeline} from './scenes';
import en from './vo/en.json';
import pt from './vo/pt.json';
import es from './vo/es.json';

export const SLUG = 'onboarding';
const VO: Record<Lang, VoData> = {en, pt, es} as Record<Lang, VoData>;

const BREATH = 24;

// Base scene durations @30fps; stretched to fit each VO line.
const BASE = [
  {C: Hook, dur: 300},
  {C: Map, dur: 420},
  {C: InfoDocs, dur: 480},
  {C: Liveness, dur: 390},
  {C: Timeline, dur: 540},
  {C: EndCard, dur: 240},
];
// Authored against first EN VO after the macro rewrite (updated by gen-vo).
const AUTHORED = [11.66, 13.93, 18.16, 14.4, 19.13, 3.34];

export const plan = (lang: Lang) => {
  const {durations} = VO[lang];
  const scenes = BASE.map((s, i) => {
    const scale = durations[i] / AUTHORED[i];
    return {
      ...s,
      scale,
      dur: Math.max(Math.round(s.dur * scale), VO_OFFSET + Math.ceil(durations[i] * 30) + BREATH),
    };
  });
  const starts = scenes.reduce<number[]>((acc, _, i) => [...acc, i === 0 ? 0 : acc[i - 1] + scenes[i - 1].dur], []);
  return {scenes, starts, total: scenes.reduce((a, s) => a + s.dur, 0)};
};

export const Film: React.FC<{lang: Lang; voiceover: boolean}> = ({lang, voiceover}) => {
  const {scenes, starts} = plan(lang);
  return (
    <LangCtx.Provider value={lang}>
      <VoCtx.Provider value={VO[lang]}>
        <AbsoluteFill style={{background: C.bg, fontFamily, color: C.fg}}>
          {scenes.map(({C: Scene, dur, scale}, i) => (
            <Sequence key={i} from={starts[i]} durationInFrames={dur}>
              <SceneFade dur={dur}>
                <TimeScale.Provider value={scale}>
                  <Scene />
                </TimeScale.Provider>
              </SceneFade>
            </Sequence>
          ))}
          {voiceover &&
            scenes.map((_, i) => (
              <Sequence key={`vo${i}`} from={starts[i] + VO_OFFSET}>
                <Audio src={staticFile(`${SLUG}/vo/${lang}/vo${i + 1}.mp3`)} />
              </Sequence>
            ))}
        </AbsoluteFill>
      </VoCtx.Provider>
    </LangCtx.Provider>
  );
};
