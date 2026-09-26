# TK-002Q - Move ADR and notepad allocation onto the artifact ID policy

**Task ID:** TK-002Q
**Spec ID:** S-01W
**Slice:** Move ADR and notepad allocation onto the artifact ID policy
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-01W acceptance line 4 (supported artifact consumers follow the policy and connection identities remain compatible).
**Planned verification:** Red: a disposable ADR collection whose base62 allocation would next emit a lowercase suffix (occupied `ADR-000Z` and every lower ordinal, or the smallest fixture that reaches it) proposes a lowercase label, and a disposable notepad collection allocates a width-three mixed-case label; green: `adr.mjs` and `notepads.mjs` allocate through `allocateArtifactId` (uppercase `0-9A-Z`, minimum width four, letter-bearing where each collection requires it), every existing spelling still reserves its identity, existing ADR and notepad files keep their names and bytes, register/duplicate checks and notepad lookup by visible ID still work for legacy labels, and Workbench connection-ID tests stay green.

## Outcome

Every artifact type that allocates visible labels (Specs, Tasks, ADRs,
notepads) uses the one artifact policy. Legacy labels stay valid and reserved.
The base62 codec remains only for Workbench connection identities and for
reading legacy labels.

## Authority And Source

Lane I (`claude-lane-I`) cut this Task under the owner's 2026-09-26 instruction
relayed by the Claude Director. Source: ledger row E-8 and decision-004 /
correction-003 (every artifact gets a WBID, width 4, uppercase; recycling not
adopted).

## Released Lane

Write lane: `workbench/tools/adr.mjs`, `workbench/tools/notepads.mjs`,
`workbench/tools/visible-ids.mjs` (only if the policy needs an option such as
letter-bearing opt-out), `tools/test-adr.mjs`, `tools/test-notepads.mjs`,
`tools/test-visible-id-consumers.mjs`, and the ADR-0041 delivered/remaining
paragraph. Trace every remaining `allocateVisibleId` caller first; if none
remain after this Task, say whether `allocateVisibleId` stays exported for
compatibility and why.

Also: Lane F observed `adr.mjs new` proposing `ADR-000L` while that label was
already used on another pushed branch, because ADR allocation does not read
remote tips the way `next-id` does (`occupiedIdentities` in
`workbench/tools/spec-workbench.mjs`). If moving ADR allocation onto the
artifact policy naturally covers remote-tip reservation, include it with a red
test first (a disposable room with a bare remote whose branch holds an ADR the
local tree lacks); if not, record it in this Task's remaining gap.

## Decisions

| Choice | Scope | Disposition | Durable owner |
|---|---|---|---|
| The Planned verification's ADR red (a base62 ADR allocation that emits a lowercase suffix) is unreachable: `visibleIdKey` folds case, and every lowercase base62 candidate shares its key with an uppercase candidate of smaller ordinal, so the old ADR allocator already emitted the same labels as `allocateArtifactId` (checked over 3000 consecutive allocations). The ADR past-`000Z` case is kept as a characterization test that passed before and after; the ADR red comes from the remote-tip case. Notepads did change (width three, numeric first), so their red is real. | task | reconciled | workbench/docs/adr/0041-visible-base62-workbench-identifiers.md |
| Remote-tip ADR reservation is included. `occupiedAdrLabels` in `adr.mjs` reads every `refs/remotes` tip the way `next-id` does (ADR-000O), using each tip's declared `adr` collection, its top level and lifecycle folders, and fails closed on a malformed manifest, an unsafe declared path or an unreadable tip. It lives in `adr.mjs` rather than reusing `occupiedIdentities`, because `spec-workbench.mjs` imports `adr.mjs`. | durable | reconciled | workbench/docs/adr/0041-visible-base62-workbench-identifiers.md |
| Notepads take the policy's letter-bearing default like every other artifact; no `visible-ids.mjs` option was added. | task | reconciled | workbench/docs/adr/0041-visible-base62-workbench-identifiers.md |
| Records that alias one identity still refuse allocation (local ADR files, same-prefix note IDs), now checked in each consumer, because `allocateArtifactId` folds repeated spellings instead of throwing as `allocateVisibleId` did. | task | reconciled | workbench/docs/adr/0041-visible-base62-workbench-identifiers.md |
| No runtime caller of `allocateVisibleId` remains. It stays exported from the managed `visible-ids.mjs` for installed rooms or scripts that import it, with its unit tests unchanged. | durable | reconciled | workbench/docs/adr/0041-visible-base62-workbench-identifiers.md |
