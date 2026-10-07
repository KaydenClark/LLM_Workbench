---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Workflow
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its first Wiki lexicon batch Task (TK-009D), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md
  - workbench/wiki/design-concepts/workflow-verbs.md
last_verified: 2026-10-07
---

# Workflow: a sequence composed from workflow verbs

A workflow is a sequence of workflow verbs, and the set of verbs stays open:
the owner defines a verb when it is needed, each with its own entry. The
delivery workflow reads Idea, Align, Confirm, Map, Plan, Journey, Review,
Verify, Approve, Delivered, Clean Up. The canonical definition is the
[glossary entry](../../GLOSSARY.md#workflow-verbs).

**What it means here.** The owner: "We shouldnt need to Lock in a list. We lock in verbs. We use verbs to create workflows." The first eight verbs were the first standardization, and the owner has since added more: "why cant we add more workflow verbs? They are verbs." A verb can be passed through: when there is nothing to map, Confirm goes to Plan, and when everything is good, Review and Verify write nothing beyond saying so ([the workflow verbs decision](../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md)). A failed Review returns to Map, Plan and Journey before Verify; a send-back at Approve returns to Align.

**Neighbouring words.** Its parts are [workflow verbs](dictionary-workflow-verb.md):
[Idea](dictionary-idea.md), [Align](dictionary-align.md),
[Confirm](dictionary-confirm.md), [Map](dictionary-map.md),
[Plan](dictionary-plan.md), [Journey](dictionary-journey.md) (itself
[Implement](dictionary-implement.md), [Check](dictionary-check.md),
[QA](dictionary-qa.md) and [Submit](dictionary-submit.md)),
[Review](dictionary-review.md), [Verify](dictionary-verify.md),
[Approve](dictionary-approve.md), [Delivered](dictionary-delivered.md) and
[Clean Up](dictionary-clean-up.md), with [Prototype](dictionary-prototype.md)
as an optional step before or after Confirm. Which verb writes a claim is its
[Writer verb](dictionary-writer-verb.md). A workflow is process, a means to an
end, not ceremony.

**In use.** The Runbook's operations index lines each workflow verb up with the
scenarios it covers. When an agent says "we're at Plan", it means the concept
is confirmed and mapped and the Tasks are being cut; "pass through Map" means
there was nothing to map, so Confirm went straight to Plan.

## Sources

- [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs): the canonical definition.
- [The workflow verbs decision (ADR-000X)](../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md): the open verb set and pass-through.
- [The Workflow Verbs](design-concepts/workflow-verbs.md) and [The Workflow From Idea To Delivery](design-concepts/idea-to-delivery-workflow.md): the full account.
- [The Runbook lines the workflow verbs up next to their scenarios (DDR-001D)](../docs/ddr/001D-the-runbook-lines-the-workflow-verbs-up-next-to-their-scenarios-and-binds-nothing.md).
- [Workbench Terms And Workflow Verbs (S-004G)](../specs/S-004G-workbench-terms-and-workflow-verbs/SPEC.md): the Spec that defined each verb.
