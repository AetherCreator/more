import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {SavedWord} from '../db/types';
import {defaultTheme} from '../theme';

interface DeckWordRowProps {
  item: SavedWord;
  onPress: () => void;
}

const t = defaultTheme;

function getMasteryDots(mastery: number): string {
  if (mastery >= 4) return '●●●';
  if (mastery >= 2) return '●●○';
  return '●○○';
}

function getMasteryLabel(mastery: number): string {
  if (mastery >= 4) return 'Known';
  if (mastery >= 2) return 'Almost';
  return 'Learning';
}

export default function DeckWordRow({
  item,
  onPress,
}: DeckWordRowProps): React.JSX.Element {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={styles.left}>
        <Text style={styles.word}>{item.word?.word ?? '—'}</Text>
        <Text style={styles.mastery}>
          {getMasteryDots(item.mastery)}{' '}
          <Text style={styles.masteryLabel}>
            {getMasteryLabel(item.mastery)}
          </Text>
        </Text>
      </View>
      <View style={styles.right}>
        {item.word?.category && (
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{item.word.category}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1a1a1a',
  },
  left: {
    flex: 1,
  },
  word: {
    fontSize: 20,
    fontFamily: 'Georgia',
    color: t.colors.word,
    marginBottom: 4,
  },
  mastery: {
    fontSize: 12,
    color: t.colors.accent,
    letterSpacing: 2,
  },
  masteryLabel: {
    fontSize: 11,
    color: t.colors.muted,
    letterSpacing: 0,
  },
  right: {
    marginLeft: 12,
  },
  categoryPill: {
    backgroundColor: t.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  categoryText: {
    fontSize: 11,
    color: t.colors.secondary,
  },
});
