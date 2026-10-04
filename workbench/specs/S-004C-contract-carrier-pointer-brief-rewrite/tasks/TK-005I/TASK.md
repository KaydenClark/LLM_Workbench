# TK-005I - Move verification, documentation ownership and the release gate behind their pointers

**Task ID:** TK-005I
**Spec ID:** S-004C
**Slice:** Move verification, documentation ownership and the release gate behind their pointers
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-005H
**Destination:** spec-acceptance: An inventory maps every line of `AGENTS.md` and `RUNBOOK.md` to a home, and a check shows every removed line landed (verification and documentation family), and `AGENTS.md` meets the brief definition.
**Planned verification:** Red: the landing check over the family's sections fails for each unplaced line when the bodies are dropped; a script that reads the Full suite block from `AGENTS.md` (the read-only suite runner the census names) finds no block after the move until it is repointed; the index has no pointer from "run the full suite", "capture the guardrail baseline", "route a truth to its owner" or "update the Template for a release" to its procedure. Green: every line is classified, the check passes at the candidate, the Full suite list and its commands live in the one home the census chooses with `AGENTS.md` keeping the rule that the suite must pass before a claim, every suite extractor and the test that holds the list read the new home, the documentation-ownership table is classified as restating the Lexicon's Artifact Ownership Schema where it does and kept only where it adds an assignment, the citation-anchor rule keeps a short always-true line with its procedure behind a pointer, the Template Upgrade Release Gate keeps its owner-only and proof lines in `AGENTS.md` and its procedure in the Runbook section that already owns it, the templates agree, and the full AGENTS suite passes on the committed candidate with its tests run from the new home.

## Outcome

`AGENTS.md` stops carrying the full verification procedure and the routing
table. It keeps the lines that apply in every session (validate input first,
use red and green at a stable seam for behavior changes, never claim a result
that was not run, never weaken a criterion to raise a score, a harness change
captures a guardrail baseline before and after, documentation is part of done
and the implementing agent maintains its owner, a citation into a changing file
names its tree). The suite list, the manual-check fallback, the milestone demo
rule, the owner table, the citation-anchor mechanics and the Template Upgrade
Release Gate procedure sit behind pointers.

## Scope

- `AGENTS.md` Engineering And Verification (including its Template Upgrade
  Release Gate subsection) and Documentation Ownership And Proof, and the
  Runbook's Test And Build, Test Coverage Policy and Guardrail North-Star Audit
  entries as the census confirms them.
- Every script and test that reads the Full suite block or the owner table from
  `AGENTS.md`, repointed with the move. Where the Runbook already owns the
  procedure (the Template Upgrade Release Gate), the `AGENTS.md` text is
  classified as restating that owner, not copied.
- Home skills, index rows, inventory entries, template mirrors and Wiki pages
  as the Spec's family method states. Takes an `AGENTS.md` writer turn.

## Acceptance

- [ ] Every line of the family's sections is classified and the landing check
      passes at the candidate.
- [ ] The Full suite list has one home that the suite runner, the tests and the
      `AGENTS.md` rule all point to, and the suite runs from it.
- [ ] `AGENTS.md` keeps only lines that apply in every session for this family.
- [ ] Every inbound anchor for these headings resolves; root and template agree.

## Boundaries

Relocation only: no verification rule changes meaning and no suite member is
added, removed or reordered. The release owner keeps the Template upgrade gate
and its ordering; this Task moves its text, not its decision.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004c-tk005i-verification-family | 135691c8d965ea8dc0b23ec33fb35727add4a925 | ahead 0 behind 0 | 0 | Red d6be31b4: test-runbook-index 7/35 failed (TK-005I family rows, briefs, one suite home, release-gate procedure), test-control-fidelity failed (fidelity test read from the Runbook Full suite list); suite.sh with the default SUITE_SOURCE=AGENTS.md at 135691c8 reports NO SUITE BLOCK FOUND (exit 3) until pointed at RUNBOOK.md. Green 57a6c8db + 135691c8: test-runbook-index 35/35, test-control-fidelity 37/37, test-workbench-layout 73/73 (red at 57a6c8db on the placeholder vocabulary, fixed 135691c8), evaluate/governance/wiki/skills-lane/workbench-tools/skill-catalog/vocabulary-sweep/guardrail-audit/blueprint-contract/adr/genesis/round-trip/carrier-landing/delivery-skills/implement-skill green; landing check pin d7ffffe9 AGENTS 283/283 RUNBOOK 618/618 and merge-base 9b825ae6 AGENTS 95/95 RUNBOOK 5/5 ok; Runbook Full suite list identical to the base AGENTS.md list (50 commands, same order); full suite SUITE_SOURCE=RUNBOOK.md 50/50 at 135691c8 dirty []; guardrails 106.6/113 and 78/100 held; wiki validate ok. Bytes: AGENTS.md 30,158 -> 26,238; RUNBOOK.md 125,413 -> 127,808; templates/AGENTS.md 24,618 -> 23,421; templates/RUNBOOK.md 53,427 -> 53,428; index 12,253 -> 13,120; AGENTS+index 42,411 -> 39,358 B (bound 38,178 not yet met). | AGENTS.md and templates/AGENTS.md Engineering And Verification and Documentation Ownership And Proof briefs with pointers, root Template Upgrade Release Gate brief; RUNBOOK.md Test And Build is the one Full suite home, plus index rows, coverage and guardrail pointers, release-gate real-room sentence; templates/RUNBOOK.md Test And Build, Test Coverage Policy and Benchmark-Driven Improvement stubs and index rows; implement skill Engineering and verification, Test coverage policy, Benchmark-driven improvement; to-docs skill Citation anchors; template-placeholders vocabulary; inventories; Wiki skill-implement, skill-to-docs, suite-needs-a-committed-candidate. | Runbook-only checks test-team-coordination, test-team-coordination-demo and test-socket-contract (pass, not Full suite members) kept and labelled outside the suite: joining the suite is an owner decision; template Producer Template Upgrade Release Gate kept in place (no generic Runbook home); root Test Coverage Policy and Guardrail North-Star Audit keep their room text with pointers; combined loaded-cost bound not yet met. | 7487ce32e5d64b40235bf4a55442328aa5b3d2a16643e9737ba227995b50aa61 |
