# Clue 10: Widget System

## ⚠️ Read First
Open `hunts/more-words/clue-9/COMPLETE.md` and load its contents before reading anything else.
If that file does not exist — STOP. Clue 9 has not been completed. Do not proceed.

## Context
All games and crosswords work. Now build the home screen widgets — the passive daily touchpoint that keeps MoreWords in front of users without them opening the app. This is iOS-specific and requires WidgetKit.

## Your Task
Build all 4 home screen widgets using react-native-widget-extension or a WidgetKit bridge.

### Setup
Research the current best library for React Native WidgetKit integration before writing any code. Document your choice in COMPLETE.md. The widget extension needs to share the same SQLite database as the app (via App Group in iOS entitlements).

### Widget 1: Word of the Day
Sizes: Small, Medium, Large

Small: Word + part of speech only
Medium: Word + one-line definition
Large: Word + full definition + etymology

Refreshes: Once daily at midnight
Tap: Opens app to that word's full card

### Widget 2: Streak
Size: Small only

Shows: 🔥 current streak number + "day streak"
Below: today's word (just the word, small)
Tap: Opens app to Feed tab

### Widget 3: My Words
Size: Medium only

Shows: One saved word from deck, rotating every 2 hours
Word + definition
"X words in your deck" at bottom
Tap: Opens app to Deck tab

If deck is empty: "Save words to see them here"

### Widget 4: Art Widget
Sizes: Medium, Large

Just the word. Big. Beautiful.
Serif font, large, centered
Themed background matches profile theme:
- Midnight: dark background, gold word
- Paper: warm cream background, dark ink word
- Bloom: soft gradient, muted word color

No definition, no other text — purely aesthetic
Updates daily with new word
Tap: Opens app to Feed tab

### Shared Widget Data
Widgets read from the same SQLite database via App Group.
Create a widget data helper in packages/widgets/src/index.ts:
```typescript
export const getWidgetData: () => Promise<{
  wordOfDay: Word
  streak: number
  deckWord: Word | null
  deckCount: number
  profileTheme: string
}>
```

### App Group Setup
Configure iOS App Group entitlement so widget extension can read the app's SQLite database. Document the exact entitlement key used in COMPLETE.md.

## Files to Create/Modify
- iOS widget extension (new target in Xcode)
- `packages/widgets/src/index.ts` — shared widget data
- `apps/more-words/src/screens/SettingsScreen.tsx` — "Add Widgets" guide section

### Settings Widget Guide
Settings tab → "Widgets" section
Simple instruction: "Long press your home screen → tap + → search MoreWords → pick your widget"
Show preview of each widget type

## Pass Conditions
- [ ] Widget extension builds without errors
- [ ] Word of Day widget renders in all 3 sizes
- [ ] Streak widget shows correct streak
- [ ] My Words widget rotates deck words every 2 hours
- [ ] Art Widget renders in Midnight theme (minimum — other themes in Clue 11)
- [ ] Widgets read live data from app's database via App Group
- [ ] Tap behavior opens correct app screen
- [ ] Settings screen has widget guide
- [ ] No build errors on iOS
- [ ] Widgets visible in iOS widget picker as "MoreWords"

## Do Not
- Build multi-profile — Clue 11 handles Paper/Bloom themes on Art Widget
- Build More. bundle paywall — Clue 12
- Support Android widgets — iOS only for now

## When You Pass
Write `hunts/more-words/clue-10/COMPLETE.md` with:
- WidgetKit library chosen and version
- App Group entitlement key used
- How widget data refresh is triggered
- Any iOS-specific gotchas

Then open `hunts/more-words/clue-11/PROMPT.md`.
