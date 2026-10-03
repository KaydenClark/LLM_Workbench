# TK-005W - Correct the Blueprint's corrective passages unless the short page has already replaced them

**Task ID:** TK-005W
**Spec ID:** S-004F
**Slice:** Correct the Blueprint's corrective passages unless the short page has already replaced them
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: The Blueprint's corrective passages and their test pins say the new rules or are already gone with the short page.
**Planned verification:** At the integration tip, read the Blueprint's Desired Lifecycle and Integrated System Design passages and the matching pins in `tools/test-blueprint-contract.mjs`. If the Blueprint Short Page Spec has landed and they are gone, record that and close with no edit. Otherwise Red: the pins fail against the corrected wording; Green: the passages state the continue-or-new rule and the new-Spec rule and the pins agree. The full AGENTS suite passes on the committed candidate.
**Proof:** No Blueprint edit needed: the Blueprint Short Page Spec's swap (PR #310, 25733f3b, integration be0450fe) already replaced the Desired Lifecycle and Integrated System Design passages; BLUEPRINT.md and templates/BLUEPRINT.md carry no corrective-Task or Wiki-claim line, and test-blueprint-contract records the old passages as replaced claims; full AGENTS suite 48 of 48 on candidate fa571824

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

## Gate cleared

`owner:blueprint-writer-turn` was a sequencing gate this Spec's own planning created, not an owner decision. The Blueprint writer is free: the Blueprint Short Page Spec's swap merged in PR #310 (merge commit 25733f3b, 2026-10-03) and all its Tasks are done on integration be0450fe. Cleared by the Director's direction of 2026-10-03; TK-005T is done.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004f-tk005w | fa571824c7797d8a65213aab6d74f0290ca3dc36 | ahead 0 behind 0 | 0 | Read BLUEPRINT.md and templates/BLUEPRINT.md at integration be0450fe: no corrective-Task, reopen or Wiki-claim passage remains (grep); tools/test-blueprint-contract.mjs records the old corrective passages as replaced-claim; full AGENTS suite on committed candidate fa571824: 48 of 48 | none; the Blueprint Short Page Spec's swap (PR #310, 25733f3b) already replaced the passages and their pins | none | ab9955ad68c1cadc3bc0beb762dd4efcac93b63abaa32b61097fa6760fbc03d1 |
| 2 | claude/s004f-tk005w | 9c151a2ad24e185da19cf95cc098a479f76309c8 | ahead 0 behind 0 | 0 | No Blueprint edit needed: the Blueprint Short Page Spec's swap (PR #310, 25733f3b, integration be0450fe) already replaced the Desired Lifecycle and Integrated System Design passages; BLUEPRINT.md and templates/BLUEPRINT.md carry no corrective-Task or Wiki-claim line, and test-blueprint-contract records the old passages as replaced claims; full AGENTS suite 48 of 48 on candidate fa571824 | Docs checked; no update needed because the short page already replaced the passages | none | 9b43dd34a64385813857971927dbd847de70cf081a5ef6926cbee176a3fb5a84 |
