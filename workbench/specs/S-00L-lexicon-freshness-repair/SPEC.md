# S-00L - Lexicon Freshness Repair

**Spec ID:** S-00L
**Status:** complete
**Priority:** 1
**Owner:** claude
**Stance:** Builder
**Updated:** 2026-09-12
**Catalog description:** Repair the root Lexicon's stale current-facing claims so a cold-start agent reads the actual release lineage, boundary and review date.
**Blockers:** none
**Latest event:** Spec completed and removed from the hot board.
**Next gate:** none

> **Citation anchors.** pre=`1695b70c4e1b13ba84e13a58e3b39981962bcf0e` post=`3d024c32302ad52520d0fb9a42c8e5b3024e6325`.

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
| TK-001 | Refresh the three stale Lexicon claims and record the bounded manual self-check | done | none | Scripted read-back at the worktree on 3d024c32302ad52520d0fb9a42c8e5b3024e6325: current-candidate claim v3.2.1 equals manifest workbenchVersion; main claim v3.2.0 equals origin/main manifest; b1c7160 (v3.1.3), fab7840 (v3.1.4), ee09c36 (v3.2.0) contained in origin/main; 22f8705 (v3.2.1) contained in origin/integration; Foundry row carries no version window; stamp 2026-09-12; 25 Markdown link targets (35 links) resolve; manifest counts 17 workflow + 4 stance skills, 6 lanes, 10 collections match the Lexicon. node tools/test-governance-core.mjs, test-control-fidelity.mjs, test-spec-citation-anchors.mjs, test-spec-workbench.mjs exit 0; render and doctor green: doctor reports only attention findings that block none, namely the five stale-seed and one unverified-provenance findings that predate this branch on origin/integration plus 42 incompatible-core findings about this host's installed skill copies (core v3.2.0 against room v3.2.1), which are host state outside the candidate; git diff --check clean. A first candidate (d1407bb, PR #90) failed separate-context review because integration moved under it and its spec anchored claims to the wrong tree; this branch rebuilds it on 1695b70c4e1b13ba84e13a58e3b39981962bcf0e |

### TK-001 - Refresh the three stale Lexicon claims and record the bounded manual self-check

**Stance:** Builder

Edit the review stamp, the `v3.0.0` distinction and the `Foundry` distinction
in `LEXICON.md`. Run the scripted read-back (manifest version, `origin/main`
containment of every version the row says reached `main`, link resolution,
manifest counts), the focused control tests, render, doctor, then the full
suite on the committed candidate.

## Acceptance Criteria

- [x] The only version the Lexicon calls the current candidate equals the
      manifest's `workbenchVersion`, and every version it says `main` carries is
      contained in `origin/main`.
- [x] The `Foundry` row carries no version-bound window.
- [x] The review stamp equals the date of the recorded check.
- [x] Every Markdown link in the Lexicon resolves and its skill, lane and
      collection counts match the manifest.
- [x] `node tools/test-governance-core.mjs`, `node tools/test-control-fidelity.mjs`,
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
| 2026-09-12 | TK-001 | Ticket closed | Scripted read-back at the worktree on 3d024c32302ad52520d0fb9a42c8e5b3024e6325: current-candidate claim v3.2.1 equals manifest workbenchVersion; main claim v3.2.0 equals origin/main manifest; b1c7160 (v3.1.3), fab7840 (v3.1.4), ee09c36 (v3.2.0) contained in origin/main; 22f8705 (v3.2.1) contained in origin/integration; Foundry row carries no version window; stamp 2026-09-12; 25 Markdown link targets (35 links) resolve; manifest counts 17 workflow + 4 stance skills, 6 lanes, 10 collections match the Lexicon. node tools/test-governance-core.mjs, test-control-fidelity.mjs, test-spec-citation-anchors.mjs, test-spec-workbench.mjs exit 0; render and doctor green: doctor reports only attention findings that block none, namely the five stale-seed and one unverified-provenance findings that predate this branch on origin/integration plus 42 incompatible-core findings about this host's installed skill copies (core v3.2.0 against room v3.2.1), which are host state outside the candidate; git diff --check clean. A first candidate (d1407bb, PR #90) failed separate-context review because integration moved under it and its spec anchored claims to the wrong tree; this branch rebuilds it on 1695b70c4e1b13ba84e13a58e3b39981962bcf0e | LEXICON.md review stamp, v3.0.0 distinction and Foundry distinction updated; CATALOG.md and TASKBOARD.md regenerated; templates/LEXICON.md unchanged because none of the three rows exist there; bounded manual Workbench self-check recorded in this row per the AGENTS.md drift boundary | Full AGENTS.md suite on the committed candidate, separate-context review, and integration containment still pending; README/TASKBOARD S-014 and S-022 stale release wording stays with S-00K |

| 2026-09-12 | spec | Full `AGENTS.md` suite run on the committed candidate `b6b3b6c0c681b717df7ac2d5b542df7a85677328` | All 42 suite commands exited 0 (38 Node tests, two Python tests, `evaluate-workbench --path templates --include-controls`, `doctor`); doctor reported only attention findings that block none: the five `stale-seed` and one `unverified-provenance` findings that predate this branch on `origin/integration`, plus this host's 42 `incompatible-core` skill-copy findings, which are host state outside the candidate | Acceptance boxes ticked; Completion Result written; no other owner changed | Separate-context review and integration containment happen through the PR and the `RUNBOOK.md` closeout block; README/TASKBOARD S-014 and S-022 stale release wording stays with S-00K |
| 2026-09-12 | spec | Spec completed | Acceptance gates satisfied | Documentation impact recorded above | none |

## Completion Result

Complete. `LEXICON.md` now names v3.2.1 as the current `integration` candidate
and v3.2.0 as the version `main` carries, lists each earlier stamp with its
owning spec, states the Foundry boundary in ADR-0026's version-free wording,
and is stamped with the date of the recorded check. No definition changed
meaning and no term was added, renamed or removed. The proof is the scripted
read-back and the full suite recorded in the evidence log; the row for the
release lineage will need refreshing at the next version stamp or `main`
promotion, a class of drift S-00K is planned to catch.

## Remaining Limitations Or Follow-Up Specs

- README, TASKBOARD and the S-014/S-022 stale release projection remain with
  S-00K. No new follow-up spec is authorized by this record.

## Supersession

- Supersedes: none
- Superseded by: none
