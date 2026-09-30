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
parent: none
authorized_by: owner
last_verified: 2026-09-19
---

# S-047: Visible Workbench Identifiers

A visible identifier combines its artifact type prefix with a base-62 value. It is the identity a reader sees, not an additional hidden identity beside a label. Uniqueness is scoped to that type and Workbench; unrelated Workbenches may use the same visible label.

Legacy decimal identifiers and existing citation paths remain readable. The system must not silently reinterpret an old decimal label as a base-62 ordinal. Lookup, allocation and collision checks must account for compatibility and filesystem case behavior.

The allocator reports collisions against its supplied inventory; it is not a distributed lock. A caller must supply the complete relevant inventory, including retired identities. The lifecycle audit found why this caller boundary matters: a valid allocator cannot reserve an identity omitted by its caller.

## Historical proof and limits

ADR-0041 and the Lexicon own semantics. The source record preserves the owner's correction rejecting a parallel identity field and deliberately avoids attributing engineering alphabet/width/sort choices to the owner. Historical integration proof at7f9fe21 establishes the delivered generation, not that every later caller inventories all lifecycle folders correctly.

## Evidence and Sources

The source record was read at `bc370fe742d5ddb8348bf361fccea31205f6cee7` and the named current owners were inspected during article preparation. Historical tests are attributed to the original record, not claimed rerun here. Exact source recovery: `git show bc370fe742d5ddb8348bf361fccea31205f6cee7:workbench/specs/S-047-visible-workbench-identifiers/SPEC.md`.

- [workbench/specs/S-047-visible-workbench-identifiers/SPEC.md](../../../workbench/specs/S-047-visible-workbench-identifiers/SPEC.md)
- [workbench/tools/visible-ids.mjs](../../../workbench/tools/visible-ids.mjs)
- [tools/test-visible-ids.mjs](../../../tools/test-visible-ids.mjs)
- [tools/test-visible-id-consumers.mjs](../../../tools/test-visible-id-consumers.mjs)
- [LEXICON.md](../../../LEXICON.md)

## History

- 2026-09-19: Reconciled into one article on owner direction; source records and proof remain intact pending their lifecycle gates.
