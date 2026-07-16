# Proposal Record: Spec-Centered Progressive Disclosure

**Status:** approved and implemented by `S-001`; retained as design evidence
**Original date:** 2026-07-11
**Revised:** 2026-07-12
**Implementation owner:** `specs/S-001-progressive-disclosure/SPEC.md`

## Decision

Keep Workbench v2's core control model while changing where detailed truth
lives. `AGENTS.md` remains the always-loaded operating system. Blueprint and
Taskboard become compact projections. Stable on-demand specs own capability
detail and proof. The first implementation stays local, plain Markdown,
zero-dependency, and CLI-first.

This replaces the proposal's earlier task-record design. A task-centric archive
would still confuse a coherent capability with its temporary implementation
slices. The implemented unit is now:

- **spec:** durable product capability/outcome and historical record;
- **ticket:** temporary vertical tracer bullet inside one spec.

## Verified Baseline

Measured before S-001 edits on the local v2.2 candidate:

| Always-required surface | Words | Estimated tokens (1.33/word) |
|---|---:|---:|
| `AGENTS.md` | 1,437 | ~1,900 |
| `BLUEPRINT.md` | 2,206 | ~2,900 |
| `TASKBOARD.md` | 3,392 | ~4,500 |
| **Total** | **7,035** | **~9,300** |

The remote `main` and `integration` versions were v2.1. The uncommitted local
guardrail work was a v2.2 candidate and scored 70/100. PR #18 had already merged
`integration` into `main`, while the former local Taskboard still called that
merge a blocker, proving copied external state could drift.

## Ownership Contract

| Truth | Single owner |
|---|---|
| authority, scope, selection, safety, TDD, verification, docs, Git | `AGENTS.md` |
| general idea, goals, pillars, architecture, invariants, non-goals, catalog | `BLUEPRINT.md` |
| current slice, owner, blocker, event, next gate | `TASKBOARD.md` generated region |
| outcome, requirements, decisions, acceptance, evidence, completion | stable `SPEC.md` |
| commands, troubleshooting, recovery | `RUNBOOK.md` |
| behavior | source and tests |

No detailed truth is copied between owners. Completed specs disappear from the
hot Taskboard immediately but remain linked in the Blueprint catalog. Later
change creates a new spec with supersession links; completed history is not
silently rewritten.

## Implemented Local Interface

```text
node tools/spec-workbench.mjs next --json
node tools/spec-workbench.mjs show S-001
node tools/spec-workbench.mjs claim S-001 --agent codex
node tools/spec-workbench.mjs close S-001 --proof ... --docs ... --remaining-gap ...
node tools/spec-workbench.mjs complete S-001
node tools/spec-workbench.mjs render
node tools/spec-workbench.mjs doctor
```

The tool parses the documented Markdown subset, writes through temporary-file
rename, renders deterministic Blueprint/Taskboard regions, and fails closed on
ambiguous or invalid lifecycle state.

`doctor` detects duplicate IDs, invalid/contradictory status, stale claims,
done tickets without proof, broken local links, unstable paths, and projection
drift. `complete` requires every slice done, all acceptance boxes checked, a
non-pending completion result, and execution evidence.

## Lifecycle

1. Capture a coherent spec at a stable path.
2. Refine acceptance, seams, blockers, and tracer-bullet tickets.
3. Activate only when an eligible slice is ready.
4. Render active state onto the hot Taskboard.
5. Claim/implement/close one eligible ticket at a time using red/green TDD.
6. Append verification and documentation evidence to the spec.
7. Complete only after acceptance and owner gates; render removes it from hot
   state while the Blueprint catalog retains the stable link.
8. Use a new linked spec for later changes.

Broad phases and product areas are catalog groupings of multiple specs, not one
giant work packet.

## Guardrails And Non-Goals

- No new always-loaded control document.
- No database, hosted tracker, paid dependency, or broad MCP service.
- No active/done/archive directory moves.
- No permanent Done lane or proof archive in the hot board.
- No branch state, test counts, percentages, or current narration in Blueprint.
- No detailed requirements or completed evidence in Taskboard.
- No retroactive spec for every historical task.
- No downstream migration or Dungeon Friends work under S-001.
- No agent-outcome claim from token/context reduction alone.

## Benchmark Hypothesis

Progressive retrieval should reduce irrelevant startup context and
time-to-first-relevant-file without lowering correctness, verification,
documentation, or safety.

Static acceptance:

- normal selection uses AGENTS + `next` + one `show`, not full Blueprint/board;
- selection context falls at least 70% from the 7,035-word baseline;
- lifecycle/doctor fixtures catch intentionally introduced failures;
- existing Workbench regression checks remain green.

Outcome acceptance remains separate: matched repeated c0/c1/c2/c3 trials on
development and held-out tasks are required before calling v2.3 better for agent
outcomes. S-002 owns the held-out second-domain prerequisite.

## Rollout Boundary

S-001 dogfoods the model only in LLM Workbench and updates the generic package
after the local lifecycle is green. Broader rollout is a separate,
benchmark-backed decision. S-003 records a prospective Dungeon Friends pilot
that remains blocked on separate owner authorization.
