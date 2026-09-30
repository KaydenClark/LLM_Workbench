---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner requested one durable Wiki article per Spec on 2026-09-19
source_paths:
  - workbench/specs/S-00B-workbench-template-reformation/SPEC.md
  - AGENTS.md
  - RUNBOOK.md
  - README.md
  - tools/control-fidelity.mjs
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# S-00B: Workbench Template Reformation

The reference room was changed from a fictional Example application into a copyable Workbench Template. A reference installation has its own controls, identity, local differences and installed-runtime provenance. Updating it requires preserving those facts rather than replacing the room with upstream generic files.

The source Spec used the repository name Example_Workbench. Current producer controls name Workbench_Template and preserve the old name as history. The durable distinction is between the generic template source and the actual installed reference room used to prove an upgrade.

## Historical proof and limits

The Spec records target PR5, integration df6335922832e93466bd32e9c0cbe577baa668c2, reviewed candidate d14553c, nineteen target tests and fifteen runtime hashes. Its installer receipt intentionally retained its actual producer source. This article verifies the existence and scope of that record, not today's remote installation. Fresh-project personalization was separate from this update; no main promotion is inferred.

## Evidence and Sources

The source record and named owners were read at `bc370fe742d5ddb8348bf361fccea31205f6cee7`. Historical results above are attributed to that record; they were not rerun for this article. Recover its exact original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-00B-workbench-template-reformation/SPEC.md`.

- [workbench/specs/S-00B-workbench-template-reformation/SPEC.md](../../../workbench/specs/S-00B-workbench-template-reformation/SPEC.md)
- [AGENTS.md](../../../AGENTS.md)
- [RUNBOOK.md](../../../RUNBOOK.md)
- [README.md](../../../README.md)
- [tools/control-fidelity.mjs](../../../tools/control-fidelity.mjs)

## History

- 2026-09-19: Reconciled into one Spec article on owner direction. Original source and proof remain intact; this article does not authorize retirement or discard.
