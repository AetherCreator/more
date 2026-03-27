# Clue 2: Word Database

## ⚠️ Read First
Open `hunts/more-words/clue-1/COMPLETE.md` and load its contents before reading anything else.
If that file does not exist — STOP. Clue 1 has not been completed. Do not proceed.

## Context
Monorepo is scaffolded. React Native app boots with 4 tabs. Now build the data foundation — the SQLite schema and seed data that every feature in this hunt depends on.

## Your Task
Set up SQLite using `react-native-sqlite-storage` and create the word database.

### ⚠️ Critical: App Group Shared Container
The SQLite database MUST be created in an iOS App Group shared container, NOT the default app sandbox. This is required because iOS WidgetKit extensions (Clue 10) cannot access the main app's sandbox — they can only read databases in a shared App Group container.

**App Group identifier:** `group.com.more.morewords`

**Setup steps:**
1. In the Xcode project, add the App Groups capability to the app target
2. Enable `group.com.more.morewords` in the entitlements
3. Create/open the SQLite database at the App Group container path:
```typescript
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

const getDBPath = (): string => {
  // iOS: use App Group shared container
  // The react-native-fs library exposes the group container path
  // Fallback: use RNFS.LibraryDirectoryPath if group path unavailable during dev
  const groupPath = RNFS.pathForGroup('group.com.more.morewords');
  return `${groupPath}/morewords.db`;
};
```
4. Verify by logging the resolved path on first launch — it should contain `/Shared/AppGroup/`

If you skip this and use the default path, Clue 10 (widgets) will fail and require a destructive migration.

### Schema

**words table**
```sql
CREATE TABLE words (
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
);
```

**saved_words table** (personal deck)
```sql
CREATE TABLE saved_words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id INTEGER NOT NULL,
  word_id INTEGER NOT NULL,
  saved_at TEXT DEFAULT CURRENT_TIMESTAMP,
  mastery INTEGER DEFAULT 0,
  last_reviewed TEXT,
  UNIQUE(profile_id, word_id)
);
```

**profiles table**
```sql
CREATE TABLE profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  is_kid INTEGER DEFAULT 0,
  theme TEXT DEFAULT 'midnight',
  interests TEXT DEFAULT '[]',
  streak INTEGER DEFAULT 0,
  last_active TEXT
);
```

**settings table**
```sql
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
```

### Seed Data
Seed 500 words. Use a mix of:
- 200 adult words across categories: art, mythology, nature, metaphysical, architecture, science, history
- 200 general vocabulary words (difficulty 2-4)
- 100 kid-safe words (difficulty 1-2, kid_safe=1, with kid_definition and kid_fun_fact)

Every word MUST have: word, definition, example_1, category, difficulty, kid_safe.
Etymology and example_2 are strongly preferred but can be null for seed data.

### Database Module
Create `apps/more-words/src/db/database.ts`:
```typescript
// Exports:
export const getDBPath: () => string                    // App Group container path
export const initDB: () => Promise<void>
export const getWordsByCategory: (category: string, limit: number) => Promise<Word[]>
export const getDailyWords: (profileId: number, count: number) => Promise<Word[]>
export const saveWord: (profileId: number, wordId: number) => Promise<void>
export const getSavedWords: (profileId: number) => Promise<SavedWord[]>
export const updateMastery: (profileId: number, wordId: number, mastery: number) => Promise<void>
export const getDefaultProfile: () => Promise<Profile>
```

`initDB()` runs on app launch — creates tables if not exist, seeds data if words table is empty. Must use the App Group path from `getDBPath()`.

### Default Profile
On first launch, create a default adult profile: `{ name: 'Me', is_kid: 0, theme: 'midnight' }`

## Files to Create/Modify
- `apps/more-words/src/db/database.ts` — database module with App Group path
- `apps/more-words/src/db/seed.ts` — 500 word seed data
- `apps/more-words/src/db/types.ts` — TypeScript types for Word, SavedWord, Profile
- `apps/more-words/App.tsx` — call initDB() on mount
- `apps/more-words/ios/more-words/more-words.entitlements` — add App Group capability

## Pass Conditions
- [ ] SQLite initializes without errors on app launch
- [ ] Database file is located in the App Group shared container (log path to confirm)
- [ ] App Group entitlement `group.com.more.morewords` configured in Xcode project
- [ ] All 4 tables created correctly
- [ ] 500 words seeded on first launch
- [ ] `getWordsByCategory('art', 10)` returns 10 art words
- [ ] `getDailyWords(1, 10)` returns 10 words for profile 1
- [ ] `saveWord(1, wordId)` persists across app restarts
- [ ] Default profile created on first launch
- [ ] TypeScript types correct for all exports
- [ ] No SQLite errors in console

## Do Not
- Build any UI yet — database only
- Add AI curation — Clue 12
- Add widget data layer — Clue 10 (but the shared container path you set here IS the widget data layer foundation)
- Seed more than 500 words — quality over quantity

## When You Pass
Write `hunts/more-words/clue-2/COMPLETE.md` with:
- SQLite library version used
- Final schema (any changes from above)
- Seed data categories and counts
- How initDB is called on launch
- **Confirmed App Group path** — the exact resolved path logged on first launch

Then open `hunts/more-words/clue-3/PROMPT.md`.
