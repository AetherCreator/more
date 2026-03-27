import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type {SavedWord} from '../db/types';
import {getSavedWords} from '../db';
import DeckWordRow from '../components/DeckWordRow';
import WordCard from '../components/WordCard';
import {defaultTheme} from '../theme';

type Filter = 'all' | 'category' | 'difficulty' | 'mastery';
type MasteryFilter = 'learning' | 'almost' | 'known';

const t = defaultTheme;
const GAMES_UNLOCK = 10;
const CROSSWORD_UNLOCK = 15;

export default function DeckScreen(): React.JSX.Element {
  const [words, setWords] = useState<SavedWord[]>([]);
  const [filtered, setFiltered] = useState<SavedWord[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null);
  const [selectedMastery, setSelectedMastery] = useState<MasteryFilter | null>(null);
  const [detailWord, setDetailWord] = useState<SavedWord | null>(null);

  const load = useCallback(async () => {
    try {
      const saved = await getSavedWords(1);
      setWords(saved);
    } catch {
      console.log('[Deck] getSavedWords not available yet');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Apply filters
  useEffect(() => {
    let result = [...words];
    if (filter === 'category' && selectedCategory) {
      result = result.filter(w => w.word?.category === selectedCategory);
    } else if (filter === 'difficulty' && selectedDifficulty) {
      result = result.filter(w => w.word?.difficulty === selectedDifficulty);
    } else if (filter === 'mastery' && selectedMastery) {
      if (selectedMastery === 'learning') result = result.filter(w => w.mastery <= 1);
      else if (selectedMastery === 'almost') result = result.filter(w => w.mastery >= 2 && w.mastery <= 3);
      else result = result.filter(w => w.mastery >= 4);
    }
    setFiltered(result);
  }, [words, filter, selectedCategory, selectedDifficulty, selectedMastery]);

  const categories = [...new Set(words.map(w => w.word?.category).filter(Boolean))] as string[];

  function handleRemove(item: SavedWord) {
    Alert.alert(
      'Remove Word',
      `Remove "${item.word?.word}" from your deck?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            // removeWord will be called here once wired
            setWords(prev => prev.filter(w => w.id !== item.id));
          },
        },
      ],
    );
  }

  // Detail view
  if (detailWord && detailWord.word) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setDetailWord(null)}>
          <Text style={styles.backText}>← Back to Deck</Text>
        </TouchableOpacity>
        <WordCard
          word={detailWord.word}
          isSaved={true}
          isWordOfDay={false}
          onSave={() => handleRemove(detailWord)}
          onShare={() => {}}
          showActions={true}
        />
      </View>
    );
  }

  // Empty state
  if (words.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>My Deck</Text>
        <Text style={styles.emptyMsg}>
          No words yet. Head to the feed and save some words you love.
        </Text>
        <Text style={styles.emptyArrow}>← Feed</Text>
      </View>
    );
  }

  const gamesLeft = Math.max(0, GAMES_UNLOCK - words.length);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Deck</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{words.length} words</Text>
        </View>
      </View>

      {/* Games unlock progress */}
      {gamesLeft > 0 && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {width: `${(words.length / GAMES_UNLOCK) * 100}%`}]} />
          <Text style={styles.progressText}>
            Save {gamesLeft} more word{gamesLeft !== 1 ? 's' : ''} to unlock games
          </Text>
        </View>
      )}

      {/* Filter bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
        {(['all', 'category', 'difficulty', 'mastery'] as Filter[]).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterActive]}
            onPress={() => {
              setFilter(f);
              setSelectedCategory(null);
              setSelectedDifficulty(null);
              setSelectedMastery(null);
            }}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Sub-filters */}
      {filter === 'category' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subFilter}>
          {categories.map(c => (
            <TouchableOpacity
              key={c}
              style={[styles.filterChip, selectedCategory === c && styles.filterActive]}
              onPress={() => setSelectedCategory(selectedCategory === c ? null : c)}>
              <Text style={[styles.filterText, selectedCategory === c && styles.filterTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      {filter === 'difficulty' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subFilter}>
          {[1, 2, 3, 4, 5].map(d => (
            <TouchableOpacity
              key={d}
              style={[styles.filterChip, selectedDifficulty === d && styles.filterActive]}
              onPress={() => setSelectedDifficulty(selectedDifficulty === d ? null : d)}>
              <Text style={[styles.filterText, selectedDifficulty === d && styles.filterTextActive]}>
                {'★'.repeat(d)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
      {filter === 'mastery' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subFilter}>
          {([['learning', 'Learning'], ['almost', 'Almost'], ['known', 'Known']] as [MasteryFilter, string][]).map(
            ([key, label]) => (
              <TouchableOpacity
                key={key}
                style={[styles.filterChip, selectedMastery === key && styles.filterActive]}
                onPress={() => setSelectedMastery(selectedMastery === key ? null : key)}>
                <Text style={[styles.filterText, selectedMastery === key && styles.filterTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </ScrollView>
      )}

      {/* Word list */}
      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <DeckWordRow item={item} onPress={() => setDetailWord(item)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: t.colors.word,
  },
  badge: {
    backgroundColor: t.colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    color: t.colors.secondary,
  },
  progressBar: {
    marginHorizontal: 20,
    marginBottom: 12,
    height: 24,
    backgroundColor: t.colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: t.colors.accent,
    borderRadius: 12,
    opacity: 0.3,
  },
  progressText: {
    fontSize: 11,
    color: t.colors.secondary,
    textAlign: 'center',
  },
  filterBar: {
    paddingHorizontal: 16,
    maxHeight: 44,
    marginBottom: 4,
  },
  subFilter: {
    paddingHorizontal: 16,
    maxHeight: 40,
    marginBottom: 4,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: t.colors.surface,
    marginRight: 8,
  },
  filterActive: {
    backgroundColor: t.colors.accent,
  },
  filterText: {
    fontSize: 13,
    color: t.colors.secondary,
  },
  filterTextActive: {
    color: t.colors.background,
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    backgroundColor: t.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: t.colors.word,
    marginBottom: 12,
  },
  emptyMsg: {
    fontSize: 16,
    color: t.colors.secondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyArrow: {
    fontSize: 14,
    color: t.colors.muted,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 8,
  },
  backText: {
    fontSize: 15,
    color: t.colors.accent,
  },
});
