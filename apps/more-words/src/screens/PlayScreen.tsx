import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {getSavedWordCount} from '../db';
import FlashcardScreen from './FlashcardScreen';
import MatchGameScreen from './MatchGameScreen';
import FillBlankScreen from './FillBlankScreen';
import {defaultTheme} from '../theme';

type ActiveGame = null | 'flashcards' | 'match' | 'fill-blank';

const t = defaultTheme;
const GAMES_UNLOCK = 10;

interface GameOption {
  id: ActiveGame;
  title: string;
  description: string;
  icon: string;
}

const GAMES: GameOption[] = [
  {
    id: 'flashcards',
    title: 'Flashcards',
    description: 'Flip cards to test your memory',
    icon: '🃏',
  },
  {
    id: 'match',
    title: 'Match Game',
    description: 'Pair words with their definitions',
    icon: '🔗',
  },
  {
    id: 'fill-blank',
    title: 'Fill in the Blank',
    description: 'Complete the sentence with the right word',
    icon: '✏️',
  },
];

export default function PlayScreen(): React.JSX.Element {
  const [activeGame, setActiveGame] = useState<ActiveGame>(null);
  const [wordCount, setWordCount] = useState(0);

  const loadCount = useCallback(async () => {
    try {
      const count = await getSavedWordCount(1);
      setWordCount(count);
    } catch {
      setWordCount(0);
    }
  }, []);

  useEffect(() => {
    loadCount();
  }, [loadCount]);

  // Refresh count when returning from a game
  function handleBack() {
    setActiveGame(null);
    loadCount();
  }

  if (activeGame === 'flashcards') {
    return <FlashcardScreen onBack={handleBack} />;
  }
  if (activeGame === 'match') {
    return <MatchGameScreen onBack={handleBack} />;
  }
  if (activeGame === 'fill-blank') {
    return <FillBlankScreen onBack={handleBack} />;
  }

  const locked = wordCount < GAMES_UNLOCK;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Play</Text>
      <Text style={styles.subtitle}>
        {wordCount} word{wordCount !== 1 ? 's' : ''} in your deck
      </Text>

      {locked && (
        <View style={styles.lockBanner}>
          <Text style={styles.lockText}>
            Save {GAMES_UNLOCK - wordCount} more word
            {GAMES_UNLOCK - wordCount !== 1 ? 's' : ''} to unlock games
          </Text>
        </View>
      )}

      <View style={styles.gameList}>
        {GAMES.map(game => (
          <TouchableOpacity
            key={game.id}
            style={[styles.gameCard, locked && styles.gameCardLocked]}
            disabled={locked}
            onPress={() => setActiveGame(game.id)}>
            <Text style={styles.gameIcon}>{game.icon}</Text>
            <View style={styles.gameInfo}>
              <Text style={[styles.gameTitle, locked && styles.gameTitleLocked]}>
                {game.title}
              </Text>
              <Text style={styles.gameDesc}>{game.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: t.colors.word,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: t.colors.secondary,
    marginBottom: 20,
  },
  lockBanner: {
    backgroundColor: t.colors.surface,
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  lockText: {
    fontSize: 14,
    color: t.colors.accent,
    textAlign: 'center',
  },
  gameList: {
    gap: 12,
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: t.colors.surface,
    padding: 20,
    borderRadius: 16,
  },
  gameCardLocked: {
    opacity: 0.4,
  },
  gameIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: t.colors.word,
    marginBottom: 4,
  },
  gameTitleLocked: {
    color: t.colors.muted,
  },
  gameDesc: {
    fontSize: 13,
    color: t.colors.secondary,
  },
});
