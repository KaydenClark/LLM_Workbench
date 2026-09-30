# TK-01P - The controls and templates carry the rest of S-00V Documentation Impact

**Task ID:** TK-01P
**Spec ID:** S-00V
**Slice:** The controls and templates carry the rest of S-00V Documentation Impact
**Status:** blocked
**Blockers:** S-00P, TK-00K, TK-01K, TK-01L, TK-01N
**Destination:** spec-acceptance: S-00V Documentation Impact (AGENTS capability-blocked rule and claim push, RUNBOOK host floor, claim push and fetch, round-trip gate wording and host-portability matrix heading, BLUEPRINT portable harness sentences, LEXICON Claim row, templates mirror); completion needs it under AGENTS Documentation Ownership
**Stance:** Builder
**Planned verification:** `tools/test-control-fidelity.mjs`, `tools/test-controls-vocabulary-sweep.mjs` and `tools/evaluate-workbench.mjs --path templates --include-controls` green with the new wording; every needed-wording entry recorded in S-00V's gap by earlier Tasks is applied or explicitly dispositioned; full AGENTS suite; separate-context review.

## Delivery

Apply the Documentation Impact items no earlier Task could write because S-00P
is rewriting the controls: the AGENTS capability-blocked Task rule and claim
push in Git Rules; RUNBOOK host floor check, claim push and fetch, round-trip
gate wording and the Portability and privacy matrix heading reading as host
portability; BLUEPRINT's "portable operating harness" opening and Portability
quality sentence pointing at the Lexicon definition; a LEXICON Claim row if one
is added; the generic mirror in `templates/`.

**Collision hold.** Here `S-00P` means the whole controls rewrite (TK-002..TK-005)
is contained in `origin/integration`, which is the same condition the Spec id
expresses; write onto the rewritten controls, never onto the pre-rewrite text.

## Done Criteria

- No Documentation Impact item is left unapplied without a recorded reason.
