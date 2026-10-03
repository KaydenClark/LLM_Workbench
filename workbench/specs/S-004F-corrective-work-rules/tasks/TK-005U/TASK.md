# TK-005U - State the corrective rules in the Runbook and its template mirror

**Task ID:** TK-005U
**Spec ID:** S-004F
**Slice:** State the corrective rules in the Runbook and its template mirror
**Status:** blocked
**Stance:** Builder
**Blockers:** TK-005T, owner:runbook-writer-turn
**Destination:** spec-acceptance: `AGENTS.md`, `RUNBOOK.md` and their template mirrors state the same-Task rule and the new-Spec rule, and no current-facing line in them still makes every finding a new Task or anchors later work to a Wiki claim.
**Planned verification:** Red: a pin over `RUNBOOK.md` and `templates/RUNBOOK.md` fails while the verdict passage still says a failed verdict creates one corrective Task per attributable finding and not to reopen the original record, the owner-QA passage still says a finding creates corrective Tasks, and the retirement passage still says a later same-capability gap targets the surviving Wiki claim and describes `createCorrectiveTasks` `wikiClaim` as a programmatic API. Green: those passages state the continue-or-new rule and the new-Spec route, and `tools/test-control-fidelity.mjs` no longer pins the retired sentence. The full AGENTS suite passes on the committed candidate.

## Outcome

The Runbook's operations say what the verdict and owner-QA commands now do and
how a later gap is carried. This Task waits because the Contract Carrier
Pointer-Brief Rewrite owns the Runbook and may relocate these passages into a
skill; the Dispatcher of that Spec removes the owner token when the Runbook is
free, and the rules go wherever the passages then live.

## Scope

`RUNBOOK.md` and `templates/RUNBOOK.md` passages named above, or the skill that
carries them if the rewrite moved them, and the control-fidelity pins that read
them. `owner:runbook-writer-turn` names a turn in another Spec's Runbook writer
lane, which the blocker grammar cannot express as a Task identifier.

## Acceptance

- [ ] The Runbook and its template mirror state both rules with no line that
      makes every finding a new Task or anchors later work to a Wiki claim.

## Boundaries

No rule beyond the owner's two answers; no tooling change.
