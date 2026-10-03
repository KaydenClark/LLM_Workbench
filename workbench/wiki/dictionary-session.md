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
  - workbench/docs/ddr/000E-every-session-works-inside-its-smart-zone-and-spends-its-tokens-efficiently.md
  - workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md
last_verified: 2026-10-03
---

# Session: one run of the context window

A session is one bounded run of working with an agent. It starts empty, builds up the messages, tool outputs and files opened along the way, and ends when it is cleared, closed or summarized into a new one. It is the thing that fills the context window, and its history is the agent's working memory, which is lost when it ends. Only files survive. This is a term the owner adopted from the AI Coding Dictionary on 2026-10-03.

**What it means here.** A Chat is the owner-visible working context in a host; a session is one run of the context window inside it. *Inference:* a Chat normally holds one session and may hold more when the harness summarizes or clears within it, while a Task still maps to one Chat. The Lexicon labels that bridge the same way, because it joins two agreed definitions and is not a separate owner answer.

**Where the Workbench depends on it.** Because a session ends with its memory, the Workbench writes continuity into files: notepads for unfinished reasoning, handoffs for another agent or a later session, and the Wiki and `AGENTS.md` for what every future session must know. `AGENTS.md` uses the word in its Session Records And Checkpoints and Long Session Control sections, and the `sessions` support lane holds records that outlive any one session. Keeping to one task a session keeps what is loaded on topic, which is the practical reason a Task is sized for one Chat.

## Sources

- [Lexicon](../../LEXICON.md), the row for this term in the AI Coding Terms section: the Workbench meaning.
- [AI Coding Dictionary entry](https://www.aihero.dev/ai-coding-dictionary/session): attribution only. The Workbench restates the meaning in its own words and does not import later upstream edits until the owner adopts them.
- [AGENTS.md](../../AGENTS.md): Session Records And Checkpoints, Long Session Control.
- [Every session works inside its smart zone and spends its tokens efficiently (the smart zone decision)](../docs/ddr/000E-every-session-works-inside-its-smart-zone-and-spends-its-tokens-efficiently.md).
- [A Task is a standalone artifact (the Task decision)](../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md): one Task for one useful context and one Chat.
