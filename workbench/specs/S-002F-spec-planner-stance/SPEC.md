# S-002F - Spec Planner Stance

**Spec ID:** S-002F
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-27
**Catalog description:** Plan small Tasks and parallel vertical slices for one Spec from current Actuality when its flight launches.
**Blockers:** none for specification; implementation awaits flight launch and assignment.
**Latest event:** Owner confirmed the minimum role/stance buildout; this Spec records one capability without cutting Tasks.
**Next gate:** At flight launch, inspect live Actuality and plan small Tasks within this Spec.

> **Citation anchors.** pre=`b00a2e338436ef7b281b0cc53e74f891af32f18c` post=`b00a2e338436ef7b281b0cc53e74f891af32f18c`.

## Outcome

Plan small Tasks and parallel vertical slices for one Spec from current Actuality when its flight launches.

## Why It Matters

Roles define the scope of responsibility; stances define the job performed within that scope. An agent picking up integration needs a discoverable operating contract, not implicit knowledge from another chat. This Spec delivers only the minimum needed for Spec and Task rollout.

## Current Verified State

At the pre anchor, LEXICON.md defines Director, Dispatcher and Worker; BLUEPRINT.md describes Spec/Task branches and coordination. The manifest ships Reviewer and Auditor stance skills, but no dedicated Spec Planner Stance operating entry. No implementation or agent-outcome proof for this capability is claimed by this planning record.

## Desired Behavior

1. Operate as a stance composed with an already assigned Dispatcher role: the role supplies scope and dispatch responsibility; the stance supplies planning method and obligations.
2. At flight launch/Spec activation, inspect live source, accepted requirements, remaining gaps and dependencies before cutting Tasks. Do not enumerate execution Tasks when merely authoring a planned Spec.
3. Group small Tasks into complete-path vertical slices with explicit acceptance, proof, dependencies and writer ownership; expose which groups can run concurrently within the Spec.
4. Use Workers to help author bounded Tasks when useful, reconcile their drafts as the designated Spec writer, and preserve the difference between a proposed Task and an executable assignment.
5. Hand the plan and its open gates to the Dispatcher using Spec Manager. Surface cross-Spec dependencies to the Director rather than enlarging the Spec boundary or duplicating another lane.

## Decisions And Contracts

- Owner-confirmed role/stance and minimum-scope decisions are recorded in the [role model](../../wiki/design-concepts/roles-and-stances.md) and the [destination ledger](../../wiki/grilling-destination-audit-ledger.json), family ROLE. Definitions belong to LEXICON.md; operating boundaries belong to AGENTS.md and procedures to RUNBOOK.md.
- Deliver a repository-owned operating entry discoverable through the existing skills lane/adapters and an individual routed Wiki explanation. Its form must obey the existing skill contract; adding a required core entry or changing managed bytes requires the normal bundle/version/install proof at implementation time, not an unstamped addition during planning.
- Role scope composes with assigned stance; neither grants authority beyond the request and project controls. Reviewer/Auditor stance adoption alone never makes a prior participant independent.
- GPT_OS Captain, Planner and Engineer informed the model as examples, not copied policy. Do not import model allocation, scheduling, permanent departments or an external repository prerequisite.
- Reuse existing Reviewer and Auditor capability owners. Preserve existing Tasks and proof; cut no new execution Task in this planning change.

## Non-Goals

Full role taxonomy, portfolio scheduling, a generalized multi-Spec Dispatcher, automatic flight launch, new model/provider policy, changing owner Human QA, main promotion, implementing another capability or changing unrelated rooms.

## Dependencies And Blockers

Coordinate shared controls, discovery and branch procedure with [Workflow Canon Rework](../S-00P-workflow-canon-rework/SPEC.md). The [release owner](../S-00O-workbench-v4-0-0-release/SPEC.md) retains the Task-PR rollout exception and delivery-versus-closure gates. This planning scope neither claims their Tasks nor closes their gaps. Dispatching requires a configured host that supports it; report a missing capability rather than inventing an API.

## Vertical Implementation Slices

No Tasks cut. At flight launch/Spec activation, use current Actuality to plan small complete-path slices and safe parallel groups. The empty tasks directory keeps this planned capability record-backed.

## Acceptance Criteria

- [ ] Operate as a stance composed with an already assigned Dispatcher role: the role supplies scope and dispatch responsibility; the stance supplies planning method and obligations.
- [ ] At flight launch/Spec activation, inspect live source, accepted requirements, remaining gaps and dependencies before cutting Tasks. Do not enumerate execution Tasks when merely authoring a planned Spec.
- [ ] Group small Tasks into complete-path vertical slices with explicit acceptance, proof, dependencies and writer ownership; expose which groups can run concurrently within the Spec.
- [ ] Use Workers to help author bounded Tasks when useful, reconcile their drafts as the designated Spec writer, and preserve the difference between a proposed Task and an executable assignment.
- [ ] Hand the plan and its open gates to the Dispatcher using Spec Manager. Surface cross-Spec dependencies to the Director rather than enlarging the Spec boundary or duplicating another lane.
- [ ] A fresh agent from integration can discover the operating entry and its individual Wiki article, identify scope, inputs, outputs, hand-back and escalation, and perform the scenario below without private notes.
- [ ] Source behavior, templates, discovery and managed installation agree; named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

At launch a Dispatcher using Spec Planner inspects the current Spec, assigns two Workers to help draft independent slices, reconciles shared-file ownership and publishes the small executable Task groups for Spec Manager.

Exercise the actual configured agent entry and inspect its hand-back and repository state. Routing/string checks support discovery but do not prove role behavior. Include an out-of-scope request, conflicting writer, or unsupported host case appropriate to this capability. Use red/green tests for any runtime behavior changed during implementation.

## Verification Procedure

Run the targeted source/discovery/Wiki checks and the full AGENTS suite for the delivered change. Capture self-drift pre/post receipts and semantic inspection. Demonstrate the scenario in under one minute from its named artifacts, obtain immutable-candidate independent review before integration, and keep owner Human QA separate. This planning record claims none of that implementation proof.

## Documentation Impact

Maintain the role or stance definition in LEXICON.md, the operating contract in the existing source lane, and one individual Wiki article routed through MEMORY.md. Mirror changed portable rules in templates. Cross-capability explanation stays in roles-and-stances.md; do not duplicate live progress there.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Evidence | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-27 | none | Planning only | Owner confirmed ROLE-1 through ROLE-4; no Task allocated or implementation claimed | This Spec and linked role model | Flight launch, Task planning, implementation and behavioral verification remain |
