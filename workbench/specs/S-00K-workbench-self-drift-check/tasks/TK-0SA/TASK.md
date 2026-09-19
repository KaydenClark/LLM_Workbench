# TK-0SA - Reconcile the old release hot-queue with its current owner and Sol-coordinated disposition

**Task ID:** TK-0SA
**Spec ID:** S-00K
**Slice:** Reconcile the old release hot-queue with its current owner and Sol-coordinated disposition
**Status:** in-progress
**Blockers:** none
**Destination:** spec-acceptance: S-00K Acceptance Criteria
**Planned verification:** Red: a stale release hot-queue claim remains current-facing without an owner or disposition; green: the self-drift result routes it to the existing owner, records Sol coordination and preserves historical evidence

**Stance:** Reconciler

Trace S-014/S-022-style release claims through existing owners. Coordinate with
Sol where named, but do not reopen completed evidence, delete history or perform
release work.
