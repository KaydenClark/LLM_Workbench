---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner requested one durable Wiki article per Spec on 2026-09-19
source_paths:
  - workbench/specs/S-048-checkpoint-retirement/SPEC.md
  - workbench/tools/sessions.mjs
  - tools/test-sessions.mjs
  - skills/promote/SKILL.md
  - AGENTS.md
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# S-048: Checkpoint Retirement And Direct Promotion

Checkpoint creation was retired while existing checkpoint history and recovery references were preserved. The legacy checkpoint command is a refusal-only compatibility boundary; it does not create new copies.

Selected supported claims can instead move from working context into the proper durable owner through the promotion seam. Unresolved material stays in local notes. Retiring the command does not authorize wholesale deletion of checkpoints or change the meaning of their historical citations.

This separates live continuation, durable reconciliation and historical evidence. A new save behavior must prove its own operation; merely renaming a command is not evidence that the old information can safely disappear.

## Historical proof and limits

The source completion records verified implementation and preservation under the repaired v3.2.0 integration. Its earlier planning statement that the old mechanism remains available refers to the pre-retirement period; the current `sessions.mjs` checkpoint export refuses creation. Historical checkpoint contents were not re-audited or deleted while writing this article.

## Evidence and Sources

The source record was read at `bc370fe742d5ddb8348bf361fccea31205f6cee7` and the named current owners were inspected during article preparation. Historical tests are attributed to the original record, not claimed rerun here. Exact source recovery: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-048-checkpoint-retirement/SPEC.md`.

- [workbench/specs/S-048-checkpoint-retirement/SPEC.md](../../../workbench/specs/S-048-checkpoint-retirement/SPEC.md)
- [workbench/tools/sessions.mjs](../../../workbench/tools/sessions.mjs)
- [tools/test-sessions.mjs](../../../tools/test-sessions.mjs)
- [skills/promote/SKILL.md](../../../skills/promote/SKILL.md)
- [AGENTS.md](../../../AGENTS.md)

## History

- 2026-09-19: Reconciled into one article on owner direction; source records and proof remain intact pending their lifecycle gates.
