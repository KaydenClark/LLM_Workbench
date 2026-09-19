# TK-001 - Implement the Workbench self-drift seam, integrate it into update procedures, and prove cold-start-safe current state

**Task ID:** TK-001
**Spec ID:** S-00K
**Slice:** Implement the Workbench self-drift seam, integrate it into update procedures, and prove cold-start-safe current state
**Status:** done
**Blockers:** none
**Destination:** spec-acceptance: S-00K Acceptance Criteria
**Planned verification:** Red disposable fixtures for stale current claims, resolved blockers, version/provenance drift, generated projection drift and unreadable required artifacts; green read-only self-drift seam, pre/post update receipt, focused/full suites and fresh no-memory read-back

**Stance:** Builder
**Proof:** Full 51-command suite passed on immutable 58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c; separate-context source review PASS; shared command proof in S-00U/VERIFICATION.md.

Implement only after explicit S-00K activation. The seam must classify bounded
history versus current guidance, integrate into the canonical update procedure,
retain a machine-readable receipt and keep target-project drift separate.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/parallel-repair-assembly | 6bf32fc2e414de8be439622f73a00f76d762bbf3 | none | 1 | Full 51-command suite passed on immutable 58a1b3b2caaaa0ece5414d4c027d97c388ab1b1c; separate-context source review PASS; shared command proof in S-00U/VERIFICATION.md. | Owning Spec and named runtime/control/Wiki/reconciliation documentation updated; see S-00U/VERIFICATION.md and per-Spec evidence. | Owner Human QA and whole-Spec closure are separate; declared native/external/consumer limits remain. Final proof-state delta review pending. | 90e644cb7b7e6933e465e438631a3eaf8771c366f60eaad6d26b09c73da2f1e7 |
