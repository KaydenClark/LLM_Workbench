# TK-005W - Correct the Blueprint's corrective passages unless the short page has already replaced them

**Task ID:** TK-005W
**Spec ID:** S-004F
**Slice:** Correct the Blueprint's corrective passages unless the short page has already replaced them
**Status:** blocked
**Stance:** Builder
**Blockers:** TK-005T, owner:blueprint-writer-turn
**Destination:** spec-acceptance: The Blueprint's corrective passages and their test pins say the new rules or are already gone with the short page.
**Planned verification:** At the integration tip, read the Blueprint's Desired Lifecycle and Integrated System Design passages and the matching pins in `tools/test-blueprint-contract.mjs`. If the Blueprint Short Page Spec has landed and they are gone, record that and close with no edit. Otherwise Red: the pins fail against the corrected wording; Green: the passages state the continue-or-new rule and the new-Spec rule and the pins agree. The full AGENTS suite passes on the committed candidate.

## Outcome

No Blueprint line still says a missed Task is replaced by a new Task for every
finding or that a later gap is a corrective Task updating the reconciled record.
The Blueprint is owned by the Blueprint Short Page work, so this Task waits for
that writer's turn and does nothing if the page already replaced the passages.

## Scope

`BLUEPRINT.md` Desired Lifecycle and Integrated System Design corrective
passages and their pins; `owner:blueprint-writer-turn` names a turn in another
Spec's Blueprint lane.

## Acceptance

- [ ] The Blueprint's corrective passages and their test pins say the new rules or
      are already gone with the short page.

## Boundaries

No other Blueprint change.
