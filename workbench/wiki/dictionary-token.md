---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - The AI Coding Dictionary Terms Spec (S-004E) adopted the term from the AI Coding Dictionary, 2026-10-03; the Lexicon Retirement Spec (S-004O), its Wiki-only reference pages Task (TK-009K), moved the Lexicon row here, 2026-10-07
source_paths:
  - workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md
  - workbench/docs/ddr/001C-agents-md-is-the-map-and-the-only-contract-file.md
  - AGENTS.md
last_verified: 2026-10-07
---

# Token: the unit context, cost and speed are counted in

A token is what a model reads in and writes out, cut from text by a fixed tokenizer vocabulary. An ordinary English word averages a little under one token, while hashes, generated identifiers and encoded data break into many. Context size, cost and speed are all measured in tokens. The owner adopted the term from the AI Coding Dictionary on 2026-10-03.

**What it means here.** Workbench prose says "tokens", not "words", for any of those measures. The input and output tokens pages split the count by direction, and the cache tokens page covers the discounted share.

**Where the Workbench depends on it.** Long identifiers, commit hashes and pasted logs in always-loaded files cost more than their length on screen suggests. That is one reason the Contract file stays short and points to detail, and why a record names an artifact by title with its identifier rather than by a string of identifiers alone.

## Sources

- This page is the term's Workbench home: a general AI coding concept stays Wiki-only and needs no [GLOSSARY.md](../../GLOSSARY.md) entry ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/token): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [AGENTS.md is the map and the only Contract file (the one Contract file decision)](../docs/ddr/001C-agents-md-is-the-map-and-the-only-contract-file.md).
- [AGENTS.md](../../AGENTS.md): the always-loaded brief and map.
