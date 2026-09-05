# S-032 - Working Upgrade Route And Source Provenance

**Spec ID:** S-032
**Status:** active
**Priority:** 1
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-05
**Catalog description:** Give an already-adopted v2-root room one documented upgrade route that works without skill replacement and records lifecycle `upgrade`, and stop the layout tool from writing `unrecorded` as a source commit on the Genesis path.
**Blockers:** none
**Latest event:** Spec captured from upstream fix-list items UP-003 and UP-004 after re-reading the upgrade tool.
**Next gate:** Claim TK-001 and prove `init` resolves or demands the source commit.

## Outcome

An agent moving a v2.3 room onto the v3 support root finds one route that the
skills name, that runs on the owner's real host, and that records
`provenance.lifecycle: upgrade` with the exact source commit; a Genesis room's
manifest carries the commit it was generated from without anyone filling it in
by hand.

## Why It Matters

Command Information Center and OpenBrain were both adopted at v2.3. Both moved
to v3.1.1 by running the Adoption migration, the route `skills/adoption/
SKILL.md` forbids for an already-adopted room, because it was the only route
that worked. Both manifests now read `lifecycle: "adoption"` and contradict
their own earlier adoption specs (fix list UP-003, rank `high`). Every
remaining v2 room will do the same. Separately, `workbench-layout.mjs init`
writes `commit: "unrecorded"` when `--source-commit` is omitted and its usage
string does not list the flag; Cashflow Calculator reproduced this from the
tool's own help (UP-004), and the Master Workbench feedback lane logged the
same row on 2026-09-04. S-028 fixed the Adoption and upgrade paths by resolving
the commit inside `migrate`; the Genesis path still writes the placeholder.

## Current Verified State

Verified in this repository at `b7b23dd3f0929e37276880335cd4d4cc60238d8e`
on 2026-09-05:

- **UP-003's stated mechanism does not survive a source read, but its
  conclusion does.** The fix list says `tools/workbench-upgrade.mjs` "never
  creates a `workbench/` support root". At this commit
  `workbench-upgrade.mjs:150` spawns `workbench-adoption.mjs migrate`,
  line 157 rewrites `provenance.lifecycle` to `upgrade`, and
  `tools/test-workbench-upgrade.mjs:86-87` asserts both the lifecycle and that
  the manifest commit equals the receipt commit. The upgrade route does build
  the support root. It is nevertheless the route nobody used, for two
  verified reasons:
  - `workbench-upgrade.mjs:88-114` `preflight` refuses before the layout
    phase when `--explicit-update` is absent (`explicit-update-required`,
    line 89), when a discovery root is inside a Git repository
    (`foreign-git-root`, line 82), or when any same-named installed skill
    lacks the managed marker (`unmanaged-skill`, line 110). S-027's Remaining Limitations record that
    the owner host's discovery root is a foreign Git repository and that the
    installer and upgrade "both fail closed there". On that host the layout
    phase is unreachable because the skill phase gates it.
  - `skills/update-harness/SKILL.md:85-91` describes the command as one that
    "updates only skills bearing the Workbench-managed marker", never as the
    route that creates the support root, and lines 72-73 of the same section
    tell the agent to create specs "through the project's
    `workbench/manifest.json` lane declaration", which a v2 room does not have
    until after that phase. `skills/adoption/SKILL.md:7-9` forbids Adoption
    for an already-adopted room and points at `/update-harness` without
    naming the layout route.
- `workbench/tools/workbench-layout.mjs:213` resolves
  `commit: options['--source-commit'] ?? 'unrecorded'`; line 406's usage
  string lists neither `--source-commit` nor `--source-repository`.
  `templates/GENESIS.md` Phase 6 shows `init` without them. The installed
  downstream copy of the tool must not resolve its own repository's HEAD as a
  source commit, which is why a blind default is wrong in both directions.
- `tools/workbench-tools.mjs:58` `sourceIdentity()` already resolves the
  release checkout's origin, release, commit, and dirty state; S-028 threaded
  it through `migrate`.

Gap: the Genesis-path default, the coupled upgrade preflight, and the skill
text.

## Desired Behavior

1. `workbench-layout.mjs init` and `migrate` list `--source-commit` and
   `--source-repository` in their usage. When omitted and the tool runs from a
   release checkout (the checkout that carries `templates/`), they resolve the
   checkout's `origin` URL and `HEAD`; when omitted anywhere else they fail
   with `invalid-invocation` naming the required flag. `unrecorded` is never
   written.
2. `tools/workbench-upgrade.mjs upgrade` gains `--layout-only`: it requires a
   clean committed target with no support root and all required core skills
   present in the discovery roots (the presence-only readiness Adoption
   already requires), skips marker checks and skill replacement, runs the
   migrate seam, records `lifecycle: upgrade`, and writes
   `upgrade-recovery.json` with `skills: "presence-only"` and an empty
   `skillBackups`. `--explicit-update` keeps today's behavior and remains the
   only path that replaces a skill.
3. `skills/update-harness/SKILL.md` section 3 names the v2-root case first:
   run the layout route, then reconcile specs through the manifest the route
   just declared. `skills/adoption/SKILL.md` opening rule points an
   already-adopted room at that route by name. `templates/ADOPTION.md` says
   the same in one sentence. `RUNBOOK.md` documents both upgrade modes.
4. `provenance.lifecycle` keeps its three values; a v2-root transition on an
   already-adopted room records `upgrade`.

## Decisions And Contracts

- **One route, two modes, one lifecycle.** The already-adopted transition is
  `upgrade`; S-028 rejected a new lifecycle value and this spec keeps that
  decision. Option B, permitting Adoption for the case, was rejected because
  it would make `adoption` mean two things. Option C, fixing only the skill
  text, was rejected because on the owner's host the route still fails closed
  before its layout phase.
- **Skill replacement stays explicit.** `--layout-only` never touches a
  discovery root; it reads presence only.
- **No blind source default.** The Genesis path either resolves the release
  checkout or refuses; the downstream copy of the tool cannot produce a source
  commit and says so.
- **Correct the upstream record.** The evidence log states that UP-003's
  mechanism claim is not supported at this commit while its conclusion is, so
  Master Workbench can record the verdict truthfully.

## Non-Goals

- Repairing the CIC or OpenBrain manifests; each room corrects its own record.
- Rewriting the whole update-harness skill.
- Changing presence-only setup or the explicit-update authorization model.

## Dependencies And Blockers

- none. Reuses S-028's `sourceIdentity` threading and residue contract.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | `init` and `migrate` resolve or demand the source commit; usage and Genesis Phase 6 updated | ready | none | pending |
| TK-002 | `upgrade --layout-only` runs the layout phase without skill replacement; skill and protocol text name the route | ready | TK-001 | pending |

### TK-001 - No more `unrecorded`

**Stance:** Builder

Red first: `init` from this checkout without `--source-commit` must write
`HEAD`'s SHA and the origin URL; `init` from a copy of the tool placed in a
disposable directory without `templates/` must return `invalid-invocation`
naming `--source-commit`; the usage string must list both flags.
`tools/test-workbench-layout.mjs` carries the cases.

### TK-002 - The route works where the skills cannot be replaced

**Stance:** Builder

Red first: a disposable v2 fixture whose discovery roots sit inside a Git
repository must complete `upgrade --layout-only` with `lifecycle: upgrade`,
a manifest commit equal to the receipt commit, and `skills: "presence-only"`
in the recovery record, while `upgrade --explicit-update` on the same fixture
still blocks with `foreign-git-root`. Then rewrite the three skill and
protocol passages and the Runbook section.

## Acceptance Criteria

- [ ] `init` and `migrate` never write `unrecorded`; they resolve the release checkout or fail naming the flag; usage lists both flags.
- [ ] `upgrade --layout-only` completes on a fixture whose discovery root is Git-owned and records `lifecycle: upgrade`; `--explicit-update` behavior is unchanged.
- [ ] update-harness, adoption, and ADOPTION.md name the layout route for already-adopted rooms and no longer send a v2 room to a manifest it lacks.
- [ ] The full required suite, render, and doctor pass.

## Testing Seams

- `workbench-layout.mjs init|migrate` from the checkout and from a relocated
  copy.
- `workbench-upgrade.mjs upgrade --layout-only|--explicit-update` against the
  mixed-v2 fixture with a Git-owned disposable home.
- Skill text assertions in `tools/test-delivery-skills.mjs` or
  `tools/test-skill-catalog.mjs`.

## Verification Procedure

```bash
node tools/test-workbench-layout.mjs
node tools/test-workbench-upgrade.mjs
node tools/test-workbench-adoption.mjs
node tools/test-skill-catalog.mjs
node tools/test-delivery-skills.mjs
```

Then the full `AGENTS.md` verification suite, `render`, `doctor`, and
`git diff --check`.

## Documentation Impact

- `RUNBOOK.md` (root): V3 support-root check and explicit upgrade section.
- `templates/GENESIS.md` Phase 6, `templates/ADOPTION.md` intro,
  `skills/update-harness/SKILL.md` section 3, `skills/adoption/SKILL.md`.
- `LEXICON.md`: `Explicit skill update` distinction gains the layout-only
  mode.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-05 | spec | Spec captured from upstream fix-list items UP-003 and UP-004; UP-003's mechanism claim re-read and found not supported at `b7b23dd` (`workbench-upgrade.mjs:150-157` does build the support root and record `upgrade`) while its conclusion holds because `preflight` gates the layout phase behind skill replacement and the skill text hides the route | `workbench-layout.mjs:213` still defaults to `unrecorded`; usage at line 406 lists no source flags; `test-workbench-upgrade.mjs:86-87` asserts lifecycle and commit on the explicit path | Blueprint v3.1.2 direction links this spec | Both slices |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Rooms already misrecorded as `adoption` are not rewritten by this spec.
- The version stamp belongs to
  [S-035](../S-035-workbench-v3-1-2-candidate/SPEC.md).

## Supersession

- Supersedes: none
- Superseded by: none
