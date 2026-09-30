---
date: 2026-09-12
canonicalized_in:
  - AGENTS.md
  - LEXICON.md
  - RUNBOOK.md
---

# The Workbench Contract is the obligation claim set carried by three root controls and the assigned spec

The Workbench Contract is the current binding claim set carried by
`AGENTS.md`, `RUNBOOK.md`, and `LEXICON.md`, plus the bounded requirements of
the explicitly assigned `SPEC.md` after selection or assignment. The ordinary
entry route follows AGENTS -> RUNBOOK -> LEXICON, then the assigned Spec;
agents traverse the smallest relevant route. It does not require loading
every section of every carrier at once. An unassigned Spec is evidence.

The carriers divide their jobs: AGENTS owns agent behavior, authority, safety,
Git, and verification; RUNBOOK owns operations and procedures; LEXICON owns
accepted shared meanings and navigation. `BLUEPRINT.md` is a routed product
destination and cross-cutting architecture owner, outside the Contract.
`TASKBOARD.json` is a projection, `README.md` orientation, `CLAUDE.md` a host
adapter, and `OWNERSHIP.json` routing. Their root placement does not make
them Contract carriers.

Considered and rejected: amending
[ADR-0033](archive/0033-workbench-contract-is-a-claim-set.md) from seven
to three, because its seven-file root assertion is separately superseded by
[ADR-000B](000B-the-workbench-root-surface-is-eight-files-and-contract-membership-is-separate-from-root-placement.md).
Also rejected: a single `CONTRACT.md` copying the claims. It would add a
driftable second owner. A claim enters the Contract through its maintained
owner, not a central list.

Consequences: supersedes [ADR-0033](archive/0033-workbench-contract-is-a-claim-set.md)
while preserving its claim-set model and the assigned Spec's bounded role.
That lineage depended on [ADR-0025](archive/0025-planes-classify-claims-not-whole-artifacts.md)
and [ADR-0027](0027-instruction-authority-is-separate-from-state-resolution.md);
the routed Blueprint role remains consistent with
[ADR-000A](000A-active-adr-decisions-and-destination-blueprints.md). Operational routing is updated in AGENTS,
RUNBOOK, and LEXICON. This decision changes accepted meaning now; it does not
claim the root-file migrations have shipped.

Provenance: foundation answer FND-Q22 in the tracked destination ledger. On
2026-09-29 the owner specified the three carriers and assigned Spec, and
confirmed the Question / Answer / Why / Impact readback as the ADR lock point.
The ADR is authored at to-docs before Specs and Tasks; no second owner reread
is required for this confirmed decision.
