# S-035 - Workbench v3.1.2 Candidate

**Spec ID:** S-035
**Status:** active
**Priority:** 0
**Owner:** claude-fable-5-1
**Stance:** Builder
**Updated:** 2026-09-05
**Catalog description:** Stamp v3.1.2 only after the six v3.1.2 capability specs are complete and green, record the disposition of every v3.1.1 upstream fix-list item, and land the reviewed candidate on integration.
**Blockers:** none
**Latest event:** TK-001 closed with proof.
**Next gate:** Complete TK-002.

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
  `README.md:167-170`; `RUNBOOK.md:141,240,278`; `templates/ADOPTION.md:210`;
  `skills/adoption/SKILL.md:25`; `tools/workbench-upgrade.mjs:173` and
  `workbench/tools/workbench-layout.mjs:406` usage strings;
  `workbench-layout.mjs:116` `supportedLegacy` accepting `v3.0.0` and
  `v3.1.0` twelve-skill manifests; `tools/test-workbench-layout.mjs:578-589`;
  `LEXICON.md:93`; and the three wiki stamps S-033 aligns.
- `node tools/audit-guardrails.mjs --path .` prints 78/100 at this commit
  (S-028 evidence records the 73 to 78 movement with unchanged weights;
  `benchmarks/RESULTS.md` carries no S-028 row yet).
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
| TK-001 | Stamp v3.1.2 on every version-bearing surface, extend `supportedLegacy`, re-measure the guardrail, and write the final disposition table | done | S-029, S-030, S-031, S-032, S-033, S-034 | node tools/test-workbench-layout.mjs (30 pass; new legacy version-table case, green before and after because the sixteen-skill policy is unchanged, so it pins the table rather than proving red-first); node tools/audit-guardrails.mjs --path . before at 5cd1e51 and after the stamp, 78/100 -> 78/100 with unchanged weights and the same four outcome recommendations; grep -rn v3.1.1 over the enumerated surfaces shows only history and the legacy table; full AGENTS.md suite, test-control-fidelity, path-safety eval, evaluate-workbench templates, render, doctor --home <empty>, git diff --check |
| TK-002 | Separate-context review of the exact candidate, PR into integration, remote containment read-back | ready | TK-001 | pending |

### TK-001 - Stamp and account

**Stance:** Builder

Run the full suite green first, then change the surfaces listed above in one
logical commit. Red first for the legacy list: a v3.1.1 sixteen-skill manifest
must validate as `valid` after `supportedLegacy` grows, an unlisted
well-formed version must carry the current policy, and `invalid-manifest`
must still reject a malformed version. Record before and after guardrail
scores.

### TK-002 - Review and land

**Stance:** Builder, with the review itself performed by a separate-context
Reviewer against the immutable candidate SHA. Open the PR with `gh`, merge
after APPROVE, read back `origin/integration` containment, and close this
ticket with the merge commit.

## Acceptance Criteria

- [x] S-029 through S-034 are complete before any surface changes version.
- [x] Every version-bearing surface reads v3.1.2 and `supportedLegacy` accepts v3.1.1; the full suite, `render`, and `doctor` pass afterwards.
- [x] Guardrail before and after scores are recorded with unchanged criteria and stated limitations.
- [x] The Completion Result carries the final disposition of UP-001 through UP-012.
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
| 2026-09-05 | spec | Spec captured as the v3.1.2 umbrella; disposition of the twelve v3.1.1 upstream items recorded against `b7b23dd` (three landed in S-028, one half landed, one not-supported, seven open across S-029 to S-034) | Version surfaces enumerated with `grep -rn "v3\.1\.1"`; S-028 completion and `tools/feedback-automation.mjs`, `tools/workbench-adoption.mjs` diffs confirm the landed rows | Blueprint v3.1.2 direction added | Everything; TK-001 waits on six specs |
| 2026-09-05 | TK-001 | Ticket closed | node tools/test-workbench-layout.mjs (30 pass; new legacy version-table case, green before and after because the sixteen-skill policy is unchanged, so it pins the table rather than proving red-first); node tools/audit-guardrails.mjs --path . before at 5cd1e51 and after the stamp, 78/100 -> 78/100 with unchanged weights and the same four outcome recommendations; grep -rn v3.1.1 over the enumerated surfaces shows only history and the legacy table; full AGENTS.md suite, test-control-fidelity, path-safety eval, evaluate-workbench templates, render, doctor --home <empty>, git diff --check | manifest, BLUEPRINT, README, LEXICON, RUNBOOK, templates/ADOPTION.md, skills/adoption and update-harness, tool usage strings, three wiki stamps, benchmarks/RESULTS.md row, S-035 Completion Result with the final disposition table and review-derived limitations | TK-002: separate-context review of the exact candidate, gh PR into integration, remote containment read-back |
| 2026-09-05 | TK-001 | Integration review of `dce85a2` returned APPROVE with three should-fixes, applied in one follow-up commit: the v3.1.1 legacy row now binds to the frozen sixteen-skill list instead of the live `skillPolicy` object; the Completion Result risks paragraph states what the tests actually pin; the limitations paragraph attributes its bullets to the integration reviews recorded here; the ticket text names the real `invalid-manifest` semantics | Red first: `coreSkills` grown in-process made a v3.1.1 sixteen-skill manifest `invalid-skill-policy`; green after the frozen row. node tools/test-workbench-layout.mjs, test-workbench-adoption.mjs, test-workbench-upgrade.mjs, test-workbench-dogfood.mjs, test-spec-workbench.mjs; doctor --home <empty>; render with clean porcelain; git diff --check | S-035 Completion Result and TK-001 ticket text | TK-002: PR into integration and remote containment read-back |

## Completion Result

TK-001 completed 2026-09-05 by claude-fable-5-1 on
`claude/s035-v3-1-2-candidate`, cut from `integration` at `5cd1e51` where
S-029 through S-034 are `complete` and `doctor --home <empty>` passes. TK-002
(separate-context review of the exact candidate, PR into `integration`, remote
containment read-back) is still open, so this spec stays `active` and the
fifth acceptance box stays unchecked until that ticket closes.

**What changed.** `workbench/manifest.json` `workbenchVersion` reads v3.1.2
(`provenance.source.release` stays v3.1.0, the adoption provenance S-027 kept).
`BLUEPRINT.md` names v3.1.2 in its harness-version line and its V3 direction,
`README.md` Versioning And Upgrades, and the `LEXICON.md` v3.0.0 row name v3.1.2
as the current candidate while keeping v3.1.1 as S-027's history. The four
`RUNBOOK.md` command examples, `templates/ADOPTION.md`, `skills/adoption/SKILL.md`,
`skills/update-harness/SKILL.md`, and the usage strings in
`tools/workbench-upgrade.mjs` and `workbench/tools/workbench-layout.mjs` pass
`--version v3.1.2`. The three wiki stamps S-033 aligned
(`workbench/wiki/SCHEMA.md`, `AGENTS.md`, `design-concepts/README.md`) read
v3.1.2 so `stale-stamp` stays silent. In `workbench-layout.mjs validateManifest`
`supportedLegacy` is now an explicit version-to-policy table: v3.0.0 and v3.1.0
at the twelve-skill bundle, v3.1.1 at the sixteen-skill bundle with the four
stances, and any other version at the current policy; a v3.1.1 twelve-skill
manifest is still `invalid-skill-policy`. `benchmarks/RESULTS.md` carries the
before and after guardrail row.

**Why.** The six capability specs each deferred the stamp here; the release
record needs every surface to agree and Master Workbench needs the disposition
table below.

**Risks and side effects.** A room whose installed core skills carry a schema 2
marker at release v3.1.1 reads `stale-skill` from `doctor` (attention, never
blocking) once its manifest moves to v3.1.2; only an explicit upgrade or a
reinstall rewrites the marker. Downstream manifests are not touched by this
change. The legacy-table rewrite changes no accepted or rejected manifest: the
sixteen-skill policy is identical between v3.1.1 and v3.1.2, so the first
added test case was green before the change as well as after. What the tests
pin: the two twelve-skill rows (v3.0.0, v3.1.0), the current-policy fallback
for any unlisted well-formed version, the malformed-version `invalid-manifest`
path, and, after the review follow-up, the frozen v3.1.1 row (a v3.1.1
sixteen-skill manifest stays `valid` when the live bundle grows, red before
the fix, green after). The integration review found the first table bound
v3.1.1 to the live policy object; the follow-up binds it to the frozen
sixteen-skill list.

**How verified.** `node tools/test-workbench-layout.mjs` (30 pass, including
the new legacy version-table case and the unchanged "v3.1.1 requires all four
stances" case); `node tools/audit-guardrails.mjs --path .` before (`5cd1e51`)
and after the stamp: **78/100 -> 78/100**, static 20/20, drift 25/25,
discipline 25/25, outcome 8/30, the same four outcome-evidence recommendations
(real repeated trials; no-template, generic, prior, and candidate compared; a
result within 90 days; effect with confidence interval), weights untouched, no
agent-outcome claim; `grep -rn "v3\.1\.1"` over the enumerated surfaces shows
only history (S-027's continuation sentences, the V3.1.2 direction naming the
v3.1.1 fix list, the generated catalog) and the legacy table itself; the full
`AGENTS.md` suite plus `tools/test-control-fidelity.mjs`, the path-safety eval,
`evaluate-workbench --path templates --include-controls`, `render`,
`doctor --home <empty>`, and `git diff --check` are recorded in the evidence
log.

**Final disposition of the v3.1.1 upstream fix list** (twelve items,
`~/Master_Workbench/data/upstream/v3.1.1.json`), for S-007 TK-002:

| Item | Title | Final disposition |
|---|---|---|
| UP-001 | Feedback rows silently dropped | landed in S-028: `tools/feedback-automation.mjs` rejects an unknown status and an ungraded impact instead of dropping the row |
| UP-002 | No signal that a skill copy is stale | landed in S-031: schema 2 managed skill markers record `release` and `commit`; `doctor` reports `stale-skill` and `skill-generation-unknown`; a report's skill claim must name the copy it read |
| UP-003 | No supported v2-root route | landed in S-032: `tools/workbench-upgrade.mjs upgrade --layout-only` migrates a v2-root room through the Adoption seam without replacing skills, and `update-harness` names it first; the item's mechanism claim ("never creates a support root") was not supported at `ae60d8d`, its conclusion was |
| UP-004 | Migrate cannot record the source commit | landed in S-028 (Adoption and upgrade record the source) and S-032 (`init`/`migrate` resolve the release checkout's `HEAD` and `origin` or refuse with `invalid-invocation`; the `unrecorded` placeholder no longer exists); residual F-1 limitation below |
| UP-005 | Migrate leaves unreported damage | landed in S-028: frontmatter repair, residue, and link report; automatic link rewriting declined because a migration reports what it cannot prove rather than mutating content silently |
| UP-006 | Finished defined by artifact presence | landed in S-029: Genesis, Adoption, and update-harness completion require a commit on a prefixed branch and a declared integration branch or a recorded reason; `doctor` reports `complete-on-integration` when a checkout's selected spec is already complete there |
| UP-007 | Feedback lane never asked for | landed in S-028: completion boxes in Genesis, Adoption, and update-harness ask for the feedback lane |
| UP-008 | No control fidelity check | landed in S-034: `tools/control-fidelity.mjs report` classifies each root-control line as kept, filled, changed, dropped, or added against the checkout's templates; Adoption Phase 4 and update-harness section 5 require every dropped or changed `AGENTS.md` line restored or recorded; limitation below |
| UP-009 | Room brain routing unchecked | landed in S-033: `doctor` reports `room-brain-unrouted` and `stale-stamp`; the Genesis gate fails `version-mismatch` on wiki stamps; Adoption box 9 requires the controls to route to the room brain |
| UP-010 | update-harness staleness claim | declined (not supported): the claim attributed an installed copy's text to the release, no active surface names a Foundry path, and S-031 corrected the record by evidence rather than by a harness change; UP-002's marker now lets the next reviewer name the copy |
| UP-011 | Integration branch mandated, established nowhere | landed in S-029: manifest schema 2 `git` block (`defaultBranch`, `integrationBranch`, exact case) written by `init`, `migrate`, and Adoption; `doctor` reports `integration-branch-undeclared` and `integration-branch-missing`; `validate --genesis` fails closed; ADR-0039 |
| UP-012 | Permission file withholds the lanes | landed in S-030: `templates/.claude/settings.json` grants `Edit` and `Write` on the five authorship lanes; `doctor` reports `permission-scope-drift` naming each withheld lane and the Genesis gate fails closed on it |

**Limitations carried from the integration reviews of S-029 to S-034**
(recorded here from those reviews; S-032 F-1 and the S-034 template row also
appear in their own specs; not repaired here):

- S-032 F-1: an explicit `--source-commit` has no SHA shape check, and
  `tools/workbench-tools.mjs sourceIdentity()`, which Adoption and both
  upgrade modes use, falls back to `'unknown'` on a checkout with no `origin`
  or no Git, so `upgrade --layout-only` can still record `commit: "unknown"`.
- S-034: `templates/AGENTS.md` carries no ADR ownership row, so the exact
  UP-008 line (the dropped `canonicalized_in` qualifier) reports as `added`,
  not `changed`, until a follow-up adds that row to the template.
- S-031: the `skill-generation-unknown` message and its docs say "no schema 2
  marker" even when the cause is a schema 2 marker from a foreign `source`.
- S-033: the checkpoint source walk refuses symlinked components, but a hard
  link inside the repository to a same-volume outside file still passes; the
  boundary is host-local only.
- On the owner host, `doctor` reports 32 `skill-generation-unknown` attention
  findings until the foreign Git skill roots are refreshed; an empty `--home`
  reports none.

## Remaining Limitations Or Follow-Up Specs

- Publication to `main` and any release tag are owner-only and not part of
  this spec.
- Real-use evaluation of v3.1.2 in a room is Master Workbench's later review,
  not this spec's evidence.
- TK-002 (review, PR, remote read-back) is open; the version stamp is a
  candidate on a task branch until `origin/integration` contains it.
- The review-derived follow-ups listed in the Completion Result (S-032 F-1,
  S-034 template ADR row, S-031 message wording, S-033 hard links) are
  unowned until a later spec claims them.

## Supersession

- Supersedes: none
- Superseded by: none
