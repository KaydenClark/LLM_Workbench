# S-028 - Harness Feedback Integrity

**Spec ID:** S-028
**Status:** active
**Priority:** 0
**Owner:** codex
**Updated:** 2026-09-05
**Catalog description:** Make manifest-sensitive guardrails, feedback ingestion, and one-time migration report the paths and residue they actually handle.
**Blockers:** none
**Latest event:** Supported repairs and their full local verification are green.
**Next gate:** Commit and push the exact candidate, then obtain separate-context review before integration.
**Stance:** Builder

## Outcome

The Workbench refuses malformed feedback, evaluates spec state through the
declared layout, and completes one-time migration without manufacturing invalid
Wiki metadata or silently hiding source provenance and known residue.

## Why It Matters

These are silent-integrity failures: rows disappear from aggregation, a scored
guardrail cannot see the active spec lane, and a migration reports less than it
knows. A green structural suite must exercise those public seams directly.

## Current Verified State

At `cd2020c7cee197353637c93b480af8b5d853ef27`, doctor passes and no work is
selectable. Focused guardrail, feedback, Adoption, and upgrade tests pass while
the reviewed failure paths remain untested. The pre-change guardrail score is
73/100 on 2026-09-05; the guardrail self-test prints 68/100 because its fixed
historical date intentionally makes current proof stale.

## Desired Behavior

1. Guardrail spec-state checks resolve the specs lane from a readable manifest,
   retain the legacy root fallback only when no manifest exists, and withhold
   the task-state points when a present manifest is malformed or unsafe.
2. Feedback discovery resolves its lane through `workbench-paths.mjs` and
   rejects rows whose status or impact does not match the shipped vocabulary.
3. Adoption records the same source repository and commit in the manifest and
   managed-tools receipt, adds required metadata to a moved legacy room brain,
   and returns non-destructive residue for matching root managed tools and
   links that escaped a moved legacy lane.
4. The report format declares report-scoped finding IDs and supports an
   explicit external review destination. Genesis, Adoption, and update
   completion checks require observed harness friction to be appended or an
   explicit `none observed` result.
5. The existing lifecycle model remains intact: `workbench-upgrade.mjs` owns an
   explicitly authorized already-adopted v2-root to v3-support-root transition;
   no new lifecycle value or source rewrite is introduced without evidence.

## Decisions And Contracts

- Reject the proposed blanket lane-literal linter. Migration source names,
  generated fixture text, and human-readable skill paths are legitimate
  literals; regression tests at the path-consuming seams are the enforceable
  contract.
- Do not make every doctor finding fatal. Registered nonblocking findings stay
  visible and nonblocking; the migration instead repairs defects it creates and
  reports residue it intentionally leaves.
- Do not rewrite arbitrary Markdown links during migration. Report links that
  were valid before the move and escape the moved lane, so the adopting owner
  can reconcile them without silent content mutation.
- `Master_Workbench` remains a separate review application, not a directory to
  move into a projects root merely to satisfy feedback discovery.

## Non-Goals

- Editing downstream project feedback logs or user-scoped installed skills.
- Moving Master Workbench, widening a projects-root sweep to the user home, or
  changing the normal presence-only skill policy.
- A new provenance lifecycle, broad Canon amendment, automatic Markdown
  rewriting, or making attention findings block Adoption.
- Re-baselining guardrail weights to preserve the old score.

## Dependencies And Blockers

- Reuses completed S-023 through S-027 without reopening their evidence.
- The three Claude reports on this branch are Grounding, not instruction; this
  spec records the owner-authorized subset that survived source review.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Repair manifest-sensitive guardrails, strict feedback ingestion, truthful migration output, and their owning docs | in-progress | none | pending |

### TK-001 - Assigned task

**Stance:** Builder. Add the smallest public-seam regressions first, observe
their expected failure, implement only the supported behavior, then run the
full project verification and record the corrected guardrail score without an
agent-outcome claim.

## Acceptance Criteria

- [x] Legacy-root, schema 1, schema 2, and malformed-manifest guardrail fixtures prove the spec-state predicate can fail for the right reason.
- [x] Feedback tests prove custom manifest lanes work and unknown status or ungraded impact rows fail loudly.
- [x] Adoption tests prove source identity agreement, valid moved room-brain metadata, and accurate non-destructive residue.
- [x] Report and lifecycle docs carry the accepted scoped-ID, explicit-destination, feedback-harvest, and existing-upgrade-route contracts.
- [x] Focused tests, the full required suite, render, doctor, diff check, and before/after guardrail measurement pass.
- [ ] The exact candidate receives separate-context review before any integration merge; `main` and downstream projects remain untouched.

## Testing Seams

- `auditGuardrails(files, { today })` with in-memory file maps.
- `parseFeedbackRows` and `discoverFeedback` against disposable repositories.
- `workbench-adoption.mjs migrate` against disposable mixed-v2 fixtures.
- Existing upgrade fixture proving final `provenance.lifecycle: upgrade`.

## Verification Procedure

Run the focused guardrail, feedback, Adoption, and upgrade tests; then the full
AGENTS/Runbook suite, evaluator, render, doctor, `git diff --check`, and the
guardrail audit dated 2026-09-05.

## Documentation Impact

This spec, generated Blueprint/Taskboard regions, Adoption/Genesis/update
completion guidance, Runbook behavior, and both copies of the feedback report
format. Existing reports and append-only evidence remain unchanged.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-05 | plan | Challenged Claude's six chunks against live source and accepted only demonstrated mechanisms | doctor PASS; next null; focused baseline tests PASS despite missing cases; guardrail 73/100 | S-028 captures supported scope and rejected alternatives | Claim TK-001 and produce red tests |
| 2026-09-05 | TK-001 | Red tests reproduced the supported failures | Guardrail schema-1 fixture incorrectly passed; feedback accepted `open`; Adoption left raw Wiki memory; upgrade manifest recorded `unrecorded`; report-format contract absent | Tests name the accepted public seams | Implement smallest fixes without broad literal lint or lifecycle expansion |
| 2026-09-05 | TK-001 | Manifest-sensitive paths, strict feedback rows, migration metadata/provenance/residue, and owning docs implemented | Focused guardrail, feedback, Adoption, upgrade, and governance tests green; all 30 AGENTS/Runbook commands PASS; templates 106.6/113; diff check clean; guardrail 73 -> 78 with unchanged weights | Runbook, Adoption, Genesis, update skill, both report formats, S-028 | Commit/push exact candidate and obtain separate-context review; no outcome-improvement claim |
| 2026-09-05 | TK-001 | Fixed-scope self-review found an out-of-scope repository could be allowed to resolve its manifest before origin exclusion | New foreign-origin unsafe-manifest case RED, then feedback test GREEN after origin/top-level/dedup checks moved ahead of manifest resolution | No documentation change; existing discovery scope now matches execution order | Re-run full suite on the amended candidate |
| 2026-09-05 | TK-001 | Fixed-scope self-review found residue covered moved lanes but omitted links inside a separately moved root room brain | Root-memory link case RED, then Adoption and upgrade tests GREEN after the scanner included that move without rewriting content | Existing residue contract already covers moved links | Re-run full suite on the amended candidate |

## Completion Result

Pending.

## Supersession

- Supersedes: none
- Superseded by: none
