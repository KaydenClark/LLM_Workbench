---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner-confirmed Promote Decision design and S-005C source delivery, 2026-10-07
source_paths:
  - workbench/skills/promote-decision/SKILL.md
  - workbench/manifest.json
  - workbench/grill-board/README.md
  - workbench/skills/grill-me/SKILL.md
  - workbench/specs/S-005C-promote-confirmed-decisions/SPEC.md
  - workbench/docs/adr/proposed/001A-promote-publishes-confirmed-documentation-specs-and-task-plans-before-implementation.md
  - tools/test-skill-catalog.mjs
  - tools/test-core-composition.mjs
last_verified: 2026-10-07
---

# Promote Decision

The [Promote Decision skill](../skills/promote-decision/SKILL.md) takes one
confirmed decision from a saved source into shared Workbench records and plans.
The receiving agent needs the project root, source pointer, decision ID and
confirmed revision. The source carries its readback, rationale, corrections and
endpoint, so a cold start can recover the assignment without the earlier chat.

The coordinator delegates Record to a `to-docs` Worker, Map to a `to-spec`
Worker and Plan to a `to-tasks` Worker. A publisher follows the existing gates
between stages. This prevents later planning from depending on a record still
held in an unpublished branch. Corrections return to the authoring Worker;
shared owners have one writer. A nearer endpoint limits the run, and published
plans leave implementation Tasks unclaimed.

The [Grill Board route](../grill-board/README.md#agents-how-to-process-a-batch)
starts one run for each individually confirmed current item and revision.
Dependent decisions and shared owners are ordered; batch membership does not
combine the decisions. At a [grill-me session's end](../skills/grill-me/SKILL.md#4-endpoint),
the final confirmed readback supplies the saved pointers for one run per
decision. Pending and stale answers remain outside that frontier.

The core [Promote primitive](skill-promote.md) still reconciles selected claims
and composes `save`. Promote Decision is declared as a maintainer skill beside
`implement-spec`, reachable through the Workbench's lane adapters. It is not
installed into generated rooms or personal Core catalogs. Generic templates
retain the shared verb meanings and core selected-claim route; this first
delivery's orchestration route belongs to the LLM Workbench.

Source checks hold the stage order, registration and caller bounds. The public
runtime fixture checks stage publication, a docs-only boundary, source
corrections and pending preservation, unfinished-code isolation, and retry
from fresh containment. Its merge authorization is simulated. Those checks
establish neither live GitHub publication nor autonomous coordinator behavior.
An agent trial supplied an explicit skill path; ordinary-prompt model discovery
remains unproven by these source and route checks.
The delivery gates and behavioral evidence belong to the
[Promote Confirmed Decisions Spec (S-005C)](../specs/S-005C-promote-confirmed-decisions/SPEC.md).

## History

- 2026-10-07: created for the confirmed one-decision maintainer operation.
