# S-004X - Adding A Required Core Skill

**Spec ID:** S-004X
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-07
**Catalog description:** Adding a required Core skill follows one written procedure in the workbench-room-checks maintainer skill, reached from a Runbook operations row, and the catalog test checks every stated core skill count in current-facing docs against the manifest.
**Blockers:** S-005A (count-test slice only)
**Latest event:** Revised from the owner grilling of 2026-10-07 (stated counts enforced, the procedure's home, the LLM_Workbench target); no Task is cut.
**Next gate:** Activation and a Task cut from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`d0fb161c1ff36caf936758b7492f7ef7fce8176e` post=`d0fb161c1ff36caf936758b7492f7ef7fce8176e`.

## Outcome

The next agent who adds a required Core skill finds the operation in the
Runbook's Operations Index, follows one written procedure instead of
reverse-engineering another Spec's commits, and cuts a Task that can go green on
its own. Every count of core skills a current-facing document states is checked
against the manifest, in digits or words, so a stale count fails the catalog
test instead of waiting for a reviewer or a Worker's grep.

## Why It Matters

The pr skill adoption run (S-002U) on 2026-10-07 shows three costs:

- The Dispatcher learned which files to touch by diffing another Spec's
  unlanded commit.
- The Task cut split "install the skill folder" from "declare it in Core", but
  the installer refuses an undeclared skill folder (`invalid-bundled-core`), so
  the first Task could not pass alone. That cost a full red suite run and an
  out-of-order claim.
- The bundle size was stated in prose in about seven files. Two were stale and
  untested: `workbench/wiki/skill-genesis.md`, found by a Worker's grep, and
  `workbench/wiki/design-concepts/landmark-wiki.md`, found by the reviewer.

On the same day four Core additions (domain-modeling, pr, retro and
writing-for-agents) landed from parallel lanes and were reconciled by merge
commits such as `327a7bab` and `e2f5964d`, which re-edited the same counts.

## Current Verified State

At the pre anchor:

- `workbench/manifest.json` `skillPolicy.required` lists 32 skills, and
  `maintainerSkills` declares `workbench-release`, `workbench-room-checks`,
  `workbench-evaluation` and `implement-spec`.
- `tools/test-skill-catalog.mjs` derives the bundle size from the core catalog
  and checks it in five named files only: `workbench/skills/README.md`
  (`closed 32-skill bundle` and the per-group words), `README.md`
  (`closed 32-skill core bundle`), the workbench-room-checks skill
  (`the 32 core skills`), `LEXICON.md` (`closed set of twenty-four workflow
  skills`) and `templates/GENESIS.md` (`exact 32-skill policy`). Its comment
  records that an earlier review, not a test, caught wrong counts. It spells
  counts from a words table that ends at "twenty-four", the current
  workflow-skill count, so the next workflow addition fails with "extend the
  words table" until someone does.
- Counts outside those five files are unchecked. `workbench/wiki/skill-genesis.md`
  says "the 30 core skills" while the manifest lists 32: it went stale again
  after S-002U corrected it. Other unchecked counts in tracked docs describe
  past bundles, for example `README.md` line 218 ("twenty-one core skills" in
  the v3.2.0 release paragraph), the workbench-release skill's v3.2.0 waiver
  lines ("twenty-skill", "twenty-one-skill") and dated lines in Wiki pages such
  as `workbench/wiki/skill-grill-me.md` and
  `workbench/wiki/skill-workbench-runtime.md`.
- No document lists the places a Core addition touches. The S-002U adoption
  merge changed 21 files outside its Spec folder, including the manifest, the
  runtime bundle in `workbench/tools/workbench-layout.mjs`, the core catalog,
  the Lexicon, the Runbook and its template, the Genesis template, two tests and
  three Wiki pages.
- [RUNBOOK.md Operations Index](../../../RUNBOOK.md#operations-index) has a
  "Check the skills lane" row that links to the workbench-room-checks
  [Skills lane check](../../skills/workbench-room-checks/SKILL.md#skills-lane-check),
  and no row for adding a core skill. The workbench-room-checks skill is a
  maintainer skill: it never ships to a room, and `templates/RUNBOOK.md` carries
  none of its rows.

## Desired Behavior

1. The workbench-room-checks maintainer skill gains an "Add a core skill"
   section. It is the procedure home: it names every place an addition touches,
   says the skill source and its Core declaration ship in the same Task because
   the installer refuses one without the other, says to update every stated
   count, and ends with the skills-lane check.
2. `RUNBOOK.md`'s Operations Index gains an "Add a core skill" row that labels
   the operation, says when to follow it, and links to that section.
3. The to-tasks skill carries a pointer for a Spec that adds a Core skill, and
   that pointer links through to the procedure by way of the Runbook's "Add a
   core skill" row. to-tasks ships to rooms and workbench-room-checks does not,
   so a direct link from to-tasks into the maintainer skill would break in every
   room; the Runbook row is the progressive-disclosure step.
4. `workbench/skills/README.md` gains nothing for this operation.
5. The catalog test (`tools/test-skill-catalog.mjs`) finds every stated count of
   core skills in tracked current-facing docs, in digits and in number words,
   and fails when one disagrees with the manifest. Number words are spelled
   without a fixed ceiling, so a bundle of any size is checked.
6. The existing count checks in the five named files stay, folded into the
   broader scan or kept beside it.

## Decisions And Contracts

- **Stated counts, enforced (owner, 2026-10-07).** State the core skill count
  where readers need it and enforce it: the catalog test catches every stated
  count of core skills in tracked current-facing docs, digits and number words,
  with no twenty-four ceiling, against the manifest. The earlier count-free
  idea, which would have forbidden counts outside the catalog, is dropped. Why
  (owner): enforcing what we write down beats deleting it; counts were dropped
  earlier only because they went stale.
- **The procedure's home (owner, 2026-10-07).** The Runbook's Operations Index
  gets an "Add a core skill" row that labels the operation, says when to follow
  it, and links to a new "Add a core skill" section in the workbench-room-checks
  maintainer skill. That section is the procedure home: skill source and its
  Core declaration in the same Task, update stated counts, run the skills-lane
  check. Nothing goes in `workbench/skills/README.md`; the to-tasks pointer
  links through to the procedure.
- **Target (owner, 2026-10-07).** This Spec targets LLM_Workbench itself: the
  procedure lives in a maintainer skill and never ships to a room. The count
  test protects the shipped bundle. The new Runbook row is therefore not added
  to `templates/RUNBOOK.md`, which carries no workbench-room-checks row.
- The procedure describes what exists; it does not change how a Core skill is
  installed or declared, and it links to, rather than restates, the lifecycle
  rules the Core Skill Lifecycle Spec (S-00R) owns.
- The test exempts nothing by wording. A count of core skills in a
  current-facing doc either matches the manifest or the text moves or changes.
  The Plan names the exact corpus of tracked current-facing docs from the
  owner's history decision carried by Project history lives in the Wiki
  (S-004Z), which keeps history in the Wiki and out of current-state docs. The
  Wiki history page is history, not a current-facing doc, so the scan leaves it
  out; dated count lines elsewhere (Wiki pages, the workbench-release skill's
  v3.2.0 waiver lines) face that decision's value test under S-004Z.
- **Blocked in part by READMEs follow the README definition (S-005A).** The
  release-history paragraph in `README.md` (the v3.2.0 lines with "twenty-one
  core skills" and "twenty-skill") is S-005A's to move, not this Spec's, so two
  parallel Specs never edit `README.md`. The broadened test exempts nothing and
  flags that paragraph, so it cannot pass on `integration` until S-005A has
  moved it: the slice that turns the broadened count test on is blocked by
  S-005A's README rework. The Runbook row, the workbench-room-checks section and
  the to-tasks pointer are not blocked.

## Non-Goals

- Changing the installer's refusal of an undeclared skill folder. It is right;
  the Task cut was wrong.
- Promoting, removing or reclassifying any skill (S-00R owns lifecycle and
  disposition).
- Editing `README.md`, including its release-history paragraph (S-005A).
- Shipping the procedure or its Runbook row to rooms.

## Dependencies And Blockers

- Blocked by READMEs follow the README definition (S-005A), for the slice that
  turns the broadened count test on only: S-005A moves the `README.md` history
  paragraph that test would flag. Every other slice is unblocked.
- S-00R has a live lane on Core skill lifecycle wording; the procedure links to
  it and does not restate it.

## Vertical Implementation Slices

No Task is cut. Tasks are cut from live Actuality at activation with
`/to-tasks`. The intended direction is the broadened count test first, red on
today's stale and unchecked counts, then the doc fixes that turn it green (with
the `README.md` paragraph left to S-005A as coordinated above), then the
workbench-room-checks section, the Runbook row and the to-tasks pointer.

## Acceptance Criteria

- [ ] The catalog test fails on a planted wrong count of core skills, in digits and in words, in a current-facing doc outside the five files it names today, and passes when the count matches the manifest.
- [ ] Number words are spelled for any bundle size; no words table ends the check at twenty-four.
- [ ] Every stated count of core skills in tracked current-facing docs matches the manifest on the final tree, with nothing exempted by wording.
- [ ] The workbench-room-checks skill has an "Add a core skill" section that names every file the S-002U adoption touched outside its Spec folder (or says why one no longer needs touching), requires the skill source and its Core declaration in the same Task, says to update stated counts, and ends with the skills-lane check.
- [ ] `RUNBOOK.md`'s Operations Index has an "Add a core skill" row linking to that section, and `workbench/skills/README.md` gains no procedure text.
- [ ] The to-tasks skill points a Spec that adds a Core skill through to the procedure, and names a Task that installs the skill folder without its declaration as a known failing cut.
- [ ] Named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

`tools/test-skill-catalog.mjs`, reading tracked Markdown from the repository
root and the manifest's required list.

## Verification Procedure

Red/green at the broadened count check, the catalog and skills-lane tests, then
the Full suite on a committed candidate. The real check is the next Core
addition: a missed count fails the catalog test. Record actual commands and
results in this Spec.

## Documentation Impact

The workbench-room-checks and to-tasks skills, `RUNBOOK.md`'s Operations Index,
`workbench/wiki/skill-genesis.md` and any other current-facing doc the broadened
test flags, except `README.md`, which S-005A owns.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-07 | none | Authored at the Map step from an implement-spec retro at integration d0fb161c1ff36caf936758b7492f7ef7fce8176e. | Map only; the manifest's required list, the existing count pins, current count prose and the S-002U adoption merge's file list were read at that tip; no runtime proof claimed. | This Spec. | Owner approval, Plan, implementation and proof remain. |
| 2026-10-07 | none | Revised from the owner grilling of 2026-10-07: carries stated counts enforced by a broadened catalog test (count-free idea dropped), the "Add a core skill" Runbook row and workbench-room-checks procedure home, and the LLM_Workbench target; the README history paragraph is left to S-005A with a coordination note. | Spec text only; the catalog test's count block, the workbench-room-checks skill, the Runbook Operations Index and stated counts in tracked docs were read at d0fb161c1ff36caf936758b7492f7ef7fce8176e; no runtime proof claimed. | This Spec. | Plan, implementation and proof remain. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

None known.

## Supersession

- Supersedes: none
- Superseded by: none
