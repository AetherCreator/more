# Clue 2: sql.js Database

## ⚠️ Read First
Open `hunts/more-words-pwa/clue-1/COMPLETE.md` and load its contents.
If it does not exist — STOP. Do not proceed.

## Context
The PWA shell is running. Now set up the database layer.

## ⚠️ sql.js Reference (read before writing anything)
SuperConci already solved sql.js in the browser. Before writing any DB code, read:
`apps/more-words-pwa` should copy the init pattern from SuperConci's Story Quest db:
`github.com/AetherCreator/SuperConci` → `src/games/story-quest/db/storyDB.js`

Key patterns to copy:
- Load sql.js WASM from CDN: `https://sql.js.org/dist/sql-wasm.wasm`
- Persist to IndexedDB as serialized blob
- Auto-save after every write
- Export singleton db instance + query helpers

## ⚠️ Seed Data (pre-generated — do NOT write manually)
Seed words are at: `hunts/more-words/assets/seed-words.json` (285 words)
Import this file. Do NOT write word data from scratch — it will timeout.

## Files to Create
- `apps/more-words-pwa/src/db/db.ts` — sql.js init, migrations, persist to IndexedDB
- `apps/more-words-pwa/src/db/types.ts` — COPY UNCHANGED from `apps/more-words/src/db/types.ts`
- `apps/more-words-pwa/src/db/seed.ts` — imports seed-words.json, runs importSeedWords()

## Schema (4 tables — same as RN build)
```sql
CREATE TABLE IF NOT EXISTS words (
  id INTEGER PRIMARY KEY,
  word TEXT NOT NULL,
  pronunciation TEXT,
  part_of_speech TEXT,
  definition TEXT NOT NULL,
  etymology TEXT,
  example_1 TEXT,
  example_2 TEXT,
  category TEXT,
  difficulty TEXT DEFAULT 'intermediate',
  kid_safe INTEGER DEFAULT 1,
  mastery INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  is_kid INTEGER DEFAULT 0,
  theme TEXT DEFAULT 'midnight',
  interests TEXT DEFAULT '',
  streak INTEGER DEFAULT 0,
  last_active TEXT
);

CREATE TABLE IF NOT EXISTS saved_words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  profile_id INTEGER NOT NULL,
  word_id INTEGER NOT NULL,
  saved_at TEXT DEFAULT (datetime('now')),
  mastery INTEGER DEFAULT 0,
  last_reviewed TEXT
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
```

## Pass Conditions
- [ ] sql.js initializes without errors in browser
- [ ] All 4 tables created on first load
- [ ] 285 seed words imported from seed-words.json
- [ ] Query: `SELECT COUNT(*) FROM words` returns 285
- [ ] DB persists across page refreshes (IndexedDB blob)
- [ ] Auto-save fires after every write operation
- [ ] No React Native imports

## Do Not
- Do not build UI yet — this clue is data layer only
- Do not write seed words manually — import from the JSON file

## When You Pass
Write clue-2/COMPLETE.md: confirmed word count, confirmed persistence, sql.js version used.
Then open clue-3/PROMPT.md.
