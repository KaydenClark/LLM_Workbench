# [PROJECT_NAME] - Runbook

> Generated from LLM Workbench v[HARNESS_VERSION]. See Upgrading The Harness
> below.

**Last reviewed:** [YYYY-MM-DD]
**Runtime owner:** [user / agent / service owner]
**Environment:** [local / LAN / staging / production]

This file explains how to operate, verify, recover, and evaluate the project. It
should be boring, exact, and executable.

## Ordinary Entry

Follow `AGENTS.md` -> this section -> `LEXICON.md` -> Task Routing. Inspect the
root, branch, upstream and dirty state; run the project-local spec doctor and
load the explicitly assigned spec. For owner-directed pickup, use `next --json`
and `show` to resolve that assignment. The spec and ticket set the normal
stance. Investigate within the task; do not invent a next task when blocked.
Load remaining Runbook sections only for the operation being performed.

For a setup-only Round One assignment, a fresh agent follows that route, checks
the manifest, relevant Wiki and ADRs, and runs read-only configuration checks.
Return the result in chat only: no feedback report, handoff, checkpoint,
self-created task, or other delivered prose artifact. Internal JSON capture
follows the meaningful-work rule and is reconciled at closeout; it does not
turn a chat-only setup check into a reporting assignment. Round One precedes
feedback testing.

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

Fast check:

```bash
[FAST_TEST_COMMAND]
```

Full verification:

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

Treat tests as the project specification, not as a comfort signal. The suite
should be strong enough that if someone accidentally deletes a meaningful line,
branch, route, data contract, workflow step, validation rule, or bug fix, at
least one test or documented manual check fails.

Coverage rules:

- Prefer red/green TDD: write or update the failing test first, confirm the
  expected failure, then implement the smallest fix.
- Run every relevant existing test before judging the suite.
- Keep tests that prove behavior a user, API consumer, operator, or future
  maintainer depends on.
- Improve tests that assert the wrong level, hide real failures, rely on stale
  fixtures, overuse snapshots, or pass without checking meaningful behavior.
- Remove tests that are stale, duplicated without adding a boundary, or pure
  bloat.
- If behavior cannot be tested in the current harness, record the exact reason
  and use the strongest concrete manual check available.

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
node workbench/tools/adr.mjs validate
node workbench/tools/adr.mjs register
```

`doctor` prints every registered finding with its severity and blocking
effect and exits non-zero only for `all` or `selection` findings; a
`selected-slice` finding is excluded by `next` and refused by `claim`, and an
`attention` finding stays visible without blocking. `doctor --home USER_HOME`
(default: the user home, only ever read) also checks each installed core skill's
managed marker `.workbench-skill.json` (schema 2: `source`, `release`,
`commit`, `contentHash`) against the manifest: `stale-skill` names a release
other than the manifest's, `skill-generation-unknown` names a skill with no
schema 2 marker; both are attention, and the explicit upgrade is the repair. `doctor` also reports
`integration-branch-undeclared` and `integration-branch-missing` (scope
`git`, effect `none`) until `workbench/manifest.json` `git.integrationBranch`
names a branch that resolves locally or on a remote; the Genesis readiness
gate fails closed on the same two conditions. When that branch resolves and
the spec `next` would select is already complete there, `doctor` reports
`complete-on-integration` (attention) without hiding the work. Decision records live in
`workbench/docs/adr/`; an accepted record names the control that carries its
rule in `canonicalized_in`, and `register` derives `REGISTER.md`.

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

### JSON Notepad Transition

New notepads are JSON. Until the shared lifecycle is implemented, use the
manifest-declared live collection already available for that workflow; grilling
uses `workbench/sessions/grilling/`. Do not invent an undeclared collection or
rewrite legacy Markdown merely to change its extension. The target layout is
`sessions/notepads/` with local type folders and tracked examples/schema.

1. Resolve the explicit objective or note first; related records share objective
   context. If no stronger signal exists, inspect the newest-created local note
   or handoff and check relevance before using it.
2. Preserve a compact current view (objective, state, unresolved work, next action)
   and ordered entries containing meaningful source text, findings, uncertainty,
   and corrections. Save important context as it becomes available, before
   continuing work that would leave it only in the conversation. Token exhaustion
   or Stop may prevent another write; do not wait for closeout. JSON strings may
   contain full prose. Field names in interim records are provisional until the
   shared versioned schema is implemented.
3. After interruption, load relevant context and verify current controls and
   actual project state. File availability alone proves neither freshness nor
   successful recovery. Preserve significant work while it is underway.
4. For an owner-requested handoff, author a destination-specific compaction from
   the selected material. Include needed corrections and dependencies. Carry
   the selected content when the destination cannot read the local note.
5. Before cleanup, verify that promoted material is present in its durable
   owner and that retained work can still be understood and resumed. Trim only
   reconciled material from a retained note; preserve unresolved context,
   corrections, and active handoff dependencies. Flush or delete the whole
   record only when all important material is reconciled and nothing still
   depends on it. No routine archive or extra approval is needed for this normal
   cleanup. Preserve legacy sources and existing checkpoints under their current
   retention rules.

The current `sessions.mjs` offers `scan` and legacy `checkpoint`, not create,
append, selective read, or cleanup. Do not claim those APIs already exist.
Schema validation, safe tool-mediated updates, bounded pagination, and scoped
cleanup require implementation and tests in the assigned notepad spec. Do not
send a JSON note through the legacy copier and call its `.md` output a JSON
runtime. Skill prose and human-readable projections may remain Markdown.

## Evaluation And Benchmarking

Use this section to prove whether the workbench or project process is improving.
The goal is evidence, not taste.

### Benchmark-Driven Improvement

Before changing agent rules, control docs, evaluation criteria, or the working
process, capture the available guardrail or benchmark baseline. Put the intended
score movement or outcome hypothesis in the owning spec, then record the
before/after score and remaining recommendations after the change.

Use 100/100 as a deliberately hard north star, not the release gate. Regression
checks are the minimum ship gate. Never weaken a criterion to manufacture
progress, and do not treat a static coverage score as outcome evidence. If this
project has no executable benchmark yet, add one or state that the change cannot
yet be called better.

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

Run merge and containment verification as a fail-fast sequence. Pin the reviewed
commit and reject a changed candidate. Merge must not delete branches before
containment is verified. A linked worktree holding the target must not block
verification. Only run cleanup when the owner has not deferred it; verify each
local and remote tip is contained, tolerate absent branches, and use an atomic
expected-tip guard on remote deletion so concurrent pushes are preserved.

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

When cleanup is owner-deferred, the declared integration branch contains the
reviewed work and the branches remain available for later cleanup. Disposable
review clones and linked worktrees live outside the canonical checkout, under
the host temporary directory; `git worktree prune` drops the registrations of
removed ones, and a finished review checkout is removed once its review is
recorded. None is a durable owner.

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
   `node tools/workbench-tools.mjs update --project PATH --home HOME --explicit-update`;
   keep its receipt and backup as the component recovery point.
4. Update each doc's version stamp to the new version. Do not rewrite the room
   manifest's historical adoption source to impersonate the newly installed
   component generation.
5. Re-run the full verification suite and record the upgrade in its owning spec.

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
rendering and checkpoint promotion also reject unsafe destination chains and
use private temporary files; checkpoint promotion refuses a `--from` source
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
   and Review Boundary. No findings is valid. Reports never live loose or in
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

Size a ticket so a fresh context can recover its inputs, exercise one useful
behavior at its public seam and finish named verification. There is no accepted
universal byte or token threshold. Unknown consequential product choices belong
in a decision slice of the already assigned spec before dependent implementation;
this does not authorize creating a task from an unassigned finding.

Saving context or authoring a requested handoff does not terminate a session.
Continue to the authorized endpoint. Preserve the complete original question
inventory and stable IDs/statuses/corrections; a compact view routes to retained
sources rather than replacing them. Multiple objective-linked notes are allowed,
with an unambiguous active resume route. Stale migrated discovery paths belong
in the existing ownership/migration assignment.

When partitioning evidence, preserve previously published rows byte-for-byte and
link successor work from its owner; do not rewrite an old result to match newer
truth. Name which immutable tree each claim reads. A generated projection names
its sources and freshness limits; no cached observer service is implied.

The claim-age diagnostic compares UTC calendar date stamps and reports a claim
older than one calendar day (strictly greater than 86,400,000 milliseconds).
The old prose saying working day was inaccurate. Historical GPT_OS local-day
Preflight and ref-deduplication rules remain scoped historical requirements,
not an automatically imported Workbench algorithm.

Author small ADRs for independently changing consequential decisions with real
alternatives or reversal cost. Binding rules stay in current owners. A semantic
review checks agreement; text presence alone cannot establish fidelity.
Portable record parsing treats LF, CRLF and CR as syntax variations; read-only
validation never normalizes files as a side effect.

Keep setup human-readable and staged through the documented Genesis, adoption
and explicit-upgrade routes. Verify every consumed source lane before mutation,
then installed behavior in the actual room. Project-owned schemas/templates and
promoted Wiki knowledge travel in project Git; optional private session transport
handles live working context separately. A clean upstream test is not downstream
acceptance. Recheck actual destination refs and preserve unknown remote state.
