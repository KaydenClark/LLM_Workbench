---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
source_paths:
  - workbench/specs/S-040-skill-gate-route-selection/SPEC.md
  - tools/skill-presence.mjs
  - tools/core-skill-installer.mjs
  - tools/workbench-adoption.mjs
  - tools/workbench-upgrade.mjs
  - skills/update-harness/SKILL.md
  - tools/test-core-skill-installer.mjs
  - workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# Skill Presence And Repair Routes (S-040)

A refusal should name the supported way forward. S-040 made presence-only installation recognize a linked destination whose resolved directory already contains the skill, and made shared-skill refusal messages point to the layout-only route where applicable. A directory already present is skipped; this does not grant permission to overwrite unmanaged user content.

The original repair exposed a second defect: installer and Adoption/upgrade presence checks judged links differently. Its host description also placed a symlink at the wrong level and named a refusal unreachable for the measured layout. Those are preserved as historical corrections rather than repeated as current host facts.

S-045 subsequently centralized presence judgment in skill-presence.mjs and supported symlinked or Git-owned discovery roots for missing-skill installation, without touching the user's Git index or history. Distinguish that root-resolution route from a linked existing skill destination. A dangling link, file target or missing required skill file does not establish a valid installed skill.

The durable lesson is to resolve the relevant path, report what was actually accepted, and share that interpretation across consumers. Existing rooms are not retried merely because the source is repaired. Fixture coverage and an old measured workstation prove their stated cases, not every host or arbitrary filesystem link arrangement.

## Evidence and Sources

Historical source: `git show b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb:workbench/specs/S-040-skill-gate-route-selection/SPEC.md`.
Its original decisions, corrections, acceptance and evidence retain their own
scope. Current source inspection for this article used that same commit; the
links below provide the route for renewed verification. Historical runtime or
host limits are identified as such rather than promoted to fresh measurements.

- [tools/skill-presence.mjs](../../../tools/skill-presence.mjs)
- [tools/core-skill-installer.mjs](../../../tools/core-skill-installer.mjs)
- [tools/workbench-adoption.mjs](../../../tools/workbench-adoption.mjs)
- [tools/workbench-upgrade.mjs](../../../tools/workbench-upgrade.mjs)
- [skills/update-harness/SKILL.md](../../../skills/update-harness/SKILL.md)
- [tools/test-core-skill-installer.mjs](../../../tools/test-core-skill-installer.mjs)
- Historical record: `git show b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb:workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md`.

## History

- 2026-09-19: Created on explicit owner direction for one Wiki article per legacy Spec. Preserved useful knowledge, correction lineage and proof limitations; no source record retired or discarded.
