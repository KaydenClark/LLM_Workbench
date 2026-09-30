# S-002C - Director Role

**Spec ID:** S-002C
**Status:** active
**Priority:** 2
**Owner:** claude-lane-C
**Stance:** Builder
**Updated:** 2026-09-29
**Catalog description:** Coordinate the whole project across Spec-bound Dispatchers and integrate independently reviewed results.
**Blockers:** none
**Latest event:** TK-002X claimed by claude-lane-C.
**Next gate:** Close TK-002X with verification and documentation proof.

> **Citation anchors.** pre=`b00a2e338436ef7b281b0cc53e74f891af32f18c` post=`d2d8e3cf3761a3afacd6d620e3e78331615f19a1`.

## Outcome

Coordinate the whole project across Spec-bound Dispatchers and integrate independently reviewed results.

## Why It Matters

Roles define the scope of responsibility; stances define the job performed within that scope. An agent picking up integration needs a discoverable operating contract, not implicit knowledge from another chat. This Spec delivers only the minimum needed for Spec and Task rollout.

## Current Verified State

At the pre anchor, LEXICON.md defines Director, Dispatcher and Worker; BLUEPRINT.md describes Spec/Task branches and coordination. The manifest ships Reviewer and Auditor stance skills, but no dedicated Director Role operating entry. No implementation or agent-outcome proof for this capability is claimed by this planning record.

## Desired Behavior

1. Load the project controls and current integration state, recover accepted decisions and open gates from tracked owners, and identify the assigned Specs without relying on a local chat or private memory.
2. Assign one Spec and its branch to each Dispatcher; coordinate cross-Spec dependencies and shared writer ownership so independent lanes can progress in parallel.
3. Monitor Dispatcher reports, resolve coordination issues within the project assignment, and escalate genuine owner choices with evidence rather than re-asking settled questions.
4. Arrange the independent review of immutable assembled candidates and coordinate their merge requests into integration. Neither a Dispatcher nor an implementing Worker may supply independent approval of its own candidate.
5. Keep accepted decisions, progress, branch/candidate references and remaining gates in the existing tracked owners on integration through reviewed changes. Owner Human QA and integration-to-main promotion remain owner acts.

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

Cut at flight launch on 2026-09-29 from Actuality at `1450e7a8`: the manifest `skillPolicy.required` then held twenty-two skills ending in the four stances, `workbench/tools/workbench-layout.mjs` exported the same `coreSkills`, `tools/test-skill-catalog.mjs` derived every documented bundle count from that export, and no `director` entry or article existed. Two complete-path slices, executed in order because the second documents and exercises the text the first delivers.

S-002D and S-002F landed first and set the shared-file convention this Spec conforms to at the post anchor: role and coordination entries form the exported `coordinationSkills` group in `workbench/tools/workbench-layout.mjs`, placed between the workflow skills and the four portable stances, and the tests derive every bundle count and frozen row from that group. The flight-launch `roleSkills` design in TK-002X is superseded by it: `director` leads the group as the top role (`['director', 'dispatcher', 'spec-planner']`), and the bundle counts 25.

- [TK-002X](tasks/TK-002X/TASK.md): the `workbench/skills/director/SKILL.md` entry in the four-section stance shape, registered in the layout export (leading `coordinationSkills`), the manifest, the catalog table and bundle sentence, with the count and position pins held through red/green.
- [TK-002Y](tasks/TK-002Y/TASK.md): `workbench/wiki/skill-director.md` routed from the "Roles And Stances" section of the Wiki router, plus the fresh-context coordination scenario from Testing Seams run in a disposable fixture room and handed back for this evidence log.

Shared files (manifest, catalog README, router, tests) have one writer per slice and the Dispatcher remains the single writer of this Spec, its Task records and the rendered projections. S-002G, the last sibling to land, extends the same group, bundle sentence and router section and owns the cross-link pass among the role and stance entries.

## Acceptance Criteria

- [ ] Load the project controls and current integration state, recover accepted decisions and open gates from tracked owners, and identify the assigned Specs without relying on a local chat or private memory.
- [ ] Assign one Spec and its branch to each Dispatcher; coordinate cross-Spec dependencies and shared writer ownership so independent lanes can progress in parallel.
- [ ] Monitor Dispatcher reports, resolve coordination issues within the project assignment, and escalate genuine owner choices with evidence rather than re-asking settled questions.
- [ ] Arrange the independent review of immutable assembled candidates and coordinate their merge requests into integration. Neither a Dispatcher nor an implementing Worker may supply independent approval of its own candidate.
- [ ] Keep accepted decisions, progress, branch/candidate references and remaining gates in the existing tracked owners on integration through reviewed changes. Owner Human QA and integration-to-main promotion remain owner acts.
- [ ] A fresh agent from integration can discover the operating entry and its individual Wiki article, identify scope, inputs, outputs, hand-back and escalation, and perform the scenario below without private notes.
- [ ] Source behavior, templates, discovery and managed installation agree; named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

Two Dispatchers advance different Specs; one needs a shared artifact changed. The Director assigns its writer, permits the independent work, routes candidate review, and records the dependency and result so a fresh agent on integration can continue.

Exercise the actual configured agent entry and inspect its hand-back and repository state. Routing/string checks support discovery but do not prove role behavior. Include an out-of-scope request, conflicting writer, or unsupported host case appropriate to this capability. Use red/green tests for any runtime behavior changed during implementation.

## Verification Procedure

Run the targeted source/discovery/Wiki checks and the full AGENTS suite for the delivered change. Capture self-drift pre/post receipts and semantic inspection. Demonstrate the scenario in under one minute from its named artifacts, obtain immutable-candidate independent review before integration, and keep owner Human QA separate. This planning record claims none of that implementation proof.

## Documentation Impact

Maintain the role or stance definition in LEXICON.md, the operating contract in the existing source lane, and one individual Wiki article routed through MEMORY.md. Mirror changed portable rules in templates. Cross-capability explanation stays in roles-and-stances.md; do not duplicate live progress there.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Evidence | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-27 | none | Planning only | Owner confirmed ROLE-1 through ROLE-4; no Task allocated or implementation claimed | This Spec and linked role model | Flight launch, Task planning, implementation and behavioral verification remain |
| 2026-09-29 | planning | Flight launch: Tasks cut and Spec activated | Owner instruction in chat: "I want the director and dispatcher roles and stances. That is how large this run should be. Complete those groupings of specs." Director assigned S-002C to Lane C (landing first of S-002C, S-002D, S-002F, S-002G). Actuality inspected at `1450e7a8`: manifest and layout export agree on twenty-two skills; catalog test derives counts from the export; no director entry or article. IDs from `next-id` on the tree: TK-002X, TK-002Y. `convert-tasks S-002C --activate` flipped Status only; header, post anchor and slices section written in the same commit. Read-only self-drift pre receipt at `1450e7a8`: cleanUpdate false with the eight pre-existing attention findings (two stale-claim, five stale-seed, one unverified-provenance); guardrail baseline templates 106.6/113 (Team coordination missing) | This Spec and the two Task records | Implementation, scenario, assembled proof and separate-context review remain |
| 2026-09-30 | TK-002X | Worker attempt 1 reviewed as Dispatcher input | Owner rules the same day (Director run 2026-09-29): a dead Worker's pushed Task branch is Dispatcher input with no owner approval needed, and incomplete work gets a new attempt of the same Task on the same branch. Attempt 1's chat ended at a usage limit after it pushed `claude/s-002c-tk-002x-director-skill` at `c952d7b2`, cut from this Spec branch at `2441ed96`. Dispatcher review against this Task's acceptance: the entry has the four sections, the authority and no-spawn sentences and the five obligations; the manifest, layout export, catalog table, bundle sentence and three count literals agreed at 23 through a `roleSkills` export. Gaps named for attempt 2: no red was recorded (test and entry landed in one commit), the full suite was never run, the `roleSkills` shape conflicts with the `coordinationSkills` convention S-002D and S-002F landed on `integration`, and the entry should name the landed siblings by skill name rather than by role alone | None beyond the attempt's diff | Attempt 2 reconciles to the convention, records a red and runs the suite |
| 2026-09-30 | assembly | Integration merge into the Spec branch | Merged `origin/integration` `d2d8e3cf` (S-002D PRs #214 and #215, S-002F PRs #216 and #217, ADR and ledger PRs #211 to #213) as `a6ca3f74`; the only conflicts were the generated `TASKBOARD.md` and `workbench/specs/CATALOG.md`, resolved by `render`. `doctor` reports no blocking finding and no ID collision; `tools/test-visible-ids.mjs` passes. TK-002X and TK-002Y appear on `integration` only as superseded IDs named in S-002D and S-002F history rows; no Task folder there uses them, so they stay. The Vertical Implementation Slices text now records that the convention supersedes the flight-launch `roleSkills` design, and the post anchor moves to `d2d8e3cf` | This Spec's slices section and anchors | TK-002X attempt 2, TK-002Y, assembled proof and review remain |
| 2026-09-30 | TK-002X | Worker attempt 2 reviewed and taken into the Spec branch | A fresh Worker, same Task and branch, merged the Spec branch `a6ca3f74` into the Task branch as `b143fc49` and resolved the shared files to the convention: `coordinationSkills = ['director', 'dispatcher', 'spec-planner']` with `roleSkills` removed, `director` first of the group before `builder` in `skillPolicy.required`, the skills README row before `dispatcher` and the sentence "closed 25-skill bundle (eighteen workflow skills, three coordination skills and four portable stances)", the LEXICON Core skill bundle row "three coordination skills", and number-only counts of 25 in `README.md`, `RUNBOOK.md`, `templates/GENESIS.md` and `workbench/wiki/skill-genesis.md`. The catalog pin "dispatcher leads the coordination entries" became "director leads" plus "dispatcher follows the director"; the group-adjacency and "spec-planner sits immediately before builder" pins and both frozen v3.2.1 filters are unchanged. `cdf9c53b` names the landed `dispatcher` and `spec-planner` entries by skill name and the Worker by its LEXICON term, cites no Spec path, and rewraps long lines while keeping every pinned phrase on one line. Red: the final `tools/test-skill-catalog.mjs` alone in a throwaway worktree at `a6ca3f74` exits 1 with `director is counted as a coordination entry` (C-tk002x-a2-red.txt). Green at `cdf9c53b`: test-skill-catalog, test-workbench-layout, test-core-skill-installer, test-skills-lane, test-delivery-skills, test-cross-provider-fixture, test-control-fidelity, test-controls-vocabulary-sweep and test-skill-inspection pass, doctor no blocking finding, full AGENTS suite 48/48 with first line `dirty: []` (C-tk002x-a2-cdf9c53.log, Dispatcher scratchpad outside the repository). Dispatcher review against the Task's acceptance and the convention: passed. The Spec branch fast-forwarded to `cdf9c53b`, so the Task branch is an ancestor | Entry, skills README, manifest, layout export, catalog pins, LEXICON Core skill bundle row and the number-only counts | Obligation 2 records dependencies in the owning Spec, whose single writer is its Dispatcher; the scenario checks how that reads in practice |
