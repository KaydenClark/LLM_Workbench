---
name: grilling
description: Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
---

Interview me relentlessly about every aspect of this until we reach a shared understanding. Walk down each branch of the decision tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time, waiting for feedback on each question before continuing. Asking multiple questions at once is bewildering.

If a fact can be found by exploring the environment (filesystem, tools, etc.), look it up rather than asking me. The decisions, though, are mine — put each one to me and wait for my answer.

Do not act on it until I confirm we have reached a shared understanding. Keep
grilling until I use the exact passphrase `make it so` (case-insensitive,
ignoring surrounding punctuation). Similar confirmation or implementation
phrases do not stop the interview.

When I use it:

1. Summarize and lock the agreed scope.
2. Run `to-spec` to persist the settled capability in its stable `SPEC.md`.
3. Run `to-tickets` to add dependency-aware slices to that spec. The passphrase
   authorizes the agreed decomposition, so do not pause for redundant approval;
   preserve unresolved owner decisions as blockers.
4. Render and verify the generated `TASKBOARD.md`.
5. Report the durable spec and ticket paths.
6. Use the runtime's available scheduler, following the project's `RUNBOOK.md`,
   to schedule an agent to begin the eligible Taskboard tickets one at a time.
   If scheduling is unavailable, report the blocker visibly and do not fall
   back to implementing the tickets here.
7. Report the scheduling result and stop the current chat.

`make it so` authorizes durable planning and scheduling. It does not authorize
implementation in the current chat. Perform this handoff only within the
standing project authority and safety boundaries.
