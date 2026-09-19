---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner requested one durable Wiki article per Spec on 2026-09-19
source_paths:
  - workbench/specs/S-00D-genesis-from-blueprint-and-adrs/SPEC.md
  - tools/genesis-from-decisions.mjs
  - tools/test-genesis-from-decisions.mjs
  - skills/genesis/SKILL.md
  - templates/GENESIS.md
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# S-00D: Genesis From Blueprint And ADR Decisions

The public derivation seam creates a new Workbench from a clean Template, a source project, a prepared grilling note and an explicit `genesis-plan-1` plan. It requires an absent destination and derives exactly one first capability from selected locked questions and active ADRs.

The plan supplies the project controls and Wiki router. The receipt preserves Template controls, evidence bytes, decision wording and interpretation, with distinct source and new-room identities. Unselected and open material stays distinguishable from decisions used to derive the first Spec.

The generator checks structure, source lineage and decision status. It does not certify the semantic quality of caller-authored prose or make an agent's interpretation an owner decision. Blueprint target + active ADRs + verified Actuality/evidence -> Spec remains the derivation model.

## Historical proof and limits

The source record reports a forty-five-command suite at 6a8075721c818cc45ad9b001362bca0b180f76d9, later generic-input and invalid-destination ADR checks, and a native derivation with a new room identity. These are historical seam results. Current usage belongs to the Runbook and Genesis skill; no external room was regenerated to author this article.

## Evidence and Sources

The source record and named owners were read at `bc370fe742d5ddb8348bf361fccea31205f6cee7`. Historical results above are attributed to that record; they were not rerun for this article. Recover its exact original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-00D-genesis-from-blueprint-and-adrs/SPEC.md`.

- [workbench/specs/S-00D-genesis-from-blueprint-and-adrs/SPEC.md](../../../workbench/specs/S-00D-genesis-from-blueprint-and-adrs/SPEC.md)
- [tools/genesis-from-decisions.mjs](../../../tools/genesis-from-decisions.mjs)
- [tools/test-genesis-from-decisions.mjs](../../../tools/test-genesis-from-decisions.mjs)
- [skills/genesis/SKILL.md](../../../skills/genesis/SKILL.md)
- [templates/GENESIS.md](../../../templates/GENESIS.md)

## History

- 2026-09-19: Reconciled into one Spec article on owner direction. Original source and proof remain intact; this article does not authorize retirement or discard.
