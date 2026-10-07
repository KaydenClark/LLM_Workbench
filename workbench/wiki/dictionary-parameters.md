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
  - workbench/docs/ddr/000E-every-session-works-inside-its-smart-zone-and-spends-its-tokens-efficiently.md
last_verified: 2026-10-07
---

# Parameters: what a model knows without being told

Parameters are the numbers inside a model, also called its weights. Training sets them; inference only reads them, so nothing that happens during a session changes them. Everything a model knows without being told lives in them, and that knowledge stops at the model's training cutoff. The owner adopted the term from the AI Coding Dictionary on 2026-10-03.

**What it means here.** A correction given to an agent today is not learned by the model tomorrow. Changing the parameters means retraining, which in effect yields a different model, so no Workbench operation ever touches them.

**Where the Workbench depends on it.** Because the parameters hold nothing about this project, every project fact has to reach the agent as context: the Contract file, the Spec and Task, the Wiki pages it routes to. That is the reason the Workbench writes its knowledge down and routes it, instead of relying on what a model "should know".

## Sources

- This page is the term's Workbench home: a general AI coding concept stays Wiki-only and needs no [GLOSSARY.md](../../GLOSSARY.md) entry ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/parameters): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [AGENTS.md](../../AGENTS.md): the always-loaded brief and map.
- [Every session works inside its smart zone and spends its tokens efficiently (the smart zone decision)](../docs/ddr/000E-every-session-works-inside-its-smart-zone-and-spends-its-tokens-efficiently.md).
