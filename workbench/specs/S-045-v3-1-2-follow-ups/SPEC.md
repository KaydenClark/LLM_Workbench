# S-045 - v3.1.2 Follow-Ups Left Without An Owner

**Spec ID:** S-045
**Status:** active
**Priority:** 4
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-06
**Catalog description:** Own the three follow-ups the v3.1.2 slices recorded and could not close, so owed work appears on the Taskboard and in the spec catalog instead of surviving only as prose inside completed specs.
**Blockers:** owner direction on whether v3.1.3 takes these
**Latest event:** Created at the v3.1.2 closeout because two of the three had their named owner completed out from under them.
**Next gate:** Owner decides whether these land in v3.1.3; until then every ticket stays blocked and `next` correctly excludes them.

## Outcome

Three limitations that S-040, S-042 and S-044 recorded, reviewed, and could not
close inside their own scope have a spec that owns them. Each appears on the
Taskboard and in the Blueprint spec catalog rather than surviving only as prose
inside a completed spec that `AGENTS.md` tells arriving agents not to load.
`next` deliberately does **not** return them: every ticket is blocked on owner
direction, and `next` excludes a blocked slice. Visible and owed, not
dispatchable.

## Why It Matters

Two of the three named an owner that no longer exists.

S-040 routed its presence-only link gap to "a follow-up spec, or an upstream item
under [S-038]". The v3.1.2 closeout completed S-038 without opening either.

S-042 named its `doctor` hook's owner as "the next spec to take the
`spec-workbench.mjs` lane, S-043 while its branch is open; **if S-043 merges
without the hook, this becomes a new linked spec**". S-043 merged as PR #66
without the hook, so that fallback is the operative branch, and this is that
spec.

Without it the harness reports the truth badly: `next --json` returns `null`,
`doctor` exits 0, and the Taskboard lists neither item, while three reviewed
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
  `fs`.

## Desired Behavior

1. The presence-only gates and the installer agree on a host whose skill is
   reached through a link, or the contract states which one is authoritative.
2. The two installed-state checks are emitted from a seam whose scope matches
   what they report, rather than from the wiki validator.
3. All seventeen `classify` cases prove the read-only property, so the claim in
   S-044's Proof column is true as originally written.

## Decisions And Contracts

- **This spec owns the items; it does not re-decide them.** Each was recorded and
  reviewed in its originating spec. Nothing here reopens a completed result.
- **Every ticket is blocked pending owner direction.** These are v3.1.2 residue,
  not v3.1.2 scope. `next` excludes a blocked slice, so creating this spec makes
  the work visible without dispatching it.

## Non-Goals

- Reopening S-040, S-042, S-043 or S-044.
- Deciding whether v3.1.3 exists.

## Dependencies And Blockers

- Owner direction. Until it arrives every ticket below stays `blocked`.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Make the presence-only gates and the installer agree on a linked skill destination, or record which is authoritative | blocked | owner direction | pending |
| TK-002 | Emit `stale-seed` and `unverified-provenance` from a seam whose scope matches what they report | blocked | owner direction | pending |
| TK-003 | Give the six unsnapshotted `classify` cases a before/after room comparison | blocked | owner direction | pending |

## Acceptance Criteria

- [ ] TK-001 closes with a fixture proving the installer and both presence gates
      agree on a host whose every populated root holds the skill as a link.
- [ ] TK-002 closes with the two checks emitted from a seam whose registered
      scope matches, and `wiki.mjs validate` no longer reporting a manifest fact.
- [ ] TK-003 closes with all seventeen `classify` cases comparing a snapshot, and
      S-044's Proof column corrected to say so.
- [ ] Each originating spec's Remaining Limitation names this spec as its owner.

## Testing Seams

- `tools/test-core-skill-installer.mjs` and `tools/test-workbench-upgrade.mjs`.
- `tools/test-diagnostics.mjs` for the emitting seam.
- `tools/test-workbench-layout.mjs` for the classify snapshots.

## Verification Procedure

```bash
node tools/test-core-skill-installer.mjs
node tools/test-workbench-upgrade.mjs
node tools/test-diagnostics.mjs
node tools/test-workbench-layout.mjs
node workbench/tools/spec-workbench.mjs doctor
```

## Documentation Impact

- The three originating specs' Remaining Limitations gain this spec as owner.
- `RUNBOOK.md` only if a command surface changes.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-06 | spec | Created at the v3.1.2 closeout to own three follow-ups, two of which lost their named owner | S-040 routed its presence-only link gap to a follow-up spec or an upstream item under S-038, and the closeout completed S-038 without opening either. S-042 named S-043 as its `doctor` hook's owner with the fallback "if S-043 merges without the hook, this becomes a new linked spec"; S-043 merged as PR #66 without it, so this is that spec - that fallback fired at PR #66, before the closeout branch existed, and the closeout's first attempt to record this misattributed it to the closeout itself. S-044's six unsnapshotted `classify` cases were counted independently: seventeen cases, eleven with a snapshot | Three specs' Remaining Limitations now name an owner | Every ticket blocked on owner direction; nothing here decides whether v3.1.3 exists |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Whether any of these three is worth doing is an owner decision. This spec
  makes them reachable; it does not argue for them.

## Supersession

- Supersedes: none
- Superseded by: none
