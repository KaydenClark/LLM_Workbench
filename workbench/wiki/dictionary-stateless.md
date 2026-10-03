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
last_verified: 2026-10-03
---

# Stateless: nothing carries over unless it is written

Stateless means carrying nothing forward. The owner adopted the term from the AI Coding Dictionary on 2026-10-03 with its counterpart, Stateful. A model is stateless across requests and never learns from a session. Across sessions an agent forgets as well, unless something is written down. The feeling of continuity inside a session is the harness sending the whole transcript again with every request.

**What it means here.** To make a correction stick, write it where every later session will read it. That is why the Workbench has a written-down layer at all: `AGENTS.md` for rules every session needs, notepads and handoffs for one objective's working context, and the Wiki for durable understanding. A correction told to an agent in conversation and never recorded is gone with its session.

**Where the Workbench depends on it.** Each of those layers is a place a later session re-reads, which is what the Stateful entry describes from the other side. *Inference:* the cost of the model being stateless is why the Workbench saves important context promptly as work proceeds instead of at closeout, as `AGENTS.md` asks.

## Sources

- [Lexicon](../../LEXICON.md), the row for this term in the AI Coding Terms section: the Workbench meaning.
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/stateless): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [AGENTS.md](../../AGENTS.md): Session Records And Checkpoints.
- [Stateful](dictionary-stateful.md): the counterpart.
- [Notepad](skill-notepad.md): the skill that keeps working context.
