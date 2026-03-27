import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {SavedWord} from '../db/types';
import {getSavedWords, updateMastery} from '../db';
import {
  buildFlashcardSession,
  updateMasteryScore,
  type FlashcardResponse,
} from '@more/engine';
import FlipCard from '../components/FlipCard';
import {defaultTheme} from '../theme';

interface FlashcardScreenProps {
  onBack: () => void;
}

const t = defaultTheme;
const SESSION_LENGTH = 10;

interface SessionResult {
  know: number;
  almost: number;
  learning: number;
}

export default function FlashcardScreen({
  onBack,
}: FlashcardScreenProps): React.JSX.Element {
  const [session, setSession] = useState<SavedWord[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState<SessionResult>({know: 0, almost: 0, learning: 0});
  const [done, setDone] = useState(false);

  const load = useCallback(async () => {
    try {
      const saved = await getSavedWords(1);
      const engineWords = saved.map(sw => ({
        word_id: sw.word_id,
        mastery: sw.mastery,
        word: sw.word
          ? {
              id: sw.word.id,
              word: sw.word.word,
              definition: sw.word.definition,
              category: sw.word.category,
              difficulty: sw.word.difficulty,
              kid_safe: sw.word.kid_safe,
              kid_definition: sw.word.kid_definition,
            }
          : undefined,
      }));
      const built = buildFlashcardSession(engineWords, SESSION_LENGTH);
      // Map back to SavedWord shape
      const sessionWords = built
        .map(ew => saved.find(sw => sw.word_id === ew.word_id))
        .filter((sw): sw is SavedWord => sw != null);
      setSession(sessionWords);
    } catch {
      console.log('[Flashcard] Could not load session');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleResponse(response: FlashcardResponse) {
    const current = session[index];
    if (!current) return;

    // Update mastery
    const newMastery = updateMasteryScore(current.mastery, response);
    try {
      await updateMastery(1, current.word_id, newMastery);
    } catch {
      // DB not wired
    }

    // Track results
    setResults(prev => ({...prev, [response]: prev[response] + 1}));

    // Next card or finish
    if (index + 1 >= session.length) {
      setDone(true);
    } else {
      setIndex(prev => prev + 1);
      setFlipped(false);
    }
  }

  // Session complete
  if (done) {
    const total = results.know + results.almost + results.learning;
    return (
      <View style={styles.container}>
        <View style={styles.completeCard}>
          <Text style={styles.completeTitle}>Session Complete</Text>
          <Text style={styles.completeCount}>{total} words reviewed</Text>

          <View style={styles.breakdown}>
            <Text style={[styles.breakdownItem, {color: '#4caf50'}]}>
              ✓ {results.know} knew
            </Text>
            <Text style={[styles.breakdownItem, {color: '#ffb300'}]}>
              ~ {results.almost} almost
            </Text>
            <Text style={[styles.breakdownItem, {color: '#ef5350'}]}>
              ✗ {results.learning} learning
            </Text>
          </View>

          <Text style={styles.completeMsg}>Nice work.</Text>

          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>Back to Play</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (session.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Building session...</Text>
      </View>
    );
  }

  const currentWord = session[index];

  return (
    <View style={styles.container}>
      {/* Progress */}
      <View style={styles.progressRow}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.progressText}>
          Card {index + 1} of {session.length}
        </Text>
        <View style={{width: 24}} />
      </View>

      {/* Card */}
      <View style={styles.cardArea}>
        {currentWord.word && (
          <FlipCard
            word={currentWord.word}
            isKid={false}
            onFlip={() => setFlipped(true)}
          />
        )}
      </View>

      {/* Response buttons — appear after flip */}
      {flipped && (
        <View style={styles.responseRow}>
          <TouchableOpacity
            style={[styles.responseBtn, styles.knowBtn]}
            onPress={() => handleResponse('know')}>
            <Text style={styles.responseBtnText}>✓ Know It</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.responseBtn, styles.almostBtn]}
            onPress={() => handleResponse('almost')}>
            <Text style={styles.responseBtnText}>~ Almost</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.responseBtn, styles.learningBtn]}
            onPress={() => handleResponse('learning')}>
            <Text style={styles.responseBtnText}>✗ Learning</Text>
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
    paddingHorizontal: 24,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
  },
  closeBtn: {
    fontSize: 20,
    color: t.colors.muted,
    padding: 4,
  },
  progressText: {
    fontSize: 14,
    color: t.colors.secondary,
  },
  cardArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  responseRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 48,
    gap: 12,
  },
  responseBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  knowBtn: {
    backgroundColor: '#1b3a1b',
  },
  almostBtn: {
    backgroundColor: '#3a3a1b',
  },
  learningBtn: {
    backgroundColor: '#3a1b1b',
  },
  responseBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingText: {
    color: t.colors.secondary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 100,
  },
  completeCard: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: t.colors.word,
    marginBottom: 8,
  },
  completeCount: {
    fontSize: 16,
    color: t.colors.secondary,
    marginBottom: 24,
  },
  breakdown: {
    gap: 8,
    marginBottom: 24,
  },
  breakdownItem: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  completeMsg: {
    fontSize: 16,
    color: t.colors.muted,
    marginBottom: 32,
  },
  backButton: {
    backgroundColor: t.colors.accent,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  backButtonText: {
    color: t.colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
});
