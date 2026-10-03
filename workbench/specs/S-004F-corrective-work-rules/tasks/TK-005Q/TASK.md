# TK-005Q - Record the same-Task rule and narrow the accepted records that state the replaced rules

**Task ID:** TK-005Q
**Spec ID:** S-004F
**Slice:** Record the same-Task rule and narrow the accepted records that state the replaced rules
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: No active accepted decision claim states the replaced rules, and the record that narrows or supersedes them carries the owner's two answers.
**Planned verification:** Red: a pin in `tools/test-control-fidelity.mjs` fails because the accepted records ADR-000F, ADR-000G, ADR-000H, ADR-000I, ADR-000R and ADR-000U still state a failed check as one new corrective Task per finding and a later repair as a correction against a Wiki claim, and no accepted record carries the same-Task rule. Green: a new destination decision record carries the owner's same-Task answer and is accepted through the accept move; the six ADRs are amended in place under the amendment-first rule, each recording the changed premise and the Git anchor of its earlier text; `adr.mjs validate` passes for both record kinds, the registers are regenerated, `tools/test-adr.mjs` and the full AGENTS suite pass on the committed candidate.

## Outcome

The decision records agree with the owner's two corrective-work answers. The
same-Task answer, which no accepted record carries today, is recorded as its own
destination decision. The later-gap answer already sits in the accepted
scaffolding decision record, which states as fact that the lifecycle and
three-altitudes ADRs still describe the Wiki-claim route and that this Spec
carries the change; this Task makes that change.

## Scope

- One new destination decision record for the same-Task rule, written with
  `adr.mjs new --kind ddr`, filled only with the owner's locked text and his own
  words from the Spec, and accepted with `adr.mjs accept`.
- In-place amendments to ADR-000F (failing creates corrective Tasks), ADR-000G,
  ADR-000H and ADR-000I (a later repair uses its Wiki claim), ADR-000R point 9
  (whole-Wiki lint findings become corrective Tasks) and ADR-000U point 5 (a
  failed landmark review produces corrective Tasks), each naming the changed
  premise and the `git show` anchor of the text it replaces.
- A pin in `tools/test-control-fidelity.mjs` that the accepted records no longer
  state the replaced rules as current, and the matching updates to the ADR pins
  and link census in `tools/test-adr.mjs`.

## Acceptance

- [ ] The same-Task answer is an accepted destination decision record carrying
      the owner's locked text and his own words, with no agent reason presented
      as his.
- [ ] No accepted ADR or DDR states, as current, that every finding becomes a new
      Task or that a later gap is a correction anchored to a Wiki claim.
- [ ] Each amended ADR keeps its identity, reasons and alternatives and names the
      changed premise and where the earlier text can be read.
- [ ] `adr.mjs validate` passes for both kinds and the registers are current.

## Boundaries

No `AGENTS.md`, `RUNBOOK.md`, Lexicon, template, Blueprint or tooling change. The
Blueprint's corrective passages and the Lexicon rows belong to their own owners
and are reported, not edited. Promote only the owner's locked words.
