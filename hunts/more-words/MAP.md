# Hunt: MoreWords — Complete Build
Goal: A fully working vocabulary app — word discovery, personal deck, three crossword modes, three games, four home screen widgets, multi-profile, AI curation, and More. bundle subscription — ready for TestFlight.
Repo: AetherCreator/more
Branch: feature/more-words
Base: main

## Clue Tree
1. **Repo Scaffold** → pass: React Native monorepo initialized, packages/ and apps/more-words/ structure exists, app boots to blank screen on iOS simulator, no errors
2. **Word Database** → pass: SQLite schema live, 500 seed words loaded with all fields (word, pronunciation, pos, definition, etymology, examples, category, difficulty, kid_safe), queries return correct results
3. **Word Card + Swipe Feed** → pass: Word card renders all fields beautifully, swipe feed shows 10 words, heart saves to deck, share generates clean image card, kid profile shows illustrated card
4. **Personal Deck** → pass: Saved words persist in SQLite, deck screen shows saved words filterable by category/difficulty/mastery, mastery field exists and defaults to 0
5. **Flashcard Game** → pass: Swipe through deck words, tap to flip word→definition, mark Know It / Almost / Still Learning, spaced repetition surfaces lower-mastery words more frequently, session ends after 10 cards
6. **Match Game** → pass: 8 word-definition pairs render, tap word then definition to match, correct pairs disappear, timed mode works, score calculated on speed + accuracy
7. **Fill in the Blank** → pass: Sentence with word removed renders, 4 multiple choice options, correct answer updates mastery, difficulty escalates as mastery improves, kid mode uses simpler sentences
8. **Crossword Generator** → pass: Given a list of words + definitions, generates a valid crossword grid with correct intersections, exports grid + clues structure, works for 5×5 through 15×15
9. **Crossword Modes** → pass: Random crossword (4 difficulty levels) generates and is playable, Daily crossword is same for all users that day and shareable, Personal deck crossword unlocks at 15 saved words
10. **Widget System** → pass: All 4 widgets render correctly on iOS home screen — Word of Day, Streak, My Words (rotates every 2hrs), Art Widget (big typography + themed background)
11. **Multi-Profile** → pass: Up to 2 profiles, each with own word queue/deck/streak/theme, profile switcher in settings, kid profile enforces age-appropriate words and colorful card style
12. **AI Curation + Onboarding + Bundle** → pass: Onboarding flow under 90 seconds, Claude API returns interest-matched word queue for a profile, RevenueCat More. bundle gates AI curation + extra profiles + premium themes, full loop works end to end

## Dead End Protocol
If any clue fails 3 times:
- Stop immediately
- Write STUCK.md: what was tried, what broke, what's specifically needed
- Surface to Tyler with one question

## Critical Architecture Rules
- Offline-first: every feature works without internet. AI curation degrades gracefully to static queue.
- No paywall on core loop: word feed, deck, all games, all crosswords, all widgets work free
- Kid profile safety: kid_safe field on every word, kid profile never shows adult words
- Shared packages: crossword generator lives in packages/crossword/, engine (spaced repetition) in packages/engine/ — not inside apps/more-words/
- Widget data: widgets read from the same SQLite db, no separate data store

## Dependencies (load before starting)
- `docs/SPEC.md` in this repo — full product spec, reference throughout
- React Native docs for monorepo setup (Yarn workspaces or pnpm)
- iOS WidgetKit React Native bridge — research before Clue 10

## The More. Bundle Scope
Free forever: word feed, deck, all games, all crosswords, 4 widgets, 2 profiles, 3 themes
Bundle unlocks: AI curation (Claude API), unlimited profiles, premium themes + art widget backgrounds

## Success State (TREASURE)
Ashley opens MoreWords. She picks Art + Metaphysical interests. Her first word is *liminal*. She saves it. She plays the match game with her deck. She does today's crossword. The art widget is on her home screen. Coci opens his profile. His first word is *locomotive*. He does a fill-in-the-blank. He asks to play the match game. Neither of them hit a paywall. The whole thing is beautiful.
