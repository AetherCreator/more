# Clue 4: Personal Deck + All 3 Games

## ⚠️ Read First
Open `hunts/more-words-pwa/clue-3/COMPLETE.md` and load its contents.
If it does not exist — STOP. Do not proceed.

## Context
Feed works. Now build the deck and all 3 games. The game logic is already written in packages/engine — import it, don't rewrite it.

## ⚠️ Import from packages, do not rewrite
- Spaced repetition: `import { buildFlashcardSession, updateMastery } from '@more/engine'`
- Check packages/engine/src/index.ts for exact exports

## Files to Create/Modify
- `apps/more-words-pwa/src/screens/DeckScreen.tsx` — replace placeholder
- `apps/more-words-pwa/src/screens/PlayScreen.tsx` — game picker
- `apps/more-words-pwa/src/screens/FlashcardScreen.tsx`
- `apps/more-words-pwa/src/screens/MatchGameScreen.tsx`
- `apps/more-words-pwa/src/screens/FillBlankScreen.tsx`

## Deck Screen
- List of saved words with mastery dots (0-3 filled dots)
- Filter by category and difficulty
- Tap word to see full WordCard

## Play Screen
- 3 game buttons: Flashcard, Match, Fill in the Blank
- Each opens its own screen

## Flashcard Game
- Use buildFlashcardSession() from @more/engine (surfaces lower-mastery words more)
- Flip card: word → definition on tap
- 3 buttons: Know It / Almost / Still Learning
- updateMastery() after each card
- Session ends after 10 cards, shows score

## Match Game
- 8 saved words → 16 tiles (word + definition pairs)
- Tap word, tap its definition → correct pair disappears
- Timer counts up, score = base points minus time penalty
- Reference: apps/more-words/src/screens/MatchGameScreen.tsx for logic

## Fill in the Blank
- Sentence with word blanked out, 4 multiple choice options
- Correct = mastery +1
- Reference: apps/more-words/src/screens/FillBlankScreen.tsx for logic

## Pass Conditions
- [ ] Deck shows all saved words with correct mastery dots
- [ ] Flashcard session builds from @more/engine (lower mastery = appears more)
- [ ] Mastery updates correctly in DB after each flashcard response
- [ ] Match game: 8 pairs render, correct matches disappear, score calculated
- [ ] Fill in blank: 4 options shown, correct answer updates mastery
- [ ] All games gracefully handle < 4 saved words (show "save more words" message)

## Do Not
- Do not rewrite the spaced repetition algorithm — import from @more/engine
- Do not build crossword yet — that is Clue 5
- Do not build profiles yet — still using default profile

## When You Pass
Write clue-4/COMPLETE.md: confirmed all 3 games work, mastery updates in DB.
Then open clue-5/PROMPT.md.
