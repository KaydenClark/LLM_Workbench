---
date: 2026-09-12
canonicalized_in:
  - AGENTS.md
  - LEXICON.md
  - BLUEPRINT.md
---

# The Workbench root surface is eight files and Contract membership is separate from root placement

The accepted destination has eight root files: `AGENTS.md`, `BLUEPRINT.md`,
`LEXICON.md`, `RUNBOOK.md`, `TASKBOARD.json`, `CLAUDE.md`, `README.md`, and
`OWNERSHIP.json`. `TASKBOARD.json` replaces the Markdown Taskboard. This is
architectural Canon ahead of the S-00G and board implementation; acceptance
does not claim that either JSON file is installed yet.

Three classifications apply independently: **root placement** makes an
artifact discoverable at repository root; **Core membership** means portable
Workbench content shipped by the template; **Contract membership** means it
carries binding obligation claims. Root placement confers no Contract authority.
`OWNERSHIP.json` is a Core routing artifact outside the Contract.

Considered and rejected: placing the ownership map under `workbench/docs/`
to preserve a seven-file root. A cold agent needs the route before resolving
the support layout. Also rejected: making the map an eighth Contract control.
A route imposes no obligation and must not be read as permission.

Considered and rejected: leaving [ADR-0013](archive/0013-seven-file-workbench-contract.md)
active by reading its count narrowly. Its count is explicit and must be
superseded rather than reinterpreted.

Consequences: supersedes [ADR-0013](archive/0013-seven-file-workbench-contract.md). S-00G owns the ownership-map migration and
root-surface consumers; the board owner owns the Taskboard representation.
Existing Markdown projection and seven-file consumers are implementation gaps
until their assigned work lands. Neither is evidence against this accepted
destination. S-00G's bounded consumer inventory is a starting point, not a
claim of exhaustive coverage.

Provenance: foundation answers FND-Q22 and FND-Q23A, recorded in the tracked
destination ledger. On 2026-09-29 the owner confirmed the reconciliation,
specified `TASKBOARD.json`, and chose acceptance ahead of implementation after
a Question / Answer / Why / Impact readback.
