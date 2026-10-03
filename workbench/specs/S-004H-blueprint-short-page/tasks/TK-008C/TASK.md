# TK-008C - Swap in the four-part Blueprint for LLM Workbench and every room, with its contract test and Genesis guidance

**Task ID:** TK-008C
**Spec ID:** S-004H
**Slice:** Swap in the four-part Blueprint for LLM Workbench and every room, with its contract test and Genesis guidance
**Status:** blocked
**Stance:** Builder
**Blockers:** TK-008A, TK-008B
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
