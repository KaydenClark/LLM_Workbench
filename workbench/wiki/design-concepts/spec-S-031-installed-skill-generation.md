---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed per-Spec reconciliation, 2026-09-19
source_paths:
  - workbench/specs/S-031-installed-skill-generation/SPEC.md
  - tools/skill-marker.mjs
  - workbench/tools/skill-inspection.mjs
  - workbench/tools/workbench-layout.mjs
  - skills/README.md
  - templates/feedback/REPORT_FORMAT.md
  - tools/test-skill-inspection.mjs
  - tools/test-core-skill-installer.mjs
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Installed Skill Identity And Inspection

A canonical skill source and an installed copy can diverge. A review must
name the path and commit it actually read; text from a user discovery root
cannot be attributed to the release merely because the skill name matches.

Managed markers record source, schema, producing release, commit and a content
hash. Current markers also declare a room compatibility range. The hash covers
relative source paths and bytes, excluding the marker itself. Read-only
inspection distinguishes missing or broken discovery, incomplete generation
identity, modified content, unknown compatibility, incompatible room versions
and conflicting maintained sources or generations.

S-031's original rule reported any release inequality as stale. The current
inspector instead checks its validated compatibility range; different releases
can be compatible. Its original no-content-comparison limitation is also
historical: current inspection checks installed bytes against the recorded
hash and preserves modified content. This does not authorize replacement.
Presence-only setup and explicit updates remain separate operations.

The report format keeps source and installed-copy claims distinct. Session
ignore rules also protect the legacy spaced `grilling diary/` directory so an
older skill cannot accidentally make local continuity trackable. That defense
does not endorse the old path as a live owner.

The old host-specific count of unknown generations is not current evidence.
A complete marker and readable source establish filesystem identity and
structural compatibility, not native host invocation or reliable agent
behavior. Installation and explicit update tools own any actual mutation of
the discovery roots.

## Evidence and Sources

- [Historical S-031 record](../../specs/S-031-installed-skill-generation/SPEC.md). Original decisions, corrections, evidence and limitations remain preserved.
- [Immutable source and proof at `7f314af`](https://github.com/KaydenClark/LLM_Workbench/blob/7f314af2bd9ad8693ed570912568180acd742779/workbench/specs/S-031-installed-skill-generation/SPEC.md). Recover the original with `git show 7f314af2bd9ad8693ed570912568180acd742779:workbench/specs/S-031-installed-skill-generation/SPEC.md`.
- [tools/skill-marker.mjs](../../../tools/skill-marker.mjs) — current owning source or verification seam.
- [workbench/tools/skill-inspection.mjs](../../../workbench/tools/skill-inspection.mjs) — current owning source or verification seam.
- [workbench/tools/workbench-layout.mjs](../../../workbench/tools/workbench-layout.mjs) — current owning source or verification seam.
- [skills/README.md](../../../skills/README.md) — current owning source or verification seam.
- [templates/feedback/REPORT_FORMAT.md](../../../templates/feedback/REPORT_FORMAT.md) — current owning source or verification seam.
- [tools/test-skill-inspection.mjs](../../../tools/test-skill-inspection.mjs) — current owning source or verification seam.
- [tools/test-core-skill-installer.mjs](../../../tools/test-core-skill-installer.mjs) — current owning source or verification seam.

## History

- 2026-09-19: Created on owner direction as one article for this legacy Spec after reading its full record and checking named live sources. Evolved or superseded claims are identified explicitly. No Spec was moved, retired or discarded, and no retrospective Human QA is asserted.
