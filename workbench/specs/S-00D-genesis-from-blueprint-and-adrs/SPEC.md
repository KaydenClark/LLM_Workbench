# S-00D - Genesis From Blueprint And Active ADRs

**Spec ID:** S-00D
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-08
**Catalog description:** Derive scoped project Specs and a valid room from locked Blueprint/ADR decisions plus verified Actuality.
**Blockers:** explicit activation; S-00C
**Latest event:** Planned as stage three of the locked Workbench Template destination.
**Next gate:** Owner explicitly activates after project-evidence and grilling preparation are proven.

> **Citation anchors.** pre=`340e80a4b9cf6e07ca30f3a5f406b93998d48ed2` post=`340e80a4b9cf6e07ca30f3a5f406b93998d48ed2`.

## Outcome

Locked project Blueprint and active ADR decisions, combined with verified
Actuality, can produce traceable scoped Specs and a valid project Workbench.

## Desired Behavior

Derivation preserves each source claim and its status, creates only the scoped
Specs authorized by locked decisions, and validates the resulting room without
mistaking generated prose for an owner decision.

## Decisions And Contracts

- This is stage three; it consumes the prepared owner grilling result from
  S-00C, not an inferred or inherited Blueprint.
- The derivation formula is Blueprint target + active ADRs + verified Actuality
  and evidence -> Specs. It does not replace review or release validation.

## Non-Goals

- Claiming fresh-copy end-to-end proof, downstream rollout, or automatic main
  publication.

## Dependencies And Blockers

S-00C and explicit owner activation are required.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-00E | Derive a valid scoped room from locked project inputs | deferred | explicit activation; S-00C | Red source/authority cases; green disposable-room derivation and validation |

## Acceptance Criteria

- [ ] Inputs, decisions, output Specs, and their source lineage remain
      traceable and distinguish locked from open material.
- [ ] Generated room validation proves a valid Workbench without inventing
      authority or overwriting project evidence.
- [ ] A disposable fixture proves the public seam from locked inputs to Specs.

## Verification Procedure

Use red/green disposable-room tests, full relevant verification, and an
independent review of the exact candidate.

## Documentation Impact

Future Genesis, template, and project-spec documentation owners.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-08 | spec | Created planned stage three from the locked destination | Decision source reconciled; no implementation run | Formula and boundaries recorded | Explicit activation, S-00C, implementation, and proof remain pending |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

S-00E owns independent fresh-copy end-to-end proof.

## Supersession

- Supersedes: none.
- Superseded by: none.
