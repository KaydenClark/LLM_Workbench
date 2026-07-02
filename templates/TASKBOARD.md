# [PROJECT_NAME] - Taskboard

> Generated from LLM Workbench v[HARNESS_VERSION]. See `RUNBOOK.md` ->
> Upgrading The Harness.

**Current focus:** [one sentence describing the current useful outcome]  
**Owner:** [user / agent / team]  
**Last updated:** [YYYY-MM-DD]

This is the live work queue and proof ledger. Agents use it to decide what to
work on next. Keep strategy and long-term direction in `BLUEPRINT.md`; keep
commands and verification procedures in `RUNBOOK.md`.

## Executive Brief

Five lines for the owner who never reads code. Refresh it at the end of each work
session so a glance answers "where does this project stand?"

- **Shipping now:** [current useful outcome in one line]
- **Health:** [green / yellow / red + one-phrase why]
- **Decision needed:** [top item from Pending Decisions, or "none"]
- **Blocked on:** [top blocker, or "nothing"]
- **Next milestone:** [nearest milestone + rough when]

## Pending Decisions

Decisions only the owner should make. Agents surface tradeoffs here as product
choices - options, a recommendation, and the cost of choosing - and do not decide
them alone. Keep code-level detail out of this queue.

| ID | Decision | Options | Recommendation | Cost / impact | Owner | Status |
|---|---|---|---|---|---|---|
| [ID] | [decision in product terms] | [option A / option B] | [recommended option + one-line why] | [time, money, risk, or lock-in] | [owner] | open |

## How To Use This Board

1. Read `BLUEPRINT.md` for context.
2. Pick the highest-priority `ready` task that is in scope and unclaimed.
3. Move it to `claimed` or `in-progress` before editing.
4. Do the smallest correct change.
5. Run the task's required proof and the relevant `RUNBOOK.md` checks.
6. Move the task to `done`, `blocked`, `deferred`, or `needs-review`.
7. Append one proof row with the actual result.

Do not rewrite existing proof rows. Append only.

## Status Values

| Status | Meaning |
|---|---|
| `ready` | Clear enough for the next agent to start. |
| `claimed` | An agent has picked it but has not edited yet. |
| `in-progress` | Work is underway. |
| `gated` | Implementation is done and waiting on verification, review, or merge. |
| `needs-review` | Needs human or manager review before more work. |
| `blocked` | Cannot proceed until the blocker is resolved. |
| `deferred` | Valid work, intentionally not next. |
| `done` | Proof exists and docs impact is resolved. |

A `claimed` or `in-progress` task that has gone stale (no update past
`[STALE_THRESHOLD]`, default one working day) may be reclaimed per the reclaim
rule in `AGENTS.md` -> Long Session Control.

## Ready

| ID | Priority | Task | Source / why now | Touches | Proof required | Docs impact | Owner | Status | Last update |
|---|---:|---|---|---|---|---|---|---|---|
| T-001 | 1 | [specific task] | [source] | `[path]` | `[command/check]` | [docs to update or check] | [agent/user] | ready | [YYYY-MM-DD] |

## In Progress

| ID | Priority | Task | Owner | Started | Touches | Current note | Proof required | Status |
|---|---:|---|---|---|---|---|---|---|
| [ID] | [n] | [task] | [owner] | [YYYY-MM-DD HH:MM] | `[path]` | [short note] | `[command/check]` | in-progress |

## Blocked

Use this lane for roadblocks, slowdowns, and risks that affect current or
near-term work. If a blocker becomes a stable architectural risk, summarize it
in `BLUEPRINT.md`.

| ID | Task / area | Blocked on | Evidence | Next action | Owner | Status |
|---|---|---|---|---|---|---|
| [ID] | [task/area] | [blocker] | [command/log/manual check] | [next concrete action] | [owner] | blocked |

## Deferred

Valid work that should not be started yet.

| ID | Task | Deferred until | Why it matters | Revisit trigger |
|---|---|---|---|---|
| [ID] | [task] | [condition] | [reason] | [trigger] |

## Done

Completed task summary. Detailed evidence belongs in the proof log below.

| ID | Task | Completed | Result | Proof row |
|---|---|---|---|---|
| [ID] | [task] | [YYYY-MM-DD] | [pass/fail/partial] | [row reference] |

## Documentation Check

Documentation is part of done. Before marking a task complete, check:

| If the task changed... | Update or confirm |
|---|---|
| Product purpose, workflows, routes, data model, architecture, invariants, privacy/safety boundaries | `BLUEPRINT.md` |
| Task queue, blockers, deferred work, proof of completed work | `TASKBOARD.md` |
| Setup, install, run, test, build, deploy, recovery, environment, operations, evaluation procedure | `RUNBOOK.md` |
| User-facing setup, usage, demo, handoff, public instructions | `README.md` |
| Agent rules, scope, authority, verification policy | `AGENTS.md` |

If no docs need edits, record `Docs checked; no update needed` in the final
response and in the proof row's `Docs` field.

## Proof Log

Append a row when a task changes durable project state or produces durable
verification evidence. Use actual results, not stale claims. Milestone tasks
must fill the Demo column with a <1-minute demo artifact (screenshot, recording,
preview URL, or one-command demo); non-milestone rows may use `n/a`.

**Archival policy.** The proof log is append-only, but it should not grow without
bound. When it passes ~30 rows, move the oldest rows (keep the most recent ~30
here) into `TASKBOARD_ARCHIVE.md`, preserving them verbatim under a dated
heading. `TASKBOARD_ARCHIVE.md` is append-only too - archiving relocates history,
it never rewrites or deletes it. The `Done` table may be trimmed the same way,
leaving a pointer to the archive.

| Date | Task ID | Agent | Proof | Demo | Result | Docs | Remaining gap |
|---|---|---|---|---|---|---|---|
| [YYYY-MM-DD] | [ID] | [agent] | `[command]` or named manual check | [demo artifact link/command, or n/a] | [pass/fail/partial] | [updated / no update needed] | [none/gap] |
