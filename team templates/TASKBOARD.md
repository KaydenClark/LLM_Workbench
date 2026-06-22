# Taskboard — [GOAL_NAME]

The single shared coordination artifact for this run. The **manager** owns the Goal, Done when, and the Assignments table. **Subagents** append their own rows to the Proof Log. No one rewrites another agent's rows.

**Run started:** [YYYY-MM-DD HH:MM]  
**Manager:** [agent id]  
**Subagents:** [agent ids]

## Goal

[One sentence describing the outcome this run must produce.]

## Done when

The run is complete when all of these hold:

- [Checkable acceptance condition]
- [Checkable acceptance condition]
- The full verification suite (`RUNBOOK.md` → Test And Build) passes.
- No task below is `assigned` or `in-progress`.

## Assignments

The manager fills this in. **Rule: no two open tasks may share a `Touches` path.** If two tasks need the same files, sequence them instead of running both.

| ID | Task | Owner | Touches (paths it may edit) | Status | Why (outcome) |
|---|---|---|---|---|---|
| T1 | [specific task] | [subagent] | `[path/ or file]` | assigned | [what this delivers] |
| T2 | [specific task] | [subagent] | `[non-overlapping path]` | assigned | [what this delivers] |
| T3 | [specific task] | [subagent] | `[non-overlapping path]` | assigned | [what this delivers] |

**Status values:** `assigned` → `in-progress` → `needs-rework` → `done` · or `blocked`.

## Blocked

Tasks that cannot proceed. Surface these to the user; do not retry indefinitely.

| ID | Blocked on | Reason |
|---|---|---|
| [ID] | [prerequisite / out-of-scope thing] | [why it stopped] |

## Proof Log

Append one row when a task changes durable project state. Tag it with your agent id. Use actual results, not claims. Never rewrite an existing row.

| Date | Agent | Task | Proof (command or named manual check) | Result | Remaining gap |
|---|---|---|---|---|---|
| [YYYY-MM-DD] | [manager] | baseline | `[full test command]` | [pass/fail] | [none/gap] |
| [YYYY-MM-DD] | [subagent] | [T#] | `[command]` or manual check + reason | [pass/fail] | [none/gap] |
| [YYYY-MM-DD] | [manager] | integration | `[full test command]` | [pass/fail] | [none/gap] |
