import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import type {Profile} from '../db/types';
import {getDefaultProfile} from '../db';

interface ProfileContextValue {
  profile: Profile | null;
  setProfile: (p: Profile) => void;
  reload: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue>({
  profile: null,
  setProfile: () => {},
  reload: async () => {},
});

export function ProfileProvider({children}: {children: React.ReactNode}): React.JSX.Element {
  const [profile, setProfile] = useState<Profile | null>(null);

  const reload = useCallback(async () => {
    try {
      const p = await getDefaultProfile();
      setProfile(p);
    } catch {
      // DB not wired yet — use default
      setProfile({
        id: 1,
        name: 'Me',
        is_kid: 0,
        theme: 'midnight',
        interests: '[]',
        streak: 0,
        last_active: null,
      });
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <ProfileContext.Provider value={{profile, setProfile, reload}}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextValue {
  return useContext(ProfileContext);
}
