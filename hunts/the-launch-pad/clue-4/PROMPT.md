# Clue 4: The Orbit Check

## Objective
Multi-path smoke test the deployed URL and amend `hunts/more-words-pwa/TREASURE.md` with a DEPLOYED block.

## Files to Read
- hunts/the-launch-pad/clue-3/COMPLETE.md (extract production URL + deploy SHA)
- hunts/more-words-pwa/TREASURE.md (existing checklist to amend, not replace)

## Analysis Method
1. Read production URL from clue-3 COMPLETE.md.
2. `curl -sI` against 4 paths: `/`, `/sql-wasm.wasm`, `/onboarding`, `/feed`. All four must return 200 (SPA rewrites send `/onboarding` and `/feed` to `/index.html`).
3. `curl -s {url}/` and verify the HTML response contains both `<div id="root"` and a `<script` tag.
4. Append a new section to the END of `hunts/more-words-pwa/TREASURE.md`:
   ```
   ## DEPLOYED 2026-05-02
   - Production URL: {url}
   - Deploy SHA: {sha}
   - Smoke results: / 200 · /sql-wasm.wasm 200 · /onboarding 200 · /feed 200
   - HTML shell verified (root div + script present)
   - Status: ready for iPhone walk-through with Ashley + Conci
   ```
5. Commit + push.

## Output Format
Write `hunts/the-launch-pad/clue-4/COMPLETE.md`:

```
# Clue 4 COMPLETE: The Orbit Check

## Smoke Results
| Path | Status | Notes |
|------|--------|-------|
| / | 200 | HTML shell loaded |
| /sql-wasm.wasm | 200 | {bytes} |
| /onboarding | 200 | SPA rewrite OK |
| /feed | 200 | SPA rewrite OK |

## HTML Shell Verification
- root div present: yes
- script tag present: yes

## TREASURE.md Updated
- File: hunts/more-words-pwa/TREASURE.md
- Section appended: "## DEPLOYED 2026-05-02"

## Push Confirmed
Commit: {SHA}
```

## Pass Conditions
- All 4 curl paths return 200
- HTML response contains `<div id="root"` and `<script`
- `hunts/more-words-pwa/TREASURE.md` contains the literal string `DEPLOYED 2026-05-02`
- GitHub push verified (commit SHA)
