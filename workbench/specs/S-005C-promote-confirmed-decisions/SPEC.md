# S-005C - Promote Confirmed Decisions

**Spec ID:** S-005C
**Status:** active
**Priority:** 2
**Owner:** codex-promote
**Stance:** Builder
**Updated:** 2026-10-07
**Catalog description:** Orchestrate one confirmed decision through delegated Record, Map, Plan and verified stage publication to integration.
**Blockers:** none
**Latest event:** TK-007K claimed by codex-promote.
**Next gate:** Close TK-007K with verification and documentation proof, then independently review the assembled candidate and publish to integration.

## Outcome

Deliver `promote-decision` as a thin Workbench maintainer skill for one
confirmed decision per invocation. Its coordinator dispatches Record through
`to-docs`, a publisher, Map through `to-spec`, then Plan through `to-tasks`.
The flow is Confirm -> Record -> Publish -> Map -> Publish -> Plan -> Publish.
A nearer endpoint limits the run; Workers author every stage and correction.

## Why It Matters

A confirmed decision held only in one chat or an unmerged branch cannot serve as shared Workbench state. Publish the accepted records before later work depends on them, while keeping unfinished implementation and unresolved decisions separate.

## Current Verified State

At integration `d9a353590644f957ae24636d13ce9a41ef1987e9`, promote is a selected-note reconciliation primitive. Save proves remote branch recovery. To-spec creates a planned Spec without Tasks, and to-tasks cuts Tasks only with activation authority. S-01B delivered the earlier primitive and still awaits owner Human QA; this new capability preserves that history.

## Desired Behavior

- Cold-start from a saved source pointer, decision ID and confirmed revision; recover the readback, rationale, corrections, scope and endpoint before dispatch.
- Dispatch explicit subagent Record, Map and Plan Workers and a publisher; return corrections to the authoring Worker.
- Publish each applicable record stage to the manifest's integration branch and read it there before advancing.
- Preserve selected-claim and docs-only callers without creating Specs, Tasks or publication authority they did not request.
- The confirmed endpoint supplies planning and native activation authority for its capability. Task planning does not claim or implement the Tasks.
- Resume from live owners, PR state and remote containment, reusing published records and retaining unresolved context.
- Use bounded handoffs and one writer per owner; each receiving context gets source pointers and its exact endpoint.
- The Grill Board dispatcher starts one run per individually confirmed current item/revision, ordering dependencies and shared owners inside batches. Grill-me hands off at session end after the final confirmed readback, one run per decision.

## Decisions And Contracts

The owner confirmed the single-decision skill and entry-point design on
2026-10-07 and authorized delivery through integration after its gates. The
earlier broad parent draft is superseded by that confirmed design. Record
precedes the destination map, and the map precedes authorized Task planning.
Publish means verified integration availability, distinct from local
application, branch push, implementation acceptance and main promotion.

Reuse to-docs, to-spec, to-tasks, save and the existing review/merge route.
Keep `/promote` as its original selected-claim primitive and preserve its safe
`save` composition. Register the new skill under `maintainerSkills`, alongside
implement-spec, through the existing lane adapters. It stays outside Core and
home catalogs; shared generic verb definitions change with this source,
while the Workbench-only orchestration route is exempt from template shipment.

## Non-Goals

- Automatic agent refresh or consumption, a new tracker or publication service.
- Implementing promoted capabilities, changing role names or the rest of Journey.
- Main promotion, owner Human QA or repair of unrelated dirty work and self-drift.

## Dependencies And Blockers

None for this scoped delivery. Existing review and publication gates remain in force.

## Vertical Implementation Slices

Task records own the scoped delivery work; the generated board projects them.

| Task | Slice | Status | Blockers | Proof |
|---|---|---|---|---|

## Acceptance Criteria

- [ ] The tracked and discovered maintainer skill coordinates one confirmed decision through delegated Record, Map, Plan and stage publication, within its endpoint.
- [ ] Its cold-start source contract and board/grill-me entry routes retain decision identity, confirmed revision, rationale, corrections, scope, pending state, dependency ordering and recovery from live owners/PRs/containment.
- [ ] Existing selected-note reconciliation safeguards and caller scope remain available without recursive save/promote composition.
- [ ] A disposable Git-remote scenario publishes docs, then a planned Spec, then unclaimed Task records; a separate clone reads every stage while unfinished code stays off integration. It exercises a docs-only endpoint and retry after an interrupted publication.
- [ ] Skills, catalog, Wiki routes and relevant shared definitions agree; the Workbench-only template exemption, required checks and before/after room checks are recorded with their actual limits.
- [ ] The publication contract requires fresh per-stage integration containment and changed-owner read-back before dependent work; local application or branch push alone never releases a stage.

## Testing Seams

Workbench lane discovery and Core exclusion; existing public session/Spec
runtime commands in a disposable room with a bare Git remote and independent
reader. Source contract checks pin stage order and caller bounds; fixture
publication proves Git and lifecycle mechanics with simulated merge authority,
not autonomous agent reliability or live GitHub gates. A separate cold-start
delegated scenario can assess coordinator behavior within its observed bounds.

## Verification Procedure

Outcome hypothesis: a cold-start coordinator recovers one confirmed corrected
decision, delegates authoring and corrections, and holds dependent stages until
the previous stage is read back from integration. Source and fixture checks
cover instruction/command seams; a delegated scenario supplies bounded behavior
observations. Static benchmark scores are separate from that outcome evidence.

Targeted skill-catalog, core-composition and direct-promotion checks; Wiki validation and lint of touched pages; the current Runbook full suite; self-drift pre/post and bounded semantic comparison; independent assembled review at an immutable candidate; fresh remote containment and byte read-back after publication.

Source and fixture acceptance can be assessed before merging this delivery.
The authorized delivery endpoint remains the reviewed source on integration,
with fresh containment and owner-byte read-back recorded in the evidence and
completion result. That final real publication proof is a later delivery gate,
separate from the disposable fixture's simulated publication.

## Documentation Impact

New maintainer skill and manifest/catalog registration; Record, Map, Plan and
grilling callers; board and grill-me entry routes; Wiki article and router;
Runbook operation; shared Lexicon verb definitions and matching generic
definitions. Restore the original core primitive and safe save composition.
Retain prior decision history and S-01B's pending owner Human QA.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-07 | planning | Captured the owner-directed parent workflow | Current integration source inspected; doctor exits 0 with unrelated attention and blocked-slice findings; fast evaluator passes | This Spec | Implementation, scenario, review and publication remain |
| 2026-10-07 | TK-007K | Reconciled the earlier broad draft to the owner-confirmed single-decision design | New skill source-contract RED: absent maintainer registration; original promote/save recovered from integration d9a353590644f957ae24636d13ce9a41ef1987e9 | Confirmed design reflected in this Spec, caller routes and proposed ADR | Targeted/full checks, delegated behavioral proof, independent assembled review and integration publication remain |
| 2026-10-07 | TK-007K | Captured clean pinned-integration room and benchmark baselines before final delivery | Source d9a353590644f957ae24636d13ce9a41ef1987e9: self-drift has 21 findings, machine blocked and cleanUpdate false; evaluator templates+controls 106.6/113; guardrail templates 43.9/100 evidence-poor | Baseline findings remain under their existing owners; this Spec names the scoped comparison | Unrelated blocked slices, stale claims, stale seeds and provenance remain; detached-head finding came from the inspection clone |
| 2026-10-07 | TK-007K | Corrected the disposable publication fixture setup | Candidate 9353fb32f1dc32ee62b69c64ebb37980848935cf: core-composition fixture failed because render required BLUEPRINT.md; direct-promotion, skills-lane, runbook-index, grill-board and evaluator self-test passed | Added the fixture's Blueprint input; no skill behavior changed | Affected scenario rerun and full suite remain; this was not a clean first pass |
| 2026-10-07 | TK-007K | Completed the publication fixture's renderer prerequisites | Rerun at f36f975ad7d5adddcbb9421d9f87288f3fbc992d identified missing TASKBOARD.md; inspected render's exact Blueprint and hot-specs projection inputs before correction | Seeded the required Taskboard markers; no runtime or skill behavior changed | Affected scenario rerun and full suite remain |
| 2026-10-07 | TK-007K | Corrected the fixture's CLI output contract and clarified the delivery gate | Rerun at aad172c8 used show without --json; inspected showSpec/publicSpec and native activation before correcting its JSON read | Product acceptance now checks truthful stage publication; actual source integration remains the later delivery endpoint | Affected scenario rerun, full suite, assembled review and actual integration proof remain |
