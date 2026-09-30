---
date: 2026-09-12
canonicalized_in:
  - LEXICON.md
  - AGENTS.md
---

# The ownership map is an exhaustive type-level framework answered by structured query

`OWNERSHIP.json` holds maintained artifact classes, responsibilities, scopes,
routes, and relations. It is exhaustive at the **type** level and answered by
structured query, so an agent can find the owner without loading the full map
at entry. It does not enumerate live Spec, Task, or ADR instances.

A query returns **routes to owning artifacts, never their claim text**. A first
violation is a map row or query result copying a definition from LEXICON or
carrying an instance identifier or status-shaped field. S-00G TK-004 owns a
red query-output test for routes rather than claims and schema validation that
rejects instance IDs and status-shaped fields. This decision sets the check;
it does not claim that the test or schema exists yet.

Considered and rejected: keeping the exhaustive schema inside LEXICON. That
would raise ordinary-entry cost for agents without an ownership question.
Also rejected: an instance-level map, which would duplicate live work state
and require updates on every record transition.

Consequences: LEXICON keeps shared language and the Context Map. It routes
ownership questions to the map once queryable. Its current Artifact Ownership
Schema stays in place until S-00G TK-004 supplies the query and migration.
[ADR-000B](000B-the-workbench-root-surface-is-eight-files-and-contract-membership-is-separate-from-root-placement.md)
owns root placement. The map's complete contents and runtime query surface
remain S-00G implementation work.

FND-Q21's 28 responsibilities, FND-Q23's accepted-row/no-instance/no-status
limits, and FND-Q24's origins and classifications are settled in S-00G and
the tracked destination ledger. FND-Q24B's undeclared legacy difference is
also settled as a conflict until intent is declared. Its field shape and
disposition placement remain S-00G implementation decisions within those
limits; no owner answer is inferred for them here.

Provenance: foundation answers FND-Q21A and FND-Q22A, later locked FND-Q21,
Q23, Q24, and 2026-09-29 confirmation of ACC-4. The owner confirmed the
Question / Answer / Why / Impact readback for the violation and check.
