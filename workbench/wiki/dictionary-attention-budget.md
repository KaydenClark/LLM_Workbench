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
  - workbench/docs/ddr/001C-agents-md-is-the-map-and-the-only-contract-file.md
last_verified: 2026-10-07
---

# Attention budget: why every loaded token costs the others

The attention budget is the fixed amount of influence each token spreads over everything else in the context, so every token added dilutes the others. The owner adopted the term from the AI Coding Dictionary on 2026-10-03.

**What it means here.** It is not used as a term elsewhere in the Workbench. It names the reason behind a rule the Workbench does use: every loaded token costs attention as well as input.

**Where the Workbench depends on it.** Progressive disclosure keeps always-loaded files small for this reason, and the smart zone decision keeps sessions short of the point where the budget is spread too thin. An irrelevant page loaded "just in case" is not free even when the window has room.

## Sources

- This page is the term's Workbench home: a general AI coding concept stays Wiki-only and needs no [GLOSSARY.md](../../GLOSSARY.md) entry ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/attention-budget): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [Every session works inside its smart zone and spends its tokens efficiently (the smart zone decision)](../docs/ddr/000E-every-session-works-inside-its-smart-zone-and-spends-its-tokens-efficiently.md).
- [AGENTS.md is the map and the only Contract file (the one Contract file decision)](../docs/ddr/001C-agents-md-is-the-map-and-the-only-contract-file.md).
