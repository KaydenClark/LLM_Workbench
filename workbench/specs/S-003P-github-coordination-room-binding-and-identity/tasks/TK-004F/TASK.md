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
