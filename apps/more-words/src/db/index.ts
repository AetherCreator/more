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
  getAllProfiles,
  createProfile,
  updateProfile,
  deleteProfile,
  getSetting,
  setSetting,
} from './database';

export type {Word, SavedWord, Profile, Setting} from './types';
