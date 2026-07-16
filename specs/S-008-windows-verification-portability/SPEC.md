# S-008 - Windows Verification Portability

**Spec ID:** S-008
**Status:** complete
**Priority:** 0
**Owner:** codex
**Updated:** 2026-07-13
**Catalog description:** Keep context output, spec-doctor, and eval-runner verification stable across Windows and POSIX hosts.
**Blockers:** none
**Latest event:** Spec completed and removed from the hot board.
**Next gate:** none

## Outcome

The feedback-automation setup can satisfy its full verification gate on Windows
without changing the portable output or generated-spec contracts used on macOS.

## Why It Matters

The current Workbench checkout and Codex scheduler run on Windows, while the
existing implementation was verified on macOS. Platform-only failures would
make the independent feedback gate block healthy candidates.

## Current Verified State

`test-context-tools.mjs` expects portable `/` paths but receives `\\` paths on
Windows. `spec-workbench.mjs doctor` also reports generated-region drift when a
valid checkout uses CRLF line endings. The provider-adapter test also resolves
the Windows Store `python3` stub and creates extensionless fake providers that
Windows cannot launch.

## Desired Behavior

Context-pack source labels always use `/`, spec-doctor compares generated
regions independently of line-ending style, Python subprocesses reuse or select
the correct platform interpreter, and fake providers use launchable wrappers.

## Decisions And Contracts

- Normalize serialized paths, not filesystem paths used for I/O.
- Treat CRLF and LF as equivalent only for generated-region comparison.
- Use `sys.executable` for grader subprocesses and the platform command in the
  Node adapter self-test and the held-out grader self-test.
- Wrap fake providers in `.cmd` launchers on Windows; preserve executable
  shebang files on POSIX.
- Preserve all feedback discovery, decision, and scheduler behavior.

## Non-Goals

- Changing feedback ranking, merge policy, models, cadence, or trial budgets.
- Reformatting repository files or changing their committed line endings.

## Dependencies And Blockers

- S-006 and S-007 complete.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Normalize context paths, generated-region comparisons, and Python invocation | done | none | Targeted regressions and complete Windows-equivalent suite passed; root 113/113, templates 106.6/113, live guardrail audit 78/100 |

## Acceptance Criteria

- [x] Context packs use `/` separators on Windows and POSIX hosts.
- [x] Spec doctor accepts equivalent LF and CRLF generated regions.
- [x] The provider-neutral eval-runner self-test passes on Windows and macOS.
- [x] The complete Workbench verification suite passes.

## Testing Seams

- Existing context-pack subprocess test on Windows.
- A generated spec fixture rewritten to CRLF before `doctor()`.
- Fake Codex and Claude adapters invoked through the platform Python runtime.

## Verification Procedure

```bash
node tools/test-context-tools.mjs
node tools/test-spec-workbench.mjs
node tools/test-eval-runner.mjs
node tools/test-feedback-automation.mjs
```

Then run the complete suite from `RUNBOOK.md`.

## Documentation Impact

- This spec owns the portability correction; operational commands remain
  unchanged because the supported project host is still macOS.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-13 | TK-001 red | Windows emitted backslash context labels, flagged CRLF generated regions as stale, resolved the `python3` Store stub, and could not launch extensionless fake providers | Context test failed on `src\\app.js`; pre-fix CRLF doctor regression failed; eval-runner and held-out grader self-tests failed at hard-coded Python/provider startup | S-008 created | Implement narrow normalization and platform launch handling |
| 2026-07-13 | TK-001 | Ticket closed | Targeted regressions and complete Windows-equivalent suite passed; root score 113; templates 106.6/113; guardrail 68/100 unchanged | S-008 owns the correction; no runbook command change because the supported runtime remains macOS | none |
| 2026-07-13 | spec | Spec completed | Acceptance gates satisfied | Documentation impact recorded above | none |
| 2026-07-13 | proof correction | Distinguished the guardrail self-test fixture score from the live repository audit | Live `node tools/audit-guardrails.mjs --path .` score is 78/100; 68/100 above is the self-test fixture output | Evidence corrected append-only | Real repeated outcome evidence remains intentionally absent |

## Completion Result

Pass. The feedback-automation verification contract is now portable across the
macOS scheduler host and this Windows Workbench host without changing pipeline
policy or evidence thresholds.

## Remaining Limitations Or Follow-Up Specs

- The root runbook remains macOS-oriented; Windows operators use `python` for
  the one direct grader command.

## Supersession

- Supersedes: none
- Superseded by: none
