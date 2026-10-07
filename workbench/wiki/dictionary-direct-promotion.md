---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Direct promotion
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/skills/promote/SKILL.md
  - workbench/tools/sessions.mjs
  - tools/test-direct-promotion.mjs
last_verified: 2026-10-07
---

# Direct promotion: moving selected claims into their durable owner

Direct promotion is the deliberate reconciliation of selected claims into a named durable owner, with privacy and validity checks and verified recovery of the destination before the source is cleaned up within scope. The canonical definition is the [glossary entry](../../GLOSSARY.md#continuity-and-evidence-boundaries).

**What it means here.** It is not merely a copy or commit. Promote ends a grilling, and a locked and confirmed answer needs no further ceremony to be promoted ([ADR-000Y](../docs/adr/000Y-a-locked-and-confirmed-answer-is-promoted-without-further-ceremony.md)).

**Neighbouring words.** It moves claims out of a [Notepad](dictionary-notepad.md) or a [Grilling](dictionary-grilling.md) into owners such as a [Decision Record](dictionary-decision-record.md), a Spec or `GLOSSARY.md`. It replaced new [Checkpoint](dictionary-checkpoint.md) copies. The [Reconciler](dictionary-reconciler.md) stance uses it; the skill reference page is [Promote](skill-promote.md).

**In use.** `tools/test-direct-promotion.mjs` keeps a scenario from this Spec: `sessions.mjs promote` writes a confirmed decision for a term into `GLOSSARY.md` while a term whose meaning is still pending stays in the notepad byte for byte, and the command refuses a pending source, a mixed selection or a placeholder destination.

## Sources

- [GLOSSARY.md, Continuity and evidence boundaries](../../GLOSSARY.md#continuity-and-evidence-boundaries): the canonical definition.
- [The promotion decision (ADR-000Y)](../docs/adr/000Y-a-locked-and-confirmed-answer-is-promoted-without-further-ceremony.md): a locked and confirmed answer is promoted without further ceremony.
- [The promote skill](../skills/promote/SKILL.md) and [RUNBOOK.md, Direct Owner Promotion](../../RUNBOOK.md#direct-owner-promotion): the procedure.
- [Checkpoint Retirement And Direct Promotion](features/checkpoint-retirement-and-direct-promotion.md): the feature article.
