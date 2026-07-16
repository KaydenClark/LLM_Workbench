# S-012 - Reproducible Adoption Provenance

**Spec ID:** S-012
**Status:** complete
**Priority:** 1
**Owner:** codex
**Updated:** 2026-07-15
**Catalog description:** Preserve enough adoption provenance for an independent fresh-clone verification.
**Blockers:** none
**Latest event:** Spec completed and removed from the hot board.
**Next gate:** none

## Outcome

A completed harness adoption leaves a cold verifier enough durable evidence to
reproduce the adopted harness from its published source without relying on the
original working checkout or chat history.

## Why It Matters

An adoption can pass locally yet remain unauditable when its remote, ref,
resolved commit, fresh-clone commands, self-tests, or vendored-helper checksums
do not survive in the owning spec and project Runbook.

## Sanitized Feedback Record

- **Repository:** AI_Agents_Presentation
- **Feedback date:** 2026-07-13
- **Document/section:** Adoption Phase 0
- **Fingerprint:** 5a7ad6db71c5
- **Paraphrase:** A constrained-checkout adoption completed without retaining a
  reproducible fresh-clone provenance command for an independent audit.

## Desired Behavior

The generic adoption protocol requires the owning spec to record the source
remote/ref, resolved commit, executed self-tests, and any vendored-helper
checksum, while the adopted project Runbook retains the exact fresh-clone
verification commands.

## Decisions And Contracts

- Record proof that was actually executed; never invent a remote, commit, test,
  or checksum.
- Require a vendored-helper checksum only when adoption copies a helper into the
  project.
- Keep project-specific values in the adopted project's spec and Runbook, not in
  the generic Workbench template.
- This is a documentation-contract correction, not an agent-outcome claim.

## Non-Goals

- Mandating one hosting provider or clone directory.
- Requiring publication when the owner has not authorized it.
- Claiming improved agent behavior without repeated controlled trials.

## Dependencies And Blockers

- S-006 complete.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Require durable fresh-clone provenance in adoption evidence | done | none | Targeted baseline-red/candidate-green passed; full integration suite and held-out grader passed; root 113/113 and templates 106.6/113 unchanged; guardrail 78/100 unchanged |

## Acceptance Criteria

- [x] The adoption template assigns exact provenance fields to the owning spec.
- [x] The adoption template assigns executable fresh-clone verification commands to the project Runbook.
- [x] Public Workbench guidance explains the same proof boundary.
- [x] A targeted contract test is red against the baseline and green after the documentation change.
- [x] Full verification, static evaluations, guardrail audit, doctor, and diff check pass.

## Testing Seams

- The existing focused adoption document-contract test reads only the generic
  adoption template and public Workbench README.

## Verification Procedure

```bash
node tools/test-adoption-git-write-fallback.mjs
```

Then run the complete suite from `RUNBOOK.md`, both static evaluations, the
guardrail audit, render, doctor, and `git diff --check`.

## Documentation Impact

- `templates/ADOPTION.md` owns the copy-ready provenance and handoff protocol.
- `README.md` owns filled public guidance for Workbench adopters.
- This spec owns the sanitized decision and proof.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-15 | TK-001 | Ticket closed | Targeted baseline-red/candidate-green passed; full integration suite and held-out grader passed; root 113/113 and templates 106.6/113 unchanged; guardrail 78/100 unchanged | Updated templates/ADOPTION.md, README.md, focused contract test, and S-012 evidence | No behavioral claim or model trials for this documentation-contract correction |
| 2026-07-15 | spec | Spec completed | Acceptance gates satisfied | Documentation impact recorded above | none |

## Completion Result

Pass. Adoption now preserves source identity and executable fresh-clone proof in
the downstream files a cold verifier can discover without the original checkout
or chat history.

## Remaining Limitations Or Follow-Up Specs

- This narrow documentation-contract correction makes no behavioral-lift claim;
  no model trials were run.

## Supersession

- Supersedes: none
- Superseded by: none
