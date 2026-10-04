---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-directed one-article-per-Spec migration, 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task Move And Retype The Remaining Per-Spec Articles (TK-002) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-040-skill-gate-route-selection/SPEC.md
  - tools/skill-presence.mjs
  - tools/core-skill-installer.mjs
  - tools/workbench-adoption.mjs
  - tools/workbench-upgrade.mjs
  - workbench/skills/update-harness/SKILL.md
  - tools/test-core-skill-installer.mjs
  - workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md
last_verified: 2026-10-04
---

# Skill Presence And Repair Routes

A refusal should name the supported way forward. The Skill Gate Route Selection
And Link Resolution Spec (S-040) made presence-only installation recognize a
linked destination whose resolved directory already contains the skill, and made
shared-skill refusal messages point to the layout-only route where applicable.

## What It Does

- **Linked destinations.** Presence-only installation recognizes a linked
  destination whose resolved directory already contains the skill. A directory
  already present is skipped.
- **Named route in refusals.** Shared-skill refusal messages point to the
  layout-only route where applicable.
- **One presence judgment.** The original repair exposed a second defect:
  installer and Adoption/upgrade presence checks judged links differently. The
  v3.1.2 Follow-Ups Left Without An Owner Spec (S-045) subsequently centralized
  presence judgment in skill-presence.mjs and supported symlinked or Git-owned
  discovery roots for missing-skill installation, without touching the user's
  Git index or history.

## Why It Matters

The durable lesson is to resolve the relevant path, report what was actually
accepted, and share that interpretation across consumers.

## Limits

- Skipping a directory that is already present does not grant permission to
  overwrite unmanaged user content.
- Root resolution (symlinked or Git-owned discovery roots) is a different route
  from a linked existing skill destination; distinguish them. A dangling link, a
  file target or a missing required skill file does not establish a valid
  installed skill.
- The original repair's host description placed a symlink at the wrong level and
  named a refusal unreachable for the measured layout. Those are preserved as
  historical corrections rather than repeated as current host facts.
- Existing rooms are not retried merely because the source is repaired.
- Fixture coverage and an old measured workstation prove their stated cases, not
  every host or arbitrary filesystem link arrangement.

## Evidence and Sources

- [Historical Skill Gate Route Selection And Link Resolution Spec (S-040)](../../specs/S-040-skill-gate-route-selection/SPEC.md). Original decisions, corrections, acceptance and evidence retain their own scope; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `b38509d`](https://github.com/KaydenClark/LLM_Workbench/blob/b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb/workbench/specs/S-040-skill-gate-route-selection/SPEC.md). Recover the original with `git show b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb:workbench/specs/S-040-skill-gate-route-selection/SPEC.md`. The 2026-09-19 article's inspection of source used that same commit; the links below provide the route for renewed verification, and historical runtime or host limits are identified as such rather than promoted to fresh measurements.
- [Historical v3.1.2 Follow-Ups Left Without An Owner Spec (S-045)](../../specs/S-045-v3-1-2-follow-ups/SPEC.md). Its record at the same commit is the [immutable source at `b38509d`](https://github.com/KaydenClark/LLM_Workbench/blob/b38509df08e6e1f87f7b4cb6c8bea6f4789f92cb/workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md).
- [tools/skill-presence.mjs](../../../tools/skill-presence.mjs) - the shared presence judgment.
- [tools/core-skill-installer.mjs](../../../tools/core-skill-installer.mjs) - the core skill installer.
- [tools/workbench-adoption.mjs](../../../tools/workbench-adoption.mjs) and [tools/workbench-upgrade.mjs](../../../tools/workbench-upgrade.mjs) - the Adoption and upgrade consumers of that judgment.
- [workbench/skills/update-harness/SKILL.md](../../skills/update-harness/SKILL.md) - the update skill that names the layout-only route.
- [tools/test-core-skill-installer.mjs](../../../tools/test-core-skill-installer.mjs) - the verification seam.

## History

- 2026-09-19: Created on explicit owner direction for one Wiki article per legacy Spec. Preserved useful knowledge, correction lineage and proof limitations; no source record retired or discarded.
- 2026-09-30: Repaired live skill links and source_paths after relocation to workbench/skills; verified destinations only, without revalidating historical capability claims.
- 2026-10-04: Moved from `design-concepts/spec-S-040-skill-gate-route-selection.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task Move And Retype The Remaining Per-Spec Articles (TK-002). The title lost its Spec identifier suffix; the identifier now sits beside the Spec's name in the introduction. Every live link to it was rewritten by the move; no claim was changed. Checked the Spec names, that every listed current source path exists (the first entry names the Spec's eventual retired route, which does not exist yet), and that the presence source exports a shared link-resolution helper; the other claims were not re-verified.
