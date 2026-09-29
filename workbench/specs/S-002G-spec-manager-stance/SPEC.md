# S-002G - Spec Manager Stance

**Spec ID:** S-002G
**Status:** active
**Priority:** 2
**Owner:** claude-lane-G
**Stance:** Builder
**Updated:** 2026-09-29
**Catalog description:** Dispatch and monitor planned Task work in parallel within one Spec, preserving proof and coordinated hand-back.
**Blockers:** none
**Latest event:** Flight launched 2026-09-29 under the owner's Director-run instruction; Spec Planner cut TK-003G (source entry and bundle proof), TK-003H (routed Wiki article) and TK-003I (fresh-context scenario and assembled proof) from live Actuality at 1450e7a8.
**Next gate:** Close TK-003G and TK-003H with named proof, then TK-003I with the observed scenario and assembled proof; separate-context review before integration.

> **Citation anchors.** pre=`b00a2e338436ef7b281b0cc53e74f891af32f18c` post=`1450e7a834872b370be8d7013499058b57a0c7d7`.

## Outcome

Dispatch and monitor planned Task work in parallel within one Spec, preserving proof and coordinated hand-back.

## Why It Matters

Roles define the scope of responsibility; stances define the job performed within that scope. An agent picking up integration needs a discoverable operating contract, not implicit knowledge from another chat. This Spec delivers only the minimum needed for Spec and Task rollout.

## Current Verified State

At the pre anchor, LEXICON.md defines Director, Dispatcher and Worker; BLUEPRINT.md describes Spec/Task branches and coordination. The manifest ships Reviewer and Auditor stance skills, but no dedicated Spec Manager Stance operating entry. No implementation or agent-outcome proof for this capability is claimed by this planning record.

## Desired Behavior

1. Compose with the Dispatcher role and consume the Spec Planner result, live Task states, dependencies and branch scope rather than inventing a second queue.
2. Dispatch Workers to ready non-conflicting Tasks, monitor their progress and evidence, and release subsequent work as dependencies are actually satisfied.
3. Maintain single-writer ownership for shared state and serialize conflicting edits while allowing independent vertical slices to proceed concurrently.
4. Assess Worker hand-backs, coordinate corrective work and merge requests into the Spec branch, and arrange assembled-Spec verification using appropriate Reviewer or Auditor stance work.
5. Report the fixed candidate and proof to the Director for the integration boundary. Keep the Spec and Task owners current and route cross-Spec issues to the Director; do not silently claim independent approval of work managed in the same context.

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

Cut at flight launch 2026-09-29 from live Actuality: [TK-003G](tasks/TK-003G/TASK.md) ships the source entry with bundle, catalog and installer proof; [TK-003H](tasks/TK-003H/TASK.md) routes the individual Wiki article (independent of TK-003G; parallel group 1); [TK-003I](tasks/TK-003I/TASK.md) observes the fresh-context scenario and assembles the Spec proof (after TK-003G). Shared files (manifest, layout tool, catalog README, count-bearing control sentences, tests, `MEMORY.md`) have one writer, the Dispatcher lane; Workers hand back exact SHAs and proof.

## Acceptance Criteria

- [ ] Compose with the Dispatcher role and consume the Spec Planner result, live Task states, dependencies and branch scope rather than inventing a second queue.
- [ ] Dispatch Workers to ready non-conflicting Tasks, monitor their progress and evidence, and release subsequent work as dependencies are actually satisfied.
- [ ] Maintain single-writer ownership for shared state and serialize conflicting edits while allowing independent vertical slices to proceed concurrently.
- [ ] Assess Worker hand-backs, coordinate corrective work and merge requests into the Spec branch, and arrange assembled-Spec verification using appropriate Reviewer or Auditor stance work.
- [ ] Report the fixed candidate and proof to the Director for the integration boundary. Keep the Spec and Task owners current and route cross-Spec issues to the Director; do not silently claim independent approval of work managed in the same context.
- [ ] A fresh agent from integration can discover the operating entry and its individual Wiki article, identify scope, inputs, outputs, hand-back and escalation, and perform the scenario below without private notes.
- [ ] Source behavior, templates, discovery and managed installation agree; named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

A Dispatcher using Spec Manager launches ready Workers in two independent slices, holds one conflicting write, reads their hand-backs, integrates proven results and reports the assembled candidate with any remaining gap.

Exercise the actual configured agent entry and inspect its hand-back and repository state. Routing/string checks support discovery but do not prove role behavior. Include an out-of-scope request, conflicting writer, or unsupported host case appropriate to this capability. Use red/green tests for any runtime behavior changed during implementation.

## Verification Procedure

Run the targeted source/discovery/Wiki checks and the full AGENTS suite for the delivered change. Capture self-drift pre/post receipts and semantic inspection. Demonstrate the scenario in under one minute from its named artifacts, obtain immutable-candidate independent review before integration, and keep owner Human QA separate. This planning record claims none of that implementation proof.

## Documentation Impact

Maintain the role or stance definition in LEXICON.md, the operating contract in the existing source lane, and one individual Wiki article routed through MEMORY.md. Mirror changed portable rules in templates. Cross-capability explanation stays in roles-and-stances.md; do not duplicate live progress there.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Evidence | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-27 | none | Planning only | Owner confirmed ROLE-1 through ROLE-4; no Task allocated or implementation claimed | This Spec and linked role model | Flight launch, Task planning, implementation and behavioral verification remain |
| 2026-09-29 | planning | Flight launch: Tasks cut and Spec activated | Owner instruction in chat 2026-09-29 ("I want the director and dispatcher roles and stances... Complete those groupings of specs.") assigned through the Director; live Actuality inspected at `1450e7a8`: no `spec-manager` entry in `workbench/skills`, `coreSkills` and `skillPolicy.required` at 22, `tools/test-skill-catalog.mjs` holds five documents to the bundle count with a `words` array ending at eighteen, `tools/test-workbench-layout.mjs` freezes the v3.2.1 row by filtering `grill-me`; TK-003G, TK-003H, TK-003I written with `next-id` and `convert-tasks S-002G --activate`; self-drift pre receipt at `1450e7a8` cleanUpdate false with 8 pre-existing attention findings (2 stale-claim, 5 stale-seed, 1 unverified-provenance); guardrail baseline templates 106.6/113 | This Spec header, slices and Task records | Implementation, scenario, assembled proof and separate-context review remain |
