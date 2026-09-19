# TK-0SB - Define seed and provenance identity semantics for self-drift findings

**Task ID:** TK-0SB
**Spec ID:** S-00K
**Slice:** Define seed and provenance identity semantics for self-drift findings
**Status:** done
**Blockers:** none
**Destination:** spec-acceptance: S-00K Acceptance Criteria
**Planned verification:** Red: same-named or same-byte seeded artifacts with different source generations are treated as current; green: source repository/release/commit/hash identity classifies drift without rewriting historical evidence

**Stance:** Builder
**Proof:** Full 51-command suite passed on immutable 58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c; separate-context source review PASS; shared command proof in S-00U/VERIFICATION.md.

Define the self-drift identity tuple for seeded documents and manifest
provenance. Preserve historical receipts and name unresolved identity limits;
do not repair seeded artifacts in this Task.

## Progress

Implemented in the read-only self-drift seam and covered by focused fixtures at
`e7b0906025909b9edd626e967b15e526e5d02509`. Historical source identity, installed
source and unverified native callability remain distinct. Shared full proof and
independent semantic read-back remain pending; no installed files changed.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/parallel-repair-assembly | 6bf32fc2e414de8be439622f73a00f76d762bbf3 | none | 4 | Full 51-command suite passed on immutable 58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c; separate-context source review PASS; shared command proof in S-00U/VERIFICATION.md. | Owning Spec and named runtime/control/Wiki/reconciliation documentation updated; see S-00U/VERIFICATION.md and per-Spec evidence. | Owner Human QA and whole-Spec closure are separate; declared native/external/consumer limits remain. Final proof-state delta review pending. | 11f53bebcf4dd6d2036f4cd481cf6108c79947f51ce2c46f1981fdc9ae9fb204 |
