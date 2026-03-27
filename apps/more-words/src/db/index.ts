export {
  initDB,
  getDBPath,
  getWordsByCategory,
  getDailyWords,
  saveWord,
  getSavedWords,
  updateMastery,
  getDefaultProfile,
} from './database';

export type {Word, SavedWord, Profile, Setting} from './types';
