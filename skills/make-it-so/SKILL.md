---
name: make-it-so
description: Kayden's universal "approved — build it and save it" command, with or without a grilling session. Confirms pending approvals, promotes the settled decisions (grilling notepad or current conversation) into canonical docs and specs, implements the promoted tickets, and pushes every result to the remote. Owner-only; the model must never invoke it.
disable-model-invocation: true
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

1. **Matching grilling notepad.** If a `PROVISIONAL` notepad in the Intent
   lane (`$TMPDIR/.foundry/`) covers the topic under discussion, it is the
   source of truth — the notepad wins over a compacted chat.
2. **Stale notepad guard.** Never promote a `PROVISIONAL` notepad whose topic
   does not match the current discussion. Name the mismatched notepad
   visibly, leave it untouched, and continue with the conversation fallback.
3. **Conversation fallback.** With no matching notepad, the settled decisions
   of the current conversation are the input. Write them into a new notepad at
   `$TMPDIR/.foundry/<topic-slug>-<YYYY-MM-DD>.md` first — each decision
   as a `[locked]` line, anything unsettled as `[open]` — so the promotion has
   the same durable record a grilling would leave. If the conversation has no
   settled decisions to write, say so and stop; there is nothing to authorize.

## Delegate the runway

Each named step is a real invocation of that skill — never restate or
improvise its procedure here. In order:

1. Summarize and lock the agreed scope from the notepad.
2. `/to-docs` — route every `[locked]` decision that belongs in existing
   control files to its owner.
3. `/to-spec` — skip when the outcome is documentation only.
4. `/to-tickets` — `make it so` authorizes the decomposition, so do not pause
   for redundant approval.
5. Carry every `[tentative]` and `[open]` item forward as an explicit blocker;
   never silently promote or drop one.
6. `/save` (plane: Canon) — the promoted plan must be remotely recoverable
   before implementation begins.
7. For each promoted ticket, one at a time under the owning `AGENTS.md`
   lifecycle: run the launch preflight first when the room provides one
   (GPT_OS: `node tools/preflight.mjs --spec S-### --ticket TK-###` for every
   repository the ticket touches) — a failed preflight stops that launch as a
   blocking owner report; recorded `ready` state or a sitrep is never
   sufficient. Then claim it, drive it with `/tdd`, review it with
   `/code-review`, then `/save` (plane: Actuality). If a ticket cannot
   proceed, record the blocker in the spec, `/save`, continue with the next
   eligible ticket, and report every skipped slice visibly at the end.
8. Delete the notepad. Promotion lands its cargo in canon; the Intent lane
   holds only live work, so a promoted notepad is destroyed, never archived
   or stamped.
9. Report the durable doc/spec/ticket paths plus the pushed branches and
   commits that now hold the work.

`make it so` authorizes durable planning, implementation, and remote
checkpoints from the settled decisions. It does not broaden standing project
authority or safety boundaries: implementation runs under the same scope,
verification, and git rules as any other slice. Scheduling to a later session
is the fallback only when this environment truly cannot implement safely — and
even then the promoted plan must already be saved before yielding.
