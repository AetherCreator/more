# Clue 8: Crossword Generator

## ⚠️ Read First
Open `hunts/more-words/clue-7/COMPLETE.md` and load its contents before reading anything else.
If that file does not exist — STOP. Clue 7 has not been completed. Do not proceed.

## Context
All 3 word games work. Now build the crossword generator — a shared package that all 3 crossword modes (Clue 9) will use. This is the most algorithmically complex clue in the hunt. Take it seriously.

## Your Task
Build the crossword generator in `packages/crossword/src/index.ts`.

### What the Generator Does
Given: array of {word, clue} pairs + a difficulty level
Returns: a valid crossword grid, or null if generation fails

```typescript
export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface CrosswordInput {
  word: string      // uppercase, letters only
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
  row: number       // 0-indexed row of first letter
  col: number       // 0-indexed col of first letter
  length: number
}

export interface CrosswordGrid {
  grid: CrosswordCell[][]
  across: CrosswordAnswer[]
  down: CrosswordAnswer[]
  width: number
  height: number
  placedCount: number  // how many of the input words were placed
  inputCount: number   // how many words were provided
}

export interface GenerateOptions {
  difficulty: Difficulty
  maxAttempts?: number  // default: 50 — full restarts from scratch
}

export const generateCrossword: (
  words: CrosswordInput[],
  options: GenerateOptions
) => CrosswordGrid | null  // null if generation fails
```

### Difficulty → Grid Constraints
| Difficulty | Input words | Target placed | Max grid size |
|---|---|---|---|
| beginner | 12-15 | ≥8 | 10×10 |
| intermediate | 15-20 | ≥12 | 13×13 |
| advanced | 20-25 | ≥16 | 15×15 |
| expert | 25-30 | ≥20 | 18×18 |

The caller provides the right number of words for the difficulty. The generator enforces max grid size and minimum placed count. If it can't meet the minimum, return null.

### Placement Algorithm — Explicit Pseudocode

```
function generateCrossword(words, options):
  sort words by length DESC (longer words first = more intersection opportunities)
  bestResult = null

  for attempt in 1..maxAttempts:
    grid = empty 2D array (maxSize × maxSize), all null
    placed = []
    
    // Step 1: Place first word horizontally, centered
    firstWord = words[0]
    row = floor(maxSize / 2)
    col = floor((maxSize - firstWord.length) / 2)
    placeWord(grid, firstWord, row, col, 'across')
    placed.push(firstWord)

    // Step 2: Try to place remaining words
    remaining = shuffle(words[1..])  // shuffle for variety across attempts
    
    for each candidateWord in remaining:
      bestPlacement = null
      bestScore = -1
      
      for each placedWord in placed:
        for each (ci, cLetter) in candidateWord.letters:
          for each (pi, pLetter) in placedWord.letters:
            if cLetter != pLetter: continue
            
            // Calculate intersection position
            if placedWord.direction == 'across':
              // candidate goes DOWN, crossing placedWord
              candidateRow = placedWord.row - ci
              candidateCol = placedWord.col + pi
              candidateDir = 'down'
            else:
              // candidate goes ACROSS, crossing placedWord
              candidateRow = placedWord.row + pi
              candidateCol = placedWord.col - ci
              candidateDir = 'across'
            
            if not isValidPlacement(grid, candidateWord, candidateRow, candidateCol, candidateDir):
              continue
            
            score = scorePlacement(grid, candidateWord, candidateRow, candidateCol, candidateDir, placed)
            if score > bestScore:
              bestScore = score
              bestPlacement = { row, col, dir } for this candidate
      
      if bestPlacement exists:
        placeWord(grid, candidateWord, bestPlacement)
        placed.push(candidateWord)
    
    // Keep best attempt
    if placed.length > (bestResult?.placedCount ?? 0):
      bestResult = trimGrid(grid, placed)
    
    if placed.length >= targetPlaced: break  // good enough

  if bestResult.placedCount < minimumPlaced: return null
  numberGrid(bestResult)
  return bestResult
```

### Validation Rules — `isValidPlacement()`

A placement is INVALID if any of these are true:

1. **Out of bounds:** Any letter would fall outside the grid
2. **Letter conflict:** A cell already contains a different letter
3. **Parallel adjacency:** The candidate word runs parallel to an existing word in an adjacent row/column AND they share any overlapping column/row range. Concretely:
   - If placing ACROSS at row R, check rows R-1 and R+1: for each column the candidate occupies, if that cell in the adjacent row contains a letter that is NOT part of a cross (perpendicular) word intersecting the candidate, it's invalid
   - Same logic for DOWN placements checking adjacent columns
4. **Head/tail collision:** The cell immediately before the first letter or after the last letter (in the word's direction) already contains a letter. This prevents words from accidentally extending each other.
5. **Already placed:** The word (same string) is already on the grid

### Scoring Function — `scorePlacement()`

Higher scores = better placements:
- +10 per intersection with an existing placed word (letter match confirmed)
- +3 if placement is near the grid center (within 2 cells of center)
- +1 per future intersection opportunity (letters that match unplaced words)
- -5 if placement extends the grid bounding box beyond current bounds

### Grid Trimming — `trimGrid()`

After all words placed, trim the grid to the smallest bounding rectangle that contains all placed letters, plus 1 cell of padding on each side (for visual breathing room, capped at maxSize).

### Numbering — `numberGrid()`

Scan left-to-right, top-to-bottom. Assign sequential numbers starting at 1 to any cell that is the first letter of an across or down answer. A cell gets a number if:
- It starts an across answer (has a letter, and the cell to its left is null or edge) AND the word is ≥2 letters
- OR it starts a down answer (has a letter, and the cell above is null or edge) AND the word is ≥2 letters

### Test Cases

All 8 must pass before this clue is complete.

```typescript
// Test 1: Basic placement — 5 words, at least 3 placed
const t1 = generateCrossword([
  { word: 'LIMINAL', clue: 'On a threshold between two states' },
  { word: 'NUMINOUS', clue: 'Having a strong spiritual quality' },
  { word: 'ART', clue: 'Creative expression' },
  { word: 'LIGHT', clue: 'Electromagnetic radiation' },
  { word: 'NATURE', clue: 'The natural world' },
], { difficulty: 'beginner' });
assert(t1 !== null);
assert(t1.placedCount >= 3);

// Test 2: Impossible input — no shared letters
const t2 = generateCrossword([
  { word: 'ZZZ', clue: 'Sleep sound' },
  { word: 'QQQ', clue: 'Test' },
], { difficulty: 'beginner' });
assert(t2 === null);

// Test 3: Intersection correctness — every intersection cell must match
// For each placed across word and down word that share a cell,
// the letter at that cell must be the same in both words.
const t3 = generateCrossword([
  { word: 'HELLO', clue: 'Greeting' },
  { word: 'HELP', clue: 'Assist' },
  { word: 'LOOP', clue: 'Circle' },
  { word: 'POLE', clue: 'Stick' },
  { word: 'OPEN', clue: 'Not closed' },
], { difficulty: 'beginner' });
assert(t3 !== null);
for (const across of t3.across) {
  for (const down of t3.down) {
    // Check if they share a cell
    if (down.col >= across.col && down.col < across.col + across.length &&
        across.row >= down.row && across.row < down.row + down.length) {
      const acrossLetter = across.word[down.col - across.col];
      const downLetter = down.word[across.row - down.row];
      assert(acrossLetter === downLetter, 'Intersection mismatch');
    }
  }
}

// Test 4: No parallel adjacency — no two words run side by side
// For every pair of same-direction words, they must not occupy
// adjacent rows (across) or columns (down) with overlapping range
const t4 = generateCrossword([
  { word: 'CAT', clue: 'Feline' },
  { word: 'CAR', clue: 'Vehicle' },
  { word: 'TAR', clue: 'Black stuff' },
  { word: 'ACE', clue: 'Expert' },
  { word: 'ARC', clue: 'Curve' },
  { word: 'TRACE', clue: 'Follow' },
], { difficulty: 'beginner' });
if (t4 !== null) {
  for (const a of t4.across) {
    for (const b of t4.across) {
      if (a === b) continue;
      if (Math.abs(a.row - b.row) === 1) {
        // Check for column overlap
        const aEnd = a.col + a.length - 1;
        const bEnd = b.col + b.length - 1;
        const overlap = Math.min(aEnd, bEnd) - Math.max(a.col, b.col);
        // Overlap allowed ONLY if all overlapping cells are intersections with down words
        // (This is a structural check — log warning if overlap > 0 without perpendicular justification)
      }
    }
  }
}

// Test 5: Correct numbering — numbers are sequential, start at 1
const t5 = generateCrossword([
  { word: 'BREAD', clue: 'Baked good' },
  { word: 'READ', clue: 'Look at text' },
  { word: 'DEAR', clue: 'Beloved' },
  { word: 'RED', clue: 'Color' },
  { word: 'BED', clue: 'Sleep on it' },
], { difficulty: 'beginner' });
if (t5 !== null) {
  const allNumbers = [...t5.across, ...t5.down].map(a => a.number).sort((a, b) => a - b);
  const uniqueNumbers = [...new Set(allNumbers)];
  assert(uniqueNumbers[0] === 1, 'Numbering must start at 1');
  // Numbers must be sequential with no gaps
  for (let i = 1; i < uniqueNumbers.length; i++) {
    assert(uniqueNumbers[i] <= uniqueNumbers[i-1] + 1, 'Number gap detected');
  }
}

// Test 6: Grid compactness — no fully empty rows/cols inside bounding box
const t6 = generateCrossword([
  { word: 'STELLAR', clue: 'Star-like' },
  { word: 'LETTER', clue: 'Written message' },
  { word: 'TELL', clue: 'Communicate' },
  { word: 'LETS', clue: 'Allows' },
  { word: 'SET', clue: 'Group' },
], { difficulty: 'beginner' });
if (t6 !== null) {
  // Every row should have at least one letter
  for (let r = 0; r < t6.height; r++) {
    const hasLetter = t6.grid[r].some(cell => cell.letter !== null);
    // Allow 1 row of padding on edges, but inner rows must have content
    // (This validates trimGrid worked)
  }
}

// Test 7: Difficulty sizing — Expert grid fits within 18×18
const expertWords = Array.from({ length: 28 }, (_, i) => ({
  word: ['PHILOSOPHY','ASTRONOMY','CHEMISTRY','LITERATURE','GEOGRAPHY',
         'MATHEMATICS','BIOLOGY','HISTORY','PHYSICS','LANGUAGE',
         'MUSIC','DANCE','DRAMA','SCULPTURE','PAINTING',
         'ARCHITECTURE','POETRY','NOVEL','ESSAY','THESIS',
         'THEOREM','AXIOM','PROOF','LEMMA','RESULT',
         'METHOD','THEORY','MODEL'][i],
  clue: `Clue for word ${i + 1}`
}));
const t7 = generateCrossword(expertWords, { difficulty: 'expert' });
if (t7 !== null) {
  assert(t7.width <= 18, `Expert grid too wide: ${t7.width}`);
  assert(t7.height <= 18, `Expert grid too tall: ${t7.height}`);
  assert(t7.placedCount >= 20, `Expert needs ≥20 placed, got ${t7.placedCount}`);
}

// Test 8: Performance — Expert difficulty completes in under 2 seconds
const t8start = Date.now();
generateCrossword(expertWords, { difficulty: 'expert' });
const t8elapsed = Date.now() - t8start;
assert(t8elapsed < 2000, `Expert took ${t8elapsed}ms, must be under 2000ms`);
```

## Files to Create/Modify
- `packages/crossword/src/index.ts` — types + generateCrossword entry point
- `packages/crossword/src/placer.ts` — placement algorithm (isValidPlacement, scorePlacement, placeWord)
- `packages/crossword/src/grid.ts` — trimGrid, numberGrid utilities
- `packages/crossword/src/__tests__/generator.test.ts` — all 8 test cases above

## Pass Conditions
- [ ] generateCrossword returns valid CrosswordGrid for standard inputs
- [ ] Difficulty parameter controls grid size constraints
- [ ] All placed words intersect at correct matching letters (Test 3)
- [ ] No parallel adjacent words without perpendicular justification (Test 4)
- [ ] Grid is correctly numbered, sequential from 1 (Test 5)
- [ ] Grid is trimmed — no fully empty interior rows/cols (Test 6)
- [ ] Expert grid fits within 18×18 (Test 7)
- [ ] Expert difficulty completes in under 2 seconds (Test 8)
- [ ] Returns null for impossible inputs (Test 2)
- [ ] TypeScript types correct throughout
- [ ] All 8 test cases pass

## Do Not
- Build the crossword UI yet — Clue 9
- Add any React Native code — this is a pure TypeScript package
- Optimize for perfect placement — meeting the minimum placed threshold is acceptable
- Spend more than 50 attempts per generation call — return best result or null

## When You Pass
Write `hunts/more-words/clue-8/COMPLETE.md` with:
- Algorithm approach summary (which parts matched pseudocode, what changed)
- Test results: pass/fail for each of the 8 tests
- Average placement success rate: what % of input words typically get placed per difficulty
- Time benchmarks: average ms for each difficulty level
- Edge cases discovered during testing

Then open `hunts/more-words/clue-9/PROMPT.md`.
