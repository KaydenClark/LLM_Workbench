# S-001 - Spec-Centered Progressive Disclosure

**Spec ID:** S-001
**Status:** complete
**Priority:** 0
**Owner:** codex
**Updated:** 2026-07-12
**Catalog description:** Make AGENTS the operating system while specs hold durable capability truth and the hot board projects active work only.
**Blockers:** none
**Latest event:** Spec completed and removed from the hot board.
**Next gate:** none

## Outcome

Normal work selection loads the always-on operating rules plus one eligible
spec/ticket, without loading the full Blueprint, Taskboard, completed specs, or
proof history.

## Why It Matters

The v2.2 candidate requires 7,035 words across AGENTS, Blueprint, and Taskboard
before relevant source. Most of that is stable product detail or completed
history, and copied live Git state already drifted after PR #18 merged.

## Current Verified State

- Local root and branch: `/Users/kayden/GPT_OS/workbench templates` on
  `codex/guardrail-benchmark`, with the existing v2.2 guardrail work preserved.
- Published `main` and `integration` are v2.1; local uncommitted docs say v2.2.
- Pre-change guardrail audit: 70/100; outcome evidence remains 0/30.
- Startup surfaces: AGENTS 1,437 words, Blueprint 2,206, Taskboard 3,392.

## Desired Behavior

- `AGENTS.md` owns authority, scope, task selection, safety, TDD, verification,
  documentation ownership, and Git rules.
- Blueprint is a compact product map and generated spec catalog.
- Taskboard contains active spec/ticket state only; complete specs vanish.
- Stable specs own requirements, decisions, acceptance, verification, evidence,
  completion, and supersession.
- One zero-dependency tool selects, shows, claims, closes, completes, renders,
  and diagnoses the lifecycle with atomic writes.

## Decisions And Contracts

- Spec IDs are `S-###`; stable paths are `specs/S-###-slug/SPEC.md`.
- Ticket IDs are local to a spec and represent vertical slices, not capabilities.
- Generated regions in Blueprint and Taskboard are projections; specs are the
  source of truth.
- A complete spec is immutable historical evidence. Later change uses a new
  linked spec rather than silent rewriting.
- No database, hosted tracker, broad MCP server, paid dependency, or downstream
  migration is part of this spec.

## Non-Goals

- Migrating Dungeon Friends or any other downstream repository.
- Manufacturing specs for every old Workbench task.
- Publishing, merging, or claiming agent-outcome improvement.

## Dependencies And Blockers

- none

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Add lifecycle contract, concise generic spec, and deterministic tool | done | none | test-spec-workbench lifecycle and drift fixtures pass |
| TK-002 | Dogfood generated catalog/hot board and slim root/generic controls | done | TK-001 | Root and generic progressive-disclosure controls score 113/113 and 106.6/113 |
| TK-003 | Prove drift detection, context movement, full verification, and v2.3 gate | done | TK-002 | Five self-tests pass; root 113/113; templates 106.6/113; doctor clean; guardrail 70/100; startup 7035 to 2012 words (71.4% reduction) |

## Acceptance Criteria

- [x] Normal startup routes from AGENTS to `next` and one assigned spec.
- [x] Blueprint is a compact map with a working generated spec catalog.
- [x] Taskboard shows active state only and complete specs disappear immediately.
- [x] Spec template includes the requested lifecycle, evidence, and supersession interface without forced boilerplate.
- [x] One real spec passes create, activate, implement/verify, complete, and removal from the hot board.
- [x] Doctor/render checks detect introduced duplicate IDs, broken links, contradictory state, missing evidence, stale claims, and render drift.
- [x] Existing and new Workbench tests pass; template score remains healthy.
- [x] Before/after startup measurements, guardrail score, risks, docs, and proof are recorded.
- [x] Version advances to the verified next v2 minor only after the behavior passes.
- [x] No unrelated dirty work is overwritten and no downstream project is touched.

## Testing Seams

- Temporary repository fixtures for lifecycle transitions and atomic file output.
- Static evaluator ownership checks across root and copyable templates.
- Intentionally corrupted temporary fixtures for every doctor failure class.
- Full existing Workbench verification suite for regression coverage.

## Verification Procedure

```bash
node tools/test-spec-workbench.mjs
node tools/spec-workbench.mjs doctor
node tools/test-evaluate-workbench.mjs
node tools/test-guardrail-audit.mjs
node tools/test-context-tools.mjs
node tools/test-outcome-trials.mjs
node tools/evaluate-workbench.mjs --path templates --include-controls
node tools/audit-guardrails.mjs --path .
```

## Documentation Impact

- Root: AGENTS, Blueprint, Taskboard, Runbook, README, proposal, benchmark ledger.
- Generic package: AGENTS, Blueprint, Taskboard, Runbook, README, and new SPEC.
- Historical v2.2 task/proof state moves verbatim to a cold benchmark archive.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-12 | intake | Verified live state and baseline | Published main/integration v2.1; local v2.2 candidate; guardrail 70/100; 7,035 startup words | Scope and version routing recorded here | Implementation not yet complete |
| 2026-07-12 | TK-001 red | Added lifecycle and ownership fixture before implementation | Expected failure: ERR_MODULE_NOT_FOUND for tools/spec-workbench.mjs | Test defines the new contract | Implement tool |
| 2026-07-12 | TK-001 green | Implemented zero-dependency lifecycle, render, and doctor behavior | `node tools/test-spec-workbench.mjs` pass | Generic SPEC added | Dogfood all transitions |
| 2026-07-12 | TK-001 | Ticket closed | test-spec-workbench lifecycle and drift fixtures pass | Added generic SPEC and root dogfood spec | Root and generic control migration remains |
| 2026-07-12 | TK-002 | Ticket closed | Root and generic progressive-disclosure controls score 113/113 and 106.6/113 | Updated AGENTS, BLUEPRINT, TASKBOARD, RUNBOOK, README, templates, GENESIS, ADOPTION, evaluator, proposal, and cold archive | Final lifecycle, version, context, and full-suite proof remains |
| 2026-07-12 | TK-003 | Ticket closed | Five self-tests pass; root 113/113; templates 106.6/113; doctor clean; guardrail 70/100; startup 7035 to 2012 words (71.4% reduction) | Updated all owning root/generic docs, proposal, benchmark ledger, and v2.3 version | No agent-outcome claim; S-002 and owner-approved real trials remain |
| 2026-07-12 | spec | Spec completed | Acceptance gates satisfied | Documentation impact recorded above | none |

## Completion Result

Pass. Workbench v2.3 implements the spec-centered lifecycle, preserves v2.2
history in a cold archive, reduces the normal selection path by 71.4%, keeps all
regression gates green, and makes no agent-outcome claim.

## Remaining Limitations Or Follow-Up Specs

- S-002 will add held-out second-domain outcome evidence; it is not required to
  claim context reduction.
- S-003 is a future prospective Dungeon Friends pilot and requires separate
  authorization.

## Supersession

- Supersedes: `benchmarks/TASKBOARD_PROGRESSIVE_DISCLOSURE_PROPOSAL.md` as the implementation owner; the proposal remains design evidence.
- Superseded by: none
