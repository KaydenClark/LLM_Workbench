---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - The AI Coding Dictionary Terms Spec (S-004E) adopted the term from the AI Coding Dictionary, 2026-10-03; the Lexicon Retirement Spec (S-004O), its Wiki-only reference pages Task (TK-009K), moved the Lexicon row here, 2026-10-07
source_paths:
  - workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md
  - GLOSSARY.md
  - AGENTS.md
last_verified: 2026-10-07
---

# Human review: a person reading the change itself

A human review is a person reading the actual change, not the agent's account of it. The owner adopted the term from the AI Coding Dictionary on 2026-10-03.

**What it means here.** Human QA is the owner-led evaluation of delivered work at times the owner chooses. A human review is defined by what is read, the change itself, not by who evaluates or when. One does not stand in for the other, and neither is an automated review by another agent.

**Where the Workbench depends on it.** An agent's report summarizes what it believes it did; a human review checks that against the diff. The Workbench keeps the two apart in its records: a hand-back carries evidence and merge answers, and only the owner's own reading or Human QA judgment counts as a person's verdict.

## Sources

- This page is the term's Workbench home: a general AI coding concept stays Wiki-only and needs no [GLOSSARY.md](../../GLOSSARY.md) entry ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/human-review): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [GLOSSARY.md](../../GLOSSARY.md): the canonical project vocabulary the neighbouring Workbench words on this page are defined in.
- [AGENTS.md](../../AGENTS.md): the always-loaded brief and map.
