type Direction = 'across' | 'down';

interface PlacedWord {
  word: string;
  row: number;
  col: number;
  direction: Direction;
  length: number;
}

/**
 * Place a word onto the grid.
 */
export function placeWord(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: Direction,
): void {
  for (let i = 0; i < word.length; i++) {
    const r = direction === 'across' ? row : row + i;
    const c = direction === 'across' ? col + i : col;
    grid[r][c] = word[i];
  }
}

/**
 * Check if a placement is valid.
 */
export function isValidPlacement(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: Direction,
  maxSize: number,
): boolean {
  const len = word.length;

  // 1. Bounds check
  if (direction === 'across') {
    if (row < 0 || row >= maxSize || col < 0 || col + len > maxSize) return false;
  } else {
    if (col < 0 || col >= maxSize || row < 0 || row + len > maxSize) return false;
  }

  // 4. Head/tail collision
  if (direction === 'across') {
    if (col > 0 && grid[row][col - 1] !== '') return false;
    if (col + len < maxSize && grid[row][col + len] !== '') return false;
  } else {
    if (row > 0 && grid[row - 1][col] !== '') return false;
    if (row + len < maxSize && grid[row + len][col] !== '') return false;
  }

  let intersections = 0;

  for (let i = 0; i < len; i++) {
    const r = direction === 'across' ? row : row + i;
    const c = direction === 'across' ? col + i : col;
    const existing = grid[r][c];

    // 2. Letter conflict
    if (existing !== '' && existing !== word[i]) return false;

    if (existing === word[i] && existing !== '') {
      // This is an intersection — valid
      intersections++;
      continue;
    }

    // 3. Parallel adjacency — check cells perpendicular to direction
    if (direction === 'across') {
      // Check cells above and below
      if (r > 0 && grid[r - 1][c] !== '') return false;
      if (r < maxSize - 1 && grid[r + 1][c] !== '') return false;
    } else {
      // Check cells left and right
      if (c > 0 && grid[r][c - 1] !== '') return false;
      if (c < maxSize - 1 && grid[r][c + 1] !== '') return false;
    }
  }

  // Must have at least one intersection (except first word which is handled externally)
  // We allow 0 intersections here since the caller validates context
  return true;
}

/**
 * Score a potential placement. Higher = better.
 */
export function scorePlacement(
  grid: string[][],
  word: string,
  row: number,
  col: number,
  direction: Direction,
  maxSize: number,
  placed: PlacedWord[],
): number {
  let score = 0;
  const center = Math.floor(maxSize / 2);

  // Count intersections
  for (let i = 0; i < word.length; i++) {
    const r = direction === 'across' ? row : row + i;
    const c = direction === 'across' ? col + i : col;
    if (grid[r][c] === word[i] && grid[r][c] !== '') {
      score += 10;
    }
  }

  // Proximity to center
  const midR =
    direction === 'across' ? row : row + Math.floor(word.length / 2);
  const midC =
    direction === 'across' ? col + Math.floor(word.length / 2) : col;
  if (Math.abs(midR - center) <= 2 && Math.abs(midC - center) <= 2) {
    score += 3;
  }

  // Penalize grid expansion
  if (placed.length > 0) {
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

    const newEndR = direction === 'down' ? row + word.length - 1 : row;
    const newEndC = direction === 'across' ? col + word.length - 1 : col;
    const newMinR = Math.min(minR, row);
    const newMaxR = Math.max(maxR, newEndR);
    const newMinC = Math.min(minC, col);
    const newMaxC = Math.max(maxC, newEndC);

    const oldSpan = (maxR - minR + 1) * (maxC - minC + 1);
    const newSpan = (newMaxR - newMinR + 1) * (newMaxC - newMinC + 1);
    if (newSpan > oldSpan * 1.3) {
      score -= 5;
    }
  }

  return score;
}
