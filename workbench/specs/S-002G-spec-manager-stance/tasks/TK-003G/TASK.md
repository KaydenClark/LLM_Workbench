# TK-003G - Ship the spec-manager core skill entry with bundle, catalog and installer proof

**Task ID:** TK-003G
**Spec ID:** S-002G
**Slice:** Ship the spec-manager core skill entry with bundle, catalog and installer proof
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-002G Desired Behavior 1-5 stated as the operating contract of one discoverable core skill entry, and acceptance line 7 (source behavior, templates, discovery and managed installation agree)
**Planned verification:** Red: with the new contract assertions added to `tools/test-skill-catalog.mjs` before the source exists, `node tools/test-skill-catalog.mjs` fails naming the missing `spec-manager` entry; after `coreSkills` grows, the unchanged count-bearing documents and the frozen v3.2.1 row check in `tools/test-workbench-layout.mjs` fail. Green: `node tools/test-skill-catalog.mjs`, `node tools/test-workbench-layout.mjs`, `node --test tools/test-delivery-skills.mjs`, `node tools/test-core-skill-installer.mjs`, `node tools/test-skills-lane.mjs`, `node tools/test-cross-provider-fixture.mjs` and `node tools/test-skill-inspection.mjs` pass on the committed candidate, then the full AGENTS suite.

## Outcome

A fresh agent on integration discovers `workbench/skills/spec-manager/SKILL.md`
through the lane adapters and the core catalog, reads one operating contract
for the Spec Manager stance, and finds the bundle, catalog, count wording and
frozen-version rows in agreement. This is the source-entry slice; the routed
Wiki article is [TK-003H](../TK-003H/TASK.md) and the fresh-context scenario
plus assembled proof is [TK-003I](../TK-003I/TASK.md).

## Required Behavior

- `workbench/skills/spec-manager/SKILL.md` exists with frontmatter `name:
  spec-manager` and a one-line `description`, and the four stance sections
  `## Purpose`, `## Method / Posture`, `## Obligations`, `## Completion / Exit
  Condition`, carrying the shared stance authority sentences the delivery test
  holds every stance to ("never grants, removes, or transfers authority",
  "never spawns", "assigned SPEC and TASK").
- The contract states S-002G Desired Behavior 1-5 in operating terms: compose
  with an already assigned Dispatcher role and consume the Spec Planner result,
  live Task states, dependencies and branch scope (no second queue); dispatch
  Workers only to ready non-conflicting Tasks and release later work when its
  dependencies are actually satisfied; keep one durable writer for shared Spec,
  TASK and projection state and serialize conflicting edits while independent
  slices run concurrently; assess each hand-back (exact SHA, proof, docs status,
  remaining gap) and route corrective work; integrate Task merge requests into
  the Spec branch and arrange assembled-Spec verification through Reviewer or
  Auditor work; report the fixed immutable candidate, evidence and gaps to the
  Director; route cross-Spec issues to the Director; never claim independent
  approval of work managed in the same context.
- It names the reviewed unit generically (assembled Spec, `report S-###
  --candidate <sha>`, content digest, `verdict`, Task-PR exemption reported by
  `gate --task TK-### --spec S-###`) and must not name the room-specific
  release Spec id (the catalog test forbids `S-00O` in any core skill).
- Content sources: LEXICON Role and Stance rows, AGENTS "Assigned Work And
  Stances" and "Git Rules", RUNBOOK "Role And Stance Coordination",
  ADR-000P, `workbench/wiki/design-concepts/roles-and-stances.md`, ledger rows
  ROLE-1..ROLE-4. Import no model allocation, scheduling, department or
  external-repository prerequisite.
- Bundle wiring, one writer for these shared files (the Dispatcher lane):
  `workbench/tools/workbench-layout.mjs` `coreSkills` gains `spec-manager`
  immediately before the four portable stances, so every `slice(-4)` stance
  read stays exact and `stanceSkills` is unchanged; `workbench/manifest.json`
  `skillPolicy.required` mirrors it; `workbench/skills/README.md` gains the
  table row and its bundle sentence states the true count with a category
  breakdown that names coordination stances separately from the four portable
  stances; the count-bearing sentences the catalog test holds (`README.md`,
  `RUNBOOK.md`, `templates/GENESIS.md`, and `LEXICON.md` "Core skill bundle")
  state the true bundle; `tools/test-skill-catalog.mjs` derives the workflow
  count from the bundle minus the coordination stances and the four portable
  stances and pins the spec-manager contract terms; `tools/test-workbench-
  layout.mjs` keeps the frozen v3.2.1 twenty-one-skill row exact by filtering
  the grown names.
- Cross-link pass for the shipped entries (Dispatcher assignment 2026-09-30,
  after S-002C, S-002D and S-002F landed on integration): an installed room
  has no repository Spec paths, so no role or stance entry among `director`,
  `dispatcher`, `spec-planner` and `spec-manager` cites
  `workbench/specs/S-002?-*/SPEC.md`. The `dispatcher` and `spec-planner`
  entries' Spec-path references to their siblings become the landed skill
  names; the Worker stays the LEXICON term. Link-only: no behavior claim in
  another Spec's entry changes, and the catalog pins that held those Spec
  paths move to the skill names.

## Boundaries

- One Spec, one skill wide. Do not touch S-002C, S-002D, S-002E or S-002F
  Spec or Task records. The only edit to a sibling's shipped entry is the
  link-only cross-link pass above. The sibling skills landed before this one
  (integration `ac6fadbc`); conform to their shared-file convention.
- Root controls: edit only the count-bearing sentences the suite holds, one
  number or one category clause each, and record them in the Spec evidence.
  Any other AGENTS/RUNBOOK/LEXICON/BLUEPRINT wording is a remaining gap routed
  to S-00P.
- Loading the skill spawns nothing; role scope composes with stance; a
  Dispatcher or Worker never approves its own candidate (ADR-0036, ADR-000P).

## Done Criteria And Closing Proof

- Red then green at the catalog and layout seams as planned above, with the
  failing assertion text and the green commands recorded.
- Targeted tests green, then the full AGENTS suite green on the committed
  candidate (log path and first-line SHA with `dirty: []` recorded).
- Docs status names every changed document and why; remaining gaps name the
  Wiki article, scenario and any S-00P wording.
