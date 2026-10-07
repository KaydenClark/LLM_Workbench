---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Align
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its first Wiki lexicon batch Task (TK-009D), 2026-10-07: the retiring Lexicon row's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/skills/grilling/SKILL.md
  - workbench/docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md
  - workbench/docs/ddr/000C-confirming-a-concept-authorizes-the-agents-to-carry-it-to-its-endpoint.md
last_verified: 2026-10-07
---

# Align: turning an idea into a shared design concept

Align is the workflow verb for the inquiry, usually a grilling, in which the
owner's idea becomes a design concept that the owner and the agents share. The
canonical definition is the
[glossary entry](../../GLOSSARY.md#destination-and-direction).

**What it means here.** Grilling supports that inquiry; Confirm is the owner's agreement to the readback that closes it, and what that agreement authorizes is in the Confirm entry. Align writes Intent: what the owner
wants, as the questions draw it out. Nothing it produces is durable until it is
confirmed.

**Neighbouring words.** It starts from an [Idea](dictionary-idea.md), passes
through [Fog](dictionary-fog.md) as the questions become phraseable, and ends
at [Confirm](dictionary-confirm.md). Its result is a
[Design concept](dictionary-design-concept.md). The method is the
[grilling skill](skill-grilling.md). A send-back at
[Approve](dictionary-approve.md) returns the work to Align at the scope the
failure implicates.

**In use.** "Let's align on the glossary first" means: grill the owner one
question at a time, read each answer back, and stop when the readback names the
concept, its direction, cost, reason and what will be created, so the owner can
confirm it.

## Sources

- [GLOSSARY.md, Destination and direction](../../GLOSSARY.md#destination-and-direction): the canonical definition.
- [The grilling skill](../skills/grilling/SKILL.md): the usual method.
- [The workflow verbs decision (ADR-000X)](../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md): Align writes Intent.
- [The confirmation decision (DDR-000C)](../docs/ddr/000C-confirming-a-concept-authorizes-the-agents-to-carry-it-to-its-endpoint.md): what confirmation authorizes.
