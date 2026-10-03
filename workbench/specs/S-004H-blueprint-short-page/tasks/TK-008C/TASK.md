# TK-008C - Swap in the four-part Blueprint for LLM Workbench and every room, with its contract test and Genesis guidance

**Task ID:** TK-008C
**Spec ID:** S-004H
**Slice:** Swap in the four-part Blueprint for LLM Workbench and every room, with its contract test and Genesis guidance
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: `BLUEPRINT.md` matches the owner-confirmed candidate quoted in Decisions And Contracts word for word, and links no record that carries an identifier.
**Planned verification:** Red first: the new four-part contract in `tools/test-blueprint-contract.mjs` fails against the eight-section root page and template. Then green: the root page equals the quoted candidate except the one withheld non-goal, both files have exactly the four headings, the template carries bracketed placeholders only, the eight-section and verbatim-map pins are gone with each retired check recorded, and `templates/GENESIS.md` asks for the four parts. Evaluator on `templates` and the guardrail audit run before and after. Full AGENTS suite on the committed candidate, then render and doctor. Workbench self-drift pre and post receipts.

## Outcome

An agent that opens the Blueprint learns what LLM Workbench is and is not in
about six hundred words, and every new room's Blueprint has the same four
parts. The eight-section shape and the verbatim workflow map are gone from
the page and from the tests that pinned them; their content lives where the
disposition records.

## Scope

- Replace `BLUEPRINT.md` with the confirmed candidate. One non-goal line, the
  one about being a hosted service, is withheld and surfaced as an open owner
  item in this Spec, because no decision record carries it and it is not an
  owner-locked claim of its own.
- Replace `templates/BLUEPRINT.md` with the four parts, generic bracketed
  placeholders only, and no workflow paragraph.
- Rewrite `tools/test-blueprint-contract.mjs` for the four-part shape in both
  files; keep the lossless-inventory checks; record each removed pin as moved
  or retired.
- Ask for the four parts in `templates/GENESIS.md`, and update the description
  lines in files this Spec owns; record the lines that belong to the Contract
  carrier rewrite and the Lexicon writer as handed-off drift.

## Acceptance

- [ ] The root page and the template have exactly the four parts and no
      identifier-bearing link.
- [ ] `tools/test-blueprint-contract.mjs` checks the four-part shape and no
      longer pins the eight sections or the verbatim map.
- [ ] Genesis guidance asks for the four parts, and the full suite is green on
      the committed candidate.

## Boundaries

No `AGENTS.md`, `RUNBOOK.md`, `LEXICON.md` or router edit. Never run `complete`.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004h-tk008c-swap | aec1761de1df73ce0d7a73e59286c0390da50c54 | ahead 3 behind 0 | 0 | Red first: the rewritten tools/test-blueprint-contract.mjs failed against the eight-section root page (BLUEPRINT.md headings) before the swap; green after. Full AGENTS suite on committed candidate aec1761d: 48 of 48 commands pass (test-wiki run alone after the parallel batch). An earlier run at 91b4d169 failed three tests the swap broke, repaired in the same Task: the committed placeholder vocabulary (workbench/tools/template-placeholders.mjs, now exactly the shipped templates), the skills README rows for brainstorm and prototype that cited the old Blueprint, and accepted decision record 000G's link to the retired Desired Lifecycle anchor (re-pointed to the workflow Wiki page with an amendment note; ADR link census 116 to 117). Guardrail audit 78/100 before and after; template evaluation 106.6/113 before and after (the template is now the four-part page). Self-drift receipts pre (72b99c2) and post: identical 12 findings, machineResult blocked on the pre-existing S-004G blocked slices in both, no new finding; cleanUpdate false by design. Manual semantic check: the current-facing drift the swap leaves is listed in the Spec's Remaining Limitations as handed-off items. | BLUEPRINT.md and templates/BLUEPRINT.md replaced by the four-part page; templates/GENESIS.md and templates/README.md describe the four parts; to-docs skill line; Wiki: workflow-verbs, landmark-tracker, skill-grilling and decision-records pages repointed, history lines added; ADR 000G route and amendment note; Spec Remaining Limitations lists the handed-off description lines | Handed off, not edited: Lexicon Blueprint rows, MEMORY.md router lines and entries for the two new pages, AGENTS.md authority and ownership wording (pinned by test-control-fidelity), promotion of the three rules into AGENTS/Runbook, ADR 0042 and the S-01U Spec dangling anchors; hosted-service non-goal is an open owner item; managed bytes under templates/ and the placeholder registry need the release owner's bundle/version/install proof; the optional prototype has no generic mirror | b65b3226bcb6871f3dcf6f9fa929120c6cdf3bca1c3ec8ab498fa34cd2118077 |
