// @more/ai — Claude API curation layer

export const AI_VERSION = '0.1.0';

export interface CurationRequest {
  interests: string[];
  profileType: 'adult' | 'kid';
  existingWords?: string[];
}

export interface CuratedWord {
  word: string;
  relevanceScore: number;
}

export async function curateWords(
  _request: CurationRequest,
): Promise<CuratedWord[]> {
  // Placeholder — implemented in Clue 12
  return [];
}
