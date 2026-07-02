# [PROJECT_NAME] - Agent Instructions

> Generated from LLM Workbench v[HARNESS_VERSION]. To pull later harness
> improvements into this project, see `RUNBOOK.md` -> Upgrading The Harness.

This file controls how agents behave in this project. It should answer four
questions quickly:

1. What can the agent read?
2. What can the agent edit?
3. How should the agent choose work?
4. Where is the proof that the work is done?

## Authority Order

When instructions conflict, use this order:

1. Current user request.
2. This `AGENTS.md`.
3. Source code and tests, verified live.
4. `BLUEPRINT.md`.
5. `TASKBOARD.md`.
6. `RUNBOOK.md`.
7. `README.md` and older handoff notes.

If docs and code disagree, trust verified code, flag the drift, and update the
stale doc when the task touches that area.

## Read Scope

The agent may read:

- this project root;
- source, tests, configs, scripts, docs, and logs needed for the current task;
- dependency manifests and lockfiles;
- generated output only when debugging build, runtime, or verification behavior;
- external paths only when the user request or project docs explicitly reference
  them.

The agent must not read secrets, credentials, tokens, local databases, raw
personal data, or unrelated projects unless the current task requires it and the
source is explicitly in scope.

## Edit Scope

The agent may edit:

**Fill in these paths before use. This section answers nothing until they are set.**

- `[PRIMARY_SOURCE_DIRS]`
- `[TEST_DIRS]`
- `[DOCS_TO_KEEP_CURRENT]`
- dependency manifests and lockfiles only when a dependency change is necessary
  and explained.

The agent must not edit:

- `[OUT_OF_SCOPE_DIRS_OR_REPOS]`
- secrets, credentials, OAuth tokens, local databases, raw personal data,
  generated build output, dependency folders, or unrelated projects;
- architecture, product direction, or persistence model unless the user asks for
  that or the current approach is blocking correctness.

If the correct change requires leaving scope, stop and explain the smallest
needed scope expansion.

## Work Selection

Default loop:

1. Read `BLUEPRINT.md` to understand the project purpose, constraints, and
   long-term direction.
2. Read `TASKBOARD.md` to choose the next concrete task.
3. Pick the highest-priority `ready` task that is in scope and unclaimed.
4. Mark it `claimed` or `in-progress` before editing.
5. Do the smallest correct change.
6. Verify it with the proof required by the task and `RUNBOOK.md`.
7. Update `TASKBOARD.md` with the result, documentation status, and remaining
   gaps.

Do not invent a different next task while `TASKBOARD.md` has a valid `ready`
item unless the user explicitly redirects you.

If a task is blocked, move it to the `Blocked` lane with the concrete blocker
and next action. If a blocker becomes strategic product or architecture risk,
summarize that stable risk in `BLUEPRINT.md`.

## Agent Job

Maintain and improve this project without changing its purpose.

Default responsibilities:

- restate the selected task goal in one sentence;
- read relevant docs and code before editing;
- make the smallest correct change;
- preserve existing architecture, naming, and style;
- validate inputs at boundaries;
- use explicit error handling and visible empty/error states;
- update any project docs that would become stale because of the change;
- write exploratory or scratch notes only in the final response, `TASKBOARD.md`,
  or a project-approved notes area;
- leave the project easier for the next agent to verify.

## Documentation Ownership

Documentation is part of the work, not a follow-up role. Unless the current task
explicitly assigns a separate documentation owner, the agent making the change
owns the documentation for that change.

Use this routing when deciding what to update:

| Change type | Documentation to check |
|---|---|
| Purpose, product behavior, architecture, data model, routes, invariants, safety boundary | `BLUEPRINT.md` |
| Current work queue, blockers, deferred work, task proof, handoff state | `TASKBOARD.md` |
| Setup, install, run, test, build, deploy, recovery, environment, operations, evaluation procedure | `RUNBOOK.md` |
| User-facing setup, usage, demo, handoff, public instructions | `README.md` |
| Agent rules, scope, authority, verification contract | `AGENTS.md` |

If no docs need edits, record `Docs checked; no update needed` in the final
response and in the relevant `TASKBOARD.md` proof row, with a short reason.

## Verification And Proof

For behavior changes, use red/green/refactor when the stack supports it:

1. Define the expected behavior.
2. Add or update a failing test.
3. Run the test and confirm it fails for the expected reason.
4. Implement the smallest change.
5. Run the targeted test.
6. Run the full verification suite from `RUNBOOK.md` when the task is complete.

If tests are impractical, run a concrete manual check instead and name the
specific reason, such as "no test harness for this UI interaction" or
"credential unavailable in this session."

Every completed task leaves proof in two places:

- Final response: what changed, why, risks, and how verified.
- `TASKBOARD.md` proof log: one row with actual results, not stale claims.

Use command results, browser checks, API probes, screenshots, run reports, or
documented manual checks. Do not claim code or docs are verified unless the
check actually ran.

Milestone tasks are not accepted on passing tests alone. A milestone task must
also produce a demo artifact the owner can check in under a minute - a
screenshot, a short recording, a preview URL, or a one-command demo - recorded
in the `TASKBOARD.md` proof log's Demo column. Tests prove the code runs; the
demo proves the product does what the owner asked.

## Long Session Control

Long sessions drift. Counter it deliberately:

- Re-read `BLUEPRINT.md` and `TASKBOARD.md` after any context summary or long
  interruption.
- Keep task statuses current as work changes state.
- Tick or move a task only once its proof exists.
- Append proof rows; do not rewrite existing proof history.
- If the same verification fails twice and the next step is not clearly safe,
  stop, record the blocker, and surface the decision needed.

**Reclaiming stale claims.** A `claimed` or `in-progress` task whose `Last
update` is older than `[STALE_THRESHOLD]` (default: one working day) with no
committed progress is stale and may be reclaimed. To reclaim: confirm no branch
or commit is advancing it, note the reclaim in the task's `Current note` with the
date, then either take it over or move it back to `ready`. Never silently discard
a prior agent's committed work - if a branch exists, continue from it or record
why you are not.

## Visual And Asset Work

Do not force a shared visual style from this template. Use the project prompt,
project-local design docs, screenshots, brand requirements, and audience context.

When visual work needs assets:

- search for license-safe free assets before drawing or kitbashing locally;
- record source URL, license, author, and attribution requirements when assets
  are added;
- avoid emoji as interface icons when a real icon, symbol, or text label can do
  the job.

## When To Ask, Proceed, Or Stop

- Proceed without asking on low-risk, reversible decisions inside scope.
- Ask one focused question when a missing answer changes architecture, data
  model, public contract, safety boundary, or destructive risk.
- Stop and surface rather than retrying indefinitely after repeated verification
  failure or unclear scope expansion.

Escalations to the owner are phrased as product tradeoffs, not tool- or
code-level failures. Give the options, a recommendation, and the cost of each
path, and record the open decision in `TASKBOARD.md` -> Pending Decisions. The
owner should be able to choose without reading code; translate any technical
blocker into the product or timeline choice it forces.

## Day-One Checklist

Load only what the task requires:

- Quick task: read `BLUEPRINT.md` summary and the relevant `TASKBOARD.md` item.
- Feature, refactor, or unknown-scope bug: read `BLUEPRINT.md`, `TASKBOARD.md`,
  and relevant code/tests.
- Onboarding, setup, or operations work: read `BLUEPRINT.md`, `TASKBOARD.md`,
  and `RUNBOOK.md`.
- Any task that runs verification: also open `RUNBOOK.md` -> Test And Build.

Then for every task:

1. Inspect the files relevant to the task.
2. Check version-control status when available.
3. Run baseline verification when practical.
4. Implement with tests or a named manual check.
5. Update docs and append a `TASKBOARD.md` proof row.

## Output Format

For all task completions, report:

1. What changed.
2. Why it changed.
3. Risks or side effects.
4. How it was verified.

Keep the response concise. Flag uncertainty instead of hiding it.

## What Not To Do

- Do not invent APIs, files, functions, behavior, or test results.
- Do not rewrite working systems just to make them cleaner.
- Do not broaden scope without a concrete reason.
- Do not add paid services unless the user explicitly approves them.
- Do not leave unexplained TODOs or placeholder logic.
- Do not treat prior session notes or taskboard history as current truth without
  verifying source state.
- Do not rewrite existing `TASKBOARD.md` proof rows; append only.
