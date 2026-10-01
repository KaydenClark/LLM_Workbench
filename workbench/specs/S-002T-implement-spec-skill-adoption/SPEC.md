# S-002T - implement-spec skill adoption

**Spec ID:** S-002T
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Decide whether the Workbench needs a skill that implements one whole Spec, and if so deliver it with an aligned draft-wiki article.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

The draft article, the comparison with Matt Pocock's `engineering/implement-spec`, and the skill source (or the decision not to add one) all describe one behavior. The owner adopted this skill on 2026-09-30 (decision 4: it was a "skip" and is now adopted). This Spec owns the investigation of what we already have, the finding-driven decision on whether `implement-spec` is a distinct skill or folds into an existing one, the draft article, and, only if a distinct skill is justified, its creation.

## Why It Matters

The owner wants the draft wiki to expose skills that should connect and do not, and skills that connect and do not work together. A newly adopted skill whose job resembles four existing skills is exactly that test. Without an overlap check first, the Workbench could add a fifth way to implement a Spec, or adopt a name that duplicates a shipped one.

## Current Verified State

Read at the anchors above. There is no source for `implement-spec` anywhere in the repository: a grep of tracked Markdown and JSON files finds no mention. It has no Spec, Wiki article or manifest entry. Matt's counterpart has not been read; that is step 3.

The nearest Workbench skills, each in `workbench/skills/`:

- `spec-manager/SKILL.md` (S-002G, active): a stance for a Dispatcher who dispatches Workers to the Tasks of one Spec and integrates proven results into the Spec branch. It names the Spec as its scope but works through Workers, not directly. The inventory marks it Matt-nearest. Its Wiki article is `workbench/wiki/skill-spec-manager.md`.
- `implement/SKILL.md` (S-01H, planned rebuild): implements one eligible Task, not a Spec, through red/green, a remotely verified checkpoint and close. One invocation owns one Task and one writer.
- `carry/SKILL.md` (S-01C, planned rebuild): carries an assigned Spec or a named Task to its already-authorized endpoint, composing `/implement`, `/tracer-bullet`, `/to-docs` and `/code-review`, and records each owner hand-back. A task-scoped invocation stops at that Task.
- `dispatcher/SKILL.md` (S-002D, active): the role scoped to one Spec and its branch, which composes the `spec-planner` and `spec-manager` stances. Its Wiki article is `workbench/wiki/skill-dispatcher.md`.

`implement` and `carry` have no skill article yet; `spec-manager` and `dispatcher` do. Whether `implement-spec` would be a fifth route or a name for one already covered is an open question for step 1, not decided here.

## Desired Behavior

1. Step 1 records, at a named commit, what each nearest skill takes in, writes, and composes with, and where it overlaps a "whole Spec" implementer. Overlaps are logged as `overlap` findings and gaps as `gap` findings.
2. The draft article for `implement-spec` exists in the draft wiki and answers every Template 2 section. If the skill folds into another, the article records that outcome and names the owner it folds into, as the `to-tickets` retirement note does in S-01L's amendment.
3. A decision is recorded (see Decisions And Contracts) and the skill source, the article and the catalog agree with it.

## Decisions And Contracts

- This Spec does not prejudge the outcome. Distinct skill, fold into `spec-manager`, `implement`, `carry` or `dispatcher`, or retirement of the name are all open until the step 4 comparison and the step 5 findings support one. The decision is made in this Spec's evidence, not by the draft article alone.
- Where an existing skill's own Spec owns the change (S-002G, S-01H, S-01C, S-002D), this Spec records the finding and hands the edit to that owner rather than editing it.
- Authorization for a new skill's lane. New adopted skills default to Pending (owner decision 1 of 2026-09-30), so step 6 would create the skill under `skills-pending/implement-spec/` unless findings justify another lane. `skills-pending/` is not listed in AGENTS.md Edit Scope, so that edit is authorized only by the owner's 2026-09-30 adoption decisions together with the per-item rule in `workbench/specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md`. The activating Task must name that authority and have the Director confirm it before creating the directory. Promotion to Core is separate: it needs its own owner decision and the Core-bundle touchpoints, and is not part of this Spec.
- The article is curated context, not instruction authority or proof of behavior. Matt's skill is outside evidence, adopted only as far as the owner's decision reaches.
- Steps 1-5 touch only the draft wiki. Step 6 is the only step that touches a skill lane.

## Non-Goals

- Editing `spec-manager`, `implement`, `carry` or `dispatcher`, or any other skill's source.
- Adding a scheduler, a coordination layer or a second queue.
- Reproducing Matt's skill text or articles beyond short cited summaries.
- Promoting the skill to Core, or moving, archiving or installing any other skill.
- Answering Q2A (where `wayfinder` stores pre-Spec decisions) or touching `grill-with-docs`.

## Dependencies And Blockers

- **S-002L Skills draft wiki collection** must deliver the draft-wiki location and article template before steps 2-5. Until then the article location below is tentative.
- Step 1 depends on the current source and tests of the four neighbors above. Their Specs are not blockers, but a rebuild landing mid-investigation changes what step 1 recorded, so step 1 names its commit.
- Step 6 depends on the decision from steps 4-5 and on the authorization named under Decisions And Contracts.

## Vertical Implementation Slices

No Task is cut yet. Tasks are cut at activation from live Actuality with `/to-tasks`. Intended slice direction, in prose:

1. Investigate ours. Read `spec-manager`, `implement`, `carry` and `dispatcher` and their tests at a named commit, since no `implement-spec` source exists. Record inputs, outputs, writes and composition, the overlap with a whole-Spec implementer, and the true `origin`.
2. Draft the article from Template 2 (owned by S-002L) at `workbench/wiki/skills-draft/main-workflow/implement-spec.md`, tentative until S-002L decides.
3. Investigate Matt's. Read `engineering/implement-spec` in `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`.
4. Compare. Fill "Compared with Matt's", with `spec-manager` as the Workbench side per the inventory, and log findings, expecting `overlap` entries against `implement` and `carry`.
5. Align the article until its wording matches real or intended behavior, record the distinct-or-fold decision and log what is left.
6. Fix or create the skill. If a distinct skill is justified, add `SKILL.md` in the authorized lane with catalog tests and a fresh-context scenario. If it folds, the work is the finding, the retirement or alias note and the owner Spec's handoff, with no new skill source.

## Acceptance Criteria

- [ ] Step 1 records the four neighbor skills' inputs, outputs, writes and composition at a named commit, with each overlap logged as an `overlap` finding.
- [ ] The draft article fills every Template 2 section; every "needs" and "reads/writes" item resolves to something real or is a finding.
- [ ] The comparison with `engineering/implement-spec` at the d81f3a1 pin is recorded with a verdict (same, close, divergent or missing).
- [ ] The distinct-or-fold decision is recorded with its supporting findings and the owner Spec for any change to an existing skill.
- [ ] The skill source, or the recorded decision not to add one, matches the article, and the named authorization for any `skills-pending/` edit is cited.
- [ ] Suites required by AGENTS.md pass for step 6, and no unrun check is reported as passing.

## Testing Seams

Steps 1-5 are documentation: read-back of each article claim against source, and the draft wiki's own validation once S-002L defines it. Step 6, if it creates a skill, uses the catalog and skill-inspection tests plus a fresh-context scenario in which a cold agent is asked to implement one whole Spec and must choose between this skill and the existing neighbors without private notes. Structural checks prove routing, not agent behavior.

## Verification Procedure

At activation, the Task records the exact commands it runs. For step 6 that is the targeted catalog and inspection tests, `node workbench/tools/spec-workbench.mjs render` and `doctor`, and the full suite in AGENTS.md from a committed candidate, with the self-drift pre/post receipts. Steps 1-5 need the draft-wiki validation S-002L delivers. The immutable candidate gets a separate-context review before integration.

## Documentation Impact

The draft article at `workbench/wiki/skills-draft/main-workflow/implement-spec.md` (tentative until S-002L decides). Step 6 may touch the new skill's `SKILL.md` under `skills-pending/implement-spec/` and, if the skill folds into a neighbor, a retirement or alias note in that neighbor's owning Spec. It touches no Core-bundle control, since this Spec does not promote the skill.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; planning only | Read `spec-manager`, `implement`, `carry` and `dispatcher` sources at the pre anchor; confirmed no `implement-spec` source or Spec exists; Matt's skill not read | This Spec authored; no skill, article, manifest or test changed | S-002L, activation, Tasks and all implementation remain open; distinct-or-fold decision not made |

## Completion Result

Not complete.

## Supersession

None.
