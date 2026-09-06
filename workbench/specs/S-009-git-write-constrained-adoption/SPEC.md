# S-009 - Git-Write Constrained Adoption

**Spec ID:** S-009
**Status:** complete
**Priority:** 0
**Owner:** codex
**Updated:** 2026-07-13
**Catalog description:** Keep adoption safe and usable when a host cannot write Git metadata.
**Blockers:** none
**Latest event:** Spec completed and removed from the hot board.
**Next gate:** none

## Outcome

Adoption preserves its clean-tree baseline while giving agents a safe handoff
path when their host cannot create branches, stashes, commits, or other Git
metadata writes.

## Why It Matters

An adoption run should not instruct an agent to force a failing Git operation
or silently treat an uncommitted migration as complete when a constrained host
blocks Git metadata writes.

## Sanitized Feedback Record

- **Repository:** Little_Local_World
- **Feedback date:** 2026-07-02
- **Document/section:** ADOPTION.md -> Phase 0 / Guardrails
- **Fingerprint:** 261e2a436463
- **Paraphrase:** A host may permit ordinary document edits but block Git
  metadata writes; the adoption protocol needs an explicit safe handoff path.

## Desired Behavior

The generic protocol requires the agent to record the failed Git capability,
continue only reversible document work that the host permits, verify the
project's existing checks, and hand branch/stash/commit work to the owner.

## Decisions And Contracts

- A constrained host never bypasses the clean-tree policy or fabricates Git
  proof.
- The fallback is limited to permitted, reversible document migration work.
- The owner receives the Git-operation handoff and the recorded blocker.
- The generic template remains free of downstream project text and paths.

## Non-Goals

- Supporting arbitrary filesystem or repository failures.
- Changing branch, merge, or ownership policy.
- Claiming a behavioral outcome without repeated controlled trials.

## Dependencies And Blockers

- S-006 complete.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Add and verify the constrained Git-write adoption fallback | done | none | Targeted red/green, full suite, static evaluations, and guardrail audit passed; doctor and diff check passed after render. |

## Acceptance Criteria

- [x] The adoption template preserves the clean-tree requirement and states the constrained-host fallback.
- [x] The public Workbench adoption guidance states the same owner-handoff boundary.
- [x] A targeted regression is red against the baseline and green after the documentation change.
- [x] The full Workbench suite, static evaluations, guardrail audit, doctor, and diff check pass.

## Testing Seams

- A focused document-contract test that reads only the public Workbench README
  and generic adoption template.

## Verification Procedure

```bash
node tools/test-adoption-git-write-fallback.mjs
```

Then run the complete suite from `RUNBOOK.md`.

## Documentation Impact

- `templates/ADOPTION.md` owns the copy-ready migration protocol.
- `README.md` owns the filled public guidance and records the same handoff
  boundary; no root adoption protocol exists to duplicate.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-13 | TK-001 | Ticket closed | Targeted red/green, full suite, static evaluations, and guardrail audit passed; doctor and diff check passed after render. | Updated generic adoption template and public README; S-009 owns sanitized evidence. | No behavioral claim or repeated trials for this narrow documentation-contract fix. |
| 2026-07-13 | spec | Spec completed | Acceptance gates satisfied | Documentation impact recorded above | none |

## Completion Result

Pass. The adoption protocol now fails safely on unavailable Git metadata writes
without relaxing clean-tree requirements or claiming a behavioral improvement.

## Remaining Limitations Or Follow-Up Specs

- This correctness fix does not establish an agent-behavior improvement; no
  behavioral claim is made without repeated condition-blind trials.

## Supersession

- Supersedes: none
- Superseded by: none
