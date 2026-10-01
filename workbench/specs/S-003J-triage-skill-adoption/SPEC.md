# S-003J - triage skill adoption

**Spec ID:** S-003J
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Decide whether the Workbench needs a skill that triages incoming reports into authorized work, and if so deliver it with an aligned draft-wiki article.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

The draft article, the comparison with Matt Pocock's `engineering/triage`, and the skill source (or the decision not to add one) all describe one behavior. The owner adopted this skill on 2026-09-30 (decision 4: it was a "skip" and is now adopted). Group: upkeep. This Spec owns the investigation of how the Workbench already turns a finding into work, the draft article, the finding-driven decision on whether `triage` is a distinct skill or maps onto existing owners, and, only if a distinct skill is justified, its creation.

## Why It Matters

The owner wants the draft wiki to expose skills that should connect and do not. Matt's `triage` works an issue tracker. The Workbench has no obvious tracker: findings land in the feedback lane, `doctor` diagnostics, Spec evidence and the Taskboard projection, and `AGENTS.md` says a finding does not itself authorize new work. Adopting `triage` without first checking that gap could add a queue the Contract says not to manufacture, or leave the adopted name with nothing to triage.

## Current Verified State

Read at the anchors above. No `triage` skill exists in `workbench/skills/` or `skills-pending/`, and no Spec, Wiki article or manifest entry names one. Matt's counterpart has not been read; that is step 3. The nearest behavior the Workbench has today, each to be re-read in step 1:

- `workbench/tools/spec-workbench.mjs`: `doctor` reports registered findings and `next` selects one eligible ready Task. Findings carry a blocking effect (`all`, `selection`, `selected-slice`, `none`) registered in `workbench/tools/diagnostics.mjs` and described in RUNBOOK's "Diagnostics And Blocking Effects"; `none` findings stay visible without hiding work. This is selection and health reporting, not classification of incoming reports.
- RUNBOOK's "Harness Feedback Loop" says to "triage each" feedback row into a concrete capability Spec and activate one eligible slice. It is a one-line procedure step, not a skill. The feedback lane is `workbench/feedback/`, and LEXICON's "Feedback Dispositions" give every finding exactly one of `diagnostic`, `test`, `repaired`, `declined`, `accepted-open`, recorded in the owning Spec (S-00N, active).
- `skills-pending/diagnosing-bugs/SKILL.md` (S-003H) reproduces and root-causes one reported bug and enters repair only when authorized. It starts from a bug already chosen, not from a pile of reports.
- `AGENTS.md` Traverse, Don't Search: "A finding does not itself authorize new work." `AGENTS.md` Assigned Work And Stances: do not manufacture a next task or queue item.

Whether the Workbench has a tracker equivalent is not decided here. A `gap` or `conflict` finding is the likely step 1 result; whether anything else also fills the role (GitHub issues, the Taskboard, the Landmark Tracker, `workbench/feedback/`) is an open question for step 1. The Lexicon says the Taskboard "is not a second tracker" and the Landmark Tracker monitors documenting, so neither is assumed to be one.

## Desired Behavior

1. Step 1 records, at a named commit, what each nearest behavior takes in, writes and decides, where the Workbench turns a finding into work and where it deliberately does not, and the true `origin` of this skill. Missing pieces are logged as `gap`, tracker-versus-no-tracker tension as `conflict`, and any overlap with the feedback lane, `diagnosing-bugs` or `doctor` as `overlap`.
2. The draft article for `triage` exists in the draft wiki and answers every Template 2 section. "What it needs" and "What it reads and writes" name what a triaged item is and where its outcome is recorded; if nothing real resolves, each becomes a finding.
3. A decision is recorded (see Decisions And Contracts) and the skill source, the article and the catalog agree with it.

## Decisions And Contracts

- This Spec does not prejudge the outcome. A distinct `triage` skill over the feedback lane, an alias or fold into an existing owner, or retirement of the name are all open until the step 4 comparison and step 5 findings support one. The decision is made in this Spec's evidence, not by the draft article alone.
- This Spec records the tracker question and does not resolve it. It adds no issue tracker, queue, scheduler or second Taskboard, and it keeps `AGENTS.md`'s rule that a finding authorizes nothing by itself.
- Where an existing owner's change is needed (S-00N for dispositions, the diagnosing-bugs Spec S-003H, the RUNBOOK feedback loop), this Spec records the finding and hands the edit to that owner.
- Authorization for a new skill's lane. New adopted skills default to Pending (owner decision 1 of 2026-09-30), so step 6 would create the skill under `skills-pending/triage/` unless findings justify another lane. `skills-pending/` is not listed in `AGENTS.md` Edit Scope, so that edit is authorized only by the owner's 2026-09-30 adoption decisions together with the per-item rule in `workbench/specs/S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md`. S-00R has a live Codex lane; this Spec does not edit it. The activating Task must name that authority and have the Director confirm it before creating the directory. Promotion to Core is separate and not part of this Spec.
- The article is curated context, not instruction authority or proof of behavior. Matt's skill is outside evidence, adopted only as far as the owner's decision reaches.
- Steps 1-5 touch only the draft wiki. Step 6 is the only step that touches a skill lane.

## Non-Goals

- Creating an issue tracker, a queue, or any mechanism that turns a finding into authorized work on its own.
- Editing `diagnosing-bugs`, `spec-workbench.mjs`, the diagnostics registry, RUNBOOK, LEXICON or any other skill's source.
- Reproducing Matt's skill text or articles beyond short cited summaries.
- Promoting the skill to Core, or moving, archiving or installing any other skill.
- Answering Q2A (where `wayfinder` stores pre-Spec decisions) or touching `grill-with-docs`.

## Dependencies And Blockers

- **S-002L Skills draft wiki collection** must deliver the draft-wiki location and article template before steps 2-5. Until then the article location below is tentative.
- The diagnosing-bugs Spec (S-003H) is a neighbor, not a blocker; step 1 reads whatever exists of it and names its commit.
- Step 6 depends on the decision from steps 4-5 and on the authorization named under Decisions And Contracts.

## Vertical Implementation Slices

No Task is cut yet. Tasks are cut at activation from live Actuality with `/to-tasks`. Intended slice direction, in prose:

1. Investigate ours. No `triage` source exists, so read the nearest behavior at a named commit: `doctor` and `next` in `workbench/tools/spec-workbench.mjs` and RUNBOOK, the feedback lane and dispositions, the `diagnosing-bugs` skill, and the `AGENTS.md` rule that a finding does not itself authorize work. Record inputs, outputs, writes, composition and the true `origin`, and whether a tracker equivalent exists.
2. Draft the article from Template 2 (owned by S-002L) at `workbench/wiki/skills-draft/upkeep/triage.md`, tentative until S-002L decides.
3. Investigate Matt's. Read `engineering/triage` in `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`, noting what tracker or label scheme it assumes.
4. Compare. Fill "Compared with Matt's" with a verdict (same, close, divergent or missing) and log findings, expecting a `gap` or `conflict` on the tracker.
5. Align the article until its wording matches real or intended behavior, record the distinct-or-fold decision and log what is left.
6. Fix or create the skill. If a distinct skill is justified, add `SKILL.md` in the authorized lane with catalog tests and a fresh-context scenario. If not, the work is the finding, the alias or retirement note and the owning Spec's handoff, with no new skill source.

## Acceptance Criteria

- [ ] Step 1 records the nearest behaviors' inputs, outputs, writes and composition at a named commit, with the tracker question logged as a finding and not resolved.
- [ ] The draft article fills every Template 2 section; every "needs" and "reads/writes" item resolves to something real or is a finding.
- [ ] The comparison with `engineering/triage` at the d81f3a1 pin is recorded with a verdict (same, close, divergent or missing).
- [ ] The distinct-or-fold decision is recorded with its supporting findings and the owning Spec for any change to an existing owner.
- [ ] The skill source, or the recorded decision not to add one, matches the article, and the named authorization for any `skills-pending/` edit is cited.
- [ ] Suites required by `AGENTS.md` pass for step 6, and no unrun check is reported as passing.

## Testing Seams

Steps 1-5 are documentation: read-back of each article claim against source, and the draft wiki's own validation once S-002L defines it. Step 6, if it creates a skill, uses the catalog and skill-inspection tests plus a fresh-context scenario in which a cold agent is handed a mixed set of reports and must sort them into dispositions and owners without creating work no owner authorized. Structural checks prove routing, not agent behavior.

## Verification Procedure

At activation, the Task records the exact commands it runs. For step 6 that is the targeted catalog and inspection tests, `node workbench/tools/spec-workbench.mjs render` and `doctor`, and the full suite in `AGENTS.md` from a committed candidate, with the self-drift pre/post receipts. Steps 1-5 need the draft-wiki validation S-002L delivers. The immutable candidate gets a separate-context review before integration.

## Documentation Impact

The draft article at `workbench/wiki/skills-draft/upkeep/triage.md` (tentative until S-002L decides). Step 6 may touch the new skill's `SKILL.md` under `skills-pending/triage/` and, if the skill folds into an existing owner, an alias or retirement note in that owner's Spec. It touches no Core-bundle control, since this Spec does not promote the skill.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; planning only | Read `doctor` and `next`, RUNBOOK's feedback loop and diagnostics sections, LEXICON's feedback dispositions and `skills-pending/diagnosing-bugs/SKILL.md` at the pre anchor; confirmed no `triage` source or Spec exists; Matt's skill not read | This Spec authored; no skill, article, manifest or test changed | S-002L, activation, Tasks and all implementation remain open; tracker equivalent and distinct-or-fold decision not made |

## Completion Result

Not complete.

## Supersession

None.
