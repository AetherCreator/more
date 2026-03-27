import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Share,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewToken,
} from 'react-native';
import type {Word} from '../db/types';
import {getDailyWords, saveWord as saveWordDB} from '../db';
import WordCard from '../components/WordCard';
import ShareCard from '../components/ShareCard';
import {defaultTheme} from '../theme';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');
const CARD_HEIGHT = SCREEN_HEIGHT;

export default function FeedScreen(): React.JSX.Element {
  const [words, setWords] = useState<Word[]>([]);
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showActions, setShowActions] = useState(true);
  const shareRef = useRef<View>(null);

  useEffect(() => {
    loadWords();
  }, []);

  async function loadWords() {
    try {
      const daily = await getDailyWords(1, 10);
      setWords(daily);
    } catch {
      // DB not fully wired yet — show empty state
      console.log('[Feed] getDailyWords not available yet');
    }
  }

  const onViewableItemsChanged = useCallback(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  async function handleSave(wordId: number) {
    // Optimistic UI
    setSavedIds(prev => {
      const next = new Set(prev);
      if (next.has(wordId)) {
        next.delete(wordId);
      } else {
        next.add(wordId);
      }
      return next;
    });
    try {
      await saveWordDB(1, wordId);
    } catch {
      console.log('[Feed] saveWord not available yet');
    }
  }

  async function handleShare(word: Word) {
    try {
      // In production, capture shareRef via react-native-view-shot
      // For now, share as text
      await Share.share({
        message: `${word.word} — ${word.definition}\n\nvia MoreWords`,
      });
    } catch {
      // User cancelled
    }
  }

  function toggleActions() {
    setShowActions(prev => !prev);
  }

  const renderCard = useCallback(
    ({item, index}: {item: Word; index: number}) => (
      <TouchableWithoutFeedback onPress={toggleActions}>
        <View style={{height: CARD_HEIGHT}}>
          <WordCard
            word={item}
            isSaved={savedIds.has(item.id)}
            isWordOfDay={index === 0}
            onSave={() => handleSave(item.id)}
            onShare={() => handleShare(item)}
            showActions={showActions}
          />
        </View>
      </TouchableWithoutFeedback>
    ),
    [savedIds, showActions],
  );

  if (words.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>MoreWords</Text>
        <Text style={styles.emptySubtitle}>Feed</Text>
        <Text style={styles.emptyHint}>
          Words will appear here once the database is connected.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={words}
        renderItem={renderCard}
        keyExtractor={item => String(item.id)}
        pagingEnabled
        snapToInterval={CARD_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_data, index) => ({
          length: CARD_HEIGHT,
          offset: CARD_HEIGHT * index,
          index,
        })}
      />

      {/* Position counter */}
      <View style={styles.counter}>
        <Text style={styles.counterText}>
          {currentIndex + 1} / {words.length}
        </Text>
      </View>

      {/* Hidden share card for capture */}
      {words[currentIndex] && (
        <ShareCard ref={shareRef} word={words[currentIndex]} />
      )}
    </View>
  );
}

const t = defaultTheme;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
  },
  empty: {
    flex: 1,
    backgroundColor: t.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: t.colors.word,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 18,
    color: t.colors.secondary,
    marginBottom: 16,
  },
  emptyHint: {
    fontSize: 14,
    color: t.colors.muted,
    textAlign: 'center',
  },
  counter: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(22,22,24,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  counterText: {
    fontSize: 12,
    color: t.colors.secondary,
  },
});
