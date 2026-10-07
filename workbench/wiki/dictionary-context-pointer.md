---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Context pointer
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - AGENTS.md
  - workbench/docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md
  - workbench/docs/ddr/001C-agents-md-is-the-map-and-the-only-contract-file.md
last_verified: 2026-10-07
---

# Context pointer: a line that says where to look and when

A Context pointer is a line in one document pointing to another, so the agent
pulls it in only when the task calls for it: a stable path plus enough
description to know when following it is worth it. The canonical definition is
the [glossary entry](../../GLOSSARY.md#workbench-room-and-artifacts).

**What it means here.** Write it to match how tasks present, such as "closing a Task: load the Task close skill". A pointer from the Contract to a lane skill is what gives that skill authority for its operation ([ADR-000W](../docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md)); the owner decided that pointer runs from `AGENTS.md` straight to the skill ([one Contract file](../docs/ddr/001C-agents-md-is-the-map-and-the-only-contract-file.md)). Avoid "reference" and "portal".

**Neighbouring words.** It is how a [Routing
artifact](dictionary-routing-artifact.md) is reached from the [Contract
artifact](dictionary-contract-artifact.md), and how a
[Skill](dictionary-skill.md) gains authority for its operation. It is the
mechanism of [Progressive disclosure](dictionary-progressive-disclosure.md), and
following pointers is what [Traverse, don't
search](dictionary-traverse-don-t-search.md) asks for.

**In use.** `AGENTS.md` says that work selection, claims, receipts, close and
blockers follow the [`implement`
skill](../skills/implement/SKILL.md#work-selection-and-lifecycle): a stable path
to the skill section, and the situation in which following it pays. The skill's
text is loaded only when a session reaches that work.

## Sources

- [GLOSSARY.md, Workbench, room and artifacts](../../GLOSSARY.md#workbench-room-and-artifacts): the canonical definition.
- [The pointer authority decision (ADR-000W)](../docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md): authority flows through the pointer.
- [One Contract file (DDR-001C)](../docs/ddr/001C-agents-md-is-the-map-and-the-only-contract-file.md): the pointer runs from `AGENTS.md` to the skill.
- [The fresh session decision (DDR-000F)](../docs/ddr/000F-a-fresh-session-loads-only-the-context-its-work-needs.md): a fresh session loads only what its work needs.
