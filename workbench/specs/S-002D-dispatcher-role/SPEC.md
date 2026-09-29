# S-002D - Dispatcher Role

**Spec ID:** S-002D
**Status:** active
**Priority:** 2
**Owner:** claude-lane-D
**Stance:** Builder
**Updated:** 2026-09-29
**Catalog description:** Coordinate planning, parallel Task delivery and assembled verification within one assigned Spec and its branch.
**Blockers:** none
**Latest event:** TK-003B claimed by claude-lane-D.
**Next gate:** Close TK-003B with verification and documentation proof.

> **Citation anchors.** pre=`b00a2e338436ef7b281b0cc53e74f891af32f18c` post=`1450e7a834872b370be8d7013499058b57a0c7d7`.

## Outcome

Coordinate planning, parallel Task delivery and assembled verification within one assigned Spec and its branch.

## Why It Matters

Roles define the scope of responsibility; stances define the job performed within that scope. An agent picking up integration needs a discoverable operating contract, not implicit knowledge from another chat. This Spec delivers only the minimum needed for Spec and Task rollout.

## Current Verified State

At the pre anchor, LEXICON.md defines Director, Dispatcher and Worker; BLUEPRINT.md describes Spec/Task branches and coordination. The manifest ships Reviewer and Auditor stance skills, but no dedicated Dispatcher Role operating entry. No implementation or agent-outcome proof for this capability is claimed by this planning record.

## Desired Behavior

1. Load one assigned Spec and its branch, Task state, dependencies and relevant controls; preserve the boundary against neighboring Specs.
2. Compose Spec Planner, Spec Manager, Reviewer or Auditor as the job requires while retaining the Dispatcher scope and existing authority.
3. Dispatch Workers for compatible bounded assignments and keep one durable writer for shared Spec/projection state; parallel Workers return proof to that writer.
4. Own the Spec-level integration of Task results and whole-Spec verification, whether performed directly or delegated; report the assembled immutable candidate, evidence, gaps and merge request to the Director.
5. Use Task branch to Spec branch merge requests as the normal containment route, then Spec branch to integration under Director coordination. Obey the current rollout exception until its existing owner retires it; a stance change does not waive independent review.

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

Two record-backed Tasks, cut at flight launch on 2026-09-29 from live Actuality and grouped as one safe parallel pair because their file sets are disjoint. The Dispatcher (Lane D) is the single writer of this Spec, its TASK records and the rendered projections; Workers hand back exact SHAs and proof.

- [TK-003A](tasks/TK-003A/TASK.md): the operating entry `workbench/skills/dispatcher/SKILL.md` with its manifest, layout, catalog, installer and count consumers, red/green at the existing catalog and layout test seams.
- [TK-003B](tasks/TK-003B/TASK.md): the routed article `workbench/wiki/skill-dispatcher.md`, its MEMORY.md route, and the fresh-context scenario from Testing Seams recorded with its limits.

## Acceptance Criteria

- [ ] Load one assigned Spec and its branch, Task state, dependencies and relevant controls; preserve the boundary against neighboring Specs.
- [ ] Compose Spec Planner, Spec Manager, Reviewer or Auditor as the job requires while retaining the Dispatcher scope and existing authority.
- [ ] Dispatch Workers for compatible bounded assignments and keep one durable writer for shared Spec/projection state; parallel Workers return proof to that writer.
- [ ] Own the Spec-level integration of Task results and whole-Spec verification, whether performed directly or delegated; report the assembled immutable candidate, evidence, gaps and merge request to the Director.
- [ ] Use Task branch to Spec branch merge requests as the normal containment route, then Spec branch to integration under Director coordination. Obey the current rollout exception until its existing owner retires it; a stance change does not waive independent review.
- [ ] A fresh agent from integration can discover the operating entry and its individual Wiki article, identify scope, inputs, outputs, hand-back and escalation, and perform the scenario below without private notes.
- [ ] Source behavior, templates, discovery and managed installation agree; named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

A Spec has two independent vertical slices and a shared contract file. The Dispatcher plans the slices, assigns the shared writer, runs compatible Workers concurrently, accumulates their results, verifies the Spec and hands the candidate to the Director.

Exercise the actual configured agent entry and inspect its hand-back and repository state. Routing/string checks support discovery but do not prove role behavior. Include an out-of-scope request, conflicting writer, or unsupported host case appropriate to this capability. Use red/green tests for any runtime behavior changed during implementation.

## Verification Procedure

Run the targeted source/discovery/Wiki checks and the full AGENTS suite for the delivered change. Capture self-drift pre/post receipts and semantic inspection. Demonstrate the scenario in under one minute from its named artifacts, obtain immutable-candidate independent review before integration, and keep owner Human QA separate. This planning record claims none of that implementation proof.

## Documentation Impact

Maintain the role or stance definition in LEXICON.md, the operating contract in the existing source lane, and one individual Wiki article routed through MEMORY.md. Mirror changed portable rules in templates. Cross-capability explanation stays in roles-and-stances.md; do not duplicate live progress there.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Evidence | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-27 | none | Planning only | Owner confirmed ROLE-1 through ROLE-4; no Task allocated or implementation claimed | This Spec and linked role model | Flight launch, Task planning, implementation and behavioral verification remain |
| 2026-09-29 | planning | Flight launch: Tasks cut and Spec activated | TK-003A and TK-003B written from live Actuality at 1450e7a8 (this Spec, LEXICON role and stance rows, AGENTS Assigned Work And Stances and Git Rules, RUNBOOK Role And Stance Coordination, ADR-000P, roles-and-stances.md, ledger ROLE-1 to ROLE-4, the skill contract in workbench/skills/auditor/SKILL.md and tools/test-skill-catalog.mjs, tools/test-workbench-layout.mjs, tools/test-skills-lane.mjs); `convert-tasks S-002D --activate` flipped Status; self-drift pre receipt and guardrail baseline captured at 1450e7a8 outside the repository | This Spec and its two TASK records | Implementation, scenario proof, separate-context review and integration delivery remain |
