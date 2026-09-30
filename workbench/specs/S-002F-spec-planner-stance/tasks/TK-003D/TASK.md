# TK-003D - Ship the spec-planner core entry with its bundle proof

**Task ID:** TK-003D
**Spec ID:** S-002F
**Slice:** Ship the spec-planner core entry with its bundle proof
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Source behavior, templates, discovery and managed installation agree; named verification and remaining limitations are recorded without claiming owner approval.
**Planned verification:** Red: a new `spec-planner` pin in `tools/test-skill-catalog.mjs` fails at the base because `workbench/skills/spec-planner/SKILL.md` does not exist and `coreSkills` in `workbench/tools/workbench-layout.mjs` does not name it. Green: the entry ships in the lane, `coreSkills` and `workbench/manifest.json` `skillPolicy.required` name it immediately before `builder`, the `workbench/skills/README.md` catalog row and bundle sentence and every prose count the test derives agree, and `test-skill-catalog`, `test-workbench-layout`, `test-core-skill-installer`, `test-skills-lane`, `test-skill-inspection` and `test-delivery-skills` pass; then the full AGENTS suite on the committed candidate.
**Proof:** Red 9e55735f (attempt 1, cherry-picked from 74cd3b30): tools/test-skill-catalog.mjs exits 1 with 'spec-planner must be a declared core skill', re-observed by attempt 2. Green 7c9f675e (attempt 1, from 5620ff83) reconciled to the S-002D convention in 3cad77df: test-skill-catalog, test-workbench-layout, test-core-skill-installer, test-skills-lane, test-skill-inspection, test-delivery-skills and test-control-fidelity exit 0; doctor no blocking finding; full AGENTS suite 48/48 at 3cad77df (F-tk003d-3cad77d.log, dirty [])

## Outcome

A fresh clone of integration discovers `workbench/skills/spec-planner/SKILL.md`
through both discovery adapters, the manifest, the catalog and the layout
bundle, and the suite proves the bundle grew by exactly this entry. The skill
text is the operating contract for the Spec Planner stance: the job a
Dispatcher performs at flight launch, composed with the Dispatcher role that
already supplies scope and dispatch responsibility.

## Required Behavior

- `workbench/skills/spec-planner/SKILL.md` carries `name: spec-planner`
  frontmatter and the four stance sections `Purpose`, `Method / Posture`,
  `Obligations` and `Completion / Exit Condition`, plus the shared authority
  sentences the four portable stances carry ("never grants, removes, or
  transfers authority", "never spawns", "assigned SPEC and TASK"), per
  `AGENTS.md` Assigned Work And Stances and ADR-0036.
- The text states, from the accepted sources only (LEXICON Spec Planner and
  Dispatcher rows, AGENTS Assigned Work And Stances and Git Rules, RUNBOOK
  Role And Stance Coordination, ADR-000P, the role model article and ledger
  ROLE-1 to ROLE-4): plan only for the one assigned Spec at flight launch or
  activation, after inspecting live source, accepted requirements, remaining
  gaps and dependencies; cut small complete-path vertical slices with explicit
  acceptance, proof, dependencies and one named writer per shared file, and
  say which groups may run concurrently; Workers may help author Tasks and
  the Dispatcher reconciles their drafts as the single Spec writer, keeping a
  proposed Task distinct from an executable assignment; hand the plan and its
  open gates to Spec Manager; surface cross-Spec dependencies to the Director
  instead of enlarging the Spec or duplicating another lane; never enumerate
  execution Tasks when merely authoring a planned Spec.
- IDs come from `next-id`, never by hand; activation uses `convert-tasks
  --activate` once; the Task record shape is the `to-tasks` shape. Name the
  Spec Manager stance and the sibling role capabilities by their Spec paths
  (`workbench/specs/S-002G-spec-manager-stance/SPEC.md`,
  `workbench/specs/S-002D-dispatcher-role/SPEC.md`); do not reference a
  skill that is not in the lane by backticked slash command or `name` skill
  form, because `tools/test-skills-lane.mjs` fails on an unrecorded reference.
- `workbench/tools/workbench-layout.mjs` grows `coreSkills` with
  `'spec-planner'` immediately before `...stanceSkills`; `stanceSkills` stays
  the four portable stances. Every frozen legacy row stays byte-identical.
- `workbench/manifest.json` `skillPolicy.required` mirrors the layout order.
- `workbench/skills/README.md` gains one catalog row and its bundle sentence
  states the true count with a category breakdown that names the coordination
  stance separately from the four portable stances. The prose counts
  `tools/test-skill-catalog.mjs` derives (`README.md`, `RUNBOOK.md`,
  `LEXICON.md`, `templates/GENESIS.md`) change by the number only; those root
  controls are otherwise out of this lane and any further wording is routed to
  S-00P through the Spec's remaining gap.
- `tools/test-skill-catalog.mjs` pins the new entry (sections, authority
  sentences, the complete-path, single-writer, proposed-versus-executable,
  Spec Manager hand-off and Director escalation wording) and derives the
  count words so a later bundle change fails there. No test weakens.

## Done Criteria And Closing Proof

- Red observed and quoted at the base, green observed at the candidate, both
  with commands and SHAs.
- Targeted tests named above pass; the full AGENTS suite passes on the
  committed candidate with the log's first line naming that SHA and
  `dirty: []`.
- Hand back to the Dispatcher: exact SHA, red/green text, suite tally and log
  path, docs status and remaining gap. The Worker does not close the Task,
  edit `SPEC.md`, `TASK.md` or the projections, and never approves its own
  candidate.

## Remaining Gaps

- Cross-links among the four role/stance skills are added by the last lane
  to land (S-002G); this Task links only to files on integration.
- Root-control count edits beyond the number, and any control wording the
  stance needs, route to S-00P.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s-002f-spec-planner-stance-r2 | 00a45ba2e542dbfc7e75a5a49a5544f552e4adbb | ahead 0 behind 0 | 0 | Red 9e55735f (attempt 1, cherry-picked from 74cd3b30): tools/test-skill-catalog.mjs exits 1 with 'spec-planner must be a declared core skill', re-observed by attempt 2. Green 7c9f675e (attempt 1, from 5620ff83) reconciled to the S-002D convention in 3cad77df: test-skill-catalog, test-workbench-layout, test-core-skill-installer, test-skills-lane, test-skill-inspection, test-delivery-skills and test-control-fidelity exit 0; doctor no blocking finding; full AGENTS suite 48/48 at 3cad77df (F-tk003d-3cad77d.log, dirty []) | workbench/skills/spec-planner/SKILL.md; workbench/skills/README.md row and 24-skill bundle sentence; manifest skillPolicy.required; workbench-layout coordinationSkills; pinned counts in README.md, RUNBOOK.md, LEXICON.md Core skill bundle row, templates/GENESIS.md and workbench/wiki/skill-genesis.md | Root-control wording beyond the pinned counts routed to S-00P; references to the Dispatcher role and Spec Manager stance by repository Spec path routed to S-002G; attempt-1 branch claude/s-002f-tk-002x is patch-contained but not an ancestor | e83e011d78df1bbd21bbe102ffee32512456cb23b51becde2e8f90a10e0ea473 |
