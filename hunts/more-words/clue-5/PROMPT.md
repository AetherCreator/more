# Clue 5: Flashcard Game

## ⚠️ Read First
Open `hunts/more-words/clue-4/COMPLETE.md` and load its contents before reading anything else.
If that file does not exist — STOP. Clue 4 has not been completed. Do not proceed.

## Context
Deck exists with saved words and mastery display. Games unlock at 10 saved words. Now build the first game — flashcards. This is also where the spaced repetition engine in packages/engine/ gets its first real implementation.

## Your Task
Build the Flashcard game and implement the spaced repetition engine.

### Spaced Repetition Engine (packages/engine/src/index.ts)
```typescript
// Given a list of saved words with mastery scores,
// return them in optimal review order:
// - mastery 0-1: appears 3x per session
// - mastery 2-3: appears 2x per session
// - mastery 4-5: appears 1x per session
// Shuffle within each tier. Total session = 10 cards (adjustable).
export const buildFlashcardSession: (
  savedWords: SavedWord[],
  sessionLength: number
) => SavedWord[]

// Update mastery based on response:
// Know It: mastery + 1 (max 5)
// Almost: mastery unchanged
// Still Learning: mastery - 1 (min 0)
export const updateMasteryScore: (
  current: number,
  response: 'know' | 'almost' | 'learning'
) => number
```

### Flashcard Screen
**Entry:** Play tab → "Flashcards" option. Requires 10+ deck words. Shows "X words in your deck" before starting.

**Session:**
Card flipped face down showing word on front.
Tap card → flips to show definition (smooth 3D flip animation).

After flip, 3 buttons appear:
- ✓ Know It (green)
- ~ Almost (yellow)  
- ✗ Still Learning (red)

Tap response → next card slides in.

**Progress:** "Card 4 of 10" at top.

**Session complete screen:**
- Words reviewed count
- Breakdown: X knew / X almost / X learning
- "Nice work" message (not over the top)
- Back to Play button

### Mastery Updates
After each card response, call `updateMasteryScore()` and save to database via `updateMastery()`.
Deck screen will reflect updated mastery dots after session.

### Kid mode
Same mechanic, kid_definition on back of card instead of adult definition.
Bigger cards, brighter colors.

## Files to Create/Modify
- `packages/engine/src/index.ts` — spaced repetition engine
- `apps/more-words/src/screens/FlashcardScreen.tsx`
- `apps/more-words/src/components/FlipCard.tsx` — the flippable card component
- `apps/more-words/src/screens/PlayScreen.tsx` — Play tab with game selection

## Pass Conditions
- [ ] buildFlashcardSession returns correct distribution by mastery tier
- [ ] Card flip animation works smoothly
- [ ] Know It / Almost / Still Learning buttons appear after flip
- [ ] Mastery updates correctly in database after each response
- [ ] Session ends after 10 cards
- [ ] Session complete screen shows correct breakdown
- [ ] Deck mastery dots reflect updated scores after session
- [ ] Requires 10+ deck words — shows message if fewer
- [ ] Kid mode uses kid_definition
- [ ] No console errors

## Do Not
- Build Match game — Clue 6
- Build Fill in the Blank — Clue 7
- Build crosswords — Clues 8-9
- Add sound effects — keep it clean for now

## When You Pass
Write `hunts/more-words/clue-5/COMPLETE.md` with:
- Spaced repetition algorithm implementation
- Flip animation approach
- How mastery updates flow from game → database → deck screen

Then open `hunts/more-words/clue-6/PROMPT.md`.
