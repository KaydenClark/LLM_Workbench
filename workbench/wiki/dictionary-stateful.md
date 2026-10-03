---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - S-004E TK-006B, written from the owner's adopted AI Coding Dictionary term, 2026-10-03
source_paths:
  - LEXICON.md
  - AGENTS.md
  - workbench/wiki/skill-notepad.md
  - workbench/wiki/skill-handoff.md
last_verified: 2026-10-03
---

# Stateful: continuity is re-read from the layer below

Stateful means carrying information forward. The owner adopted the term from the AI Coding Dictionary on 2026-10-03 with its counterpart, Stateless. A session is stateful from one turn to the next. An agent becomes stateful across sessions only through a memory system that writes to the environment and loads it back; the model itself never is. Each layer re-reads its state from the layer beneath it, and what it carries includes early mistakes, which is why clearing a session discards them.

**What it means here.** The Workbench's cross-session state is the files it keeps: notepads, handoffs, the Wiki and `AGENTS.md`. The dictionary's "memory system" is not adopted as a Workbench term. A new session recovers state by reading those files, then the live source, and the Workbench treats what it reads as evidence to verify against live state rather than as authority.

**Where the Workbench depends on it.** Resuming after a summary or a long interruption means re-reading the assigned Spec and live state first (`AGENTS.md`, Long Session Control), not trusting remembered context. Carried mistakes are the reason a notepad records corrections beside the claims they correct.

## Sources

- [Lexicon](../../LEXICON.md), the row for this term in the AI Coding Terms section: the Workbench meaning.
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/stateful): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [AGENTS.md](../../AGENTS.md): Long Session Control.
- [Stateless](dictionary-stateless.md): the counterpart.
- [Handoff](skill-handoff.md): the skill that passes one objective on.
