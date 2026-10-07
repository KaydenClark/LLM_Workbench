---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - The AI Coding Dictionary Terms Spec (S-004E), its Task that writes the dictionary Wiki entries (TK-006B), written from the owner's adopted AI Coding Dictionary term, 2026-10-03
source_paths:
  - workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md
  - workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md
  - workbench/docs/ddr/000E-every-session-works-inside-its-smart-zone-and-spends-its-tokens-efficiently.md
last_verified: 2026-10-03
---

# Context window: the budget a session spends

The context window is everything the model sees on one request: a single finite, model-specific run of tokens made of the system prompt, the conversation and the tool results. It is the model's only way to perceive anything. The owner adopted the term from the AI Coding Dictionary on 2026-10-03; the dictionary says to avoid "memory" for it.

**What it means here.** It fills as a session runs, until the harness summarizes or clears it, and every token competes with every other for attention, so treat it as a budget. The Workbench's habit of keeping always-loaded files short and pointing to detail (progressive disclosure, context pointers) comes from that.

**Where the Workbench depends on it.** A Task is sized to stay below a context ceiling set where answer quality begins to degrade (the Task decision), and the smart zone decision plans a session to fit the early stretch in which the agent works best rather than the window's hard limit. Those two ideas describe one limit from two sides: the window's capacity is not the useful part of it.

## Sources

- This page is the term's Workbench home: a general AI coding concept stays Wiki-only and needs no [GLOSSARY.md](../../GLOSSARY.md) entry ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/context-window): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [A Task is a standalone artifact (the Task decision)](../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md): the Task's context ceiling.
- [Every session works inside its smart zone and spends its tokens efficiently (the smart zone decision)](../docs/ddr/000E-every-session-works-inside-its-smart-zone-and-spends-its-tokens-efficiently.md).
