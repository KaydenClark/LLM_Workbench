# TK-005O - Name an assigned landmark as a bounded delegate once the artifact exists

**Task ID:** TK-005O
**Spec ID:** S-004C
**Slice:** Name an assigned landmark as a bounded delegate once the artifact exists
**Status:** blocked
**Stance:** Builder
**Blockers:** TK-005E, S-003Z:delivered
**Destination:** spec-acceptance: The Instruction Authority list names an assigned landmark once that artifact is delivered, with the same limits as an assigned Spec (Desired Behavior item 5).
**Planned verification:** Red: a check over `AGENTS.md` and `templates/AGENTS.md` Instruction Authority fails because it does not name an assigned `LANDMARK.md` as a bounded delegate, or names it with broader limits than an assigned Spec. Green: the list names an assigned landmark as a bounded delegate whose accepted requirements, decisions and acceptance apply to that scope only after selection or explicit assignment and which cannot enlarge the request, platform safety or `AGENTS.md`; the two tests that extract the Instruction Authority text, `tools/test-governance-core.mjs` and the full AGENTS suite pass on the committed candidate.

## Outcome

Landmarks join the assigned Spec as bounded delegates in the Instruction
Authority list, as the accepted landmark decision says they will when the
`LANDMARK.md` artifact is delivered. Until then the list names only what exists,
which is why this Task waits on that delivery and the earlier authority Task does
not name a landmark.

## Scope

- The Instruction Authority list in `AGENTS.md` and `templates/AGENTS.md`, the
  tests that read it, and any index or Lexicon sentence the earlier Tasks wrote
  that still says landmarks are not yet delegates. Takes an `AGENTS.md` writer
  turn.

## Acceptance

- [ ] The list names an assigned landmark as a bounded delegate with the same
      limits as an assigned Spec.
- [ ] No other authority line changes meaning.

## Boundaries

No `LANDMARK.md` runtime work, and no change to how a record names its
landmark. This Task is cut now so the Spec cannot be completed with the clause
missing; if the landmark capability changes shape before it delivers, the
Dispatcher amends this Task to match what delivered, not the reverse.
