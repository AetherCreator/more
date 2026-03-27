# Clue 7: Fill in the Blank — COMPLETE

## Pass Conditions
- [x] Sentence renders with blank correctly (regex word replacement)
- [x] 4 options render (1 correct, 3 distractors)
- [x] Correct feedback: green flash + "Correct!" message
- [x] Wrong feedback: red flash + correct answer revealed
- [x] Difficulty escalation changes distractor similarity
- [x] 10 question session with spaced repetition weighting
- [x] Score calculates correctly (+10 correct, -2 wrong, min 0)
- [x] Mastery updates correctly
- [x] getDistractors() in engine package works correctly
- [x] Kid mode uses simplified sentences (kid_definition fallback)
- [x] Requires 10+ deck words (gated by PlayScreen)
- [x] No console errors

## getDistractors() Implementation
In `packages/engine/src/index.ts`:
- **mastery 0-1 (easy):** Score by different category + word length difference → pick least similar
- **mastery 2-3 (medium):** Prefer same category, random otherwise
- **mastery 4-5 (hard):** Same category + similar difficulty level
- Always shuffled, always 3 distractors + 1 correct = 4 options

## Difficulty Escalation Logic
Driven by the saved word's mastery level:
- Low mastery → easy distractors (very different words)
- Mid mastery → medium distractors (same category)
- High mastery → hard distractors (same category + similar difficulty)

## All 3 Games Now Live
Play tab shows:
1. Flashcards (🃏) — flip and rate
2. Match Game (🔗) — pair words with definitions
3. Fill in the Blank (✏️) — complete the sentence
All gated behind 10 saved words.

## Next
Open `hunts/more-words/clue-8/PROMPT.md` — Crossword Generator.
