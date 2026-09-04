# S-022 - LLM Workbench v3.1 Release

> Promoted from the owner-reviewed v3.1 greenlight and twelve binding
> amendments on 2026-09-04. Stable path
> `workbench/specs/S-022-llm-workbench-v3-1-release/SPEC.md`; never move it
> between status folders.

**Spec ID:** S-022
**Status:** active
**Priority:** 0
**Owner:** claude-fable-5-1
**Updated:** 2026-09-04
**Catalog description:** Release v3.1.0 as the first public v3 Workbench from one independently audited exact candidate proven by a cross-provider cold resume with Foundry absent.
**Blockers:** none
**Latest event:** Planning checkpoint promoted; TK-001 recorded as done with the pushed checkpoint as proof.
**Next gate:** Complete S-023, S-024, S-025, and S-026, then run TK-002 on the exact candidate.

## Outcome

`KaydenClark/LLM_Workbench` publishes v3.1.0 as the first public v3 release:
an independently audited exact `integration` SHA that a fresh agent from a
different provider can resume from a clean clone using repository state only,
with no Foundry mechanism available. v3.0.0 is recorded as an unreleased
internal candidate. GPT_OS and Foundry consume the released version; they
are never a dependency of it.

## Why It Matters

The v3.0.0 candidate proved the portable layout but shipped five lanes, no
decision records, no portable wiki contract, a flat diagnostic model, and
skills that still hardcoded private session paths. Publishing it would have
frozen a contract the owner's deployment had already outgrown and would have
kept the Workbench dependent on the unfinished coordination layer it is
supposed to carry. v3.1 is the release that makes the Workbench the runway
and the Foundry the altitude.

## Current Verified State

- S-015 landed on `integration` after an independent fixed-SHA PASS on
  `73308fc`; the v3.1 branch starts from the resulting exact integration SHA
  recorded in this spec's evidence log.
- `workbench/manifest.json` is schema 1 with five lanes; skills reference
  `.agents/grilling diary/` and root `tools/`; doctor emits a flat issue list;
  no ADR, wiki, sessions, or tools tooling exists; feedback discovery prefers
  a root file.
- The full union verification suite is green at the baseline apart from the
  time-based stale-claim effects that closing S-015 clears.
- Codex runs non-interactively from an isolated `CODEX_HOME` whose skills
  root is empty, so a cross-provider resume can use exact v3.1 installations.

## Desired Behavior

- One release umbrella (this spec) owns dependency completion, the exact
  candidate SHA, provider proof, independent audit, release evidence, and the
  S-014 handoff; four linked capabilities own the behavior.
- The primary acceptance test creates a project with the v3.1 candidate,
  pushes a planning checkpoint, is interrupted immediately after that push
  and before implementation, and is resumed by a different provider from a
  clean clone with no original chat, no Foundry path, and isolated or
  exact-version-synchronized skill and tool installations.
- The portability and privacy matrix passes on the exact candidate.
- The final exact SHA receives an independent PASS before the version bump
  lands and before S-014 resumes its exact-head audit and promotion flow.

## Decisions And Contracts

- `KaydenClark/LLM_Workbench` is the sole Workbench source and release
  repository; GPT_OS and Foundry are read-only evidence during v3.1 and adopt
  the released version afterwards ([ADR-0026](../../docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md)).
- v3.0.0 is documented as an unreleased internal candidate; v3.1.0 is the
  first public v3 release. No v3.0 promotion PR is opened.
- Exactly seven root controls remain; the Workbench Contract is a claim set,
  not a file ([ADR-0033](../../docs/adr/0033-workbench-contract-is-a-claim-set.md)).
- Ownership routing: Lexicon owns meanings, AGENTS owns authority and
  behavior, Blueprint owns cross-cutting architecture, the selected spec owns
  bounded capability requirements, Runbook owns procedures, Taskboard is
  Projection, the wiki is durable knowledge, ADRs own rationale.
- Spec IDs S-016 through S-019 stay unused because an obsolete open PR once
  proposed IDs in that range; v3.1 records are S-022 through S-026.
- All development happens in a clean `KaydenClark/LLM_Workbench` worktree
  using its own controls; no Captain, Job Order, flight, CAS/Journal,
  scheduler, embedded Forge tool, or Foundry path may be required.

## Non-Goals

- Merging `integration` into `main`; S-014 and the owner own promotion.
- Amending GPT_OS or Foundry Canon from this repository; downstream adoption
  is a separately visible downstream change after release.
- Porting all twenty-four GPT_OS ADRs, rewriting completed S-021, or
  reopening the lane count, dependency direction, or Foundry-ceremony
  boundaries.
- Model-outcome claims from structural proof alone.

## Dependencies And Blockers

- S-023, S-024, S-025, and S-026 supply the behavior this release proves.
- S-014 resumes only after TK-004 lands the audited v3.1 candidate.

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Promote the greenlight and amendments into controls, ADRs, and five linked specs, and push the planning checkpoint | done | none | Planning checkpoint commit on `claude/v3.1-release`; render and doctor green; see evidence log |
| TK-002 | Prove the primary acceptance round trip: planning checkpoint, forced interruption, cross-provider clean-clone resume with Foundry absent | ready | S-023, S-024, S-025, S-026 | pending |
| TK-003 | Run the portability and privacy matrix on the exact candidate and record every result | ready | S-023, S-024, S-025, S-026 | pending |
| TK-004 | Obtain the independent exact-SHA audit, land the v3.1.0 version bump, and hand the candidate to S-014 | ready | TK-002, TK-003 | pending |

### TK-002 - Primary acceptance round trip

**Done criteria:** in a disposable bare remote, a Genesis project built with
the exact candidate's tools and skills reaches a pushed planning checkpoint
(spec, ticket, claim, checkpoint record); the working clone is destroyed
before implementation; a different provider resumes from a fresh clone using
only repository state, completes the slice with red/green verification, closes
the ticket, renders, passes doctor, and pushes; the transcript shows no Foundry
path, no original chat, and no global skill; fresh Claude compatibility is
exercised on the same repository state.

### TK-003 - Portability and privacy matrix

**Done criteria:** schema 1 to 2 migration, mixed Adoption, case-sensitive
path handling, Windows/POSIX path behavior, symlink invocation, collisions,
stale links, public privacy stripping, and scans for retired private and
Foundry-dependent paths each have a named check that passed on the candidate.

### TK-004 - Audit, version, and handoff

**Done criteria:** an independent reviewer returns PASS on the exact pushed
candidate; `BLUEPRINT.md`, `README.md`, the manifest, and templates carry
v3.1.0; the full union suite, render, doctor, and `git diff --check` pass on
the exact resulting `integration` SHA; S-014 records that SHA as its candidate.

## Acceptance Criteria

- [ ] S-023, S-024, S-025, and S-026 are complete on `integration`.
- [ ] The primary acceptance round trip passes with a forced post-planning interruption and a different-provider clean-clone resume with Foundry absent.
- [ ] The portability and privacy matrix passes on the exact candidate.
- [ ] An independent fixed-SHA audit returns PASS on the final candidate before the version bump lands.
- [ ] v3.0.0 is documented as an unreleased internal candidate and v3.1.0 as the first public v3 release across Blueprint, README, manifest, and templates.
- [ ] S-014 receives the exact audited integration SHA and remains the sole owner of promotion.

## Testing Seams

- Bare-remote round trip: repository state only, provider isolation by home
  directory, Foundry absence by environment scrub and path scan.
- Matrix: one named command or fixture per matrix row, recorded with exit
  codes.
- Audit: fixed `BASE_SHA..HEAD_SHA` review by an independent reviewer.

## Verification Procedure

Run the complete `RUNBOOK.md` union suite, then the round-trip and matrix
commands each capability adds, then render, doctor, `git diff --check`, and a
remote SHA read-back.

## Documentation Impact

- `BLUEPRINT.md` owns the v3.1 direction, source authority, and version.
- `README.md` owns the public v3.1 setup contract and the v3.0.0 note.
- `RUNBOOK.md` owns the release verification commands.
- S-014 records the release-candidate handoff.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-04 | TK-001 | Promoted the greenlight handoff and twelve owner amendments into Blueprint, Lexicon, AGENTS, the ADR corpus, this umbrella, and S-023 through S-026 | Baseline: independent PASS on `73308fc`, landed on `integration`; S-015 closed; render and doctor green on the planning checkpoint | Updated BLUEPRINT.md, LEXICON.md, AGENTS.md, README.md, S-014, and the checkpoint record; RUNBOOK and templates change ticket by ticket only when their behavior exists | Implement S-023 first; TK-002 through TK-004 wait for the four capabilities |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Downstream adoption into GPT_OS and the amendment of its producer Canon are
  separate downstream changes after release.
- Model-outcome claims still require repeated controlled trials.

## Supersession

- Supersedes: none
- Superseded by: none
