---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner requested one durable Wiki article per Spec on 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task TK-002 (Move and retype the remaining per-Spec articles) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-00D-genesis-from-blueprint-and-adrs/SPEC.md
  - tools/genesis-from-decisions.mjs
  - tools/test-genesis-from-decisions.mjs
  - workbench/skills/genesis/SKILL.md
  - templates/GENESIS.md
last_verified: 2026-10-04
---

# Genesis From Blueprint Decisions And Active ADRs

The Workbench can create a new project from a clean Template, a source project,
a prepared grilling note and an explicit `genesis-plan-1` plan, deriving exactly
one first capability from selected locked questions and active ADRs. The Genesis
From Blueprint And Active ADRs Spec (S-00D) delivered this public derivation
seam.

## What It Does

The public derivation seam requires an absent destination and derives exactly
one first capability from selected locked questions and active ADRs. The plan
supplies the project controls and Wiki router.

The receipt preserves Template controls, evidence bytes, decision wording and
interpretation, with distinct source and new-room identities. Unselected and
open material stays distinguishable from decisions used to derive the first
Spec.

## Why It Matters

Blueprint target + active ADRs + verified Actuality/evidence -> Spec remains the
derivation model. Keeping unselected and open material distinguishable from the
decisions used means an agent's interpretation is not mistaken for an owner
decision.

## Limits

- The generator checks structure, source lineage and decision status. It does
  not certify the semantic quality of caller-authored prose or make an agent's
  interpretation an owner decision.
- The source record reports a forty-five-command suite at
  `6a8075721c818cc45ad9b001362bca0b180f76d9`, later generic-input and
  invalid-destination ADR checks, and a native derivation with a new room
  identity. These are historical seam results.
- Current usage belongs to the Runbook and Genesis skill; no external room was
  regenerated to author the original article.
- Historical results are attributed to the Spec record; they were not rerun for
  this article.

## Evidence and Sources

- [Historical Genesis From Blueprint And Active ADRs Spec (S-00D)](../../specs/S-00D-genesis-from-blueprint-and-adrs/SPEC.md). Original decisions, corrections, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-00D-genesis-from-blueprint-and-adrs/SPEC.md). The source record and named owners were read at that commit. Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-00D-genesis-from-blueprint-and-adrs/SPEC.md`.
- [tools/genesis-from-decisions.mjs](../../../tools/genesis-from-decisions.mjs) - the derivation generator.
- [tools/test-genesis-from-decisions.mjs](../../../tools/test-genesis-from-decisions.mjs) - its verification seam.
- [workbench/skills/genesis/SKILL.md](../../skills/genesis/SKILL.md) - the Genesis skill, owner of current usage with the Runbook.
- [templates/GENESIS.md](../../../templates/GENESIS.md) - the Template's Genesis document.

## History

- 2026-09-19: Reconciled into one Spec article on owner direction. Original source and proof remain intact; this article does not authorize retirement or discard.
- 2026-09-30: Repaired live skill links and source_paths after relocation to workbench/skills; verified destinations only, without revalidating historical capability claims.
- 2026-10-04: Moved from `design-concepts/spec-S-00D-genesis-from-blueprint-and-adrs.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task TK-002 (Move and retype the remaining per-Spec articles). Every live link to it was rewritten by the move; no claim was changed.
