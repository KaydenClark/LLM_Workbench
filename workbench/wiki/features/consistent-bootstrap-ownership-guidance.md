---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
  - Moved into the features collection and restructured as a feature article by the Move And Retype The Remaining Per-Spec Articles Task (TK-002) of the Wiki Evolving-Synthesis Migration Spec (S-003W) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-005-bootstrap-doc-alignment/SPEC.md
  - README.md
  - templates/GENESIS.md
  - templates/ADOPTION.md
  - AGENTS.md
  - tools/test-evaluate-workbench.mjs
last_verified: 2026-10-04
---

# Consistent Bootstrap Ownership Guidance

A new project inherits its operating model through public setup instructions
and the copy-ready Genesis and Adoption procedures. The
Bootstrap Documentation Alignment Spec (S-005) corrected old
four-control-document and Taskboard proof-log wording in those entry points, so
they route to the current owners instead of recreating the duplication the
harness removed internally.

## What It Does

The enduring distinction is that the agent contract governs behavior, the
assigned Spec records capability requirements and proof, and the Taskboard is
a generated view of work. A bootstrap guide should route to those owners
rather than become another proof store. The current README, Genesis and
Adoption templates preserve those ownership boundaries.

## Why It Matters

If the entry points use obsolete ownership language, they can recreate the very
duplication that the harness removed internally. The original repair was
deliberately narrow and left cold v2.2 archives untouched. That distinction
remains useful: a historical phrase can be valid inside a dated record while
being misleading in current setup instructions.

## Limits

- The original v2.3 terminology is historical: later manifest layout, Lexicon
  routing, standalone Tasks and lifecycle tooling refine how the owners are
  reached.
- This article is not a substitute setup checklist; the linked procedures own
  the executable steps and their current verification commands.
- The focused legacy-wording scan and static evaluator check consistency of the
  documents. They do not prove that an installed agent completes adoption or
  Genesis correctly.

## Evidence and Sources

- [Historical Bootstrap Documentation Alignment Spec (S-005)](../../specs/S-005-bootstrap-doc-alignment/SPEC.md). Original decisions, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-005-bootstrap-doc-alignment/SPEC.md). Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-005-bootstrap-doc-alignment/SPEC.md`.
- [README.md](../../../README.md) - the public setup instructions.
- [templates/GENESIS.md](../../../templates/GENESIS.md) - the copy-ready Genesis procedure.
- [templates/ADOPTION.md](../../../templates/ADOPTION.md) - the copy-ready Adoption procedure.
- [AGENTS.md](../../../AGENTS.md) - the agent contract that governs behavior.
- [tools/test-evaluate-workbench.mjs](../../../tools/test-evaluate-workbench.mjs) - the static evaluator check.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec; read the full historical record and checked the named live sources. Historical proof is distinguished from current behavior. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
- 2026-10-04: Moved from `design-concepts/spec-S-005-bootstrap-doc-alignment.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Move And Retype The Remaining Per-Spec Articles Task (TK-002) of the Wiki Evolving-Synthesis Migration Spec (S-003W). Every live link to it was rewritten by the move; no claim was changed.
