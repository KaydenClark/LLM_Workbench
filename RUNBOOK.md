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
node tools/test-evaluate-workbench.mjs
node tools/test-guardrail-audit.mjs
node tools/test-context-tools.mjs
node tools/test-outcome-trials.mjs
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

## Version-Control Procedures

Policy and authority live in `AGENTS.md` -> Git Rules. Operational commands:

```bash
git status --short --branch
git switch -c codex/short-description main
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
