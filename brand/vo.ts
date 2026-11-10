import React from 'react';

/** Voiceover data written by scripts/gen-vo.mjs: one entry per VO line. */
export type VoData = {voice: string; durations: number[]; alignment: {text: string; starts: number[]}[]};

export const VO_OFFSET = 8; // frames between scene start and its VO line
export const VoCtx = React.createContext<VoData | null>(null);

/** Returns cue(line, phrase): scene-local frame where `phrase` starts in VO line `line` (0-based). */
export const useCue = () => {
  const vo = React.useContext(VoCtx);
  if (!vo) throw new Error('useCue needs a <VoCtx.Provider>');
  return (line: number, phrase: string): number => {
    const {text, starts} = vo.alignment[line];
    const idx = text.indexOf(phrase);
    if (idx < 0) throw new Error(`cue not found in vo${line + 1}: "${phrase}"`);
    return VO_OFFSET + Math.round(starts[idx] * 30);
  };
};
