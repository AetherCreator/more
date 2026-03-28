# Clue 6: COMPLETE

## Confirmed
- New user sees 5-screen onboarding flow (name, kid/adult, interests, theme, start)
- Onboarding creates profile in DB and navigates to Feed
- Profile switcher in Settings works — up to 2 profiles
- Kid profile shows kid cards (WordCardKid) and filters feed to kid_safe words
- All screens use currentProfile from ProfileContext (no hardcoded profile IDs)
- Independent deck, mastery, and data per profile

## Files Created/Modified
- `src/context/ProfileContext.tsx` — profile state management
- `src/screens/OnboardingScreen.tsx` — 5-screen onboarding flow
- `src/screens/SettingsScreen.tsx` — profile switcher + add profile
- `src/App.tsx` — wrapped in ProfileProvider, shows onboarding if no profiles
- All game/feed/deck/crossword screens updated to use useProfile()
- `src/db/seed.ts` — removed auto-created default profile (onboarding handles it)
