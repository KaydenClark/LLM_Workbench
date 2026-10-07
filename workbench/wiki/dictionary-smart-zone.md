---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - The AI Coding Dictionary Terms Spec (S-004E) adopted the term from the AI Coding Dictionary, 2026-10-03; the Lexicon Retirement Spec (S-004O), its Wiki-only reference pages Task (TK-009K), moved the Lexicon row here, 2026-10-07
source_paths:
  - workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md
  - workbench/docs/ddr/000E-every-session-works-inside-its-smart-zone-and-spends-its-tokens-efficiently.md
  - workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md
last_verified: 2026-10-07
---

# Smart zone: the stretch of a session worth planning for

The smart zone is the early stretch of a session in which an agent does its best work, before quality slides as its context grows. Work is planned to fit inside it, not inside the context window's hard limit. The owner adopted the term from the AI Coding Dictionary on 2026-10-03.

**What it means here.** It is not the context window's capacity: a session can have plenty of room left and already be out of the zone. Attention degradation is the mechanism behind leaving it.

**Where the Workbench depends on it.** The smart zone decision makes it a rule that every session works inside its smart zone and spends its tokens efficiently, and the Task decision sets a Task's context ceiling where answer quality begins to degrade. Both rest on the same idea: size the work to the useful part of the window.

## Sources

- This page is the term's Workbench home: a general AI coding concept stays Wiki-only and needs no [GLOSSARY.md](../../GLOSSARY.md) entry ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/smart-zone): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [Every session works inside its smart zone and spends its tokens efficiently (the smart zone decision)](../docs/ddr/000E-every-session-works-inside-its-smart-zone-and-spends-its-tokens-efficiently.md).
- [A Task is a standalone artifact (the Task decision)](../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md).
