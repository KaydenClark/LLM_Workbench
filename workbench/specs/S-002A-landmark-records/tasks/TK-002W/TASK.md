# TK-002W - Keep one live DQC home correct after a Spec move

**Task ID:** TK-002W
**Spec ID:** S-002A
**Slice:** Keep one live DQC home correct after a Spec move
**Status:** deferred
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Live JSON references survive supported moves/retirement while historical citations retain immutable interpretation; genuine tracked dependencies refuse discard and approved fixture recovery reproduces named bytes.
**Planned verification:** Predicted red, not yet observed: in a disposable committed room, public move-spec moves one eligible completed Spec while the existing DQC expectedResult.home still names its old repository-relative SPEC.md path; scan/report omits this stale JSON route. Green: move-spec updates that one current home with a named count, reports resolved destination, preserves DQC origin/history and immutable git-show SHA:path proof byte-for-byte; source reload/rebuild follows existing record schema with stable identity. Named invalid input/refusal preserves files/index. Targeted new public lifecycle JSON tests, existing Tracker/lifecycle suites, full AGENTS candidate proof and an under-minute one-command move demo.

## Release Gate

Planning-only; do not claim or spawn an implementation worker yet. Active
S-00I TK-01U owns dirty shared spec-workbench.mjs/test-spec-workbench.mjs and
path/layout consumers. Director releases this exact file slot against an
immutable integration/seam candidate, or coordinates a clean serial base, then
Records dispatcher changes this Task to ready. No whole S-00I completion gate
or invented cross-Spec blocker token applies. Import updated peer inventory
before any later allocation; this Task was reserved after actual U/V records.

## Observable Outcome

A caller moves an eligible completed Spec through the existing public move-spec
command, then reads the DQC whose intended durable home names that Spec. Its
current home resolves at the moved path. Earlier record history and immutable
proof still explain the original tree. One behavior pierces existing CLI,
JSON persistence/reference rewrite, receipt/output, reload and public tests.

## Smallest Fixture And Contract

- Reuse existing disposable Git-room and completed-Spec fixture conventions;
  satisfy current move eligibility, never manufacture owner approval in the
  real repository or change completion/main gates.
- Capture one actual DQC through the existing public API/CLI, add Expected
  result with home `workbench/specs/<fixture>/SPEC.md`, and commit the fixture.
  Preserve its origin/history and one immutable citation naming the pre-move
  commit/tree.
- Exercise public move-spec into its supported retired folder. Verify live
  expectedResult.home rewrites, exact source identity remains, historical
  bytes stay unchanged, and generated projection is rebuilt coherently.
- Scope JSON traversal to declared tracked Tracker collections and genuine
  live path fields; no broad string replacement or unrelated note scan.
  Recognize immutable citation forms explicitly. Trace validation/preflight
  so malformed JSON or unsafe paths cannot produce a partial move/index write.
- Preserve existing JSON schema and typed relationship edge ownership.
  Subsequent move-task/discard/refusal/recovery widening are separate slices,
  not claimed complete by this narrow first move path.

## File Lane At Release

Existing spec-workbench.mjs reference collector/planner/report is a confirmed
shared seam and requires explicit release. Prefer own new
`tools/test-tracker-json-move.mjs` for the public fixture instead of growing a
concurrent shared test file. A narrow new runtime helper may be appropriate
only if its same Task integrates into public move-spec before closure; no
horizontal helper-only delivery. Any additional file follows traced need and
Director collision arbitration. Do not write H/DQC/Tracker live files now.

## Done Criteria

Semantic red and green immutable SHAs; public move/reload/counts and historical
byte proof; no-write malformed/refusal snapshots; existing regressions and full
checks, docs status, self-drift/guardrail limits, under-minute demo. Worker
self-check/receipts, dispatcher QA and separate-context review. No real record
cleanup, release/version/main or owner Human QA reset.
