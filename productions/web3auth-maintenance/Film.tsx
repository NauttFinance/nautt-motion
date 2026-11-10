import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {fontFamily} from '../../brand/font';
import {LangCtx, type Lang} from '../../brand/lang';
import {C, TimeScale} from '../../brand/ui';
import {VO_OFFSET, VoCtx, type VoData} from '../../brand/vo';
import {Continuity, Ecosystem, EndCard, Hook, Impact, Layers, SceneFade} from './scenes';
import en from './vo/en.json';
import pt from './vo/pt.json';
import es from './vo/es.json';

export const SLUG = 'web3auth-maintenance';
const VO: Record<Lang, VoData> = {en, pt, es} as Record<Lang, VoData>;

const BREATH = 24; // min frames of silence after each VO line

// Base scene durations in frames @30fps; stretched when a VO line runs longer.
const BASE = [
  {C: Hook, dur: 180},
  {C: Ecosystem, dur: 375},
  {C: Layers, dur: 510},
  {C: Impact, dur: 300},
  {C: Continuity, dur: 300},
  {C: EndCard, dur: 240},
];
// VO durations the scaled scenes' cues were authored against.
const AUTHORED = [4.82, 11.88, 16.17, 15.5, 14.27, 4.64];

/** Scene timing for a language: scenes stretch to fit their VO line. */
export const plan = (lang: Lang) => {
  const {durations} = VO[lang];
  const scenes = BASE.map((s, i) => {
    // Impact (3) and Continuity (4) cue from VO timestamps, so they are not time-scaled.
    const scale = i === 3 || i === 4 ? 1 : durations[i] / AUTHORED[i];
    return {...s, scale, dur: Math.max(Math.round(s.dur * scale), VO_OFFSET + Math.ceil(durations[i] * 30) + BREATH)};
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
