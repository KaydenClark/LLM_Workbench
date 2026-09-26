---
date: 2026-09-12
canonicalized_in:
  - BLUEPRINT.md
  - LEXICON.md
  - AGENTS.md
  - RUNBOOK.md
---

# Work passes two QA gates: spec branch to integration and integration to main

QA is two gates at two boundaries, held by two different parties. Neither gate
sits on a single Task.

The **Spec QA gate** runs from the Spec branch into `integration`. When every
Task in a Spec has been handed back, the Spec's Dispatcher verifies the whole
Spec against its destination and the combined results of its Tasks, doing that
QA itself or dispatching it and owning the result. The Director then approves
the immutable assembled candidate in a separate context before it combines
into `integration`. The Dispatcher, and every agent that implemented a Task in
the candidate, cannot give that approval. Passing lets the Spec branch merge
into `integration`. Failing is diagnostic: it creates corrective Tasks under
the still-open Spec, then a fresh candidate. The gate is a step in the
harness's own merge-preparation workflow, not GitHub-enforced branch
protection. On the board, Needs review holds an assembled Spec waiting for the
Director's approval, and Complete holds approved work waiting for closure.

**No Task has a review or approval gate.** A Task is one attempt at one step.
Its Worker self-checks that its claims are valid and backed by proof before
handing back, and the Dispatcher reads the report and chooses the next step.
Merging a Task is coordination and containment, not QA. A Task that misses its
step is not reopened: its `TASK.md` stays the record until the Spec is cleaned
up into the features Wiki, its card returns to In progress, its worktree is
removed, and a new Task named for its objective fixes it.

The **Human QA gate** runs from `integration` into `main` and belongs to the
owner, who is the human above the Director and not the Director. Its normal
cadence follows the Director's approval of the version's Specs, or the
Director's escalation of their blockers, and ends in the owner-only merge into
`main`. That cadence is the described default, not the only permitted time:
the owner chooses when to QA, whether at a useful milestone, for one valued
Spec or on an important escalation. Approval stays a per-Spec, content-bound
owner record; monitoring, observations and passing reviews never approve a
Spec, and an approval never covers a Spec it does not name. What Human QA
consists of is each project's own choice; the default is the owner's approval
of the merge into `main`. In this repository it is the owner monitoring the
process, asking the Director questions and starting the next steps, alongside
that recorded approval. No command approves a whole version at once.

No Git merge closes a Spec. Closure follows the order in the
[closure-capture transition contract](../../specs/S-00J-spec-qa-gate-at-integration/SPEC.md):
reviewed delivery on `integration`, owner approval, verification of the
approved change on `main`, then `complete`, then features Wiki capture at that
closure point, then retirement, then discard of the transient records.

**Direct Blueprint Tasks: destination design.** A Task that advances the
Blueprint directly has no Spec. As the owner answered it, its Dispatcher sends
the Worker from `integration`, verifies the result and merges it for
containment, and the Director checks it on `integration`; no role works from
`main`. That route is the destination design. It does not replace or bypass the
operative gate: until [S-00P](../../specs/S-00P-workflow-canon-rework/SPEC.md)
TK-002 rewrites `AGENTS.md`, every candidate, a direct Task included, still
passes `AGENTS.md`'s separate-context review before branches combine into
`integration`, and reconciling the destination route with that gate stays open
in S-00P.

Considered and rejected: a review or approval gate on each Task, or on each
grouped slice of Tasks. A Task is deliberately too small to demonstrate a
Spec's destination, so such a gate can pass repeatedly while the destination
stays unmet, and a second check on every step slows the run without checking
the thing that matters. The owner's framing was to run to the destination the
Spec sets, then check that it was reached.

Considered and rejected: making the Director's approval and Human QA one act.
The Director is a role an agent is meant to hold; folding the two together
would quietly remove the owner from the gate as soon as an agent takes it.

Considered and rejected: fixing Human QA to a single mandatory trigger, either
each Spec as it arrives on `integration` or only the completion of a whole
version. The owner described the version cadence as how he envisions the
built Workbench running, and he also chooses his own review points; neither
reading may remove the other.

Consequences: extends
[ADR-0037](0037-independent-review-at-integration.md), whose separate-context
review of the immutable candidate before branches combine at `integration`
remains the operative gate for every candidate; the Director's approval of an
assembled Spec is that review. The terminal verification named in proposed
[ADR-000G](proposed/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md)
reads through these gates. `AGENTS.md` and `RUNBOOK.md` still describe review
of each integration candidate and do not yet name the Director, Dispatcher or
Worker. That is the recorded implementation gap S-00P TK-002 and TK-003 close,
not undetected drift. The board lanes themselves belong to proposed
[ADR-000E](proposed/000E-the-frontier-is-the-active-landscape-and-taskboard-renders-it.md)
and a board Spec not yet written.

Provenance: foundation answer FND-Q14 (2026-09-11, corrected 2026-09-12) set
the two gates. The roles, the Task rule, the direct-Task route and the version
cadence come from the owner's separate-context review boundary grilling, SCR-1
to SCR-8, on 2026-09-24, whose full readback the owner confirmed the same day
with "yes, this looks good. Lets promote." The owner-selected Human QA timing
comes from the 2026-09-26 Director assignment recorded in S-00J and S-00P, and
the closure order from S-00J's contract. The grilling notes are untracked
working material named as origin, not durable evidence; their questions and
answers are recorded in the
[grilling destination audit ledger](../../wiki/grilling-destination-audit-ledger.json).
The SCR answers replace the "not batched by release" clause FND-Q14 carried
with the version cadence as default, not as a mandate.

## Promotion status

The owner approved promotion on 2026-09-24. The first promotion candidate
(`e318f14`, never landed) placed Human QA only after a whole version, closed
and captured a Spec before main verification, and put the Director's check of
a direct Task after `integration` in place of the operative gate. This record
was moved out of `proposed/` on 2026-09-26 with those three placements
corrected as above; the owner's answers themselves are unchanged.
