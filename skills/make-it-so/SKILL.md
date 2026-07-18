---
name: make-it-so
description: Finish a grilling session by promoting its notepad into canonical docs and specs. Invoke it explicitly; it never fires from someone saying the phrase in passing. Runs to-docs, then to-spec, to-tickets, schedule, and stop.
---

The finish exit for a grilling session, and the counterpart to `/checkpoint`.
Invoke it explicitly — it must never trigger just because someone said "make it
so" in conversation.

Read the session notepad in `.agents/grilling diary/` (the newest `PROVISIONAL`
one for this topic). The notepad is the source of truth, not the chat: if a
compacted conversation and the notepad disagree, the notepad wins. Then, in
order:

1. Summarize and lock the agreed scope from the notepad.
2. `to-docs` — route every `[locked]` decision that belongs in existing control
   files to its owner.
3. `to-spec` — create or update the stable `SPEC.md` for a new or changed
   capability (skip when the outcome is documentation only).
4. `to-tickets` — add dependency-aware slices to that spec. `make it so`
   authorizes the decomposition, so do not pause for redundant approval.
5. Carry every `[tentative]` and `[open]` item forward as an explicit blocker;
   never silently promote or drop one.
6. Render and verify the generated `TASKBOARD.md` when specs or tickets changed.
7. Use the available scheduler, following the project `RUNBOOK.md`, to begin
   eligible tickets one at a time; if scheduling is unavailable, report the
   blocker visibly and do not fall back to implementing here.
8. Mark the notepad `STATUS: PROMOTED — <date>`, report the durable doc/spec/
   ticket paths, and stop the current chat.

`make it so` authorizes durable planning and scheduling from the notepad. It does
not authorize implementation in the current chat. Perform this handoff only
within the standing project authority and safety boundaries.
