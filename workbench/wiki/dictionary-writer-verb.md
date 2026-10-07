---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Writer verb
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its first Wiki lexicon batch Task (TK-009D), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md
  - workbench/docs/adr/0001-planes-classify-operations-not-artifacts.md
last_verified: 2026-10-07
---

# Writer verb: the verb at which a claim is written

A claim's writer verb is the workflow verb at which it is written, found by
looking at the claim through its Governance Plane. The canonical definition is
the [glossary entry](../../GLOSSARY.md#workflow-verbs).

**The assignment.** Idea and Align are Intent, Confirm is Enduring Context,
Map and Plan are Grounding, Implement is Canon or Actuality, and Review and
Verify are Grounding. Destination Question Cards and Wiki pages are written at
Confirm; landmarks, Specs and decision records at Map; Tasks at Plan; the
Blueprint at Implement.

**What it means here.** The owner assigned planes to the first eight verbs only; Prototype, Check, Journey, Approve, Delivered and Clean Up have none assigned. Applied claim by claim, not black and white. Landmarks, Specs and Tasks are architecture artifacts and transient scaffolding, so they need only confirmed enduring context and not the whole process; the Blueprint is a durable routing artifact and goes through the verbs, not through a Spec and Tasks ([ADR-000X](../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md)).

**Neighbouring words.** It applies the Governance Planes to the
[workflow verbs](dictionary-workflow-verb.md): [Idea](dictionary-idea.md),
[Align](dictionary-align.md), [Confirm](dictionary-confirm.md),
[Map](dictionary-map.md), [Plan](dictionary-plan.md),
[Implement](dictionary-implement.md), [Review](dictionary-review.md) and
[Verify](dictionary-verify.md) have planes; the later verbs do not. A plane is
the role a claim plays in one operation, not a property of a file, which is why
the same artifact can hold claims written at different verbs.

**In use.** Asking "what is this claim's writer verb?" settles where a change
belongs: a new term's meaning is Enduring Context, so it waits for Confirm and
is promoted into the glossary; a Task is Grounding written at Plan, so it needs
only confirmed context behind it, not a grilling of its own.

## Sources

- [GLOSSARY.md, Workflow verbs](../../GLOSSARY.md#workflow-verbs): the canonical definition.
- [The workflow verbs decision (ADR-000X)](../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md): which verb writes which plane.
- [Planes classify operations, not artifacts (ADR-0001)](../docs/adr/0001-planes-classify-operations-not-artifacts.md).
- [The Workflow Verbs](design-concepts/workflow-verbs.md): the table of verbs, planes and artifacts.
