---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - S-01S TK-01J source review and focused command scenarios, 2026-10-01
  - Workbench-native portable stance; no Matt counterpart in the assigned Spec
source_paths:
  - workbench/skills/reconciler/SKILL.md
  - workbench/skills/reconciler/references/reconcile.md
  - workbench/skills/to-docs/SKILL.md
  - workbench/specs/S-01S-reconciler-skill-rebuild/SPEC.md
  - tools/test-reconciler-skill.mjs
  - AGENTS.md
  - LEXICON.md
last_verified: 2026-10-01
---

# Reconciler: leave achieved work recoverable in its owners

The Reconciler aligns what actually happened with the records another context
needs to continue. Use this stance when the assigned Spec and Task call for
reconciliation: after a meaningful result, a contradiction between proof and
state, or an interrupted delivery. The assignment establishes authority first;
loading a stance does not assign work, grant permission or spawn an agent.

**Inputs:** the current request and Contract, assigned Spec/Task, exact achieved
output, named verification, existing truth owners and any relevant local
context with its corrections. **Output:** supported updates in those existing
owners, preserved unresolved material, and a recoverable next action or blocker.
There is no universal reconciliation report or mandatory handoff file.

## What it does

The [source](../skills/reconciler/SKILL.md) and its
[reference](../skills/reconciler/references/reconcile.md) begin with the achieved
output. A newer branch tip cannot silently replace the revision that was tested.
An unavailable owner remains a missing evidence route. Contradictions follow
the Contract's State Resolution rather than a blanket preference for source,
documentation or the newest timestamp.

The result is routed by each claim's job: capability requirements and acceptance
to the Spec, active Task state and receipts to the Task, definitions and
procedures to their controls, durable explanations to the Wiki. Other readers
get links. Projections derive from those owners; editing a board cannot make
work done. A shared writer receives the exact proposed correction and evidence.

Historical evidence stays append-only. Governed feedback dispositions describe
supported outcomes without scheduling new repairs. Pending meaning and its
corrections remain pending. A consistent account of incomplete work is useful:
it prevents the next agent from mistaking an unfinished step for a completed
delivery.

## Example

A branch implements a correction and passes a focused test. Its Task says
“complete,” but the named integration review belongs to an older commit and
production timing was never checked. Reconciliation pins the actual output,
records which test ran there, restores truthful current state without rewriting
the prior evidence, and leaves the timing uncertainty and review gate open.
The next action is review of the current immutable candidate under the room's
actual route. It is not a new self-assigned Task or owner approval inferred from
the green test. If the review service is unavailable, the inability handback
names that failure, the recoverable output and the next permitted attempt.

## Completion signs and composition

A cold reader can reach the exact output and its proof from the existing owners,
identify checked and unrun work, and state one next action. Missing access is
visible. Cleanup occurs only after supported material is durable and nothing
retained still depends on it.

- [To-docs](../skills/to-docs/SKILL.md) routes supported truth. It is the nearest
  behavior neighbor for this Workbench-native stance, not an upstream to import.
  Reconciler adds the achieved-state comparison, contradiction resolution and
  continuation read-back around that routing operation.
- [Notepad](../skills/notepad/SKILL.md) retains local reasoning and unresolved
  dependencies; [promote](../skills/promote/SKILL.md) moves supported selections
  under existing authority. Neither confirms pending meaning.
- [Reviewer](../skills/reviewer/SKILL.md) challenges a candidate. Reconciler
  preserves its exact review boundary and does not substitute for independence.
  [Handoff](../skills/handoff/SKILL.md) applies when continuation authorship is
  actually requested, not automatically on changing stance.

## Verified behavior and limits

At source revision `ef80692c`, five focused checks in
`tools/test-reconciler-skill.mjs` pass. Four execute the documented Git
observations against disposable repositories: reading a pinned owner despite
newer HEAD and dirty work; refusing missing revisions and owners; suppressing
target-controlled diff helpers; and distinguishing an unmerged candidate from
contained history without changing acceptance. The fifth checks the entry route
and selected safety clauses. The delivery-skill stance contract also passes.

These are command and structural regressions, not repeated agent trials or
proof that an agent always reconciles faithfully. The
[delivery evidence](../specs/S-01S-reconciler-skill-rebuild/SPEC.md#append-only-evidence-and-execution-log)
owns fresh-context observations, exact verification scope and remaining gates.
Git ancestry alone proves neither review nor approval nor unchanged assembled
content. No shared runtime, root control, manifest, release identity or installed
personal skill copy is changed by this source rebuild.

## Sources

- [Reconciler source](../skills/reconciler/SKILL.md) and [reference](../skills/reconciler/references/reconcile.md)
- [Assigned capability Spec](../specs/S-01S-reconciler-skill-rebuild/SPEC.md)
- [Contract](../../AGENTS.md#state-resolution) and [stance terms](../../LEXICON.md#stance-terms)
- [Feedback Dispositions](../../LEXICON.md#feedback-dispositions)
- [ADR-0036](../docs/adr/0036-stances-change-method-not-authority.md)
- [Wiki router](MEMORY.md)

## History

- 2026-10-01: Authored from the scoped rebuild and executable command regressions;
  no upstream skill imported and no agent reliability or Human QA claim made.
