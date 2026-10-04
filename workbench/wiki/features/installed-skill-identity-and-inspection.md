---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task Move And Retype The Remaining Per-Spec Articles (TK-002) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-031-installed-skill-generation/SPEC.md
  - tools/skill-marker.mjs
  - workbench/tools/skill-inspection.mjs
  - workbench/tools/workbench-layout.mjs
  - workbench/skills/README.md
  - templates/feedback/REPORT_FORMAT.md
  - tools/test-skill-inspection.mjs
  - tools/test-core-skill-installer.mjs
last_verified: 2026-10-04
---

# Installed Skill Identity And Inspection

The Workbench lets a reviewer say which skill source and which installed copy
was actually read, and how the two relate. The
Installed Skill Generation Visibility Spec (S-031) delivered the managed marker
and the read-only inspection around it, because a canonical skill source and an
installed copy can diverge.

## What It Does

- **Managed markers.** A marker records source, schema, producing release,
  commit and a content hash. Current markers also declare a room compatibility
  range. The hash covers relative source paths and bytes, excluding the marker
  itself.
- **Read-only inspection.** Inspection distinguishes missing or broken
  discovery, incomplete generation identity, modified content, unknown
  compatibility, incompatible room versions and conflicting maintained sources
  or generations. Its current check compares the installed bytes against the
  recorded hash and preserves modified content; it also checks the validated
  compatibility range, so different releases can be compatible.
- **Report format.** The report format keeps source and installed-copy claims
  distinct.
- **Session ignore rules.** Session ignore rules also protect the legacy spaced
  `grilling diary/` directory so an older skill cannot accidentally make local
  continuity trackable.

## Why It Matters

A review must name the path and commit it actually read; text from a user
discovery root cannot be attributed to the release merely because the skill
name matches.

## Limits

- The original rule of the Installed Skill Generation Visibility Spec (S-031)
  reported any release inequality as stale; the current inspector instead checks
  its validated compatibility range. That original rule is historical.
- The original no-content-comparison limitation is also historical, as stated
  above.
- Inspection does not authorize replacement. Presence-only setup and explicit
  updates remain separate operations, and installation and explicit update
  tools own any actual mutation of the discovery roots.
- The ignore rule for the legacy spaced `grilling diary/` directory does not
  endorse the old path as a live owner.
- The old host-specific count of unknown generations is not current evidence.
- A complete marker and readable source establish filesystem identity and
  structural compatibility, not native host invocation or reliable agent
  behavior.

## Evidence and Sources

- [Historical Installed Skill Generation Visibility Spec (S-031)](../../specs/S-031-installed-skill-generation/SPEC.md). Original decisions, corrections, evidence and limitations remain preserved; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `7f314af`](https://github.com/KaydenClark/LLM_Workbench/blob/7f314af2bd9ad8693ed570912568180acd742779/workbench/specs/S-031-installed-skill-generation/SPEC.md). Recover the original with `git show 7f314af2bd9ad8693ed570912568180acd742779:workbench/specs/S-031-installed-skill-generation/SPEC.md`.
- [tools/skill-marker.mjs](../../../tools/skill-marker.mjs) - the managed marker.
- [workbench/tools/skill-inspection.mjs](../../../workbench/tools/skill-inspection.mjs) - the read-only inspection.
- [workbench/tools/workbench-layout.mjs](../../../workbench/tools/workbench-layout.mjs) - the installed-layout owner.
- [workbench/skills/README.md](../../skills/README.md) - the skills lane overview.
- [templates/feedback/REPORT_FORMAT.md](../../../templates/feedback/REPORT_FORMAT.md) - the report format that keeps source and installed-copy claims distinct.
- [tools/test-skill-inspection.mjs](../../../tools/test-skill-inspection.mjs) and [tools/test-core-skill-installer.mjs](../../../tools/test-core-skill-installer.mjs) - the verification seams.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec after reading its full record and checking named live sources. Evolved or superseded claims are identified explicitly. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
- 2026-09-30: Repaired live skill links and source_paths after relocation to workbench/skills; verified destinations only, without revalidating historical capability claims.
- 2026-10-04: Moved from `design-concepts/spec-S-031-installed-skill-generation.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task Move And Retype The Remaining Per-Spec Articles (TK-002). Every live link to it was rewritten by the move; no claim was changed. Checked the Spec name, that every listed source path exists, and that the marker source carries a content hash and a compatibility range; the other claims were not re-verified.
