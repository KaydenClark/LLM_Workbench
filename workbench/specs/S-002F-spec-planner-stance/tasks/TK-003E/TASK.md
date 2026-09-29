# TK-003E - Route the spec-planner article from the Wiki router

**Task ID:** TK-003E
**Spec ID:** S-002F
**Slice:** Route the spec-planner article from the Wiki router
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: A fresh agent from integration can discover the operating entry and its individual Wiki article, identify scope, inputs, outputs, hand-back and escalation, and perform the scenario below without private notes.
**Planned verification:** `node workbench/tools/wiki.mjs validate` reports ok with the new article and router line; `node tools/test-wiki.mjs` and `node tools/test-control-fidelity.mjs` pass; every link in the article resolves on `origin/integration` or names a sibling capability by its Spec path; the article's "Verified behavior and limits" section is written last, after the TK-003D source is final and TK-003F's scenario has run, and the Dispatcher reconciles it before close.

## Outcome

`workbench/wiki/skill-spec-planner.md` explains the Spec Planner stance for a
reader who has never seen this chat: what job it performs, inside which role
scope, its inputs, its outputs, what it hands to Spec Manager and what it
escalates to the Director. `workbench/wiki/MEMORY.md` routes to it from the
"Roles And Stances" section. The article is curated knowledge, not copied Task
state and not a second Spec.

## Required Behavior

- Frontmatter follows `workbench/wiki/SCHEMA.md` and the shape of
  `workbench/wiki/skill-auditor.md`: `type: memory`, `status: active`,
  `sensitivity: normal`, `knowledge_role: curated`, `provenance`,
  `source_paths` (the skill source, this Spec, the catalog test, `LEXICON.md`,
  ADR-000P, ADR-0036, the role model article), `last_verified`.
- Sections in the auditor article's order: a one-paragraph opener naming when
  to use the stance; a bold Inputs / Output / Done when paragraph; "How it
  works" with the composition rule (role supplies scope and dispatch
  responsibility, stance supplies method and obligations; loading it changes
  method only, per ADR-0036 and ADR-000P) and the planning method (inspect
  live Actuality first, complete-path vertical slices, one named writer per
  shared file, concurrency groups, proposed versus executable Task, hand-off
  to Spec Manager, cross-Spec dependencies to the Director, no Tasks for a
  merely planned Spec); a worked example drawn from the TK-003F scenario once
  it has run; "Composition" (with `to-tasks`, `tracer-bullet`, the Dispatcher
  role and Spec Manager stance by Spec path); "Verified behavior and limits";
  "Sources"; "History".
- Router: one line under `## Roles And Stances` in `workbench/wiki/MEMORY.md`
  after the existing role-model line, in the section's existing style. Do not
  add counts to the router.
- Links point only at files that exist on `origin/integration` at landing
  time; sibling capabilities that have not landed are named by Spec path
  (`workbench/specs/S-002D-dispatcher-role/SPEC.md`,
  `workbench/specs/S-002G-spec-manager-stance/SPEC.md`). The article claims no
  owner approval and no agent-outcome improvement.
- `templates/wiki/` is not touched: the generic router templates carry no
  per-skill rows (`git grep skill-auditor templates/wiki` is empty at the
  base), so there is no mirror to update; record that check.

## Done Criteria And Closing Proof

- `wiki.mjs validate` ok, `test-wiki` and `test-control-fidelity` green,
  `git diff --check` clean, link check recorded (each relative link resolved
  with `test -e` from the article's directory).
- Hand back to the Dispatcher: exact SHA, validation output, link check, docs
  status and remaining gap (the "Verified behavior and limits" and example
  sections await TK-003F). The Worker does not close the Task, edit `SPEC.md`,
  `TASK.md` or the projections, and never approves its own candidate.

## Remaining Gaps

- The scenario-derived example and verified-behavior section are reconciled by
  the Dispatcher after TK-003F; the Dispatcher is the single writer of the
  final article text at close.
- Cross-links among the four role/stance articles are added by the last lane
  to land (S-002G).
