import React, {useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type {Profile} from '../db/types';
import {getTheme, themes} from '../theme';
import {defaultTheme} from '../theme';

interface ProfileEditScreenProps {
  profile: Profile;
  onSave: (updated: Partial<Profile>) => void;
  onDelete: () => void;
  onBack: () => void;
}

const t = defaultTheme;
const FREE_THEME_NAMES = ['midnight', 'paper', 'bloom'];

export default function ProfileEditScreen({
  profile,
  onSave,
  onDelete,
  onBack,
}: ProfileEditScreenProps): React.JSX.Element {
  const [name, setName] = useState(profile.name);
  const [isKid, setIsKid] = useState(!!profile.is_kid);
  const [theme, setTheme] = useState(profile.theme);
  const [pin, setPin] = useState('');

  function handleSave() {
    onSave({
      name: name.trim() || profile.name,
      is_kid: isKid ? 1 : 0,
      theme: isKid ? 'kid' : theme,
    });
    onBack();
  }

  function handleDelete() {
    Alert.alert(
      'Delete Profile',
      `This will delete "${profile.name}" and their deck, streak, and game data. This cannot be undone.`,
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', style: 'destructive', onPress: onDelete},
      ],
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={onBack}>
        <Text style={styles.back}>← Settings</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Edit Profile</Text>

      {/* Name */}
      <View style={styles.field}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Profile name"
          placeholderTextColor={t.colors.muted}
        />
      </View>

      {/* Kid toggle */}
      <View style={styles.switchRow}>
        <Text style={styles.label}>Kid Profile</Text>
        <Switch
          value={isKid}
          onValueChange={setIsKid}
          trackColor={{true: t.colors.accent}}
        />
      </View>

      {isKid && (
        <View style={styles.field}>
          <Text style={styles.label}>Parent PIN (4 digits)</Text>
          <TextInput
            style={styles.input}
            value={pin}
            onChangeText={text => setPin(text.replace(/[^0-9]/g, '').slice(0, 4))}
            placeholder="Optional — prevents switching"
            placeholderTextColor={t.colors.muted}
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>
      )}

      {/* Theme picker */}
      {!isKid && (
        <View style={styles.field}>
          <Text style={styles.label}>Theme</Text>
          <View style={styles.themeList}>
            {FREE_THEME_NAMES.map(tName => {
              const th = getTheme(tName);
              return (
                <TouchableOpacity
                  key={tName}
                  style={[
                    styles.themeCard,
                    {backgroundColor: th.colors.background, borderColor: th.colors.accent},
                    theme === tName && styles.themeActive,
                  ]}
                  onPress={() => setTheme(tName)}>
                  <Text
                    style={[
                      styles.themePreviewWord,
                      {color: th.colors.word, fontFamily: th.typography.wordFamily},
                    ]}>
                    luminous
                  </Text>
                  <Text style={[styles.themeName, {color: th.colors.secondary}]}>
                    {tName.charAt(0).toUpperCase() + tName.slice(1)}
                  </Text>
                  {theme === tName && (
                    <Text style={[styles.themeCheck, {color: th.colors.accent}]}>✓</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {isKid && (
        <View style={styles.kidNote}>
          <Text style={styles.kidNoteText}>
            Kid profiles always use the colorful kid theme — no theme selection needed.
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save Changes</Text>
      </TouchableOpacity>

      {profile.id !== 1 && (
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteBtnText}>Delete Profile</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: t.colors.background,
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  back: {
    fontSize: 15,
    color: t.colors.accent,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: t.colors.word,
    marginBottom: 24,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: t.colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    backgroundColor: t.colors.surface,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: t.colors.word,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  themeList: {
    gap: 12,
  },
  themeCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  themeActive: {
    borderWidth: 2,
  },
  themePreviewWord: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  themeName: {
    fontSize: 13,
  },
  themeCheck: {
    position: 'absolute',
    top: 12,
    right: 12,
    fontSize: 18,
  },
  kidNote: {
    backgroundColor: t.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  kidNoteText: {
    fontSize: 14,
    color: t.colors.secondary,
    textAlign: 'center',
  },
  saveBtn: {
    backgroundColor: t.colors.accent,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveBtnText: {
    color: t.colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  deleteBtn: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  deleteBtnText: {
    color: t.colors.error,
    fontSize: 14,
  },
});
