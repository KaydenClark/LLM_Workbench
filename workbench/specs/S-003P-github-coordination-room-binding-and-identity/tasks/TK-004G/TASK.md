# TK-004G - P1: Disable promisor lazy fetch - public394 missing-manifest fixture fetches and adds four Git pack files despite the read-only contract.

**Task ID:** TK-004G
**Spec ID:** S-003P
**Slice:** P1: Disable promisor lazy fetch - public394 missing-manifest fixture fetches and adds four Git pack files despite the read-only contract.
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-003P Acceptance Criteria
**Planned verification:** Answers evidence row 5 (fail verdict at 394a5d869d2630a069a5ba2fd90fee0cad28bf49 on 2026-10-01): P1: Disable promisor lazy fetch - public394 missing-manifest fixture fetches and adds four Git pack files despite the read-only contract.
**Proof:** Promisor regression expectedredcce88dc6, committed5f3ce522 inspector8/8 including fresh installed hash/invocation and absent promised commit/tree/blob refusal without transport or any Git metadata change. Receipt1 premature8/8 corrected append-only by Receipt2 and Spec evidence.

## Assigned Scope

Disable lazy fetching for every inspector Git operation. Public tests cover absent promised commit, tree and manifest blob, preserve the complete Git metadata inventory, and use a local transport tripwire. Unsupported Git must fail closed. One writer: codex-github-binding. Full AGENTS verification and native Receipt/close proof are required before the assembled correction candidate lands.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/github-binding-corrections | cce88dc68475ad52be96b52a17b446fd972ffc1e | ahead 1 behind 0 | 2 | Red cce88dc6 public missing-promisor regression: expected refusal fails because missing commit is fetched. Green inspector8/8: missing promised commit/tree/blob all refuse, transport tripwire remains absent and every Git metadata hash stays equal. Existing immutable/source/installed proof passes. Full final assembled-candidate suite remains pending. | Binding procedure documents disabled lazy fetch/optional locks and fail-closed Git compatibility, linked to official Git documentation. | F ambient Git environment and H RUNBOOK route corrective Tasks remain. Full assembled suite and independent final-candidate review/integration pending. | 5576c5d2ac943eead48e205955f5ef41bd22b837eb1b81c2a62ee53d56ba379b |
| 2 | codex/github-binding-corrections | 5f3ce522068afb2780d6df0cdc5d9355f98aaeba | ahead 0 behind 0 | 0 | Correction to Receipt1: initial dirty-source run was7/8, not8/8 - installation correctly refused uncommitted runtime bytes. After committing5f3ce522, full inspector8/8 passes including installed exact hash/invocation and absent promised commit/tree/blob transport/no-write checks. Earlier row preserved. | Procedure describes no-lazy-fetch/optional-lock flags and fail-closed Git compatibility. | Ambient environment and RUNBOOK route corrective Tasks remain, then final assembled51-command suite and fresh independent review before integration. | 7cdd5310ff2ed346d21fceab7fd05a6f1312ed8fa758a92069b409089a4e542d |
| 3 | codex/github-binding-corrections | 6a3a722a8f3ec9363e82ef3793143666abce9a74 | ahead 0 behind 0 | 0 | Promisor regression expectedredcce88dc6, committed5f3ce522 inspector8/8 including fresh installed hash/invocation and absent promised commit/tree/blob refusal without transport or any Git metadata change. Receipt1 premature8/8 corrected append-only by Receipt2 and Spec evidence. | Binding procedure states no lazy fetch, optional locks and fail-closed Git compatibility. | TK004F environment and TK004H route remain. Required full final assembly suite and independent review/integration pending, no fullSpec or ownerQA claim. | a2a2dfed718468462511dc63f662aa472684006b57d8663260fb02877ad72e7f |
