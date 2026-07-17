# Taskboard — [GOAL_NAME]

> **Legacy pre-v2.3 evidence. Do not use this as a live queue or proof store.**
> S-020 owns its replacement; current projects use stable specs and generated
> root `TASKBOARD.md` projections.

The single shared coordination artifact for this run. The **manager** owns the Goal, Done when, Assignments table, and final documentation integration. **Subagents** append their own rows to the Proof Log and report documentation impact for their lanes. No one rewrites another agent's rows.

**Run started:** [YYYY-MM-DD HH:MM]  
**Manager:** [agent id]  
**Subagents:** [agent ids]

## Goal

[One sentence describing the outcome this run must produce.]

## Done when

The run is complete when all of these hold:

- [Checkable acceptance condition]
- [Checkable acceptance condition]
- Affected docs are updated, or documentation is marked `Docs checked; no update needed`.
- The full verification suite (`RUNBOOK.md` → Test And Build) passes.
- No task below is `assigned` or `in-progress`.

## Assignments

The manager fills this in. **Rule: no two open tasks may share a `Touches` path.** If two tasks need the same files, sequence them instead of running both.

| ID | Task | Owner | Touches (paths it may edit) | Docs impact | Status | Why (outcome) |
|---|---|---|---|---|---|---|
| T1 | [specific task] | [subagent] | `[path/ or file]` | [docs in lane / manager final pass / none expected] | assigned | [what this delivers] |
| T2 | [specific task] | [subagent] | `[non-overlapping path]` | [docs in lane / manager final pass / none expected] | assigned | [what this delivers] |
| T3 | [specific task] | [subagent] | `[non-overlapping path]` | [docs in lane / manager final pass / none expected] | assigned | [what this delivers] |

**Status values:** `assigned` → `in-progress` → `needs-rework` → `done` · or `blocked`.

## Blocked

Tasks that cannot proceed. Surface these to the user; do not retry indefinitely.

| ID | Blocked on | Reason |
|---|---|---|
| [ID] | [prerequisite / out-of-scope thing] | [why it stopped] |

## Proof Log

Append one row when a task changes durable project state. Tag it with your agent id. Use actual results, not claims. Include the documentation result. Re-read this file immediately before appending so you build on the latest version; never rewrite an existing row. This board is the subagents' only durable write target; the manager copies the final result into the project root `TASKBOARD.md`.

| Date | Agent | Task | Proof (command or named manual check) | Documentation | Result | Remaining gap |
|---|---|---|---|---|---|---|
| [YYYY-MM-DD] | [manager] | baseline | `[full test command]` | [docs checked / gap] | [pass/fail] | [none/gap] |
| [YYYY-MM-DD] | [subagent] | [T#] | `[command]` or manual check + reason | [updated / manager follow-up / no update needed] | [pass/fail] | [none/gap] |
| [YYYY-MM-DD] | [manager] | integration | `[full test command]` | [docs updated / no update needed] | [pass/fail] | [none/gap] |
