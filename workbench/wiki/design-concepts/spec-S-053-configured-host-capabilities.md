---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner requested one durable Wiki article per Spec on 2026-09-19
source_paths:
  - workbench/specs/S-053-configured-host-capabilities/SPEC.md
  - tools/configured-host.mjs
  - tools/test-configured-host.mjs
  - workbench/specs/S-053-configured-host-capabilities/local-host-result.json
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# S-053: Configured Host Capabilities

Configured-host conformance asks what the actual host can do at named command seams. It keeps capability, enforcement and agent reliability separate: a runner operation passing does not establish that an agent discovers the skill or reliably obeys the workflow.

The public command and its tests check bounded operations and return explicit unavailable or unverified results. Host configuration, tool paths and native provider behavior need their own evidence; fixture or source availability cannot substitute for that evidence.

## Historical proof and limits

The retained local-host-result.json records four runner checks passing while native discovery/invocation remains unverified. The Spec does not claim Windows or native Claude support from that result, nor broader rollout readiness. The later integration proof closes its source delivery boundary without changing those observation limits. New host claims require a fresh actual-host check.

## Evidence and Sources

The source record was read at `bc370fe742d5ddb8348bf361fccea31205f6cee7` and the named current owners were inspected during article preparation. Historical tests are attributed to the original record, not claimed rerun here. Exact source recovery: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-053-configured-host-capabilities/SPEC.md`.

- [workbench/specs/S-053-configured-host-capabilities/SPEC.md](../../../workbench/specs/S-053-configured-host-capabilities/SPEC.md)
- [tools/configured-host.mjs](../../../tools/configured-host.mjs)
- [tools/test-configured-host.mjs](../../../tools/test-configured-host.mjs)
- [workbench/specs/S-053-configured-host-capabilities/local-host-result.json](../../../workbench/specs/S-053-configured-host-capabilities/local-host-result.json)

## History

- 2026-09-19: Reconciled into one article on owner direction; source records and proof remain intact pending their lifecycle gates.
