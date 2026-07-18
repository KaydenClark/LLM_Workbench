---
name: make-it-so
description: Finish a grilling session by confirming its approvals, promoting the notepad into canonical docs and specs, then implementing the promoted tickets and pushing every result to the remote. Invoke it explicitly; it never fires from someone saying the phrase in passing. Runs to-docs, to-spec, to-tickets, then the implement loop until progress is remotely recoverable.
---

The finish exit for a grilling session, and the counterpart to `/checkpoint`.
Invoke it explicitly — it must never trigger just because someone said "make it
so" in conversation.

`make it so` is one authorization that covers the whole runway: it confirms
every approval the grilling surfaced, locks the agreed scope, promotes the
notepad to canon, and authorizes implementing the resulting tickets in this
session with the results pushed to the remote. Do not pause for redundant
re-approval between the steps below. Stop only for a decision the notepad never
covered: destructive actions outside standing policy, paid services, credential
changes, or genuinely new scope.

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
7. Commit and push the promoted docs, specs, and tickets before implementation
   begins, following the project `RUNBOOK.md` version-control rules. The plan
   itself must be remotely recoverable before any code changes.
8. Implement the promoted tickets here, one at a time, using the `/implement`
   contract: claim the slice, drive it red/green, update owning docs, make a
   truthful checkpoint commit, push it, review, and close. Every stopping
   point — done, blocked, or interrupted — is a pushed commit, never
   local-only progress.
9. If a ticket cannot proceed (blocked dependency, failing gate, missing
   environment), record the blocker in the spec, push the truthful checkpoint,
   and continue with the next eligible ticket; report every skipped slice
   visibly at the end.
10. Mark the notepad `STATUS: PROMOTED — <date>` and report the durable
    doc/spec/ticket paths plus the pushed branches and commits that now hold
    the work.

`make it so` authorizes durable planning, implementation, and remote
checkpoints from the notepad. It does not broaden standing project authority or
safety boundaries: implementation runs under the same scope, verification, and
git rules as any other slice. Scheduling to a later session is the fallback
only when this environment truly cannot implement safely — and even then the
promoted plan must already be pushed before yielding.
