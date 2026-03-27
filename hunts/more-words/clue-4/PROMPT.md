# Clue 4: Personal Deck

## ⚠️ Read First
Open `hunts/more-words/clue-3/COMPLETE.md` and load its contents before reading anything else.
If that file does not exist — STOP. Clue 3 has not been completed. Do not proceed.

## Context
Word cards render beautifully. Heart saves words to the deck via saveWord(). Now build the Deck tab — where saved words live and where games pull from.

## Your Task
Build the Deck tab — the personal word collection screen.

### Deck Screen Layout
Header: "My Deck" + word count badge ("47 words")

**Filter bar** (horizontal scroll):
- All / By Category / By Difficulty / By Mastery
- Category filter: shows categories present in saved words
- Difficulty: 1-5 stars filter
- Mastery: Learning / Almost / Known

**Word list:**
Each row shows:
- Word (left, larger)
- Category tag (small pill, right)
- Mastery indicator (3 dots: ○○○ learning → ●●● known)
- Tap row → word card detail view (full card, same as feed)

**Empty state:**
"No words yet. Head to the feed and save some words you love."
With a small arrow pointing toward the Feed tab.

**Minimum for games unlock:**
Show a subtle progress bar at top: "Save 5 more words to unlock games" until 10 words saved.
Games unlock at 10 saved words (reduced from 15 for better onboarding).
Personal deck crossword unlocks at 15 words (unchanged).

### Mastery Display
mastery field in saved_words: 0-5
- 0-1: Learning (1 dot filled)
- 2-3: Almost (2 dots filled)
- 4-5: Known (3 dots filled)

Games update mastery automatically (Clues 5-7 will implement this).
For now: mastery is display-only in the deck, updated by games later.

### Word Detail View
Tap any deck word → full word card (same WordCard component from Clue 3).
Back button returns to deck.
Heart is already filled (it's in the deck).
Tap heart again → remove from deck (with confirmation: "Remove [word] from your deck?")

## Files to Create/Modify
- `apps/more-words/src/screens/DeckScreen.tsx`
- `apps/more-words/src/components/DeckWordRow.tsx`
- `apps/more-words/src/db/database.ts` — add removeWord() export

## Pass Conditions
- [ ] Deck screen shows all saved words
- [ ] Word count badge updates correctly
- [ ] Filter bar works for all 4 filter types
- [ ] Mastery dots display correctly per mastery level
- [ ] Tapping a word opens the full word card
- [ ] Remove from deck works with confirmation
- [ ] Empty state renders when deck is empty
- [ ] Games unlock progress bar shows until 10 words saved
- [ ] Persists correctly — deck survives app restart
- [ ] No console errors

## Do Not
- Build games yet — Clues 5-7
- Build mastery update logic — games handle that
- Add sorting beyond the 4 filters — keep it simple
- Build the crossword unlock — Clue 9

## When You Pass
Write `hunts/more-words/clue-4/COMPLETE.md` with:
- Filter implementation approach
- How word detail navigation works
- removeWord() signature added to database.ts
- Games unlock threshold (confirm: 10 words)

Then open `hunts/more-words/clue-5/PROMPT.md`.
