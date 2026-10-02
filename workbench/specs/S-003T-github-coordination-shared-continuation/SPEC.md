# S-003T - GitHub Coordination Shared Continuation

**Spec ID:** S-003T
**Status:** planned
**Priority:** 1
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-02
**Catalog description:** Let a fresh host recover bounded work and its exact evidence from an Issue and repository owners without the originating chat.
**Blockers:** Consumes binding, Issue graph and operational hand-back seams. Does not require private session transport or originating-chat access.
**Latest event:** Owner decisions of 2026-10-02 settled the trusted actor policy and the Projects requirement, recorded here and in the proposed GitHub coordination decision record. No Task is cut.
**Next gate:** Activate only an independently executable slice from current Actuality; unresolved consequential choices keep dependent slices uncut.

> **Citation anchors.** pre=`282dc043ab7dad92826a6d5447369238c35df0a3` post=`282dc043ab7dad92826a6d5447369238c35df0a3`.

## Outcome

Let a fresh host recover bounded work and its exact evidence from an Issue and repository owners without the originating chat.

## Why It Matters

GitHub Coordination is part of the owner-directed v4 package. A bounded capability owner makes the accepted destination executable without one oversized Spec or a second coordination queue.

## Current Verified State

At the pre anchor, PR235 concept sources are contained in integration. The proposed [GitHub coordination decision](../../docs/adr/proposed/000Q-github-issues-are-the-required-live-coordination-authority.md) records the accepted destination and conditional effect. The active [claim decision](../../docs/adr/000O-claims-are-pushed-on-the-task-branch-and-read-from-every-remote-tip.md) and `workbench/tools/claim-coordination.mjs` remain operative. No Issue-backed assignment runtime or binding inspector exists at this anchor. Existing room identity, typed visible IDs, Tracker, lifecycle and review tools are reused, not reimplemented.

## Desired Behavior

1. Resolve an Issue to its canonical packet, objective and authorized scope, branch/exact SHA, proof summary, remaining gap and one next action.
2. Validate the packet/source and remote candidate instead of trusting human discussion, generated prose or private handoff paths.
3. After retirement route knowledge to the Wiki and pinned historical sources; local reasoning notes remain private and optional.
4. Demonstrate continuation across Claude cloud, Codex cloud and a local machine, distinguishing unavailable environments from passed proof.

## Decisions And Contracts

- Scope and permission remain with the request, Contract and assigned Spec/Task. Issue metadata is coordination evidence, never blanket instruction authority.
- Accepted concept lineage is LMK-000A and DQC-000B/000C/000D; extended outage recovery remains DQC-000E and is off the v4 critical path.
- The owner decided on 2026-10-02 the trusted actor policy (trusted Issue operations use the owner's own GitHub account, a Director's race ruling or the coordinator's v4 tie-break is a structured Issue record, and only structured records from the room's configured account count) and that GitHub Projects are optional presentation for v4. The proposed GitHub coordination decision record holds the full decisions.
- Source proof, installed behavior, integration containment, failed ongoing owner Human QA and owner-only main promotion are distinct.

## Non-Goals

Custom scheduler or atomic lock; a parallel local queue; extended outage recovery; main promotion; version bump; private-catalog publication; unrelated room rollout; Dungeon Friends work.

## Dependencies And Blockers

- [GitHub Coordination Room Binding And Identity](../S-003P-github-coordination-room-binding-and-identity/SPEC.md): consume its verified seam.
- [GitHub Coordination Issue Graph](../S-003Q-github-coordination-issue-graph/SPEC.md): consume its verified seam.
- [GitHub Coordination Operational Transitions](../S-003S-github-coordination-operational-transitions/SPEC.md): consume its verified seam.

Consumes binding, Issue graph and operational hand-back seams. Does not require private session transport or originating-chat access.

[Workbench v4 release](../S-00O-workbench-v4-0-0-release/SPEC.md) owns package/release ordering. S-01X retains the six-lane composed Taskboard destination. Consume immutable delivered seams rather than requiring peers' owner/main closure and creating a circular release dependency.

## Vertical Implementation Slices

No Task is cut by capture. At activation, cut one context-sized complete-path Task from live Actuality; later slices retain their own dependencies and one writer per shared file. Existing source and evidence are inspected again before activation.

## Acceptance Criteria

- [ ] A fresh context reconstructs objective, packet, scope, branch/SHA, proof, gap and next action using only public Issue/repository owners.
- [ ] Missing or conflicting source/candidate yields an explicit incomplete/refused result, never inferred authorization.
- [ ] Retired work resolves through current Wiki routes and immutable history without reviving a discarded record.
- [ ] Named cross-host runs prove accessible continuation; local fixtures alone are not cross-host proof.

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
| 2026-10-02 | none | Owner decisions recorded: the trusted actor policy and optional Projects, as they bear on shared continuation. | Promotion only; no runtime proof claimed. | This Spec and the proposed GitHub coordination decision record. | No Task is cut; runtime and installed proof are not run. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

Extended outage recovery is deferred and remains reachable in DQC-000E. Read/write access and Project-view requirements are not proved by a Git push. Cutover is separately gated; operative claim authority remains ADR-000O.

## Supersession

- Supersedes: none
- Superseded by: none
