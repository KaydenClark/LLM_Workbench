# TK-005R - Let a failed verdict or owner finding continue the named Task, or open a new Task when the fix rewrites it

**Task ID:** TK-005R
**Spec ID:** S-004F
**Slice:** Let a failed verdict or owner finding continue the named Task, or open a new Task when the fix rewrites it
**Status:** blocked
**Stance:** Builder
**Blockers:** TK-005Q
**Destination:** spec-acceptance: A failed verdict can continue an existing Task with an adjusted handoff or open a new Task when the fix rewrites it, the record says which, and the append-only check shows no earlier evidence or proof rewritten.
**Planned verification:** Red, at `recordReviewVerdict`, `recordOwnerApproval` and `createCorrectiveTasks` in `workbench/tools/spec-report.mjs` and through the `verdict` and `approve` commands in a fixture room: a fail verdict finding that names a done Task today creates a new ready Task and never continues it; a finding naming neither disposition is accepted. Green: a finding written `continue TK-###: <what the check found and what the fix must do>` appends an entry to that Task's `## Continuation` table, moves a done Task to ready and leaves its Receipt rows, Proof and every earlier Spec evidence row byte-identical; a finding written `new Task: <finding>` (optionally `new Task rewriting TK-###: ...`) opens a new ready Task as today; a finding naming neither, a Task the Spec does not hold, or a blocked or deferred Task is refused before any write; the Spec evidence row carries the disposition text so the record says which case applied; a repeat for the same evidence row is refused; `next`, `claim`, `receipt` and `close` treat the continued Task as ordinary work, and its second close appends a distinct `Task closed (run N)` evidence row instead of conflicting with the first; `tools/check-append-only.py` passes over the fixture history. `tools/test-spec-report.mjs`, `tools/test-spec-workbench.mjs`, `tools/test-verdict-candidate-binding.mjs`, `tools/test-workbench-round-trip.mjs` and the full AGENTS suite pass on the committed candidate.

## Outcome

A check that finds a miss no longer forces a new Task. The recorder of the
verdict or owner finding says, per finding, whether the same Task continues with
an adjusted handoff or the fix rewrites it into a new Task, and the Spec's own
evidence row says which case applied.

## Scope

- The finding grammar and its validation before any write, in
  `workbench/tools/spec-report.mjs`, shared by the fail verdict and the owner QA
  finding that keeps the destination.
- The `## Continuation` section of a Task record (an append-only table read and
  written by one reader) and the done to ready move for a continued done Task.
- The re-close identity in `workbench/tools/spec-workbench.mjs`: `Task closed`
  for the first close and `Task closed (run N)` for a later one.
- The `verdict` and `approve` command help text where it names corrective Tasks.
- Tests at the stable seams above, including the append-only proof.

## Acceptance

- [ ] A failed verdict can continue a named Task with an adjusted handoff.
- [ ] A failed verdict can open a new Task for a finding whose fix rewrites a
      Task, and the row says so.
- [ ] A finding that names neither disposition is refused before any write.
- [ ] A continued Task's earlier Receipt rows, Proof and evidence rows are
      unchanged and `check-append-only.py` passes.
- [ ] `next`, `claim`, `receipt`, `close`, `render` and `doctor` treat a continued
      Task as ordinary work.

## Boundaries

No `AGENTS.md`, `RUNBOOK.md`, Lexicon or template change here (TK-005T states the
rules in the controls). The Wiki-claim route and the refusal for delivered Specs
belong to TK-005S. A destination-change finding still records a return to Align
and creates nothing.
