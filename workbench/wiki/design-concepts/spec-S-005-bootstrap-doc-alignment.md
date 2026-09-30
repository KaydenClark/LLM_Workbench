---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
source_paths:
  - workbench/specs/S-005-bootstrap-doc-alignment/SPEC.md
  - README.md
  - templates/GENESIS.md
  - templates/ADOPTION.md
  - AGENTS.md
  - tools/test-evaluate-workbench.mjs
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Consistent Bootstrap Ownership Guidance

A new project inherits its operating model through public setup instructions
and the copy-ready Genesis and Adoption procedures. If those entry points use
obsolete ownership language, they can recreate the very duplication that the
harness removed internally.

S-005 corrected old four-control-document and Taskboard proof-log wording.
The enduring distinction is that the agent contract governs behavior, the
assigned Spec records capability requirements and proof, and the Taskboard is
a generated view of work. A bootstrap guide should route to those owners
rather than become another proof store.

The current README, Genesis and Adoption templates preserve those ownership
boundaries. The original v2.3 terminology is historical: later manifest layout,
Lexicon routing, standalone Tasks and lifecycle tooling refine how the owners
are reached. This article is not a substitute setup checklist; the linked
procedures own the executable steps and their current verification commands.

The original repair was deliberately narrow and left cold v2.2 archives
untouched. That distinction remains useful: a historical phrase can be valid
inside a dated record while being misleading in current setup instructions.
The focused legacy-wording scan and static evaluator check consistency of the
documents. They do not prove that an installed agent completes adoption or
Genesis correctly.

## Evidence and Sources

- [Historical S-005 record](../../specs/S-005-bootstrap-doc-alignment/SPEC.md). Original decisions, evidence and limitations remain preserved.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-005-bootstrap-doc-alignment/SPEC.md). Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-005-bootstrap-doc-alignment/SPEC.md`.
- [README.md](../../../README.md) — current owning source or verification seam.
- [templates/GENESIS.md](../../../templates/GENESIS.md) — current owning source or verification seam.
- [templates/ADOPTION.md](../../../templates/ADOPTION.md) — current owning source or verification seam.
- [AGENTS.md](../../../AGENTS.md) — current owning source or verification seam.
- [tools/test-evaluate-workbench.mjs](../../../tools/test-evaluate-workbench.mjs) — current owning source or verification seam.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec; read the full historical record and checked the named live sources. Historical proof is distinguished from current behavior. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
