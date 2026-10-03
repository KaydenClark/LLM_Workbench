# TK-005J - Move the operations every room runs behind their pointers

**Task ID:** TK-005J
**Spec ID:** S-004C
**Slice:** Move the operations every room runs behind their pointers
**Status:** blocked
**Stance:** Builder
**Blockers:** TK-005I
**Destination:** spec-acceptance: An inventory maps every line of `AGENTS.md` and `RUNBOOK.md` to a home, and a check shows every removed line landed (room-operations family), and `RUNBOOK.md` is an operations index in which each operation's procedure is reachable in a skill.
**Planned verification:** Red: the landing check over the family's sections fails for each unplaced line when the bodies are dropped, and the index has no pointer from "write or accept a decision record", "validate the Wiki", "read the diagnostics", "allocate a visible identifier", "record a landmark", "recover after a failure" or "check a host capability" to a skill that carries the procedure. Green: every line is classified, the check passes at the candidate, each operation's procedure lives in the skill the census chooses (an existing skill where its job matches, a new skill per operation family otherwise, never one per section), the retained headings keep every inbound anchor, the generic `templates/RUNBOOK.md` carries the same index and pointers (this family is the one every generated room receives), and the tests and evals that read these sections pass. The targeted tests the census names (adr, wiki, visible ids, diagnostics, landmark tracker and wiki, configured host, sessions) and the full AGENTS suite pass on the committed candidate; touched Wiki pages lint clean.

## Outcome

The operations a generated room runs itself move behind the index: the
decision-record commands (the section Decision Record Tooling finished in its
last Task, now stable), Visible Identifiers, the Landmark Tracker, Wiki
Validation, Installed State The Harness Wrote, Diagnostics And Blocking
Effects, the Socket Contract Registry, Troubleshooting, Recovery And Rollback,
Workbench connection identity, and the configured-host capability checks. These
are the sections the generic `templates/RUNBOOK.md` also carries, so this family
is the one that changes what a fresh room receives.

## Scope

- The Runbook sections above as the baseline census confirms them, and their
  `templates/RUNBOOK.md` counterparts.
- Home skills and the constraint on adding them: a new core skill changes the
  closed core bundle (its catalog, install receipt, Template and update-route
  effects) and is added only for an operation with no fitting skill, one skill
  per operation family.
- Index rows, inventory entries, readers and Wiki pages as the Spec's family
  method states.

## Acceptance

- [ ] Every line of the family's sections is classified and the landing check
      passes at the candidate.
- [ ] Each moved procedure is reachable from an index row through a skill that
      carries its binding requirements.
- [ ] The core skill catalog, its count statement and the install receipt agree
      with any added core skill.
- [ ] Every inbound anchor for these headings resolves; root and template agree.

## Boundaries

Relocation only: no command, flag or finding changes behavior or meaning. The
decision-record, diagnostics and identifier runtime tools are not edited. This
family waits for the continuity, lifecycle, Git and verification families so
the shared index table and the single `RUNBOOK.md` writer stay serial.
