import React, {useCallback, useEffect, useState} from 'react';
import {Share, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {generateCrossword, type CrosswordGrid, type Difficulty} from '@more/crossword';
import {getDailyWords} from '../db';
import CrosswordPlayer from '../components/CrosswordPlayer';
import {defaultTheme} from '../theme';

interface Props {
  onBack: () => void;
}

const t = defaultTheme;
const WORD_COUNTS: Record<Difficulty, number> = {
  beginner: 12,
  intermediate: 18,
  advanced: 22,
  expert: 28,
};

export default function RandomCrosswordScreen({onBack}: Props): React.JSX.Element {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [puzzle, setPuzzle] = useState<CrosswordGrid | null>(null);
  const [completed, setCompleted] = useState(false);
  const [timeMs, setTimeMs] = useState(0);
  const [error, setError] = useState(false);

  const generate = useCallback(async (diff: Difficulty) => {
    try {
      const words = await getDailyWords(1, WORD_COUNTS[diff] + 10);
      const inputs = words.map(w => ({word: w.word.toUpperCase(), clue: w.definition}));
      const result = generateCrossword(inputs, {difficulty: diff});
      if (result) {
        setPuzzle(result);
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    if (difficulty) generate(difficulty);
  }, [difficulty, generate]);

  if (completed) {
    const mins = Math.floor(timeMs / 60000);
    const secs = Math.floor((timeMs % 60000) / 1000);
    return (
      <View style={styles.center}>
        <Text style={styles.solvedTitle}>Solved!</Text>
        <Text style={styles.solvedTime}>{mins}:{secs.toString().padStart(2, '0')}</Text>
        <TouchableOpacity style={styles.btn} onPress={() => {setDifficulty(null); setPuzzle(null); setCompleted(false);}}>
          <Text style={styles.btnText}>New Puzzle</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backLink}>Back to Crosswords</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!difficulty) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>← Crosswords</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Random Crossword</Text>
        <Text style={styles.subtitle}>Pick your difficulty</Text>
        <View style={styles.diffList}>
          {(['beginner', 'intermediate', 'advanced', 'expert'] as Difficulty[]).map(d => (
            <TouchableOpacity
              key={d}
              style={styles.diffBtn}
              onPress={() => setDifficulty(d)}>
              <Text style={styles.diffText}>{d.charAt(0).toUpperCase() + d.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Couldn't generate a puzzle. Try again.</Text>
        <TouchableOpacity style={styles.btn} onPress={() => {setError(false); setDifficulty(null);}}>
          <Text style={styles.btnText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!puzzle) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Generating puzzle...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => {setDifficulty(null); setPuzzle(null);}}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
      </View>
      <CrosswordPlayer
        puzzle={puzzle}
        onComplete={(ms) => {setTimeMs(ms); setCompleted(true);}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: t.colors.background, paddingHorizontal: 16, paddingTop: 60},
  center: {flex: 1, backgroundColor: t.colors.background, justifyContent: 'center', alignItems: 'center', padding: 32},
  back: {fontSize: 15, color: t.colors.accent, marginBottom: 12},
  topBar: {marginBottom: 4},
  title: {fontSize: 24, fontWeight: '700', color: t.colors.word, marginBottom: 4},
  subtitle: {fontSize: 14, color: t.colors.secondary, marginBottom: 20},
  diffList: {gap: 12},
  diffBtn: {backgroundColor: t.colors.surface, padding: 16, borderRadius: 12},
  diffText: {fontSize: 18, color: t.colors.word, fontWeight: '500'},
  loadingText: {fontSize: 16, color: t.colors.secondary},
  errorText: {fontSize: 16, color: t.colors.error, marginBottom: 16, textAlign: 'center'},
  solvedTitle: {fontSize: 32, fontWeight: '700', color: t.colors.accent, marginBottom: 8},
  solvedTime: {fontSize: 22, color: t.colors.secondary, marginBottom: 32},
  btn: {backgroundColor: t.colors.accent, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12, marginBottom: 16},
  btnText: {color: t.colors.background, fontSize: 16, fontWeight: '600'},
  backLink: {color: t.colors.muted, fontSize: 14},
});
