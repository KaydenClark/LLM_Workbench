---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - The AI Coding Dictionary Terms Spec (S-004E), its Task that writes the dictionary Wiki entries (TK-006B), written from the owner's adopted AI Coding Dictionary term, 2026-10-03
source_paths:
  - LEXICON.md
  - AGENTS.md
  - workbench/docs/ddr/000F-a-fresh-session-loads-only-the-context-its-work-needs.md
last_verified: 2026-10-03
---

# Context: what the agent has in front of it now

Context is the information relevant to the task that the agent has right now. The owner adopted the term from the AI Coding Dictionary on 2026-10-03 as a measure of quality, not of quantity: most failures trace to a needed fact that was never loaded, or one that was loaded and buried.

**What it means here.** It is not the context window (the actual run of tokens the model sees) and not the session (the running history). The Lexicon also has three terms that share the word and mean something else: the Context Map (the navigable relationships among Workbench concepts), Enduring Context (a Governance Plane, durable reference an operation consults) and Working context (the unfinished reasoning a notepad preserves for one objective).

**Where the Workbench depends on it.** Progressive disclosure and context pointers exist so the right fact is loaded when the task needs it and is not buried among the rest; the fresh session decision says a fresh session loads only what its work needs. When an agent's output is wrong, ask first what it was given before blaming the model.

## Sources

- [Lexicon](../../LEXICON.md), the row for this term in the AI Coding Terms section: the Workbench meaning.
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/context): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [A fresh session loads only the context its work needs (the fresh session decision)](../docs/ddr/000F-a-fresh-session-loads-only-the-context-its-work-needs.md).
- [AGENTS.md](../../AGENTS.md): Traverse, Don't Search.
