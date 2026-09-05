# S-035 - Workbench v3.1.2 Candidate

**Spec ID:** S-035
**Status:** active
**Priority:** 0
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-05
**Catalog description:** Stamp v3.1.2 only after the six v3.1.2 capability specs are complete and green, record the disposition of every v3.1.1 upstream fix-list item, and land the reviewed candidate on integration.
**Blockers:** none
**Latest event:** Spec captured; the version stamp waits on S-029 through S-034.
**Next gate:** Complete S-029 through S-034, then claim TK-001.

## Outcome

`integration` carries an independently reviewed v3.1.2 candidate whose every
version-bearing surface agrees, whose guardrail score is re-measured against
unchanged criteria, and whose completion record tells Master Workbench what
happened to each of the twelve v3.1.1 upstream items, so the next fix list can
say what the release removed.

## Why It Matters

Master Workbench compiled the v3.1.1 upstream fix list
(`~/Master_Workbench/data/upstream/v3.1.1.json`, twelve items, verified
against harness commit `cd2020c`) and its S-007 TK-002 needs each item's
disposition to compare versions. S-028 already landed part of the list without
a version label; the remaining items are S-029 through S-034. A version label
is not publication (Blueprint): this spec delivers the candidate on
`integration` and stops there.

## Current Verified State

Verified in this repository at `b7b23dd3f0929e37276880335cd4d4cc60238d8e`
on 2026-09-05:

- Version-bearing surfaces at v3.1.1: `workbench/manifest.json`
  `workbenchVersion`; `BLUEPRINT.md:5` and its direction sections;
  `README.md:167-170`; `RUNBOOK.md:141,240,274`; `templates/ADOPTION.md:210`;
  `skills/adoption/SKILL.md:25`; `tools/workbench-upgrade.mjs:173` and
  `workbench/tools/workbench-layout.mjs:406` usage strings;
  `workbench-layout.mjs:116` `supportedLegacy` accepting `v3.0.0` and
  `v3.1.0` twelve-skill manifests; `tools/test-workbench-layout.mjs:578-589`;
  `LEXICON.md:93`; and the three wiki stamps S-033 aligns.
- The guardrail audit stands at 78/100 after S-028 (`benchmarks/RESULTS.md`
  and S-028 evidence), measured with unchanged weights.
- Disposition of the twelve items against this commit:

| Item | Title | Disposition at `b7b23dd` |
|---|---|---|
| UP-001 | Feedback rows silently dropped | landed in S-028 (`tools/feedback-automation.mjs` rejects unknown status and ungraded impact) |
| UP-002 | No signal that a skill copy is stale | open, [S-031](../S-031-installed-skill-generation/SPEC.md) |
| UP-003 | No supported v2-root route | open, [S-032](../S-032-upgrade-route-and-source-provenance/SPEC.md); mechanism claim corrected there |
| UP-004 | Migrate cannot record the source commit | Adoption and upgrade paths landed in S-028; Genesis `init` path open, S-032 TK-001 |
| UP-005 | Migrate leaves unreported damage | landed in S-028 (frontmatter, residue, link report; automatic rewriting declined) |
| UP-006 | Finished defined by artifact presence | open, [S-029](../S-029-declared-integration-branch/SPEC.md) TK-002 |
| UP-007 | Feedback lane never asked for | landed in S-028 (completion boxes in Genesis, Adoption, update-harness) |
| UP-008 | No control fidelity check | open, [S-034](../S-034-control-fidelity-report/SPEC.md) |
| UP-009 | Room brain routing unchecked | open, [S-033](../S-033-silent-gap-diagnostics/SPEC.md) TK-001 |
| UP-010 | update-harness staleness claim | not-supported; record corrected, no harness change; UP-002 follows |
| UP-011 | Integration branch mandated, established nowhere | open, S-029 |
| UP-012 | Permission file withholds the lanes | open, [S-030](../S-030-permission-scope-matches-lanes/SPEC.md) |

Gap: the stamp, the re-measurement, the final disposition, and the review.

## Desired Behavior

1. After S-029 through S-034 are `complete` and the full `AGENTS.md`
   verification suite passes, every surface above reads v3.1.2;
   `supportedLegacy` accepts v3.1.1 manifests as readable; the Lexicon's
   project-specific version row and the Blueprint direction name v3.1.2 as
   the current candidate without rewriting v3.1.1 history.
2. The guardrail audit is re-measured before and after the stamp with
   unchanged criteria and recorded in `benchmarks/RESULTS.md` with its
   limitations; no agent-outcome claim follows from it.
3. The Completion Result carries the final disposition table, each open row
   resolved to `landed in S-0xx` or `declined` with a reason, so
   `~/Master_Workbench` can ingest it for S-007 TK-002.
4. The exact candidate receives separate-context review, lands on
   `integration` through a `gh` PR, and containment is read back from the
   remote; `main` is untouched.

## Decisions And Contracts

- **Stamp last.** Version bumps occur only after behavior and proof are green
  (`AGENTS.md` Git Rules); TK-001 is blocked on all six capability specs.
- **Disposition is a deliverable.** The table is the artifact Master
  Workbench reads; it lives in this spec because this spec owns the release
  record.
- **No publication.** Promotion of `integration` to `main` and any tag remain
  owner-only and outside this spec.
- **Criteria unchanged.** Re-measurement never adjusts weights to preserve or
  improve a score.

## Non-Goals

- Merging to `main`, tagging, or announcing a release.
- Reopening S-014 or S-022, whose historical release procedures stay paused
  for separate owner direction.
- Repairing any downstream room or synchronizing the owner host's skills.

## Dependencies And Blockers

- S-029, S-030, S-031, S-032, S-033, S-034 must be `complete`.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Stamp v3.1.2 on every version-bearing surface, extend `supportedLegacy`, re-measure the guardrail, and write the final disposition table | ready | S-029, S-030, S-031, S-032, S-033, S-034 | pending |
| TK-002 | Separate-context review of the exact candidate, PR into integration, remote containment read-back | ready | TK-001 | pending |

### TK-001 - Stamp and account

**Stance:** Builder

Run the full suite green first, then change the surfaces listed above in one
logical commit. Red first for the legacy list: a v3.1.1 sixteen-skill manifest
must validate as `valid` after `supportedLegacy` grows and `invalid-manifest`
must still reject an unknown version. Record before and after guardrail
scores.

### TK-002 - Review and land

**Stance:** Builder, with the review itself performed by a separate-context
Reviewer against the immutable candidate SHA. Open the PR with `gh`, merge
after APPROVE, read back `origin/integration` containment, and close this
ticket with the merge commit.

## Acceptance Criteria

- [ ] S-029 through S-034 are complete before any surface changes version.
- [ ] Every version-bearing surface reads v3.1.2 and `supportedLegacy` accepts v3.1.1; the full suite, `render`, and `doctor` pass afterwards.
- [ ] Guardrail before and after scores are recorded with unchanged criteria and stated limitations.
- [ ] The Completion Result carries the final disposition of UP-001 through UP-012.
- [ ] The exact candidate passed separate-context review and `origin/integration` contains it; `main` is unchanged.

## Testing Seams

- `tools/test-workbench-layout.mjs` version and legacy-policy cases.
- `grep -rn "v3\.1\.1"` over version-bearing surfaces, excluding historical
  specs, feedback reports, and checkpoints.
- `node tools/audit-guardrails.mjs --path .` before and after.
- `git merge-base --is-ancestor <candidate> origin/integration`.

## Verification Procedure

The full `AGENTS.md` verification suite, `render`, `doctor`,
`git diff --check`, the guardrail audit, and the remote read-back in
`RUNBOOK.md` Branch Completion closeout.

## Documentation Impact

- `BLUEPRINT.md`, `README.md`, `LEXICON.md`, `RUNBOOK.md`, `templates/ADOPTION.md`,
  `skills/adoption/SKILL.md`, tool usage strings, `benchmarks/RESULTS.md`.
- This spec's Completion Result: the disposition table.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-05 | spec | Spec captured as the v3.1.2 umbrella; disposition of the twelve v3.1.1 upstream items recorded against `b7b23dd` (four landed in S-028, one not-supported, seven open across S-029 to S-034) | Version surfaces enumerated with `grep -rn "v3\.1\.1"`; S-028 completion and `tools/feedback-automation.mjs`, `tools/workbench-adoption.mjs` diffs confirm the landed rows | Blueprint v3.1.2 direction added | Everything; TK-001 waits on six specs |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Publication to `main` and any release tag are owner-only and not part of
  this spec.
- Real-use evaluation of v3.1.2 in a room is Master Workbench's later review,
  not this spec's evidence.

## Supersession

- Supersedes: none
- Superseded by: none
