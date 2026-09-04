---
status: proposed
date: 2026-09-04
canonicalized_in:
  - BLUEPRINT.md
  - RUNBOOK.md
---

# Portable runtime tools are Workbench-managed in the tools lane; root tools stay application-owned

The manifest-declared `workbench/tools/` lane holds the Workbench-managed portable runtime tools every project runs day to day, installed from one canonical source, the released Workbench's own `workbench/tools/`, with a receipt that records the exact source release, commit, and per-file hashes. An application's root `tools/` directory remains application-owned and is never absorbed, overwritten, or required. Managed files change only through an explicit update that backs up the previous files and records a rollback path; installed files carry mechanical, non-executable permissions and are never symlinks.

Considered and rejected: copying runtime tools into the application's root `tools/`, and pointing every consumer at the product checkout. The first mixed two owners in one directory with no way to tell which files an upgrade may touch; the second made a project unusable without the product repository beside it.

Consequences: no active consumer names a root tools path for a runtime tool after migration; the product repository dogfoods the split, keeping setup, migration, evaluation, and test tooling in its own root `tools/`.

Provenance: owner-reviewed v3.1 greenlight decision, promoted 2026-09-04; see the tracked checkpoint `llm-workbench-v3-1-plan-2026-09-04.md` in the manifest-declared checkpoint collection.
