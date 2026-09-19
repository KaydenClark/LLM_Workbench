---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner requested one durable Wiki article per Spec on 2026-09-19
source_paths:
  - workbench/specs/S-049-assignment-ownership-and-coordination-record/SPEC.md
  - skills/carry/SKILL.md
  - workbench/manifest.json
  - tools/test-skill-catalog.mjs
  - workbench/tools/workbench-layout.mjs
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# S-049: Assignment Ownership And Coordination Records

The Carry skill owns an assigned Spec or Task through the endpoint already authorized: recover context, execute, verify, reconcile records and deliver to the permitted integration boundary. It cannot expand the assignment or replace an owner-only decision.

A coordination hand-back is recorded when the owner must supply routine coordination the agent should have recovered: settled decisions, available evidence, routine reconciliation or prompting an authorized next step. The assigned Spec's append-only evidence records the occurrence, cause and smallest supported correction. Genuine preferences, tradeoffs, authorization and unavailable resources are different.

This makes coordination cost inspectable without creating another tracker. Delivering work but omitting that record leaves the measurement incomplete.

## Historical proof and limits

The first recorded Carry assignment reported zero live coordination hand-backs, but arrived with a strong handoff and settled decisions. Its writer's report needed two independent corrections. One easy run is not a reliability result.

The original seventeenth-skill release froze v3.1.2 rather than redefining its bundle. That count is historical: the current manifest owns the current skill inventory. The general lesson is to preserve stamped release identities and distinguish an explicit later exception from the default rule.

## Evidence and Sources

The source record was read at `bc370fe742d5ddb8348bf361fccea31205f6cee7` and the named current owners were inspected during article preparation. Historical tests are attributed to the original record, not claimed rerun here. Exact source recovery: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-049-assignment-ownership-and-coordination-record/SPEC.md`.

- [workbench/specs/S-049-assignment-ownership-and-coordination-record/SPEC.md](../../../workbench/specs/S-049-assignment-ownership-and-coordination-record/SPEC.md)
- [skills/carry/SKILL.md](../../../skills/carry/SKILL.md)
- [workbench/manifest.json](../../../workbench/manifest.json)
- [tools/test-skill-catalog.mjs](../../../tools/test-skill-catalog.mjs)
- [workbench/tools/workbench-layout.mjs](../../../workbench/tools/workbench-layout.mjs)

## History

- 2026-09-19: Reconciled into one article on owner direction; source records and proof remain intact pending their lifecycle gates.
