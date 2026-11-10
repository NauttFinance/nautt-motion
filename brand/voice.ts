// Brand-wide voiceover defaults, read by scripts/gen-vo.mjs (plain data, no imports).
// Productions can override per line set in their copy.ts (SPEAK_AS / VO_SETTINGS); CLI flags override both.
// Rules and how to tune these: .agents/skills/nautt-voice-ptbr/SKILL.md

type Lang = 'en' | 'pt' | 'es';

/** Per-language ElevenLabs voice_settings defaults. ElevenLabs caps speed at 1.2. */
export const VOICE_SETTINGS: Partial<Record<Lang, {speed?: number; stability?: number; style?: number}>> = {
  // Roberta at 1.0 sounds slow and over-articulated for product explainers (team review 2026-11-10).
  pt: {speed: 1.2},
};

/**
 * TTS-only respellings: the screen keeps the real term, the voice reads the respelling.
 * A string applies to PT and ES; an object sets it per language. EN always reads the real term.
 * Write PT respellings as one word, the way a Brazilian says it: spaced letters ("U S D T") make the
 * voice pause between letters.
 */
export const PRONUNCIATION: Record<string, string | Partial<Record<Lang, string>>> = {
  USDT: {pt: 'uéssedetê', es: 'U S D T'},
};
