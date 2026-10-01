# TK-004I - P1: Isolate Git repository and configuration environment - public394 CLI with GIT_DIR/GIT_WORK_TREE resolves a foreign binding instead of refusing its SHA.

**Task ID:** TK-004I
**Collision recovery:** S-003P/TK-004F@5e8803f673898dd0eb716446fba5f61881d6a106:workbench/specs/S-003P-github-coordination-room-binding-and-identity/tasks/TK-004F/TASK.md; retained S-00I/TK-004F@7a51c53a528ff4dba407042a4de860bc66bb2d66:workbench/specs/S-00I-folder-lifecycle-for-records/tasks/TK-004F/TASK.md
**Spec ID:** S-003P
**Slice:** P1: Isolate Git repository and configuration environment - public394 CLI with GIT_DIR/GIT_WORK_TREE resolves a foreign binding instead of refusing its SHA.
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-003P Acceptance Criteria
**Planned verification:** Answers evidence row 5 (fail verdict at 394a5d869d2630a069a5ba2fd90fee0cad28bf49 on 2026-10-01): P1: Isolate Git repository and configuration environment - public394 CLI with GIT_DIR/GIT_WORK_TREE resolves a foreign binding instead of refusing its SHA.
**Proof:** Redaa32ff2f foreign ambient Git environment resolved incorrectly. Greend337006d10/10 inspector tests including receipt-backed installed hash/invocation, selector/object-store/config isolation, true linked worktrees and promised-object no-write checks.

## Assigned Scope

Isolate inherited Git subprocess environment in github-coordination.mjs. Public CLI regression must refuse a foreign repository SHA despite ambient selectors/configuration and retain real linked-worktree behavior. One writer: codex-github-binding. Full AGENTS verification and native Receipt/close proof are required before the assembled correction candidate lands.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/github-binding-corrections | aa32ff2f0b2a7a418e5de94bcf0114cc2403f0b4 | ahead 1 behind 0 | 2 | Public ambient-selector red ataa32ff2f resolves foreign repository unexpectedly. Targeted green3/3: ambient selectors/configuration ignored, genuine linked worktrees preserved and promised-object refusal/no-write regression remains green. Full installed inspector and assembled suite await committed-source validation. | Procedure names discarded ambient Git overrides and supported linked-worktree behavior. | Commit exact source before managed install10-test run, then TK004H routing and full final assembly/review. | 26a52f899a0676121c60af7fd674d62d4a28d4dd698799795a47a20b474ed606 |
| 2 | codex/github-binding-corrections | d337006d2314e644824538c6030259bcc5c13adc | ahead 0 behind 0 | 0 | Committed d337006d inspector10/10 PASS including installed exact receipt hash/invocation, four foreign Git selector/object-store configurations refused, ambient core.worktree ignored, real linked worktree preserved, and promised commit/tree/blob no-write/transport checks. | Binding procedure explains environment isolation and linked-worktree support. | TK004H route, then required final assembled suite and independent review/integration remain. | b106c8029831c28bc4afc62609681f0a1dceeed9d9a6a5ec69511f18e8c803f5 |
| 3 | codex/github-binding-corrections | 39464c464b216955d5daad537228cf4042290be5 | ahead 0 behind 0 | 0 | Redaa32ff2f foreign ambient Git environment resolved incorrectly. Greend337006d10/10 inspector tests including receipt-backed installed hash/invocation, selector/object-store/config isolation, true linked worktrees and promised-object no-write checks. | Existing binding procedure updated; active claim/control authority unchanged. | TK004H entry route and full final assembled suite/independent review/integration remain; full Spec and owner gates open. | 8b5b713fd3822bb98d7a8a872ca823a0d701b76e4d1ddf711f0b8b73a80f0ca6 |
