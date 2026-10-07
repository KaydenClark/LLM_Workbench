# TK-009M - Correct the whole-Spec code-review findings

**Task ID:** TK-009M
**Spec ID:** S-004O
**Slice:** Correct the whole-Spec code-review findings
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: No link in the repository points at a Lexicon heading, the Instruction Authority list does not name the Lexicon, and the full suite passes on the committed candidate.
**Planned verification:** Red: the narrowed live-link check fails on the S-01A and ADR-0042 Lexicon heading links; reproductions of the glossary-skip retirement and the Matt-format term-row landing fail in `tools/test-workbench-upgrade.mjs`. Green: those checks, `doctor` with no Lexicon broken-link finding, both landing checks, then the full suite on the committed candidate.
**Claimed by:** claude-s004o-worker-m
**Proof:** Red e2677a59 (narrowed live-link check lists ADR-0042, S-01A, S-01T and S-01U; test-workbench-upgrade 3 failing: glossary-skip retirement, Matt-format row landing, remove-landed-rows message; proof/review-correction-red.txt), green 242435d3: Lexicon links re-pointed to ARCHITECTURE.md, GLOSSARY.md or a permalink at 0059669f; live-link check scans live Spec, landmark and decision-record bodies; retireLexicon keeps a Lexicon whose generic homes were not installed from the Template; Matt-format term rows land; ARCHITECTURE routes go through the catalog and landmarks with a 2,800-word budget; four retired-alias distinctions landed; test-control-fidelity 50/50, test-workbench-upgrade 14/14, test-governance-core 14/14, test-wiki 30/30, test-adr 59/59; both landing checks pass; doctor has no broken-link finding; full suite 54/54 on clean 242435d3 (log-tk009m.txt); merged by PR #430

## Scope

One correction pass for the building-side whole-Spec code review of candidate `fce242cbb63ea1dc4e3541c621cf1beea6ab9230` (2026-10-07):

1. (High) Re-point the remaining Lexicon links: S-01A's `LEXICON.md#artifact-boundaries` link to `ARCHITECTURE.md#ownership`; ADR-0042's body `LEXICON.md#task-routing` link to `ARCHITECTURE.md#routes` (through the decision-record tool's reference repair if it covers it); S-01T's live definition route to `GLOSSARY.md`; historical claims in S-01U and superseded S-002H to a permalink of the Lexicon at pre-removal commit `0059669f`. Never edit append-only evidence rows. Narrow the live-link check's history exclusion so it scans active and planned Spec bodies and accepted ADR/DDR bodies (not frontmatter `canonicalized_in`), with a mutation sample for a Spec heading link.
2. (Medium) `retireLexicon` counts a Template-matching Lexicon line as landed only when the room's vocabulary control was installed from the Template in this run or still carries the Template content; otherwise it keeps the Lexicon with a `lexicon-unlanded` finding naming the missing generic entries. Add the fixture.
3. (Medium) `lexiconLanding` treats a `| **Term** | Definition | Distinction |` row as landed when `GLOSSARY.md` has a `**Term**:` entry, the Definition text (markup stripped) is in the glossary or Wiki, and any Distinction is in the Wiki. The upgrade test lands the row in Matt format. The finding message and `update-harness` say to remove landed rows from the room's Lexicon before rerunning.
4. (Medium) Correct the consumer census rows that say TK-009F re-pointed the Grill Board; record the board gap (its `artifactCatalog`/`readArtifact` still name `LEXICON.md` and ten open items cite it) for the board's owner. The board code is not edited: the owner holds uncommitted edits on those lines.
5. (Low) `update-harness` says to draft the `ARCHITECTURE.md` codemap and description from project evidence for grilling to confirm and to clear the empty glossary term slot; optionally report remaining placeholders.
6. (Low) Replace `ARCHITECTURE.md`'s per-Spec delivery routes with routes through the Spec catalog and landmarks, tighten its length, and add a word budget to its shape check.
7. (Low) Land the four retired-alias distinctions (Ticket's prefix rule, the Root controls public-name exception, Portable layout, Portability model) in their Wiki articles and record their `explanationText` in the final inventory.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004o-lexicon-retirement | 9ad422d4217d980271e1f3bec6c21a1cb5e89936 | ahead 0 behind 0 | 0 | Red e2677a59 (narrowed live-link check lists ADR-0042, S-01A, S-01T and S-01U; test-workbench-upgrade 3 failing: glossary-skip retirement, Matt-format row landing, remove-landed-rows message; proof/review-correction-red.txt), green 242435d3: Lexicon links re-pointed to ARCHITECTURE.md, GLOSSARY.md or a permalink at 0059669f; live-link check scans live Spec, landmark and decision-record bodies; retireLexicon keeps a Lexicon whose generic homes were not installed from the Template; Matt-format term rows land; ARCHITECTURE routes go through the catalog and landmarks with a 2,800-word budget; four retired-alias distinctions landed; test-control-fidelity 50/50, test-workbench-upgrade 14/14, test-governance-core 14/14, test-wiki 30/30, test-adr 59/59; both landing checks pass; doctor has no broken-link finding; full suite 54/54 on clean 242435d3 (log-tk009m.txt); merged by PR #430 | ARCHITECTURE.md and its Template, update-harness, workbench-room-checks, templates/ADOPTION.md, four Wiki articles, prose links in S-01A, S-01T, S-01U, S-002H and ADR-0042, consumer census Grill Board gap section | Grill Board artifactCatalog and readArtifact still name LEXICON.md and ten open items cite it; not edited because the owner holds uncommitted edits on those lines; runtime reporting of leftover placeholders not added; no real room through migrate | e732adf995ff1f714996544b19dccba60441b5566fc601701794a3e6a8ae17b5 |
