export interface Word {
  id: number;
  word: string;
  pronunciation: string | null;
  part_of_speech: string | null;
  definition: string;
  etymology: string | null;
  example_1: string | null;
  example_2: string | null;
  usage_note: string | null;
  category: string | null;
  difficulty: number;
  kid_safe: number;
  kid_definition: string | null;
  kid_fun_fact: string | null;
}

export interface SavedWord {
  id: number;
  profile_id: number;
  word_id: number;
  saved_at: string;
  mastery: number;
  last_reviewed: string | null;
  word?: Word;
}

export interface Profile {
  id: number;
  name: string;
  is_kid: number;
  theme: string;
  interests: string;
  streak: number;
  last_active: string | null;
}

export interface Setting {
  key: string;
  value: string;
}
