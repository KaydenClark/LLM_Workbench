# TK-005X - P2 Wiki creation timing: the article Decision Records and the Concept Map still says aligning creates DDRs and that a DDR is born when the owner confirms the decision, which the accepted workflow-verbs decision (ADR-000X) narrowed to decision records written at Map through to-docs, so the Spec's claim that the article matches the shipped tooling is overbroad

**Task ID:** TK-005X
**Spec ID:** S-003X
**Slice:** P2 Wiki creation timing: the article Decision Records and the Concept Map still says aligning creates DDRs and that a DDR is born when the owner confirms the decision, which the accepted workflow-verbs decision (ADR-000X) narrowed to decision records written at Map through to-docs, so the Spec's claim that the article matches the shipped tooling is overbroad
**Status:** done
**Blockers:** none
**Destination:** spec-acceptance: S-003X Acceptance Criteria
**Planned verification:** Answers evidence row 18 (fail verdict at 55770bb82b67786ce121dae562588d27d6351489 on 2026-10-03): P2 Wiki creation timing: the article Decision Records and the Concept Map still says aligning creates DDRs and that a DDR is born when the owner confirms the decision, which the accepted workflow-verbs decision (ADR-000X) narrowed to decision records written at Map through to-docs, so the Spec's claim that the article matches the shipped tooling is overbroad
**Proof:** Records-only correction: the Wiki article Decision Records and the Concept Map now places DDR and ADR writing at Map through to-docs per ADR-000X, cites ADR-000X, and names the accept, supersede and deprecate moves; wiki validated. No runtime change.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003x-assembly | cbdeb48fd6a8f932f0e59bc5270684cbd979c51f | ahead 0 behind 0 | 0 | Records-only correction: no runtime change, so no red/green test applies. Checks: wiki.mjs validate ok; the article no longer says aligning creates DDRs or that a DDR is born at confirmation, and cites ADR-000X in its sources and source_paths. | Wiki article Decision Records and the Concept Map (creation timing, lifecycle moves, ADR-000X source). | Fresh separate-context whole-Spec review of the new assembled candidate. | f0f82d0057b53b5ad093cd822f2b39bde841ccda2ba37139abe46670b1477b07 |
| 2 | claude/s003x-assembly | 9f33f7b3e7e5343a49f5cb4791f447a7ce9be2ce | ahead 0 behind 0 | 0 | Records-only correction: the Wiki article Decision Records and the Concept Map now places DDR and ADR writing at Map through to-docs per ADR-000X, cites ADR-000X, and names the accept, supersede and deprecate moves; wiki validated. No runtime change. | Wiki article Decision Records and the Concept Map updated. | Fresh separate-context whole-Spec review of the new assembled candidate. | 4e230ed4507a60230fcf0a30e4655b9e589957e5fa398690d4b1c0216a6b8711 |
