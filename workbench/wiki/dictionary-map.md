---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Map
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its first Wiki lexicon batch Task (TK-009D), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md
  - workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md
last_verified: 2026-10-07
---

# Map: the direction to a destination, and the verb that writes it

A map is the direction to a destination. It exists at two scales: a landmark
is a map, and so is a Spec, and the Tasks under either are the steps taken on
it. Around its destination it gives a low-resolution view: the decisions made
so far, the Fog still ahead and the work ruled out of scope. As a workflow
verb, Map is "Writing the direction to a destination: landmarks, Specs and
decision records." The canonical definition is the
[glossary entry](../../GLOSSARY.md#destination-and-direction).

**What it means here.** It links to the artifacts that own the detail rather than creating a second file or truth store; it is distinct from the project-wide Context Map. The landmark, Spec and Task folder path carries every parent ([ADR-000U](../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)). One entry serves the noun and the verb because the verb is writing the noun.

**Neighbouring words.** The two scales are the [Landmark](dictionary-landmark.md)
and the Spec. A map's parts are [Decisions so far](dictionary-decisions-so-far.md),
[Fog](dictionary-fog.md) and the [Frontier](dictionary-frontier.md) of open
Tasks. As a verb, Map follows [Confirm](dictionary-confirm.md) and comes before
[Plan](dictionary-plan.md); when there is nothing to map, Confirm goes straight
to Plan. Map writes Grounding ([Writer verb](dictionary-writer-verb.md)). A
failed [Review](dictionary-review.md) sends the work back to Map.

**In use.** The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O) is a map:
its Decisions And Contracts section links the retirement decision rather than
restating it, and its Tasks are the steps. Its folder path,
`workbench/specs/S-004O-lexicon-retirement-and-architecture-md/tasks/TK-009D/`,
carries every parent of the first Wiki lexicon batch Task. "Map it" means write that Spec, or the
landmark or decision record above it, before any Task is cut.

## Sources

- [GLOSSARY.md, Destination and direction](../../GLOSSARY.md#destination-and-direction): the canonical definition.
- [The landmarks decision (ADR-000U)](../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md): landmarks and Specs as the map at two scales, and the folder path.
- [The workflow verbs decision (ADR-000X)](../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md): Map as a verb and what it writes.
- [The Workflow Verbs](design-concepts/workflow-verbs.md): the verbs and the loop.
- [Wayfinder Skill Alignment (S-002W)](../specs/S-002W-wayfinder-skill-alignment/SPEC.md): the map shape the wayfinder skill uses.
