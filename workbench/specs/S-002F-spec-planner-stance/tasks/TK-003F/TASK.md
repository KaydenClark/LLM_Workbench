# TK-003F - Prove the planning scenario with a fresh-context Dispatcher and assemble S-002F

**Task ID:** TK-003F
**Spec ID:** S-002F
**Slice:** Prove the planning scenario with a fresh-context Dispatcher and assemble S-002F
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-003D, TK-003E
**Destination:** spec-acceptance: Hand the plan and its open gates to the Dispatcher using Spec Manager. Surface cross-Spec dependencies to the Director rather than enlarging the Spec boundary or duplicating another lane.
**Planned verification:** One fresh-context agent, given only the delivered `workbench/skills/spec-planner/SKILL.md` text, the path of a disposable fixture room outside this repository with one planned record-backed Spec and two scripted Worker drafts, plans the Spec: it inspects the fixture's live source and Spec before cutting, allocates IDs with `next-id`, groups small complete-path Tasks with a named writer per shared file and says which may run concurrently, keeps the drafts' proposed Tasks distinct from executable assignments, rejects the out-of-scope draft item and the conflicting-writer overlap, activates once with `convert-tasks --activate`, and hands the plan with its open gates to Spec Manager while surfacing the cross-Spec dependency to the Director. Assembled proof: full AGENTS suite on the committed candidate, self-drift pre/post receipts, guardrail before/after, `render` and `doctor` with no blocking finding, and the bounded semantic self-drift readback.

## Outcome

The Spec's Testing Seams scenario is observed once from the delivered
artifacts, and its observation and limits are recorded in the Spec evidence
and the article's "Verified behavior and limits". The assembled candidate is
green on the full suite and ready for separate-context review.

## Scenario Setup (scripted by the Dispatcher, outside the repository)

- A disposable Git room under the lane scratchpad, initialized as a Workbench
  room by the checkout's own layout tool, with a tiny application (two or
  three source files and one test) and one planned record-backed Spec whose
  Desired Behavior needs three or four small slices across those files.
- Two scripted Worker drafts in a `drafts/` folder outside the Spec: draft A
  proposes two Tasks that both edit the same shared module without naming a
  writer; draft B proposes one in-scope Task plus one Task that belongs to a
  different Spec (an out-of-scope request the planner must route, not cut).
- The agent receives the skill text, the room path, the Spec ID and the
  instruction that its two Workers have already returned the drafts. It is
  told nothing about the expected answer. The Dispatcher scripts the owner
  in one turn if the agent asks a genuine owner question.

## Required Observations

- Inspected live source and the Spec before cutting; used `next-id` for every
  ID; ran `convert-tasks --activate` once; wrote `Latest event` and `Next
  gate` itself.
- Published Tasks are small, complete-path, each with acceptance, proof,
  dependencies and one named writer for the shared module; concurrency groups
  are stated.
- The out-of-scope draft item is not cut; it is surfaced as a cross-Spec
  dependency for the Director. The conflicting-writer overlap is resolved by
  one writer or one merged Task, not by two Tasks racing.
- The hand-off names Spec Manager, the open gates and what a proposed Task
  still lacks to be an executable assignment. The agent does not dispatch
  execution or approve anything.
- Fixture room `doctor` reports no blocking finding after the plan; the
  fixture stays outside this repository.

## Done Criteria And Closing Proof

- Evidence row records the fixture pin, what the agent did and did not do,
  each observation above marked observed or not observed, and the limits: one
  run, one model, scripted owner, scripted Worker drafts (no live Workers).
  No owner approval and no agent-outcome improvement is claimed.
- Article "Verified behavior and limits" and example reconciled from that row.
- Suite log first line names the committed candidate with `dirty: []`;
  self-drift pre and post receipts and guardrail before/after logs are named
  with their paths and result summary.
