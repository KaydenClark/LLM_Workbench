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
