---
date: 2026-10-03
supersedes:
canonicalized_in:
  - BLUEPRINT.md
  - AGENTS.md
---

# A miss found by a check continues the same Task unless the fix rewrites it

Landmark: Workflow.

When a check finds a miss and the fix is more of the same work, the same Task continues with an adjusted handoff. A new Task is opened only when the fix changes the Task enough that it has to be rewritten.

Why the owner chose it:

- The owner, in his own words (2026-10-03, correcting the earlier card): "If the fix is different than just continuing, and we have to rewrite the task. then yes. otherwise. just use the same task, with an adjusted handoff."

Considered and rejected: a new Task for every finding, which the owner corrected on 2026-10-03 in the words above. No other alternative is recorded.

Consequences: The owner stated that promotion changes the `AGENTS.md` corrective-Task rule and the verdict behavior that creates one corrective Task per finding. No other consequences are recorded as owner words. The later-gap half of the owner's corrective-work answer is carried by [Working artifacts are scaffolding, cleared away once their knowledge is kept](../000M-working-artifacts-are-scaffolding-cleared-away-once-their-knowledge-is-kept.md) and is not restated here. Accepted records that cover part of this, not restated here: [Work passes two QA gates: spec branch to integration and integration to main](../../adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md), which the corrective-work Spec amends where it said a failing review creates corrective Tasks.

Provenance: the Blueprint teardown grilling of 2026-10-02 to 2026-10-03: the corrective-work answer, question WHY-A9, confirmed on the review page on 2026-10-03.
