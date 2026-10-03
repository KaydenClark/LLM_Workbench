# S-003R - GitHub Coordination Trusted Assignments

**Spec ID:** S-003R
**Status:** planned
**Priority:** 1
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-02
**Catalog description:** Provide attributable role-scoped Issue assignments and Worker acknowledgement without treating assignees or prose as exclusive ownership.
**Blockers:** Consumes binding and Issue graph. The owner decided the trusted actor policy on 2026-10-02: trusted operations use the owner's own GitHub account, a Director's race ruling or the coordinator's v4 tie-break is a structured Issue record, and only structured records from the room's configured account count. The earlier hold on actor-dependent Tasks is lifted; the record's exact fields and validation are for this Spec's Tasks to define. Extended outage recovery is not a prerequisite.
**Latest event:** Owner decisions of 2026-10-02 settled the trusted actor policy, recorded here and in the proposed GitHub coordination decision record. No Task is cut.
**Next gate:** Activate only an independently executable slice from current Actuality; unresolved consequential choices keep dependent slices uncut.

> **Citation anchors.** pre=`282dc043ab7dad92826a6d5447369238c35df0a3` post=`282dc043ab7dad92826a6d5447369238c35df0a3`.

## Outcome

Provide attributable role-scoped Issue assignments and Worker acknowledgement without treating assignees or prose as exclusive ownership.

## Why It Matters

GitHub Coordination is part of the owner-directed v4 package. A bounded capability owner makes the accepted destination executable without one oversized Spec or a second coordination queue.

## Current Verified State

At the pre anchor, PR235 concept sources are contained in integration. The proposed [GitHub coordination decision](../../docs/adr/proposed/000Q-github-issues-are-the-required-live-coordination-authority.md) records the accepted destination and conditional effect. The active [claim decision](../../docs/adr/000O-claims-are-pushed-on-the-task-branch-and-read-from-every-remote-tip.md) and `workbench/tools/claim-coordination.mjs` remain operative. No Issue-backed assignment runtime or binding inspector exists at this anchor. Existing room identity, typed visible IDs, Tracker, lifecycle and review tools are reused, not reimplemented.

## Desired Behavior

1. Define trusted operational fields and authenticated actors, bound to canonical scope, source commit, Task, Worker and Spec/Task branch. Arbitrary Issue prose grants nothing.
2. Director assigns and resolves races; the owner-designated coordinator Vespar breaks v4 ties. A Worker acknowledges one assigned attempt.
3. Read back each transition and refuse contested or unverifiable assignments before execution. Report pending/error and the actual concurrency guarantee; no atomic-lock claim.
4. Develop the successor assignment seam without making it authoritative alongside ADR-000O; activation is solely the cutover capability.

## Decisions And Contracts

- Scope and permission remain with the request, Contract and assigned Spec/Task. Issue metadata is coordination evidence, never blanket instruction authority.
- Accepted concept lineage is LMK-000A and DQC-000B/000C/000D; extended outage recovery remains DQC-000E and is off the v4 critical path.
- The owner decided on 2026-10-02: trusted Issue operations use the owner's own GitHub account. A role is assigned at the start of a chat and is not forced by the identity, so the Dispatcher and Director should notice a Worker acting outside its assignment. The Captain or Director approves if they can; otherwise they mark it as needing human review and wait for the owner.
- A Director's race resolution and the coordinator's v4 tie-break are structured Issue records; prose, labels, assignee and bot messages never count. Only structured records authored by the room's configured GitHub account count, which in v4 is the owner's own.
- Verified Issue write access is part of the minimum capability for any host that takes a Task; a host without it refuses claims and transitions. One active claim authority applies per item of work, and an agent claims one item, not the whole project.
- In v4 the owner is the only user, so no multi-user or team trust model is designed. Whether GitHub Projects are required for v4 remains open; preserve that gate without blocking independent read-only work.
- Source proof, installed behavior, integration containment, failed ongoing owner Human QA and owner-only main promotion are distinct.

## Non-Goals

Custom scheduler or atomic lock; a multi-user or team trust model in v4; a parallel local queue; extended outage recovery; main promotion; version bump; private-catalog publication; unrelated room rollout; Dungeon Friends work.

## Dependencies And Blockers

- [GitHub Coordination Room Binding And Identity](../S-003P-github-coordination-room-binding-and-identity/SPEC.md): consume its verified seam.
- [GitHub Coordination Issue Graph](../S-003Q-github-coordination-issue-graph/SPEC.md): consume its verified seam.

Consumes binding and Issue graph. The owner decided the trusted actor policy on 2026-10-02: trusted operations use the owner's own GitHub account, a Director's race ruling or the coordinator's v4 tie-break is a structured Issue record, and only structured records from the room's configured account count. The earlier hold on actor-dependent Tasks is lifted; the record's exact fields and validation are for this Spec's Tasks to define. Extended outage recovery is not a prerequisite.

[Workbench v4 release](../S-00O-workbench-v4-0-0-release/SPEC.md) owns package/release ordering. S-01X retains the six-lane composed Taskboard destination. Consume immutable delivered seams rather than requiring peers' owner/main closure and creating a circular release dependency.

## Vertical Implementation Slices

No Task is cut by capture. At activation, cut one context-sized complete-path Task from live Actuality; later slices retain their own dependencies and one writer per shared file. Existing source and evidence are inspected again before activation.

## Acceptance Criteria

- [ ] Unauthenticated prose, role mismatch, stale source and contested assignment are refused before a Worker begins.
- [ ] Two competing assignment attempts leave an attributable conflict and Director disposition, not two reported exclusive claims.
- [ ] A successful acknowledgement names exactly one Worker, immutable scope/source and branch, independently read back from GitHub.
- [ ] Unavailable or partial operations remain pending/error and never fall back to an invented local assignment.

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
| 2026-10-02 | none | Owner decisions recorded: trusted actor policy, verifiable structured Issue records, the write floor, per-item claim authority, single-owner v4 scope. | Promotion only; no runtime proof claimed. | This Spec, the proposed GitHub coordination decision record, the v4 release Spec and the GitHub Coordination Wiki article. | The structured record's fields and validation are undefined; no Task is cut. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

Extended outage recovery is deferred and remains reachable in DQC-000E. Read/write access and Project-view requirements are not proved by a Git push. Cutover is separately gated; operative claim authority remains ADR-000O.

## Supersession

- Supersedes: none
- Superseded by: none
