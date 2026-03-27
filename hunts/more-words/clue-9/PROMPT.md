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
Same puzzle for all users each day. Seed the generator deterministically using the date string as a hash seed:
```typescript
// Deterministic daily seed: hash "YYYY-MM-DD" to a number, use as PRNG seed
const dailySeed = hashDateString(new Date().toISOString().slice(0, 10));
// Use this seed to: (1) select which words from the pool, (2) shuffle order before passing to generator
// Any consistent hash function works — simple djb2 or similar
```
This ensures every user on the same day gets the same word selection AND the same grid layout.
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
- [ ] Clue 10 Pre-Research section written in COMPLETE.md with library recommendation, App Group confirmation, refresh strategy, and known limitations

## Do Not
- Build widgets — Clue 10
- Build multi-profile — Clue 11
- Add sound effects
- Persist crossword state across app restarts

## When You Pass
Write `hunts/more-words/clue-9/COMPLETE.md` with:
- CrosswordPlayer key implementation details
- How daily seed works (date → hash → consistent puzzle)
- How My Words crossword formats deck words as CrosswordInput[]

### Clue 10 Pre-Research (REQUIRED)
Before finishing COMPLETE.md, research and document the following for Clue 10 (Widget System). This research is mandatory — Clue 10 will fail without it.

1. **WidgetKit bridge library**: Evaluate `react-native-widget-extension`, `@baked-ai/react-native-widget-kit`, or writing a native Swift widget target. Document: which one you recommend, why, and any known issues with React Native + WidgetKit.
2. **App Group data sharing**: Confirm the App Group container from Clue 2 (`group.com.more.morewords`) is accessible from a widget extension. Document: how to open the shared SQLite database from Swift/WidgetKit code.
3. **TimelineProvider refresh**: Document how each widget type should refresh — Word of Day (daily at midnight), Streak (on app foreground), My Words (every 2 hours), Art Widget (daily).
4. **Known limitations**: Any gotchas — widget size constraints, memory limits, image rendering restrictions, or library bugs found during research.

Write this under a clearly labeled **"Clue 10 Pre-Research"** section in COMPLETE.md.

Then open `hunts/more-words/clue-10/PROMPT.md`.
