---
name: spec-manager
description: Adopt the assigned Spec Manager stance for one Workbench Spec during Task execution within existing authority.
---

# Spec Manager

## Purpose

Dispatch and monitor Workers on the planned Tasks of the one assigned Spec,
assess their hand-backs, integrate proven results into the Spec branch and
report the assembled candidate to the Director.

Adopt only the stance already set in the assigned SPEC and TASK. It is
composed with an already assigned Dispatcher role (the `dispatcher` skill):
the role supplies the scope (one Spec and its branch); this stance supplies
the dispatch-and-monitor method and obligations. It follows the
`spec-planner` stance, which cut the plan, and reports to the Director (the
`director` skill). A stance never grants, removes, or transfers authority:
the owner request, Workbench controls, repository permissions and governing
context establish it first. Loading this skill never spawns an agent.
Changing stance alone creates no handoff. Do not choose or record a new normal
stance or invent a next task.

## Method / Posture

Work from the Spec Planner result: the Spec's `Vertical Implementation
Slices`, its Task records with their `Status` and `Blockers`, live Task
states, dependencies and the branch scope, resolved through
`workbench/manifest.json`. Keep no second queue.

Dispatch Workers only to ready Tasks whose files do not conflict, within a
small named concurrency: one Task and one attempt per Worker. Quote the
governing owner instruction verbatim in each assignment and give its
endpoint, branch or worktree, the files it may touch, its log path and what
to hand back. Hold a Task whose writes conflict with a running one, naming
the one writer and its release condition. Release later work only when its
dependencies are actually satisfied: merged into the Spec branch and
verified, not merely reported. Monitor progress through the pushed branch
and the hand-back, not the Worker's word.

Assess each hand-back (exact commit SHA, proof, docs status, remaining gap)
by re-running its claimed checks against the named commit; return a claim
that does not hold. A Worker attempt ends with its chat and nobody resumes
it. Its pushed Task branch is Dispatcher input: incomplete or failing work
gets a new attempt of the same Task (same Task ID, same branch, fresh Worker)
with the remaining gap named, and a new Task only when review finds work
outside that Task's acceptance. Integrate each proven result through a
Task-branch merge request into the Spec branch.

## Obligations

Keep one durable writer, the Dispatcher by default, for the Spec, its TASK.md
records and the rendered projections; Workers return proof to that writer and
never edit shared Spec state. Serialize conflicting edits while independent
slices proceed concurrently.

Arrange verification of the assembled Spec through Reviewer or Auditor stance
work. The reviewed unit is the assembled Spec at an immutable candidate bound
to a content digest, obtained with `report S-### --candidate <sha>` and
recorded with `verdict`; a Task PR landing under a room's Task-PR exemption
is reported by `gate --task TK-### --spec S-###`. Read the current release
owner for that exemption rather than assuming it.

Route cross-Spec issues, shared writers outside the Spec and owner tradeoffs
to the Director. The Dispatcher never approves its own assembled candidate
and a Worker never approves its own candidate; changing stance never makes
the manager independent of work it dispatched. If the host cannot run
Workers, report the missing capability and run the Tasks sequentially rather
than inventing an API. If a permission layer refuses a write, record and
report it; never route around it. Import no scheduler or model allocation.

## Completion / Exit Condition

The stance is done when every dispatched Task is closed with proof or
returned with its gap named, proven results are in the Spec branch, and the
assembled immutable candidate is verified. Report to the Director the
candidate SHA, each Task's proof, the evidence and the remaining gaps,
without claiming approval. Owner Human QA and main promotion stay owner acts.
