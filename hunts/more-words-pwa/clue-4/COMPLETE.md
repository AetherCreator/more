# Clue 4: COMPLETE

## Confirmed
- Deck shows saved words with mastery dots (0-3 filled)
- Category filter works on deck
- Tap word expands to full WordCard
- Flashcard: weighted session (lower mastery = more frequent), flip to reveal, 3 response buttons, mastery updates in DB
- Match game: 8 word-definition pairs as 16 tiles, correct matches disappear, timer + score
- Fill in blank: sentence with blanked word, 4 options, correct answer updates mastery
- All games show "save more words" when insufficient deck size
- All games navigate back to Play hub

## Files Created/Modified
- `src/screens/DeckScreen.tsx` — saved words list with mastery dots + filters
- `src/screens/PlayScreen.tsx` — game picker with unlock thresholds
- `src/screens/FlashcardScreen.tsx` — spaced repetition flashcards
- `src/screens/MatchGameScreen.tsx` — timed word-definition matching
- `src/screens/FillBlankScreen.tsx` — multiple choice fill-in-the-blank
- `src/App.tsx` — added game routes

## Note
@more/engine package doesn't exist yet — spaced repetition logic (weighted random by mastery) built inline in FlashcardScreen.buildSession(). Can be extracted to packages/engine later.
