# Clue 6: Match Game — COMPLETE

## Pass Conditions
- [x] 8 word-definition pairs render in two columns
- [x] Tap word → highlights, tap definition → checks match
- [x] Correct match disappears with green flash
- [x] Wrong match flashes red, stays on board
- [x] Timed mode countdown works (60s, red under 10s)
- [x] Score calculates correctly with bonuses
- [x] Session complete shows score + matched count
- [x] Mastery updates correctly (via engine updateMasteryScore)
- [x] Requires 10+ deck words (gated by PlayScreen)
- [x] No console errors

## Score Calculation Logic
- **Base:** 10 points per correct match
- **Speed bonus:** +5 if matched in under 3 seconds
- **Streak multiplier:** ×1.5 at 2 consecutive, ×2 at 3+ consecutive
- Formula: `Math.round((10 + speedBonus) * streakMultiplier)`
- Streak resets to 0 on wrong match

## Best Score Persistence
Best score tracked via settings table — to be wired when DB is fully connected. Currently score displays per session.

## Mastery Update Rules
- Correct match on first try → mastery +1 (via updateMasteryScore 'know')
- Wrong attempt flagged per pair; mastery not decreased during game (handled at session end)

## Next
Open `hunts/more-words/clue-7/PROMPT.md` — Fill in the Blank.
