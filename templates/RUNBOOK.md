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
self-created task, or other prose artifact. Round One precedes feedback testing.

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
`attention` finding stays visible without blocking. Decision records live in
`workbench/docs/adr/`; an accepted record names the control that carries its
rule in `canonicalized_in`, and `register` derives `REGISTER.md`.

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
```

Expected result: [integration contains the work; merged branch deleted locally and remotely; unmerged work never force-deleted].

When cleanup is owner-deferred, integration contains the reviewed work and the
branches remain available for later cleanup.

## Upgrading The Harness

These control docs were generated from a specific LLM Workbench version, recorded
in the `Generated from LLM Workbench v[HARNESS_VERSION]` stamp at the top of each
doc. That stamp lets you tell when the project is running an older harness than
the current one.

To upgrade:

1. Check the LLM Workbench repo's releases/changelog for what changed since
   `v[HARNESS_VERSION]`.
2. Re-copy only the changed template sections; keep this project's filled-in
   specifics. Never let `[BRACKETED]` placeholders leak back into filled docs.
3. Update each doc's version stamp to the new version.
4. Re-run the full verification suite and record the upgrade in its owning spec.

The runtime tools in `workbench/tools/` are Workbench-managed: their receipt
(`.workbench-tools.json`) records the exact source release, commit, and file
hashes. Verify them with `node /PATH/TO/LLM_WORKBENCH/tools/workbench-tools.mjs verify --project .`
and replace them only through `update --explicit-update`, which backs up the
previous files and records a rollback path. Never hand-edit a managed tool.

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
