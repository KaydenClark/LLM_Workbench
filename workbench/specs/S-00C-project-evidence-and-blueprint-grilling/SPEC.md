# S-00C - Project Evidence And Blueprint Grilling

**Spec ID:** S-00C
**Status:** active
**Priority:** 2
**Owner:** codex-v321-manager
**Stance:** Builder
**Updated:** 2026-09-09
**Catalog description:** Prepare a project-informed Blueprint grilling record from verified project evidence.
**Blockers:** none
**Latest event:** TK-00D claimed by codex-v321-manager.
**Next gate:** Close TK-00D with verification and documentation proof.

> **Citation anchors.** pre=`340e80a4b9cf6e07ca30f3a5f406b93998d48ed2` post=`340e80a4b9cf6e07ca30f3a5f406b93998d48ed2`.

## Outcome

A named project can safely collect verified project evidence and use it to
prepare—not answer—a Blueprint grilling record for the project owner.

## Desired Behavior

The capability identifies source, controls, existing product evidence, and
known uncertainty; it creates question prompts grounded in that evidence while
keeping owner choices open. It never silently treats an inherited Blueprint as
owner-validated.

## Decisions And Contracts

- This is stage two after a valid copyable Workbench Template.
- Evidence preparation and an owner grilling record do not themselves create
  active ADRs, Specs, or implementation authority.

## Non-Goals

- Deriving Specs, creating a project, or claiming a personalized room works.
- Broad portfolio intake or personal/private data collection.

## Dependencies And Blockers

The 2026-09-09 owner request explicitly activates this capability for v3.2.1,
including implementation, proof, separate-context review, and integration.
The earlier activation gate below is satisfied; capability dependencies remain.

S-00B must establish the template role. Explicit owner activation is required
because this planned capability is not v3.2 delivery.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-00D | Collect bounded evidence and prepare a Blueprint grilling record | in-progress | none | Red provenance/privacy cases; green prepared-record seam and targeted verification |

### TK-00D Delivery Contract

The public installed CLI accepts one explicitly bounded intake request and writes
one provisional grilling JSON notepad through the existing notepad runtime.
It validates named source paths and bytes, preserves caller assertions as
assertions, and leaves every question open. It never writes a Blueprint, ADR,
or spec. The runtime inventory, grilling skill, Runbook, and CLI tests ship
with that one complete path. The demonstration is a disposable named project,
not intake of an unnamed personal project.

## Acceptance Criteria

- [ ] A named project yields a bounded, source-linked evidence intake.
- [ ] The prepared grilling record distinguishes facts, uncertainty, and owner
      questions without promoting decisions.
- [ ] Privacy, source safety, and no-authority boundaries are tested.

## Verification Procedure

Use red/green behavior tests, a disposable project fixture, full relevant
verification, and an independent review before any authorized integration.

## Documentation Impact

Future `genesis` and `grilling` skill owners, the appropriate generic controls,
and the derived project owner's own durable records.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-08 | spec | Created planned stage two from the locked destination | Decision source reconciled; no implementation run | Destination and non-goal recorded without claiming delivery | Explicit activation and all implementation/proof remain pending |
| 2026-09-09 | spec | Owner activated the named S-00A through S-00E run for v3.2.1; manager is the single durable spec writer | Recovered c0ac60a integration and completed A/B records; guardrail baseline 78/100 | Existing ticket preserved as a complete CLI/input-to-output/test slice; no new coordination store | Implementation and exact-candidate review remain; zero coordination hand-backs |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

S-00D owns turning locked decisions and Actuality into scoped project Specs.

## Supersession

- Supersedes: none.
- Superseded by: none.
