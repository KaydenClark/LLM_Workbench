---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner requested one durable Wiki article per Spec on 2026-09-19
source_paths:
  - workbench/specs/S-00C-project-evidence-and-blueprint-grilling/SPEC.md
  - workbench/tools/project-evidence.mjs
  - tools/test-project-evidence.mjs
  - RUNBOOK.md
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# S-00C: Project Evidence And Blueprint Grilling Preparation

The project-evidence preparation seam turns explicitly named project sources into a bounded provisional JSON grilling note. It retains source identities and uncertainty, then presents owner questions without answering them.

Evidence preparation does not create active ADRs, accepted Specs or implementation authority. Source bytes, caller assertions and recorded decisions have different roles. The owner still supplies decisions through the applicable workflow; a prepared question is not a locked answer.

The installed runtime exposes `prepareEvidence` through `project-evidence.mjs prepare`. The Runbook owns the current invocation and input contract; source and focused tests own validation behavior.

## Historical proof and limits

The original Puffer Pond preparation recorded four source records and two open questions. Later demonstration interpretations were attributed to the manager, not presented as an owner interview. The original suite report disclosed a stale documented-command selector and its correction. This single preparation is not proof of general agent reliability or unrestricted evidence ingestion.

## Evidence and Sources

The source record and named owners were read at `bc370fe742d5ddb8348bf361fccea31205f6cee7`. Historical results above are attributed to that record; they were not rerun for this article. Recover its exact original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-00C-project-evidence-and-blueprint-grilling/SPEC.md`.

- [workbench/specs/S-00C-project-evidence-and-blueprint-grilling/SPEC.md](../../../workbench/specs/S-00C-project-evidence-and-blueprint-grilling/SPEC.md)
- [workbench/tools/project-evidence.mjs](../../../workbench/tools/project-evidence.mjs)
- [tools/test-project-evidence.mjs](../../../tools/test-project-evidence.mjs)
- [RUNBOOK.md](../../../RUNBOOK.md)

## History

- 2026-09-19: Reconciled into one Spec article on owner direction. Original source and proof remain intact; this article does not authorize retirement or discard.
