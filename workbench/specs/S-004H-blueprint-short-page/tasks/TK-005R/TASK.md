# TK-005R - Make the evaluator and the guardrail audit recognize the four-part Blueprint at the owners that hold each criterion

**Task ID:** TK-005R
**Spec ID:** S-004H
**Slice:** Make the evaluator and the guardrail audit recognize the four-part Blueprint at the owners that hold each criterion
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: The evaluator and guardrail audit recognize the four-part Blueprint, no criterion was removed to keep a score, and the before and after scores are recorded.
**Planned verification:** Red first: `node tools/test-evaluate-workbench.mjs`, `node tools/test-guardrail-audit.mjs` and `node tools/test-workbench-layout.mjs` fail against a four-part fixture (the project model scores below its weight and the audit treats the four-part Blueprint as legacy). Then green with the eight-part fixture still scored as before. Baseline recorded before editing: guardrail audit 78/100 on this tree and the template evaluation 106.6/113. Full AGENTS suite on the committed candidate.

## Outcome

Changing the Blueprint's shape does not quietly lower the harness's score or
send the audit down its legacy path. Each of the five project-model checks
keeps its weight and finds its evidence where the four-part shape and the
Contract now hold it: the promise in the Blueprint's what-it-is and promised
outcomes, the architecture in the ownership schema and routing, the
invariants and safety boundaries in the Contract's safety and verification
sections plus the Blueprint's non-goals.

## Scope

Add the four-part shape as an additional recognized variant in
`tools/evaluate-workbench.mjs` and as a destination-shaped Blueprint in
`tools/audit-guardrails.mjs`; extend `tools/test-evaluate-workbench.mjs`,
`tools/test-guardrail-audit.mjs` and the Blueprint fixture in
`tools/test-workbench-layout.mjs`. Keep the eight-part variants working so the
swap lands without a scoring gap. Do not reweight, remove or loosen a check.

## Acceptance

- [ ] A four-part Blueprint plus the generic Contract scores the full project
      model weight, and removing any of the four headings or the Contract
      evidence loses credit.
- [ ] The audit detects the four-part Blueprint as destination-shaped.
- [ ] The before and after scores and remaining recommendations are recorded in
      the Spec evidence.

## Boundaries

No Blueprint, template or Contract edit; this Task only teaches the checks.
