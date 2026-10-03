---
date: 2026-10-02
canonicalized_in:
  - LEXICON.md
---

# Captain, Director, Dispatcher and Worker scope work and role skills own each job

## Decision

The role ladder gains a level for the landmark
([ADR-000U](000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md))
and each role's job moves out of the always-loaded Contract into its role
skill. The owner confirmed these points in a grilling on 2026-10-02:

1. **One Director per branch.** The Director working from integration can
   assign a sub-Director to a landmark. Because a landmark is a lane rather than
   a branch, that sub-Director owns the landmark's lane: it assigns the lane's
   Dispatchers and owns the landmark's review.
2. **Captain and Director.** The two get different names. The integration role
   is the **Captain**; a landmark's role is the **Director**. The ladder is
   Captain (integration; assigns Directors to landmarks; coordinates across
   landmarks; oversees Specs that sit under the Blueprint), then Director (one
   landmark lane), then Dispatcher (one Spec), then Worker (one Task). The name
   Director stays with the job it mostly keeps, assigning Dispatchers and giving
   the separate review of the work below it, one level down; the new
   integration job takes the new name.
3. **Role detail leaves the Contract.** The owner's objection: role detail was
   hard-written into AGENTS and the Lexicon, when the point of a skill and a
   role was to keep it out and stop it bloating the Contract. AGENTS keeps only
   role-free rules, such as scope by branch, the independence of review and
   owner-only approval and promotion to main. The Lexicon keeps one sentence per
   role saying what it is, pointing at its skill. The role skills own what each
   role does: whom it assigns, what it reviews and its hand-back. The
   Destination Packet links the role skill, so an agent always receives its job
   description with its work.

Considered and rejected: one Director for the whole project including every
landmark (too much context for one chat when several landmarks run); per-landmark
Directors under a project-level coordinator still called Director (one word for
two scopes); keeping Director at integration and naming the landmark role anew
(Director would then describe the job that moved); and keeping role detail in
AGENTS (the always-loaded file pays for it in every session). The strongest
case against moving role detail out: a skill loads only when used, so an agent
that skips its skill would not know which review it owes. The Destination
Packet linking the role skill turns that into a missing-packet problem rather
than a missing-rule problem.

## Consequences

This narrows [ADR-000P](000P-roles-scope-work-and-stances-define-the-job.md):
its sentence that the Director covers the project and integration now belongs
to the Captain, the Director covers one landmark lane, and the role definitions
it placed in the controls move to the role skills. Stances, the Dispatcher's
Spec scope, the Worker's Task scope and the review and QA gates of
[ADR-000F](000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md)
stand. The name Captain is reworked from its GPT_OS sense: the destination
ledger's v3 answer that kept Captain as Foundry machinery outside the portable
product no longer holds for this role name.

The root Lexicon carries the role sentences. This record performs no delivery:
taking the role detail out of AGENTS and RUNBOOK belongs to the Contract rewrite
in [ADR-000W](000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md),
and the Captain and Worker role skills, the landmark Director's job in the
director skill, and the template mirrors belong to the landmark and role work
that is not yet specified. Until then AGENTS and the existing role skills keep
their current wording, in which the Director is the integration role.

Provenance: owner-confirmed grilling of 2026-10-02 under the objective
"ddr-and-control-surface".
