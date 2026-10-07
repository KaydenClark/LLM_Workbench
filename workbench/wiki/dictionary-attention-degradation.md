---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - The AI Coding Dictionary Terms Spec (S-004E) adopted the term from the AI Coding Dictionary, 2026-10-03; the Lexicon Retirement Spec (S-004O), its Wiki-only reference pages Task (TK-009K), moved the Lexicon row here, 2026-10-07
source_paths:
  - workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md
  - workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md
  - workbench/docs/ddr/000E-every-session-works-inside-its-smart-zone-and-spends-its-tokens-efficiently.md
last_verified: 2026-10-07
---

# Attention degradation: how a session leaves its smart zone

Attention degradation is the gradual loss of instruction-following as a session grows: the mechanism behind leaving the smart zone. Removing context recovers it; adding more does not. The owner adopted the term from the AI Coding Dictionary on 2026-10-03.

**What it means here.** A long session that starts ignoring a rule it followed an hour earlier is usually degrading, not disobeying. Repeating the rule adds context; clearing, or handing the work to a fresh session through a handoff, removes it.

**Where the Workbench depends on it.** Progressive disclosure and a Task's context ceiling describe its effect without naming it: keep what is loaded small, and size a Task so it ends before degradation sets in.

## Sources

- This page is the term's Workbench home: a general AI coding concept stays Wiki-only and needs no [GLOSSARY.md](../../GLOSSARY.md) entry ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/attention-degradation): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [A Task is a standalone artifact (the Task decision)](../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md).
- [Every session works inside its smart zone and spends its tokens efficiently (the smart zone decision)](../docs/ddr/000E-every-session-works-inside-its-smart-zone-and-spends-its-tokens-efficiently.md).
