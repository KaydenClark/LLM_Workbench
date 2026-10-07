# S-005C - Promote Confirmed Decisions

**Spec ID:** S-005C
**Status:** active
**Priority:** 2
**Owner:** codex-promote
**Stance:** Builder
**Updated:** 2026-10-07
**Catalog description:** Carry confirmed decisions through durable documentation, Specs, authorized Task plans and verified publication to integration.
**Blockers:** none
**Latest event:** TK-007K claimed by codex-promote.
**Next gate:** Close TK-007K with verification and documentation proof.

## Outcome

Make `/promote` a concise, ordered parent workflow like `/implement-spec`, with a checkable end for each stage. Full promotion runs Confirm, to-docs, Publish, Map through to-spec, Publish, Plan through to-tasks, Publish. A nearer endpoint limits that sequence.

## Why It Matters

A confirmed decision held only in one chat or an unmerged branch cannot serve as shared Workbench state. Publish the accepted records before later work depends on them, while keeping unfinished implementation and unresolved decisions separate.

## Current Verified State

At integration `d9a353590644f957ae24636d13ce9a41ef1987e9`, promote is a selected-note reconciliation primitive. Save proves remote branch recovery. To-spec creates a planned Spec without Tasks, and to-tasks cuts Tasks only with activation authority. S-01B delivered the earlier primitive and still awaits owner Human QA; this new capability preserves that history.

## Desired Behavior

- Resolve the confirmed answer, corrections, rationale, scope and requested endpoint before writing.
- Publish each applicable record stage to the manifest's integration branch and read it there before advancing.
- Preserve selected-claim and docs-only callers without creating Specs, Tasks or publication authority they did not request.
- Full promotion supplies planning and activation authority for its confirmed capability. Task planning does not claim or implement the Tasks.
- Resume from live owners, PR state and remote containment, reusing published records and retaining unresolved context.
- Use bounded handoffs and one writer per owner; each receiving context gets source pointers and its exact endpoint.

## Decisions And Contracts

The owner's Explore Promotion handoff of 2026-10-07 preserves the confirmed composition and corrections. The current request asks to make that workflow usable like implement-spec. Durable documentation precedes its Spec, and its Spec precedes authorized Tasks. Publish means verified integration availability, distinct from local application, branch push, implementation acceptance and main promotion. Explore can remain unfinished; promotion starts with its confirmed bounded scope.

Reuse promote, to-docs, to-spec, to-tasks, save and the existing merge route. Preserve the checked selected-note write as conditional reference guidance. This Spec owns only the smallest neighboring composition and routing changes needed for this workflow.

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

- [ ] The installed skill gives ordered, checkable confirmation, docs, Spec, Task and publication stages, including a narrower endpoint and interruption recovery.
- [ ] Existing selected-note reconciliation safeguards and caller scope remain available without recursive save/promote composition.
- [ ] A disposable Git-remote scenario publishes docs, then a planned Spec, then unclaimed Task records; a separate clone reads every stage while unfinished code stays off integration. It exercises a docs-only endpoint and retry after an interrupted publication.
- [ ] Skills, catalog, Wiki routes, relevant definitions and generic template routes agree; required checks and before/after room checks are recorded with their actual limits.
- [ ] The reviewed skill delivery is published to integration and its exact commit and owner bytes are read back there.

## Testing Seams

Installed skill/reference discovery and existing public session/Spec runtime commands in a disposable room with a bare Git remote and an independent reader. Source contract checks pin stage order and caller bounds; fixture publication proves Git and lifecycle mechanics, not autonomous agent reliability.

## Verification Procedure

Targeted skill-catalog, core-composition and direct-promotion checks; Wiki validation and lint of touched pages; the current Runbook full suite; self-drift pre/post and bounded semantic comparison; independent assembled review at an immutable candidate; fresh remote containment and byte read-back after publication.

## Documentation Impact

Promote source and conditional references, its child/caller composition, skills catalog, Wiki article and router, workflow explanations, Runbook route and matching generic templates, and Lexicon parent-verb definitions. Retain prior decision history.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-07 | planning | Captured the owner-directed parent workflow | Current integration source inspected; doctor exits 0 with unrelated attention and blocked-slice findings; fast evaluator passes | This Spec | Implementation, scenario, review and publication remain |

