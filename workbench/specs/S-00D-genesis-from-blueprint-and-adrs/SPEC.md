# S-00D - Genesis From Blueprint And Active ADRs

**Spec ID:** S-00D
**Status:** complete
**Priority:** 2
**Owner:** codex-v321-manager
**Stance:** Builder
**Updated:** 2026-09-10
**Catalog description:** Derive scoped project Specs and a valid room from locked Blueprint/ADR decisions plus verified Actuality.
**Blockers:** S-00C
**Latest event:** Spec completed and removed from the hot board.
**Next gate:** none

> **Citation anchors.** pre=`340e80a4b9cf6e07ca30f3a5f406b93998d48ed2` post=`0174675`.

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

The public `genesis-from-decisions.mjs derive` seam consumes a clean Template,
a source project, its prepared JSON grilling note, and an explicit
`genesis-plan-1` draft plan. It creates one first capability in an absent
destination using the running release's initializer and runtime installer.
The plan names all seven project controls, a Wiki router, selected locked
question IDs and active ADRs. The receipt preserves original Template controls,
evidence bytes, decision wording and interpretation, and distinct identities.

This validates byte lineage, current decision status and room structure. It does
not certify the meaning of drafted prose or grant owner authority. Template
source placeholders remain evidence; destination controls must be filled.

## Non-Goals

- Claiming fresh-copy end-to-end proof, downstream rollout, or automatic main
  publication.

## Dependencies And Blockers

The 2026-09-09 owner request explicitly activates this capability for v3.2.1,
including implementation, proof, separate-context review, and integration.
The earlier activation gate below is satisfied; capability dependencies remain.

S-00C and explicit owner activation are required.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-00E | Derive a valid scoped room from locked project inputs | done | S-00C | 45/45 Runbook commands on immutable6a80757; targeted final D suite green0174675; real Template4010003 derives valid independent room |

## Acceptance Criteria

- [x] Inputs, decisions, output Specs, and their source lineage remain
      traceable and distinguish locked from open material.
- [x] Generated room validation proves a valid Workbench without inventing
      authority or overwriting project evidence.
- [x] A disposable fixture proves the public seam from locked inputs to Specs.

## Verification Procedure

Use red/green disposable-room tests, full relevant verification, and an
independent review of the exact candidate.

## Documentation Impact

Public usage is owned by `RUNBOOK.md`, `README.md`, `templates/GENESIS.md`
and `skills/genesis/SKILL.md`; generated-project requirements stay in its Spec.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-08 | spec | Created planned stage three from the locked destination | Decision source reconciled; no implementation run | Formula and boundaries recorded | Explicit activation, S-00C, implementation, and proof remain pending |
| 2026-09-09 | spec | Owner activated the named S-00A through S-00E run for v3.2.1; manager is the single durable spec writer | Recovered c0ac60a integration and completed A/B records; guardrail baseline 78/100 | Existing ticket preserved as a complete CLI/input-to-output/test slice; no new coordination store | Implementation and exact-candidate review remain; zero coordination hand-backs |
| 2026-09-09 | TK-00E | Implemented the source-linked derivation at 6a8075721c818cc45ad9b001362bca0b180f76d9; real Template correction bc16eba preserves generic source controls | Targeted derivation positive/refusal cases pass; native Template4010003 derives an independent valid room; full suite still in progress | Public Genesis interface documented; destination-only Blueprint readiness fixed c6f6be1 and rendered catalog acceptance fixed916c7d2 with red/green cases | Destination ADR validation review correction and full suite remain; zero coordination hand-backs |
| 2026-09-10 | TK-00E | Ticket closed | 45/45 Runbook commands on immutable6a80757; targeted final D suite green0174675; real Template4010003 derives valid independent room | RUNBOOK README Genesis skill/template and S-00D updated with byte-lineage and semantic limits | Combined release independent review and S-00E native proof remain |
| 2026-09-10 | spec | Spec completed | Acceptance gates satisfied | Documentation impact recorded above | none |

## Completion Result

Implemented and verified. Full 45-command Runbook suite passed on immutable
6a8075721c818cc45ad9b001362bca0b180f76d9. Subsequent targeted red/green
checks cover generic Template input and destination-invalid ADR refusal in
0174675; native derivation from Template4010003 passed readiness with a new
room identity. The combined v3.2.1 candidate still requires its independent
integration review. No owner coordination hand-back occurred.

## Remaining Limitations Or Follow-Up Specs

S-00E owns independent fresh-copy end-to-end proof. Derivation currently creates
exactly one first capability and refuses existing destinations. Semantic review
and remote publication remain separate from structural validation.

## Supersession

- Supersedes: none.
- Superseded by: none.
