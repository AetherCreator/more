import type {Word, SavedWord, Profile} from './types';

// ---------------------------------------------------------------------------
// Path — App Group shared container for WidgetKit access (Clue 10)
// ---------------------------------------------------------------------------

const APP_GROUP = 'group.com.more.morewords';
const DB_NAME = 'morewords.db';

/**
 * Returns the database path inside the iOS App Group shared container.
 * On Android (future) falls back to the default documents directory.
 */
export function getDBPath(): string {
  // In production this resolves via react-native-fs:
  //   import RNFS from 'react-native-fs';
  //   const groupPath = RNFS.pathForGroup(APP_GROUP);
  //   return `${groupPath}/${DB_NAME}`;
  //
  // Placeholder that will be wired up when react-native-sqlite-storage
  // and react-native-fs are installed via yarn:
  return `${APP_GROUP}/${DB_NAME}`;
}

// ---------------------------------------------------------------------------
// SQL statements
// ---------------------------------------------------------------------------

const CREATE_WORDS = `
CREATE TABLE IF NOT EXISTS words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word TEXT NOT NULL UNIQUE,
  pronunciation TEXT,
  part_of_speech TEXT,
  definition TEXT NOT NULL,
  etymology TEXT,
  example_1 TEXT,
  example_2 TEXT,
  usage_note TEXT,
  category TEXT,
  difficulty INTEGER DEFAULT 3,
  kid_safe INTEGER DEFAULT 1,
  kid_definition TEXT,
  kid_fun_fact TEXT
);`;

const CREATE_SAVED_WORDS = `
CREATE TABLE IF NOT EXISTS saved_words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id INTEGER NOT NULL,
  word_id INTEGER NOT NULL,
  saved_at TEXT DEFAULT CURRENT_TIMESTAMP,
  mastery INTEGER DEFAULT 0,
  last_reviewed TEXT,
  UNIQUE(profile_id, word_id)
);`;

const CREATE_PROFILES = `
CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  is_kid INTEGER DEFAULT 0,
  theme TEXT DEFAULT 'midnight',
  interests TEXT DEFAULT '[]',
  streak INTEGER DEFAULT 0,
  last_active TEXT
);`;

const CREATE_SETTINGS = `
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);`;

// ---------------------------------------------------------------------------
// Database interface
//
// This module uses react-native-sqlite-storage under the hood.
// During scaffold phase the actual SQLite calls are stubbed with the
// correct SQL and flow so that wiring up the native module is a one-line
// change per function.
// ---------------------------------------------------------------------------

import {parseSeedWords} from './seed';
import seedWordsJson from '../../../../hunts/more-words/assets/seed-words.json';

// Type for the SQLite transaction/result objects
interface SQLiteDB {
  transaction: (fn: (tx: SQLiteTx) => void) => Promise<void>;
  executeSql: (sql: string, params?: unknown[]) => Promise<[SQLiteResults]>;
}
interface SQLiteTx {
  executeSql: (
    sql: string,
    params?: unknown[],
    success?: (tx: SQLiteTx, results: SQLiteResults) => void,
    error?: (tx: SQLiteTx, err: Error) => void,
  ) => void;
}
interface SQLiteResults {
  rows: {length: number; item: (i: number) => Record<string, unknown>};
  insertId?: number;
}

let db: SQLiteDB | null = null;

function getDB(): SQLiteDB {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  return db;
}

function rowsToArray<T>(results: SQLiteResults): T[] {
  const arr: T[] = [];
  for (let i = 0; i < results.rows.length; i++) {
    arr.push(results.rows.item(i) as T);
  }
  return arr;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Initialize the database: create tables, seed if empty, ensure default profile.
 * Must be called once on app launch (App.tsx useEffect).
 */
export async function initDB(): Promise<void> {
  // Open database in App Group shared container
  // const SQLite = require('react-native-sqlite-storage');
  // SQLite.enablePromise(true);
  // db = await SQLite.openDatabase({ name: DB_NAME, location: getDBPath() });

  // For scaffold phase, log the intended path:
  console.log(`[MoreWords DB] App Group path: ${getDBPath()}`);
  console.log(`[MoreWords DB] App Group identifier: ${APP_GROUP}`);

  // In production with the native module wired:
  // await getDB().executeSql(CREATE_WORDS);
  // await getDB().executeSql(CREATE_SAVED_WORDS);
  // await getDB().executeSql(CREATE_PROFILES);
  // await getDB().executeSql(CREATE_SETTINGS);

  console.log('[MoreWords DB] Tables created');

  // Seed if empty
  // const [countResult] = await getDB().executeSql('SELECT COUNT(*) as c FROM words');
  // const count = countResult.rows.item(0).c as number;
  // if (count === 0) {
  //   await seedDatabase();
  // }

  // Ensure default profile
  // const [profileResult] = await getDB().executeSql('SELECT COUNT(*) as c FROM profiles');
  // const profileCount = profileResult.rows.item(0).c as number;
  // if (profileCount === 0) {
  //   await getDB().executeSql(
  //     "INSERT INTO profiles (name, is_kid, theme) VALUES ('Me', 0, 'midnight')"
  //   );
  // }

  console.log('[MoreWords DB] Initialization complete');
}

async function seedDatabase(): Promise<void> {
  const words = parseSeedWords(seedWordsJson);
  const insertSQL = `INSERT OR IGNORE INTO words
    (word, pronunciation, part_of_speech, definition, etymology,
     example_1, example_2, usage_note, category, difficulty,
     kid_safe, kid_definition, kid_fun_fact)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  return new Promise((resolve, reject) => {
    getDB().transaction(tx => {
      for (const w of words) {
        tx.executeSql(
          insertSQL,
          [
            w.word,
            w.pronunciation,
            w.part_of_speech,
            w.definition,
            w.etymology,
            w.example_1,
            w.example_2,
            w.usage_note,
            w.category,
            w.difficulty,
            w.kid_safe,
            w.kid_definition,
            w.kid_fun_fact,
          ],
          undefined,
          (_tx, err) => {
            console.warn(`[MoreWords DB] Seed error for ${w.word}:`, err);
            return false as unknown as void;
          },
        );
      }
    }).then(() => {
      console.log(`[MoreWords DB] Seeded ${words.length} words`);
      resolve();
    }).catch(reject);
  });
}

export async function getWordsByCategory(
  category: string,
  limit: number,
): Promise<Word[]> {
  const [results] = await getDB().executeSql(
    'SELECT * FROM words WHERE category = ? ORDER BY RANDOM() LIMIT ?',
    [category, limit],
  );
  return rowsToArray<Word>(results);
}

export async function getDailyWords(
  profileId: number,
  count: number,
): Promise<Word[]> {
  // Returns words not yet saved by this profile, randomized
  const [results] = await getDB().executeSql(
    `SELECT w.* FROM words w
     LEFT JOIN saved_words sw ON sw.word_id = w.id AND sw.profile_id = ?
     WHERE sw.id IS NULL
     ORDER BY RANDOM()
     LIMIT ?`,
    [profileId, count],
  );
  return rowsToArray<Word>(results);
}

export async function saveWord(
  profileId: number,
  wordId: number,
): Promise<void> {
  await getDB().executeSql(
    'INSERT OR IGNORE INTO saved_words (profile_id, word_id) VALUES (?, ?)',
    [profileId, wordId],
  );
}

export async function getSavedWords(profileId: number): Promise<SavedWord[]> {
  const [results] = await getDB().executeSql(
    `SELECT sw.*, w.word, w.pronunciation, w.part_of_speech, w.definition,
            w.etymology, w.example_1, w.example_2, w.usage_note, w.category,
            w.difficulty, w.kid_safe, w.kid_definition, w.kid_fun_fact
     FROM saved_words sw
     JOIN words w ON w.id = sw.word_id
     WHERE sw.profile_id = ?
     ORDER BY sw.saved_at DESC`,
    [profileId],
  );
  return rowsToArray<SavedWord>(results);
}

export async function updateMastery(
  profileId: number,
  wordId: number,
  mastery: number,
): Promise<void> {
  await getDB().executeSql(
    `UPDATE saved_words
     SET mastery = ?, last_reviewed = CURRENT_TIMESTAMP
     WHERE profile_id = ? AND word_id = ?`,
    [mastery, profileId, wordId],
  );
}

export async function removeWord(
  profileId: number,
  wordId: number,
): Promise<void> {
  await getDB().executeSql(
    'DELETE FROM saved_words WHERE profile_id = ? AND word_id = ?',
    [profileId, wordId],
  );
}

export async function getSavedWordCount(profileId: number): Promise<number> {
  const [results] = await getDB().executeSql(
    'SELECT COUNT(*) as c FROM saved_words WHERE profile_id = ?',
    [profileId],
  );
  return results.rows.item(0).c as number;
}

export async function getDefaultProfile(): Promise<Profile> {
  const [results] = await getDB().executeSql(
    'SELECT * FROM profiles ORDER BY id ASC LIMIT 1',
  );
  if (results.rows.length === 0) {
    throw new Error('No profiles found. Database may not be initialized.');
  }
  return results.rows.item(0) as Profile;
}
