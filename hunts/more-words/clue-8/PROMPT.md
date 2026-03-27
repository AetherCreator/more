# Clue 8: Crossword Generator

## ⚠️ Read First
Open `hunts/more-words/clue-7/COMPLETE.md` and load its contents before reading anything else.
If that file does not exist — STOP. Clue 7 has not been completed. Do not proceed.

## Context
All 3 word games work. Now build the crossword generator — a shared package that all 3 crossword modes (Clue 9) will use. This is the most algorithmically complex clue in the hunt. Take it seriously.

## Your Task
Build the crossword generator in `packages/crossword/src/index.ts`.

### What the Generator Does
Given: array of {word, clue} pairs
Returns: a valid crossword grid

```typescript
export interface CrosswordInput {
  word: string      // uppercase
  clue: string      // the definition or hint
}

export interface CrosswordCell {
  letter: string | null  // null = black square
  number: number | null  // clue number if cell starts an answer
  isAcross: boolean
  isDown: boolean
}

export interface CrosswordAnswer {
  number: number
  direction: 'across' | 'down'
  clue: string
  word: string
  row: number
  col: number
  length: number
}

export interface CrosswordGrid {
  grid: CrosswordCell[][]
  across: CrosswordAnswer[]
  down: CrosswordAnswer[]
  width: number
  height: number
}

export const generateCrossword: (
  words: CrosswordInput[],
  options?: { maxAttempts?: number, minWords?: number }
) => CrosswordGrid | null  // null if generation fails
```

### Algorithm
Use a standard crossword placement algorithm:
1. Place the longest word horizontally in the center
2. For each remaining word, find all possible intersections with placed words
3. Score intersections: prefer placements that create more future intersections
4. Place the highest-scoring intersection
5. Repeat until all words placed or no valid placement found
6. Grid should be compact — trim empty rows/cols from edges

**Constraints:**
- Words must intersect at matching letters
- No two words can run parallel and adjacent (would create unintended words)
- Grid must be rectangular
- Minimum 60% of words placed (return null if below threshold)

### Grid Sizes by Difficulty
- Beginner: 12-15 words, ~10×10 grid
- Intermediate: 15-20 words, ~13×13 grid
- Advanced: 20-25 words, ~15×15 grid
- Expert: 25-30 words, ~18×18 grid

### Word Numbering
Number cells sequentially left-to-right, top-to-bottom where answers start.

### Test Cases
The generator must pass these before the clue is complete:
```typescript
// Test 1: Basic 5-word crossword
const result = generateCrossword([
  { word: 'LIMINAL', clue: 'On a threshold between two states' },
  { word: 'NUMINOUS', clue: 'Having a strong spiritual quality' },
  { word: 'ART', clue: 'Creative expression' },
  { word: 'LIGHT', clue: 'Electromagnetic radiation' },
  { word: 'NATURE', clue: 'The natural world' },
])
// result should not be null
// result.across.length + result.down.length >= 3 (at least 3 words placed)

// Test 2: Words with no intersections possible
const result2 = generateCrossword([
  { word: 'ZZZ', clue: 'Sleep sound' },
  { word: 'QQQ', clue: 'Test' },
])
// result2 should be null (no valid intersections)
```

## Files to Create/Modify
- `packages/crossword/src/index.ts` — full generator
- `packages/crossword/src/algorithm.ts` — placement algorithm (if splitting)
- `packages/crossword/src/__tests__/generator.test.ts` — test cases above

## Pass Conditions
- [ ] generateCrossword returns valid CrosswordGrid for standard inputs
- [ ] All placed words intersect at correct matching letters
- [ ] No parallel adjacent words
- [ ] Grid is correctly numbered
- [ ] Test case 1 passes: 5 vocabulary words, at least 3 placed
- [ ] Test case 2 passes: returns null for impossible inputs
- [ ] Beginner/Intermediate/Advanced/Expert sizing works
- [ ] Generator runs in under 2 seconds for Expert difficulty
- [ ] TypeScript types correct throughout
- [ ] No errors running tests

## Do Not
- Build the crossword UI yet — Clue 9
- Add any React Native code — this is a pure TypeScript package
- Optimize for perfect placement — 60% threshold is acceptable

## When You Pass
Write `hunts/more-words/clue-8/COMPLETE.md` with:
- Algorithm approach (include pseudocode summary)
- Average placement success rate on test data
- Time benchmarks for each difficulty level
- Any edge cases discovered

Then open `hunts/more-words/clue-9/PROMPT.md`.
