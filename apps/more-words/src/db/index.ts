export {
  initDB,
  getDBPath,
  getWordsByCategory,
  getDailyWords,
  saveWord,
  getSavedWords,
  updateMastery,
  removeWord,
  getSavedWordCount,
  getDefaultProfile,
} from './database';

export type {Word, SavedWord, Profile, Setting} from './types';
