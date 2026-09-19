---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
source_paths:
  - workbench/specs/S-004-safe-direct-claim/SPEC.md
  - workbench/tools/spec-workbench.mjs
  - workbench/tools/spec-packet.mjs
  - tools/test-spec-workbench.mjs
  - AGENTS.md
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Dependency-Safe Direct Claiming

Direct claiming must enforce the same dependencies as selection. An agent may
already know its assigned Spec and skip a general selector; that shortcut must
not let it claim a ready Task whose prerequisite is unfinished.

The current claim implementation asks the shared candidate selector for an
eligible ready Task within the named Spec. If none qualifies, it distinguishes
an explicitly ready but blocked slice from the absence of eligible work and
refuses before changing the Task or Spec. Satisfied dependencies include
completed local Tasks and qualifying completed/superseded Specs, using the
runtime's declared blocker interpretation. The historical regression used a
ready slice naming a missing Spec dependency and expected direct claim to fail.

Selection and claiming therefore share an eligibility decision instead of
maintaining two independent shortcuts. On record-backed work, the claim writes
the Task's state before updating the Spec's owner and event fields; the Spec
runtime owns those transitions.

This capability is not a general dependency scheduler and does not authorize
agents to manufacture new queue items. Explicit assignment narrows which
packet to inspect; it does not erase that packet's blockers. The July 2026
proof concerns the direct-claim defect. Current Task terminology, file layout
and lifecycle gates come from the current controls and runtime.

## Evidence and Sources

- [Historical S-004 record](../../specs/S-004-safe-direct-claim/SPEC.md). Original decisions, evidence and limitations remain preserved.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-004-safe-direct-claim/SPEC.md). Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-004-safe-direct-claim/SPEC.md`.
- [workbench/tools/spec-workbench.mjs](../../../workbench/tools/spec-workbench.mjs) — current owning source or verification seam.
- [workbench/tools/spec-packet.mjs](../../../workbench/tools/spec-packet.mjs) — current owning source or verification seam.
- [tools/test-spec-workbench.mjs](../../../tools/test-spec-workbench.mjs) — current owning source or verification seam.
- [AGENTS.md](../../../AGENTS.md) — current owning source or verification seam.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec; read the full historical record and checked the named live sources. Historical proof is distinguished from current behavior. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
