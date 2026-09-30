---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
source_paths:
  - workbench/specs/S-001-progressive-disclosure/SPEC.md
  - AGENTS.md
  - RUNBOOK.md
  - LEXICON.md
  - BLUEPRINT.md
  - workbench/tools/spec-workbench.mjs
  - tools/test-spec-workbench.mjs
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Spec-Centered Progressive Disclosure

Progressive disclosure keeps ordinary entry small: read the agent contract,
follow the Runbook and Lexicon routes, then load the assigned capability and
its relevant source. A Spec carries the assignment and its proof; the hot
Taskboard derives an operational view. Reading an entire historical catalog is
not a prerequisite for doing one bounded piece of work.

S-001 established this separation when startup material mixed product detail,
completed evidence and live work. Its July 2026 measurements describe that
particular v2.3 change, not a present token budget or measured agent improvement.
The implementation still provides selection, direct claiming, closure,
rendering and diagnostic seams in the manifest-resolved spec runtime.

Several original design details have evolved. The Blueprint now describes the
destination and carries no generated capability catalog; the catalog belongs
under the declared Specs lane. Tasks can have standalone records. Lifecycle
moves use the owning tools, so an original never-move path rule is historical.
Completed evidence must remain recoverable, but a completed Spec is not
necessarily permanent current documentation. Current controls and accepted
lifecycle decisions govern those distinctions.

The durable lesson is ownership plus a short route: load the owner of the
question instead of copying its answer into every startup surface. Structural
checks and context reduction do not prove better agent outcomes.

## Evidence and Sources

- [Historical S-001 record](../../specs/S-001-progressive-disclosure/SPEC.md). Original decisions, evidence and limitations remain preserved.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-001-progressive-disclosure/SPEC.md). Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-001-progressive-disclosure/SPEC.md`.
- [AGENTS.md](../../../AGENTS.md) — current owning source or verification seam.
- [RUNBOOK.md](../../../RUNBOOK.md) — current owning source or verification seam.
- [LEXICON.md](../../../LEXICON.md) — current owning source or verification seam.
- [BLUEPRINT.md](../../../BLUEPRINT.md) — current owning source or verification seam.
- [workbench/tools/spec-workbench.mjs](../../../workbench/tools/spec-workbench.mjs) — current owning source or verification seam.
- [tools/test-spec-workbench.mjs](../../../tools/test-spec-workbench.mjs) — current owning source or verification seam.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec; read the full historical record and checked the named live sources. Historical proof is distinguished from current behavior. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
