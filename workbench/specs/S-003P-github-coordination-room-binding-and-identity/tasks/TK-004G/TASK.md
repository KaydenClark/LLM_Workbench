# TK-004G - P1: Disable promisor lazy fetch - public394 missing-manifest fixture fetches and adds four Git pack files despite the read-only contract.

**Task ID:** TK-004G
**Spec ID:** S-003P
**Slice:** P1: Disable promisor lazy fetch - public394 missing-manifest fixture fetches and adds four Git pack files despite the read-only contract.
**Status:** ready
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-003P Acceptance Criteria
**Planned verification:** Answers evidence row 5 (fail verdict at 394a5d869d2630a069a5ba2fd90fee0cad28bf49 on 2026-10-01): P1: Disable promisor lazy fetch - public394 missing-manifest fixture fetches and adds four Git pack files despite the read-only contract.

## Assigned Scope

Disable lazy fetching for every inspector Git operation. Public tests cover absent promised commit, tree and manifest blob, preserve the complete Git metadata inventory, and use a local transport tripwire. Unsupported Git must fail closed. One writer: codex-github-binding. Full AGENTS verification and native Receipt/close proof are required before the assembled correction candidate lands.
