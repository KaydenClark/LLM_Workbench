---
date: 2026-10-07
supersedes:
canonicalized_in:
  - LEXICON.md
  - workbench/specs/S-005A-readmes-follow-the-readme-definition/SPEC.md
---

# A README introduces; the Runbook holds operations

A README is introductory documentation accompanying a project, package or directory: an overview of the contents and purpose, the information needed to get started, and references to further documentation, support and applicable terms. Root READMEs follow the owner's README template, which the [READMEs Spec](../../../specs/S-005A-readmes-follow-the-readme-definition/SPEC.md) carries. Operation procedures never live in a README. They are reached by progressive disclosure: a row in the Runbook's Operations Index labels the operation, says when to follow it and links to the procedure's home.

Why the owner chose it: a README orients a human learning the project (what the Workbench is, why they need it, how to set it up); the Runbook drives agent operations; progressive disclosure.

Considered and rejected: a procedure in a README. The first case was adding a core skill, whose procedure does not go in the skills lane's `workbench/skills/README.md`; the Runbook gets an "Add a core skill" row linking to the procedure in the room-checks maintainer skill, and the `to-tasks` pointer links through to it.

Consequences: the Lexicon defines README. The READMEs Spec reworks the root README and `templates/README.md` to the template and moves the README's release-history paragraph into the Wiki history page ([Current-state documents carry no history narrative; the Wiki holds the project's history](001M-current-state-documents-carry-no-history-narrative-the-wiki-holds-the-project-s-history.md)). The core skill Spec adds the Operations Index row and its procedure.

Provenance: the owner's answers in the retro guardrail grilling of 2026-10-07, read back and confirmed in that session.
