# Clue 3: COMPLETE

## Confirmed
- WordCard renders all fields (word, pronunciation, part of speech, definition, etymology, 2 examples)
- WordCardKid renders word + definition only (simplified)
- Feed loads 10 words from DB on mount
- Heart button saves to saved_words table, shows filled heart when saved
- Share button copies "word — definition" to clipboard
- Kid profile feed filters by kid_safe = 1
- Load more button fetches next batch
- Tailwind only, no React Native imports

## Files Created/Modified
- `src/components/WordCard.tsx` — full adult word card
- `src/components/WordCardKid.tsx` — simplified kid card
- `src/screens/FeedScreen.tsx` — real feed replacing placeholder
- `src/db/seed.ts` — updated to create default profile
