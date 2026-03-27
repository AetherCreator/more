// @more/engine — spaced repetition, mastery, streak logic

export const ENGINE_VERSION = '0.1.0';

// ---------------------------------------------------------------------------
// Types (mirrors db types but engine is standalone)
// ---------------------------------------------------------------------------

export interface EngineWord {
  id: number;
  word: string;
  definition: string;
  category: string | null;
  difficulty: number;
  kid_safe: number;
  kid_definition: string | null;
}

export interface EngineSavedWord {
  word_id: number;
  mastery: number;
  word?: EngineWord;
}

export type FlashcardResponse = 'know' | 'almost' | 'learning';

// ---------------------------------------------------------------------------
// Spaced Repetition — Flashcard Session Builder
// ---------------------------------------------------------------------------

/**
 * Builds a flashcard session ordered by spaced repetition priority.
 * - mastery 0-1: word appears up to 3x in the session
 * - mastery 2-3: word appears up to 2x
 * - mastery 4-5: word appears 1x
 * Shuffled within each tier. Capped at sessionLength.
 */
export function buildFlashcardSession(
  savedWords: EngineSavedWord[],
  sessionLength: number = 10,
): EngineSavedWord[] {
  const pool: EngineSavedWord[] = [];

  for (const sw of savedWords) {
    const reps = sw.mastery <= 1 ? 3 : sw.mastery <= 3 ? 2 : 1;
    for (let i = 0; i < reps; i++) {
      pool.push(sw);
    }
  }

  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  // Deduplicate consecutive same words, then cap
  const session: EngineSavedWord[] = [];
  let lastId = -1;
  for (const item of pool) {
    if (session.length >= sessionLength) break;
    if (item.word_id === lastId && pool.length > sessionLength) continue;
    session.push(item);
    lastId = item.word_id;
  }

  return session.slice(0, sessionLength);
}

// ---------------------------------------------------------------------------
// Mastery Score Updates
// ---------------------------------------------------------------------------

/**
 * Returns updated mastery score based on user response.
 * Know It: +1 (max 5)
 * Almost: unchanged
 * Still Learning: -1 (min 0)
 */
export function updateMasteryScore(
  current: number,
  response: FlashcardResponse,
): number {
  switch (response) {
    case 'know':
      return Math.min(5, current + 1);
    case 'almost':
      return current;
    case 'learning':
      return Math.max(0, current - 1);
  }
}

// ---------------------------------------------------------------------------
// Distractor Generation (for Fill in the Blank — Clue 7)
// ---------------------------------------------------------------------------

/**
 * Returns `count` distractor words for a Fill in the Blank question.
 * Difficulty determines how similar distractors are:
 * - mastery 0-1: very different (different category, different length)
 * - mastery 2-3: similar category
 * - mastery 4-5: same category + similar difficulty
 */
export function getDistractors(
  targetWord: EngineWord,
  allDeckWords: EngineWord[],
  masteryLevel: number,
  count: number = 3,
): EngineWord[] {
  const candidates = allDeckWords.filter(w => w.id !== targetWord.id);

  if (candidates.length <= count) return shuffle(candidates);

  let scored: {word: EngineWord; score: number}[];

  if (masteryLevel <= 1) {
    // Easy distractors — different category, different length
    scored = candidates.map(w => ({
      word: w,
      score:
        (w.category !== targetWord.category ? 0 : 10) +
        Math.abs(w.word.length - targetWord.word.length),
    }));
    scored.sort((a, b) => a.score - b.score);
  } else if (masteryLevel <= 3) {
    // Medium — prefer same category
    scored = candidates.map(w => ({
      word: w,
      score: w.category === targetWord.category ? 0 : 10,
    }));
    scored.sort((a, b) => a.score - b.score);
  } else {
    // Hard — same category + similar difficulty
    scored = candidates.map(w => ({
      word: w,
      score:
        (w.category === targetWord.category ? 0 : 20) +
        Math.abs(w.difficulty - targetWord.difficulty),
    }));
    scored.sort((a, b) => a.score - b.score);
  }

  return shuffle(scored.slice(0, count + 2)).slice(0, count).map(s => s.word);
}

// ---------------------------------------------------------------------------
// Streak
// ---------------------------------------------------------------------------

/**
 * Given the last active date, returns the updated streak count.
 * Same day: no change. Yesterday: streak + 1. Older: reset to 1.
 */
export function updateStreak(
  currentStreak: number,
  lastActive: Date | null,
): number {
  if (!lastActive) return 1;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const last = new Date(
    lastActive.getFullYear(),
    lastActive.getMonth(),
    lastActive.getDate(),
  );

  const diffDays = Math.floor(
    (today.getTime() - last.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffDays === 0) return currentStreak;
  if (diffDays === 1) return currentStreak + 1;
  return 1;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
