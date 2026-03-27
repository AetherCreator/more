import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

export default function PlayScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MoreWords</Text>
      <Text style={styles.subtitle}>Play</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#888888',
  },
});
