# TK-005B - Barrier regression test and compare-and-swap publish for every revision-guarded notepad write

**Task ID:** TK-005B
**Spec ID:** S-003Y
**Slice:** Barrier regression test and compare-and-swap publish for every revision-guarded notepad write
**Status:** ready
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-003Y Acceptance Criteria box 1 (a barrier-synchronized race leaves exactly the entries whose writers were told they succeeded and every other writer received `stale-revision`), box 2 (the test is red against the pre-fix runtime, green after, and does not depend on process start-up timing), box 3 (an interrupted writer leaves the previous valid record and does not block later writers), box 4 (no lease, daemon or service) and the write-path half of box 5 (`append`, `current`, `trim` and `delete` are covered)
**Planned verification:** Red: a new `tools/test-notepads.mjs` case releases twelve worker-thread racers from one `Atomics` barrier against a note at revision 1 and fails because several report `appended` while the file holds one entry (reproduced before the cut: three to six `appended` responses per round, one entry). Green: that case passes for `append` and for a mixed race of `append`, `current` and `trim`; a sequential stale refusal still refuses; an abandoned publish token older than the reclaim age is reclaimed and the next write succeeds while a fresh token refuses the write as `stale-revision` with the file byte-identical; `test-notepads`, `test-sessions`, `test-session-transport`, `test-diagnostics`, `test-landmark-tracker`, `test-control-fidelity` and the full AGENTS suite pass on the committed candidate.

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
  abandoned and is renamed aside and removed by the next writer; a holder
  verifies its own token nonce immediately before publishing so a reclaimed
  holder refuses instead of publishing over a newer write. `append`, `current`,
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

- [ ] Twelve barrier-released racers at one revision: exactly the writers told
      they succeeded have entries in the note; every other writer received
      `stale-revision`; the note's revision equals 1 plus the successes.
- [ ] The same case fails against the pre-fix runtime (recorded red SHA) and
      passes against the fixed one.
- [ ] An abandoned token is reclaimed and the next write succeeds; a held
      token refuses with the file byte-identical.
- [ ] No lock or lease outlives one write; no daemon, service or configuration
      is added; a note works with nothing configured.
- [ ] Runbook, template mirror and Wiki article describe the shipped guard.

## Boundaries

No inspection or change of other `writeSafeFile` callers (TK-005C). No edit
to the `notepad` skill, `AGENTS.md`, `LEXICON.md` or the accepted
ownership decision ADR-000L (TK-005D, which coordinates the skill with
S-00Y and uses the decision-record lifecycle). No schema, ownership or
`--revision` protocol change. No cross-host synchronization.
