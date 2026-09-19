# TK-001 - Implement the Workbench self-drift seam, integrate it into update procedures, and prove cold-start-safe current state

**Task ID:** TK-001
**Spec ID:** S-00K
**Slice:** Implement the Workbench self-drift seam, integrate it into update procedures, and prove cold-start-safe current state
**Status:** deferred
**Blockers:** S-00K
**Destination:** spec-acceptance: S-00K Acceptance Criteria
**Planned verification:** Red disposable fixtures for stale current claims, resolved blockers, version/provenance drift, generated projection drift and unreadable required artifacts; green read-only self-drift seam, pre/post update receipt, focused/full suites and fresh no-memory read-back

**Stance:** Builder

Implement only after explicit S-00K activation. The seam must classify bounded
history versus current guidance, integrate into the canonical update procedure,
retain a machine-readable receipt and keep target-project drift separate.
