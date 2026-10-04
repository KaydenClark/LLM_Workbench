# [PROJECT_NAME] - Runbook

> Generated from LLM Workbench v[HARNESS_VERSION]. See Upgrading The Harness
> below.

**Last reviewed:** [YYYY-MM-DD]
**Blueprint reviewed:** [YYYY-MM-DD]
**Runtime owner:** [user / agent / service owner]
**Environment:** [local / LAN / staging / production]

This file explains how to operate, verify, recover, and evaluate the project. It
should be boring, exact, and executable.

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
| Coordinate roles and stances | You plan, dispatch, monitor or verify work as a role or a named stance. | [Role And Stance Coordination](#role-and-stance-coordination) |
| Choose the behavior for a request | A request arrives in ordinary language and you must pick the skills and endpoint it authorizes. | [Behavior Selection](#behavior-selection) |
| Check prerequisites | A fresh machine or clone needs this project's required tools confirmed. | [Prerequisites](#prerequisites) |
| Configure the environment | Local configuration or required variables must be created or checked. | [Environment Configuration](#environment-configuration) |
| Install | You set up a fresh clone. | [Install](#install) |
| Run locally | You start the project on a local machine. | [Run Locally](#run-locally) |
| Run the tests | A change needs its fast check or the full verification. | [Test And Build](#test-and-build) |
| Verify a behavior change | A behavior change needs its red/green test, its targeted test and the full verification suite before its result is claimed. | [implement](workbench/skills/implement/SKILL.md#engineering-and-verification); this room's suite: [Test And Build](#test-and-build) |
| Hold test coverage | You add or change tests, or judge whether coverage is enough. | [implement](workbench/skills/implement/SKILL.md#test-coverage-policy) |
| Run the Workbench runtime tools | You run doctor, selection, records, decision records or diagnostics from the installed tools lane. | [Workbench Lifecycle, Diagnostics, And Decision Records](#workbench-lifecycle-diagnostics-and-decision-records) |
| Deliver a Spec through its lifecycle | You pick up, deliver, review or close an assigned Spec and its Tasks. | [Spec Lifecycle And Retrieval](#spec-lifecycle-and-retrieval) |
| Pick, claim and close a Task | Every pickup or resume of assigned work: selection, claim, receipt, close and blocker rules. | [implement](workbench/skills/implement/SKILL.md#work-selection-and-lifecycle) |
| Work a Task as Worker | You select, claim, implement, record receipts for, self-check, close and hand back one Task. | [implement](workbench/skills/implement/SKILL.md#worker-selection-implementation-and-hand-back) |
| Review an assembled Spec | A Dispatcher assembles a candidate, or a separate Director reviews it and records the verdict before integration. | [dispatcher](workbench/skills/dispatcher/SKILL.md#dispatcher-and-separate-director-assembled-review) |
| Correct a failed review | A verdict or owner finding failed and its findings return to the still-open Spec. | [dispatcher](workbench/skills/dispatcher/SKILL.md#assembled-review-and-corrective-return) |
| Record owner Human QA and complete | The owner approves delivered work, or main containment must be proven before `complete`. | [director](workbench/skills/director/SKILL.md#owner-human-qa-and-main-before-complete); closure rules: [director](workbench/skills/director/SKILL.md#owner-closure-and-reconciliation) |
| Capture, retire or recover a completed Spec | After `complete`: feature capture, retirement, discard or recovery. | [director](workbench/skills/director/SKILL.md#documentation-feature-capture-retirement-and-recovery) |
| Allocate a visible identifier | You need a new Spec, Task, note or other visible identifier. | [Visible Identifiers](#visible-identifiers) |
| Use the Landmark Tracker | Concept understanding (DQCs, landmarks) changes, or the Tracker view is needed. | [Landmark Tracker: accepted design and available operations](#landmark-tracker-accepted-design-and-available-operations) |
| Keep a JSON notepad | Meaningful work needs a local note created, resumed, appended, trimmed or cleaned up. | [notepad](workbench/skills/notepad/SKILL.md#runtime-reference) |
| Read frozen history or recovery receipts | A legacy checkpoint is cited, or a recovery receipt or backup is needed. | [checkpoint](workbench/skills/checkpoint/SKILL.md#frozen-history-and-operational-recovery) |
| Transport sessions privately | Private session transport is configured and selected collections must sync. | [save](workbench/skills/save/SKILL.md#optional-private-session-transport) |
| Save, promote or add a room-local skill | Authorized work must be saved to its owners, or the room adds its own skill. | [save](workbench/skills/save/SKILL.md#how-save-and-promote-compose); room-local skills: [Portable Save, Promote And Room-Local Skills](#portable-save-promote-and-room-local-skills) |
| Promote claims to an owner | Selected supported claims must reach their durable owner. | [promote](workbench/skills/promote/SKILL.md#command-reference) |
| Evaluate a harness change | You must show that a harness change is an improvement. | [Evaluation And Benchmarking](#evaluation-and-benchmarking) |
| Transfer work through a handoff | Work goes to another agent or chat as a job, investigation, report or update. | [handoff](workbench/skills/handoff/SKILL.md#transfer-procedure) |
| Improve against a benchmark | Agent rules, control docs, evaluation criteria or process change and need a baseline first. | [implement](workbench/skills/implement/SKILL.md#benchmark-driven-improvement) |
| Pick the claims to test | An evaluation must name the claim it tests. | [Claims To Test](#claims-to-test) |
| Design an evaluation | You set up task-outcome scoring or trials. | [Evaluation Design](#evaluation-design) |
| Run the evaluation commands | You run the static evaluator or the trial framework. | [Workbench Evaluation Commands](#workbench-evaluation-commands) |
| Return harness feedback | A lesson about the harness rules belongs in the feedback return channel. | [Harness Feedback Loop](#harness-feedback-loop) |
| Operate project data | The project has seed data, migrations, imports, local databases or generated feeds. | [Data Operations](#data-operations) |
| Deploy or start services | The project has deployment, scheduled jobs or service startup. | [Deployment Or Startup](#deployment-or-startup) |
| Branch and open a pull request | You create a task branch or open a PR into integration, or need this room's Git commands. | [implement](workbench/skills/implement/SKILL.md#version-control-procedures); this room's commands: [Version-Control Procedures](#version-control-procedures) |
| Merge, prove containment and clean up a branch | The integration review passed: merge the reviewed candidate, prove integration contains it and delete the merged branch. | [implement](workbench/skills/implement/SKILL.md#branch-completion); this room's closeout commands: [Version-Control Procedures](#version-control-procedures) |
| Upgrade the harness | The project moves to a newer Workbench version. | [Upgrading The Harness](#upgrading-the-harness) |
| Write a manual harness feedback report | A setup-only Round One check succeeded and an assessment is assigned. | [Manual Harness Feedback Reports](#manual-harness-feedback-reports) |
| Troubleshoot a known failure | A command fails with a symptom listed there. | [Troubleshooting](#troubleshooting) |
| Recover or roll back | A change fails and its touched files must be restored or reverted. | [Recovery And Rollback](#recovery-and-rollback) |
| Record operational proof | A command changed durable project state. | [Operational Proof](#operational-proof) |
| Size and continue work | You size a Task or leave work a fresh context can resume. | [Evidence And Continuation Practices](#evidence-and-continuation-practices); [notepad](workbench/skills/notepad/SKILL.md#continuing-after-a-save-or-handoff); [save](workbench/skills/save/SKILL.md#evidence-partitioning); [to-tasks](workbench/skills/to-tasks/SKILL.md#sizing-a-task) |
| Check the Workbench connection identity | The room's `workbenchId` is created, read or compared. | [Workbench connection identity](#workbench-connection-identity) |
| Check configured-host capabilities | A host is set up, or its lanes, skill discovery or tool execution are in doubt. | [Configured-host capability checks](#configured-host-capability-checks) |
| Review a candidate independently | A candidate needs separate-context review before integration, or a main-readiness or incident-claim review is requested. | [code-review](workbench/skills/code-review/SKILL.md#independent-review-boundaries) |

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

### Role And Stance Coordination

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

- [tool and version]
- [tool and version]

Required accounts/services:

- [service]
- [service]

Required local files:

- `[path]` - [purpose / how to create safely]

## Environment Configuration

Create local config from the example:

```bash
[COPY_ENV_COMMAND]
```

Required variables:

| Variable | Purpose | Secret? | Example / Notes |
|---|---|---|---|
| `[ENV_VAR]` | [purpose] | [yes/no] | [placeholder only] |

Rules:

- Do not commit real `.env` files, tokens, local databases, logs, or private
  data.
- Keep secrets server-side or local-only.
- Prefer degraded states over fake data when an external source is unavailable.

## Install

```bash
[INSTALL_COMMAND]
```

Expected result:

- [what success looks like]

## Run Locally

```bash
[RUN_COMMAND]
```

Open:

- [local URL, CLI command, or service endpoint]

Expected result:

- [health response / visible UI / log line]

## Test And Build

Fast check (the targeted test for a change):

```bash
[FAST_TEST_COMMAND]
```

Full verification is the one full verification suite list below. `AGENTS.md`
[Engineering And Verification](AGENTS.md#engineering-and-verification) requires
it to pass before a change's result is claimed; the red/green steps and their
order follow the
[`implement` skill](workbench/skills/implement/SKILL.md#engineering-and-verification).

```bash
[FULL_TEST_COMMAND]
[BUILD_COMMAND]
[LINT_OR_AUDIT_COMMAND]
[SPEC_DOCTOR_COMMAND]
```

Expected result:

- [pass condition without hardcoding stale counts unless recently verified in
  `TASKBOARD.md`]

### Test Coverage Policy

Treat tests as the project specification: if someone accidentally deletes a
meaningful line, at least one test or documented manual check fails, and tests
that are stale or pure bloat are removed. The coverage rules follow the
[`implement` skill](workbench/skills/implement/SKILL.md#test-coverage-policy).

## Workbench Lifecycle, Diagnostics, And Decision Records

The project runs its own installed runtime tools from the manifest-declared
tools lane:

```bash
node workbench/tools/spec-workbench.mjs next --json
node workbench/tools/spec-workbench.mjs show S-###
node workbench/tools/spec-workbench.mjs claim S-### --agent NAME
node workbench/tools/spec-workbench.mjs close S-### --proof "..." --docs "..." --remaining-gap "..."
node workbench/tools/spec-workbench.mjs render
node workbench/tools/spec-workbench.mjs doctor
node workbench/tools/adr.mjs new --title "Decision title"
node workbench/tools/adr.mjs new --kind ddr --title "Destination decision title"
node workbench/tools/adr.mjs validate
node workbench/tools/adr.mjs register
node workbench/tools/adr.mjs accept DDR-####
node workbench/tools/adr.mjs supersede ADR-#### --by ADR-####
node workbench/tools/adr.mjs deprecate DDR-#### --reason "Why it ends"
node workbench/tools/adr.mjs list
node workbench/tools/adr.mjs show DDR-####
node workbench/tools/adr.mjs search "query"
node workbench/tools/adr.mjs history ADR-####
node workbench/tools/adr.mjs inspect DDR-#### --field canonicalized_in
```

`doctor` prints every registered finding with its severity and blocking
effect and exits non-zero only for `all` or `selection` findings; a
`selected-slice` finding is excluded by `next` and refused by `claim`, and an
`attention` finding stays visible without blocking. `doctor` also reads this
room's `workbench/skills` lane and its `.agents/skills` and `.claude/skills`
adapters, never a provider home: `skill-lane-missing` and
`skill-lane-unreadable` are errors with effect `none` (repair them with the
release checkout's `workbench-skills.mjs install` or `update
--explicit-update`; the Genesis readiness gate fails closed on them),
`skill-adapter-missing` and `skill-adapter-broken` are attention findings
(a host that checked an adapter out as a plain file instead of a link reports
`skill-adapter-broken`), and a root `skills/` directory is
`project-local-skills`, which blocks everything because it shadows the lane.
An operations index row that points to a skill the lane lacks is the
attention finding `skill-pointer-dangling`; doctor reads only the index and
the lane copy to decide which skill binds.
Filesystem discovery is distinct from configured-host invocation. `doctor` also reports
`integration-branch-undeclared` and `integration-branch-missing` (scope
`git`, effect `none`) until `workbench/manifest.json` `git.integrationBranch`
names a branch that resolves locally or on a remote; the Genesis readiness
gate fails closed on the same two conditions. When that branch resolves and
the spec `next` would select is already complete there, `doctor` reports
`complete-on-integration` (attention) without hiding the work. `doctor`
reports `detached-head` and `untracked-controls` (scope `git`, attention,
effect `none`) for a detached HEAD and for untracked files under the root
controls, the ADR collection or the spec lane; neither blocks, because `close`
refuses the false completion claim itself. Decision records live in
`workbench/docs/adr/`; an accepted record names the control that carries its
operational owners in `canonicalized_in`. Active accepted decision claims are
architectural Canon. `register` derives active `REGISTER.md` and complete
`HISTORY.md`; supersession uses one whole-record `superseded_by` filename and
deprecation requires `deprecation_reason`. Historical bodies remain unchanged.
Destination Decision Records have their own manifest-declared `ddr` collection
at `workbench/docs/ddr/`, with the same `proposed/` and `archive/` lifecycle
folders. `workbench-layout.mjs init` creates it; for a room stamped before it,
`workbench-layout.mjs migrate --project PATH` from the release checkout appends
each missing additive collection (`features`, then `ddr`) and changes no ADR
record or other manifest key. The same tool writes and checks both kinds of
record: `new --kind ddr` writes a `DDR`-identified record into `ddr/proposed/`
with the keys `date`, `supersedes` and `canonicalized_in`, and refuses a room
whose manifest does not declare the collection. A DDR's `canonicalized_in`
never names the Wiki; validation reports that and the ADR rules applied to a
DDR as `invalid-ddr`. A DDR that changes or contradicts the Blueprint names
`BLUEPRINT.md` in `canonicalized_in`. `validate` and `register` act on every
decision-record collection present; `--kind adr` or `--kind ddr` limits them to
one. `accept`, `supersede` and `deprecate` move a record by folder for either
kind, addressed by its `ADR-` or `DDR-` identifier: `accept` takes a
`proposed/` record to the top level and refuses one that would be invalid as
accepted; `supersede` archives an accepted record under exactly one accepted
successor of the same kind and records `superseded_by` and `supersedes`;
`deprecate` archives an accepted record with a one-line `deprecation_reason`.
Each refuses a dirty Git tree, renames with `git mv`, repairs live links while
leaving append-only evidence untouched, regenerates both registers, and writes
nothing when it refuses. Both kinds answer the five read words: `list` the
records that exist, `show` one whole record (`get` is a synonym), `search`
records by a literal query (a superseded hit names its successor), `history`
the lifecycle chain and the Git commits that touched the record, and
`inspect` one `--field` or a `--lines START:END` range. Reads never write and
take `--json`.

`permission-scope-drift` is reported when `.claude/settings.json` exists and
withholds a manifest-declared authorship lane (no covering `Edit` `allow` rule,
a `deny` or `ask` rule covers it, or a restrictive pattern is uncertain), or
grants `workbench/tools/` in `allow` without a covering `ask` holding the whole
lane; an intersecting tools deny also remains visible. It names each lane,
never blocks, and never edits the file. Claude Code applies `Edit` rules to every built-in
file-editing tool. Resolve the finding by adding the
`Edit(./workbench/<lane>/**)` rules, holding `workbench/tools/**` in `ask`,
simplifying an uncertain restriction, or recording the deliberate restriction
in `AGENTS.md`. The Genesis readiness check fails closed on the same finding;
a room without the file is unaffected.

The wiki lane raises `room-brain-unrouted` (attention) when a root control does
not route back to the room brain: `AGENTS.md` must reference `workbench/wiki/`
and `README.md` must reference `MEMORY.md`; the finding names the control that
lacks the route, and a room whose manifest declares a different wiki lane path
sees it until its controls name that lane. It raises `stale-stamp` (attention)
when a wiki contract file or the room brain carries a `Generated from LLM
Workbench` stamp naming a version other than `workbench/manifest.json`; refresh
the stamp when the harness is upgraded (`validate --genesis` fails the same
files with `version-mismatch`).

### Spec Lifecycle And Retrieval

Use this sequence for one assigned Spec and its Task records. Examples name
S-001/TK-001; substitute the actual IDs and quoted values. These are separate
role checkpoints, not one unattended script: a Worker supplies self-check,
the Dispatcher owns whole-Spec QA, a separate Director reviews the immutable
candidate, and only the owner supplies Human QA approval and main promotion.
Review and owner actions are separate responsibilities, never an unattended approval script.
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

### Visible Identifiers

```bash
node workbench/tools/spec-workbench.mjs next-id --prefix S --json
node workbench/tools/spec-workbench.mjs next-id S-### --prefix TK --json
node workbench/tools/adr.mjs new --title "Decision title"
node workbench/tools/notepads.mjs allocate --prefix N --objective OBJECTIVE_KEY --title "TITLE"
node workbench/tools/spec-workbench.mjs widen-id S-###
node workbench/tools/spec-workbench.mjs widen-id TK-### --spec S-###
```

`next-id` is a read-only proposal, not a reservation or permission to create work.
Task proposals require the assigned spec and reserve labels from all specs in
the Workbench. Both proposals also reserve retired and discarded labels and
every Spec and Task ID held at a remote-tracking tip, so fetch first. Write the
returned label only during authorized planning, then render and run doctor
before requesting another. ADR `new` (and `new --kind ddr` for a DDR) writes a
proposed record through the existing exclusive-publication path and also
reserves that kind's labels held at every remote-tracking tip. Notepad `allocate` creates the note its returned ID names.

Specs, Tasks, ADRs and notepads share one artifact policy: a new label's suffix
uses uppercase `0-9A-Z`, has minimum width four and contains at least one
letter (`S-000A`, `TK-000A`, `ADR-000C`, `N-000A`), so it cannot reuse a
historical decimal ID that is no longer present. Width grows without truncation
or recycling. Every spelling of one identity is reserved: suffixes compare
case-folded with leading zeros removed (the collision key), so a legacy short
`S-00Q`, its widened `S-000Q` and a lowercase `S-00q` are one identity and are
never allocated twice. Sorting removes leading zeros, then orders by suffix
length and then by `0-9`, `A-Z` and legacy `a-z`, independent of locale; it is
label ordering, not creation chronology. Letter-bearing task labels are unique
across the room; legacy numeric task references retain their existing
spec-qualified scope and are not claimed globally unique.

Existing records keep their stored IDs, paths and bytes; allocation never
renames them. Public Spec and Task commands (`show`, `claim`, `close`,
`move-spec`, `move-task`, blockers, the `next-id` parent and the other
selectors) accept any spelling that shares the stored record's collision key
and act on that one record, reporting its stored ID and path. Task selectors
stay Spec-qualified. Two stored records behind one key, including an active
record and a retired one, refuse by name rather than choosing a winner.
Notepad `--id` resolves the same way, and ADRs or notes whose records alias
one identity refuse allocation.

`widen-id` is the explicit identity-only touch. An agent starting substantive
work on a planned, active or blocked Spec, or on an open Task record under one,
runs it once from a clean tree to widen that record to the width-four spelling
of its own collision key (`S-00Q` to `S-000Q`, numeric `TK-001` to `TK-0001`;
`--spec` names the parent when a numeric Task label is ambiguous). It renames
the record directory, rewrites the ID field and title, keeps the previous
spelling in one `**Former ID:**` field directly under the ID field, and repairs
live links with the lifecycle moves' reference rewrite. Evidence rows stay
byte-identical; their links to the old path are counted as historical and
doctor reports them as attention-only broken links. The former spelling keeps
resolving. It never changes status, a repeat run is a no-op, and it refuses
complete, reviewed, done and retired records, a dirty tree, an occupied
destination or alias and an unsafe record path before writing anything. Like
`move-spec` it stages the change and commits nothing; commit it as its own
candidate. Never bulk-widen: a read-only inventory at QA/verify time finds open
records still short.

Spec parsing, selection, blockers, claim/close, rendering, Genesis readiness,
ADR registers, Wiki copied-task-state checks, guardrail contradiction checks and
citation-anchor coverage accept the new syntax. Existing numeric, short and
mixed-case syntax remains readable. Socket/team registry IDs and internal entry
sequence IDs keep their existing formats; these commands do not allocate those
artifact types. Workbench connection identities (`WB-` plus 22 characters)
keep their separate base-62 alphabet; the artifact policy does not apply to
them.

### Landmark Tracker: accepted design and available operations

The Landmark Tracker distinguishes evolving concept understanding from delivery
state. DQCs and landmarks maintain the former; the generated Tracker displays
it; Specs and Tasks carry implementation and Taskboard projects their state.
The intended root is `workbench/landmark-tracker/`, containing generated
`TRACKER.json` and flat `destination-questions/` and `landmarks/` JSON records.
These paths are a delivery contract, not evidence of installed collections or
commands. Resolve availability from the actual manifest and verified runtime;
do not invent a Tracker invocation or use an existing command as its substitute.

Once implemented, workflow transitions and ongoing alignment maintain source
records with what changed, why and evidence. Keep original grilling questions
and corrections reachable. DQCs may precede a landmark, Spec, Task or known Wiki
destination; an answered question records Expected result, while Result records
achieved delivery. Assess the actual durable content before claiming Verified;
Task completion, article existence and structural validation alone are insufficient.
Keep live links current through supported move operations and retain immutable
citations for historical proof. Ignored notes require their own retention or
safe transfer until reconciliation; tracked Git history does not recover them.

A Landmark Wiki page is the landmark's evolving synthesis, updated whenever
one of its question cards changes. Identifiers on it, as on every Wiki page,
carry the artifact's name and context; the structured records keep
identity-bearing provenance and delivery evidence.
Ordinary feature explanations and cross-cutting design models retain their
respective Wiki purposes. Collection/schema support must be delivered and
verified before claiming those article types are available. Routine Wiki work
within an authorized assignment adds no independent publishing ceremony.

### JSON Notepads

Create, resume, read, append to, trim, migrate or delete a local JSON notepad,
and allocate its visible identifier, through the procedure in the
[`notepad` skill](workbench/skills/notepad/SKILL.md#runtime-reference).

### Frozen History And Operational Recovery

Existing checkpoints stay frozen, and recovery receipts and backups live in the
ignored recovery collection; read or restore them through the procedure in the
[`checkpoint` skill](workbench/skills/checkpoint/SKILL.md#frozen-history-and-operational-recovery).

### Optional Private Session Transport

Configure, push, resume and reconcile optional private session transport
through the procedure in the
[`save` skill](workbench/skills/save/SKILL.md#optional-private-session-transport);
ordinary local notepad commands stay independent of it.

### Portable Save, Promote And Room-Local Skills

How `save` and `promote` compose is in the
[`save` skill](workbench/skills/save/SKILL.md#how-save-and-promote-compose).
The core catalog and room-local skill rules follow.

The core machine catalog is `coreSkills` in the layout runtime; documentation
and tests derive its size from that catalog. The current candidate includes
save/promote while preserving checkpoint as a no-write compatibility notice.
The v3.1.4 eighteen-skill manifest policy remains readable as a frozen legacy
row; adding candidate source does not publish or stamp v3.2.0.

The core skills live in this room's `workbench/skills` lane, laid down from
the LLM Workbench release with a receipt (`.workbench-skills.json`) naming the
source release, commit and a hash per skill. The tracked `.agents/skills`
(Codex) and `.claude/skills` (Claude Code) links resolve into the lane, so a
fresh clone discovers every core skill with no provider home. Check the lane
from the release checkout with `node tools/workbench-skills.mjs verify
--project PATH`; `doctor` reports `skill-lane-missing`, `skill-lane-unreadable`,
`skill-adapter-missing`, `skill-adapter-broken` and `project-local-skills`
without repairing them, and `skill-pointer-dangling` for an index row that
points to a skill the lane lacks.

For an authorized room-specific extension, keep its sole source in the lane at
`workbench/skills/NAME/SKILL.md`. Choose a name absent from required core;
preserve any collision for explicit reconciliation. Both hosts discover it
through the existing adapters, and `verify` lists it under `roomLocal` and
never replaces or removes it. On Windows, confirm the host checked the adapter
links out as links; inability to do so leaves that discovery gate open. Do not
duplicate implementation bytes, add a root `skills/`, or add `.codex/skills`.
Invoke the extension in the actual configured application: file presence and
a resolving adapter alone do not prove native discovery or callability.

Laying the lane down does not publish room-local source into a personal
catalog. That is a separately authorized operation, and a personal catalog is
never on this room's critical path. A new room needs no local extension and no
personal catalog for core save/promote/notepad operation.

### Direct Owner Promotion

Reconcile selected supported claims into an existing durable owner with
`sessions.mjs promote` through the procedure in the
[`promote` skill](workbench/skills/promote/SKILL.md#command-reference).

## Evaluation And Benchmarking

Use this section to prove whether the workbench or project process is improving.
The goal is evidence, not taste.

### Handoff Transfer

Prepare a handoff for a specified receiving context and release a retaining
source through the procedure in the
[`handoff` skill](workbench/skills/handoff/SKILL.md#transfer-procedure), within
the [role boundaries](AGENTS.md#handoff-assignments-and-shared-context).

### Benchmark-Driven Improvement

Capture the available guardrail or benchmark baseline before changing agent
rules, control docs, evaluation criteria, or the working process. The procedure
follows the
[`implement` skill](workbench/skills/implement/SKILL.md#benchmark-driven-improvement).

### Claims To Test

The harness or process is only worth calling better when it can support at least
one of these claims:

1. Better than no project instructions.
2. Better than a representative generic instruction file.
3. Better than the prior version on the same task suite.

### Evaluation Design

Use controlled conditions:

| Condition | What the agent gets | Purpose |
|---|---|---|
| `c0_none` | no project instructions | baseline |
| `c1_generic` | a generic `AGENTS.md` / `CLAUDE.md` style file | common alternative |
| `c2_current` | current project or template docs | current candidate |
| `c3_candidate` | proposed branch or changed docs | improvement test |

Score task outcomes, not how good the docs feel. Useful dimensions:

| Dimension | What it measures |
|---|---|
| Correctness | hidden or independent acceptance check passes |
| Scope adherence | changed files stay inside the task allowlist |
| Verification honesty | final claims match independently rerun checks |
| Docs upkeep | stale docs were updated or explicitly marked unchanged |

Run multiple trials per condition when using stochastic agents. Report effect
size and confidence interval when possible. Do not claim broad proof from one
run.

### Workbench Evaluation Commands

For this template repo, the static evaluator checks control-surface coverage:

```bash
node tools/test-evaluate-workbench.mjs
node tools/evaluate-workbench.mjs --path . --include-controls
```

The runnable trial framework lives in `evals/`:

```bash
python3 evals/results/_make_selftest.py
python3 evals/score.py evals/results/_pipeline_selftest.jsonl --baseline c0_none
```

Real comparison runs may spend API budget. Size the run first and record the
model, conditions, task suite, trial count, and result path before making claims.

### Harness Feedback Loop

This project's `WORKBENCH_FEEDBACK.md` is the return channel to the upstream
harness. Lessons logged there feed harness changes, which must clear the same
bar as any other "better" claim: a proposed template change is `c3_candidate`
above, tested against the current docs on the same task suite before it ships.
Feedback flows out; validated improvements flow back in as a harness upgrade
(Upgrading The Harness, above). Taste alone never closes the loop; evidence does.

## Data Operations

Use this section only if the project has seed data, migrations, imports, local
databases, or generated feeds.

Seed/import:

```bash
[SEED_OR_IMPORT_COMMAND]
```

Migration:

```bash
[MIGRATION_COMMAND]
```

Backup/restore:

```bash
[BACKUP_OR_RESTORE_COMMAND]
```

Safety rules:

- [what data this command may modify]
- [what it must never modify]
- [how to verify counts/schema/output]

## Deployment Or Startup

Use this section only if the project has deployment, LaunchAgent, cron,
scheduler, or service startup behavior.

Start/restart:

```bash
[START_OR_RESTART_COMMAND]
```

Stop:

```bash
[STOP_COMMAND]
```

Logs:

```bash
[LOG_COMMAND]
```

Expected healthy state:

- [process, endpoint, scheduler, or deployment check]

## Version-Control Procedures

Branching, pull requests, merge, containment proof and cleanup follow the
[`implement` skill](workbench/skills/implement/SKILL.md#version-control-procedures)
and its [branch completion](workbench/skills/implement/SKILL.md#branch-completion)
procedure; this section keeps this room's commands for them.

Git authority and policy live in `AGENTS.md` -> Git Rules. Keep executable
commands and expected results here:

```bash
[STATUS_COMMAND]
[CREATE_TASK_BRANCH_COMMAND]
[DIFF_CHECK_COMMAND]
[CREATE_PR_COMMAND]
```

Expected result: [clean scope, verified base/target, reviewable PR].

Closeout, once the integration review has passed. A pushed branch is
recoverable, not delivered; finish the merge and clean up after yourself:

```bash
(
set -eu
[MERGE_PR_COMMAND]
[VERIFY_INTEGRATION_CONTAINS_WORK_COMMAND]
)
```

After successful verification, if cleanup is authorized:

```bash
[DELETE_MERGED_BRANCH_COMMAND]
git worktree prune
```

Expected result: [integration contains the work; merged branch deleted locally and remotely; unmerged work never force-deleted].

## Upgrading The Harness

These control docs were generated from a specific LLM Workbench version, recorded
in the `Generated from LLM Workbench v[HARNESS_VERSION]` stamp at the top of each
doc. That stamp lets you tell when the project is running an older harness than
the current one.

To upgrade:

1. Check the clean LLM Workbench release checkout's releases/changelog for what changed since
   `v[HARNESS_VERSION]`.
2. Re-copy only the changed template sections; keep this project's filled-in
   specifics. Never let `[BRACKETED]` placeholders leak back into filled docs.
3. Update managed runtime tools only with that checkout's
   `node tools/workbench-tools.mjs update --project PATH --home HOME --explicit-update`
   and the managed core skills only with
   `node tools/workbench-skills.mjs update --project PATH --home HOME --explicit-update`;
   keep each receipt and backup as that component's recovery point.
4. Update each doc's version stamp to the new version. Do not rewrite the room
   manifest's historical adoption source to impersonate the newly installed
   component generation.
5. Re-run the full verification suite and record the upgrade in its owning spec.

An update of the canonical Workbench itself also requires a separate
Workbench self-drift check before and after the change. Inspect the source
controls, Specs and projections, manifest, ADR/Wiki routes, procedures,
templates, managed artifacts and readable continuity metadata for stale
current-facing statuses, blockers, versions, paths and owners. A target-project
drift report, render, doctor or passing tests do not replace this check. In the
source Workbench, run `node workbench/tools/self-drift.mjs --phase pre --json`
and `--phase post --json` around the change, then record the bounded semantic
check. Machine output alone does not certify freshness; do not call the source
update clean while known current-facing
drift remains. Preserve explicitly bounded historical evidence.

The runtime tools in `workbench/tools/` are Workbench-managed: their receipt
(`.workbench-tools.json`) records the exact source release, commit, and file
hashes. Verify them with `node /PATH/TO/LLM_WORKBENCH/tools/workbench-tools.mjs verify --project .`
and replace them only through `update --explicit-update`, which backs up the
previous files and records a rollback path. Never hand-edit a managed tool.

This project's own `node workbench/tools/spec-workbench.mjs doctor` runs the
same receipt hash check from the tools this project carries, so a hand-edited
managed tool fails the check here with no release checkout present. It fails at
the `all` effect, which also makes `next` and `claim` refuse until the runtime
is repaired. The check runs only when `workbench/tools/` carries a receipt; a
receipt that cannot be read, records no file hashes, names a file outside that
lane, or does not account for every managed tool is reported as
`tools-receipt-missing` rather than switching the check off. That last one
matters because the drift report names the file it found: deleting that key
would otherwise switch the check off for exactly the hand-edited tool. The
authoritative list of what is managed ships inside the installed tools
themselves, so a receipt is checked against that list and not against whatever
the lane happens to hold - a managed tool deleted along with its key is still
named. Dotted entries are skipped.

The two coverage conditions have different repairs. A managed tool the receipt
does not account for is refreshed with `update --explicit-update` from the
release checkout, which rewrites the lost key and restores a deleted managed
file. A file the managed runtime does not include has to be moved out of the
lane instead: `update` cannot adopt it and reports `current`, and `install`
refuses a lane that already carries a receipt.

Without a release checkout `doctor` cannot say whether the receipt went stale
or the bytes were changed - it reports every drifted file as
`source-unavailable` - so run `verify` from the release checkout to classify
it. A deleted receipt is the readiness gate's finding, not this check's. A
deleted managed tool that another managed tool imports stops `doctor` from
loading at all, so what appears is a loader stack trace rather than a finding.

The source checkout must have a concrete `origin` and 40-character `HEAD`, and
its managed source lane must be clean; otherwise install/update refuses before
creating a receipt or backup.

Managed-tool updates and rollbacks reject symlinked lane ancestors, linked or
nonregular managed files, and unsafe backup entries before copying or creating
backups. Resolve the path collision while preserving its target, then retry the
explicit operation. Ordinary drift in a regular managed file still receives a
backup and can be restored.

Layout initialization and schema migration preserve existing session ignore
rules and reject linked destination paths before writes. ADR creation, register
rendering and direct owner promotion also reject unsafe destination chains and
use private temporary files; direct promotion refuses a `--from` source
outside the repository root, or one reached through a symbolic link, with
`invalid-note` and writes nothing. Legacy Wiki adoption moves existing
knowledge before seeding only the missing contract files.

Treat a harness upgrade like any other change: smallest correct diff, verified,
with proof. If a downstream lesson should flow *back* to the harness, capture it
per the project's `WORKBENCH_FEEDBACK` convention.

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
| [Symptom] | [cause] | `[command/check]` | [fix] |

## Recovery And Rollback

If a change fails:

1. Identify the touched files and failing command.
2. Revert only the smallest change needed, preserving user work.
3. Rerun the failing verification command.
4. Update the owning spec with the result and remaining gap, then render.

Do not delete data, reset databases, rewrite history, or rotate secrets unless
the user explicitly approves that action.

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

The claim-age diagnostic compares UTC calendar date stamps and reports a claim
older than one calendar day (strictly greater than 86,400,000 milliseconds).
The old prose saying working day was inaccurate. Historical GPT_OS local-day
Preflight and ref-deduplication rules remain scoped historical requirements,
not an automatically imported Workbench algorithm.

Correct or expand the existing ADR when refining the same architectural
decision; preserve its identity, rationale and consequential alternatives.
Create a new ADR only when it adds a valuable distinct architectural lens or
layer, with the reasons for that decision and real alternatives or reversal
cost. Binding rules stay in current owners. A semantic
review checks agreement; text presence alone cannot establish fidelity.
Portable record parsing treats LF, CRLF and CR as syntax variations; read-only
validation never normalizes files as a side effect.

Keep setup human-readable and staged through the documented Genesis, adoption
and explicit-upgrade routes. Verify every consumed source lane before mutation,
then installed behavior in the actual room. Project-owned schemas/templates and
promoted Wiki knowledge travel in project Git; optional private session transport
handles live working context separately. A clean upstream test is not downstream
acceptance. Recheck actual destination refs and preserve unknown remote state.

### Workbench connection identity

`workbench/manifest.json` stores `workbenchId`, a `WB-` identifier containing
128 random bits encoded in the shared base-62 alphabet. New Genesis/adoption
initialization assigns a new identity. Clone, worktree, rename, relocation and
maintenance preserve the manifest's identity; visible artifact IDs retain their
existing room scope. No path, credential or remote configuration enters this
field. Global uniqueness is probabilistic; transport must check its selected
namespace inventory before association.

For an existing room without the field, explicitly assign it once:

```bash
node workbench/tools/workbench-layout.mjs identify --project .
```

Commit that manifest before cloning the legacy room. Repeated assignment reads
back the existing value without rewriting it. Read-only validation never assigns
identity; ordinary legacy local work remains available without transport.
Migration assigns missing identity and preserves existing valid identity.
Malformed identity is refused, never silently regenerated. Independent projects
use fresh initialization rather than copying another project's manifest.

Local assignment uses an exclusive `workbench/.identity.lock`. A busy result
preserves the existing writer's lock; after interruption, verify that writer is
inactive before deliberately removing its stale lock. This is local writer
serialization, not a cross-clone transaction or a crash-recovery claim.

### Configured-host capability checks

The minimum is writable declared lanes (relative, home-relative and absolute),
native skill discovery and invocation, Node execution of managed tools, the
selected directory adapter, and checkout record syntax. Evidence is scoped to
the actual host/application/configuration. Missing capabilities affect dependent
operations only; unavailable checks stay unverified. Capability does not prove
enforcement or agent reliability. Remote transport is optional.

From the pinned producer checkout, run `node tools/configured-host.mjs --probe
CONFIG.json`. The explicitly supplied JSON names `root` (producer checkout),
`sourceCommit` (the expected full 40-character producer commit),
`sourceRepository` (the expected producer `origin` URL),
`cwd` (authorized temporary adapter location), `home`, nonempty `lanes` (existing
writable directories), `skill` (a declared SKILL.md path), and optional `node`
(runtime executable). The command creates and removes private temporary probes
only in those locations. Before executing managed doctor, it verifies that
`root` is the named Git checkout root at the expected commit and origin, with
clean manifest, managed-tool, and ADR inputs. It executes managed doctor and parses actual ADRs;
line-ending variants are structural evidence. Its exit code fails on a failed
operation; zero may include unverified checks and is not blanket compatibility.
Native discovery/invocation always needs a separate provider trace. Record the
provider, model if reported, configuration, OS, exact source and operations;
explicit skill-path invocation alone does not prove automatic discovery.

## Independent Review Boundaries

Task and integration review, main-readiness review and incident-claim evidence
follow the
[`code-review` skill](workbench/skills/code-review/SKILL.md#independent-review-boundaries).
