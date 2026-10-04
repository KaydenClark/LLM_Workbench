---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task Move And Retype Remaining Per-Spec Articles (TK-002) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-045-v3-1-2-follow-ups/SPEC.md
  - tools/skill-presence.mjs
  - tools/core-skill-installer.mjs
  - workbench/tools/spec-workbench.mjs
  - tools/test-diagnostics.mjs
  - tools/test-workbench-layout.mjs
  - tools/test-spec-citation-anchors.mjs
  - tools/check-append-only.py
  - AGENTS.md
last_verified: 2026-10-04
---

# Linked Follow-Up Reconciliation

An accepted obligation that a completed result leaves behind gets a new owner instead of surviving only as prose in a closed record. The v3.1.2 Follow-Ups Left Without An Owner Spec (S-045) delivered this by collecting seven bounded follow-ups without reopening the completed implementation records they came from.

## What It Does

- **Seven follow-ups, one owner.** The v3.1.2 Follow-Ups Left Without An Owner Spec (S-045) collected seven bounded follow-ups from [Installed Runtime Integrity (S-039)](installed-runtime-integrity.md) through [Adoption Preflight And Legacy Classification (S-044)](adoption-preflight-and-legacy-classification.md), without reopening their completed implementation records. Dependencies and owner direction became executable work rather than disappearing into historical prose.
- **Mechanisms.** The implementation centralized skill-presence judgment, supported linked or Git-owned discovery roots for missing-skill installation without changing Git state, moved installed-state diagnostics to their proper emitter, strengthened the registry pin and broadened classifier snapshots. These mechanisms are maintained in their source owners; this article preserves why they were brought together.
- **Documentation repairs.** Citations into changing files require an immutable tree anchor, because integration changes line numbers. A range check proves a citation exists at that tree, not that its meaning supports the claim. A host description must preserve the measured symlink level and reachable refusal, rather than infer them from similarly named errors.
- **Correction chain.** The record corrected its own mistaken claim that earlier main-branch descriptions had been false when written: they were accurate then and became stale later that day. Preserve that correction chain. Four skipped review gates were established; the approving review of the Repairing Installed State The Harness Wrote Spec (S-042) remained unresolved because the header asserted it without an evidence row.

## Why It Matters

A completed result can leave an accepted obligation that needs a new owner. Dependencies and owner direction recorded as executable work do not vanish into the prose of a closed record.

## Limits

- The historical full-suite and host installation results have their original scope.
- Integration delivery did not authorize publication.
- The widened append-only scanner can misdiagnose prose beneath an evidence table.
- Early Specs remain grandfathered in citation checks.
- Neither scanner limitation is silently converted into a new assignment by this article.

## Evidence and Sources

- [Historical v3.1.2 Follow-Ups Left Without An Owner Spec (S-045)](../../specs/S-045-v3-1-2-follow-ups/SPEC.md). Original decisions, corrections, acceptance and evidence retain their own scope; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `b38509d`](https://github.com/KaydenClark/LLM_Workbench/blob/b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb/workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md). The original is recoverable from that commit. Current source inspection for the original article used that same commit; historical runtime or host limits are identified as such rather than promoted to fresh measurements.
- [tools/skill-presence.mjs](../../../tools/skill-presence.mjs) - the centralized skill-presence judgment.
- [tools/core-skill-installer.mjs](../../../tools/core-skill-installer.mjs) - missing-skill installation over linked or Git-owned discovery roots.
- [workbench/tools/spec-workbench.mjs](../../../workbench/tools/spec-workbench.mjs) - the installed-state collection checks.
- [tools/test-diagnostics.mjs](../../../tools/test-diagnostics.mjs), [tools/test-workbench-layout.mjs](../../../tools/test-workbench-layout.mjs) and [tools/test-spec-citation-anchors.mjs](../../../tools/test-spec-citation-anchors.mjs) - the verification seams for the registry pin, classifier snapshots and citation anchors.
- [tools/check-append-only.py](../../../tools/check-append-only.py) - the append-only scanner whose widened scope has the limit named above.
- [AGENTS.md](../../../AGENTS.md) - the contract that carries the citation-anchor rule.

## History

- 2026-09-19: Created on explicit owner direction for one Wiki article per legacy Spec. Preserved useful knowledge, correction lineage and proof limitations; no source record retired or discarded.
- 2026-10-04: Moved from `design-concepts/spec-S-045-linked-follow-up-reconciliation.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task Move And Retype Remaining Per-Spec Articles (TK-002). Every live link to it was rewritten by the move; no claim was changed.
