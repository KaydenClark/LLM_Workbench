---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Altitude passages of the Blueprint, moved here by the owner's Blueprint teardown disposition of 2026-10-03; the altitudes decision of 2026-09-12 as reconciled on 2026-09-24
source_paths:
  - workbench/docs/adr/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md
  - workbench/docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md
  - workbench/docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md
  - workbench/docs/ddr/000O-the-blueprint-is-a-high-level-summary-of-the-direction-and-makes-us-ask-questions.md
  - GLOSSARY.md
parent: none
authorized_by: the owner's Blueprint teardown disposition, 2026-10-03
last_verified: 2026-10-03
---

# The Three Altitudes Of Delivery

Delivery works at three altitudes, and the Blueprint, a Spec and a Task are the
three of them. The accepted decision is
[Blueprint, Spec and Task are three altitudes of one delivery chain](../../docs/adr/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md);
this page is the readable explanation the Blueprint used to carry as a
paragraph. It authorizes nothing, and the [glossary](../../../GLOSSARY.md) holds
the definitions.

## Counting to 100

The owner's picture is counting to 100. The Blueprint is the product-level
destination and the journey that reaches it: the whole of counting to 100. A
Spec is one scoped objective with its own destination, PRD-shaped: the next
number to reach, such as 1 through 5 of the hundred. A Task does the counting:
it is the bounded executable work that advances a destination, one step of
about 0.1. Stacked Specs realize the Blueprint's journey.

Scope and destination decide where work belongs; they never say how much work it
turns out to be. A Task is a thin vertical slice through every layer it touches,
sized for one useful context, and a different destination needs a new Spec.

## What the Blueprint is for

The Blueprint is a high-level summary of the direction and the choices that got
us this far, and it makes us ask questions rather than give definite answers
([the Blueprint decision](../../docs/ddr/000O-the-blueprint-is-a-high-level-summary-of-the-direction-and-makes-us-ask-questions.md)).
Each sentence can serve as a map toward an implementation plan, sometimes
through maps at several scales. A sentence big enough to need its own map
becomes a landmark, and the landmark sits one size above Specs
([the landmark decision](../../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)).
A decision is placed by asking whether it maps to a destination at the
Blueprint's scale or to a more bounded one, which is also how an agent decides
whether work needs a new Spec, a Task or a decision record.

## Where each altitude lives

The Blueprint owns the destination. A Spec owns its local destination and what
completion means for it, and is derived from the Blueprint, the active decision
records, verified evidence and the live state of the project. Tasks advance the
Spec one brick at a time. The Taskboard is a generated board of progress and
coordination; the Specs and Tasks hold the substantive state and evidence.

A Spec and its Tasks are working artifacts, not durable owners. Once a Spec is
delivered and its knowledge is captured in the Wiki and in decision records, the
scaffolding is cleared away, so a later reader depends on the durable owners
rather than on them. How that happens is on
[the workflow page](idea-to-delivery-workflow.md).

## What is not settled here

Where a later gap against delivered work belongs, and how corrective work is
shaped, is being reworked in the Corrective Work Rules Spec; the controls own
the rule until that lands. The landmark records are being regrouped to the
confirmed landmark set by the landmark migration Spec.

## Evidence and Sources

- [Blueprint, Spec and Task are three altitudes of one delivery chain](../../docs/adr/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md):
  the decision, with the SCR-reconciled scale of a Spec as 1 through 5 and a
  Task as about 0.1 of the Blueprint's 100.
- [Work passes two QA gates](../../docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md):
  the gates at the Spec and integration boundaries.
- [Landmarks are LANDMARK.md artifacts one size above Specs](../../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md).
- [The Blueprint is a high-level summary of the direction](../../docs/ddr/000O-the-blueprint-is-a-high-level-summary-of-the-direction-and-makes-us-ask-questions.md).
- [Glossary](../../../GLOSSARY.md#specs-and-tasks): the Blueprint, Spec and Task entries.

## History

- 2026-10-03: created in the Blueprint short-page work (the Blueprint Short Page
  Spec) from the altitude passages the owner's teardown disposition moved off the
  Blueprint.
- 2026-10-07: Re-pointed the retiring Lexicon's links and live routes to `GLOSSARY.md`, `ARCHITECTURE.md` and the Wiki lexicon articles (the Lexicon Retirement Spec (S-004O), its consumer re-pointing Task (TK-009F)); no claim changed.
