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
[ADR-0041](../docs/adr/0041-visible-base62-workbench-identifiers.md).
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
- [To-docs: route settled truth to the owner that holds it](skill-to-docs.md)
- [Promote: move settled working claims into their durable owners](skill-promote.md)
- [Checkpoint: route a retired request to current continuity](skill-checkpoint.md)
- [Auditor: check named claims against pinned evidence](skill-auditor.md)
- [Make-it-so: carry approved work to the endpoint the owner named](skill-make-it-so.md)
- [To-spec: turn a settled decision into one bounded Spec](skill-to-spec.md)
- [Save: persist authorized work and prove where it landed](skill-save.md)
- [Handoff: pass one objective to a named recipient](skill-handoff.md) ([S-01A](../specs/S-01A-handoff-skill-rebuild/SPEC.md))
- [Code review: check one fixed candidate against both contracts](skill-code-review.md)
- [To-tasks: cut an activated Spec into executable Tasks](skill-to-tasks.md)

## Release And Distribution Routing

The reconciled release scope and complete historical inventory live in
[S-050](../specs/S-050-workbench-v3-2-0-release/SPEC.md). Follow its named owners
for skill ownership/compatibility, optional private session transport and the
configured-host capability floor. This route preserves their open gates without
copying task state here.

## Grilling Destination Audit Ledger

Every unique grilling question put to the owner, with its answer, reason and
intended result, is recorded in
[grilling-destination-audit-ledger.json](grilling-destination-audit-ledger.json).
That JSON file is the ledger itself, not a projection: readable views are
rendered from it and never edited by hand. It is the destination the v4
Workbench is audited against; look a question up by its `id`, or audit one
artifact by the `result` entries that name it. Each question also carries a
separate `progress` reading of how far that result is built, pinned by
`progress_assessment` to one `integration` commit; re-run the assessment to
refresh it, and never mix progress into the destination fields.
`tools/test-grilling-ledger.mjs` keeps it valid.

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
| [BLUEPRINT.md](../../BLUEPRINT.md) | Product destination, integrated design, cross-cutting qualities, and constraints |
| [LEXICON.md](../../LEXICON.md) | Shared terms, the Governance Core, the Artifact Ownership Schema, and design-concept routing |
| [TASKBOARD.md](../../TASKBOARD.md) | Generated work-state view; follow each row to its owning Spec |
| [RUNBOOK.md](../../RUNBOOK.md) | Exact operating and verification commands |
| `workbench/specs/` | Stable capability records, acceptance, evidence, and proof |
| [docs/adr/REGISTER.md](../docs/adr/REGISTER.md) | The derived register of decision records |
| [SCHEMA.md](SCHEMA.md) | Wiki CRUD, metadata, sensitivity, and freshness rules |
| [design-concepts/](design-concepts/README.md) | Owner-directed articles explaining durable design models |
| [guidebooks/](guidebooks/) | Ordered procedures that outgrew the Runbook (empty) |

## Routing

| Question | Read first |
|---|---|
| How the Workbench is governed | [LEXICON.md](../../LEXICON.md) -> Governance Core, then `workbench/docs/adr/` |
| Why a layout, stance or entry-route decision was made | [docs/adr/REGISTER.md](../docs/adr/REGISTER.md) |

This product repository keeps no personal, machine, or deployment notes; it is
a `project` profile wiki. `guidebooks/` ships empty until the owner directs
one; `design-concepts/` carries the owner-directed articles routed above.

## Up-Link

Standalone room; no deployment wiki.

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
- [Wiki Routing, Version Stamps And Safe Source Reads](design-concepts/spec-S-033-silent-gap-diagnostics.md)
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
