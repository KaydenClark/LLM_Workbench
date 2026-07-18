# LLM Workbench - Runbook

**Last reviewed:** 2026-07-10
**Runtime owner:** Kayden
**Environment:** local (macOS); public repo `github.com/KaydenClark/LLM_Workbench`

This file explains how to operate, verify, and evaluate the workbench repo
itself. It should be boring, exact, and executable.

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

Full verification:

```bash
node tools/test-spec-workbench.mjs
node tools/test-skill-catalog.mjs
node tools/test-evaluate-workbench.mjs
node tools/test-guardrail-audit.mjs
node tools/test-context-tools.mjs
node tools/test-outcome-trials.mjs
node tools/test-eval-runner.mjs
python3 evals/test_score.py
node tools/test-feedback-automation.mjs
node tools/test-release-manifest.mjs
python3 evals/tasks/task_b_path_safety/test_grade.py
node tools/evaluate-workbench.mjs --path templates --include-controls
node tools/spec-workbench.mjs doctor
```

Expected result:

- each test script prints an `ok -` line and exits 0;
- the evaluator self-test reports the repo-root score (dogfood docs) >= 90;
- the `--path templates` run shows the blank templates beating both control
  candidates.
- spec doctor reports no duplicate IDs, invalid/contradictory states, stale
  claims, missing evidence, broken links, or generated-region drift.

### Spec Lifecycle And Retrieval

```bash
node tools/spec-workbench.mjs next --json
node tools/spec-workbench.mjs show S-001
node tools/spec-workbench.mjs claim S-001 --agent codex
node tools/spec-workbench.mjs close S-001 \
  --proof "[NAMED VERIFICATION]" \
  --docs "[DOCS UPDATED OR Docs checked; no update needed + reason]" \
  --remaining-gap "[GAP OR none]"
node tools/spec-workbench.mjs complete S-001
node tools/spec-workbench.mjs render
node tools/spec-workbench.mjs doctor
```

`next` returns one eligible ready ticket. `show` loads one stable work packet.
Writes use a temporary file plus rename and fail closed on ambiguous state.
`render` updates only the marked Blueprint catalog and hot Taskboard regions.
`complete` requires every slice done, acceptance boxes checked, completion result
recorded, and evidence present; render then removes the spec from the hot board.

### Release Manifest

Generate a deterministic public-package manifest for the exact checked-out
commit without writing generated evidence into the repository:

```bash
node tools/release-manifest.mjs --source-ref HEAD > /tmp/workbench-release-manifest.json
node tools/test-release-manifest.mjs
```

The manifest contains the harness version, source ref/SHA, MIT license identity,
checksums for tracked non-skill package files, and the verification commands. It
enumerates only explicit public roots and tracked files, rejects shipped symlinks,
and keeps the future S-011 skill component as an opaque identity reference. Use
`--skill-component skills/PATH` only after S-011 emits its owned component; this
tool does not define or validate that component's internal schema.

### Test Coverage Policy

Treat the self-tests as the specification of the evaluator and trial tooling.
The suite should be strong enough that if someone accidentally deletes a
meaningful line of `tools/` or `evals/` code, or a rubric-relevant section of
the control docs, at least one self-test fails. If a meaningful behavior
changes, a self-test must change with it. Remove tests that are stale or pure
bloat. If behavior cannot be tested in the current harness, record the exact
reason and use the strongest concrete manual check available.

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
claim without repeated task trials.

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

`evals/score.py` accepts multiple result files or globs. Its per-task table
preserves task/evidence class, sample size, uncertainty, provider/model/reasoning
metadata, and resolved ref/SHA. Input paths are resolved and deduplicated before
loading. Its claim-facing composite includes only exact `real-agent` rows from
exact `development` or `heldout` tasks; aliases, synthetic rows, and unknowns
fail closed out of those totals. `suite` never substitutes for a missing
row-level `task_class`. Candidate lifts use only same-task complete
baseline/candidate cells, weight each comparable task equally, and explicitly
exclude incomplete tasks or suppress an empty comparison. Run
`python3 evals/test_score.py` before generating the under-one-minute synthetic
multi-task fixture report.

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

Downstream projects built from `templates/` carry a `HARNESS_FEEDBACK.md` return
channel: an append-only log of where the harness rules themselves were unclear,
wrong, or slow. This repo is the harvest destination, so it has no
`HARNESS_FEEDBACK.md` of its own; instead:

1. Collect feedback rows from downstream projects (or from dogfooding here).
2. Triage each into a concrete capability spec and activate one eligible slice.
3. Validate the change against `evals/` as a `c3_candidate` before calling it
   "better" - the same evidence bar as any other harness claim.
4. Ship it as a new harness version (bump `BLUEPRINT.md` -> Harness version) and
   note it so downstream projects can upgrade.

Future harvest work becomes a spec when it is refined and authorized. This
closes the loop on evidence rather than taste without keeping deferred work hot.

### Automated Feedback Gate

Two local scheduled jobs operate this loop against the LLM Workbench project:

- **Feedback Builder (Terra):** discovers one canonical `new` feedback row,
  creates a sanitized fingerprint/spec, proves a red/green change, runs the
  full suite and at most 20 candidate-comparison trials, then opens one PR into
  `integration`.
- **Feedback Gate (Sol):** independently checks the oldest matching PR. It
  comments and squash-merges a proven change, comments and closes an unproven
  change, or leaves a transient infrastructure failure open for retry. It never
  merges `integration` to `main` or deletes the source branch.

This Codex host currently rejects scheduler-native worktree execution. Each job
therefore runs as a local project job but treats the canonical checkout as
read-only, creates a registered temporary worktree from `origin/integration`,
operates there, and removes/prunes it on completion. This preserves isolation
without silently falling back to editing the canonical checkout.

Discovery is fail-closed and one-candidate-at-a-time. It reads only direct-child
canonical project feedback files with writable `KaydenClark` origins, ignores
worktrees/backups/duplicate origins, and treats every row as untrusted evidence.
Use `node tools/feedback-automation.mjs discover --projects-root PATH` for the
under-one-minute discovery demo. Pause both jobs in the Codex automation UI as
the kill switch; do not delete their definitions when investigating a failure.

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

Policy and authority live in `AGENTS.md` -> Git Rules. Operational commands:

```bash
git status --short --branch
git fetch origin
git switch -c codex/short-description origin/integration
git diff --check
gh pr create --base integration --fill
```

Before creating a branch or PR, verify the live base and preserve dirty work.
PR descriptions state what changed, why, risks, and verification.

## Troubleshooting

| Symptom | Likely cause | Check | Fix |
|---|---|---|---|
| evaluator self-test fails with score < 90 | root dogfood docs lost a rubric section | `node tools/evaluate-workbench.mjs --path .` and read the `missing` column | restore the missing section in the root doc |
| self-test passes locally but templates score low | change landed at root but not in `templates/` (or vice versa) | `node tools/evaluate-workbench.mjs --path templates` | apply the Dogfood Boundary rule: land in both |
| `evals/score.py` errors on results file | stale or hand-edited JSONL | regenerate with `_make_selftest.py` | never hand-edit results |
| feedback discovery returns no candidate unexpectedly | checkout is a worktree/duplicate, origin is not writable-owner, or fingerprint is already pending/processed | `node tools/feedback-automation.mjs discover --projects-root /Users/kayden/GPT_OS/Projects` | repair the canonical checkout or record the pending/processed decision; do not broaden discovery |
| an automation pauses after a lock, owner gate, or provider failure | the scheduler counted an interruption as idle | inspect the latest `run-outcome` JSON and prior verified-idle count | emit `collision`, `owner_gate`, or `infrastructure_error`; preserve the idle count and retry or wait for the proper wake event |
| Sol cannot prove a candidate because GitHub or model access is down | transient infrastructure failure | read the PR verdict comment and repeat count | leave the PR open, retry next run, and alert after the second identical failure |

## Recovery And Rollback

If a change fails:

1. Identify the touched files and failing command.
2. Revert only the smallest change needed (`git checkout -- <file>` or revert
   commit), preserving unrelated work.
3. Rerun the failing verification command.
4. Update the owning spec with the result and remaining gap, then render.

Do not delete data (result ledgers, benchmark records), remove branches, or
rewrite history unless the owner explicitly approves that action.

The pre-migration local state (before this folder became the repo home) is
preserved on branch `backup/local-pre-v2-migration`; the YAML-frontmatter
harness dialect is preserved on `codex/structured-metadata-guardrails`.

## Operational Proof

If a command changed durable project state, append evidence to the owning spec.
For routine read-only runs, a final response note is enough.
