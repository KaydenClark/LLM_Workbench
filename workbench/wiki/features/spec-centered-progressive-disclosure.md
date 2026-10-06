---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
  - Moved into the features collection and restructured as a feature article by the Move And Retype The Remaining Per-Spec Articles Task (TK-002) of the Wiki Evolving-Synthesis Migration Spec (S-003W) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-001-progressive-disclosure/SPEC.md
  - AGENTS.md
  - RUNBOOK.md
  - LEXICON.md
  - BLUEPRINT.md
  - workbench/tools/spec-workbench.mjs
  - tools/test-spec-workbench.mjs
last_verified: 2026-10-04
---

# Spec-Centered Progressive Disclosure

Ordinary entry stays small: an agent reads the agent contract, follows the
Runbook and Lexicon routes, then loads the assigned capability and its relevant
source. The Spec-Centered Progressive Disclosure Spec (S-001) established that
separation when startup material mixed product detail, completed evidence and
live work.

## What It Does

Progressive disclosure keeps ordinary entry small: read the agent contract,
follow the Runbook and Lexicon routes, then load the assigned capability and
its relevant source. A Spec carries the assignment and its proof; the hot
Taskboard derives an operational view. Reading an entire historical catalog is
not a prerequisite for doing one bounded piece of work. The implementation
still provides selection, direct claiming, closure, rendering and diagnostic
seams in the manifest-resolved spec runtime.

## Why It Matters

The durable lesson is ownership plus a short route: load the owner of the
question instead of copying its answer into every startup surface.

## Limits

- The July 2026 measurements describe that particular v2.3 change, not a
  present token budget or measured agent improvement.
- Structural checks and context reduction do not prove better agent outcomes.
- Several original design details have evolved. The Blueprint now describes the
  destination and carries no generated capability catalog; the catalog belongs
  under the declared Specs lane. Tasks can have standalone records. Lifecycle
  moves use the owning tools, so an original never-move path rule is historical.
- Completed evidence must remain recoverable, but a completed Spec is not
  necessarily permanent current documentation. Current controls and accepted
  lifecycle decisions govern those distinctions.

## Evidence and Sources

- [Historical Spec-Centered Progressive Disclosure Spec (S-001)](../../specs/S-001-progressive-disclosure/SPEC.md). Original decisions, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-001-progressive-disclosure/SPEC.md). Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-001-progressive-disclosure/SPEC.md`.
- [AGENTS.md](../../../AGENTS.md) - the agent contract that starts ordinary entry.
- [RUNBOOK.md](../../../RUNBOOK.md) - the operations index and procedures entry follows.
- [LEXICON.md](../../../LEXICON.md) - the routing and vocabulary owner.
- [BLUEPRINT.md](../../../BLUEPRINT.md) - the destination owner, which carries no generated catalog.
- [workbench/tools/spec-workbench.mjs](../../../workbench/tools/spec-workbench.mjs) - the manifest-resolved spec runtime that provides the seams.
- [tools/test-spec-workbench.mjs](../../../tools/test-spec-workbench.mjs) - the verification seam for that runtime.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec; read the full historical record and checked the named live sources. Historical proof is distinguished from current behavior. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
- 2026-10-04: Moved from `design-concepts/spec-S-001-progressive-disclosure.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Move And Retype The Remaining Per-Spec Articles Task (TK-002) of the Wiki Evolving-Synthesis Migration Spec (S-003W). Every live link to it was rewritten by the move; no claim was changed.
