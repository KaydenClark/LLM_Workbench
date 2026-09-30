# S-002D - Dispatcher Role

**Spec ID:** S-002D
**Status:** active
**Priority:** 2
**Owner:** claude-lane-D
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Coordinate planning, parallel Task delivery and assembled verification within one assigned Spec and its branch.
**Blockers:** none
**Latest event:** TK-003A closed with proof.
**Next gate:** Complete TK-003B.

> **Citation anchors.** pre=`b00a2e338436ef7b281b0cc53e74f891af32f18c` post=`0f80049ce1570c04460a3315374d5e558241c71e`.

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

- [x] Load one assigned Spec and its branch, Task state, dependencies and relevant controls; preserve the boundary against neighboring Specs.
- [x] Compose Spec Planner, Spec Manager, Reviewer or Auditor as the job requires while retaining the Dispatcher scope and existing authority.
- [x] Dispatch Workers for compatible bounded assignments and keep one durable writer for shared Spec/projection state; parallel Workers return proof to that writer.
- [x] Own the Spec-level integration of Task results and whole-Spec verification, whether performed directly or delegated; report the assembled immutable candidate, evidence, gaps and merge request to the Director.
- [x] Use Task branch to Spec branch merge requests as the normal containment route, then Spec branch to integration under Director coordination. Obey the current rollout exception until its existing owner retires it; a stance change does not waive independent review.
- [x] A fresh agent from integration can discover the operating entry and its individual Wiki article, identify scope, inputs, outputs, hand-back and escalation, and perform the scenario below without private notes.
- [x] Source behavior, templates, discovery and managed installation agree; named verification and remaining limitations are recorded without claiming owner approval.

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
| 2026-09-29 | TK-003A | Worker attempt 1 reviewed and taken into the Spec branch | The Worker's chat ended after it pushed `claude/s-002d-tk-002x-entry` at `3cf9880b`. That branch was cut from the superseded `14c92156` plan, and its commit messages carry the retired ID TK-002X. Dispatcher review against this Task's acceptance: red `fc0422ae` (a new `tools/test-skill-catalog.mjs` S-002D block) failed at `14c92156` with ENOENT on `workbench/skills/dispatcher/SKILL.md`. Green `3cf9880b` delivers the entry with the same words as the content brief (only a line rewrap that the catalog assertion forced), `dispatcher` before `builder` in `skillPolicy.required`, `coordinationSkills` exported from `workbench/tools/workbench-layout.mjs`, both frozen v3.2.1 filters in `tools/test-workbench-layout.mjs` excluding the group, the README table row and the four pinned counts. The Worker's full AGENTS suite was 48/48 at `3cf9880b`, first line `dirty: []` (log `D-tk002x-3cf9880.log` in the ignored `workbench/sessions/recovery/director-2026-09-29/logs/`). Passed review. The commits were cherry-picked as `b700712e` and `c2098e83` rather than merged: merging would have carried the superseded TK-002X/TK-002Y evidence row, which `tools/check-append-only.py` would read as first-published and so flag this row set as a rewrite | Entry, skills README, manifest, layout and the pinned counts in README, RUNBOOK, LEXICON and templates/GENESIS | The Worker branch is not an ancestor of this Spec branch, so `git branch -d` cannot clean it up after delivery |
| 2026-09-29 | TK-003B | Worker attempt 1 reviewed and taken into the Spec branch | The Worker's chat ended after it pushed `claude/s-002d-tk-002y-article` at `d49a4e8a`, cut from `14c92156`. It adds `workbench/wiki/skill-dispatcher.md` and one Roles And Stances route in `workbench/wiki/MEMORY.md`, and runs scenario 1: one fresh-context general-purpose agent received the owner quote, the content-brief skill text and a scripted Director assignment for FX1 in a disposable fixture pinned at `e19a2652`, which held two slices, one shared `src/contract.json` and a neighbouring FX2 lure. The agent reported that it had no tool for starting Workers and ran both Tasks sequentially on Task branches. It wrote the contract once on the Spec branch (`eeb4a0e`), left FX2 untouched (empty diff, no third key) and routed FX2 to the Director. It got a separate-context `codex exec` verdict, and `node test/run.js` passed 5/0. The Worker's suite was 48/48 at `d49a4e8a` with `dirty: []` (log `D-tk002y-d49a4e8.log`). Passed review, and the commit was cherry-picked as `6610ccc0` for the reason in the TK-003A row | Article and its MEMORY.md route | Concurrent Workers were not exercised in scenario 1. See the scenario 2 row |
| 2026-09-29 | assembly | Integration merge and reconciliation of the shared files | Merged `origin/integration` `0f80049c` with no conflict. Reconcile commit `e80b448f`: the bundle sentence is now "eighteen workflow skills, one coordination skill and four portable stances" in `workbench/skills/README.md` and the LEXICON Core skill bundle row, named after the exported `coordinationSkills` group. `workbench/wiki/skill-genesis.md` now counts 23 core skills. The article links the landed entry and records the text delta. Shape set for S-002C, S-002F and S-002G: append the name to `coordinationSkills` in `workbench/tools/workbench-layout.mjs` and put it before `builder` in the manifest. Add a README row before `builder`, and change only the count words in README.md, RUNBOOK.md, templates/GENESIS.md, the LEXICON row, the skills README sentence and skill-genesis.md. The tests derive the rest. Checked on `e80b448f`: `test-skill-catalog`, `test-control-fidelity`, `test-controls-vocabulary-sweep`, `test-delivery-skills`, `test-wiki`, `test-skills-lane`, `test-core-skill-installer` and `test-workbench-dogfood` pass, and `wiki.mjs validate` is ok | skills README, LEXICON Core skill bundle row, skill-genesis.md, skill-dispatcher.md | `skill-grill-me.md` keeps its dated 2026-09-26 "twenty-two skills" statement as history |
| 2026-09-29 | TK-003B | Fresh-context scenario 2, run by the Dispatcher | Scenario 1's agent ran two agent levels deep, so the Dispatcher reran the scenario one level higher with the same prompt shape. It used the landed entry text (sha256 `51ad285d`), the owner quote, a scripted Director assignment and a fresh copy of the fixture at pin `e19a2652`, and ran one general-purpose agent in one run. The agent recorded itself as the single writer of the Spec, both Task records and the contract, and registered both names in the contract (`de04627`) before any Worker started. It ran two Workers at the same time in separate worktrees; each commit carries the same second and touches only its own module (`d750549` `src/slice-a.js`, `e77aa00` `src/slice-b.js`). It merged both into `spec/fx1` (`a576371`, `72420df`) and closed the records (`6c96019`). A separate-context helper review passed with two low findings, which the agent fixed by appending rows (`19a159f`), and two further reviews passed. Checked independently afterwards: the tree is clean, `main` is still at the pin, the diff under `SPEC-FX2/` is 0 bytes, the contract lists only the two modules, and `node test/run.js` passes 5/5. The hand-back gave the candidate, per-Task proof, the tally, where the logs are, both review rounds, "no merge request" with the reason (no remote), leftover branches, FX2 routed to the Director, and no permission refusals. The agent reported one incident itself: its review helper wrote temporary exports outside the room and then deleted them | Article "Verified behavior and limits" | One model and a scripted Director and owner, with host default instructions present. The fixture is not a Workbench room, so claim, close, render, doctor, manifest resolution and the bootstrap-exception lookup were not exercised. Worker attribution is inferred from files and timestamps because every commit has one author. Not a controlled trial, and no owner approval or agent-outcome improvement is claimed |
| 2026-09-29 | assembly | Gates before close | The full AGENTS suite passed 48/48 on the committed candidate `c5beb7f2`, first line `dirty: []` (Dispatcher scratch log `D-s-002d-c5beb7f.log`, outside the repository). The guardrail result at `c5beb7f2` is byte-identical to the baseline at `0f80049c`: templates score 106.6/113, and the only area with missing evidence is Team coordination (manager and subagent instructions). Self-drift pre at `0f80049c` and post at `c5beb7f2` were both `blocked` with `cleanUpdate` false and the same pre-existing attention findings: stale-claim on S-002A and S-00Q, five stale-seed and one unverified-provenance. Pre also showed `detached-head` because that worktree was detached. The earlier pre receipt at `1450e7a8` sits alongside. `git diff --check origin/integration HEAD` is clean, and `doctor` reports no blocking finding. Bounded semantic check: the LEXICON Role, Dispatcher and Worker rows, AGENTS Assigned Work And Stances and RUNBOOK Role And Stance Coordination still agree with the entry, because the entry restates none of them differently. No current-facing control shows S-002D as pending once `render` runs | Docs checked; no further update needed, because the only control lines touched are the pinned counts and the Core skill bundle row | Separate-context review, integration delivery and owner Human QA remain |
| 2026-09-30 | TK-003A | Task closed | Red b700712e (Worker fc0422ae): tools/test-skill-catalog.mjs S-002D block failed at 14c92156 with ENOENT on workbench/skills/dispatcher/SKILL.md. Green c2098e83 (Worker 3cf9880b): test-skill-catalog, test-workbench-layout, test-core-skill-installer, test-skills-lane, test-delivery-skills, test-cross-provider-fixture, test-control-fidelity and test-controls-vocabulary-sweep pass; Worker suite 48/48 at 3cf9880b (D-tk002x-3cf9880.log, dirty []); assembled suite 48/48 at c5beb7f2 (D-s-002d-c5beb7f.log, dirty []) | workbench/skills/dispatcher/SKILL.md, workbench/skills/README.md row and bundle sentence, manifest skillPolicy.required, workbench-layout coordinationSkills, pinned counts in README.md, RUNBOOK.md, LEXICON.md Core skill bundle row, templates/GENESIS.md and workbench/wiki/skill-genesis.md | Root-control role procedure wording beyond the pinned counts routed to S-00P; Worker branch claude/s-002d-tk-002x-entry is patch-contained but not an ancestor, so cleanup needs a separate decision |
