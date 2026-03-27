import type {Word} from './types';

// Raw shape from seed-words.json
interface RawSeedWord {
  id: number;
  word: string;
  pronunciation: string | null;
  part_of_speech: string | null;
  definition: string;
  etymology: string | null;
  example_1: string | null;
  example_2: string | null;
  category: string | null;
  difficulty: string;
  kid_safe: boolean;
  mastery: number;
}

const DIFFICULTY_MAP: Record<string, number> = {
  beginner: 1,
  intermediate: 3,
  advanced: 5,
};

export function parseSeedWords(raw: RawSeedWord[]): Omit<Word, 'id'>[] {
  return raw.map(w => ({
    word: w.word,
    pronunciation: w.pronunciation,
    part_of_speech: w.part_of_speech,
    definition: w.definition,
    etymology: w.etymology,
    example_1: w.example_1,
    example_2: w.example_2,
    usage_note: null,
    category: w.category,
    difficulty: DIFFICULTY_MAP[w.difficulty] ?? 3,
    kid_safe: w.kid_safe ? 1 : 0,
    kid_definition: null,
    kid_fun_fact: null,
  }));
}

// The actual seed data is loaded from hunts/more-words/assets/seed-words.json
// and passed through parseSeedWords() at init time.
// In a React Native context this will be bundled as a require() asset.
