# Clue 6: Multi-Profile + Onboarding

## ⚠️ Read First
Open `hunts/more-words-pwa/clue-5/COMPLETE.md` and load its contents.
If it does not exist — STOP. Do not proceed.

## Context
All games and crossword work. Now wire up multi-profile and onboarding.
Reference the RN build for logic: `apps/more-words/src/context/ProfileContext.tsx` and `OnboardingScreen.tsx`.

## Files to Create/Modify
- `apps/more-words-pwa/src/context/ProfileContext.tsx` — port from RN, remove RN imports
- `apps/more-words-pwa/src/screens/OnboardingScreen.tsx` — 5-screen flow
- `apps/more-words-pwa/src/screens/ProfileEditScreen.tsx`
- Update all screens to use ProfileContext for current profile

## ProfileContext
- Loads profiles from DB on mount
- Exposes: currentProfile, profiles, switchProfile(), createProfile()
- If no profiles exist → redirect to onboarding
- Wrap App.tsx in ProfileProvider

## Onboarding (5 screens, under 90 seconds total)
1. Welcome — "What's your name?"
2. Is this for a child? (yes/no) → sets is_kid flag
3. Pick your interests (grid of categories from seed words: science, art, nature, food, etc.)
4. Pick your theme (Midnight / Paper / Bloom) — show preview
5. All set → create profile in DB, navigate to Feed

## Multi-Profile
- Up to 2 profiles
- Profile switcher in Settings screen
- Kid profiles: filtered word feed, simplified card, kid PIN on settings
- Each profile has independent deck, streak, mastery

## Pass Conditions
- [ ] New user sees onboarding on first load
- [ ] Onboarding creates profile in DB and navigates to Feed
- [ ] Profile switcher in Settings works
- [ ] Kid profile shows kid cards and filters feed to kid_safe words
- [ ] All screens use currentProfile from ProfileContext (no hardcoded profile IDs)
- [ ] Onboarding completes under 90 seconds

## Do Not
- Do not build AI curation yet — that is Clue 7
- Kid PIN is optional — skip if it adds complexity

## When You Pass
Write clue-6/COMPLETE.md: confirmed onboarding creates profile, profile switching works.
Then open clue-7/PROMPT.md.
