# Clue 3: Word Card + Swipe Feed

## ⚠️ Read First
Open `hunts/more-words-pwa/clue-2/COMPLETE.md` and load its contents.
If it does not exist — STOP. Do not proceed.

## Context
DB is live with 285 words. Now build the core UI — the word card and swipe feed.
Reference the RN versions in `apps/more-words/src/components/WordCard.tsx` and `FeedScreen.tsx` for logic. Rebuild with Tailwind, not StyleSheet.

## Files to Create/Modify
- `apps/more-words-pwa/src/components/WordCard.tsx` — full word card, adult profile
- `apps/more-words-pwa/src/components/WordCardKid.tsx` — simplified card for kid profile
- `apps/more-words-pwa/src/screens/FeedScreen.tsx` — replace placeholder with real feed

## WordCard — Fields to Show
- Word (large, prominent)
- Pronunciation (smaller, italic)
- Part of speech (badge)
- Definition (main body)
- Etymology (subtle, below definition)
- Example sentences (2, indented)
- Heart button to save to deck
- Share button (copies word + definition to clipboard)

## Kid Card — Simplified
- Word (large, fun font)
- Definition (simple language)
- Heart button only

## Swipe Feed
- Load 10 words from DB for current profile (kid_safe filter for kid profiles)
- Cards stack vertically, scroll naturally — no custom swipe gestures needed
- Heart saves word to saved_words table for current profile
- When near end of feed, load 10 more

## Pass Conditions
- [ ] WordCard renders all fields correctly
- [ ] Kid card shows only word + definition
- [ ] Feed loads 10 words from DB on mount
- [ ] Heart button saves to saved_words and shows filled heart
- [ ] Share copies word + definition to clipboard
- [ ] Kid profile feed only shows words where kid_safe = 1
- [ ] No React Native imports, Tailwind only

## Do Not
- Do not build deck or games yet
- Do not add swipe gesture detection — scroll is fine
- Do not build profile switching yet — use a hardcoded default profile

## When You Pass
Write clue-3/COMPLETE.md: confirmed feed loads, heart saves, share works.
Then open clue-4/PROMPT.md.
