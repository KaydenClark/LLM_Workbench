---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner direction 2026-09-05 (a passed review and an explicit instruction to push to integration were followed by an unneeded merge question)
  - Owner direction 2026-09-23 (agent-invented owner gates stalled the v4 Specs)
  - Promoted from host auto-memory by the S-00V TK-00I audit, 2026-09-26
source_paths:
  - AGENTS.md
  - workbench/specs/S-00V-portable-workbench/SPEC.md
last_verified: 2026-09-26
---

# Finish authorized work

When the owner says a thing needs doing, that instruction is the authorization.
When the controls already grant a step and its stated gate is satisfied, carry
it through and report what was done. Stopping to confirm reads to the owner as
the harness failing: the work does not land, and the controls look
untrustworthy because they did not make the finished state legible.

## What this rules out

- **Confirmation stalls.** Asking whether to merge a candidate whose
  separate-context review passed, after being told to push to integration. The
  [AGENTS Branch Completion](../../AGENTS.md#branch-completion) rule already
  says to open, merge and confirm containment; merged branches are deleted
  without being asked.
- **Manufactured owner gates.** Adding an "owner reviews before
  implementation", "owner approval row" or "record the owner QA rule" gate the
  controls do not name. In September 2026 seven v4 Specs sat for days in a loop
  where the build waited on Human QA and Human QA waited on the build, until the
  owner stepped in.

## When the owner is still needed

A step needs the owner only for a real product tradeoff with options, a
recommendation and a cost, or for the destructive, public-contract and safety
cases [AGENTS Safety And Change Control](../../AGENTS.md#safety-and-change-control)
names. If a control is too ambiguous to act on, that ambiguity is itself the
finding: repair the control, with a test that locks it, rather than routing
around it with a question. Before escalating, see
[derive-before-asking-the-owner](derive-before-asking-the-owner.md).

Related: [owner-authored-adrs-are-accepted](owner-authored-adrs-are-accepted.md),
[pc-test-at-main-readiness](pc-test-at-main-readiness.md).
