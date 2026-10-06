---
name: implement-spec
description: "Implement a sliced Workbench Spec and prepare its assembly-to-integration PR for review."
disable-model-invocation: true
---

Start with an authorized Spec already sliced into Tasks. Resolve their records
through the project manifest. Follow the Workbench Contract and its existing
claim, verification and lifecycle procedures.

The goal is the entire Spec implemented on one **assembly branch**, with a PR
into the project's **integration branch** marked ready for review.

The Dispatcher **orchestrates**; Workers **implement** every change and
correction. Directors coordinate multiple Dispatchers and parallel Specs.

Task dependencies form a **graph** and determine which Tasks are ready. Run
compatible Workers concurrently, respecting active claims and shared writers.

Communicate through **context pointers** to the Spec, Tasks, research notes and
previous commits.

## Steps

1. Read the Spec and Tasks to recover progress and understand dependencies.
   Directly connected Tasks from other Specs may unblock this Spec. Without a
   Director, delegate only those necessary Tasks to Workers, taking the smallest
   number of reversible actions and preserving original Spec links.

2. Optionally use an **exploration subagent** for source or documentation research.
   Save its notes in local, untracked context accessible to future Workers.

3. Create or resume the **assembly branch** from current project integration.
   Open a draft PR into integration after the first merge, linked to the Spec
   and included Tasks.

4. Dispatch **implementer Workers**, each in its own worktree and branch based
   on assembly. Each uses red/green TDD and required Task checks, merges the
   latest assembly tip before hand-back, rechecks affected work, and returns
   exact commits, proof, documentation and remaining gaps.

5. Use a **merger subagent** to merge verified results into assembly one at a
   time and check the resulting assembly SHA before releasing dependent Tasks.
   Delegate implementation fixes to Workers. Necessary cross-Spec results merge
   here too; their records and proof stay under their original Specs, which
   remain unfinished until their own completion requirements are met.

6. Recompute readiness from verified results contained in this assembly,
   without waiting for PR or tracker closure. A dependency is satisfied for
   this run only when its verified result is contained here. Start newly ready,
   compatible Workers. One state writer maintains Task proof and owning records.

7. Once all Tasks are assembled, arrange one full **code-review** and send
   fixes to one **implementer Worker** for one correction pass. Merge corrections
   through step 5, then run focused verification and required checks on the
   final assembly candidate. This is building-side evaluation; integration
   approval follows later. Unresolved findings keep the PR draft with a clear
   continuation point.

8. When evaluation and checks pass, mark the PR ready for integration
   **review -> verify**. Record the PR, final candidate, verification and next
   gate in the owning Spec and regenerate its projection so later Workbench
   activity can discover readiness.

9. Clean up implementer worktrees through the host's supported operation after
   preserving proof and verifying their commits are contained in assembly.
   Keep assembly available for review. Report the assembly branch and PR;
   the run ends before integration merge.

If required capabilities are missing or no safe work can advance, preserve
state and report the blocker. The Dispatcher does not implement instead.
