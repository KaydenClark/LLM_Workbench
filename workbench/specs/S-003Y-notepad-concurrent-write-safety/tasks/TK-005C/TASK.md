# TK-005C - Inspect the other revision-carrying writeSafeFile writers for the check-then-act shape

**Task ID:** TK-005C
**Spec ID:** S-003Y
**Slice:** Inspect the other revision-carrying writeSafeFile writers for the check-then-act shape
**Status:** ready
**Stance:** Auditor
**Blockers:** none
**Destination:** spec-acceptance: S-003Y Acceptance Criteria box 5, inspection half (the inspection of other `writeSafeFile` writers that carry a revision is recorded) and the first sentence of Remaining Limitations (a separate seam becomes its own Spec)
**Planned verification:** Read-only inspection of every `writeSafeFile` caller that compares a revision, hash or expected content before publishing: the Landmark Tracker's `revise`, `link` and `relate` (`--expect-revision`), `sessions.mjs promote` (hash check) and `session-transport.mjs` (its own `wx` operation lock). For each, record whether the check and the publication are separate steps, whether two writers reading the same revision can both succeed, and whether the seam is the notepad `publish` path repaired by TK-005B. A finding that shares the seam is fixed here with a red/green case in its own test file; a finding on a separate seam is recorded in this Spec's Remaining Limitations as the owner of a follow-up Spec, not fixed here. `test-landmark-tracker`, `test-sessions`, `test-session-transport` and the full AGENTS suite pass on the committed candidate.

## Outcome

The Spec's behavior 6 is answered with evidence: every other record writer
that publishes through `writeSafeFile` under a revision or hash check is named,
its shape is classified, and the one that shares the notepad seam (if any) is
repaired, while a separate seam is routed to its own follow-up.

## Scope

- `workbench/tools/landmark-tracker.mjs` (`--expect-revision` on `revise`,
  `link`, `relate`; its own README states the comparison is not a lock),
  `workbench/tools/sessions.mjs` (`promote` read-back and hash check),
  `workbench/tools/session-transport.mjs` (operation lock), and any other
  caller `grep -n writeSafeFile workbench/tools tools` names at the time.
- This Spec's evidence row and Remaining Limitations carry the classification.
- A shared-seam fix, if any, lands with a red/green case in that tool's test.

## Acceptance

- [ ] Every revision- or hash-checked `writeSafeFile` writer is named with its
      check-then-act classification in this Spec's evidence.
- [ ] A writer that shares the notepad publish seam is repaired red/green;
      a separate seam is recorded as a follow-up without a fix here.

## Boundaries

No change to a writer whose seam is separate; no new Spec is created by this
Task, only named. No notepad runtime change (TK-005B).
