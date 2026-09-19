---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner requested one durable Wiki article per Spec on 2026-09-19
source_paths:
  - workbench/specs/S-00F-template-upgrade-release-gate/SPEC.md
  - AGENTS.md
  - RUNBOOK.md
  - README.md
  - skills/update-harness/SKILL.md
  - tools/workbench-tools.mjs
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# S-00F: The Named Template Upgrade Release Gate

The producer must exercise each new Workbench version in the named Workbench_Template installation before declaring release readiness. Generic generation tests alone cannot prove an installed upgrade preserves room-owned state.

The gate pins source and prior target commits, follows the public update route, checks version and managed bytes, preserves identity and historical provenance, and requires target verification, independent candidate review, integration containment and a fresh remote clone. AGENTS owns this policy; RUNBOOK owns the executable procedure.

This producer-specific requirement does not make an external repository a prerequisite for ordinary project work. It does not authorize global skill replacement or main promotion. Generic templates deliberately do not impose the producer's named reference repository on every generated project.

## Historical proof and limits

The first recorded application upgraded Workbench_Template to v3.2.1 at integrationfc0fc18 with twenty-one target tests and sixteen managed hashes. The policy-only source candidate618d1b8 recorded forty-five checks. Those identities describe the historical application, not the current state of the remote Template and not proof of every optional cross-device capability.

## Evidence and Sources

The source record and named owners were read at `bc370fe742d5ddb8348bf361fccea31205f6cee7`. Historical results above are attributed to that record; they were not rerun for this article. Recover its exact original with `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-00F-template-upgrade-release-gate/SPEC.md`.

- [workbench/specs/S-00F-template-upgrade-release-gate/SPEC.md](../../../workbench/specs/S-00F-template-upgrade-release-gate/SPEC.md)
- [AGENTS.md](../../../AGENTS.md)
- [RUNBOOK.md](../../../RUNBOOK.md)
- [README.md](../../../README.md)
- [skills/update-harness/SKILL.md](../../../skills/update-harness/SKILL.md)
- [tools/workbench-tools.mjs](../../../tools/workbench-tools.mjs)

## History

- 2026-09-19: Reconciled into one Spec article on owner direction. Original source and proof remain intact; this article does not authorize retirement or discard.
