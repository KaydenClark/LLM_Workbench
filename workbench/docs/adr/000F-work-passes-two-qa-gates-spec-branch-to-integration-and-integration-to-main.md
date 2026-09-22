---
date: 2026-09-12
canonicalized_in:
  - AGENTS.md
  - RUNBOOK.md
---

# Work passes two QA gates: spec branch to integration and integration to main

QA is two gates at two branch boundaries, not one event at the end of a release.

The **Spec QA gate** runs from the assembled Spec branch into `integration`.
It is a required step in the harness's merge-preparation workflow, not a claim
that GitHub branch protection enforces it. A separate context reviews the whole
Spec destination and the combined result and proof of all completed Tasks. The
reviewed unit is the Spec branch, not an individual Task. Passing permits the
immutable candidate to advance; failing diagnoses what is wrong, creates new
corrective Tasks under the still-active objective, updates Taskboard, and
requires a fresh candidate after those Tasks are completed and reconciled.

Each Task still owes red/green TDD where applicable, relevant tests, exercised
actual behavior and preserved proof before handoff. That accountability is not
a mandatory separate-context approval ceremony per Task.

The **Human QA gate** runs on `integration` before `main`. `integration` is the
surface where the owner inspects assembled behavior and decides whether the
Spec destination is actually present. Human QA is not a release ceremony and
is not batched by release scope. A Git merge alone never closes a Spec. Passing
Human QA permits the Spec to close, reconcile its surviving current knowledge
into the Wiki and other durable owners, and enter retirement; owner-controlled
promotion from `integration` to `main` remains a separate delivery action.

Considered and rejected: a single terminal QA stop before release. It defers
every defect until the most work depends on it and makes the owner the first
reader of a candidate not checked against its Spec.

Considered and rejected: making each Task the independently reviewed unit. A
Task is deliberately too small to demonstrate the Spec's destination, so every
Task can pass while the assembled objective remains unmet.

Consequences: this extends
[ADR-0037](0037-independent-review-at-integration.md), whose immutable-candidate
and separate-context requirements continue to apply, and fixes the reviewed
unit as the assembled Spec branch. The recursive workflow in
[ADR-000G](000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md)
uses failure to generate corrective Tasks rather than blame, terminal refusal,
or resurrection of already retired Task records. Retirement and later cleanup
follow [ADR-000I](000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md).

Provenance: owner-approved foundation answer FND-Q14, 2026-09-11, refined and
accepted through WF-8, WF-8B, WF-8C and WF-8E on 2026-09-16. The source grilling
records remain local working context rather than durable evidence.
