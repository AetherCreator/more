import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RandomCrosswordScreen from './RandomCrosswordScreen';
import DailyCrosswordScreen from './DailyCrosswordScreen';
import MyWordsCrosswordScreen from './MyWordsCrosswordScreen';
import {defaultTheme} from '../theme';

interface CrosswordScreenProps {
  onBack: () => void;
}

type Mode = null | 'random' | 'daily' | 'mywords';

const t = defaultTheme;

export default function CrosswordScreen({
  onBack,
}: CrosswordScreenProps): React.JSX.Element {
  const [mode, setMode] = useState<Mode>(null);

  if (mode === 'random') return <RandomCrosswordScreen onBack={() => setMode(null)} />;
  if (mode === 'daily') return <DailyCrosswordScreen onBack={() => setMode(null)} />;
  if (mode === 'mywords') return <MyWordsCrosswordScreen onBack={() => setMode(null)} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.back}>← Play</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Crosswords</Text>
      </View>

      <View style={styles.modes}>
        <TouchableOpacity style={styles.modeCard} onPress={() => setMode('random')}>
          <Text style={styles.modeIcon}>🎲</Text>
          <Text style={styles.modeTitle}>Random</Text>
          <Text style={styles.modeDesc}>Pick a difficulty, solve a fresh puzzle</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.modeCard} onPress={() => setMode('daily')}>
          <Text style={styles.modeIcon}>📅</Text>
          <Text style={styles.modeTitle}>Daily</Text>
          <Text style={styles.modeDesc}>Same puzzle for everyone today</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.modeCard} onPress={() => setMode('mywords')}>
          <Text style={styles.modeIcon}>📚</Text>
          <Text style={styles.modeTitle}>My Words</Text>
          <Text style={styles.modeDesc}>A crossword from your saved deck</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  back: {
    fontSize: 15,
    color: t.colors.accent,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: t.colors.word,
  },
  modes: {
    gap: 16,
  },
  modeCard: {
    backgroundColor: t.colors.surface,
    borderRadius: 16,
    padding: 20,
  },
  modeIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  modeTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: t.colors.word,
    marginBottom: 4,
  },
  modeDesc: {
    fontSize: 14,
    color: t.colors.secondary,
  },
});
