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

# Environment: the world outside the harness

The environment is the world an agent works in, outside its harness: what it sees through tool results and alters through tool calls. It is the layer that persists between sessions. The owner adopted the term from the AI Coding Dictionary on 2026-10-03.

**What it means here.** It is not the harness and not the session. The filesystem is its most common form. Room, Environment and Filesystem are sibling definitions: the owner's note on them sits with the glossary's Room entry.

**Where the Workbench depends on it.** Because only the environment outlives a session, the Workbench keeps everything an agent needs in it: a room is a Git repository that any agent can clone, work and push, and every continuity record is a file there.

## Sources

- This page is the term's Workbench home: a general AI coding concept stays Wiki-only and needs no [GLOSSARY.md](../../GLOSSARY.md) entry ([the Lexicon retirement decision (DDR-001E)](../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)).
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/environment): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [GLOSSARY.md](../../GLOSSARY.md): the canonical project vocabulary the neighbouring Workbench words on this page are defined in.
- [AGENTS.md](../../AGENTS.md): the always-loaded brief and map.
