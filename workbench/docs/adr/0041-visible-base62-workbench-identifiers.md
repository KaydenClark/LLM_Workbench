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

Delivered by S-01W TK-002K: dual-form lookup for the public Spec and Task
selectors in `workbench/tools/spec-workbench.mjs`. `show`, `claim`, `close`,
`receipt`, `complete`, `convert-tasks`, `gate`, `move-spec`, `move-task`,
`retire-spec`, `discard`, the `next-id` parent, the CLI `report`, `verdict`
and `approve` entry points, orphan corrective Task selectors, blocker matching
and the retired explicit lookup accept any spelling that shares the stored
record's collision key and act on that one record, reporting its stored ID
and path; nothing is renamed. Task selectors stay Spec-qualified, so numeric
historical labels keep their per-Spec scope. Two different stored spellings
behind one key, including an active record and a retired one, refuse by name
at the selector; allocation still folds them as one occupied identity.

Delivered by S-01W TK-002O: the explicit identity-only touch,
`widen-id S-###|TK-### [--spec S-###]` in `workbench/tools/spec-workbench.mjs`.
It widens one planned, active or blocked Spec, or one open Task record under
such a Spec, to the uppercase width-four spelling of its own collision key
(`S-00Q` to `S-000Q`, numeric `TK-001` to `TK-0001`): the record directory,
its ID field and title change, and the previous spelling is kept in one
`**Former ID:**` header field directly under the ID field. That field must be
another spelling of the same identity, appears at most once, and parses and
round-trips through `parseFormerId`/`formatTaskRecord` in
`workbench/tools/task-record.mjs`; the former spelling keeps resolving through
dual-form lookup. Live links are repaired by the lifecycle moves' own
reference rewrite, evidence rows stay byte-identical and are counted as
historical, open child Tasks name the widened parent, and done and retired
records keep their bytes. It never changes status, and it refuses complete,
reviewed, done and retired records, a dirty tree, an occupied destination or
alias, and an unsafe record path before writing anything. A repeat run is a
no-op. Like `move-spec` it stages the change and commits nothing. The verdict
digest (`computeSpecDigest`) deliberately includes the field: widening already
changes the digested ID field, title and Task paths, so a widened record is a
new review candidate.

Delivered by S-01W TK-002Q: ADR and notepad allocation use the same policy.
`adr.mjs new` and `notepads.mjs allocate` call `allocateArtifactId`, so a new
ADR or note label is uppercase, width four and letter-bearing (`ADR-000C`,
`N-000A`); ADRs had never emitted a lowercase label, because the case-folded
base-62 allocator always reached the uppercase spelling first, but notepads
had emitted width-three labels (`N-00A`, `N-001`). Legacy ADR files and notes
keep their names, bytes and stored IDs, and every spelling (`00A`, `000b`,
`N-00a`) still reserves its identity and resolves by visible ID; records that
alias one identity still refuse allocation rather than choosing a winner.
`adr.mjs new` now also reserves ADR labels held at every remote-tracking tip,
reading each tip's declared `adr` collection, top level and lifecycle folders,
as `next-id` does for Specs and Tasks (ADR-000O), so a label another pushed
branch already holds is not proposed again. No runtime caller of
`allocateVisibleId` remains; it stays exported from the managed
`visible-ids.mjs` for installed rooms or scripts that import it, and its
unit coverage is unchanged.

Not yet delivered, and owned by later S-01W slices: the read-only QA-time
inventory of records still short. Library callers of the `spec-report.mjs`
functions that pass a selector straight through (rather than the CLI) still
echo it where those functions return or record the caller's spelling.

Workbench connection identities are unaffected: `allocateWorkbenchId` and
`isWorkbenchId` still use the exported base-62 alphabet and codec, which this
policy leaves unchanged; the artifact codec is separate.
