---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
  - Moved into the features collection and restructured as a feature article by the Move And Retype The Remaining Per-Spec Articles Task (TK-002) of the Wiki Evolving-Synthesis Migration Spec (S-003W) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-002-heldout-evaluation/SPEC.md
  - evals/tasks/task_b_path_safety/task.json
  - evals/tasks/task_b_path_safety/grade.py
  - evals/tasks/task_b_path_safety/test_grade.py
  - evals/README.md
last_verified: 2026-10-04
---

# Held-Out Path-Safety Evaluation

The Held-Out Second-Domain Evaluation Spec (S-002) delivered a held-out task
that adds a security-oriented path-handling domain beside the development task,
with a grader that checks the produced repository and transcript without using
the harness condition as an input to the grade.

## What It Does

The grader installs the canonical test, executes it with the running Python
interpreter, inspects changed paths against the task allowlist, checks whether
the transcript claims success despite failing tests, and checks removal of a
known stale documentation statement. Correctness, scope adherence,
verification honesty and documentation upkeep are separate score dimensions.
The self-test deliberately distinguishes correct, incomplete and dishonest
outputs; it tests the grader, not the capability of a model.

Read the task definition and grader together when interpreting a score: the
allowlist, canonical test and success-claim patterns bound exactly what the
score means.

## Why It Matters

Keeping the held-out seam separate reduces the temptation to optimize only for
familiar development fixtures.

## Limits

- The original Spec's outcome is a deterministic fixture and grading seam. It
  contains no repeated real-agent comparison and grants no standing API spend
  authority.
- Candidate-specific trials, controls, uncertainty and any required owner
  budget approval remain separate.
- Passing this fixture cannot establish that the Workbench improves general
  agent behavior.
- Historical completion proof remains in the immutable Spec.

## Evidence and Sources

- [Historical Held-Out Second-Domain Evaluation Spec (S-002)](../../specs/S-002-heldout-evaluation/SPEC.md). Original decisions, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-002-heldout-evaluation/SPEC.md). Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-002-heldout-evaluation/SPEC.md`.
- [evals/tasks/task_b_path_safety/task.json](../../../evals/tasks/task_b_path_safety/task.json) - the task definition and its allowlist.
- [evals/tasks/task_b_path_safety/grade.py](../../../evals/tasks/task_b_path_safety/grade.py) - the grader.
- [evals/tasks/task_b_path_safety/test_grade.py](../../../evals/tasks/task_b_path_safety/test_grade.py) - the grader self-test.
- [evals/README.md](../../../evals/README.md) - the evaluation overview, which lists the held-out task.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec; read the full historical record and checked the named live sources. Historical proof is distinguished from current behavior. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
- 2026-10-04: Moved from `design-concepts/spec-S-002-heldout-evaluation.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Move And Retype The Remaining Per-Spec Articles Task (TK-002) of the Wiki Evolving-Synthesis Migration Spec (S-003W). Every live link to it was rewritten by the move; no claim was changed.
