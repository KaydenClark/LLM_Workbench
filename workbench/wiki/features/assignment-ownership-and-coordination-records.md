---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner requested one durable Wiki article per Spec on 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task Move And Retype Remaining Per-Spec Articles (TK-002) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-049-assignment-ownership-and-coordination-record/SPEC.md
  - workbench/skills/carry/SKILL.md
  - workbench/manifest.json
  - tools/test-skill-catalog.mjs
  - workbench/tools/workbench-layout.mjs
last_verified: 2026-10-04
---

# Assignment Ownership And Coordination Records

The Carry skill owns an assigned Spec or Task through the endpoint already authorized. The Assignment Ownership And The Coordination Record Spec (S-049) delivered that ownership together with a record of the coordination the owner had to supply by hand.

## What It Does

- **Carry ownership.** The Carry skill owns an assigned Spec or Task through the endpoint already authorized: recover context, execute, verify, reconcile records and deliver to the permitted integration boundary. It cannot expand the assignment or replace an owner-only decision.
- **Coordination hand-back record.** A coordination hand-back is recorded when the owner must supply routine coordination the agent should have recovered: settled decisions, available evidence, routine reconciliation or prompting an authorized next step. The assigned Spec's append-only evidence records the occurrence, cause and smallest supported correction. Genuine preferences, tradeoffs, authorization and unavailable resources are different.

## Why It Matters

This makes coordination cost inspectable without creating another tracker. Delivering work but omitting that record leaves the measurement incomplete.

## Limits

- The first recorded Carry assignment reported zero live coordination hand-backs, but arrived with a strong handoff and settled decisions. Its writer's report needed two independent corrections. One easy run is not a reliability result.
- The original seventeenth-skill release froze v3.1.2 rather than redefining its bundle. That count is historical: the current manifest owns the current skill inventory. The general lesson is to preserve stamped release identities and distinguish an explicit later exception from the default rule.

## Evidence and Sources

The source record was read at `bc370fe742d5ddb8348bf361fccea31205f6cee7` and the named current owners were inspected during article preparation. Historical tests are attributed to the original record, not claimed rerun here.

- [Historical Assignment Ownership And The Coordination Record Spec (S-049)](../../specs/S-049-assignment-ownership-and-coordination-record/SPEC.md). Original decisions, corrections, acceptance and evidence retain their own scope; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-049-assignment-ownership-and-coordination-record/SPEC.md). Exact source recovery: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-049-assignment-ownership-and-coordination-record/SPEC.md`.
- [workbench/skills/carry/SKILL.md](../../skills/carry/SKILL.md) - the Carry skill.
- [workbench/manifest.json](../../../workbench/manifest.json) - the owner of the current skill inventory.
- [tools/test-skill-catalog.mjs](../../../tools/test-skill-catalog.mjs) - the skill catalog test.
- [workbench/tools/workbench-layout.mjs](../../../workbench/tools/workbench-layout.mjs) - installed-layout owner.

## History

- 2026-09-19: Reconciled into one article on owner direction; source records and proof remain intact pending their lifecycle gates.
- 2026-09-30: Repaired live skill links and source_paths after relocation to workbench/skills; verified destinations only, without revalidating historical capability claims.
- 2026-10-04: Moved from `design-concepts/spec-S-049-assignment-ownership-and-coordination-record.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task Move And Retype Remaining Per-Spec Articles (TK-002). Every live link to it was rewritten by the move; no claim was changed.
