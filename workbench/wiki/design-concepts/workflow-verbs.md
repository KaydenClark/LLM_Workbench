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
last_verified: 2026-10-03
---

# The Workflow Verbs

A workflow verb is a defined action or process that workflows are built from
and that people use in ordinary language. The set is open: the owner defines
verbs one at a time, each in its own row of the [Lexicon](../../../LEXICON.md),
and workflows are composed from them. Idea, Align, Confirm, Map, Plan,
Implement, Review and Verify were the first standardization, accepted on
2026-10-02; Prototype, Check, Approve, Delivered and Clean Up and the Journey
verb have been defined since. The owner had been calling the delivery sequence
the workflow while it kept being called the ladder or the steps. This page
explains the verbs and how they decide where a claim is written. It authorizes
nothing; the Lexicon holds the definitions.

## The delivery workflow

The delivery workflow reads Idea, Align, Confirm, Map, Plan, Journey, Approve,
Delivered, Clean Up. Delivered replaced Complete as the verb for approved work
that is on main. A send-back at Approve returns to Align at the scope the
failure implicates.

## The loop

Journey is the build loop: Implement, Check, Review and Verify, repeated until
the confirmed concept is built. Map and Plan come before it and are not part of
it. An earlier version of this page, and of the workflow verbs decision, put Map
and Plan inside the Journey; the owner corrected that on 2026-10-03. Journey is
itself a workflow verb, but only the loop-level name, so a Destination Question
Card cannot sit at Journey as a stage.

A verb can be passed through. When there is nothing to map, the workflow moves
from Confirm to Plan. Review and Verify are not as clean a cut as the other
verbs, because when everything is good to go there is nothing to write beyond
saying so.

## Which verb writes what

The [Governance Planes](../../../LEXICON.md) are the lens. The owner assigned
planes to the first eight verbs only; Prototype, Check, Journey, Approve,
Delivered and Clean Up have none assigned. Applied claim by claim as work moves
through the workflow, most of the time:

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

The owner's workflow map of 2026-09-24 no longer sits on the Blueprint: it
moved to [the workflow page](idea-to-delivery-workflow.md), written in the
verbs. The Landmark Tracker still prints the earlier step names and its Specs and tests
use them, and the [landmark tracker page](landmark-tracker.md) describes the
tool as it is. Which skill owns which verb, and where separate-context review
(the Lexicon's Automated review), owner Human QA and promotion to main sit among
Review, Verify and Approve, are not yet decided beyond what the Lexicon rows say.
The Lexicon rows changed no command, status, folder or gate: the `complete`
command and status and the `S-###:delivered` blocker qualifier keep their names,
and renaming them is the owner's call.

## Evidence and Sources

- [ADR-000X, The workflow is eight verbs and each verb writes the plane its claims live on](../../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md):
  the decision this page explains, amended on 2026-10-03 for the open verb set and the Journey correction.
- [Workbench Terms And Workflow Verb Rows](../../specs/S-004G-workbench-terms-and-workflow-verbs/SPEC.md): the Spec that put the verb rows in the Lexicon.
- [ADR-000Y, A locked and confirmed answer is promoted without further ceremony](../../docs/adr/000Y-a-locked-and-confirmed-answer-is-promoted-without-further-ceremony.md):
  what ends a grilling and what an answer needs before promotion.
- [Lexicon](../../../LEXICON.md): the Workflow verb, Workflow, one row per verb, Writer verb and Governance Plane definitions.
- [Blueprint](../../../BLUEPRINT.md): the short page; its sentence on carrying a concept through the Journey.
- [The Workflow From Idea To Delivery](idea-to-delivery-workflow.md): the owner's workflow map, rewritten in the verbs.
- [Decision Records and the Concept Map](decision-records-and-the-concept-map.md):
  the artifacts the verbs write.

## History

- 2026-10-02: created in the promotion of the owner's 2026-10-02 grilling on the
  workflow verbs.
- 2026-10-03: the Blueprint became the four-part short page and the owner's
  workflow map moved to the workflow page, from the Blueprint Short Page work.
- 2026-10-03: rewritten for the open verb set, the added verbs, the delivery
  workflow and the Journey correction (the Workbench Terms And Workflow Verb
  Rows Spec).
