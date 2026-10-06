# S-004L - Harness Improvement Playbook Skill

**Spec ID:** S-004L
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-05
**Catalog description:** Ship one improve-one-harnessed-job playbook skill that runs the baseline-to-rerun loop, point the Runbook's harness feedback and evaluation rows at it, and retire the host-installed harness-review family in its favor.
**Blockers:** none for specification. Implementation awaits Plan and assignment.
**Latest event:** Authored at the Map step from the owner's playbook decision of 2026-10-05; no Task is cut.
**Next gate:** At Plan, read each family skill, decide what the one skill keeps, and cut small Tasks.

## Outcome

One tracked skill carries harness improvement: given one observed job, it takes a baseline, finds the earliest gap, makes the smallest owning intervention, verifies through the target's native checks, reruns on a fresh trajectory, and then retains, revises or removes the intervention. The Runbook's harness feedback loop, manual feedback report and evaluation rows point at it, and the harness-review family of fifteen host-installed skills retires in its favor.

## Why It Matters

The owner (2026-10-05): "I feel like the Playbook is what I was trying to have the RUNBOOK be, and we lost the design concept along the way". The family does, in fifteen skills, what one six-step loop does, and the loop's last step, remove what does not earn its maintenance cost, is the discipline the Workbench now needs most. This is the first move of retiring harness faster than adding it ([the playbook decision](../../docs/ddr/001I-harness-improvement-is-one-playbook-not-a-family-of-review-skills.md)).

## Current Verified State

At integration `46ad9789` (2026-10-05): the tracked skills lane holds no `harness-*` skill. The family lives only in the owner's host skills root: `harness-feedback-review`, which composes fourteen `harness-review-*` stage skills (scope, canon, grounding, actuality, reconnaissance, map gaps, classify causes, meta risks, diagnosis, actions, disposition, report, feedback lifecycle, assay follow-up). The repository names none of them; its Runbook carries the procedures under Harness Feedback Loop, Automated Feedback Gate, Manual Harness Feedback Reports and Evaluation And Benchmarking, and the feedback reports live in `workbench/feedback/`. No tracked skill carries the baseline-to-rerun loop as one procedure. No implementation or agent-outcome proof for this capability is claimed by this Map record.

## Desired Behavior

1. One core skill, `improve-harness` or a name the Plan chooses, carries the loop: baseline, earliest gap, smallest owning intervention, native verification, fresh rerun, retain or revise or remove. Each step names its checkable artifact.
2. It keeps what the family proved worth keeping: the read-only posture of a review, the three-plane classification of a claim (Canon, Grounding, Actuality), and the append-only feedback records as the place a lesson is written.
3. The one skill joins the closed core bundle; the catalog, install receipt, Template and update route follow, and a room updated from this version gains it. The host-installed family is outside this repository's edit scope: the Spec records it as retired in favor of the one skill and leaves its removal from the host skills root to the owner.
4. The Runbook's harness feedback and evaluation rows point at the one skill. `AGENTS.md` is unchanged unless a binding line names the family.
5. The Wiki's skill pages for the family become one page for the one skill, with the family named as history.

## Decisions And Contracts

- [Harness improvement is one playbook, not a family of review skills](../../docs/ddr/001I-harness-improvement-is-one-playbook-not-a-family-of-review-skills.md) (owner, 2026-10-05).
- The loop's shape is Ryan Lopopolo's improve-harness playbook, linked and attributed through the [lineage page](../../wiki/harness-engineering-lineage.md) under CC BY 4.0; the skill is written in the Workbench's own words and copies nothing.
- A skill change gets the same review care as a Contract change; the closed-bundle checks apply.

## Non-Goals

Changing the feedback record format, the evals or outcome trials, the guardrail audit, the self-drift check, or any other skill; a control experiment against another harness (the owner declined one on 2026-10-05).

## Dependencies And Blockers

- The skills lane and the Runbook are shared writers with the [Contract carrier rewrite](../S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md); coordinate the Runbook row and any `AGENTS.md` line through that Spec's writer.
- The [release owner](../S-00O-workbench-v4-0-0-release/SPEC.md) retains version, Template and owner gates; a changed closed bundle needs the normal bundle, version and install proof.

## Vertical Implementation Slices

No Tasks cut. At Plan, use current Actuality to cut small complete-path slices: the one skill with a red/green check of its loop; the lane, catalog and bundle retirement; the Runbook row and Wiki page. The empty tasks directory keeps this planned capability record-backed.

## Acceptance Criteria

- [ ] The one skill exists in the lane, its loop has six named steps each with a checkable artifact, and a scenario in a fixture room runs it end to end.
- [ ] The one skill is in the catalog, the install receipt and the Template, the closed-bundle checks pass, and the Spec records the host family as retired in its favor.
- [ ] The Runbook's harness feedback and evaluation rows point at the one skill, and the Wiki has one validated page for it.
- [ ] Updating a room installs the one skill without touching the room's own skills.
- [ ] The full suite passes on the committed candidate; named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

The skills-lane and skill-catalog tests, the closed-bundle and install-receipt checks, the update-route round trip against a fixture room, and the Wiki validator.

## Verification Procedure

Run the targeted skills-lane, catalog, bundle and update tests, then the full AGENTS suite, `render` and `doctor`, on the committed candidate. Capture the guardrail baseline before and after. Obtain separate-context review of the immutable candidate before integration.

## Documentation Impact

The Runbook rows, one Wiki skill page, the lineage page's pointer to the skill, and the `templates/` mirror of any changed portable rule.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-05 | none | Authored at the Map step from the owner's playbook decision of 2026-10-05 at integration 46ad9789. | Map only; the family was counted in the host skills root and the lane was read, no runtime proof claimed. | This Spec. | Plan, implementation and proof remain. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Whether the feedback record format itself simplifies is a later question under the Continuous Cleanup landmark.

## Supersession

- Supersedes: none
- Superseded by: none
