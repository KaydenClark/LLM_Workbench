---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task Move And Retype Remaining Per-Spec Articles (TK-002) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-042-installed-state-repair/SPEC.md
  - workbench/tools/workbench-layout.mjs
  - workbench/tools/spec-workbench.mjs
  - workbench/tools/adr.mjs
  - workbench/tools/wiki.mjs
  - tools/test-diagnostics.mjs
  - tools/test-workbench-layout.mjs
  - tools/test-adr.mjs
  - tools/test-wiki.mjs
last_verified: 2026-10-04
---

# Installed State Reporting And Repair

The Workbench reports when the documents it seeded into a room have gone stale and repairs missing metadata in an existing room without reinstalling or replacing project-owned content. The Repairing Installed State The Harness Wrote Spec (S-042) delivered this by separating the ownership of seeded documents from the ownership of managed runtime files.

## What It Does

- **Two ownerships.** Seeded documents and managed runtime files have different ownership. Runtime receipts assert managed-byte identity; a room may legitimately adapt seeded guidance. A separate seed-generation record therefore reports stale seed provenance without turning every local edit into runtime tampering.
- **Normalization.** Normalization fills missing required metadata while preserving existing fields and bodies.
- **Source backfill.** Source backfill verifies the available release checkout rather than accepting a caller's unsupported provenance string.
- **Where the findings are emitted.** The Repairing Installed State The Harness Wrote Spec (S-042) originally emitted `stale-seed` and `unverified-provenance` through the Wiki validator because another lane owned doctor. The v3.1.2 Follow-Ups Left Without An Owner Spec (S-045) moved them to the installed-state collection checks in `spec-workbench`; the historical routing debt is not current guidance. ADR normalization now follows folder lifecycle and does not reintroduce a lifecycle status key.

## Why It Matters

A room may legitimately adapt its seeded guidance, so reporting stale seed provenance must not turn every local edit into runtime tampering. These are report-and-repair paths for existing rooms, not a reason to reinstall or replace project-owned content wholesale.

## Limits

- Seed generation does not distinguish intentional local prose from an old copy.
- Backfilled provenance is weaker than identity captured at installation.
- Normalization is not an all-files transaction.
- Temporary-file publication can change modes.
- Arbitrary forged seed keys are reported rather than automatically pruned.
- The original claimed approval lacked a corresponding evidence row and remains an evidence uncertainty, not a retroactively manufactured PASS.
- Current command sources and tests establish the maintenance mechanisms. They do not authorize automatic repair of another project or prove the historical state of a room before provenance was recorded.

## Evidence and Sources

- [Historical Repairing Installed State The Harness Wrote Spec (S-042)](../../specs/S-042-installed-state-repair/SPEC.md). Original decisions, corrections, acceptance and evidence retain their own scope; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `b38509d`](https://github.com/KaydenClark/LLM_Workbench/blob/b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb/workbench/specs/S-042-installed-state-repair/SPEC.md). Recover the original with `git show b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb:workbench/specs/S-042-installed-state-repair/SPEC.md`. Current source inspection for the original article used that same commit; historical runtime or host limits are identified as such rather than promoted to fresh measurements.
- [workbench/tools/workbench-layout.mjs](../../../workbench/tools/workbench-layout.mjs) - installed-layout owner.
- [workbench/tools/spec-workbench.mjs](../../../workbench/tools/spec-workbench.mjs) - the installed-state collection checks where the seed findings now live.
- [workbench/tools/adr.mjs](../../../workbench/tools/adr.mjs) - ADR normalization.
- [workbench/tools/wiki.mjs](../../../workbench/tools/wiki.mjs) - the Wiki validator that originally carried the seed findings.
- [tools/test-diagnostics.mjs](../../../tools/test-diagnostics.mjs), [tools/test-workbench-layout.mjs](../../../tools/test-workbench-layout.mjs), [tools/test-adr.mjs](../../../tools/test-adr.mjs) and [tools/test-wiki.mjs](../../../tools/test-wiki.mjs) - the verification seams.

## History

- 2026-09-19: Created on explicit owner direction for one Wiki article per legacy Spec. Preserved useful knowledge, correction lineage and proof limitations; no source record retired or discarded.
- 2026-10-04: Moved from `design-concepts/spec-S-042-installed-state-repair.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task Move And Retype Remaining Per-Spec Articles (TK-002). Every live link to it was rewritten by the move; no claim was changed.
