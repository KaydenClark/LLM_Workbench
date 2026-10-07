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
  - GLOSSARY.md
last_verified: 2026-10-07
---

# Automated check: a verification with no judgement in it

An automated check is a deterministic pass-or-fail verification, such as a test, a type check, a lint or a build, which an agent can correct its own work against. The owner adopted the term from the AI Coding Dictionary on 2026-10-03.

**What it means here.** `doctor`, the test suites and every registered diagnostic are automated checks. One involves no judgement, which separates it from an automated review, where another agent forms a judgement and can miss what a check would not. The owner's Check workflow verb is the building agent running automated checks on its own Task before handing it back.

**Where the Workbench depends on it.** Red-green proof, the full verification suite and the landing checks that guard a migration are all automated checks, and a non-deterministic agent is held to them because they give the same answer every run.

## Sources

- This page is the term's Workbench home: a general AI coding concept stays Wiki-only and needs no [GLOSSARY.md](../../GLOSSARY.md) entry ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/automated-check): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [AGENTS.md](../../AGENTS.md): the always-loaded brief and map.
- [GLOSSARY.md](../../GLOSSARY.md): the canonical project vocabulary the neighbouring Workbench words on this page are defined in.
