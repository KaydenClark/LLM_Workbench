# S-004Y - Dispatcher Fast-Forward Merges

**Spec ID:** S-004Y
**Status:** planned
**Priority:** 3
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-07
**Catalog description:** In implement-spec, the Dispatcher makes a fast-forward-only merge into assembly itself with an ancestry check and a remote read-back, and keeps the merger subagent for true merges and conflicts.
**Blockers:** Open owner choices: approval of the implement-spec step 5 wording change, and whether the fast-forward is skill wording only or a runtime command.
**Latest event:** Revised from the owner grilling of 2026-10-07 (LLM_Workbench target, process unchanged); two owner choices stay open; no Task is cut.
**Next gate:** Owner answers the two open choices, then activation and a Task cut from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`d0fb161c1ff36caf936758b7492f7ef7fce8176e` post=`d0fb161c1ff36caf936758b7492f7ef7fce8176e`.

## Outcome

A merge that cannot go wrong stops costing a subagent. When a Worker's verified
branch is a fast-forward of the assembly tip, the Dispatcher merges it with
`--ff-only`, checks that the new tip is the Worker's commit, pushes and reads
the remote tip back. Anything else, a real merge or a conflict, still goes to
the merger subagent.

## Why It Matters

In the pr skill adoption run on 2026-10-07 each fast-forward merge into
assembly cost a merger subagent about 86-95k tokens to run `git merge
--ff-only`, compare a SHA and push. A fast-forward has no content decision in it,
so the separate context buys nothing there.

## Current Verified State

At the pre anchor, `workbench/skills/implement-spec/SKILL.md` step 5 says:
"Use a merger subagent to merge verified results into assembly one at a time
and check the resulting assembly SHA before releasing dependent Tasks." It
draws no line between a fast-forward and a true merge. The skill was installed
on 2026-10-06 as an owner-invoked workflow (`disable-model-invocation: true`)
and is declared under `maintainerSkills` in `workbench/manifest.json`, so it
never ships to a room. Its Wiki draft lives at
`workbench/wiki/skills-draft/main-workflow/implement-spec.md` and says only
that serialized merges check the resulting candidate. No test under `tools/`
or `workbench/tools/` names implement-spec, so nothing pins step 5's wording.

## Desired Behavior

1. Step 5 says the Dispatcher merges a verified result itself only when
   `git merge-base --is-ancestor <assembly tip> <worker commit>` succeeds, using
   `git merge --ff-only`, then confirms the new local tip equals the Worker's
   commit, pushes, and confirms the remote assembly tip equals it too.
2. Any other case (not an ancestor, a failed fast-forward, a push rejected or a
   read-back mismatch) goes to the merger subagent, as today.
3. The skill's Wiki draft matches the new step.

## Decisions And Contracts

- **Target (owner, 2026-10-07).** This Spec targets LLM_Workbench itself:
  implement-spec is a maintainer skill, so the change touches no template and
  reaches no room.
- **Process unchanged (owner, 2026-10-07).** The defined process in the
  Runbook's [Role And Stance Coordination](../../../RUNBOOK.md#role-and-stance-coordination)
  runs this Spec as is: a Director dispatches a Spec Planner then a Spec
  Manager per Spec, each Spec Manager runs implement-spec on its one Spec, and
  many run in parallel. This Spec does not change that process; it changes only
  who performs a fast-forward merge inside implement-spec's step 5.
- The Dispatcher still does not implement. A fast-forward moves a ref to a
  commit a Worker already verified; it writes no content.
- One writer per branch stays true: the Dispatcher and the merger subagent never
  merge into assembly at the same time.

### Open owner choices

- **Y-1. Approval of the step 5 wording change.** implement-spec is the
  owner's installed workflow, so changing its step 5 needs the owner's approval
  of the wording. Recommendation (not an owner answer): approve step 5 as
  Desired Behavior 1 and 2 state it.
- **Y-2. Skill wording only, or a runtime command.** The fast-forward can be
  four Git commands named in the skill, or a runtime command that runs and
  checks them. Recommendation (not an owner answer): skill wording only; the
  four commands are short enough to name in the skill, and a command can follow
  if agents get them wrong.

## Non-Goals

- Merges into `integration`, which stay outside implement-spec's run.
- Any change to the role process in the Runbook's Role And Stance
  Coordination.

## Dependencies And Blockers

The two open owner choices above. No other Spec blocks this one.

## Vertical Implementation Slices

No Task is cut. Tasks are cut from live Actuality at activation with
`/to-tasks`. The intended direction is one slice: the skill step and its Wiki
draft, plus a runtime command only if the owner chooses one.

## Acceptance Criteria

- [ ] Step 5 of implement-spec states the fast-forward condition, the four checks and the fallback to the merger subagent.
- [ ] The skill's Wiki draft states the same rule.
- [ ] Any test that pins step 5's wording when the Task is cut is updated and passes.
- [ ] Named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

`tools/test-skill-catalog.mjs` for wording pins. The behavioral check is the
next implement-spec run: token use per fast-forward merge.

## Verification Procedure

The catalog and Wiki tests, then the Full suite on a committed candidate.
Record actual commands and results in this Spec.

## Documentation Impact

`workbench/skills/implement-spec/SKILL.md` and its Wiki draft.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-07 | none | Authored at the Map step from an implement-spec retro at integration d0fb161c1ff36caf936758b7492f7ef7fce8176e. | Map only; implement-spec step 5 was read at that tip; no runtime proof claimed. | This Spec. | Owner decision, Plan, implementation and proof remain. |
| 2026-10-07 | none | Revised from the owner grilling of 2026-10-07: carries the LLM_Workbench target (implement-spec is a maintainer skill) and the note that the defined role process is unchanged; the step 5 wording approval and the skill-or-command choice stay open with recommendations. | Spec text only; the manifest's `maintainerSkills`, implement-spec step 5, its Wiki draft and the absence of a test naming implement-spec were checked at d0fb161c1ff36caf936758b7492f7ef7fce8176e; no runtime proof claimed. | This Spec. | Two owner choices, Plan, implementation and proof remain. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

None known.

## Supersession

- Supersedes: none
- Superseded by: none
