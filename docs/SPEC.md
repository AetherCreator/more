# MoreWords — Product Spec v1.0
**The More. Family — App 1**
Last updated: 2026-03-27

---

## The Big Picture

MoreWords is a vocabulary app that works for a 5-year-old and a 30-year-old artist at the same time. Daily word discovery, personal deck building, three crossword modes, four word games, home screen widgets, and AI-curated interest matching — all free. The More. bundle subscription unlocks the AI layer, premium themes, and family profiles.

It wins because it does everything the market leader (193K ratings, 4.8 stars) does well, fixes everything users complain about (aggressive paywall, broken widgets, locked games), and adds what nobody else has: interest-matched AI curation and personal deck crosswords.

---

## Profiles

Two profile types sharing one app:

**Adult profile (default):** Sophisticated vocabulary, interest-matched curation, elegant dark aesthetic, full crossword modes, widget stack.

**Kid profile:** Age-appropriate words, adventure/science/animals interest matching, big colorful cards, simplified games, illustrated word cards.

Profile switcher lives in settings. Up to 2 profiles free, unlimited with More. bundle.

---

## Core Features

### 1. Word of the Day + Swipe Feed
- One featured word per day per profile
- Full card: word, pronunciation, part of speech, definition, etymology, 2 example sentences, usage note
- Swipe feed: scroll through today's word pool (10-15 words/day, AI-curated by interest)
- Heart/save = adds to personal deck
- Share button: generates a clean word card image for Instagram/Messages
- Kid profile: illustrated card, simpler definition, fun fact about the word

### 2. Personal Word Deck
- All saved words in one place
- Filterable by: date saved, alphabetical, category, mastery level
- Mastery tracked automatically through game performance
- Deck powers the personal crossword and flashcard modes
- Minimum 15 words to unlock personal deck crossword

### 3. Daily Crossword
- Fresh every day, same for all users (shareable results like Wordle)
- AI-generated from that day's word pool
- 3 difficulty settings: Starter / Scholar / Expert
- Kid mode: 4-6 letter words, simple clues, illustrated hints
- Share result: "MoreWords Daily — 4/27 ⬛🟨🟩🟩🟩"

### 4. Random Crossword
- Generate on demand, any time
- 4 difficulty levels: Beginner / Intermediate / Advanced / Expert
- Grid size scales with difficulty (5×5 → 15×15)
- Word pool matches profile's interest categories
- Infinite replayability — never the same puzzle twice

### 5. Personal Deck Crossword
- Generated from your saved words
- Unlocks at 15 saved words
- Clues are the definitions you've already seen
- Proves you learned something — the emotional payoff
- Updates as deck grows

### 6. Flashcard Review
- Swipe through saved words
- Tap to flip: word → definition
- Mark as: Know it / Almost / Still learning
- Spaced repetition: surfaces "Still learning" words more frequently
- Session length: 10 cards default, adjustable

### 7. Match Game
- 8 word-definition pairs on screen
- Tap word, tap matching definition
- Timed mode optional
- Score based on speed + accuracy
- Only uses words from personal deck

### 8. Fill in the Blank
- Sentence with the word removed
- 4 multiple choice options
- Escalating difficulty as deck mastery improves
- Kid mode: simpler sentences, visual clues

### 9. Home Screen Widgets
Four widget types, all free:

**Word of the Day** — word + one-line definition, tappable. Small, medium, large.
**Streak** — current streak, today's word, days studied. Small only.
**My Words** — rotates through saved deck, updates every 2 hours. Medium.
**Art Widget** — just the word. Big typography. Themed background. Feels like home screen art. Medium and large.

---

## Word Database + AI Layer

### Static Database (free tier)
- 10,000 curated English words
- Tagged by: difficulty (1-5), category, age-appropriateness
- Each word: definition, pronunciation, etymology, 2 example sentences, usage note
- Kid words: illustration prompt, fun fact

### AI Layer (More. bundle)
- Claude API on profile setup: interest-matched word queue
- Adult interests: Art, Metaphysical, Nature, Mythology, Science, History, Architecture, Food, Music, Adventure, Animals, Technology
- Kid interests: Trains, Space, Animals, Adventure, Science, Superheroes, Nature
- AI refreshes weekly based on deck growth + mastery
- Without bundle: static curated queue, category filter only

---

## Tech Stack

**Repo:** `github.com/AetherCreator/more` (monorepo)

```
more/
├── packages/
│   ├── engine/     ← spaced repetition, mastery, streak logic
│   ├── crossword/  ← crossword generator (shared across all More. apps)
│   ├── widgets/    ← iOS widget system
│   └── ai/         ← Claude API curation layer
├── apps/
│   └── more-words/ ← React Native (iOS first)
```

**Framework:** React Native — iOS first, Android later
**Storage:** AsyncStorage + SQLite (offline-first)
**AI:** Claude API (Sonnet) for word curation
**Widgets:** React Native + iOS WidgetKit bridge
**Deploy:** App Store, TestFlight for beta

---

## The More. Bundle

**Free forever:**
- Word of the day + swipe feed (static curation)
- Personal word deck (unlimited saves)
- Daily crossword
- Random crossword (all difficulty levels)
- Personal deck crossword
- All 3 games
- All 4 widgets
- 2 profiles
- 3 themes

**More. Bundle ($4.99/month or $29.99/year):**
- AI interest-matched word curation
- Unlimited profiles
- All premium themes + art widget backgrounds
- All More. apps (MoreMath, MoreFacts, future)
- Early access to new apps

---

## Visual Direction

**Default:** Clean dark. Deep background (#0d0d0d), single word dominates screen, elegant serif for the word, clean sans-serif for supporting text.

**Themes (3 free):**
- **Midnight** — default dark, gold accents
- **Paper** — warm off-white, ink tones, analog feel
- **Bloom** — soft pastels, creative/metaphysical vibe

**Kid profile:** Always brighter, colorful, illustrated regardless of adult theme.

**Art widget:** Typographic backgrounds per theme. Word changes daily. Designed to look intentional on a home screen.

---

## Onboarding Flow
1. Name your profile
2. Pick your interests — visual grid, 3-10 categories
3. Kid or adult?
4. Choose your theme — live preview
5. Set your widget — optional, guided
6. Your first word — immediate payoff

Total: under 90 seconds. No tutorial bloat.

---

## Build Order
1. Repo scaffold — monorepo, React Native, packages structure
2. Word database — SQLite schema, seed 500 words for MVP
3. Word card + swipe feed
4. Personal deck — save, browse, mastery tracking
5. Flashcard + Match + Fill-in-the-blank games
6. Crossword generator — random mode first
7. Daily crossword + personal deck crossword
8. Widget system — all 4 types
9. Multi-profile support
10. AI curation layer (Claude API)
11. More. bundle subscription (RevenueCat)
12. Onboarding flow

---

## Success Metrics (v1)
- Ashley uses it daily within first week
- Coci engages with kid profile unprompted
- Art widget stays on Ashley's home screen 30+ days
- Personal deck crossword moment lands ("I knew all these words")
- Zero paywalls hit in core loop

---

## The More. Family Roadmap
- **MoreWords** — vocabulary (this app)
- **MoreMath** — Number Blasters logic as a standalone adult app
- **MoreFacts** — daily trivia, interest-matched
- **MoreArt** — art history, techniques, movements (Ashley curates)

Same engine. Same bundle. Different content packs.
