# S-005B - Review Catches Stale Spec Records

**Spec ID:** S-005B
**Status:** planned
**Priority:** 3
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-07
**Catalog description:** The code-review core skill tells a reviewer to check whether other Specs' delivered records still describe Actuality after the change under review touched what they describe, and to judge each stale record by the owner's value test.
**Blockers:** none
**Latest event:** Authored from the owner grilling of 2026-10-07; no Task is cut.
**Next gate:** Owner answer to the rule wording (open choice B-1), then activation and a Task cut from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`d0fb161c1ff36caf936758b7492f7ef7fce8176e` post=`d0fb161c1ff36caf936758b7492f7ef7fce8176e`.

## Outcome

When a reviewer checks a change, they also ask whether it made another Spec's
delivered records wrong. If a later change edits a file or behavior that an
earlier Spec's done Task rows, evidence, checked acceptance or Completion
Result describe, the review reports each record that no longer describes
Actuality, and says by the owner's value test whether the right correction is
a trim or a fix in its owner. Stale records stop surviving review unnoticed,
in this repository and in every room that installs the code-review skill.

## Why It Matters

An implement-spec retro of 2026-10-07 found that a Spec's delivered rows and
records go stale when other, later work edits what they describe, and nothing
in review catches it. The owner confirmed the finding is real and gave it its
own Spec.

## Current Verified State

At the pre anchor:

- `workbench/skills/code-review/SKILL.md:48-57` tells the reviewer to trace
  each changed behavior and check the fixed diff for, among other things,
  "documentation or proof that contradicts the implementation". The check is
  scoped to the diff and the assigned Spec; nothing asks the reviewer to look
  at other Specs whose delivered records describe what the diff changed.
- The skill's review question for an assembled Spec
  (`workbench/skills/code-review/SKILL.md:42-46`) checks that Spec against its
  controls, scope and named evidence only.
- The Runbook's Wiki Lint (`RUNBOOK.md:630`) has a whole-Wiki lint at Spec
  review that reads every Wiki page against the current controls. No
  equivalent read covers Spec records.
- `code-review` is a required core skill (`workbench/manifest.json:85`), so the
  skill source ships to every room. The Wiki page
  `workbench/wiki/skill-code-review.md` describes what the skill does.
- `AGENTS.md:334` forbids rewriting append-only Spec evidence rows, and the
  skill is review-only: it reports findings and changes nothing.

## Desired Behavior

Canon describing the template leads; the template artifact follows it.

1. This repository's description of the code-review skill (its Wiki page) says
   that a review checks other Specs' delivered records for staleness, before
   the skill changes.
2. The code-review skill gains one judgement rule in its Inspect step: for each
   file or behavior the diff changes, find the delivered records of other
   Specs that describe it (done Task rows, evidence rows, checked acceptance
   lines, Completion Result) and check whether each still describes Actuality
   at `HEAD_SHA`.
3. Each record that no longer does becomes a finding in the skill's existing
   format: the record and its Spec by name, the change that made it stale, and
   the value test's answer. Does the record still bring us closer to the
   destination? If it is less useful than thought or available elsewhere
   (GitHub, the Wiki history), the correction is a trim; otherwise it is a
   fix in the record's owner.
4. The finding never rewrites an append-only evidence row or a Task Receipt
   row in review. How such a row is trimmed follows the answer to the open
   trim design choice in
   [Project History Lives In The Wiki](../S-004Z-project-history-lives-in-the-wiki/SPEC.md).
5. The rule links to the written value test once that Spec delivers it; until
   then it states the test in one sentence in the owner's words.

## Decisions And Contracts

- **The reviewer stale-record rule is real** (owner, 2026-10-07) and gets its
  own Spec; it was kept when five other retro items were left out as already
  fixed or not broken.
- **The value test** (owner, 2026-10-07) is the judgement the rule applies:
  does the record bring us closer to the destination? Trim it if it is not as
  useful as we thought or it is available elsewhere (GitHub, the Wiki
  history); otherwise keep it.
- **Template-targeted** (owner, 2026-10-07, governance-stack lens): code-review
  is a core skill, so this Spec updates the description of the skill first,
  then the skill source that ships to rooms.
- The rule is a judgement rule in the skill, not a new command or gate.
- The skill stays review-only: findings are reported, and corrections happen
  in a separately authorized Task.

### Open owner choices

- **B-1: The exact rule wording.** Not settled.
  Recommendation (not an owner answer): add one bullet to the Inspect step's
  list and one short paragraph after it:

  > - delivered records of other Specs that the diff made stale;
  >
  > For each file or behavior the diff changes, find other Specs whose done
  > Task rows, evidence rows, checked acceptance or Completion Result describe
  > it, and check whether each still describes Actuality at `HEAD_SHA`. Report
  > each that does not as a finding naming the record, its Spec and the change
  > that made it stale, with the value test's answer: does the record still
  > bring us closer to the destination? If it is not as useful as we thought
  > or is available elsewhere (GitHub, the Wiki history), the correction is a
  > trim; otherwise it is a fix in its owner. Never rewrite an append-only row
  > in review.

## Non-Goals

- A tool or test that detects stale records mechanically. This Spec writes a
  judgement rule a reviewer applies.
- Deciding how an append-only evidence row or Task Receipt row is trimmed;
  that is Project History Lives In The Wiki's open design choice.
- Sweeping existing Specs for records that are stale today.
- Changing the review process, its boundaries or who reviews.

## Dependencies And Blockers

- None blocking.
- Coordination: [Project History Lives In The Wiki](../S-004Z-project-history-lives-in-the-wiki/SPEC.md)
  writes the value test down as a rule and holds the open trim design choice;
  this Spec links to both and does not wait for them.

## Vertical Implementation Slices

No Task is cut. Tasks are cut from live Actuality at activation with
`/to-tasks`. The intended direction is one slice: the Wiki description of the
skill, the rule in the skill source and a test that pins the rule's presence.

## Acceptance Criteria

- [ ] `workbench/wiki/skill-code-review.md` says a review checks other Specs' delivered records for staleness.
- [ ] `workbench/skills/code-review/SKILL.md` carries the stale-record rule in the owner-approved wording, inside the Inspect step, with the value test.
- [ ] A test fails while the rule is absent and passes once it is present.
- [ ] The skill still says it is review-only, and the rule never directs a rewrite of an append-only evidence row or Task Receipt row.
- [ ] Named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

`tools/test-delivery-skills.mjs` already reads the code-review skill source; a
case there can pin the rule's presence. `tools/test-skill-catalog.mjs` and the
core-skill installer tests confirm the changed source still ships as part of
the bundle.

## Verification Procedure

Red/green at the delivery-skills seam, then the fast check and the Runbook's
Full suite on a committed candidate. Record actual commands and results in
this Spec.

## Documentation Impact

`workbench/skills/code-review/SKILL.md` and `workbench/wiki/skill-code-review.md`.
The Runbook's code-review rows point to the skill and need no change unless
the Plan finds one restating the Inspect step.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-07 | none | Authored from the owner grilling of 2026-10-07 at integration d0fb161c1ff36caf936758b7492f7ef7fce8176e; carries the retro stale-record finding confirmed in D7, the D2 value test and D5 (template-targeted, code-review is a core skill). | Map only; the code-review skill, its Wiki page, the core skill list and the append-only rule were read at that tip; no runtime proof claimed. | This Spec. | Owner approval of the rule wording, Plan, implementation and proof remain. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- A judgement rule depends on the reviewer finding the affected records. A
  mechanical aid, if reviews keep missing them, would be a later Spec.

## Supersession

- Supersedes: none
- Superseded by: none
