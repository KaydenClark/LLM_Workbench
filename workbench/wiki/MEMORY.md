---
type: memory
status: active
sensitivity: normal
knowledge_role: canonical
provenance:
  - S-021 dogfood migration 2026-09-01; S-025 contract adoption 2026-09-04
  - S-00V TK-00I Agent Operating Knowledge route, 2026-09-26
source_paths:
  - workbench/wiki
last_verified: 2026-09-04
---

# LLM Workbench Memory

This is the product repository's room brain, kept at `workbench/wiki/MEMORY.md`.
It routes durable project-local context; live operating rules stay in the
root controls, capability state and proof stay in the manifest-declared
`workbench/specs/` lane, and rationale stays in `workbench/docs/adr/`.

## Source Precedence

1. Verified runtime and the live controls: `AGENTS.md`, `BLUEPRINT.md`, the
   assigned stable spec, `TASKBOARD.md`, and `RUNBOOK.md`.
2. Maintained notes routed from this file.
3. `archive/` and generated material.

When sources disagree, verify the higher-authority source and repair the stale
note (`AGENTS.md` -> State Resolution). The wiki is a map, not a Governance
Plane: it routes to Canon, Grounding, and verified Actuality and authorizes
nothing.

## Landmark Tracker

[Landmark Tracker](design-concepts/landmark-tracker.md) explains the approved
relationship between DQCs, landmarks, documentation progress, grilling notes
and readable knowledge, including the evolving starting inventory.
[Landmark Tracker Foundation](../specs/S-01T-landmark-tracker-foundation/SPEC.md)
owns delivery and distinguishes the accepted design from available runtime.

## Notepad Foundation Routing

For accepted objective continuity and JSON direction, follow
[S-046](../specs/S-046-json-notepad-foundation/SPEC.md) and
[ADR-0040](../docs/adr/0040-json-notepads-preserve-objective-continuity.md).
Visible identifier semantics belong to
[S-047](../specs/S-047-visible-workbench-identifiers/SPEC.md) and
[ADR-0041](../docs/adr/0041-visible-base62-workbench-identifiers.md); the
uppercase width-four artifact policy, dual-form selection and `widen-id` belong
to the [S-01W Uppercase Width-Four Workbench Artifact IDs Spec](../specs/S-01W-uppercase-width-four-workbench-artifact-ids/SPEC.md).
Checkpoint rationale and retirement belong to
[S-048](../specs/S-048-checkpoint-retirement/SPEC.md).
The shared runtime is `workbench/tools/notepads.mjs`; its operations are
documented in [RUNBOOK](../../RUNBOOK.md) and its judgment in the `notepad`
skill. This router does not copy their state or the local grilling queue.

## Skills Reference

The individual pages below explain core skills and link to their executable or
planned source. They are curated context, not
instruction authority. [S-00W](../specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md)
preserves the accepted shared concept for grilling, notepad and grill-me; each
linked page names its individual delivery Spec. Other core skill articles belong to their individual Specs as
they are authored.

- [Grilling: arrive at a shared design concept](skill-grilling.md)
- [Grill-me: start a saved design inquiry](skill-grill-me.md)
- [Notepad: preserve one objective's working context](skill-notepad.md)
- [Workbench runtime: read what the installed tools report and repair what they name](skill-workbench-runtime.md)
- [To-docs: route settled truth to the owner that holds it](skill-to-docs.md)
- [Promote: move settled working claims into their durable owners](skill-promote.md)
- [Checkpoint: route a retired request to current continuity](skill-checkpoint.md)
- [Auditor: check named claims against pinned evidence](skill-auditor.md)
- [Builder: deliver one assigned result with checkable proof](skill-builder.md)
- [Reviewer: assess one eligible immutable candidate](skill-reviewer.md)
- [Reconciler: compare governed claims against pinned evidence](skill-reconciler.md)
- [Implement: deliver one assigned Task with checkable proof](skill-implement.md)
- [Make-it-so: carry approved work to the endpoint the owner named](skill-make-it-so.md)
- [Carry: take assigned work to its authorized endpoint](skill-carry.md) ([S-01C](../specs/S-01C-carry-skill-rebuild/SPEC.md))
- [To-spec: turn a settled decision into one bounded Spec](skill-to-spec.md)
- [Save: persist authorized work and prove where it landed](skill-save.md)
- [Handoff: pass one objective to a named recipient](skill-handoff.md) ([S-01A](../specs/S-01A-handoff-skill-rebuild/SPEC.md))
- [Code review: check one fixed candidate against both contracts](skill-code-review.md)
- [To-tasks: cut an activated Spec into executable Tasks](skill-to-tasks.md)
- [Adoption: bring an existing project into the Workbench once](skill-adoption.md)
- [Genesis: start a new room from a founding prompt](skill-genesis.md)

## Planned And Optional Skill References

[Domain Modeling: sharpen the Workbench's language as decisions form](skill-domain-modeling.md)
explains the optional personal method and the proposed Workbench adaptation.
[Domain Modeling Skill for the Workbench - S-002H](../specs/S-002H-domain-modeling-skill/SPEC.md)
keeps its required-room versus optional-extension distribution choice open.
This route does not claim that every room can discover the skill today.

## Release And Distribution Routing

The reconciled release scope and complete historical inventory live in
[S-050](../specs/S-050-workbench-v3-2-0-release/SPEC.md). Follow its named owners
for skill ownership/compatibility, optional private session transport and the
configured-host capability floor. This route preserves their open gates without
copying task state here.

## Grilling Destination Audit Ledger

For the owner's current package review, the [Consequential Decision Record
(shared Grill Board)](../grill-board/README.md) bundles questions, named owners,
proposals, consequences and original question history. Topic cards explain
what to think about; decision kind, workflow stage and destination scale can
be combined into a small fixed batch. Saved answers and applied answers have
separate counts. The board README owns these navigation and completion rules;
the topics do not replace the accepted landmark map.
Its header also opens full current AGENTS, RUNBOOK, BLUEPRINT, LEXICON, Landmark,
ADR and DDR reading pages, with linked review drafts distinguished from current
content and proposed excerpts. Navigation preserves the question answer drafts;
Specs and Tasks are excluded from these reading pages. The board README owns
the reader's procedure, source/revision labels and local serving limits.
Its saved answers and revision protocol are shared by Claude and Codex. Read
the existing package before revising it; its working review context does not
replace this ledger or the underlying decision and delivery owners.

The question-by-question ledger of every unique grilling question put to the
owner is a session record, not a Wiki page: it lives in the sessions lane as
`workbench/sessions/grilling-destination-audit-ledger.json` while its rows
become destination question cards, and the router does not route into it.
`tools/test-grilling-ledger.mjs` keeps it valid. The [v4 reconciliation
receipt](../specs/S-00O-workbench-v4-0-0-release/INTEGRATION-RECONCILIATION.md)
identifies recovered sources, branch-only work and remaining gaps.

## Task Artifact And Lifecycle Routing

What a Task carries in and out (the Packet it loads, the append-only Receipt
it closes with), the derived per-Task board signal, and why `Ticket` is
retired as a live term while historical `TK-###` identifiers are never
rewritten, are explained in
[design-concepts/task-artifact-and-lifecycle.md](design-concepts/task-artifact-and-lifecycle.md).
That article is this capability's durable owner, reconciled from
[S-00H](../specs/retired/S-00H-task-artifact-and-terminology-migration/SPEC.md)
(retired) and
[ADR-000H](../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md);
this route preserves the retired Spec's historical reachability without
copying its evidence log here.

## Decision Records

[Decision Records and the Concept Map](design-concepts/decision-records-and-the-concept-map.md) explains how the Blueprint, Destination Decision Records, ADRs, landmarks and Specs fit together, how a DDR differs from an ADR, and how landmarks and Specs form the map at two scales with the Destination Packet linking an agent to it.

## The Workflow Verbs

[The Workflow Verbs](design-concepts/workflow-verbs.md) explains the eight workflow verbs, Journey and the loop, and which verb writes each kind of artifact.

- [The Workflow From Idea To Delivery](design-concepts/idea-to-delivery-workflow.md): the owner's workflow map rewritten in the workflow verbs, with the QA gates, Human QA and closure in plain words
- [The Three Altitudes Of Delivery](design-concepts/delivery-altitudes.md): Blueprint, Spec and Task as counting to 100, and what the Blueprint is for

## AI Coding Dictionary Entries

The owner adopted terms from the AI Coding Dictionary on 2026-10-03; the [Lexicon's AI Coding Terms section](../../LEXICON.md) holds one row per term, and [AI Coding Dictionary Terms](../specs/S-004E-ai-coding-dictionary-terms/SPEC.md) owns delivery. These entries explain only the terms that need more than their row, in Workbench words, and authorize nothing.

- [Harness: what the Workbench is loaded into](dictionary-harness.md): the Workbench is an agentic management system a harness such as Claude Code or Codex loads, never a harness itself
- [Session: one run of the context window](dictionary-session.md): why a Chat is not a session, and why continuity is written to files
- [Context: what the agent has in front of it now](dictionary-context.md): how it differs from the context window, the Context Map, Enduring Context and Working context
- [Context window: the budget a session spends](dictionary-context-window.md): the finite space progressive disclosure, the Task ceiling and the smart zone protect
- [Stateless: nothing carries over unless it is written](dictionary-stateless.md): why corrections go where every later session reads them
- [Stateful: continuity is re-read from the layer below](dictionary-stateful.md): how notepads, handoffs, the Wiki and `AGENTS.md` carry state across sessions
- [Cache tokens: why the start of a session stays stable](dictionary-cache-tokens.md): why always-loaded content is cheaper when it does not change mid-session
- [Non-determinism: why one passing run is not proof](dictionary-non-determinism.md): why verification and repeated trials are required

## Roles And Stances

[Roles and stances](design-concepts/roles-and-stances.md) explains scope versus job and routes to each separately owned capability.

- [Director](skill-director.md): the whole project and its integration branch; assign one Spec to each Dispatcher, name one writer per shared artifact, route separate-context review of each candidate and leave Human QA and main promotion to the owner
- [Dispatcher](skill-dispatcher.md): one Spec and its branch; plan its Tasks, dispatch Workers to one durable writer, verify the assembled Spec and hand the candidate to the Director
- [Spec Planner](skill-spec-planner.md): the Dispatcher's flight-launch stance; plan one assigned Spec from live Actuality into small complete-path Tasks with one writer per shared file and hand the plan to Spec Manager
- [Spec Manager](skill-spec-manager.md): the Dispatcher's execution stance; dispatch Workers to ready non-conflicting Tasks, hold conflicting writes under one writer, assess hand-backs against their commits and report the assembled candidate to the Director
- [Worker](skill-worker-role.md): one assigned Task and one attempt; load its Spec, acceptance and write scope, refuse neighboring or conflicting writes, and hand the exact candidate and proof back to the Dispatcher (staged, not yet installed)

## GitHub Coordination

[GitHub coordination](design-concepts/github-coordination.md) explains the accepted move of live assignment to GitHub Issues, whose records count, the per-item claim rule and what is not built yet.

## Agent Operating Knowledge

How agents are expected to work in this repository, and tool behavior that
surprises them, promoted from host memory so a fresh clone or a cloud instance
has it ([S-00V](../specs/S-00V-portable-workbench/SPEC.md) Desired Behavior 6).
The controls still decide what is authorized; these entries explain and route.
The provenance of every promoted and excluded memory file is in
[archive/host-memory-audit-2026-09-26.md](archive/host-memory-audit-2026-09-26.md).

- [Finish authorized work](finish-authorized-work.md): the owner's instruction is the authorization; no manufactured gates
- [Owner-authored ADRs are accepted](owner-authored-adrs-are-accepted.md): treat their content as settled, surface only tradeoffs
- [Derive before asking the owner](derive-before-asking-the-owner.md): look the answer up in the grilling ledger first
- [Design interviews are forward-looking](design-interviews-are-forward-looking.md): build on the described design instead of correcting it with today's state
- [Recurring results are visual](recurring-results-are-visual.md): render recurring comparable results; group progress by destination
- [PC test at main readiness](pc-test-at-main-readiness.md): the Windows test is never a blocker before main readiness
- [Core rhythm](core-rhythm.md): context conservation balanced with context continuity
- [Suite needs a committed candidate](suite-needs-a-committed-candidate.md): a dirty tree fails about thirty tests through `invalid-source-identity`
- [Lifecycle tool behaviors](lifecycle-tool-behaviors.md): claim, close, append-only and promote surprises
- [Parallel lane dispatch](parallel-lane-dispatch.md): worktree lanes, read-only suite runner, one-at-a-time merges
- [Separate-context review with Codex](separate-context-review-with-codex.md): a working `codex exec` route and its stdin trap

## Leaving The Wiki

| Go to | For |
|---|---|
| [AGENTS.md](../../AGENTS.md) | Authority, scope, safety, and the work loop |
| [BLUEPRINT.md](../../BLUEPRINT.md) | What the product is, who it serves, the outcomes it promises and what it is not |
| [LEXICON.md](../../LEXICON.md) | Shared terms, the Governance Core, the Artifact Ownership Schema, and design-concept routing |
| [TASKBOARD.md](../../TASKBOARD.md) | Generated work-state view; follow each row to its owning Spec |
| [RUNBOOK.md](../../RUNBOOK.md) | Exact operating and verification commands |
| `workbench/specs/` | Stable capability records, acceptance, evidence, and proof |
| [docs/adr/REGISTER.md](../docs/adr/REGISTER.md) | The derived register of decision records |
| [SCHEMA.md](SCHEMA.md) | What the Wiki is, its page kinds, ingest, lint, concurrency, metadata and freshness rules |
| [design-concepts/](design-concepts/README.md) | Articles explaining durable design models and each landmark's evolving synthesis |
| [features/](features/README.md) | One entity page per delivered capability; the per-Spec articles listed below move here one by one, routed under Feature Articles |
| [guidebooks/](guidebooks/) | Ordered procedures that outgrew the Runbook (empty) |

## Routing

| Question | Read first |
|---|---|
| How the Workbench is governed | [LEXICON.md](../../LEXICON.md) -> Governance Core, then `workbench/docs/adr/` |
| What the Wiki is and how agents use it | [SCHEMA.md](SCHEMA.md), then the decision record [The Wiki is the evolving synthesis every agent reads and updates](../docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md) |
| Why a layout, stance or entry-route decision was made | [docs/adr/REGISTER.md](../docs/adr/REGISTER.md) |

This product repository keeps no personal, machine, or deployment notes; it is
a `project` profile wiki. `guidebooks/` ships empty until a procedure outgrows
the Runbook; `design-concepts/` carries the articles routed above;
`features/` holds the per-Spec articles as they move there, routed under
Feature Articles, and a completed Spec's article at its closure point.

## Up-Link

Standalone room; no deployment wiki.

## Landmark Synthesis Pages

One evolving synthesis page per landmark, seeded from its question cards'
current answers and updated whenever a card changes. Each line carries a
one-line summary beside its link. The convention is in
[design-concepts/README.md](design-concepts/README.md#landmark-synthesis-pages).

- [Landmark: GitHub Coordination](design-concepts/landmark-github-coordination.md) - live coordination of delivery moves to GitHub Issues: who may act and what counts, per-item claim authority, composed views, room binding, and what is still open or unbuilt.
- [Landmark: Portable Workbench](design-concepts/landmark-portable-workbench.md) - a fresh agent can clone a room, find its skills, manifest and host knowledge there, do authorized work and end clean; the accepted answers, what the owner left open and what is not yet delivered.
- [Landmark: Workbench Boundaries](design-concepts/landmark-workbench-boundaries.md) - rooms work without the personal skill catalog and coordination machinery stays Foundry augmentation; recurring maintenance is unanswered.
- [Landmark: Agent Autonomy](design-concepts/landmark-agent-autonomy.md) - agents finish authorized work, investigate before asking and never manufacture their next task; coordinator and Foundry machinery are deferred until single-Task execution is proven.
- [Landmark: Workbench and Project Relationships](design-concepts/landmark-workbench-and-project-relationships.md) - the room, Project, Blueprint, Spec, Task and Chat cardinalities, and the rule for when a Master Workbench would be justified.
- [Landmark: Artifact Types](design-concepts/landmark-artifact-types.md) - what each Workbench record is for: the eight-file root destination, one job per artifact, decision tiers and Canon, the destination-only Blueprint, and how Specs, Tasks and ADRs are retired while staying reachable.
- [Landmark: Workbench Updates](design-concepts/landmark-workbench-updates.md) - how rooms receive upstream improvements: version contract, release-owned skills with explicit updates, ownership-origin divergence, recoverable migration, producer self-drift repair, and what a release must prove.
- [Landmark: Verification](design-concepts/landmark-verification.md) - how Task proof, assembled-Spec review, Human QA and closure gates, plus portable-layout proof, keep evidence distinct from review and owner approval.
- [Landmark: Skills](design-concepts/landmark-skills.md) - the tracked skills lane, release-owned versions with explicit-update-only replacement, stance and carry skills, the Wiki skills reference, and the still-unbuilt DQC skills.
- [Landmark: Wiki](design-concepts/landmark-wiki.md) - the Wiki as evolving synthesis: the skills reference, feature articles, who keeps pages current, and where older cards conflict with the newer Wiki decision.
- [Landmark: Workbench Workflow](design-concepts/landmark-workbench-workflow.md) - the journey from idea to delivery: the Blueprint, Spec and Task chain, the Task as unit, branches and claims, review and return, integration and main control, and what newer decisions revise.
- [Landmark: Context Map](design-concepts/landmark-context-map.md) - ordinary entry, the Lexicon-owned single Context Map, and guidebook routing, with what is deferred or not yet reflected in the controls.
- [Landmark: Ownership Model](design-concepts/landmark-ownership-model.md) - every kind of truth has an identifiable owner, separate from authority to act: the three-carrier Contract, claim-level Governance Planes, and the planned ownership map.
- [Landmark: Durable Knowledge](design-concepts/landmark-durable-knowledge.md) - Specs and Tasks as scaffolding, retirement and capture, feature articles, promotion of confirmed answers, and how the Tracker and Wiki keep links recoverable.
- [Landmark: Grilling and Shared Understanding](design-concepts/landmark-grilling-and-shared-understanding.md) - how an idea becomes a confirmed shared concept and reaches its durable owners: working versus confirmed versus promoted, where pre-delivery understanding lives, and open conflicts with later decisions.
- [Landmark: Handoffs](design-concepts/landmark-handoffs.md) - handoffs as readable Markdown that preserve the named scope, cold continuation through existing owners, notes as transport, and where handoff authority answers conflict with current controls.
- [Landmark: Taskboard](design-concepts/landmark-taskboard.md) - a generated six-lane board that projects Spec and Task state, one shared lane calculation, review and Complete cleanup rules, and `sitrep`, with delivery status stated honestly.
- [Landmark: Agent Stances](design-concepts/landmark-agent-stances.md) - the four portable stance skills change method, not authority, and the Spec and Task set the normal stance; routes to the Roles and stances article.
- [Landmark: Notepads](design-concepts/landmark-notepads.md) - what working notes and handoffs preserve, that a notepad belongs to its objective, promote-before-end with temporary committed transport, and where pre-delivery understanding lives.
- [Landmark: Session Transport](design-concepts/landmark-session-transport.md) - promote before end with notes allowed to travel temporarily, optional private Git transport, and private recovery material kept out of the public tree.
- [Landmark: Genesis and Adoption](design-concepts/landmark-genesis-and-adoption.md) - the three entry routes (Genesis, Adoption, update), what each preserves, shadow retirement, and the staged Template-proof path to a personalized room.
- [Landmark: Workbench Template](design-concepts/landmark-workbench-template.md) - what the reference Template provides, the upgrade each version must prove, staged personalization, and the fixture exercises.
- [Landmark: Harness Feedback Review](design-concepts/landmark-harness-feedback-review.md) - chat-only Round One precedes reports, reports live in the feedback lane without repairing their target, every finding gets one disposition, and cost and outcome measurement belong to the audit workbench.
- [Landmark: Landmark Tracker](design-concepts/landmark-landmark-tracker.md) - the four-piece model, card and landmark lifecycle, step distributions and maintenance, routing to the Landmark Tracker concept article for the model itself.

## Feature Articles

One article per delivered capability, named for what it delivers. Each line
carries a one-line summary beside its link so a reader can choose a page
without opening it. See [features/README.md](features/README.md).

- [Wiki Routing, Version Stamps And Safe Source Reads](features/wiki-routing-version-stamps-and-safe-source-reads.md) - the checks that tell a room its Wiki router is unreachable or its Wiki files are stamped with a stale version, and the safe-read boundary continuity input must pass.

## Individual Spec Articles

One article per Spec preserves capability knowledge and distinguishes historical
proof from current behavior. Original records remain intact pending lifecycle gates.

- [Spec-Centered Progressive Disclosure](design-concepts/spec-S-001-progressive-disclosure.md)
- [Held-Out Path-Safety Evaluation](design-concepts/spec-S-002-heldout-evaluation.md)
- [Dependency-Safe Direct Claiming](design-concepts/spec-S-004-safe-direct-claim.md)
- [Consistent Bootstrap Ownership Guidance](design-concepts/spec-S-005-bootstrap-doc-alignment.md)
- [Evidence-Gated Harness Feedback](design-concepts/spec-S-006-feedback-automation.md)
- [Import-Safe Feedback Helper Entry](design-concepts/spec-S-007-feedback-helper-import.md)
- [Portable Verification Boundaries](design-concepts/spec-S-008-windows-verification-portability.md)
- [Adoption When Git Writes Are Unavailable](design-concepts/spec-S-009-git-write-constrained-adoption.md)
- [S-00A: Blueprint, Active ADRs And The Context Map](design-concepts/spec-S-00A-blueprint-active-adr-and-context-map.md)
- [S-00B: Workbench Template Reformation](design-concepts/spec-S-00B-workbench-template-reformation.md)
- [S-00C: Project Evidence And Blueprint Grilling Preparation](design-concepts/spec-S-00C-project-evidence-and-blueprint-grilling.md)
- [S-00D: Genesis From Blueprint And ADR Decisions](design-concepts/spec-S-00D-genesis-from-blueprint-and-adrs.md)
- [S-00E: Fresh Template Project Proof](design-concepts/spec-S-00E-fresh-template-project-proof.md)
- [S-00F: The Named Template Upgrade Release Gate](design-concepts/spec-S-00F-template-upgrade-release-gate.md)
- [S-00L: Lexicon Freshness Repair](design-concepts/spec-S-00L-lexicon-freshness-repair.md)
- [Canonical Evaluator Invocation](design-concepts/spec-S-010-canonical-evaluator-entry.md)
- [Reproducible Adoption Provenance](design-concepts/spec-S-012-adoption-provenance-proof.md)
- [Verified Automation Run Outcomes](design-concepts/spec-S-013-automation-run-outcomes.md)
- [Operable Genesis Readiness](design-concepts/spec-S-015-portable-v3-release-audit-recovery.md)
- [Bounded Team Coordination (S-020)](design-concepts/spec-S-020-spec-native-team-coordination.md)
- [Portable Workbench Architecture (S-021)](design-concepts/spec-S-021-portable-workbench-v3.md)
- [Historical v3.1 Release Packet (S-022)](design-concepts/spec-S-022-llm-workbench-v3-1-release.md)
- [Manifest And Managed Runtime (S-023)](design-concepts/spec-S-023-manifest-and-managed-runtime.md)
- [Governance Claims And Diagnostics (S-024)](design-concepts/spec-S-024-governance-core-and-diagnostics.md)
- [Portable Wiki Knowledge (S-025)](design-concepts/spec-S-025-portable-wiki-and-design-concepts.md)
- [Workflow Composition And Cold Continuation (S-026)](design-concepts/spec-S-026-workflow-composition-and-cold-resume.md)
- [Assigned Work, Portable Stances And Delivery Boundaries](design-concepts/spec-S-027-workbench-v3-1-1-boundaries.md)
- [Feedback And Migration Integrity](design-concepts/spec-S-028-harness-feedback-integrity.md)
- [Declared Integration And Recoverable Completion](design-concepts/spec-S-029-declared-integration-branch.md)
- [Mechanical Permission Scope And Declared Lanes](design-concepts/spec-S-030-permission-scope-matches-lanes.md)
- [Installed Skill Identity And Inspection](design-concepts/spec-S-031-installed-skill-generation.md)
- [Upgrade Layout Without Replacing Skills](design-concepts/spec-S-032-upgrade-route-and-source-provenance.md)
- [Control Fidelity Without Forced Uniformity](design-concepts/spec-S-034-control-fidelity-report.md)
- [Release Candidate Proof And Historical Disposition](design-concepts/spec-S-035-workbench-v3-1-2-candidate.md)
- [Evidence-Bounded Upgrade Claims (S-036)](design-concepts/spec-S-036-evidence-corrections.md)
- [Line-Ending-Aware Records (S-037)](design-concepts/spec-S-037-line-ending-agnostic-records.md)
- [Source-Checked Finding Disposition (S-038)](design-concepts/spec-S-038-upstream-finding-disposition.md)
- [Installed Runtime Integrity (S-039)](design-concepts/spec-S-039-installed-runtime-integrity.md)
- [Skill Presence And Repair Routes (S-040)](design-concepts/spec-S-040-skill-gate-route-selection.md)
- [Recorded Baseline Availability (S-041)](design-concepts/spec-S-041-recorded-baseline-availability.md)
- [Installed State Reporting And Repair (S-042)](design-concepts/spec-S-042-installed-state-repair.md)
- [Diagnostics Ordered By Consequence (S-043)](design-concepts/spec-S-043-diagnostic-output-legibility.md)
- [Adoption Preflight And Legacy Classification (S-044)](design-concepts/spec-S-044-adoption-and-legacy-classification.md)
- [Linked Follow-Up Reconciliation (S-045)](design-concepts/spec-S-045-linked-follow-up-reconciliation.md)
- [S-046: JSON Notepad Foundation](design-concepts/spec-S-046-json-notepad-foundation.md)
- [S-047: Visible Workbench Identifiers](design-concepts/spec-S-047-visible-workbench-identifiers.md)
- [S-048: Checkpoint Retirement And Direct Promotion](design-concepts/spec-S-048-checkpoint-retirement.md)
- [S-049: Assignment Ownership And Coordination Records](design-concepts/spec-S-049-assignment-ownership-and-coordination-record.md)
- [S-051: Core Skill Ownership And Compatibility](design-concepts/spec-S-051-core-skill-ownership-and-compatibility.md)
- [S-053: Configured Host Capabilities](design-concepts/spec-S-053-configured-host-capabilities.md)
