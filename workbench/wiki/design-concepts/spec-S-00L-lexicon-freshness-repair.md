---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner requested one durable Wiki article per Spec on 2026-09-19
source_paths:
  - workbench/specs/S-00L-lexicon-freshness-repair/SPEC.md
  - LEXICON.md
  - workbench/manifest.json
  - tools/test-governance-core.mjs
  - tools/test-control-fidelity.mjs
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# S-00L: Lexicon Freshness Repair

A terminology router also contains claims that can go stale: release lineage, a current candidate version, source boundaries and its verification stamp. S-00L repaired those claims without changing the meaning of the affected definitions.

The method compares version claims with the manifest and Git containment, resolves links, and checks declared counts against their owning inventory. Historical versions remain dated history. The Foundry boundary is defined without tying it to an expired release window.

This illustrates why passing structural tests is insufficient for prose freshness. A reviewed sentence about the current release can become stale after a later stamp or promotion, even while its links and Markdown remain valid.

## Historical proof and limits

The source completion says the Lexicon named v3.2.1 as its integration candidate and v3.2.0 as the then-main version. Those are time-bound results, not a live remote-status claim in this article. The repair intentionally left unrelated README drift and self-drift automation to their respective owners. Current versions must be read from the manifest and verified branch state.

## Evidence and Sources

The source record and named owners were read at `bc370fe742d5ddb8348bf361fccea31205f6cee7`. Historical results above are attributed to that record; they were not rerun for this article. Recover its exact original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-00L-lexicon-freshness-repair/SPEC.md`.

- [workbench/specs/S-00L-lexicon-freshness-repair/SPEC.md](../../../workbench/specs/S-00L-lexicon-freshness-repair/SPEC.md)
- [LEXICON.md](../../../LEXICON.md)
- [workbench/manifest.json](../../../workbench/manifest.json)
- [tools/test-governance-core.mjs](../../../tools/test-governance-core.mjs)
- [tools/test-control-fidelity.mjs](../../../tools/test-control-fidelity.mjs)

## History

- 2026-09-19: Reconciled into one Spec article on owner direction. Original source and proof remain intact; this article does not authorize retirement or discard.
