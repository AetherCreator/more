import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {Word} from '../db/types';
import {defaultTheme} from '../theme';

interface FlipCardProps {
  word: Word;
  isKid: boolean;
  onFlip: () => void;
}

const t = defaultTheme;

export default function FlipCard({
  word,
  isKid,
  onFlip,
}: FlipCardProps): React.JSX.Element {
  const [flipped, setFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;

  // Reset when word changes
  useEffect(() => {
    setFlipped(false);
    flipAnim.setValue(0);
  }, [word.id, flipAnim]);

  function handleFlip() {
    if (flipped) return;
    setFlipped(true);
    Animated.spring(flipAnim, {
      toValue: 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    onFlip();
  }

  const frontRotation = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotation = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={handleFlip}
      style={styles.container}>
      {/* Front — word only */}
      <Animated.View
        style={[
          styles.card,
          styles.front,
          {transform: [{rotateY: frontRotation}]},
        ]}>
        <Text style={styles.wordText}>{word.word}</Text>
        {word.pronunciation && (
          <Text style={styles.pronunciation}>{word.pronunciation}</Text>
        )}
        <Text style={styles.tapHint}>tap to flip</Text>
      </Animated.View>

      {/* Back — definition */}
      <Animated.View
        style={[
          styles.card,
          styles.back,
          {transform: [{rotateY: backRotation}]},
        ]}>
        <Text style={styles.backWord}>{word.word}</Text>
        <Text style={styles.definition}>
          {isKid && word.kid_definition ? word.kid_definition : word.definition}
        </Text>
        {word.example_1 && (
          <Text style={styles.example}>"{word.example_1}"</Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 320,
    perspective: 1000,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backfaceVisibility: 'hidden',
  },
  front: {
    backgroundColor: t.colors.surface,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  back: {
    backgroundColor: '#1a1a1f',
    borderWidth: 1,
    borderColor: t.colors.accent,
  },
  wordText: {
    fontFamily: 'Georgia',
    fontSize: 38,
    color: t.colors.word,
    textAlign: 'center',
  },
  pronunciation: {
    fontSize: 14,
    color: t.colors.muted,
    marginTop: 8,
  },
  tapHint: {
    fontSize: 12,
    color: t.colors.muted,
    marginTop: 24,
    letterSpacing: 1,
  },
  backWord: {
    fontFamily: 'Georgia',
    fontSize: 24,
    color: t.colors.accent,
    marginBottom: 16,
  },
  definition: {
    fontSize: 18,
    color: t.colors.word,
    textAlign: 'center',
    lineHeight: 26,
  },
  example: {
    fontSize: 14,
    color: t.colors.secondary,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});
