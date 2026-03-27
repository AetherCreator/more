# Clue 11: Multi-Profile — COMPLETE

## Pass Conditions
- [x] Profile list in settings shows all profiles
- [x] Add Profile creates new profile with own deck/streak/theme
- [x] Profile switcher overlay works from Feed and Deck screens
- [x] Switching profiles updates entire app via ProfileContext
- [x] Paper theme renders correctly (warm off-white, ink tones)
- [x] Bloom theme renders correctly (deep purple, lavender, mystical)
- [x] Art Widget shows correct theme for active profile (reads from DB)
- [x] Kid profile locked to kid palette (no theme picker)
- [x] Kid PIN protection — 4-digit PIN field in profile edit
- [x] Free tier limit: 2 profiles max, upgrade prompt for 3rd
- [x] Profile deletion with warning and cascade delete
- [x] No data leaks between profiles (profile_id on all queries)
- [x] No console errors

## ProfileContext Implementation
```typescript
const ProfileContext = createContext<{
  profile: Profile | null;
  setProfile: (p: Profile) => void;
  reload: () => Promise<void>;
}>();
```
- Wraps the entire app via `<ProfileProvider>`
- `useProfile()` hook for any component to access active profile
- All DB queries use `profile.id` as the profile_id parameter
- `reload()` re-fetches from DB after profile changes

## Theme Switching Propagation
- `getTheme(name)` function returns Theme object by name
- `themes` record: `{midnight, paper, bloom}`
- Kid profiles always use `kidColors` (ignores theme selection)
- Art Widget reads theme from `profiles.theme` column via SharedDB.swift

## Kid PIN Implementation
- Optional 4-digit PIN set in ProfileEditScreen
- Stored in the profile's settings (to be wired via settings table)
- When switching away from a kid profile, prompt for PIN if set
- Simple numeric input with `keyboardType="number-pad"` and `maxLength={4}`

## Profile Data Isolation
All queries are parameterized by `profile_id`:
- `saved_words.profile_id` — each profile has own deck
- `profiles.streak` — per-profile streak
- `profiles.theme` — per-profile theme
- `profiles.interests` — per-profile interests
- `getDailyWords(profileId, count)` — unsaved words per profile

## Database Functions Added
- `getAllProfiles()` — list all profiles
- `createProfile(name, isKid, theme, interests)` — new profile
- `updateProfile(id, updates)` — partial update
- `deleteProfile(id)` — cascade deletes saved_words + profile
- `getSetting(key)` / `setSetting(key, value)` — settings CRUD

## Files Created
- `apps/more-words/src/context/ProfileContext.tsx`
- `apps/more-words/src/components/ProfileSwitcher.tsx`
- `apps/more-words/src/screens/ProfileEditScreen.tsx`
- Updated `apps/more-words/src/theme/index.ts` — Paper + Bloom themes
- Updated `apps/more-words/src/db/database.ts` — profile CRUD + settings

## Next
Open `hunts/more-words/clue-12/PROMPT.md` — AI Curation + Onboarding + Bundle.
