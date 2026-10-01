# TK-004L - P2: Pending close target disappears through linked or retired Task directories and retry closes another claimed Task - independent exact55beae7d public two-claim probes reproduce both directory cases

**Task ID:** TK-004L
**Spec ID:** S-00I
**Slice:** P2: Pending close target disappears through linked or retired Task directories and retry closes another claimed Task - independent exact55beae7d public two-claim probes reproduce both directory cases
**Status:** in-progress
**Blockers:** none
**Destination:** spec-acceptance: S-00I Acceptance Criteria
**Planned verification:** Answers evidence row 46 (fail verdict at 55beae7dbba12d96978c889f1cc25d3a3c1fc94d on 2026-10-01): P2: Pending close target disappears through linked or retired Task directories and retry closes another claimed Task - independent exact55beae7d public two-claim probes reproduce both directory cases

## Acceptance Boundary

- Refuse linked or nonordinary Task ownership directories before normal close selection, preserving records, link/file contents, index bytes and history.
- Recover an interrupted close from its retired native Task with its original receipt and evidence exactly once; never reopen or move it, or close another claim.
- Preserve marker-free historical Tasks and all prior receipt rows.

## Verification And Scope

Public seam: `node tools/test-spec-workbench.mjs --close-recovery-only` (eighteen scenarios). Primary linked-directory and retired-directory cases fail on frozen55 before code; native public move-task constructs the retired state. Full required51 union, committed-source identity, remote-head recovery and parent independent exact review remain required. Runtime functions: closeTask and adjacent assertCloseTaskDirectories only. No moveTaskRecord, report, tiny gate or global reader/selection/parser change.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/s00i-close-directory-recovery | 3234fa771751af3e6955723268b3278182405b4a | ahead 0 behind 0 | 4 | 18 public CLI interrupted-close scenarios green. Immutable55 primary linked-directory and native-retired directory recovery regressions red before source correction. Full committed required51 pending. | S-00I Close Directory Recovery Correction and TK-004L acceptance boundary. Generic templates unchanged for existing close runtime contract repair. | Parent independent exact-head review and serial shared-file assembly pending. Owner Human QA unapproved. No integration or main promotion. | aab1855803945af0f8479b3da657671b16fb643bb528e2e5220fdbe7c6ae2577 |
