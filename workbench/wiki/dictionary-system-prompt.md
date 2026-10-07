---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - The AI Coding Dictionary Terms Spec (S-004E) adopted the term from the AI Coding Dictionary, 2026-10-03; the Lexicon Retirement Spec (S-004O), its Wiki-only reference pages Task (TK-009K), moved the Lexicon row here, 2026-10-07
source_paths:
  - workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md
  - AGENTS.md
  - workbench/docs/ddr/001C-agents-md-is-the-map-and-the-only-contract-file.md
last_verified: 2026-10-07
---

# System prompt: the harness's standing instructions

The system prompt is the set of standing instructions a harness puts at the front of every request: identity, behavior, available tools and conventions. It is usually large and written by the harness vendor, and it stays fixed for a session, which is what lets the provider cache the start of each request. Models are trained to give it priority over user messages. The owner adopted the term from the AI Coding Dictionary on 2026-10-03.

**What it means here.** `AGENTS.md` and its host adapter `CLAUDE.md` load beside the system prompt; they do not replace it, and the room cannot edit it.

**Where the Workbench depends on it.** Because the system prompt is fixed and the room's own files ride after it, a stable `AGENTS.md` keeps the cached prefix long, and a change to the harness's system prompt can change an agent's behavior with no change in the room (see the harness page).

## Sources

- This page is the term's Workbench home: a general AI coding concept stays Wiki-only and needs no [GLOSSARY.md](../../GLOSSARY.md) entry ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/system-prompt): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [AGENTS.md](../../AGENTS.md): the always-loaded brief and map.
- [AGENTS.md is the map and the only Contract file (the one Contract file decision)](../docs/ddr/001C-agents-md-is-the-map-and-the-only-contract-file.md).
