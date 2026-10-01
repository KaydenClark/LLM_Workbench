# TK-004G - P1: Disable promisor lazy fetch - public394 missing-manifest fixture fetches and adds four Git pack files despite the read-only contract.

**Task ID:** TK-004G
**Spec ID:** S-003P
**Slice:** P1: Disable promisor lazy fetch - public394 missing-manifest fixture fetches and adds four Git pack files despite the read-only contract.
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-003P Acceptance Criteria
**Planned verification:** Answers evidence row 5 (fail verdict at 394a5d869d2630a069a5ba2fd90fee0cad28bf49 on 2026-10-01): P1: Disable promisor lazy fetch - public394 missing-manifest fixture fetches and adds four Git pack files despite the read-only contract.

## Assigned Scope

Disable lazy fetching for every inspector Git operation. Public tests cover absent promised commit, tree and manifest blob, preserve the complete Git metadata inventory, and use a local transport tripwire. Unsupported Git must fail closed. One writer: codex-github-binding. Full AGENTS verification and native Receipt/close proof are required before the assembled correction candidate lands.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/github-binding-corrections | cce88dc68475ad52be96b52a17b446fd972ffc1e | ahead 1 behind 0 | 2 | Red cce88dc6 public missing-promisor regression: expected refusal fails because missing commit is fetched. Green inspector8/8: missing promised commit/tree/blob all refuse, transport tripwire remains absent and every Git metadata hash stays equal. Existing immutable/source/installed proof passes. Full final assembled-candidate suite remains pending. | Binding procedure documents disabled lazy fetch/optional locks and fail-closed Git compatibility, linked to official Git documentation. | F ambient Git environment and H RUNBOOK route corrective Tasks remain. Full assembled suite and independent final-candidate review/integration pending. | 5576c5d2ac943eead48e205955f5ef41bd22b837eb1b81c2a62ee53d56ba379b |
