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

# Filesystem: where a project and its workbench live

The filesystem is the most common environment: the files and directories an agent reads and writes, where a project and its workbench live. The owner adopted the term from the AI Coding Dictionary on 2026-10-03.

**What it means here.** Host portability treats filesystems as a machine concern (case sensitivity, paths, symlinks); this page is about what the agent works in, not how a machine stores it.

**Where the Workbench depends on it.** A room keeps its truth in tracked files so that a fresh agent on another machine finds the same answers; local, ignored state holds only what must not travel. Repository-relative paths in Wiki frontmatter and records follow from the same rule.

## Sources

- This page is the term's Workbench home: a general AI coding concept stays Wiki-only and needs no [GLOSSARY.md](../../GLOSSARY.md) entry ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/filesystem): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [GLOSSARY.md](../../GLOSSARY.md): the canonical project vocabulary the neighbouring Workbench words on this page are defined in.
- [AGENTS.md](../../AGENTS.md): the always-loaded brief and map.
