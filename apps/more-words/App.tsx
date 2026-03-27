import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import TabNavigator from './src/navigation/TabNavigator';
import {initDB, getSetting, setSetting, createProfile} from './src/db';
import {refreshWidgets} from '@more/widgets';
import {initSubscriptions} from './src/utils/subscription';
import {ProfileProvider} from './src/context/ProfileContext';
import OnboardingScreen, {type OnboardingData} from './src/screens/OnboardingScreen';

export default function App(): React.JSX.Element {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [onboarded, setOnboarded] = useState<boolean | null>(null);
  const navigationRef = useRef<any>(null);

  useEffect(() => {
    async function boot() {
      try {
        await initDB();
        await initSubscriptions();
        const onboardedFlag = await getSetting('onboarded');
        setOnboarded(onboardedFlag === 'true');
        setReady(true);
      } catch (err) {
        console.error('[MoreWords] Boot failed:', err);
        // Fallback: skip DB check, proceed as onboarded
        setOnboarded(false);
        setReady(true);
      }
    }
    boot();
  }, []);

  // Refresh widgets on app foreground
  useEffect(() => {
    const sub = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        refreshWidgets();
      }
    });
    return () => sub.remove();
  }, []);

  async function handleOnboardingComplete(data: OnboardingData) {
    try {
      await createProfile(data.name, data.isKid ? 1 : 0, data.theme, JSON.stringify(data.interests));
      await setSetting('onboarded', 'true');
    } catch {
      // DB not wired — proceed anyway
    }
    setOnboarded(true);
  }

  // Deep link handling
  const linking = {
    prefixes: ['morewords://'],
    config: {
      screens: {
        Feed: 'feed',
        Deck: 'deck',
        Play: 'play',
        Settings: 'settings',
      },
    },
  };

  if (error) {
    return (
      <View style={styles.loading}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#d4af37" />
        <Text style={styles.loadingText}>Loading MoreWords...</Text>
      </View>
    );
  }

  if (!onboarded) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <ProfileProvider>
      <NavigationContainer ref={navigationRef} linking={linking}>
        <TabNavigator />
      </NavigationContainer>
    </ProfileProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#888888',
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    padding: 20,
    textAlign: 'center',
  },
});
