---
name: handoff
description: Prepare readable Markdown continuation instructions when the user asks to hand work to another agent or task. Preserve the exact requested endpoint, decisions, corrections, accessible context and one next action; creating a handoff does not authorize execution.
---

Author one destination-specific handoff from the current assignment and relevant
working context. Read the Contract and manifest; compose `notepad` to recover
selected entries with their corrections and dependencies. Use the declared
`handoffs` collection and a `.md` file. Legacy JSON handoffs remain readable
sources; never generate a new JSON handoff or use a Foundry temporary store.

1. State the exact job and endpoint in ordinary language. Carry explicit
   exclusions through every helper. For “create specifications; do not implement”,
   the recipient may author the named specifications only. Mentioning
   `make-it-so`, `carry` or another skill cannot expand that endpoint.
2. Reconcile settled decisions and corrections against current owners. Include
   enough definitions and instructions to make the job executable without the
   owner reconstructing it. Preserve stable IDs, tentative/open status, source
   uncertainty and the difference between intended behavior and verified results.
3. Author using the bundled shape in `assets/HANDOFF.md` beside this skill. Name one
   resume point, the relevant source paths/commits, actual achieved state,
   remaining verification, blockers and inherited authorization. A referenced
   source must be accessible to the recipient. When access is absent or unknown,
   include the necessary safe content and identify the access limitation.
   Do not copy secrets or raw private data.
4. Validate the source note and read its current view back before transfer.
   Retain context that the handoff needs. Before transferring, declare the dependency with `notepads.mjs current`
   using `--view-field 'active_handoffs=["workbench/sessions/handoffs/NAME.md"]'`
   and the current revision. Cleanup refuses while this list is nonempty.
   Clear it only after verifying the transfer no longer needs the source.
5. Read the authored Markdown as the recipient: can they state the job, limits,
   relevant decisions, evidence limits and one executable next step? Check every
   reference and scope statement. If a fresh-context read-back is available,
   ask for interpretation only; do not create another task or execute the work
   merely to test the handoff. Report whether that read-back was performed.

Return the Markdown path and the authorized next step. File existence alone
is insufficient. A handoff request authorizes authorship, not implementation,
promotion, sending it to others or creating a new task.
