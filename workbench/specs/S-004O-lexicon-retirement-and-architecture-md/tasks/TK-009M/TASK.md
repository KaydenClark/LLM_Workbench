# TK-009M - Correct the whole-Spec code-review findings

**Task ID:** TK-009M
**Spec ID:** S-004O
**Slice:** Correct the whole-Spec code-review findings
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: No link in the repository points at a Lexicon heading, the Instruction Authority list does not name the Lexicon, and the full suite passes on the committed candidate.
**Planned verification:** Red: the narrowed live-link check fails on the S-01A and ADR-0042 Lexicon heading links; reproductions of the glossary-skip retirement and the Matt-format term-row landing fail in `tools/test-workbench-upgrade.mjs`. Green: those checks, `doctor` with no Lexicon broken-link finding, both landing checks, then the full suite on the committed candidate.
**Claimed by:** claude-s004o-worker-m

## Scope

One correction pass for the building-side whole-Spec code review of candidate `fce242cbb63ea1dc4e3541c621cf1beea6ab9230` (2026-10-07):

1. (High) Re-point the remaining Lexicon links: S-01A's `LEXICON.md#artifact-boundaries` link to `ARCHITECTURE.md#ownership`; ADR-0042's body `LEXICON.md#task-routing` link to `ARCHITECTURE.md#routes` (through the decision-record tool's reference repair if it covers it); S-01T's live definition route to `GLOSSARY.md`; historical claims in S-01U and superseded S-002H to a permalink of the Lexicon at pre-removal commit `0059669f`. Never edit append-only evidence rows. Narrow the live-link check's history exclusion so it scans active and planned Spec bodies and accepted ADR/DDR bodies (not frontmatter `canonicalized_in`), with a mutation sample for a Spec heading link.
2. (Medium) `retireLexicon` counts a Template-matching Lexicon line as landed only when the room's vocabulary control was installed from the Template in this run or still carries the Template content; otherwise it keeps the Lexicon with a `lexicon-unlanded` finding naming the missing generic entries. Add the fixture.
3. (Medium) `lexiconLanding` treats a `| **Term** | Definition | Distinction |` row as landed when `GLOSSARY.md` has a `**Term**:` entry, the Definition text (markup stripped) is in the glossary or Wiki, and any Distinction is in the Wiki. The upgrade test lands the row in Matt format. The finding message and `update-harness` say to remove landed rows from the room's Lexicon before rerunning.
4. (Medium) Correct the consumer census rows that say TK-009F re-pointed the Grill Board; record the board gap (its `artifactCatalog`/`readArtifact` still name `LEXICON.md` and ten open items cite it) for the board's owner. The board code is not edited: the owner holds uncommitted edits on those lines.
5. (Low) `update-harness` says to draft the `ARCHITECTURE.md` codemap and description from project evidence for grilling to confirm and to clear the empty glossary term slot; optionally report remaining placeholders.
6. (Low) Replace `ARCHITECTURE.md`'s per-Spec delivery routes with routes through the Spec catalog and landmarks, tighten its length, and add a word budget to its shape check.
7. (Low) Land the four retired-alias distinctions (Ticket's prefix rule, the Root controls public-name exception, Portable layout, Portability model) in their Wiki articles and record their `explanationText` in the final inventory.
