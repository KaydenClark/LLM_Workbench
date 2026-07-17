# S-018 - Versioned Delivery And Downstream Rollout

> Generated from LLM Workbench v2.3. Stable path
> `specs/S-018-versioned-delivery-rollout/SPEC.md`; never move between status folders.

**Spec ID:** S-018
**Status:** active
**Priority:** 1
**Owner:** unassigned
**Updated:** 2026-07-17
**Catalog description:** Publish exact, reviewable Workbench releases and prove downstream upgrades against a deterministic package manifest.
**Blockers:** none
**Latest event:** Auditor remediation made S-018 the sole release-manifest and downstream-upgrade owner, with S-011/TK-016 as a typed skill-catalog input.
**Next gate:** Claim TK-002 and define the deterministic release manifest before changing release automation.

## Outcome

Each Workbench version is an exact, independently reviewable package with a
manifest of shipped controls, templates, skills, tools, and licenses; downstream
projects can upgrade from that identity and prove the result from a fresh clone.

## Why It Matters

The repository is public and v2.3 has shipped, but release identity is currently
reconstructed from branch state, prose, and one-off evidence. PR #34 delivered
the correct audited tree while producing a single-parent main commit instead of
preserving integration ancestry. A repeatable package and rollout contract must
verify both content and release mechanics before the next version.

## Current Verified State

- `KaydenClark/LLM_Workbench` is the public MIT-licensed source and `main` is the
  published branch.
- README defines the copyable template package, skills, lifecycle tools,
  evaluation tools, and upgrade loop.
- S-014 produced an independently audited exact integration SHA, evidence-bound
  release status, and owner promotion PR. Kayden merged PR #34.
- Live `main` at `08ab78e` has the audited integration tree but not integration
  as a Git ancestor; the intended merge-history invariant therefore did not survive.
- `update-harness` defines project reconciliation behavior, but no deterministic
  release manifest currently binds all shipped files and provenance.

## Desired Behavior

- A release candidate emits a deterministic manifest covering shipped files,
  version, source ref, resolved SHA, checksums, licenses, and verification commands.
- Exact-head audit and publication prove both tree identity and required Git
  history/merge mode before owner promotion.
- An owner promotion that changes the audited tree or violates required history
  is visible and cannot be silently called the same release proof.
- `update-harness` consumes a named release identity, preserves project-specific
  truth, and records source/provenance plus project verification.
- A fresh clone and one representative downstream upgrade reproduce the package
  without relying on the authoring checkout or chat.

## Decisions And Contracts

- `integration` remains the staging base; only Kayden promotes it to `main`.
- Exact-SHA audit and evidence publication stay separate role invocations.
- Tree equality does not substitute for a required ancestry or merge-mode check;
  both are recorded independently.
- The manifest includes only the public Workbench package, never GPT_OS private
  wiki, scheduler state, credentials, local symlinks, logs, or downstream source.
- Downstream rollout proof belongs in both this release spec and the adopting
  project's owning upgrade spec; neither repository becomes a second task tracker.

## Non-Goals

- Merging `integration` into `main` without owner action.
- Publishing GPT_OS private state or downstream project source.
- Auto-upgrading every project from one Workbench task.
- Rewriting the already-published PR #34 history.

## Dependencies And Blockers

- [S-014](../S-014-workbench-release-candidate/SPEC.md) records the completed
  v2.3 release-candidate proof and history deviation.
- [S-015](../S-015-bootstrap-adoption/SPEC.md) owns project entry paths.
- [S-011](../S-011-agent-skills-adoption/SPEC.md) owns skill availability.
- S-018/TK-002 defines the release-manifest and component schema.
- S-011/TK-016 emits the verified skill-catalog component after that schema exists.
- S-018/TK-004 alone assembles the complete manifest and verifies `update-harness`.

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Publish the bounded MIT package, v2.3 identity, and owner-only promotion path | done | none | public repository, README, LICENSE, and S-014 release evidence |
| TK-002 | Define the deterministic release-manifest schema and non-skill package inputs | ready | none | pending |
| TK-003 | Fail closed on release tree, ancestry, merge-mode, or exact-status drift | blocked | TK-002 | pending |
| TK-004 | Assemble the complete manifest and make update-harness verify it | blocked | TK-002, TK-003, S-011/TK-016 | pending |
| TK-005 | Prove the release from a fresh clone and one project-owned downstream upgrade | blocked | TK-004 | pending |

### Scoped Ticket: TK-002

**Vertical slice:** Add one zero-dependency manifest schema/generator and fixture
for version, source ref, resolved SHA, non-skill shipped files, component inputs,
checksums, license identity, and verification commands without including
machine-local or private GPT_OS material.

**Done criteria:**

- A red fixture proves the current package has no deterministic manifest seam.
- The non-skill manifest and component schema are stable across clean clones of
  the same commit and change when a shipped file or declared component changes.
- The schema has one explicit skill-catalog component slot consumed by
  S-011/TK-016; TK-002 does not rewrite or certify the skill catalog.
- Private, ignored, local-symlink, result, log, credential, and downstream paths
  are absent by construction.
- Targeted tests, the full Runbook suite, evaluator, guardrail audit, render,
  doctor, and diff check pass.

**Required proof:** Generated manifest for the candidate branch plus a clean
fresh-clone equality check; no release or protected-branch mutation.

### Scoped Ticket: TK-003

**Vertical outcome:** Add a fail-closed release-candidate verifier that proves
exact tree, source/base SHAs, required ancestry and merge mode, evidence status,
and sole promotion-PR identity before reporting ready.

**Done criteria:** Synthetic Git graphs cover normal merge, single-parent
promotion, stale head, tree mismatch, duplicate PR, missing status, and moved base;
the verifier distinguishes tree equality from ancestry; it accepts no caller-
selected repository or alternate branch contract.

**Required proof:** Red/green graph fixtures including the PR #34 history shape,
GitHub-response fixtures, full Runbook verification, evaluator, guardrail, render,
doctor, and diff check. No protected branch, PR, status, or credential mutation.

### Scoped Ticket: TK-004

**Vertical outcome:** Assemble the non-skill inputs from TK-002 and the verified
S-011/TK-016 skill component into the complete release manifest, then make
`update-harness` require that identity and record project-specific
reconciliation, provenance, tests, and remaining drift.

**Done criteria:** The skill refuses an unknown or mismatched manifest; preserves
filled project truth; updates only changed generic sections; records exact source
SHA/checksums and project verification; stops at integration and never promotes
to main or changes credentials.

**Required proof:** Focused component/manifest and update-harness fixtures, a disposable
adopted-project upgrade dry run, fresh Codex discovery, full Runbook verification,
render, doctor, and diff check. Downstream production deployment remains project-owned.

### Scoped Ticket: TK-005

**Vertical outcome:** Reproduce the package from a fresh clone and prove one
representative project-owned upgrade against the exact manifest.

**Done criteria:** Clean clone checksums match; all package self-tests pass; one
downstream project records the source manifest, diff, targeted/full tests, docs,
and remote checkpoint in its own upgrade spec; no unrelated downstream source or
private GPT_OS state enters this repository.

**Required proof:** Fresh-clone transcript, manifest equality, complete Workbench
suite, and a link to the downstream project's immutable upgrade checkpoint.
**Owner gate:** only project-specific deployment, credential, or integration-to-main
actions; the upgrade proof itself is already authorized by the portfolio campaign.

## Acceptance Criteria

- [x] The public package, license, version identity, and owner-only promotion boundary exist.
- [ ] One deterministic manifest binds every shipped release artifact and its provenance.
- [ ] Release verification fails closed on tree, exact SHA, ancestry, merge-mode,
      evidence-status, or duplicate promotion-PR drift.
- [ ] update-harness records the source manifest and project-specific verification.
- [ ] A fresh clone reproduces the package and one downstream project proves an upgrade.
- [ ] No private GPT_OS or downstream source enters the public release.

## Testing Seams

- Temporary clean repository containing representative public and excluded files.
- Manifest determinism and checksum-change fixtures.
- Synthetic Git graphs for merge, squash, stale status, and moved-head cases.
- Fresh-clone comparison against the exact published SHA.

## Verification Procedure

```bash
node tools/test-evaluate-workbench.mjs
node tools/test-skill-catalog.mjs
node tools/spec-workbench.mjs doctor
git diff --check
```

Then run the complete verification suite in `RUNBOOK.md` plus the future
manifest and release-gate targeted tests.

## Documentation Impact

- README owns public package and upgrade guidance.
- RUNBOOK owns exact release and recovery commands once the manifest exists.
- S-014 remains the v2.3 one-time release evidence.
- This spec owns repeatable delivery and downstream rollout.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-07-17 | canon harvest | Captured public delivery as a durable capability and routed the PR #34 history deviation into a repeatable release gate | Live refs, PR #34, exact integration status, tree identity, evaluator, guardrail, render, doctor, and complete Runbook checks inspected | Added S-018, updated Blueprint coverage, and corrected README delivery boundaries | TK-002 through TK-005 remain |
| 2026-07-17 | audit remediation | Made S-018 the sole release-manifest, update-harness verification, and downstream-rollout owner | S-011/TK-016 narrowed to a typed skill-catalog input; dependency graph, render, doctor, full planning verification, and diff check passed | Updated S-011, S-018, coverage matrix, and generated projections | TK-002 schema precedes S-011/TK-016; TK-004 consumes both |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- PR #34 shipped the audited tree but did not preserve integration ancestry in main.
- Downstream upgrades remain project-owned writes coordinated through this release identity.

## Supersession

- Supersedes: S-014 for future releases only; S-014 remains v2.3 evidence.
- Superseded by: none
