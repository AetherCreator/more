import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {SavedWord} from '../db/types';
import {getSavedWords, updateMastery} from '../db';
import {buildFlashcardSession, updateMasteryScore} from '@more/engine';
import {defaultTheme} from '../theme';

interface MatchGameScreenProps {
  onBack: () => void;
}

const t = defaultTheme;
const PAIR_COUNT = 8;

interface MatchPair {
  wordId: number;
  word: string;
  definition: string;
  matched: boolean;
  wrongAttempt: boolean;
}

type Selection = {type: 'word' | 'definition'; index: number} | null;

export default function MatchGameScreen({
  onBack,
}: MatchGameScreenProps): React.JSX.Element {
  const [pairs, setPairs] = useState<MatchPair[]>([]);
  const [shuffledWords, setShuffledWords] = useState<number[]>([]);
  const [shuffledDefs, setShuffledDefs] = useState<number[]>([]);
  const [selected, setSelected] = useState<Selection>(null);
  const [flashState, setFlashState] = useState<Record<string, 'correct' | 'wrong'>>({});
  const [timed, setTimed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [started, setStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState(false);
  const [matchedCount, setMatchedCount] = useState(0);
  const lastMatchTime = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rawSaved = useRef<SavedWord[]>([]);

  const load = useCallback(async () => {
    try {
      const saved = await getSavedWords(1);
      rawSaved.current = saved;
      const engineWords = saved.map(sw => ({
        word_id: sw.word_id,
        mastery: sw.mastery,
      }));
      const session = buildFlashcardSession(engineWords, PAIR_COUNT);
      // Deduplicate by word_id
      const seen = new Set<number>();
      const unique = session.filter(s => {
        if (seen.has(s.word_id)) return false;
        seen.add(s.word_id);
        return true;
      });

      const gamePairs: MatchPair[] = unique.slice(0, PAIR_COUNT).map(sw => {
        const full = saved.find(s => s.word_id === sw.word_id);
        return {
          wordId: sw.word_id,
          word: full?.word?.word ?? '',
          definition: full?.word?.definition ?? '',
          matched: false,
          wrongAttempt: false,
        };
      });

      setPairs(gamePairs);
      setShuffledWords(shuffle(gamePairs.map((_, i) => i)));
      setShuffledDefs(shuffle(gamePairs.map((_, i) => i)));
    } catch {
      console.log('[Match] Could not load');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (started && timed) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setDone(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, timed]);

  function handleSelect(type: 'word' | 'definition', pairIndex: number) {
    if (pairs[pairIndex].matched) return;

    if (!selected) {
      setSelected({type, index: pairIndex});
      return;
    }

    // Same type — switch selection
    if (selected.type === type) {
      setSelected({type, index: pairIndex});
      return;
    }

    // Check match
    const wordIdx = type === 'word' ? pairIndex : selected.index;
    const defIdx = type === 'definition' ? pairIndex : selected.index;

    if (wordIdx === defIdx) {
      // Correct!
      const elapsed = (Date.now() - lastMatchTime.current) / 1000;
      const speedBonus = elapsed < 3 ? 5 : 0;
      const newStreak = streak + 1;
      const streakMultiplier = newStreak >= 3 ? 2 : newStreak >= 2 ? 1.5 : 1;
      const points = Math.round((10 + speedBonus) * streakMultiplier);

      setScore(prev => prev + points);
      setStreak(newStreak);
      lastMatchTime.current = Date.now();

      const wKey = `word-${wordIdx}`;
      const dKey = `def-${defIdx}`;
      setFlashState(prev => ({...prev, [wKey]: 'correct', [dKey]: 'correct'}));

      setTimeout(() => {
        setPairs(prev =>
          prev.map((p, i) => (i === wordIdx ? {...p, matched: true} : p)),
        );
        setFlashState(prev => {
          const next = {...prev};
          delete next[wKey];
          delete next[dKey];
          return next;
        });
        setMatchedCount(prev => {
          const newCount = prev + 1;
          if (newCount >= pairs.length) {
            if (timerRef.current) clearInterval(timerRef.current);
            setDone(true);
          }
          return newCount;
        });
      }, 400);
    } else {
      // Wrong
      setStreak(0);
      const wKey = `word-${wordIdx}`;
      const dKey = `def-${defIdx}`;
      setFlashState(prev => ({...prev, [wKey]: 'wrong', [dKey]: 'wrong'}));
      setPairs(prev =>
        prev.map((p, i) => (i === wordIdx ? {...p, wrongAttempt: true} : p)),
      );
      setTimeout(() => {
        setFlashState(prev => {
          const next = {...prev};
          delete next[wKey];
          delete next[dKey];
          return next;
        });
      }, 500);
    }
    setSelected(null);
  }

  // Pre-game screen
  if (!started) {
    return (
      <View style={styles.container}>
        <View style={styles.preGame}>
          <Text style={styles.preTitle}>Match Game</Text>
          <Text style={styles.preDesc}>
            Match {pairs.length} words with their definitions
          </Text>

          <TouchableOpacity
            style={styles.timedToggle}
            onPress={() => setTimed(!timed)}>
            <Text style={styles.timedText}>
              Timed Mode: {timed ? 'ON' : 'OFF'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => {
              setStarted(true);
              lastMatchTime.current = Date.now();
            }}>
            <Text style={styles.startBtnText}>Start</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onBack}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Done screen
  if (done) {
    return (
      <View style={styles.container}>
        <View style={styles.preGame}>
          <Text style={styles.preTitle}>
            {timed && timeLeft === 0 ? "Time's up!" : 'Complete!'}
          </Text>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.matchedText}>
            {matchedCount} / {pairs.length} matched
          </Text>
          <TouchableOpacity style={styles.startBtn} onPress={onBack}>
            <Text style={styles.startBtnText}>Back to Play</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.scoreLabel}>Score: {score}</Text>
        {timed && (
          <Text style={[styles.timer, timeLeft <= 10 && styles.timerRed]}>
            {timeLeft}s
          </Text>
        )}
      </View>

      {/* Two columns */}
      <View style={styles.columns}>
        {/* Words column */}
        <View style={styles.column}>
          {shuffledWords.map(pairIdx => {
            const pair = pairs[pairIdx];
            if (pair.matched) return <View key={pairIdx} style={styles.emptySlot} />;
            const flash = flashState[`word-${pairIdx}`];
            const isSelected = selected?.type === 'word' && selected.index === pairIdx;
            return (
              <TouchableOpacity
                key={pairIdx}
                style={[
                  styles.tile,
                  isSelected && styles.tileSelected,
                  flash === 'correct' && styles.tileCorrect,
                  flash === 'wrong' && styles.tileWrong,
                ]}
                onPress={() => handleSelect('word', pairIdx)}>
                <Text style={styles.tileText}>{pair.word}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Definitions column */}
        <View style={styles.column}>
          {shuffledDefs.map(pairIdx => {
            const pair = pairs[pairIdx];
            if (pair.matched) return <View key={pairIdx} style={styles.emptySlot} />;
            const flash = flashState[`def-${pairIdx}`];
            const isSelected = selected?.type === 'definition' && selected.index === pairIdx;
            return (
              <TouchableOpacity
                key={pairIdx}
                style={[
                  styles.tile,
                  styles.defTile,
                  isSelected && styles.tileSelected,
                  flash === 'correct' && styles.tileCorrect,
                  flash === 'wrong' && styles.tileWrong,
                ]}
                onPress={() => handleSelect('definition', pairIdx)}>
                <Text style={styles.tileTextSmall} numberOfLines={3}>
                  {pair.definition}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

function shuffle(arr: number[]): number[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
  },
  closeBtn: {fontSize: 20, color: t.colors.muted, padding: 4},
  scoreLabel: {fontSize: 16, color: t.colors.accent, fontWeight: '600'},
  timer: {fontSize: 16, color: t.colors.secondary, fontWeight: '700'},
  timerRed: {color: '#ef5350'},
  columns: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 8,
    gap: 8,
  },
  column: {
    flex: 1,
    gap: 6,
    paddingVertical: 4,
  },
  tile: {
    backgroundColor: t.colors.surface,
    borderRadius: 12,
    padding: 12,
    minHeight: 56,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  defTile: {
    minHeight: 56,
  },
  tileSelected: {
    borderColor: t.colors.accent,
  },
  tileCorrect: {
    borderColor: '#4caf50',
    backgroundColor: '#1b3a1b',
  },
  tileWrong: {
    borderColor: '#ef5350',
    backgroundColor: '#3a1b1b',
  },
  emptySlot: {
    minHeight: 56,
    margin: 2,
  },
  tileText: {
    fontSize: 16,
    fontFamily: 'Georgia',
    color: t.colors.word,
    textAlign: 'center',
  },
  tileTextSmall: {
    fontSize: 12,
    color: t.colors.secondary,
    textAlign: 'center',
    lineHeight: 16,
  },
  preGame: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  preTitle: {fontSize: 28, fontWeight: '700', color: t.colors.word, marginBottom: 8},
  preDesc: {fontSize: 16, color: t.colors.secondary, marginBottom: 24},
  timedToggle: {
    backgroundColor: t.colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  timedText: {fontSize: 15, color: t.colors.accent},
  startBtn: {
    backgroundColor: t.colors.accent,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  startBtnText: {color: t.colors.background, fontSize: 16, fontWeight: '600'},
  cancelText: {color: t.colors.muted, fontSize: 14},
  scoreText: {fontSize: 36, fontWeight: '700', color: t.colors.accent, marginBottom: 8},
  matchedText: {fontSize: 16, color: t.colors.secondary, marginBottom: 32},
});
