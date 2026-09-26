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

None yet.
