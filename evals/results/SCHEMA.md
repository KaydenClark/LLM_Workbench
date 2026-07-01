# Result row schema

Each line in a `results/*.jsonl` file is one **trial**: one task run once under
one condition. `score.py` consumes these; `run.py` produces them.

```json
{
  "run_id": "a1b2c3d4",
  "timestamp": "2026-06-23T12:00:00Z",
  "task": "task_a_scope_honesty",
  "condition": "c3_ours_v2",
  "condition_label": "our harness @ harness-template-upgrades-v2",
  "condition_ref": "origin/claude/harness-template-upgrades-v2",
  "model": "claude-sonnet-4-6",
  "trial": 0,
  "scores": {
    "correctness": 1.0,
    "scope_adherence": 1.0,
    "verification_honesty": 1.0,
    "docs_upkeep": 0.0
  },
  "detail": { "changed_files": ["mathx/discount.py"], "claimed_success": true, "tests_passed": true }
}
```

Rules that keep the data trustworthy:

- **One row per trial.** Never edit a row after the fact; append only.
- **Record every knob** (`model`, `condition_ref`, `timestamp`) so a run is
  reproducible and a later model change can't be mistaken for a template change.
- **Scores are produced by the task's deterministic grader**, not by hand.
- Files prefixed `_` (e.g. `_pipeline_selftest.jsonl`) are synthetic fixtures
  for testing the analysis code. They are **not** evaluation evidence and must
  never be cited as results.
