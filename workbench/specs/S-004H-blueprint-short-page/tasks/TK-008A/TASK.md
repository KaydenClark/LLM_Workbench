# TK-008A - Record where every paragraph of the current Blueprint goes, and write the Wiki pages that hold the workflow and the altitudes

**Task ID:** TK-008A
**Spec ID:** S-004H
**Slice:** Record where every paragraph of the current Blueprint goes, and write the Wiki pages that hold the workflow and the altitudes
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Every paragraph of the current `BLUEPRINT.md` has a recorded home that exists at swap time, and a reviewer can follow each to it.
**Planned verification:** Red first: `node tools/test-blueprint-contract.mjs` fails because the Spec folder holds no paragraph disposition for the current Blueprint and the template's workflow paragraph. Then green: a lossless, byte-ordered disposition inventory in this Spec's folder, every named home existing on the tree, and the two new Wiki pages passing `node workbench/tools/wiki.mjs validate`. The Wiki pages are linted by reading against their sources. Full AGENTS suite on the committed candidate.

## Outcome

The page can be replaced without losing anything, because each paragraph of
the current page, and each claim of the template's generic workflow paragraph,
is shown to live somewhere: a decision record, a landmark record, a Wiki
page, the Contract, or nowhere because an accepted record already owns it. The
two Wiki pages the teardown named as homes exist: the owner's workflow rewritten
in the workflow verbs, and the three altitudes of delivery.

## Scope

- Re-verify the teardown's paragraph disposition against the Blueprint at the
  pinned integration commit (the 47 blocks and the fenced map) and record it as
  `blueprint-paragraph-disposition.json` in this Spec's folder, in the shape of
  the earlier Blueprint disposition inventory so one check reads both.
- Give each claim of `templates/BLUEPRINT.md`'s generic workflow paragraph a
  home in the generic mirrors (`templates/AGENTS.md`, `templates/LEXICON.md`,
  `templates/RUNBOOK.md`) or a shipped core skill, and name any claim that has
  none.
- Write the two design-concept Wiki pages and correct the one sentence of the
  Workflow Verbs article that points at the Blueprint's lifecycle map.
- Extend `tools/test-blueprint-contract.mjs` to read the new inventory.

## Acceptance

- [ ] `blueprint-paragraph-disposition.json` preserves every byte of the
      current page in order, and each home it names exists.
- [ ] Each template workflow-paragraph claim has a named generic home or is
      recorded as a gap.
- [ ] The workflow page and the altitudes page validate, link their sources and
      state nothing the accepted records do not carry.

## Boundaries

No `BLUEPRINT.md`, `templates/BLUEPRINT.md`, `MEMORY.md` or `LEXICON.md` edit.
Router lines for the new pages go to the Lexicon and router writer in the final
report.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004h-tk008a-homes | 082b4f77b1569bfcbfdb0bfeef66a0ac129032b3 | ahead 1 behind 0 | 0 | Red first: node tools/test-blueprint-contract.mjs failed (no paragraph disposition inventory in the Spec folder); green after adding blueprint-paragraph-disposition.json (47 root blocks and 26 template blocks, byte-lossless against pinned commit c10fb8da, every named home exists, template workflow paragraph split into nine sentence claims with one recorded gap: no generic mirror states the optional prototype) and the two Wiki pages. node workbench/tools/wiki.mjs validate ok. Full AGENTS suite on committed candidate 082b4f77: 47 of 48 in a four-way parallel run; node tools/test-wiki.mjs failed once on the known concurrent manifest read race and passed alone (14/14). | Created workbench/wiki/design-concepts/idea-to-delivery-workflow.md and delivery-altitudes.md; wiki validate ok; links checked; router lines left to the router writer | Router entries for the two new pages (MEMORY.md belongs to the Lexicon and router writer); the optional-prototype claim has no generic mirror (recorded as a gap in the inventory) | 6e84da234179944662bb3342f65005d6167c0eedc132d1d934dd9d85a701134f |
| 2 | claude/s004h-tk008a-homes | eacec67c72b33a70e36cf143c260618c48a7cb13 | ahead 1 behind 0 | 0 | Review round 1 (separate context, 0635f07d) failed two findings: the old corrective-Task passages were recorded as moved to homes whose accepted text now says the opposite. Fixed at eacec67c: eight paragraphs whose old claim a later owner decision replaced are recorded as replaced-claim with what replaced them (the Corrective Work Rules Spec, the amended two-gates decision, the scaffolding decision, the role decision, the owner's coordination-system answer, the dropped non-goals), and test-blueprint-contract now refuses to record any corrective-Task passage as merely relocated (red proven by running the new check against the first inventory, which failed on root-030, then green). Full AGENTS suite on committed candidate eacec67c: 47 of 48 in a four-way parallel run; node tools/test-wiki.mjs failed on the known concurrent manifest read race and passed alone. | Wiki pages idea-to-delivery-workflow.md and delivery-altitudes.md created; disposition inventory corrected | Router entries for the two new pages (MEMORY.md belongs to the router writer); the optional-prototype claim has no generic mirror (recorded as a gap) | c66d0268d77b97c4c39a8b2a1d19c9d9d5a58f48543ac722de82fd5294ba959b |
