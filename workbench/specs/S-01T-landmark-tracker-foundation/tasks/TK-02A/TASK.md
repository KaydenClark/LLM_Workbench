# TK-02A - Keep live Tracker references and historical proof through record moves

**Task ID:** TK-02A
**Spec ID:** S-01T
**Slice:** Keep live Tracker references and historical proof through record moves
**Status:** deferred
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Live and historical references survive supported movement/retirement; discarded tracked source proof can be recovered from the named commit
**Planned verification:** Red: in a disposable committed room, `move-spec` and `move-task` leave a DQC or landmark JSON reference to the moved record dangling; discard of a record a live Tracker reference depends on succeeds. Green: supported moves and retirement rewrite live JSON references while immutable commit/path citations stay interpreted at their original tree; discard with a genuine live Tracker dependency is refused by name; an approved fixture discard recovers exact source bytes from the named commit; ignored notes are never claimed recoverable through Git. Targeted tests, then the full AGENTS suite; a demo of the public move and recovery path in under a minute.

## Release

Lane J releases this Task by setting Status `ready` once TK-01X is done and
[S-00I TK-01U](../../../S-00I-folder-lifecycle-for-records/tasks/TK-01U/TASK.md)
is done on integration. `workbench/tools/spec-workbench.mjs` and
`tools/test-spec-workbench.mjs` are serialized behind S-00J TK-01S/TK-01T and
S-00I TK-01U, which write the same files; the runtime cannot resolve that
cross-Spec order, so the Task is `deferred` with no Blockers entry.

## Scope Note

The earlier packet draft proposed a structured bridge between Landmark
articles and retirement `source_paths`. That is unnecessary: feature articles
keep S-00I's Spec-ID provenance and Landmark Wiki pages are a different type
(see TK-01Z). This Task extends live JSON reference consumers only. Reuse the
existing F4/F5/F7 and identity repairs; do not reopen repaired behavior or
manufacture owner-only main containment. No real project record is retired or
discarded as a test.

## Paths

`workbench/tools/spec-workbench.mjs`, `tools/test-spec-workbench.mjs`, the
Tracker runtime and test, and `workbench/landmark-tracker/README.md`. Runbook
wording goes to Remaining Gaps for S-00P.

## Done Criteria And Closing Proof

Red and green SHAs, targeted tallies, full suite on the committed candidate,
doctor, demo command, docs touched and Remaining Gaps.
