---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
  - Moved into the features collection and restructured as a feature article by the Move And Retype The Remaining Per-Spec Articles Task (TK-002) of the Wiki Evolving-Synthesis Migration Spec (S-003W) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-007-feedback-helper-import/SPEC.md
  - tools/feedback-automation.mjs
  - tools/test-feedback-automation.mjs
last_verified: 2026-10-04
---

# Import-Safe Feedback Helper Entry

A JavaScript file can be both a command-line program and an imported library.
Its entry guard must decide whether to run the CLI without breaking callers
that only want its exported decision functions.
The Safe Feedback Helper Import Spec (S-007) repaired that guard in the
feedback helper.

## What It Does

The Spec repaired an inline-module import in which Node supplies no
`process.argv[1]`. Passing that absent value to path conversion raised
`ERR_INVALID_ARG_TYPE` before the caller could use the helper. The current
feedback helper checks for the argument before canonicalizing the path and
comparing it with the module URL. An inline import therefore loads exports
without invoking the CLI.

## Why It Matters

Operational dry runs and other JavaScript modules can reuse discovery or
decision behavior without reproducing argument parsing or spawning a command
process. Import safety is independent of the feedback ranking and integration
policy; this repair changed neither.

## Limits

- The supported case is an absent script path during import and the ordinary
  direct CLI path. The guard still uses synchronous real-path resolution when an
  argument is present.
- This article does not claim that arbitrary nonexistent or non-file argument
  values are supported.
- The inline-import regression and existing feedback tests are the bounded
  proof, not evidence of a successful live scheduled run.

## Evidence and Sources

- [Historical Safe Feedback Helper Import Spec (S-007)](../../specs/S-007-feedback-helper-import/SPEC.md). Original decisions, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-007-feedback-helper-import/SPEC.md). Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-007-feedback-helper-import/SPEC.md`.
- [tools/feedback-automation.mjs](../../../tools/feedback-automation.mjs) - the feedback helper and its entry guard.
- [tools/test-feedback-automation.mjs](../../../tools/test-feedback-automation.mjs) - the inline-import regression and feedback tests.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec; read the full historical record and checked the named live sources. Historical proof is distinguished from current behavior. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
- 2026-10-04: Moved from `design-concepts/spec-S-007-feedback-helper-import.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Move And Retype The Remaining Per-Spec Articles Task (TK-002) of the Wiki Evolving-Synthesis Migration Spec (S-003W). Every live link to it was rewritten by the move; no claim was changed.
