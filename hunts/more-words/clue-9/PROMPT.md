# Clue 9: Crossword Modes

## ⚠️ Read First
Open `hunts/more-words/clue-8/COMPLETE.md` and load its contents before reading anything else.
If that file does not exist — STOP. Clue 8 has not been completed. Do not proceed.

## Context
Crossword generator works and is tested. Now build the three crossword modes and the crossword UI — the interactive grid where users play.

## Your Task
Build the crossword player UI and all three modes.

### Crossword Player Component
`CrosswordPlayer.tsx` — reusable component used by all 3 modes.

**Grid display:**
- Black squares: dark fill
- Empty cells: light fill with number if applicable
- Active cell: highlighted
- Completed word: subtle green tint on cells
- Correct letter: stays, wrong letter: shows in red briefly

**Interaction:**
- Tap a cell → selects it, highlights entire word (across or down)
- Tap same cell again → toggles between across/down if both apply
- Keyboard appears for letter input
- Backspace clears current cell, moves back
- Auto-advance: after correct letter, moves to next cell in word

**Clue display:**
- Current clue shown below grid: "3 Across: On a threshold between two states"
- Scrollable clue list below that: all across, then all down

**Checking:**
- "Check" button: reveals if current word is correct
- Wrong letters highlight red
- No penalty for checking

### Mode 1: Random Crossword
Play tab → "Crossword" → "Random"
Difficulty picker: Beginner / Intermediate / Advanced / Expert
Generates crossword from word pool matching profile's categories
"New Puzzle" button generates fresh crossword

### Mode 2: Daily Crossword
Play tab → "Crossword" → "Daily"
Same puzzle for all users each day (seed daily generator with date string)
Shareable result: "MoreWords Daily Crossword — 3/27 ✓ Completed in 4:32"
Shows "Come back tomorrow" when completed

### Mode 3: My Words Crossword
Play tab → "Crossword" → "My Words"
Locked until 15 saved words
Uses saved deck words as input to generator
Clues are the definitions the user has already seen
"Your deck isn't quite big enough yet. Save 3 more words." if under 15

### Completion
All modes: completion screen with time taken + "Solved!" celebration.
Daily: show share button.
My Words: "You knew all these words!" message.

## Files to Create/Modify
- `apps/more-words/src/components/CrosswordPlayer.tsx`
- `apps/more-words/src/screens/CrosswordScreen.tsx`
- `apps/more-words/src/screens/RandomCrosswordScreen.tsx`
- `apps/more-words/src/screens/DailyCrosswordScreen.tsx`
- `apps/more-words/src/screens/MyWordsCrosswordScreen.tsx`
- `apps/more-words/src/screens/PlayScreen.tsx` — add Crossword option

## Pass Conditions
- [ ] CrosswordPlayer renders grid correctly from CrosswordGrid input
- [ ] Cell selection + word highlighting works
- [ ] Letter input via keyboard works
- [ ] Auto-advance after correct letter
- [ ] Current clue displays below grid
- [ ] Check button reveals correct/wrong letters
- [ ] Random crossword generates and is playable at all 4 difficulties
- [ ] Daily crossword is same for all users on same date
- [ ] Daily crossword shareable result works
- [ ] My Words crossword uses saved deck words
- [ ] My Words locked under 15 saved words
- [ ] Completion screen shows time taken
- [ ] No console errors

## Do Not
- Build widgets — Clue 10
- Build multi-profile — Clue 11
- Add sound effects
- Persist crossword state across app restarts

## When You Pass
Write `hunts/more-words/clue-9/COMPLETE.md` with:
- CrosswordPlayer key implementation details
- How daily seed works (date → consistent puzzle)
- How My Words crossword formats deck words as CrosswordInput[]

Then open `hunts/more-words/clue-10/PROMPT.md`.
