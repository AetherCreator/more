import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import type {Word} from '../db/types';
import {defaultTheme} from '../theme';

interface ShareCardProps {
  word: Word;
}

const t = defaultTheme;

/**
 * Off-screen styled View captured as PNG for sharing.
 * Rendered hidden in the feed, captured via react-native-view-shot.
 */
const ShareCard = React.forwardRef<View, ShareCardProps>(
  ({word}, ref) => (
    <View ref={ref} style={styles.card} collapsable={false}>
      <Text style={styles.brand}>MoreWords</Text>
      <Text style={styles.word}>{word.word}</Text>
      {word.pronunciation && (
        <Text style={styles.pronunciation}>{word.pronunciation}</Text>
      )}
      <Text style={styles.definition}>{word.definition}</Text>
    </View>
  ),
);

ShareCard.displayName = 'ShareCard';
export default ShareCard;

const styles = StyleSheet.create({
  card: {
    width: 400,
    padding: 40,
    backgroundColor: t.colors.background,
    borderWidth: 1,
    borderColor: t.colors.accent,
    borderRadius: 16,
    position: 'absolute',
    top: -1000,
    left: -1000,
  },
  brand: {
    fontSize: 11,
    color: t.colors.accent,
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 24,
  },
  word: {
    fontFamily: t.typography.wordFamily,
    fontSize: 36,
    color: t.colors.word,
    marginBottom: 8,
  },
  pronunciation: {
    fontSize: 13,
    color: t.colors.muted,
    marginBottom: 16,
  },
  definition: {
    fontSize: 16,
    color: t.colors.secondary,
    lineHeight: 24,
  },
});
