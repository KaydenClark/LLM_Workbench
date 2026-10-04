---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task TK-002 (Move and retype the remaining per-Spec articles) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-010-canonical-evaluator-entry/SPEC.md
  - tools/evaluate-workbench.mjs
  - tools/test-evaluate-workbench.mjs
  - RUNBOOK.md
last_verified: 2026-10-04
---

# Canonical Evaluator Invocation

The evaluator reports when it is run directly, including when its checkout is
reached through a path alias. The Spec named
Canonical Evaluator Entry Detection (S-010) corrected the evaluator's
direct-entry detection after a successful process exit proved not to be enough:
a directly invoked evaluator that never runs still exits cleanly.

## What It Does

A checkout reached through a path alias can make the command-line script path
differ textually from its module URL even though both identify the same file.
The evaluator now compares a canonicalized script path: it first checks whether
a script argument exists, resolves that path with the filesystem, converts it to
a file URL and compares it with `import.meta.url`. Direct invocation through an
ordinary checkout alias emits the report; importing the module does not
intentionally invoke the CLI. The regression checks meaningful report output,
not only exit zero.

## Why It Matters

The source of the defect was identity comparison at the program boundary, not
evaluator scoring. The repair preserves the evaluator's public command and
scoring contract. The historical feedback, baseline-red result and
candidate-green proof remain recoverable from the original Spec.

## Limits

- This is a narrow alias-invocation guarantee. Real-path resolution can still
  reject a present but invalid script path; no general malformed-argument
  support is asserted here.
- A static evaluation report measures its defined contract criteria and cannot,
  by itself, establish improved agent outcomes.

## Evidence and Sources

- [Historical Canonical Evaluator Entry Detection Spec (S-010)](../../specs/S-010-canonical-evaluator-entry/SPEC.md). Original decisions, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-010-canonical-evaluator-entry/SPEC.md). Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-010-canonical-evaluator-entry/SPEC.md`.
- [tools/evaluate-workbench.mjs](../../../tools/evaluate-workbench.mjs) - the evaluator and its direct-entry check.
- [tools/test-evaluate-workbench.mjs](../../../tools/test-evaluate-workbench.mjs) - the regression seam that checks report output.
- [RUNBOOK.md](../../../RUNBOOK.md) - the operations index and test list that route the evaluator.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec; read the full historical record and checked the named live sources. Historical proof is distinguished from current behavior. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
- 2026-10-04: Moved from `design-concepts/spec-S-010-canonical-evaluator-entry.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task TK-002 (Move and retype the remaining per-Spec articles). Every live link to it was rewritten by the move; no claim was changed.
