---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Harness Improvement Playbook Skill Spec (S-004L) Task TK-008N (one Wiki page for the one skill), 2026-10-06, written from the skill source its Task TK-008L (the skill and the bundle change) delivered and the owner's playbook decision of 2026-10-05
source_paths:
  - workbench/skills/improve-harness/SKILL.md
  - workbench/specs/S-004L-harness-improvement-playbook-skill/SPEC.md
  - workbench/docs/ddr/001I-harness-improvement-is-one-playbook-not-a-family-of-review-skills.md
  - workbench/skills/README.md
  - workbench/tools/workbench-layout.mjs
  - tools/test-skill-catalog.mjs
  - tools/test-skills-lane.mjs
  - workbench/wiki/harness-engineering-lineage.md
  - workbench/wiki/skills-draft/README.md
last_verified: 2026-10-06
---

# Improve harness: improve one harnessed job through one loop

`improve-harness` is the core skill a room loads when one job went badly and the harness around the agent may be the cause, when harness feedback arrives, or when a harness change has to be shown to be an improvement rather than a preference. It takes one observed job, finds the earliest place the room's environment failed it, makes the smallest change at the owner that can shape future runs, proves that change, reruns the job fresh, and then keeps, reworks or removes the change. The procedure, its job contract and its result record are in the [skill source](../skills/improve-harness/SKILL.md); this page explains where it came from and what it replaced.

**Input:** one bounded, representative job a fixed model and agent ran in the room, with its accepted outcome. **Output:** a better environment around that job, or a named next missing boundary, plus one compact result record in the room's feedback lane. **Done when:** the result record is filled or marked unknown field by field, the decision names its owner, evidence and reconsideration condition, the lesson is in the feedback record, and any follow-up is in its owning Spec.

## When not to use it

The loop is for one job. A whole-repository audit, a program of work spanning quarters or an open mandate to make agents better is too wide; narrow it to one job first. A comparative, causal or longitudinal claim, such as "this harness version is better than the last one", needs the room's evaluation procedures with repeated, controlled trials, not one pass of this loop. The loop reads before it changes: every step before the intervention is read-only, and when the intervention is outside the authority the current request grants, the skill stops after stating it and hands the record back instead of making it.

## How it works

The loop has six steps, each leaving a checkable artifact. The skill's own sections carry the procedure:

| Step | Artifact it leaves |
|---|---|
| [Observe the baseline](../skills/improve-harness/SKILL.md#1-observe-the-baseline) | what the run actually showed, not a summary |
| [Locate the earliest gap](../skills/improve-harness/SKILL.md#2-locate-the-earliest-gap) | the earliest failed handoff, its kind and its one owner |
| [State the smallest owning intervention](../skills/improve-harness/SKILL.md#3-state-the-smallest-owning-intervention) | a written hypothesis with the evidence that would support or weaken it |
| [Verify through the target's native checks](../skills/improve-harness/SKILL.md#4-verify-through-the-targets-native-checks) | the committed change and the room's own checks run on it |
| [Rerun on a fresh trajectory](../skills/improve-harness/SKILL.md#5-rerun-on-a-fresh-trajectory) | rerun evidence compared with the baseline dimension by dimension |
| [Retain, revise or remove](../skills/improve-harness/SKILL.md#6-retain-revise-or-remove) | the recorded decision with its owner, evidence and reconsideration condition |

Before the first step the skill writes a [job contract](../skills/improve-harness/SKILL.md#job-contract) so the baseline and the rerun are comparable, and after the last it writes the [result record](../skills/improve-harness/SKILL.md#result-record). Feedback is the loop's entry: a row in the room's append-only feedback record, a downstream room's return, a review finding or a dogfooding observation seeds the job contract, and the lesson goes back into that record as a new row naming the original one, never an edit of an earlier row ([Taking In Feedback](../skills/improve-harness/SKILL.md#taking-in-feedback)). Which Runbook operations route to the skill is the Runbook's to say, through its [operations index](../../RUNBOOK.md#operations-index).

The last step is the one the Workbench most needed: a change that adds noise, duplicates a better owner or does not improve the job is removed, so the loop can retire harness as well as add it.

## History: the family it replaces

Before this skill, harness improvement lived in a family of fifteen skills installed only in the owner's host skills root, never in the tracked skills lane: `harness-feedback-review`, which composed fourteen `harness-review-*` stage skills (scope, canon, grounding, actuality, reconnaissance, map gaps, classify causes, meta risks, diagnosis, actions, disposition, report, feedback lifecycle and assay follow-up). Three of those stages, reconnaissance, diagnosis and disposition, were themselves composites of the others. The family ran a read-only review that ended in a report.

On 2026-10-05 the owner decided that harness improvement is one playbook, not a family of review skills ([the playbook decision](../docs/ddr/001I-harness-improvement-is-one-playbook-not-a-family-of-review-skills.md)), and the [Harness Improvement Playbook Skill Spec (S-004L)](../specs/S-004L-harness-improvement-playbook-skill/SPEC.md) delivered the one skill and records the family as retired in its favor. Keeping the family and adding the playbook beside it was considered and rejected.

What the one skill kept from the family: the read-only posture until a change is authorized; reading each claim by the Governance Plane it plays (Canon, Grounding, Actuality); the rule that one failed trajectory never establishes a worker limitation; and the append-only feedback record as the place a lesson is written. What it dropped: the fourteen-stage decomposition, the separate reconnaissance, diagnosis and disposition composites, and the stand-alone report as the unit of work.

The family's host copies are outside this repository; removing them from the owner's host skills root is the owner's step, and this page does not claim it done. The [skills draft index](skills-draft/README.md) keeps the family's fifteen rows so the retirement stays visible, and the planned family alignment Spec it once pointed to, [harness feedback review skill family alignment (S-003K)](../specs/S-003K-harness-feedback-review-skill-family-alignment/SPEC.md), is overtaken by the playbook decision.

## Upstream relationship

The loop's shape follows Ryan Lopopolo's improve-harness playbook, licensed CC BY 4.0. The [harness engineering lineage page](harness-engineering-lineage.md) links and attributes it; the skill is written in the Workbench's own words and copies nothing from it, and neither does this page.

## Verified behavior and limits

The skill is one of the closed core bundle's skills and ships to every room: it is listed in the [core skill catalog](../skills/README.md) and in the layout's declared core skills, where it follows `workbench-runtime`. `tools/test-skill-catalog.mjs` pins its place in the bundle, its contract sections, the six steps in loop order, the disciplines it keeps from the family, its attribution, its portability (no repository Spec path, maintainer test command or private path), and the wording a fixture-room scenario corrected: feedback is appended rather than a row's status moved, a rerun accounts for hidden help in the room's own files and later history, and a test-without run that also closes the job claims no improvement from the intervention. `tools/test-skills-lane.mjs` shows that the explicit skills update installs it into a room that lacks it and leaves a room-added skill untouched.

**Limits:** those tests check the skill's text and its installation, not an agent following it. One pass of the loop supports a bounded claim about one job under the observed conditions; it does not isolate the mechanism, estimate a general effect or rule out chance.

## Sources

- [Improve harness source](../skills/improve-harness/SKILL.md)
- [Harness Improvement Playbook Skill Spec (S-004L)](../specs/S-004L-harness-improvement-playbook-skill/SPEC.md)
- [Harness improvement is one playbook, not a family of review skills](../docs/ddr/001I-harness-improvement-is-one-playbook-not-a-family-of-review-skills.md)
- [Harness engineering lineage](harness-engineering-lineage.md)
- [Core skill catalog](../skills/README.md)
- [Skills draft index](skills-draft/README.md)
- [Wiki router](MEMORY.md)

## History

- 2026-10-06: Created by the Harness Improvement Playbook Skill Spec (S-004L), Task TK-008N (one Wiki page for the one skill), after its Task TK-008L (the skill and the bundle change) put the skill in the lane. The fifteen-skill host family is recorded here as the history the one skill replaces.
- 2026-10-06: Harness Improvement Playbook Skill Spec (S-004L) Task TK-008P (correct the feedback, rerun and test-without wording) updated the feedback entry and the pinned-behavior list after the fixture-room scenario of Task TK-008O.
