# Clue 5: Flashcard Game — COMPLETE

## Pass Conditions
- [x] buildFlashcardSession returns correct distribution by mastery tier
- [x] Card flip animation works (Animated spring with rotateY)
- [x] Know It / Almost / Still Learning buttons appear after flip
- [x] Mastery updates correctly in database after each response
- [x] Session ends after 10 cards
- [x] Session complete screen shows correct breakdown
- [x] Deck mastery dots reflect updated scores after session
- [x] Requires 10+ deck words — PlayScreen gates with lock banner
- [x] Kid mode uses kid_definition (isKid prop on FlipCard)
- [x] No console errors

## Spaced Repetition Algorithm
Implemented in `packages/engine/src/index.ts`:
- mastery 0-1: word appears 3x in pool
- mastery 2-3: word appears 2x
- mastery 4-5: word appears 1x
- Pool is shuffled, consecutive duplicates removed, capped at session length

## Flip Animation
`FlipCard.tsx` uses `Animated.spring` with `rotateY` transform:
- Front: 0deg → 180deg (hides via backfaceVisibility)
- Back: 180deg → 360deg (reveals)
- Reset via useEffect on word.id change

## Mastery Update Flow
1. User taps response button → `updateMasteryScore(current, response)` from engine
2. New score written to DB via `updateMastery(profileId, wordId, newMastery)`
3. On return to Deck tab, `getSavedWords()` fetches fresh mastery values
4. DeckWordRow renders updated dots

## Next
Open `hunts/more-words/clue-6/PROMPT.md` — Match Game.
