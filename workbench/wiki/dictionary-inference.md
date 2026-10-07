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
  - AGENTS.md
last_verified: 2026-10-07
---

# Inference: what every request to a model costs

Inference is running a trained model to produce output, which happens on every request to a model provider. The parameters are only read, so nothing corrected today is learned for tomorrow. Inference is billed by the token and is the main cost of using a model, and every tool round trip in a session is another pass over the whole context. The owner adopted the term from the AI Coding Dictionary on 2026-10-03.

**What it means here.** Inference is not training. Nothing an agent does in a room trains anything; it only runs inference against a model someone else trained.

**Where the Workbench depends on it.** Two habits follow. Continuity is written down (notepads, handoffs, the Wiki, `AGENTS.md`), because inference keeps nothing. And the size of what an agent loads is a cost question as well as a quality one: each extra page is paid for again on every tool round trip, which is part of why the smart zone decision keeps sessions lean.

## Sources

- This page is the term's Workbench home: a general AI coding concept stays Wiki-only and needs no [GLOSSARY.md](../../GLOSSARY.md) entry ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/inference): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [Every session works inside its smart zone and spends its tokens efficiently (the smart zone decision)](../docs/ddr/000E-every-session-works-inside-its-smart-zone-and-spends-its-tokens-efficiently.md).
- [AGENTS.md](../../AGENTS.md): the always-loaded brief and map.
