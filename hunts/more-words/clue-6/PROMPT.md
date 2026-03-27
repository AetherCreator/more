# Clue 6: Match Game

## ⚠️ Read First
Open `hunts/more-words/clue-5/COMPLETE.md` and load its contents before reading anything else.
If that file does not exist — STOP. Clue 5 has not been completed. Do not proceed.

## Context
Flashcard game works. Spaced repetition engine lives in packages/engine/. Play tab exists with game selection. Now add the Match game — tap a word, tap its definition.

## Your Task
Build the Match game.

### Match Game Screen
8 word-definition pairs split into two columns:
- Left column: 8 words (shuffled)
- Right column: 8 definitions (shuffled differently)

**Interaction:**
- Tap a word → highlights it (gold border)
- Tap a definition → checks if it matches the selected word
- Correct match → both items flash green, then disappear
- Wrong match → both items flash red briefly, deselect, stay on board
- Complete all 8 → session end screen

**Timed mode** (toggle before starting):
- 60 second countdown timer at top
- Timer turns red under 10 seconds
- Time runs out → show score with "Time's up!"

**Score:**
- Base: 10 points per correct match
- Speed bonus: +5 if matched in under 3 seconds
- Streak bonus: consecutive correct matches multiply (×1.5, ×2)

**Session complete:**
- Final score
- Time taken (or "No timer" if timed mode off)
- Best score for this word set (persisted)
- "Play again" shuffles same words, "New words" picks fresh 8

### Word Selection
Pull 8 words from saved deck using spaced repetition weighting (reuse buildFlashcardSession from packages/engine/ — take first 8 from the session order).

### Mastery Update
Correct match on first try → mastery +1
Correct match after wrong attempt → mastery unchanged
Never matched → mastery -1 (after session complete)

### Kid mode
Larger tap targets. Simpler definitions. No timed mode by default (can enable).

## Files to Create/Modify
- `apps/more-words/src/screens/MatchGameScreen.tsx`
- `apps/more-words/src/screens/PlayScreen.tsx` — add Match game option

## Pass Conditions
- [ ] 8 word-definition pairs render in two columns
- [ ] Tap word → highlights, tap definition → checks match
- [ ] Correct match disappears with green flash
- [ ] Wrong match flashes red, stays on board
- [ ] Timed mode countdown works
- [ ] Score calculates correctly with bonuses
- [ ] Session complete shows score + best score
- [ ] Best score persists across sessions
- [ ] Mastery updates correctly
- [ ] Requires 10+ deck words
- [ ] No console errors

## Do Not
- Build Fill in the Blank — Clue 7
- Build crosswords — Clues 8-9
- Add animations beyond the match flash

## When You Pass
Write `hunts/more-words/clue-6/COMPLETE.md` with:
- Score calculation logic
- How best score is persisted
- Mastery update rules implemented

Then open `hunts/more-words/clue-7/PROMPT.md`.
