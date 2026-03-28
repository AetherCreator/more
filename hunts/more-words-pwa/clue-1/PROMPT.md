# Clue 1: Vite + PWA Scaffold

## Your Task
Bootstrap the PWA app inside the existing monorepo. This is the shell — no logic yet.

## Files to Create
- `apps/more-words-pwa/package.json` — React 19, Vite, React Router v6, Tailwind, sql.js
- `apps/more-words-pwa/vite.config.ts` — standard Vite config with React plugin
- `apps/more-words-pwa/index.html` — entry point
- `apps/more-words-pwa/src/App.tsx` — React Router root with 4 bottom tab routes: Feed, Deck, Play, Settings
- `apps/more-words-pwa/src/screens/FeedScreen.tsx` — placeholder: "Word Feed"
- `apps/more-words-pwa/src/screens/DeckScreen.tsx` — placeholder: "My Deck"
- `apps/more-words-pwa/src/screens/PlayScreen.tsx` — placeholder: "Play"
- `apps/more-words-pwa/src/screens/SettingsScreen.tsx` — placeholder: "Settings"
- `apps/more-words-pwa/tailwind.config.js` — configured for src/
- `apps/more-words-pwa/postcss.config.js`

## Tab Navigation
Use React Router v6 with a persistent bottom nav bar. 4 tabs with icons:
- 📖 Feed → /
- 🃏 Deck → /deck
- 🎮 Play → /play
- ⚙️ Settings → /settings

Bottom nav is always visible. Active tab highlighted.

## Vercel Deploy
- `apps/more-words-pwa/vercel.json` — single-page app rewrite rule (all routes → index.html)

## Pass Conditions
- [ ] `npm run dev` in apps/more-words-pwa starts without errors
- [ ] All 4 tab routes render their placeholder text
- [ ] Bottom nav visible, tapping tabs switches routes
- [ ] Tailwind classes apply correctly (verify with a colored div)
- [ ] Deploys to Vercel without build errors
- [ ] No React Native imports anywhere

## Do Not
- Do not build any real UI yet — placeholders only
- Do not set up the database yet — that is Clue 2
- Do not import packages/crossword or packages/engine yet

## When You Pass
Write clue-1/COMPLETE.md: Vercel URL, confirmed tab routing works, package versions used.
Then open clue-2/PROMPT.md.
