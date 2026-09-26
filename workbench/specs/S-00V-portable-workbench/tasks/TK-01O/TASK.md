# TK-01O - A real cloud session lands a Task from GitHub alone, and a two-instance run shows the second skipping the first's claim

**Task ID:** TK-01O
**Spec ID:** S-00V
**Slice:** A real cloud session lands a Task from GitHub alone, and a two-instance run shows the second skipping the first's claim
**Status:** blocked
**Blockers:** TK-01N
**Destination:** spec-acceptance: S-00V box 8 (one real cloud session lands a Task from GitHub alone, and a two-instance run shows the second skipping the first's claim, both recorded as demo artifacts)
**Stance:** Builder
**Planned verification:** Demo artifacts (transcript, log or recording checkable in under a minute) for one real cloud session that clones from GitHub, claims by pushing, lands a Task and passes the ends-clean assertions, and for a two-instance run in which the second instance's `next` skips the first's claim; artifacts referenced from the Spec evidence; separate-context review of the recorded claims.

## Delivery

The milestone demos from Desired Behavior 7. A cloud host is an optional
capability of the dispatching session: if none is available, route this Task to
blocked naming that capability (capability-routing Task) instead of simulating
it. If starting a cloud session genuinely needs the owner's hand, that is the
one owner action to request, with the exact steps; it is not a review gate.
Pick a small real ready Task or a designated demo Task so the landed work is
genuine.

## Done Criteria

- Both artifacts are recorded and reachable from the Spec evidence, with the
  source commit each ran from.
