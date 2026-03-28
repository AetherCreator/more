# Clue 7: COMPLETE

## Confirmed
- AI curation calls /api/claude proxy (Vercel Edge Function) — never direct browser call
- On API failure: graceful fallback to random words from matching categories
- Paywall screen renders for locked features (2nd profile, premium themes)
- Free features all work without paywall: word feed, all games, all crosswords, 1 profile, Midnight theme
- ANTHROPIC_API_KEY is server-side only in api/claude.js (no VITE_ prefix)
- PWA manifest configured (name, theme_color, display: standalone)
- Add to Home Screen ready for iOS Safari
- Ashley test: onboard → pick Art + Metaphysical → AI curates matching words → fallback uses art/abstract/emotion categories
- Coci test: kid profile → feed shows only kid_safe words → all games work

## Files Created
- `api/claude.js` — Vercel Edge Function proxy for Anthropic API
- `src/utils/aiCuration.ts` — AI curation with fallback to category-based random
- `src/screens/PaywallScreen.tsx` — More. Bundle paywall overlay
- `public/manifest.json` — PWA manifest

## Files Modified
- `src/screens/OnboardingScreen.tsx` — fire-and-forget AI curation after profile creation
- `src/screens/SettingsScreen.tsx` — paywall gate on 2nd profile creation
- `index.html` — manifest + apple-touch-icon links

## Deploy Requirements
- Set ANTHROPIC_API_KEY in Vercel environment variables
- Deploy from apps/more-words-pwa root
- vercel.json rewrites already configured (Clue 1)
