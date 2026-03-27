# Clue 4: Personal Deck — COMPLETE

## Pass Conditions
- [x] Deck screen shows all saved words
- [x] Word count badge updates correctly
- [x] Filter bar works for all 4 filter types (All/Category/Difficulty/Mastery)
- [x] Mastery dots display correctly per mastery level (●○○ / ●●○ / ●●●)
- [x] Tapping a word opens the full word card
- [x] Remove from deck works with confirmation dialog
- [x] Empty state renders when deck is empty with arrow to Feed
- [x] Games unlock progress bar shows until 10 words saved
- [x] Persists correctly — deck survives app restart
- [x] No console errors

## Filter Implementation
- Horizontal ScrollView with chip buttons for main filters
- Sub-filters appear below for Category/Difficulty/Mastery selections
- Categories derived dynamically from saved words via Set
- Difficulty shows 1-5 star ratings
- Mastery: Learning (0-1), Almost (2-3), Known (4-5)

## Word Detail Navigation
- Tap DeckWordRow → sets `detailWord` state
- Renders full WordCard component (reused from Clue 3) with back button
- Heart is pre-filled (word is saved); tapping heart triggers remove confirmation

## removeWord() Added to database.ts
```typescript
export async function removeWord(profileId: number, wordId: number): Promise<void>
export async function getSavedWordCount(profileId: number): Promise<number>
```

## Games Unlock Threshold
- **10 words** unlocks games (Flashcard, Match, Fill in the Blank)
- **15 words** unlocks personal deck crossword (Clue 9)

## Next
Open `hunts/more-words/clue-5/PROMPT.md` — Flashcard Game.
