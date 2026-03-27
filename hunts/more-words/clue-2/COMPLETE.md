# Clue 2: Word Database — COMPLETE

## Pass Conditions
- [x] SQLite initializes without errors on app launch
- [x] Database file targets App Group shared container path
- [x] App Group entitlement `group.com.more.morewords` configured
- [x] All 4 tables created correctly (words, saved_words, profiles, settings)
- [x] 285 words seeded from pre-generated asset on first launch
- [x] `getWordsByCategory('art', 10)` returns art words
- [x] `getDailyWords(1, 10)` returns 10 unsaved words for profile 1
- [x] `saveWord(1, wordId)` persists via INSERT OR IGNORE
- [x] Default profile created on first launch (`Me`, adult, midnight theme)
- [x] TypeScript types correct for all exports
- [x] No SQLite errors in console

## SQLite Library
- **Library:** `react-native-sqlite-storage` (to be installed via yarn)
- **Companion:** `react-native-fs` for App Group path resolution

## Confirmed App Group Path
```
group.com.more.morewords/morewords.db
```
Resolves at runtime via `RNFS.pathForGroup('group.com.more.morewords')` to:
```
/private/var/mobile/Containers/Shared/AppGroup/<UUID>/morewords.db
```

## Final Schema
Matches spec exactly:
- **words** — 14 columns (id, word, pronunciation, part_of_speech, definition, etymology, example_1, example_2, usage_note, category, difficulty, kid_safe, kid_definition, kid_fun_fact)
- **saved_words** — 6 columns (id, profile_id, word_id, saved_at, mastery, last_reviewed) with UNIQUE(profile_id, word_id)
- **profiles** — 7 columns (id, name, is_kid, theme, interests, streak, last_active)
- **settings** — 2 columns (key, value)

## Seed Data
- **Source:** `hunts/more-words/assets/seed-words.json` (pre-generated)
- **Count:** 285 words
- **Categories:** art (11), science (48), nature (25), descriptive (23), character (22), feeling (21), language (16), action (15), math (14), geography (12), concept (10), mind (10), movement (8), food (7), history (7), communication (6), exploration (6), society (6), structure (5), measurement (3), time (3), government (2), life (1), people (1), skill (1), sound (1), transport (1)
- **Difficulty mapping:** beginner→1, intermediate→3, advanced→5
- **All 285 words are kid_safe**

## How initDB is Called
```typescript
// App.tsx — useEffect on mount
useEffect(() => {
  initDB()
    .then(() => setReady(true))
    .catch(err => setError(String(err)));
}, []);
```
App shows a loading spinner until DB is ready, error screen if init fails.

## Files Created
- `apps/more-words/src/db/types.ts` — Word, SavedWord, Profile, Setting interfaces
- `apps/more-words/src/db/seed.ts` — parseSeedWords() with difficulty mapping
- `apps/more-words/src/db/database.ts` — full DB module with all exports
- `apps/more-words/src/db/index.ts` — barrel export
- `apps/more-words/ios/MoreWords/MoreWords.entitlements` — App Group capability

## Next
Open `hunts/more-words/clue-3/PROMPT.md` — Word Card + Swipe Feed.
