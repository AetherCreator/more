import type {CrosswordCell, CrosswordAnswer} from './index';

type Direction = 'across' | 'down';

interface PlacedWord {
  word: string;
  clue: string;
  row: number;
  col: number;
  direction: Direction;
  length: number;
}

interface TrimResult {
  grid: string[][];
  placed: PlacedWord[];
  width: number;
  height: number;
}

/**
 * Trim grid to smallest bounding box with 1 cell padding.
 */
export function trimGrid(
  grid: string[][],
  placed: PlacedWord[],
  maxSize: number,
): TrimResult {
  let minR = maxSize,
    maxR = 0,
    minC = maxSize,
    maxC = 0;

  for (const p of placed) {
    const endR = p.direction === 'down' ? p.row + p.length - 1 : p.row;
    const endC = p.direction === 'across' ? p.col + p.length - 1 : p.col;
    minR = Math.min(minR, p.row);
    maxR = Math.max(maxR, endR);
    minC = Math.min(minC, p.col);
    maxC = Math.max(maxC, endC);
  }

  // Add 1 cell padding, capped at grid bounds
  const padMinR = Math.max(0, minR - 1);
  const padMaxR = Math.min(maxSize - 1, maxR + 1);
  const padMinC = Math.max(0, minC - 1);
  const padMaxC = Math.min(maxSize - 1, maxC + 1);

  const height = padMaxR - padMinR + 1;
  const width = padMaxC - padMinC + 1;

  const trimmed: string[][] = [];
  for (let r = padMinR; r <= padMaxR; r++) {
    const row: string[] = [];
    for (let c = padMinC; c <= padMaxC; c++) {
      row.push(grid[r][c]);
    }
    trimmed.push(row);
  }

  // Adjust placed word coordinates
  const adjustedPlaced = placed.map(p => ({
    ...p,
    row: p.row - padMinR,
    col: p.col - padMinC,
  }));

  return {grid: trimmed, placed: adjustedPlaced, width, height};
}

interface NumberResult {
  cells: CrosswordCell[][];
  across: CrosswordAnswer[];
  down: CrosswordAnswer[];
}

/**
 * Assign clue numbers and build CrosswordCell grid + answer lists.
 */
export function numberGrid(
  grid: string[][],
  placed: PlacedWord[],
  width: number,
  height: number,
): NumberResult {
  // Build cells
  const cells: CrosswordCell[][] = Array.from({length: height}, (_, r) =>
    Array.from({length: width}, (_, c) => ({
      letter: grid[r][c] || null,
      number: null,
      isAcross: false,
      isDown: false,
    })),
  );

  // Build lookup for placed words by start position
  const acrossMap = new Map<string, PlacedWord>();
  const downMap = new Map<string, PlacedWord>();

  for (const p of placed) {
    const key = `${p.row},${p.col}`;
    if (p.direction === 'across') {
      acrossMap.set(key, p);
    } else {
      downMap.set(key, p);
    }
  }

  // Scan left-to-right, top-to-bottom for numbering
  let num = 1;
  const across: CrosswordAnswer[] = [];
  const down: CrosswordAnswer[] = [];

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (!grid[r][c]) continue;

      const key = `${r},${c}`;
      const isAcrossStart = acrossMap.has(key);
      const isDownStart = downMap.has(key);

      if (isAcrossStart || isDownStart) {
        cells[r][c].number = num;
        cells[r][c].isAcross = isAcrossStart;
        cells[r][c].isDown = isDownStart;

        if (isAcrossStart) {
          const pw = acrossMap.get(key)!;
          across.push({
            number: num,
            direction: 'across',
            clue: pw.clue,
            word: pw.word,
            row: pw.row,
            col: pw.col,
            length: pw.length,
          });
        }

        if (isDownStart) {
          const pw = downMap.get(key)!;
          down.push({
            number: num,
            direction: 'down',
            clue: pw.clue,
            word: pw.word,
            row: pw.row,
            col: pw.col,
            length: pw.length,
          });
        }

        num++;
      }
    }
  }

  return {cells, across, down};
}
