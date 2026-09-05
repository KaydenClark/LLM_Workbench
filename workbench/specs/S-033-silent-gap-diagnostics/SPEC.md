# S-033 - Room Brain Routing, Wiki Stamps, And Checkpoint Source Bounds

**Spec ID:** S-033
**Status:** active
**Priority:** 3
**Owner:** claude-fable-5-1
**Stance:** Builder
**Updated:** 2026-09-05
**Catalog description:** Close the three v3.1.1 gaps that passed every gate green: an unrouted room brain, wiki files stamped with an older version than the manifest, and checkpoint promotion reading a source outside the repository.
**Blockers:** none
**Latest event:** TK-002 closed with proof.
**Next gate:** Complete TK-003.

## Outcome

A room whose controls forget to route to its room brain, whose wiki contract
files carry a stale version stamp, or whose checkpoint tool is pointed outside
the repository is told so by the tools it already runs.

## Why It Matters

Each of these was found by hand after every automated gate passed. OpenBrain's
`MEMORY.md` sat orphaned from its own `AGENTS.md` and `README.md` for weeks
(fix list UP-009, `room-brain-unrouted-no-doctor-check`, the only recorded
finding whose source stated no severity). This repository's own
`workbench/wiki/SCHEMA.md`, `AGENTS.md`, and `design-concepts/README.md`
stamp `Generated from LLM Workbench v3.0.0` while the manifest says v3.1.1,
and the S-027 integration review graded it P3-1 because no diagnostic covers
wiki stamps. The same review's P3-3 notes that `sessions.mjs checkpoint`
resolves `--from` without constraining it to the repository, so any readable
file on the host can be promoted into the tracked checkpoints collection; the
privacy scan still gates the content, but the boundary is the tool's job.

## Current Verified State

Verified in this repository at `b7b23dd3f0929e37276880335cd4d4cc60238d8e`
on 2026-09-05:

- `workbench/tools/diagnostics.mjs` registers `invalid-note`, `stale-note`,
  `copied-task-state`, and `secret-like-content` in the `wiki` scope and no
  routing or stamp finding. `templates/ADOPTION.md` box 9 requires a room
  brain that "routes to the live controls"; nothing checks that the controls
  route back. `templates/AGENTS.md:140` and `templates/README.md:28` carry the
  reverse routing, so a correctly generated room has it; only a room whose
  brain predates its control reconciliation lacks it.
- `workbench/tools/workbench-layout.mjs:62` `versionStamp` and
  `validateGenesisControl` (line 318) check the six stamped root controls
  against the manifest and return `version-mismatch`; `validateGenesisRuntime`
  (line 371-378) checks the wiki files for placeholders only. `doctor` checks
  no stamp at all. `workbench/wiki/SCHEMA.md:15`, `workbench/wiki/AGENTS.md:15`,
  and `workbench/wiki/design-concepts/README.md:15` read `v3.0.0`.
- `workbench/tools/sessions.mjs:22` resolves the source as
  `path.resolve(root, options.from)`; line 38 applies `assertSafeWritePath`
  to the destination only. `scanPrivacy` (line 30) gates every write.

Gap: the three findings and the stale root stamps.

## Desired Behavior

1. `doctor` reports `room-brain-unrouted` (attention, scope `wiki`, effect
   `none`) when the wiki lane holds `MEMORY.md` and either `AGENTS.md` does
   not reference the wiki lane path or `README.md` does not reference
   `MEMORY.md`. The message names the control that lacks the route.
2. `doctor` reports `stale-stamp` (attention, scope `wiki`, effect `none`)
   for a wiki contract file or room brain whose `Generated from LLM Workbench`
   stamp names a version other than the manifest's; `validate --genesis`
   extends `version-mismatch` to the same files. This repository's three
   stamped wiki files are updated to the manifest version as part of going
   green.
3. `sessions.mjs checkpoint` refuses a `--from` outside the repository root
   with `invalid-note` and a message naming the boundary; the privacy scan
   and exclusive destination write are unchanged.

## Decisions And Contracts

- **Attention, not blocking.** All three are visibility gaps in rooms that
  otherwise work; ADR-0020 forbids blocking selection on them.
- **The stamp check is version equality, not freshness.** A wiki file stamped
  with the manifest version is current by definition; content staleness stays
  with `stale-note`.
- **Source and destination share one boundary.** Checkpoint promotion reads
  and writes inside the repository only; the untracked-by-default session
  collections remain the intended sources.

## Non-Goals

- Semantic verification that the room brain's links are useful; the check is
  reverse-reference presence.
- Stamping this repository's root controls, which the README states are
  unstamped because this repository is the source.
- Repairing OpenBrain or any other room.

## Dependencies And Blockers

- none

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | `room-brain-unrouted` in doctor with a fixture whose controls omit the route | done | none | node tools/test-diagnostics.mjs (5 pass; new test: an unrouted room brain is an attention finding that names the control lacking the route), node tools/test-wiki.mjs (7 pass), node tools/test-workbench-layout.mjs (19 pass); doctor on this repository reports no room-brain-unrouted |
| TK-002 | `stale-stamp` in doctor and wiki stamps in the Genesis gate; root wiki stamps updated to the manifest version | done | none | node tools/test-wiki.mjs (9 pass; new: stale-stamp attention test and this-repository stamp/routing test), node tools/test-workbench-layout.mjs (20 pass; new: Genesis readiness requires version-matched wiki stamps), node tools/test-diagnostics.mjs (5 pass), node tools/test-sessions.mjs (3 pass); doctor on this repository reported stale-stamp for workbench/wiki/SCHEMA.md, AGENTS.md, design-concepts/README.md (v3.0.0 vs manifest v3.1.1) before the refresh and none after |
| TK-003 | `checkpoint` refuses a source outside the repository root | ready | none | pending |

### TK-001 - The controls route back

**Stance:** Builder

Red first: a disposable project with a filled `workbench/wiki/MEMORY.md` whose
`AGENTS.md` lacks any `workbench/wiki` reference must yield
`room-brain-unrouted` naming `AGENTS.md`; adding the ownership row clears it.

### TK-002 - Stamps agree with the manifest

**Stance:** Builder

Red first: `doctor` on this repository must report `stale-stamp` for the three
`v3.0.0` files; updating them clears it. `validate --genesis` on a fixture
whose `SCHEMA.md` stamp differs must return `version-mismatch` naming the
file.

### TK-003 - Checkpoint source stays inside

**Stance:** Builder

Red first: `checkpoint --from /outside/notes.md --topic x` against a
disposable project must return `blocked` with `invalid-note` and write
nothing; an in-repository source still promotes.

## Acceptance Criteria

- [ ] `doctor` reports `room-brain-unrouted` naming the control lacking the route.
- [ ] `doctor` reports `stale-stamp` for wiki files behind the manifest; `validate --genesis` fails on them; this repository's wiki stamps match its manifest.
- [ ] `checkpoint` refuses a source outside the repository and writes nothing.
- [ ] The full required suite, render, and doctor pass.

## Testing Seams

- `doctor(root)` findings and `describe(code)` in `diagnostics.mjs`.
- `validate --genesis` against a fixture with a stale wiki stamp.
- `checkpoint(root, { from, topic })` in `sessions.mjs` with in-root and
  out-of-root sources.

## Verification Procedure

```bash
node tools/test-diagnostics.mjs
node tools/test-wiki.mjs
node tools/test-workbench-layout.mjs
node tools/test-sessions.mjs
```

Then the full `AGENTS.md` verification suite, `render`, `doctor`, and
`git diff --check`.

## Documentation Impact

- `RUNBOOK.md` (root and template): the three findings and the checkpoint
  boundary.
- `workbench/wiki/SCHEMA.md`, `AGENTS.md`, `design-concepts/README.md`: stamp
  refreshed to the manifest version.
- `templates/ADOPTION.md` box 9: "and the controls route to it".

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-05 | spec | Spec captured from upstream fix-list item UP-009 and S-027 review P3-1 and P3-3 | Registry re-read at `diagnostics.mjs`: no routing or stamp code; `grep -rn "LLM Workbench v" workbench/wiki` shows three `v3.0.0` stamps against manifest v3.1.1; `sessions.mjs:22` resolves `--from` unbounded | Blueprint v3.1.2 direction links this spec | All three slices |
| 2026-09-05 | TK-001 | Ticket closed | node tools/test-diagnostics.mjs (5 pass; new test: an unrouted room brain is an attention finding that names the control lacking the route), node tools/test-wiki.mjs (7 pass), node tools/test-workbench-layout.mjs (19 pass); doctor on this repository reports no room-brain-unrouted | RUNBOOK.md Wiki Validation and Diagnostics table, templates/RUNBOOK.md doctor section, templates/ADOPTION.md box 9 now name room-brain-unrouted and the reverse route | TK-002 stale-stamp and TK-003 checkpoint boundary |
| 2026-09-05 | TK-002 | Ticket closed | node tools/test-wiki.mjs (9 pass; new: stale-stamp attention test and this-repository stamp/routing test), node tools/test-workbench-layout.mjs (20 pass; new: Genesis readiness requires version-matched wiki stamps), node tools/test-diagnostics.mjs (5 pass), node tools/test-sessions.mjs (3 pass); doctor on this repository reported stale-stamp for workbench/wiki/SCHEMA.md, AGENTS.md, design-concepts/README.md (v3.0.0 vs manifest v3.1.1) before the refresh and none after | workbench/wiki/SCHEMA.md, AGENTS.md, design-concepts/README.md stamps refreshed to v3.1.1; RUNBOOK.md Wiki Validation and Diagnostics table and templates/RUNBOOK.md doctor section name stale-stamp and the Genesis version-mismatch extension | TK-003 checkpoint source boundary |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- The version stamp for the harness itself belongs to
  [S-035](../S-035-workbench-v3-1-2-candidate/SPEC.md); TK-002 aligns the wiki
  stamps to whatever the manifest says at the time it lands.

## Supersession

- Supersedes: none
- Superseded by: none
