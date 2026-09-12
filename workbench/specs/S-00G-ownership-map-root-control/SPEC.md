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
**Next gate:** Owner accepts ADR-000B, ADR-000C and ADR-000D, and answers FND-Q21, FND-Q23 and FND-Q24, before any slice is claimed.

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
Schema. Six live consumers enumerate the root surface literally and none of them
knows an eighth file: `workbench/tools/workbench-layout.mjs`,
`tools/control-fidelity.mjs`, `tools/test-workbench-layout.mjs`,
`tools/test-control-fidelity.mjs`, `RUNBOOK.md` (two places) and
`templates/ADOPTION.md` (three places). `templates/` ships no root JSON control,
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
| TK-002 | Teach the six live root-surface consumers about the eighth file | blocked | TK-001 | Red layout/fidelity tests asserting eight; green consumers; `doctor` clean |
| TK-003 | Ship a copy-ready `templates/OWNERSHIP.json` and update `templates/ADOPTION.md` | blocked | TK-002 | Template render and adoption tests pass; `evaluate-workbench --path templates` unchanged or improved |
| TK-004 | Implement the structured query surface and move the schema out of `LEXICON.md` | blocked | TK-003, FND-Q21, FND-Q23, FND-Q24 | Red test proving a query returns routes and never claim text; green query; Lexicon routes onward |

### TK-001 - Add `OWNERSHIP.json` at root with a validated schema and a failing-first reader

**Stance:** Builder

Define the record shape at a stable testing seam before writing the file. Add a
failing test for a missing and for a malformed map, confirm the expected
failure, then implement the smallest reader that turns it green. The file starts
as a valid but deliberately unpopulated container; populating it is TK-004 and
is gated on open owner questions.

### TK-002 - Teach the six live root-surface consumers about the eighth file

**Stance:** Builder

Update `workbench/tools/workbench-layout.mjs` and `tools/control-fidelity.mjs`
with their tests, plus the two `RUNBOOK.md` statements that a genesis validation
requires seven filled controls. Each consumer gets a red test asserting eight
before the change. `CLAUDE.md` and `README.md` are unaffected.

### TK-003 - Ship a copy-ready `templates/OWNERSHIP.json` and update `templates/ADOPTION.md`

**Stance:** Builder

The template copy stays generic and `[BRACKETED]` per the dogfood boundary; the
root copy stays filled and current. `templates/ADOPTION.md` names the root
surface in three places and must learn the eighth file in all three.

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
- [ ] All six enumerating consumers assert an eight-file root surface, each
      proven by a test that failed before the change.
- [ ] `templates/` ships a generic `OWNERSHIP.json` and `ADOPTION.md` describes
      it in all three places.
- [ ] `LEXICON.md` no longer carries the Artifact Ownership Schema and routes
      ownership questions to the map.
- [ ] A fresh agent with no prior context can traverse the map and reach the
      owner of any Core artifact type.

## Testing Seams

The map reader and its query function, the root-surface enumerations in
`workbench-layout.mjs` and `control-fidelity.mjs`, and the template render path.

## Verification Procedure

Run the targeted test for the touched seam, then the full verification suite
named in `AGENTS.md`, then
`node workbench/tools/spec-workbench.mjs doctor`.

## Documentation Impact

`LEXICON.md` loses the schema and gains a route. `AGENTS.md` and `BLUEPRINT.md`
carry the ADR-000B and ADR-000C claims at ADR acceptance, which is a separate
step from this Spec. `RUNBOOK.md` gains the query procedure.

## Append-Only Evidence And Execution Log

| Date | Commit | Claim | Method | Result |
|---|---|---|---|---|
| 2026-09-12 | c0ac60a | Spec authored; no implementation performed | Read-only consumer scan and ADR authoring | Six enumerating consumers confirmed; no root JSON control exists |

## Completion Result

Not started.

## Remaining Limitations Or Follow-Up Specs

The map's contents depend on three open owner questions. This Spec delivers the
container, its guardrail and its consumers; a later linked Spec may be needed if
FND-Q24 makes project-specific extension a first-class mechanism.

## Supersession

None.
