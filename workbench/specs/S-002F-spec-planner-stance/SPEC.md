# S-002F - Spec Planner Stance

**Spec ID:** S-002F
**Status:** active
**Priority:** 2
**Owner:** claude-lane-F
**Stance:** Builder
**Updated:** 2026-09-29
**Catalog description:** Plan small Tasks and parallel vertical slices for one Spec from current Actuality when its flight launches.
**Blockers:** none.
**Latest event:** TK-003E claimed by claude-lane-F.
**Next gate:** Close TK-003E with verification and documentation proof.

> **Citation anchors.** pre=`b00a2e338436ef7b281b0cc53e74f891af32f18c` post=`1450e7a834872b370be8d7013499058b57a0c7d7`.

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

Record-backed: each slice is a `tasks/<TK-####>/TASK.md`, cut at flight launch on 2026-09-29 from Actuality at the post anchor. Group 1 runs concurrently: [TK-003D](tasks/TK-003D/TASK.md) ships the `spec-planner` core entry with its bundle proof (writer of the skill source, layout bundle, manifest, catalog, count wording and catalog test) and [TK-003E](tasks/TK-003E/TASK.md) routes the individual Wiki article (writer of the article and the `MEMORY.md` router line). Group 2, [TK-003F](tasks/TK-003F/TASK.md), waits on both: it runs the Testing Seams scenario with a fresh-context agent in a fixture room outside the repository and assembles the Spec proof. The Dispatcher is the single writer of this Spec, its Task records and the projections; cross-lane shared files (`workbench/manifest.json`, `workbench/skills/README.md`, `workbench/wiki/MEMORY.md`, the count-bearing tests) are reconciled by this lane at rebase per the Director's landing order S-002C, S-002D, S-002F, S-002G.

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
| 2026-09-29 | planning | Flight launch: Spec Planner cut TK-003D, TK-003E, TK-003F | Live Actuality inspected at `1450e7a8`: LEXICON Spec Planner/Dispatcher/Worker rows, AGENTS Assigned Work And Stances and Git Rules, RUNBOOK Role And Stance Coordination, ADR-000P, ADR-0036, the role model article, ledger ROLE-1 to ROLE-4, the skill contract (`workbench/skills/auditor/SKILL.md`, `workbench/skills/README.md`, `tools/test-skill-catalog.mjs`, `tools/test-delivery-skills.mjs`, `tools/test-core-skill-installer.mjs`, `tools/test-skills-lane.mjs`, `workbench/tools/workbench-layout.mjs`) and the 2026-09-26 Director roster as evidence of the job. IDs from `next-id`; `convert-tasks S-002F --activate` run once; self-drift pre receipt at `1450e7a8` (`cleanUpdate` false, eight pre-existing findings: two stale-claim, five stale-seed, one unverified-provenance) and guardrail baseline templates 106.6/113 (only Team coordination missing) kept in the lane scratchpad | This Spec header, slices section and three Task records | Delivery of all three Tasks, assembled suite, scenario proof, separate-context review and reviewed merge remain |
