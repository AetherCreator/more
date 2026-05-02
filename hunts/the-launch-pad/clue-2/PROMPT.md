# Clue 2: The Comms Test

## Objective
Confirm the AI curation proxy at `https://thechefos.com/api/claude` is reachable and returns the response shape `aiCuration.ts` expects.

## Files to Read
- apps/more-words-pwa/src/utils/aiCuration.ts (request shape, lines 1–30)
- hunts/the-launch-pad/clue-1/COMPLETE.md (verify Clue 1 passed)

## Analysis Method
1. POST to `https://thechefos.com/api/claude` with this body:
   ```json
   {"model":"claude-sonnet-4-6","max_tokens":32,"messages":[{"role":"user","content":"reply with the digit 1"}]}
   ```
   Header: `Content-Type: application/json`, `x-product: morewords`
2. Capture HTTP status and full response body.
3. Verify: status == 200 AND `response.content[0].text` is a non-empty string.
4. On non-200 or wrong shape: proxy lives in another repo and is OUT OF SCOPE for this hunt. Write STUCK.md immediately. Do not retry.

## Output Format
Write `hunts/the-launch-pad/clue-2/COMPLETE.md`:

```
# Clue 2 COMPLETE: The Comms Test

## Proxy Reachability
- URL: https://thechefos.com/api/claude
- HTTP Status: 200
- Response shape valid: yes
- Sample text (first 60 chars): {snippet}

## Push Confirmed
Commit: {SHA}
```

## Pass Conditions
- curl returns HTTP 200
- `response.content[0].text` is non-empty string
- GitHub push verified (commit SHA)
