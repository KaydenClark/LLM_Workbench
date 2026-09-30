---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
source_paths:
  - workbench/specs/S-008-windows-verification-portability/SPEC.md
  - tools/context-pack.mjs
  - workbench/tools/spec-workbench.mjs
  - tools/test-context-tools.mjs
  - tools/test-eval-runner.mjs
  - evals/tasks/task_b_path_safety/grade.py
  - evals/tasks/task_b_path_safety/test_grade.py
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Portable Verification Boundaries

Cross-platform verification needs stable serialized contracts without
rewriting the host's real filesystem paths. Context-pack labels normalize path
separators to forward slashes, while paths used for I/O retain native handling.
Spec generated-region comparison normalizes CRLF to LF, so an equivalent
checkout does not become stale solely because of line-ending style.

The evaluation fixtures also separate interpreter identity from a command
name. Python grading subprocesses reuse `sys.executable`; the Node runner
self-test chooses the platform's Python command. Fake providers receive
Windows `.cmd` launchers where extensionless POSIX shebang files cannot be
launched. These are portability corrections, not changes to feedback ranking,
trial budgets or merge policy.

S-008 records a July 2026 Windows-equivalent verification result. Its append-only
correction distinguishes a guardrail self-test fixture score from the live
repository audit score; neither should be treated as a current benchmark.
This reconciliation checked source and tests on macOS and did not perform a
fresh native Windows run. Platform branches in a fixture are evidence of
intended handling, not proof of current behavior on an untested host.

The remaining operating boundary is explicit: consult the current Runbook for
commands on the actual host. Do not change committed file line endings merely
to silence a comparison or claim that portable test output establishes native
provider discovery.

## Evidence and Sources

- [Historical S-008 record](../../specs/S-008-windows-verification-portability/SPEC.md). Original decisions, evidence and limitations remain preserved.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-008-windows-verification-portability/SPEC.md). Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-008-windows-verification-portability/SPEC.md`.
- [tools/context-pack.mjs](../../../tools/context-pack.mjs) — current owning source or verification seam.
- [workbench/tools/spec-workbench.mjs](../../../workbench/tools/spec-workbench.mjs) — current owning source or verification seam.
- [tools/test-context-tools.mjs](../../../tools/test-context-tools.mjs) — current owning source or verification seam.
- [tools/test-eval-runner.mjs](../../../tools/test-eval-runner.mjs) — current owning source or verification seam.
- [evals/tasks/task_b_path_safety/grade.py](../../../evals/tasks/task_b_path_safety/grade.py) — current owning source or verification seam.
- [evals/tasks/task_b_path_safety/test_grade.py](../../../evals/tasks/task_b_path_safety/test_grade.py) — current owning source or verification seam.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec; read the full historical record and checked the named live sources. Historical proof is distinguished from current behavior. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
