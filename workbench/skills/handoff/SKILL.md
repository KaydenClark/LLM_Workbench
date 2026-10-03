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
3. Author using the bundled shape in `assets/HANDOFF.md` beside this skill. The
   shape has fewer headings than the handoff has obligations; put each one
   where the recipient will look for it:
   - `The job`: the objective in one sentence and the named destination, the
     agent, session or task that receives it.
   - `Authorized endpoint`: the exact stop point, every explicit exclusion and
     the inherited authorization, attributed to whoever granted it.
   - `Verified state`: actual achieved state, each fact with its source path or
     commit, and the verification that remains. Record a correction beside
     the claim it corrects, naming both the earlier and the corrected meaning,
     wherever that claim appears.
   - `Resume point`: exactly one next executable action or owner gate.
   - `Open work`: blockers and open questions with stable IDs and their
     tentative or open status.
   - `Boundaries`: what must not be reopened, changed or assumed, and each
     access limit: what the recipient cannot read or do, and what was inlined
     because of it.
   - `Sources to load`: accessible source paths at a pinned revision.
   - `Recipient check`: the step 5 read-back and whether it was performed.

   A referenced source must be accessible to the recipient. When access is
   absent or unknown, include the necessary safe content and identify the
   access limitation. A live notepad or other untracked file
   exists only in this checkout, so cite it only for a recipient working in the
   same checkout and otherwise carry its needed content. Do not copy secrets or
   raw private data.
4. When the handoff draws on a notepad, validate the source note and read its
   current view back before transfer. Retain context that the handoff needs.
   Before transferring, declare the dependency with `notepads.mjs current`
   using `--view-field 'active_handoffs=["workbench/sessions/handoffs/NAME.md"]'`
   and the current revision. Cleanup refuses while this list is nonempty.
   Clear it only after verifying the transfer no longer needs the source.
5. Read the authored Markdown as the recipient: can they state the job, limits,
   relevant decisions, evidence limits and one executable next step? Check every
   reference and scope statement. If a fresh-context read-back is available,
   ask for interpretation only; do not create another task or execute the work
   merely to test the handoff. Report whether that read-back was performed.

Return the Markdown path and the authorized next step. File existence alone
is insufficient. A handoff request
authorizes authorship, not implementation, promotion, sending it to others or creating a new task.

## Author, recipient and shared context

Distinguish author from recipient, and assigner from assignee. A request to
prepare a handoff assigns its author the preparation of instructions for
another agent in a separate context. Authoring it does not assign the
recipient's work to the author. A handoff may convey a delegated assignment,
a completion report or an update; its instructions do not carry independent
authority.

Notepads capture context as it happens; handoffs select and organize it for a
specified recipient and purpose. Agents may read each other's handoffs and
objective notepads. A coordinating role may manage shared updates to both as
temporary scaffolding, with one writer per note or handoff at a time.
The [Lexicon](../../../LEXICON.md#artifact-boundaries) defines their jobs and the
[transfer procedure](#transfer-procedure) below owns the transfer procedure.

## Transfer procedure

Use a handoff for a specified receiving context: a delegated job, a focused
investigation, a completion report or an update. Follow the
[role and author/recipient boundaries](../../../AGENTS.md#handoff-assignments-and-shared-context).
State why that context exists, what its recipient should do, the endpoint and
any expected return. Derive the purpose from the request and current assignment
when clear; ask one focused question only when the intended work is really
unclear. Include the selected compressed context, relevant objective notepad,
accessible source links and suggested investigation before the recipient starts.
For a deep dive on one question in the middle of a grilling, prepare that
question's brief and note/source links for the new context to investigate and
return a clean answer to the original inquiry, preserving the grilling
agent's context.

A handoff requested by the owner or initiated within an assigned role is
separately authored as a Markdown file in
`sessions/handoffs/`, using the installed `handoff` skill and its bundled `assets/HANDOFF.md` as the copy-ready shape.
It names the retained source, when any, in prose and must carry enough context
for a receiver without local access. Before trimming or deleting source context,
the author verifies that the receiver's needed material is durable or otherwise
retained; Markdown handoffs are intentionally readable rather than tool-managed
JSON records. Existing JSON handoffs remain legacy local sources and are not
newly created.

For a legacy JSON retaining destination, reconcile it before releasing retention: set its status to
`RECONCILED`, clear unresolved items with `--unresolved ""`, and clear its next
action with `--next-action ""`. Source cleanup remains a separate decision.
Whole `delete` requires the source to be reconciled with no entries, unresolved
items, next action, or active declared retainer. Unreadable live records block
cleanup with named paths because retention cannot be established; repair or
reconcile them without discarding their source bytes. This does not block other
work or grant the tool authority to choose what is important.
