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
last_verified: 2026-10-07
---

# Output tokens: what the model writes, and what sets the pace

Output tokens are the tokens the model generates, tool calls and hidden reasoning included. Each costs more than an input token, commonly several times as much, and they are produced one at a time, so they set how long a turn takes. Emitting edits rather than rewriting whole files saves them. The owner adopted the term from the AI Coding Dictionary on 2026-10-03.

**What it means here.** It is the counterpart of input tokens. Higher effort produces more of them, because reasoning is output whether it is shown or not.

**Where the Workbench depends on it.** The smart zone decision's call to spend tokens efficiently applies to both directions; on the output side it favours targeted edits, concise reports and proof that points to a log rather than pasting it.

## Sources

- This page is the term's Workbench home: a general AI coding concept stays Wiki-only and needs no [GLOSSARY.md](../../GLOSSARY.md) entry ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/output-tokens): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [Every session works inside its smart zone and spends its tokens efficiently (the smart zone decision)](../docs/ddr/000E-every-session-works-inside-its-smart-zone-and-spends-its-tokens-efficiently.md).
