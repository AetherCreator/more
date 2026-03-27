// @more/ai — Claude API curation layer

export const AI_VERSION = '0.1.0';

export interface CurationRequest {
  interests: string[];
  existingDeckWords: string[];
  count: number;
  isKid: boolean;
}

export interface CuratedWordResult {
  wordIds: number[];
}

/**
 * Pre-filter candidates from the database, then call Claude API
 * to select the most engaging words for this user's interests.
 *
 * IMPORTANT: Pre-filters to ≤100 candidates before API call.
 * Sends condensed format to minimize tokens.
 */
export async function getAICuratedWords(
  candidates: Array<{id: number; word: string; category: string | null}>,
  interests: string[],
  count: number,
): Promise<number[]> {
  // Condensed format: "id|word|category" per line
  const wordList = candidates
    .map(w => `${w.id}|${w.word}|${w.category || 'general'}`)
    .join('\n');

  const systemPrompt = `You are a vocabulary curator for the MoreWords app. Given a user's interests and a list of candidate words (pre-filtered by category), select the ${count} most engaging and interesting words for this user. Prioritize: variety within their interests, words with rich etymology or surprising meanings, and a mix of difficulties. Return ONLY a JSON array of word IDs, nothing else. Example: [42, 17, 93, 5]`;

  const userPrompt = `Interests: [${interests.join(', ')}]. Select ${count} words from these candidates:\n${wordList}`;

  try {
    // In production, call Claude API:
    // const response = await fetch('https://api.anthropic.com/v1/messages', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'x-api-key': process.env.ANTHROPIC_API_KEY!,
    //     'anthropic-version': '2023-06-01',
    //   },
    //   body: JSON.stringify({
    //     model: 'claude-sonnet-4-20250514',
    //     max_tokens: 256,
    //     system: systemPrompt,
    //     messages: [{role: 'user', content: userPrompt}],
    //   }),
    // });
    // const data = await response.json();
    // const text = data.content[0].text;
    // return JSON.parse(text) as number[];

    // Fallback: return first N candidates (category-weighted)
    console.log('[AI] Claude API not configured — using static fallback');
    return staticFallback(candidates, count);
  } catch (err) {
    console.warn('[AI] Curation failed, falling back to static:', err);
    return staticFallback(candidates, count);
  }
}

/**
 * Graceful fallback when AI is unavailable.
 * Selects words with category variety and random ordering.
 */
function staticFallback(
  candidates: Array<{id: number; word: string; category: string | null}>,
  count: number,
): number[] {
  // Shuffle for variety
  const shuffled = [...candidates];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Pick with category diversity
  const result: number[] = [];
  const usedCategories = new Set<string>();

  // First pass: one per category
  for (const w of shuffled) {
    if (result.length >= count) break;
    const cat = w.category || 'general';
    if (!usedCategories.has(cat)) {
      result.push(w.id);
      usedCategories.add(cat);
    }
  }

  // Fill remaining
  for (const w of shuffled) {
    if (result.length >= count) break;
    if (!result.includes(w.id)) {
      result.push(w.id);
    }
  }

  return result.slice(0, count);
}

/**
 * Check if AI curation refresh is needed (weekly).
 */
export function shouldRefreshCuration(lastRefreshDate: string | null): boolean {
  if (!lastRefreshDate) return true;
  const last = new Date(lastRefreshDate);
  const now = new Date();
  const daysSince = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
  return daysSince >= 7;
}
