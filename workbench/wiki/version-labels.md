---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - The Lexicon Retirement Spec (S-004O), its Wiki-only reference pages Task (TK-009K), moved the Lexicon row here, 2026-10-07
source_paths:
  - workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md
  - workbench/manifest.json
  - workbench/specs/S-021-portable-workbench-v3/SPEC.md
  - workbench/specs/S-050-workbench-v3-2-0-release/SPEC.md
  - workbench/specs/S-00O-workbench-v4-0-0-release/SPEC.md
last_verified: 2026-10-07
---

# Version labels: what each Workbench stamp means

A Workbench version label is the stamp a release or candidate carries, such as `v3.2.1`. The labels form a history, not a promise that each one shipped. v3.0.0 is the completed portable-layout candidate (S-021, S-015) that was never promoted to `main`.

**What it means here.** v3.0.0 is an unreleased internal candidate, and v3.1.0 is likewise preserved and unreleased. Later stamps each live in their owning Spec: the v3.1.1 boundaries Spec (S-027) continued that baseline as v3.1.1; the v3.1.2 candidate Spec (S-035) stamped v3.1.2; the assignment ownership Spec (S-049) opened v3.1.3; the JSON notepad foundation Spec (S-046) stamped v3.1.4; the v3.2.0 release Spec (S-050) stamped v3.2.0; and the fresh Template project proof Spec (S-00E) marked v3.2.1, the version `workbench/manifest.json` declares.

**Where the Workbench depends on it.** A room compares its declared version with the release it updates from, so a label must name one exact state. The next label is frozen by the release owner, not by whichever Spec lands last; read the manifest for the current value rather than this page.

## Sources

- This page is the concept's Workbench home: a general reference concept stays Wiki-only and needs no [GLOSSARY.md](../../GLOSSARY.md) entry ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [workbench/manifest.json](../manifest.json): the `workbenchVersion` this room declares.
- [S-021 - Portable Workbench v3](../specs/S-021-portable-workbench-v3/SPEC.md) and [S-015 - Portable v3 release audit recovery](../specs/S-015-portable-v3-release-audit-recovery/SPEC.md): the portable-layout candidate stamped v3.0.0.
- [S-027 - v3.1.1 boundaries](../specs/S-027-workbench-v3-1-1-boundaries/SPEC.md), [S-035 - v3.1.2 candidate](../specs/S-035-workbench-v3-1-2-candidate/SPEC.md), [S-050 - v3.2.0 release](../specs/S-050-workbench-v3-2-0-release/SPEC.md) and [S-00E - Fresh Template project proof](../specs/S-00E-fresh-template-project-proof/SPEC.md): the Specs that own the later stamps.
- [S-00O - Workbench v4.0.0 Release](../specs/S-00O-workbench-v4-0-0-release/SPEC.md): the release owner that freezes the next label.
