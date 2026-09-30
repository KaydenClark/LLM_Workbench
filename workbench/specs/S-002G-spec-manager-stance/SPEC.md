# S-002G - Spec Manager Stance

**Spec ID:** S-002G
**Status:** active
**Priority:** 2
**Owner:** claude-lane-G
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Dispatch and monitor planned Task work in parallel within one Spec, preserving proof and coordinated hand-back.
**Blockers:** none
**Latest event:** TK-003G closed with proof.
**Next gate:** Complete TK-003H.

> **Citation anchors.** pre=`b00a2e338436ef7b281b0cc53e74f891af32f18c` post=`ac6fadbcd97abf8a9d502e0b724bfba7d98b6c6f`.

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

Cut at flight launch 2026-09-29 from live Actuality: [TK-003G](tasks/TK-003G/TASK.md) ships the source entry with bundle, catalog and installer proof; [TK-003H](tasks/TK-003H/TASK.md) routes the individual Wiki article (independent of TK-003G; parallel group 1); [TK-003I](tasks/TK-003I/TASK.md) observes the fresh-context scenario and assembles the Spec proof (after TK-003G). Shared files (manifest, layout tool, catalog README, count-bearing control sentences, tests, `MEMORY.md`) have one writer, the Dispatcher lane; Workers hand back exact SHAs and proof. After S-002C, S-002D and S-002F landed, the cross-link pass among the four role and stance entries and articles, assigned to this Spec as the last of the group, is folded into TK-003G (shipped entries) and TK-003H (Wiki articles), link-only.

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
| 2026-09-30 | assembly | Integration merge and cross-link pass folded into the Tasks | A dedicated Dispatcher for this Spec, assigned by the Director under the owner's 2026-09-29 run instruction and operating rules (one Spec at a time; Workers are one attempt), merged `origin/integration` `ac6fadbc` (S-002D PRs #214 and #215, S-002F #216 and #217, S-002C #218 and #219) into the Spec branch as `d6b4990f`; only the two projections conflicted and were re-rendered. Re-checked against that tip: `coordinationSkills` is `['director', 'dispatcher', 'spec-planner']`, `skillPolicy.required` holds the group immediately before `builder`, the bundle reads 25 (eighteen workflow skills, three coordination skills and four portable stances), `tools/test-skill-catalog.mjs` pins spec-planner immediately before builder and holds two Spec paths in the spec-planner entry, and the dispatcher and spec-planner entries plus the three sibling articles cite sibling capabilities by repository Spec path (S-002F's scenario found those paths absent in an installed room and routed the fix here). The cross-link pass is folded into TK-003G and TK-003H; the citation post anchor moves to `ac6fadbc` | This Spec's slices section and anchors; TK-003G and TK-003H Required Behavior and Boundaries | All three Tasks, the scenario, assembled proof and separate-context review remain |
| 2026-09-30 | TK-003G | Task closed | Red ccb611b6: node tools/test-skill-catalog.mjs exits 1 with 'spec-manager must be a declared core skill' (G-tk003g-red.txt). Green c8cb2cac and b2f42d6d: test-skill-catalog, test-workbench-layout, test-delivery-skills, test-core-skill-installer, test-skills-lane, test-cross-provider-fixture, test-skill-inspection and test-control-fidelity exit 0; doctor no blocking finding; full AGENTS suite 48/48 at b2f42d6d, first line dirty [] (G-tk003g-b2f42d6.log). Dispatcher review re-read the diff against every Required Behavior clause and re-ran test-skill-catalog, test-workbench-layout, test-workbench-tools and test-wiki at the merged Spec tip 09b35bfb (all exit 0); merged as 41582c22 | workbench/skills/spec-manager/SKILL.md (new); workbench/skills/README.md row and 26-skill bundle sentence; manifest skillPolicy.required; workbench-layout coordinationSkills and its comment; one-number counts in README.md, RUNBOOK.md, templates/GENESIS.md, LEXICON.md Core skill bundle row and workbench/wiki/skill-genesis.md; link-only sibling-name edits in workbench/skills/dispatcher/SKILL.md and workbench/skills/spec-planner/SKILL.md; catalog pins moved from Spec paths to skill names | Root-control Spec Manager wording beyond the pinned counts routed to S-00P; the spec-planner entry still cites the ADR-000P and role-model paths, which are repository-only and outside this Spec's Spec-path scope |
