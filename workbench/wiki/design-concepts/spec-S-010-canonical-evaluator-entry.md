---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
source_paths:
  - workbench/specs/S-010-canonical-evaluator-entry/SPEC.md
  - tools/evaluate-workbench.mjs
  - tools/test-evaluate-workbench.mjs
  - RUNBOOK.md
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Canonical Evaluator Invocation

A successful process exit is not enough if a directly invoked evaluator never
runs. A checkout reached through a path alias can make the command-line script
path differ textually from its module URL even though both identify the same
file.

S-010 corrected direct-entry detection by comparing a canonicalized script
path. The current evaluator first checks whether a script argument exists,
resolves that path with the filesystem, converts it to a file URL and compares
it with `import.meta.url`. Direct invocation through an ordinary checkout
alias emits the report; importing the module does not intentionally invoke
the CLI. The regression checks meaningful report output, not only exit zero.

The source of the defect was identity comparison at the program boundary,
not evaluator scoring. The repair preserves the evaluator's public command
and scoring contract. The historical feedback, baseline-red result and
candidate-green proof remain recoverable from the original Spec.

This is a narrow alias-invocation guarantee. Real-path resolution can still
reject a present but invalid script path; no general malformed-argument
support is asserted here. A static evaluation report measures its defined
contract criteria and cannot, by itself, establish improved agent outcomes.

## Evidence and Sources

- [Historical S-010 record](../../specs/S-010-canonical-evaluator-entry/SPEC.md). Original decisions, evidence and limitations remain preserved.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-010-canonical-evaluator-entry/SPEC.md). Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-010-canonical-evaluator-entry/SPEC.md`.
- [tools/evaluate-workbench.mjs](../../../tools/evaluate-workbench.mjs) — current owning source or verification seam.
- [tools/test-evaluate-workbench.mjs](../../../tools/test-evaluate-workbench.mjs) — current owning source or verification seam.
- [RUNBOOK.md](../../../RUNBOOK.md) — current owning source or verification seam.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec; read the full historical record and checked the named live sources. Historical proof is distinguished from current behavior. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
