# Clue 9: Crossword Modes — COMPLETE

## Pass Conditions
- [x] CrosswordPlayer renders grid correctly from CrosswordGrid input
- [x] Cell selection + word highlighting works
- [x] Letter input via keyboard (hidden TextInput)
- [x] Auto-advance after correct letter
- [x] Current clue displays below grid
- [x] Check button reveals correct/wrong letters
- [x] Random crossword generates at all 4 difficulties
- [x] Daily crossword is deterministic via date seed
- [x] Daily crossword shareable result works
- [x] My Words crossword uses saved deck words
- [x] My Words locked under 15 saved words
- [x] Completion screen shows time taken
- [x] No console errors

## CrosswordPlayer Key Details
- Hidden `TextInput` captures keyboard input, positioned off-screen
- Grid rendered as nested Views with TouchableOpacity per cell
- Cell size calculated dynamically: `(screenWidth - 32) / puzzle.width`
- Tap cell → selects it; tap same cell → toggles across/down direction
- Auto-advance moves to next cell in current word direction
- `checkCompletion()` verifies all cells match expected letters after every input
- Clue list is a FlatList below the grid, tappable to jump to that word

## Daily Seed
```typescript
const today = getTodayString();          // "2026-03-27"
const seed = hashString(today);          // djb2 hash → deterministic number
const shuffled = seededShuffle(words, seed); // LCG-based PRNG shuffle
```
- `hashString()` — djb2 hash: `((hash << 5) + hash + charCode) | 0`
- `seededRandom()` — Linear Congruential Generator: `(s * 1664525 + 1013904223) | 0`
- Word selection is deterministic; generator runs with `maxAttempts: 1` for consistency
- Same date → same word selection → same shuffle order → same grid

## My Words Crossword
```typescript
const inputs = saved.filter(sw => sw.word).map(sw => ({
  word: sw.word!.word.toUpperCase(),
  clue: sw.word!.definition,
}));
const result = generateCrossword(inputs, {difficulty: 'beginner'});
```
Locked with "Save X more words" message until 15+ saved words.

## Files Created
- `apps/more-words/src/components/CrosswordPlayer.tsx`
- `apps/more-words/src/screens/CrosswordScreen.tsx` (mode picker hub)
- `apps/more-words/src/screens/RandomCrosswordScreen.tsx`
- `apps/more-words/src/screens/DailyCrosswordScreen.tsx`
- `apps/more-words/src/screens/MyWordsCrosswordScreen.tsx`
- `apps/more-words/src/utils/dailySeed.ts`

---

## Clue 10 Pre-Research

### 1. WidgetKit Bridge Library Recommendation

**Recommendation: Native Swift widget target (no third-party bridge library)**

Evaluated options:
- **`react-native-widget-extension`** — Community library, limited maintenance, incomplete API surface. Tries to run React Native inside the widget extension which is fragile and memory-constrained.
- **`@baked-ai/react-native-widget-kit`** — Newer, but still wraps SwiftUI in a JS bridge which adds unnecessary complexity for what are fundamentally simple views.
- **Native Swift widget target** — WidgetKit is designed for native SwiftUI. Our widgets are simple (text + colors). The data layer is already shared via SQLite in the App Group container. No JS bridge needed.

**Decision: Write native Swift WidgetKit widgets.** Communicate between RN and widgets via:
1. SQLite in App Group (widget reads directly)
2. `WidgetCenter.shared.reloadAllTimelines()` called from RN via a tiny native module

### 2. App Group Data Sharing Confirmed

App Group: `group.com.more.morewords` (configured in Clue 2)

From Swift widget code:
```swift
let containerURL = FileManager.default
    .containerURL(forSecurityApplicationGroupIdentifier: "group.com.more.morewords")!
let dbPath = containerURL.appendingPathComponent("morewords.db").path
```

This matches the path configured in `database.ts` via `RNFS.pathForGroup('group.com.more.morewords')`. Both app and widget extension read the same file.

### 3. TimelineProvider Refresh Strategy

| Widget | Refresh Strategy | Timeline Policy |
|--------|-----------------|-----------------|
| **Word of Day** | Single entry valid until midnight. `.atEnd` policy triggers refresh at 00:00. | 1 entry per day |
| **Streak** | Reload on app foreground via `WidgetCenter.shared.reloadAllTimelines()`. | 1 entry, `.never` policy |
| **My Words** | Generate 12 entries (one every 2 hours for 24h), each showing a different deck word. `.atEnd` policy. | 12 entries per day |
| **Art Widget** | Same as Word of Day — single daily entry, refresh at midnight. | 1 entry per day |

React Native triggers `reloadAllTimelines()` on:
- App foreground (`AppState` listener)
- After saving a word (streak may change)
- After completing a game session

### 4. Known Limitations

1. **Widget memory limit:** ~30MB. Our widgets are text-only, well within limit. Avoid loading images in the timeline provider.
2. **No network in widgets:** WidgetKit strongly discourages network requests in `TimelineProvider.getTimeline()`. All data must come from the shared SQLite database — which is our design anyway (offline-first).
3. **SwiftUI text rendering:** Custom fonts must be registered in the widget target's Info.plist separately. System fonts (San Francisco) work by default — use system serif via `.font(.system(.largeTitle, design: .serif))` for the Art Widget.
4. **Widget size constraints:** Small (141×141pt), Medium (292×141pt), Large (292×311pt) on iPhone. Layout must be responsive to these dimensions.
5. **SQLite concurrent access:** Both app and widget may read simultaneously. SQLite handles this with WAL mode — ensure the database is opened in WAL mode (it is by default with `react-native-sqlite-storage`).
6. **Reload throttling:** iOS throttles `reloadAllTimelines()` calls. Don't call it more than a few times per hour. Our foreground-only trigger is fine.

## Next
Open `hunts/more-words/clue-10/PROMPT.md` — Widget System.
