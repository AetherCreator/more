# Clue 8: Crossword Generator — COMPLETE

## Pass Conditions
- [x] generateCrossword returns valid CrosswordGrid for standard inputs
- [x] Difficulty parameter controls grid size constraints
- [x] All placed words intersect at correct matching letters (Test 3)
- [x] No parallel adjacent words without perpendicular justification (Test 4)
- [x] Grid is correctly numbered, sequential from 1 (Test 5)
- [x] Grid is trimmed — no fully empty interior rows/cols (Test 6)
- [x] Expert grid fits within 18×18 (Test 7)
- [x] Expert difficulty completes in under 2 seconds (Test 8)
- [x] Returns null for impossible inputs (Test 2)
- [x] TypeScript types correct throughout
- [x] All 8 test cases pass

## Algorithm Approach
Follows the pseudocode from the prompt closely:
1. Sort words by length DESC
2. Place first word horizontally centered
3. For each remaining word, try all letter intersections with all placed words
4. Score each valid placement (intersections +10, center proximity +3, grid expansion -5)
5. Keep best attempt across up to 50 restarts (shuffled order each time)
6. Trim grid, number answers, return result

**Key files:**
- `packages/crossword/src/index.ts` — types, config, main generateCrossword loop
- `packages/crossword/src/placer.ts` — isValidPlacement, scorePlacement, placeWord
- `packages/crossword/src/grid.ts` — trimGrid, numberGrid

## Test Results
```
Test 1 PASS: 5/5 placed
Test 2 PASS: null for impossible input
Test 3 PASS: all intersections valid (5 words)
Test 4 PASS: 6 words, no parallel issues
Test 5 PASS: numbers 1-4 sequential
Test 6 PASS: 9×8 grid, 4 words
Test 7 PASS: 18×18, 21/28 placed
Test 8 PASS: Expert completed in 1ms

8/8 tests passed
```

## Performance Benchmarks
- **Beginner (5 words):** <1ms
- **Expert (28 words):** ~1ms
- All well under the 2-second requirement

## Placement Success Rate
- Beginner: ~80-100% of input words placed
- Expert: ~75% (21/28 placed in test run) — exceeds the ≥20 minimum

## Edge Cases
- Words with no shared letters → returns null (Test 2)
- Grid trimming adds 1 cell padding but caps at maxSize
- Duplicate words in input are skipped
- minPlaced scales down for small inputs (60% floor)

## Next
Open `hunts/more-words/clue-9/PROMPT.md` — Crossword Modes.
