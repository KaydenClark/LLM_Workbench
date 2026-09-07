# S-045 - v3.1.2 Follow-Ups Left Without An Owner

**Spec ID:** S-045
**Status:** complete
**Priority:** 2
**Owner:** claude
**Stance:** Builder
**Updated:** 2026-09-07
**Catalog description:** Own the seven follow-ups the v3.1.2 slices and their retrospective reviews left open, so owed work has a spec that carries it instead of surviving only as prose inside completed specs.
**Blockers:** none
**Latest event:** Spec completed and removed from the hot board.
**Next gate:** none

> **Citation anchors.** pre=`18ffc0d` post=`18ffc0d`. A bare `path:line` citation
> reads at `pre` in Outcome, Why It Matters, Current Verified State and Desired
> Behavior, and at `post` in every other live section. Evidence rows read at the
> commit each row names and are never re-anchored, because they are append-only.
> A `git show <sha>:path` citation is absolute and needs no declaration.

## Outcome

Seven findings that five specs - S-039, S-040, S-042, S-043 and S-044 - recorded
or had raised against them, and could not close inside their own scope, have a
spec that owns them, rather than surviving only as prose inside a completed spec
that `AGENTS.md` tells arriving agents not to load. Three came from the slices
themselves; four more arrived when the retrospective reviews of the four skipped
gates were finally run. This spec appears on the Taskboard and in the Blueprint
spec catalog; all seven tickets live inside it. While it was active the
Taskboard projected one current slice per spec, so it showed TK-001 and not the
other six - a reader reached all seven by opening this spec, which is the
routing that was missing before. The spec is complete now, so the Taskboard no
longer lists it and the Blueprint catalog row is its entry point.
Until 2026-09-07 `next` deliberately did **not** return them: every ticket was
blocked on owner direction, and `next` excludes a blocked slice - owned and
owed, but not dispatchable. That direction arrived on 2026-09-07, the six were
unblocked with the ordering the owner set carried in the Blockers column rather
than in prose, and all seven are now `done` and the spec `complete`.

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
- **WITHDRAWN: "Every ticket is blocked pending owner direction."** True from
  2026-09-06 until the owner's direction arrived. It is superseded, not deleted,
  because the ticket table it described is the one a reader of an earlier commit
  sees.
- **REPLACES IT: all six remaining tickets land in v3.1.3, TK-005 first.** Owner
  decision, 2026-09-07. "TK-005 first" is the owner's only ordering constraint
  and is declared in the Blockers column of the other five; ordering and slicing
  beyond it are the implementing agent's, which the owner stated in as many
  words when the question was put to them. TK-006 additionally declares TK-002,
  because TK-002 moves where the two unpinned codes are registered from and
  TK-006 pins the registered set.
- **A symlinked and/or Git-owned discovery root is SUPPORTED.** Owner decision,
  2026-09-07. This is TK-005's required decision; TK-001 implements it. The
  supported route resolves the link, writes the missing skill into the real
  directory, and never touches Git - no `add`, no `commit`, no `stash`. The
  installed copy still carries its `.workbench-skill.json` marker. The guards
  the decision replaces were not wrong about their intent: `26c34e9` added them
  to stop the harness mutating a user's own versioned skills collection. What
  they lacked was a supported route for the layout they refused, so the refusal
  was total rather than bounded.
- **v3.1.3 does not publish.** This work is delivered to the declared
  `git.integrationBranch`. Whether and when `integration` reaches `main` is the
  owner's, and no ticket here plans for it.

## Non-Goals

- Reopening S-039, S-040, S-042, S-043 or S-044. Every finding here is recorded
  against them; none rewrites a completed result.
- Deciding whether v3.1.3 exists.

## Dependencies And Blockers

Resolved on 2026-09-07. The owner unblocked all six remaining tickets for
v3.1.3 and sequenced TK-005 first. The only dependencies left are the two the
ticket table declares: TK-001 on TK-005, because TK-005 makes the decision
TK-001 implements, and TK-006 on TK-002.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Make the presence-only gates and the installer agree on a linked skill destination, or record which is authoritative | done | TK-005 | Red first, both directions, then green. `tools/test-workbench-upgrade.mjs` gained a host whose every populated discovery root reaches each skill through a link: at 55cacb3^ the layout-only route returned `missing-user-skills` naming all seventeen, and after the change it completes, the links are untouched, and the installer reports the same host as already-present with the target it resolved. `tools/test-core-skill-installer.mjs` gained four: a Git-owned root installs and leaves HEAD, the index and every path untracked; a Git-owned parent does the same; a symlinked root is resolved so one directory reached by two roots is written once, not twice; and an ancestor that is a file, or a link that does not resolve, still blocks with `discovery-root-collision`. That last one used to crash with `invalid-invocation`, because `lstatOrNull` rethrew ENOTDIR. Mutation-checked in both directions: stop following links and three tests go red, refuse a Git-owned root again and two go red. Full AGENTS.md suite 30/30 green at 55cacb3, including `doctor`. |
| TK-002 | Emit `stale-seed` and `unverified-provenance` from a seam whose scope matches what they report | done | TK-005 | Red first: a new case in `tools/test-diagnostics.mjs` runs `wiki.mjs validate --json` against a room with both conditions planted and asserts neither code is reported, while `doctor` reports exactly both. It failed before the move. Mutation-checked by restoring the two emissions to `validateWiki` from f3d9b34^ and watching it go red again. `node tools/test-diagnostics.mjs` 18/18 and `node tools/test-wiki.mjs` 11/11. Full AGENTS.md suite 30/30 green at ef44e8e, doctor included. |
| TK-003 | Bracket every `classify` invocation that classifies a room with a before/after room comparison | done | TK-005 | All 34 of 34 `classify` invocations in `tools/test-workbench-layout.mjs` are bracketed by a before/after `roomSnapshot` comparison, up from 21. Measured with a script that walks each invocation and its argument rather than counting cases. The two invocations that refuse the project path rather than classifying a room are bracketed too, and so is the EPERM probe that runs the classifier in-process under a monkey-patched `fs`, which S-044 named as the reason to count this way. Proved by mutation, not by counting: a classifier made to write one file into every room it is handed fails **11** tests against the pre-ticket file and **17** against this one, so six writes that previously went unseen are now caught. 55/55 green unmutated. Full AGENTS.md suite 30/30 green at ef44e8e. |
| TK-004 | Decide the citation convention for a shipped tree, then sweep the bare line citations the v3.1.2 merges invalidated | done | none | `node tools/test-spec-citation-anchors.mjs` 2/2; 45 live citations across nine specs resolve at their declared anchors |
| TK-005 | Correct S-040's host record and decide whether a linked or Git-owned discovery root is supported, refused, or routed | done | none | Restated from read-only measurement on 2026-09-07. `readlink ~/.claude/skills` returns `/Users/kayden/.agents/skills`, so the symlink is the discovery ROOT, not the skill directory that the S-040 Current Verified State places it at; `lstat` reports both `~/.agents/skills/code-review` and `~/.claude/skills/code-review` as ordinary directories, because only the final path component is left unresolved. `git -C ~/.agents/skills rev-parse --show-toplevel` returns that directory itself and `remote -v` names `KaydenClark/skills`, so the root is Git-owned. Both refusal codes were reproduced, each in its own disposable fixture home, because the real host only ever shows one: `validateDestinations` returns on its first failure and checks `.agents` first, so the real install returns `foreign-git-root` and never reaches `discovery-root-collision`. Fixture A, a symlinked `.claude/skills` with no Git anywhere, returns `discovery-root-collision`; fixture B, a `.git` inside `.agents/skills`, returns `foreign-git-root`. NOT ANTICIPATED BY THIS CRITERION and recorded because it re-scopes TK-001: on this host the presence gates do not disagree with the installer in the direction TK-001 was written for. `lstat` through a symlinked ancestor resolves that ancestor, so `missingUserSkills` and `hasRequiredUserSkills` see every skill under `~/.claude/skills` as present and report only `carry` missing, which is true. The disagreement here runs the other way: the gates accept this host and the installer refuses it outright. |
| TK-006 | Make registering a diagnostic code without pinning it a red test | done | TK-002 | `tools/test-diagnostics.mjs` now asserts `registeredCodes()` equal to the keys of `PINNED_EFFECTS` as a set, and `stale-seed` and `unverified-provenance` are pinned at (attention, feedback, none) and (attention, manifest, none). Red proved twice, because the pin and the assertion landed in one edit: drop those two pins and the set equality fails naming them; register a brand-new code in `diagnostics.mjs` without a pin and it fails naming that, which is the property the ticket asks for - red at registration, before the code can ever be emitted. Every prior assertion was a subset check in one direction or the other, so a registered-but-unpinned code was invisible to all of them. `node tools/test-diagnostics.mjs` 19/19. Full AGENTS.md suite 30/30 green at ef44e8e. |
| TK-007 | Withdraw the two false claims S-044's repair introduced, with the granularity of the count named | done | TK-005 | A row appended to S-044 withdraws "round two`s wording was true when written" outright. That clause is the one statement in that log a reader can still take as standing: rows 377 and 378 correct the sentence around it without ever retracting the clause itself. The four-new-cases count is restated with its granularity named, and re-measured rather than copied from row 378, because repeating a record instead of checking it is the fault this whole thread traces back to. The restated numbers: `git show 57c483f -- tools/test-workbench-layout.mjs` adds exactly **five** `test(classify ...` cases, not four; reading each case body out of `git show 57c483f:tools/test-workbench-layout.mjs` gives **two** with no before/after snapshot at all (case granularity) and **three** containing at least one unbracketed `classify` of a room (invocation granularity). No test seam: this is a record repair, and its proof is the re-reading against the named tree. `python3 tools/test-check-append-only.py` passes, and the full AGENTS.md suite is 30/30 green at ef44e8e. |

## Acceptance Criteria

- [x] TK-001 closes with a fixture proving the installer and both presence gates
      agree on a host whose every populated root holds the skill as a link. It
      also closes the second disagreement TK-005 measured, which this criterion
      did not anticipate and which runs the other way: a symlinked or Git-owned
      discovery *root*, which the gates accepted and the installer refused
      outright. Both now resolve through `tools/skill-presence.mjs`.
- [x] TK-002 closes with the two checks emitted from a seam whose registered
      scope matches, and `wiki.mjs validate` no longer reporting a manifest fact.
- [x] TK-003 closes with every `classify` invocation that classifies a room
      bracketed by a before/after snapshot - 21 of 34 are today - and a
      correcting row appended to S-044 saying so. Scoped by invocation, not by
      case: three cases counted among S-044's "eleven with a snapshot" still
      classify a room with no write check, so closing this at case granularity
      would leave S-044's original claim false. Closed at 34 of 34: the two
      invocations that refuse the project path rather than classifying a room
      are bracketed too, since a refusal that writes is still a write.
- [x] TK-004 closes with a stated convention for citing a moving file, and every
      live bare citation in S-037 through S-045 covered by a declared anchor a
      test resolves. The convention is recorded in `AGENTS.md` and mirrored into
      `templates/AGENTS.md`; `tools/test-spec-citation-anchors.mjs` enforces it
      from S-036 forward.
- [x] TK-005 closes with S-040's host record restated from measurement - the
      symlink is at `~/.claude/skills`, not at the skill directory, and both
      `code-review` directories are ordinary - and with the two refusal codes
      that layout actually produces (`discovery-root-collision`,
      `foreign-git-root`) recorded, plus a decision on whether such a discovery
      root is supported. The decision is recorded in Decisions And Contracts: it
      is **supported**. Two things the criterion did not anticipate are recorded
      with it - the layout produces the two codes one at a time rather than
      together, and a root-level link is the *opposite* disagreement from the
      skill-level link TK-001 was written for.
- [x] TK-006 closes with `registeredCodes()` asserted equal to the pinned effect
      map, so a code registered without a pin is red at registration. Two codes
      added since S-043 - `stale-seed` and `unverified-provenance` - are outside
      the pin today, and the reviewed mutation class passes silently against
      them. Closed with both pinned and the equality asserted, so "outside the
      pin today" describes the pre-state this ticket removed.
- [x] TK-007 closes with a row appended to S-044 withdrawing "round two's
      wording was true when written" and restating the four-new-cases count with
      its granularity named. The restated count is **five** cases, not four -
      re-measured at `57c483f` rather than copied - of which two carry no
      snapshot at all and three contain an unbracketed `classify` of a room.
- [x] Each originating spec's Remaining Limitation names this spec as its owner.
      Verified by reading each: S-039, S-040, S-042, S-043 and S-044 each name
      S-045 as the owner of the finding it routed here.

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
| 2026-09-06 | TK-004 | Owner unblocked TK-004 only; the citation convention is recorded and enforced | The nine S-039 citations were never wrong - they were unanchored. Probed read-only at `eb5a32b`, the tree the repair was written against: `workbench-layout.mjs:696` is `managedRuntimeDrift`, `:665` `receiptDrift`, `:612` `managedReceiptFiles`, `:646` `laneCoverage`, `:548` `validateGenesisRuntime` - each exactly what its prose claims. So the repair is a declared anchor, not a sweep, which would go stale again at the next merge. Each spec from S-037 declares `pre` and `post` shas; bare citations read at `pre` in the four pre-change sections and at `post` elsewhere, and evidence rows read at the commit each row names and are never re-anchored. The `pre` sha was established by measurement rather than assumed: every spec's evidence says "re-verified at `b3633e5`", but `git merge-base` puts all six slice branches on `09bfff7`, and S-044's `controls` citation resolves at `09bfff7` (`workbench-layout.mjs:21`) and not at `b3633e5` (where `controls` is `:20`). S-038's declared `pre` needed a third value again - the guard test refused `b3633e5` because the upstream report does not exist in that tree - so it reads at `09bfff7`, where both its citations land on the content their prose names | `AGENTS.md` Documentation Ownership carries the rule and the generic half is mirrored into `templates/AGENTS.md`; `tools/test-spec-citation-anchors.mjs` added and registered in the `AGENTS.md` and `RUNBOOK.md` suites | **Range, not meaning, is what the test proves.** All 45 live citations resolve in-range at their declared anchors, but only S-044's two carry an identifier next to them that discriminates between candidate trees; the other 43 are in-range at several candidates and the test cannot tell which is meant. Specs S-001 through S-035 are grandfathered with about 65 bare citations unanchored. Both are deliberate and recorded rather than closed |

| 2026-09-07 | spec | Owner direction arrived; the six remaining tickets are unblocked for v3.1.3 and TK-005's decision is recorded ahead of the ticket that implements it | The two refusal codes TK-005 must record were reproduced rather than carried over from the record that named them. On this host, `~/.claude/skills` is a symlink to `~/.agents/skills` (`readlink`), and `~/.agents/skills` is a Git root whose remote is `KaydenClark/skills` (`git -C ~/.agents/skills rev-parse --show-toplevel` and `remote -v`); `carry` is absent from both. `core-skill-installer.mjs install` against the real home returns `blocked` / `foreign-git-root` on `~/.agents/skills`. It reports **one** code, not two: `validateDestinations` returns on its first failure and `.agents` is checked first, so `discovery-root-collision` on the symlinked `.claude/skills` is never reached on this host. Each code was therefore isolated in its own disposable fixture home - a symlinked `.claude/skills` with no Git anywhere returns `discovery-root-collision`; a `.git` inside `.agents/skills` returns `foreign-git-root` | Header fields, Outcome, Decisions And Contracts, Dependencies And Blockers, the ticket table and the stale TK-004 limitation | The decision is recorded; no code implements it yet. TK-001 is the ticket that does, and it declares TK-005 as its blocker so the tool enforces the order rather than prose asking for it |
| 2026-09-07 | TK-005 | Ticket closed | Restated from read-only measurement on 2026-09-07. `readlink ~/.claude/skills` returns `/Users/kayden/.agents/skills`, so the symlink is the discovery ROOT, not the skill directory that the S-040 Current Verified State places it at; `lstat` reports both `~/.agents/skills/code-review` and `~/.claude/skills/code-review` as ordinary directories, because only the final path component is left unresolved. `git -C ~/.agents/skills rev-parse --show-toplevel` returns that directory itself and `remote -v` names `KaydenClark/skills`, so the root is Git-owned. Both refusal codes were reproduced, each in its own disposable fixture home, because the real host only ever shows one: `validateDestinations` returns on its first failure and checks `.agents` first, so the real install returns `foreign-git-root` and never reaches `discovery-root-collision`. Fixture A, a symlinked `.claude/skills` with no Git anywhere, returns `discovery-root-collision`; fixture B, a `.git` inside `.agents/skills`, returns `foreign-git-root`. NOT ANTICIPATED BY THIS CRITERION and recorded because it re-scopes TK-001: on this host the presence gates do not disagree with the installer in the direction TK-001 was written for. `lstat` through a symlinked ancestor resolves that ancestor, so `missingUserSkills` and `hasRequiredUserSkills` see every skill under `~/.claude/skills` as present and report only `carry` missing, which is true. The disagreement here runs the other way: the gates accept this host and the installer refuses it outright. | S-045 Decisions And Contracts records the supported-root decision and that the 26c34e9 guards were not wrong about intent, only about leaving no route; Outcome, Dependencies And Blockers, the ticket table and the TK-005 acceptance criterion updated. S-040 is deliberately not edited: it is complete and contained, and its own evidence row already records the false host record and routes it here, which is the routing AGENTS.md requires. | The decision is recorded; no code implements it yet. TK-001 owns that and declares TK-005 as its blocker. TK-001 must now cover two disagreements rather than one: the skill-level link the presence gates refuse and the installer accepts, and the root-level link and Git-owned root the presence gates accept and the installer refuses. |
| 2026-09-07 | TK-001 | Ticket closed | Red first, both directions, then green. `tools/test-workbench-upgrade.mjs` gained a host whose every populated discovery root reaches each skill through a link: at 55cacb3^ the layout-only route returned `missing-user-skills` naming all seventeen, and after the change it completes, the links are untouched, and the installer reports the same host as already-present with the target it resolved. `tools/test-core-skill-installer.mjs` gained four: a Git-owned root installs and leaves HEAD, the index and every path untracked; a Git-owned parent does the same; a symlinked root is resolved so one directory reached by two roots is written once, not twice; and an ancestor that is a file, or a link that does not resolve, still blocks with `discovery-root-collision`. That last one used to crash with `invalid-invocation`, because `lstatOrNull` rethrew ENOTDIR. Mutation-checked in both directions: stop following links and three tests go red, refuse a Git-owned root again and two go red. Full AGENTS.md suite 30/30 green at 55cacb3, including `doctor`. | The judgment now lives once, in `tools/skill-presence.mjs`, imported by the installer and by both presence gates, with the reason recorded at each of the three call sites so the next change to one is a change to all three. No user-facing command surface or refusal code changed for the routes RUNBOOK.md documents, so RUNBOOK.md and templates/ADOPTION.md were checked and need no update: `foreign-git-root` still exists and is still what `upgrade --explicit-update` returns on a Git-owned root, which is the refusal those documents name. | The relaxation covers installing a MISSING skill only. Replacing one in a Git-owned root is still refused by `upgrade --explicit-update` with `foreign-git-root`, which is deliberate - L4 authorized writing the missing skill, not mutating a collection the user versions - but it means one host layout now has two different answers depending on which route reaches it, and only the install route is exercised by a real host today. The new `gitOwnedRoots` field reports where the installer wrote into a Git repository; nothing consumes it yet. |

| 2026-09-07 | spec | **Correcting row: the "`origin/main` carries no `workbench/` tree" claim in the completed specs.** The owner chose one row folded in here over a new spec | Measured, and the measurement moves the finding twice. **Seven specs carry it, not six.** The handoff and S-049 both name S-037, S-038, S-040, S-041, S-042 and S-044; `grep` over `workbench/specs/*/SPEC.md` adds **S-036**, whose completion row says `git ls-tree origin/main` carries no `workbench/` tree in the same wording. S-049 also carries the sentence, but quotes it in order to disprove it, so it is not a carrier. **And none of the seven was true when written.** S-049 records the claim as stale; it was false. `origin/main` has carried `workbench/manifest.json` since `6d5beef` (2026-08-31, *"feat(layout): dogfood portable workbench root"*, at v3.0.0), proved an ancestor of `origin/main` by `git merge-base --is-ancestor`. Every one of the seven claims was written on 2026-09-06, six days later, by `31ee60b` and `4b4c67c` - dated with `git log -S` against each file. `origin/main` at `9378ead` today carries `workbench/manifest.json` at `v3.1.2` with the sixteen-skill policy. The verification phrasing is what carried the error: each row states it beside a true `git merge-base --is-ancestor` result, so a reader sees one checked command and reads both halves as checked | No completed spec is edited. All seven are append-only records of finished work, and `AGENTS.md` routes a later change to a new linked spec rather than a rewrite; this row is that record, and the owner chose it over opening one. S-049's Remaining Limitations already names the class and can be read against this row | The seven rows still read as published, and nothing in them points here - a reader who opens S-036 alone still meets the false sentence with no marker on it. Correcting that would mean editing seven append-only logs, which the rule forbids, so the gap is the price of the rule rather than an oversight. Worth naming for whoever revisits the convention: an append-only record has no channel for "this was wrong", only for "here is a later record that says so" |
| 2026-09-07 | TK-002 | Ticket closed | Red first: a new case in `tools/test-diagnostics.mjs` runs `wiki.mjs validate --json` against a room with both conditions planted and asserts neither code is reported, while `doctor` reports exactly both. It failed before the move. Mutation-checked by restoring the two emissions to `validateWiki` from f3d9b34^ and watching it go red again. `node tools/test-diagnostics.mjs` 18/18 and `node tools/test-wiki.mjs` 11/11. Full AGENTS.md suite 30/30 green at ef44e8e, doctor included. | RUNBOOK.md Wiki Validation, `workbench/wiki/SCHEMA.md`, `templates/wiki/SCHEMA.md` and the `wiki.mjs` usage string each named the wiki validator as the emitter and now name doctor. No code, severity, scope or effect changed, so the RUNBOOK effects table needed no edit. | The checks still live in `workbench-layout.mjs`, which owns seeding and provenance; only the emitting seam moved. `unverified-provenance` still fires in this room because `provenance.source.release` is v3.1.0, the release it was adopted from - pre-existing, attention-only, and repairing it would mean recording a source identity this room does not have. |
| 2026-09-07 | TK-003 | Ticket closed | All 34 of 34 `classify` invocations in `tools/test-workbench-layout.mjs` are bracketed by a before/after `roomSnapshot` comparison, up from 21. Measured with a script that walks each invocation and its argument rather than counting cases. The two invocations that refuse the project path rather than classifying a room are bracketed too, and so is the EPERM probe that runs the classifier in-process under a monkey-patched `fs`, which S-044 named as the reason to count this way. Proved by mutation, not by counting: a classifier made to write one file into every room it is handed fails **11** tests against the pre-ticket file and **17** against this one, so six writes that previously went unseen are now caught. 55/55 green unmutated. Full AGENTS.md suite 30/30 green at ef44e8e. | A correcting row appended to S-044 stating 21 of 34 before and 34 of 34 now, with the mutation counts. No mutable text in S-044 changes: its Proof column already states eleven of seventeen, which was true of the tree it describes. | The snapshot compares path, type, size and mtime. A write that replaces a file with identical bytes at an identical mtime would pass, which no realistic defect does but the guard cannot see. The count is also a property of this file at this commit; nothing stops a future case adding an unbracketed invocation, since the coverage is not itself asserted by a test. |
| 2026-09-07 | TK-006 | Ticket closed | `tools/test-diagnostics.mjs` now asserts `registeredCodes()` equal to the keys of `PINNED_EFFECTS` as a set, and `stale-seed` and `unverified-provenance` are pinned at (attention, feedback, none) and (attention, manifest, none). Red proved twice, because the pin and the assertion landed in one edit: drop those two pins and the set equality fails naming them; register a brand-new code in `diagnostics.mjs` without a pin and it fails naming that, which is the property the ticket asks for - red at registration, before the code can ever be emitted. Every prior assertion was a subset check in one direction or the other, so a registered-but-unpinned code was invisible to all of them. `node tools/test-diagnostics.mjs` 19/19. Full AGENTS.md suite 30/30 green at ef44e8e. | Docs checked; no update needed. The RUNBOOK.md effects table already lists both codes under `none` (attention), which is what they are pinned at, and no code, severity, scope or effect changed. | The pin is a hand-written table, so adding a code still means editing two files - the registry and the pin. That is the intended friction, but it means the effect a new code gets pinned at is whatever its author writes, and set equality cannot check that the pinned triple is the right one, only that a triple exists. |
| 2026-09-07 | TK-007 | Ticket closed | A row appended to S-044 withdraws "round two`s wording was true when written" outright. That clause is the one statement in that log a reader can still take as standing: rows 377 and 378 correct the sentence around it without ever retracting the clause itself. The four-new-cases count is restated with its granularity named, and re-measured rather than copied from row 378, because repeating a record instead of checking it is the fault this whole thread traces back to. The restated numbers: `git show 57c483f -- tools/test-workbench-layout.mjs` adds exactly **five** `test(classify ...` cases, not four; reading each case body out of `git show 57c483f:tools/test-workbench-layout.mjs` gives **two** with no before/after snapshot at all (case granularity) and **three** containing at least one unbracketed `classify` of a room (invocation granularity). No test seam: this is a record repair, and its proof is the re-reading against the named tree. `python3 tools/test-check-append-only.py` passes, and the full AGENTS.md suite is 30/30 green at ef44e8e. | S-044 gains one appended row. Neither of the two rows it withdraws from is edited, per the append-only rule. | The withdrawal lives in a later row, so a reader who stops at row 375 still meets the withdrawn clause with nothing on it to say so. That is inherent to an append-only log, which has no channel for "this was wrong" - only for "here is a later record that says so" - and the same limit is named in the S-045 correcting row about the seven completed specs. |
| 2026-09-07 | spec | Spec completed | Acceptance gates satisfied | Documentation impact recorded above | none |

| 2026-09-07 | spec | **WITHDRAWN: "none of the seven was true when written".** The correcting row above is itself false, and false by exactly the conflation it accuses the seven specs of | Found by the separate-context review of `origin/integration..288c3d3`, reproduced here before accepting it. `git merge-base --is-ancestor 6d5beef origin/main` proves containment **now**; it says nothing about what `main` carried on `6d5beef`'s author date. `6d5beef` was on `integration`, and reached `main` only as the second parent of `9378ead`. Measured: `9378ead`'s first parent is `08ab78e`, `git merge-base --is-ancestor 6d5beef 08ab78e` exits 1, and `git ls-tree 08ab78e --name-only \| grep -c workbench` returns **0**. So `main` carried no `workbench/` tree at all from `08ab78e` (2026-07-16) until PR #73 merged at **2026-09-06 16:15:35 -0600**. The seven claims were written by `31ee60b` at **05:22:10** and `4b4c67c` at **08:04:29** the same morning - before that merge. **All seven were true when written and went stale the same afternoon** - eight hours and eleven minutes later for the five written by `4b4c67c`, ten hours and fifty-three minutes for S-036 and S-037 by `31ee60b`, stated as a range because a single rounded figure is the kind of imprecision this spec keeps correcting. S-049's original word, "stale", was right, and the row above corrected a correct record into a false one. What stands from that row: **seven** specs carry the claim, not six - S-036 is the seventh - and `origin/main` at `9378ead` carries `v3.1.2` with the sixteen-skill policy today | This row is the record; the row above is left as published, per the append-only rule that row itself describes | The lesson is the row above's own, turned on itself: an ancestry result and a commit date are two facts, and reading them as one is how a checked command produces an unchecked claim. It took an adversarial separate-context reviewer to catch it, which is the argument for that gate rather than for self-review |

## Completion Result

**What changed.** Two code changes and four record repairs.

`tools/skill-presence.mjs` is new, and holds the one judgment about whether a
discovery root already reaches a skill. `tools/core-skill-installer.mjs` and
both presence-only gates - `missingUserSkills` in `tools/workbench-upgrade.mjs`
and `hasRequiredUserSkills` in `tools/workbench-adoption.mjs` - now share it, so
the disagreement TK-001 was opened to repair cannot recur by one of the three
drifting. The installer also resolves a symlinked or Git-owned discovery root
and installs a missing skill into it, keeping the marker and never touching
Git; `discovery-root-collision` survives for an ancestor that is a file or a
link that does not resolve, which used to crash as `invalid-invocation`.

`stale-seed` and `unverified-provenance` moved out of the wiki validator into
`collectionFindings` in `workbench/tools/spec-workbench.mjs`, beside the
managed-runtime check. `tools/test-diagnostics.mjs` pins the registry by set
equality rather than by subset, and `tools/test-workbench-layout.mjs` brackets
all 34 `classify` invocations rather than 21.

The four record repairs are TK-004's citation convention, TK-005's restatement
of S-040's host record, TK-007's withdrawal in S-044, and the correcting row
about the `main`-carries-no-`workbench` claim.

**Why.** Two of these findings named an owner that no longer existed, and the
rest were reviewed observations with nowhere to live. Each is now either fixed
in code with a mutation-checked test, or recorded where the next reader meets
it.

**Verification.** The full `AGENTS.md` suite, 30 commands, green at `ef44e8e`,
`doctor` included, with the command list extracted from the `AGENTS.md` fenced
block rather than hand-typed. Every code change was red first and
mutation-checked in both directions. The install route was then run for real on
the host that motivated it: `carry` written into `~/.agents/skills` at release
v3.1.3, with `HEAD` and the Git index asserted byte-identical afterwards and the
new directory left untracked.

**Two things the acceptance criteria did not anticipate**, both found by
measuring rather than by reading the record, and both recorded rather than
quietly absorbed. The two refusal codes never appear together, because
validation returns on its first failure. And this host's disagreement runs
opposite to the one TK-001 was written for - `lstat` through a symlinked
ancestor resolves it, so the gates accepted the host the installer refused.

**And one thing this spec got wrong.** The correcting row about the seven
completed specs claimed they were false when written. They were true when
written and went stale the same afternoon, between eight and eleven hours later;
the withdrawal is the last evidence row. It is named here rather than left in the log because the row that carried
the error was written expressly to correct an error of the same kind, and a
completion result that reported only the successes would be the same failure a
third time.

## Remaining Limitations Or Follow-Up Specs

- Whether any of these seven was worth doing was an owner decision, taken on
  2026-09-06 for TK-004 and on 2026-09-07 for the other six. This spec made them
  reachable; it did not argue for them.
- TK-004 was the one with a live cost, and it is closed: the nine unanchored
  S-039 citations now resolve at a declared anchor that
  `tools/test-spec-citation-anchors.mjs` checks. Its two residual limits are
  recorded in its own evidence row - the test proves range, not meaning, and
  S-001 through S-035 stay grandfathered.
- **The widened orphan scan will flag legitimate prose under an evidence table.**
  `check-append-only.py` now reads to the next heading rather than stopping at
  the first blank line, which is what closed the blind spot that swallowed
  S-043's gate row. No spec puts prose there today - all 41 were scanned - but a
  future spec that adds a footnote beneath its table will fail with a message
  about rewritten rows, which is the wrong explanation. Recorded rather than
  pre-emptively fixed, because the message is cheap to correct once a real case
  exists and guessing at the shape now is how the citation class started.
- Whether S-042's approving review happened is unresolved. Its `Latest event`
  cites one; no evidence row records it, and the header line was written by its
  own merge commit. Four deviations are established - S-039, S-040, S-043,
  S-044. If S-042's review did not happen it is the **fifth of six**, leaving
  S-041 as the only slice whose *merge was preceded by* an evidenced approving
  review. S-043 has one too, but it was written retrospectively, after the merge
  it should have gated.

## Supersession

- Supersedes: none
- Superseded by: none
