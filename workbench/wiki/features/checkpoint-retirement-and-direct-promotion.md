---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner requested one durable Wiki article per Spec on 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task Move And Retype Remaining Per-Spec Articles (TK-002) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-048-checkpoint-retirement/SPEC.md
  - workbench/tools/sessions.mjs
  - tools/test-sessions.mjs
  - workbench/skills/promote/SKILL.md
  - AGENTS.md
last_verified: 2026-10-04
---

# Checkpoint Retirement And Direct Promotion

Checkpoint creation was retired while existing checkpoint history and recovery references were preserved. The Checkpoint Retirement Spec (S-048) delivered the retirement together with direct promotion of selected supported claims into their durable owners.

## What It Does

- **Refusal-only command.** The legacy checkpoint command is a refusal-only compatibility boundary; it does not create new copies. The current `sessions.mjs` checkpoint export refuses creation.
- **Direct promotion.** Selected supported claims can instead move from working context into the proper durable owner through the promotion seam. Unresolved material stays in local notes.
- **History preserved.** Existing checkpoint history and recovery references were preserved. Retiring the command does not authorize wholesale deletion of checkpoints or change the meaning of their historical citations.

## Why It Matters

This separates live continuation, durable reconciliation and historical evidence. A new save behavior must prove its own operation; merely renaming a command is not evidence that the old information can safely disappear.

## Limits

- The source completion records verified implementation and preservation under the repaired v3.2.0 integration.
- Its earlier planning statement that the old mechanism remains available refers to the pre-retirement period; the current `sessions.mjs` checkpoint export refuses creation.
- Historical checkpoint contents were not re-audited or deleted while writing the original article.

## Evidence and Sources

The source record was read at `bc370fe742d5ddb8348bf361fccea31205f6cee7` and the named current owners were inspected during article preparation. Historical tests are attributed to the original record, not claimed rerun here.

- [Historical Checkpoint Retirement Spec (S-048)](../../specs/S-048-checkpoint-retirement/SPEC.md). Original decisions, corrections, acceptance and evidence retain their own scope; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-048-checkpoint-retirement/SPEC.md). Exact source recovery: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-048-checkpoint-retirement/SPEC.md`.
- [workbench/tools/sessions.mjs](../../../workbench/tools/sessions.mjs) - the refusing checkpoint command and the promotion seam.
- [tools/test-sessions.mjs](../../../tools/test-sessions.mjs) - the verification seam.
- [workbench/skills/promote/SKILL.md](../../skills/promote/SKILL.md) - the promote skill.
- [AGENTS.md](../../../AGENTS.md) - the contract that routes session records and promotion.

## History

- 2026-09-19: Reconciled into one article on owner direction; source records and proof remain intact pending their lifecycle gates.
- 2026-09-30: Repaired live skill links and source_paths after relocation to workbench/skills; verified destinations only, without revalidating historical capability claims.
- 2026-10-04: Moved from `design-concepts/spec-S-048-checkpoint-retirement.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task Move And Retype Remaining Per-Spec Articles (TK-002). Every live link to it was rewritten by the move; no claim was changed.
