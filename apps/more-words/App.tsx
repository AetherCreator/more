import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import TabNavigator from './src/navigation/TabNavigator';
import {initDB} from './src/db';

export default function App(): React.JSX.Element {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initDB()
      .then(() => setReady(true))
      .catch(err => {
        console.error('[MoreWords] DB init failed:', err);
        setError(String(err));
      });
  }, []);

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
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
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
