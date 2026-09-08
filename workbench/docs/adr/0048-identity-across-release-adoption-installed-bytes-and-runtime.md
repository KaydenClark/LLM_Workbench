---
status: accepted
date: 2026-09-08
canonicalized_in:
  - BLUEPRINT.md
  - workbench/specs/S-050-workbench-v3-2-0-release/SPEC.md
---

# Identity across release, adoption, installed bytes and runtime

Release source, historical adoption, installed manifest, installed tool/skill
bytes, executing runtime and downstream acceptance are distinct claims. Name
the exact source commit and component identity each result actually verifies.
Historical adoption provenance does not become current component provenance by
editing a version label. Installed runtime integrity is checked from the room.

Considered alternatives: One version string or upstream test conflates distinct states. Local tracking
refs and a successful push do not prove the reviewed SHA is contained in live
remote integration. Unreachable remote state is unknown, never assumed green.

Consequences: Receipts, immutable review and remote read-back support recoverability within
their named boundaries. Fresh clone and usable-project proof establish the
consumer boundary. No installed or rollout claim follows from source alone.

Provenance: owner-requested v3.2.0 implementation and make-it-so promotion,
2026-09-08; reconciled concern CAND-H in
[S-050](../../specs/S-050-workbench-v3-2-0-release/SPEC.md).
Historical source statuses and lineage remain in its complete reconciliation.
Acceptance of this decision is not a claim its runtime or outcome is implemented.
