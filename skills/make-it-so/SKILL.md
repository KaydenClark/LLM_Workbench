---
name: make-it-so
description: Kayden's universal "approved — build it and save it" command, with or without a grilling session. One invocation composes the primitives he would otherwise type one by one — to-docs, to-spec, to-tickets, schedule, implement — then commits and pushes everything so progress is saved. Invoke it explicitly; it never fires from someone saying the phrase in passing.
---

The universal execution authorization, and the counterpart to `/checkpoint`.
Invoke it explicitly — it must never trigger just because someone said "make it
so" in conversation.

`make it so` means: take what we have decided, document it, turn the document
into specs, turn the specs into tickets, make sure those tickets get done
outside this chat, and commit and push the work so no progress is lost. It is
one authorization composing the primitives Kayden would otherwise run by hand:
`to-docs`, `to-spec`, `to-tickets`, schedule, and `/implement`. It confirms
every pending approval and locks the agreed scope; do not pause for redundant
re-approval between steps. Stop only for a decision that was never settled:
destructive actions outside standing policy, paid services, credential
changes, or genuinely new scope.

## The input is what we decided — the notepad is optional

- A matching `PROVISIONAL` notepad in `.agents/grilling diary/` is the
  highest-fidelity record and wins over a compacted chat.
- No notepad is the normal standalone case: the current conversation's settled
  decisions are the input. Never refuse or complain because there is no
  notepad.
- Never promote a `PROVISIONAL` notepad whose topic does not match the current
  discussion; name it, leave it untouched, and use the conversation instead.
- If nothing has actually been settled, say so and stop — there is nothing to
  authorize.

## The pipeline

1. Summarize and lock the agreed scope; `make it so` confirms the pending
   approvals in that summary.
2. `to-docs` — route every settled decision that belongs in existing control
   files to its owner.
3. `to-spec` — create or update the stable `SPEC.md` for a new or changed
   capability (skip when the outcome is documentation only).
4. `to-tickets` — add dependency-aware slices to that spec; the decomposition
   is already authorized.
5. Carry every `[tentative]` and `[open]` item forward as an explicit blocker;
   never silently promote or drop one.
6. Render and verify the generated `TASKBOARD.md` when specs or tickets
   changed.
7. Commit and push the promoted docs, specs, and tickets immediately,
   following the project `RUNBOOK.md` version-control rules — the plan must be
   remotely recoverable before anything else happens.
8. Schedule the eligible tickets, following the project `RUNBOOK.md`, so they
   get done outside this chat. Each scheduled run uses the `/implement`
   contract — claim, red/green, owning docs, truthful checkpoint commit, push,
   review, close — and `make it so` pre-authorizes those runs; they must not
   come back to ask for approval already given.
9. If no scheduler is available, implement the eligible tickets here with the
   same `/implement` contract instead of leaving them unowned. Never yield
   with tickets unscheduled, unimplemented, and unpushed — a reported blocker
   is acceptable only after the promoted plan is pushed.
10. Mark the notepad `STATUS: PROMOTED — <date>` when one exists, then report
    the doc/spec/ticket paths, the scheduled runs, and the pushed branches and
    commits that hold the work.

`make it so` authorizes durable planning, scheduling, implementation, and
remote checkpoints. It does not broaden standing project authority or safety
boundaries: everything runs under the same scope, verification, and git rules
as any other slice, and every stopping point is a pushed commit, never
local-only progress.
