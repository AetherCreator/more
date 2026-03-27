# Clue 7: Fill in the Blank

## ⚠️ Read First
Open `hunts/more-words/clue-6/COMPLETE.md` and load its contents before reading anything else.
If that file does not exist — STOP. Clue 6 has not been completed. Do not proceed.

## Context
Flashcard and Match games work. Play tab has two game options. Now add Fill in the Blank — the game that tests contextual understanding, not just definition recall.

## Your Task
Build the Fill in the Blank game.

### Fill in the Blank Screen
Shows a sentence from example_1 or example_2 with the target word replaced by a blank: ______

Below the sentence: 4 multiple choice buttons with word options.

**Word options:**
- 1 correct answer (the actual word)
- 3 distractors: other words from the deck with similar difficulty/category

**Interaction:**
- Tap an option → immediate feedback
- Correct: button flashes green, brief "Correct!" message, next question after 1 second
- Wrong: button flashes red, correct answer highlights green, "The word was [word]" shown briefly, next question after 1.5 seconds

**Session:** 10 questions drawn from deck using spaced repetition weighting.

**Difficulty escalation:**
- Mastery 0-1: distractors are very different (different category, different length)
- Mastery 2-3: distractors are similar category
- Mastery 4-5: distractors are same category + similar difficulty (hard mode)

**Score:** 10 points per correct, -2 for wrong answer (can't go below 0).

**Session complete:** Score, breakdown, mastery updates shown.

### Kid Mode
Uses kid_definition sentences if available, otherwise uses example_1.
Distractors are simpler words.
Visual feedback is more celebratory (larger text, brighter colors).

### Mastery Updates
Correct on first try → mastery +1
Correct after wrong → mastery unchanged
Wrong → mastery -1 (min 0)

### Generating Distractors
Function in packages/engine/src/index.ts:
```typescript
export const getDistractors: (
  targetWord: Word,
  allDeckWords: Word[],
  masteryLevel: number,
  count: number
) => Word[]
```
Uses mastery level to determine how similar distractors should be.

## Files to Create/Modify
- `apps/more-words/src/screens/FillBlankScreen.tsx`
- `apps/more-words/src/screens/PlayScreen.tsx` — add Fill in the Blank option
- `packages/engine/src/index.ts` — add getDistractors()

## Pass Conditions
- [ ] Sentence renders with blank correctly
- [ ] 4 options render (1 correct, 3 distractors)
- [ ] Correct feedback: green flash + brief message
- [ ] Wrong feedback: red flash + correct answer revealed
- [ ] Difficulty escalation changes distractor similarity
- [ ] 10 question session with spaced repetition weighting
- [ ] Score calculates correctly
- [ ] Mastery updates correctly
- [ ] getDistractors() in engine package works correctly
- [ ] Kid mode uses simplified sentences
- [ ] Requires 10+ deck words
- [ ] No console errors

## Do Not
- Build crossword generator — Clue 8
- Add sound effects
- Build the achievement/badge system — future feature

## When You Pass
Write `hunts/more-words/clue-7/COMPLETE.md` with:
- getDistractors() implementation approach
- Difficulty escalation logic
- All 3 games now live — confirm Play tab shows all 3

Then open `hunts/more-words/clue-8/PROMPT.md`.
