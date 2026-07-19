---
name: make-it-so
description: Kayden's "approved — build it and save it" authorization. Composes to-docs, to-spec, to-tickets, save-plan, and implement over what we decided. Invoke explicitly; never fires from the phrase said in passing.
---

Kayden has approved what we decided. Do not re-ask for approvals already
given; stop only for something never settled — destructive actions, paid
services, credentials, or new scope.

The input is the settled decisions of this conversation. A matching
`PROVISIONAL` decision notepad outranks a compacted chat; a mismatched one is
named and ignored; a missing one is never an error. Nothing settled → say so
and stop.

Run, in order:

1. `/to-docs`
2. `/to-spec` — skip when the outcome is documentation only
3. `/to-tickets`
4. `/save-plan` — the plan reaches the remote before implementation starts;
   if this session dies here, nothing is lost and the Captain still discovers
   the tickets.
5. `/implement` — start the first eligible slice here, saving progress with
   `/save-work` at every stopping point. Remaining slices ride the Captain
   cadence.

Mark a used notepad `STATUS: PROMOTED — <date>`, then report the doc/spec/
ticket paths and the pushed commits that hold the work.
