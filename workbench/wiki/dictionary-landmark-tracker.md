---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Landmark Tracker
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its first Wiki lexicon batch Task (TK-009D), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/landmark-tracker/README.md
  - workbench/docs/adr/000N-landmark-tracker-connects-evolving-understanding-to-durable-knowledge.md
  - workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md
last_verified: 2026-10-07
---

# Landmark Tracker: where documentation progress is seen

The Landmark Tracker is a generated view. It reads Destination Question Cards,
landmarks and the source evidence they cite, and shows how they relate and how
the documentation work is distributed across the workflow's steps. The
canonical definition is the
[glossary entry](../../GLOSSARY.md#destination-and-direction).

**What it means here.** Tracker monitors documenting; Taskboard monitors implementation. It replaces neither source records nor existing artifacts, and is not a manually assigned card stage or a source of authority. The installed view still prints Idea, Aligning, Confirmed, Mapped, Planned, Journey, Review and Verified; these evidence-assessed distributions describe documentation progress, not effort, Task state or runtime availability. The delivery workflow reads Idea, Align, Confirm, Map, Plan, Journey, Review, Verify, Approve, Delivered, Clean Up, and Journey is Implement, Check, QA and Submit; the installed labels await migration.

**Neighbouring words.** It views [Destination Question Cards](dictionary-destination-question-card.md)
and [landmarks](dictionary-landmark.md); the
[Landmark Wiki page](dictionary-landmark-wiki-page.md) is the prose a reader
reaches for instead. Its counterpart for implementation is the Taskboard, which
shows the [Frontier](dictionary-frontier.md) of Tasks. The step names it prints
are the older form of the [Workflow](dictionary-workflow.md); the
[Journey](dictionary-journey.md) entry gives the current build loop.

**In use.** `workbench/landmark-tracker/TRACKER.json` is the projection, written
only by `landmark-tracker.mjs rebuild`. An assessment is recorded with a
fraction per step and a reason, for example `--assess Journey=0.6,Review=0.4`
on a card, and the Tracker displays those distributions. When an agent says "the
Tracker shows this landmark mostly at Review", it is reporting documentation
progress, not that any Task is being reviewed.

## Sources

- [GLOSSARY.md, Destination and direction](../../GLOSSARY.md#destination-and-direction): the canonical definition.
- [The Landmark Tracker decision (ADR-000N)](../docs/adr/000N-landmark-tracker-connects-evolving-understanding-to-durable-knowledge.md): why the Tracker exists beside the Taskboard.
- [Landmark Tracker procedure](../landmark-tracker/README.md): rebuild and assess.
- [The workflow verbs decision (ADR-000X)](../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md): the delivery workflow the installed labels await migration to.
- [Landmark Tracker design concept](design-concepts/landmark-tracker.md): reading documentation progress.
