# LLM Workbench - Runbook

**Last reviewed:** 2026-10-01
**Blueprint reviewed:** 2026-09-09
**Runtime owner:** Kayden
**Environment:** local (macOS); public repo `github.com/KaydenClark/LLM_Workbench`

This file explains how to operate, verify, and evaluate the workbench repo
itself. It should be boring, exact, and executable.

## Operations Index

Every session reads this index at entry, then follows only the rows its task
needs. Each row names an operation, when following it is worth it, and the
stable pointer to where its procedure lives.
A row that points to a skill in the tracked skills lane makes that skill part
of the Contract for its operation (`AGENTS.md` Instruction Authority), so a
change to a skill an index row points to, or to an index row, is reviewed as a
Contract change.

| Operation | Follow when | Pointer |
|---|---|---|
| Enter a session | Every session start or resume: check root, branch and dirty state, run doctor and load the assigned Spec. | [Ordinary Entry](#ordinary-entry) |
| Find the owner of a question | You need the file that owns a permission, meaning, work state, proof or procedure. | [Finding The Owner Of A Question](#finding-the-owner-of-a-question) |
| Route a truth to its owner | Work changed a durable truth and its owner must be updated, or nothing changed and that must be recorded. | [to-docs](workbench/skills/to-docs/SKILL.md#to-docs) |
| Cite a file that changes | A Spec, review or record cites a line of a file that later merges can move. | [to-docs](workbench/skills/to-docs/SKILL.md#citation-anchors) |
| Inspect a GitHub coordination binding | A task asks what a committed repository binding says at an exact commit. | [GitHub Coordination Binding Inspection](#github-coordination-binding-inspection) |
| Coordinate roles and stances | You plan, dispatch, monitor or verify work as a role or a named stance. | [Role And Stance Coordination](#role-and-stance-coordination) |
| Choose the behavior for a request | A request arrives in ordinary language and you must pick the skills and endpoint it authorizes. | [Behavior Selection](#behavior-selection) |
| Freeze a version label | You stamp or change a version label or the core bundle. | [Release Identity](#release-identity) |
| Upgrade the reference Template for a release | A new Workbench version is being made release-ready. | [Template Upgrade Release Gate](#template-upgrade-release-gate) |
| Check prerequisites | A fresh machine or clone needs its required tools confirmed. | [Prerequisites](#prerequisites) |
| Install | You set up a fresh clone. | [Install](#install) |
| Run locally | You run the evaluator and self-tests by hand. | [Run Locally](#run-locally) |
| Run the tests | A change to tools, templates, specs or root docs needs its fast check or the full suite. | [Test And Build](#test-and-build) |
| Verify a behavior change | A behavior change needs its red/green test, its targeted test and the full suite before its result is claimed. | [implement](workbench/skills/implement/SKILL.md#engineering-and-verification); this room's suite: [Test And Build](#test-and-build) |
| Prepare project evidence and Blueprint questions | Genesis or adoption needs evidence and Blueprint questions from a named evidence room. | [Prepare project evidence and Blueprint questions](#prepare-project-evidence-and-blueprint-questions) |
| Derive a fresh room from recorded decisions | A release must prove a room regenerates from its recorded decisions. | [Derive a fresh room from recorded decisions](#derive-a-fresh-room-from-recorded-decisions) |
| Check the skills lane | Core skills, their discovery roots or the lane receipt changed or look stale. | [Skills lane check](#skills-lane-check) |
| Publish to the personal catalog | The owner asks to back up skills to, or take one from, the personal catalog. | [Personal catalog publication](#personal-catalog-publication) |
| Check the support root | Genesis creates or validation checks a room's declared support root and lanes. | [V3 support-root check](#v3-support-root-check) |
| Check the managed runtime tools | Runtime tools changed, or a room's installed copies need install, update or verification. | [Managed runtime tools check](#managed-runtime-tools-check) |
| Classify a room's lifecycle route | Before choosing Genesis, adoption, upgrade or update for a room. | [Room lifecycle classification check](#room-lifecycle-classification-check) |
| Check an adoption migration | An existing project is adopted into the support-root layout. | [V3 Adoption migration check](#v3-adoption-migration-check) |
| Report control fidelity | After adoption or an update-harness run, compare a room's controls with the templates. | [Control fidelity report](#control-fidelity-report) |
| Upgrade a v2 room explicitly | A v2-root room moves onto the support root, or that move needs recovery. | [V3 explicit upgrade and recovery check](#v3-explicit-upgrade-and-recovery-check) |
| Check Workbench self-drift | Before and after any update to this Workbench. | [Workbench self-drift check](#workbench-self-drift-check) |
| Check carrier line landing | A rewrite removes lines from `AGENTS.md` or `RUNBOOK.md` and must prove each landed. | [Carrier line-landing check](#carrier-line-landing-check) |
| Deliver a Spec through its lifecycle | You pick up, deliver, review or close an assigned Spec and its Tasks. | [Spec Lifecycle And Retrieval](#spec-lifecycle-and-retrieval) |
| Pick, claim and close a Task | Every pickup or resume of assigned work: selection, claim, receipt, close and blocker rules. | [implement](workbench/skills/implement/SKILL.md#work-selection-and-lifecycle) |
| Work a Task as Worker | You select, claim, implement, record receipts for, self-check, close and hand back one Task. | [implement](workbench/skills/implement/SKILL.md#worker-selection-implementation-and-hand-back) |
| Review an assembled Spec | A Dispatcher assembles a candidate, or a separate Director reviews it and records the verdict before integration. | [dispatcher](workbench/skills/dispatcher/SKILL.md#dispatcher-and-separate-director-assembled-review) |
| Correct a failed review | A verdict or owner finding failed and its findings return to the still-open Spec. | [dispatcher](workbench/skills/dispatcher/SKILL.md#assembled-review-and-corrective-return) |
| Record owner Human QA and complete | The owner approves delivered work, or main containment must be proven before `complete`. | [director](workbench/skills/director/SKILL.md#owner-human-qa-and-main-before-complete); closure rules: [director](workbench/skills/director/SKILL.md#owner-closure-and-reconciliation) |
| Capture, retire or recover a completed Spec | After `complete`: feature capture, retirement, discard or recovery. | [director](workbench/skills/director/SKILL.md#documentation-feature-capture-retirement-and-recovery); this room's examples: [Documentation: feature capture, retirement and recovery](#documentation-feature-capture-retirement-and-recovery) |
| Write or accept a decision record | A decision record (ADR or DDR) is proposed, accepted, superseded, deprecated, read, linked or validated. | [to-docs](workbench/skills/to-docs/SKILL.md#decision-records) |
| Prove the composed round trip | Full verification runs, or the composed workflow changed. | [Composed round trip](#composed-round-trip) |
| Check the portability and privacy matrix | A release matrix row or its privacy check changed. | [Portability and privacy matrix](#portability-and-privacy-matrix) |
| Prove cross-provider resume | A release gate needs proof that another provider resumes from a clean clone. | [Cross-provider resume proof](#cross-provider-resume-proof) |
| Allocate a visible identifier | You need a new Spec, Task, note or other visible identifier. | [workbench-runtime](workbench/skills/workbench-runtime/SKILL.md#visible-identifiers) |
| Answer or process the Grill Board | The owner answers pending items (Spec gates, decisions, cards, decision-record texts) as a package, or an agent carries his saved answers into their owners and marks them applied. | [Grill Board](workbench/grill-board/README.md#grill-board) |
| Use the Landmark Tracker | Concept understanding (DQCs, landmarks) changes, or the Tracker view is needed. | [notepad](workbench/skills/notepad/SKILL.md#landmark-tracker-accepted-design-and-available-operations) |
| Keep a JSON notepad | Meaningful work needs a local note created, resumed, appended, trimmed or cleaned up. | [notepad](workbench/skills/notepad/SKILL.md#runtime-reference) |
| Transfer work through a handoff | Work goes to another agent or chat as a job, investigation, report or update. | [handoff](workbench/skills/handoff/SKILL.md#transfer-procedure) |
| Transport sessions privately | Private session transport is configured and selected collections must sync. | [save](workbench/skills/save/SKILL.md#optional-private-session-transport) |
| Save, promote or add a room-local skill | Authorized work must be saved to its owners, or a room adds its own skill. | [save](workbench/skills/save/SKILL.md#how-save-and-promote-compose); room-local skills: [workbench-runtime](workbench/skills/workbench-runtime/SKILL.md#room-local-skills) |
| Promote claims to an owner | Selected supported claims must reach their durable owner. | [promote](workbench/skills/promote/SKILL.md#command-reference) |
| Read frozen checkpoints or recovery receipts | A legacy checkpoint is cited, or a recovery receipt or backup is needed. | [checkpoint](workbench/skills/checkpoint/SKILL.md#frozen-history-and-operational-recovery) |
| Validate the Wiki | A Wiki page changed, or doctor reports a Wiki finding. | [workbench-runtime](workbench/skills/workbench-runtime/SKILL.md#wiki-validation) |
| Repair installed state | doctor reports installed state that a room command rewrites. | [workbench-runtime](workbench/skills/workbench-runtime/SKILL.md#installed-state-the-harness-wrote) |
| Read a diagnostic and its blocking effect | A runtime tool reports a finding and you need its severity and what it blocks. | [workbench-runtime](workbench/skills/workbench-runtime/SKILL.md#diagnostics-and-blocking-effects) |
| Use the socket contract registry | Work touches the Foundry socket contract registry. | [Socket Contract Registry](#socket-contract-registry) |
| Hold test coverage | You add or change tests, or judge whether coverage is enough. | [implement](workbench/skills/implement/SKILL.md#test-coverage-policy); this room's policy for the evaluator and trial tooling: [Test Coverage Policy](#test-coverage-policy) |
| Evaluate a harness change | You must show that a harness change is an improvement. | [Evaluation And Benchmarking](#evaluation-and-benchmarking) |
| Run the guardrail audit | A harness change needs its guardrail baseline and after-score. | [implement](workbench/skills/implement/SKILL.md#benchmark-driven-improvement); this room's audit: [Guardrail North-Star Audit](#guardrail-north-star-audit) |
| Pick the claims to test | An evaluation must name the claim it tests. | [Claims To Test](#claims-to-test) |
| Design an evaluation | You set up task-outcome scoring or trials. | [Evaluation Design](#evaluation-design) |
| Run the evaluation commands | You run the static rubric or the trial framework. | [Commands](#commands) |
| Take in harness feedback | Feedback arrives from a downstream room. | [Harness Feedback Loop](#harness-feedback-loop) |
| Run the automated feedback gate | Scheduled feedback automation runs or is configured. | [Automated Feedback Gate](#automated-feedback-gate) |
| Record an automation run outcome | A scheduled run finished and its outcome must be recorded. | [Automation Run Outcomes](#automation-run-outcomes) |
| Branch and open a pull request | You create a task branch or open a PR into integration, or need this room's Git commands. | [implement](workbench/skills/implement/SKILL.md#version-control-procedures); this room's commands: [Version-Control Procedures](#version-control-procedures) |
| Merge, prove containment and clean up a branch | The integration review passed: merge the reviewed candidate, prove integration contains it and delete the merged branch. | [implement](workbench/skills/implement/SKILL.md#branch-completion); this room's closeout commands: [Version-Control Procedures](#version-control-procedures) |
| Write a manual harness feedback report | A setup-only Round One check succeeded and an assessment is assigned. | [Manual Harness Feedback Reports](#manual-harness-feedback-reports) |
| Troubleshoot a known failure | A command fails with a symptom listed there. | [Troubleshooting](#troubleshooting) |
| Recover or roll back | A change fails and its touched files must be restored or reverted. | [implement](workbench/skills/implement/SKILL.md#recovery-and-rollback); this room's data and backup branches: [Recovery And Rollback](#recovery-and-rollback) |
| Record operational proof | A command changed durable project state. | [Operational Proof](#operational-proof) |
| Size and continue work | You size a Task or leave work a fresh context can resume. | [Evidence And Continuation Practices](#evidence-and-continuation-practices); [notepad](workbench/skills/notepad/SKILL.md#continuing-after-a-save-or-handoff); [save](workbench/skills/save/SKILL.md#evidence-partitioning); [to-tasks](workbench/skills/to-tasks/SKILL.md#sizing-a-task) |
| Check the Workbench connection identity | A room's `workbenchId` is created, read or compared. | [workbench-runtime](workbench/skills/workbench-runtime/SKILL.md#workbench-connection-identity) |
| Check configured-host capabilities | A host is set up, or its lanes, skill discovery or tool execution are in doubt. | [workbench-runtime](workbench/skills/workbench-runtime/SKILL.md#configured-host-capability-checks) |
| Review a candidate independently | A candidate needs separate-context review before integration, or a main-readiness or incident-claim review is requested. | [code-review](workbench/skills/code-review/SKILL.md#independent-review-boundaries) |

## Release Identity

A version label freezes when stamped, even before publication. A changed core
bundle requires a new version label; preserve the prior manifest policy as an
exact readable legacy row. Never redefine a stamped label silently. Only the
owner publishes integration to main after applicable review.

## Template Upgrade Release Gate

Before claiming a new version release-ready, apply the AGENTS Template Upgrade
Release Gate to [Workbench_Template](https://github.com/KaydenClark/Workbench_Template),
the example reference installation. Resolve the live repository identity even
when a local checkout or old remote is named Example_Workbench.
This is the required real-room test of `update-harness`.

1. Pin the clean source version/commit and the Template's current integration
   commit. Preserve unrelated work in separate checkouts. Read the target
   controls, create the dedicated upgrade spec, inventory all tracked files,
   and run its full baseline suite.
2. Follow `workbench/skills/update-harness/SKILL.md` for that installed layout. For an
   already-v3 room, run the source's additive layout migration, reconcile the
   manifest version and changed control sections, and run the source's
   `tools/workbench-tools.mjs update --project TEMPLATE_ROOT --home BACKUP_HOME
   --explicit-update` and `tools/workbench-skills.mjs update --project
   TEMPLATE_ROOT --home BACKUP_HOME --explicit-update`. Refresh eligible seeded
   documents. Keep original adoption/genesis provenance and room identity.
   Record backup/rollback limits; runtime and skills backups alone must not be
   described as whole-room recovery. Publishing skills to the personal catalog
   is a separate operation with its own authorization.
3. Verify the target manifest, applicable control stamps and runtime receipt
   name the new version. From the pinned source run
   `node tools/workbench-tools.mjs verify --project TEMPLATE_ROOT` and compare
   every installed managed hash. Run the Template's full documented suite,
   layout validation and doctor plus a smoke check of changed installed behavior.
   Compare the complete before/after inventory and account for every change.
4. Obtain separate-context review of the immutable Template candidate, merge
   into its declared integration branch, and prove the reviewed commit is
   contained remotely. Clone that remote result afresh and repeat the full
   Template suite and installed-runtime checks.
5. Record source version/SHA, prior and reviewed Template SHAs, commands/results,
   preservation and recovery evidence, review verdict, merged integration SHA
   and fresh-clone result in the current release owner. If any is missing or
   the Template remains on an older version, the gate stays open. Recheck affected
   proof when the release's consumed source changes. This does not approve main.

The initial v3.2.1 correction is owned by
[S-00F](workbench/specs/S-00F-template-upgrade-release-gate/SPEC.md).
This is a procedural release gate checked by the reviewer, not an automated
remote check or a claim about agent reliability.

## Ordinary Entry

Follow `AGENTS.md` -> this section -> `LEXICON.md` -> Task Routing. Inspect the
root, branch, upstream and dirty state; run the project-local spec doctor and
load the explicitly assigned spec. For owner-directed pickup, use `next --json`
and `show` to resolve that assignment. The spec and task set the normal
stance. Investigate within the task; do not invent a next task when blocked.
Load remaining Runbook sections only for the operation being performed.

For a setup-only Round One assignment, a fresh agent follows that route, checks
the manifest, relevant Wiki and ADRs, and runs read-only configuration checks.
Return the result in chat only: no feedback report, handoff, checkpoint,
self-created task, or other delivered prose artifact. Internal JSON capture
follows the meaningful-work rule and is reconciled at closeout; it does not
turn a chat-only setup check into a reporting assignment. Round One precedes
feedback testing.

### Finding The Owner Of A Question

1. Use [LEXICON -> Artifact Ownership Schema](LEXICON.md#artifact-ownership-schema)
   to identify the job: permission, meaning, destination, work state, proof,
   procedure, recovery or another listed responsibility.
2. Follow the named owner and resolve installed paths through the manifest.
   Consult only the relevant section and its linked sources. For a work-state
   question, follow the Taskboard row to the owning Spec before editing.
3. Separate the answer's status: accepted requirement, verified observation,
   proposal, unresolved question or historical claim. Apply AGENTS State
   Resolution if sources disagree; file location alone does not settle it.
4. When authorized work changes the answer, update its owner and refresh any
   derived view. If the route is missing, use bounded search and repair that
   route in scope. An unresolved decision stays in the existing work owner or
   objective note; a missing answer does not authorize a new task.

For example, a failed test has several owners: the Spec defines the expected
behavior, the source implements it, the result records the failure, and the
Spec records any resulting blocker. A Wiki explanation may clarify the cause;
it does not redefine acceptance. After interruption, the Runbook supplies the
recovery procedure while the Spec, source and saved context supply what to
recover. Execution and recovery therefore remain separate jobs.

### GitHub Coordination Binding Inspection

Follow the [GitHub coordination adapter procedure](workbench/docs/github-coordination.md)
for read-only inspection of an explicit committed repository binding at an exact
source SHA. It reports live access as unverified. This optional metadata command
adds no Issue assignment or claim authority; ADR-000O remains operative until
the separately reviewed cutover.

### Role And Stance Coordination

[Role model and capability owners](workbench/wiki/design-concepts/roles-and-stances.md).
The current Task-PR bootstrap exception remains in
[Workbench v4.0.0 Release](workbench/specs/S-00O-workbench-v4-0-0-release/SPEC.md#bootstrap-exemptions).

Roles scope assignments; stances supply their job. Follow the Lexicon before
assigning Director (project/integration), Dispatcher (one Spec/branch) or Worker
(one Task). At flight launch, assign Spec Planner to plan small Tasks and safe
parallel groups from current Actuality; planning Workers may assist. Assign
Spec Manager to dispatch and monitor execution. Keep one writer for shared
Spec/projection state and route cross-Spec dependencies to the Director.

Use Reviewer or Auditor stance for the named verification job. Apply the
existing independent-review eligibility rules to the actual agent/context;
changing stance does not clear prior involvement. Normally Workers hand back
merge requests to the Dispatcher branch and the Dispatcher presents the
assembled candidate for review and merge into integration. Inspect the current
release owner for any bootstrap exception before selecting a target.

Reconcile accepted decisions, current progress, off-integration candidate
references and remaining gates into their existing tracked owners through
reviewed changes. Distinguish a documented decision, an unmerged candidate and
a delivered capability. Create no Tasks for a newly planned Spec until launch;
preserve already-authored Tasks and their evidence.

### Behavior Selection

After resolving the requested scope, compose the smallest behavior already
authorized by ordinary language; do not wait for a second skill invocation.

| User intent | Behavior and endpoint |
|---|---|
| Decide or stress-test an idea | `grill-me`, the entry composing `grilling` with `notepad`; save answers/corrections before continuing |
| Preserve or resume meaningful work | `notepad`; verify live state and returned revision |
| Reconcile agreed claims | `promote` with `to-docs` and `save`; no implied implementation |
| Write specifications only | `to-spec` and needed `to-tasks`; stop at the specified endpoint |
| Deliver assigned work | `carry` with `implement`, verification, independent integration review and `save` |
| Transfer a job or report to another context | core `handoff`; recipient purpose, instructions and context within assigned role scope |
| Review a candidate or readiness | `code-review`; report only, no implementation or main merge |

Every helper inherits the caller's narrower endpoint. Mention is not invocation
and invocation is not new authority. Optional routers and historical extension
skills are not prerequisites. For meaningful work, create/resume a JSON note,
read its revision, verify Actuality and correct stale state before dependent
work. Confirm successful append/current results after material changes and
validate/read back before voluntary pause or handoff. Runtime revision, privacy
and dependency checks enforce those operations; host-native interception of
arbitrary agent actions is not claimed.

## Prerequisites

Required tools:

- Node.js >= 18 (zero npm dependencies; nothing to install)
- Python 3.9+ (stdlib only, for `evals/`)
- git, and the `gh` CLI for PR workflows

Required accounts/services:

- GitHub (repo `KaydenClark/LLM_Workbench`)

There is no environment configuration and no `.env`.

## Install

Nothing to install. Clone and go:

```bash
git clone https://github.com/KaydenClark/LLM_Workbench.git
```

Expected result: all `tools/` scripts run directly on Node >= 18 with zero
npm dependencies.

## Run Locally

There is no server. "Running" this project means running the evaluator and
self-tests directly:

```bash
node tools/evaluate-workbench.mjs --path templates --include-controls
```

Expected result: a Markdown score table where the templates beat both control
candidates.

## Test And Build

Fast check (run for any change to `tools/`, `templates/`, or root docs):

```bash
node tools/test-evaluate-workbench.mjs
```

Full verification is the one Full suite list below. `AGENTS.md`
[Engineering And Verification](AGENTS.md#engineering-and-verification) requires
it to pass before a change to controls, templates, tools, evals, or specs is
claimed; the red/green steps and their order follow the
[`implement` skill](workbench/skills/implement/SKILL.md#engineering-and-verification).

Full suite for controls, templates, tools, evals, or specs:

```bash
node tools/test-spec-workbench.mjs
node tools/test-skill-catalog.mjs
node tools/test-skill-inspection.mjs
node tools/test-skills-lane.mjs
node tools/test-core-composition.mjs
node tools/test-project-evidence.mjs
node tools/test-genesis-from-decisions.mjs
node tools/test-blueprint-contract.mjs
node tools/test-session-transport.mjs
node tools/test-configured-host.mjs
node tools/test-core-skill-installer.mjs
node tools/test-workbench-layout.mjs
node tools/test-workbench-adoption.mjs
node tools/test-workbench-upgrade.mjs
node tools/test-workbench-tools.mjs
node tools/test-diagnostics.mjs
node tools/test-adr.mjs
node tools/test-governance-core.mjs
node tools/test-branch-closeout.mjs
node tools/test-wiki.mjs
node tools/test-sessions.mjs
node tools/test-notepads.mjs
node tools/test-visible-ids.mjs
node tools/test-workbench-identity.mjs
node tools/test-visible-id-consumers.mjs
node tools/test-direct-promotion.mjs
node tools/test-workbench-round-trip.mjs
node tools/test-cross-provider-fixture.mjs
node tools/test-portability-matrix.mjs
node tools/test-workbench-dogfood.mjs
node tools/test-evaluate-workbench.mjs
node tools/test-guardrail-audit.mjs
node tools/test-context-tools.mjs
node tools/test-outcome-trials.mjs
node tools/test-eval-runner.mjs
node tools/test-feedback-automation.mjs
node tools/test-symlink-invocation.mjs
node tools/test-control-fidelity.mjs
node tools/test-spec-citation-anchors.mjs
node tools/test-controls-vocabulary-sweep.mjs
node tools/test-carrier-landing.mjs
node tools/test-runbook-index.mjs
node tools/test-spec-report.mjs
node tools/test-self-drift.mjs
node tools/test-feedback-inventory.mjs
node tools/test-grilling-ledger.mjs
node tools/test-grill-board.mjs
python3 tools/test-check-append-only.py
python3 evals/tasks/task_b_path_safety/test_grade.py
node tools/evaluate-workbench.mjs --path templates --include-controls
node workbench/tools/spec-workbench.mjs doctor
```

Expected result:

- each test script prints an `ok -` line and exits 0;
- the evaluator self-test reports the repo-root score (dogfood docs) >= 90;
- the `--path templates` run shows the blank templates beating both control
  candidates.
- spec doctor reports no duplicate IDs, invalid/contradictory states, stale
  claims, missing evidence, broken links, or generated-region drift.

These checks pass but are not Full suite members; this Runbook's earlier Full
verification list named them while the `AGENTS.md` Full suite did not, and
whether they join the suite is a separate decision:

```bash
node tools/test-team-coordination.mjs
node tools/test-team-coordination-demo.mjs
node tools/test-socket-contract.mjs
```

`tools/test-spec-citation-anchors.mjs` holds specs from S-036 forward to the
citation rule in `AGENTS.md` Documentation Ownership And Proof, whose anchoring
procedure is the `to-docs` skill's Citation anchors section; earlier specs are
grandfathered, since retro-anchoring accepted records buys no reader anything.
The rule exists because a bare `path:line` written against a branch tip points
at unrelated content once that branch lands - which is how nine citations in a
completed spec came to name the wrong code, one of them behind a checked
acceptance box.

### Prepare project evidence and Blueprint questions

From a named evidence room with a schema 2 manifest, run its installed tool:

```bash
node workbench/tools/project-evidence.mjs prepare --project-root . --input workbench/docs/intake-request.json --note blueprint-questions
```

The input is a bounded `project-evidence-request-1` JSON request with `project.name`,
`objective.key/title/focus`, `evidence` and `questions`. Each evidence item names
an `id`, project-relative `source`, caller-classified `kind` (`fact` or
`uncertainty`) and `statement`; paired `line_start`/`line_end` are optional.
Each question names an `id`, `question`, `recommendation`, and referenced
`evidence` IDs. The input file must also be inside that room.

The command validates source paths, observed bytes and privacy, then atomically
creates one provisional JSON grilling note in the manifest's live notepad
collection. Every question is open. Read the returned note/revision through
`notepads.mjs` before continuing the interview. Caller classifications do not
certify meaning, and preparation grants no authority to write a Blueprint, ADR
or spec. Record actual decisions and corrections through the grilling workflow.

A sub-minute isolated demonstration is `node tools/test-project-evidence.mjs`
from this release checkout; it exercises the same public CLI including refusal
cases. It proves deterministic preparation, not an owner interview or model
reliability.

### Derive a fresh room from recorded decisions

From a clean release checkout, with a clean named Template checkout and an
explicitly prepared source room, run:

```bash
node tools/genesis-from-decisions.mjs derive --template TEMPLATE_ROOT --source-project EVIDENCE_ROOM --intake workbench/sessions/notepads/grilling/blueprint-questions.json --plan workbench/docs/genesis-plan.json --destination NEW_PROJECT
```

The destination must not exist. Intake and plan paths, and every draft file
named by the plan, are relative to the evidence room. A `genesis-plan-1` request
names `project.name/founding_prompt`, the seven `controls` and `memory` drafts
(each with `file` and `sha256`), `selected_questions`, `active_adr_ids`, and
`capabilities`. A capability names its `id`, `title`, `derived_from` question IDs,
`outcome`, `acceptance` strings, and one `task` with `id` and `slice`.

Selected questions must be locked and have matching current decision entries.
Corrected or missing answers and changed evidence refuse derivation. The command
preserves decision wording and attribution, selected evidence bytes and hashes,
and active ADR lineage in the new room's durable owners. It does not decide
whether a caller-authored plan faithfully interprets owner intent; review must
judge that relationship. A note or plan does not grant implementation authority.

The staged room receives a new identity and current release runtime through
layout initialization and managed installation. Existing Template task state,
private live notes and old runtime receipts do not become new-project state.
Room-local rendering, doctor and Genesis validation run before publication of
the local destination. Remote recovery and project implementation remain separate
steps under the caller's scope. Existing projects use Adoption.

`node tools/test-genesis-from-decisions.mjs` exercises the public seam with
self-contained synthetic fixtures. The owning S-00E evidence separately records
the actual fresh project and native continuation; fixture success alone is not
that proof.

### Skills lane check

The core skills ship inside every room at the manifest-declared `skills` lane,
`workbench/skills`, and the two declared discovery roots (`.agents/skills`
for Codex, `.claude/skills` for Claude Code) are tracked relative links into
that lane, so a fresh clone discovers the skills with no provider home and no
personal catalog. This repository's lane is the authoring source for
the 27 core skills listed in `workbench/skills/README.md`; every other room
receives receipt-backed copies from the release checkout:

```bash
node tools/workbench-skills.mjs install --project /absolute/project
node tools/workbench-skills.mjs verify --project /absolute/project
node tools/workbench-skills.mjs update --project /absolute/project --home /disposable-or-user-home --explicit-update
node tools/workbench-skills.mjs rollback --project /absolute/project --backup /path/recorded/in/receipt
node tools/test-skills-lane.mjs
```

`install` copies each required core skill into the lane as ordinary files,
writes `workbench/skills/.workbench-skills.json` with the source repository,
release, commit and a content hash per skill, and lays the two adapters down;
it refuses a lane that already carries a receipt, a core name already present
without one, or a discovery root that exists and resolves elsewhere
(`adapter-collision`). `verify` reports `skills-receipt-drift` naming each
core skill that is missing, modified or unaccounted for and each adapter that
does not resolve into the lane (`source` on this repository), plus
`updateAvailable` when the release holds newer bytes. `update` requires
`--explicit-update`, replaces only changed core skills, backs the previous
directories up under the user home's `.workbench-skills-backup-*`, records the
path in the receipt and re-lays a missing adapter; `rollback` restores a
recorded backup. Skills a room adds to the lane under other names are
room-owned: never copied, hashed, replaced or removed. Genesis and Adoption
run `install`; `update-harness` runs `update`. Doctor reads the lane and the
adapters, never the provider home: a required skill missing from the lane is
`skill-lane-missing` and an unsafe lane entry is `skill-lane-unreadable`
(both severity `error` with effect `none`, like a missing integration branch:
visible in every run, repaired by one release command, never a reason to
stall selection; the Genesis readiness gate fails closed on them), an absent
or misresolving discovery root is `skill-adapter-missing` or
`skill-adapter-broken` (attention, effect `none`), and a root `skills/`
directory is `project-local-skills` (blocks everything) because it shadows
the lane. A room stamped before the lane declares it with
`workbench-layout.mjs migrate --project PATH` from the release checkout,
then runs `install`.
An operations index row that points to a skill the lane lacks is
`skill-pointer-dangling` (attention, effect `none`); doctor reads only the
index and the lane copy to decide which skill binds.

This repository's lane is also the release source, so it may hold maintainer
skills, only when `workbench/manifest.json` declares them under
`maintainerSkills`: the provider-home installer, the one-time upgrade and the
skill-catalog check accept exactly the core plus those names, refuse any other
extra lane entry (`invalid-bundled-core`) or a malformed declaration
(`invalid-maintainer-skills`), and never install or lay one down
([Maintainer skills](workbench/skills/README.md#maintainer-skills)).

### Personal catalog publication

The owner's personal catalog (a separate Git checkout mounted as the provider
home's discovery root) is a backup of every skill and the place a room may
publish skills it creates. It is never on a room's critical path. Publishing this release's core into a provider home is
a separately authorized operation; test it against a disposable home first:

```bash
node tools/core-skill-installer.mjs install --home /tmp/workbench-user-home
node tools/test-core-skill-installer.mjs
```

The installer writes missing canonical core directories into `.agents/skills`
and missing Claude directory adapters into `.claude/skills`. Existing names
and valid links remain untouched. Linked and Git-owned discovery roots are
supported. New managed paths are ignored through the owning Git repository's
local exclusions (or a discovery-root ignore file). No personal source is
staged or committed. Unsafe collisions block before installation.

For an explicitly authorized replacement of the published core, use the same
release checkout:

```bash
node tools/core-skill-installer.mjs update --home /tmp/workbench-user-home --explicit-update
node tools/core-skill-installer.mjs rollback --home /tmp/workbench-user-home --backup /tmp/workbench-user-home/.workbench-core-backup-RECORDED
```

Update verifies the source identity and managed ownership, records original
bytes and adapter topology under the named home, then installs the canonical
release and reads it back. Rollback verifies the complete recovery record,
backup hashes and unchanged installed output before restoring originals.
Newer local edits block rollback. Backup exclusions remain after restoration.
Keep the backup until its recovery value is deliberately retired; neither
command transfers live sessions or claims crash-safe transactions. Tracked
core source needs the [explicit migration plan](workbench/specs/S-051-core-skill-ownership-and-compatibility/tracked-core-migration.md).
A Git-owned provider home is refused because its backup would be versioned;
a Git-owned `.agents` catalog with ignored managed core is supported.

Every skill the personal-catalog installer writes carries the managed skill
marker `.workbench-skill.json` (schema 2): `source`, the `release` and
`commit` of the checkout that wrote it (the same source identity as the lane
receipts), a `contentHash` of the skill's files and an inclusive
`compatibleRooms` range from the v3.1.4 baseline to the producing release. A
schema 1 marker (`source` only) still counts as managed but names no
generation. Doctor no longer reads the provider home; the retired
`doctor --home` inspection is replaced by the lane findings above, and a
published catalog is compared only by the installer's own `update` and
`rollback` checks.

| Finding | Meaning |
|---|---|
| `skill-lane-missing` | The lane, or a required core skill in it, is absent. Error, effect `none`; Genesis readiness fails closed on it. |
| `skill-lane-unreadable` | The lane or a required skill is a link, a file, or holds a shared or linked `SKILL.md`. Error, effect `none`. |
| `skill-adapter-missing` | A declared discovery root is absent, so that host cannot discover the lane. |
| `skill-adapter-broken` | A declared discovery root does not resolve into the lane. |
| `skill-duplicate-discovery` | A deprecated `.codex/skills` entry adds another Codex catalog. |
| `skill-pointer-dangling` | An operations index row points to a skill the lane lacks; the row binds nothing until the lane holds it or the row is re-pointed. Attention, effect `none`. |
| `project-local-skills` | A root `skills/` directory shadows the lane. Blocks everything. |

Doctor never repairs a finding; `workbench-skills.mjs update --explicit-update`
from the release checkout does. These checks establish filesystem discovery,
not native invocation or agent reliability.

### V3 support-root check

Genesis uses the bounded layout helper to create and validate its declared
support root. Schema 2 declares seven lowercase lanes (`docs`, `specs`, `wiki`,
`sessions`, `feedback`, `tools`, `skills`; a room stamped before the skills
lane still validates with six until it updates) and twelve collections
(`docs/adr`, `wiki/design-concepts`, `wiki/guidebooks`, `wiki/archive`,
`sessions/grilling`, `sessions/handoffs`, `sessions/checkpoints`,
`sessions/notepads`, `sessions/notepads/templates`, `sessions/recovery`, and
the additive `wiki/features` and `docs/ddr`), the wiki profile, and the exact
source release and commit. `init` creates `docs/ddr` with the decision-record
lifecycle folders `proposed/` and `archive/`, as the ADR collection uses them.
A room stamped before an additive collection still validates; from the release
checkout, `workbench-layout.mjs migrate --project PATH` appends each missing
additive collection in order (`features`, then `ddr`), creates its folders as
ordinary directories, adopts an existing ordinary folder with its contents, and
changes no ADR record or other manifest key; a link or file in the way refuses
as `lane-collision` before anything is written. `workbench/sessions/.gitignore`
keeps `grilling/` and `handoffs/` untracked, and also denies the legacy spaced
`grilling diary/` name that a stale installed skill may still write (an
existing ignore file keeps its project rules and validates without that line);
checkpoint history and reusable templates remain tracked; operational recovery stays local.
Exercise it from a disposable project directory:

```bash
node workbench/tools/workbench-layout.mjs init --project /tmp/workbench-project --provenance genesis --version v3.2.1 --integration-branch integration
node workbench/tools/workbench-layout.mjs validate --project /tmp/workbench-project
node tools/test-workbench-layout.mjs
```

`init` and `migrate` record the exact Workbench source in
`provenance.source`. Run them from a clean release checkout: they verify its
`origin`, full 40-character `HEAD`, declared release, and runtime-tool bytes.
Optional `--source-commit SHA` and `--source-repository URL` values are
assertions and must match that checkout; they cannot override it. A relocated
partial copy cannot prove which Workbench bytes it carries and refuses with
`invalid-source-identity` before writing anything, even when source strings are
supplied. The placeholders `unrecorded` and `unknown` are never written.

A room that already exists records source identity after the fact with
`record-source` and brings its seeded lane documents current with
`seed-documents`; both are described under Installed State The Harness Wrote.

A schema 1 (v3.0 five-lane) manifest validates as `upgrade-required`. Migrate
it once, losslessly: `workbench/grilling` becomes `workbench/sessions/grilling`
and the tracked `workbench/handoffs` checkpoints become
`workbench/sessions/checkpoints`; the new lanes and collections are created
empty. A second run reports `current`.

```bash
node workbench/tools/workbench-layout.mjs migrate --project /absolute/project
```

Every consumer resolves lanes and collections through
`workbench/tools/workbench-paths.mjs`; nothing hardcodes a support path.

The manifest may also carry a `git` block (`defaultBranch`,
`integrationBranch`) naming, by exact case, the branch the independent review
gate merges into ([ADR-0039](workbench/docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md)).
`init` and `migrate` write it from `--default-branch` and
`--integration-branch`, defaulting to an existing integration-named branch by
its exact case, then `origin/HEAD` (or the checked-out branch) and
`integration`; `workbench-adoption.mjs migrate` does the same and lists an
unresolved branch as `residue.missingIntegrationBranch`. A manifest without
the block stays valid, and `workbench-paths.mjs` exposes the block as
`declaredGit`. `doctor` reports `integration-branch-undeclared` when the block
is absent and `integration-branch-missing` when the declared name resolves
neither as a local head nor on a remote; both are `error` findings in the
`git` scope with effect `none`, so they stay visible without blocking
selection. When the declared branch resolves and the spec `next` would select
is already `complete` or `superseded` at that ref, `doctor` reports
`complete-on-integration` (attention, naming the spec and ref) so a checkout
behind its integration branch is told so instead of dispatching finished
work; it reads the ref the repository already has and never fetches, and
`next` still returns the slice because a checkout may be pinned
deliberately. Declaring never creates a branch. This repository declares
`integration`; create a missing one from the default branch:

```bash
git branch integration main
git push -u origin integration
```

`init` also seeds the wiki contract (`SCHEMA.md`, `AGENTS.md`, and
`design-concepts/README.md`) into `workbench/wiki/` from `templates/wiki/`
when it runs from a release checkout, filling the version, date, and project
name (`--name`, `--date`, `--wiki-profile project|deployment`); a downstream
copy of the tool reports `seeded.wiki: false` truthfully. The Genesis
readiness gate requires the filled `workbench/wiki/MEMORY.md` router and those
three files with no template placeholder.

`validate --genesis` additionally requires seven ordinary, filled root controls,
exact Workbench version stamps on the six stamped controls (the thin
`CLAUDE.md` remains exactly `@AGENTS.md`), the generated-region markers in
`BLUEPRINT.md` and `TASKBOARD.md` that `render` fills, one actionable
version-matched first spec at a stable `workbench/specs/S-###-slug/SPEC.md`
path, an installed `workbench/tools/` lane whose receipt names the manifest's
release (`tools-receipt-missing` or `version-mismatch` otherwise), a declared
integration branch that resolves (`integration-branch-undeclared` or
`integration-branch-missing` otherwise), an installed `workbench/skills` lane
whose receipt names the manifest's release with both discovery adapters
resolving into it (`skill-lane-missing` or `skill-adapter-broken` otherwise),
and no root `skills/` directory (`project-local-skills`). It fails closed on symlinks,
template placeholders, stubs, version drift, unstable spec paths, or
structurally incomplete first specs. A rejected first spec carries a `reason`
field naming the failing predicate (status, priority, ready task, sections,
acceptance box, stamp, identity, or path), and a stray entry in the specs lane
is listed in `entries`; dotfiles such as `.gitkeep` and `.DS_Store` are
ignored. Readiness proves selection and claim, not doctor: run `render` and
`doctor` on the project afterwards, as `templates/GENESIS.md` Phase 6 says.
The `--genesis` readiness check carries the versioned placeholder vocabulary
with the CLI, and its focused self-test proves that vocabulary exactly matches
the shipped Genesis templates. Relocating the CLI and its declared helper
modules therefore cannot weaken lowercase-placeholder detection.

### Managed runtime tools check

The product's `workbench/tools/` lane is the canonical source of the
Workbench-managed runtime tools; this repository runs them from there. A
downstream project receives receipt-backed copies:

```bash
node tools/workbench-tools.mjs install --project /absolute/project
node tools/workbench-tools.mjs verify --project /absolute/project
node tools/workbench-tools.mjs update --project /absolute/project --home /disposable-or-user-home --explicit-update
node tools/workbench-tools.mjs rollback --project /absolute/project --backup /path/recorded/in/receipt
node tools/test-workbench-tools.mjs
```

`install` writes `workbench/tools/.workbench-tools.json` with the source
repository, release, commit, and a SHA-256 per file, copies each tool as an
ordinary `0644` file, and refuses a lane that already carries a receipt, a
foreign unreceipted file, or a symlink. `verify` reports `tools-receipt-drift`
with the drifted file names and, for each, which of the drift states below it
is in (`source` on this repository). `update` requires `--explicit-update`,
backs changed files up under the user home's `.workbench-tools-backup-*`,
records the backup path in the receipt, and `rollback` restores that backup. An
application's root `tools/` directory is never read or written.

`workbench-tools.mjs` itself is never installed into a room, so the same
receipt hash check also runs from `workbench/tools/workbench-layout.mjs`, which
every room does install, and `doctor` reads it. A room therefore verifies the
runtime it is executing with only the tools it contains, and a drifted managed
tool fails that room's own `doctor` at the registered `all` effect - which
`next` and `claim` also enforce, refusing to dispatch or claim a slice until
the runtime is repaired. The check runs only when the lane carries a receipt -
an uninstalled or release lane is not a managed runtime, and its absent receipt
stays the Genesis readiness gate's finding - and a receipt that exists but
cannot be read, records no file hashes, or names a file outside the tools lane
is reported as `tools-receipt-missing` rather than silently switching the check
off. Its cost is bounded: at most the managed files the receipt names plus one
directory listing of the lane, each file read and hashed once.

The receipt does not decide how much of the runtime gets checked. A drift
report names the file it found, so deleting that key would otherwise switch the
check off for exactly the tampered file while every other key went on
verifying. Both entry points therefore compare the receipt's key set with the
authoritative managed set - `RUNTIME_TOOLS`, defined in
`workbench/tools/workbench-layout.mjs` so that a room carries it too - and
report `tools-receipt-missing` naming what the receipt does not account for,
whether or not the file is still on disk. Both also list the lane, so a foreign
file dropped in beside the managed tools is reported. Dotted entries - the
receipt itself, the installer's transient `.receipt-*` staging directory - are
not managed runtime and are skipped.

The two conditions carry different remedies, because only one of them has a
command that repairs it. A managed tool the receipt does not account for is
repaired by `update --explicit-update`, which rewrites a key the receipt lost
even when the installed bytes already match the release, and restores a managed
file the lane lost. A file the managed runtime does not include is repaired
only by moving it out of the lane: `update` derives its changed set from the
managed tool list, so it reports `current` and changes nothing, and `install`
refuses a lane that already carries a receipt.

The list lives in an installed tool rather than in the release-side installer
because a room never carries `workbench-tools.mjs`. Deriving the expected set
from the lane's own contents instead left one silent hole: a managed file
deleted together with its receipt key leaves nothing on disk to be missed. Ten
of the eleven managed tools are in `doctor`'s own import graph, so deleting one
of those fails loudly with `ERR_MODULE_NOT_FOUND` before any check runs;
`sessions.mjs` is imported by none of them, and its deletion read as a clean
runtime. The list is no less trustworthy than the check that reads it:
`workbench-layout.mjs` is itself a managed file, so rewriting the list means
rewriting a managed file, which the hash comparison reports.

One condition the receipt check still cannot reach: a receipt deleted outright
leaves no managed runtime to check, so `doctor` reports nothing and only the
Genesis readiness gate (`validate --genesis`) fails on it. A managed file
deleted outright is now named - by the coverage comparison if its key went with
it, as `missing-or-not-a-file` drift if the key remains - though for the ten
tools in the import graph the loader fails first, so what a room sees there is
a stack trace rather than a finding.

Drift alone does not say what happened, so each drifted file is classified by
comparing the installed bytes with the release source. `updateAvailable`
compares the receipt with the source and answers a different question, so it
never substitutes for this.

| Drift state | What it means | Remedy |
|---|---|---|
| `receipt-stale` | the installed bytes are the release source's; the receipt hash is the stale fact | `update --explicit-update`, which backs the replaced files up under the user home and records the backup path in the receipt |
| `runtime-modified` | the installed bytes match neither the receipt nor the release source | `rollback --backup PATH` from a backup the receipt records, or `update --explicit-update` once the difference is reviewed |
| `runtime-authentic` | the bytes match both the receipt and the release source; only the file mode drifted | restore mode `0644` on the managed file |
| `source-unavailable` | no release source was reachable, which is every installed room | run `verify` from a release checkout to classify the drift |

Installation and explicit updates also require a clean Git source lane, an
`origin`, and a concrete 40-character `HEAD`; source identity is resolved
before a destination, receipt, or backup is created. The skills lane receipt
and the personal-catalog markers apply the same rule to the `workbench/skills`
bytes. Managed-component updates record the new component generation in their
receipt or marker without rewriting the room manifest's historical adoption
source.

Managed-tool updates and rollbacks reject symlinked lane ancestors, linked or
nonregular managed files, and unsafe backup entries before copying or creating
backups. Resolve the path collision while preserving its target, then retry the
explicit operation. Ordinary drift in a regular managed file still receives a
backup and can be restored.

Layout initialization and schema migration preserve existing session ignore
rules and reject linked destination paths before writes. ADR creation, register
rendering and direct owner promotion also reject unsafe destination chains and
use private temporary files. Legacy Wiki adoption moves existing knowledge
before seeding only the missing contract files.

### Room lifecycle classification check

Before choosing a lifecycle route for a room, ask the room which route its own
contents support. The command is read-only: it never writes, claims work,
selects a route, or authorizes a migration. Run it from this release checkout.

```bash
node tools/workbench-classify.mjs classify --project /absolute/project
node tools/test-workbench-layout.mjs
```

It reports one of four verdicts with the reasons behind it and the evidence it
gathered (`manifest`, `versionStamp`, `supportRoot`, `lifecycleTools`,
`legacyControlShapes`, `roomContents`), and exits 0 for all four. A lane the
room will not let it read - `workbench/` or root `tools/` at mode 000, a
`tools -> tools` symlink loop, a lane name under a regular file, a link whose
target is too long to resolve - is one of the room's own facts: it is reported
as undetermined rather than counted as absent, and the room still gets a
verdict. Only the supplied project path itself failing - unreachable, or not an
ordinary directory - exits 1.

| Verdict | The evidence that produces it |
|---|---|
| `genesis` | The room is empty apart from `.git`: nothing to derive filled controls from |
| `adoption` | A working repository with content, no manifest, no version stamp, and no Workbench-shaped control set |
| `upgrade` | A `workbench/manifest.json` that reads as a manifest object carrying an integer `schemaVersion`, or a Workbench version stamp in a root control with no manifest (the `upgrade --layout-only` v2-root room) |
| `unclassifiable` | `workbench/` is present but is not an ordinary directory or carries no readable manifest; a root control or the room's own top-level listing cannot be read and nothing else is stamped; or the room is harness-shaped with no manifest and no stamp |

Harness-shaped means all seven root controls, or root `tools/` files from the
managed runtime set in a room that also carries more of the seven controls than
it is missing. Those filenames (`privacy.mjs`, `sessions.mjs`) are ordinary, so
one of them alone never makes a room harness-shaped. A `workbench/manifest.json`
that parses as an unrelated JSON object, an array, or a `schemaVersion` that is
absent, `null`, or not an integer is not this room's authority and reads as
`unclassifiable`. Nothing under a `workbench/` that is not an ordinary directory
is read - not the manifest, and not the managed `workbench/tools/` lane, whose
receipt would otherwise credit this room with another room's runtime lane - and
a `workbench/manifest.json` that is itself a symlink is never opened either.
Every component a lifecycle lane is read through must be the room's own, one
level down as well: an ordinary `workbench/` whose `tools` is a link reports
`read: false` for the same reason, and inside an ordinary lane a managed name
that is itself a link, or a directory wearing the name, is not an installed tool
this room carries. A root `tools/` that is a link out of the room is listed as
`rootBorrowedNames` rather than `rootManagedNames`, so another room's files
never corroborate the harness-shaped reading.

`unclassifiable` is a first-class answer, not an error. A harness-shaped room
with no manifest and no stamp is produced equally by an unstamped Workbench
installation (upgrade) and by an independent dialect reusing the same names
(adoption); the room does not say which, so the command lists both readings and
escalates with evidence rather than guessing. A readable manifest reports its
`schemaVersion`, `workbenchVersion`, and recorded `provenance.lifecycle` as
evidence; the recorded lifecycle is never the verdict, and whether an installed
room actually needs migrating is `workbench-layout.mjs validate`'s answer. An
unfilled bracketed control and a version banner that never resolved are
reported as evidence and listed among the reasons, under both the harness-shaped
verdict and the `adoption` one a straight `cp -R templates/.` produces, so a
copy of the templates is offered as a reading rather than mistaken for a room.
The rule is recorded in
[S-044](workbench/specs/S-044-legacy-room-classification/SPEC.md).

### V3 Adoption migration check

Adoption requires seven filled root controls before it retires legacy
project-local support paths; it lays the core skills into the room's own
`workbench/skills` lane from the release, so no provider home is read.
Exercise the deterministic mixed-v2 fixture without touching a real project:

```bash
node tools/test-workbench-adoption.mjs
```

For a real one-time migration, use the Adoption protocol after its inventory and
control-reconciliation phases:

```bash
node tools/workbench-adoption.mjs migrate \
  --project /absolute/project \
  --home /disposable-or-user-home \
  --version v3.2.1
node workbench/tools/workbench-layout.mjs validate --project /absolute/project
node workbench/tools/spec-workbench.mjs next --json
node workbench/tools/spec-workbench.mjs doctor
```

The command refuses an existing support root or any legacy collision before
mutation. Unreconciled root controls refuse once as `unreconciled-controls`,
naming every failing control in `error.controls` with its own reason
(`missing-control` for an absent, linked, or non-file control;
`bracketed-control` for one still carrying a bracketed placeholder), and
carrying the four-step reconcile-before-migrate order and the warning that a
template copied over an existing control overwrites the project-specific
privacy, boundary, and verification rules it already holds
(`error.reconcileOrder` and `error.templateOverwriteWarning` repeat both for a
machine reader). It moves only documented durable lanes into their schema 2
destinations (legacy `grilling diary/` into the untracked grilling collection,
legacy `handoffs/` into the tracked checkpoints collection), preserves
project-local skills under `workbench/sessions/recovery/adoption-legacy-skills/`
(a root `skills/` would shadow the lane), writes
`workbench/sessions/recovery/adoption-recovery.json`, moves a root
`WORKBENCH_FEEDBACK.md` (or legacy `HARNESS_FEEDBACK.md`) into
`workbench/feedback/WORKBENCH_FEEDBACK.md`, installs the receipt-backed runtime
tools into `workbench/tools/` and the receipt-backed core skills into
`workbench/skills/` with their discovery adapters, then renders and validates
the manifest-declared spec lane. Two root feedback files, or a root file beside a legacy
`feedback/WORKBENCH_FEEDBACK.md`, block as `feedback-collision` before any
mutation. An application's root `tools/` directory is never a migration
source and is left untouched. Its `residue` result lists root filenames that
match the managed runtime-tool set and pre-migration links that escaped a moved
legacy lane; it never deletes those files or rewrites project prose. A moved
legacy room brain receives the required Wiki metadata, and the manifest source
repository/commit must match the managed-tools receipt. The migration fails
only on a finding that blocks `all` or `selection`; nonblocking findings (for
example a moved link that needs explicit reconciliation) are returned as `findings` with
`doctor: passed-with-findings` so the adopting agent repairs them next.

### Control fidelity report

After Adoption Phase 4 or an update-harness run, compare a room's
hand-reconciled controls with the templates they derive from. Run it from this
release checkout; it reads the room and never writes to it:

```bash
node tools/control-fidelity.mjs report --project /absolute/project
node tools/control-fidelity.mjs report --project /absolute/project --control AGENTS.md --format markdown
node tools/test-control-fidelity.mjs
```

The JSON report (Markdown with `--format markdown`, also carried in the JSON
`markdown` field) covers the six templated root controls, `CLAUDE.md` checked
for exact equality with `@AGENTS.md`, `.claude/settings.json` when present, and
the seeded wiki contract files plus `MEMORY.md` under the manifest-declared
wiki lane. Every template line is `filled` (a placeholder line whose fixed
wording remains intact after the room fills its value), `unchanged`, `dropped`, or `changed`
(nearest word-overlap match at or above 0.5); every room line with no template
origin is `added`. It states the checkout version and the room's manifest
release and labels a newer or older template generation instead of pretending
fidelity is exact. Divergence never changes the exit code; only an invocation
error (missing `--project`, an unknown `--control`, a nonexistent project)
exits 1. Each `dropped` or `changed` `AGENTS.md` line is restored or recorded
as a decision in the owning spec or an ADR. Comparing against an older
release means checking that release out first; `--templates PATH` points the
report at another templates directory.

### V3 explicit upgrade and recovery check

One command moves a v2-root room (root `specs/`, no `workbench/`) onto the v3
support root and records `provenance.lifecycle: upgrade`; it has two exclusive
modes. Both require a clean, committed target with no support root, and both
record the pre-migration SHA, tracked path inventory, and tools receipt in
`workbench/sessions/recovery/upgrade-recovery.json`.

Both modes migrate the legacy lanes once through the Adoption seam, install
the receipt-backed runtime tools and the receipt-backed core skills lane with
its discovery adapters, and write the recovery record with
`skills: "lane-install"`, an empty `skillBackups`, `coreRecovery: null` and
the `skillsLane` receipt reference. Neither reads, compares, marks, backs up
or replaces a skill in the provider home; `--home` only names where a later
`workbench-skills.mjs update` would put its backup. `--layout-only` is the
route for an already-adopted room:

```bash
node tools/workbench-upgrade.mjs upgrade \
  --project /absolute/project \
  --home /disposable-or-user-home \
  --version v3.2.1 \
  --layout-only
```

`--explicit-update` is the same route under the name every one-time upgrade
historically required; it no longer replaces anything in the provider home,
because the core now lives in the room's lane and a later
`workbench-skills.mjs update --explicit-update` is the only path that replaces
a core skill there. A layout failure reports partial completion with the
pre-migration Git SHA as the recovery point:

```bash
node tools/workbench-upgrade.mjs upgrade \
  --project /absolute/project \
  --home /disposable-or-user-home \
  --version v3.2.1 \
  --explicit-update
node tools/test-workbench-upgrade.mjs
```

Passing neither mode blocks with `explicit-update-required`; passing both is an
`invalid-invocation`. Uncommitted state has no concrete rollback point.

### Workbench self-drift check

Project drift and Workbench self-drift are separate checks. A project update
checks the target room's filled controls, product truth, active work and local
proof. When the canonical LLM Workbench itself is updated, check the source
WorkBench's own cold-start surface before and after the change as well.

Run `node workbench/tools/self-drift.mjs --phase pre --json` before the change
and `--phase post --json` afterward. Preserve the receipts in the owning Spec
evidence. The read-only machine report detects bounded contradictions and
identity gaps; it does not certify arbitrary prose. Perform this semantic
check as well, and do not call an update clean while known current-facing
drift remains:

1. Pin the Workbench source revision, manifest version and declared integration
   branch. Preserve unrelated dirty state and inspect from a clean task
   worktree when mutation is involved.
2. Inventory root controls and projections, the manifest, current and planned
   Specs plus `CATALOG.md`, active ADRs and their register, the Wiki router,
   update/review procedures, templates, managed tools and skill receipts,
   seeded contract documents, and readable continuity metadata.
3. Reconcile each current-facing status, blocker, latest event, next gate,
   version, path and owner against its durable source. Classify bounded history
   and append-only evidence explicitly instead of treating every old claim as
   a defect.
4. Record stale completed work, resolved blockers, contradictory versions or
   routes, generated projection drift, stale provenance/seeds and unreadable
   required artifacts with the smallest owning correction. Preserve the source
   bytes and corrections; this check is read-only.
5. Repeat the inventory after the Workbench update and run a clean cold-start
   read-back using repository state only. A project drift result, `render`,
   `doctor` or passing tests may be attached as evidence, but none replaces the
   self-drift result.

The implementation, public machine-readable receipt and remaining proof are
owned by [S-00K](workbench/specs/S-00K-workbench-self-drift-check/SPEC.md).
`cleanUpdate: false` deliberately leaves the semantic judgment to the named
review; `no-machine-finding` means only the implemented checks found no issue.

### Carrier line-landing check

A maintainer verification tool for a rewrite of the Contract carriers, run at
rewrite review; it is not installed into rooms. It lists every line a candidate
removed from `AGENTS.md` or `RUNBOOK.md` since a base commit and refuses unless
each one has an inventory entry whose home file holds its landed text at the
candidate. It reads Git objects only and never decides which home is right:

```bash
node tools/check-carrier-landing.mjs scaffold --base BASE_SHA --carrier AGENTS.md --out INVENTORY.json
node tools/check-carrier-landing.mjs check --base BASE_SHA --candidate HEAD --inventory INVENTORY.json --json
node tools/test-carrier-landing.mjs
```

An inventory is one JSON file per carrier (`schemaVersion`, `carrier`,
`baseSha`, `entries`). Each entry records `line` (its number at the base),
`text`, `hash` (sha256 of the normalized text), `homeKind`, `homePath`,
`landedText` and `reason`. `homeKind` is `null` until classified, then one of
`stays`, `skill`, `pointer`, `lexicon`, `wiki`, `restates-owner` (the named
owner already holds the claim) or `retired-with-reason` (no home; `reason`
required). Normalization trims and collapses whitespace runs, so a reordered,
re-indented or rewrapped line is not removed; blank lines and headings never
need to land. `scaffold` writes every other line unclassified and refuses to
overwrite an existing inventory. `check` exits 0 when every removed line
landed, 1 on an unlanded line (`no-entry`, `unclassified`, `stays-but-removed`,
`home-missing`, `home-empty`, `home-lacks-text`, `owner-lacks-claim`,
`retired-without-reason`, `unknown-home-kind`) or an inventory that no longer
matches its base, and 2 on a usage or Git error. The Contract Carrier
Pointer-Brief Rewrite
([S-004C](workbench/specs/S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md))
keeps its inventories in its Spec folder.

### Spec Lifecycle And Retrieval

Use this sequence for one assigned Spec and its Task records. Examples name
S-001/TK-001; substitute the actual IDs and quoted values. These are separate
role checkpoints, not one unattended script: a Worker supplies self-check,
the Dispatcher owns whole-Spec QA, a separate Director reviews the immutable
candidate, and only the owner supplies Human QA approval and main promotion.
The runnable mechanical example is `node tools/test-workbench-round-trip.mjs`;
its reviewer, owner and main promotion are explicitly disposable fixture data.
Each role's procedure lives in the lane skill its subsection below points to.

#### Worker: selection, implementation and hand-back

Select, claim, implement, record receipts for, self-check, close and hand back
one Task through the procedure in the
[`implement` skill](workbench/skills/implement/SKILL.md#worker-selection-implementation-and-hand-back).

#### Dispatcher and separate Director: assembled review

Assemble a Spec candidate, review it in a separate context, record the verdict,
return failed findings and check the gate before integration through the
procedure in the
[`dispatcher` skill](workbench/skills/dispatcher/SKILL.md#dispatcher-and-separate-director-assembled-review).

#### Owner: Human QA and main-before-complete

Record the owner's actual Human QA decision and complete a Spec after main
containment through the procedure in the
[`director` skill](workbench/skills/director/SKILL.md#owner-human-qa-and-main-before-complete).

#### Documentation: feature capture, retirement and recovery

Capture feature knowledge, retire, discard and recover a completed Spec, and
recover a colliding Task identity, through the procedure in the
[`director` skill](workbench/skills/director/SKILL.md#documentation-feature-capture-retirement-and-recovery).

This room's collision-recovery example for that procedure:

Freeze the clean candidate and the unchanged original Task bytes. This room's
2026-10-01 example retains S-00I/TK-004F and assigns its later S-003P record
TK-004I. Replay historical examples only in a disposable checkout containing the
original record; a completed recovery does not authorize another move. Set the exact
`EXPECTED_HEAD`, original `SOURCE_SHA`, earlier `COLLISION_SHA`, and SHA256
`TASK_HASH` from those reviewed inputs; the original source is recoverable with
`git show SOURCE_SHA:workbench/specs/S-003P-github-coordination-room-binding-and-identity/tasks/TK-004F/TASK.md`.

```bash
node workbench/tools/spec-workbench.mjs move-task S-003P --task TK-004F \
  --replacement TK-004I --expected-head "$EXPECTED_HEAD" --task-hash "$TASK_HASH" \
  --source-revision "$SOURCE_SHA" --collision-spec S-00I \
  --collision-revision "$COLLISION_SHA" \
  --collision-path workbench/specs/S-00I-folder-lifecycle-for-records/tasks/TK-004F/TASK.md \
  --reason "Director retains earlier S-00I identity" --dry-run --json
```

The first S-01X migration slice provides an opt-in preview:

```bash
node workbench/tools/spec-workbench.mjs render --format json
node tools/test-taskboard-json.mjs --demo
```

`render --format json` regenerates only `TASKBOARD.preview.json` from existing
Spec/Task records. Its six lanes retain readable source links, source-owned
metadata and derived child progress and cleanup state. Unknown metadata stays
`null`; ordering is priority, title, then WBID. Editing a card never changes
its source, and the next render restores the source-derived value. Invalid
source, ambiguous flat identities, symlinked sources or linked outputs refuse before
replacing the previous preview. Normalized duplicate field names anywhere in
a record also refuse, using the same whole-document extraction, case
sensitivity and key/value trimming as
the existing source parsers. This validation applies only to the preview.
Legacy numeric Task labels remain Spec-scoped in their owners: if two labels
collide as flat JSON keys, the refusal names both sources without changing
them. Reconcile that boundary before the later
canonical board switch. Default `render` continues to generate Markdown and
CATALOG; selection, review vocabulary, direct/orphan Task coverage, sitrep and
the root/template switch remain separate S-01X slices. The demo uses a
disposable room and runs in under one minute.

### Architecture Decision Records

Write, accept, supersede, deprecate, read and validate decision records through
the procedure in the [`to-docs` skill](workbench/skills/to-docs/SKILL.md#decision-records).
Destination Decision Records are the ADR's sibling for destination choices
([ADR-000S](workbench/docs/adr/000S-destination-decision-records-are-decision-records-beside-adrs.md)).

### Composed round trip

The composed workflow is proven mechanically, without a model, on every full
verification run:

```bash
node tools/test-workbench-round-trip.mjs
```

It creates a bare remote, runs Genesis with this candidate's tools (init,
tools install, seven controls, wiki router, feedback lane, first spec),
passes `validate --genesis` and doctor, writes a live JSON notepad, reconciles selected claims
into the spec owner, claims the first slice, pushes the planning checkpoint (the
notepad never enters the commit), deletes the working clone, resumes from a
fresh clone with a scrubbed environment using only repository state, drives a
red/green slice, closes, renders, passes doctor, pushes, reads the remote SHA
back, and scans the clone and the transcript for any Foundry name, mechanism,
or private home path. The real cross-provider resume with agents is S-022's
release gate.

### Portability and privacy matrix

Every row of the v3.1 release matrix has a named deterministic check that runs
on every full verification pass:

| Row | Check |
|---|---|
| schema migration | `test-workbench-layout.mjs`: schema 1 reports `upgrade-required`; `migrate` is lossless and idempotent |
| mixed Adoption | `test-workbench-adoption.mjs`: five fixtures including root feedback, collisions, and an untouched root `tools/` |
| case-sensitive paths | `test-portability-matrix.mjs`: no tracked paths differ only by case; capitalised or spaced lanes rejected |
| Windows/POSIX behavior | `test-portability-matrix.mjs` and `test-spec-workbench.mjs`: backslash lanes rejected; CRLF manifests, packets, and projections accepted |
| symlink invocation | `test-symlink-invocation.mjs`: every runtime lane tool runs its main through a symlinked path |
| collisions | `test-workbench-tools.mjs`, `test-workbench-adoption.mjs`, `test-workbench-layout.mjs`: receipts, lanes, feedback, and first-spec collisions block before mutation |
| stale links | `test-diagnostics.mjs`, `test-wiki.mjs`: broken spec links and stale notes are attention, never blocking |
| public privacy stripping | `test-portability-matrix.mjs`: the shared `privacy.mjs` patterns find nothing on the active surfaces |
| retired private and Foundry paths | `test-portability-matrix.mjs`: no active surface names a retired lane, the hidden notepad directory, a private home path, the private skill catalog, a host temp lane, or a Foundry-dependent path |

```bash
node tools/test-portability-matrix.mjs
```

### Cross-provider resume proof

The release-gate proof that a different provider can resume from a clean
clone using repository state only, with isolated candidate skills and
receipt-backed candidate tools and nothing outside the repository:

```bash
node tools/cross-provider-resume.mjs plan --workspace /disposable/workspace
node tools/cross-provider-resume.mjs resume-prompt --workspace /disposable/workspace
node tools/cross-provider-resume.mjs verify --workspace /disposable/workspace --transcript /disposable/workspace/transcript.txt
```

`plan` builds a bare remote, runs Genesis with this candidate, reconciles selected claims
into the spec owner, claims the first slice, pushes the planning checkpoint, destroys
the planning clone, and prepares an isolated, skill-free provider home; the
candidate skills travel inside the room's `workbench/skills` lane, so the
resuming provider discovers them from its fresh clone. Between `plan` and `verify`,
run the other provider from a fresh clone of `origin.git` with its home pointed
at that isolated directory and the printed prompt, capturing its output to a
transcript. Provider authentication and security settings stay with the
configured host and are never copied or weakened by the fixture. Use a
disposable workspace. If the host refuses a required operation, preserve that
result as unavailable or incomplete; it is not a reason to bypass its controls.
`verify` clones fresh and proves the remote advanced, the
task closed with proof, the test and CLI pass, doctor is clean, the tools
receipt names the exact candidate, the live notepad never travelled, and the
transcript names nothing outside the repository. This proof spends provider
budget and is run for the release umbrella, not on every verification pass;
`node tools/test-cross-provider-fixture.mjs` proves the provider-free half
(a recoverable planning checkpoint and a fail-closed verify) on every run.

### Visible Identifiers

Allocate and widen the visible identifiers of Specs, Tasks, decision records
and notepads through the procedure in the
[`workbench-runtime` skill](workbench/skills/workbench-runtime/SKILL.md#visible-identifiers).

### Landmark Tracker: accepted design and available operations

The [Landmark Tracker Foundation specification](workbench/specs/S-01T-landmark-tracker-foundation/SPEC.md)
owns delivery of the accepted design, which the
[`notepad` skill](workbench/skills/notepad/SKILL.md#landmark-tracker-accepted-design-and-available-operations)
carries with the operations available now. No Tracker runtime is implemented
by this documentation change.

### JSON Notepads

Create, resume, read, append to, trim, migrate or delete a local JSON notepad,
and allocate its visible identifier, through the procedure in the
[`notepad` skill](workbench/skills/notepad/SKILL.md#runtime-reference).

### Handoff Transfer

Prepare a handoff for a specified receiving context and release a retaining
source through the procedure in the
[`handoff` skill](workbench/skills/handoff/SKILL.md#transfer-procedure), within
the [role boundaries](AGENTS.md#handoff-assignments-and-shared-context).

### Optional Private Session Transport

Configure, push, resume and reconcile optional private session transport
through the procedure in the
[`save` skill](workbench/skills/save/SKILL.md#optional-private-session-transport);
ordinary local notepad commands stay independent of it.

### Portable Save, Promote And Room-Local Skills

How `save` and `promote` compose is in the
[`save` skill](workbench/skills/save/SKILL.md#how-save-and-promote-compose).
Adding a room-local skill to the lane follows the
[`workbench-runtime` skill](workbench/skills/workbench-runtime/SKILL.md#room-local-skills).
The core catalog rules follow.

The core machine catalog is `coreSkills` in the layout runtime; documentation
and tests derive its size from that catalog. The current candidate includes
save/promote while preserving checkpoint as a no-write compatibility notice.
The v3.1.4 eighteen-skill manifest policy remains readable as a frozen legacy
row. The owner explicitly waived the stamped-label rule for the current v3.2.0
repair only (S-050/S-051): its original twenty-skill policy remains readable,
while the repaired twenty-one-skill core is identified by source commit and
content hashes. This exception does not authorize publication.

### Direct Owner Promotion

Reconcile selected supported claims into an existing durable owner with
`sessions.mjs promote` through the procedure in the
[`promote` skill](workbench/skills/promote/SKILL.md#command-reference).

### Frozen Checkpoint History And Operational Recovery

Existing checkpoints stay frozen, and recovery receipts and backups live in the
ignored recovery collection; read or restore them through the procedure in the
[`checkpoint` skill](workbench/skills/checkpoint/SKILL.md#frozen-history-and-operational-recovery).

### Wiki Validation

Validate the wiki lane, read its findings (which `doctor` also carries) and
repair a note's missing properties through the procedure in the
[`workbench-runtime` skill](workbench/skills/workbench-runtime/SKILL.md#wiki-validation).

### Installed State The Harness Wrote

Repair the seeded lane documents and the source provenance the harness wrote,
which `doctor` reports as `stale-seed` and `unverified-provenance`, through the
procedure in the [`workbench-runtime` skill](workbench/skills/workbench-runtime/SKILL.md#installed-state-the-harness-wrote).

### Diagnostics And Blocking Effects

Read every runtime finding's severity, scope and blocking effect, and how
`doctor` groups and reports them, through the procedure in the
[`workbench-runtime` skill](workbench/skills/workbench-runtime/SKILL.md#diagnostics-and-blocking-effects).

### Socket Contract Registry

The Foundry socket contract registry (GPT_OS root spec S-014, C-003 extraction)
travels with the Sockets family. `tools/socket-registry/registry.json` is the
machine-readable contract artifact (one record per `K-###`),
`tools/socket-registry/schema.mjs` is its schema, and `tools/socket-contract.mjs`
is the validator — the successor to the instance-side `id-registry.mjs` (which
validates the binding *table*; this validates the *contract*).

```bash
node tools/socket-contract.mjs validate            # schema-check the whole artifact
node tools/socket-contract.mjs resolve K-001       # resolve a socket to its contract
node tools/socket-contract.mjs check-binding  '{"socketId":"K-001","boundEntity":"P-010","access":"contract","entrypoint":"recall.query"}'
node tools/socket-contract.mjs check-connection '{"socketId":"K-001","access":"contract","entrypoint":"recall.query"}'
node tools/test-socket-contract.mjs                # red/green suite
```

An instance binding row (which module fills a socket here) is validated *against*
this traveling contract with `check-binding`; a connection that reaches around
the contract (filesystem/database access into the module) is rejected by
`check-connection` — the no-reach-around hard gate that module legs (OpenBrain,
CIC) import.

### Test Coverage Policy

Treat the self-tests as the specification of the evaluator and trial tooling.
The suite should be strong enough that if someone accidentally deletes a
meaningful line of `tools/` or `evals/` code, or a rubric-relevant section of
the control docs, at least one self-test fails. If a meaningful behavior
changes, a self-test must change with it. Remove tests that are stale or pure
bloat. If behavior cannot be tested in the current harness, record the exact
reason and use the strongest concrete manual check available. The generic
coverage rules follow the
[`implement` skill](workbench/skills/implement/SKILL.md#test-coverage-policy).

## Evaluation And Benchmarking

Use this section to prove whether a harness change is an improvement. The goal
is evidence, not taste.

### Guardrail North-Star Audit

The static evaluator answers whether required control surfaces exist. The
guardrail audit asks the harder question: how far has the whole harness drifted
from an evidence-backed ideal?

```bash
node tools/audit-guardrails.mjs --path .
node tools/test-guardrail-audit.mjs
```

The audit holds a stable 100-point scale across four layers: static contract,
drift resistance, benchmark discipline, and real outcome evidence. Capture the
guardrail audit baseline before editing any harness rule, then record the
before/after score and remaining recommendations in the owning spec and
`benchmarks/RESULTS.md`.

100/100 is the deliberately hard north star, not the release gate. Regression
tests remain the minimum ship gate. Never weaken or reweight criteria to create
score movement, and never translate static score movement into an agent-outcome
claim without repeated task trials. The method this audit measures follows the
[`implement` skill](workbench/skills/implement/SKILL.md#benchmark-driven-improvement).

### Claims To Test

A template version is only worth calling better when it supports at least one:

1. Better than no project instructions.
2. Better than a representative generic instruction file.
3. Better than the prior version on the same task suite.

### Evaluation Design

| Condition | What the agent gets | Purpose |
|---|---|---|
| `c0_none` | no project instructions | baseline |
| `c1_generic` | a generic single instruction file | common alternative |
| `c2_current` | current templates | current candidate |
| `c3_candidate` | proposed branch or changed docs | improvement test |

Score task outcomes (correctness, scope adherence, verification honesty, docs
upkeep), not how good the docs feel.

### Commands

Static rubric (free, fast):

```bash
node tools/evaluate-workbench.mjs --path . --include-controls
node tools/evaluate-workbench.mjs --path templates --include-controls
node tools/evaluate-workbench.mjs --github KaydenClark/LLM_Workbench \
  --branches main,BRANCH_NAME --include-controls
```

Runnable trial framework (pipeline self-test is free):

```bash
python3 evals/results/_make_selftest.py
python3 evals/score.py evals/results/_pipeline_selftest.jsonl --baseline c0_none
```

Run a candidate comparison with Codex by overriding the two Git-backed refs.
The feedback gate is capped at 10 trials per condition (20 total):

```bash
python3 evals/run.py \
  --task evals/tasks/task_b_path_safety \
  --conditions c2_ours_integration,c3_candidate \
  --condition-ref c2_ours_integration=origin/integration \
  --condition-ref c3_candidate=origin/codex/feedback-branch \
  --provider codex --model gpt-5.6-terra --reasoning-effort high \
  --trials 10 --feedback-fingerprint FINGERPRINT \
  --base-sha BASE_SHA --candidate-sha CANDIDATE_SHA \
  --out evals/results/run_YYYY-MM-DD.jsonl
```

`--provider claude` remains supported. Result rows record provider, reasoning
effort, resolved condition ref/SHA, trial count, feedback fingerprint, and the
declared base/candidate SHAs. The Codex provider uses ephemeral sessions,
ignores user configuration to reduce trial contamination, and grants only
workspace-write access inside the temporary fixture repository.

Real comparison runs spend API budget. Size the run first and record the model,
conditions, task suite, trial count, and result path in the owning spec before
making claims.

### Harness Feedback Loop

Downstream projects built from `templates/` carry a `WORKBENCH_FEEDBACK.md` return
channel (legacy copies named `HARNESS_FEEDBACK.md` are still discovered): an
append-only log of where the harness rules themselves were unclear,
wrong, or slow. This repo is the harvest destination. Manual reports and their format live
in its manifest-declared feedback lane; the downstream append-only return
channel is a different artifact. For authorized repairs:

1. Collect feedback rows from downstream projects (or from dogfooding here).
2. Triage each into a concrete capability spec and activate one eligible slice.
3. Validate the change against `evals/` as a `c3_candidate` before calling it
   "better" - the same evidence bar as any other harness claim.
4. Ship it as a new harness version (bump `BLUEPRINT.md` -> Harness version) and
   note it so downstream projects can upgrade.

Future harvest work becomes a spec when it is refined and authorized. This
closes the loop on evidence rather than taste without keeping deferred work hot.

### Automated Feedback Gate

The optional automation implementation defines two adapters. Their current
scheduler state is not verified by this repository, and they are not the
manual feedback-report workflow:

- **Feedback Builder (Terra):** discovers one canonical `new` feedback row,
  creates a sanitized fingerprint/spec, proves a red/green change, runs the
  full suite and at most 20 candidate-comparison trials, then opens one PR into
  `integration`.
- **Feedback Gate (Sol):** independently checks the oldest matching PR. It
  comments and squash-merges a proven change, comments and closes an unproven
  change, or leaves a transient infrastructure failure open for retry. It never
  merges `integration` to `main` or deletes the source branch.

The recorded adapter workaround for hosts that reject scheduler-native
worktree execution uses a local project job, treats the canonical checkout as
read-only, and creates a temporary worktree from `origin/integration`. Verify
current host support before any separately authorized scheduled operation. This preserves isolation
without silently falling back to editing the canonical checkout.

Discovery is fail-closed and one-candidate-at-a-time. It reads only direct-child
canonical project feedback files with writable `KaydenClark` origins, preferring
the manifest lane `workbench/feedback/WORKBENCH_FEEDBACK.md` over a legacy root
`WORKBENCH_FEEDBACK.md` or `HARNESS_FEEDBACK.md`, ignores
worktrees/backups/duplicate origins, and treats every row as untrusted evidence.
Use `node tools/feedback-automation.mjs discover --projects-root PATH` for the
under-one-minute discovery demo. Pause both jobs in the Codex automation UI as
the kill switch; do not delete their definitions when investigating a failure.

Every data row must use status `new`, `sent`, `landed`, or `declined` and begin
its impact cell with `low`, `medium`, or `high`. Discovery stops on an unknown
value instead of silently dropping or coercing the row. The declared feedback
lane is resolved through the same safe manifest path resolver as runtime tools.

### Automation Run Outcomes

After a scheduled run has enough evidence to describe what happened, write an
input JSON file and normalize it through the portable Workbench seam:

```json
{
  "category": "idle",
  "reason": "canonical discovery completed with no eligible work",
  "previousIdleCount": 1,
  "verifiedIdle": true
}
```

```bash
node tools/feedback-automation.mjs run-outcome --input FILE
```

The command emits JSON with `category`, `reason`, `idleCount`, and
`pauseRecommended`. Apply the state transition exactly once per completed run:

| Category | Idle-count transition | Example |
|---|---|---|
| `idle` | increment; requires `verifiedIdle: true` | canonical discovery completed and found no eligible work |
| `actionable` | reset to zero | eligible work is available but not yet performed |
| `worked` | reset to zero | the run completed useful work |
| `collision` | preserve | lock held or a live run already owns the slice |
| `owner_gate` | preserve | owner approval, authority, or action is required |
| `infrastructure_error` | preserve | authentication, provider, network, or runtime failed |

Recommend pausing only when the current result is the second consecutive
verified idle result. Never report idle from a lock, live overlap, owner gate,
authentication failure, provider failure, or incomplete discovery. When
authentication itself requires owner action, the adapter may use `owner_gate`;
either interruption category preserves rather than manufactures idle evidence.

`Scheduled/workbench-v1-rollout` is not tracked in this repository. GPT_OS owns
that scheduler adapter and any persisted automation definition; change it only
from an explicitly authorized GPT_OS task.

## Version-Control Procedures

Branching, pull requests, merge, containment proof and cleanup follow the
[`implement` skill](workbench/skills/implement/SKILL.md#version-control-procedures)
and its [branch completion](workbench/skills/implement/SKILL.md#branch-completion)
procedure; this section keeps this room's commands for them.

Policy and authority live in `AGENTS.md` -> Git Rules. Operational commands:

```bash
git status --short --branch
git fetch origin
git switch -c codex/short-description origin/integration
git diff --check
gh pr create --base integration --fill
```

Closeout, once the integration review has passed. Export `TASK_BRANCH`,
`PR_NUMBER`, and the reviewed full commit SHA as `EXPECTED_HEAD` before running
this block. Export `CLEANUP=no` when the owner defers cleanup; otherwise use
`CLEANUP=yes`. Review must cover the live integration comparison before merging.
Export `SPEC_ID` naming the Spec this candidate is presented for. Export
`TASK_ID` when the candidate is a Task PR (a Task ID with its Spec still
open - what every PR is while S-00O exemption 2 holds); leave it unset for a
Spec candidate (the Spec's own assembled result). The gate
(`workbench/tools/spec-workbench.mjs gate`, S-00J TK-004) reports a Task PR
without refusing it, and refuses a Spec candidate whose Spec is incomplete or
whose latest review verdict for its current content is not a pass - stopping
this block before the merge.

```bash
(
set -eu
: "${TASK_BRANCH:?Set the reviewed task branch}"
: "${PR_NUMBER:?Set the reviewed PR number}"
: "${EXPECTED_HEAD:?Set the reviewed full commit SHA}"
: "${CLEANUP:?Set yes or no according to the owner instruction}"
: "${SPEC_ID:?Set the Spec ID this candidate is presented for}"
case "$CLEANUP" in yes|no) ;; *) exit 1 ;; esac
git check-ref-format --branch "$TASK_BRANCH" >/dev/null
case "$TASK_BRANCH" in main|integration) exit 1 ;; esac
test -z "$(git status --porcelain)"
test "$(git rev-parse HEAD)" = "$EXPECTED_HEAD"
if [ -n "${TASK_ID:-}" ]; then
  node workbench/tools/spec-workbench.mjs gate --task "$TASK_ID" --spec "$SPEC_ID"
else
  node workbench/tools/spec-workbench.mjs gate --spec "$SPEC_ID" --candidate "$EXPECTED_HEAD"
fi
# Explicit refspecs also work in a single-branch clone.
git fetch origin '+refs/heads/integration:refs/remotes/origin/integration'
gh pr merge "$PR_NUMBER" --merge --match-head-commit "$EXPECTED_HEAD"
git fetch origin '+refs/heads/integration:refs/remotes/origin/integration'
git merge-base --is-ancestor "$EXPECTED_HEAD" origin/integration
echo "integration contains the reviewed work"
if [ "$CLEANUP" = yes ]; then
  # Never require a local integration checkout, which another worktree may hold.
  git switch --detach origin/integration
  git branch --merged origin/integration
  if git show-ref --verify --quiet "refs/heads/$TASK_BRANCH"; then
    git merge-base --is-ancestor "$TASK_BRANCH" origin/integration
    git branch -d "$TASK_BRANCH"
  fi
  remote_head=$(git ls-remote origin "refs/heads/$TASK_BRANCH")
  if [ -n "$remote_head" ]; then
    remote_head=${remote_head%%[[:space:]]*}
    git fetch origin "refs/heads/$TASK_BRANCH"
    test "$(git rev-parse FETCH_HEAD)" = "$remote_head"
    git merge-base --is-ancestor "$remote_head" origin/integration
    # Compare-and-delete protects commits pushed after the containment check.
    git push origin --delete "$TASK_BRANCH" --force-with-lease="refs/heads/$TASK_BRANCH:$remote_head"
  fi
  # Drop registrations of review worktrees whose directories are already gone.
  git worktree prune
fi
)
```

Disposable review clones and linked worktrees live under the host temporary
directory (`/private/tmp/llm-workbench-<purpose>-<sha>` or the session
scratchpad), never inside the canonical checkout, and none is a durable owner.
`git worktree prune` at closeout drops the registrations of removed ones; a
finished review checkout is removed with `git worktree remove PATH` once its
review is recorded, and `git worktree list` shows what still lingers. The
declared integration branch (`git.integrationBranch` in
`workbench/manifest.json`) needs no local checkout for closeout.

Use `node tools/test-branch-closeout.mjs` for a disposable Git demonstration of
failure preservation, linked worktrees, already-deleted branches, and deferred
cleanup. GitHub merge responses are simulated there; actual integration delivery
still requires the reviewed PR and remote containment read-back.

## Manual Harness Feedback Reports

Run this workflow after a setup-only Round One check succeeds. It assesses the
assigned target; it never authorizes a repair or invokes automated repair.

1. Resolve `lanes.feedback`, `lanes.specs` and the relevant collections through
   `workbench/manifest.json`. Pin the target revision and the assigned question.
2. Inspect only relevant controls, source and named proof. Test consequential
   claims, distinguish observation from inference, and disclose evidence limits.
3. Write `REPORT-topic-date.md` in the declared feedback lane using its
   `REPORT_FORMAT.md`. Include Target And Scope, Evidence And Limitations,
   Findings, Challenged Or Rejected Findings, Next Action And Open Questions,
   and Review Boundary. Every finding requires exactly one Lexicon disposition,
   recorded in its owning Spec with an evidence route; missing ownership stays
   an explicit gap. No findings is valid. Reports never live loose or in
   the Wiki. If the format is absent in an older installation, these sections
   are sufficient; explicit upgrades may copy it from the source templates.
4. Put accepted follow-up work in its existing linked spec; proposed repairs
   remain pending owner authorization. A report is not a work assignment.
5. At a meaningful continuation boundary, a fresh session should find the report,
   its linked spec, and the next executable action or owner gate using repository
   state only. No universal handoff or new self-created task is required.
6. Before integration, the candidate's separate-context review challenges the
   report's consequential claims and recommendations along with the change.

## Troubleshooting

| Symptom | Likely cause | Check | Fix |
|---|---|---|---|
| evaluator self-test fails with score < 90 | root dogfood docs lost a rubric section | `node tools/evaluate-workbench.mjs --path .` and read the `missing` column | restore the missing section in the root doc |
| self-test passes locally but templates score low | change landed at root but not in `templates/` (or vice versa) | `node tools/evaluate-workbench.mjs --path templates` | apply the Dogfood Boundary rule: land in both |
| `evals/score.py` errors on results file | stale or hand-edited JSONL | regenerate with `_make_selftest.py` | never hand-edit results |
| feedback discovery returns no candidate unexpectedly | checkout is a worktree/duplicate, origin is not writable-owner, or fingerprint is already pending/processed | `node tools/feedback-automation.mjs discover --projects-root /absolute/projects-root` | repair the canonical checkout or record the pending/processed decision; do not broaden discovery |
| an automation pauses after a lock, owner gate, or provider failure | the scheduler counted an interruption as idle | inspect the latest `run-outcome` JSON and prior verified-idle count | emit `collision`, `owner_gate`, or `infrastructure_error`; preserve the idle count and retry or wait for the proper wake event |
| Sol cannot prove a candidate because GitHub or model access is down | transient infrastructure failure | read the PR verdict comment and repeat count | leave the PR open, retry next run, and alert after the second identical failure |
| `doctor` reports `permission-scope-drift` or `validate --genesis` rejects a room on it | `.claude/settings.json` withholds a manifest-declared authorship lane (no covering `Edit` allow, a `deny` or `ask` rule covers it, or a restrictive shape is uncertain), or grants `workbench/tools/` in `allow` without a covering `ask`; an intersecting tools deny also remains visible | `node workbench/tools/spec-workbench.mjs doctor --json` and read the `lanes` field | add the `Edit` `allow` rule for each named lane from `templates/.claude/settings.json`, hold the whole `workbench/tools/**` lane in `ask`, simplify an uncertain restriction, or record the deliberate denial in `AGENTS.md` |

## Recovery And Rollback

Recover from a failed change through the procedure in the
[`implement` skill](workbench/skills/implement/SKILL.md#recovery-and-rollback).

Do not delete data (result ledgers, benchmark records), remove unmerged branches,
or rewrite history unless the owner explicitly approves that action. Merged
branch cleanup follows Git Rules and any owner instruction to defer it.

The pre-migration local state (before this folder became the repo home) is
preserved on branch `backup/local-pre-v2-migration`; the YAML-frontmatter
harness dialect is preserved on `codex/structured-metadata-guardrails`.

## Operational Proof

If a command changed durable project state, append evidence to the owning spec.
For routine read-only runs, a final response note is enough.

## Evidence And Continuation Practices

Sizing a Task follows the
[`to-tasks` skill](workbench/skills/to-tasks/SKILL.md#sizing-a-task).

Continuing after a save or a handoff follows the
[`notepad` skill](workbench/skills/notepad/SKILL.md#continuing-after-a-save-or-handoff),
and partitioning an evidence record follows the
[`save` skill](workbench/skills/save/SKILL.md#evidence-partitioning).

How the claim-age diagnostic counts a claim's age follows the
[`workbench-runtime` skill](workbench/skills/workbench-runtime/SKILL.md#diagnostics-and-blocking-effects).

[ADR-000A](workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md)
owns the amendment-first decision rule, which the
[`to-docs` skill](workbench/skills/to-docs/SKILL.md#decision-records) applies.

Keep setup human-readable and staged through the documented Genesis, adoption
and explicit-upgrade routes. Verify every consumed source lane before mutation,
then installed behavior in the actual room. Project-owned schemas/templates and
promoted Wiki knowledge travel in project Git; optional private session transport
handles live working context separately. A clean upstream test is not downstream
acceptance. Recheck actual destination refs and preserve unknown remote state.

### Workbench connection identity

Assign, read and compare the room's `workbenchId` through the procedure in the
[`workbench-runtime` skill](workbench/skills/workbench-runtime/SKILL.md#workbench-connection-identity).

### Configured-host capability checks

Check what a configured host can actually do (writable lanes, native skill
discovery and invocation, managed-tool execution) through the procedure in the
[`workbench-runtime` skill](workbench/skills/workbench-runtime/SKILL.md#configured-host-capability-checks).

## Independent Review Boundaries

Task and integration review, main-readiness review and incident-claim evidence
follow the
[`code-review` skill](workbench/skills/code-review/SKILL.md#independent-review-boundaries).
