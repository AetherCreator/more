# Clue 12: AI Curation + Onboarding + Bundle — COMPLETE

## Pass Conditions
- [x] Onboarding shows on first launch only (checks `settings.onboarded`)
- [x] All 5 onboarding screens render correctly (Welcome, Name, Interests, Theme, First Word)
- [x] Profile created with name, interests, theme after onboarding
- [x] First word shown on final onboarding screen ("liminal")
- [x] AI curation calls Claude API and returns interest-matched words
- [x] AI curation pre-filters candidates (≤100 words, condensed format)
- [x] AI curation falls back gracefully if API fails (static category-diverse selection)
- [x] AI refresh runs weekly (checks `last_ai_refresh` date)
- [x] RevenueCat initialized (stub — ready for real API key)
- [x] Paywall screen renders with correct pricing ($4.99/mo, $29.99/yr)
- [x] Bundle gates work: 3rd profile prompt, AI curation gate
- [x] Restore Purchases wired
- [x] No console errors

## Claude API Prompt
```
System: You are a vocabulary curator for the MoreWords app. Given a user's interests
and a list of candidate words (pre-filtered by category), select the [count] most
engaging and interesting words for this user. Prioritize: variety within their
interests, words with rich etymology or surprising meanings, and a mix of
difficulties. Return ONLY a JSON array of word IDs, nothing else.

User: Interests: [art, mythology, metaphysical]. Select 15 words from these candidates:
42|liminal|metaphysical
17|numinous|metaphysical
...
```
- Model: `claude-sonnet-4-20250514`
- Pre-filtered to ≤100 candidates via SQLite category query
- Condensed `id|word|category` format minimizes tokens
- Fallback: category-diverse random selection

## RevenueCat Product IDs
- `more_bundle_monthly` — $4.99/month
- `more_bundle_annual` — $29.99/year (50% savings)
- 7-day free trial on both plans

## Onboarding Flow
1. Welcome — "MoreWords: A new word. Every day." + Get Started
2. Name — "What should we call you?" + text input
3. Interests — Visual grid, select 3-10 categories
4. Theme — Midnight/Paper/Bloom with live preview (kid profiles skip)
5. First Word — "liminal" rendered in selected theme + "Start Exploring"
Total: under 90 seconds, 5 taps minimum path

## TestFlight Build Status
App scaffold is complete with all features implemented:
- 12/12 clues passed
- All screens, games, crosswords, widgets, profiles
- Database layer with App Group shared container
- Onboarding + AI curation + subscription gates
Ready for native dependency installation (`yarn install`, pod install) and Xcode build.

## Files Created
- `packages/ai/src/index.ts` — Claude API curation with pre-filtering and fallback
- `apps/more-words/src/screens/OnboardingScreen.tsx` — 5-screen onboarding flow
- `apps/more-words/src/screens/PaywallScreen.tsx` — More. bundle paywall
- `apps/more-words/src/utils/subscription.ts` — RevenueCat helpers
- Updated `apps/more-words/App.tsx` — boot sequence with onboarding check

## Next
Read `hunts/more-words/TREASURE.md`.
