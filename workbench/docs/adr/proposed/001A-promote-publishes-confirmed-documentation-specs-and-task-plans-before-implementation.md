---
date: 2026-10-07
canonicalized_in:
  - workbench/skills/promote-decision/SKILL.md
  - LEXICON.md
  - RUNBOOK.md
---

# Promote Decision delegates one confirmed decision and publishes each stage

The owner confirmed a thin `promote-decision` skill for one decision per
invocation. It cold-starts from a saved source pointer, ID and confirmed
revision, recovering the readback, rationale, corrections, scope and endpoint.
Its flow is Confirm -> Record -> Publish -> Map -> Publish -> Plan -> Publish.
The coordinator orchestrates explicit subagent Workers: Record uses `to-docs`,
Map uses `to-spec`, and Plan uses `to-tasks`. A publisher follows the existing
review and merge gates; corrections return to the authoring Worker. Each stage
reaches integration before dependent actions begin. A nearer endpoint limits
the run, and implementation follows its own workflow.

Why: A confirmed decision needs durable owners and shared availability before
other agents can depend on it. Saved pointers allow continuation without the
originating chat; live owners, PR state and containment prevent duplicate work.

Alternatives: The earlier broad draft made `/promote` the parent workflow.
The confirmed design instead retains that selected-claim primitive and its
`save` composition, adding a Workbench-only maintainer skill beside
`implement-spec`. Combining a batch into one promotion would blur the source
revision and publication boundary of its separate decisions.

Consequences: The Grill Board dispatcher starts one run per individually
confirmed current item/revision, ordering dependencies and shared owners while
allowing compatible decisions to advance. Grill-me saves decision pointers at
session end after the final confirmed readback and hands off one run per
decision. Pending, deferred and stale answers remain outside the frontier.
No background scheduler, new decision store or automatic agent-refresh service
is part of this design. Generic meanings remain shared; the first orchestration
route is local to the LLM Workbench and is not installed as Core.

Provenance: The owner-confirmed Promote Decision skill and entry-point design
of 2026-10-07, followed by explicit delivery authorization. This proposed ADR
is an authored account of that confirmed design; the owner has not separately
confirmed this record's wording. The delivery owner is
[Promote Confirmed Decisions (S-005C)](../../../specs/S-005C-promote-confirmed-decisions/SPEC.md).
The existing [confirmation decision (DDR-000C)](../../ddr/000C-confirming-a-concept-authorizes-the-agents-to-carry-it-to-its-endpoint.md)
supplies the endpoint boundary. S-01B's earlier primitive evidence and pending
owner Human QA remain separate.
