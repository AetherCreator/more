# Clue 12: AI Curation + Onboarding + Bundle

## ⚠️ Read First
Open `hunts/more-words/clue-11/COMPLETE.md` and load its contents before reading anything else.
If that file does not exist — STOP. Clue 11 has not been completed. Do not proceed.

## Context
Complete app. Multi-profile. All 3 themes. All games and crosswords. Widgets. Now wire the AI layer, build onboarding, and add the More. bundle subscription gate. This is the final clue before treasure.

## Your Task
Three interconnected pieces that complete the product.

### Part 1: Onboarding Flow
First launch only (check settings table for 'onboarded' key).
5 screens, under 90 seconds total:

**Screen 1: Welcome**
"MoreWords" in large serif + tagline: "A new word. Every day."
Single "Get Started" button.

**Screen 2: Your Name**
"What should we call you?"
Text input for first name.
"Continue" button.

**Screen 3: Your Interests**
"What are you into?"
Visual grid of interest categories with icons:
Adult: Art, Mythology, Nature, Metaphysical, Science, History, Architecture, Food, Music, Adventure, Animals, Technology
Kid: (shown if is_kid toggle was set on previous screen)
Select 3-10. Selections highlight.
"This helps us find words you'll love."

**Screen 4: Style**
"Pick your vibe"
3 theme cards: Midnight / Paper / Bloom
Tap to preview the word "luminous" in each theme.
Kid profiles skip this screen.

**Screen 5: Your First Word**
Show today's word of the day, fully rendered as a word card.
"Save it to your deck" heart button.
"Start Exploring →" completes onboarding.

Mark 'onboarded' in settings table. Create profile with all choices.

### Part 2: AI Curation (packages/ai/src/index.ts)
```typescript
export const getAICuratedWords: (
  interests: string[],
  existingDeckWords: string[],
  count: number,
  isKid: boolean
) => Promise<Word[]>
```

Call Claude API (claude-sonnet-4-20250514):
```
System: You are a vocabulary curator. Given user interests and words they already know, select [count] vocabulary words from the provided database that best match their interests. Avoid words already in their deck. For kid profiles, ensure all words are age-appropriate and engaging. Return ONLY a JSON array of word IDs.

User: Interests: [art, mythology, metaphysical]. Deck words to avoid: [luminous, ethereal]. Available words: [serialized word list with IDs]. Select 15 words.
```

Parse response, fetch full word records from SQLite.
Fallback: if API fails or bundle not active, use static category-based selection.

AI curation runs:
- On first app launch after onboarding
- Once weekly (check settings for 'last_ai_refresh' date)
- When user adds new interests

### Part 3: More. Bundle (RevenueCat)
Install react-native-purchases (RevenueCat).

**Bundle gates:**
- AI curation: requires bundle (graceful fallback to static if not subscribed)
- 3rd+ profile: requires bundle (show upgrade prompt)
- Premium themes beyond 3: requires bundle (none exist yet, but gate is ready)

**Pricing:**
- Monthly: $4.99/month (product ID: more_bundle_monthly)
- Annual: $29.99/year (product ID: more_bundle_annual)

**Paywall screen** (shown when hitting a gate):
- "Unlock MoreWords Pro" header
- List: AI curation / Unlimited profiles / All More. apps / Premium themes
- Monthly / Annual toggle with pricing
- "Start Free Trial" (7-day trial)
- "Restore Purchases" link
- "Maybe Later" dismiss

**Settings:** Manage Subscription option that opens RevenueCat management.

### Final Polish
- App icon: simple serif "M" on dark background (placeholder asset)
- Splash screen: "MoreWords" fade in
- Review prompt: ask for App Store review after user saves 20th word

## Files to Create/Modify
- `apps/more-words/src/screens/OnboardingScreen.tsx`
- `packages/ai/src/index.ts` — Claude API curation
- `apps/more-words/src/screens/PaywallScreen.tsx`
- `apps/more-words/src/utils/subscription.ts` — RevenueCat helpers
- `apps/more-words/App.tsx` — onboarding check on launch

## Pass Conditions
- [ ] Onboarding shows on first launch only
- [ ] All 5 onboarding screens render correctly
- [ ] Profile created with name, interests, theme after onboarding
- [ ] First word shown on final onboarding screen
- [ ] AI curation calls Claude API and returns interest-matched words
- [ ] AI curation falls back gracefully if API fails
- [ ] AI refresh runs weekly (not on every launch)
- [ ] RevenueCat initialized without errors
- [ ] Paywall screen renders with correct pricing
- [ ] Bundle gates work: 3rd profile prompt, AI curation gate
- [ ] Restore Purchases works
- [ ] No console errors
- [ ] App is TestFlight-ready (builds without errors for distribution)

## Do Not
- Submit to App Store yet — TestFlight first
- Add analytics or crash reporting — future
- Build MoreMath — that's the next hunt

## When You Pass
Write `hunts/more-words/clue-12/COMPLETE.md` with:
- Claude API prompt used for curation
- RevenueCat product IDs configured
- Onboarding flow confirmed end-to-end
- TestFlight build status

Then read `hunts/more-words/TREASURE.md`.
