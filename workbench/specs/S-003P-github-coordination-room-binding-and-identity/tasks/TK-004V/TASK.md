# TK-004V - P2: Correct collision recovery reference and rollback boundaries - independent exact25d3 four public probes confirm foreign-qualified ID corruption, escaped JSON bypass, ignored Markdown mutation and leftover projection temporary after rollback.

**Task ID:** TK-004V
**Spec ID:** S-003P
**Slice:** P2: Correct collision recovery reference and rollback boundaries - independent exact25d3 four public probes confirm foreign-qualified ID corruption, escaped JSON bypass, ignored Markdown mutation and leftover projection temporary after rollback.
**Status:** in-progress
**Blockers:** none
**Destination:** spec-acceptance: S-003P Acceptance Criteria
**Planned verification:** Answers evidence row 22 (fail verdict at 25d3f4d23b3719693065336a4ba66349d0a95907 on 2026-10-01): P2: Correct collision recovery reference and rollback boundaries - independent exact25d3 four public probes confirm foreign-qualified ID corruption, escaped JSON bypass, ignored Markdown mutation and leftover projection temporary after rollback.

## Scope

Answer the four independently confirmed public probes at integration `25d3f4d23b3719693065336a4ba66349d0a95907`: preserve foreign-qualified identities while updating local references, refuse decoded unsupported JSON references before moving, refuse any external rewrite outside tracked Git sources, and clean only the projection temporary created by a failed atomic write. Preserve pre-existing temporary files and the original failure.

Use the existing collision CLI fixture and targeted atomic-write boundary. Do not change ordinary retirement, close, gate, allocator, Issue service, owner approval or Factory behavior. Preserve original done records, Receipt bytes and every historical PASS/FAIL. Shared `atomicWrite` is the only common writer change; retain its pathname write seam for existing failure fixtures.

## Completion / Exit Condition

Public red/green regressions cover all four failures, full file/index/ref and ignored-file preservation on refusal or rollback, successful collision recovery, supported retirement and retry after rollback. Run the complete current verification union plus the delivered stage-two board seam and receipt-backed installed collision checks. Commit/push the verified candidate before native Receipt/close, freeze the final assembly for independent parent review, and hand back for coordinated integration. No direct merge, whole-Spec completion, owner Human QA, main promotion or clean-update claim.
