import React from 'react';
import {Composition, Folder} from 'remotion';
import {LANGS} from '../../brand/lang';
import {Film, SLUG, plan} from './Film';

/** Registers one 16:9 composition per language: credit-card-flow-{en,pt,es}. */
export const CreditCardFlow: React.FC = () => (
  <Folder name={SLUG}>
    {LANGS.map((lang) => (
      <Composition
        key={lang}
        id={`${SLUG}-${lang}`}
        component={Film}
        durationInFrames={plan(lang).total}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{lang, voiceover: true}}
      />
    ))}
  </Folder>
);
