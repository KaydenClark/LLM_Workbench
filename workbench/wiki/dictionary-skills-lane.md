---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Skills lane
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md
  - tools/workbench-skills.mjs
last_verified: 2026-10-07
---

# Skills lane: the room's own tracked copy of its skills

The skills lane is `workbench/skills`, the seventh support lane. It holds the core skills inside the room, tracked in Git, owned and versioned by LLM Workbench and marked by a receipt, so a fresh clone finds its skills without any personal catalog. The canonical definition is the [glossary entry](../../GLOSSARY.md#support-root-and-skills-lane).

**What it means here.** A room may add its own skills to the lane under other names; the personal catalog is a backup and publication target, never on a room's critical path.

**Neighbouring words.** It is one [Support lane](dictionary-support-lane.md) of the [Support root](dictionary-support-root.md) and holds the [Core skill bundle](dictionary-core-skill-bundle.md). [Normal setup](dictionary-normal-setup.md) lays it down and an [Explicit skill update](dictionary-explicit-skill-update.md) is the only route that replaces a core skill in it. `AGENTS.md` Instruction Authority says that a lane skill the Contract points to binds for that operation, and that the lane copy wins over a differing installed host copy ([Workbench Contract](dictionary-workbench-contract.md)).

**In use.** `tools/workbench-skills.mjs` installs, verifies, updates and rolls back the lane: an install copies each required core skill, writes a receipt naming the source repository, release and commit with a content hash per skill, and lays down the tracked `.agents/skills` and `.claude/skills` adapters as relative links into the lane, so Codex and Claude Code both discover the skills from a clone. A skill the room adds under its own name is never copied, hashed, replaced or removed.

## Sources

- [GLOSSARY.md, Support root and skills lane](../../GLOSSARY.md#support-root-and-skills-lane): the canonical definition.
- [The skills lane decision (ADR-000M)](../docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md): why core skills ship in the room.
- [tools/workbench-skills.mjs](../../tools/workbench-skills.mjs): install, verify, update and rollback.
- [RUNBOOK.md, Skills lane check](../../RUNBOOK.md#skills-lane-check): where the lane is checked.
