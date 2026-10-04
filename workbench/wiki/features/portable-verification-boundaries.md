---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
  - Moved into the features collection and restructured as a feature article by the Move And Retype The Remaining Per-Spec Articles Task (TK-002) of the Wiki Evolving-Synthesis Migration Spec (S-003W) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-008-windows-verification-portability/SPEC.md
  - tools/context-pack.mjs
  - workbench/tools/spec-workbench.mjs
  - tools/test-context-tools.mjs
  - tools/test-eval-runner.mjs
  - evals/tasks/task_b_path_safety/grade.py
  - evals/tasks/task_b_path_safety/test_grade.py
last_verified: 2026-10-04
---

# Portable Verification Boundaries

The Windows Verification Portability Spec (S-008) made cross-platform
verification rely on stable serialized contracts without rewriting the host's
real filesystem paths.

## What It Does

- **Paths.** Context-pack labels normalize path separators to forward slashes,
  while paths used for I/O retain native handling.
- **Line endings.** Spec generated-region comparison normalizes CRLF to LF, so
  an equivalent checkout does not become stale solely because of line-ending
  style.
- **Interpreters and launchers.** The evaluation fixtures separate interpreter
  identity from a command name. Python grading subprocesses reuse
  `sys.executable`; the Node runner self-test chooses the platform's Python
  command. Fake providers receive Windows `.cmd` launchers where extensionless
  POSIX shebang files cannot be launched.

## Why It Matters

These are portability corrections, not changes to feedback ranking, trial
budgets or merge policy. The remaining operating boundary is explicit: consult
the current Runbook for commands on the actual host.

## Limits

- The Spec records a July 2026 Windows-equivalent verification result. Its
  append-only correction distinguishes a guardrail self-test fixture score from
  the live repository audit score; neither should be treated as a current
  benchmark.
- This reconciliation checked source and tests on macOS and did not perform a
  fresh native Windows run. Platform branches in a fixture are evidence of
  intended handling, not proof of current behavior on an untested host.
- Do not change committed file line endings merely to silence a comparison or
  claim that portable test output establishes native provider discovery.

## Evidence and Sources

- [Historical Windows Verification Portability Spec (S-008)](../../specs/S-008-windows-verification-portability/SPEC.md). Original decisions, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-008-windows-verification-portability/SPEC.md). Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-008-windows-verification-portability/SPEC.md`.
- [tools/context-pack.mjs](../../../tools/context-pack.mjs) - the context-pack builder whose labels normalize separators.
- [workbench/tools/spec-workbench.mjs](../../../workbench/tools/spec-workbench.mjs) - the spec runtime that compares generated regions.
- [tools/test-context-tools.mjs](../../../tools/test-context-tools.mjs) - the context tools verification seam.
- [tools/test-eval-runner.mjs](../../../tools/test-eval-runner.mjs) - the Node runner self-test and fake provider launchers.
- [evals/tasks/task_b_path_safety/grade.py](../../../evals/tasks/task_b_path_safety/grade.py) - the grader that reuses the running interpreter.
- [evals/tasks/task_b_path_safety/test_grade.py](../../../evals/tasks/task_b_path_safety/test_grade.py) - the grader self-test.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec; read the full historical record and checked the named live sources. Historical proof is distinguished from current behavior. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
- 2026-10-04: Moved from `design-concepts/spec-S-008-windows-verification-portability.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Move And Retype The Remaining Per-Spec Articles Task (TK-002) of the Wiki Evolving-Synthesis Migration Spec (S-003W). Every live link to it was rewritten by the move; no claim was changed.
