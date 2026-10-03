# TK-005C - Refuse a removed carrier line that has no landed home

**Task ID:** TK-005C
**Spec ID:** S-004C
**Slice:** Refuse a removed carrier line that has no landed home
**Status:** blocked
**Stance:** Builder
**Blockers:** TK-005B
**Destination:** spec-acceptance: An inventory maps every line of `AGENTS.md` and `RUNBOOK.md` to a home (stays, skill, pointer, Lexicon, Wiki, or restates another owner and goes nowhere), and a check shows every removed line landed.
**Planned verification:** Red: new `tools/test-carrier-landing.mjs` cases fail because the check does not exist: a removed line with no inventory entry, an entry whose home file does not hold the landed text, an entry naming a home that does not exist, and a `restates-owner` entry whose named owner lacks the claim. Green: those cases refuse by naming the line and the missing home, a fully landed fixture passes, and a line that stays is not required to move. The check then runs against the real `AGENTS.md` and `RUNBOOK.md` at the pinned SHA with an unclassified scaffold and reports zero removed lines. The full AGENTS suite passes on the committed candidate, with the new test listed in the Full suite block.

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
