# TK-002 - Ratchet the registry so every diagnostic carries remediation text

**Task ID:** TK-002
**Spec ID:** S-00N
**Slice:** Ratchet the registry so every diagnostic carries remediation text
**Status:** done
**Blockers:** none
**Destination:** spec-acceptance: S-00N Acceptance Criteria
**Planned verification:** Red: temporarily empty one registry remediation and observe the test fail; green: the whole real registry passes unchanged

**Stance:** Builder
**Proof:** Full 51-command suite passed on immutable 58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c; separate-context source review PASS; shared command proof in S-00U/VERIFICATION.md.

Replace the two-code spot check with a whole-registry assertion. Record that
the green result is a future-addition ratchet, not a repair of existing entries.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/parallel-repair-assembly | 6bf32fc2e414de8be439622f73a00f76d762bbf3 | none | 8 | Full 51-command suite passed on immutable 58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c; separate-context source review PASS; shared command proof in S-00U/VERIFICATION.md. | Owning Spec and named runtime/control/Wiki/reconciliation documentation updated; see S-00U/VERIFICATION.md and per-Spec evidence. | Owner Human QA and whole-Spec closure are separate; declared native/external/consumer limits remain. Final proof-state delta review pending. | 74736f4cbf7fcb6841147386c480eef9b575e9a5dad42ba79bdee5b6d78d8a01 |
