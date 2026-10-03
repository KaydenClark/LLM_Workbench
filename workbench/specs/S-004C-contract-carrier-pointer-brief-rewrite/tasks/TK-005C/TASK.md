# TK-005C - Refuse a removed carrier line that has no landed home

**Task ID:** TK-005C
**Spec ID:** S-004C
**Slice:** Refuse a removed carrier line that has no landed home
**Status:** done
**Stance:** Builder
**Blockers:** TK-005B
**Destination:** spec-acceptance: An inventory maps every line of `AGENTS.md` and `RUNBOOK.md` to a home (stays, skill, pointer, Lexicon, Wiki, or restates another owner and goes nowhere), and a check shows every removed line landed.
**Planned verification:** Red: new `tools/test-carrier-landing.mjs` cases fail because the check does not exist: a removed line with no inventory entry, an entry whose home file does not hold the landed text, an entry naming a home that does not exist, and a `restates-owner` entry whose named owner lacks the claim. Green: those cases refuse by naming the line and the missing home, a fully landed fixture passes, and a line that stays is not required to move. The check then runs against the real `AGENTS.md` and `RUNBOOK.md` at the pinned SHA with an unclassified scaffold and reports zero removed lines. The full AGENTS suite passes on the committed candidate, with the new test listed in the Full suite block.
**Proof:** test-carrier-landing 17/17 green at 38f99d2d after red at 1538f807 (module absent); landing check on real carriers base d7ffffe9f44c96f2e43b1465b99ccb721942c4f8 to 38f99d2d: AGENTS.md and RUNBOOK.md 0 removed lines, ok; full suite 49/49 at 38f99d2d clean; guardrails 106.6/113 and 78/100 held

## Outcome

"No line is removed before its new home exists" becomes a command, not a
promise. Given a base SHA, a candidate ref and an inventory, the check lists
every normalized line the candidate removed from a carrier, and refuses unless
each one has an inventory entry whose home exists at the candidate and holds
the line's landed text.

This resolves the Spec's open check form as a Plan decision (agent, not an
owner answer): a verification tool in `tools/`, run at rewrite review, not a
managed room runtime tool. Inventories are JSON files in this Spec's folder, one
per carrier, so they travel with the Spec; entries can stay unclassified until
the family Task that moves the line fills them in. Each entry records the line,
a hash of its normalized text, a home kind (`stays`, `skill`, `pointer`,
`lexicon`, `wiki`, `restates-owner`, or `retired-with-reason`), the home path
and the landed text the home must contain.

## Scope

- `tools/check-carrier-landing.mjs` with an exported function and a CLI
  (`check`, `scaffold`), a `--json` output and a nonzero exit on any unlanded
  removed line; `scaffold` writes the unclassified inventory for a carrier at a
  base SHA.
- `tools/test-carrier-landing.mjs`, and its entry in the Full suite list of
  `AGENTS.md` (this Task takes an `AGENTS.md` writer turn for that one line).
- The scaffolded inventories for `AGENTS.md` and `RUNBOOK.md` at the pinned
  SHA of the baseline Task, in this Spec's folder.
- Runbook documentation of the command in the section the baseline Task's map
  assigns, and the generic `templates/RUNBOOK.md` only if the check is meant
  for rooms; the default is that it is not.

## Acceptance

- [ ] A removed line with no entry, an entry with a missing or empty home, and
      an entry whose home lacks the landed text each fail by name.
- [ ] Headings and blank lines are not required to land; a heading that moves
      keeps its anchor and is checked by the anchor Task, not here.
- [ ] The scaffold for both carriers exists at the pinned SHA.

## Boundaries

No carrier line is removed. The check is not a policy: it never decides which
home is right, only that the claimed home holds the text. No managed-runtime or
manifest change.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004c-tk005c-landing-check | 38f99d2d9769cbdce51e153ef55721017ab9cb84 | ahead 0 behind 0 | 0 | Red 1538f807: node tools/test-carrier-landing.mjs failed (ERR_MODULE_NOT_FOUND, tools/check-carrier-landing.mjs absent). Green 38f99d2d: test-carrier-landing 17/17 pass (no-entry, unclassified, home-lacks-text, home-missing, home-empty, owner-lacks-claim, stays-but-removed, retired-without-reason, unknown-home-kind, fully landed fixture passes, staying/reordered/rewrapped lines not removed, headings and blank lines exempt, duplicate lines, inventory hash/line/path validation, CLI exit codes 0/1/2 and no-overwrite scaffold). Landing check on the real carriers, base d7ffffe9f44c96f2e43b1465b99ccb721942c4f8 candidate 38f99d2d: AGENTS.md 0 removed lines (542 unclassified entries), RUNBOOK.md 0 removed lines (2149 unclassified entries), both ok with no inventory errors. Full suite 49/49 pass at 38f99d2d (clean tree). Guardrails held: evaluate-workbench templates 106.6/113, audit-guardrails 78/100. wiki.mjs validate ok. | AGENTS.md Full suite block gains node tools/test-carrier-landing.mjs (one line, after the vocabulary sweep); RUNBOOK.md gains the maintainer section Carrier line-landing check after Workbench self-drift check (commands, inventory keys, home kinds, normalization, exit codes); the tool header comment documents the same contract. No templates change: the check is maintainer-only and templates/AGENTS.md has no Full suite block. Wiki checked; no page describes the check, no update needed. LEXICON untouched (TK-005N's turn). | Inventories are unclassified scaffolds; each family Task classifies its lines. Lines added to a carrier after the pin (including this Task's new Runbook section and suite line) are outside the pinned inventories. Fenced-code delimiters and table separator lines are not exempt and need entries if removed. | aed824763c21f0508bceaddcc19d585d3bb8ced84d05a5d9d63f6be764810d1c |
| 2 | claude/s004c-tk005c-landing-check | 7984742c93761e0bab40783f4f44c1f850031900 | ahead 0 behind 0 | 0 | test-carrier-landing 17/17 green at 38f99d2d after red at 1538f807 (module absent); landing check on real carriers base d7ffffe9f44c96f2e43b1465b99ccb721942c4f8 to 38f99d2d: AGENTS.md and RUNBOOK.md 0 removed lines, ok; full suite 49/49 at 38f99d2d clean; guardrails 106.6/113 and 78/100 held | AGENTS.md Full suite block: added node tools/test-carrier-landing.mjs; RUNBOOK.md: new maintainer section Carrier line-landing check; inventory-agents.json and inventory-runbook.json scaffolded in the Spec folder; no templates change (maintainer-only check; templates/AGENTS.md has no Full suite block); Wiki checked, no page describes the check, no update needed | Inventories unclassified until each family Task classifies its lines; lines added after the pin are outside the pinned inventories; fence delimiters and table separators are not exempt | 6313a581514fc13c33fe98aa8c5cfde46246a6bd4bff4abb114fe04f03d03a66 |
