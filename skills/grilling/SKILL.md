---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea, one question at a time, keeping a running notepad of every decision. A reusable primitive; end with /make-it-so to promote. Use when the user wants to stress-test thinking or uses any 'grill' trigger phrase.
---

This is the core interview primitive. It runs the questioning and keeps a running
notepad (see `/notepad`) of the result. It never writes canonical files itself —
the `/make-it-so` skill promotes the notepad, so `grilling` can also run on its own.

Grill the user relentlessly about every aspect of this until we reach a shared
understanding. Walk down each branch of the decision tree, resolving dependencies
between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time, waiting for feedback on each question before
continuing. Asking multiple questions at once is bewildering.

If a fact can be found by exploring the environment (filesystem, tools, etc.),
look it up rather than asking me. The decisions, though, are mine — put each one
to me and wait for my answer.

## The notepad (start here, before asking anything)

Keep a running notepad of the whole session so nothing is lost to a context
compaction or a hand-off to another assistant. Its format, storage, and lifecycle
are owned by the `/notepad` primitive — **run a notepad; do not reinvent the record
here.** The notepad is the working record; it is not canonical until `/make-it-so`
promotes it.

1. Explore enough to build the real decision tree.
2. Start a notepad (see `/notepad`) and write the FULL planned question list up
   front, so I see the terrain before answering. It is a best-effort map; it will flex.
3. Use the notepad's stable IDs and one status tag per line — `[open]`,
   `[tentative]`, `[locked]` — exactly as `/notepad` specifies. Sub-questions nest
   as `2A`, `2B`; a newly opened line appends at the bottom and never renumbers.

## During the interview

- Ask the next `[open]` question with your recommendation.
- After I confirm an answer, immediately flip that line to `[locked]` (or
  `[tentative]`) and append the one-line result in the notepad, before asking the
  next question. This tiny per-answer write is the entire cost.
- Do not act on it until I confirm we have reached a shared understanding, and do
  not touch canonical files during the interview.

## Resuming after a compaction or model switch

The notepad is the durable record, not the chat. If the conversation is
compressed, truncated, or handed to another assistant, re-read the notepad and
continue at the first `[open]` line. Never re-ask a `[locked]` question.

## Exits

Keep grilling until I explicitly run `/make-it-so` — do not stop on a lookalike
phrase said in passing:

- `/make-it-so` — I am done; confirm the approvals, promote the notepad's locked
  decisions to canon, save the plan, and start implementation with every result
  pushed to the remote.

You do not need a separate save-exit: the notepad persists on its own (see
`/notepad`), so we can stop at any point and resume later straight from it.
Continue only within the standing project authority and safety boundaries.
