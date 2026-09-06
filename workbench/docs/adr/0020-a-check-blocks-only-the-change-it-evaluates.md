---
status: accepted
date: 2026-09-04
ported_from: GPT_OS ADR-0020 (accepted 2026-09-03)
canonicalized_in:
  - AGENTS.md
  - RUNBOOK.md
---

# A check may block only the change it evaluates

No mechanism may gate the repair that would make that mechanism correct. A check may block on the delta it can judge, whether this change introduces a new break, and never on global green, because a global-completeness precondition demands a finished state as the price of the work that would produce it.

A verification tool emits Projection, and a report cannot grant scope or authorise changes to its inputs, so wiring a report's exit code into a release gate promotes Projection to Canon. Release criteria are facts that can be observed where work actually stands, not the absence of every known defect.

Consequences: link checkers, wiki audits, and register freshness are reports whose findings measure remaining debris; a reader finding no global gate should not add one ([ADR-0029](0029-diagnostics-carry-registered-blocking-semantics.md)).

Provenance: faithful sanitized port of a private-workspace decision.
