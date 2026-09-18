# TK-006 - Gate discard of retired records on verified `main`, a clean reference scan and recoverable Git identity

**Task ID:** TK-006
**Spec ID:** S-00I
**Slice:** Gate discard of retired records on verified `main`, a clean reference scan and recoverable Git identity
**Status:** in-progress
**Blockers:** TK-005
**Destination:** spec-acceptance: S-00I Acceptance Criteria
**Planned verification:** Red: discard is refused before verified `main` containment, before a clean complete scan, without a recoverable commit and path, and always for `archive`; green: discard after every gate, a later corrective Task loads the reconciled Wiki claim without restoring `SPEC.md`
