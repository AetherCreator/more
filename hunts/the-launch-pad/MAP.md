# Hunt: The Launch Pad
Manifest: docs/SPEC.md (MoreWords v1.0)
Created: 2026-05-02 | Mapmaker: treasure-mapmaker v3.1.0
Goal: Get MoreWords PWA from "built but dormant" to "live, smoke-green, ready for iPhone walk-through."
Repo: AetherCreator/more | Branch: main
Treasure: production URL deployed, all smoke paths 200, TREASURE.md amended with DEPLOYED block + SHA.

## Quartermaster Inventory (VERIFIED 2026-05-02 by file reads)

### Repo State
- `apps/more-words-pwa/` — Vite + React 19 + TS. package.json deps: react, react-dom, react-router-dom, sql.js. Scripts: dev, build, preview.
- `apps/more-words-pwa/vercel.json` — SPA rewrite present (`/(.*)` → `/index.html`)
- `apps/more-words-pwa/vite.config.ts` — copies sql-wasm.wasm into public/ at build start
- `apps/more-words-pwa/src/` — 11 screens, ProfileContext, sql.js db layer, crossword + aiCuration utils
- `hunts/more-words/assets/seed-words.json` — 285 seed words ready
- `hunts/more-words-pwa/TREASURE.md` — checklist all unchecked, never validated
- `packages/` — does NOT exist (spec was aspirational; logic embedded in apps/more-words-pwa/src/utils/)
- `.claude/` — does NOT exist (no PreToolUse hooks to honor)
- `CLAUDE.md` — does NOT exist

### External Dependencies
- API proxy: `https://thechefos.com/api/claude` (used by aiCuration.ts — reachability unverified)
- Vercel team: `team_N1DyKcTkZcNw6KwBzbffimTZ`
- Vercel project for `more` repo: existence unverified (clue 3 will probe + create if missing)

### InfiniVeg Runtime
- `node` + `npm`: present (other hunts use them)
- `vercel` CLI: NOT installed (clue 3 will `npm i -g vercel`)
- `/opt/secrets/vercel-token`: presence unverified (clue 3 checks first; STUCK.md if missing)

## Pre-Hunt Checklist
- [x] Adventure Manifest read (docs/SPEC.md MoreWords v1.0)
- [x] Quartermaster verified by file reads, not memory
- [x] Hunt MERGES with existing build, does not overwrite
- [x] Every pass condition tool-verifiable (curl, file checks, SHA)
- [x] All clues [CODE] [Nemotron-120B] — no chat design needed
- [x] Push step in every clue's pass condition
- [x] Slim PROMPT.md format applied (treasure-mapmaker v3.1.0)

## Clue Tree

1. [CODE] [Nemotron-120B] **The Pre-Flight Check** — local build clean
   pass: `npm run build` exit 0 + dist/index.html + dist/sql-wasm.wasm both exist + GitHub push verified (commit SHA)

2. [CODE] [Nemotron-120B] **The Comms Test** — API proxy reachable
   pass: POST to thechefos.com/api/claude returns 200 + valid content[0].text shape + GitHub push verified (commit SHA)

3. [CODE] [Nemotron-120B] **The Launch** — Vercel production deploy
   pass: `vercel deploy --prod` succeeds + production URL returns 200 + GitHub push verified (commit SHA)

4. [CODE] [Nemotron-120B] **The Orbit Check** — multi-path smoke + TREASURE update
   pass: 4 URL paths return 200 + TREASURE.md contains "DEPLOYED 2026-05-02" + GitHub push verified (commit SHA)

## Parallelism Graph

```
Clue 1 ── Clue 2 ── Clue 3 ── Clue 4
```

Sequential by design — each clue's pass is the next clue's precondition.

### Dependency Table
| Clue | Depends On | Can Parallelize With |
|------|-----------|----------------------|
| 1    | —         | —                    |
| 2    | 1         | —                    |
| 3    | 2         | —                    |
| 4    | 3         | —                    |

### Execution Waves
```
Wave 1: Clue 1
Wave 2: Clue 2
Wave 3: Clue 3
Wave 4: Clue 4
```

### Machine-Readable DAG (conductor reads this)
```json
{
  "hunt": "the-launch-pad",
  "clues": {
    "1": { "deps": [], "model": "nemotron-120b" },
    "2": { "deps": ["1"], "model": "nemotron-120b" },
    "3": { "deps": ["2"], "model": "nemotron-120b" },
    "4": { "deps": ["3"], "model": "nemotron-120b" }
  }
}
```

### Conductor-Resolver DAG (flat format)
```json
{
  "deps": {
    "1": [],
    "2": ["1"],
    "3": ["2"],
    "4": ["3"]
  }
}
```

## Dead End Protocol
3 failures on the same clue → STUCK.md, surface to Tyler immediately.
Pre-identified stuck scenarios:
- Clue 1: TS errors, missing deps, sql.js wasm copy fails
- Clue 2: proxy non-200 (OUT OF SCOPE — proxy lives in another repo; STUCK immediately)
- Clue 3: no `/opt/secrets/vercel-token`, no Vercel project + creation fails
- Clue 4: deployed URL non-200 (rollback signal)

## Surface Notes
- 4 clues sequential, all autonomous via NIM-direct hunter-loop
- Estimated runtime: 5–10 min end-to-end (build is the slow step)
- Runtime cwd: `/home/yasaisama/more` (auto-cloned via OPS-036 if missing)
- Hunt validates BOTH: stack stability under a real deploy + slim PROMPT.md format efficacy

## Treasure (when 4/4 complete)
- `https://{vercel-url}` reachable on iPhone Safari
- TREASURE.md in hunts/more-words-pwa/ has DEPLOYED block with URL + SHA
- Tyler walks the iPhone integration checklist with Ashley + Conci as post-hunt human integration
