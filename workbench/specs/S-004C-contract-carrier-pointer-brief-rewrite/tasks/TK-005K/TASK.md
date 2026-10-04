# TK-005K - Move the maintainer-only operations behind their pointers

**Task ID:** TK-005K
**Spec ID:** S-004C
**Slice:** Move the maintainer-only operations behind their pointers
**Status:** ready
**Stance:** Builder
**Blockers:** TK-005J
**Destination:** spec-acceptance: An inventory maps every line of `AGENTS.md` and `RUNBOOK.md` to a home, and a check shows every removed line landed (maintainer-operations family), and `RUNBOOK.md` is an operations index in which each operation's procedure is reachable in a skill.
**Planned verification:** Red: the landing check over the family's sections fails for each unplaced line when the bodies are dropped, the index has no pointer from "cut or verify a release", "check the v3 support root", "verify managed runtime tools", "run an adoption migration check", "run the control-fidelity report", "run the self-drift check", "evaluate the harness" or "write a harness feedback report" to a skill that carries the procedure, and a room-owned skill added to this repository's lane for such an operation fails a closed-bundle check. Green: the Builder first establishes, and records, where a maintainer-only skill can live in this repository's lane without breaking the closed-bundle catalog, receipt and installer checks (a room-owned skill under a non-core name is the intended candidate); then every line is classified, the check passes at the candidate, the index points at the skills, the retained headings keep every inbound anchor, and the tests and evals that read these sections pass. The targeted tests the census names (skills lane, skill catalog, workbench layout, adoption, upgrade, round trip, portability, cross-provider, control fidelity, self drift, guardrail audit, evaluate, outcome trials, feedback automation) and the full AGENTS suite pass on the committed candidate; touched Wiki pages lint clean.

## Outcome

The long tail of the Runbook, the sections only this repository's maintainers
run, moves behind the index: release identity and the Template upgrade release
procedure, prerequisites, install and run, project-evidence and fresh-room
preparation, the skills-lane, personal-catalog, support-root, managed-tool,
room-lifecycle, adoption, control-fidelity, explicit-upgrade and self-drift
checks, the composed round trip, the portability and cross-provider proofs,
evaluation and benchmarking, the harness feedback loop and its automation,
manual feedback reports, and operational proof. The Workbench update drift
boundary line in the `AGENTS.md` edit scope keeps its always-true statement and
points at the self-drift procedure.

These procedures are not meaningful to a generated room, so their homes must not
become core skills every room receives; where a skill is the home, it is a
room-owned skill in this repository's lane, and the Builder records the closed-bundle
constraint before choosing. If no safe home exists, the Task records the gap and
stops for the Dispatcher; it does not park the text in the Wiki to finish.

## Scope

- The Runbook sections above as the baseline census confirms them, the update
  drift boundary line in `AGENTS.md`, and the matching index rows, inventory
  entries, readers and Wiki pages as the Spec's family method states.
- `templates/RUNBOOK.md` changes only where the census shows a generic mirror of
  a moved section.

## Acceptance

- [ ] Every line of the family's sections is classified and the landing check
      passes at the candidate.
- [ ] Each moved procedure is reachable from an index row through a skill that
      carries its binding requirements, and none became a core skill.
- [ ] The Workbench self-drift boundary keeps its owner and its pre and post
      receipt procedure reachable.
- [ ] Every inbound anchor for these headings resolves.

## Boundaries

Relocation only: no check, command or score changes. The release owner's version,
Template and gate ordering are untouched. Waits for the other families so the
single `RUNBOOK.md` writer stays serial.
