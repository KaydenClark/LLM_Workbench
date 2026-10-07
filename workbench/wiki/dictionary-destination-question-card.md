---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Destination Question Card (DQC)
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its first Wiki lexicon batch Task (TK-009D), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/landmark-tracker/README.md
  - workbench/docs/adr/000N-landmark-tracker-connects-evolving-understanding-to-durable-knowledge.md
last_verified: 2026-10-07
---

# Destination Question Card (DQC): one concept's evolving synthesis

A Destination Question Card gathers the grilling questions that belong to one
concept into a single structured record, and keeps it current as the
understanding changes: what is understood, what is still open, what changed
and why, the result the answer is expected to make durable, where each piece
came from, and assessments of how far alignment has got, each backed by
evidence. The canonical definition is the
[glossary entry](../../GLOSSARY.md#destination-and-direction).

**What it means here.** It may exist before a landmark, Spec, Task or known Wiki destination. It is not each individual interview prompt and does not grant authority. It is temporary concept scaffolding: removal requires verified reconciliation of useful understanding, corrections, rationale and lineage into durable owners, with unresolved obligations and live references preserved; a Verified label alone is insufficient.

**Neighbouring words.** A card can name an [Expected result](dictionary-expected-result.md);
a cluster of related cards is how a [Landmark](dictionary-landmark.md) forms;
the [Landmark Wiki page](dictionary-landmark-wiki-page.md) is the readable
account of what a landmark's cards add up to; and the
[Landmark Tracker](dictionary-landmark-tracker.md) is the generated view over
cards, landmarks and their evidence. A card is written at
[Confirm](dictionary-confirm.md), the verb that settles durable understanding
([Writer verb](dictionary-writer-verb.md)). An individual question asked in a
[grilling](skill-grilling.md) session is not a card; the card is the synthesis
the questions feed.

**In use.** The room's cards live as flat JSON records under
`workbench/landmark-tracker/destination-questions/`, from the first card
`DQC-000A` onward, and are written only through `landmark-tracker.mjs capture`
and its revise commands, never by hand. An agent captures a card as soon as a
meaningful concept exists, before any landmark, Spec or Wiki page has been
chosen for it, recording the source questions it came from and what is still
unknown.

## Sources

- [GLOSSARY.md, Destination and direction](../../GLOSSARY.md#destination-and-direction): the canonical definition.
- [The Landmark Tracker decision (ADR-000N)](../docs/adr/000N-landmark-tracker-connects-evolving-understanding-to-durable-knowledge.md): why cards and the Tracker exist beside the Taskboard.
- [Landmark Tracker procedure](../landmark-tracker/README.md): capture, revise, relate and assess.
- [Landmark Tracker Foundation (S-01T)](../specs/S-01T-landmark-tracker-foundation/SPEC.md): the Spec that delivered the records.
- [Landmark Tracker design concept](design-concepts/landmark-tracker.md): the four pieces and their jobs.
