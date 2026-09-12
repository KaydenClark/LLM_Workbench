# S-00L - Lexicon Freshness Repair

**Spec ID:** S-00L
**Status:** active
**Priority:** 1
**Owner:** claude
**Stance:** Builder
**Updated:** 2026-09-12
**Catalog description:** Repair the root Lexicon's stale current-facing claims so a cold-start agent reads the actual release lineage, boundary and review date.
**Blockers:** none
**Latest event:** TK-001 claimed by claude.
**Next gate:** Close TK-001 with verification and documentation proof.

> **Citation anchors.** pre=`1695b70c4e1b13ba84e13a58e3b39981962bcf0e` post=`1695b70c4e1b13ba84e13a58e3b39981962bcf0e`.

## Outcome

`LEXICON.md` presents only current facts as current. Its release lineage names
the versions that actually reached `main` and the candidate the manifest
declares now; its Foundry boundary is not tied to a past version window; and
its review stamp names the check that produced it. Historical claims stay,
bounded by the spec or version that owns them.

## Why It Matters

The Lexicon is the third file of the universal entry route (`AGENTS.md` ->
`RUNBOOK.md` -> `LEXICON.md`), so a memoryless agent reads it before any spec.
The 2026-09-10 original-foundation audit and the S-00K baseline both recorded
the same defect: the Lexicon narrates v3.1.4 as the current candidate while the
manifest declares a later version. S-00K owns the future automated self-drift
check and is gated on explicit activation; the drift itself misroutes readers
today. The `AGENTS.md` Workbench update drift boundary requires that known
current-facing drift not be left standing behind a passing render or doctor.

## Current Verified State

At the pre anchor:

- `LEXICON.md:3` stamps `Last reviewed: 2026-09-04`, eight days and several
  landed specs before this check.
- `LEXICON.md:195` (the `v3.0.0` row) ends "S-049 opened v3.1.3 and S-046
  stamps v3.1.4 as the current candidate". `workbench/manifest.json` declares
  `workbenchVersion: v3.2.1`; `origin/main` carries v3.2.0 (commit `ee09c36`,
  S-050) and also contains the v3.1.3 (`b1c7160`, S-049) and v3.1.4
  (`fab7840`, S-046) stamps; v3.2.1 was marked by commit `22f8705` (S-00E) and
  is contained in `origin/integration` but not `origin/main`.
- `LEXICON.md:196` (the `Foundry` row) says "Read-only evidence during v3.1",
  a window that closed with v3.2.0; ADR-0026's binding wording is version-free:
  never the Workbench's source, copy target, tool runtime, or prerequisite.
- Everything else checked reads current: all 25 Markdown link targets (35 links) resolve; the
  seventeen-plus-four core skill count, six lanes and ten collections match the
  manifest; ADR-000B remains `proposed`, so the seven-root-control wording in
  the Workbench Contract row is still live Canon; S-00G and S-00H are planned,
  so the ownership schema placement and the Ticket/TASK terms are unchanged.
- `templates/LEXICON.md` carries none of the three stale rows; its review stamp
  is a placeholder by design.

## Desired Behavior

1. The `v3.0.0` row's distinction states the release lineage as checkable Git
   facts: which spec stamped each version, which version `main` carries, and
   which version the manifest declares as the current `integration` candidate.
2. The `Foundry` row carries ADR-0026's boundary without a version window.
3. The review stamp names the date of the check that verified the file.
4. No definition changes meaning; no term is added, renamed or removed.
5. The check is recorded as a bounded manual self-check in this spec's
   evidence, per the `AGENTS.md` Workbench update drift boundary.

## Decisions And Contracts

- The seven-root-control wording stays until ADR-000B is accepted; S-00G owns
  that migration. Ticket and TASK stay until S-00H lands.
- The `v3.0.0` term is kept because its definition is still true; only the
  time-bound narration in its distinction column is refreshed.
- `README.md` still names S-014 as the integration-to-main release gate. That
  is README drift, already named in S-00K's baseline, and outside this
  Lexicon-scoped request.
- No self-drift tool is built here; S-00K owns that seam. The strongest
  concrete check is a scripted read-back against the manifest and Git.

## Non-Goals

- Implementing the S-00K self-drift checker or its update-procedure receipt.
- Moving the Artifact Ownership Schema out of the Lexicon (S-00G).
- Renaming Ticket to Task (S-00H) or changing any shared definition.
- Repairing README, TASKBOARD, S-014 or S-022 stale release wording (S-00K).
- Editing `templates/LEXICON.md`; none of the repaired rows exist there.

## Dependencies And Blockers

- none

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Refresh the three stale Lexicon claims and record the bounded manual self-check | in-progress | none | pending |

### TK-001 - Refresh the three stale Lexicon claims and record the bounded manual self-check

**Stance:** Builder

Edit the review stamp, the `v3.0.0` distinction and the `Foundry` distinction
in `LEXICON.md`. Run the scripted read-back (manifest version, `origin/main`
containment of every version the row says reached `main`, link resolution,
manifest counts), the focused control tests, render, doctor, then the full
suite on the committed candidate.

## Acceptance Criteria

- [ ] The only version the Lexicon calls the current candidate equals the
      manifest's `workbenchVersion`, and every version it says `main` carries is
      contained in `origin/main`.
- [ ] The `Foundry` row carries no version-bound window.
- [ ] The review stamp equals the date of the recorded check.
- [ ] Every Markdown link in the Lexicon resolves and its skill, lane and
      collection counts match the manifest.
- [ ] `node tools/test-governance-core.mjs`, `node tools/test-control-fidelity.mjs`,
      `node tools/test-spec-citation-anchors.mjs`, render and doctor pass, and
      the full `AGENTS.md` suite passes on the committed candidate.

## Testing Seams

- Prose freshness has no stable automated seam in this repository; the
  semantic self-drift seam is S-00K's capability and building it here would
  pre-empt that design. The named manual check is a scripted read-back that
  compares the Lexicon's version claims with `workbench/manifest.json` and
  `git merge-base --is-ancestor` against `origin/main`, and resolves every link.
- `tools/test-governance-core.mjs` and `tools/test-control-fidelity.mjs` hold
  the Lexicon's structure and template relationship.

## Verification Procedure

```bash
node tools/test-governance-core.mjs
node tools/test-control-fidelity.mjs
node tools/test-spec-citation-anchors.mjs
node workbench/tools/spec-workbench.mjs render
node workbench/tools/spec-workbench.mjs doctor
```

Then the full suite listed in `AGENTS.md` on the committed candidate, and the
separate-context review of the exact candidate that `AGENTS.md` Git Rules
require before it combines into `integration`. The PR record holds that
verdict and the `RUNBOOK.md` closeout block proves containment; neither is
claimed inside this spec in advance.

## Documentation Impact

- `LEXICON.md` is the deliverable. `workbench/specs/CATALOG.md` and
  `TASKBOARD.md` regenerate. `templates/LEXICON.md` is unchanged because no
  generic row is affected. S-00K is not edited; its acceptance already allows
  the Lexicon half of its README/LEXICON item to be repaired elsewhere, and its
  next implementer can cite this spec.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- README, TASKBOARD and the S-014/S-022 stale release projection remain with
  S-00K. No new follow-up spec is authorized by this record.

## Supersession

- Supersedes: none
- Superseded by: none
