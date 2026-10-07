---
type: memory
status: active
sensitivity: normal
knowledge_role: canonical
provenance:
  - v3 Portable Workbench Spec (S-021) dogfood migration 2026-09-01; Portable Wiki And Design Concepts Spec (S-025) contract adoption 2026-09-04
  - Portable Workbench Spec (S-00V) Host Memory To Wiki Task (TK-00I) Agent Operating Knowledge route, 2026-09-26
  - Wiki Evolving-Synthesis Migration (S-003W) router changes 2026-10-04: feature article, landmark synthesis and summary-line routes, and the whole-Wiki lint corrections of its corrective Task TK-006P (Wiki wording)
source_paths:
  - workbench/wiki
last_verified: 2026-10-04
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

## Harness engineering lineage

- [Harness engineering: the philosophy the Workbench implements](harness-engineering-lineage.md) - links and attributes the OpenAI article and Ryan Lopopolo's corpus, names the twelve directions the owner made landmarks, and maps the article's document kinds onto the Workbench's own.

## Landmark Tracker

- [Landmark Tracker](design-concepts/landmark-tracker.md) - the approved relationship between DQCs, landmarks, documentation progress, grilling notes and readable knowledge, including the evolving starting inventory
- [S-01T - Landmark Tracker Foundation](../specs/S-01T-landmark-tracker-foundation/SPEC.md) - the Spec that owns delivery and distinguishes the accepted design from available runtime

## Notepad Foundation Routing

For accepted objective continuity and JSON direction, follow these owners:

- [S-046 - JSON Notepad Foundation](../specs/S-046-json-notepad-foundation/SPEC.md) - the Spec for objective continuity in local JSON notepads with safe updates and selective retrieval
- [ADR-0040 - JSON notepads preserve objective continuity](../docs/adr/0040-json-notepads-preserve-objective-continuity.md) - the decision record behind that direction
- [S-047 - Visible Workbench Identifiers](../specs/S-047-visible-workbench-identifiers/SPEC.md) - the Spec for visible identifier semantics
- [ADR-0041 - Visible base-62 Workbench identifiers](../docs/adr/0041-visible-base62-workbench-identifiers.md) - the decision record for those identifiers
- [S-01W - Uppercase Width-Four Workbench Artifact IDs](../specs/S-01W-uppercase-width-four-workbench-artifact-ids/SPEC.md) - the uppercase width-four artifact policy, dual-form selection and `widen-id`
- [S-048 - Checkpoint Retirement](../specs/S-048-checkpoint-retirement/SPEC.md) - the checkpoint rationale and its retirement

The shared runtime is `workbench/tools/notepads.mjs`; its operations are
documented in [RUNBOOK](../../RUNBOOK.md) and its judgment in the `notepad`
skill. This router does not copy their state or the local grilling queue.

## Skills Reference

The individual pages below explain core skills and link to their executable or
planned source. They are curated context, not instruction authority. Each
linked page names its individual delivery Spec. Other core skill articles
belong to their individual Specs as they are authored.

- [S-00W - Concept Grilling And Notepad Composition](../specs/S-00W-concept-grilling-and-notepad-composition/SPEC.md) - the accepted shared concept for grilling, notepad and grill-me, which each skill's own Spec delivers

- [Grilling](skill-grilling.md) - arrive at a shared design concept
- [Grill-me](skill-grill-me.md) - start a saved design inquiry
- [Notepad](skill-notepad.md) - preserve one objective's working context
- [Workbench runtime](skill-workbench-runtime.md) - read what the installed tools report and repair what they name
- [To-docs](skill-to-docs.md) - route settled truth to the owner that holds it
- [Promote](skill-promote.md) - move settled working claims into their durable owners
- [Checkpoint](skill-checkpoint.md) - route a retired request to current continuity
- [Auditor](skill-auditor.md) - check named claims against pinned evidence
- [Builder](skill-builder.md) - deliver one assigned result with checkable proof
- [Reviewer](skill-reviewer.md) - assess one eligible immutable candidate
- [Reconciler](skill-reconciler.md) - compare governed claims against pinned evidence
- [Implement](skill-implement.md) - deliver one assigned Task with checkable proof
- [Make-it-so](skill-make-it-so.md) - carry approved work to the endpoint the owner named
- [Carry](skill-carry.md) - take assigned work to its authorized endpoint (delivery Spec [S-01C - carry skill rebuild](../specs/S-01C-carry-skill-rebuild/SPEC.md))
- [To-spec](skill-to-spec.md) - turn a settled decision into one bounded Spec
- [Save](skill-save.md) - persist authorized work and prove where it landed
- [Handoff](skill-handoff.md) - pass one objective to a named recipient (delivery Spec [S-01A - handoff skill rebuild](../specs/S-01A-handoff-skill-rebuild/SPEC.md))
- [Code review](skill-code-review.md) - check one fixed candidate against both contracts
- [To-tasks](skill-to-tasks.md) - cut an activated Spec into executable Tasks
- [Adoption](skill-adoption.md) - bring an existing project into the Workbench once
- [Genesis](skill-genesis.md) - start a new room from a founding prompt
- [Improve harness](skill-improve-harness.md) - improve one harnessed job through one loop and keep only what earns its cost; the fifteen-skill harness-review family it replaces is its history
- [Skills draft wiki](skills-draft/README.md) - the prototype collection, article template and implement-spec and pr drafts describing each skill's connections and evidence limits

## Planned And Optional Skill References

- [Domain Modeling](skill-domain-modeling.md) - active language challenges and consequence tracing; explains the compact glossary and richer Wiki distinction, with delivery and capture boundaries linked to their owners
- [Required Domain Modeling Skill (S-004J)](../specs/S-004J-required-domain-modeling-skill/SPEC.md) - maps the skill into every room's skills lane as a required skill, replacing the superseded Domain Modeling Skill for the Workbench Spec (S-002H); until it is delivered, no room's skills lane carries it

## Release And Distribution Routing

- [Workbench v4.0.0 Release (S-00O)](../specs/S-00O-workbench-v4-0-0-release/SPEC.md) - current release work
- [Superseded v3.2.0 release record (S-050)](../specs/S-050-workbench-v3-2-0-release/SPEC.md) - keeps the reconciled v3.2 scope and complete historical inventory
- [V4 integration decision and progress reconciliation](../specs/S-00O-workbench-v4-0-0-release/INTEGRATION-RECONCILIATION.md) - the receipt of the Workbench v4.0.0 Release (S-00O) that identifies recovered sources, branch-only work and remaining gaps

Follow the superseded record's named owners for skill ownership/compatibility,
optional private session transport and the configured-host capability floor.
This route copies no task state here.

## Consequential Decision Record And Grill Board

- [Consequential Decision Record (shared Grill Board)](../grill-board/README.md) - the owner's current package review, bundling questions, named owners, proposals, consequences and original question history

Topic cards explain
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
The Grill Board is the first working form of the
[Shared Interactive Workbench Board (S-004D)](../specs/S-004D-shared-interactive-board/SPEC.md),
the destination it grows into.

The question-by-question ledger of every unique grilling question put to the
owner is a session record, not a Wiki page: it lives in the sessions lane as
`workbench/sessions/grilling-destination-audit-ledger.json` while its rows
become destination question cards, and the router does not route into it.
`tools/test-grilling-ledger.mjs` keeps it valid.

## Task Artifact And Lifecycle Routing

What a Task carries in and out (the Packet it loads, the append-only Receipt
it closes with), the derived per-Task board signal, and why `Ticket` is
retired as a live term while historical `TK-###` identifiers are never
rewritten, are explained in the article below. That article is this capability's durable
owner, reconciled from the retired Spec and the decision record below; this
route preserves the retired Spec's historical reachability without copying its
evidence log here.

- [The Task Artifact And Its Lifecycle](design-concepts/task-artifact-and-lifecycle.md) - the durable owner: what a Task carries in and out, the derived board signal and why `Ticket` is retired as a live term
- [S-00H - Task Artifact And Terminology Migration](../specs/retired/S-00H-task-artifact-and-terminology-migration/SPEC.md) - the retired Spec that delivered the standalone `TASK.md`, kept reachable as history
- [ADR-000H - A Task is a standalone artifact and Task replaces Ticket as the execution-slice term](../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md) - the decision record for the Task artifact and the term

## The LANDMARK.md Artifact

- [Landmarks: The LANDMARK.md Artifact One Size Above A Spec](design-concepts/landmarks-one-size-above-specs.md) - what a `LANDMARK.md` holds, how Specs and Tasks nest under it, the link-safe move, the whole-landmark review and retirement into its Landmark Wiki page, installation and what is not delivered yet

## Decision Records

- [Decision Records and the Concept Map](design-concepts/decision-records-and-the-concept-map.md) - how the Blueprint, Destination Decision Records, ADRs, landmarks and Specs fit together, how a DDR differs from an ADR, and how landmarks and Specs form the map at two scales with the Destination Packet linking an agent to it.

## The Workflow Verbs

- [The Workflow Verbs](design-concepts/workflow-verbs.md) - the workflow verbs, Journey and the loop, and which verb writes each kind of artifact
- [The Workflow From Idea To Delivery](design-concepts/idea-to-delivery-workflow.md): the owner's workflow map rewritten in the workflow verbs, with the QA gates, Human QA and closure in plain words
- [The Three Altitudes Of Delivery](design-concepts/delivery-altitudes.md): Blueprint, Spec and Task as counting to 100, and what the Blueprint is for

## AI Coding Dictionary Entries

The owner adopted terms from the AI Coding Dictionary on 2026-10-03. These entries explain only the terms that need more than their row, in Workbench words, and authorize nothing.

- [Lexicon: AI Coding Terms section](../../LEXICON.md) - one row per adopted term
- [S-004E - AI Coding Dictionary Terms](../specs/S-004E-ai-coding-dictionary-terms/SPEC.md) - the Spec that owns delivery of the terms and these entries
- [S-004K - Workbench Term Dictionary Pages](../specs/S-004K-workbench-term-dictionary-pages/SPEC.md) - the Spec that owns brief Lexicon rows plus long dictionary pages for the Workbench's own terms, starting with the workflow verbs
- [Harness: what the Workbench is loaded into](dictionary-harness.md): the Workbench is an agentic management system a harness such as Claude Code or Codex loads, never a harness itself
- [Session: one run of the context window](dictionary-session.md): why a Chat is not a session, and why continuity is written to files
- [Context: what the agent has in front of it now](dictionary-context.md): how it differs from the context window, the Context Map, Enduring Context and Working context
- [Context window: the budget a session spends](dictionary-context-window.md): the finite space progressive disclosure, the Task ceiling and the smart zone protect
- [Stateless: nothing carries over unless it is written](dictionary-stateless.md): why corrections go where every later session reads them
- [Stateful: continuity is re-read from the layer below](dictionary-stateful.md): how notepads, handoffs, the Wiki and `AGENTS.md` carry state across sessions
- [Cache tokens: why the start of a session stays stable](dictionary-cache-tokens.md): why always-loaded content is cheaper when it does not change mid-session
- [Non-determinism: why one passing run is not proof](dictionary-non-determinism.md): why verification and repeated trials are required
- [Automated review: the Review verb, after the Journey](dictionary-automated-review.md): what a separate-context review is, that it reviews Specs, landmarks or the whole Workbench and never a Task, and why it runs on the owner's chosen host

## Roles And Stances

- [Roles and stances](design-concepts/roles-and-stances.md) - scope versus job, and the route to each separately owned capability
- [Director](skill-director.md): the whole project and its integration branch; assign one Spec to each Dispatcher, name one writer per shared artifact, route separate-context review of each candidate and leave Human QA and main promotion to the owner
- [Dispatcher](skill-dispatcher.md): one Spec and its branch; plan its Tasks, dispatch Workers to one durable writer, verify the assembled Spec and hand the candidate to the Director
- [Spec Planner](skill-spec-planner.md): the Dispatcher's flight-launch stance; plan one assigned Spec from live Actuality into small complete-path Tasks with one writer per shared file and hand the plan to Spec Manager
- [Spec Manager](skill-spec-manager.md): the Dispatcher's execution stance; dispatch Workers to ready non-conflicting Tasks, hold conflicting writes under one writer, assess hand-backs against their commits and report the assembled candidate to the Director
- [Worker](skill-worker-role.md): one assigned Task and one attempt; load its Spec, acceptance and write scope, refuse neighboring or conflicting writes, and hand the exact candidate and proof back to the Dispatcher (staged, not yet installed)

## GitHub Coordination

- [GitHub coordination](design-concepts/github-coordination.md) - the accepted move of live assignment to GitHub Issues, whose records count, the per-item claim rule and what is not built yet.

## Agent Operating Knowledge

How agents are expected to work in this repository, and tool behavior that
surprises them, promoted from host memory so a fresh clone or a cloud instance
has it (Desired Behavior 6 of the Portable Workbench Spec, [S-00V - Portable Workbench](../specs/S-00V-portable-workbench/SPEC.md)).
The controls still decide what is authorized; these entries explain and route.
The provenance of every promoted and excluded memory file is in the final
entry.

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
- [Separate-context review with Codex](separate-context-review-with-codex.md): not a route unless the owner asks for Codex in that request; kept for its stdin trap and CLI notes
- [Host-Memory Audit, 2026-09-26](archive/host-memory-audit-2026-09-26.md): the provenance record naming every promoted and excluded host memory file
- [Maintainer skills](maintainer-skills.md): this repository's maintainer-only lane skills, which the release checks allow and never ship

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
| [features/](features/README.md) | One entity page per delivered capability, routed under Feature Articles |
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
`features/` holds one article per delivered capability, routed under Feature
Articles, including a completed Spec's article at its closure point.

## Up-Link

Standalone room; no deployment wiki.

## Landmark Synthesis Pages

One evolving synthesis page per landmark, seeded from its question cards'
current answers and updated whenever a card changes. Each line carries a
one-line summary beside its link. The convention is in
[design-concepts/README.md](design-concepts/README.md#landmark-synthesis-pages) - the design-concepts collection shape and the landmark synthesis page convention.

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
without opening it. The collection's shape and capture convention are in
[features/README.md](features/README.md) - the features collection's article shape and capture rules.

- [Adoption Preflight And Legacy Classification](features/adoption-preflight-and-legacy-classification.md) - reports every unreconciled root control at once and classifies a room as genesis, adoption, upgrade or unclassifiable from evidence.
- [Adoption When Git Writes Are Unavailable](features/adoption-when-git-writes-are-unavailable.md) - adoption on a host that refuses Git writes records a visible blocker and reversible work, never forced Git or invented proof.
- [Assigned Work, Portable Stances And Delivery Boundaries](features/assigned-work-portable-stances-and-delivery-boundaries.md) - the entry route, the Builder, Auditor, Reviewer and Reconciler stances, and delivery through independent review and verified containment.
- [Assignment Ownership And Coordination Records](features/assignment-ownership-and-coordination-records.md) - the Carry skill owns an assigned endpoint, and routine coordination the owner supplied by hand is recorded.
- [Blueprint, Active ADRs And The Context Map](features/blueprint-active-adrs-and-the-context-map.md) - the Blueprint states the finished product, active ADR decisions carry architectural Canon, and the Context Map routes questions to owners.
- [Bounded Team Coordination](features/bounded-team-coordination.md) - optional team templates and an overlap demonstration: disjoint edit paths, one coordinator, one writer of shared state, no locking service.
- [Canonical Evaluator Invocation](features/canonical-evaluator-invocation.md) - the evaluator emits its report when run directly through a path alias, checked by report content and not just exit status.
- [Checkpoint Retirement And Direct Promotion](features/checkpoint-retirement-and-direct-promotion.md) - retires checkpoint copy creation, keeps history and promotes selected supported claims straight to their durable owners.
- [Configured Host Capabilities](features/configured-host-capabilities.md) - five bounded host checks that keep capability, enforcement and agent reliability separate.
- [Consistent Bootstrap Ownership Guidance](features/consistent-bootstrap-ownership-guidance.md) - setup, Genesis and Adoption entry points route to the current owners: contract for behavior, Spec for requirements and proof, Taskboard as view.
- [Control Fidelity Without Forced Uniformity](features/control-fidelity-without-forced-uniformity.md) - a report that compares a room's controls with the templates and labels each line unchanged, filled, changed, dropped or added, without failing on divergence.
- [Copyable Workbench Template Reference Room](features/copyable-workbench-template-reference-room.md) - the reference room became a copyable Workbench Template whose installed controls, identity and provenance survive an upgrade.
- [Core Skill Ownership And Compatibility](features/core-skill-ownership-and-compatibility.md) - a versioned core skill source with explicit compatibility ranges that keeps missing or conflicting skills visible.
- [Declared Integration And Recoverable Completion](features/declared-integration-and-recoverable-completion.md) - the manifest declares the integration branch, doctor reports it missing, and completed work lands committed on a prefixed branch.
- [Dependency-Safe Direct Claiming](features/dependency-safe-direct-claiming.md) - direct Task claiming uses the same dependency eligibility as selection and refuses blocked work before changing anything.
- [Diagnostics Ordered By Consequence](features/diagnostics-ordered-by-consequence.md) - doctor groups findings as blocking, selected-slice, then informational, so effect leads severity.
- [Evidence-Bounded Upgrade Claims](features/evidence-bounded-upgrade-claims.md) - upgrade reports that separate what a check observes from what an operator might infer: matcher uncertainty, fidelity and source identity.
- [Evidence-Gated Harness Feedback](features/evidence-gated-harness-feedback.md) - feedback discovery ranks candidates and an independent decision passes, denies or blocks each on reproduction, regression, suite and safety evidence.
- [Feedback And Migration Integrity](features/feedback-and-migration-integrity.md) - strict feedback ingestion, manifest-aware guardrail evaluation, and adoption that reports the residue it leaves.
- [Fresh Template To Independent Project Proof](features/fresh-template-to-independent-project-proof.md) - the recorded proof that a clean Template copy became an independent project room and was continued in a fresh agent context, with its limits.
- [Genesis From Blueprint Decisions And Active ADRs](features/genesis-from-blueprint-decisions-and-active-adrs.md) - creates a new room from a clean Template, a prepared note and an explicit plan, deriving one first capability from locked questions and active ADRs.
- [Governance Planes, ADR Decisions And Scoped Diagnostics](features/governance-planes-adr-decisions-and-scoped-diagnostics.md) - claims classified by plane, authority kept apart from state resolution, and diagnostics with their own severity, scope and blocking effect.
- [Held-Out Path-Safety Evaluation](features/held-out-path-safety-evaluation.md) - a held-out path-handling eval task and grader scoring correctness, scope, verification honesty and doc upkeep separately.
- [Historical v3.1 Release Proof Packet](features/historical-v3-1-release-proof-packet.md) - the superseded v3.1 release proof packet: what it preserved, what it never completed, and the current owners of release state.
- [Import-Safe Feedback Helper Entry](features/import-safe-feedback-helper-entry.md) - the feedback helper can be imported inline without running its CLI, because its entry guard handles an absent script path.
- [Installed Runtime Integrity](features/installed-runtime-integrity.md) - a room compares its installed runtime files with its managed-tools receipt hashes and classifies drift; verify reports and repair stays separate.
- [Installed Skill Identity And Inspection](features/installed-skill-identity-and-inspection.md) - managed skill markers with a content hash and compatibility range, and read-only inspection that tells an installed copy from its source.
- [Installed State Reporting And Repair](features/installed-state-reporting-and-repair.md) - reports stale seeded documents and repairs missing metadata without reinstalling or replacing project-owned content.
- [JSON Notepad Foundation](features/json-notepad-foundation.md) - a local revision-checked JSON notepad that preserves working context for continuation without granting authority.
- [Lexicon Freshness Repair](features/lexicon-freshness-repair.md) - repairs stale release, version and source-boundary claims in the Lexicon by checking them against the manifest, Git containment and links.
- [Line-Ending-Aware Records](features/line-ending-aware-records.md) - ADR and Wiki readers that accept LF and CRLF checkouts through one shared parser, with writers that keep the destination's line terminator.
- [Linked Follow-Up Reconciliation](features/linked-follow-up-reconciliation.md) - gives accepted obligations left by completed Specs a new owner instead of leaving them in closed records.
- [Manifest Schema 2 Lanes And Managed Runtime](features/manifest-schema-2-lanes-and-managed-runtime.md) - manifest-declared support lanes and collections, and managed runtime tools installed against a recorded receipt.
- [Mechanical Permission Scope And Declared Lanes](features/mechanical-permission-scope-and-declared-lanes.md) - a diagnostic that compares the permission file with each declared lane and reports drift without rewriting settings.
- [Named Template Upgrade Release Gate](features/named-template-upgrade-release-gate.md) - requires each new Workbench version to be exercised in the named Workbench_Template installation before release readiness.
- [Operable Genesis Readiness](features/operable-genesis-readiness.md) - Genesis readiness checks that a cold agent can follow the layout, read filled controls and select a ready first Spec packet, not only find filenames.
- [Portable Verification Boundaries](features/portable-verification-boundaries.md) - context labels use forward slashes, spec comparison ignores CRLF, and eval fixtures use the running interpreter and Windows launchers.
- [Portable Wiki Knowledge And Collections](features/portable-wiki-knowledge-and-collections.md) - the Wiki's one router, schema and note properties, and the named collections that hold durable explanations with explicit sources.
- [Portable Workbench Installation, Adoption And Upgrade](features/portable-workbench-installation-adoption-and-upgrade.md) - how a Workbench is created, adopted and upgraded, with presence kept separate from replacement of installed skills.
- [Project Evidence Preparation For Blueprint Grilling](features/project-evidence-preparation-for-blueprint-grilling.md) - turns named project sources into a bounded provisional grilling note that keeps source identity and uncertainty and answers no owner question.
- [Recorded Baseline Availability](features/recorded-baseline-availability.md) - a Spec can record an unavailable application baseline with evidence and one of three closed reasons so a harness-only change can proceed.
- [Release Candidate Proof And Historical Disposition](features/release-candidate-proof-and-historical-disposition.md) - what a release candidate must join: capability delivery, version identity and a disposition of feedback, with the proof kept historical.
- [Reproducible Adoption Provenance](features/reproducible-adoption-provenance.md) - adoption proof carries the source remote, ref, resolved commit, executed self-tests and checksum, so a cold reviewer can reproduce it.
- [Skill Presence And Repair Routes](features/skill-presence-and-repair-routes.md) - skill installation that recognizes linked destinations and names the supported route in refusals, with one shared presence judgment.
- [Source-Checked Finding Disposition](features/source-checked-finding-disposition.md) - how an upstream fix list is reconciled: each finding is source-checked, routed to a named capability, and corrected premises are preserved.
- [Spec-Centered Progressive Disclosure](features/spec-centered-progressive-disclosure.md) - ordinary entry stays small: contract, routes, then the assigned Spec and its source, with no historical catalog read first.
- [Upgrade Layout Without Replacing Skills](features/upgrade-layout-without-replacing-skills.md) - a layout-only upgrade route for an adopted legacy room whose skills cannot be replaced, with source provenance checked against the real checkout.
- [Verified Automation Run Outcomes](features/verified-automation-run-outcomes.md) - six run-outcome categories and an idle count that only a verified idle advances, so a pause is recommended on real absence of work.
- [Visible Workbench Identifiers](features/visible-workbench-identifiers.md) - the visible type-prefixed identity readers see, with legacy compatibility and the uppercase width-four amendment.
- [Wiki Routing, Version Stamps And Safe Source Reads](features/wiki-routing-version-stamps-and-safe-source-reads.md) - the checks that tell a room its Wiki router is unreachable or its Wiki files are stamped with a stale version, and the safe-read boundary continuity input must pass.
- [Workflow Composition And Cold Continuation](features/workflow-composition-and-cold-continuation.md) - how composed work resumes from repository evidence alone, with a round-trip fixture and checkpoint copying retired in favor of promotion.
