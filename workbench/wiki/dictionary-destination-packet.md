---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Destination Packet
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its second Wiki lexicon batch Task (TK-009I), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md
  - workbench/docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md
last_verified: 2026-10-07
---

# Destination Packet: everything an agent needs to find and reach its destination

A Destination Packet is everything an agent needs to determine the destination and direction for its current objective, execute in that direction and verify it reached the destination: links on the DQC or TASK, typically reaching the Blueprint, the landmark, the Spec acceptance lines it satisfies, the Task, a handoff and perhaps a notepad, the Contract and the cited source and tests. The canonical definition is the [glossary entry](../../GLOSSARY.md#specs-and-tasks).

**What it means here.** A term for what we give the agent, so we can tell whether it got the full packet; nothing is copied into it and no second record tells the agent the destination. Optional local untracked context neither authorizes work nor proves claims. The Wiki is evidence for a Spec's direction and plan, never the destination a packet carries ([ADR-000H](../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md), [ADR-000U](../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)). Avoid "landmark packet"; bare "Packet" is the retired name.

**Neighbouring words.** It is carried by a [Task](dictionary-task.md) or a
[Destination Question Card](dictionary-destination-question-card.md), and
reaches the [Blueprint](dictionary-blueprint.md), the
[Landmark](dictionary-landmark.md) and the [Spec](dictionary-spec.md). The role
skill a [Role](dictionary-role.md) uses is one of its links.

**In use.** This Task's packet was the set of links it was handed: the S-004O `SPEC.md` and its Wiki shape decision, `tasks/TK-009I/TASK.md`, the Lexicon retirement decision, the Spec's census and landing inventory, `AGENTS.md`, and the batch-one articles and test to model on. Nothing from them was copied into a second brief, so a missing link is a gap in the packet, not something the Worker should guess.

## Sources

- [GLOSSARY.md, Specs and Tasks](../../GLOSSARY.md#specs-and-tasks): the canonical definition.
- [The Task decision (ADR-000H)](../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md): what a Task carries.
- [The landmarks decision (ADR-000U)](../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md): the Wiki is evidence, not the destination.
