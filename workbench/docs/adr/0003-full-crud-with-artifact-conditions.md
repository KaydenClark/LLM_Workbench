---
status: accepted
date: 2026-09-04
ported_from: GPT_OS ADR-0003 (accepted 2026-09-03)
canonicalized_in:
  - AGENTS.md
---

# All six planes support full CRUD with conditions

Full Create, Read, Update, and Delete applies across all six Governance Planes, with conditions on operations. Append-only evidence logs, superseding ADRs, and retained Lexicon terms are artifact conventions that narrow work on those artifacts, without removing CRUD from a whole plane or overriding an owner-authorized operation.

Consequences: "append-only" describes how a spec evidence log or ADR corpus is edited, not a plane-wide prohibition; deletion still requires the owner approval that `AGENTS.md` names for destructive change.

Provenance: faithful sanitized port of a private-workspace decision.
