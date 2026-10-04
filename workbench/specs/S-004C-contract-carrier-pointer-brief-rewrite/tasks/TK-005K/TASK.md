# TK-005K - Move the maintainer-only operations behind their pointers

**Task ID:** TK-005K
**Spec ID:** S-004C
**Slice:** Move the maintainer-only operations behind their pointers
**Status:** done
**Stance:** Builder
**Blockers:** TK-005J, TK-006L
**Destination:** spec-acceptance: An inventory maps every line of `AGENTS.md` and `RUNBOOK.md` to a home, and a check shows every removed line landed (maintainer-operations family), and `RUNBOOK.md` is an operations index in which each operation's procedure is reachable in a skill.
**Planned verification:** Red: the landing check over the family's sections fails for each unplaced line when the bodies are dropped, the index has no pointer from "cut or verify a release", "check the v3 support root", "verify managed runtime tools", "run an adoption migration check", "run the control-fidelity report", "run the self-drift check", "evaluate the harness" or "write a harness feedback report" to a skill that carries the procedure, and a room-owned skill added to this repository's lane for such an operation fails a closed-bundle check. Green: the Builder first establishes, and records, where a maintainer-only skill can live in this repository's lane without breaking the closed-bundle catalog, receipt and installer checks (a room-owned skill under a non-core name is the intended candidate); then every line is classified, the check passes at the candidate, the index points at the skills, the retained headings keep every inbound anchor, and the tests and evals that read these sections pass. The targeted tests the census names (skills lane, skill catalog, workbench layout, adoption, upgrade, round trip, portability, cross-provider, control fidelity, self drift, guardrail audit, evaluate, outcome trials, feedback automation) and the full AGENTS suite pass on the committed candidate; touched Wiki pages lint clean.
**Proof:** Full suite 51/51 at e92a72fc (dirty []); red 43522e1c (3 TK-005K index tests), green test-runbook-index 44/44 and every reader test; landing check ok vs pin d7ffffe9 (RUNBOOK 1817/1817, AGENTS 287/287) and merge-base 145ab2f9 (863/863, 4/4); guardrails 106.6/113 and 78/100 held; RUNBOOK.md 105,251 -> 54,370 B

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
| 2 | claude/s004c-tk005k-maintainer-skills | e92a72fcc425447c55820f4ecdf956076f305c11 | ahead 0 behind 0 | 0 | Red at 43522e1c: test-runbook-index 3 TK-005K family tests failed (no index row points the 26 maintainer operations to a skill; AGENTS drift boundary still names RUNBOOK). Green at e92a72fc: test-runbook-index 44/44, test-skill-catalog ok (maintainer region lists the three declared skills), test-control-fidelity 37/37, test-skills-lane, test-governance-core, test-workbench-tools, test-portability-matrix, test-adr, test-evaluate-workbench, test-controls-vocabulary-sweep, test-wiki, test-workbench-layout, test-core-skill-installer, test-workbench-upgrade, test-workbench-adoption, test-workbench-round-trip, test-self-drift, test-guardrail-audit, test-outcome-trials, test-feedback-automation, test-cross-provider-fixture, test-carrier-landing, test-genesis-from-decisions, test-branch-closeout, test-workbench-dogfood, test-spec-citation-anchors all exit 0; landing check ok vs pin d7ffffe9 (RUNBOOK 1817/1817, AGENTS 287/287) and merge-base 145ab2f9 (RUNBOOK 863/863, AGENTS 4/4, temporary merge-base inventories); full suite 51/51 at e92a72fc (RUNBOOK Full suite list, dirty []); guardrails 106.6/113 and 78/100 held, root evaluator 113/113 held; wiki validate ok; self-drift post on branch 7 attention findings, the same pre-existing set. Sizes: RUNBOOK.md 104,8xx -> 54,370 B, AGENTS.md 26,421 B, operations index 14,959 B, AGENTS+index 41,380 B. | RUNBOOK.md: 26 maintainer sections reduced to a sentence plus pointer with headings kept, 26 index rows re-pointed, Evaluation And Benchmarking intro points to workbench-evaluation, Portable Save core-catalog paragraph moved; new maintainer skills workbench-release, workbench-room-checks, workbench-evaluation declared in manifest maintainerSkills and catalogued in workbench/skills/README.md; AGENTS.md drift boundary and Template gate brief point at the skills; evals/README.md pointer; readers test-skill-catalog, test-control-fidelity, test-runbook-index; Wiki maintainer-skills; both S-004C inventories; templates unchanged (maintainer skills never ship; the template keeps its generic room sections). | Prerequisites, Install, Run Locally, Operational Proof, Troubleshooting and the Evaluation And Benchmarking intro stay in RUNBOOK.md as this room's own sections (the template carries them generically); combined loaded-cost bound not met (41,380 vs 38,178 B; the index rows grew with skill paths); Wiki skill-adoption and skill-genesis still link the Runbook stubs, which resolve and point on; the S-01X JSON preview and S-003P collision-recovery paragraphs TK-005G left stay in place. | 13b458a5821face11e8872ccff113951d9b660903c5d58862e62aa1f797a7de8 |
| 3 | claude/s004c-tk005k-maintainer-skills | e92a72fcc425447c55820f4ecdf956076f305c11 | ahead 0 behind 0 | 1 | Correction to run 1: the self-drift post receipt on branch at e92a72fc has 8 attention findings, not the pre-existing 7: the added one is blocked-slice for S-002L/TK-006O waiting on TK-006N, a Spec another lane merged into integration (PR #345) and not about this Task. Exact sizes: RUNBOOK.md 105,251 B at merge-base 145ab2f9 -> 54,370 B; AGENTS.md 26,421 B; operations index 14,959 B; AGENTS+index 41,380 B. All other run 1 results stand: full suite 51/51 at e92a72fc dirty [], landing check ok vs pin d7ffffe9 (RUNBOOK 1817/1817, AGENTS 287/287) and merge-base 145ab2f9 (863/863, 4/4), guardrails 106.6/113 and 78/100, root evaluator 113/113. | As run 1. | As run 1. | fc512d36d9656ed5b3851d6e346ef7e3cf67716283956016284def8b7558c9bf |
| 4 | claude/s004c-tk005k-maintainer-skills | d6948de9d27853e7e3db8b24a2cba0029119e162 | ahead 0 behind 0 | 0 | Full suite 51/51 at e92a72fc (dirty []); red 43522e1c (3 TK-005K index tests), green test-runbook-index 44/44 and every reader test; landing check ok vs pin d7ffffe9 (RUNBOOK 1817/1817, AGENTS 287/287) and merge-base 145ab2f9 (863/863, 4/4); guardrails 106.6/113 and 78/100 held; RUNBOOK.md 105,251 -> 54,370 B | RUNBOOK.md 26 maintainer sections to pointers and 26 index rows re-pointed; new maintainer skills workbench-release, workbench-room-checks, workbench-evaluation (declared, catalogued); AGENTS.md drift boundary and Template gate brief; evals/README.md; test-skill-catalog, test-control-fidelity, test-runbook-index; Wiki maintainer-skills; inventories; templates unchanged | Room setup sections, Operational Proof, Troubleshooting and the evaluation intro stay as room sections; AGENTS+index 41,380 B vs the 38,178 B bound; S-01X and S-003P paragraphs left in place | e3962181a9d53ff1cf04d74a451ada2dce0eb99d405d8a7ebcaef83b7645c941 |
