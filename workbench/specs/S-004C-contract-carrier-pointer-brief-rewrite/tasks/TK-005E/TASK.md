# TK-005E - A skill the index points to binds for its operation and an unpointed skill teaches

**Task ID:** TK-005E
**Spec ID:** S-004C
**Slice:** A skill the index points to binds for its operation and an unpointed skill teaches
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-005D
**Destination:** spec-acceptance: The Instruction Authority list states that a pointed lane skill binds for its operation and the lane copy wins, and a skill no carrier points to teaches and does not instruct, with a room-added skill shown not to bind.
**Planned verification:** Red: fixture-room cases fail because nothing resolves which lane skills the Runbook index points to: a skill the index points to is not reported as binding, a room-added skill the index does not point to is not reported as teaching only, a drifted installed copy is not shown to lose to the lane copy, a pointer to a skill missing from the lane is not reported, and `AGENTS.md` Instruction Authority does not say any of it. Green: the resolver reports pointed and unpointed lane skills from the index alone; the lane copy is the only one read; a dangling pointer is reported by name; the Instruction Authority text says a pointed lane skill binds only for the operation being performed, that authority never comes from a link a Destination Packet or any other work record carries, and that an unpointed skill teaches. `tools/test-governance-core.mjs`, `tools/test-control-fidelity.mjs`, `tools/test-genesis-from-decisions.mjs` (both read the Instruction Authority text), `tools/test-diagnostics.mjs` (if a finding code is registered), `tools/test-skills-lane.mjs`, `tools/test-skill-catalog.mjs`, the landing check and the full AGENTS suite pass on the committed candidate.

## Outcome

The accepted decision's central claim, authority flows through the pointer,
becomes inspectable. The Instruction Authority list in `AGENTS.md` and
`templates/AGENTS.md` adds the pointed lane skill as a source of instruction
for the operation being performed, with the lane copy winning over a drifted
installed copy, and says an unpointed skill, including a room-added one,
teaches without instructing. The review care for a skill change that now binds
(the accepted decision says the lane's receipt hashes and the integration
review already cover it) is checked rather than assumed: the Task records
whether a changed pointed skill or a changed index row is caught by the
existing receipt hash and review gate, and records any gap by name.

## Scope

- Instruction Authority in `AGENTS.md` and `templates/AGENTS.md`, and the two
  tests that extract the text between `### Instruction Authority` and `###
  State Resolution` (`tools/test-control-fidelity.mjs` and
  `tools/test-genesis-from-decisions.mjs`), which change with the text.
- The smallest runtime seam that resolves pointed and unpointed lane skills
  from the index: extend an existing runtime tool (the doctor and diagnostics
  path, or the skills-lane verify) rather than adding a managed tool; the
  Builder settles the seam at the red step and records why. A finding for a
  dangling pointer is attention with effect none, like the other skills-lane
  findings. Any `diagnostics.mjs` change lands after Decision Record Tooling's
  TK-004X, which the first Task's blocker already covers.
- The Runbook sentence stating that a change to a pointed skill or to an index
  row is reviewed as a Contract change.

## Acceptance

- [ ] Instruction Authority names the pointed lane skill, the operation bound,
      the lane-copy rule and the unpointed-skill rule, and keeps its other
      limits unchanged, with the Lexicon's carrier status as it stands.
- [ ] A fixture proves a room-added unpointed skill does not bind, a drifted
      installed copy loses, and a dangling pointer is named.
- [ ] The review-coverage claim is verified or its gap is recorded.

## Boundaries

No assigned-landmark clause (its own Task waits on LANDMARK.md). No change to
any rule's meaning. No decision on whether the Lexicon is a contract artifact:
the owner deferred it, and line 4 of the list keeps naming it as it does today.
