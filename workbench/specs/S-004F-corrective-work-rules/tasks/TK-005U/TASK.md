# TK-005U - State the corrective rules in the Runbook and its template mirror

**Task ID:** TK-005U
**Spec ID:** S-004F
**Slice:** State the corrective rules in the Runbook and its template mirror
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: `AGENTS.md`, `RUNBOOK.md` and their template mirrors state the same-Task rule and the new-Spec rule, and no current-facing line in them still makes every finding a new Task or anchors later work to a Wiki claim.
**Planned verification:** Red: a pin over `RUNBOOK.md` and `templates/RUNBOOK.md` fails while the verdict passage still says a failed verdict creates one corrective Task per attributable finding and not to reopen the original record, the owner-QA passage still says a finding creates corrective Tasks, and the retirement passage still says a later same-capability gap targets the surviving Wiki claim and describes `createCorrectiveTasks` `wikiClaim` as a programmatic API. Green: those passages state the continue-or-new rule and the new-Spec route, and `tools/test-control-fidelity.mjs` no longer pins the retired sentence. The full AGENTS suite passes on the committed candidate.
**Proof:** Full AGENTS suite 48 of 48 on committed candidate 5510c00a; Runbook and template state the continue-or-new rule and the new-Spec route; control-fidelity pins red then green; guardrail audit 78/100 unchanged

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

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004f-tk005u | 5510c00ab082e75e1a2230bbce73185d631d2343 | ahead 0 behind 0 | 0 | Full AGENTS suite on committed candidate 5510c00a: 48 of 48 commands pass; tools/test-control-fidelity.mjs 35 pass with the retargeted Runbook pins (later-gap route, finding dispositions, standalone close refused, retired-sentence mutation checks); guardrail audit 78/100 unchanged; self-drift post findings are stale-claim, stale-seed and unverified-provenance only, none from this change; wiki validate ok | RUNBOOK.md and templates/RUNBOOK.md (close, verdict, owner-finding and later-gap passages), tools/test-control-fidelity.mjs pins | Lexicon rows (TK-005V), README and Wiki schema line still state the replaced rules | 53f7775ca52bc0c74a969e64e47d9f257764fbd7f583a1f3368ae0fb46f690a7 |
| 2 | claude/s004f-tk005u | 9adcd561a6931a484d57c9ddc3f8efa998636405 | ahead 0 behind 0 | 0 | Full AGENTS suite 48 of 48 on committed candidate 5510c00a; Runbook and template state the continue-or-new rule and the new-Spec route; control-fidelity pins red then green; guardrail audit 78/100 unchanged | RUNBOOK.md, templates/RUNBOOK.md and control-fidelity pins updated | Lexicon rows (TK-005V), README and the Wiki schema line still state the replaced rules | e195b855b937130fbee8192735b68d9221ebf75a4a647fa6163c3071eac3323d |
