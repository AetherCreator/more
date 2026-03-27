import React, {useEffect, useRef, useState} from 'react';
import {
  AppState,
  Linking,
  NavigationContainer,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {NavigationContainer as NavContainer} from '@react-navigation/native';
import {NavigationContainerRef} from '@react-navigation/native';
import TabNavigator from './src/navigation/TabNavigator';
import {initDB} from './src/db';
import {refreshWidgets} from '@more/widgets';

export default function App(): React.JSX.Element {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigationRef = useRef<any>(null);

  useEffect(() => {
    initDB()
      .then(() => setReady(true))
      .catch(err => {
        console.error('[MoreWords] DB init failed:', err);
        setError(String(err));
      });
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
        <Text style={styles.errorText}>DB Error: {error}</Text>
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

  return (
    <NavContainer ref={navigationRef} linking={linking}>
      <TabNavigator />
    </NavContainer>
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
