---
status: proposed
date: 2026-09-12
canonicalized_in:
  - AGENTS.md
  - LEXICON.md
---

# The Workbench Contract is the obligation claim set carried by three root controls and the assigned spec

The Workbench Contract is the set of current claims that bind an agent on every
task **before and independent of any assignment**. A claim is part of the
Contract when it states an obligation, a prohibition or an authority boundary
*and* is owned by one of three root controls: `AGENTS.md`, `RUNBOOK.md` and
`LEXICON.md`. What an agent owes the Contract is exact: load all three at
ordinary entry, obey their claims for the whole task, and treat no lower
artifact as able to enlarge them. The explicitly assigned `SPEC.md` contributes
bounded capability requirements in addition, and only after selection or
explicit assignment.

The three carriers divide the obligation by kind. `AGENTS.md` owns how agents
work, safety, Git and verification. `RUNBOOK.md` owns the available operations
with their prerequisites and expected results. `LEXICON.md` owns the accepted
meaning of shared terms, which binds because an agent that reads a Contract term
in a private sense is not following the Contract.

Considered and rejected: amending
[ADR-0033](0033-workbench-contract-is-a-claim-set.md) to read three instead of
seven. That record also asserts "exactly seven universally discoverable root
harness controls exist", which [ADR-000B](000B-the-workbench-root-surface-is-eight-files-and-contract-membership-is-separate-from-root-placement.md)
changes to eight. Amendment would correct one record in two directions at once
and leave something that is no longer the decision the owner accepted.

Considered and rejected, still: a single `CONTRACT.md` restating the binding
claims in one place. ADR-0033's original reasoning holds unchanged — it would
become a second driftable copy of rules whose owners already exist, and every
reader would have to decide which copy was current. A claim still enters the
Contract by living in its owner, never by being listed somewhere central.

Consequences: supersedes [ADR-0033](0033-workbench-contract-is-a-claim-set.md)
on acceptance, preserving its claim-set model, its rejection of a `CONTRACT.md`,
and its dependence on
[ADR-0025](0025-planes-classify-claims-not-whole-artifacts.md) and
[ADR-0027](0027-instruction-authority-is-separate-from-state-resolution.md).
`BLUEPRINT.md` leaves the Contract: it remains Canon describing the destination
and is a Core root artifact, but it carries no obligation an agent owes on entry,
which is consistent with
[ADR-000A](000A-active-adr-decisions-and-destination-blueprints.md) holding the
Blueprint free of current status. `TASKBOARD.md` stays a generated projection,
`README.md` stays orientation, `CLAUDE.md` stays host-specific workflow notes
and `OWNERSHIP.json` stays routing — root and Core, none of them Contract. The
Authority Order in `AGENTS.md` names the carriers and is updated at acceptance.

Provenance: owner-approved foundation answer FND-Q22, 2026-09-11, recorded as an
approved answer in the live grilling note
`workbench-foundation-rework-2026-09-11`. That note is untracked working
material named here as origin, not as durable evidence; this record is the
durable owner of the decision.

## Promotion status

This record is `proposed`. Its `canonicalized_in` owners name where the claim
will live on acceptance; `AGENTS.md` and `LEXICON.md` remain live Canon as
written until the owner accepts it, and `ADR-0033` stays `accepted` until then.
