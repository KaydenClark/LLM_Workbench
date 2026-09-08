---
status: accepted
date: 2026-09-08
canonicalized_in:
  - BLUEPRINT.md
  - workbench/specs/S-053-configured-host-capabilities/SPEC.md
---

# Minimum configured-host capability and evidence boundaries

A small minimum capability contract is verified in the actual configured host.
Operational capability, machine enforcement and agent instruction-following are
different evidence claims. An unavailable/inconclusive check remains unverified;
a missing capability blocks only dependent work. Agree the concrete minimum
before selecting manifest fields, diagnostics or test architecture.

Considered alternatives: Instructions-only portability provides no operational compatibility evidence.
Provider-native enforcement hooks would add a maintenance commitment not
selected here. Discovery adapters and evaluation launchers are distinct and
remain allowed.

Consequences: S-053 records the recovered five-check docket baseline under the
renewed owner implementation request: writable path forms, native skill
discovery/invocation, Node execution, directory adapters and checkout syntax. Claim enforcement
only where a running mechanism controls the operation and evidence supports it;
that mechanism need not be owned by Workbench. S-036's blocked trust/auth probe
proved neither live permission enforcement success nor failure.

Provenance: owner-requested v3.2.0 implementation and make-it-so promotion,
2026-09-08; reconciled concern CAND-P in
[S-050](../../specs/S-050-workbench-v3-2-0-release/SPEC.md).
Historical source statuses and lineage remain in its complete reconciliation.
Acceptance of this decision is not a claim its runtime or outcome is implemented.
