# S-004N - Review Ladder And Landmark Human QA

**Spec ID:** S-004N
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-05
**Catalog description:** Move the owner's Human QA from the delivered Spec to the landmark: a Task is proven by automation, a Spec by agent review, a landmark by integrated automated review, and the owner judges the concept.
**Blockers:** S-003Z:delivered. Specification is complete; Plan waits for the LANDMARK.md artifact whose review this ladder sits on.
**Latest event:** Authored at the Map step from the owner's review-ladder decision of 2026-10-05; no Task is cut.
**Next gate:** When the LANDMARK.md artifact is delivered, Plan against its review commands and cut small Tasks.

## Outcome

Review climbs a ladder. A Task is proven by automation. A Spec is reviewed by an agent that did not build it and closes on that review and its proof, with no owner gate. A landmark passes integrated automated review: every child Spec complete, the full suite green on integration, and a Reviewer-stance agent that built none of it reviewing the landmark's own success statement. The owner judges the concept at the landmark, in Human QA, and steps in earlier only for a decision, a risk, an ambiguity or a failed automated review.

## Why It Matters

The Blueprint says the owner is needed only to unblock and to judge the finished result, yet v4 placed owner Human QA on each delivered Spec, which does not scale with many agents producing many Specs while the owner works or sleeps. The owner chose the ladder ([the review ladder decision](../../docs/ddr/001B-review-climbs-the-ladder-task-by-automated-proof-spec-by-agent-review-landmark-by-integrated-automated-review-and-the-owner-judges-the-concept.md)) under the Human Attention Minimized landmark.

## Current Verified State

At integration `ec65203d` (2026-10-05): `AGENTS.md` Owner Closure And Reconciliation reads reviewed delivery on integration, then owner approval, then verification on main, then `complete`; `approve S-### --candidate SHA --owner NAME` records approval per Spec and `complete` requires it; the owner's rule of 2026-10-05 already judges a Task by its merge answers and reviews only at Spec Verify, so the Task and Spec rungs of the ladder are in place and this Spec adds the landmark rung and moves the owner's gate onto it; the rendered Taskboard shows 40 lines naming Human QA or owner QA, almost all per Spec; the `director` and `dispatcher` skills carry the per-Spec closure; `gate --spec` checks a Spec candidate and there is no landmark review command. The Blueprint at this branch already promises the ladder. No implementation or agent-outcome proof for this capability is claimed by this Map record.

## Desired Behavior

1. A Spec closes on its separate-context review and its proof. `complete` no longer requires owner approval of the Spec; it requires the review verdict, checked acceptance, a Completion Result and main containment.
2. A landmark's integrated automated review is a command: it refuses while a child Spec or Task is open, runs or reads the full suite at the integration tip, and records a Reviewer-stance verdict from a context that built none of the landmark against the landmark's success statement.
3. Owner approval is recorded per landmark, bound to the integration content it judged, with findings and destination changes as the Spec-level verb has them today; a failed landmark review returns at the implicated scope.
4. The Taskboard projects the landmark's QA state and stops projecting a per-Spec owner gate.
5. The `director`, `dispatcher`, `reviewer` and `implement` skills, `AGENTS.md` and the `templates/` mirrors say the ladder; the two-gate decision keeps its branch gates.

## Decisions And Contracts

- [Review climbs the ladder](../../docs/ddr/001B-review-climbs-the-ladder-task-by-automated-proof-spec-by-agent-review-landmark-by-integrated-automated-review-and-the-owner-judges-the-concept.md) (owner, 2026-10-05).
- The landmark review one size up is defined by [Landmarks are LANDMARK.md artifacts one size above Specs](../../docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md) and delivered by the LANDMARK.md Spec; this Spec moves the owner's gate onto that rung and does not build the rung.
- Only the owner approves and only the owner promotes integration to main; neither changes.
- Specs with no landmark sit under the Blueprint; the Plan decides whether their owner gate stays per Spec or is judged with the Blueprint, and records the owner's answer if one is needed.

## Non-Goals

Building the LANDMARK.md artifact or its review commands, changing who approves or promotes, removing separate-context review of a Spec, changing how a Task is judged by its merge answers, implementing another capability.

## Dependencies And Blockers

- `S-003Z:delivered`: the landmark review rung must exist before the owner's gate moves onto it.
- `AGENTS.md`, the Spec tools and the role skills are shared writers; coordinate with the [Contract carrier rewrite](../S-004C-contract-carrier-pointer-brief-rewrite/SPEC.md) and the [Captain Role And Landmark Director](../S-004B-captain-role-and-landmark-director/SPEC.md) Spec.
- The [release owner](../S-00O-workbench-v4-0-0-release/SPEC.md) retains version, Template and owner gates.

## Vertical Implementation Slices

No Tasks cut. At Plan, cut small complete-path slices against the delivered landmark commands: Spec closure without the owner gate, the landmark review command and verdict, landmark approval and findings, the Taskboard projection, the skills and controls. The empty tasks directory keeps this planned capability record-backed.

## Acceptance Criteria

- [ ] In a fixture room, a Spec with a passed separate-context review, checked acceptance and main containment completes without an owner approval record.
- [ ] A landmark review refuses while a child is open, refuses from a context that took part in the landmark, and records a verdict against the landmark's success statement.
- [ ] Owner approval is recorded per landmark and bound to the content judged; a finding returns at the implicated scope.
- [ ] The Taskboard shows no per-Spec owner gate and shows each landmark's QA state.
- [ ] `AGENTS.md`, the four skills and the `templates/` mirrors state the ladder, and the full suite passes on the committed candidate; named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

The Spec tools' `complete`, `approve`, `gate` and `render` against a fixture room with one landmark and nested Specs; the landmark review command's refusals; the control-fidelity and governance-core tests that read `AGENTS.md`.

## Verification Procedure

Run the targeted Spec-tool, render and control tests, then the full AGENTS suite, `render` and `doctor`, on the committed candidate. Obtain separate-context review of the immutable candidate before integration.

## Documentation Impact

`AGENTS.md`, the four skills, the Runbook's closure row, the Wiki pages for Human QA and the review gate, and the `templates/` mirrors.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-05 | none | Authored at the Map step from the owner's review-ladder decision of 2026-10-05 and re-verified at integration ec65203d. | Map only; the closure sequence, approve verb and Taskboard were read, no runtime proof claimed. | This Spec. | Plan waits on the LANDMARK.md artifact; implementation and proof remain. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- The Specs already at a per-Spec owner gate when this lands are judged under the ladder by their landmark, or with the Blueprint when they have none; the Plan records how.

## Supersession

- Supersedes: none
- Superseded by: none
