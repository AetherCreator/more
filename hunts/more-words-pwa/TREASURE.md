# TREASURE: MoreWords PWA — Hunt Complete

## Final Integration Checklist

### Core Loop
- [ ] Ashley opens morewords.vercel.app in iPhone Safari
- [ ] Onboards in under 90 seconds, picks Art + Metaphysical interests
- [ ] First word served is from her interest categories
- [ ] Saves a word, heart fills
- [ ] Plays match game with her deck
- [ ] Does today's daily crossword
- [ ] App added to Home Screen, loads as standalone PWA

### Coci Test
- [ ] Switch to kid profile
- [ ] Feed shows only kid_safe = 1 words
- [ ] Kid card renders (simplified)
- [ ] Fill in the blank game works
- [ ] No adult words visible anywhere

### Technical
- [ ] All Anthropic calls go through /api/claude proxy
- [ ] ANTHROPIC_API_KEY not exposed in browser
- [ ] sql.js persists across page refreshes
- [ ] All 3 crossword modes work
- [ ] All 3 games work
- [ ] packages/crossword and packages/engine imported, not rewritten
- [ ] No React Native imports anywhere

### The Win
No Mac. No Xcode. No TestFlight.
Ashley and Coci are playing MoreWords on their iPhones right now.
