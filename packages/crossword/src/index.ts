// @more/crossword — crossword generator

export const CROSSWORD_VERSION = '0.1.0';

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface CrosswordInput {
  word: string;
  clue: string;
}

export interface CrosswordGrid {
  width: number;
  height: number;
  cells: (string | null)[][];
}

export function generateCrossword(
  _words: CrosswordInput[],
  _difficulty: Difficulty,
): CrosswordGrid | null {
  // Placeholder — implemented in Clue 8
  return null;
}
