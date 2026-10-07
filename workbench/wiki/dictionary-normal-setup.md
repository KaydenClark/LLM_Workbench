---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Normal setup
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/manifest.json
  - tools/workbench-skills.mjs
last_verified: 2026-10-07
---

# Normal setup: laying the skills lane down at Genesis or Adoption

Normal setup is how a room first gets its skills: during Genesis or Adoption the skills lane and its two discovery adapters are laid down from the release. It installs; it never updates. The canonical definition is the [glossary entry](../../GLOSSARY.md#support-root-and-skills-lane).

**What it means here.** It never reads the provider home and never touches a skill the room added under another name.

**Neighbouring words.** It lays down the [Skills lane](dictionary-skills-lane.md) and the [Core skill bundle](dictionary-core-skill-bundle.md); replacing a core skill later is an [Explicit skill update](dictionary-explicit-skill-update.md), which normal setup never implies. The [genesis](skill-genesis.md) and [adoption](skill-adoption.md) skills are the two operations that run it.

**In use.** This room's manifest records the policy as `skillPolicy.normalSetup: lane-install`, with `.agents/skills` and `.claude/skills` as its discovery adapters. When Genesis creates a room, `tools/workbench-skills.mjs` installs the lane from the release checkout and refuses to install over a lane that already carries a receipt, naming `verify` or `update --explicit-update` instead.

## Sources

- [GLOSSARY.md, Support root and skills lane](../../GLOSSARY.md#support-root-and-skills-lane): the canonical definition.
- [The skills lane decision (ADR-000M)](../docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md): setup lays the lane down from the release.
- [tools/workbench-skills.mjs](../../tools/workbench-skills.mjs): the install and its refusal over an installed lane.
- [The genesis skill](../skills/genesis/SKILL.md) and [the adoption skill](../skills/adoption/SKILL.md): the two entry routes.
