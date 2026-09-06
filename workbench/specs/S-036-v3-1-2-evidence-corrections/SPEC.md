# S-036 - Workbench v3.1.2 Evidence Corrections

**Spec ID:** S-036
**Status:** active
**Priority:** 0
**Owner:** codex-gpt-5
**Stance:** Builder
**Updated:** 2026-09-06
**Catalog description:** Correct the unpublished v3.1.2 candidate where permission, control-fidelity, and source-identity checks overstate what they prove, then rehearse the already-v3 upgrade path and return an exact reviewed candidate for GPT_OS deployment.
**Blockers:** none
**Latest event:** The corrected candidate passed the complete release gate and retained the 78/100 guardrail score with no new outcome claim.
**Next gate:** Push the exact candidate and obtain fresh independent approval before opening and merging its PR to `integration`.

## Outcome

The unpublished v3.1.2 candidate reports only permission, fidelity, and source
identity claims its evidence supports; its already-v3 maintenance procedure is
exercised against a disposable v3.1.1 room; and the corrected exact commit is
independently reviewed and landed on `integration` for GPT_OS to deploy.

## Why It Matters

The first v3.1.2 candidate at `b3633e5` substantially repaired failures found
by the first Harness Feedback Review cycle, but a later review reproduced two
false-clear or false-drift cases and identified an acknowledged provenance gap.
A green self-test is not trustworthy when the test encodes the same mistaken
permission model as the implementation, a changed safety rule is summarized as
an expected placeholder fill, or an installed component can claim an unknown
source commit. The correction must land upstream before GPT_OS deploys the
candidate and Audit_Workbench evaluates the next downstream cycle.

## Current Verified State

Verified on 2026-09-05 after refreshing `origin`, at
`b3633e5d362324de40d44ffbff75114b7517a43e`:

- GitHub carries the v3.1.2 candidate on `origin/integration`; no release is
  published and no newer Claude correction branch exists.
- Claude Code 2.1.212 is installed at `/opt/homebrew/bin/claude`. Anthropic's
  current permission reference says `Edit` rules apply to every built-in tool
  that edits files and evaluates rules `deny -> ask -> allow`. The shipped
  template, diagnostic, Runbooks, Adoption protocol, and tests instead require
  paired path-scoped `Edit(...)` and `Write(...)` rules.
- `classifyLines()` reports
  `Forbidden without explicit approval: [SECRETS_OR_PRIVATE_PATHS]` changed to
  `Allowed without explicit approval: secrets/` as `filled: 1, changed: 0`;
  the Markdown summary therefore hides the reversal.
- `templates/AGENTS.md` has no ADR ownership row. The S-034 test adds that row
  only to its fixture, so the shipping template does not protect the original
  `canonicalized_in` qualifier.
- `tools/workbench-tools.mjs sourceIdentity()` substitutes `unknown` for a
  missing repository or commit; runtime-tool receipts and skill-marker tests
  accept it. `workbench-layout.mjs` accepts any truthy explicit source commit.
- `skills/update-harness/SKILL.md` distinguishes a one-time v2 layout migration
  from an already-v3 room, but the v3.1.1 -> v3.1.2 path has no disposable
  preservation rehearsal covering controls, product code, active work,
  completed evidence, Wiki content, current runtime tools, and recovery.
- Pre-change `node tools/audit-guardrails.mjs --path .` is 78/100. The four
  missing outcome-evidence recommendations are unchanged from S-035 and are not
  evidence that this correction improves agent outcomes.

## Desired Behavior

1. A manifest-declared authorship lane is considered mechanically writable when
   a supported covering `Edit` rule applies. Bare tool rules, `deny`/`ask`
   precedence, path forms documented for Claude Code 2.1.212, and unsupported
   restrictive patterns are handled without a false clear. Path-scoped
   `Write(...)` is neither required nor described as a separate creation grant.
2. A placeholder line is `filled` only when its fixed wording remains intact,
   subject to whitespace normalization. A change to fixed wording is `changed`
   in JSON and Markdown. The shipped `templates/AGENTS.md` includes the ADR
   ownership row and the production report exposes a removed
   `canonicalized_in` qualifier.
3. Every source path used by initialization, adoption, upgrade, managed runtime
   tools, and skill markers either records a concrete 40-character Git commit
   from a verified source checkout or fails before mutation. Explicit source
   values are validated and cannot override contradictory live source identity.
   Historical adoption provenance is not rewritten to impersonate the latest
   installed-component generation.
4. A disposable already-v3 room starting at v3.1.1 demonstrates that the
   documented maintenance path preserves project-specific controls, product
   code, active specs, completed evidence, and Wiki content while updating only
   intended Workbench-managed components with a recoverable receipt/backup.
5. Current ownership prose says LLM_Workbench produces the canonical harness,
   GPT_OS orchestrates authorized deployment, Audit_Workbench audits HFRs and
   produces upstream reports, and each project owns its local product and
   filled controls. Historical evidence keeps its historical names.

## Decisions And Contracts

- **Correct the candidate, not its history.** S-030, S-032, S-034, and S-035
  remain completed records. This linked spec owns the later correction.
- **No new version label.** v3.1.2 is unpublished, so this work corrects that
  candidate before publication instead of manufacturing v3.1.3.
- **Conservative visibility.** A permission restriction the bounded matcher
  cannot interpret is uncertainty, not proof that a lane is clear.
- **Provenance fields have distinct jobs.** A room's historical adoption source
  remains historical; managed tools and skills name their current installed
  generation through their receipts and markers.
- **Ownership stays local.** This repository prepares a candidate and the
  upgrade/recheck handoff. It does not deploy to downstream projects or claim
  that the feedback loop is repeatable.

## Non-Goals

- Publishing v3.1.2, merging `integration` into `main`, or tagging a release.
- Editing GPT_OS, Audit_Workbench, or any downstream project.
- Synchronizing the owner's real installed skills without a separate explicit
  update request.
- Implementing the full Claude Code permission grammar or banning all hard
  links without a reproduced boundary failure.
- Claiming downstream repair or better agent outcomes from upstream tests.

## Dependencies And Blockers

- S-035 is the completed candidate this spec corrects.
- No owner decision is open. The referenced conversation explicitly assigns
  the bounded correction and preserves publication and downstream deployment as
  later gates.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Align the shipped Claude permission template, diagnostic, protocols, and tests with one supported `Edit`-rule model that reports restrictive uncertainty | done | none | Red: node tools/test-diagnostics.mjs exposed Edit-only lanes as withheld, and node tools/test-workbench-layout.mjs exposed paired Write rules in the shipped template. Green: test-diagnostics 10/10, test-workbench-layout 31/31, test-workbench-dogfood pass, evaluate-workbench templates 106.6/113, git diff --check pass. Claude Code 2.1.212 native disposable write did not reach a permission decision because the workspace was untrusted and OAuth was expired; no trust or credential state was changed. |
| TK-002 | Make placeholder fills preserve fixed wording and prove the shipped ADR ownership row detects a removed qualifier in JSON and Markdown | done | TK-001 | Red: test-control-fidelity failed because the shipping AGENTS template lacked its ADR owner row, and the direct Forbidden-to-Allowed placeholder case returned filled 1 / changed 0. Green: test-control-fidelity 15/15, including JSON and Markdown production CLI coverage for the removed canonicalized_in qualifier; test-workbench-layout 31/31; test-workbench-dogfood pass after render; template evaluation 106.6/113 unchanged; git diff --check pass. |
| TK-003 | Fail closed on unverified source identity across layout, adoption, runtime-tool receipts, and skill markers, then rehearse v3.1.1 -> v3.1.2 maintenance preservation | done | TK-002 | Red: sourceIdentity accepted a non-Git fixture and layout initialization accepted contradictory or relocated caller-supplied source strings. Green: test-workbench-tools 14/14, test-workbench-layout 31/31, core-skill-installer 7/7, workbench-adoption pass, workbench-upgrade 5/5, workbench-round-trip pass, cross-provider-fixture pass, git diff --check pass. The v3.1.1 rehearsal updated and rolled back one managed runtime tool while byte-identical project controls, product code, active spec, completed evidence, and Wiki content survived; the historical manifest source remained v3.1.1 and the component receipt advanced to a concrete current 40-hex commit. |
| TK-004 | Reconcile current ownership prose, run the full release gate, independently review the immutable candidate, and land it on `integration` | in-progress | TK-003 | Review of `72c5064` reproduced four blockers; red/green correction `b2f802b` now awaits the full gate and fresh exact-SHA review. |

### TK-001 - Permission truth at the public seam

**Stance:** Builder

Red first against `permissionScopeDrift()` and the shipped settings fixture: an
Edit-only covering grant passes; bare `Edit` passes; a documented project-root
path form passes; a nested deny or ask and an unsupported restrictive pattern
remain visible; the tools lane stays prompted. Then align the template,
Genesis/Adoption wording, root and template Runbooks, and existing tests.

### TK-002 - Fixed wording survives customization

**Stance:** Builder

Red first at `classifyLines()` and the production CLI with the reproduced
Forbidden -> Allowed reversal. A normal placeholder fill remains `filled`.
Add the ADR ownership row to the shipping template, remove the fixture-only
augmentation, remove `canonicalized_in`, and prove both JSON and Markdown call
it `changed`.

### TK-003 - Concrete source and already-v3 recovery

**Stance:** Builder

Red first on a source checkout whose Git identity is absent or whose supplied
commit contradicts its live HEAD: initialization, adoption, runtime-tool
installation/update, and skill installation must fail before mutation and no
receipt or marker may say `unknown`. Exercise the documented already-v3 route
in a disposable v3.1.1 room and compare protected project bytes before/after;
the current tool receipt and its backup are the recovery evidence.

### TK-004 - Candidate accountability and delivery

**Stance:** Builder, with the review performed in a separate context against
the immutable candidate SHA.

Update only current ownership prose, record the guardrail after-score and
limitations, run the complete suite and one-minute demos, push the exact
candidate, obtain an independent review, repair any finding through a fresh
red/green checkpoint, and merge the approved PR to `integration`. Stop before
`main`, publication, skill synchronization, or downstream deployment.

## Acceptance Criteria

- [ ] Permission behavior and prose agree with Claude Code 2.1.212 and the current Anthropic reference; valid Edit-only coverage passes and restrictions or unsupported restrictive shapes do not false-clear.
- [ ] Placeholder fixed-wording changes and the shipped ADR qualifier regression are substantive in structured and Markdown fidelity output.
- [ ] No supported writer records `commit: "unknown"`; invalid or contradictory supplied source identity fails before mutation.
- [ ] A disposable v3.1.1 room proves intended already-v3 maintenance preserves project-owned controls, code, work, evidence, and Wiki content with recoverable managed-component updates.
- [ ] Current ownership prose names LLM_Workbench, GPT_OS, Audit_Workbench, and project responsibilities without rewriting historical evidence.
- [ ] The unchanged full suite, guardrail after-score, exact-SHA independent review, PR, and remote `integration` containment are recorded; `main` remains untouched.

## Testing Seams

- `permissionScopeDrift(project, lanes)` and Genesis validation fixtures.
- `classifyLines(template, room)` plus `control-fidelity.mjs report` JSON and
  Markdown against the shipped templates.
- `sourceIdentity()`, `workbench-layout.mjs init|migrate`, adoption, managed
  runtime-tool install/update, and managed skill marker writers.
- A disposable Git-backed v3.1.1 room whose project-owned byte inventory is
  compared across the documented maintenance path.
- Remote immutable-SHA containment in the declared integration branch.

## Verification Procedure

Focused red/green commands:

```bash
node tools/test-diagnostics.mjs
node tools/test-workbench-layout.mjs
node tools/test-control-fidelity.mjs
node tools/test-workbench-tools.mjs
node tools/test-core-skill-installer.mjs
node tools/test-workbench-adoption.mjs
node tools/test-workbench-upgrade.mjs
```

Then every command in `AGENTS.md` Full suite, the guardrail after-score,
`render`, `doctor`, `git diff --check`, exact remote SHA comparison, and the
separate-context integration review.

## Documentation Impact

- `templates/.claude/settings.json`, its README, Genesis and Adoption protocol
  wording, and root/template Runbooks.
- `templates/AGENTS.md`, the control-fidelity behavior documentation, and its
  production regression test.
- Source/provenance and already-v3 maintenance sections in the Runbook,
  Adoption/Genesis templates, and `update-harness` skill.
- Current Blueprint ownership and v3.1.2 direction; historical feedback,
  completed specs, and ADR provenance remain unchanged.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-05 | spec | Corrective scope reconciled from the referenced Review Fable Updates conversation and verified against refreshed `origin/integration` at `b3633e5`; no published release or newer Claude correction branch exists | `git fetch --prune origin`; `gh release list`; `gh pr list`; `claude --version` = 2.1.212; Anthropic permission reference read; direct `classifyLines` reproduction = filled 1 / changed 0; source callers and tests traced | S-036 created as the linked owner; completed S-030/S-032/S-034/S-035 evidence preserved | TK-001 through TK-004 |
| 2026-09-05 | spec | Guardrail baseline captured before harness edits | `node tools/audit-guardrails.mjs --path .` = 78/100; four outcome-evidence recommendations unchanged | No benchmark row yet; record after-score at closeout | TK-001 through TK-004 |
| 2026-09-06 | TK-001 | Ticket closed | Red: node tools/test-diagnostics.mjs exposed Edit-only lanes as withheld, and node tools/test-workbench-layout.mjs exposed paired Write rules in the shipped template. Green: test-diagnostics 10/10, test-workbench-layout 31/31, test-workbench-dogfood pass, evaluate-workbench templates 106.6/113, git diff --check pass. Claude Code 2.1.212 native disposable write did not reach a permission decision because the workspace was untrusted and OAuth was expired; no trust or credential state was changed. | Updated the root/template Runbooks, Claude settings README, Genesis, Adoption, and shipped Claude settings to one Edit-rule model; documented deny/ask precedence and restrictive-pattern uncertainty. | TK-002 fixed-wording fidelity and shipped ADR owner-row correction. |
| 2026-09-06 | TK-002 | Ticket closed | Red: test-control-fidelity failed because the shipping AGENTS template lacked its ADR owner row, and the direct Forbidden-to-Allowed placeholder case returned filled 1 / changed 0. Green: test-control-fidelity 15/15, including JSON and Markdown production CLI coverage for the removed canonicalized_in qualifier; test-workbench-layout 31/31; test-workbench-dogfood pass after render; template evaluation 106.6/113 unchanged; git diff --check pass. | Added the ADR rationale owner row to templates/AGENTS.md and defined filled in RUNBOOK.md and LEXICON.md as preserving fixed wording through placeholder substitution. | TK-003 concrete source identity and the disposable v3.1.1-to-v3.1.2 preservation rehearsal. |
| 2026-09-06 | TK-003 | Ticket closed | Red: sourceIdentity accepted a non-Git fixture and layout initialization accepted contradictory or relocated caller-supplied source strings. Green: test-workbench-tools 14/14, test-workbench-layout 31/31, core-skill-installer 7/7, workbench-adoption pass, workbench-upgrade 5/5, workbench-round-trip pass, cross-provider-fixture pass, git diff --check pass. The v3.1.1 rehearsal updated and rolled back one managed runtime tool while byte-identical project controls, product code, active spec, completed evidence, and Wiki content survived; the historical manifest source remained v3.1.1 and the component receipt advanced to a concrete current 40-hex commit. | Updated RUNBOOK.md, templates/GENESIS.md, templates/RUNBOOK.md, skills/update-harness/SKILL.md, and skills/README.md to require a clean verified source checkout, treat source flags as assertions, separate historical room provenance from component generations, and define the already-v3 preservation/recovery proof. | TK-004 current ownership prose, guardrail/full-suite proof, exact-SHA independent review, and integration landing. |
| 2026-09-06 | TK-004 | First immutable candidate review requested changes | Separate-context review of `72c5064da343c93072914cb20a30a032699fb50b` reproduced four P1 gaps: absolute/home-relative Claude restrictions false-cleared, a narrow tools restriction masked a broad allow, dirty manifest/template bytes could be paired with the prior commit, and explicit upgrade could mutate skills before dirty runtime-source validation failed. | No ownership prose change; the review challenged implementation and tests at the required integration gate. | Correct all four gaps, rerun the complete gate, and submit a new immutable SHA for fresh review. |
| 2026-09-06 | TK-004 | Review corrections green at `b2f802b` | Red regressions reproduced all four failures. Green: diagnostics 10/10; workbench-tools 15/15; workbench-layout 32/32; workbench-upgrade 6/6; control-fidelity 15/15; core-skill-installer 7/7; workbench-adoption pass; git diff check passed before commit. Source identity now includes the manifest, checks every initialization template, requires the declared release root to be the Git top level, and reports an unverifiable Git status separately. Upgrade validates skills, runtime tools, and manifest together before any skill or project mutation. | Docs checked; existing clean-source and permission-precedence prose remains accurate, while this owning spec records the narrower review correction. | Full release gate, exact remote SHA, fresh independent review, PR merge, and `integration` containment. |
| 2026-09-06 | TK-004 | Corrected candidate release gate passed | Every command in the unchanged `AGENTS.md` full suite passed, including the new layout 32/32, tools 15/15, diagnostics 10/10, and upgrade 6/6 regressions; template evaluation remained 106.6/113; `render`, `doctor`, and `git diff --check` passed. Guardrail remained 78/100 with the same four outcome-evidence recommendations. | Taskboard regenerated from the updated owning spec; benchmark result already records the unchanged score and limitation. | Push the exact candidate, obtain fresh separate-context approval, merge its PR to `integration`, and prove remote containment. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Native Claude Code permission behavior will be exercised if the installed
  authenticated runtime can run a bounded disposable-file test. Static fixture
  proof alone will be labeled as such if that runtime gate is unavailable.
- Full downstream verification belongs to the next GPT_OS deployment and
  Audit_Workbench HFR cycle, not to this spec.

## Supersession

- Supersedes: none
- Superseded by: none
