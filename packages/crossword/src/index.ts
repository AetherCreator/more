// @more/crossword — crossword generator

export const CROSSWORD_VERSION = '0.1.0';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface CrosswordInput {
  word: string;
  clue: string;
}

export interface CrosswordCell {
  letter: string | null;
  number: number | null;
  isAcross: boolean;
  isDown: boolean;
}

export interface CrosswordAnswer {
  number: number;
  direction: 'across' | 'down';
  clue: string;
  word: string;
  row: number;
  col: number;
  length: number;
}

export interface CrosswordGrid {
  grid: CrosswordCell[][];
  across: CrosswordAnswer[];
  down: CrosswordAnswer[];
  width: number;
  height: number;
  placedCount: number;
  inputCount: number;
}

export interface GenerateOptions {
  difficulty: Difficulty;
  maxAttempts?: number;
}

interface DifficultyConfig {
  maxSize: number;
  minPlaced: number;
}

const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  beginner: {maxSize: 10, minPlaced: 8},
  intermediate: {maxSize: 13, minPlaced: 12},
  advanced: {maxSize: 15, minPlaced: 16},
  expert: {maxSize: 18, minPlaced: 20},
};

// Adjust minPlaced if fewer words are provided
function getMinPlaced(config: DifficultyConfig, inputCount: number): number {
  return Math.min(config.minPlaced, Math.max(2, Math.floor(inputCount * 0.6)));
}

import {placeWord, isValidPlacement, scorePlacement} from './placer';
import {trimGrid, numberGrid} from './grid';

type Direction = 'across' | 'down';

interface PlacedWord {
  word: string;
  clue: string;
  row: number;
  col: number;
  direction: Direction;
  length: number;
}

export function generateCrossword(
  words: CrosswordInput[],
  options: GenerateOptions,
): CrosswordGrid | null {
  const config = DIFFICULTY_CONFIG[options.difficulty];
  const maxAttempts = options.maxAttempts ?? 50;
  const {maxSize} = config;
  const minPlaced = getMinPlaced(config, words.length);

  // Normalize words to uppercase
  const normalized = words.map(w => ({
    word: w.word.toUpperCase().replace(/[^A-Z]/g, ''),
    clue: w.clue,
  }));

  // Sort by length descending
  const sorted = [...normalized].sort((a, b) => b.word.length - a.word.length);

  let bestGrid: string[][] | null = null;
  let bestPlaced: PlacedWord[] = [];

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    // Fresh grid
    const grid: string[][] = Array.from({length: maxSize}, () =>
      Array(maxSize).fill(''),
    );
    const placed: PlacedWord[] = [];

    // Place first word horizontally, centered
    const first = sorted[0];
    if (first.word.length > maxSize) continue;
    const startRow = Math.floor(maxSize / 2);
    const startCol = Math.floor((maxSize - first.word.length) / 2);
    placeWord(grid, first.word, startRow, startCol, 'across');
    placed.push({
      word: first.word,
      clue: first.clue,
      row: startRow,
      col: startCol,
      direction: 'across',
      length: first.word.length,
    });

    // Shuffle remaining for variety
    const remaining = [...sorted.slice(1)];
    if (attempt > 0) {
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }
    }

    for (const candidate of remaining) {
      // Skip if already placed (same word string)
      if (placed.some(p => p.word === candidate.word)) continue;

      let bestScore = -1;
      let bestPos: {row: number; col: number; dir: Direction} | null = null;

      for (const pw of placed) {
        for (let ci = 0; ci < candidate.word.length; ci++) {
          for (let pi = 0; pi < pw.length; pi++) {
            if (candidate.word[ci] !== pw.word[pi]) continue;

            let cRow: number, cCol: number, cDir: Direction;

            if (pw.direction === 'across') {
              cDir = 'down';
              cRow = pw.row - ci;
              cCol = pw.col + pi;
            } else {
              cDir = 'across';
              cRow = pw.row + pi;
              cCol = pw.col - ci;
            }

            if (
              !isValidPlacement(
                grid,
                candidate.word,
                cRow,
                cCol,
                cDir,
                maxSize,
              )
            ) {
              continue;
            }

            const score = scorePlacement(
              grid,
              candidate.word,
              cRow,
              cCol,
              cDir,
              maxSize,
              placed,
            );

            if (score > bestScore) {
              bestScore = score;
              bestPos = {row: cRow, col: cCol, dir: cDir};
            }
          }
        }
      }

      if (bestPos) {
        placeWord(grid, candidate.word, bestPos.row, bestPos.col, bestPos.dir);
        placed.push({
          word: candidate.word,
          clue: candidate.clue,
          row: bestPos.row,
          col: bestPos.col,
          direction: bestPos.dir,
          length: candidate.word.length,
        });
      }
    }

    if (placed.length > bestPlaced.length) {
      bestGrid = grid.map(row => [...row]);
      bestPlaced = [...placed];
    }

    if (placed.length >= minPlaced) break;
  }

  if (!bestGrid || bestPlaced.length < Math.max(2, minPlaced)) {
    return null;
  }

  // Trim and number
  const trimmed = trimGrid(bestGrid, bestPlaced, maxSize);
  const numbered = numberGrid(
    trimmed.grid,
    trimmed.placed,
    trimmed.width,
    trimmed.height,
  );

  return {
    grid: numbered.cells,
    across: numbered.across,
    down: numbered.down,
    width: trimmed.width,
    height: trimmed.height,
    placedCount: bestPlaced.length,
    inputCount: words.length,
  };
}
