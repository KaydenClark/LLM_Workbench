---
type: design-concept
status: active
sensitivity: normal
knowledge_role: curated
provenance:
  - Seeded from the current answers of the Agent Stances landmark's question cards (landmark record revision 1), 2026-10-04
  - Implement-spec Skill Adoption Spec (S-002T) qualified the correction-Worker boundary, 2026-10-06
source_paths:
  - workbench/landmark-tracker/landmarks
  - workbench/landmark-tracker/destination-questions
  - workbench/docs/adr/0036-stances-change-method-not-authority.md
  - workbench/docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md
  - workbench/wiki/design-concepts/roles-and-stances.md
  - workbench/specs/S-002T-implement-spec-skill-adoption/SPEC.md
  - workbench/skills/spec-manager/SKILL.md
parent: none
authorized_by: the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages); the Implement-spec Skill Adoption Spec (S-002T) for the correction exception
last_verified: 2026-10-04
---

# Landmark: Agent Stances

This page is the evolving synthesis of the Agent Stances landmark
(landmark ["Agent Stances" (LMK-000R)](../../landmark-tracker/landmarks/LMK-000R.json)).
It sums up, in prose, what the landmark's five question cards currently say and
is updated whenever one of them changes. The cards and the landmark record keep
the structured account and the lineage; the decision records and Specs named
below govern. The fuller explanation of how roles and stances compose, including
the accepted Captain and landmark Director ladder, is the article
[Roles and stances](roles-and-stances.md); this page summarizes and routes to it
rather than repeating it.

## What the landmark is

Builder, Auditor, Reviewer and Reconciler give an agent distinct methods for one
piece of work without changing what it is allowed to do. The landmark matters
because a stance that quietly granted authority, or a role that quietly widened
scope, would let an agent act beyond what its assignment, the Contract and the
owner allow.

## Current accepted answers

The first card records that the owner explicitly confirmed the role and stance
points and the documentation, specification and integration endpoint on
2026-09-27. For the other four cards the source answers were settled by the
owner in their grilling sessions; their grouping and titles are agent work and
were not separately confirmed. This page states the settled answers as claims
and the grouping as structure only.

**Role sets scope, stance sets the job.** A role defines the scope of
responsibility: the Director covers the project and integration, a Dispatcher
one Spec and its branch, and a Worker one Task. Spec Planner and Spec Manager
are separate stances a Dispatcher can use, each with its own Spec: the Planner
prepares small parallel vertical slices and may use Workers to author Tasks,
and the Manager dispatches and monitors execution. Reviewer and Auditor remain
stances, and the Director coordinates cross-Spec work
(card ["Role scope and stance jobs for Spec delivery" (DQC-000A)](../../landmark-tracker/destination-questions/DQC-000A.json), revision 9).
A Task is one-to-one with a Chat: a few Chats for one Task is allowed but is not
how it should be done, so make the Task smaller, still vertical; one Chat should
not do several Tasks. A Dispatcher or Director watches the Spec, writes
handoffs, opens a new Chat per unblocked Task and approves, and never executes
Tasks itself
(card [DQC-002Z: "What work should a dispatcher or director perform without executing Tasks?"](../../landmark-tracker/destination-questions/DQC-002Z.json), revision 6).

The [Implement-spec Skill Adoption Spec (S-002T)](../../specs/S-002T-implement-spec-skill-adoption/SPEC.md) records a newer bounded exception for its owner-invoked correction pass. The [Spec Manager stance](../../skills/spec-manager/SKILL.md) may reuse one correction Worker across explicitly named Task scopes, with serial claims and separate per-Task proof; it grants no general multi-Spec authority. The cited question-card answer remains its older source lineage.


**Four portable stance skills.** All four stances are packaged as portable stance
skills. A stance says how an agent performs one task with the authority,
responsibilities, good practices and composing skills suited to that work.
Loading a stance never spawns a sub-agent; Builder, for example, must make sure
review and verification happen. Cross-provider discovery is kept, so a stance
stored in a nested folder also needs a flat top-level link for Claude's
one-level scan
(card [DQC-003C: "How should the four agent stances be packaged and composed?"](../../landmark-tracker/destination-questions/DQC-003C.json), revision 6).

**The common contract.** A stance never grants, removes or transfers authority;
it only changes how the model behaves within authority set before it was
adopted. Every stance defines Purpose, Method / Posture, Obligations, and
Completion / Exit Condition, and may add intrinsic constraints, such as Reviewer
evaluating rather than quietly repairing. Changing stance creates no handoff, so
one task may move from Builder to Reviewer to Builder to Reconciler without a
break
(card [DQC-003D: "What common contract must every stance explain?"](../../landmark-tracker/destination-questions/DQC-003D.json), revision 5).

**Who picks the stance.** The normal task stance is set in the assigned Spec and
Task; the arriving agent does not choose or record its own. A stance decision
may arise only once work enters troubleshooting mode, and what happens there is
outside the scope of the grilling that settled this
(card [DQC-003E: "Who selects the normal stance for an assignment?"](../../landmark-tracker/destination-questions/DQC-003E.json), revision 5).

The accepted decision behind the stance rules is
[Assigned portable stances change method, not authority](../../docs/adr/0036-stances-change-method-not-authority.md).

## Open and unresolved

- The card on dispatcher and director work records an open question with no
  owner answer: whether any missing behavior is left after the two earlier
  review-and-approval questions, or those were merely possible implementations.
- Revised by a newer decision: the role card still records the Director as
  covering the project and integration. The decision record
  [Captain, Director, Dispatcher and Worker scope work and role skills own each job](../../docs/adr/000V-captain-director-dispatcher-and-worker-scope-work-and-role-skills-own-each-job.md)
  (2026-10-02) makes the integration role the Captain, makes the Director one
  landmark lane under it, and moves each role's job from the always-loaded
  controls into its role skill. The card has not been updated. The
  [Roles and stances](roles-and-stances.md) article already carries the newer
  shape, and the current controls still describe the earlier one until that
  decision lands in them.
- Troubleshooting stance policy is deliberately outside the settled answers; no
  card decides it.
- How a stance affects independent-review eligibility is not restated on these
  cards; the controls say prior involvement still decides it
  ([AGENTS](../../../AGENTS.md#assigned-work-and-stances)).
- Inference: a Task carrying a Stance field is how the Spec and Task assign the
  normal stance, and Spec records here do carry one; the cards do not spell out
  that field's full rules.

## Where the work lives

The decision is the record named above. The role Specs are
[Director Role (S-002C)](../../specs/S-002C-director-role/SPEC.md),
[Dispatcher Role (S-002D)](../../specs/S-002D-dispatcher-role/SPEC.md),
[Worker Role (S-002E)](../../specs/S-002E-worker-role/SPEC.md),
[Spec Planner Stance (S-002F)](../../specs/S-002F-spec-planner-stance/SPEC.md) and
[Spec Manager Stance (S-002G)](../../specs/S-002G-spec-manager-stance/SPEC.md); the
Captain and landmark Director change is planned in
[Captain Role And Landmark Director (S-004B)](../../specs/S-004B-captain-role-and-landmark-director/SPEC.md).
The four stance skills have rebuild Specs:
[builder skill rebuild (S-01P)](../../specs/S-01P-builder-skill-rebuild/SPEC.md),
[auditor skill rebuild (S-01Q)](../../specs/S-01Q-auditor-skill-rebuild/SPEC.md),
[reviewer skill rebuild (S-01R)](../../specs/S-01R-reviewer-skill-rebuild/SPEC.md) and
[reconciler skill rebuild (S-01S)](../../specs/S-01S-reconciler-skill-rebuild/SPEC.md).
Their sources sit in the skills lane, and the Wiki holds one note per skill, for
example [the builder note](../skill-builder.md) and
[the reviewer note](../skill-reviewer.md). The controls are
[AGENTS](../../../AGENTS.md#assigned-work-and-stances), the vocabulary is
[LEXICON](../../../LEXICON.md#stance-terms) and the operating procedure is
[RUNBOOK](../../../RUNBOOK.md#role-and-stance-coordination).

## Related pages

- [Roles and stances](roles-and-stances.md): the owner-facing explanation this page routes to.
- [Landmark: Verification](landmark-verification.md): who may review and approve at each gate.
- [Landmark: Session Transport](landmark-session-transport.md): handoffs between agents.

## Evidence and Sources

- [Landmark record "Agent Stances" (LMK-000R)](../../landmark-tracker/landmarks/LMK-000R.json): title, summary, importance and history.
- The five question cards named above, each at the revision cited: they hold the answers, confirmation basis, open uncertainties and named claims this page summarizes.
- [The Wiki is the evolving synthesis every agent reads and updates](../../docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md): why this page exists.

## History

- 2026-10-06: linked the newer bounded correction exception accepted by the Implement-spec Skill Adoption Spec (S-002T), preserving the question-card revisions and their source lineage.

- 2026-10-04: created by the Wiki Evolving-Synthesis Migration Spec (S-003W), Task TK-004 (landmark synthesis pages), seeded from the cards' current answers.
