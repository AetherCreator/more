import React, {useState} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type {Profile} from '../db/types';
import {defaultTheme} from '../theme';

interface ProfileSwitcherProps {
  currentProfile: Profile;
  profiles: Profile[];
  onSwitch: (profile: Profile) => void;
}

const t = defaultTheme;

export default function ProfileSwitcher({
  currentProfile,
  profiles,
  onSwitch,
}: ProfileSwitcherProps): React.JSX.Element {
  const [visible, setVisible] = useState(false);

  const initial = currentProfile.name.charAt(0).toUpperCase();

  return (
    <>
      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setVisible(true)}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>Switch Profile</Text>
            {profiles.map(p => (
              <TouchableOpacity
                key={p.id}
                style={styles.profileRow}
                onPress={() => {
                  onSwitch(p);
                  setVisible(false);
                }}>
                <View style={[styles.profileAvatar, p.is_kid && styles.kidAvatar]}>
                  <Text style={styles.profileAvatarText}>
                    {p.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.profileName}>{p.name}</Text>
                {p.id === currentProfile.id && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    position: 'absolute',
    top: 56,
    right: 20,
    zIndex: 100,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: t.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: t.colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet: {
    backgroundColor: t.colors.surface,
    borderRadius: 20,
    padding: 24,
    width: 280,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: t.colors.word,
    marginBottom: 16,
    textAlign: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: t.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kidAvatar: {
    backgroundColor: '#ffcc00',
  },
  profileAvatarText: {
    color: t.colors.background,
    fontSize: 18,
    fontWeight: '700',
  },
  profileName: {
    flex: 1,
    fontSize: 16,
    color: t.colors.word,
  },
  checkmark: {
    fontSize: 18,
    color: t.colors.accent,
  },
});
