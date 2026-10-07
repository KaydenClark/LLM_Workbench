---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Grilling
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/skills/grilling/SKILL.md
  - workbench/docs/adr/000Y-a-locked-and-confirmed-answer-is-promoted-without-further-ceremony.md
last_verified: 2026-10-07
---

# Grilling: building a design concept one decision at a time

Grilling is an interview that builds a design concept by settling one decision at a time, each question coming with a recommended answer. The owner adopted the term from the AI Coding Dictionary on 2026-10-03, and it carries a distinct Workbench meaning, so its canonical definition is the [glossary entry](../../GLOSSARY.md#workbench-meanings-of-ai-coding-terms).

**What it means here.** The Workbench differs from the dictionary here: a handoff can be written in the middle of a grilling session so that another agent can dig into one question while the grilling agent's context is preserved (the owner: "a handoff can be written in the middle of a grilling session to deep dive the question further. helping preserve the context of the grilling agent."). Align is usually done by grilling; the `grilling` skill owns the method.

**How it runs here.** The [`grilling` skill](../skills/grilling/SKILL.md) asks one question at a time and reads each answer back for the owner's confirmation before moving on, until the concept is confirmed and shared. Its working record is a [Notepad](dictionary-notepad.md), so it is JSON. A grilling ends at one of its exits: preserve the notes, promote confirmed answers, write a Spec, hand off or carry out the work. A confirmed answer reaches its durable owner through [Direct promotion](dictionary-direct-promotion.md), which needs no further ceremony once the answer is locked and confirmed ([ADR-000Y](../docs/adr/000Y-a-locked-and-confirmed-answer-is-promoted-without-further-ceremony.md)).

**Neighbouring words.** Grilling is usually how [Align](dictionary-align.md) is done, and the owner's [Confirm](dictionary-confirm.md) is its gate. A mid-grilling [Scoped handoff](dictionary-scoped-handoff.md) lets another agent dig into one question. The understanding it builds may be gathered into a [Destination Question Card](dictionary-destination-question-card.md). The skill reference page is [Grilling](skill-grilling.md); the [grill-me](skill-grill-me.md) skill is the entry point that composes it with a saved notepad.

**In use.** The owner's answers of 2026-10-05 on review timing and provider spend came from a grilling whose notepad is `review-timing-and-codex-spend-2026-10-05`: questions such as whether a single Task is reviewed and which provider reviews were settled one at a time, and the confirmed answers now stand in the [Automated review](dictionary-automated-review.md) entry and the amended workflow verbs decision ([ADR-000X](../docs/adr/000X-the-workflow-is-eight-verbs-and-each-verb-writes-the-plane-its-claims-live-on.md)).

## Sources

- [GLOSSARY.md, Workbench meanings of AI coding terms](../../GLOSSARY.md#workbench-meanings-of-ai-coding-terms): the canonical definition.
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/grilling): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [The grilling skill](../skills/grilling/SKILL.md): the method.
- [Landmark: Grilling and Shared Understanding](design-concepts/landmark-grilling-and-shared-understanding.md): how an idea becomes a confirmed shared concept.
- [The promotion decision (ADR-000Y)](../docs/adr/000Y-a-locked-and-confirmed-answer-is-promoted-without-further-ceremony.md): a locked and confirmed answer is promoted without further ceremony.
