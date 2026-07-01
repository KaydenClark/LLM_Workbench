---
doc_type: roadmap
version: 1
project_name: "[PROJECT_NAME]"
status: template
current_goal: "[CURRENT_GOAL]"
proof_log: "Verification Log"
last_reviewed: "[YYYY-MM-DD]"
tracks:
  - current_state
  - next_tasks
  - blockers
  - verification
---

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

Work top to bottom. Tick a box only once its proof exists (a Verification Log row or a named manual check). This list is the live progress ledger — keep it accurate across the session, especially after a context summary.

- [ ] **[Task name]** - [specific outcome]. Proof: `[COMMAND_OR_CHECK]`.
- [ ] **[Task name]** - [specific outcome]. Proof: `[COMMAND_OR_CHECK]`.
- [ ] **[Task name]** - [specific outcome]. Proof: `[COMMAND_OR_CHECK]`.

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
Each proof cell should include the command or named manual check, exit code or
observed result, artifact/log/trace path when available, and coverage scope.

| Date | Task | Proof | Result | Remaining gap |
|---|---|---|---|---|
| [YYYY-MM-DD] | [task] | `[command]` or manual check; exit/result: [code/result]; artifact/trace: [path or n/a]; coverage: [scope] | [pass/fail] | [none/gap] |
| 2026-07-01 | Add structured metadata, Claude bridge, prompt-injection guardrails, and measurable benchmark criteria | `node tools/test-evaluate-workbench.mjs` red failed before the new rubric existed with "structured metadata should be present"; `node tools/test-evaluate-workbench.mjs`; `node tools/test-context-tools.mjs`; `node tools/test-outcome-trials.mjs`; `node tools/evaluate-workbench.mjs --path . --include-controls`; exit/result: pass; artifact/trace: n/a; coverage: evaluator, context tools, outcome trial harness, static benchmark rubric | pass; local 124/124, no-template 0/124, single-instruction control 2/124 | Real-agent task trials remain the next causal proof step. |
| 2026-06-26 | Add meaningful test coverage policy to the workbench runbook and rubric | `node tools/test-evaluate-workbench.mjs` red failed before the `RUNBOOK.md` policy; `node tools/test-evaluate-workbench.mjs`; `node tools/test-context-tools.mjs`; `node tools/test-outcome-trials.mjs`; `node tools/evaluate-workbench.mjs --path . --include-controls` | pass; local workbench 100/100, no-template 0/100, single-instruction control 2/100 | Real-agent outcome trials remain the next causal proof step; docs updated in `RUNBOOK.md` and `benchmarks/RESULTS.md`. |
