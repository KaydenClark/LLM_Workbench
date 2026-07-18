---
name: make-it-so
description: Kayden's universal "approved — build it and save it" command, with or without a grilling session. Confirms pending approvals, promotes the settled decisions (grilling notepad or current conversation) into canonical docs and specs, implements the promoted tickets, and pushes every result to the remote. Invoke it explicitly; it never fires from someone saying the phrase in passing. Runs to-docs, to-spec, to-tickets, then the implement loop until progress is remotely recoverable.
---

The universal execution authorization, and the counterpart to `/checkpoint`.
Invoke it explicitly — it must never trigger just because someone said "make it
so" in conversation.

`make it so` is one authorization that covers the whole runway: it confirms
every pending approval, locks the agreed scope, promotes the settled decisions
to canon, and authorizes implementing the resulting tickets in this session
with the results pushed to the remote. Do not pause for redundant re-approval
between the steps below. Stop only for a decision that was never settled:
destructive actions outside standing policy, paid services, credential
changes, or genuinely new scope.

## Resolve the input first

The input is the settled decisions being approved. Resolve it in this order:

1. **Matching grilling notepad.** If a `PROVISIONAL` notepad in
   `.agents/grilling diary/` covers the topic under discussion, it is the
   source of truth — the notepad wins over a compacted chat.
2. **Stale notepad guard.** Never promote a `PROVISIONAL` notepad whose topic
   does not match the current discussion. Name the mismatched notepad
   visibly, leave it untouched, and continue with the conversation fallback.
3. **Conversation fallback.** With no matching notepad, the settled decisions
   of the current conversation are the input. Write them into a new notepad at
   `.agents/grilling diary/<topic-slug>-<YYYY-MM-DD>.md` first — each decision
   as a `[locked]` line, anything unsettled as `[open]` — so the promotion has
   the same durable record a grilling would leave. If the conversation has no
   settled decisions to write, say so and stop; there is nothing to authorize.

Then, in order:

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
checkpoints from the settled decisions. It does not broaden standing project
authority or safety boundaries: implementation runs under the same scope,
verification, and git rules as any other slice. Scheduling to a later session
is the fallback only when this environment truly cannot implement safely — and
even then the promoted plan must already be pushed before yielding.
