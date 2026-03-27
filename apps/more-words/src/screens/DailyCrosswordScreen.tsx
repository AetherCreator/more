import React, {useCallback, useEffect, useState} from 'react';
import {Share, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {generateCrossword, type CrosswordGrid} from '@more/crossword';
import {getDailyWords} from '../db';
import {hashString, seededShuffle, getTodayString} from '../utils/dailySeed';
import CrosswordPlayer from '../components/CrosswordPlayer';
import {defaultTheme} from '../theme';

interface Props {
  onBack: () => void;
}

const t = defaultTheme;

export default function DailyCrosswordScreen({onBack}: Props): React.JSX.Element {
  const [puzzle, setPuzzle] = useState<CrosswordGrid | null>(null);
  const [completed, setCompleted] = useState(false);
  const [timeMs, setTimeMs] = useState(0);

  const generate = useCallback(async () => {
    try {
      const today = getTodayString();
      const seed = hashString(today);

      // Get a pool of words, then deterministically select/shuffle using the seed
      const words = await getDailyWords(1, 40);
      const shuffled = seededShuffle(words, seed);
      const selected = shuffled.slice(0, 15);

      const inputs = selected.map(w => ({
        word: w.word.toUpperCase(),
        clue: w.definition,
      }));

      // The generator uses Math.random internally for attempts,
      // but the word selection is deterministic — so the first attempt
      // with these exact words will produce a consistent grid.
      const result = generateCrossword(inputs, {difficulty: 'intermediate', maxAttempts: 1});
      setPuzzle(result);
    } catch {
      console.log('[DailyCrossword] Generation failed');
    }
  }, []);

  useEffect(() => {
    generate();
  }, [generate]);

  async function handleShare() {
    const mins = Math.floor(timeMs / 60000);
    const secs = Math.floor((timeMs % 60000) / 1000);
    const today = getTodayString().slice(5); // MM-DD
    await Share.share({
      message: `MoreWords Daily Crossword — ${today} ✓ Completed in ${mins}:${secs.toString().padStart(2, '0')}`,
    });
  }

  if (completed) {
    const mins = Math.floor(timeMs / 60000);
    const secs = Math.floor((timeMs % 60000) / 1000);
    return (
      <View style={styles.center}>
        <Text style={styles.solvedTitle}>Daily Complete!</Text>
        <Text style={styles.solvedTime}>{mins}:{secs.toString().padStart(2, '0')}</Text>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
          <Text style={styles.shareBtnText}>Share Result</Text>
        </TouchableOpacity>
        <Text style={styles.comeback}>Come back tomorrow for a new puzzle</Text>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backLink}>Back to Crosswords</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!puzzle) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading today's puzzle...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>← Crosswords</Text>
        </TouchableOpacity>
        <Text style={styles.dailyLabel}>Daily — {getTodayString()}</Text>
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
  dailyLabel: {fontSize: 13, color: t.colors.secondary},
  loadingText: {fontSize: 16, color: t.colors.secondary},
  solvedTitle: {fontSize: 32, fontWeight: '700', color: t.colors.accent, marginBottom: 8},
  solvedTime: {fontSize: 22, color: t.colors.secondary, marginBottom: 24},
  shareBtn: {backgroundColor: t.colors.accent, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12, marginBottom: 16},
  shareBtnText: {color: t.colors.background, fontSize: 16, fontWeight: '600'},
  comeback: {fontSize: 14, color: t.colors.muted, marginBottom: 24},
  backLink: {color: t.colors.muted, fontSize: 14},
});
