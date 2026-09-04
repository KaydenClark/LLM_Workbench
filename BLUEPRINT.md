# LLM Workbench - Blueprint

**Last reviewed:** 2026-09-04
**Status:** active
**Harness version:** v3.0.0 (unreleased internal candidate; v3.1.0 is the first public v3 release target)
**Source root:** this repository
**Remote:** `github.com/KaydenClark/LLM_Workbench`

## Product Map

LLM Workbench is a vendor-neutral, local-first control harness for AI-assisted
software projects. `AGENTS.md` is the always-loaded operating system; the other
surfaces reveal product and execution detail only when it is relevant.

Core promise:

> Give an agent enough authority, scope, product truth, executable work, and
> proof requirements to make safe progress without loading project history.

## Goals And Pillars

- **Safe autonomy:** explicit authority, edit scope, safety, Git, and escalation
  rules live in `AGENTS.md`.
- **Progressive disclosure:** the hot board selects one spec/ticket; detailed
  capability truth loads from its stable `SPEC.md` only on demand.
- **Single ownership:** product direction belongs here, shared definitions in
  `LEXICON.md`, execution state on the hot board, capability truth and evidence
  in specs, procedures in `RUNBOOK.md`, and behavior in source/tests.
- **Evidence over taste:** deterministic checks are the release gate; repeated
  controlled trials are required for agent-outcome claims.
- **Portable by default:** plain Markdown and zero-dependency local commands
  work with Codex, Claude Code, Gemini CLI, and ordinary command-line workflows.

## Accepted V3 Direction

[S-021](workbench/specs/S-021-portable-workbench-v3/SPEC.md) owns the portable
contract. It is intentionally an interim usability release while Foundry is
unfinished, not a Foundry replacement or a general harness redesign.

- The seven root controls remain universally discoverable. Durable support
  records move behind one lowercase `workbench/manifest.json` authority with
  declared specs, Wiki, grilling, handoff, and feedback lanes.
- LLM Workbench carries exactly the closed 12-skill setup/planning/delivery
  workflow. On a brand-new installation it supplies a required skill only when
  that skill is missing from user-scoped discovery.
- Existing installed skills are accepted by presence and remain untouched.
  Exact synchronization occurs only after an explicit skill-update request and
  creates a recoverable backup first.
- Genesis creates v3 directly; Adoption and `update-harness` migrate legacy
  layouts once and then retire dual support paths and project-local skill
  shadows.
- Procedures remain guidebook-first and task-sized. Code is reserved for
  deterministic parsing, rendering, validation, and safe bounded file
  operations rather than one monolithic lifecycle program.

Version v3.0.0 is the completed internal candidate; it is not released.
Release promotion from `integration` to `main` remains separately owned by
S-014 and resumes on the audited v3.1.0 candidate.

## Accepted V3.1 Direction

[S-022](workbench/specs/S-022-llm-workbench-v3-1-release/SPEC.md) owns the
first public v3 release. `KaydenClark/LLM_Workbench` is the sole Workbench
source and release repository; the owner's deployment and its Foundry
extension adopt released versions and are read-only evidence while v3.1 is
built ([ADR-0026](workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md)).
Four linked capabilities carry the behavior:

- [S-023](workbench/specs/S-023-manifest-schema-2-and-managed-runtime/SPEC.md):
  manifest schema 2 with six lowercase lanes (`docs`, `specs`, `wiki`,
  `sessions`, `feedback`, `tools`) and seven declared collections; a lossless
  schema 1 migration; Workbench-managed runtime tools in `workbench/tools/`
  with receipts while an application's root `tools/` stays application-owned;
  untracked-by-default session records with tracked checkpoints
  ([ADR-0017](workbench/docs/adr/0017-workbench-support-directory-has-six-lanes.md),
  [ADR-0028](workbench/docs/adr/0028-live-session-records-stay-untracked-and-checkpoints-are-durable.md),
  [ADR-0031](workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md),
  [ADR-0032](workbench/docs/adr/0032-manifest-schema-2-declares-lanes-and-collections.md)).
- [S-024](workbench/specs/S-024-governance-core-adrs-and-diagnostics/SPEC.md):
  the Governance Core (claim-level planes, instruction authority separate from
  state resolution, the no-governance-tax rule), registered diagnostics whose
  blocking effect only `doctor`, `next`, and `claim` enforce, and a
  first-class ADR collection with a derived register
  ([ADR-0025](workbench/docs/adr/0025-planes-classify-claims-not-whole-artifacts.md),
  [ADR-0027](workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md),
  [ADR-0029](workbench/docs/adr/0029-diagnostics-carry-registered-blocking-semantics.md)).
- [S-025](workbench/specs/S-025-portable-wiki-and-design-concepts/SPEC.md):
  the portable wiki contract (explicit profile, `knowledge_role` separate from
  `provenance`, handling-only `sensitivity`, repository-relative sources,
  optional Obsidian, no copied task state) and the mandatory owner-directed
  `wiki/design-concepts/` collection
  ([ADR-0018](workbench/docs/adr/0018-the-wiki-is-the-knowledge-base.md),
  [ADR-0030](workbench/docs/adr/0030-every-workbench-declares-a-design-concepts-collection.md)).
- [S-026](workbench/specs/S-026-workflow-composition-and-cold-resume/SPEC.md):
  the twelve skills and feedback discovery routed through the manifest,
  privacy-checked checkpoint promotion, and a mechanical planning-to-resume
  round trip with Foundry absent.

Invariants the release must preserve: exactly seven root controls, with the
Workbench Contract defined as the claims those controls and the assigned spec
own ([ADR-0013](workbench/docs/adr/0013-seven-file-workbench-contract.md),
[ADR-0033](workbench/docs/adr/0033-workbench-contract-is-a-claim-set.md));
binding rules live in current controls while ADRs own rationale
([ADR-0002](workbench/docs/adr/0002-binding-rules-stay-in-current-controls.md));
a check blocks only the change it evaluates
([ADR-0020](workbench/docs/adr/0020-a-check-blocks-only-the-change-it-evaluates.md));
tools check structure and agents carry judgment
([ADR-0023](workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md)).
Decision records live in `workbench/docs/adr/`; an ADR whose rule a later
ticket canonicalizes stays `proposed` until that ticket lands.

## Architecture And Invariants

| Layer | Owner | Invariant |
|---|---|---|
| Agent operating system | `AGENTS.md` | Always loaded; owns how agents work. |
| Product map | `BLUEPRINT.md` | Compact direction, architecture, invariants, and spec catalog; no live task narration. |
| Shared language | `LEXICON.md` | On demand; owns accepted project-wide definitions without requirements or live state. |
| Execution projection | `TASKBOARD.md` | Active specs only: current slice, owner, blocker, event, next gate. |
| Capability record | Manifest-declared `workbench/specs/S-###-slug/SPEC.md` | Stable path; owns requirements, decisions, acceptance, verification, evidence, and completion. |
| Procedures | `RUNBOOK.md` | Commands, troubleshooting, recovery, and operational detail. |
| Decision records | `workbench/docs/adr/` | Rationale, alternatives, consequences, supersession; binding only where `canonicalized_in` points. |
| Durable knowledge | `workbench/wiki/` | Router, schema, guidebooks, design-concept articles, archive; never copied task state. |
| Implementation truth | source and tests | State resolution in `AGENTS.md`: newer Canon is an implementation gap, newer verified Actuality is documentation drift. |

Generated catalog and dashboard regions are deterministic projections of spec
metadata. Human-authored prose stays outside those regions. Completed specs
remain at their stable path, disappear from the hot board immediately, and may
be changed only through a later spec linked by supersession.

## Non-Goals

- A hosted tracker, database, paid service, broad MCP server, or general project
  management app.
- Personal task management or replacement of Command Information Center.
- A permanent Done lane or proof archive in startup context.
- Retrofitting every historical task into a manufactured spec.
- Claiming better agent outcomes from smaller context alone.
- Importing Foundry FUIDs, Job Orders, flights, Claims, runtime orchestration,
  CIC release controls, or other workspace-only machinery into the portable
  Workbench.

## Spec Catalog

<!-- spec-catalog:start -->
| Spec | Description | Status |
|---|---|---|
| [S-001 - Spec-Centered Progressive Disclosure](workbench/specs/S-001-progressive-disclosure/SPEC.md) | Make AGENTS the operating system while specs hold durable capability truth and the hot board projects active work only. | complete |
| [S-002 - Held-Out Second-Domain Evaluation](workbench/specs/S-002-heldout-evaluation/SPEC.md) | Add a condition-blind held-out task before spending on repeated c0/c1/c2/c3 outcome trials. | complete |
| [S-003 - Prospective Dungeon Friends Pilot](workbench/specs/S-003-dungeon-friends-pilot/SPEC.md) | Evaluate v2.3 progressive disclosure in Dungeon Friends only after separate owner authorization. | planned |
| [S-004 - Safe Direct Claim](workbench/specs/S-004-safe-direct-claim/SPEC.md) | Prevent direct claim calls from bypassing a ticket's declared blockers. | complete |
| [S-005 - Bootstrap Documentation Alignment](workbench/specs/S-005-bootstrap-doc-alignment/SPEC.md) | Remove stale four-control-doc and Taskboard-proof wording from bootstrap and adoption guidance. | complete |
| [S-006 - Automated Harness Feedback Gate](workbench/specs/S-006-feedback-automation/SPEC.md) | Build and operate a one-candidate Terra/Sol feedback loop with independent evidence gates. | complete |
| [S-007 - Safe Feedback Helper Import](workbench/specs/S-007-feedback-helper-import/SPEC.md) | Allow the feedback helper to be imported when Node has no script path. | complete |
| [S-008 - Windows Verification Portability](workbench/specs/S-008-windows-verification-portability/SPEC.md) | Keep context output, spec-doctor, and eval-runner verification stable across Windows and POSIX hosts. | complete |
| [S-009 - Git-Write Constrained Adoption](workbench/specs/S-009-git-write-constrained-adoption/SPEC.md) | Keep adoption safe and usable when a host cannot write Git metadata. | complete |
| [S-010 - Canonical Evaluator Entry Detection](workbench/specs/S-010-canonical-evaluator-entry/SPEC.md) | Ensure the evaluator runs when a checkout is invoked through a canonicalized path. | complete |
| [S-011 - Agent Skills Adoption](workbench/specs/S-011-agent-skills-adoption/SPEC.md) | Curated, Workbench-vocabulary agent skills (grill, to-spec, to-tickets, implement, review) shipped as part of the harness. | superseded |
| [S-012 - Reproducible Adoption Provenance](workbench/specs/S-012-adoption-provenance-proof/SPEC.md) | Preserve enough adoption provenance for an independent fresh-clone verification. | complete |
| [S-013 - Standardized Automation Run Outcomes](workbench/specs/S-013-automation-run-outcomes/SPEC.md) | Give scheduled Workbench runs a fail-closed JSON outcome and verified-idle streak contract. | complete |
| [S-014 - Workbench Release Candidate](workbench/specs/S-014-workbench-release-candidate/SPEC.md) | Prepare one exact-SHA, independently audited Workbench integration-to-main release candidate for owner approval through CIC. | blocked |
| [S-015 - Portable v3 Release Audit Recovery](workbench/specs/S-015-portable-v3-release-audit-recovery/SPEC.md) | Make generated v3 controls and Genesis validation enforce one operable manifest-declared spec lane before release. | complete |
| [S-020 - Spec-Native Team Coordination](workbench/specs/S-020-spec-native-team-coordination/SPEC.md) | Modernize the optional small-team templates so parallel roles coordinate through one owning spec and one durable writer. | complete |
| [S-021 - Portable Workbench v3](workbench/specs/S-021-portable-workbench-v3/SPEC.md) | Make Genesis, Adoption, and upgrades produce a portable `workbench/` support root and safely install a self-contained 12-skill core on brand-new hosts. | complete |
| [S-022 - LLM Workbench v3.1 Release](workbench/specs/S-022-llm-workbench-v3-1-release/SPEC.md) | Release v3.1.0 as the first public v3 Workbench from one independently audited exact candidate proven by a cross-provider cold resume with Foundry absent. | active |
| [S-023 - Manifest Schema 2 And Managed Support Runtime](workbench/specs/S-023-manifest-schema-2-and-managed-runtime/SPEC.md) | Ship manifest schema 2 with six lanes, declared collections, a lossless schema 1 migration, Workbench-managed runtime tools, and untracked-by-default session records. | active |
| [S-024 - Governance Core, ADRs, And Scoped Diagnostics](workbench/specs/S-024-governance-core-adrs-and-diagnostics/SPEC.md) | Give every Workbench claim-level Governance Planes, separated instruction authority and state resolution, a registered diagnostic model enforced by doctor/next/claim, and a first-class ADR collection. | active |
| [S-025 - Portable Wiki And Design Concepts](workbench/specs/S-025-portable-wiki-and-design-concepts/SPEC.md) | Ship the portable wiki contract with an explicit profile, knowledge-role and provenance metadata, handling-only sensitivity, relative source paths, optional Obsidian, and a mandatory owner-directed design-concepts collection. | active |
| [S-026 - Workflow Composition, Feedback Lane, And Cold Resume](workbench/specs/S-026-workflow-composition-and-cold-resume/SPEC.md) | Route the twelve core skills and feedback discovery through the schema 2 manifest, promote session records through privacy-checked checkpoints, and prove the composed planning-to-resume workflow mechanically. | active |
<!-- spec-catalog:end -->

## Cross-Cutting Health

- all Workbench self-tests and the template evaluator pass;
- `node tools/spec-workbench.mjs doctor` reports no lifecycle, link, or render
  drift;
- root docs contain no template placeholders and generic templates contain no
  Workbench-specific state;
- harness changes record baseline, after-state, limitations, and documentation
  impact without weakening audit criteria;
- published version changes occur only after behavior is proven.
