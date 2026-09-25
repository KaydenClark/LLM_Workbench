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
the assembled Spec in a separate context. The Dispatcher, and every agent that
implemented a Task in the candidate, cannot give that approval. Passing lets
the Spec branch merge into `integration`. Failing is diagnostic: it creates
corrective Tasks under the still-open Spec, then a fresh candidate. The gate is
a step in the harness's own merge-preparation workflow, not GitHub-enforced
branch protection. A Task that advances the Blueprint directly has no Spec: its
Dispatcher sends the Worker from `integration`, verifies the result and merges
it for containment, and the Director checks it on `integration`.

**No Task has a review or approval gate.** A Task is one attempt at one step.
Its Worker self-checks that its claims are valid and backed by proof before
handing back, and the Dispatcher reads the report and chooses the next step.
Merging a Task is coordination and containment, not QA. A Task that misses its
step is not reopened; a new Task fixes it.

The **Human QA gate** runs from `integration` into `main` and belongs to the
owner, who is the human above the Director and not the Director. It follows the
Director's approval of every Spec in the version, or the Director's escalation
of their blockers, and ends in the owner-only merge into `main`. What Human QA
consists of is each project's own choice; the default is the owner's approval
of that merge. In this repository it is the owner monitoring the process,
asking the Director questions and starting the next steps. A Spec closes, is
captured into the Wiki and has its transient records deleted only after its
change is verified on `main`.

Considered and rejected: a review or approval gate on each Task, or on each
grouped slice of Tasks. A Task is deliberately too small to demonstrate a
Spec's destination, so such a gate can pass repeatedly while the destination
stays unmet, and a second check on every step slows the run without checking
the thing that matters. The owner's framing was to run to the destination the
Spec sets, then check that it was reached.

Considered and rejected: making the Director's approval and Human QA one act.
The Director is a role an agent is meant to hold; folding the two together
would quietly remove the owner from the gate as soon as an agent takes it.

Considered and rejected: owner Human QA of each Spec as it arrives on
`integration`. Checking parallel Specs one at a time is inefficient and cannot
judge the integrated whole, which is what `main` receives.

Consequences: narrows
[ADR-0037](0037-independent-review-at-integration.md). Its separate-context
review before branches combine at `integration` applies to the Spec branch; a
direct Blueprint Task is contained in `integration` by its Dispatcher and
checked there by the Director before Human QA. The terminal verification named
in proposed
[ADR-000G](proposed/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md)
reads through these gates. `AGENTS.md` and `RUNBOOK.md` still describe review
of each integration candidate and do not yet name the Director, Dispatcher or
Worker. That is the recorded implementation gap
[S-00P](../../specs/S-00P-workflow-canon-rework/SPEC.md) TK-002 and TK-003
close, not undetected drift. The board's Needs review lane holds work handed
back and waiting for the Director's approval; the lanes themselves belong to
proposed
[ADR-000E](proposed/000E-the-frontier-is-the-active-landscape-and-taskboard-renders-it.md)
and a board Spec not yet written.

Provenance: foundation answer FND-Q14 (2026-09-11, corrected 2026-09-12) set
the two gates. The roles, the Task rule and version-level Human QA come from the
owner's separate-context review boundary grilling, SCR-1 to SCR-8, on
2026-09-24, whose full readback the owner confirmed the same day. Both notes are
untracked working material named as origin, not durable evidence; their
questions and answers are recorded in the
[grilling destination audit ledger](../../wiki/grilling-destination-audit-ledger.json).
The same answers replace the "not batched by release" clause FND-Q14 carried.

## Promotion status

Accepted on 2026-09-24 at the owner's direction, amended from the 2026-09-12
proposal with the SCR answers above. The owner's original request was to make
an ADR or finish the promotion of the place the decision was first made; this
record is that place.
