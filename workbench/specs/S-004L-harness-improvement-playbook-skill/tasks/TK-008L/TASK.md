# TK-008L - Ship the improve-harness skill in the closed core bundle

**Task ID:** TK-008L
**Spec ID:** S-004L
**Slice:** Ship the improve-harness skill in the closed core bundle
**Status:** ready
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: The one skill exists in the lane, its loop has six named steps each with a checkable artifact, and a scenario in a fixture room runs it end to end.
**Planned verification:** Red: `tools/test-skill-catalog.mjs` pins `improve-harness` (declared core entry after `workbench-runtime`, contract sections, six numbered loop steps each naming its artifact, a result-record section, no repository Spec path, maintainer test command or private path) and `tools/test-skills-lane.mjs` expects the update route to lay `improve-harness` into a room that lacks it while leaving the room's own skill untouched; both fail at the committed pre-change tree. Green: the skill and the bundle change (layout catalog, manifest, skills README catalog and count, README, LEXICON, templates/GENESIS, workbench-room-checks count, layout-test filters) make them pass; `test-core-skill-installer`, `test-workbench-upgrade`, `test-workbench-layout`, `test-runbook-index` and the full suite pass on the committed candidate; guardrail baseline captured before and after.

## Outcome

One core skill, `workbench/skills/improve-harness/SKILL.md`, carries the
baseline-to-rerun loop in the Workbench's own words: baseline, earliest gap,
smallest owning intervention, native verification, fresh rerun, then retain,
revise or remove, each step naming its checkable artifact. It keeps the
read-only posture of a review until a change is authorized, classifies each
claim by its Governance Plane (Canon, Grounding, Actuality) and writes the
lesson into the append-only feedback record. It joins the closed core bundle
(27 to 28 skills) exactly as `workbench-runtime` did, so the catalog, the
install receipt and the update route follow and a room updated from this
version gains it.

## Scope

- `workbench/skills/improve-harness/SKILL.md` (new).
- `workbench/tools/workbench-layout.mjs` (`coreSkills` after `workbench-runtime`),
  `workbench/manifest.json` (`skillPolicy.required`), `workbench/skills/README.md`
  (catalog row and count), `README.md`, `LEXICON.md` (bundle count only),
  `templates/GENESIS.md`, `workbench/skills/workbench-room-checks/SKILL.md`
  (count sentence).
- Tests: `tools/test-skill-catalog.mjs`, `tools/test-skills-lane.mjs`,
  `tools/test-workbench-layout.mjs` (frozen-row filters).

## Acceptance

- [ ] The skill ships in the lane with six named loop steps, each with a
      checkable artifact, and a result-record shape.
- [ ] The core catalog, every count statement, the manifest policy and the
      layout catalog agree on 28 skills; the closed-bundle checks pass.
- [ ] The update route installs the skill into a room that lacks it without
      touching the room's own skill.

## Boundaries

The loop's shape is Ryan Lopopolo's improve-harness playbook (CC BY 4.0),
attributed through the Wiki lineage page; the skill copies nothing. No
Runbook row, Wiki page, feedback format, eval or other skill changes here.
No version label is stamped: the release owner holds version, Template and
owner gates.
