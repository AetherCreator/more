# Clue 3: Word Card + Swipe Feed

## ⚠️ Read First
Open `hunts/more-words/clue-2/COMPLETE.md` and load its contents before reading anything else.
If that file does not exist — STOP. Clue 2 has not been completed. Do not proceed.

## Context
Database is live with 500 words. Default profile exists. Now build the core daily experience — the word card and swipe feed. This is what Ashley opens every morning. It needs to be beautiful.

## Your Task
Build the Feed tab — the heart of MoreWords.

### Word Card
Full-screen card showing one word at a time.

**Adult card:**
- Word: large serif font, dominant, centered
- Pronunciation: small, beneath word, muted color
- Part of speech: tiny tag (noun, verb, adj...)
- Definition: clean sans-serif, readable size
- Etymology: italic, muted, "From Latin..." style
- Example sentences: 2 sentences, slightly indented
- Usage note: bottom of card, subtle

**Kid card** (is_kid profile):
- Word: extra large, bold, playful font
- Simple definition only (kid_definition field)
- Fun fact (kid_fun_fact field)
- Colorful background per category
- No etymology, no usage note

**Theme: Midnight (default)**
- Background: #0d0d0f
- Word color: #f5f0e8 (warm white)
- Accent: #c9a84c (gold)
- Secondary text: #8a8a8a

### Actions on card
- **Heart button** (bottom right): saves word to deck. Fills gold on save. Haptic feedback.
- **Share button** (bottom left): generates a clean word card image (word + definition + "MoreWords") shareable to Messages/Instagram
- Swipe up: next word
- Swipe down: previous word (if any)

### Swipe Feed
Feed tab loads `getDailyWords(profileId, 10)` — 10 words for today.
Vertical swipe between cards (like TikTok, not horizontal).
Current position indicator: subtle dots or "3 / 10" counter.
Word of the Day: first card is always today's featured word, slightly different header treatment ("Word of the Day").

### Navigation
Feed tab is the default landing screen.
Tapping any area (not a button) shows/hides the action buttons for clean reading.

## Files to Create/Modify
- `apps/more-words/src/screens/FeedScreen.tsx` — main feed
- `apps/more-words/src/components/WordCard.tsx` — the card
- `apps/more-words/src/components/WordCardKid.tsx` — kid version
- `apps/more-words/src/theme/index.ts` — Midnight theme colors + typography

## Pass Conditions
- [ ] Feed loads 10 words from database on mount
- [ ] Adult word card renders all fields correctly
- [ ] Kid word card renders with simplified fields + color
- [ ] Swipe up/down navigates between cards smoothly
- [ ] Heart saves word — persists across restarts
- [ ] Saved heart fills gold immediately (optimistic UI)
- [ ] Share generates a card image (even basic)
- [ ] Word of the Day header on first card
- [ ] Midnight theme applied correctly
- [ ] No console errors

## Do Not
- Build the deck screen — Clue 4
- Build games — Clues 5-7
- Build Paper or Bloom themes — Clue 11 (multi-profile)
- Wire AI curation — Clue 12
- Animate the share image elaborately — basic is fine

## When You Pass
Write `hunts/more-words/clue-3/COMPLETE.md` with:
- Swipe library used (if any)
- Theme token structure
- How share image generation works
- Kid vs adult card switching logic

Then open `hunts/more-words/clue-4/PROMPT.md`.
