# S-00G - Ownership Map Root Control

**Spec ID:** S-00G
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-12
**Catalog description:** Deliver `OWNERSHIP.json` as the eighth root control with a structured query surface, and teach every live root-surface consumer about it.
**Blockers:** ADR-000B, ADR-000C and ADR-000D are `proposed`; FND-Q21, FND-Q23 and FND-Q24 are open owner questions.
**Latest event:** Spec authored from the approved foundation answers; no implementation started and no ADR accepted.
**Next gate:** Owner accepts ADR-000B, ADR-000C and ADR-000D before TK-001-TK-003
are claimable; TK-004 additionally needs FND-Q21, FND-Q23 and FND-Q24 answered
(see Dependencies And Blockers and each ticket's own Blockers column).

> **Citation anchors.** pre=`c0ac60a179235ef22fa6ea81aec74735087e06e5` post=`c0ac60a179235ef22fa6ea81aec74735087e06e5`.

## Outcome

The Workbench carries a maintained ownership map at repository root as
`OWNERSHIP.json`, the eighth root control. An agent with an ownership question
resolves it by structured query against that file and receives **routes to the
artifacts that own the answer**, never the answered claims. Every live consumer
that enumerates the root surface knows there are eight files, and the template
ships a copy-ready map so a new room starts with one.

## Why It Matters

Today the Artifact Ownership Schema lives inside `LEXICON.md`, a control every
agent loads whole at ordinary entry. Making that schema exhaustive at the type
level — which is what the approved answer requires — raises entry cost for every
agent, including the majority with no ownership question at all. Query-shaped
access is what makes exhaustive coverage affordable, and a prose table inside a
loaded control cannot provide it.

## Current Verified State

At the pre anchor, no root `.json` control exists in this repository; the root
surface is seven Markdown files. `LEXICON.md` carries the Artifact Ownership
Schema. More than six live consumers enumerate the root surface literally and
none of them knows an eighth file. Verified at review 2026-09-12, beyond the
original six (`workbench/tools/workbench-layout.mjs`, `tools/control-fidelity.mjs`,
`tools/test-workbench-layout.mjs`, `tools/test-control-fidelity.mjs`,
`RUNBOOK.md` two places, `templates/ADOPTION.md` three places): four more code
consumers each declare their own hardcoded seven-item control list
(`tools/test-workbench-upgrade.mjs`, `tools/test-genesis-from-decisions.mjs`,
`tools/test-workbench-adoption.mjs`, `tools/test-portability-matrix.mjs`), and
two more template consumers state the count in prose
(`templates/GENESIS.md` three places, `templates/README.md` one place). This
list is what a targeted search found, not a claim of completeness — the
pattern recurs by hardcoding, not by a shared source, so TK-002's red test
must be a repository-wide sweep for the pattern, not a fixed file list. `templates/` ships no root JSON control,
so a template `OWNERSHIP.json` is new shipped content rather than an edit.
`ADR-0013` still fixes the root surface at seven files and is still `accepted`.

## Desired Behavior

An agent asks an ownership question and receives a route. The query names an
artifact type or a responsibility and returns the owning artifact plus how to
reach it. It never returns the claim text, because a map that answers with
content becomes a second truth store that drifts from the first.

`LEXICON.md` keeps shared language and the Context Map and routes ownership
questions onward instead of answering them. `doctor` reports a missing or
malformed map without inventing authority the map does not carry.

## Decisions And Contracts

- Placement, root-surface count, and the separation of root placement from Core
  and Contract membership: [ADR-000B](../../docs/adr/000B-the-workbench-root-surface-is-eight-files-and-contract-membership-is-separate-from-root-placement.md).
- Contract membership and the three carriers: [ADR-000C](../../docs/adr/000C-the-workbench-contract-is-the-obligation-claim-set-carried-by-three-root-controls-and-the-assigned-spec.md).
- Exhaustive-by-query and the routes-not-claims guardrail: [ADR-000D](../../docs/adr/000D-the-ownership-map-is-an-exhaustive-type-level-framework-answered-by-structured-query.md).

All three are `proposed` at authoring time. No slice may be claimed while they
remain proposed, because the Spec would be implementing a decision the owner has
not accepted.

## Non-Goals

- **Populating the map.** The allocation of responsibilities across artifact
  types is FND-Q21 and is open. Transcribing the existing Lexicon schema into
  JSON does not answer it and must not be treated as doing so.
- **Entry lifecycle for map records.** FND-Q23 is open. `OWNERSHIP.json` is a
  single file, so folder lifecycle cannot apply and an in-record status the
  query filters on is required — but its design is not settled.
- **The portability boundary.** FND-Q24 is open: which assignments are portable
  Core and which may be project-specific extensions.
- Retiring or rewriting any Spec, Task or ADR.

## Dependencies And Blockers

Blocked on owner acceptance of ADR-000B, ADR-000C and ADR-000D, and on owner
answers to FND-Q21, FND-Q23 and FND-Q24. The first three slices below deliver
the container and its consumers and need only the ADRs; the content slice needs
the three open answers and cannot start without them.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Add `OWNERSHIP.json` at root with a validated schema and a failing-first reader | blocked | ADR-000B, ADR-000C, ADR-000D proposed | Red test for a missing/malformed map; green minimal reader; full suite |
| TK-002 | Sweep and teach every live root-surface consumer about the eighth file | blocked | TK-001 | Red repo-wide sweep proving every hardcoded root-surface count/list is found; green update of every one found; `doctor` clean |
| TK-003 | Ship a copy-ready `templates/OWNERSHIP.json` and update every template consumer | blocked | TK-002 | Template render and adoption tests pass; `evaluate-workbench --path templates` unchanged or improved |
| TK-004 | Implement the structured query surface and move the schema out of `LEXICON.md` | blocked | TK-003, FND-Q21, FND-Q23, FND-Q24 | Red test proving a query returns routes and never claim text; green query; Lexicon routes onward |

### TK-001 - Add `OWNERSHIP.json` at root with a validated schema and a failing-first reader

**Stance:** Builder

Define the record shape at a stable testing seam before writing the file. Add a
failing test for a missing and for a malformed map, confirm the expected
failure, then implement the smallest reader that turns it green. The file starts
as a valid but deliberately unpopulated container; populating it is TK-004 and
is gated on open owner questions.

### TK-002 - Sweep and teach every live root-surface consumer about the eighth file

**Stance:** Builder

The pattern recurs by hardcoding a literal count or file list, not from one
shared source, so start with a red test that scans the repository (excluding
`.git`, `node_modules` and untracked scratch paths) for the pattern and fails
listing every hit — do not trust the ten-plus consumers already found at review
(`workbench/tools/workbench-layout.mjs`, `tools/control-fidelity.mjs`,
`tools/test-workbench-layout.mjs`, `tools/test-control-fidelity.mjs`,
`tools/test-workbench-upgrade.mjs`, `tools/test-genesis-from-decisions.mjs`,
`tools/test-workbench-adoption.mjs`, `tools/test-portability-matrix.mjs`,
`RUNBOOK.md`) as the complete list. Update every consumer the sweep finds and
turn the sweep itself green. `CLAUDE.md` and root `README.md` were checked at
review and carry no such count; template consumers are TK-003.

### TK-003 - Ship a copy-ready `templates/OWNERSHIP.json` and update every template consumer

**Stance:** Builder

The template copy stays generic and `[BRACKETED]` per the dogfood boundary; the
root copy stays filled and current. `templates/ADOPTION.md` (three places),
`templates/GENESIS.md` (three places, verified at review) and
`templates/README.md` (one place, verified at review) all name the root
surface and must learn the eighth file everywhere TK-002's sweep finds it under
`templates/`.

### TK-004 - Implement the structured query surface and move the schema out of `LEXICON.md`

**Stance:** Builder

Do not start this slice until FND-Q21, FND-Q23 and FND-Q24 are answered. The
guardrail is the test that matters: assert that a query result carries routes
and never the claim text of the artifact it routes to.

## Acceptance Criteria

- [ ] `OWNERSHIP.json` exists at repository root and validates against a
      declared schema.
- [ ] A structured query returns the owning artifact and its route for every
      Core artifact type, and returns no claim text.
- [ ] A repository-wide sweep for a hardcoded root-surface count or file list
      finds nothing still asserting seven, proven by a test that failed before
      the change and passes after every found consumer is updated.
- [ ] `templates/` ships a generic `OWNERSHIP.json`, and `ADOPTION.md`,
      `GENESIS.md` and `README.md` all describe the eighth file everywhere
      they name the root surface.
- [ ] `LEXICON.md` no longer carries the Artifact Ownership Schema and routes
      ownership questions to the map.
- [ ] A fresh agent with no prior context can traverse the map and reach the
      owner of any Core artifact type.

## Testing Seams

The map reader and its query function, a repository-wide root-surface-count
sweep, the enumerations in `workbench-layout.mjs` and `control-fidelity.mjs`
plus the other consumers TK-002 finds, and the template render path.

## Verification Procedure

Run the targeted test for the touched seam, then the full verification suite
named in `AGENTS.md`, then
`node workbench/tools/spec-workbench.mjs doctor`.

## Documentation Impact

`AGENTS.md` and `BLUEPRINT.md` carry the ADR-000B and ADR-000C claims at ADR
acceptance, which is a separate step from this Spec. `LEXICON.md` loses the
schema and gains a route only once TK-004 populates and makes the map
queryable, per ADR-000D — not at acceptance alone, since TK-001-TK-003 leave
the map an empty, unqueryable container and a question routed there before
TK-004 would have nowhere to land. `RUNBOOK.md` gains the query procedure at
the same point.

## Append-Only Evidence And Execution Log

| Date | Commit | Claim | Method | Result |
|---|---|---|---|---|
| 2026-09-12 | c0ac60a | Spec authored; no implementation performed | Read-only consumer scan and ADR authoring | Six enumerating consumers confirmed; no root JSON control exists |
| 2026-09-12 | b4edb20 | Review found the six-consumer inventory was incomplete | Repo-wide grep for literal root-control-name arrays and "seven" root-surface mentions | Four more code consumers and two more template consumers found and named; TK-002/TK-003 changed from a fixed list to a sweep-and-fix pattern since the true count is not established as complete even now |
| 2026-09-12 | f2d2e87 | Review found ADR-000D and this Spec's Documentation Impact removed LEXICON.md's Artifact Ownership Schema "at acceptance", before TK-004 populates the map — leaving no route for an ownership question during TK-001-TK-003 | Re-read ADR-000D's Consequences against this Spec's own ticket sequencing | Corrected ADR-000D and Documentation Impact to defer schema removal until TK-004 lands; no implementation performed |

## Completion Result

Not started.

## Remaining Limitations Or Follow-Up Specs

The map's contents depend on three open owner questions. This Spec delivers the
container, its guardrail and its consumers; a later linked Spec may be needed if
FND-Q24 makes project-specific extension a first-class mechanism.

## Supersession

None.
