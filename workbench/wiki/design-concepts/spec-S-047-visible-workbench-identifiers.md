---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner requested one durable Wiki article per Spec on 2026-09-19
source_paths:
  - workbench/specs/S-047-visible-workbench-identifiers/SPEC.md
  - workbench/tools/visible-ids.mjs
  - tools/test-visible-ids.mjs
  - tools/test-visible-id-consumers.mjs
  - LEXICON.md
  - workbench/specs/S-01W-uppercase-width-four-workbench-artifact-ids/SPEC.md
  - workbench/docs/adr/0041-visible-base62-workbench-identifiers.md
  - RUNBOOK.md
parent: none
authorized_by: owner
last_verified: 2026-10-02
---

# S-047: Visible Workbench Identifiers

A visible identifier combines its artifact type prefix with a base-62 value. It is the identity a reader sees, not an additional hidden identity beside a label. Uniqueness is scoped to that type and Workbench; unrelated Workbenches may use the same visible label.

Legacy decimal identifiers and existing citation paths remain readable. The system must not silently reinterpret an old decimal label as a base-62 ordinal. Lookup, allocation and collision checks must account for compatibility and filesystem case behavior.

The allocator reports collisions against its supplied inventory; it is not a distributed lock. A caller must supply the complete relevant inventory, including retired identities. The lifecycle audit found why this caller boundary matters: a valid allocator cannot reserve an identity omitted by its caller.

## Later amendment: uppercase width-four artifact labels

The S-01W Uppercase Width-Four Workbench Artifact IDs Spec narrowed the value for artifact labels after the owner's E-8 answer in the destination audit ledger. New Spec, Task, ADR and notepad labels use uppercase `0-9A-Z`, minimum width four, with at least one letter (`S-000A`, `TK-000A`, `ADR-000C`, `N-000A`). Short, widened and case spellings of one label (`S-00Q`, `S-000Q`, `S-00q`) are one identity: allocation reserves it once, and public Spec and Task selectors resolve any spelling to the one stored record. Existing records keep their stored IDs; an open Spec or Task widens only through the explicit `widen-id` touch, which keeps its former spelling in a `**Former ID:**` field. Workbench connection identities keep the base-62 format above. ADR-0041 (visible Workbench identifiers) owns the decision, the Runbook's Visible Identifiers section owns the commands, and the S-01W Spec owns requirements and proof.

## Historical proof and limits

ADR-0041 and the Lexicon own semantics. The source record preserves the owner's correction rejecting a parallel identity field and deliberately avoids attributing engineering alphabet/width/sort choices to the owner. Historical integration proof at7f9fe21 establishes the delivered generation, not that every later caller inventories all lifecycle folders correctly.

## Evidence and Sources

The source record was read at `bc370fe742d5ddb8348bf361fccea31205f6cee7` and the named current owners were inspected during article preparation. Historical tests are attributed to the original record, not claimed rerun here. Exact source recovery: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-047-visible-workbench-identifiers/SPEC.md`.

- [workbench/specs/S-047-visible-workbench-identifiers/SPEC.md](../../../workbench/specs/S-047-visible-workbench-identifiers/SPEC.md)
- [workbench/tools/visible-ids.mjs](../../../workbench/tools/visible-ids.mjs)
- [tools/test-visible-ids.mjs](../../../tools/test-visible-ids.mjs)
- [tools/test-visible-id-consumers.mjs](../../../tools/test-visible-id-consumers.mjs)
- [LEXICON.md](../../../LEXICON.md)
- [S-01W Uppercase Width-Four Workbench Artifact IDs Spec](../../../workbench/specs/S-01W-uppercase-width-four-workbench-artifact-ids/SPEC.md)
- [ADR-0041 Visible Workbench identifiers](../../../workbench/docs/adr/0041-visible-base62-workbench-identifiers.md)
- [RUNBOOK.md Visible Identifiers](../../../RUNBOOK.md)

## History

- 2026-09-19: Reconciled into one article on owner direction; source records and proof remain intact pending their lifecycle gates.
- 2026-10-02: Added the S-01W uppercase width-four amendment during that Spec's assembled QA; the S-047 historical account above is unchanged.
