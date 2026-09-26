---
date: 2026-09-06
canonicalized_in:
  - BLUEPRINT.md
  - LEXICON.md
  - workbench/specs/S-047-visible-workbench-identifiers/SPEC.md
---

# Visible base-62 Workbench identifiers

The WBID is the visible artifact identifier: its existing type prefix followed
by a base-62 value in place of the numeric portion. Uniqueness applies within
the same type and Workbench. Independent Workbenches may each contain ADR-00A;
S-00A and ADR-00A may coexist. No secondary global identity is introduced.

Considered and superseded: adding a separate WBID beside existing labels. The
owner explicitly corrected that interpretation. Global uniqueness is deferred
until connected Workbenches actually need a connection identity.

Consequences: parsers, allocation, case handling, sorting, migration, and
reference preservation require engineering work under S-047. Existing stable
paths and numeric IDs are not rewritten by accepting this direction. Alphabet
order and width are not owner-approved details. The scoping specs use current
numeric syntax until compatible runtime support exists.

Provenance: source Q17C correction and Q17D uniqueness answer, promoted under
the current 2026-09-06 owner request and recorded by
[S-046](../../specs/S-046-json-notepad-foundation/SPEC.md);
[S-047](../../specs/S-047-visible-workbench-identifiers/SPEC.md) owns implementation.

## v3.2.0 reconciliation (2026-09-08)

The later selected Workbench connection identity names a namespace across clones. It does not add a parallel secondary ID to every artifact or change artifact type-scoped uniqueness. See [ADR-0051](0051-optional-private-git-transport-for-session-continuity.md).

## Compatibility implementation (v3.2.0)

S-047 preserves existing numeric labels and stable paths. Newly allocated durable
labels contain a letter, distinguishing them from decimal history without
renumbering it. Historical numeric tickets keep their spec-qualified scope;
new letter-bearing tickets use the whole Workbench inventory. Case-folded and
leading-zero collisions are refused for portable storage. Note filename lookup
and explicit stored-ID lookup are separate selectors, not separate identities.
The Runbook owns exact commands, alphabet, widths and current-record limitations;
S-047 owns consumer coverage and verification. This compatibility account does
not claim historical ticket labels were globally unique or runtime delivery is
already integrated.

## Artifact alphabet and width (S-01W, 2026-09-26)

Owner decision E-8 in the
[destination audit ledger](../../wiki/grilling-destination-audit-ledger.json)
settles the details the original decision left open, for artifact labels only:
new WBIDs use uppercase `0-9A-Z` suffixes of minimum width four, and the
allocator treats short, widened and case spellings (`S-00Q`, `S-000Q`,
`S-00q`) as one identity. The "Alphabet order and width are not owner-approved"
consequence above is superseded for artifacts by that answer.

Delivered by S-01W TK-02B (the S-01W Spec owns requirements and proof): one shared artifact allocation policy, `allocateArtifactId` in
`workbench/tools/visible-ids.mjs`, backs the read-only `next-id --prefix S`,
`next-id S-### --prefix TK` proposals and both corrective-Task allocations.
It emits only `0-9A-Z`, pads to width four, stays letter-bearing, grows rather
than truncating or recycling, and reserves every existing spelling of an
identity. Duplicate records that alias one identity still refuse through the
record loaders. Existing records keep their stored IDs, paths and bytes.

Not yet delivered, and owned by later S-01W slices: public selectors that
accept a widened spelling for a short stored ID (dual-form lookup), the
explicit identity-only `widen-id` touch verb that widens an eligible active
record while preserving its former ID, and moving ADR and notepad allocation
onto the artifact policy. Until then ADR allocation keeps its width-four
base-62 call and notepads keep theirs, and both keep their current output.

Workbench connection identities are unaffected: `allocateWorkbenchId` and
`isWorkbenchId` still use the exported base-62 alphabet and codec, which this
policy leaves unchanged; the artifact codec is separate.
