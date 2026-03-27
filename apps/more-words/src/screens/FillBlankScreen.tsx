import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {SavedWord, Word} from '../db/types';
import {getSavedWords, updateMastery} from '../db';
import {
  buildFlashcardSession,
  getDistractors,
  updateMasteryScore,
} from '@more/engine';
import {defaultTheme} from '../theme';

interface FillBlankScreenProps {
  onBack: () => void;
}

const t = defaultTheme;
const SESSION_LENGTH = 10;

interface Question {
  savedWord: SavedWord;
  sentence: string;
  blank: string;
  options: string[];
  correctIndex: number;
}

function buildQuestion(
  savedWord: SavedWord,
  allWords: Word[],
): Question | null {
  const word = savedWord.word;
  if (!word) return null;

  // Find a sentence with the word in it
  const sentence = word.example_1 || word.example_2;
  if (!sentence) return null;

  // Create the blank — replace the word (case-insensitive)
  const regex = new RegExp(`\\b${word.word}\\b`, 'gi');
  const blanked = sentence.replace(regex, '______');
  if (blanked === sentence) {
    // Word not found in sentence — use definition-based question
    return null;
  }

  // Get distractors
  const engineWords = allWords.map(w => ({
    id: w.id,
    word: w.word,
    definition: w.definition,
    category: w.category,
    difficulty: w.difficulty,
    kid_safe: w.kid_safe,
    kid_definition: w.kid_definition,
  }));
  const targetEngine = {
    id: word.id,
    word: word.word,
    definition: word.definition,
    category: word.category,
    difficulty: word.difficulty,
    kid_safe: word.kid_safe,
    kid_definition: word.kid_definition,
  };

  const distractorWords = getDistractors(
    targetEngine,
    engineWords,
    savedWord.mastery,
    3,
  );

  const options = [word.word, ...distractorWords.map(d => d.word)];
  // Shuffle options
  const shuffled = [...options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const correctIndex = shuffled.indexOf(word.word);

  return {
    savedWord,
    sentence: blanked,
    blank: word.word,
    options: shuffled,
    correctIndex,
  };
}

export default function FillBlankScreen({
  onBack,
}: FillBlankScreenProps): React.JSX.Element {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [done, setDone] = useState(false);

  const load = useCallback(async () => {
    try {
      const saved = await getSavedWords(1);
      const allWords = saved
        .map(sw => sw.word)
        .filter((w): w is Word => w != null);

      const engineWords = saved.map(sw => ({
        word_id: sw.word_id,
        mastery: sw.mastery,
      }));
      const session = buildFlashcardSession(engineWords, SESSION_LENGTH * 2);

      // Build questions, deduplicate
      const seen = new Set<number>();
      const qs: Question[] = [];
      for (const sw of session) {
        if (seen.has(sw.word_id)) continue;
        seen.add(sw.word_id);
        const full = saved.find(s => s.word_id === sw.word_id);
        if (!full) continue;
        const q = buildQuestion(full, allWords);
        if (q) qs.push(q);
        if (qs.length >= SESSION_LENGTH) break;
      }
      setQuestions(qs);
    } catch {
      console.log('[FillBlank] Could not load');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAnswer(optionIndex: number) {
    if (answered !== null) return;
    setAnswered(optionIndex);

    const q = questions[index];
    const isCorrect = optionIndex === q.correctIndex;

    if (isCorrect) {
      setScore(prev => prev + 10);
      setCorrect(prev => prev + 1);
    } else {
      setScore(prev => Math.max(0, prev - 2));
      setWrong(prev => prev + 1);
    }

    // Update mastery
    const response = isCorrect ? 'know' : 'learning';
    const newMastery = updateMasteryScore(q.savedWord.mastery, response);
    try {
      await updateMastery(1, q.savedWord.word_id, newMastery);
    } catch {
      // DB not wired
    }

    // Auto-advance
    const delay = isCorrect ? 1000 : 1500;
    setTimeout(() => {
      if (index + 1 >= questions.length) {
        setDone(true);
      } else {
        setIndex(prev => prev + 1);
        setAnswered(null);
      }
    }, delay);
  }

  if (done) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.doneTitle}>Session Complete</Text>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <View style={styles.breakdown}>
            <Text style={[styles.breakdownItem, {color: '#4caf50'}]}>
              ✓ {correct} correct
            </Text>
            <Text style={[styles.breakdownItem, {color: '#ef5350'}]}>
              ✗ {wrong} wrong
            </Text>
          </View>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backBtnText}>Back to Play</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.loadingText}>Building questions...</Text>
        </View>
      </View>
    );
  }

  const q = questions[index];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.progress}>
          {index + 1} / {questions.length}
        </Text>
        <Text style={styles.scoreLabel}>Score: {score}</Text>
      </View>

      {/* Sentence */}
      <View style={styles.sentenceArea}>
        <Text style={styles.sentence}>{q.sentence}</Text>

        {answered !== null && answered !== q.correctIndex && (
          <Text style={styles.reveal}>The word was: {q.blank}</Text>
        )}
        {answered !== null && answered === q.correctIndex && (
          <Text style={styles.correctMsg}>Correct!</Text>
        )}
      </View>

      {/* Options */}
      <View style={styles.options}>
        {q.options.map((opt, i) => {
          let optStyle = styles.option;
          if (answered !== null) {
            if (i === q.correctIndex) {
              optStyle = {...styles.option, ...styles.optionCorrect};
            } else if (i === answered) {
              optStyle = {...styles.option, ...styles.optionWrong};
            }
          }
          return (
            <TouchableOpacity
              key={i}
              style={[styles.option, answered !== null && i === q.correctIndex && styles.optionCorrect, answered !== null && i === answered && i !== q.correctIndex && styles.optionWrong]}
              disabled={answered !== null}
              onPress={() => handleAnswer(i)}>
              <Text style={styles.optionText}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
    paddingHorizontal: 24,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
  },
  closeBtn: {fontSize: 20, color: t.colors.muted, padding: 4},
  progress: {fontSize: 14, color: t.colors.secondary},
  scoreLabel: {fontSize: 14, color: t.colors.accent, fontWeight: '600'},
  sentenceArea: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  sentence: {
    fontSize: 22,
    color: t.colors.word,
    textAlign: 'center',
    lineHeight: 32,
    fontStyle: 'italic',
  },
  reveal: {
    fontSize: 16,
    color: t.colors.accent,
    textAlign: 'center',
    marginTop: 16,
  },
  correctMsg: {
    fontSize: 16,
    color: '#4caf50',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '600',
  },
  options: {
    gap: 10,
    paddingBottom: 48,
  },
  option: {
    backgroundColor: t.colors.surface,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCorrect: {
    borderColor: '#4caf50',
    backgroundColor: '#1b3a1b',
  },
  optionWrong: {
    borderColor: '#ef5350',
    backgroundColor: '#3a1b1b',
  },
  optionText: {
    fontSize: 18,
    color: t.colors.word,
    textAlign: 'center',
    fontFamily: 'Georgia',
  },
  loadingText: {fontSize: 16, color: t.colors.secondary},
  doneTitle: {fontSize: 28, fontWeight: '700', color: t.colors.word, marginBottom: 8},
  scoreText: {fontSize: 36, fontWeight: '700', color: t.colors.accent, marginBottom: 24},
  breakdown: {gap: 8, marginBottom: 32},
  breakdownItem: {fontSize: 18, fontWeight: '500', textAlign: 'center'},
  backBtn: {
    backgroundColor: t.colors.accent,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  backBtnText: {color: t.colors.background, fontSize: 16, fontWeight: '600'},
});
