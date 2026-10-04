---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
  - Moved into the features collection and restructured as a feature article by the Move And Retype The Remaining Per-Spec Articles Task (TK-002) of the Wiki Evolving-Synthesis Migration Spec (S-003W) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-004-safe-direct-claim/SPEC.md
  - workbench/tools/spec-workbench.mjs
  - workbench/tools/spec-packet.mjs
  - tools/test-spec-workbench.mjs
  - AGENTS.md
last_verified: 2026-10-04
---

# Dependency-Safe Direct Claiming

The Safe Direct Claim Spec (S-004) made direct claiming enforce the same
dependencies as selection. An agent may already know its assigned Spec and skip
a general selector; that shortcut must not let it claim a ready Task whose
prerequisite is unfinished.

## What It Does

The current claim implementation asks the shared candidate selector for an
eligible ready Task within the named Spec. If none qualifies, it distinguishes
an explicitly ready but blocked slice from the absence of eligible work and
refuses before changing the Task or Spec. Satisfied dependencies include
completed local Tasks and qualifying completed/superseded Specs, using the
runtime's declared blocker interpretation. On record-backed work, the claim
writes the Task's state before updating the Spec's owner and event fields; the
Spec runtime owns those transitions.

## Why It Matters

Selection and claiming share an eligibility decision instead of maintaining two
independent shortcuts. Explicit assignment narrows which packet to inspect; it
does not erase that packet's blockers.

## Limits

- This capability is not a general dependency scheduler and does not authorize
  agents to manufacture new queue items.
- The July 2026 proof concerns the direct-claim defect: the historical
  regression used a ready slice naming a missing Spec dependency and expected
  direct claim to fail.
- Current Task terminology, file layout and lifecycle gates come from the
  current controls and runtime.

## Evidence and Sources

- [Historical Safe Direct Claim Spec (S-004)](../../specs/S-004-safe-direct-claim/SPEC.md). Original decisions, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-004-safe-direct-claim/SPEC.md). Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-004-safe-direct-claim/SPEC.md`.
- [workbench/tools/spec-workbench.mjs](../../../workbench/tools/spec-workbench.mjs) - the spec runtime that owns claiming and its transitions.
- [workbench/tools/spec-packet.mjs](../../../workbench/tools/spec-packet.mjs) - the Spec packet parser the runtime imports.
- [tools/test-spec-workbench.mjs](../../../tools/test-spec-workbench.mjs) - the verification seam.
- [AGENTS.md](../../../AGENTS.md) - the contract that names the claim step.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec; read the full historical record and checked the named live sources. Historical proof is distinguished from current behavior. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
- 2026-10-04: Moved from `design-concepts/spec-S-004-safe-direct-claim.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Move And Retype The Remaining Per-Spec Articles Task (TK-002) of the Wiki Evolving-Synthesis Migration Spec (S-003W). Every live link to it was rewritten by the move; no claim was changed.
