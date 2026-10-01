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

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/github-collision-reference-safety | 8fbde5856197751cdc0f9ec5916c8714a4896487 | ahead 0 behind 0 | 0 | Committed redf091e923 public cases reproduce all four postdelivery P2 gaps. Green8fbde585 collision43/43 PASS adds qualified ownership, escaped slash/unicode/key JSON refusal, ignored-file preservation, projection rename/partial-write rollback and retry, pre-existing/foreign temporary preservation with explicit incomplete recovery. Initial partial-write fixture ENOENT was corrected and its failed log retained. | Root/template collision procedure bounds updated. Done records and historical PASS/FAIL/Receipts preserved. Ordinary retirement/close/gate/Issue behavior unchanged. | Final current-base union with independently reviewed/delivered batch R, all13batch groups, board/close/binding and full verification, installed collision proof and exact independent parent review pending. No direct merge or real rename use before release. FullSpec/owner/main gates remain open. | 751600d43022556c3dae32ce009a71e6a70258b2c526f459e6d68b09d509f1bc |
| 2 | codex/github-collision-reference-safety | 91d33fb9f8eddd030133e1ad89490de869f65df7 | ahead 0 behind 0 | 0 | Public committed red53482004 exposes ignored literal-wildcard tracking bypass; green91d33fb9 collision46/46 PASS. Qualified identity, decoded JSON slash/unicode/key and invalid JSON refusal, ignored source and moving-file preservation, owned projection temporary cleanup, partial-write/rename rollback, retry and foreign temporary retention pass. Board59 and binding10 passed on8fbde585 before final literal guard. | Root/template RUNBOOK collision bounds maintained; historical Task/Receipt/PASS/FAIL records preserved. | Receipt1 prospective batch-R union condition is superseded by Director platform-review STOP: R remains unreviewed and excluded. V stays independently scoped at delivered integration574df962. Actual AGENTS plus RUNBOOK required command-set coverage, installed46 and immutable parent review pending. No direct merge, cleanup or primary FF; fullSpec owner/main remain open. | 4ab63774578ea405e4412cf0f768dbf29ddea1acda6e5492d31f47db8bb19d3e |
