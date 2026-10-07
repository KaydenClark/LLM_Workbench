---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Instruction authority
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - AGENTS.md
  - workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md
last_verified: 2026-10-07
---

# Instruction authority: what an agent may do, and in what order

Instruction authority answers what an agent may do. It comes from four sources in order: the current owner request, then `AGENTS.md` with platform safety, then the explicitly assigned Spec as a bounded capability delegate, then the other Contract carriers. The canonical definition is the [glossary entry](../../GLOSSARY.md#governance-core).

**What it means here.** An assigned spec cannot enlarge the request, platform safety, or `AGENTS.md` scope; an unassigned spec is evidence ([ADR-0027](../docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md)).

**Neighbouring words.** It is kept separate from [State resolution](dictionary-state-resolution.md), which decides what is true rather than what is permitted. Its sources together are the [Workbench Contract](dictionary-workbench-contract.md). A [Stance](dictionary-stance.md) or a [Scoped handoff](dictionary-scoped-handoff.md) adds none.

**In use.** `AGENTS.md` asks for the owner before `LICENSE` changes, so a Task whose Spec seemed to call for a licence edit would still stop and ask: the Spec cannot enlarge `AGENTS.md` scope. A Worker that reads a sibling Task's Spec treats it as evidence about that work, not as an instruction to itself.

## Sources

- [GLOSSARY.md, Governance core](../../GLOSSARY.md#governance-core): the canonical definition.
- [The instruction authority decision (ADR-0027)](../docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md): authority is separate from state resolution.
- [AGENTS.md, Instruction Authority](../../AGENTS.md#instruction-authority): the operative order.
