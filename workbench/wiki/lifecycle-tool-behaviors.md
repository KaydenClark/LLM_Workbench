---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Learned while dispatching v4 build lanes, 2026-09-16 to 2026-09-18
  - Promote-draft location learned 2026-09-22
  - Planned-Spec claim refusal observed 2026-09-24
  - Promoted from host auto-memory and re-verified against source by the Portable Workbench Spec (S-00V) Host Memory To Wiki Task (TK-00I) audit, 2026-09-26
  - close refusals and the verdict digest scope re-verified against source while documenting them for the Completion Claims Against Repository State Spec (S-00M) Document Both Mechanisms Task (TK-004), 2026-10-02
  - Finding dispositions and the retired Wiki-claim corrective close re-verified against source for the Corrective Work Rules Spec (S-004F) Failed Verdict Continuation Task (TK-005R) and Wiki-claim Corrective Route Retirement Task (TK-005S), 2026-10-03
  - Contract Carrier Pointer-Brief Rewrite Spec (S-004C) Work-selection Operations Task (TK-005G) moved the Runbook and AGENTS lifecycle procedures behind their index pointers into the implement, dispatcher and director skills, 2026-10-03
  - The move-spec section and the append-only scope checked against source for the LANDMARK.md Artifact And Lane Runtime Spec (S-003Z), Task TK-008J (landmark templates and documentation), 2026-10-06
  - Implement-spec Skill Adoption Spec (S-002T) added exact Task selection through the native claim and close paths, 2026-10-06
source_paths:
  - workbench/tools/spec-workbench.mjs
  - tools/check-append-only.py
  - workbench/tools/sessions.mjs
  - workbench/tools/workbench-layout.mjs
  - workbench/tools/spec-report.mjs
  - workbench/tools/landmark-artifact.mjs
  - RUNBOOK.md
  - workbench/skills/implement/SKILL.md
  - workbench/specs/S-002T-implement-spec-skill-adoption/SPEC.md
  - workbench/skills/dispatcher/SKILL.md
  - workbench/skills/director/SKILL.md
last_verified: 2026-10-03
---

# Lifecycle tool behaviors

Non-obvious behaviors of the Workbench lifecycle tools, each re-checked against
source on 2026-09-26 (the `close` and `verdict` sections on 2026-10-02, the
`move-spec` section and the append-only scope on 2026-10-06; exact Task selection
on 2026-10-06). The
commands themselves are documented in the lane skills the
[RUNBOOK operations index](../../RUNBOOK.md#operations-index) points to:
[implement](../skills/implement/SKILL.md#worker-selection-implementation-and-hand-back),
[dispatcher](../skills/dispatcher/SKILL.md#dispatcher-and-separate-director-assembled-review),
[director](../skills/director/SKILL.md#owner-human-qa-and-main-before-complete) and
[promote](../skills/promote/SKILL.md#command-reference); this note explains what
surprises agents.

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

- **Without `--task`, it closes the first `in-progress` slice in order,
  and only a claimed one.** With no Task in progress it refuses ("has no
  in-progress task to close; claim one first") instead of closing a ready Task
  nobody claimed. A single durable writer can close a later lane with
  `close S-### --task TK-###`; claim supports the same exact selector. Both
  use the existing checks and refuse an invalid target without falling through
  to another Task. Recover a pending close before selecting a different Task.
  The [implement procedure](../skills/implement/SKILL.md#explicit-task-selection-for-orchestration)
  owns the operation; no manual row edits are needed.
- **It refuses a claim the repository contradicts.** A dirty tree (anything
  `git status --porcelain` shows, untracked files included) or an unpushed
  HEAD (no remote-tracking ref contains it) is refused as `dirty-tree` /
  `unpushed` before anything is written. Commit and push, then close; a
  truthful exception goes in `--git-state-reason "<why>"`, which lands beside
  the remaining gap in the Receipt row and the Spec evidence row. A reason on a
  clean, pushed tree is itself refused. The close commit therefore comes after a
  push, and the close evidence it writes needs a second commit and push.
  `close` takes a Spec ID: a Task ID refuses, because the standalone corrective
  Task anchored to a Wiki claim is retired and a later gap against delivered
  work is a new Spec.
- **It rewrites `Updated`, `Latest event` and `Next gate`, but not
  `Blockers`.** Re-read the whole Spec header after `close` or `complete` and fix
  any field that became false. Write the Docs cell from the actual diff, not the
  plan.

## `spec-workbench.mjs verdict`

- **Every finding names its disposition.** Write each `;`-separated finding as
  `continue TK-###: <what the check found and what the fix must do>` (the same
  Task continues: its own `## Continuation` table gains the handoff and a done
  Task goes back to `ready`) or `new Task: <finding>` (optionally `new Task
  rewriting TK-###: ...`). A finding naming neither, a Task the Spec does not
  hold, or a blocked Task is refused before the verdict row is written, so a
  refusal leaves nothing half-applied. A continued Task's second close appends
  `Task closed (run N)` instead of conflicting with the first. `approve
  --finding` follows the same rule.
- **A delivered Spec takes no correction.** A fail verdict or owner finding
  against a Spec that is complete, superseded or retired is refused: a later
  gap becomes a new Spec under its landmark or the Blueprint, and the Wiki is
  evidence for it, never its destination.
- **The review digest binds the Completion Result.** `Updated`, `Latest
  event`, `Next gate` and evidence rows are excluded, but Acceptance Criteria
  and the Completion Result are not. Write the Completion Result on the reviewed
  candidate so it stays true after the merge (do not name the pending review or
  merge as open there; that belongs in `Next gate`), or the post-merge records
  update moves the digest and needs a fresh review.

## `spec-workbench.mjs move-spec`

- **A Spec has two homes, and a move changes one or the other, never both.**
  `move-spec S-### --to retired` retires a Spec within its own home;
  `move-spec S-### --landmark LMK-###` moves an active-roster Spec into a
  landmark's `specs/` folder or between landmarks, and `--landmark none` moves
  it back to the Blueprint-level `workbench/specs/`. Giving both is refused,
  and an already retired Spec is not reparented.
- **Every link is recomputed, not only Markdown ones.** The move rewrites
  every live reference to the Spec and counts the historical ones, and the
  moved record's own outgoing links to files that did not move, non-Markdown
  files included, are recomputed for the new folder depth.
- **The landmark's lists are not edited.** Moving a Spec into a landmark does
  not add it to that `LANDMARK.md`'s Child Specs list, and a move out can leave
  an empty, untracked `specs/` folder behind; edit the list and remove the
  folder by hand. The artifact itself is explained in
  [Landmarks: The LANDMARK.md Artifact One Size Above A Spec](design-concepts/landmarks-one-size-above-specs.md).

## Append-only evidence

`tools/check-append-only.py` identifies a row by its Date, Task and Event cells
and requires the text first published for that identity to survive verbatim. It
scans every commit on the branch, merged or not, across every Blueprint-level
Spec, every `LANDMARK.md` (active and retired) and every Spec nested in a
landmark's `specs/` folder. So a wrong row is corrected by appending a
correction row; if the Event cell itself is wrong, an in-place edit forks the
identity and restoring it reads as a deletion, so cut a fresh branch
(`cherry-pick -n`, correct, commit once) rather than force-push. The history is
read per path, so a record's replay restarts at its new path after a move.

## `sessions.mjs promote`

The authored `--content` draft must be an ordinary, singly linked file inside
the project and is kept out of Git. A draft in the system temp directory or a
session scratchpad is refused. An ignored folder inside the project satisfies
both rules: `workbench/sessions/recovery/` (the round-trip test uses
`workbench/sessions/handoffs/`). Hash the destination first for `--expected`;
the tool never commits the owner.
