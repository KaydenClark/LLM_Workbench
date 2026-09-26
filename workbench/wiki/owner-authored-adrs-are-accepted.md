---
type: memory
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Owner statement 2026-09-23 on ADR acceptance
  - Promoted from host auto-memory by the S-00V TK-00I audit, 2026-09-26
source_paths:
  - workbench/docs/adr/proposed
  - workbench/docs/adr/REGISTER.md
  - workbench/wiki/grilling-destination-audit-ledger.json
last_verified: 2026-09-26
---

# Owner-authored ADRs are accepted

An ADR the owner created, or one that records his locked grilling decisions, is
correct by default. His words on 2026-09-23: "if I just created them, then they
should be correct." Agents treat its content as settled, handle the
consequences (archiving what it supersedes, repointing links, reconciling text
drafted from chat to the locked answers) and raise a consequence with the owner
only when it changes a product tradeoff.

## Limits of the record

- The blanket reading that *agents move the record out of
  [`proposed/`](../docs/adr/proposed/) themselves* is an interpretation of that
  statement, not his exact ruling; say which mechanics you read as covered.
- Unresolved at 2026-09-26: the grilling ledger still carries `ACC-1` (whether
  ADR-000B/C/D acceptance lands before or after the v4 PC handoff) as open, and
  the records the statement named are still under `proposed/`. Check the
  [ledger](grilling-destination-audit-ledger.json) and the ADR folder before
  acting; this note does not settle the timing.
- No root control carries this rule yet; the S-00V TK-00I close records the
  wording it would need.

Related: [finish-authorized-work](finish-authorized-work.md).
