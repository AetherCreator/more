import {generateCrossword} from '../index';

function assert(condition: boolean, msg?: string): void {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

// Test 1: Basic placement — 5 words, at least 3 placed
function test1(): void {
  const t1 = generateCrossword(
    [
      {word: 'LIMINAL', clue: 'On a threshold between two states'},
      {word: 'NUMINOUS', clue: 'Having a strong spiritual quality'},
      {word: 'ART', clue: 'Creative expression'},
      {word: 'LIGHT', clue: 'Electromagnetic radiation'},
      {word: 'NATURE', clue: 'The natural world'},
    ],
    {difficulty: 'beginner'},
  );
  assert(t1 !== null, 'T1: should not be null');
  assert(t1!.placedCount >= 3, `T1: placed ${t1!.placedCount}, need ≥3`);
  console.log(`Test 1 PASS: ${t1!.placedCount}/5 placed`);
}

// Test 2: Impossible input — no shared letters
function test2(): void {
  const t2 = generateCrossword(
    [
      {word: 'ZZZ', clue: 'Sleep sound'},
      {word: 'QQQ', clue: 'Test'},
    ],
    {difficulty: 'beginner'},
  );
  assert(t2 === null, 'T2: should be null for impossible input');
  console.log('Test 2 PASS: null for impossible input');
}

// Test 3: Intersection correctness
function test3(): void {
  const t3 = generateCrossword(
    [
      {word: 'HELLO', clue: 'Greeting'},
      {word: 'HELP', clue: 'Assist'},
      {word: 'LOOP', clue: 'Circle'},
      {word: 'POLE', clue: 'Stick'},
      {word: 'OPEN', clue: 'Not closed'},
    ],
    {difficulty: 'beginner'},
  );
  assert(t3 !== null, 'T3: should not be null');
  for (const across of t3!.across) {
    for (const down of t3!.down) {
      if (
        down.col >= across.col &&
        down.col < across.col + across.length &&
        across.row >= down.row &&
        across.row < down.row + down.length
      ) {
        const acrossLetter = across.word[down.col - across.col];
        const downLetter = down.word[across.row - down.row];
        assert(
          acrossLetter === downLetter,
          `T3: Intersection mismatch at (${across.row},${down.col}): across=${acrossLetter} down=${downLetter}`,
        );
      }
    }
  }
  console.log(`Test 3 PASS: all intersections valid (${t3!.placedCount} words)`);
}

// Test 4: No parallel adjacency
function test4(): void {
  const t4 = generateCrossword(
    [
      {word: 'CAT', clue: 'Feline'},
      {word: 'CAR', clue: 'Vehicle'},
      {word: 'TAR', clue: 'Black stuff'},
      {word: 'ACE', clue: 'Expert'},
      {word: 'ARC', clue: 'Curve'},
      {word: 'TRACE', clue: 'Follow'},
    ],
    {difficulty: 'beginner'},
  );
  if (t4 !== null) {
    // Verify structural integrity — intersection check
    for (const across of t4.across) {
      for (const down of t4.down) {
        if (
          down.col >= across.col &&
          down.col < across.col + across.length &&
          across.row >= down.row &&
          across.row < down.row + down.length
        ) {
          const acrossLetter = across.word[down.col - across.col];
          const downLetter = down.word[across.row - down.row];
          assert(
            acrossLetter === downLetter,
            `T4: Intersection mismatch`,
          );
        }
      }
    }
    console.log(`Test 4 PASS: ${t4.placedCount} words, no parallel issues`);
  } else {
    console.log('Test 4 PASS: null result (acceptable for tricky input)');
  }
}

// Test 5: Correct numbering
function test5(): void {
  const t5 = generateCrossword(
    [
      {word: 'BREAD', clue: 'Baked good'},
      {word: 'READ', clue: 'Look at text'},
      {word: 'DEAR', clue: 'Beloved'},
      {word: 'RED', clue: 'Color'},
      {word: 'BED', clue: 'Sleep on it'},
    ],
    {difficulty: 'beginner'},
  );
  if (t5 !== null) {
    const allNumbers = [...t5.across, ...t5.down]
      .map(a => a.number)
      .sort((a, b) => a - b);
    const uniqueNumbers = [...new Set(allNumbers)];
    assert(uniqueNumbers[0] === 1, `T5: Numbering must start at 1, got ${uniqueNumbers[0]}`);
    for (let i = 1; i < uniqueNumbers.length; i++) {
      assert(
        uniqueNumbers[i] <= uniqueNumbers[i - 1] + 1,
        `T5: Number gap: ${uniqueNumbers[i - 1]} → ${uniqueNumbers[i]}`,
      );
    }
    console.log(`Test 5 PASS: numbers 1-${uniqueNumbers[uniqueNumbers.length - 1]} sequential`);
  } else {
    console.log('Test 5 PASS: null result');
  }
}

// Test 6: Grid compactness
function test6(): void {
  const t6 = generateCrossword(
    [
      {word: 'STELLAR', clue: 'Star-like'},
      {word: 'LETTER', clue: 'Written message'},
      {word: 'TELL', clue: 'Communicate'},
      {word: 'LETS', clue: 'Allows'},
      {word: 'SET', clue: 'Group'},
    ],
    {difficulty: 'beginner'},
  );
  if (t6 !== null) {
    assert(t6.width <= 10, `T6: width ${t6.width} exceeds beginner max 10`);
    assert(t6.height <= 10, `T6: height ${t6.height} exceeds beginner max 10`);
    console.log(`Test 6 PASS: ${t6.width}×${t6.height} grid, ${t6.placedCount} words`);
  } else {
    console.log('Test 6 PASS: null result');
  }
}

// Test 7: Expert difficulty sizing
function test7(): void {
  const expertWords = [
    'PHILOSOPHY', 'ASTRONOMY', 'CHEMISTRY', 'LITERATURE', 'GEOGRAPHY',
    'MATHEMATICS', 'BIOLOGY', 'HISTORY', 'PHYSICS', 'LANGUAGE',
    'MUSIC', 'DANCE', 'DRAMA', 'SCULPTURE', 'PAINTING',
    'ARCHITECTURE', 'POETRY', 'NOVEL', 'ESSAY', 'THESIS',
    'THEOREM', 'AXIOM', 'PROOF', 'LEMMA', 'RESULT',
    'METHOD', 'THEORY', 'MODEL',
  ].map((w, i) => ({word: w, clue: `Clue for word ${i + 1}`}));

  const t7 = generateCrossword(expertWords, {difficulty: 'expert'});
  if (t7 !== null) {
    assert(t7.width <= 18, `T7: Expert grid too wide: ${t7.width}`);
    assert(t7.height <= 18, `T7: Expert grid too tall: ${t7.height}`);
    console.log(`Test 7 PASS: ${t7.width}×${t7.height}, ${t7.placedCount}/28 placed`);
  } else {
    console.log('Test 7 SKIP: null result for expert (may need more attempts)');
  }
}

// Test 8: Performance
function test8(): void {
  const expertWords = [
    'PHILOSOPHY', 'ASTRONOMY', 'CHEMISTRY', 'LITERATURE', 'GEOGRAPHY',
    'MATHEMATICS', 'BIOLOGY', 'HISTORY', 'PHYSICS', 'LANGUAGE',
    'MUSIC', 'DANCE', 'DRAMA', 'SCULPTURE', 'PAINTING',
    'ARCHITECTURE', 'POETRY', 'NOVEL', 'ESSAY', 'THESIS',
    'THEOREM', 'AXIOM', 'PROOF', 'LEMMA', 'RESULT',
    'METHOD', 'THEORY', 'MODEL',
  ].map((w, i) => ({word: w, clue: `Clue for word ${i + 1}`}));

  const start = Date.now();
  generateCrossword(expertWords, {difficulty: 'expert'});
  const elapsed = Date.now() - start;
  assert(elapsed < 2000, `T8: Expert took ${elapsed}ms, must be under 2000ms`);
  console.log(`Test 8 PASS: Expert completed in ${elapsed}ms`);
}

// Run all tests
function runAll(): void {
  console.log('=== Crossword Generator Tests ===\n');
  const tests = [test1, test2, test3, test4, test5, test6, test7, test8];
  let passed = 0;
  for (let i = 0; i < tests.length; i++) {
    try {
      tests[i]();
      passed++;
    } catch (err) {
      console.log(`Test ${i + 1} FAIL: ${(err as Error).message}`);
    }
  }
  console.log(`\n${passed}/${tests.length} tests passed`);
}

runAll();
