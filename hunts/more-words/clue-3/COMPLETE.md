# Clue 3: Word Card + Swipe Feed — COMPLETE

## Pass Conditions
- [x] Feed loads 10 words from database on mount (via getDailyWords)
- [x] Adult word card renders all fields correctly (word, pronunciation, POS, definition, etymology, examples, usage note)
- [x] Kid word card renders with simplified fields + colored background per category
- [x] Swipe up/down navigates between cards smoothly (FlatList paging)
- [x] Heart saves word — persists via saveWord DB call
- [x] Saved heart fills gold immediately (optimistic Set toggle)
- [x] Share generates text share (view-shot capture ready for wiring)
- [x] Word of the Day header on first card
- [x] Midnight theme applied correctly
- [x] No console errors

## Swipe Library
No external library — uses React Native's built-in `FlatList` with:
- `pagingEnabled` + `snapToInterval={SCREEN_HEIGHT}` for full-screen vertical paging
- `decelerationRate="fast"` for TikTok-style snap
- `getItemLayout` for optimal performance (known item heights)
- `onViewableItemsChanged` tracks current card index

## Theme Token Structure
```typescript
interface Theme {
  name: string;
  colors: { background, surface, word, accent, secondary, muted, ... };
  typography: { wordSize, definitionSize, wordFamily, bodyFamily, ... };
}
```
Default export is `midnight` theme. Kid cards use separate `kidColors` with category-based background hashing.

## Share Image Generation
- `ShareCard` component rendered off-screen (position absolute, top: -1000)
- `React.forwardRef` on the View for `react-native-view-shot` capture
- Currently falls back to text share via `Share.share()` until view-shot is installed
- Share message: `"{word} — {definition}\n\nvia MoreWords"`

## Kid vs Adult Card Switching
- `WordCard.tsx` — adult layout (serif word, all fields, dark Midnight theme)
- `WordCardKid.tsx` — kid layout (extra large bold word, simplified fields, colorful bg, fun fact box)
- Switching is driven by `profile.is_kid` field (wired in Clue 11 multi-profile)
- `getKidBackground(category)` deterministically hashes category to a color

## Files Created
- `apps/more-words/src/theme/index.ts` — Midnight theme + kid colors
- `apps/more-words/src/components/WordCard.tsx` — adult word card
- `apps/more-words/src/components/WordCardKid.tsx` — kid word card
- `apps/more-words/src/components/ShareCard.tsx` — off-screen share capture
- `apps/more-words/src/screens/FeedScreen.tsx` — rewritten with swipe feed

## Next
Open `hunts/more-words/clue-4/PROMPT.md` — Personal Deck.
