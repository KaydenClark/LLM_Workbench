# analysis/ — branch evaluation study

This directory contains an independent, read-only evaluation of the four
LLM Workbench branches that existed on 2026-06-23:

- `main`
- `claude/harness-template-upgrades-v2`
- `claude/harness-eval-framework`
- `codex/workbench-evaluation-harness`

The goal was to decide which branch should become the base going forward,
using evidence rather than vibes, and to audit any included evaluator for
fairness.

## Contents

| File | What it is |
|---|---|
| `PAPER.md` | The full write-up, structured as a research paper (abstract, methods, results, evaluator audit, threats to validity, limitations, recommendations). |
| `reproduce.sh` | Re-runs every measurement in the paper from a fresh clone. No API budget required. |
| `static_breakdown.jsonl` | Raw per-criterion output of the codex static rubric for all four branches plus both controls. One JSON object per line. |

## Headline result

Winner / recommended base: **`codex/workbench-evaluation-harness`** (it is a
strict superset of the strongest template version and adds an evidence layer),
with the behavioral evaluation harness from `claude/harness-eval-framework`
grafted in as the real proof engine.

The static rubric scores (reproducible, see `reproduce.sh`) are coverage
numbers, not proof of agent behavior. No behavioral trial has been run on any
branch yet; that is the recommended next experiment.

## Provenance and integrity

- This study did not merge, push to, rebase, delete, or rewrite any of the four
  candidate branches. It only reads them.
- The static scores were produced by the evaluator that ships on
  `codex/workbench-evaluation-harness` (`tools/evaluate-workbench.mjs`), run
  unmodified against each branch.
- Synthetic eval-framework self-test data is explicitly labelled
  `SYNTHETIC-not-a-real-run` and is never cited as evidence.
