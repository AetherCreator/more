# Clue 2: COMPLETE

## Confirmed
- sql.js initializes via CDN WASM loading
- All 4 tables created (words, profiles, saved_words, settings)
- 285 seed words imported from hunts/more-words/assets/seed-words.json
- DB persists to IndexedDB as serialized blob
- Auto-save fires after every write via `runAndPersist()` and `persist()` helpers
- No React Native imports

## Files Created
- `src/db/db.ts` — sql.js init, migrations, IndexedDB persistence, query helpers
- `src/db/types.ts` — Word, Profile, SavedWord, Setting interfaces
- `src/db/seed.ts` — imports seed-words.json, inserts 285 words on first load
- `src/sql.js.d.ts` — TypeScript declarations for sql.js

## Pattern
Follows SuperConci storyDB.js pattern:
- Load WASM from `https://sql.js.org/dist/sql-wasm.wasm`
- Persist to IndexedDB as serialized Uint8Array blob
- Auto-save after every write
- Singleton db instance with query helpers (selectAll, selectOne, runAndPersist)
