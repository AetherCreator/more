import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import { selectAll, selectOne, runAndPersist } from '../db/db'
import type { Profile } from '../db/types'

interface ProfileContextValue {
  currentProfile: Profile | null
  profiles: Profile[]
  switchProfile: (id: number) => void
  createProfile: (name: string, isKid: boolean, theme: string, interests: string[]) => Promise<Profile>
  refreshProfiles: () => void
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider')
  return ctx
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentId, setCurrentId] = useState<number | null>(null)

  const refreshProfiles = useCallback(() => {
    const rows = selectAll<Profile>('SELECT * FROM profiles ORDER BY id')
    setProfiles(rows)
    if (rows.length > 0 && (currentId === null || !rows.find((p) => p.id === currentId))) {
      setCurrentId(rows[0].id)
    }
  }, [currentId])

  useEffect(() => {
    refreshProfiles()
  }, [refreshProfiles])

  const currentProfile = profiles.find((p) => p.id === currentId) ?? null

  function switchProfile(id: number) {
    setCurrentId(id)
  }

  async function createProfile(name: string, isKid: boolean, theme: string, interests: string[]): Promise<Profile> {
    await runAndPersist(
      'INSERT INTO profiles (name, is_kid, theme, interests, streak, last_active) VALUES (?, ?, ?, ?, 0, datetime("now"))',
      [name, isKid ? 1 : 0, theme, interests.join(',')]
    )
    const profile = selectOne<Profile>('SELECT * FROM profiles ORDER BY id DESC LIMIT 1')!
    refreshProfiles()
    setCurrentId(profile.id)
    return profile
  }

  return (
    <ProfileContext.Provider value={{ currentProfile, profiles, switchProfile, createProfile, refreshProfiles }}>
      {children}
    </ProfileContext.Provider>
  )
}
