# TK-01M - The generated Taskboard shows in-flight claims read from remote tips

**Task ID:** TK-01M
**Spec ID:** S-00V
**Slice:** The generated Taskboard shows in-flight claims read from remote tips
**Status:** blocked
**Blockers:** TK-01L, S-01X
**Destination:** spec-acceptance: S-00V box 4 (`claim` pushes the claim on the task branch; a second instance running `next` after a fetch does not receive that Task)
**Stance:** Builder
**Planned verification:** Red: a render test over a bare-remote fixture asserting a Task in-progress on a remote tip appears as claimed on the board rendered from integration; green after the renderer reads the same remote overlay `next` uses; `render`, `doctor`; full AGENTS suite; separate-context review.

## Delivery

The last sentence of Desired Behavior 4. The board is
[S-01X](../../../S-01X-generated-json-taskboard/SPEC.md) (the generated JSON
taskboard Spec from S-00O): a generated, never-authoritative
`TASKBOARD.json` (schema v1, six lanes `backlog`, `toDo`, `inProgress`,
`blocked`, `needsReview`, `complete`, cards keyed by WBID) with one pure lane
calculation, `workbench/tools/taskboard.mjs`, serving render, next and doctor.

Dependency shape (Lane I's preliminary contract, 2026-09-26, contract level
until S-01X's first board Task fixes the export and card-field names): pass
the remote-tip claims from TK-01L's push-on-claim overlay into that shared
calculation as an input overlay. Do not parse `TASKBOARD.json` and do not build
a second reader. S-01X adds the overlay hook and a claim field on cards; S-00V
owns what a remote claim displays as. Replace this paragraph with the final
names once they exist.

## Done Criteria

- A claim on any remote tip is visible on the board without a local checkout of
  that branch.
