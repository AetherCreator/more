import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {defaultTheme} from '../theme';

const t = defaultTheme;

export default function SettingsScreen(): React.JSX.Element {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      {/* Profile section — expanded in Clue 11 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Name</Text>
          <Text style={styles.rowValue}>Me</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Theme</Text>
          <Text style={styles.rowValue}>Midnight</Text>
        </View>
      </View>

      {/* Widgets guide */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Widgets</Text>
        <Text style={styles.widgetGuide}>
          Add MoreWords widgets to your home screen:
        </Text>
        <Text style={styles.widgetStep}>
          1. Long press your home screen
        </Text>
        <Text style={styles.widgetStep}>
          2. Tap the + button in the top corner
        </Text>
        <Text style={styles.widgetStep}>
          3. Search for "MoreWords"
        </Text>
        <Text style={styles.widgetStep}>
          4. Pick your widget and size
        </Text>

        <View style={styles.widgetPreviewList}>
          <View style={styles.widgetPreview}>
            <Text style={styles.widgetName}>Word of the Day</Text>
            <Text style={styles.widgetDesc}>Today's featured word • Small, Medium, Large</Text>
          </View>
          <View style={styles.widgetPreview}>
            <Text style={styles.widgetName}>Streak</Text>
            <Text style={styles.widgetDesc}>Your current streak • Small</Text>
          </View>
          <View style={styles.widgetPreview}>
            <Text style={styles.widgetName}>My Words</Text>
            <Text style={styles.widgetDesc}>Rotates your deck every 2 hours • Medium</Text>
          </View>
          <View style={styles.widgetPreview}>
            <Text style={styles.widgetName}>Art Widget</Text>
            <Text style={styles.widgetDesc}>Beautiful typography for your home screen • Medium, Large</Text>
          </View>
        </View>
      </View>

      {/* Subscription — expanded in Clue 12 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>More. Bundle</Text>
        <Text style={styles.bundleDesc}>
          AI curation, unlimited profiles, premium themes
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>MoreWords v0.1.0</Text>
        <Text style={styles.footerText}>The More. Family</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: t.colors.word,
    marginBottom: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: t.colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1a1a1a',
  },
  rowLabel: {
    fontSize: 16,
    color: t.colors.word,
  },
  rowValue: {
    fontSize: 16,
    color: t.colors.secondary,
  },
  widgetGuide: {
    fontSize: 15,
    color: t.colors.secondary,
    marginBottom: 12,
    lineHeight: 22,
  },
  widgetStep: {
    fontSize: 14,
    color: t.colors.word,
    marginBottom: 6,
    paddingLeft: 8,
  },
  widgetPreviewList: {
    marginTop: 16,
    gap: 10,
  },
  widgetPreview: {
    backgroundColor: t.colors.surface,
    padding: 14,
    borderRadius: 12,
  },
  widgetName: {
    fontSize: 15,
    fontWeight: '600',
    color: t.colors.word,
    marginBottom: 2,
  },
  widgetDesc: {
    fontSize: 12,
    color: t.colors.muted,
  },
  bundleDesc: {
    fontSize: 15,
    color: t.colors.secondary,
  },
  footer: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: t.colors.muted,
  },
});
