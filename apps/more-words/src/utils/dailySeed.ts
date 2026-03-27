/**
 * djb2 hash — deterministic hash of a string to a number.
 * Used to generate a consistent daily seed for the crossword.
 */
export function hashString(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Simple seeded PRNG (Linear Congruential Generator).
 * Returns a function that produces deterministic numbers [0, 1).
 */
export function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return (s >>> 0) / 4294967296;
  };
}

/**
 * Get today's date string in YYYY-MM-DD format.
 */
export function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Deterministic shuffle using a seeded PRNG.
 */
export function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  const rng = seededRandom(seed);
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
