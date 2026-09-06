# S-045 - v3.1.2 Follow-Ups Left Without An Owner

**Spec ID:** S-045
**Status:** active
**Priority:** 4
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-06
**Catalog description:** Own the seven follow-ups the v3.1.2 slices and their retrospective reviews left open, so owed work has a spec that carries it instead of surviving only as prose inside completed specs.
**Blockers:** owner direction on whether v3.1.3 takes these
**Latest event:** Grown from three tickets to seven after the four retrospective reviews of the skipped gates routed their findings here.
**Next gate:** Owner decides whether these land in v3.1.3; until then every ticket stays blocked and `next` correctly excludes them.

## Outcome

Seven findings that five specs - S-039, S-040, S-042, S-043 and S-044 - recorded
or had raised against them, and could not close inside their own scope, have a
spec that owns them, rather than surviving only as prose inside a completed spec
that `AGENTS.md` tells arriving agents not to load. Three came from the slices
themselves; four more arrived when the retrospective reviews of the four skipped
gates were finally run. This spec appears on the Taskboard and in the Blueprint
spec catalog; all seven tickets live inside it. The Taskboard projects one
current slice per spec, so it shows TK-001 and not the other six - a reader
reaches all seven by opening this spec, which is the routing that was missing
before.
`next` deliberately does **not** return them: every ticket is blocked on owner
direction, and `next` excludes a blocked slice. Owned and owed, not
dispatchable.

## Why It Matters

Two of the first three named an owner that no longer exists.

S-040 routed its presence-only link gap to "a follow-up spec, or an upstream item
under [S-038]". The v3.1.2 closeout completed S-038 without opening either.

S-042 named its `doctor` hook's owner as "the next spec to take the
`spec-workbench.mjs` lane, S-043 while its branch is open; **if S-043 merges
without the hook, this becomes a new linked spec**". S-043 merged as PR #66
without the hook, so that fallback is the operative branch, and this is that
spec.

Without it the harness reports the truth badly: `next --json` returns `null`,
`doctor` exits 0, and the Taskboard lists neither item, while seven reviewed
findings are owed. `AGENTS.md` is explicit that a later change creates a new
linked spec rather than rewriting a completed result.

## Current Verified State

Verified on `origin/integration` at `18ffc0d` on 2026-09-06.

- `tools/workbench-upgrade.mjs:57` `missingUserSkills` and
  `tools/workbench-adoption.mjs:60` `hasRequiredUserSkills` both judge presence
  with `lstatOrNull(path.join(root, skill))?.isDirectory()`. `lstat` does not
  follow a link, so a host whose every populated discovery root holds the skill
  as a link is refused `missing-user-skills` while `core-skill-installer`
  reports `complete` with a `resolved` target. Before S-040 the two agreed by
  both refusing; the disagreement is new.
- `workbench/tools/spec-workbench.mjs` wires exactly two support-root validators,
  `validateAdrs` and `validateWiki`. `stale-seed` and `unverified-provenance`
  are emitted from `workbench/tools/workbench-layout.mjs` through `validateWiki`,
  so `wiki.mjs validate` reports a manifest-provenance finding and a
  feedback-lane finding that are not wiki facts.
- `tools/test-workbench-layout.mjs` carries seventeen `classify` cases; eleven
  compare a before/after room snapshot and six do not, including the EPERM seam
  probe, which is the one case that runs the classifier under a monkey-patched
  `fs`. Measured again at invocation granularity by S-044's retrospective
  reviewer: the file makes **34** `classify` invocations and brackets **21**.
  Three of the eleven cases counted as snapshotted still classify a room with no
  write check, so the case count overstates the coverage.
- Bare shipped-tree line citations across S-039 through S-044 name lines that
  every merge into `integration` moves. Nine in S-039 are known to point at
  unrelated content today, one of them behind a checked acceptance box with no
  immutable fallback.

## Desired Behavior

1. The presence-only gates and the installer agree on a host whose skill is
   reached through a link, or the contract states which one is authoritative.
2. The two installed-state checks are emitted from a seam whose scope matches
   what they report, rather than from the wiki validator.
3. Every `classify` invocation that classifies a room is bracketed by a
   before/after snapshot - by invocation, not by case, because three cases that
   carry a snapshot still classify a room without one. Closing this at case
   granularity would leave S-044's Proof column claim false.
4. A citation into a file that moves is anchored to an immutable ref, so a
   merged spec cannot come to point at unrelated content.
5. Registering a diagnostic code without pinning its effect is a red test.

## Decisions And Contracts

- **This spec owns the items; it does not re-decide them.** Each was recorded and
  reviewed in its originating spec. Nothing here reopens a completed result.
- **Every ticket is blocked pending owner direction.** These are v3.1.2 residue,
  not v3.1.2 scope. `next` excludes a blocked slice, so creating this spec makes
  the work visible without dispatching it.

## Non-Goals

- Reopening S-039, S-040, S-042, S-043 or S-044. Every finding here is recorded
  against them; none rewrites a completed result.
- Deciding whether v3.1.3 exists.

## Dependencies And Blockers

- Owner direction. Until it arrives every ticket below stays `blocked`.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Make the presence-only gates and the installer agree on a linked skill destination, or record which is authoritative | blocked | owner direction | pending |
| TK-002 | Emit `stale-seed` and `unverified-provenance` from a seam whose scope matches what they report | blocked | owner direction | pending |
| TK-003 | Bracket every `classify` invocation that classifies a room with a before/after room comparison | blocked | owner direction | pending |
| TK-004 | Decide the citation convention for a shipped tree, then sweep the bare line citations the v3.1.2 merges invalidated | blocked | owner direction | pending |
| TK-005 | Correct S-040's host record and decide whether a linked or Git-owned discovery root is supported, refused, or routed | blocked | owner direction | pending |
| TK-006 | Make registering a diagnostic code without pinning it a red test | blocked | owner direction | pending |
| TK-007 | Withdraw the two false claims S-044's repair introduced, with the granularity of the count named | blocked | owner direction | pending |

## Acceptance Criteria

- [ ] TK-001 closes with a fixture proving the installer and both presence gates
      agree on a host whose every populated root holds the skill as a link.
- [ ] TK-002 closes with the two checks emitted from a seam whose registered
      scope matches, and `wiki.mjs validate` no longer reporting a manifest fact.
- [ ] TK-003 closes with every `classify` invocation that classifies a room
      bracketed by a before/after snapshot - 21 of 34 are today - and a
      correcting row appended to S-044 saying so. Scoped by invocation, not by
      case: three cases counted among S-044's "eleven with a snapshot" still
      classify a room with no write check, so closing this at case granularity
      would leave S-044's original claim false.
- [ ] TK-004 closes with a stated convention for citing a moving file, and every
      bare shipped-tree citation in S-039 through S-044 either re-anchored to an
      immutable `git show <sha>:PATH` reference or removed. Nine in S-039 are
      known stale today, including a checked acceptance box with no fallback;
      roughly 68 further bare citations across the six specs are unswept.
- [ ] TK-005 closes with S-040's host record restated from measurement - the
      symlink is at `~/.claude/skills`, not at the skill directory, and both
      `code-review` directories are ordinary - and with the two refusal codes
      that layout actually produces (`discovery-root-collision`,
      `foreign-git-root`) recorded, plus a decision on whether such a discovery
      root is supported.
- [ ] TK-006 closes with `registeredCodes()` asserted equal to the pinned effect
      map, so a code registered without a pin is red at registration. Two codes
      added since S-043 - `stale-seed` and `unverified-provenance` - are outside
      the pin today, and the reviewed mutation class passes silently against
      them.
- [ ] TK-007 closes with a row appended to S-044 withdrawing "round two's
      wording was true when written" and restating the four-new-cases count with
      its granularity named.
- [ ] Each originating spec's Remaining Limitation names this spec as its owner.

## Testing Seams

- `tools/test-core-skill-installer.mjs` and `tools/test-workbench-upgrade.mjs`.
- `tools/test-diagnostics.mjs` for the emitting seam.
- `tools/test-workbench-layout.mjs` for the classify snapshots.
- `tools/test-diagnostics.mjs` again for TK-006: the pin is a subset check, so
  the seam is a set equality between `registeredCodes()` and the pinned map.
- No test seam exists for TK-004, TK-005 or TK-007; they are record repairs,
  and their proof is a re-reading against a named tree.

## Verification Procedure

```bash
node tools/test-core-skill-installer.mjs
node tools/test-workbench-upgrade.mjs
node tools/test-diagnostics.mjs
node tools/test-workbench-layout.mjs
node workbench/tools/spec-workbench.mjs doctor
```

## Documentation Impact

- The five originating specs' Remaining Limitations gain this spec as owner.
- `RUNBOOK.md` only if a command surface changes.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-06 | spec | Created at the v3.1.2 closeout to own three follow-ups, two of which lost their named owner | S-040 routed its presence-only link gap to a follow-up spec or an upstream item under S-038, and the closeout completed S-038 without opening either. S-042 named S-043 as its `doctor` hook's owner with the fallback "if S-043 merges without the hook, this becomes a new linked spec"; S-043 merged as PR #66 without it, so this is that spec - that fallback fired at PR #66, before the closeout branch existed, and the closeout's first attempt to record this misattributed it to the closeout itself. S-044's six unsnapshotted `classify` cases were counted independently: seventeen cases, eleven with a snapshot | Three specs' Remaining Limitations now name an owner | Every ticket blocked on owner direction; nothing here decides whether v3.1.3 exists |
| 2026-09-06 | spec | Four retrospective separate-context reviews routed five more items here | The v3.1.2 closeout's own review found that four of six slices - S-039, S-040, S-043, S-044 - merged without the fresh review `AGENTS.md` requires after a CHANGES REQUESTED verdict. All four owed reviews were run on 2026-09-06 against their exact unreviewed ranges. S-043 approved and routed one item here (TK-006). S-040, S-039 and S-044 returned CHANGES REQUESTED and routed TK-005, TK-004 and TK-007. TK-003 was re-scoped by S-044's reviewer, who measured 34 `classify` invocations with 21 bracketed and showed that three cases counted among S-044's "eleven with a snapshot" still classify a room with no write check - so the ticket as originally worded would have closed while leaving the claim it exists to fix false | Ticket table, acceptance criteria and testing seams extended; the four originating specs each gained a gate-deviation row naming this spec as the owner of its findings | Every ticket still blocked on owner direction. TK-004 is the largest and the only one whose absence actively misleads a reader of `integration` today |
| 2026-09-06 | spec | Correcting the row above and the ticket table's own description of itself | The row above says "the four originating specs each gained a gate-deviation row naming this spec as the owner of its findings". S-040 gained no row in that commit: its only change was the deletion of two blank lines, and `grep "S-045"` over its evidence rows returned zero. S-038's row in the same commit said so correctly - "S-039, S-043 and S-044 each gained a gate-deviation row in the shape S-040's already had" - so the branch published both statements at once. S-040 now has its row, recording the retrospective outcome and naming TK-005, which makes the claim true of the branch as merged; it was not true when written. Two further corrections: this spec's Outcome, catalog description, `Latest event`, Why It Matters and Documentation Impact all still called it a three-ticket spec in the commit that made it seven, and the stale catalog description reached `BLUEPRINT.md`; and the S-042 conditional was stated as a "fourth" deviation in three places when four are already established, so it is the fifth. Found by the separate-context review of `49a6246` | All mutable prose repaired and `render` re-run so the catalog and Taskboard carry seven; the frozen rows in this spec, S-038 and S-042 are corrected by appended rows rather than edited | None. The seven tickets stay blocked on owner direction |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Whether any of these seven is worth doing is an owner decision. This spec
  makes them reachable; it does not argue for them.
- TK-004 is the one with a live cost: until it closes, nine citations in S-039
  on `integration` point at unrelated content, one of them behind a checked
  acceptance box. That is a reader-facing defect in a merged, completed spec.
- Whether S-042's approving review happened is unresolved. Its `Latest event`
  cites one; no evidence row records it, and the header line was written by its
  own merge commit. Four deviations are established - S-039, S-040, S-043,
  S-044. If S-042's review did not happen it is the **fifth of six**, leaving
  S-041 as the only slice with an evidenced approving review.

## Supersession

- Supersedes: none
- Superseded by: none
