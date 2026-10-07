---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Explicit skill update
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - tools/workbench-skills.mjs
  - tools/workbench-upgrade.mjs
  - tools/core-skill-installer.mjs
last_verified: 2026-10-07
---

# Explicit skill update: the only route that replaces a core skill

An explicit skill update is the Workbench update's step that replaces core skills in a room: `workbench-skills.mjs update --explicit-update` replaces only the core skills that changed, backs the previous directories up and records the rollback path in the receipt. The canonical definition is the [glossary entry](../../GLOSSARY.md#support-root-and-skills-lane).

**What it means here.** It is the only path that may replace a core skill in a room; routine setup and doctor cannot imply it. The one-time v2 route (`workbench-upgrade.mjs upgrade --explicit-update` or `--layout-only`) lays the lane down through Adoption instead. Publishing the core into a personal catalog (`core-skill-installer.mjs`) is a separate operation.

**Neighbouring words.** It replaces skills in the [Skills lane](dictionary-skills-lane.md) that [Normal setup](dictionary-normal-setup.md) laid down, and rewrites each changed skill's [Managed skill marker](dictionary-managed-skill-marker.md). [Control fidelity](dictionary-control-fidelity.md) is the matching report for the root files, which are reconciled by hand rather than replaced. The [update-harness skill](../skills/update-harness/SKILL.md) carries a room through the whole update.

**In use.** When a room takes a new Workbench release, the update runs `node tools/workbench-skills.mjs update --explicit-update` from the release checkout against the room. Each changed core skill is replaced, its previous directory is backed up under the user home, and the receipt records where the backup is, so `rollback` can restore it. A legacy room whose skills cannot be replaced yet takes the one-time layout-only route, `workbench-upgrade.mjs upgrade --layout-only`, instead.

## Sources

- [GLOSSARY.md, Support root and skills lane](../../GLOSSARY.md#support-root-and-skills-lane): the canonical definition.
- [tools/workbench-skills.mjs](../../tools/workbench-skills.mjs): the update, backup and rollback.
- [Upgrade Layout Without Replacing Skills](features/upgrade-layout-without-replacing-skills.md): the layout-only route.
- [The workbench-room-checks skill](../skills/workbench-room-checks/SKILL.md): the explicit upgrade and recovery check.
