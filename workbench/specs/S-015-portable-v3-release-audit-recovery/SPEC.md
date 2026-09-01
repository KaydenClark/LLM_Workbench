# S-015 - Portable v3 Release Audit Recovery

> Generated from LLM Workbench v3.0.0. Stable path
> `workbench/specs/S-015-portable-v3-release-audit-recovery/SPEC.md`; never move between status folders.

**Spec ID:** S-015
**Status:** active
**Priority:** 0
**Owner:** codex
**Updated:** 2026-09-01
**Catalog description:** Make generated v3 controls and Genesis validation enforce one operable manifest-declared spec lane before release.
**Blockers:** none
**Latest event:** TK-001 claimed by codex.
**Next gate:** Close TK-001 with verification and documentation proof.

## Outcome

A generated Workbench v3 project routes every active control to its
manifest-declared `workbench/specs/` lane, and `validate --genesis` rejects a
placeholder or structurally unusable scaffold before any caller can claim the
project is ready.

## Why It Matters

The complete test suite passed while shipped copy-ready templates still pointed
agents at the retired root `specs/` path and the Genesis validator accepted
filename-only controls plus a malformed first spec. Releasing that candidate
would make the public v3 contract internally contradictory and allow false
readiness claims.

## Current Verified State

- Independent Auditor `/root/s014_auditor` reviewed exact range
  `08ab78e5a59a68d2b04028fe71a2be488d5ae10e..d80d14c531c4bece9e2978d11e92e5a5d7bd77a5`
  from a clean detached worktree and returned `REQUEST CHANGES`.
- `templates/AGENTS.md`, `templates/BLUEPRINT.md`, `templates/TASKBOARD.md`,
  `templates/SPEC.md`, `templates/README.md`, and
  `templates/Wiki/MEMORY.project.md` still route active work to root `specs/`.
  Adoption's references to the retired source path remain legitimate migration
  input and are not active v3 authority.
- `tools/workbench-layout.mjs validate --genesis` checks only for seven path
  names and any recursive `SPEC.md`. Its green fixture uses filename-only
  controls and `# S-001`, so it cannot prove an actionable cold resume.
- The immutable candidate contains sixteen `skills-pending/` directories.
  S-014 still names seventeen; S-021's earlier planning snapshot predates the
  removal of `skills-pending/handoff` and remains historical evidence.

## Desired Behavior

- Every copy-ready v3 template routes specs through the manifest-declared
  `workbench/specs/` lane and never grants active write authority to root
  `specs/`.
- A focused regression scans the copy-ready template set and fails if retired
  active root-spec guidance returns, while allowing bounded legacy migration
  language in Adoption.
- `validate --genesis` accepts only ordinary, non-symlink root controls whose
  content is filled and free of bracketed template placeholders. The six
  stamped controls must match the manifest's exact Workbench version; the thin
  `CLAUDE.md` bridge remains exactly `@AGENTS.md`.
- The first declared spec is an ordinary file at a stable `S-###-slug/SPEC.md`
  path and parses as an actionable Workbench packet with required identity,
  lifecycle, outcome, slice, acceptance, and completion sections.
- The existing happy fixture becomes an operable generated project; focused
  negative fixtures prove symlink, placeholder, version, path, and malformed
  first-spec failures.
- Release evidence truthfully carries sixteen pending historical skill
  baselines plus the unverified fresh-Claude discovery limitation.

## Decisions And Contracts

- `workbench/manifest.json` remains the single machine-readable support-lane
  authority. Copy-ready template links use its v3 default
  `workbench/specs/` path; tools resolve the manifest rather than adding a
  second root queue.
- `validate --genesis` is a readiness gate, not a Markdown quality scorer. It
  validates only the minimum structural contract needed for a cold agent to
  select and claim work safely.
- Root controls must be ordinary files. Empty files, filename-only stubs,
  bracketed placeholders, symlinks, and version stamps that disagree with the
  manifest fail visibly with stable error codes.
- The first-spec check is constrained to the declared specs lane and one stable
  `S-###-slug/SPEC.md` packet; an unrelated nested `SPEC.md` cannot satisfy it.
- Adoption may still name legacy root `specs/` as migration input. That is not
  active v3 authority and must be explicitly recognizable as legacy/retired.
- S-021 remains complete and its append-only historical record is not rewritten.
  This linked repair owns the post-audit correction; S-014 owns the refreshed
  exact candidate, release status, and promotion PR.

## Non-Goals

- Redesigning the manifest, spec lifecycle, Markdown parser, or template visual style.
- Validating prose quality beyond the minimum filled-control and actionable-spec contract.
- Reopening S-011's retired discovery model, authenticating Claude, or promoting the sixteen pending skills.
- Publishing release status, opening the promotion PR, or merging any branch; those remain S-014 work after this repair lands.

## Dependencies And Blockers

- S-021 supplies the shipped v3 manifest/layout/template behavior being repaired.
- S-014 is blocked until this capability lands on `integration` and a fresh exact-head audit passes.
- No owner decision is open; all corrections are required by the accepted v3 contract and immutable audit findings.

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | A cold Genesis project gets only manifest-routed controls and fails closed unless its controls and first spec are operable | in-progress | none | pending |

### TK-001 — Operable Manifest-Routed Genesis

**Vertical slice:** Starting from the copy-ready templates and public layout
CLI, build one real Genesis fixture, prove its controls route to the declared
spec lane, validate its exact version and actionable first spec, and reject the
smallest stale-path and unusable-scaffold variants with stable errors.

**Done criteria:**

- All active copy-ready template links and scopes use `workbench/specs/`; a
  focused test rejects retired root-spec authority outside bounded legacy
  migration guidance.
- `validate --genesis` rejects symlinked controls, empty/stub/placeholder
  controls, mismatched version stamps, unstable first-spec paths, and malformed
  first-spec packets.
- The happy fixture contains seven filled version-matched controls and one
  actionable first spec, validates green, and is checkable with one command in
  under one minute.
- S-014 records sixteen pending skill baselines and the failed-candidate audit;
  S-021 stays immutable and S-014 remains blocked until this repair reaches
  remote `integration`.
- Focused tests, the complete RUNBOOK suite, render, doctor, evaluator, and
  `git diff --check` pass without weakening any guardrail criterion.

**Verification:**

```bash
node tools/test-workbench-layout.mjs
node tools/test-workbench-dogfood.mjs
node tools/test-spec-workbench.mjs
node tools/evaluate-workbench.mjs --path templates --include-controls
node tools/spec-workbench.mjs doctor
git diff --check
```

## Acceptance Criteria

- [ ] Active v3 templates contain no root `specs/` authority and their links resolve through the default manifest lane.
- [ ] A deterministic regression distinguishes active v3 guidance from bounded legacy Adoption migration input.
- [ ] Genesis readiness rejects non-file controls, placeholders, mismatched version stamps, unstable first-spec paths, and structurally incomplete specs.
- [ ] One operable generated fixture passes the public `validate --genesis` command in under one minute.
- [ ] S-014 carries the exact failed-audit findings and truthful sixteen-pending-skill limitation before it resumes.
- [ ] Full verification and an independent fixed-diff review pass on a remotely recoverable checkpoint.

## Testing Seams

- Copy contract: deterministic scan of active template paths and writable-scope text.
- CLI contract: `node tools/workbench-layout.mjs validate --project PATH --genesis` JSON status and stable error code.
- Control contract: `lstat`, filled content, placeholder absence, and exact version stamp.
- Spec contract: declared-lane stable path plus the minimum fields/sections consumed by the Workbench lifecycle.
- Release handoff: exact remote integration SHA and a new independent S-014 audit after landing.

## Verification Procedure

Run TK-001 focused tests, then every command in `RUNBOOK.md` Full verification,
followed by render, doctor, `git diff --check`, remote SHA read-back, and an
independent fixed-SHA review.

## Documentation Impact

- This spec owns the audit recovery requirements, acceptance, and proof.
- `templates/` owns copy-ready v3 paths and filled version guidance.
- `RUNBOOK.md` changes only if the public validation command or troubleshooting contract changes.
- S-014 owns release blocker state, exact limitation count, and renewed audit handoff.
- Generated `BLUEPRINT.md` and `TASKBOARD.md` project the durable spec state.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-01 | plan | Promoted the immutable S-014 release-audit rejection into one linked recovery capability and one complete-path tracer bullet | Auditor `/root/s014_auditor` pinned `08ab78e..d80d14c`, confirmed live refs and ancestry, ran the complete RUNBOOK suite green, and returned three findings with no candidate or external writes | Added S-015; S-014 blocker and generated projections updated separately | Claim TK-001, drive focused red/green behavior, land the reviewed repair, then restart S-014 on the new exact integration SHA |
| 2026-09-01 | TK-001 implementation candidate | Replaced active root-spec template authority with the manifest lane and made Genesis readiness validate ordinary filled controls, exact applicable version stamps, the thin Claude bridge, and one stable actionable first spec | Red: `node tools/test-workbench-layout.mjs` failed on stale template authority plus false-positive control/spec fixtures. Green: 6 focused layout tests, dogfood/spec lifecycle tests, the union 20-command AGENTS/Runbook suite, evaluator 113/113, templates 106.6/113, held-out grader, render/doctor, and `git diff --check` passed. Guardrail baseline from the rejected candidate and after-score both remained 68/100; no model-outcome claim was made. | Updated six active copy-ready templates, layout validator/tests, dogfood selection assertion, RUNBOOK behavior, S-014 blocker/count, S-015, and generated projections; README, skills, Lexicon, and S-021 checked with no update needed because their public contracts or immutable history remain accurate | Push this in-progress checkpoint and obtain an independent immutable-diff review before closing TK-001 |
| 2026-09-01 | TK-001 review repair | Fixed the immutable `ac90fcf..a863b38` review rejection by binding readiness to one selectable active ticket, matching only the shipped placeholder vocabulary, accepting legitimate Markdown brackets, and scanning all Adoption text except its one exact legacy occurrence | Review returned two P1 findings and one P2 test gap without external writes. Red: focused tests accepted planned/blocked first packets and rejected `array[0]` plus optional CLI/reference syntax. Green: 7 focused tests prove `nextWork()` returns the exact first packet, reject planned/blocked packets, accept legitimate brackets, and allow exactly one legacy Adoption path; the complete 20-command union suite, evaluator 113/113, templates 106.6/113, doctor, and held-out grader pass. | Updated the layout validator and focused tests only; prior candidate docs remain accurate and append-only evidence records the rejected checkpoint | Push a new immutable checkpoint and repeat independent fixed-diff review against the full S-015 implementation range |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Fresh Claude discovery remains unverified.
- Sixteen historical pending skill baselines remain outside the released 12-skill core.
- S-014 must repeat the immutable exact-head audit and publication flow after this repair lands.

## Supersession

- Supersedes: none
- Superseded by: none
