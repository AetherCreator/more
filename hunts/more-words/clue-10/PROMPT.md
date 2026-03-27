# Clue 10: Widget System

## ⚠️ Read First
Open `hunts/more-words/clue-9/COMPLETE.md` and load its contents before reading anything else.
If that file does not exist — STOP. Clue 9 has not been completed. Do not proceed.

**Also read the "Clue 10 Pre-Research" section in clue-9/COMPLETE.md.** It contains the WidgetKit library decision, App Group confirmation, refresh strategy, and known limitations. If this section does not exist, STOP and go back to Clue 9 — the pre-research was not completed.

## Context
All games and crosswords work. The SQLite database lives in the App Group shared container (`group.com.more.morewords`) since Clue 2. Now build the home screen widgets — the passive daily touchpoint that keeps MoreWords in front of users without opening the app.

## Your Task
Build all 4 home screen widgets using the library chosen in the Clue 10 Pre-Research.

### Pre-Verification (before writing any widget code)
Confirm these prerequisites from earlier clues:
1. App Group `group.com.more.morewords` is configured in the app target's entitlements
2. SQLite database path resolves to the shared container (check Clue 2 COMPLETE.md for the confirmed path)
3. The chosen WidgetKit library from pre-research is installable and compatible with the current React Native version

If any of these fail, write STUCK.md — do not attempt to work around missing App Group config.

### iOS Widget Extension Setup
These are Xcode project changes — all file paths are relative to `apps/more-words/ios/`:

1. **Add widget extension target:**
   - In the Xcode project (`.xcodeproj`), add a new "Widget Extension" target named `MoreWordsWidgets`
   - Deployment target: iOS 16.0 (matches main app)
   - Language: Swift

2. **Configure shared App Group on widget target:**
   - Add App Groups capability to the `MoreWordsWidgets` target
   - Enable `group.com.more.morewords` (same as main app)
   - Entitlements file: `MoreWordsWidgets/MoreWordsWidgets.entitlements`

3. **Shared data access from Swift:**
   ```swift
   // In the widget extension Swift code:
   let containerURL = FileManager.default
       .containerURL(forSecurityApplicationGroupIdentifier: "group.com.more.morewords")!
   let dbPath = containerURL.appendingPathComponent("morewords.db").path
   // Open SQLite database at dbPath using SQLite.swift or raw C API
   ```

4. **Widget bundle identifier:** `com.more.morewords.widgets`

### Widget 1: Word of the Day
Sizes: Small, Medium, Large

Small: Word + part of speech only
Medium: Word + one-line definition
Large: Word + full definition + etymology

Refresh: TimelineProvider with `.atEnd` policy, single entry valid until midnight
Tap: Deep link `morewords://word/{wordId}` → opens app to that word's card

### Widget 2: Streak
Size: Small only

Shows: current streak number + "day streak"
Below: today's word (just the word, small)
Refresh: TimelineProvider reloads when app calls `WidgetCenter.shared.reloadAllTimelines()` on foreground
Tap: Deep link `morewords://feed` → opens app to Feed tab

### Widget 3: My Words
Size: Medium only

Shows: One saved word from deck, rotating every 2 hours
Word + definition
"X words in your deck" at bottom
Refresh: TimelineProvider generates 12 entries (24 hours ÷ 2 hours), each with a different deck word
Tap: Deep link `morewords://deck` → opens app to Deck tab

If deck is empty: "Save words to see them here"

### Widget 4: Art Widget
Sizes: Medium, Large

Just the word. Big. Beautiful.
Serif font, large, centered
Themed background matches active profile theme:
- Midnight: #0d0d0f background, #c9a84c (gold) word
- Paper: #f5f0e8 background, #1a1a1a word
- Bloom: #1a0a2e background, #c084fc word

No definition, no other text — purely aesthetic
Refresh: Daily, same schedule as Word of the Day
Tap: Deep link `morewords://feed` → opens app to Feed tab

### Widget Data Helper
`packages/widgets/src/index.ts` — this is the TypeScript side that prepares data for widgets:
```typescript
export const getWidgetData: () => Promise<{
  wordOfDay: Word
  streak: number
  deckWord: Word | null
  deckCount: number
  profileTheme: string
}>

// Call this on app foreground to push fresh data:
export const refreshWidgets: () => void
// Implementation: calls WidgetCenter.shared.reloadAllTimelines() via native bridge
```

**Important:** The widget extension reads SQLite directly from Swift. The TypeScript helper above is for the React Native side to trigger refreshes and prepare any cached data. The widgets themselves do NOT run React Native — they are native SwiftUI views.

### Deep Link Handling
Add deep link handling in `apps/more-words/App.tsx`:
- `morewords://word/{id}` → navigate to word card
- `morewords://feed` → navigate to Feed tab
- `morewords://deck` → navigate to Deck tab

Register the URL scheme in `Info.plist`.

### Settings Widget Guide
Settings tab → "Widgets" section
Simple instruction: "Long press your home screen → tap + → search MoreWords → pick your widget"
Show preview of each widget type

## Files to Create/Modify
- `apps/more-words/ios/MoreWordsWidgets/` — entire widget extension target (Swift)
- `apps/more-words/ios/MoreWordsWidgets/MoreWordsWidgets.entitlements`
- `apps/more-words/ios/MoreWordsWidgets/WordOfDayWidget.swift`
- `apps/more-words/ios/MoreWordsWidgets/StreakWidget.swift`
- `apps/more-words/ios/MoreWordsWidgets/MyWordsWidget.swift`
- `apps/more-words/ios/MoreWordsWidgets/ArtWidget.swift`
- `apps/more-words/ios/MoreWordsWidgets/SharedDB.swift` — SQLite reader for shared container
- `packages/widgets/src/index.ts` — TypeScript widget data + refresh trigger
- `apps/more-words/App.tsx` — deep link handling
- `apps/more-words/ios/more-words/Info.plist` — URL scheme registration
- `apps/more-words/src/screens/SettingsScreen.tsx` — widget guide section

## Pass Conditions
- [ ] Widget extension target builds without errors
- [ ] Widget extension has App Group entitlement matching main app
- [ ] SharedDB.swift successfully opens SQLite from App Group container
- [ ] Word of Day widget renders in all 3 sizes with live data
- [ ] Streak widget shows correct current streak
- [ ] My Words widget rotates deck words (verify 12 timeline entries generated)
- [ ] Art Widget renders with correct theme colors for active profile
- [ ] Deep links open correct screens in the app
- [ ] `refreshWidgets()` triggers timeline reload from React Native side
- [ ] Settings screen has widget guide
- [ ] No build errors on iOS (both app target and widget target)
- [ ] Widgets visible in iOS widget picker as "MoreWords"

## Do Not
- Build multi-profile — Clue 11 handles Paper/Bloom themes on Art Widget for non-default profiles
- Build More. bundle paywall — Clue 12
- Support Android widgets — iOS only
- Run React Native inside the widget extension — widgets are pure SwiftUI
- Attempt to share JavaScript/TypeScript code with the widget extension — the bridge is SQLite only

## When You Pass
Write `hunts/more-words/clue-10/COMPLETE.md` with:
- WidgetKit library used (or "native Swift target" if no library)
- App Group entitlement key confirmed working for both targets
- How timeline refresh is triggered for each widget type
- Deep link URL scheme and routes
- Any iOS-specific gotchas discovered
- Build verification: both targets compile clean

Then open `hunts/more-words/clue-11/PROMPT.md`.
