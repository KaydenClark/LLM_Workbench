# TK-004F - P1: Isolate Git repository and configuration environment - public394 CLI with GIT_DIR/GIT_WORK_TREE resolves a foreign binding instead of refusing its SHA.

**Task ID:** TK-004F
**Spec ID:** S-003P
**Slice:** P1: Isolate Git repository and configuration environment - public394 CLI with GIT_DIR/GIT_WORK_TREE resolves a foreign binding instead of refusing its SHA.
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-003P Acceptance Criteria
**Planned verification:** Answers evidence row 5 (fail verdict at 394a5d869d2630a069a5ba2fd90fee0cad28bf49 on 2026-10-01): P1: Isolate Git repository and configuration environment - public394 CLI with GIT_DIR/GIT_WORK_TREE resolves a foreign binding instead of refusing its SHA.

## Assigned Scope

Isolate inherited Git subprocess environment in github-coordination.mjs. Public CLI regression must refuse a foreign repository SHA despite ambient selectors/configuration and retain real linked-worktree behavior. One writer: codex-github-binding. Full AGENTS verification and native Receipt/close proof are required before the assembled correction candidate lands.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/github-binding-corrections | aa32ff2f0b2a7a418e5de94bcf0114cc2403f0b4 | ahead 1 behind 0 | 2 | Public ambient-selector red ataa32ff2f resolves foreign repository unexpectedly. Targeted green3/3: ambient selectors/configuration ignored, genuine linked worktrees preserved and promised-object refusal/no-write regression remains green. Full installed inspector and assembled suite await committed-source validation. | Procedure names discarded ambient Git overrides and supported linked-worktree behavior. | Commit exact source before managed install10-test run, then TK004H routing and full final assembly/review. | 26a52f899a0676121c60af7fd674d62d4a28d4dd698799795a47a20b474ed606 |
