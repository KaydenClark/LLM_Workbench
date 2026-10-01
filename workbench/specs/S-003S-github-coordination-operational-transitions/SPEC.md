# S-003S - GitHub Coordination Operational Transitions

**Spec ID:** S-003S
**Status:** planned
**Priority:** 1
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-01
**Catalog description:** Report holds, hand-backs and review requests through trusted GitHub operations while repository owners retain substantive decisions and proof.
**Blockers:** Consumes Issue graph and trusted assignment seams. Reuses S-00J/S-00I/S-00U gate/lifecycle evidence; no new review or approval authority. Extended recovery stays deferred.
**Latest event:** Owner requested GitHub coordination implementation; this bounded capability owner is authored from reviewed concept sources.
**Next gate:** Activate only an independently executable slice from current Actuality; unresolved consequential choices keep dependent slices uncut.

> **Citation anchors.** pre=`282dc043ab7dad92826a6d5447369238c35df0a3` post=`282dc043ab7dad92826a6d5447369238c35df0a3`.

## Outcome

Report holds, hand-backs and review requests through trusted GitHub operations while repository owners retain substantive decisions and proof.

## Why It Matters

GitHub Coordination is part of the owner-directed v4 package. A bounded capability owner makes the accepted destination executable without one oversized Spec or a second coordination queue.

## Current Verified State

At the pre anchor, PR235 concept sources are contained in integration. The proposed [GitHub coordination decision](../../docs/adr/proposed/000Q-github-issues-are-the-required-live-coordination-authority.md) records the accepted destination and conditional effect. The active [claim decision](../../docs/adr/000O-claims-are-pushed-on-the-task-branch-and-read-from-every-remote-tip.md) and `workbench/tools/claim-coordination.mjs` remain operative. No Issue-backed assignment runtime or binding inspector exists at this anchor. Existing room identity, typed visible IDs, Tracker, lifecycle and review tools are reused, not reimplemented.

## Desired Behavior

1. Operational assignment updates, holds and hand-backs avoid claim-only repository commits; changes to requirements, decisions or proof maintain their repository owners.
2. Bind each transition to immutable candidate, source revision, target branch and existing gate result. Worker hand-back differs from containment and Spec closure.
3. Preserve failed owner Human QA and corrective work; Issue closure, PR merge or green tests cannot manufacture approval.
4. Retried and partial writes expose pending/error and report only remotely read-back achieved transitions.

## Decisions And Contracts

- Scope and permission remain with the request, Contract and assigned Spec/Task. Issue metadata is coordination evidence, never blanket instruction authority.
- Accepted concept lineage is LMK-000A and DQC-000B/000C/000D; extended outage recovery remains DQC-000E and is off the v4 critical path.
- Exact actor trust and Projects availability/requirement are unresolved. Preserve these gates without blocking independent read-only work.
- Source proof, installed behavior, integration containment, failed ongoing owner Human QA and owner-only main promotion are distinct.

## Non-Goals

Custom scheduler or atomic lock; a parallel local queue; extended outage recovery; main promotion; version bump; private-catalog publication; unrelated room rollout; Dungeon Friends work.

## Dependencies And Blockers

- [GitHub Coordination Issue Graph](../S-003Q-github-coordination-issue-graph/SPEC.md): consume its verified seam.
- [GitHub Coordination Trusted Assignments](../S-003R-github-coordination-trusted-assignments/SPEC.md): consume its verified seam.

Consumes Issue graph and trusted assignment seams. Reuses S-00J/S-00I/S-00U gate/lifecycle evidence; no new review or approval authority. Extended recovery stays deferred.

[Workbench v4 release](../S-00O-workbench-v4-0-0-release/SPEC.md) owns package/release ordering. S-01X retains the six-lane composed Taskboard destination. Consume immutable delivered seams rather than requiring peers' owner/main closure and creating a circular release dependency.

## Vertical Implementation Slices

No Task is cut by capture. At activation, cut one context-sized complete-path Task from live Actuality; later slices retain their own dependencies and one writer per shared file. Existing source and evidence are inspected again before activation.

## Acceptance Criteria

- [ ] Hold, resume and candidate hand-back are attributable and visible without modifying substantive contract or proof owners.
- [ ] A transition with stale candidate/source or missing named gate refuses without false delivery.
- [ ] Task containment, independent review, owner QA and main-bound closure remain separately visible with existing failures preserved.
- [ ] Partial write and retry scenarios retain exact pending state and cannot report nonexistent delivery.

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

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

Extended outage recovery is deferred and remains reachable in DQC-000E. Read/write access and Project-view requirements are not proved by a Git push. Cutover is separately gated; operative claim authority remains ADR-000O.

## Supersession

- Supersedes: none
- Superseded by: none
