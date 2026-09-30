---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner direction 2026-09-23
  - Promoted from host auto-memory by the S-00V TK-00I audit, 2026-09-26
source_paths:
  - workbench/specs/S-052-private-session-transport/SPEC.md
  - AGENTS.md
last_verified: 2026-09-26
---

# PC test at main readiness

The owner runs the Windows PC deployment test himself, once, at the point where
agents judge `integration` ready to merge into `main`. Until then the
Workbench has to work on the primary development host.

- Do not list the PC test, the Windows host, or the live Mac/Windows
  continuation proof in
  [S-052](../specs/S-052-private-session-transport/SPEC.md) as something to
  unblock or prepare for. It is not a blocker on other work.
- "Ready for main" is the trigger: say so when the audit against the
  [grilling destination](grilling-destination-audit-ledger.json) passes.
- Main promotion itself stays owner-only
  ([AGENTS Git Rules](../../AGENTS.md#git-rules)).

Related: [finish-authorized-work](finish-authorized-work.md).
