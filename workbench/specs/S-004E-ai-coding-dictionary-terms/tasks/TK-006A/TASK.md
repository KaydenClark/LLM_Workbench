# TK-006A - Add the ten batch-two rows and reconcile separate-context review

**Task ID:** TK-006A
**Spec ID:** S-004E
**Slice:** Add the ten batch-two rows and reconcile separate-context review
**Status:** done
**Stance:** Builder
**Blockers:** TK-005Z
**Destination:** spec-acceptance: Each of the ten batch-two terms has exactly one Lexicon row in the AI Coding Terms section, stating its agreed meaning in Workbench words and linking its dictionary entry; the Automated review row reconciles the separate-context review wording.
**Planned verification:** Red: the one-row-per-term check gains the ten batch-two terms and fails first. Green: that check, the evaluator and the full AGENTS suite on the committed candidate; the batch-two copied-passage comparison; the separate-context review wording in `AGENTS.md` and `RUNBOOK.md` inventoried and handed to the Contract Carrier Pointer-Brief Rewrite.
**Proof:** Red 8e23d299 then green: test-control-fidelity 30/30, full AGENTS suite 48/48 on clean d9038592

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004e-batch2-3 | c7b07be803494a9fdded00a2fee1d1af6a6131d7 | ahead 5 behind 3 | 0 | Red 2954ade9 (rebased as 8e23d299): tools/test-control-fidelity.mjs batch-two case fails. Green: test-control-fidelity 30/30; full AGENTS suite 48/48 on clean d9038592 (the same content before rebase onto integration 50acc19f and a one-line test-list tidy); copied-passage comparison leaves only common phrases of seven words or fewer | LEXICON.md and templates/LEXICON.md (ten batch-two rows); Spec S-004E separate-context review inventory | Wiki entries, router and whole-Spec QA remain in the last Task | f253d172ccf3c219143d5c3f91a792ac98daa7cc7f92a7d9180175df7bdcf906 |
| 2 | claude/s004e-batch2-3 | cd2e40bcfe58408203cb52be25f4a20902062d09 | ahead 0 behind 0 | 0 | Red 8e23d299 then green: test-control-fidelity 30/30, full AGENTS suite 48/48 on clean d9038592 | LEXICON.md and templates/LEXICON.md carry the ten batch-two rows; separate-context review wording inventoried in the Spec, no conflicting line | Wiki entries, router and whole-Spec QA remain in the last Task | 21702b897e83408fc895dabbdb825e546930bf6d240d9481bd0284134ccb7f47 |
