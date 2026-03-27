import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import type {Word} from '../db/types';
import {kidColors, getKidBackground} from '../theme';

interface WordCardKidProps {
  word: Word;
  isSaved: boolean;
  isWordOfDay: boolean;
  onSave: () => void;
  onShare: () => void;
  showActions: boolean;
}

export default function WordCardKid({
  word,
  isSaved,
  isWordOfDay,
  onSave,
  onShare,
  showActions,
}: WordCardKidProps): React.JSX.Element {
  const bg = getKidBackground(word.category);

  return (
    <View style={[styles.container, {backgroundColor: bg}]}>
      {isWordOfDay && (
        <Text style={styles.wodLabel}>⭐ Word of the Day ⭐</Text>
      )}

      <View style={styles.content}>
        {/* Word — big and bold */}
        <Text style={styles.word}>{word.word}</Text>

        {/* Part of speech */}
        {word.part_of_speech && (
          <Text style={styles.pos}>{word.part_of_speech}</Text>
        )}

        {/* Kid definition or fallback to regular */}
        <Text style={styles.definition}>
          {word.kid_definition || word.definition}
        </Text>

        {/* Fun fact */}
        {word.kid_fun_fact && (
          <View style={styles.funFactBox}>
            <Text style={styles.funFactLabel}>Fun Fact!</Text>
            <Text style={styles.funFact}>{word.kid_fun_fact}</Text>
          </View>
        )}

        {/* Example */}
        {word.example_1 && (
          <Text style={styles.example}>"{word.example_1}"</Text>
        )}
      </View>

      {/* Action buttons */}
      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity onPress={onShare} style={styles.actionBtn}>
            <Text style={styles.actionIcon}>↗</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSave} style={styles.actionBtn}>
            <Text style={styles.heartIcon}>
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
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  wodLabel: {
    color: kidColors.accent,
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },
  content: {
    alignItems: 'center',
  },
  word: {
    fontSize: 52,
    fontWeight: '800',
    color: kidColors.word,
    textAlign: 'center',
    marginBottom: 8,
  },
  pos: {
    fontSize: 14,
    color: kidColors.secondary,
    textAlign: 'center',
    marginBottom: 16,
    textTransform: 'lowercase',
  },
  definition: {
    fontSize: 22,
    color: kidColors.word,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  funFactBox: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    width: '100%',
  },
  funFactLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: kidColors.accent,
    marginBottom: 6,
    textAlign: 'center',
  },
  funFact: {
    fontSize: 16,
    color: kidColors.word,
    textAlign: 'center',
    lineHeight: 22,
  },
  example: {
    fontSize: 16,
    color: kidColors.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    position: 'absolute',
    bottom: 60,
    left: 28,
    right: 28,
  },
  actionBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    fontSize: 24,
    color: '#ffffff',
  },
  heartIcon: {
    fontSize: 26,
    color: kidColors.accent,
  },
});
