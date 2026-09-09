# S-00A - Blueprint, Active ADR, And Context Map Rebuild

**Spec ID:** S-00A
**Status:** active
**Priority:** 1
**Owner:** codex
**Stance:** Builder
**Updated:** 2026-09-08
**Catalog description:** Make destination ownership, active ADR Canon, and Context Map routing coherent across the Workbench and generic controls.
**Blockers:** none
**Latest event:** Locked Blueprint and ADR decisions promoted; lifecycle mechanics and complete claim disposition remain to implement.
**Next gate:** Claim TK-00A and add the failing ADR lifecycle/register cases before changing tooling.

> **Citation anchors.** pre=`340e80a4b9cf6e07ca30f3a5f406b93998d48ed2` post=`340e80a4b9cf6e07ca30f3a5f406b93998d48ed2`.

## Outcome

LLM Workbench and its generic controls make one ownership model legible: the
Blueprint describes the desired finished product, active ADR decisions carry
cross-cutting architectural Canon, the Lexicon owns the Context Map, and Specs
own scoped delivery from verified Actuality.

## Why It Matters

The earlier controls required an ADR decision to be duplicated into another
control before it could bind, while the Blueprint mixed destination, version,
status, evidence, and a generated capability inventory. That makes ordinary
routing depend on reconstruction and obscures which claims are current.

## Current Verified State

The locked owner decisions are promoted into successor ADR-000A and the root
controls. `adr.mjs` still recognizes only proposed, accepted, superseded, and
rejected records and renders every record in one default register. The required
deprecated state, whole-record successor validation, active-only default
projection, historical view, and claim-disposition evidence are implementation
gaps.

## Desired Behavior

1. Accepted, non-superseded ADR decision claims are architectural Canon without
   becoming instruction authority or turning the whole record into one plane.
2. ADR lifecycle is explicit: proposed, accepted, superseded, and deprecated;
   supersession is whole-record with a valid successor, while deprecated records
   have a durable explanation and no active Canon.
3. The default ADR register and ordinary Context Map expose active decisions;
   historical records remain stable and reachable through lifecycle links or an
   explicit history route.
4. The root and generic Blueprints use the eight locked destination sections
   and contain no release/status/evidence/catalog claims.
5. A lossless inventory records the disposition and lineage of every claim
   removed from the prior root and generic Blueprints.
6. The main-readiness review checks semantic ownership and ADR relevance in
   addition to mechanical structure and link validation.

## Decisions And Contracts

- ADR-000A wholly supersedes ADR-0002 and ADR-0025; no partial supersession is
  introduced.
- `canonicalized_in` names operational owners; it is not a condition that
  prevents an accepted active ADR decision from being Canon.
- The Lexicon's Context Map is the only navigation map. `AGENTS.md` requires
  traversal and `RUNBOOK.md` owns the ordinary entry procedure.
- The Blueprint is adaptable destination narrative, not a status report,
  generated catalog, decision inventory, or proof archive.
- The exact mechanics and schema for active/history ADR views are selected by
  the red/green implementation only if they preserve the stated boundary.

## Non-Goals

- Deleting or rewriting historical ADRs to hide them.
- Claiming current delivery of later Blueprint grilling, Genesis, or fresh-copy
  proof capabilities.
- Adding a graph service, second truth store, or mandatory coordination layer.

## Dependencies And Blockers

This spec is part of S-050 v3.2.0 and must complete before the Workbench
Template update. The release's separately recorded host/transport gates remain
outside this documentation-and-tooling capability.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-00A | Validate active ADR lifecycle and render active/history projections | ready | none | Red lifecycle/register regressions; green ADR tests and full suite |
| TK-00B | Reconcile Blueprint claim disposition and main-readiness review contract | blocked | TK-00A | Claim inventory, structural/link checks, review fixture, full suite |

### TK-00A - Validate active ADR lifecycle and render active/history projections

**Stance:** Builder

Add deterministic red cases for deprecated records, missing or cyclic successor
links, partial-supersession attempts, and active versus history register output.
Implement the smallest lifecycle parser/validator/renderer change that keeps
historical file paths and makes ordinary routing active-only.

### TK-00B - Reconcile Blueprint claim disposition and main-readiness review contract

**Stance:** Builder

Create a durable, source-linked claim-disposition inventory for the replaced
root and generic Blueprints. Add mechanical checks for the destination-only
shape and active ADR links, then update the whole-Workbench main-readiness
review procedure to require an independent semantic ownership verdict.

## Acceptance Criteria

- [ ] Lifecycle validation distinguishes proposed, accepted, superseded, and
      deprecated records and rejects broken whole-record successor links.
- [ ] Default ADR routing/register exposes only active accepted decisions, with
      a tested history path that preserves every historical record.
- [ ] Root and generic controls agree on the ownership model and Context Map.
- [ ] Root and generic Blueprints satisfy the eight-section destination shape.
- [ ] Every removed Blueprint claim has a lossless disposition and lineage.
- [ ] A main-readiness reviewer has a concrete semantic ownership checklist.
- [ ] Full required verification passes and a separate-context reviewer checks
      the immutable candidate before integration.

## Testing Seams

- `workbench/tools/adr.mjs` and `tools/test-adr.mjs` for lifecycle and views.
- Root/template control checks for destination-only Blueprint structure and
  Context Map links.
- A checked claim-disposition fixture and the documented release-review input.

## Verification Procedure

Drive the lifecycle and projection cases red/green. Run `node tools/test-adr.mjs`,
the affected control/doctor tests, the full suite named in `AGENTS.md`, render,
and doctor. Capture the required guardrail baseline and after-score before
claiming an outcome. Obtain a separate-context review of the exact candidate
before integration.

## Documentation Impact

ADR-000A, the ADR register, `AGENTS.md`, `RUNBOOK.md`, `LEXICON.md`,
`BLUEPRINT.md`, generic counterparts, review skills/procedures, and the S-050
release owner. The claim-disposition inventory is the durable migration record.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-08 | spec | Created from the locked Blueprint and ADR grilling record under explicit make-it-so | Read current controls, ADR-0002/0025, ADR tooling/tests, the release owner, and the locked decision record; doctor has no blocker | Successor ADR and root/template ownership wording promoted; durable implementation scope recorded | Lifecycle tooling, complete claim disposition, review contract, full verification, and independent review remain pending |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

S-00B proves the Workbench Template update. S-00C through S-00E own the later
project-evidence, Genesis, and fresh-copy capabilities; none is v3.2 delivery.

## Supersession

- Supersedes: none.
- Superseded by: none.
