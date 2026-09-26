# TK-01M - The generated Taskboard shows in-flight claims read from remote tips

**Task ID:** TK-01M
**Spec ID:** S-00V
**Slice:** The generated Taskboard shows in-flight claims read from remote tips
**Status:** blocked
**Blockers:** TK-01L, S-00O
**Destination:** spec-acceptance: S-00V box 4 (`claim` pushes the claim on the task branch; a second instance running `next` after a fetch does not receive that Task)
**Stance:** Builder
**Planned verification:** Red: a render test over a bare-remote fixture asserting a Task in-progress on a remote tip appears as claimed on the board rendered from integration; green after the renderer reads the same remote overlay `next` uses; `render`, `doctor`; full AGENTS suite; separate-context review.

## Delivery

The last sentence of Desired Behavior 4. The blocker is the generated JSON taskboard Spec from S-00O (ID pending allocation):
S-00O plans a generated `TASKBOARD.json` board with one shared lane calculation
for render, next and doctor, replacing the Markdown `TASKBOARD.md`. Build this
display on that calculation, reusing the remote overlay from the push-on-claim
Task, rather than on the Markdown renderer it retires or a second reader.
`S-00O` in Blockers holds conservatively because the board Spec has no
allocated ID yet (an earlier cut named S-01V, which was never allocated);
once the board Spec is allocated, the S-00V dispatcher re-points this blocker
to it in its own commit with an evidence row.

## Done Criteria

- A claim on any remote tip is visible on the board without a local checkout of
  that branch.
