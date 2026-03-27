import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {generateCrossword, type CrosswordGrid} from '@more/crossword';
import {getSavedWords} from '../db';
import CrosswordPlayer from '../components/CrosswordPlayer';
import {defaultTheme} from '../theme';

interface Props {
  onBack: () => void;
}

const t = defaultTheme;
const MIN_WORDS = 15;

export default function MyWordsCrosswordScreen({onBack}: Props): React.JSX.Element {
  const [puzzle, setPuzzle] = useState<CrosswordGrid | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [locked, setLocked] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [timeMs, setTimeMs] = useState(0);

  const generate = useCallback(async () => {
    try {
      const saved = await getSavedWords(1);
      setWordCount(saved.length);

      if (saved.length < MIN_WORDS) {
        setLocked(true);
        return;
      }

      const inputs = saved
        .filter(sw => sw.word)
        .map(sw => ({
          word: sw.word!.word.toUpperCase(),
          clue: sw.word!.definition,
        }));

      const result = generateCrossword(inputs, {difficulty: 'beginner'});
      setPuzzle(result);
    } catch {
      console.log('[MyWordsCrossword] Generation failed');
    }
  }, []);

  useEffect(() => {
    generate();
  }, [generate]);

  if (locked) {
    const remaining = MIN_WORDS - wordCount;
    return (
      <View style={styles.center}>
        <Text style={styles.lockIcon}>📚</Text>
        <Text style={styles.lockTitle}>My Words Crossword</Text>
        <Text style={styles.lockMsg}>
          Your deck isn't quite big enough yet.{'\n'}
          Save {remaining} more word{remaining !== 1 ? 's' : ''}.
        </Text>
        <Text style={styles.lockCount}>{wordCount} / {MIN_WORDS} words</Text>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backLink}>Back to Crosswords</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (completed) {
    const mins = Math.floor(timeMs / 60000);
    const secs = Math.floor((timeMs % 60000) / 1000);
    return (
      <View style={styles.center}>
        <Text style={styles.solvedTitle}>You knew all these words!</Text>
        <Text style={styles.solvedTime}>{mins}:{secs.toString().padStart(2, '0')}</Text>
        <TouchableOpacity style={styles.btn} onPress={() => {setPuzzle(null); setCompleted(false); generate();}}>
          <Text style={styles.btnText}>New Puzzle</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backLink}>Back to Crosswords</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!puzzle) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Building your crossword...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>← Crosswords</Text>
        </TouchableOpacity>
        <Text style={styles.label}>Your Words</Text>
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
  back: {fontSize: 15, color: t.colors.accent},
  topBar: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4},
  label: {fontSize: 13, color: t.colors.secondary},
  loadingText: {fontSize: 16, color: t.colors.secondary},
  lockIcon: {fontSize: 48, marginBottom: 16},
  lockTitle: {fontSize: 24, fontWeight: '700', color: t.colors.word, marginBottom: 8},
  lockMsg: {fontSize: 16, color: t.colors.secondary, textAlign: 'center', lineHeight: 24, marginBottom: 12},
  lockCount: {fontSize: 14, color: t.colors.accent, marginBottom: 24},
  solvedTitle: {fontSize: 24, fontWeight: '700', color: t.colors.accent, marginBottom: 8, textAlign: 'center'},
  solvedTime: {fontSize: 22, color: t.colors.secondary, marginBottom: 32},
  btn: {backgroundColor: t.colors.accent, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12, marginBottom: 16},
  btnText: {color: t.colors.background, fontSize: 16, fontWeight: '600'},
  backLink: {color: t.colors.muted, fontSize: 14},
});
