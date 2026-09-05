---
status: accepted
date: 2026-09-04
ported_from: GPT_OS ADR-0005 (accepted 2026-09-03)
canonicalized_in:
  - AGENTS.md
  - RUNBOOK.md
---

# Machine enforcement requires running policy consumers

Prose is an encoding independent of Governance Plane classification. A machine-enforced rule requires structured data and running code that reads the policy, evaluates the applicable rule, and controls the attempted operation; choosing JSON alone supplies no enforcement.

Consequences: a diagnostic blocks only where a running consumer refuses (`doctor`, `next`, `claim`); a manifest field or spec row cannot claim enforcement on its own ([ADR-0029](0029-diagnostics-carry-registered-blocking-semantics.md)).

Provenance: faithful sanitized port of a private-workspace decision.
