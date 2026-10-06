# TK-02G - Medium: TK-01X Receipt run 1 names HEAD d5c0951 while its Docs cell includes close-time writes (TASKBOARD re-render, Spec slice table, TK-01Y release) that land only in close commit 46df442, mixing the verified candidate with the close commit's provenance. No runtime behavior finding

**Task ID:** TK-02G
**Spec ID:** S-01T
**Slice:** Medium: TK-01X Receipt run 1 names HEAD d5c0951 while its Docs cell includes close-time writes (TASKBOARD re-render, Spec slice table, TK-01Y release) that land only in close commit 46df442, mixing the verified candidate with the close commit's provenance. No runtime behavior finding
**Status:** done
**Blockers:** none
**Destination:** spec-acceptance: S-01T Acceptance Criteria
**Planned verification:** Answers evidence row 6 (fail verdict at 46df44295f4cc8ec5ff7800ce3f149f99747faa2 on 2026-09-26): Medium: TK-01X Receipt run 1 names HEAD d5c0951 while its Docs cell includes close-time writes (TASKBOARD re-render, Spec slice table, TK-01Y release) that land only in close commit 46df442, mixing the verified candidate with the close commit's provenance. No runtime behavior finding
**Proof:** Answered without a code change: the receipt-provenance Medium from the 46df442 fail verdict is resolved by the append-only correction row 'Correction: TK-01X Receipt run 1 provenance' (a66e19e), which separates the verified candidate d5c0951 from the close-time writes in 46df442. Re-reviews PASS at 957034a, e75f528, 05a382f, b7a404a and 9c0a82d; TK-01X landed in PR #198. TK-01Y applied the lesson by stating in its close that close-time writes land only in the close commit.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s01t-tk01y-distributions | 28a0a182fdc6191901a586161b8d7b3e7c450ec9 | ahead 0 behind 0 | 0 | Answered without a code change: the receipt-provenance Medium from the 46df442 fail verdict is resolved by the append-only correction row 'Correction: TK-01X Receipt run 1 provenance' (a66e19e), which separates the verified candidate d5c0951 from the close-time writes in 46df442. Re-reviews PASS at 957034a, e75f528, 05a382f, b7a404a and 9c0a82d; TK-01X landed in PR #198. TK-01Y applied the lesson by stating in its close that close-time writes land only in the close commit. | Docs checked; no update needed: the correction row already records the provenance | none | 5d043d12c11a6704570d366c60d01c72b1cfe04d49f9fcc528464789c9cfc05c |
