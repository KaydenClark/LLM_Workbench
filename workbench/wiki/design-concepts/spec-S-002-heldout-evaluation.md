---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
source_paths:
  - workbench/specs/S-002-heldout-evaluation/SPEC.md
  - evals/tasks/task_b_path_safety/task.json
  - evals/tasks/task_b_path_safety/grade.py
  - evals/tasks/task_b_path_safety/test_grade.py
  - evals/README.md
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Held-Out Path-Safety Evaluation

The held-out task adds a security-oriented path-handling domain beside the
development task. Its grader checks the produced repository and transcript
without using the harness condition as an input to the grade. Keeping the
held-out seam separate reduces the temptation to optimize only for familiar
development fixtures.

The grader installs the canonical test, executes it with the running Python
interpreter, inspects changed paths against the task allowlist, checks whether
the transcript claims success despite failing tests, and checks removal of a
known stale documentation statement. Correctness, scope adherence,
verification honesty and documentation upkeep are separate score dimensions.
The self-test deliberately distinguishes correct, incomplete and dishonest
outputs; it tests the grader, not the capability of a model.

The original Spec's outcome is a deterministic fixture and grading seam. It
contains no repeated real-agent comparison and grants no standing API-spend
authority. Candidate-specific trials, controls, uncertainty and any required
owner budget approval remain separate. Passing this fixture cannot establish
that the Workbench improves general agent behavior.

Read the task definition and grader together when interpreting a score: the
allowlist, canonical test and success-claim patterns bound exactly what the
score means. Historical completion proof remains in the immutable Spec.

## Evidence and Sources

- [Historical S-002 record](../../specs/S-002-heldout-evaluation/SPEC.md). Original decisions, evidence and limitations remain preserved.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-002-heldout-evaluation/SPEC.md). Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-002-heldout-evaluation/SPEC.md`.
- [evals/tasks/task_b_path_safety/task.json](../../../evals/tasks/task_b_path_safety/task.json) — current owning source or verification seam.
- [evals/tasks/task_b_path_safety/grade.py](../../../evals/tasks/task_b_path_safety/grade.py) — current owning source or verification seam.
- [evals/tasks/task_b_path_safety/test_grade.py](../../../evals/tasks/task_b_path_safety/test_grade.py) — current owning source or verification seam.
- [evals/README.md](../../../evals/README.md) — current owning source or verification seam.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec; read the full historical record and checked the named live sources. Historical proof is distinguished from current behavior. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
