# TK-005H - Move the Git, integration review and branch-completion operations behind their pointers

**Task ID:** TK-005H
**Spec ID:** S-004C
**Slice:** Move the Git, integration review and branch-completion operations behind their pointers
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-005G
**Destination:** spec-acceptance: An inventory maps every line of `AGENTS.md` and `RUNBOOK.md` to a home, and a check shows every removed line landed (Git family), and a fresh agent can find and perform integration review and branch completion through its pointer without the removed prose.
**Planned verification:** Red: the landing check over the family's sections fails for each unplaced line when the bodies are dropped, and the index has no pointer from "open a PR", "get an immutable candidate reviewed", "merge and prove containment" or "clean up a branch" to a skill that carries the procedure. Green: every line is classified, the check passes at the candidate, `save`, `code-review`, `reviewer`, `implement` and `carry` (or a new skill the census justifies) carry the moved procedures with their binding requirements, the retained headings keep every inbound anchor (`AGENTS.md#git-rules` is the most linked heading in the repository), and the templates agree. `tools/test-branch-closeout.mjs`, `tools/test-delivery-skills.mjs`, `tools/test-skill-catalog.mjs`, `tools/test-spec-workbench.mjs`, the landing check and the full AGENTS suite pass on the committed candidate; touched Wiki pages lint clean.

## Outcome

The Git and branch-completion detail leaves `AGENTS.md` while the rules that
cannot be derived from the code stay as short lines: never commit directly to
`main` or `integration`, the default pull-request target, only the owner merges
`integration` into `main`, review of the immutable candidate by a separate
context before integration, never force-push shared history without approval,
never delete with `-D`. The mechanics (branch naming, the review and merge
sequence, proving containment, guarded remote deletion, the bootstrap exemption
reading) live in the skills the index points to, and the Runbook's
Version-Control Procedures and Independent Review Boundaries sections become
index rows with pointers.

## Scope

- `AGENTS.md` Git Rules and Branch Completion, and the Runbook's Version-Control
  Procedures and Independent Review Boundaries sections as the census confirms
  them.
- Home skills, index rows, inventory entries, template mirrors, readers and Wiki
  pages as the Spec's family method states.
- Takes an `AGENTS.md` writer turn.

## Acceptance

- [ ] Every line of the family's sections is classified and the landing check
      passes at the candidate.
- [ ] Each moved procedure is reachable from an index row through a skill that
      carries its binding requirements.
- [ ] `AGENTS.md` keeps only lines that apply in every session, with the
      owner-only `main` promotion and the separate-context review rule intact.
- [ ] Every inbound anchor for these headings resolves; root and template agree.

## Boundaries

Relocation only: no branch, review or merge rule changes meaning, and the
release owner's bootstrap exemption text is moved as written, not interpreted.
No change to the `gate`, `report` or branch-closeout commands.
