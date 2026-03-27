# More.

A family of learning apps. One engine. One subscription.

## Apps
- **MoreWords** — vocabulary, crosswords, word games
- **MoreMath** — coming soon
- **MoreFacts** — coming soon
- **MoreArt** — coming soon

## Architecture
Monorepo. Shared packages, separate app folders.

```
more/
├── packages/
│   ├── engine/     ← spaced repetition, mastery, streaks
│   ├── crossword/  ← crossword generator
│   ├── widgets/    ← iOS widget system
│   └── ai/         ← Claude API curation layer
├── apps/
│   └── more-words/
└── docs/
    └── SPEC.md     ← full product spec
```

## The More. Bundle
Free core forever. Bundle ($4.99/mo) unlocks AI curation, unlimited profiles, premium themes, and all apps.

## Status
Pre-build. Spec complete. See `docs/SPEC.md`.
