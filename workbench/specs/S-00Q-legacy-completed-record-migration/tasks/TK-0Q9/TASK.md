# TK-0Q9 - Discard verified waves and prove post-discard coherence

**Task ID:** TK-0Q9
**Spec ID:** S-00Q
**Slice:** Discard verified waves and prove post-discard coherence
**Status:** blocked
**Blockers:** TK-0Q8
**Destination:** spec-acceptance: S-00Q Acceptance Criteria lines 7-10
**Stance:** Reconciler
**Planned verification:** Red: each candidate wave is refused until its exact retirement commit is contained in the freshly resolved declared default branch, current references are zero and the recovery identity is complete; green: discard succeeds wave by wave, every printed recovery command restores the full directory in a disposable checkout, no discarded-reference remains, the full suite and cold-route checks pass, and one corrective Task updates a Wiki claim without restoring SPEC.md.

## Delivery

Discard in bounded capability waves, never as one bulk deletion. Refresh remote
state at execution time, preserve the exact containment proof, use only the
verified `discard` command, and read back `DISCARDS.md` after every operation.
Finish with a 50-path accounting report and explicit list of records still
active, retired or excluded.

## Preservation And Rollback

The pre-discard state is the verified default-branch retirement commit. Exercise
the exact recovery command before proceeding to the next wave. A failed wave
stops immediately; recover on a new branch from the recorded SHA/path and do not
rewrite published history or manually reconstruct evidence.

## Done Criteria

- Every discard gate is independently satisfied per wave.
- Wiki, ADR, link, append-only, render, doctor and full-suite checks are green.
- Recovery and corrective-Task paths work after real discard.
- All 50 source paths and S-00H have a truthful final disposition.
