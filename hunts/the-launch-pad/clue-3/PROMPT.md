# Clue 3: The Launch

## Objective
Deploy `apps/more-words-pwa` to Vercel production and capture the deployment URL.

## Files to Read
- hunts/the-launch-pad/clue-2/COMPLETE.md (verify Clue 2 passed)
- apps/more-words-pwa/vercel.json
- apps/more-words-pwa/package.json

## Analysis Method
1. Check `/opt/secrets/vercel-token`. If missing or empty → STUCK.md ("Tyler must drop Vercel token at /opt/secrets/vercel-token mode 600").
2. Check `which vercel`. If missing → `npm install -g vercel`.
3. `cd apps/more-words-pwa`
4. Try linking to an existing project: `vercel link --yes --project more-words-pwa --token $(cat /opt/secrets/vercel-token)`. If no project exists, run `vercel --yes --token $(cat /opt/secrets/vercel-token)` to create one (accept defaults).
5. `vercel deploy --prod --yes --token $(cat /opt/secrets/vercel-token)`. Capture stdout — last URL is production.
6. `curl -sI {prod-url}` — expect 200.
7. Three failures total → STUCK.md.

## Output Format
Write `hunts/the-launch-pad/clue-3/COMPLETE.md`:

```
# Clue 3 COMPLETE: The Launch

## Deployment
- Vercel project: {name}
- Production URL: {url}
- Deploy git SHA: {sha-at-deploy-time}
- Smoke (curl -sI {url}): {http-code}

## Vercel CLI
- Pre-installed: {yes/no}
- Installed in this clue: {yes/no}

## Push Confirmed
Commit: {SHA}
```

## Pass Conditions
- `vercel deploy --prod` exits 0
- production URL returns HTTP 200
- GitHub push verified (commit SHA)
