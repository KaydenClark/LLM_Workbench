# TK-005Q - Record where every paragraph of the current Blueprint goes, and write the Wiki pages that hold the workflow and the altitudes

**Task ID:** TK-005Q
**Spec ID:** S-004H
**Slice:** Record where every paragraph of the current Blueprint goes, and write the Wiki pages that hold the workflow and the altitudes
**Status:** ready
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
