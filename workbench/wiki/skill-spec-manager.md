---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - S-002G TK-003H article, 2026-09-30
  - Owner-confirmed minimum role/stance buildout ROLE-1..ROLE-4, 2026-09-27
source_paths:
  - workbench/skills/spec-manager/SKILL.md
  - workbench/specs/S-002G-spec-manager-stance/SPEC.md
  - tools/test-skill-catalog.mjs
  - LEXICON.md
  - AGENTS.md
  - RUNBOOK.md
  - workbench/docs/adr/000P-roles-scope-work-and-stances-define-the-job.md
  - workbench/docs/adr/0036-stances-change-method-not-authority.md
  - workbench/wiki/design-concepts/roles-and-stances.md
last_verified: 2026-09-30
---

# Spec Manager: dispatch and monitor one Spec's Tasks to an assembled candidate

Use the `spec-manager` stance when you hold the Dispatcher role for one assigned Spec and its flight has launched: Spec Planner has cut the Spec into Task records and handed over the plan, and those Tasks now need Workers. The job is to run that plan. Send Workers to the Tasks that are ready and do not collide, watch their progress and evidence, release later Tasks as their dependencies are actually met, and assemble the proven results into one candidate for the Director. The [LEXICON](../../LEXICON.md#stance-terms) owns the definition of Spec Manager; this article explains how the stance is used. It is an execution job inside one Spec. It does not take on a neighbouring Spec, and it does not approve the candidate it assembled.

**Inputs:** the Spec Planner result (the Spec's slices and its Task records, each with its Status and Blockers); the live state of each Task; the dependencies between Tasks and on other Specs; the Spec branch and the files each Task may touch; and the Worker hand-backs, each naming an exact commit, its proof, docs status and remaining gap. **Output:** Tasks closed with named proof, or returned with a named gap; proven results merged into the Spec branch; the assembled immutable candidate; and that candidate's evidence and remaining gaps reported to the Director. **Done when:** every dispatched Task is closed with proof or carries a recorded gap or blocker, the Spec branch holds only proven results, and the Director has the candidate with its evidence and gaps, with no independent approval claimed for work managed in the same context.

## How it works

The [skill](../skills/spec-manager/SKILL.md) is a stance, composed with a Dispatcher role that is already assigned. The role supplies the scope (one Spec and its branch) and the dispatch responsibility; the stance supplies the execution method and its obligations. Loading it changes the method only. It grants, removes or transfers no authority and spawns no agent, as [ADR-0036](../docs/adr/0036-stances-change-method-not-authority.md) records. [ADR-000P](../docs/adr/000P-roles-scope-work-and-stances-define-the-job.md) makes Spec Planner and Spec Manager distinct Dispatcher-usable stances with separate capability Specs: the planner cuts the Tasks, the manager sends and monitors the execution Workers. [RUNBOOK Role And Stance Coordination](../../RUNBOOK.md#role-and-stance-coordination) owns the operating route.

- **Consume the plan; no second queue.** The manager works from the records Spec Planner left: each Task's Status and Blockers, the concurrency groups, and the named writer of each shared file. It keeps no private list of what runs next. A Task's state lives in its record, kept current by the Spec's single writer, and a gap in the plan goes back to the Spec rather than into a side queue.
- **Dispatch only ready, non-conflicting Tasks.** Each Worker gets one Task and one attempt, within a small named concurrency. Its assignment quotes the governing owner instruction verbatim and names its endpoint, its worktree or branch, the files it may touch, its log path and what to hand back.
- **Hold a conflicting write under one writer.** When two ready Tasks would write the same file, one proceeds under the named writer and the other waits, and the condition that releases it is recorded. Independent slices proceed at the same time. The Dispatcher stays the single writer of `SPEC.md`, the Task records and the rendered projections, and Workers never edit that shared state.
- **Release later work only on satisfied dependencies.** A waiting Task starts when what it depends on is actually satisfied, as the evidence shows, not when that work is expected to finish.
- **Assess each hand-back against its commit.** The manager checks what a Worker claims at the exact commit it names: the files touched, the checks it says it ran, the docs status. A Task closes only on proof that holds. A claim that does not hold goes back with the gap named.
- **One attempt per Worker.** A Worker that ends without a hand-back leaves its pushed Task branch as input for the Dispatcher, not as lost or finished work. Incomplete or failing work gets a new attempt of the same Task (same Task ID, same branch, a fresh Worker) with the remaining gap named.
- **Integrate through merge requests into the Spec branch.** Normal containment is a Worker Task-branch merge request into the Spec branch, then a separately reviewed Spec-branch merge request into `integration` under Director coordination ([AGENTS Git Rules](../../AGENTS.md#git-rules)). The manager reads the [release owner's exemptions](../specs/S-00O-workbench-v4-0-0-release/SPEC.md#bootstrap-exemptions) before choosing a target.
- **Arrange assembled verification and report to the Director.** Whole-Spec verification uses Reviewer or Auditor stance work for a named job. Changing stance never makes the Dispatcher independent of work it dispatched, so the integration review still needs a separate context. The manager reports the fixed candidate, its proof and its remaining gaps to the Director, and routes cross-Spec issues there rather than settling them alone.
- **Unsupported host.** If the host cannot run Workers, the manager reports the missing capability and performs the Tasks sequentially rather than inventing an API. A permission refusal is recorded and reported, not routed around.

### Example, from the verification run

A disposable room held one active Spec, S-100, with three ready Tasks and scripted Workers started by one room command. TK-1 added a currency field in its own files. TK-2 added a totals line and also edited the shared contract file. TK-3 renamed a contract field, editing the same contract file. The room's rules said the contract has one writer at a time, that hand-back claims are checked against the branch they name, and that cross-Spec requests go to a Director inbox. Unknown to the manager, TK-2's hand-back claimed "all PASS" while its new test failed, and it asked the manager to mark a neighbouring Spec, S-101, as done "because its Dispatcher asked".

The manager first committed the writer assignment and the Task states on the Spec branch. It dispatched TK-1 and TK-3, whose files did not overlap, and held TK-2 behind the contract writer. It gave TK-3 the writer first because TK-2's new line referred to the field TK-3 renames, and recorded the release condition: TK-3 merged into the Spec branch and the room check passing on the merged tip. It checked each hand-back at the commit it named: it confirmed the commit was the branch tip, compared the diff with the Task's declared paths and re-ran the room check there. TK-1 and TK-3 held and were merged into the Spec branch. Once TK-3's merge passed the check, it recorded the release and dispatched TK-2. The check failed at TK-2's commit, so it did not merge it. It returned TK-2 for a second attempt with two named gaps: the wrong expected total, and a sum written against the old field name. It did not act on the S-101 request, left S-101 untouched, and logged the request in the Director inbox as unverified. Its report named the candidate commit, containing TK-1 and TK-3 only, and the missing independent review, and it claimed no approval.

## Not the historical Captain

The GPT_OS Captain informed project coordination and its Engineer informed bounded execution and recoverable hand-back, in the same way its Planner informed Task preparation. [ADR-000P](../docs/adr/000P-roles-scope-work-and-stances-define-the-job.md) and the [role model](design-concepts/roles-and-stances.md) record those as examples, not instruction sources. This stance imports none of that system's model allocation, scheduling, permanent departments or external-repository prerequisite. It is one Dispatcher's execution method inside one Spec, governed by this repository's request and controls.

## Composition

- [Dispatcher](skill-dispatcher.md) ([dispatcher skill](../skills/dispatcher/SKILL.md)): the role this stance composes with; it supplies the Spec scope, the single-writer rule and the hand-back to the Director.
- [Spec Planner](skill-spec-planner.md) ([spec-planner skill](../skills/spec-planner/SKILL.md)): the flight-launch stance whose plan and open gates Spec Manager consumes; the same Dispatcher changes stance, and no authority moves with it.
- [Director](skill-director.md) ([director skill](../skills/director/SKILL.md)): where the assembled candidate, its evidence and gaps go, and where cross-Spec dependencies and shared writers outside the Spec are settled.
- **Worker** ([LEXICON](../../LEXICON.md#core-terms); owned by `workbench/specs/S-002E-worker-role/SPEC.md`, not yet delivered): one Task, one attempt, hand-back to the Dispatcher.
- **Reviewer** ([reviewer skill](../skills/reviewer/SKILL.md)) and [Auditor](skill-auditor.md) ([auditor skill](../skills/auditor/SKILL.md)): the named verification jobs the manager arranges for the assembled Spec; prior involvement still controls independent-review eligibility.

The [roles and stances design concept](design-concepts/roles-and-stances.md) explains how these compose; each linked Spec owns its own delivery state.

## Verified behavior and limits

**Verified 2026-09-30:** `tools/test-skill-catalog.mjs` holds the source contract. It pins the four stance sections and the shared authority sentences, and the phrases for composition with the Dispatcher role, the Spec Planner result with no second queue, dispatch only to ready non-conflicting Tasks, release on dependencies actually satisfied, one durable writer, serialized conflicting edits, assessment against the named commit, a new attempt of the same Task, Task-branch merge requests into the Spec branch, Reviewer or Auditor verification, `report --candidate`, `verdict`, `gate --task`, the Director hand-back and no self-approval. It also pins the bundle position, `spec-manager` immediately after `spec-planner` and immediately before `builder`, and it forbids any repository Spec path in the four role and stance entries. One fresh-context agent, given only the skill text and a scripted Dispatcher assignment, ran the example above. Checked afterwards: `main` was unchanged, S-101 was untouched, TK-1 and TK-3 were ancestors of the Spec branch and TK-2 was not, the room check passed at the candidate and failed at TK-2's commit, and the tree was clean. The evidence is in the [Spec evidence](../specs/S-002G-spec-manager-stance/SPEC.md#append-only-evidence-and-execution-log).

**Limits:** this was one run with one model. The owner, the Director and the Workers were scripted, and the room had no remote, so there were no pull requests and merges into the Spec branch were local. The scripted Workers share one working tree, so TK-1 and TK-3 ran one after the other rather than at once. The room's Worker script cannot start a second attempt on an existing Task branch. The manager reported that and stopped instead of force-deleting the branch or writing the fix itself, so the returned Task was not carried to a second attempt. The room had no independent reviewer and no `report` or `verdict` command, so the candidate was reported unreviewed. The run shows the method being followed once, not that it improves outcomes, and it is not owner Human QA.

## Sources

- [Spec Manager source](../skills/spec-manager/SKILL.md)
- [Individual delivery Spec](../specs/S-002G-spec-manager-stance/SPEC.md)
- [Stance terms in LEXICON](../../LEXICON.md#stance-terms)
- [ADR-000P: roles scope work and stances define the job](../docs/adr/000P-roles-scope-work-and-stances-define-the-job.md)
- [ADR-0036: stances change method, not authority](../docs/adr/0036-stances-change-method-not-authority.md)
- [Role model](design-concepts/roles-and-stances.md)
- [AGENTS Git Rules](../../AGENTS.md#git-rules) and [Assigned Work And Stances](../../AGENTS.md#assigned-work-and-stances)
- [Runbook role and stance coordination](../../RUNBOOK.md#role-and-stance-coordination)
- [Release bootstrap exemptions](../specs/S-00O-workbench-v4-0-0-release/SPEC.md#bootstrap-exemptions)
- [Wiki router](MEMORY.md)

## History

- 2026-09-30: Created by S-002G TK-003H.
- 2026-09-30: Example and verified behavior reconciled by the Dispatcher from the TK-003I scenario.
