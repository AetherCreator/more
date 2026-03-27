# Clue 1: Repo Scaffold — COMPLETE

## Pass Conditions
- [x] Monorepo structure matches spec
- [x] Yarn workspaces configured correctly (`packages/*`, `apps/*`)
- [x] React Native app scaffolded with CLI (not Expo)
- [x] Bottom tab navigation renders: Feed / Deck / Play / Settings
- [x] Each tab shows placeholder text
- [x] TypeScript configured, no type errors
- [x] All 4 packages exist with correct names and placeholder exports
- [x] `yarn install` from root installs all dependencies

## Versions
- **React Native:** 0.75.4 (CLI, not Expo)
- **React:** 18.3.1
- **React Navigation:** 6.1.18 (@react-navigation/native)
- **Bottom Tabs:** 6.6.1 (@react-navigation/bottom-tabs)
- **Native Stack:** 6.11.0 (@react-navigation/native-stack)
- **TypeScript:** 5.3.3

## Yarn Workspaces Config
```json
{
  "workspaces": ["packages/*", "apps/*"]
}
```

## Packages Created
| Package | Name | Path |
|---------|------|------|
| Engine | `@more/engine` | `packages/engine/` |
| Crossword | `@more/crossword` | `packages/crossword/` |
| Widgets | `@more/widgets` | `packages/widgets/` |
| AI | `@more/ai` | `packages/ai/` |
| App | `more-words` | `apps/more-words/` |

## Monorepo Structure
```
more/
├── package.json              (root workspace config)
├── packages/
│   ├── engine/src/index.ts   (spaced repetition placeholders)
│   ├── crossword/src/index.ts (crossword generator placeholders)
│   ├── widgets/src/index.ts  (widget bridge placeholders)
│   └── ai/src/index.ts       (Claude API placeholders)
└── apps/
    └── more-words/
        ├── App.tsx            (NavigationContainer + TabNavigator)
        ├── index.js           (AppRegistry entry point)
        └── src/
            ├── screens/       (Feed, Deck, Play, Settings)
            ├── components/
            ├── navigation/    (TabNavigator with bottom tabs)
            └── db/
```

## Gotchas
- Must use React Native CLI (not Expo) — WidgetKit bridge in Clue 10 requires native module access
- Workspace packages reference each other by version in dependencies — yarn resolves via workspace protocol
- Tab navigator uses gold accent (#d4af37) on dark background (#0d0d0d) matching Midnight theme from spec
- react-native-safe-area-context and react-native-screens are required peer deps for React Navigation

## Next
Open `hunts/more-words/clue-2/PROMPT.md` — Word Database.
