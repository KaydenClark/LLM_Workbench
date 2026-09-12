---
status: proposed
date: 2026-09-12
canonicalized_in:
  - AGENTS.md
  - LEXICON.md
  - BLUEPRINT.md
---

# The Workbench root surface is eight files and Contract membership is separate from root placement

The portable root surface comprises `AGENTS.md`, `BLUEPRINT.md`, `LEXICON.md`,
`RUNBOOK.md`, `TASKBOARD.md`, `CLAUDE.md`, `README.md` and `OWNERSHIP.json`.
Three classifications apply to a Workbench artifact independently, and a record
may hold any combination of them: **root placement** means the file is
discoverable at the repository root before an agent knows the layout; **Core
membership** means the artifact is portable Workbench content the template
ships; **Contract membership** means the artifact carries binding obligation
claims an agent owes. Root placement does not confer Contract membership.
`OWNERSHIP.json` is the eighth root file and a Core artifact, and it is outside
the Contract.

Considered and rejected: placing the ownership map under `workbench/docs/`
to preserve a seven-file root. The map answers "where does this truth belong",
which a cold agent needs *before* it can resolve the declared support layout, so
burying it behind the layout it explains inverts the dependency. Also rejected:
admitting it as an eighth Contract control. The map routes a question to its
owner; it imposes no obligation of its own, and treating a routing artifact as
binding invites agents to read routes as permissions.

Considered and rejected: leaving [ADR-0013](0013-seven-file-workbench-contract.md)
intact and reading "no eighth coequal root control" narrowly, on the grounds
that `OWNERSHIP.json` is not coequal. The record's stated consequence is a
count, and a successor that depends on reading a count as something other than
a count is not durable.

Consequences: supersedes [ADR-0013](0013-seven-file-workbench-contract.md) on
acceptance. More than six live consumers enumerate the root surface literally
and none knows an eighth file — verified at review 2026-09-12 beyond the
original six (`workbench/tools/workbench-layout.mjs`,
`tools/control-fidelity.mjs`, `tools/test-workbench-layout.mjs`,
`tools/test-control-fidelity.mjs`, `RUNBOOK.md`, `templates/ADOPTION.md`):
four more code consumers with their own hardcoded seven-item lists
(`tools/test-workbench-upgrade.mjs`, `tools/test-genesis-from-decisions.mjs`,
`tools/test-workbench-adoption.mjs`, `tools/test-portability-matrix.mjs`) and
two more template consumers stating the count in prose (`templates/GENESIS.md`,
`templates/README.md`). This is not a claim of completeness; the migration's
scoped spec finds the rest by a repository-wide sweep rather than a fixed
list. `templates/` ships no root JSON control today, so a template
`OWNERSHIP.json` is new shipped content rather than an edit to existing
content. None of that migration is performed by this decision; it is owned by
its scoped spec.

Provenance: owner-approved foundation answers FND-Q22 and FND-Q23A, 2026-09-11,
recorded as approved answers in the live grilling note
`workbench-foundation-rework-2026-09-11`. That note is untracked working
material and is named here as origin, not as durable evidence; this record is
the durable owner of the decision. Consumer enumeration verified read-only at
`c0ac60a`.

## Promotion status

This record is `proposed`. Its `canonicalized_in` owners name where the claim
will live on acceptance; they do not yet carry it, and `AGENTS.md`,
`LEXICON.md` and `BLUEPRINT.md` remain live Canon as written until the owner
accepts this decision. `ADR-0013` stays `accepted` until then, because
`adr.mjs` requires a supersession target to be accepted already.
