# S-016 - Static Evaluation And Guardrail Audit

> Generated from LLM Workbench v2.3. Stable path
> `specs/S-016-static-evaluation-guardrails/SPEC.md`; never move between status folders.

**Spec ID:** S-016
**Status:** complete
**Priority:** 1
**Owner:** codex
**Updated:** 2026-07-17
**Catalog description:** Score harness control coverage and diagnose evidence drift without mistaking static health for agent outcomes.
**Blockers:** none
**Latest event:** Existing evaluator and 100-point guardrail audit were captured as one durable measurement capability.
**Next gate:** none

## Outcome

Maintainers can compare local folders and GitHub branches against stable control
criteria, diagnose drift across the whole harness, and receive ranked next
improvements without claiming unmeasured behavioral lift.

## Why It Matters

Template prose is easy to praise and hard to falsify. A deterministic static
rubric and a deliberately difficult guardrail audit make missing controls,
contradictions, stale evidence, and benchmark gaps visible before release.

## Current Verified State

- `tools/evaluate-workbench.mjs` scores local paths, GitHub branches, a no-template
  control, and a representative single-file control.
- `tools/audit-guardrails.mjs` uses a stable 100-point scale across static
  contract, drift resistance, benchmark discipline, and outcome evidence.
- Self-tests require the Workbench to beat both controls while refusing a
  perfect score without real repeated outcome evidence.
- S-010 records the completed canonical-path entry detection correction.

## Desired Behavior

- The static evaluator stays deterministic, zero-dependency, and usable against
  local folders or named GitHub branches.
- The guardrail audit reports evidence and ranked actions on a stable scale;
  maintainers never lower weights to manufacture improvement.
- Root dogfood controls and blank templates are scored separately.
- Static or context-score movement is never presented as proof that agents
  perform better on real tasks.

## Decisions And Contracts

- Static coverage is a release gate; outcome evidence is a separate claim gate.
- Controls remain no-template and representative single-instruction candidates.
- The 100-point guardrail score is a north star, not a pass threshold.
- Branch comparisons resolve the named ref and keep source identity visible.
- The evaluator and audit own diagnosis only; implementation work belongs to a
  capability spec created from a named gap.

## Non-Goals

- Running paid model trials.
- Claiming universal superiority over templates that were not compared.
- Turning the rubric into a hidden work queue or weakening it for a release.

## Dependencies And Blockers

- [S-001](../S-001-progressive-disclosure/SPEC.md) provides the control surfaces.
- [S-010](../S-010-canonical-evaluator-entry/SPEC.md) records the path-alias fix.

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Score local and GitHub candidates against explicit controls | done | none | evaluator self-test and root/template scores |
| TK-002 | Add the stable four-layer guardrail audit and ranked recommendations | done | TK-001 | guardrail self-test and live audit |
| TK-003 | Preserve canonical-path execution and branch identity | done | TK-001 | S-010 path-alias red/green proof and current evaluator self-test |

## Acceptance Criteria

- [x] Local paths and GitHub branches use the same deterministic rubric.
- [x] No-template and single-file controls remain explicit and score below the Workbench.
- [x] The guardrail audit stays on a stable 100-point scale and exposes ranked gaps.
- [x] Root dogfood and blank-template results remain distinct.
- [x] Static health is not translated into an agent-outcome claim.
- [x] Evaluator, guardrail, render, doctor, and full-suite verification pass.

## Testing Seams

- Pure file-map scoring in `scoreWorkbench` and `auditGuardrails`.
- Temporary canonical-path alias fixture.
- Sparse fixture that must surface contradictions and missing outcome evidence.

## Verification Procedure

```bash
node tools/test-evaluate-workbench.mjs
node tools/test-guardrail-audit.mjs
node tools/evaluate-workbench.mjs --path templates --include-controls
node tools/audit-guardrails.mjs --path .
node tools/spec-workbench.mjs doctor
```

## Documentation Impact

- RUNBOOK and benchmark docs own operating and interpretation guidance.
- This spec owns the cohesive evaluator and guardrail capability.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-17 | canon harvest | Captured the implemented static measurement product as a stable capability | Evaluator, guardrail, template score, live audit, render, doctor, and complete Runbook checks passed | Added S-016 and corrected the benchmark branch section from current to historical | Real agent outcomes remain S-017 |

## Completion Result

Pass. The Workbench has deterministic static and drift measurement with an
explicit boundary against unsupported behavioral claims.

## Remaining Limitations Or Follow-Up Specs

- S-017 owns repeated controlled agent-outcome evidence.

## Supersession

- Supersedes: none
- Superseded by: none
