# Clue 5: Crossword

## ⚠️ Read First
Open `hunts/more-words-pwa/clue-4/COMPLETE.md` and load its contents.
If it does not exist — STOP. Do not proceed.

## Context
All 3 games work. Now build the crossword — the most complex UI in the app.
The generator is already written and tested. Import it. Build the player UI.

## ⚠️ Import the generator, do not rewrite it
`import { generateCrossword } from '@more/crossword'`
The generator passed 8/8 tests at <2ms expert. Do not touch it.

## Files to Create/Modify
- `apps/more-words-pwa/src/components/CrosswordPlayer.tsx` — the grid UI
- `apps/more-words-pwa/src/screens/CrosswordScreen.tsx` — mode picker
- `apps/more-words-pwa/src/screens/RandomCrosswordScreen.tsx`
- `apps/more-words-pwa/src/screens/DailyCrosswordScreen.tsx`
- `apps/more-words-pwa/src/screens/MyWordsCrosswordScreen.tsx`
- `apps/more-words-pwa/src/utils/dailySeed.ts` — COPY from `apps/more-words/src/utils/dailySeed.ts`

## CrosswordPlayer Component
- Renders the grid from CrosswordGrid type
- Tap a cell → highlights the word, shows clue below grid
- Keyboard input fills selected cell (mobile: tap cell, type letter)
- Correct letters turn green, incorrect stay white
- Across/Down clue list below grid
- Input: CrosswordGrid object + onComplete callback

## 3 Crossword Modes
**Random:** generateCrossword() with random words from DB at selected difficulty (4 buttons: Beginner/Intermediate/Advanced/Expert)

**Daily:** Same crossword for all users on a given date. Use dailySeed.ts to generate a deterministic seed from today's date → select words → generateCrossword(). Same date = same puzzle.

**My Words:** Uses saved_words from current profile. Requires 15+ saved words. Show "Save 15 words to unlock" if under threshold.

## Pass Conditions
- [ ] Random crossword generates and renders at all 4 difficulties
- [ ] Daily crossword is identical on multiple page loads same day
- [ ] My Words crossword uses only saved words, unlocks at 15
- [ ] Tapping a cell highlights the full word and shows its clue
- [ ] Correct letters turn green
- [ ] generateCrossword imported from @more/crossword, not rewritten
- [ ] dailySeed.ts copied from RN build unchanged

## Do Not
- Do not rewrite the crossword generator
- Do not build profiles yet

## When You Pass
Write clue-5/COMPLETE.md: confirmed all 3 modes work, grid renders correctly.
Then open clue-6/PROMPT.md.
