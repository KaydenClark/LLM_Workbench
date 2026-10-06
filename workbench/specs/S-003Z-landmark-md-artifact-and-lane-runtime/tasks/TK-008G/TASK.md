# TK-008G - A Task directly under an assigned landmark is selected, claimed, closed and receipted with its own Task-PR gate

**Task ID:** TK-008G
**Spec ID:** S-003Z
**Slice:** A Task directly under an assigned landmark is selected, claimed, closed and receipted with its own Task-PR gate
**Status:** ready
**Stance:** Builder
**Blockers:** TK-008D
**Destination:** spec-acceptance: A `LANDMARK.md` can be authored from the template, validated, and assigned in a fixture room, and a Task under the assigned landmark can be selected and claimed.
**Planned verification:** Red: a `tasks/TK-0AD/TASK.md` record under `workbench/landmarks/LMK-0AA-slug/` carrying `**Landmark ID:** LMK-0AA` in place of `**Spec ID:**` is refused by `parseTaskRecord` and invisible to `next`; green: `task-record.mjs` accepts exactly one of `Spec ID` or `Landmark ID`, `next`/`next --json` offers the landmark-direct Task only while its landmark is `active` with an owner other than `unassigned` (an unassigned landmark's Task is never offered, per the Spec's decision that no Task runs under an unassigned landmark), `claim LMK-### --agent NAME` claims it, `receipt`, `close` and `gate --task TK-### --spec`-equivalent `gate --task TK-### --landmark LMK-###` report it under the Task-PR exemption, `close` appends the row to the landmark's Append-Only Evidence And Execution Log and the Taskboard projection shows it under the landmark; `move-task` retires it into `<landmark>/tasks/retired/`. The landmark's `Blockers` and the Task's `Blockers` hold only `S-`/`TK-`/`LMK-` ids. Targeted tests in `tools/test-spec-workbench.mjs`, `tools/test-taskboard-json.mjs` and a `tools/test-task-record` seam, then the full Runbook suite on the committed candidate.
