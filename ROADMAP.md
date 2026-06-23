# [PROJECT_NAME] - Roadmap

**Current phase:** [phase name]  
**Owner:** [user / agent / team]

This is the active work plan. Keep it forward-looking and proof-oriented. Do not use it as a dumping ground for old session history.

## Current State

[Short, source-backed summary of what works now. For the most recent baseline result, see the top row of the Verification Log.]

Important drift or uncertainty:

- [Doc/code mismatch, stale claim, unverified assumption, or unknown]

## Current Goal

[One sentence describing the next useful outcome.]

Done when:

- [Acceptance criterion]
- [Acceptance criterion]
- [Acceptance criterion]

## Next Tasks

1. **[Task name]** - [specific outcome]. Proof: `[COMMAND_OR_CHECK]`.
2. **[Task name]** - [specific outcome]. Proof: `[COMMAND_OR_CHECK]`.
3. **[Task name]** - [specific outcome]. Proof: `[COMMAND_OR_CHECK]`.

## Blocked Or Deferred

Do not start these until their prerequisite is met.

| Item | Blocked on | Why it matters |
|---|---|---|
| [Deferred item] | [prerequisite] | [reason] |

## Backlog

Keep this short. Promote items into `Next Tasks` only when they are ready to work.

- [Backlog item]
- [Backlog item]

## Release Checks

Verification commands live in `RUNBOOK.md` → Test And Build. Do not duplicate them here.

Project-specific release and checkpoint checks (not in RUNBOOK):

- [Secret scan / browser smoke / API probe / deploy check]
- [Docs updated / migration applied / service restarted]

## Documentation Check

Documentation is part of done. When a task changes durable project state, update
the docs that describe that state before appending the verification row.

Check these docs before marking work complete:

| If the task changed... | Update or confirm |
|---|---|
| Product purpose, workflows, routes, data model, architecture, invariants, privacy/safety boundaries | `BLUEPRINT.md` |
| Current phase, current goal, next tasks, blockers, backlog, proof of work | `ROADMAP.md` |
| Setup, install, run, test, build, deploy, recovery, environment, operations | `RUNBOOK.md` |
| User-facing usage, demo steps, handoff, public instructions | `README.md` |
| Agent rules, authority order, read/edit scope, verification contract | `AGENTS.md` |

If no docs need edits, record `Docs checked; no update needed` in the final
response and in the verification row's `Remaining gap` field.

## Verification Log

Append a row when a task changes durable project state. Use actual results, not stale claims.

| Date | Task | Proof | Result | Remaining gap |
|---|---|---|---|---|
| [YYYY-MM-DD] | [task] | `[command]` or manual check | [pass/fail] | [none/gap] |
