# TK-005U - State the corrective rules in the Runbook and its template mirror

**Task ID:** TK-005U
**Spec ID:** S-004F
**Slice:** State the corrective rules in the Runbook and its template mirror
**Status:** ready
**Stance:** Builder
**Blockers:** none
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
them: the `same capability after discard` pin on the `createCorrectiveTasks`
"programmatic API, not a" sentence, the `orphan corrective close gap` pin on
`close TK-###` and the `programmatic API, not a` phrase check, which describe
the retired route and must change with the passages. `owner:runbook-writer-turn` names a turn in another Spec's Runbook writer
lane, which the blocker grammar cannot express as a Task identifier.

## Acceptance

- [ ] The Runbook and its template mirror state both rules with no line that
      makes every finding a new Task or anchors later work to a Wiki claim.

## Boundaries

No rule beyond the owner's two answers; no tooling change.

## Gate cleared

`owner:runbook-writer-turn` was a sequencing gate this Spec's own planning created, not an owner decision. The Runbook writer is free: the Decision Record Tooling Spec (S-003X) has all its Tasks done on integration, and the Contract Carrier Pointer-Brief Rewrite (S-004C) is not running (all fifteen Tasks are still blocked at integration 88c82fc6). Cleared by the Director's direction of 2026-10-03; TK-005T is done (PR #311).
