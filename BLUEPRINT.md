# LLM Workbench - Blueprint

**Last reviewed:** 2026-09-05
**Status:** active
**Harness version:** v3.1.4 (v3.1.2 shipped to `main`; v3.1.3 and v3.1.4 publication pending)
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
- **Traverse, don't search:** a Context Map connects project knowledge through
  existing owners, so agents follow known routes instead of rediscovering the
  project. [Lexicon Task Routing](LEXICON.md#task-routing) is its entry surface.
- **Single ownership:** product direction belongs here, shared definitions in
  `LEXICON.md`, execution state on the hot board, capability truth and evidence
  in specs, procedures in `RUNBOOK.md`, and behavior in source/tests.
- **Evidence over taste:** deterministic checks are the release gate; repeated
  controlled trials are required for agent-outcome claims.
- **Portable by default:** plain Markdown and zero-dependency local commands
  work with Codex, Claude Code, Gemini CLI, and ordinary command-line workflows.

## Core Navigation Contract

Every Workbench supplies a traversable context structure as a core feature.
The Lexicon connects shared meanings and routes to the controls, assigned
specs, Wiki router, and ADR register; those owners link onward to relevant
source, tests, evidence, and enduring context. New durable context must be
reachable from its relevant entry route and retain links to its sources.
Routes preserve scope and single ownership. The agent behavior and bounded
search fallback live in [AGENTS.md](AGENTS.md#traverse-dont-search).

The Context Map is expressed through ordinary portable links. A visual graph,
retrieval index, or resume view may project those relationships but cannot
become a second source of truth. This contract does not depend on Foundry,
Obsidian, a recall service, or an exhaustive index of generated files. The
accepted principle is distinct from proof of complete graph coverage or
automatic traversal; those capabilities are not claimed by this documentation
change. [ADR-0042](workbench/docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md)
records the ownership correction and alternatives.

## Accepted Notepad Foundation Direction

Meaningful objective work needs usable continuity across interruptions without
owner reconstruction. New live notepads use JSON, combining a compact current
view and an ordered work record; shared schema and tooling will support safe
updates and bounded retrieval. Live notes remain excluded from project Git; explicitly configured private
transport is accepted separately below. Important claims are reconciled into
existing durable owners. They do not become Canon
by being recorded. Ordinary operation needs no new coordination framework.
The preservation target is conversation interruption through token exhaustion
or Stop: save important context while work proceeds. Computer-crash, device-loss,
and cross-machine recovery are outside this guarantee. After reconciliation,
resolved material may be trimmed from a retained note or the fully reconciled
record deleted; retaining unfinished context remains mandatory.

[S-046](workbench/specs/S-046-json-notepad-foundation/SPEC.md) owns the bounded
foundation and thin workflow integrations. Its shared schema, managed runtime
`workbench/tools/notepads.mjs`, and `notepad` skill are implemented in v3.1.4;
the additive `sessions/notepads/` layout now keeps local type folders beside
tracked schema/examples and preserves legacy paths. Broader
backup/transport guarantees and workflow redesign remain outside this scope.
[S-047](workbench/specs/S-047-visible-workbench-identifiers/SPEC.md) owns visible,
type-and-Workbench scoped base-62 identifiers with compatible migration;
[S-048](workbench/specs/S-048-checkpoint-retirement/SPEC.md) owns checkpoint
rationale, preservation, and retirement. Neither widens the first foundation
slice into a full historical migration. Current numeric IDs and legacy
checkpoints remain until their compatible replacements are verified.

## Accepted V3 Direction

[S-021](workbench/specs/S-021-portable-workbench-v3/SPEC.md) owns the portable
contract. Its shipped capabilities remain the baseline for v3.1.1 and the v3.1.2 patch. Workbench development
stands on its own; it has no dependency on completing Foundry.

- The seven root controls remain universally discoverable. Durable support
  records move behind one lowercase `workbench/manifest.json` authority with
  declared specs, Wiki, grilling, handoff, and feedback lanes.
- LLM Workbench carries sixteen setup/planning/delivery workflow skills plus
  four portable stance skills, under S-027 and S-049. On a brand-new installation it supplies a required skill only when
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

v3.0.0 and v3.1.0 are preserved unreleased candidates. S-027 continued the
v3.1 baseline as v3.1.1, and S-035 stamps the v3.1.2 patch, which reached
`main`. S-049 opens v3.1.3 for the seventeen-skill core bundle, because a
bundle change is a release-surface change and v3.1.2 is frozen at its own
sixteen-skill policy. S-046 opens v3.1.4 on the same rule: the shared JSON
notepad runtime adds a managed tool and grows the bundle to eighteen, and
v3.1.3 is frozen at seventeen. A label freezes when it is stamped, not when it
is published - v3.1.0 was never released and was still frozen rather than
redefined. A version label is not publication; the owner alone
promotes integration to main, after the applicable candidate review.

## Accepted V3.1 Direction

[S-022](workbench/specs/S-022-llm-workbench-v3-1-release/SPEC.md) records the
original v3.1 release umbrella, now paused behind S-027. `KaydenClark/LLM_Workbench` is the sole Workbench
source and release repository. GPT_OS orchestrates authorized portfolio
deployment, Audit_Workbench audits downstream Harness Feedback Reviews, and
projects remain read-only evidence while a candidate is built
([ADR-0026](workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md)).
Four linked capabilities carry the behavior:

- [S-023](workbench/specs/S-023-manifest-schema-2-and-managed-runtime/SPEC.md):
  manifest schema 2 with six lowercase lanes (`docs`, `specs`, `wiki`,
  `sessions`, `feedback`, `tools`) and nine declared collections; a lossless
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

## Accepted V3.1.1 Direction

[S-027](workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md) owns the
locked Q1-Q16 continuation. The seven-control Contract remains; ordinary entry
is AGENTS -> RUNBOOK -> LEXICON, then assigned work and task-relevant owners.
Stances are behavior skills, assigned by SPEC/TASK, without authority transfer,
agent spawning or handoff ceremony. Autonomy stays within assigned work.
Every required step must have immediate delivery value (ADR-0034).

Delivery order: route and four stances -> fresh, chat-only Round One setup check
-> feedback-report workflow and evidence-backed report in the manifest feedback
lane -> fresh continuation. Reporting does not repair its target. Separate-context
review is required at integration, where the candidate and consequential claims
are challenged. It is not a separate independent gate per ticket.

Use real contrasting owner-selected Workbenches for later evidence: useful
delivery, named verification, and truthful fresh-session continuation. Example
projects are not assignments. The then-proposed Master Workbench, now named
Audit_Workbench, was outside that first implementation pending concrete
registry, observation-audit, or visualization evidence. Foundry development,
orchestration, CIC redesign, connectors,
and a dedicated feedback Workbench are outside this first implementation.

## Accepted V3.1.2 Direction

v3.1.2 is the patch that answers the v3.1.1 upstream fix list compiled by
Audit_Workbench from the Cashflow Calculator, Command Information Center, and
OpenBrain reviews, together with this repository's own v3.1.1 acceptance
report. S-028 landed the first accepted subset (strict feedback rows, truthful
migration output, manifest-aware guardrails, feedback harvest as a completion
condition). Six linked capabilities carry the rest, and one umbrella stamps the
version last:

| Participant | Owns | Does not own |
|---|---|---|
| LLM_Workbench | Canonical templates, portable tools and skills, upgrade procedure, verified version candidates | Portfolio target selection or downstream deployment |
| GPT_OS | Authorized target selection, deployment, rollout tracking, and recovery | Canonical harness source or a project's product decisions |
| Audit_Workbench | HFR audit, cross-project evidence, and upstream summary reports | Implementing harness repairs or deploying them |
| Each project | Its product, filled controls, local work/evidence, and truthful HFR | Upstream template policy or portfolio orchestration |

- [S-029](workbench/specs/S-029-declared-integration-branch/SPEC.md): the
  integration branch as a manifest-declared fact that doctor and the Genesis
  gate check; Genesis, Adoption, and upgrade finish as a commit on a prefixed
  branch; a checkout is told when its selected spec is already complete on
  integration.
- [S-030](workbench/specs/S-030-permission-scope-matches-lanes/SPEC.md), as
  corrected by S-036: the template permission file grants `Edit` on the
  Workbench authorship lanes, keeps the tools lane prompted, and doctor reports
  a lane that is withheld or cannot be cleared through the bounded matcher.
- [S-031](workbench/specs/S-031-installed-skill-generation/SPEC.md): managed
  skill markers record release and commit; doctor names stale or unknown
  installed skills; a review claim about a skill names the copy it read.
- [S-032](workbench/specs/S-032-upgrade-route-and-source-provenance/SPEC.md):
  one working upgrade route for already-adopted v2-root rooms that records
  lifecycle `upgrade` without skill replacement; the layout tool never writes
  `unrecorded` as a source commit.
- [S-033](workbench/specs/S-033-silent-gap-diagnostics/SPEC.md): doctor covers
  an unrouted room brain and stale wiki stamps; checkpoint promotion reads only
  inside the repository.
- [S-034](workbench/specs/S-034-control-fidelity-report/SPEC.md): a report of
  which template-derived control lines a room changed, dropped, or added.
- [S-035](workbench/specs/S-035-workbench-v3-1-2-candidate/SPEC.md), corrected
  by [S-036](workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md): the
  v3.1.2 stamp after every capability above is complete, the guardrail
  re-measurement, the disposition of all twelve upstream items, truthful
  permission/fidelity/source evidence, an already-v3 preservation rehearsal,
  and the reviewed candidate on `integration`.

Invariants these must preserve: findings that only inform stay `attention` or
`none`-effect (ADR-0020); presence-only setup and explicit-only skill
replacement are unchanged; this repository prepares the exact upgrade handoff
but does not edit a downstream room; GPT_OS owns authorized deployment; a
version label is not publication.

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
| [S-022 - LLM Workbench v3.1 Release](workbench/specs/S-022-llm-workbench-v3-1-release/SPEC.md) | Release v3.1.0 as the first public v3 Workbench from one independently audited exact candidate proven by a cross-provider cold resume with Foundry absent. | blocked |
| [S-023 - Manifest Schema 2 And Managed Support Runtime](workbench/specs/S-023-manifest-schema-2-and-managed-runtime/SPEC.md) | Ship manifest schema 2 with six lanes, declared collections, a lossless schema 1 migration, Workbench-managed runtime tools, and untracked-by-default session records. | complete |
| [S-024 - Governance Core, ADRs, And Scoped Diagnostics](workbench/specs/S-024-governance-core-adrs-and-diagnostics/SPEC.md) | Give every Workbench claim-level Governance Planes, separated instruction authority and state resolution, a registered diagnostic model enforced by doctor/next/claim, and a first-class ADR collection. | complete |
| [S-025 - Portable Wiki And Design Concepts](workbench/specs/S-025-portable-wiki-and-design-concepts/SPEC.md) | Ship the portable wiki contract with an explicit profile, knowledge-role and provenance metadata, handling-only sensitivity, relative source paths, optional Obsidian, and a mandatory owner-directed design-concepts collection. | complete |
| [S-026 - Workflow Composition, Feedback Lane, And Cold Resume](workbench/specs/S-026-workflow-composition-and-cold-resume/SPEC.md) | Route the twelve core skills and feedback discovery through the schema 2 manifest, promote session records through privacy-checked checkpoints, and prove the composed planning-to-resume workflow mechanically. | complete |
| [S-027 - Workbench v3.1.1 Boundaries](workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md) | Deliver the reduced entry route, four portable stances, chat-only Round One setup proof, and the subsequent feedback-report workflow for v3.1.1. | complete |
| [S-028 - Harness Feedback Integrity](workbench/specs/S-028-harness-feedback-integrity/SPEC.md) | Make manifest-sensitive guardrails, feedback ingestion, and one-time migration report the paths and residue they actually handle. | complete |
| [S-029 - Declared Integration Branch And Recoverable Completion](workbench/specs/S-029-declared-integration-branch/SPEC.md) | Make the integration branch a manifest-declared fact that Genesis, Adoption, and doctor can check, and require generation and adoption to end as a committed branch with a reachable review gate. | complete |
| [S-030 - Permission Scope Matches Declared Lanes](workbench/specs/S-030-permission-scope-matches-lanes/SPEC.md) | Ship a template permission file that grants Edit and Write on the Workbench authorship lanes the prose already declares writable, and make doctor report when a room's permission file withholds a declared lane. | complete |
| [S-031 - Installed Skill Generation Visibility](workbench/specs/S-031-installed-skill-generation/SPEC.md) | Record the release and commit in every Workbench-managed skill marker, have doctor report an installed skill whose generation is stale or unknown, and require review claims about a skill to name the copy they read. | complete |
| [S-032 - Working Upgrade Route And Source Provenance](workbench/specs/S-032-upgrade-route-and-source-provenance/SPEC.md) | Give an already-adopted v2-root room one documented upgrade route that works without skill replacement and records lifecycle `upgrade`, and stop the layout tool from writing `unrecorded` as a source commit on the Genesis path. | complete |
| [S-033 - Room Brain Routing, Wiki Stamps, And Checkpoint Source Bounds](workbench/specs/S-033-silent-gap-diagnostics/SPEC.md) | Close the three v3.1.1 gaps that passed every gate green: an unrouted room brain, wiki files stamped with an older version than the manifest, and checkpoint promotion reading a source outside the repository. | complete |
| [S-034 - Control Fidelity Report](workbench/specs/S-034-control-fidelity-report/SPEC.md) | Report which template-derived lines a room's hand-reconciled controls changed, dropped, or added, so a deliberate divergence can be recorded and an accidental one is caught. | complete |
| [S-035 - Workbench v3.1.2 Candidate](workbench/specs/S-035-workbench-v3-1-2-candidate/SPEC.md) | Stamp v3.1.2 only after the six v3.1.2 capability specs are complete and green, record the disposition of every v3.1.1 upstream fix-list item, and land the reviewed candidate on integration. | complete |
| [S-036 - Workbench v3.1.2 Evidence Corrections](workbench/specs/S-036-v3-1-2-evidence-corrections/SPEC.md) | Correct the unpublished v3.1.2 candidate where permission, control-fidelity, and source-identity checks overstate what they prove, then rehearse the already-v3 upgrade path and return an exact reviewed candidate for GPT_OS deployment. | complete |
| [S-037 - Line-Ending-Agnostic Record Parsing](workbench/specs/S-037-line-ending-agnostic-records/SPEC.md) | Parse ADR and Wiki frontmatter by its structure rather than by a bare line feed, so a Workbench room checked out on a CRLF host reports its real record state instead of declaring every record broken. | complete |
| [S-038 - Workbench v3.1.2 Upstream Fix List](workbench/specs/S-038-v3-1-2-upstream-fix-list/SPEC.md) | Accept, decline, or correct each of the eleven v3.1.1 upstream items UP-013 through UP-023, route the accepted ones to capability specs, and record the final disposition so Master Workbench can compare v3.1.2 against v3.1.1. | complete |
| [S-039 - Installed Managed-Runtime Integrity](workbench/specs/S-039-installed-runtime-integrity/SPEC.md) | Give an installed room a command that verifies the runtime it is executing, and make a drift report say whether the runtime matches the source or only disagrees with a stale receipt. | complete |
| [S-040 - Skill Gate Route Selection And Link Resolution](workbench/specs/S-040-skill-gate-route-selection/SPEC.md) | Make the shared-skill refusals name the route that clears them and stop the installer's link check from being stricter than the install it guards, so a workstation with a linked skill directory is a route choice rather than a portfolio-wide stop. | complete |
| [S-041 - Recorded Baseline Availability](workbench/specs/S-041-recorded-baseline-availability/SPEC.md) | Decide and record what a harness-only migration does when the target has no runnable green baseline, so eight rooms (the report's count) blocked by an unrelated product or host condition get one answer instead of eight improvised ones. | complete |
| [S-042 - Repairing Installed State The Harness Wrote](workbench/specs/S-042-installed-state-repair/SPEC.md) | Report and repair the installed state the harness itself produced - seeded lane documents behind the manifest, records without required frontmatter, and provenance placeholders - so a fix upstream reaches a room that already exists. | complete |
| [S-043 - Diagnostic Output Legibility](workbench/specs/S-043-diagnostic-output-legibility/SPEC.md) | Stop a healthy room from reading as failed by separating what a doctor finding blocks from how loudly it is printed, without changing any blocking semantics. | complete |
| [S-044 - Legacy Room Classification And Control Reconcile Order](workbench/specs/S-044-legacy-room-classification/SPEC.md) | Let an agent arriving at a legacy room classify it from its own contents and learn every missing control at once with the reconcile-before-migrate order, instead of deriving both alone. | complete |
| [S-045 - v3.1.2 Follow-Ups Left Without An Owner](workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md) | Own the seven follow-ups the v3.1.2 slices and their retrospective reviews left open, so owed work has a spec that carries it instead of surviving only as prose inside completed specs. | complete |
| [S-046 - JSON Notepad Foundation](workbench/specs/S-046-json-notepad-foundation/SPEC.md) | Preserve objective continuity in local JSON notepads with safe updates, selective retrieval, and reconciliation before cleanup. | active |
| [S-047 - Visible Workbench Identifiers](workbench/specs/S-047-visible-workbench-identifiers/SPEC.md) | Introduce visible base-62 identifiers without parallel IDs or loss of existing references. | active |
| [S-048 - Checkpoint Retirement](workbench/specs/S-048-checkpoint-retirement/SPEC.md) | Explain the checkpoint rationale, preserve still-needed material, and retire the obsolete collection and dependencies deliberately. | active |
| [S-049 - Assignment Ownership And The Coordination Record](workbench/specs/S-049-assignment-ownership-and-coordination-record/SPEC.md) | Give an assigned spec or ticket an invocation that carries it to its already-authorized endpoint and records, per occurrence, every point where the owner still had to supply routine coordination. | complete |
| [S-050 - Workbench v3.2.0 Release](workbench/specs/S-050-workbench-v3-2-0-release/SPEC.md) | Deliver the reconciled v3.2.0 capability set and prove Example integration plus a useful freshly generated project. | active |
| [S-051 - Core Skill Ownership And Compatibility](workbench/specs/S-051-core-skill-ownership-and-compatibility/SPEC.md) | Install one identifiable compatible global core release while preserving optional shared and room-local skill ownership. | active |
| [S-052 - Private Session Transport](workbench/specs/S-052-private-session-transport/SPEC.md) | Optionally synchronize selected working records through private Git with explicit acknowledgment and lossless offline/conflict handling. | active |
| [S-053 - Configured Host Capabilities](workbench/specs/S-053-configured-host-capabilities/SPEC.md) | Verify the agreed minimum operations in the actual host while keeping capability, enforcement and agent reliability separate. | active |
<!-- spec-catalog:end -->

## Cross-Cutting Health

- all Workbench self-tests and the template evaluator pass;
- `node workbench/tools/spec-workbench.mjs doctor` reports no lifecycle, link, or render
  drift;
- root docs contain no template placeholders and generic templates contain no
  Workbench-specific state;
- harness changes record baseline, after-state, limitations, and documentation
  impact without weakening audit criteria;
- published version changes occur only after behavior is proven.

## Accepted Continuity And Distribution Direction

The Workbench's continuity promise spans maintained controls, specs, Wiki,
source, verified achieved state and objective notes. A fresh capable agent must
recover authorized work from those owners; notes preserve unfinished reasoning.
A real useful continuation demonstrates that workflow. Only repeated controlled,
held-out, condition-blind trials with uncertainty support improved agent-outcome
claims; static checks and a single demonstration do not. Preserve criteria and
failed results. Interface acceptance applies to the product's actual interface.

The portable runtime stays Node/JavaScript; Python retains evaluation and existing
append-only checks. Both languages deserialize JSON; no intrinsic Python JSON
penalty is asserted. Skills compose reusable independent behavior within inherited
scope. Mention, routing, invocation and authorization are distinct; a helper
cannot enlarge its caller's authority. Read-only names the target, while permitted
local working capture remains within the assignment.

Core skills are exclusively upstream-owned and sufficient without a personal
catalog, including reconciled save/promote/notepad. Optional personal/shared
skills and room-local source remain distinct ownership scopes. One selected
global core release carries a tested room compatibility range. The global
.agents/skills root holds managed ignored/excluded core installation alongside
optional personal source; Claude discovery adapts the same source. One source
per skill and one discovery entry per application; no third .codex/skills catalog.
Normal setup preserves existing names; explicit replacement backs up differences.
Room-local promotion into a personal catalog remains owner-directed.

Optional private workbench_sessions Git transport is the accepted cross-device
direction. Stable Workbench identity survives clone/worktree/rename; independent
instantiation receives a new identity, separate from artifact IDs. Selected live
notes/grilling/handoffs map under workbenches/<WBID>/sessions/; schemas/templates
and promoted knowledge stay in project Git. Live records remain ignored there,
non-authoritative, and privacy bounded. Fetch before resume; meaningful saves
and device switching require explicit push/remote acknowledgment, with offline
pending status and last confirmed revision. Serialize sync, preserve conflicts,
and never silently overwrite or force push. Git history retention is accepted;
transport does not move unpushed code or running processes. Local use is independent.
Actual Mac/Windows Claude/Codex round-trip proof is required for that claim.

Promotion writes selected, privacy/validity-checked material directly to its named
durable owner, verifies read-back and faithful reconciliation, then permits scoped
source cleanup. Preserve unfinished/correction/transfer dependencies. Existing
checkpoints remain frozen history; new copy creation is retired. Operational
recovery uses the ignored `sessions/recovery/` collection; legacy rollback remains usable. No new permanent
handoff store substitutes for checkpoints. Capability checks cannot replace
semantic judgment or authorization.

Genesis, adoption and explicit upgrade have different allowed effects and
preservation contracts. Verify all consumed source lanes before mutation.
Separate release, historical adoption, installed manifest, tool/skill bytes,
executing runtime and downstream acceptance identities. Verify the actual remote
ref and object; inaccessible remote state remains unknown. Control divergence is
visible and deliberate against a matched template generation; fidelity stays a
report. A recorded unavailable baseline is distinct from measured red and never
waives release acceptance; use the existing closed baseline policy.

Supported-host claims require a small agreed operational floor checked in the
actual configured environment. Agree requirements before choosing schema,
diagnostics or tests. Missing capabilities affect dependent work only; unavailable
checks stay unverified. Capability, actual enforcement and model reliability need
separate evidence. New native enforcement hooks are outside core; discovery and
evaluation adapters are distinct. Enforcement needs a running mechanism with
supporting evidence, whether host-owned or Workbench-owned.


Implementation and rollout proof for this accepted direction are owned by [S-050](workbench/specs/S-050-workbench-v3-2-0-release/SPEC.md) and its linked capability specs; v3.2.0 is not yet delivered.
