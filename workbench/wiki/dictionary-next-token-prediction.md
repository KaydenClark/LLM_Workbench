---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - The AI Coding Dictionary Terms Spec (S-004E) adopted the term from the AI Coding Dictionary, 2026-10-03; the Lexicon Retirement Spec (S-004O), its Wiki-only reference pages Task (TK-009K), moved the Lexicon row here, 2026-10-07
source_paths:
  - workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md
  - workbench/docs/adr/0044-evidence-for-claims-of-improved-agent-outcomes.md
  - AGENTS.md
last_verified: 2026-10-07
---

# Next-token prediction: the one thing a model does

Next-token prediction is the model's one operation: from the context so far it samples a single next token, appends it and goes again, so every output, a tool call included, is assembled a token at a time. The model chooses what is likely given its context, not what is true. The owner adopted the term from the AI Coding Dictionary on 2026-10-03.

**What it means here.** A tool call is not a separate faculty: it is text the model writes and the harness parses and runs. A confident wrong answer and a correct one come from the same operation.

**Where the Workbench depends on it.** It is the root of hallucination and of run-to-run variation (see the non-determinism page). The Workbench answers both the same way: claims are checked against their owning source, behavior against tests, and an outcome claim against repeated trials, never against the agent's own account.

## Sources

- This page is the term's Workbench home: a general AI coding concept stays Wiki-only and needs no [GLOSSARY.md](../../GLOSSARY.md) entry ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/next-token-prediction): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [Evidence for claims of improved agent outcomes (the outcome evidence decision)](../docs/adr/0044-evidence-for-claims-of-improved-agent-outcomes.md).
- [AGENTS.md](../../AGENTS.md): the always-loaded brief and map.
