---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-confirmed grilling of 2026-10-02 on the workflow verbs and which verb writes each artifact
source_paths:
  - LEXICON.md
  - BLUEPRINT.md
  - workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md
  - workbench/docs/adr/000Y-a-locked-and-confirmed-answer-is-promoted-without-further-ceremony.md
parent: none
authorized_by: the owner's promotion of the 2026-10-02 grilling
last_verified: 2026-10-02
---

# The Workflow Verbs

The Workbench workflow has eight verbs: Idea, Align, Confirm, Map, Plan,
Implement, Review and Verify. They are the official workflow verbs everywhere.
The owner had been calling this the workflow while it kept being called the
ladder or the steps. This page explains them and how they decide
where a claim is written. It authorizes nothing; the [Lexicon](../../../LEXICON.md)
holds the definitions.

## The loop

Map, Plan, Implement, Review and Verify together are a **Journey**. Journey is
itself a workflow verb because the workflow loops after a journey: Align,
Confirm, Journey, then Align, Confirm, Journey again. It is only the loop-level
name, so a Destination Question Card cannot sit at Journey as a stage.

A verb can be passed through. When there is nothing to map, the workflow moves
from Confirm to Plan. Review and Verify are not as clean a cut as the other
verbs, because when everything is good to go there is nothing to write beyond
saying so.

## Which verb writes what

The [Governance Planes](../../../LEXICON.md) are the lens. Applied claim by
claim as work moves through the workflow, most of the time:

| Verbs | Plane | What they write |
|---|---|---|
| Idea, Align | Intent | the request: what the owner wants |
| Confirm | Enduring Context | Destination Question Cards and Wiki pages: it declares something should be durable without making it a source of truth |
| Map, Plan | Grounding | landmarks, Specs and decision records at Map, Tasks at Plan: claims about Canon and Actuality and what they should look like |
| Implement | Canon or Actuality | the source of truth, such as the Blueprint, or what the project is working on |
| Review, Verify | Grounding | evidence about whether the work is right; nothing is written when it passes |

It is not black and white and varies a lot, so the table says what is true most
of the time, not what is always true.

For example, the Blueprint is mostly Canon, so it is written at Implement. It
needs the verbs before it: confirm what is wanted, map out the change, make the
plan, then implement. It goes through those verbs and not through a Spec and
Tasks, because the workflow is not ceremony; it is process, a means to an end.
A landmark, a Spec or a Task is different. They are architecture artifacts and
transient scaffolding, so they need only confirmed enduring context behind them
and not the whole process.

## What is not delivered yet

The Landmark Tracker still prints the earlier step names and its Specs and tests
use them, and the [landmark tracker page](landmark-tracker.md) describes the
tool as it is. The Blueprint's Desired Lifecycle map is kept as the owner
confirmed it on 2026-09-24. The template copy of the Lexicon waits for the
Tracker work. Which skill owns which verb, and where separate-context review,
owner Human QA and promotion to main sit among Review and Verify, are not yet
decided.

## Evidence and Sources

- [ADR-000X, The workflow is eight verbs and each verb writes the plane its claims live on](../../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md):
  the decision this page explains.
- [ADR-000Y, A locked and confirmed answer is promoted without further ceremony](../../docs/adr/000Y-a-locked-and-confirmed-answer-is-promoted-without-further-ceremony.md):
  what ends a grilling and what an answer needs before promotion.
- [Lexicon](../../../LEXICON.md): the Workflow, Writer verb and Governance Plane definitions.
- [Blueprint](../../../BLUEPRINT.md): the workflow sentence and the Desired Lifecycle map.
- [Decision Records and the Concept Map](decision-records-and-the-concept-map.md):
  the artifacts the verbs write.

## History

- 2026-10-02: created in the promotion of the owner's 2026-10-02 grilling on the
  workflow verbs.
