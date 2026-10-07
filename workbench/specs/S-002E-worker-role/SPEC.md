# S-002E - Worker Role

**Spec ID:** S-002E
**Status:** active
**Priority:** 2
**Owner:** codex-s002e-worker
**Stance:** Builder
**Updated:** 2026-10-06
**Catalog description:** Perform one assigned Task within its declared scope and return a verified, recoverable result.
**Blockers:** none for staged implementation; managed installation awaits release bundle identity.
**Latest event:** 2026-10-06: owner Human QA approved at integration `42431879` (the owner, in chat: "Human QA passes. I declare it here.").
**Next gate:** Owner promotion of the approved content to `main`; the full-capability acceptance boxes stay open until managed discovery, bundle identity and installation land through the release owner (S-00O Workbench v4.0.0 Release), so `complete S-002E` waits on them.

> **Citation anchors.** pre=`b00a2e338436ef7b281b0cc53e74f891af32f18c` post=`20bbe95`.

## Outcome

Perform one assigned Task within its declared scope and return a verified, recoverable result.

## Why It Matters

Roles define the scope of responsibility; stances define the job performed within that scope. An agent picking up integration needs a discoverable operating contract, not implicit knowledge from another chat. This Spec delivers only the minimum needed for Spec and Task rollout.

## Current Verified State

At the pre anchor, LEXICON.md defines Director, Dispatcher and Worker; BLUEPRINT.md describes Spec/Task branches and coordination. The manifest ships Reviewer and Auditor stance skills, but no dedicated Worker Role operating entry. No implementation or agent-outcome proof for this capability is claimed by this planning record.

## Desired Behavior

1. Load the assigned Task, its owning Spec and branch, acceptance, write scope and required stance before acting; a Worker has no authority over neighboring Tasks merely because their files are visible.
2. Perform the assigned job, including Task-authoring assistance when dispatched by Spec Planner; implementation work uses red/green TDD and the project verification contract.
3. Keep claims and proof aligned, preserve unrelated changes, and maintain Task-local records as work proceeds; send shared Spec/projection updates to the designated writer.
4. Hand back the exact candidate, verification, documentation changes, risks, remaining gap and merge request to the Dispatcher; one Task attempt per working chat remains the boundary.
5. Keep an interrupted or unsuccessful result recoverable with truthful proof and the next gate. Self-check is part of the Task; no new mandatory per-Task independent-review ceremony is introduced.

## Decisions And Contracts

- Owner-confirmed role/stance and minimum-scope decisions are recorded in the [role model](../../wiki/design-concepts/roles-and-stances.md) and the [destination ledger](../../sessions/grilling-destination-audit-ledger.json), family ROLE. Definitions belong to LEXICON.md; operating boundaries belong to AGENTS.md and procedures to RUNBOOK.md.
- Deliver a repository-owned operating entry discoverable through the existing skills lane/adapters and an individual routed Wiki explanation. Its form must obey the existing skill contract; adding a required core entry or changing managed bytes requires the normal bundle/version/install proof at implementation time, not an unstamped addition during planning.
- Role scope composes with assigned stance; neither grants authority beyond the request and project controls. Reviewer/Auditor stance adoption alone never makes a prior participant independent.
- GPT_OS Captain, Planner and Engineer informed the model as examples, not copied policy. Do not import model allocation, scheduling, permanent departments or an external repository prerequisite.
- Reuse existing Reviewer and Auditor capability owners. Preserve existing Tasks and proof; cut no new execution Task in this planning change.

### Authorized staged boundary (2026-10-01)

The overnight assignment activates only a Spec-local candidate, focused test,
Task evidence and [individual Wiki explanation](../../wiki/skill-worker-role.md).
Load [the staged Worker entry](candidate/worker/SKILL.md) explicitly for evaluation.
It is not an installed or managed-discovery entry. No manifest, discovery adapter,
root control, layout, frozen v3.2.1 or Factory changes are authorized here.
Templates need no mirror for this staged artifact: no portable root rule changes.
The coordinator reserves the MEMORY index hunk for serial assembly. Source tests
cannot satisfy installed-behavior acceptance. Those full-capability boxes remain
open while the bounded Task can produce a reviewable candidate.

## Non-Goals

Full role taxonomy, portfolio scheduling, a generalized multi-Spec Dispatcher, automatic flight launch, new model/provider policy, changing owner Human QA, main promotion, implementing another capability or changing unrelated rooms.

## Dependencies And Blockers

Coordinate shared controls, discovery and branch procedure with [Workflow Canon Rework](../S-00P-workflow-canon-rework/SPEC.md). The [release owner](../S-00O-workbench-v4-0-0-release/SPEC.md) retains the Task-PR rollout exception and delivery-versus-closure gates. This planning scope neither claims their Tasks nor closes their gaps. Dispatching requires a configured host that supports it; report a missing capability rather than inventing an API.

## Vertical Implementation Slices

[TK-002Z](tasks/TK-002Z/TASK.md) stages one complete Worker entry/explanation/proof slice. Managed discovery and bundle installation remain release-owned; no successor Task is invented for that gated work.

## Acceptance Criteria

- [ ] Load the assigned Task, its owning Spec and branch, acceptance, write scope and required stance before acting; a Worker has no authority over neighboring Tasks merely because their files are visible.
- [ ] Perform the assigned job, including Task-authoring assistance when dispatched by Spec Planner; implementation work uses red/green TDD and the project verification contract.
- [ ] Keep claims and proof aligned, preserve unrelated changes, and maintain Task-local records as work proceeds; send shared Spec/projection updates to the designated writer.
- [ ] Hand back the exact candidate, verification, documentation changes, risks, remaining gap and merge request to the Dispatcher; one Task attempt per working chat remains the boundary.
- [ ] Keep an interrupted or unsuccessful result recoverable with truthful proof and the next gate. Self-check is part of the Task; no new mandatory per-Task independent-review ceremony is introduced.
- [ ] A fresh agent from integration can discover the operating entry and its individual Wiki article, identify scope, inputs, outputs, hand-back and escalation, and perform the scenario below without private notes.
- [ ] Source behavior, templates, discovery and managed installation agree; named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

A Worker completes one vertical slice on its Task branch, checks its behavior, updates its Task proof and opens a merge request to the Dispatcher branch. The Dispatcher can assess the result without reconstructing the chat.

Exercise the actual configured agent entry and inspect its hand-back and repository state. Routing/string checks support discovery but do not prove role behavior. Include an out-of-scope request, conflicting writer, or unsupported host case appropriate to this capability. Use red/green tests for any runtime behavior changed during implementation.

## Verification Procedure

Run the targeted source/discovery/Wiki checks and the full AGENTS suite for the delivered change. Capture self-drift pre/post receipts and semantic inspection. Demonstrate the scenario in under one minute from its named artifacts, obtain immutable-candidate independent review before integration, and keep owner Human QA separate. This planning record claims none of that implementation proof.

## Documentation Impact

Maintain the role or stance definition in LEXICON.md, the operating contract in the existing source lane, and one individual Wiki article routed through MEMORY.md. Mirror changed portable rules in templates. Cross-capability explanation stays in roles-and-stances.md; do not duplicate live progress there.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Evidence | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-27 | none | Planning only | Owner confirmed ROLE-1 through ROLE-4; no Task allocated or implementation claimed | This Spec and linked role model | Flight launch, Task planning, implementation and behavioral verification remain |

| 2026-10-01 | TK-002Z | Authorized activation and claim | Fresh origin integration 95176a4 was planned/unassigned with no Tasks; native next-id, convert-tasks --activate and claim published 648e00f. Dirty planning/projection paths were committed before claim retry. | Staged boundary recorded; MEMORY hunk reserved for coordinator | Managed identity/install, final suite and independent review remain |
| 2026-10-01 | TK-002Z | Staged source and actual configured-session scenario | Source contract red ENOENT then green; Wiki validation PASS. Scenario candidate 86842675d564b5d0cf98373ba10bdddee560ef1e; four allowed paths only, negative-input red/green, conflicting writer and out-of-scope requests refused, main unchanged and exact local-origin head verified. See tasks/TK-002Z/evidence/scenario.md and scenario.patch at 20bbe95. | Individual skill-worker-role.md; no root/template/managed changes | Explicit loading in one fixture is not managed installation or outcome reliability; no interrupted-process trial |
| 2026-10-01 | TK-002Z | Candidate verification complete; no approval or merge | Full AGENTS/Runbook union 51/51 PASS serially at 89f7593; final-suite.json records commands. Initial 48/51 and transient untracked/parallel-fixture failures preserved, then resolved by committed-tree serial run. Source/scenario inspector and Wiki PASS; guardrail 78/100 pre/post. Raw self-drift receipts preserve seven baseline findings; S-00Q stale claim still blocks clean-update. | Staged entry, individual Wiki, Task evidence; no root/template/managed changes. MEMORY hunk reserved for coordinator. | Separate review, bundle identity/install, MEMORY routing; gh API Forbidden prevents draft PR here. Integration assembly must preserve newer S01C metadata. No installed behavior, owner QA, completion or repeated-outcome claim |
| 2026-10-03 | TK-002Z | Task closed | Full AGENTS suite 48/48 PASS at d920826f (integration 226212f1 merged); tools/test-worker-role.mjs PASS; wiki validate ok; configured-session scenario evidence in tasks/TK-002Z/evidence | MEMORY.md router line for skill-worker-role.md; staged candidate/worker/SKILL.md and skill-worker-role.md from the Task | Managed discovery, bundle identity and installation remain release-owned; installed behavior and repeated outcomes unproved; owner Human QA pending |
| 2026-10-07 | owner-qa | Owner QA: approve at 42431879fab3057db9e26ae661b4e92512c281f0 [69840f8a38cd] #1 | none | Kayden (owner, in chat 2026-10-06: "Human QA passes. I declare it here.") | none |
