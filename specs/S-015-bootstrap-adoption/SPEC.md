# S-015 - Project Bootstrap And Adoption

> Generated from LLM Workbench v2.3. Stable path
> `specs/S-015-bootstrap-adoption/SPEC.md`; never move between status folders.

**Spec ID:** S-015
**Status:** complete
**Priority:** 1
**Owner:** codex
**Updated:** 2026-07-17
**Catalog description:** Give greenfield and existing projects distinct, recoverable paths into the reusable Workbench harness.
**Blockers:** none
**Latest event:** Existing Genesis, Adoption, permission, fallback, and provenance behavior was captured as one durable capability.
**Next gate:** none

## Outcome

A project can enter the Workbench through a one-time greenfield Genesis or a
one-time existing-project Adoption, preserve its own truth and history, and
leave a remotely recoverable, independently reproducible v2.3 checkpoint.

## Why It Matters

The reusable harness is not useful if every project must reconstruct its setup,
scope, recovery, and verification rules from chat. The two entry paths must be
explicitly different while producing the same trustworthy operating surface.

## Current Verified State

- `templates/GENESIS.md` defines the greenfield bootstrap and smallest-running
  scaffold.
- `templates/ADOPTION.md` inventories an existing repository, ports useful
  truth without deleting history, and records constrained-Git fallbacks.
- `templates/.claude/settings.json` mechanically reflects the prose edit scope
  for Claude Code without replacing the cross-agent rules in `AGENTS.md`.
- S-005, S-009, and S-012 record completed corrections to ownership wording,
  Git-write fallback, and fresh-clone provenance.
- `genesis`, `adoption`, and `update-harness` are distinct live skill routes.

## Desired Behavior

- Genesis creates a filled six-file control surface, first stable spec, hot
  projection, verified scaffold, and private remote recovery point when remote
  creation is authorized.
- Adoption preserves product behavior, repository history, project-local truth,
  and current verification while retiring only superseded planning surfaces.
- Both flows fail closed on missing authority, secrets, Git-write constraints,
  or unverifiable publication state.
- A cold reviewer can reproduce the adopted harness from recorded remote, ref,
  resolved commit, self-tests, and any vendored-helper checksum.
- Routine upgrades use `update-harness`; neither one-time protocol becomes an
  evergreen migration queue.

## Decisions And Contracts

- Genesis is greenfield only; Adoption is first migration only;
  `update-harness` owns later version reconciliation.
- The copied templates stay generic and bracketed. Filled project truth belongs
  only in the adopting repository.
- Adoption archives superseded plan files only after useful truth is ported to
  Blueprint, specs, Taskboard projection, or Runbook.
- Git and remote proof are required when the host permits them. A constrained
  host records the blocker and hands Git operations to the owner rather than
  fabricating recovery proof.
- Claude permission settings are optional enforcement for one client; they do
  not narrow or broaden the shared `AGENTS.md` contract.

## Non-Goals

- Replacing project-specific architecture or verification with generic defaults.
- Treating routine harness upgrades as a fresh adoption.
- Creating a hosted installer, paid service, or central project database.

## Dependencies And Blockers

- [S-001](../S-001-progressive-disclosure/SPEC.md) defines the v2.3 lifecycle.
- [S-005](../S-005-bootstrap-doc-alignment/SPEC.md),
  [S-009](../S-009-git-write-constrained-adoption/SPEC.md), and
  [S-012](../S-012-adoption-provenance-proof/SPEC.md) remain the historical
  correction and proof records for this capability.

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Establish the greenfield Genesis protocol and smallest-running handoff | done | none | `templates/GENESIS.md`, evaluator coverage, and current full-suite proof |
| TK-002 | Establish the history-preserving existing-project Adoption protocol | done | TK-001 | `templates/ADOPTION.md`, adoption contract test, and current full-suite proof |
| TK-003 | Add mechanical Claude scope enforcement and constrained-Git fallback | done | TK-002 | permission template plus S-009 targeted proof |
| TK-004 | Require fresh-clone provenance and distinct routine upgrade routing | done | TK-002 | S-012 targeted proof and live Genesis, Adoption, and update-harness catalog routes |

## Acceptance Criteria

- [x] Greenfield and existing-project entry paths are distinct and documented.
- [x] Both paths produce the v2.3 control surface, stable spec lifecycle, and a
      remotely recoverable checkpoint when Git writes are available.
- [x] Existing code, history, product truth, and verification remain authoritative
      during Adoption.
- [x] Git-write constraints fail closed with a truthful owner handoff.
- [x] Fresh-clone provenance is durable and independently reproducible.
- [x] Routine upgrades route to `update-harness`, not Genesis or Adoption.
- [x] Targeted adoption checks and the complete Workbench verification suite pass.

## Testing Seams

- Static protocol assertions in `tools/test-adoption-git-write-fallback.mjs`.
- Template evaluator checks for scope, recovery, verification, and ownership.
- Skill-catalog checks that Genesis, Adoption, and update-harness remain separate.

## Verification Procedure

```bash
node tools/test-adoption-git-write-fallback.mjs
node tools/test-skill-catalog.mjs
node tools/test-evaluate-workbench.mjs
node tools/spec-workbench.mjs doctor
```

Then run the complete verification suite in `RUNBOOK.md`.

## Documentation Impact

- Genesis and Adoption templates own their detailed one-time protocols.
- README owns public entry-path guidance.
- S-005, S-009, and S-012 remain immutable correction evidence.
- This spec now owns the cohesive bootstrap/adoption capability.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-17 | canon harvest | Captured the implemented bootstrap and adoption product as one stable capability | Targeted adoption, skill-catalog, evaluator, render, doctor, and complete Runbook checks passed on the reconciled branch | Added S-015 and Blueprint coverage mapping; existing protocol docs remain canonical | none |

## Completion Result

Pass. The shipped Workbench has distinct, recoverable, and reproducible entry
paths for greenfield and existing projects, with routine upgrades owned elsewhere.

## Remaining Limitations Or Follow-Up Specs

- Versioned downstream delivery and rollout proof is owned by S-018.

## Supersession

- Supersedes: none; S-005, S-009, and S-012 remain historical follow-up evidence.
- Superseded by: none
