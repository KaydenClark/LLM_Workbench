---
type: memory
status: draft
sensitivity: normal
knowledge_role: curated
skill: implement-spec
group: main-workflow
skill_source: core
origin: matt
matt_counterpart: engineering/implement-spec
supersedes: none
provenance:
  - Owner-confirmed nine-step Workbench adaptation, 2026-10-06
  - Matt Pocock implement-spec at d81f3a183412e71a5b1e84ca21bc1a35eea03a60
source_paths:
  - workbench/skills/implement-spec/SKILL.md
  - workbench/specs/S-002T-implement-spec-skill-adoption/SPEC.md
  - workbench/manifest.json
  - THIRD_PARTY_NOTICES.md
last_verified: 2026-10-06
---
# Implement Spec: carry a sliced Spec to a PR ready for review

## What it does

You provide an authorized Spec whose Tasks are already planned. The Dispatcher orchestrates Workers, assembles their checked results, arranges evaluation and corrections, and prepares one PR for integration review. You supervise the destination rather than individual Tasks. The [source](../../../skills/implement-spec/SKILL.md) owns the procedure; the [implement-spec skill adoption Spec (S-002T)](../../../specs/S-002T-implement-spec-skill-adoption/SPEC.md) owns delivery proof and remaining gates.

## When to reach for it

| What you have | Reach for |
|---|---|
| A sliced authorized Spec and an explicit ready-PR endpoint | implement-spec |
| One assigned Task to implement | [implement](../../../skills/implement/SKILL.md) |
| Initial Task planning | [to-tasks](../../../skills/to-tasks/SKILL.md) |
| An existing assignment with a broader authorized delivery endpoint | [carry](../../../skills/carry/SKILL.md) |

## What it needs

An explicit owner invocation, the project manifest, an authorized Spec and Task graph, a host that supports Worker agents and isolated worktrees, Git and the target repository's PR operation. Claims, verification and lifecycle use the project's current Contract. One durable writer maintains shared records; Workers return proof. No global queue, observer or deterministic runner is required.

The first installation is Workbench-only, declared under maintainerSkills rather than skillPolicy.required. Template 2's skill_source value core names the workbench/skills source lane here; this entry is outside the closed 29-skill Core bundle and is not installed into generated rooms. Both existing host adapters resolve to that lane. Explicit path invocation and adapter resolution are separate from ordinary-prompt discovery, which needs an actual provider trace.

## What it reads and writes

It reads the manifest, controls, assigned Spec and Task records, directly connected prerequisite records, research context and exact commits. Through Workers it writes implementation and documentation on isolated Task branches. Assembly accumulates verified results. The single state writer updates original Task/Spec proof and generated projections; the repository's PR operation publishes readiness. Local research notes stay in declared ignored session collections. The source creates no new parallel tracker.

## How it works

### Assemble verified results

Workers branch from assembly and return exact commits after testing against its latest tip. Serialized merges check the resulting candidate before releasing dependent Tasks. Prerequisites from another Spec remain owned by that Spec; availability in this assembly does not make them available in every other branch.

### Evaluate, correct and hand off

One full building-side evaluation precedes one Worker correction pass. Corrections merge through the same checked path, followed by focused verification and required checks. Unresolved findings preserve draft status and continuation. Passing evaluation publishes a ready PR and next gate; cleanup preserves assembly and proof. Later independent integration review, merge and owner approval remain separate.

## Common questions

**Does the Dispatcher implement when Workers are unavailable?** No. Preserve state and report the missing capability. Other compatible ready work may continue when only one Task is blocked.

**Does this plan Tasks or merge integration?** Neither is part of its invocation endpoint. Start with a sliced Spec and stop before integration merge.

**Can a Director invoke it automatically?** The first version is owner-launched. Do not infer cross-host invocation policy from frontmatter or treat assignment alone as an autonomous invocation route.

## It's working if

Worker commits and test proof are real; assembly checks hold after merges; dependency release follows verified containment; original ownership survives; corrections reach the final candidate; and readiness or a truthful recoverable blocker is recorded. Adapter/catalog checks establish routing only. The Spec carries the actual fresh-context observation and its limitations; this article claims no reliability improvement or owner approval.

## Where it fits

Plan -> implement-spec assembly/evaluation -> ready PR -> independent integration Review/Verify -> integration -> owner approval/main.

It is an operation used by the [Dispatcher](../../skill-dispatcher.md) in the [Spec Manager stance](../../skill-spec-manager.md), rather than another role. implement implements one Task; carry preserves an already-authorized endpoint; Dispatcher supplies role scope; Spec Manager supplies execution posture.

--- draft only, stripped on promotion ---

## Compared with Matt's

Counterpart: [Matt Pocock engineering/implement-spec at the pinned source](https://github.com/mattpocock/skills/blob/d81f3a183412e71a5b1e84ca21bc1a35eea03a60/skills/engineering/implement-spec/SKILL.md). Verdict: close. The nine-step graph, concurrent implementers, assembly, evaluation and cleanup shape is retained. Workbench adds its role boundaries, original ownership, exact proof, branch-specific readiness and explicit ready-PR endpoint. Matt's per-run integration branch corresponds to Workbench assembly. Attribution and MIT terms are retained in [Third-Party Notices](../../../../THIRD_PARTY_NOTICES.md).

## Findings

F:implement-spec:01 | overlap | Spec Manager and Dispatcher already own scope and execution posture; this entry owns the ready-PR orchestration operation and composes those boundaries | implement-spec skill adoption Spec (S-002T)
F:implement-spec:02 | overlap | implement owns one Task and carry owns the authorized endpoint; this operation consumes a sliced graph without replacing either | implement-spec skill adoption Spec (S-002T)
F:implement-spec:03 | gap | Ordinary-prompt discovery, automatic Director invocation and portable Core installation remain outside the Workbench-only explicit first version | implement-spec skill adoption Spec (S-002T)

## Sources and history

- October 6, 2026: Owner confirmed the complete draft and authorized usable installation. Source, catalog and role/procedure reconciliation are delivered together; actual proof is retained in the owning Spec.
- [Template 2](../TEMPLATE.md) owns this draft's section shape. The draft remains curated context and supplies no independent authority.
