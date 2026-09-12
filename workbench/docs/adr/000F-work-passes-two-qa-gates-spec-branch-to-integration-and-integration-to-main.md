---
status: proposed
date: 2026-09-12
canonicalized_in:
  - AGENTS.md
  - RUNBOOK.md
---

# Work passes two QA gates: spec branch to integration and integration to main

QA is two gates at two branch boundaries, not one event at the end of a release.

The **Spec QA gate** runs from the working branch into `integration`. The merge
request itself triggers it. It verifies that every Task in the Spec was
completed and that the whole branch is up to Spec. Passing merges the branch;
failing denies the merge. The reviewed unit is therefore the **Spec branch**,
not a single Task.

The **Human QA gate** runs from `integration` into `main`. `integration` *is*
the Human QA branch — the place the owner inspects real assembled behavior.
Human QA is not a release ceremony and is not batched by release scope; work
arrives at the gate when it arrives.

Considered and rejected: a single terminal QA stop before release. It defers
every defect to the moment when the most work depends on it, and it makes the
owner the first reader of code that no gate has checked against its own Spec.

Considered and rejected: making the reviewed unit the Task. A Task is a slice
deliberately too small to demonstrate the Spec's acceptance, so a task-level gate
can pass repeatedly while the capability remains unmet.

Consequences: extends
[ADR-0037](0037-independent-review-at-integration.md), whose independent-review
requirement at integration continues to apply, and fixes the reviewed unit as
the Spec branch wherever earlier records described it as task-level. The
terminal QA stop referenced by the end-to-end workflow in
[ADR-000G](000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md)
reads through these two gates. What a failing gate returns to implementation,
and in what state, is open as FND/WF work and is not decided here.

Provenance: owner-approved foundation answer FND-Q14, 2026-09-11, recorded as an
approved answer in the live grilling note
`workbench-foundation-rework-2026-09-11`, untracked working material named as
origin rather than durable evidence.

## Promotion status

This record is `proposed`. `AGENTS.md` and `RUNBOOK.md` remain live Canon as
written until the owner accepts it, and `ADR-0037` is unmodified.
