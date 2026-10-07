# Publish a Promotion Stage

Publish the current record stage through the existing Git and review route.
This action belongs to `promote`; it creates no new store or service.
Local authoring, a pushed recovery branch and verified integration availability
are separate results.

1. Resolve the target from `git.integrationBranch` in the project manifest.
   Fetch it and pin its current SHA. Inspect dirty work, active writers and any
   existing PR for the stage before authoring or retrying. Use a record-only
   branch from current integration; keep unfinished implementation on its own
   branch. Where a control or skill change implements a required behavior,
   keep its assigned delivery and applicable assembled review gates.

2. Inspect the complete candidate diff. Include only this stage's owners and
   required projections. Check exact answers, rationale, scope, revisions and
   source links against the confirmed selection. Accepted decisions may name
   future behavior; they must not say that unfinished behavior is implemented.
   Run the changed owners' checks and the room's required verification.

3. Compose `save` for the already-authored result under this scope, then use
   the room's [version-control procedure](../../implement/SKILL.md#version-control-procedures)
   to commit, push and open or reuse the integration PR. Pass the named stage,
   owners and endpoint so `save` does not invoke the parent workflow again.
   Name the exact base and candidate. A branch push is remote recovery only.

4. Follow the [review boundary](../../implement/SKILL.md#4-review-at-the-relevant-boundary)
   for that candidate and the
   [branch completion route](../../implement/SKILL.md#branch-completion).
   Record-only publication does not close or approve the implementation Spec.
   A Task PR carries its two merge answers; separate-context Review belongs
   to the assembled capability. Skill and Contract delivery retains its own
   required review. Pending review or failed checks hold this stage.

5. Once the authorized merge succeeds, fetch integration again. Prove
   `git merge-base --is-ancestor <candidate> <fresh integration ref>` when the
   merge route retains candidate ancestry. For a squash/rebase route, identify
   and verify the actual merged commit and compare every intended owner byte;
   do not claim the original candidate is an ancestor when it is not.
   Read every changed owner with `git show <verified integration SHA>:<path>`
   and compare its bytes and meaning with the inspected candidate. Verify any
   pending implementation commit remains outside integration. This read-back
   and the applicable merge evidence establish this stage's publication.

6. Record the actual merged commit, verified integration SHA, owner paths,
   checks and next stage in the existing owning Spec when one exists, and in
   local continuity. A docs-only run creates no Spec merely for a receipt.
   Follow normal cleanup only after containment; retain unresolved decisions,
   source corrections and active handoffs. If the next stage has nothing to
   author, verify its existing records instead of creating duplicate work.

On failure, stop dependent stages and preserve the last verified point, local
candidate, PR and exact next action. On retry, inspect live PR state and fetch
integration first. A merged stage is read back and reused; an unmerged one
resumes its branch. Reconcile a changed owner or competing writer before
reapplying. Never force a stale candidate or duplicate a published record.
Publication is not implementation acceptance, owner Human QA or main promotion.
