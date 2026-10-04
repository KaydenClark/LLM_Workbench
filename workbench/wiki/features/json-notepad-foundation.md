---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner requested one durable Wiki article per Spec on 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task Move And Retype Remaining Per-Spec Articles (TK-002) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-046-json-notepad-foundation/SPEC.md
  - workbench/tools/notepads.mjs
  - workbench/skills/notepad/SKILL.md
  - workbench/skills/handoff/SKILL.md
  - tools/test-notepads.mjs
last_verified: 2026-10-04
---

# JSON Notepad Foundation

A local JSON notepad preserves consequential context while work happens: objective, findings, corrections, uncertainty and the next authorized action. The JSON Notepad Foundation Spec (S-046) delivered it so work can continue without making the owner reconstruct lost context.

## What It Does

- **Runtime.** The runtime supports revision-checked changes, selective retrieval, explicit correction links and dependency-aware cleanup. One writer owns a note.
- **Capture.** Important material is captured before context exhaustion or Stop; no final-write or crash-recovery guarantee is implied.
- **Reconciliation before cleanup.** Supported claims are reconciled into their durable owners before cleanup. A remaining note retains unresolved context and active transfer dependencies.
- **Handoffs.** Handoffs are separately authored Markdown instructions for one receiving context, not JSON exports or new sources of authority.

## Why It Matters

The purpose of the notepad is continuation without making the owner reconstruct lost context. The notepad is provisional evidence and never grants authority.

## Limits

- The source Spec preserves the runtime's review repairs, Windows scoping failures and later verified integration rather than rewriting them into a single success story. It records a fresh-context handoff trial and cleanup refusals, then a repaired v3.2.0 integration candidate 7f9fe21. Those trials are bounded historical evidence.
- Current global installation and native host behavior must be checked separately.
- This article does not claim a Windows/private-transport trial.

## Evidence and Sources

The source record was read at `bc370fe742d5ddb8348bf361fccea31205f6cee7` and the named current owners were inspected during article preparation. Historical tests are attributed to the original record, not claimed rerun here.

- [Historical JSON Notepad Foundation Spec (S-046)](../../specs/S-046-json-notepad-foundation/SPEC.md). Original decisions, corrections, acceptance and evidence retain their own scope; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-046-json-notepad-foundation/SPEC.md). Exact source recovery: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-046-json-notepad-foundation/SPEC.md`.
- [workbench/tools/notepads.mjs](../../../workbench/tools/notepads.mjs) - the notepad runtime.
- [workbench/skills/notepad/SKILL.md](../../skills/notepad/SKILL.md) - the notepad skill.
- [workbench/skills/handoff/SKILL.md](../../skills/handoff/SKILL.md) - the handoff skill.
- [tools/test-notepads.mjs](../../../tools/test-notepads.mjs) - the verification seam.

## History

- 2026-09-19: Reconciled into one article on owner direction; source records and proof remain intact pending their lifecycle gates.
- 2026-09-30: Repaired live skill links and source_paths after relocation to workbench/skills; verified destinations only, without revalidating historical capability claims.
- 2026-10-04: Moved from `design-concepts/spec-S-046-json-notepad-foundation.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task Move And Retype Remaining Per-Spec Articles (TK-002). Every live link to it was rewritten by the move; no claim was changed.
