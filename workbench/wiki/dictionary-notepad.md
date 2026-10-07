---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
glossary_term: Notepad
provenance:
  - The Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), its third Wiki lexicon batch Task (TK-009J), 2026-10-07: the retiring Lexicon entry's fuller text restated with its owning decisions
source_paths:
  - GLOSSARY.md
  - workbench/docs/adr/000L-a-notepad-belongs-to-its-objective-and-every-chat-working-that-objective-writes-to-it.md
  - workbench/skills/notepad/SKILL.md
  - workbench/tools/notepads.mjs
last_verified: 2026-10-07
---

# Notepad: an objective's local working record

A notepad is a local JSON working record scoped to one objective: a compact current view that is edited in place, plus an append-oriented work record. Grilling records are notepads, so they are JSON too. The canonical definition is the [glossary entry](../../GLOSSARY.md#continuity-terms).

The fuller definition: where available DQC and landmark operations maintain current concept understanding, grilling notepads become more historical and handoff-like, retaining useful origins, corrections and continuation context. Otherwise the existing notepad runtime preserves working understanding; creating a card never licenses discarding needed notes.

**What it means here.** It is not Canon or permanent history; preserve important material until reconciled. A note belongs to its objective, not to the Chat, model or host that created it, and every context that can reach it resumes it, one writer at a time ([ADR-000L](../docs/adr/000L-a-notepad-belongs-to-its-objective-and-every-chat-working-that-objective-writes-to-it.md)). One objective may use several linked notes for distinct purposes.

**Neighbouring words.** A [Scoped handoff](dictionary-scoped-handoff.md) is the readable Markdown map to a notepad's high-fidelity context. [Direct promotion](dictionary-direct-promotion.md) moves selected confirmed claims out of it into durable owners. [Grilling](dictionary-grilling.md) records are notepads. The retired [Checkpoint](dictionary-checkpoint.md) copy is not a notepad, and [Operational recovery](dictionary-operational-recovery.md) is excluded from notepad discovery. A notepad is how an agent becomes [stateful](dictionary-stateful.md) across sessions.

**In use.** The [`notepad` skill](../skills/notepad/SKILL.md) creates or resumes the objective's note under the ignored `workbench/sessions/notepads/` collection through `workbench/tools/notepads.mjs`, saves consequential context as it appears rather than at closeout, and trims only what has already been reconciled into a durable owner. A Chat that picks the objective up later, on any host, resumes the same note.

## Sources

- [GLOSSARY.md, Continuity terms](../../GLOSSARY.md#continuity-terms): the canonical definition.
- [The notepad ownership decision (ADR-000L)](../docs/adr/000L-a-notepad-belongs-to-its-objective-and-every-chat-working-that-objective-writes-to-it.md): a notepad belongs to its objective.
- [JSON Notepad Foundation](features/json-notepad-foundation.md): the feature article.
- [RUNBOOK.md, JSON Notepads](../../RUNBOOK.md#json-notepads): the commands.
- [Landmark: Notepads](design-concepts/landmark-notepads.md): what working notes preserve.
