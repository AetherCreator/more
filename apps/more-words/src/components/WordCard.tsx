import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import type {Word} from '../db/types';
import {defaultTheme} from '../theme';

interface WordCardProps {
  word: Word;
  isSaved: boolean;
  isWordOfDay: boolean;
  onSave: () => void;
  onShare: () => void;
  showActions: boolean;
}

const t = defaultTheme;

export default function WordCard({
  word,
  isSaved,
  isWordOfDay,
  onSave,
  onShare,
  showActions,
}: WordCardProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {isWordOfDay && (
        <Text style={styles.wodLabel}>Word of the Day</Text>
      )}

      <View style={styles.content}>
        {/* Word */}
        <Text style={styles.word}>{word.word}</Text>

        {/* Pronunciation */}
        {word.pronunciation && (
          <Text style={styles.pronunciation}>{word.pronunciation}</Text>
        )}

        {/* Part of speech */}
        {word.part_of_speech && (
          <View style={styles.posTag}>
            <Text style={styles.posText}>{word.part_of_speech}</Text>
          </View>
        )}

        {/* Definition */}
        <Text style={styles.definition}>{word.definition}</Text>

        {/* Etymology */}
        {word.etymology && (
          <Text style={styles.etymology}>{word.etymology}</Text>
        )}

        {/* Examples */}
        <View style={styles.examples}>
          {word.example_1 && (
            <Text style={styles.example}>"{word.example_1}"</Text>
          )}
          {word.example_2 && (
            <Text style={styles.example}>"{word.example_2}"</Text>
          )}
        </View>

        {/* Usage note */}
        {word.usage_note && (
          <Text style={styles.usage}>{word.usage_note}</Text>
        )}
      </View>

      {/* Action buttons */}
      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity onPress={onShare} style={styles.actionBtn}>
            <Text style={styles.actionIcon}>↗</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSave} style={styles.actionBtn}>
            <Text
              style={[
                styles.heartIcon,
                isSaved && styles.heartFilled,
              ]}>
              {isSaved ? '♥' : '♡'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  wodLabel: {
    color: t.colors.accent,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 8,
  },
  content: {
    alignItems: 'center',
  },
  word: {
    fontFamily: t.typography.wordFamily,
    fontSize: t.typography.wordSize,
    color: t.colors.word,
    textAlign: 'center',
    marginBottom: 8,
  },
  pronunciation: {
    fontSize: t.typography.pronunciationSize,
    color: t.colors.muted,
    textAlign: 'center',
    marginBottom: 12,
  },
  posTag: {
    backgroundColor: t.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 20,
  },
  posText: {
    fontSize: 11,
    color: t.colors.secondary,
    textTransform: 'lowercase',
    letterSpacing: 1,
  },
  definition: {
    fontSize: t.typography.definitionSize,
    color: t.colors.word,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  etymology: {
    fontSize: t.typography.etymologySize,
    color: t.colors.muted,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  examples: {
    marginBottom: 16,
    gap: 8,
  },
  example: {
    fontSize: t.typography.exampleSize,
    color: t.colors.secondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  usage: {
    fontSize: t.typography.usageSize,
    color: t.colors.muted,
    textAlign: 'center',
    marginTop: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 60,
    left: 32,
    right: 32,
  },
  actionBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: t.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 22,
    color: t.colors.secondary,
  },
  heartIcon: {
    fontSize: 24,
    color: t.colors.heartEmpty,
  },
  heartFilled: {
    color: t.colors.heartFilled,
  },
});
