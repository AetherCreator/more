import React, {useCallback, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type {CrosswordGrid, CrosswordAnswer, CrosswordCell} from '@more/crossword';
import {defaultTheme} from '../theme';

interface CrosswordPlayerProps {
  puzzle: CrosswordGrid;
  onComplete: (timeMs: number) => void;
}

const t = defaultTheme;
const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CrosswordPlayer({
  puzzle,
  onComplete,
}: CrosswordPlayerProps): React.JSX.Element {
  const cellSize = Math.floor((SCREEN_WIDTH - 32) / puzzle.width);
  const [userGrid, setUserGrid] = useState<string[][]>(
    () => puzzle.grid.map(row => row.map(() => '')),
  );
  const [selectedCell, setSelectedCell] = useState<{r: number; c: number} | null>(null);
  const [direction, setDirection] = useState<'across' | 'down'>('across');
  const [checkedCells, setCheckedCells] = useState<Record<string, 'correct' | 'wrong'>>({});
  const [completed, setCompleted] = useState(false);
  const startTime = useRef(Date.now());
  const inputRef = useRef<TextInput>(null);

  // Current clue
  const currentClue = useCallback((): CrosswordAnswer | null => {
    if (!selectedCell) return null;
    const {r, c} = selectedCell;

    const answers = direction === 'across' ? puzzle.across : puzzle.down;
    for (const answer of answers) {
      const inRange =
        direction === 'across'
          ? r === answer.row && c >= answer.col && c < answer.col + answer.length
          : c === answer.col && r >= answer.row && r < answer.row + answer.length;
      if (inRange) return answer;
    }
    return null;
  }, [selectedCell, direction, puzzle]);

  function handleCellPress(r: number, c: number) {
    const cell = puzzle.grid[r][c];
    if (!cell.letter) return; // Black square

    if (selectedCell?.r === r && selectedCell?.c === c) {
      // Toggle direction
      setDirection(prev => (prev === 'across' ? 'down' : 'across'));
    } else {
      setSelectedCell({r, c});
    }
    inputRef.current?.focus();
  }

  function handleInput(text: string) {
    if (!selectedCell || completed) return;
    const letter = text.toUpperCase().replace(/[^A-Z]/g, '');
    if (!letter) return;

    const {r, c} = selectedCell;
    const cell = puzzle.grid[r][c];
    if (!cell.letter) return;

    // Set letter
    setUserGrid(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = letter[0];
      return next;
    });

    // Clear checked state for this cell
    setCheckedCells(prev => {
      const next = {...prev};
      delete next[`${r},${c}`];
      return next;
    });

    // Auto-advance
    if (direction === 'across') {
      const nextC = c + 1;
      if (nextC < puzzle.width && puzzle.grid[r][nextC]?.letter) {
        setSelectedCell({r, c: nextC});
      }
    } else {
      const nextR = r + 1;
      if (nextR < puzzle.height && puzzle.grid[nextR]?.[c]?.letter) {
        setSelectedCell({r: nextR, c});
      }
    }

    // Check completion
    checkCompletion(r, c, letter[0]);
  }

  function handleBackspace() {
    if (!selectedCell) return;
    const {r, c} = selectedCell;

    // Clear current cell
    setUserGrid(prev => {
      const next = prev.map(row => [...row]);
      next[r][c] = '';
      return next;
    });

    // Move back
    if (direction === 'across' && c > 0 && puzzle.grid[r][c - 1]?.letter) {
      setSelectedCell({r, c: c - 1});
    } else if (direction === 'down' && r > 0 && puzzle.grid[r - 1]?.[c]?.letter) {
      setSelectedCell({r: r - 1, c});
    }
  }

  function checkCompletion(changedR: number, changedC: number, newLetter: string) {
    // Build the grid with the change applied
    const testGrid = userGrid.map(row => [...row]);
    testGrid[changedR][changedC] = newLetter;

    for (let r = 0; r < puzzle.height; r++) {
      for (let c = 0; c < puzzle.width; c++) {
        const cell = puzzle.grid[r][c];
        if (cell.letter && testGrid[r][c] !== cell.letter) {
          return; // Not complete
        }
      }
    }
    setCompleted(true);
    onComplete(Date.now() - startTime.current);
  }

  function handleCheck() {
    const clue = currentClue();
    if (!clue) return;

    const newChecked: Record<string, 'correct' | 'wrong'> = {};
    for (let i = 0; i < clue.length; i++) {
      const r = clue.direction === 'across' ? clue.row : clue.row + i;
      const c = clue.direction === 'across' ? clue.col + i : clue.col;
      const expected = puzzle.grid[r][c].letter;
      const entered = userGrid[r][c];
      if (entered) {
        newChecked[`${r},${c}`] = entered === expected ? 'correct' : 'wrong';
      }
    }
    setCheckedCells(prev => ({...prev, ...newChecked}));
  }

  function isInCurrentWord(r: number, c: number): boolean {
    const clue = currentClue();
    if (!clue) return false;
    if (clue.direction === 'across') {
      return r === clue.row && c >= clue.col && c < clue.col + clue.length;
    }
    return c === clue.col && r >= clue.row && r < clue.row + clue.length;
  }

  const activeClue = currentClue();

  return (
    <View style={styles.container}>
      {/* Hidden input for keyboard */}
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={1}
        value=""
        onChangeText={handleInput}
        onKeyPress={({nativeEvent}) => {
          if (nativeEvent.key === 'Backspace') handleBackspace();
        }}
      />

      {/* Grid */}
      <View style={[styles.gridContainer, {width: cellSize * puzzle.width}]}>
        {puzzle.grid.map((row, r) => (
          <View key={r} style={styles.gridRow}>
            {row.map((cell: CrosswordCell, c: number) => {
              const isBlack = !cell.letter;
              const isSelected = selectedCell?.r === r && selectedCell?.c === c;
              const inWord = isInCurrentWord(r, c);
              const checkState = checkedCells[`${r},${c}`];

              return (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.cell,
                    {width: cellSize, height: cellSize},
                    isBlack && styles.blackCell,
                    inWord && styles.wordHighlight,
                    isSelected && styles.selectedCell,
                    checkState === 'correct' && styles.correctCell,
                    checkState === 'wrong' && styles.wrongCell,
                  ]}
                  disabled={isBlack}
                  onPress={() => handleCellPress(r, c)}>
                  {cell.number && (
                    <Text style={[styles.cellNumber, {fontSize: cellSize * 0.22}]}>
                      {cell.number}
                    </Text>
                  )}
                  {!isBlack && (
                    <Text style={[styles.cellLetter, {fontSize: cellSize * 0.5}]}>
                      {userGrid[r][c]}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* Current clue */}
      {activeClue && (
        <View style={styles.currentClue}>
          <Text style={styles.clueDirection}>
            {activeClue.number} {activeClue.direction.toUpperCase()}
          </Text>
          <Text style={styles.clueText}>{activeClue.clue}</Text>
        </View>
      )}

      {/* Check button */}
      <TouchableOpacity style={styles.checkBtn} onPress={handleCheck}>
        <Text style={styles.checkBtnText}>Check Word</Text>
      </TouchableOpacity>

      {/* Clue list */}
      <FlatList
        style={styles.clueList}
        data={[
          ...puzzle.across.map(a => ({...a, label: `${a.number}A`})),
          ...puzzle.down.map(d => ({...d, label: `${d.number}D`})),
        ]}
        keyExtractor={item => `${item.direction}-${item.number}`}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.clueRow}
            onPress={() => {
              setSelectedCell({r: item.row, c: item.col});
              setDirection(item.direction);
              inputRef.current?.focus();
            }}>
            <Text style={styles.clueLabel}>{item.label}</Text>
            <Text style={styles.clueRowText} numberOfLines={1}>
              {item.clue}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
    alignItems: 'center',
    paddingTop: 8,
  },
  hiddenInput: {
    position: 'absolute',
    width: 0,
    height: 0,
    opacity: 0,
  },
  gridContainer: {
    marginBottom: 12,
  },
  gridRow: {
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 0.5,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1f',
  },
  blackCell: {
    backgroundColor: t.colors.background,
    borderColor: t.colors.background,
  },
  selectedCell: {
    backgroundColor: '#3a3a00',
    borderColor: t.colors.accent,
    borderWidth: 2,
  },
  wordHighlight: {
    backgroundColor: '#1f1f2a',
  },
  correctCell: {
    backgroundColor: '#1b2e1b',
  },
  wrongCell: {
    backgroundColor: '#2e1b1b',
  },
  cellNumber: {
    position: 'absolute',
    top: 1,
    left: 2,
    color: t.colors.muted,
    fontWeight: '600',
  },
  cellLetter: {
    color: t.colors.word,
    fontWeight: '700',
  },
  currentClue: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%',
  },
  clueDirection: {
    fontSize: 12,
    color: t.colors.accent,
    fontWeight: '700',
    marginBottom: 2,
  },
  clueText: {
    fontSize: 15,
    color: t.colors.word,
    lineHeight: 20,
  },
  checkBtn: {
    backgroundColor: t.colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  checkBtnText: {
    color: t.colors.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  clueList: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
  },
  clueRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    gap: 8,
  },
  clueLabel: {
    fontSize: 13,
    color: t.colors.accent,
    fontWeight: '700',
    width: 30,
  },
  clueRowText: {
    fontSize: 13,
    color: t.colors.secondary,
    flex: 1,
  },
});
