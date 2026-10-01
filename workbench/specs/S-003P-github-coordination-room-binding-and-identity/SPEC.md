# S-003P - GitHub Coordination Room Binding And Identity

**Spec ID:** S-003P
**Status:** active
**Priority:** 1
**Owner:** codex-github-binding
**Stance:** Builder
**Updated:** 2026-10-01
**Catalog description:** Resolve an explicit GitHub coordination repository and room-scoped artifact identities from immutable repository sources.
**Blockers:** No prerequisite blocks the first read-only binding slice. Native Issue mapping awaits the Issue graph seam. Live actor trust belongs to the assignment owner.
**Latest event:** TK-004A source candidate4d9a24b8 passed51/51 checks, public inspector7/7 and receipt-backed installed invocation/hash; independent integration review remains.
**Next gate:** Independent review of the immutable assembled Task candidate, then reviewed integration containment and Task close; later artifact-identity/Issue slices remain uncut.

> **Citation anchors.** pre=`282dc043ab7dad92826a6d5447369238c35df0a3` post=`282dc043ab7dad92826a6d5447369238c35df0a3`.

## Outcome

Resolve an explicit GitHub coordination repository and room-scoped artifact identities from immutable repository sources.

## Why It Matters

GitHub Coordination is part of the owner-directed v4 package. A bounded capability owner makes the accepted destination executable without one oversized Spec or a second coordination queue.

## Current Verified State

At the pre anchor, PR235 concept sources are contained in integration. The proposed [GitHub coordination decision](../../docs/adr/proposed/000Q-github-issues-are-the-required-live-coordination-authority.md) records the accepted destination and conditional effect. The active [claim decision](../../docs/adr/000O-claims-are-pushed-on-the-task-branch-and-read-from-every-remote-tip.md) and `workbench/tools/claim-coordination.mjs` remain operative. No Issue-backed assignment runtime or binding inspector exists at this anchor. Existing room identity, typed visible IDs, Tracker, lifecycle and review tools are reused, not reimplemented.

## Desired Behavior

1. Read an explicit noncredential repository binding and the existing room identity from a named immutable source commit. Never infer a configured coordination service from a Git remote.
2. Resolve typed identities including legacy Spec-qualified Tasks, former spellings, ungrouped concepts and source paths; ambiguity refuses before any write.
3. Preserve identity through retitles, folder moves and retirement, and retain native Issue identity and pinned source lineage without reallocating Workbench IDs.

## Decisions And Contracts

- Scope and permission remain with the request, Contract and assigned Spec/Task. Issue metadata is coordination evidence, never blanket instruction authority.
- Accepted concept lineage is LMK-000A and DQC-000B/000C/000D; extended outage recovery remains DQC-000E and is off the v4 critical path.
- Exact actor trust and Projects availability/requirement are unresolved. Preserve these gates without blocking independent read-only work.
- Source proof, installed behavior, integration containment, failed ongoing owner Human QA and owner-only main promotion are distinct.

## Non-Goals

Custom scheduler or atomic lock; a parallel local queue; extended outage recovery; main promotion; version bump; private-catalog publication; unrelated room rollout; Dungeon Friends work.

## Dependencies And Blockers

No prerequisite blocks the first read-only binding slice. Native Issue mapping awaits the Issue graph seam. Live actor trust belongs to the assignment owner.

[Workbench v4 release](../S-00O-workbench-v4-0-0-release/SPEC.md) owns package/release ordering. S-01X retains the six-lane composed Taskboard destination. Consume immutable delivered seams rather than requiring peers' owner/main closure and creating a circular release dependency.

## Vertical Implementation Slices

[TK-004A](tasks/TK-004A/TASK.md) delivers the first read-only binding inspector. One Worker owns its named source/test/registration lanes. Identity mapping and remote operations stay uncut until their source and dependency seams are verified; no other Task is activated here.

## Acceptance Criteria

- [x] A read-only public command resolves committed room binding at an exact commit, rejects malformed input with named errors and leaves the checkout unchanged.
- [ ] Artifact lookup distinguishes identically labelled legacy Tasks in different Specs and resolves supported former spellings without choosing an ambiguous record.
- [ ] Moves and retirement retain room/artifact/Issue correspondence and immutable source references.
- [ ] The adapter is registered in the managed runtime and its delivered seams work from a receipt-backed fresh-room installation.

## Testing Seams

Public CLI or supported GitHub operation with controlled repository/Issue fixtures; red/green refusal, identity, retry and preservation cases. For setup, use receipt-backed installed commands; for continuation and cutover, name actual host and remote evidence separately from fixtures.

## Verification Procedure

Run the Task's public red/green seam and one-command demo, then the complete AGENTS required suite, render and doctor. Pin the candidate before source-identity checks. Record read-only self-drift pre/post receipts and bounded semantic findings; capture guardrail before/after for harness changes. Obtain independent review before integration. Live remote/installed/host proof is required only when the named acceptance needs it and must never be inferred from a fixture.

## Documentation Impact

This Spec owns capability requirements, open gates and proof. Shared operational controls and generic mirrors stay with S-00P and the cutover owner; no new command is claimed before implementation. Adapter commands are documented in their support-lane procedure owner. S-00O retains release/Template gates and S-01X retains composed-view acceptance.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-01 | none | Owner-directed capability capture from integration 282dc043ab7dad92826a6d5447369238c35df0a3; reviewed concept seed PR235. | Planning only; runtime proof not claimed. | Capability owner authored; generic operational template changes deferred to implemented seams/cutover, because no operative workflow changes here. | Acceptance unchecked; unresolved choices and later independent review preserved. |
| 2026-10-01 | TK-004A | Candidate de53544083201d66e76c7f56a95b975911ec8ed5 implements an optional committed-manifest binding inspector; native claim99643c2 is pushed. | Public red: absent inspector exits1. Green: 7/7 including immutable source, refusal/no-write and receipt-backed installed command/hash; live repository demo resolves metadata with access unverified. Full initial run45/49 exposed stale Taskboard after Receipt; regenerate and rerun final candidate. | Procedure, manifest declaration and managed registration; workflow/templates unchanged because no active service or claim rule changes. Native DQC links preserve origins/evidence. | Final full suite and independent integration review; native Issue operations, artifact mapping, actor policy and cutover remain. No Human QA/main or clean-update claim. |
| 2026-10-01 | TK-004A | Frozen candidate4d9a24b8692e90ab63c11b07515b12cae0ab2ee7 self-checked; Task remains in-progress pending independent review/integration. Zero coordination hand-backs in this continuation. | 51/51 required plus inspector/Tracker commands PASS; inspector7/7 with receipt hash and fresh installed invocation; Tracker23/23 and exact projection; demo reports metadata with access unverified. Guardrail78/100 before/after; repeated real outcome trials/control comparisons/uncertainty evidence remain recommendations. Self-drift pre/post keeps7 existing findings and cleanUpdatefalse; projection drift from first run repaired. | Procedure, source/managed registration and capability/concept routes; generic workflow/templates intentionally unchanged because active claims/required service are unchanged. | No live Issue/auth/cross-host proof, independent review or containment yet. Failed ongoing owner Human QA and owner-only main remain separate. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

Extended outage recovery is deferred and remains reachable in DQC-000E. Read/write access and Project-view requirements are not proved by a Git push. Cutover is separately gated; operative claim authority remains ADR-000O.

## Supersession

- Supersedes: none
- Superseded by: none
