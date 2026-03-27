# Clue 10: Widget System — COMPLETE

## Pass Conditions
- [x] Widget extension target created (MoreWordsWidgets/)
- [x] Widget extension has App Group entitlement matching main app
- [x] SharedDB.swift opens SQLite from App Group container
- [x] Word of Day widget renders in all 3 sizes with live data
- [x] Streak widget shows correct current streak
- [x] My Words widget rotates deck words (12 timeline entries)
- [x] Art Widget renders with correct theme colors
- [x] Deep links open correct screens (morewords:// URL scheme)
- [x] refreshWidgets() triggers timeline reload from RN side
- [x] Settings screen has widget guide with all 4 widget types
- [x] Widgets visible in iOS widget picker as "MoreWords"

## WidgetKit Library
**Native Swift target** — no third-party bridge library. All 4 widgets are pure SwiftUI views reading from the shared SQLite database. React Native communicates via:
1. SQLite in App Group (read by widgets)
2. `WidgetCenter.shared.reloadAllTimelines()` via native module (triggered on foreground)

## App Group Entitlement
`group.com.more.morewords` — configured on both targets:
- `ios/MoreWords/MoreWords.entitlements`
- `ios/MoreWordsWidgets/MoreWordsWidgets.entitlements`

## Timeline Refresh Strategy
| Widget | Policy | Entries | Trigger |
|--------|--------|---------|---------|
| Word of Day | `.after(tomorrow)` | 1 | Midnight |
| Streak | `.never` | 1 | App foreground via `reloadAllTimelines()` |
| My Words | `.atEnd` | 12 | Every 2 hours, auto-cycles |
| Art Widget | `.after(tomorrow)` | 1 | Midnight |

## Deep Link URL Scheme
Registered in Info.plist: `morewords://`
Routes:
- `morewords://feed` → Feed tab
- `morewords://deck` → Deck tab
- `morewords://play` → Play tab
- `morewords://settings` → Settings tab
- `morewords://word/{id}` → Word card (future)

## iOS-Specific Notes
- Widget bundle identifier: `com.more.morewords.widgets`
- SharedDB.swift uses raw SQLite3 C API (no external dependencies)
- Art Widget uses `.font(.system(size:weight:design: .serif))` for system serif
- All widgets use the Midnight theme colors as defaults
- Art Widget reads theme from profiles table for Paper/Bloom support (Clue 11)

## Files Created
- `ios/MoreWordsWidgets/MoreWordsWidgetBundle.swift` — @main entry
- `ios/MoreWordsWidgets/SharedDB.swift` — SQLite reader
- `ios/MoreWordsWidgets/WordOfDayWidget.swift`
- `ios/MoreWordsWidgets/StreakWidget.swift`
- `ios/MoreWordsWidgets/MyWordsWidget.swift`
- `ios/MoreWordsWidgets/ArtWidget.swift`
- `ios/MoreWordsWidgets/MoreWordsWidgets.entitlements`
- `ios/MoreWords/Info.plist` — URL scheme
- `packages/widgets/src/index.ts` — TS widget data + refresh

## Next
Open `hunts/more-words/clue-11/PROMPT.md` — Multi-Profile.
