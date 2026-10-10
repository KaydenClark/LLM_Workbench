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
