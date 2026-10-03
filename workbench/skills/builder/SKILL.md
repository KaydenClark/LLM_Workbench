---
name: builder
description: Adopt the assigned Builder stance for one Workbench task within existing authority.
---

# Builder

## Purpose

Deliver the assigned result with useful verification and truthful documentation.

Adopt only the stance already set in the assigned SPEC and TASK. A stance
never grants, removes, or transfers authority: the owner request, Workbench
controls, repository permissions and governing context establish it first.
Loading this skill never spawns an agent. Changing stance alone creates no
handoff; continuation uses the existing Workbench owners when execution crosses
a meaningful boundary. Do not choose or record a new normal stance or invent a
next task. Troubleshooting stance selection is outside this skill.

## Method / Posture

Read the assigned packet and trace source and tests before changing behavior.
Name the assigned result, its acceptance boundary, the smallest change and the
check that would disprove it. Trace relevant callers and tests before editing;
use the smallest correct change and investigate missing details within the Task.
The plan is useful when it makes the intended result and its proof explicit,
not when it creates another planning artifact.

Resolve the assigned packet and support lanes through `workbench/manifest.json`.

## Obligations

Compose `/implement` and `/tracer-bullet` when building behavior. Every composed helper inherits the assigned Task and the caller's narrower
endpoint; helper work-selection, planning, dispatch or publication steps cannot
extend that scope. An explicit assignment takes precedence over a helper's
pickup route. Use tracer-bullet to check the completeness of this Task, not to cut or
assign more work. Neither a helper nor a stance change authorizes spawning.

Use red/green TDD at the public seam: preserve the expected failure, make the
smallest repair, then run the targeted checks and the project's required suite.
Name the exact commands, results and candidate they verify. Source-text assertions prove the wording contract, not agent behavior.
If a required behavioral check cannot run, report the missing proof and what
would establish it; a green structural check cannot substitute for it.

Use `/to-docs` for changed truth: reconcile capability evidence and current
Task state into the assigned owners, explanatory context into the Wiki, and
render the generated projection through its native tool. Preserve historical
proof and unrelated dirty work. If no docs change is needed, record
`Docs checked; no update needed` with the reason.

Ensure the separate-context `/code-review` gate before integration; earlier
independent review is optional. A self-review is useful while building but
cannot satisfy that gate. Follow the current routing, authority, review, Git
and owner-decision boundaries in the Contract. Stop at the caller's endpoint,
even when a helper describes further delivery. Investigate ordinary engineering
issues within scope; surface only genuine owner decisions, unavailable resources
or unresolved blockers under the governing gate. Do not manufacture a handoff.

## Completion / Exit Condition

Report the scoped outcome so another reader can verify and continue it:

- **Actual result:** what changed and why, and the exact achieved output or
  candidate revision; distinguish implemented work from delivered work.
- **Evidence:** the observed checks and their results, including failures,
  unrun checks and environment limits. Name the separate review result only
  when one exists for the candidate being reported.
- **Documentation state:** the owning records updated, or the explicit reason
  no update was needed; report the Task's actual state.
- **Remaining risk:** known limitations, side effects, unmet acceptance or
  review gates, and the next executable action or blocker inside the assignment.

If acceptance or a required check is unmet, keep the Task incomplete and leave
that gap in its existing owner; a candidate ready for review is not a closed
Task. The scoped output is complete only when its acceptance and applicable
gates are met and its owning docs and state are accurate. Never equate implementation with release.

The [verification scenario](references/verification.md) distinguishes the
source-contract regression from a fresh-context behavioral observation.
