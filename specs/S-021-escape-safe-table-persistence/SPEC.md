# S-021 - Escape-Safe Markdown Table Persistence

> Generated from LLM Workbench v2.3. Stable path
> `specs/S-021-escape-safe-table-persistence/SPEC.md`; never move between status folders.

**Spec ID:** S-021
**Status:** complete
**Priority:** 0
**Owner:** codex
**Updated:** 2026-07-17
**Catalog description:** Preserve escaped pipes and backslashes across spec lifecycle and feedback tables while rejecting malformed rows without partial writes.
**Blockers:** none
**Latest event:** Auditor remediation assigned the merged PR #33 parser behavior to one cohesive completed capability spec.
**Next gate:** none

## Outcome

Workbench Markdown tables safely round-trip commands and evidence containing
escaped pipes or backslashes across lifecycle and feedback workflows, while
malformed active rows fail visibly before durable state is partially changed.

## Why It Matters

Specs and HARNESS_FEEDBACK rows carry executable commands, evidence, and proposed
changes. Treating an escaped pipe as a delimiter corrupts that durable truth and
can make an audited release appear healthy while later lifecycle writes lose data.

## Current Verified State

- PR #33 merged shared `tools/markdown-table.mjs` into integration at exact SHA
  `60f62917d4ed1ae8000478d62fab56a7afc54816`.
- `tools/spec-workbench.mjs` uses the shared parser for ticket and evidence rows.
- `tools/feedback-automation.mjs` uses the same parser for HARNESS_FEEDBACK rows.
- Lifecycle tests round-trip `node test \| tee proof.log` and prove a rejected
  mutation leaves the spec unchanged.
- Feedback tests preserve escaped pipelines and Windows-style backslashes, and
  reject an unescaped extra delimiter with the exact line and column count.
- S-014 retains the release audit and publication history; S-021 now owns the
  implemented persistence capability.

## Desired Behavior

- One shared parser recognizes Markdown escape rules used by both consumers.
- Escaped pipes remain literal cell content and backslashes survive round-trip.
- Table writers escape cell content through the matching shared seam.
- Malformed lifecycle or feedback rows produce explicit errors with source context.
- A rejected lifecycle mutation makes no partial durable write.

## Decisions And Contracts

- Markdown remains the canonical durable format; no database or parallel store is added.
- Lifecycle and feedback consumers share one parser rather than maintaining subtly
  different delimiter behavior.
- Active malformed rows fail closed. They are never silently dropped or repaired.
- Parser correctness is release-critical because it protects requirements,
  blockers, commands, feedback, and proof.

## Non-Goals

- Implementing a complete CommonMark parser.
- Reformatting historical evidence or unrelated Markdown tables.
- Changing ticket lifecycle, feedback ranking, or automation decision semantics.

## Dependencies And Blockers

- [S-001](../S-001-progressive-disclosure/SPEC.md) owns the stable lifecycle.
- [S-006](../S-006-feedback-automation/SPEC.md) owns feedback automation.
- [S-014](../S-014-workbench-release-candidate/SPEC.md) retains PR #33 release evidence.

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Add one escape-aware parser and matching cell escaper | done | none | shared parser source and focused parser assertions in both consumer suites |
| TK-002 | Preserve lifecycle ticket and evidence rows without partial writes | done | TK-001 | lifecycle escaped-pipe round-trip and rejected-mutation fixture |
| TK-003 | Preserve feedback pipelines and reject malformed active rows | done | TK-001 | feedback pipeline/backslash round-trip and explicit malformed-row fixture |

### Historical Done Criteria And Demo

- **TK-001 done criteria:** escaped delimiters and backslashes parse as literal
  cell content; the matching writer escapes them deterministically; malformed
  rows expose their real cell count. **Under-one-minute demo artifact:**
  `tools/markdown-table.mjs` plus the two green focused consumer test outputs.
- **TK-002 done criteria:** `close` preserves a literal pipeline in the ticket
  row and evidence log; malformed spec rows stop the mutation before any file
  change. **Under-one-minute demo artifact:**
  `node tools/test-spec-workbench.mjs` prints the green lifecycle result.
- **TK-003 done criteria:** a six-column feedback row containing an escaped
  pipeline and Windows path remains one candidate; an unescaped extra delimiter
  throws with source line and expected/actual columns. **Under-one-minute demo
  artifact:** `node tools/test-feedback-automation.mjs` prints the green parser,
  discovery, and decision result.

## Acceptance Criteria

- [x] Escaped pipes and backslashes round-trip through the shared parser.
- [x] Lifecycle ticket proof and append-only evidence preserve literal pipelines.
- [x] Rejected lifecycle mutations leave no partial persistence.
- [x] Feedback rows preserve escaped pipelines and paths.
- [x] Malformed active feedback and spec rows fail with explicit source context.
- [x] Both focused consumer suites and complete Workbench verification pass.
- [x] The demo can be checked in under one minute with two local commands.

## Testing Seams

- Pure `parseMarkdownTableRow` and `escapeMarkdownTableCell` behavior.
- Temporary lifecycle repository with escaped proof and malformed ticket rows.
- Injected HARNESS_FEEDBACK rows with escaped and unescaped pipelines.
- File-before/file-after equality after a rejected lifecycle mutation.

## Verification Procedure

```bash
node tools/test-spec-workbench.mjs
node tools/test-feedback-automation.mjs
node tools/spec-workbench.mjs doctor
```

Then run the complete verification suite in `RUNBOOK.md`.

## Documentation Impact

- This spec owns escape-safe persistence requirements, acceptance, and proof.
- S-014 remains the release/audit record and links forward to this capability.
- No Runbook command or public setup behavior changed during this ownership repair.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-16 | TK-001 through TK-003 | PR #33 repaired escaped Markdown table persistence and passed independent exact-head audit | Focused lifecycle and feedback red/green fixtures; complete Runbook suite; root 113/113; templates 106.6/113; live guardrail 78/100; render, doctor, and diff check passed | S-014 captured the release event; operational commands remained accurate | Durable cohesive capability ownership was missing |
| 2026-07-17 | canon remediation | Assigned the implemented parser and both consumers to S-021 without changing product behavior | Focused lifecycle and feedback suites, complete Runbook verification, root 113/113, templates 106.6/113, live guardrail 78/100, render, doctor, and diff check passed | Added S-021 and updated coverage/catalog; Runbook checked with no change needed | none |

## Completion Result

Pass. One shared escape-aware persistence seam protects lifecycle and feedback
tables, rejects malformed active data explicitly, and prevents partial spec writes.

## Remaining Limitations Or Follow-Up Specs

- The helper intentionally supports the Workbench table subset, not all CommonMark.

## Supersession

- Supersedes: S-014 as capability owner only; S-014 remains immutable release evidence.
- Superseded by: none
