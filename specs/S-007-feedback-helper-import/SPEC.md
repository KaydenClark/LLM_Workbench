# S-007 - Safe Feedback Helper Import

**Spec ID:** S-007
**Status:** complete
**Priority:** 0
**Owner:** codex
**Updated:** 2026-07-13
**Catalog description:** Allow the feedback helper to be imported when Node has no script path.
**Blockers:** none
**Latest event:** Inline-module import regression fixed and verified.
**Next gate:** none

## Outcome

`feedback-automation.mjs` remains a usable library when imported from an inline
Node module where `process.argv[1]` is absent.

## Why It Matters

The decision helper is both a CLI and a reusable module; its CLI entrypoint
guard must not crash valid import-only callers.

## Current Verified State

The final S-006 dry run reproduced `ERR_INVALID_ARG_TYPE` in `pathToFileURL`.

## Desired Behavior

Import-only execution exits successfully without invoking the CLI.

## Decisions And Contracts

- Preserve direct CLI behavior unchanged.

## Non-Goals

- Changing discovery or decision semantics.

## Dependencies And Blockers

- S-006 complete.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Guard missing inline script path | done | none | Inline import and feedback tests pass |

## Acceptance Criteria

- [x] Inline import succeeds.
- [x] Existing CLI and feedback tests remain green.

## Testing Seams

- `node --input-type=module -e` import with no `process.argv[1]`.

## Verification Procedure

```bash
node tools/test-feedback-automation.mjs
```

## Documentation Impact

- Docs checked; no update needed because this only corrects the module entrypoint
  guard to match the documented reusable helper behavior.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-13 | TK-001 red | Inline import crashed on absent `process.argv[1]` | Final operational dry run raised `ERR_INVALID_ARG_TYPE` | Docs checked; no update needed | Guard the entrypoint comparison |
| 2026-07-13 | TK-001 green | Entry guard now tolerates import-only execution | Inline import regression and existing feedback tests pass | Docs checked; no update needed | none |
| 2026-07-13 | spec | Spec completed | Targeted test, full suite, render, and doctor pass | Documentation impact recorded above | none |

## Completion Result

Pass. Import-only and CLI execution now coexist safely.

## Remaining Limitations Or Follow-Up Specs

- none

## Supersession

- Supersedes: none
- Superseded by: none
