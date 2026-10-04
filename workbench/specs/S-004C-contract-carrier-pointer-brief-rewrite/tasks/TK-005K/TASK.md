# TK-005K - Move the maintainer-only operations behind their pointers

**Task ID:** TK-005K
**Spec ID:** S-004C
**Slice:** Move the maintainer-only operations behind their pointers
**Status:** blocked
**Stance:** Builder
**Blockers:** TK-005J, TK-006L
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

## Blocker: no safe maintainer-skill home (2026-10-04)

The Builder's first step, which this Task's Planned verification requires before
any line moves, found no home for a maintainer-only skill in this repository's
lane. A probe committed one non-core skill (`workbench/skills/workbench-maintainer/SKILL.md`)
in a throwaway worktree at 4beb3a28: `tools/core-skill-installer.mjs install`
refuses it with `invalid-bundled-core` (the skills directory must contain exactly
the required core skills), `tools/test-skill-catalog.mjs` fails (the live
discovery source must contain exactly the locked 27 skills), and
`tools/test-core-skill-installer.mjs` and `tools/test-workbench-upgrade.mjs` fail
with `invalid-bundled-core` from `validateSource`. `tools/test-skills-lane.mjs`,
`workbench-skills.mjs verify` and `doctor` accept it. The cause: this repository's
lane is also the release source lane, which the closed-bundle checks hold to
exactly the core skills. A symlinked skill directory would evade the checks
rather than satisfy them, and a skill outside the lane does not bind through the
index (the pointer is reported dangling). No line moved and nothing was parked
in the Wiki.

The Spec's Plan decision foresaw this ("records a gap rather than parking the
text in the Wiki if they do not"). Choosing among the options changes either the
closed core bundle's contract or this Spec's acceptance, so it is an owner
tradeoff, recorded by the Dispatcher with the token
`owner:maintainer-skill-home-decision`:

- (A) A declared maintainer-skill list that the installer, upgrade and catalog
  checks exclude and never ship, as its own reviewed check change before this
  Task resumes. Cost: it changes the closed bundle and release routes.
- (B) Keep the maintainer sections in `RUNBOOK.md` (classified `stays`), with
  index rows pointing at their headings. Cost: the acceptance line "each
  operation's procedure is reachable in a skill" stays unmet for maintainer
  operations, and the Runbook stays larger.
- (C) A tracked maintainer document that is not a skill. Cost: the Spec's homes
  rule does not name it, and it would not bind through the index.

TK-005M (update route) and TK-005N (Lexicon) wait on this Task because the
update and control-fidelity procedures and the Context Map routes they rewrite
depend on where the maintainer operations land.

## Owner decision (2026-10-04)

The owner answered the options above in chat on 2026-10-04: "A ) maintainer
skills." That selects option (A): a declared maintainer-skill list that the
core-skill installer, the one-time upgrade and the skill-catalog exactness
checks exclude and never ship, landed as its own reviewed check change before
this Task resumes. The Dispatcher removed `owner:maintainer-skill-home-decision`
and cut [TK-006L](../TK-006L/TASK.md) for that check change; this Task now waits
on TK-006L instead. The blocker section above stays as the record of why the
decision was needed. When this Task resumes, each maintainer-only procedure's
home is a skill in this repository's lane declared as a maintainer skill (one
skill per operation family, never per section), not a core skill.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004c-tk005k-maintainer-operations-family | f991d9c361cc61364325eca09251299b6f292c22 | ahead 0 behind 0 | 0 | Home probe (red, no green possible within scope): at 4beb3a28 plus one committed non-core skill workbench/skills/workbench-maintainer/SKILL.md in a throwaway detached worktree, three closed-bundle checks refuse it: node tools/core-skill-installer.mjs install exits 1 invalid-bundled-core (the skills directory must contain exactly the required core skills); node tools/test-skill-catalog.mjs fails 'live discovery source must contain exactly the locked 27 skills'; node tools/test-core-skill-installer.mjs and node tools/test-workbench-upgrade.mjs fail with invalid-bundled-core from validateSource in tools/core-skill-installer.mjs and tools/workbench-upgrade.mjs. node tools/test-skills-lane.mjs (4/4), workbench-skills.mjs verify (status source) and doctor accept it. Cause: this repository's lane workbench/skills is also the release source lane, which those checks hold to exactly coreSkills. | none; no carrier, skill, template or Wiki text changed | BLOCKER: no safe maintainer-skill home exists in this repository's lane without changing the closed-bundle checks, which the Task's relocation-only boundary forbids; no Runbook or AGENTS.md line was moved and nothing was parked in the Wiki. Needs a Dispatcher or owner choice: (A) a declared maintainer-skill list the installer, upgrade and catalog exactness checks exclude and never ship, as its own reviewed check change before TK-005K resumes; (B) keep the maintainer sections in RUNBOOK.md as stays behind index rows that point at their headings; (C) a non-skill tracked maintainer owner, which the Spec's Homes for procedures does not name. | 98dceb30ff61d5d1e418ca16f32086a3e43571dc499b05f1bd5b2750a0a01c0c |
