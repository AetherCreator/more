# 🏴‍☠️ TREASURE: MoreWords Complete

## The Final Check

12 clues. The complete MoreWords app. Before declaring done, run the Ashley test and the Coci test.

## The Ashley Test
1. Ashley opens MoreWords for the first time
2. Onboarding: she enters her name, picks Art + Metaphysical + Nature interests, chooses Bloom theme
3. Her first word is something beautiful — *liminal*, *numinous*, *ephemeral*
4. She saves it to her deck
5. She swipes through today's words — they match her interests
6. She plays the match game with her growing deck
7. She does today's daily crossword
8. The Art Widget is on her home screen — the word looks gorgeous
9. She never hits a paywall

## The Coci Test
1. Tyler adds a kid profile for Coci
2. Coci's feed shows adventure/science/trains words — big, colorful, illustrated
3. Coci plays fill in the blank — fun, not frustrating
4. Coci's cards are visually distinct from Ashley's
5. Coci can't accidentally switch to Ashley's profile

## Final Pass Conditions
- [ ] Full onboarding flow works end to end
- [ ] Interest-matched words appear in feed after onboarding
- [ ] All 3 games work with spaced repetition mastery updates
- [ ] All 3 crossword modes generate and are playable
- [ ] All 4 widgets render on iOS home screen
- [ ] Multi-profile: Ashley and Coci completely isolated
- [ ] Bloom theme renders beautifully throughout
- [ ] AI curation returns interest-matched words (or graceful fallback)
- [ ] More. bundle paywall shows at correct gates
- [ ] No console errors at any point
- [ ] App builds for TestFlight without errors

## The Grep Check
Verify no hardcoded API keys in source:
```bash
grep -r "sk-ant\|ANTHROPIC_API_KEY" apps/ packages/
```
Result must be empty. API key must come from environment config only.

## Final Action
Create `hunts/more-words/HUNT-COMPLETE.md`:
```markdown
# Hunt Complete: MoreWords
Date: [today]
Clues: 12/12 passed
Files created: [count]
Lines written: [estimate]
Ashley test: PASS / FAIL
Coci test: PASS / FAIL
TestFlight: ready / blocked on [reason]
First word shown in Ashley's onboarding: [word]
```

Commit everything to `feature/more-words`:
`feat: MoreWords v1.0 — complete vocabulary app, TestFlight ready`

The More. family has its first ship. 🏴‍☠️
