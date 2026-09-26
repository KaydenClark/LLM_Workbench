# TK-01M - The generated Taskboard shows in-flight claims read from remote tips

**Task ID:** TK-01M
**Spec ID:** S-00V
**Slice:** The generated Taskboard shows in-flight claims read from remote tips
**Status:** blocked
**Blockers:** TK-01L, S-01V
**Destination:** spec-acceptance: S-00V box 4 (`claim` pushes the claim on the task branch; a second instance running `next` after a fetch does not receive that Task)
**Stance:** Builder
**Planned verification:** Red: a render test over a bare-remote fixture asserting a Task in-progress on a remote tip appears as claimed on the board rendered from integration; green after the renderer reads the same remote overlay `next` uses; `render`, `doctor`; full AGENTS suite; separate-context review.

## Delivery

The last sentence of Desired Behavior 4. S-01V ("Generated JSON Taskboard",
Codex, branch `codex/s00o-release-planning-20260926`, not yet in integration at
this cut) replaces `TASKBOARD.md` with a generated `TASKBOARD.json` and one
shared lane calculation for render, next and doctor. Build this display on that
calculation, reusing the remote overlay from the push-on-claim Task, rather than
on the Markdown renderer that S-01V retires. If S-01V is renumbered, retired or
narrowed, the S-00V dispatcher re-points this blocker with an evidence row.

## Done Criteria

- A claim on any remote tip is visible on the board without a local checkout of
  that branch.
