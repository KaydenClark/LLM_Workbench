# TK-005U - P3 completion provenance: the Spec's post citation anchor and its Completion Result name b4e22bd4, the TK-005A head that failed review, as the after-state of the delivered tree and the self-drift receipt, instead of the corrected assembled state (60dd7643, contained in integration e584cb74)

**Task ID:** TK-005U
**Spec ID:** S-003X
**Slice:** P3 completion provenance: the Spec's post citation anchor and its Completion Result name b4e22bd4, the TK-005A head that failed review, as the after-state of the delivered tree and the self-drift receipt, instead of the corrected assembled state (60dd7643, contained in integration e584cb74)
**Status:** done
**Blockers:** none
**Destination:** spec-acceptance: S-003X Acceptance Criteria
**Planned verification:** Answers evidence row 14 (fail verdict at ffc5023daedf5f029de5ce656f3765d58a199332 on 2026-10-03): P3 completion provenance: the Spec's post citation anchor and its Completion Result name b4e22bd4, the TK-005A head that failed review, as the after-state of the delivered tree and the self-drift receipt, instead of the corrected assembled state (60dd7643, contained in integration e584cb74)
**Proof:** Records-only correction of completion provenance: post anchor e584cb74 and the Completion Result's self-drift after-state 60dd7643 replace b4e22bd4; test-spec-citation-anchors 15/15, check-append-only CLEAN, doctor no blocking finding. No runtime change, so no red/green test applies.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003x-assembly | c6cb56cc0cfeb1200a7f5d9ced774a9f49fa8eba | ahead 0 behind 0 | 0 | Records-only correction: no runtime behavior changes, so no red/green test applies (the defect is provenance text). Manual check: no live section of the Spec names b4e22bd4 as the delivered tree or the self-drift after-state (the remaining mentions are append-only evidence rows naming it as the failed candidate); test-spec-citation-anchors 15/15 with the new post anchor e584cb74, which exists and contains all five Tasks; check-append-only CLEAN; doctor no blocking finding. | S-003X Citation anchors and Completion Result. | Fresh separate-context whole-Spec review of the new assembled candidate. | 4135c4f174eb80e6e7606ccafe3578a991041cc9d2345ff6f7a3a5f7fecd4a4d |
| 2 | claude/s003x-assembly | 77acad4db62aae1f4699889106e2bc1ce235f16c | ahead 0 behind 0 | 0 | Records-only correction of completion provenance: post anchor e584cb74 and the Completion Result's self-drift after-state 60dd7643 replace b4e22bd4; test-spec-citation-anchors 15/15, check-append-only CLEAN, doctor no blocking finding. No runtime change, so no red/green test applies. | S-003X Citation anchors and Completion Result corrected. | Fresh separate-context whole-Spec review of the new assembled candidate; the routed S-004C finding belongs to that Spec's writer. | 533399815b915bf6ec685115b521c742556eed5c63be2eb023cf4d9c49b8e984 |
