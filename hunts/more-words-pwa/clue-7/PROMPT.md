# Clue 7: AI Curation + Paywall + Deploy

## ⚠️ Read First
Open `hunts/more-words-pwa/clue-6/COMPLETE.md` and load its contents.
If it does not exist — STOP. Do not proceed.

## Context
Everything works. Now wire AI word curation, the More. bundle paywall, and final deploy.

## ⚠️ API Proxy Rule (mandatory — Story Quest lesson)
ALL Anthropic API calls must go through the Vercel Edge proxy.
NEVER call api.anthropic.com directly from the browser — CORS will block it.

Create `apps/more-words-pwa/api/claude.js`:
```javascript
export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const body = await req.json();
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify(body),
  });
  return new Response(response.body, {
    status: response.status,
    headers: { 'Content-Type': response.headers.get('Content-Type') || 'application/json' },
  });
}
```

## AI Curation
After onboarding, call /api/claude to get 20 interest-matched words for the profile.
Prompt: given the user's interests and the word categories in the DB, return 20 word IDs as JSON.
If the API call fails → fall back to random words from selected categories. Never block the UI.

Reference: `packages/ai/src/index.ts` for existing AI logic pattern.

## More. Bundle Paywall
Use RevenueCat web SDK (`@revenuecat/purchases-js`).
Gate behind paywall: AI curation, 2nd profile creation, premium themes (Paper, Bloom).
Free forever: word feed, all games, all crosswords, Midnight theme, 1 profile.

Paywall screen shows:
- What's included in More. bundle
- Monthly / annual pricing
- "Start free trial" button
- Triggered when: tapping locked feature

## Final Deploy Checklist
- `ANTHROPIC_API_KEY` set in Vercel env vars (no VITE_ prefix — server side only)
- All routes redirect to index.html (vercel.json rewrite rule from Clue 1)
- PWA manifest: name, icons, theme color, display: standalone
- App loads in Safari on iPhone, add to home screen works

## Pass Conditions
- [ ] AI curation calls /api/claude proxy — never direct browser call to Anthropic
- [ ] On API failure: graceful fallback to random words, no crash
- [ ] Paywall screens render for locked features
- [ ] Free features (feed, all games, all crosswords, 1 profile) work without paywall
- [ ] ANTHROPIC_API_KEY is server-side only — not exposed in browser
- [ ] App loads on superconci.vercel.app equivalent URL
- [ ] Add to Home Screen works in iOS Safari
- [ ] Ashley test: onboard → pick Art + Metaphysical → first word is from those categories
- [ ] Coci test: kid profile → feed shows only kid_safe words → games work

## Do Not
- Do not hardcode the API key anywhere in client code
- Do not block the UI waiting for AI curation — show words immediately, update when AI returns

## When You Pass
Write clue-7/COMPLETE.md: live Vercel URL, confirmed proxy works, confirmed Ashley + Coci tests pass.
Then open TREASURE.md — the hunt is complete.
