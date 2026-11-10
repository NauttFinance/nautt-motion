import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {fontFamily} from '../../brand/font';
import {LangCtx, type Lang} from '../../brand/lang';
import {C} from '../../brand/ui';
import {VO_OFFSET, VoCtx, type VoData} from '../../brand/vo';
import {D1, D30, Day0, EndCard, Example, Hook, SceneFade, Track} from './scenes';
import en from './vo/en.json';
import pt from './vo/pt.json';
import es from './vo/es.json';

export const SLUG = 'credit-card-flow';
const VO: Record<Lang, VoData> = {en, pt, es} as Record<Lang, VoData>;

const BREATH = 24; // frames of silence after each VO line
// Every beat is cued from VO timestamps (useCue), so scenes are sized by their VO line, never time-scaled.
const SCENES = [Hook, Day0, D1, D30, Example, Track, EndCard];
const MIN = [150, 0, 0, 0, 0, 0, 240]; // hook needs room for its card; end card holds the logo
const TAIL = [0, 0, 0, 0, 30, 0, 90]; // extra hold after the line (example total, logo)

export const plan = (lang: Lang) => {
  const {durations} = VO[lang];
  const dur = SCENES.map((_, i) => Math.max(MIN[i], VO_OFFSET + Math.ceil(durations[i] * 30) + BREATH + TAIL[i]));
  const starts = dur.reduce<number[]>((acc, _, i) => [...acc, i === 0 ? 0 : acc[i - 1] + dur[i - 1]], []);
  return {dur, starts, total: dur.reduce((a, d) => a + d, 0)};
};

export const Film: React.FC<{lang: Lang; voiceover: boolean}> = ({lang, voiceover}) => {
  const {dur, starts} = plan(lang);
  return (
    <LangCtx.Provider value={lang}>
      <VoCtx.Provider value={VO[lang]}>
        <AbsoluteFill style={{background: C.bg, fontFamily, color: C.fg}}>
          {SCENES.map((Scene, i) => (
            <Sequence key={i} from={starts[i]} durationInFrames={dur[i]}>
              <SceneFade dur={dur[i]}>
                <Scene />
              </SceneFade>
            </Sequence>
          ))}
          {voiceover &&
            SCENES.map((_, i) => (
              <Sequence key={`vo${i}`} from={starts[i] + VO_OFFSET}>
                <Audio src={staticFile(`${SLUG}/vo/${lang}/vo${i + 1}.mp3`)} />
              </Sequence>
            ))}
        </AbsoluteFill>
      </VoCtx.Provider>
    </LangCtx.Provider>
  );
};
