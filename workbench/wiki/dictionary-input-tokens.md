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
  - workbench/docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md
  - AGENTS.md
last_verified: 2026-10-07
---

# Input tokens: what every request sends again

Input tokens are the tokens a harness sends with every request: the system prompt, the history and the tool results. Each is cheaper than an output token, yet input is usually most of the bill, because a stateless model is sent the whole session again on every turn. Caching, clearing and summarizing reduce it. The owner adopted the term from the AI Coding Dictionary on 2026-10-03.

**What it means here.** It is the counterpart of output tokens. Everything an agent has loaded, including files it read three turns ago, is input again on the next request until the session is cleared or summarized.

**Where the Workbench depends on it.** Always-loaded files such as `AGENTS.md` are input on every request of every session, which is why the one Contract file decision keeps it a short brief and map and moves procedures behind pointers.

## Sources

- This page is the term's Workbench home: a general AI coding concept stays Wiki-only and needs no [GLOSSARY.md](../../GLOSSARY.md) entry ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/input-tokens): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [AGENTS.md is the map and the only Contract file (the one Contract file decision)](../docs/ddr/001C-agents-md-is-the-map-and-the-only-contract-file.md).
- [Contract carriers are briefs that point to skills (the Contract carriers decision)](../docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md).
- [AGENTS.md](../../AGENTS.md): the always-loaded brief and map.
