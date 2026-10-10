# Required Integration Branch verification

Source comparison: integration `bcb8cfa0a685b67d151e5102d3f2cc855a13613b` to runtime candidate `05697fdefd8c3a73064f73c961899058bab6b0ca`. The subsequent `5b9f5f3c` commit changes only the diagnostic reference text in `workbench/skills/workbench-runtime/SKILL.md`.

- Red: `node tools/test-integration-setup.mjs` failed because the branch-creation export was absent.
- Green: that check passes against disposable repositories. It exercises creation from main while HEAD stays on a task branch, unchanged existing local and remote refs, exact branch case, identical-name refusal, missing-default refusal, and a repository not yet initialized.
- Adoption's CLI regression passes: missing integration is created at main's SHA, the recovery record names creation, and doctor no longer reports the missing branch. Existing exact-case Integration is retained.
- The Runbook Full suite ran all 57 commands on the runtime candidate: 56 passed; control fidelity alone failed because the two new Git error names were absent from the procedure table. After the documentation-only correction, `node tools/test-control-fidelity.mjs` passed 39/39. Every required command has a passing result; this is a full run plus its scoped corrected rerun, not a single 57/57 run on the later documentation commit.
- Earlier runs exposed the old omission assertion, changed ADR link count, missing diagnostic registration, and a source-cleanliness race caused by editing templates while tests ran. Those were corrected; the fixed runtime-candidate run had none of those failures.
- `wiki.mjs validate` passes. Small Wiki lint checked the touched branch feature article against its incoming router and outgoing branch decision, Spec and runtime owners. Historical omission policy is explicitly dated; current requirements and candidate delivery are distinguished.
- Final comparison passes `git diff --check`. Self-QA traced branch creation through adoption preflight, declaration, layout initialization, recovery output and completion protocols. The helper changes no existing ref, checkout, or published history. Remote publication remains a protocol obligation, not a helper side effect.
- Guardrail baseline and after-score: 73/100 in both. Remaining recommendations: fresh Taskboard proof and real repeated outcome trials, controls/prior/candidate comparisons, recent evidence and uncertainty. No outcome or native host reliability claim follows.
- Pre/post self-drift reports both contain 24 unchanged findings: 12 blocked slices, six stale claims, five stale seeds and one unverified provenance finding. Both report `machineResult: blocked` and `cleanUpdate: false`. Bounded semantic review corrected current branch setup claims in root/template controls, skills, active ADR amendment and Wiki. Existing room-wide findings remain outside this correction; no clean whole-Workbench update is claimed.

The under-one-minute demo is `node tools/test-integration-setup.mjs`.

Limits: no Ringworld or other consumer repository was edited or upgraded. Existing installed rooms need the updated source applied through their normal update route. Independent assembled-Spec review, owner Human QA and default-branch promotion remain separate gates.

## Corrected Task run 2

Self-QA after the first close found that adoption checked for `blocked`, but the layout helper returns `invalid` on failure. The same Task continued with an adjusted handoff; its first proof and close evidence remain preserved. The new CLI regression failed with `migration-failed` instead of the branch error, showing that migration had continued after failed branch setup.

Runtime candidate: `aae2f71a11db88c71703d4bcf81a9b807f49b112`.

- Adoption now accepts only `created` or `existing` branch setup states.
- The actual CLI now refuses a project outside Git and an unresolved declared default branch with the named branch errors. Both tests verify no `workbench/` layout was written. Existing successful branch creation and preservation checks still pass.
- `node tools/verify.mjs` passed all 57 commands on this clean candidate in 930.2 seconds, including the corrected fidelity reference and the append-only history replay.
- [Canonical CI run 38015157081](https://github.com/KaydenClark/LLM_Workbench/actions/runs/38015157081) completed successfully for that runtime candidate.
- The post-correction self-drift result still has the same 24 baseline findings and does not certify a clean whole-Workbench update. Scope, consumer-installation limits and owner gates above remain in force.

The run-2 results replace the first run's sufficiency claim for the refusal path. Later Task/Spec receipt and closure changes are administrative state, verified with render, doctor, Wiki validation and diff checks; they change no runtime code.

## Integration delivery

[Task PR 453](https://github.com/KaydenClark/LLM_Workbench/pull/453) merged into integration at `acc318fecddc8b4d3a0cccb3e5e2884d06ee377a`. A fresh fetch and `git merge-base --is-ancestor 5f6dd2a1d297a993704ff15395111f8932bc86eb origin/integration` proved exact submitted-head containment.

[Final submission CI run 38017004701](https://github.com/KaydenClark/LLM_Workbench/actions/runs/38017004701) attempt 1 failed in the unchanged notepad mixed-writer barrier test, returning retained-dependency instead of stale-revision. That test and notepad implementation have no diff from the integration base. Its isolated local probe passed 1/1. Attempt 2 passed the canonical full suite on the same head. No notepad code or test criterion was changed. This records an observed timing-dependent CI failure; it does not claim that the underlying notepad race is resolved.

Main and consumer repositories remain unchanged. Assembled Spec review and owner gates are separately recorded in the Spec.

## Review documentation correction

Fresh Codex context `/root/integration_spec_review` failed assembled candidate
`f8ccf5c26cad18751462f280d9d1e2a38850a1bd`, digest
`a867734916f93948cd2b355f1677ce02f1dda378be705a5c96bdd66a2404e92b`.
The runtime checks passed, but linked Genesis and Adoption Wiki pages still
allowed incomplete setup and retained a partly resolved default-detection gap.
The Spec also described its old state at an incorrect relative tree. Native
`verdict` preserved that failure and continued the same Task for both findings.

Correction tree `b168b7fb3a201fc1768efc6333930cb201ef76fd` passed the canonical
`node tools/verify.mjs`: all 57 commands, 821.0 seconds. Wiki validation, the
branch setup regression and diff checks passed. The one-command demo remains
`node tools/test-integration-setup.mjs`. Small lint read both setup articles
against their tracked skill/protocol, branch feature, Spec and Wiki router.
Dated prior trials remain history; neither trial was rerun. Runtime, tools,
templates and skills have no changes after verified runtime `aae2f71a`.

After that run, only receipt/evidence/state updates and a Spec sentence marking
the Wiki correction as present were added. These were read back and checked
with Wiki validation and diff checks. The prior failed Review is not cleared
by tests: fresh assembled Review remains required after this Task lands.

Review Wiki coverage was bounded: all-Wiki branch-policy searches and reading
of matching setup, readiness, installation and workflow articles. This does
not prove exhaustive whole-Wiki cleanliness. Pre/post self-drift retains the
same 24 known findings (12 blocked slices, 6 stale claims, 5 stale seeds, one
unverified provenance); machineResult is blocked and cleanUpdate is false.
Primary checkout fast-forward pre/post has the same findings and preserves
its unrelated untracked folder. Owner approval, main verification and consumer
upgrades remain outside this delivery.
