# Hunt: MoreWords PWA — React Native → PWA Rebuild
Goal: MoreWords running as a PWA deployable to Vercel — same features, same logic packages, playable on iPhone via Safari with no Mac or Xcode required.
Repo: AetherCreator/more
Branch: feature/more-words-pwa
Base: main

## Context
The React Native build (claude/update-map-documentation-YEpDE) is complete and correct.
All logic lives in reusable packages — crossword generator, spaced repetition engine, AI curation.
This hunt is a SHELL SWAP. Port the logic, rebuild the UI layer in React + Tailwind.

## What carries over (do NOT rewrite these)
- `packages/crossword/` — crossword generator, 8/8 tests passing, <2ms expert
- `packages/engine/` — spaced repetition engine
- `packages/ai/` — AI curation logic (update API calls to use /api/claude proxy)
- `hunts/more-words/assets/seed-words.json` — 285 pre-generated seed words
- All game logic (flashcard, match, fill-in-blank algorithms)
- All data types from `apps/more-words/src/db/types.ts`

## What changes
- React Native → React 19 + Vite
- React Navigation → React Router v6
- expo-sqlite → sql.js (same as SuperConci's Story Quest)
- StyleSheet → Tailwind CSS
- WidgetKit widgets → skip (PWA cannot do native widgets)
- RevenueCat native SDK → RevenueCat web SDK
- Deployment: Vercel

## File Structure
```
apps/more-words-pwa/
├── index.html
├── vite.config.ts
├── package.json
├── src/
│   ├── App.tsx              ← React Router root
│   ├── db/
│   │   ├── storyDB.ts       ← sql.js init (copy pattern from SuperConci)
│   │   ├── types.ts         ← copy from RN build unchanged
│   │   └── seed.ts          ← import from hunts/more-words/assets/seed-words.json
│   ├── context/
│   │   └── ProfileContext.tsx ← copy from RN build, remove RN imports
│   ├── screens/             ← one file per screen, Tailwind not StyleSheet
│   ├── components/          ← ported from RN, div not View, Tailwind classes
│   └── theme/
│       └── index.ts         ← copy unchanged
```

## Clue Tree
1. **Vite + PWA Scaffold** → pass: React 19 + Vite app boots at localhost, React Router with 4 tab routes, Tailwind working, deploys to Vercel
2. **sql.js Database** → pass: sql.js initialized with App Group path, all 4 tables from RN build migrated, 285 seed words imported from hunts/more-words/assets/seed-words.json, queries return correct results
3. **Word Card + Swipe Feed** → pass: WordCard renders all fields with Tailwind, swipe feed shows 10 words, heart saves to deck, kid card renders for kid profile
4. **Personal Deck + Games** → pass: Deck screen shows saved words with mastery dots, all 3 games work (flashcard via @more/engine, match, fill-in-blank) 
5. **Crossword** → pass: All 3 crossword modes work (Random/Daily/My Words) using @more/crossword package unchanged, CrosswordPlayer renders in browser
6. **Multi-Profile + Onboarding** → pass: 2 profiles, kid mode, profile switcher, 5-screen onboarding flow, all under 90 seconds
7. **AI Curation + Paywall + Deploy** → pass: Claude API calls go through /api/claude proxy (never direct browser), RevenueCat web SDK gates More. bundle, deployed and live at Vercel URL

## Dead End Protocol
If any clue fails 3 times:
- Stop immediately
- Write STUCK.md: what was tried, what broke, what's needed
- Surface to Tyler with one question

## Critical Rules
- NEVER rewrite packages/crossword or packages/engine — import them as-is
- ALL Anthropic API calls go through /api/claude proxy — never direct from browser (Story Quest lesson)
- sql.js pattern: copy from SuperConci's storyDB.js — same approach already proven
- Tailwind only — no StyleSheet, no inline style objects
- Complete files only, never fragments
- Check claude/update-map-documentation-YEpDE for every screen's logic before writing anything new

## The sql.js Reference
SuperConci already solved sql.js in the browser. Before writing the DB layer, read:
`github.com/AetherCreator/SuperConci/src/games/story-quest/db/storyDB.js`
Copy the init pattern exactly — WASM loading, IndexedDB persistence, auto-save after writes.

## Success State (TREASURE)
Ashley opens morewords.vercel.app in Safari on her iPhone. She picks Art + Metaphysical interests. Her first word is *liminal*. She saves it. She plays the match game with her deck. She does today's crossword. Coci opens his profile — his first word is *locomotive*. Neither hit a paywall. No Mac was needed to ship it.
