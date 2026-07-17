# evals/ — the measurement apparatus

This turns "the template feels better" into a number with a confidence interval.
Read [`../RUNBOOK.md`](../RUNBOOK.md) -> Evaluation And Benchmarking for the
*why* (hypotheses, validity threats, statistics). This file is the *how*.

## What's here

```
evals/
├── conditions/
│   ├── conditions.json          # condition id -> which instruction files to inject
│   └── c1_generic_CLAUDE.md     # the "representative generic template" baseline
├── tasks/
│   ├── task_a_scope_honesty/    # development task
│   └── task_b_path_safety/      # held-out security/path task
│       ├── fixture/             # the starting repo the agent works in
│       ├── canonical/           # pristine tests the grader restores (anti-tamper)
│       ├── prompt.md            # the task given to the agent (same for all conditions)
│       ├── task.json            # allowlist, test cmd, dimensions, pre-registered N
│       └── grade.py             # deterministic, condition-blind grader
├── lib/stats.py                 # bootstrap CI, two-proportion z, Fisher, power calc
├── run.py                       # drive the agent per condition, grade, emit rows
├── score.py                     # aggregate rows -> Markdown comparison report
└── results/                     # JSONL rows + LEDGER.md (over-time scoreboard)
```

## The conditions being compared

| id | what the agent gets | answers |
|---|---|---|
| `c0_none` | no template (control) | better than nothing? |
| `c1_generic` | a typical pasted-in template | better than alternatives? |
| `c2_ours_main` | our released harness @ `main` | both of the above |
| `c2_ours_integration` | current staging harness | feedback-gate baseline |
| `c3_candidate` | candidate ref supplied at runtime | improvement vs staging |
| `c3_ours_v2` | historical v2 feature branch | compatibility fixture |

Conditions read our template files straight from a **git ref**, so testing a new
version is just adding a ref — no copy-paste, no drift.

## Run a real comparison

Needs the selected `claude` or `codex` CLI authenticated. This spends model
budget — size it first:

```bash
# How many trials per condition to detect, say, a +20% lift at 80% power?
python3 -c "import sys;sys.path.insert(0,'evals/lib');import stats;\
print(stats.required_n_for_proportions(0.60, 0.20))"

# Run every condition on the task, then score it.
python3 evals/run.py \
  --task evals/tasks/task_a_scope_honesty \
  --conditions c0_none,c1_generic,c2_ours_main,c3_ours_v2 \
  --trials 10 --provider claude --model claude-sonnet-4-6 \
  --out evals/results/run_$(date +%F).jsonl

python3 evals/score.py evals/results/run_$(date +%F).jsonl --baseline c0_none
```

`score.py` accepts one or more result files or globs. One report preserves each
task/condition/class row, sample size, bootstrap interval, provider, model,
reasoning effort, and resolved ref/SHA, then builds a separate composite from
only rows explicitly classified as `real-agent`:

```bash
python3 evals/score.py \
  evals/results/run_task_a_*.jsonl \
  evals/results/run_task_b_*.jsonl \
  --baseline c0_none \
  --report evals/results/report_multi_task.md
```

Synthetic fixtures and legacy/unclassified rows stay visible for apparatus
debugging but are mechanically excluded from the claim-facing real-agent
totals. This is fail-closed: only the exact `real-agent` evidence class paired
with the exact `development` or `heldout` task class is eligible; aliases and
omissions remain excluded. Overlapping input globs are resolved and deduplicated
before rows load.

Each claim-facing condition lift uses only tasks that contain both that
condition and the selected baseline. The report lists incomplete tasks, weights
each complete task equally regardless of its trial count, and suppresses the
headline when no same-task comparison exists. The later pooled tables remain
synthetic/legacy apparatus diagnostics and are never the claim-facing result.

The same runner supports isolated Codex comparisons without modifying the
condition registry:

```bash
python3 evals/run.py \
  --task evals/tasks/task_b_path_safety \
  --conditions c2_ours_integration,c3_candidate \
  --condition-ref c2_ours_integration=origin/integration \
  --condition-ref c3_candidate=origin/codex/feedback-branch \
  --provider codex --model gpt-5.6-terra --reasoning-effort high \
  --trials 10 --feedback-fingerprint FINGERPRINT \
  --base-sha BASE_SHA --candidate-sha CANDIDATE_SHA \
  --out evals/results/run_$(date +%F).jsonl
```

Then copy the composite lift into `results/LEDGER.md`.

## Verify the apparatus without spending budget

The graders and statistics are independently testable — and should be trusted
only because they are:

```bash
# 1. The analysis pipeline, on clearly-labelled SYNTHETIC data (not evidence):
python3 evals/test_score.py
python3 evals/results/_make_selftest.py
python3 evals/score.py evals/results/_pipeline_selftest.jsonl --baseline c0_none

# 2. Provider adapters and the held-out grader, without model usage:
node tools/test-eval-runner.mjs
python3 evals/tasks/task_b_path_safety/test_grade.py
```

## Adding tasks (and why the split matters)

Each task is a self-contained fixture + a deterministic grader. To avoid
measuring memorization instead of quality, mark tasks `"suite": "dev"` (used
while iterating on the template) or `"suite": "heldout"` (only ever run to
report a number). **Headline claims cite held-out results only.** `task_a` is a
`dev` task. `task_b_path_safety` is the condition-blind held-out
security/path-handling domain; do not tune a candidate against its internals.
