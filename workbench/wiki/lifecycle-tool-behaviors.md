---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Learned while dispatching v4 build lanes, 2026-09-16 to 2026-09-18
  - Promote-draft location learned 2026-09-22
  - Planned-Spec claim refusal observed 2026-09-24
  - Promoted from host auto-memory and re-verified against source by the S-00V TK-00I audit, 2026-09-26
source_paths:
  - workbench/tools/spec-workbench.mjs
  - tools/check-append-only.py
  - workbench/tools/sessions.mjs
  - RUNBOOK.md
last_verified: 2026-09-26
---

# Lifecycle tool behaviors

Non-obvious behaviors of the Workbench lifecycle tools, each re-checked against
source on 2026-09-26. The commands themselves are documented in
[RUNBOOK](../../RUNBOOK.md) -> Spec Lifecycle And Retrieval and Direct Owner
Promotion; this note explains what surprises agents.

## `spec-workbench.mjs claim`

- **Only an `active` Spec can be claimed.** A `planned` Spec is refused with
  "is planned, not active", and `next` never returns it. To carry a planned Spec
  as named work, set its `**Status:**` to `active`, correct any Blockers line
  that no longer holds, then claim.
- **A table row must literally read `ready`.** A table-backed row marked
  `blocked` whose blockers are all done is never eligible until its status cell
  is flipped. A record-backed Task (`tasks/TK-*/TASK.md`) is different: its
  effective status is derived from its own Blockers, so a `blocked` record whose
  blockers are satisfied is claimable without editing it.
- **Never chain a Spec write after a command that can refuse** (`claim ... &&
  edit`); a refusal leaves the chain half-applied.

## `spec-workbench.mjs close`

- **It closes the first `in-progress` slice in order** (falling back to the
  first `ready` one). With two lanes open in one Spec, closing the later one
  means writing its rows by hand in the tool's shape.
- **It rewrites `Updated`, `Latest event` and `Next gate`, but not
  `Blockers`.** Re-read the whole Spec header after `close` or `complete` and fix
  any field that became false. Write the Docs cell from the actual diff, not the
  plan.

## Append-only evidence

`tools/check-append-only.py` identifies a row by its Date, Task and Event cells
and requires the text first published for that identity to survive verbatim. It
scans every commit on the branch, merged or not. So a wrong row is corrected by
appending a correction row; if the Event cell itself is wrong, an in-place edit
forks the identity and restoring it reads as a deletion, so cut a fresh branch
(`cherry-pick -n`, correct, commit once) rather than force-push.

## `sessions.mjs promote`

The authored `--content` draft must be an ordinary, singly linked file inside
the project and is kept out of Git. A draft in the system temp directory or a
session scratchpad is refused. An ignored folder inside the project satisfies
both rules: `workbench/sessions/recovery/` (the round-trip test uses
`workbench/sessions/handoffs/`). Hash the destination first for `--expected`;
the tool never commits the owner.
