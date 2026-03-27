import React, {useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {defaultTheme, getTheme, midnight, paper, bloom} from '../theme';

interface OnboardingScreenProps {
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  name: string;
  interests: string[];
  theme: string;
  isKid: boolean;
}

const t = defaultTheme;
const {width: SCREEN_WIDTH} = Dimensions.get('window');

const ADULT_INTERESTS = [
  'Art', 'Mythology', 'Nature', 'Metaphysical', 'Science', 'History',
  'Architecture', 'Food', 'Music', 'Adventure', 'Animals', 'Technology',
];

const KID_INTERESTS = [
  'Trains', 'Space', 'Animals', 'Adventure', 'Science', 'Superheroes', 'Nature',
];

const THEMES = [
  {name: 'midnight', label: 'Midnight', theme: midnight},
  {name: 'paper', label: 'Paper', theme: paper},
  {name: 'bloom', label: 'Bloom', theme: bloom},
];

export default function OnboardingScreen({
  onComplete,
}: OnboardingScreenProps): React.JSX.Element {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [theme, setTheme] = useState('midnight');
  const [isKid, setIsKid] = useState(false);

  function toggleInterest(interest: string) {
    setInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : prev.length < 10
          ? [...prev, interest]
          : prev,
    );
  }

  function handleComplete() {
    onComplete({name: name.trim() || 'Me', interests, theme, isKid});
  }

  // Screen 1: Welcome
  if (step === 0) {
    return (
      <View style={styles.screen}>
        <Text style={styles.welcomeTitle}>MoreWords</Text>
        <Text style={styles.tagline}>A new word. Every day.</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setStep(1)}>
          <Text style={styles.primaryBtnText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Screen 2: Name
  if (step === 1) {
    return (
      <View style={styles.screen}>
        <Text style={styles.question}>What should we call you?</Text>
        <TextInput
          style={styles.nameInput}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={t.colors.muted}
          autoFocus
        />
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => setStep(2)}>
          <Text style={styles.primaryBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Screen 3: Interests
  if (step === 2) {
    const availableInterests = isKid ? KID_INTERESTS : ADULT_INTERESTS;
    return (
      <View style={styles.screen}>
        <Text style={styles.question}>What are you into?</Text>
        <Text style={styles.hint}>
          Select 3-10. This helps us find words you'll love.
        </Text>
        <View style={styles.interestGrid}>
          {availableInterests.map(interest => (
            <TouchableOpacity
              key={interest}
              style={[
                styles.interestChip,
                interests.includes(interest) && styles.interestActive,
              ]}
              onPress={() => toggleInterest(interest)}>
              <Text
                style={[
                  styles.interestText,
                  interests.includes(interest) && styles.interestTextActive,
                ]}>
                {interest}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.primaryBtn, interests.length < 3 && styles.btnDisabled]}
          disabled={interests.length < 3}
          onPress={() => setStep(isKid ? 4 : 3)}>
          <Text style={styles.primaryBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Screen 4: Theme (adults only)
  if (step === 3) {
    return (
      <View style={styles.screen}>
        <Text style={styles.question}>Pick your vibe</Text>
        <View style={styles.themeOptions}>
          {THEMES.map(opt => (
            <TouchableOpacity
              key={opt.name}
              style={[
                styles.themeOption,
                {backgroundColor: opt.theme.colors.background},
                theme === opt.name && {
                  borderColor: opt.theme.colors.accent,
                  borderWidth: 3,
                },
              ]}
              onPress={() => setTheme(opt.name)}>
              <Text
                style={{
                  fontFamily: 'Georgia',
                  fontSize: 28,
                  color: opt.theme.colors.word,
                  marginBottom: 4,
                }}>
                luminous
              </Text>
              <Text style={{fontSize: 13, color: opt.theme.colors.secondary}}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setStep(4)}>
          <Text style={styles.primaryBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Screen 5: First word
  if (step === 4) {
    const selectedTheme = getTheme(theme);
    return (
      <View style={[styles.screen, {backgroundColor: selectedTheme.colors.background}]}>
        <Text style={[styles.firstWordLabel, {color: selectedTheme.colors.accent}]}>
          Your first word
        </Text>
        <Text
          style={{
            fontFamily: 'Georgia',
            fontSize: 42,
            color: selectedTheme.colors.word,
            textAlign: 'center',
            marginBottom: 8,
          }}>
          liminal
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: selectedTheme.colors.muted,
            marginBottom: 16,
          }}>
          LIM-ih-nul
        </Text>
        <Text
          style={{
            fontSize: 18,
            color: selectedTheme.colors.word,
            textAlign: 'center',
            lineHeight: 26,
            paddingHorizontal: 24,
            marginBottom: 32,
          }}>
          Occupying a position at, or on both sides of, a boundary or threshold
        </Text>
        <TouchableOpacity style={[styles.primaryBtn, {backgroundColor: selectedTheme.colors.accent}]} onPress={handleComplete}>
          <Text style={[styles.primaryBtnText, {color: selectedTheme.colors.background}]}>
            Start Exploring →
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <View />;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: t.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  welcomeTitle: {
    fontFamily: 'Georgia',
    fontSize: 48,
    color: t.colors.word,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: t.colors.secondary,
    marginBottom: 48,
  },
  question: {
    fontSize: 24,
    fontWeight: '600',
    color: t.colors.word,
    marginBottom: 16,
    textAlign: 'center',
  },
  hint: {
    fontSize: 14,
    color: t.colors.muted,
    marginBottom: 24,
    textAlign: 'center',
  },
  nameInput: {
    backgroundColor: t.colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 20,
    color: t.colors.word,
    width: '100%',
    textAlign: 'center',
    marginBottom: 32,
  },
  primaryBtn: {
    backgroundColor: t.colors.accent,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryBtnText: {
    color: t.colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
  btnDisabled: {
    opacity: 0.4,
  },
  interestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  interestChip: {
    backgroundColor: t.colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  interestActive: {
    borderColor: t.colors.accent,
    backgroundColor: '#1a1a00',
  },
  interestText: {
    fontSize: 15,
    color: t.colors.secondary,
  },
  interestTextActive: {
    color: t.colors.accent,
    fontWeight: '600',
  },
  themeOptions: {
    gap: 16,
    width: '100%',
    marginBottom: 32,
  },
  themeOption: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  firstWordLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 12,
  },
});
