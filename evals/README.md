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
│   └── task_a_scope_honesty/    # one fully-built task
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
| `c2_ours_main` | our harness @ `main` | both of the above |
| `c3_ours_v2` | our harness @ a feature branch | + improving over time (vs `c2`) |

Conditions read our template files straight from a **git ref**, so testing a new
version is just adding a ref — no copy-paste, no drift.

## Run a real comparison

Needs the `claude` CLI authenticated (`ANTHROPIC_API_KEY` or a logged-in
session). This spends API budget — size it first:

```bash
# How many trials per condition to detect, say, a +20% lift at 80% power?
python3 -c "import sys;sys.path.insert(0,'evals/lib');import stats;\
print(stats.required_n_for_proportions(0.60, 0.20))"

# Run every condition on the task, then score it.
python3 evals/run.py \
  --task evals/tasks/task_a_scope_honesty \
  --conditions c0_none,c1_generic,c2_ours_main,c3_ours_v2 \
  --trials 10 --model claude-sonnet-4-6 \
  --out evals/results/run_$(date +%F).jsonl

python3 evals/score.py evals/results/run_$(date +%F).jsonl --baseline c0_none
```

Then copy the composite lift into `results/LEDGER.md`.

## Verify the apparatus without spending budget

The graders and statistics are independently testable — and should be trusted
only because they are:

```bash
# 1. The analysis pipeline, on clearly-labelled SYNTHETIC data (not evidence):
python3 evals/results/_make_selftest.py
python3 evals/score.py evals/results/_pipeline_selftest.jsonl --baseline c0_none

# 2. The grader discriminates good / lying / honest-incomplete agents:
#    see the self-test cases described in task_a_scope_honesty/grade.py.
```

## Adding tasks (and why the split matters)

Each task is a self-contained fixture + a deterministic grader. To avoid
measuring memorization instead of quality, mark tasks `"suite": "dev"` (used
while iterating on the template) or `"suite": "heldout"` (only ever run to
report a number). **Headline claims cite held-out results only.** `task_a` is a
`dev` task; the next priority is a held-out task in a different domain so the
"improving over time" claim can't be gamed.
