# TK-00K - A Task naming an optional capability the host lacks is routed to blocked with the capability named

**Task ID:** TK-00K
**Spec ID:** S-00V
**Slice:** A Task naming an optional capability the host lacks is routed to blocked with the capability named
**Status:** blocked
**Blockers:** TK-00H
**Destination:** spec-acceptance: S-00V box 5 (the host floor check reports each floor item, and a Task needing an optional capability the host lacks lands in blocked or needs-review with the capability named)
**Stance:** Builder
**Planned verification:** Red: a fixture Task naming an optional capability the host probe reports absent is claimed or checked, and a test asserts it lands blocked with the capability named in the record and in `next`/Taskboard output; green after the smallest record and command change; needs-review routing added only if the record vocabulary carries that status at the candidate; full AGENTS suite; separate-context review.

## Delivery

The second half of Desired Behavior 5: anything beyond the floor (simulator,
screen history, MCP servers, Foundry, Workbench_Template access) is an optional
capability a Task names; a session lacking it sets the Task to blocked, or
needs-review when the work is otherwise done, naming the capability so the
owner's sitrep surfaces it. Reuse the floor Task's probe seam.

Two record-contract facts shape the design: `Blockers` accepts only `S-`/`TK-`
ids, and `needs-review` is not a Task status at integration today (S-01V, on
Codex branch `codex/s00o-release-planning-20260926`, adds it). Name the
capability without breaking the parser (for example a separate field), and
satisfy the box with blocked routing if needs-review has not landed; record the
needs-review half in the gap. `workbench/tools/task-record.mjs` is shared with
S-00J and S-01U identity work: rebase often. The AGENTS capability-blocked rule
is written by the controls sweep, not here.

## Done Criteria

- The capability name is visible in the Task record and the selection output.
- Nothing is faked or skipped silently: a missing capability never lets the
  Task report success.
