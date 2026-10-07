---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner requested one durable Wiki article per Spec on 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task TK-002 (Move and retype the remaining per-Spec articles) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-00L-lexicon-freshness-repair/SPEC.md
  - GLOSSARY.md
  - ARCHITECTURE.md
  - workbench/manifest.json
  - tools/test-governance-core.mjs
  - tools/test-control-fidelity.mjs
last_verified: 2026-10-04
---

# Lexicon Freshness Repair

A terminology router also contains claims that can go stale: release lineage, a
current candidate version, source boundaries and its verification stamp. The
Lexicon Freshness Repair Spec (S-00L) repaired those claims in the Lexicon
without changing the meaning of the affected definitions.

## What It Does

The method compares version claims with the manifest and Git containment,
resolves links, and checks declared counts against their owning inventory.
Historical versions remain dated history. The Foundry boundary is defined
without tying it to an expired release window.

## Why It Matters

This illustrates why passing structural tests is insufficient for prose
freshness. A reviewed sentence about the current release can become stale after a
later stamp or promotion, even while its links and Markdown remain valid.

## Limits

- The source completion says the Lexicon named v3.2.1 as its integration
  candidate and v3.2.0 as the then-main version. Those are time-bound results,
  not a live remote-status claim in this article. Current versions must be read
  from the manifest and verified branch state.
- The repair intentionally left unrelated README drift and self-drift
  automation to their respective owners.
- Historical results are attributed to the Spec record; they were not rerun for
  this article.

## Evidence and Sources

- [Historical Lexicon Freshness Repair Spec (S-00L)](../../specs/S-00L-lexicon-freshness-repair/SPEC.md). Original decisions, corrections, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-00L-lexicon-freshness-repair/SPEC.md). The source record and named owners were read at that commit. Recover the original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-00L-lexicon-freshness-repair/SPEC.md`.
- The Lexicon, the terminology router the repair concerned, retires into [GLOSSARY.md](../../../GLOSSARY.md) and [ARCHITECTURE.md](../../../ARCHITECTURE.md) ([the Lexicon retirement](../../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [workbench/manifest.json](../../../workbench/manifest.json) - the version source current claims are read from.
- [tools/test-governance-core.mjs](../../../tools/test-governance-core.mjs) and [tools/test-control-fidelity.mjs](../../../tools/test-control-fidelity.mjs) - the verification seams.

## History

- 2026-09-19: Reconciled into one Spec article on owner direction. Original source and proof remain intact; this article does not authorize retirement or discard.
- 2026-10-04: Moved from `design-concepts/spec-S-00L-lexicon-freshness-repair.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task TK-002 (Move and retype the remaining per-Spec articles). Every live link to it was rewritten by the move; no claim was changed.
- 2026-10-07: Re-pointed the retiring Lexicon's links and live routes to `GLOSSARY.md`, `ARCHITECTURE.md` and the Wiki lexicon articles (Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), consumer re-pointing Task (TK-009F)); no claim changed.
