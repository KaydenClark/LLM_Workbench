# TK-005T - State the corrective rules in the AGENTS corrective sections, the template mirror and the to-tasks skill

**Task ID:** TK-005T
**Spec ID:** S-004F
**Slice:** State the corrective rules in the AGENTS corrective sections, the template mirror and the to-tasks skill
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-005S
**Destination:** spec-acceptance: `AGENTS.md`, `RUNBOOK.md` and their template mirrors state the same-Task rule and the new-Spec rule, and no current-facing line in them still makes every finding a new Task or anchors later work to a Wiki claim.
**Planned verification:** Red: a pin in `tools/test-control-fidelity.mjs` over `AGENTS.md` and `templates/AGENTS.md` fails because Assembled Review And Corrective Return still says a failed review creates one corrective Task per finding and forbids reopening a done record, Owner Closure And Reconciliation still says `approve --finding` creates corrective Tasks and that later gaps use corrective Tasks anchored to a Wiki claim, the Wiki-lint line still says its findings become corrective Tasks, and the `to-tasks` skill still names `wiki-claim: <the reconciled claim>` as a corrective Destination. Green: those lines state the continue-or-new rule, the later-gap new-Spec rule and the Wiki as evidence, the pins pass on the root and the template, the AGENTS section headings and their inbound anchors (`#assembled-review-and-corrective-return`, `#owner-closure-and-reconciliation`) are unchanged, and the template mirror carries the same sentences with no repository specifics. The full AGENTS suite, the Wiki lint of touched pages and the Workbench self-drift pre and post receipts pass on the committed candidate.

## Outcome

The two controls every session loads say what the tools now do: a miss found by a
check continues the same Task unless the fix rewrites it, and a later gap
against delivered work is a new Spec under its landmark or the Blueprint, never
a revived record and never anchored to a Wiki claim. The Task author's skill
agrees. After this Task lands the Contract Carrier Pointer-Brief Rewrite may take
its next `AGENTS.md` writer turn and moves the rules exactly as they then read.

## Scope

- `AGENTS.md`: Assembled Review And Corrective Return, the corrective sentences in
  Owner Closure And Reconciliation, and the whole-Wiki-lint sentence in
  Documentation Ownership And Proof; the matching passages of
  `templates/AGENTS.md`, which the Spec requires.
- `workbench/skills/to-tasks/SKILL.md`: the corrective Destination line.
- The pins in `tools/test-control-fidelity.mjs` that read these passages.
- Wiki pages whose claims change, linted.
- Takes the `AGENTS.md` writer turn. `RUNBOOK.md`, the Lexicon and the Blueprint
  are not edited here (TK-005U, TK-005V and TK-005W carry them).

## Acceptance

- [ ] `AGENTS.md` and `templates/AGENTS.md` state both rules, and no
      current-facing line makes every finding a new Task or anchors later work to
      a Wiki claim.
- [ ] The `to-tasks` skill no longer offers a Wiki claim as a corrective
      Destination.
- [ ] Every inbound anchor for the changed headings still resolves.
- [ ] Touched Wiki pages lint clean and the self-drift receipts are recorded.

## Boundaries

Wording follows the tooling TK-005R and TK-005S delivered and the decision records
TK-005Q recorded; no rule beyond the owner's two answers is added.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004f-tk005t | 086c4395cb945c7e548ba3e6203f17c671edde2f | ahead 0 behind 0 | 1 | Full AGENTS suite on committed candidate 086c4395: 48 of 48 commands pass; red first (new pin over AGENTS.md, templates/AGENTS.md and the to-tasks skill and the retargeted Corrective return pin failed against the old wording), then green in tools/test-control-fidelity.mjs 32 pass; wiki.mjs validate ok; guardrail audit 78/100 before and after (static 20/20, drift 25/25, benchmark 25/25, outcome 8/30 unchanged, no outcome claim); self-drift pre and post both report the same 12 findings, all blocked-slice findings in another Spec's Task chain, none about this change | AGENTS.md, templates/AGENTS.md, workbench/skills/to-tasks/SKILL.md, tools/test-control-fidelity.mjs; Spec Remaining Limitations records the README, Wiki schema and Lexicon pin items for their owners | RUNBOOK, Lexicon rows, Blueprint passages, README and the Wiki schema line still state the replaced rules; owned by TK-005U, TK-005V, TK-005W and their owners | 8b333a6d0add8a2b9ba7a95d2dbc2d5f2ab37beac16030df49493a193be1dc27 |
