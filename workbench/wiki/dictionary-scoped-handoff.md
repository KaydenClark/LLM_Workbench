---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Scoped handoff
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/ddr/000K-a-handoff-is-the-readable-map-to-the-high-fidelity-context.md
  - workbench/skills/handoff/SKILL.md
last_verified: 2026-10-07
---

# Scoped handoff: the readable map to the high-fidelity context

A scoped handoff is a separate local Markdown brief written for a named recipient: its purpose, job and endpoint, the compressed context, and how to reach the objective's notepad and sources, so the recipient does not redo the work. The canonical definition is the [glossary entry](../../GLOSSARY.md#continuity-terms).

**What it means here.** The owner or an agent working within its role may initiate the transfer. It is Markdown because agents pick it up, read and edit it; JSON is for state and tooling ([DDR-000K](../docs/ddr/000K-a-handoff-is-the-readable-map-to-the-high-fidelity-context.md)). A recipient may read the file or receive its content in a new chat; a pointer requires accessible, retained data. [RUNBOOK](../../RUNBOOK.md#handoff-transfer) owns preparation and transfer.

**Neighbouring words.** It is the map; the [Notepad](dictionary-notepad.md) is the high-fidelity context it points to. A [Grilling](dictionary-grilling.md) can write one mid-session to send one question elsewhere. Writing one transfers context, not authority: `AGENTS.md` and the request still decide what the recipient may do ([Instruction authority](dictionary-instruction-authority.md)). The skill reference page is [Handoff](skill-handoff.md).

**In use.** A Dispatcher sending a Worker to one Task writes a scoped handoff: the Task and its endpoint, the worktree and branch, the rules the Worker must keep and where the Spec, census and sibling Tasks are. The Worker reads the brief, then the records it names, and starts from that map instead of re-deriving the Spec's history. A handoff file kept in the room goes in the ignored `workbench/sessions/handoffs/` collection.

## Sources

- [GLOSSARY.md, Continuity terms](../../GLOSSARY.md#continuity-terms): the canonical definition.
- [The handoff decision (DDR-000K)](../docs/ddr/000K-a-handoff-is-the-readable-map-to-the-high-fidelity-context.md): a handoff is the readable map to the high-fidelity context.
- [The handoff skill](../skills/handoff/SKILL.md) and [RUNBOOK.md, Handoff Transfer](../../RUNBOOK.md#handoff-transfer): preparation and transfer.
- [Landmark: Handoffs](design-concepts/landmark-handoffs.md): handoffs as readable Markdown that preserve the named scope.
