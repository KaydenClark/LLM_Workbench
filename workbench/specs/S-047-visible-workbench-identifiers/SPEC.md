# S-047 - Visible Workbench Identifiers

**Spec ID:** S-047
**Status:** active
**Priority:** 2
**Owner:** codex
**Stance:** Builder
**Updated:** 2026-09-08
**Catalog description:** Introduce visible base-62 identifiers without parallel IDs or loss of existing references.
**Blockers:** none
**Latest event:** TK-001 claimed by codex.
**Next gate:** Close TK-001 with verification and documentation proof.

## Outcome

The visible artifact identifier contains its existing type prefix plus a
base-62 value. The full identifier is unique within that type and Workbench;
independent Workbenches may reuse it. It is not a second identity alongside
the visible label.

## Why It Matters

The owner corrected the proposal for a parallel identity: the alphanumeric
value replaces the numeric portion, for example S-00A or ADR-00A. Requiring a
global identity now would introduce a connection model the owner deferred.

## Current Verified State

At `8e9c06f6f98825925e7da6cce59fb68768b589d7`, `workbench/tools/spec-packet.mjs`
and `spec-workbench.mjs` consume numeric spec/ticket identifiers;
`workbench/tools/adr.mjs` allocates four-digit decimal ADR filenames.
This spec and S-046/S-048 deliberately use the current allocator-compatible
format. No ID parser or historical artifact is migrated by the scoping change.

## Desired Behavior

- Keep each artifact type prefix; use the base-62 value as its visible ID.
- Enforce uniqueness within a Workbench and artifact type, including allocation
  collisions. Do not add a secondary global or cross-Workbench field.
- Preserve existing stable spec paths, citations, evidence, and lookup behavior.
  Inventory consumers before changing shared parsing or comparison.
- Define alphabet ordering, width/growth, case handling on case-insensitive
  filesystems, and legacy numeric interpretation explicitly and test them.
  These are engineering proposals until evaluated, not owner-approved details.
- Deliver compatibility in slices; a new notepad may use a locally unique
  provisional visible ID while universal allocation is unimplemented.

## Decisions And Contracts

ADR-0041 and LEXICON own accepted identity semantics. S-046 records the source
reconciliation and current promotion authority. Source Q17C's parallel-field
wording is superseded by the owner's correction; Q17D fixes uniqueness scope.
No fixed alphabet, truncation length, sorting order, or big-bang renumbering was
accepted. Do not reinterpret an old decimal ID as a base-62 ordinal silently.

## Non-Goals

Cross-Workbench federation, secondary global IDs, renaming stable spec paths,
or downstream rollout during this scoping assignment.

## Dependencies And Blockers

No owner decision blocks a compatibility proposal. A change to visible meaning
or a lossy migration must be brought back as a concrete product tradeoff.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Allocate and retrieve one new visible notepad ID through a tested CLI while legacy numeric records still resolve | in-progress | none | pending |
| TK-002 | Extend visible-ID compatibility through spec ticket and ADR consumers without renaming historical paths | ready | TK-001 | pending |

### TK-001 - Compatibility tracer bullet

**Stance:** Builder

Trace allocation -> storage -> discovery -> CLI lookup -> tests. Demonstrate
duplicate refusal, independent type scopes, leading zero and case behavior,
and unchanged legacy lookup. Coordinate the shared notepad seam with S-046;
do not force every artifact migration into the first slice.

### v3.2.0 assigned completion (2026-09-08)

**Stance:** Builder

[S-050](../S-050-workbench-v3-2-0-release/SPEC.md) assigns this capability through
verified delivery. TK-001 tests the note allocator first. TK-002 inventories
all parser, sorting, route, CLI, diagnostic, rendering, citation and allocator
consumers of specs, tickets and ADRs, then enables the same visible syntax.
Engineering defaults: alphabet 0-9 A-Z a-z, no silent numeric reinterpretation,
legacy numeric labels resolve exactly; new allocation refuses case-folded
collisions on supported filesystems. Width/growth must be tested and documented
before selection, and IDs never rename existing stable spec paths. Independent
Workbench connection identity under S-052 is a namespace, not another ID on
each artifact. Test old/new mixed lookup and duplicates at public CLI seams;
record full consumer coverage and remaining unsupported artifacts explicitly.

## Acceptance Criteria

- [ ] The accepted visible-ID semantics work through allocation and lookup.
- [ ] Legacy references and stable paths are preserved with named compatibility proof.
- [ ] Collision, case, width/growth, and alphabet behavior are explicit and tested.
- [ ] A consumer inventory and staged migration account for specs, tickets, ADRs, notes, and other supported artifacts.
- [ ] Root/template docs, full suite, guardrail comparison, and independent review agree with implemented support.

## Testing Seams

Allocator and public lookup commands, old record fixtures, duplicate/type scope,
case-insensitive filesystems, and existing citation/lifecycle checks.

## Verification Procedure

Red/green targeted tests, full AGENTS suite, render, doctor, guardrail before/
after, legacy reference read-back, and independent candidate review.

## Documentation Impact

LEXICON/ADR-0041 hold semantics; RUNBOOK and shared tooling document exact
allocation behavior once implemented. Root and generic templates stay aligned.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-06 | spec | Accepted identity direction captured without inventing compatibility details | S-046 source reconciliation Q17C/Q17D; numeric consumers inspected at 8e9c06f | ADR-0041, LEXICON, and this spec | Runtime allocation and migration unimplemented |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

S-046 owns the local notepad foundation. Release ordering and backward
compatibility tradeoffs remain in the local rollout grilling record.

## Supersession

- Supersedes: none.
- Superseded by: none.
