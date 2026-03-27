# Clue 11: Multi-Profile

## ⚠️ Read First
Open `hunts/more-words/clue-10/COMPLETE.md` and load its contents before reading anything else.
If that file does not exist — STOP. Clue 10 has not been completed. Do not proceed.

## Context
Full app works end to end. Widgets live on home screen. Now add proper multi-profile support — Ashley and Coci each get their own experience. Also complete the theme system with Paper and Bloom.

## Your Task
Build full multi-profile support and complete the visual theme system.

### Profile Management (Settings tab)
Settings → "Profiles" section:
- Shows list of existing profiles with name + avatar initial
- "Add Profile" button (free tier: max 2 profiles, bundle: unlimited)
- Tap profile → switch to it (with confirmation if deck is unsaved)
- Edit profile: name, kid toggle, theme, interests
- Delete profile (with warning: "This will delete your deck and streak")

### Profile Switcher
Persistent profile indicator in top-right of Feed and Deck screens.
Tap it → quick profile switcher overlay (shows all profiles, tap to switch).
Active profile shows checkmark.

### Complete Theme System
Implement Paper and Bloom themes (Midnight already exists from Clue 3).

**Paper theme:**
- Background: #f5f0e8
- Word color: #1a1a1a
- Accent: #8b4513 (warm brown)
- Secondary: #666666
- Card feel: warm, analog, like a physical index card

**Bloom theme:**
- Background: #1a0a2e (deep purple)
- Word color: #e8d5f5 (soft lavender)
- Accent: #c084fc (purple)
- Secondary: #9d7bb0
- Card feel: mystical, metaphysical, Ashley's vibe

Theme applies to:
- Word cards
- Deck screen
- Games backgrounds
- Art Widget background

### Theme Selection
Settings → "Appearance" → theme picker with live preview of current word card.

### Kid Profile Specifics
Kid profiles ignore theme selection — always use the kid color palette (bright, colorful, playful).
Kid profiles can't be switched to adult mode by the kid (PIN protection option — simple 4-digit PIN set by parent in settings).

### Profile Data Isolation
Each profile has its own:
- Saved words deck (already in schema via profile_id)
- Streak counter
- Game scores
- Theme preference
- Word queue (today's 10 words, unique per profile)

### Free Tier Limit
2 profiles max on free tier.
"Add Profile" beyond 2 → shows "More. bundle unlocks unlimited profiles" with upgrade prompt.
Upgrade prompt is informational only — no payment yet (Clue 12).

## Files to Create/Modify
- `apps/more-words/src/screens/SettingsScreen.tsx` — profile management
- `apps/more-words/src/screens/ProfileEditScreen.tsx`
- `apps/more-words/src/components/ProfileSwitcher.tsx`
- `apps/more-words/src/theme/index.ts` — add Paper + Bloom themes
- `apps/more-words/src/context/ProfileContext.tsx` — active profile context

## Pass Conditions
- [ ] Profile list in settings shows all profiles
- [ ] Add Profile creates new profile with own deck/streak/theme
- [ ] Profile switcher overlay works from Feed and Deck screens
- [ ] Switching profiles updates entire app (words, deck, theme, games)
- [ ] Paper theme renders correctly on word card + screens
- [ ] Bloom theme renders correctly on word card + screens
- [ ] Art Widget shows correct theme for active profile
- [ ] Kid profile can't switch themes (locked to kid palette)
- [ ] Kid PIN protection works
- [ ] Free tier limit shows upgrade prompt at 3rd profile attempt
- [ ] Profile deletion with warning works
- [ ] No data leaks between profiles
- [ ] No console errors

## Do Not
- Build RevenueCat payment flow — Clue 12
- Build AI curation — Clue 12
- Build onboarding — Clue 12
- Add more than 3 free themes

## When You Pass
Write `hunts/more-words/clue-11/COMPLETE.md` with:
- ProfileContext implementation
- How theme switching propagates through app
- Kid PIN implementation
- Profile data isolation confirmed

Then open `hunts/more-words/clue-12/PROMPT.md`.
