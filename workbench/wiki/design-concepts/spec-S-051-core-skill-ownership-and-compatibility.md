---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner requested one durable Wiki article per Spec on 2026-09-19
source_paths:
  - workbench/specs/S-051-core-skill-ownership-and-compatibility/SPEC.md
  - tools/core-skill-installer.mjs
  - tools/test-core-skill-installer.mjs
  - skills/update-harness/SKILL.md
  - workbench/manifest.json
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# S-051: Core Skill Ownership And Compatibility

A core installation needs an identifiable source generation and compatible manifest policy while preserving optional shared skills and project-local ownership. Source content, installed bytes, discovery and actual native invocation are separate checks.

Presence-only setup may add missing core behavior under its contract; replacing differing installed skills requires an explicit update. Backup and recovery evidence must identify what was replaced and what remained untouched.

This Spec recorded a narrow owner waiver retaining v3.2.0 for a repaired twenty-one-skill generation while preserving the previous twenty-skill policy as readable legacy input. Source commit and hashes distinguish those generations. The waiver does not repeal the ordinary frozen-label rule.

## Historical proof and limits

The completion records matching twenty-one global core identities at reviewed7f9fe21 and a repaired GPT-5.5 capture/correction/handoff/resume trial. Claude OAuth and Astra execution were unavailable; Spark ordinary discovery failed a host budget. Those limitations remain evidence, not supported-host claims. Installed home copies can drift afterward; this article did not update or certify today's personal installation.

## Evidence and Sources

The source record was read at `bc370fe742d5ddb8348bf361fccea31205f6cee7` and the named current owners were inspected during article preparation. Historical tests are attributed to the original record, not claimed rerun here. Exact source recovery: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-051-core-skill-ownership-and-compatibility/SPEC.md`.

- [workbench/specs/S-051-core-skill-ownership-and-compatibility/SPEC.md](../../../workbench/specs/S-051-core-skill-ownership-and-compatibility/SPEC.md)
- [tools/core-skill-installer.mjs](../../../tools/core-skill-installer.mjs)
- [tools/test-core-skill-installer.mjs](../../../tools/test-core-skill-installer.mjs)
- [skills/update-harness/SKILL.md](../../../skills/update-harness/SKILL.md)
- [workbench/manifest.json](../../../workbench/manifest.json)

## History

- 2026-09-19: Reconciled into one article on owner direction; source records and proof remain intact pending their lifecycle gates.
