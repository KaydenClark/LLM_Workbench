---
type: feature
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner requested one durable Wiki article per Spec on 2026-09-19
  - Moved into the features collection and restructured as a feature article by Wiki Evolving-Synthesis Migration (S-003W) Task Move And Retype Remaining Per-Spec Articles (TK-002) using wiki.mjs move-note, 2026-10-04
source_paths:
  - workbench/specs/retired/S-047-visible-workbench-identifiers/SPEC.md
  - workbench/tools/visible-ids.mjs
  - tools/test-visible-ids.mjs
  - tools/test-visible-id-consumers.mjs
  - GLOSSARY.md
  - workbench/specs/S-01W-uppercase-width-four-workbench-artifact-ids/SPEC.md
  - workbench/docs/adr/0041-visible-base62-workbench-identifiers.md
  - RUNBOOK.md
  - workbench/skills/workbench-runtime/SKILL.md
last_verified: 2026-10-04
---

# Visible Workbench Identifiers

A visible identifier combines its artifact type prefix with a base-62 value. The Visible Workbench Identifiers Spec (S-047) delivered it as the identity a reader sees, not an additional hidden identity beside a label.

## What It Does

- **Identity and scope.** Uniqueness is scoped to that type and Workbench; unrelated Workbenches may use the same visible label.
- **Legacy compatibility.** Legacy decimal identifiers and existing citation paths remain readable. The system must not silently reinterpret an old decimal label as a base-62 ordinal. Lookup, allocation and collision checks must account for compatibility and filesystem case behavior.
- **Allocator boundary.** The allocator reports collisions against its supplied inventory; it is not a distributed lock. A caller must supply the complete relevant inventory, including retired identities. The lifecycle audit found why this caller boundary matters: a valid allocator cannot reserve an identity omitted by its caller.
- **Later amendment: uppercase width-four artifact labels.** The Uppercase Width-Four Workbench Artifact IDs Spec (S-01W) narrowed the value for artifact labels after the owner's answer (E-8) in the destination audit ledger. New Spec, Task, ADR and notepad labels use uppercase `0-9A-Z`, minimum width four, with at least one letter, as in the example Spec label (S-000A), the example Task label (TK-000A), the example ADR label (ADR-000C) and the example notepad label (N-000A). Short, widened and case spellings of one label, such as the example short spelling (S-00Q), the example widened spelling (S-000Q) and the example lowercase spelling (S-00q), are one identity: allocation reserves it once, and public Spec and Task selectors resolve any spelling to the one stored record. Existing records keep their stored IDs; an open Spec or Task widens only through the explicit `widen-id` touch, which keeps its former spelling in a `**Former ID:**` field. Workbench connection identities keep the base-62 format above. ADR-0041 (visible Workbench identifiers) owns the decision, the `workbench-runtime` skill's Visible Identifiers section owns the commands (the Runbook's Visible Identifiers section points there), and the Uppercase Width-Four Workbench Artifact IDs Spec (S-01W) owns requirements and proof.

## Why It Matters

The reader sees one identity, not a label beside a hidden second identity. The source record preserves the owner's correction rejecting a parallel identity field.

## Limits

- ADR-0041 (visible Workbench identifiers) and the glossary own semantics.
- The source record deliberately avoids attributing engineering alphabet, width and sort choices to the owner.
- Historical integration proof at 7f9fe21 establishes the delivered generation, not that every later caller inventories all lifecycle folders correctly.

## Evidence and Sources

The source record was read at `bc370fe742d5ddb8348bf361fccea31205f6cee7` and the named current owners were inspected during article preparation. Historical tests are attributed to the original record, not claimed rerun here.

- [Historical Visible Workbench Identifiers Spec (S-047)](../../specs/S-047-visible-workbench-identifiers/SPEC.md). Original decisions, corrections, acceptance and evidence retain their own scope; its eventual retired route is named in this article's `source_paths`.
- [Immutable source and proof at `bc370fe`](https://github.com/KaydenClark/LLM_Workbench/blob/bc370fe742d5ddb8348bf361fccea31205f6cee7/workbench/specs/S-047-visible-workbench-identifiers/SPEC.md). Exact source recovery: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-047-visible-workbench-identifiers/SPEC.md`.
- [workbench/tools/visible-ids.mjs](../../../workbench/tools/visible-ids.mjs) - the identifier allocator and parser.
- [tools/test-visible-ids.mjs](../../../tools/test-visible-ids.mjs) and [tools/test-visible-id-consumers.mjs](../../../tools/test-visible-id-consumers.mjs) - the verification seams.
- [GLOSSARY.md](../../../GLOSSARY.md#continuity-terms) - the owner of identifier semantics.
- [Uppercase Width-Four Workbench Artifact IDs Spec (S-01W)](../../specs/S-01W-uppercase-width-four-workbench-artifact-ids/SPEC.md) - the later amendment.
- [ADR-0041 Visible Workbench identifiers](../../docs/adr/0041-visible-base62-workbench-identifiers.md) - the decision record.
- [RUNBOOK.md Visible Identifiers](../../../RUNBOOK.md#visible-identifiers) - the Runbook pointer to the commands.
- [`workbench-runtime` skill: Visible Identifiers](../../skills/workbench-runtime/SKILL.md#visible-identifiers) - the owner of the commands.

## History

- 2026-09-19: Reconciled into one article on owner direction; source records and proof remain intact pending their lifecycle gates.
- 2026-10-02: Added the Uppercase Width-Four Workbench Artifact IDs Spec (S-01W) amendment during that Spec's assembled QA; the Visible Workbench Identifiers Spec (S-047) historical account above is unchanged.
- 2026-10-04: The identifier commands moved from the Runbook into the `workbench-runtime` skill behind the Runbook operations index, in the Task Move The Operations Every Room Runs Behind Their Pointers (TK-005J) of the Contract Carrier Pointer-Brief Rewrite Spec (S-004C); the account above is unchanged.
- 2026-10-04: Moved from `design-concepts/spec-S-047-visible-workbench-identifiers.md` into the features collection under this name with `wiki.mjs move-note`, retyped `feature` and restructured into the four feature sections from its existing prose, for the Wiki Evolving-Synthesis Migration Spec (S-003W) Task Move And Retype Remaining Per-Spec Articles (TK-002). Every live link to it was rewritten by the move; no claim was changed.
- 2026-10-07: Re-pointed the retiring Lexicon's links and live routes to `GLOSSARY.md`, `ARCHITECTURE.md` and the Wiki lexicon articles (Lexicon Retirement And ARCHITECTURE.md Spec (S-004O), consumer re-pointing Task (TK-009F)); no claim changed.
