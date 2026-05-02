# Clue 1: The Pre-Flight Check

## Objective
Verify apps/more-words-pwa builds cleanly with no errors and dist/ output is deployment-ready.

## Files to Read
- apps/more-words-pwa/package.json
- apps/more-words-pwa/vite.config.ts

## Analysis Method
1. `cd apps/more-words-pwa`
2. If `node_modules/` missing: `npm install`
3. `npm run build`
4. On error: read first error, fix it, rerun. Three failures total → STUCK.md.
5. Verify both `dist/index.html` and `dist/sql-wasm.wasm` exist after success.

## Output Format
Write `hunts/the-launch-pad/clue-1/COMPLETE.md`:

```
# Clue 1 COMPLETE: The Pre-Flight Check

## Build Result
- Status: PASS
- Build time: {seconds}s
- dist/ total size: {bytes}

## Files Verified
- dist/index.html: {bytes}
- dist/sql-wasm.wasm: {bytes}
- dist/assets/ file count: {count}

## Bug Fixes Applied
{list each fix or "none" if first build succeeded}

## Push Confirmed
Commit: {SHA}
```

## Pass Conditions
- `npm run build` exits 0
- `dist/index.html` exists
- `dist/sql-wasm.wasm` exists
- GitHub push verified (commit SHA)
