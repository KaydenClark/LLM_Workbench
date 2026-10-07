---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Skill
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md
  - workbench/skills/README.md
last_verified: 2026-10-07
---

# Skill: a capability read when the task matches it

A Skill is a teachable capability bundled as a unit: a folder with a `SKILL.md`
(name, description and instructions) and optional scripts and reference
material, loaded in full only when a task matches its description. The canonical
definition is the [glossary
entry](../../GLOSSARY.md#workbench-room-and-artifacts).

**What it means here.** The unit of progressive disclosure: only its name and description sit in context until needed, unlike AGENTS, which loads every session. A skill is read, not called; a tool is called. It is not a new truth store; a pointed lane skill binds for its operation ([ADR-000W](../docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md)). Avoid "tool" for a skill.

**Neighbouring words.** A [Flow](dictionary-flow.md) composes skills and a
[Router](dictionary-router.md) recommends one. A [Context
pointer](dictionary-context-pointer.md) from the [Contract
artifact](dictionary-contract-artifact.md) is what makes a lane skill bind for
its operation. A [Control](dictionary-control.md) is called; a skill is read.
The core skill bundle, the skills lane and the stances are glossary entries of
their own.

**In use.** The [`implement` skill](../skills/implement/SKILL.md) is a folder in
this room's skills lane with its `SKILL.md`; only its name and description are
in context until a Worker selects and claims a Task, and `AGENTS.md` points to
it for that work, which is what makes it bind there.

## Sources

- [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts): the canonical definition.
- [The pointer authority decision (ADR-000W)](../docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md): a pointed lane skill binds for its operation.
- [The core skills decision (ADR-000M)](../docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md): core skills ship in the skills lane.
- [The skill composition decision (ADR-0045)](../docs/adr/0045-skill-composition-within-inherited-scope.md): skills compose within inherited scope.
- [The skills README](../skills/README.md): the bundle in this room.
