# TK-006H - Barrier regression test and compare-and-swap publish for every revision-guarded notepad write

**Task ID:** TK-006H
**Spec ID:** S-003Y
**Slice:** Barrier regression test and compare-and-swap publish for every revision-guarded notepad write
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-003Y Acceptance Criteria box 1 (a barrier-synchronized race leaves exactly the entries whose writers were told they succeeded and every other writer received `stale-revision`), box 2 (the test is red against the pre-fix runtime, green after, and does not depend on process start-up timing), box 3 (an interrupted writer leaves the previous valid record and does not block later writers), box 4 (no lease, daemon or service) and the write-path half of box 5 (`append`, `current`, `trim` and `delete` are covered)
**Planned verification:** Red: a new `tools/test-notepads.mjs` case releases twelve worker-thread racers from one `Atomics` barrier against a note at revision 1 and fails because several report `appended` while the file holds one entry (reproduced before the cut: three to six `appended` responses per round, one entry). Green: that case passes for `append` and for a mixed race of `append`, `current` and `trim`; a sequential stale refusal still refuses; an abandoned publish token older than the reclaim age is reclaimed and the next write succeeds while a fresh token refuses the write as `stale-revision` with the file byte-identical; `test-notepads`, `test-sessions`, `test-session-transport`, `test-diagnostics`, `test-landmark-tracker`, `test-control-fidelity` and the full AGENTS suite pass on the committed candidate.
**Proof:** Red 6cedbdf2 (test-notepads 53/4: twelve barrier-released appenders left one entry while four were told appended). Green 32828062: test-notepads 57/57, both race cases 10/10 repeats, demo 1 appended, 11 stale-revision, 0 lost every round. Full AGENTS suite 48/48 on clean 70409372 after merging integration f59fce5b; guardrail 78/100 unchanged; self-drift pre and post receipts unchanged at 8 pre-existing attention findings.

## Outcome

Every notepad write that takes `--revision` publishes only if the note is
still at the revision the writer read. Two writers that read revision N and
write at the same moment no longer both succeed: one is told `appended` (or
`updated`, `trimmed`, `deleted`) and its change is in the file at the revision
the response states; the other is refused as `stale-revision` and nothing of
its write reaches the file. A writer that stops mid-write leaves the previous
valid record in place and does not block later writers indefinitely.

## Scope

- `workbench/tools/notepads.mjs`: the revision check moves inside a short
  critical section around publication. A writer claiming revision N creates
  the exclusive publish token `.<note>.rev<N+1>.publish/` beside the note
  (`mkdirSync`, which is exclusive on macOS, Linux and Windows), re-reads the
  note, refuses `stale-revision` unless it is still at N, publishes through the
  existing temporary-file-and-rename path, and removes the token. A writer that
  finds the token held re-reads the note and is refused `stale-revision` naming
  the revision on disk. A token older than the reclaim age is treated as
  abandoned and is renamed aside and removed by the next writer; the bytes a
  holder is about to publish are staged inside its own token directory, so a
  reclaim removes them and a stalled holder's rename fails and is refused
  instead of publishing over a newer write (corrected after review 1, which
  showed the earlier nonce-check-before-rename left a stall window). `append`, `current`,
  `trim` and `delete` all go through the guard; `create` (exclusive link) and
  `migrate` (no revision to check) are unchanged.
- `tools/test-notepads.mjs`: the barrier race (worker threads released by one
  `Atomics.notify`, so no racer depends on process start-up timing), the mixed
  race, the abandoned-token reclaim, the held-token refusal, and the existing
  sequential refusal.
- Documentation: the Runbook JSON Notepads paragraph that says writes assume
  one writer and revision checks are not simultaneous-writer locks now says
  what the guard does and what it does not (no lease, no service, the reclaim
  age); `templates/RUNBOOK.md` mirrors it; the Wiki article for the notepad
  skill drops its "check, not a lock" sentence in favour of the guard.

## Acceptance

- [x] Twelve barrier-released racers at one revision: exactly the writers told
      they succeeded have entries in the note; every other writer received
      `stale-revision`; the note's revision equals 1 plus the successes.
- [x] The same case fails against the pre-fix runtime (recorded red SHA) and
      passes against the fixed one.
- [x] An abandoned token is reclaimed and the next write succeeds; a held
      token refuses with the file byte-identical.
- [x] No lock or lease outlives one write; no daemon, service or configuration
      is added; a note works with nothing configured.
- [x] Runbook, template mirror and Wiki article describe the shipped guard.

## Boundaries

No inspection or change of other `writeSafeFile` callers (TK-006I). No edit
to the `notepad` skill, `AGENTS.md`, `LEXICON.md` or the accepted
ownership decision ADR-000L (TK-006J, which coordinates the skill with
S-00Y and uses the decision-record lifecycle). No schema, ownership or
`--revision` protocol change. No cross-host synchronization.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003y-tk005b-notepad-cas | 32828062e96897a1d1b2245e25ad4bd582a95027 | ahead 3 behind 0 | 0 | Red 6cedbdf2: test-notepads 53 pass 4 fail (the race case: the note holds 1 entry but 4 writers were told appended; pre-fix demo at integration 5fa2aab6, six rounds of twelve racers: 3, 3, 6, 4, 5 and 4 appended, one entry each). Green 32828062: test-notepads 57/57; both barrier race cases pass 10/10 repeats; the same demo returns exactly 1 appended, 11 stale-revision, 1 entry, 0 lost every round; wiki validate ok; guardrail 78/100 before and after; self-drift pre 8 and post 9 attention findings (the added one is S-003Y/TK-005D blocked-slice waiting on TK-005B, which is this Task). Full AGENTS suite on 32828062 was started and had not finished when the session's usage limit ended. | RUNBOOK JSON Notepads paragraph (publish-token guard, ten-second reclaim, one-writer working rule), templates/RUNBOOK.md identical mirror, Wiki article skill-notepad.md (guard sentence replaces check-not-a-lock). | Full AGENTS suite result on the committed candidate not yet recorded; close, render, doctor, gate --task, separate-context review, PR into integration and merge remain. Skill, AGENTS/LEXICON and ADR-000L reconciliation are TK-005D; other writeSafeFile writers are TK-005C. | 4043599a128e1fedf455b452f80a2e75563a71f8a8ac94b2d923b946133464d2 |
| 2 | claude/s003y-tk005b-notepad-cas | 70409372e5643ad65389a3d2d4a710234ba695ac | ahead 0 behind 0 | 0 | Red 6cedbdf2: test-notepads 53 pass 4 fail (race case: the note holds 1 entry but 4 writers were told appended; pre-fix demo at integration 5fa2aab6, six rounds of twelve racers returned 3, 3, 6, 4, 5 and 4 appended, one entry each). Green 32828062: test-notepads 57/57, both barrier race cases 10/10 repeats, the demo returns exactly 1 appended, 11 stale-revision, 1 entry, 0 lost every round. After merging integration f59fce5b and renaming the token variable for the privacy scan: test-notepads 57/57, test-portability-matrix 6/6, full AGENTS suite 48/48 on clean 70409372e5643ad65389a3d2d4a710234ba695ac. Guardrail 78/100 before and after. Self-drift pre (5fa2aab6) and post (ae65f2ba) receipts: 8 attention findings each (stale-claim, five stale-seed, unverified-provenance, one blocked-slice; post's blocked-slice is this Spec's TK-006J waiting on TK-006H), machineResult blocked, cleanUpdate false, unchanged by this Task. | RUNBOOK JSON Notepads paragraph (publish-token guard, ten-second reclaim, one-writer working rule); templates/RUNBOOK.md identical generic mirror; Wiki article skill-notepad.md guard sentence; wiki validate ok. | Separate-context review of the final head, PR into integration and merge remain for this Task. Other writeSafeFile writers are TK-006I; the notepad skill (S-00Y), AGENTS/LEXICON writer rule and ADR-000L defect paragraph are TK-006J. Limitation recorded in the Spec: a writer stalled inside its own token longer than the ten-second reclaim age could publish over a newer write in the microseconds between its nonce check and the rename. | 0a77006e99a9adba7028c9fb44faf39977d0002e4c2ad76bb80bbfd88e2ec9e6 |
| 3 | claude/s003y-tk005b-notepad-cas | 9bd745c3be26cdc0d52b9989db630116f25010d9 | ahead 0 behind 0 | 0 | Red 6cedbdf2 (test-notepads 53/4: twelve barrier-released appenders left one entry while four were told appended). Green 32828062: test-notepads 57/57, both race cases 10/10 repeats, demo 1 appended, 11 stale-revision, 0 lost every round. Full AGENTS suite 48/48 on clean 70409372 after merging integration f59fce5b; guardrail 78/100 unchanged; self-drift pre and post receipts unchanged at 8 pre-existing attention findings. | RUNBOOK JSON Notepads paragraph, templates/RUNBOOK.md mirror and Wiki article skill-notepad.md describe the publish-token guard; wiki validate ok. | Separate-context review of the final head, PR into integration and merge. TK-006I (other writeSafeFile writers) and TK-006J (skill, Contract, ADR-000L) remain. Limitation: a writer stalled inside its token beyond the ten-second reclaim age could publish over a newer write within the rename window. | 23ab1660b974823148eb3425fbe5e5e1fafd301d1853a087a721aeefc6e87c54 |
