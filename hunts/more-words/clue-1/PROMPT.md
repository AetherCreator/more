# Clue 1: Repo Scaffold

## Your Task
Initialize the More. monorepo with React Native. This is the foundation everything else builds on. Get it right here and the rest of the hunt flows cleanly.

### Monorepo Structure
```
more/
├── package.json          ← root workspace config
├── packages/
│   ├── engine/           ← spaced repetition, mastery, streak logic
│   │   ├── package.json
│   │   └── src/index.js  ← placeholder export
│   ├── crossword/        ← crossword generator
│   │   ├── package.json
│   │   └── src/index.js  ← placeholder export
│   ├── widgets/          ← iOS widget bridge
│   │   ├── package.json
│   │   └── src/index.js  ← placeholder export
│   └── ai/               ← Claude API curation
│       ├── package.json
│       └── src/index.js  ← placeholder export
└── apps/
    └── more-words/       ← React Native app
        ├── package.json
        ├── App.tsx
        ├── index.js
        └── src/
            ├── screens/
            ├── components/
            ├── navigation/
            └── db/
```

### React Native Setup
- Use React Native CLI (not Expo) — needed for WidgetKit bridge in Clue 10
- TypeScript throughout
- Navigation: React Navigation v6 (stack + bottom tabs)
- Bottom tabs: Feed / Deck / Play / Settings
- App.tsx boots to Feed tab showing placeholder text "MoreWords — Feed"
- Each tab shows its name as placeholder text — no real content yet

### Root package.json
Use Yarn workspaces:
```json
{
  "name": "more",
  "private": true,
  "workspaces": ["packages/*", "apps/*"]
}
```

### Package names
- `@more/engine`
- `@more/crossword`
- `@more/widgets`
- `@more/ai`
- `more-words` (the app)

## Files to Create
- Root `package.json` with workspaces
- `packages/engine/package.json` + `src/index.js`
- `packages/crossword/package.json` + `src/index.js`
- `packages/widgets/package.json` + `src/index.js`
- `packages/ai/package.json` + `src/index.js`
- Full React Native app in `apps/more-words/`

## Pass Conditions
- [ ] Monorepo structure matches spec above
- [ ] Yarn workspaces configured correctly
- [ ] React Native app boots on iOS simulator without errors
- [ ] Bottom tab navigation renders: Feed / Deck / Play / Settings
- [ ] Each tab shows placeholder text
- [ ] TypeScript configured, no type errors
- [ ] All 4 packages exist with correct names and placeholder exports
- [ ] `yarn install` from root installs all dependencies

## Do Not
- Build any real UI yet — placeholders only
- Set up SQLite yet — Clue 2
- Build any features — scaffold only
- Use Expo — React Native CLI only

## When You Pass
Write `hunts/more-words/clue-1/COMPLETE.md` with:
- Exact React Native version used
- Navigation library version
- Yarn workspaces config that worked
- Any gotchas in monorepo setup

Then open `hunts/more-words/clue-2/PROMPT.md`.
