# TK-007E - The owner's answers save to a notepad instead of answers.json

**Task ID:** TK-007E
**Spec ID:** S-004D
**Slice:** The owner's answers save to a notepad instead of answers.json
**Status:** ready
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Updates use source validation and existing gates; rejected, stale and concurrent operations leave recoverable, explicit outcomes without lost edits.
**Planned verification:** Red then green in tools/test-grill-board.mjs (a saved verdict and note land in the board's notepad through the notepad runtime with its revision check; a save made against a stale revision is refused with an explicit outcome and loses neither write; pending, apply and the page read the same answers back; an existing answers.json is carried into the notepad once without loss and then no longer written); then the full suite, render and doctor on the committed candidate.

## Scope

Move the owner's answers from the untracked `workbench/grill-board/answers.json` into a notepad (the owner, 2026-10-06: the board saves answers to a notepad), written through `workbench/tools/notepads.mjs` so its revision check guards the page and agents writing the same note. Answers stay Intent until carried, as they are today; `apply` still copies the owner's words into Git. Update the Grill Board README's file table and agent rules.
