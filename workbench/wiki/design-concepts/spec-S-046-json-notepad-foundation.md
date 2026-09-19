---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner requested one durable Wiki article per Spec on 2026-09-19
source_paths:
  - workbench/specs/S-046-json-notepad-foundation/SPEC.md
  - workbench/tools/notepads.mjs
  - skills/notepad/SKILL.md
  - skills/handoff/SKILL.md
  - tools/test-notepads.mjs
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# S-046: JSON Notepad Foundation

A local JSON notepad preserves consequential context while work happens: objective, findings, corrections, uncertainty and the next authorized action. Its purpose is continuation without making the owner reconstruct lost context. The notepad is provisional evidence and never grants authority.

The runtime supports revision-checked changes, selective retrieval, explicit correction links and dependency-aware cleanup. One writer owns a note. Important material is captured before context exhaustion or Stop; no final-write or crash-recovery guarantee is implied.

Supported claims are reconciled into their durable owners before cleanup. A remaining note retains unresolved context and active transfer dependencies. Handoffs are separately authored Markdown instructions for one receiving context, not JSON exports or new sources of authority.

## Historical proof and limits

The source Spec preserves the runtime's review repairs, Windows scoping failures and later verified integration rather than rewriting them into a single success story. It records a fresh-context handoff trial and cleanup refusals, then a repaired v3.2.0 integration candidate7f9fe21. Those trials are bounded historical evidence. Current global installation and native host behavior must be checked separately; this article does not claim a Windows/private-transport trial.

## Evidence and Sources

The source record was read at `bc370fe742d5ddb8348bf361fccea31205f6cee7` and the named current owners were inspected during article preparation. Historical tests are attributed to the original record, not claimed rerun here. Exact source recovery: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-046-json-notepad-foundation/SPEC.md`.

- [workbench/specs/S-046-json-notepad-foundation/SPEC.md](../../../workbench/specs/S-046-json-notepad-foundation/SPEC.md)
- [workbench/tools/notepads.mjs](../../../workbench/tools/notepads.mjs)
- [skills/notepad/SKILL.md](../../../skills/notepad/SKILL.md)
- [skills/handoff/SKILL.md](../../../skills/handoff/SKILL.md)
- [tools/test-notepads.mjs](../../../tools/test-notepads.mjs)

## History

- 2026-09-19: Reconciled into one article on owner direction; source records and proof remain intact pending their lifecycle gates.
