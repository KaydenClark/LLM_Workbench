---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Core skill bundle
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/manifest.json
  - workbench/skills/README.md
  - tools/test-skill-catalog.mjs
last_verified: 2026-10-07
---

# Core skill bundle: the closed set of skills every room carries

The core skill bundle is the fixed set of skills LLM Workbench ships into every room's `workbench/skills` lane: twenty workflow skills, four coordination skills and four stance skills. The number is counted from the manifest, never written down by hand. The canonical definition is the [glossary entry](../../GLOSSARY.md#support-root-and-skills-lane).

**What it means here.** It is not Kayden's private catalog or a generalized marketplace; the lane is the room's own discovery source, reached through the tracked `.agents/skills` and `.claude/skills` adapters.

**Neighbouring words.** The bundle lives in the [Skills lane](dictionary-skills-lane.md), is laid down by [Normal setup](dictionary-normal-setup.md) and replaced only by an [Explicit skill update](dictionary-explicit-skill-update.md). Each installed copy carries a [Managed skill marker](dictionary-managed-skill-marker.md), and [Core compatibility](dictionary-core-compatibility.md) says which room versions a core release supports. The four stance skills are the [Builder](dictionary-builder.md), [Auditor](dictionary-auditor.md), [Reviewer](dictionary-reviewer.md) and [Reconciler](dictionary-reconciler.md) stances.

**In use.** This room's manifest lists the bundle in `skillPolicy.required`: twenty-eight names, from `adoption` and `grilling` to `director`, `dispatcher`, `spec-planner` and `spec-manager` and the four stances. `tools/test-skill-catalog.mjs` derives the count from that list and fails if `GLOSSARY.md` or the skills README states a different one. This repository's lane also holds its [maintainer skills](maintainer-skills.md), such as `workbench-release`, which are not in the bundle and never ship to a room.

## Sources

- [GLOSSARY.md, Support root and skills lane](../../GLOSSARY.md#support-root-and-skills-lane): the canonical definition.
- [The skills lane decision (ADR-000M)](../docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md): core skills ship in the room's own lane.
- [The skills lane README](../skills/README.md): the bundle as the lane describes it.
- [Landmark: Skills](design-concepts/landmark-skills.md): the tracked lane, release-owned versions and explicit-update-only replacement.
