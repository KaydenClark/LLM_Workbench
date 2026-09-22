---
date: 2026-09-12
canonicalized_in:
  - BLUEPRINT.md
  - AGENTS.md
  - LEXICON.md
  - RUNBOOK.md
---

# Blueprint, Spec and Task are three altitudes of one delivery chain

The Workbench workflow is **Idea -> Align through grilling -> confirmed design
concept -> Blueprint -> recursive Spec/Task delivery**.

Align begins with owner intent. Grilling, research, brainstorming and wayfinding
resolve only named uncertainties that could change the destination, scope,
feasibility or proof. Align ends when owner and agent explicitly confirm the
shared design concept. A prototype is optional after Blueprint and before Spec
when plausibility remains uncertain; it is not a standard phase. Its learning
continues, while its code continues only after meeting ordinary implementation
and verification requirements.

The **Blueprint** owns the product-level destination and complete intended
journey -- what counting to 100 means. It describes every desired rung,
including future capabilities not yet entering delivery. It is not itself a
PRD for one implementation increment.

A **Spec** is a mini-PRD for one scoped objective with its own destination -- a
particular number to reach. It is derived from a Blueprint need together with
active ADRs, verified Actuality/evidence and required checks. Many Specs stack
into the journey that realizes the Blueprint.

A **Task** does the counting: it is one bounded executable thin vertical path
that advances or repairs an existing Spec destination. Scope and destination,
not effort or Task count, decide whether a new Spec exists. Missing part of an
existing destination remains corrective Task work even when several Tasks are
needed; a genuinely distinct product or investigative destination warrants a
new Spec.

The recursive delivery loop is: create Spec -> create Tasks -> update Taskboard
-> pick up a hot Task -> implement -> QA/verify -> commit and push the Task
branch -> reconcile it into the Spec branch -> retire the Task -> repeat until
the Spec is assembled -> separate-context whole-Spec QA/verify -> create
corrective Tasks when needed -> repeat until approved -> integrate the Spec.
Taskboard is the hot projection of canonical Task state, so an objective is
visibly active when it has active Tasks; Taskboard is never a second tracker.

Considered and rejected: giving Blueprint the product-level PRD function while
treating a Spec only as a journey step. That collapses two altitudes. Blueprint
owns the grand destination; each Spec performs the PRD-shaped role for one
smaller destination.

Considered and rejected: deriving Specs from Blueprint alone. Desired state
without active decisions and verified Actuality can repropose landed work or
contradict accepted architecture.

Considered and rejected: deciding Spec versus Task by one-context effort alone.
Five corrective Tasks can still repair one existing destination, while a small
investigation can warrant its own Spec because it has a distinct objective.

Consequences: the two QA gates are defined by
[ADR-000F](000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md),
Task artifact form by
[ADR-000H](000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md),
and transient Spec/Task lifecycle by
[ADR-000I](000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md).
The Blueprint must describe the whole ladder, but only Specs needed to establish
the currently authorized workflow enter delivery; future rungs may remain
planned in the Blueprint.

Provenance: owner-approved foundation answers FND-Q01 and FND-Q19, 2026-09-11,
refined and accepted through WF-1 through WF-12 on 2026-09-16. The source
grilling records remain local working context rather than durable evidence.
