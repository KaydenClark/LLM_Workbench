# S-044 - Legacy Room Classification And Control Reconcile Order

**Spec ID:** S-044
**Status:** complete
**Priority:** 3
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-06
**Catalog description:** Let an agent arriving at a legacy room classify it from its own contents and learn every missing control at once with the reconcile-before-migrate order, instead of deriving both alone.
**Blockers:** none
**Latest event:** Merged into `integration` as PR #70 at `fc68fc0` on 2026-09-06 after separate-context review.
**Next gate:** None; the capability is complete and contained in `integration`.

## Outcome

An agent that arrives at a room with harness-shaped controls but no version
stamp can determine, from a read-only command, whether the room is a genesis,
adoption, or upgrade case, or that it cannot be classified. An agent preparing
a room for adoption learns every missing or unfilled control in one run, along
with the order in which to produce them.

## Why It Matters

Eight rooms found their control inventory structurally incomplete for v3
adoption, most often a missing `LEXICON.md`. Each report independently invented
the same remedy - author the control on an isolated migration branch first - and
each warned against copying a template blindly, because a template would
overwrite a project-specific privacy or boundary rule. Eight agents derived the
same procedure because the contract does not state it.

A ninth room could not establish whether it was an established Workbench
installation eligible for upgrade or an unversioned legacy dialect requiring
adoption, and recorded that treating it as an upgrade could misclassify a first
adoption and lose live roadmap truth. Route selection is the first decision an
arriving agent makes, and it is currently made on judgment rather than on
evidence the room can produce.

## Current Verified State

Verified in this repository on 2026-09-06. The findings were established at
`b3633e5`; the `file:line` citations were re-anchored to the post-S-036 tree
after PR #63 merged, so following one lands on what it names.

- `tools/workbench-adoption.mjs:63-78` iterates
  `workbench/tools/workbench-layout.mjs:21` `controls` (seven files) and
  `return`s on the first failure - `missing-control` at `:74`, or
  `bracketed-control` at `:77`. An operator with three missing controls learns of
  one per run.
- Neither message names an order, a source, or the warning against copying a
  template over project-specific content.
- `templates/ADOPTION.md:218-222` requires the seven controls reconciled "with
  project-specific content", as ordinary files with no `[BRACKETED]`
  placeholder, immediately before the migration seam. It names no order for
  producing a missing one and no scaffold-then-reconcile route.
- `templates/ADOPTION.md:274-275` makes the same requirement a completion box.
- No command classifies a room. `grep -rn classify` over `tools/` and
  `workbench/tools/` matches only `tools/control-fidelity.mjs` line
  classification and `tools/feedback-automation.mjs` decision classification,
  plus those two tools' own test files; neither reads a room's lifecycle.
- `workbench/tools/workbench-layout.mjs:226` `supportedLegacy` recognizes
  `v3.0.0`, `v3.1.0`, and `v3.1.1` manifests. A room with no manifest at all is
  outside every branch of that check.

Gap: a preflight that reports one control at a time with no order, and no
read-only way to classify an unversioned room.

## Desired Behavior

1. The adoption preflight reports every missing or unfilled control in one
   result, each named, rather than returning on the first.
2. The failure names the reconcile-before-migrate order and warns that a
   template copied over an existing control overwrites project-specific privacy,
   boundary, and verification rules.
3. A read-only classify command reports `genesis | adoption | upgrade |
   unclassifiable` for a supplied path, with the evidence for the verdict:
   which of manifest, version stamp, support root, lifecycle tools, legacy
   control shapes, and room contents were found. It writes nothing.
4. `unclassifiable` is a first-class verdict with its reasons listed, not an
   error, so an agent escalates to the owner with evidence rather than guessing.

## Decisions And Contracts

- **Report all, then stop.** The preflight still refuses; it just refuses once
  with the complete list. Fail-closed behavior is unchanged.
- **Classification is read-only and non-authorizing.** It reports evidence; it
  does not select a route, claim work, or authorize a migration. An owner or an
  agent decides with it.
- **`unclassifiable` is an answer.** A room that cannot be classified from its
  own contents must say so with its reasons. Silence and a guessed route are the
  failure mode this closes.
- **The template-overwrite warning belongs in the failure output**, not only in
  the Adoption prose, because the failure is where the agent is standing when it
  decides what to do.
- **One refusal carries one code, and each control carries its own reason.**
  `missing-control` and `bracketed-control` each describe a single control's
  condition, so neither can honestly label a batch that mixes them. The batched
  refusal is `unreconciled-controls`, and every entry in `error.controls` keeps
  its own distinct `reason` of exactly those two values. Nothing outside
  `tools/workbench-adoption.mjs` read either code, so no consumer breaks.
- **A room condition is never a crash, and the boundary is the project path.**
  A lane the room will not let the command `lstat` - `workbench/` or root
  `tools/` at mode 000, a `tools -> tools` symlink loop - is reported as
  undetermined and the room still gets a verdict, because a `chmod 000` lane is
  the same kind of fact as a `chmod 000` control one level down. Undetermined is
  never folded into absent: a lane that may hold the managed runtime tools must
  not be reported as one that does not. The only failure left is the supplied
  project path itself: unreachable, or not an ordinary directory.
- **Nothing under a non-ordinary support root is read, the managed lane
  included.** Gating only the manifest left `workbench/tools/` reachable through
  a `workbench/` symlink, so a room borrowing another room's support root
  reported that room's tools receipt as its own managed runtime lane. The
  verdict was unaffected - Rule 1 fires first - but an agent reading
  `receipt: true` concludes the room carries a lane it does not have. Evidence
  is read by agents, so a false evidence field is a defect whether or not it
  moves the verdict.
- **A `schemaVersion` that is not an integer is not a manifest.** Rule 2 asks
  whether the room carries its own authority, and every Workbench manifest
  records an integer `schemaVersion` that `validateManifest` accepts.
  `{"schemaVersion":"two"}`, `[2]`, `{"n":2}` and `null` satisfied the looser
  "carries `schemaVersion`" reading and read as installed rooms; they are near
  neighbours of a manifest, and the rule is tightened rather than the doc
  loosened. This is rule precision, not a code/doc mismatch: the previous
  wording was literally satisfied.
- **A reading only the evidence carries is a reading the reasons hid.** The
  unfilled-copy reading (a `[BRACKETED]` control, an unresolved version banner)
  was offered under Rule 4 but not under Rule 7, which is exactly where a
  straight `cp -R templates/.` lands. Rather than narrowing the prose to "in the
  evidence", both branches state it: an agent acts on the reasons.
- **A lane is owned by the room only if every component of it is.** Gating the
  read on `workbench/` left the borrowed lane reachable one path level down: an
  ordinary `workbench/` whose `tools` is a link reported another room's
  installed tools and its receipt as this room's managed runtime lane, and so
  did symlinked managed names inside an ordinary lane. The same convention the
  module already applies to a manifest and to a root control - only an ordinary
  file, only an ordinary directory - now covers a lane's directory components
  and its leaves. A root `tools/` reached through a link is the one place the
  evidence moves a verdict, because that limb corroborates harness-shaped, so
  those names are reported as `rootBorrowedNames` and a room with four controls
  and a borrowed `tools/` is `adoption` rather than `unclassifiable`.
- **A room condition is pinned per condition, not per class.** `ROOM_CONDITIONS`
  names five errno values and only two were reachable from a fixture; dropping
  `ENOTDIR` or `ENAMETOOLONG` restored the exit-1-with-a-leaked-message the
  class exists to remove while the suite stayed green. `ENOTDIR` (a regular file
  where a lane name would be) and `ENAMETOOLONG` (a link to a name the
  filesystem will not resolve) are pinned as rooms; `EPERM`, which no fixture can
  produce on demand, is pinned at the `fs.lstatSync` seam the set is declared
  over.
- **Undetermined gets a bucket wherever it is reported.** `legacyPaths` filtered
  the legacy lane names through a predicate that returned false for both absent
  and unreadable, so a `specs/` the room would not stat was emitted as one the
  room does not carry - the exact fold the file's own invariant forbids. The
  helper is gone and the legacy lanes are read like every other lane, with
  `legacyPathsUnreadable` beside `legacyPaths`.
- **The classifier is a release-checkout tool, not a runtime tool.** It lives at
  `tools/workbench-classify.mjs`, beside `workbench-adoption.mjs` and
  `workbench-upgrade.mjs`, because the room it classifies may carry no installed
  `workbench/tools/` at all - that absence is one of the facts it reports. Adding
  it to the installed runtime set would require the room to already be a
  Workbench installation, which is the question it exists to answer.

### The classification rule

The verdict is a **route**, not a history: it answers "which of the three
lifecycle routes does this room's own evidence support, or does it support
none of them". A room's recorded `provenance.lifecycle` is reported as evidence,
never as the verdict. Six evidence categories are gathered, all read-only:
`manifest`, `versionStamp`, `supportRoot`, `lifecycleTools`,
`legacyControlShapes`, and `roomContents`.

A path the room will not let the command `lstat` - a lane at mode 000, a lane
behind a symlink loop, a name under a regular file, a link whose target is too
long to resolve, a name the kernel refuses outright - is a fact about the room,
exactly as an absent path is, and is reported as undetermined rather than
counted as absent. Each of the five conditions is pinned by a case that fails
when it is dropped, so the class cannot narrow back to the two a fixture
happened to reach. Only the supplied project path is different: if that cannot be stat-ed,
or is not an ordinary directory, there is no room to report on and the command
refuses the invocation. Nothing else in a room makes it exit non-zero.

Two derived predicates:

- **stamped** - at least one present root control carries a
  `Generated from | Part of LLM Workbench vX.Y.Z` stamp
  (`workbench-layout.mjs` `versionStamp`). A release demonstrably wrote here. A
  banner whose version never resolved (a copied `v[HARNESS_VERSION]`) is not a
  stamp; it is reported separately as `versionStamp.unresolved`.
- **harness-shaped** - all seven root controls are present, or the room's own
  root `tools/` carries an ordinary file named in the managed runtime-tool set
  **and** the room carries more of the seven controls than it is missing. A
  `tools/` that is a link out of the room, and a managed name inside it that is
  itself a link or a directory, are another room's files under this room's path;
  they are reported as `rootBorrowedNames` and never satisfy this limb. The seven controls
  are the Workbench's exact closed set, so the whole set corroborates itself.
  The managed runtime-tool names do not: `privacy.mjs`, `sessions.mjs`,
  `diagnostics.mjs` and `markdown-table.mjs` are ordinary filenames any project
  may own, so that limb needs the control-set corroboration. Without it, a
  vanilla application carrying one such file and six absent controls would be
  called Workbench-shaped on evidence that says the opposite.

Ordered, first match wins:

1. `workbench/` exists but is not an ordinary directory, or its
   `workbench/manifest.json` is absent, unreadable, or not a Workbench manifest
   -> **`unclassifiable`**. A support root without its own authority is neither
   an installed room nor a clean adoption target, and Adoption's preflight
   already refuses it as `support-root-exists`. Nothing under a support root
   that is not an ordinary directory is read - not the manifest, and not the
   managed `workbench/tools/` lane: following a `workbench/` symlink would
   report another room's manifest as this room's authority and another room's
   tools receipt as this room's managed runtime lane. A
   `workbench/manifest.json` that is not itself an ordinary file is never opened
   either, for the same reason, and neither is a `workbench/tools` that is not
   an ordinary directory under an ordinary `workbench/`: the gate is on every
   component the lane is read through, not on the support root alone. The room's stamp state is listed as a reason
   here, because in a stamped room it is the decisive evidence that a release
   did write here.
2. `workbench/manifest.json` reads as a JSON object carrying an integer
   `schemaVersion` -> **`upgrade`**. The room is an installed Workbench room, so
   it is neither a genesis nor a second adoption; every move from here is an
   upgrade. Whether it needs one - schema 1 migrate, a version bump, or
   nothing - is `validateManifest`'s answer, and the classifier reports the
   manifest's `schemaVersion`, `workbenchVersion`, and `provenance.lifecycle`
   as evidence so the reader can see which. Parsing is not reading: an unrelated
   JSON object (`{"name":"my-workbench-app"}`), an array, or a bare `null` is
   valid JSON and no room's authority, so it falls to Rule 1 rather than
   claiming an installation. Neither is a `schemaVersion` the room carries but
   never filled in (`null`) or filled with the wrong shape (`"two"`, `[2]`,
   `{"n":2}`): every Workbench manifest records an integer and
   `validateManifest` accepts nothing else, so those are near neighbours of a
   manifest rather than one.
3. Not stamped, and something the room holds could not be read - a present root
   control, or the room's own top-level listing -> **`unclassifiable`**. A
   control that will not open leaves the stamp evidence incomplete, so an
   unstamped room and a stamped one whose only stamp is in the unreadable
   control are indistinguishable; a room that will not list itself leaves the
   genesis and adoption readings open, because that listing is exactly what
   separates them. What could not be read is named, and read access is the fix;
   this is a fact about the room, never a failed invocation.
4. Not stamped, no manifest, but harness-shaped -> **`unclassifiable`**. The
   shape says a Workbench-shaped harness; the absent stamp and manifest say no
   release recorded itself. An unstamped Workbench room (upgrade) and an
   independent dialect reusing the same names (adoption) both produce exactly
   this evidence, and the room does not say which. Both readings are listed as
   reasons so the agent escalates with evidence instead of guessing. When the
   controls still carry `[BRACKETED]` placeholders (the same shape
   `workbench-adoption.mjs` refuses as `bracketed-control`) or an unresolved
   version banner, a third reading is listed: an unfilled copy of `templates/`
   rather than a room any release installed.
5. Stamped, no manifest -> **`upgrade`**. This is the already-adopted v2-root
   room `workbench-upgrade.mjs upgrade --layout-only` exists for.
6. The room is empty apart from `.git` -> **`genesis`**. No content to derive
   filled controls from.
7. Otherwise -> **`adoption`**. A working room with real content, no Workbench
   installation to upgrade, and no Workbench-shaped ambiguity. The unfilled
   copy reading is offered here too, and for the same reason as under Rule 4: a
   straight `cp -R templates/.` lands on this branch, because `templates/`
   carries no `CLAUDE.md` and so is never harness-shaped, and its controls are
   the templates themselves rather than truth to derive filled controls from. A
   reading carried only in the evidence is a reading the reasons hid, so both
   branches state it.

Rule 7 is why a repository carrying only application code and a `README.md`
is `adoption` and not `genesis`: `templates/ADOPTION.md` already routes a target
with real code to Adoption, and Genesis derives from a founding prompt rather
than from a repository. It is also why a vanilla Node application whose root
`tools/` happens to hold a `privacy.mjs` is `adoption`: six absent controls are
its own evidence that no Workbench installed there.

## Non-Goals

- Authoring any room's missing controls automatically.
- Changing which seven controls are required.
- Making the classifier decide the route or perform the migration.

## Dependencies And Blockers

- none

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Report every missing or unfilled control in one preflight result, with the reconcile order and the template-overwrite warning | done | none | `tools/test-workbench-adoption.mjs` names all four unreconciled controls in one refusal |
| TK-002 | Add a read-only classify command reporting `genesis \| adoption \| upgrade \| unclassifiable` with its evidence | done | none | `tools/test-workbench-layout.mjs` carries seventeen `classify` cases - every verdict, every room condition its rule names, and every borrowed lane - of which eleven compare a recursive path/size/mtime snapshot of the room before and after to prove the command writes nothing. The other six assert verdicts, reasons, or a refusal without a snapshot; the one that matters most for the read-only property is the EPERM seam probe, which runs the classifier under a monkey-patched `fs` and has no write check of its own |

### TK-001 - Name every missing control at once

**Stance:** Builder

Red first, in `tools/test-workbench-adoption.mjs`: a fixture project missing
three controls and carrying a placeholder in a fourth must produce one refusal
listing all four, each by name and by reason. That must fail at `b3633e5`, which
reports one. Then collect instead of returning early, and add the order and the
warning to the message.

### TK-002 - Classify from evidence

**Stance:** Builder

Red first, in `tools/test-workbench-layout.mjs` or a focused suite: four
fixtures - a bare directory, a v2-root legacy room, a current v3 room, and a
harness-shaped room with no manifest or version stamp - must classify as
`genesis`, `upgrade`, `adoption` or `upgrade` per the recorded rule, and
`unclassifiable` respectively, each with the evidence that produced the verdict.
Assert the command writes nothing by comparing a directory listing and mtimes
before and after.

## Acceptance Criteria

- [x] A project missing several controls produces one refusal naming each.
- [x] The refusal names the reconcile-before-migrate order and the
      template-overwrite warning.
- [x] A read-only classify command returns one of the four verdicts with the
      evidence for it, and writes nothing.
- [x] `unclassifiable` lists the reasons the room could not be classified.
- [x] `node tools/test-workbench-adoption.mjs`,
      `node tools/test-workbench-layout.mjs`, and
      `node tools/test-workbench-upgrade.mjs` pass, new cases red before green.
- [x] The full `AGENTS.md` verification suite passes.

## Testing Seams

- `tools/workbench-adoption.mjs` `preflight` result shape
  (`tools/test-workbench-adoption.mjs`).
- The new classify entry point, driven from fixture projects
  (`tools/test-workbench-layout.mjs`).

## Verification Procedure

```bash
node tools/test-workbench-adoption.mjs
node tools/test-workbench-layout.mjs
node tools/test-workbench-upgrade.mjs
node tools/evaluate-workbench.mjs --path templates --include-controls
node workbench/tools/spec-workbench.mjs doctor
```

## Documentation Impact

- `templates/ADOPTION.md`: the reconcile order stated once, and the classify
  command in the route-selection step.
- `RUNBOOK.md`: the classify command and its verdicts.
- `skills/update-harness/SKILL.md`: route selection reads the classifier.
- `LEXICON.md`: the four verdicts as accepted terms if they are used across
  controls.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-06 | spec | Spec captured from upstream UP-022 and UP-023 and re-verified at `b3633e5` | Read `workbench-adoption.mjs:63-78` (returns on the first failing control), `workbench-layout.mjs:20,226`, `templates/ADOPTION.md:218-222,274`; grepped `classify` across `tools/` and `workbench/tools/` and found no lifecycle classifier | Blueprint catalog regenerated by render | Both slices open; the first-control-only behavior sharpens UP-022 beyond the upstream statement |
| 2026-09-06 | spec | Restored the append-only capture row that two rounds of citation repair had rewritten | The capture row above was created at `288c821` citing `workbench-layout.mjs:20,226` and `templates/ADOPTION.md:218-222,274`. It was rewritten at `a5e7fe0` (`274` to `275-276`) and again at `d1de47f` (`:20` to `:21`, `275-276` to `274-275`, plus a parenthetical about four matching files that was never in the original record), both violating `AGENTS.md` Documentation Ownership. It is restored byte-for-byte and the corrections are recorded here instead: at `b3633e5` `controls` really was at `workbench-layout.mjs:20` and the seven-controls completion box really was at `ADOPTION.md:274`, so the original row was right and both rewrites degraded it; the `a5e7fe0` change to `275-276` was the only substantive error. Against the post-S-036 tree those facts are at `:21` and `:274-275`, which live Current Verified State cites | No control text changed | Both slices open |

| 2026-09-06 | TK-001 | One `unreconciled-controls` refusal now names every failing root control with its own reason, the four-step reconcile order, and the template-overwrite warning | Red at `09bfff7`: the new `tools/test-workbench-adoption.mjs` case failed `AssertionError [ERR_ASSERTION]: one refusal must name every unreconciled control with its own distinct reason`, actual `undefined` (the base returns on the first control and carries a singular `error.control`). Green after collecting: `ok - one adoption refusal names every unreconciled control, the reconcile order, and the overwrite warning`. Re-anchored the cited seam first: `missing-control` is at `tools/workbench-adoption.mjs:74` and `bracketed-control` at `:77` in the pre-change tree, and `grep` found no reader of either code outside that file | `templates/ADOPTION.md` Phase 7 states the reconcile order and the overwrite warning once and records that the refusal repeats them; `RUNBOOK.md` V3 Adoption migration check documents the `unreconciled-controls` shape | TK-002 open; the classification rule is now recorded in Decisions And Contracts but not yet implemented |

| 2026-09-06 | TK-002 | `tools/workbench-classify.mjs classify --project PATH` reports `genesis \| adoption \| upgrade \| unclassifiable` with its reasons and five evidence categories, and writes nothing | Red at `b25c24c`: the two new `tools/test-workbench-layout.mjs` cases failed `Error: Cannot find module .../tools/workbench-classify.mjs`, `actual: 1, expected: 0` - no command classified a room. Green after adding the tool: `✔ classify reports a lifecycle verdict with its evidence and writes nothing`, `✔ classify refuses to guess a support root that carries no readable manifest`, `tests 34 / pass 34 / fail 0`. Six fixtures cover all four verdicts; each read-only assertion compares a recursive path/size/mtime snapshot of the room before and against after | `RUNBOOK.md` gains a Room lifecycle classification check with the verdict table; `templates/ADOPTION.md` puts the command in route selection and in Phase 0 step 3 | `skills/update-harness/SKILL.md` is owned by S-040 and S-041 this round, so route selection does not yet read the classifier - recorded as a follow-up rather than edited across lanes. `LEXICON.md` gains no entry: `unclassifiable` is used by one tool and two docs, not across controls |

| 2026-09-06 | spec | Full verification run for both slices, with the guardrail baseline captured before and after | Every suite in the `AGENTS.md` list passes at `f265a60`, plus `evals/tasks/task_b_path_safety/test_grade.py`, `render` (40 specs, 11 active, no drift), `doctor` (exit 0, no blocking finding), `check-append-only.py` (CLEAN), `git diff --check` clean, and `git grep -Il $'\r' -- '*.md'` empty. Guardrail: `evaluate-workbench.mjs --path templates --include-controls` scores 106.6/113 both at the base `09bfff7` (from `git archive`) and after this change - no criterion was weakened, and the static score is unchanged because the added Adoption prose is procedure, not a new guardrail surface | No further docs change; the owners named in the two ticket rows carry the change | The `skills/update-harness/SKILL.md` route-selection sentence and any `LEXICON.md` promotion stay deferred as recorded in Remaining Limitations |

| 2026-09-06 | TK-002 | Repaired the recorded classification rule after a separate-context review returned CHANGES REQUESTED: the harness-shaped predicate now corroborates its managed-filename limb, an unreadable manifest shape and a symlinked support root classify instead of misreporting, an unreadable root control is a room condition, and the CLI is guarded by `isMainModule` | Five red cases first, all in `tools/test-workbench-layout.mjs`, each run before any implementation. (1) A vanilla Node app (`README.md`, `package.json`, `src/index.js`, `tools/privacy.mjs`) asserted `adoption`: `AssertionError [ERR_ASSERTION]: one generic managed filename cannot make a room whose own evidence shows six absent controls harness-shaped`, actual `'unclassifiable'`. (2) `workbench/manifest.json` holding `{ "name": "my-workbench-app", "version": "1.0.0" }`: `an unrelated JSON object must not read as an installed Workbench room`, actual `'upgrade'`. (3) A `workbench/` symlink into another initialized room: `another room's manifest, reached through a symlink, cannot make this room an installed room`, actual `'upgrade'`. (4) `chmod 000` on a root control: `{"status":"blocked","error":{"code":"invalid-invocation","message":"EACCES: permission denied, open '.../LEXICON.md'"}}`, `1 !== 0`. (5) Importing the module: `{"status":"blocked","error":{"code":"invalid-invocation","message":"Usage: workbench-classify.mjs classify --project PROJECT ..."}}`, `1 !== 0`. Green after the repair, with the pre-existing 34 cases untouched and unweakened: `tests 40 / pass 40 / fail 0`, including `classify corroborates the root tools/ shape before calling a room harness-shaped`, `classify refuses a workbench/manifest.json that is not a Workbench manifest` (object, array and null), `classify never reads a workbench/ symlink out of the room`, `classify treats an unreadable root control as a room condition, not a crash`, `classify reports the unfilled state of a straight template copy as evidence`, and `importing the classifier does not run its command line`. Every new case that classifies a room also compares the recursive path/size/mtime snapshot before and after | Decisions And Contracts records the repaired rule (corroborated harness-shaped predicate, the manifest shape guard, the support-root symlink refusal, the new unreadable-control rule, and the unfilled-template evidence); `RUNBOOK.md` verdict table and prose updated to match; `templates/ADOPTION.md` re-wrapped one over-long line with no wording change | `skills/update-harness/SKILL.md` stays deferred to S-040/S-041 as before |

| 2026-09-06 | TK-002 | Second repair after the re-review: the crash class and the support-root read gate are fixed for the class rather than the named instance, two mutation-proven coverage holes are pinned, and the prose that overstated the contract is now true | Reds first, each captured before any implementation. (1) The crash class, in one new `tools/test-workbench-layout.mjs` case over four rooms - `workbench/` at mode 000 holding a manifest, root `tools/` at mode 000 with seven stamped controls, a `tools -> tools` symlink loop with seven stamped controls, and a room that will not list itself: `AssertionError [ERR_ASSERTION]: {"status":"blocked","error":{"code":"invalid-invocation","message":"EACCES: permission denied, lstat '.../workbench/manifest.json'"}}`, `1 !== 0`. (2) The borrowed managed lane: `AssertionError [ERR_ASSERTION]: nothing under a support root that is not an ordinary directory may be read, the managed lane included`, actual `undefined`, expected `false` - the base reported `lifecycleTools` `receipt: true` and three installed tools read through the `workbench/` symlink while `manifest` correctly reported nothing. (3) A wrong-typed manifest: `a string schemaVersion must not read as an installed Workbench room`, actual `'upgrade'`. (4) The unfilled reading on the adoption branch: `an unfilled copy of the templates is a reading of the room, so it belongs in the reasons and not only in the evidence`, actual `false`. (5) The two coverage pins are red only under their mutant, which is what makes them pins: deleting `|| manifest.schemaVersion === null` gave `a null schemaVersion must not read as an installed Workbench room`, and deleting Rule 1's whole `stamp.stamped.length ? ... : ...` reason gave `in a stamped room the stamp is the decisive evidence that a release did write here, so Rule 1 must name it`. Green: `tests 46 / pass 46 / fail 0` in `tools/test-workbench-layout.mjs`, no pre-existing case weakened or removed. Every new case that classifies a room still compares the recursive path/size/mtime snapshot before and after, the four `chmod 000` rooms included. Mutation testing over 30 mutations of `tools/workbench-classify.mjs`: 27 caught, 3 survivors each proven equivalent - dropping `Array.isArray(manifest)` is subsumed by `!Number.isInteger(manifest.schemaVersion)` because a JSON array has no `schemaVersion` property; flipping the unlistable room's `empty` to `true` cannot change a verdict because Rule 3 catches every unstamped unlistable room and Rule 5 every stamped one, so Rule 6 is unreachable there; and dropping `entry.isSymbolicLink()` from the project-path guard changes nothing because under `lstat` a symlink is never `isDirectory()` | `RUNBOOK.md`: the exit-1 sentence now names the room conditions that return a verdict instead, the symlink sentence covers the managed lane and a symlinked `manifest.json`, the `unclassifiable` row adds the unlistable room, and the unfilled-copy sentence says the reading is listed among the reasons under both verdicts. This spec: six evidence categories rather than five (`roomContents` was gathered and undeclared, pre-existing), Rule 1 extended to the managed lane, Rule 2 to the integer `schemaVersion`, Rule 3 to the unlistable room, Rule 7 to the unfilled reading, plus four new Decisions And Contracts entries. `templates/ADOPTION.md`: `unclassifiable` also covers a room that will not let something be read | `skills/update-harness/SKILL.md` stays deferred to S-040/S-041 as before. The three equivalent mutants are left as they are: `Array.isArray` and the symlink limb document intent at the seam they guard, and the `empty: false` default is defensive against a future rule reordering |
| 2026-09-06 | TK-002 | Third repair after the third review: the borrowed lane is closed at every path component rather than at the support root alone, the three room conditions no fixture reached are pinned, an unreadable legacy lane gets its own bucket, and the Completion Result now records all three rounds | Reds first, each captured before any implementation. (1) The lane one component down, in a room whose `workbench/` is an ordinary directory holding its own `manifest.json` and whose `tools` is a link into another room: `AssertionError [ERR_ASSERTION]: a relative symlinked lane: a managed lane reached through a link out of the room is never read`, actual `true`, expected `false` - the base reported that room's five installed tools and `receipt: true`. (2) The borrowed root lane: `AssertionError [ERR_ASSERTION]: a managed filename reached through a link out of the room is not this room's root lane`, actual `[ 'privacy.mjs' ]`, expected `[]`, in a four-of-seven-control room the borrowed name made harness-shaped. (3) The undetermined legacy lane: `TypeError: Cannot read properties of undefined (reading 'includes')` on `legacyControlShapes.legacyPathsUnreadable`, which did not exist. (4) Five coverage pins, red only under their mutant: dropping `ENOTDIR` gave `AssertionError [ERR_ASSERTION]: {"status":"blocked","error":{"code":"invalid-invocation","message":"ENOTDIR: not a directory, lstat '.../tools/adr.mjs'"}}`, dropping `ENAMETOOLONG` gave the same refusal reading `ENAMETOOLONG: name too long, lstat '.../tools/adr.mjs'`, dropping `EPERM` made the seam probe die with `Error: EPERM: operation not permitted, lstat '.../tools/privacy.mjs'` thrown out of `lstatOrNull`, folding an unstat-able control into `missing` gave `a control the room will not stat is present-or-absent unknown, never counted among the missing` (actual `[]`), and reporting an unstat-able support root as present gave `a room that will not let its own support root be stat-ed reports it neither present nor absent`, actual `true`, expected `null`. Green: `tests 50 / pass 50 / fail 0` in `tools/test-workbench-layout.mjs`, four cases added and no existing case weakened or removed. Every new case that classifies a room compares the recursive path/size/mtime snapshot before and after. Mutation testing over 33 mutations of `tools/workbench-classify.mjs`: the first run caught 20 and exposed three real holes in the new code (a directory wearing a managed tool name, an absent managed lane read as a borrowed one, and a symlinked leaf inside an ordinary root `tools/`), which are now pinned by two added rooms; the second run caught 23 with 10 survivors, each equivalent - seven because `lstat` never reports a symlink as a file or a directory, so an `isSymbolicLink()` limb beside an `isFile()` or `isDirectory()` test cannot change an outcome, and the three carried forward from the previous round (`Array.isArray`, the unlistable room's `empty` default, and the project-path symlink guard) | `RUNBOOK.md`: the room-condition sentence names the two further conditions, the `upgrade` verdict row says an integer `schemaVersion`, and the symlink paragraph now covers `workbench/tools`, a symlinked managed name, and the borrowed root lane. This spec: the rule prose states that every component a lane is read through must be the room's own and that each of the five room conditions is pinned, Rule 1 extends the gate below the support root, the harness-shaped predicate names `rootBorrowedNames`, three Decisions And Contracts entries are added, the TK-002 proof column names what the suite actually proves, and the Completion Result - which is not append-only - is corrected in place to record all three rounds and their four behavior changes. `templates/ADOPTION.md` checked; no update needed: its `unclassifiable` sentence already covers a control, a lane, or the listing the room will not let be read | `skills/update-harness/SKILL.md` stays deferred to S-040/S-041. The ten equivalent mutants are left as they are: each documents intent at the seam it guards. A root `tools/` that is a link is reported as borrowed rather than refused unread, because unlike the support root it carries no authority to borrow |

| 2026-09-06 | TK-002 | Correcting row: the mutation-survivor partition in the row above is wrong, and the count it gives is not the one the run produced | The row above says "seven because `lstat` never reports a symlink as a file or a directory ... and the three carried forward". Re-checked against the run: the `lstat` argument covers six survivors, not seven - `ordinaryFile`'s symlink limb, `ownDirectory`'s symlink limb, `supportRootEvidence`'s `ordinaryDirectory` symlink limb, `controlEvidence`'s symlinked control, `manifestEvidence`'s symlinked manifest, and the project-path symlink guard - and that last one is also one of the three carried forward, so the two groups as written overlap and do not partition the ten. The correct partition is six by the `lstat` argument (the project-path guard among them), two call-site equivalences (`ownDirectory` returning `true` instead of `null` for a path the room did not answer for, because both call sites compare `=== false`; and Rule 1's non-ordinary limb, because `manifestEvidence` already returns `readable: false` under exactly that condition), and two carried forward (`Array.isArray`, subsumed by the integer `schemaVersion` test, and the unlistable room's `empty: false` default, unreachable past Rules 3 and 5). The totals the row gives - 33 mutations, 23 caught, 10 survivors - are unchanged, and no survivor's equivalence claim is withdrawn | The Completion Result's `How verified` paragraph, which is not append-only, states the corrected partition in place | None. This corrects a claim about the verification, not the verification |

| 2026-09-06 | TK-002 | Fourth separate-context review found the code clean and one proof claim false; corrected here | Reviewer built its own donor room and eight borrower shapes and confirmed zero evidence fields report anything a room does not own; pinned all five errno values by mutation; re-introduced the builder's three self-found holes and confirmed each is caught; independently confirmed all ten equivalence arguments analytically rather than empirically; and re-proved read-only in a child process with 23 `fs` mutators plus write-flag `openSync` poisoned, snapshotting both borrower and donor. The defect: the TK-002 Proof column said the seventeen `classify` cases **each** compare a before/after snapshot. Eleven do. Six do not - the unreadable-root-control case, the two template-copy readings, the stamp-state case, the project-path refusal, and the EPERM seam probe - and five of those classify a real room. The EPERM case is the sharpest: it is the one that runs the classifier under a monkey-patched `fs`, so a poisoning mistake there would be invisible. The append-only row recording this round says "Every new case that classifies a room compares the snapshot"; two of this round's four new cases break it, and round two's wording ("also compares") was true when written. Counted independently before correcting: 11 with, 6 without, 17 total | The mutable Proof column now states eleven of seventeen and names what the other six assert; the append-only row is corrected here rather than edited | Adding the six missing snapshots would make the original claim true and is the better close; it is a test-only change and is left for a follow-up rather than taken in a record repair after the behavior passed review |
| 2026-09-06 | spec | Spec completed; the reviewed candidate is contained in `integration` | Merged as PR #70 at `fc68fc0`. `git merge-base --is-ancestor fc68fc0 origin/integration` returns true; `git ls-tree origin/main` carries no `workbench/` tree, so `main` is untouched. Full `AGENTS.md` suite re-run on the merged `integration` tip `18ffc0d`: 25 node suites plus the path-safety grader all pass, `render` leaves no drift, `doctor` exits 0, `check-append-only.py` CLEAN, `git diff --check` clean, no CRLF. Guardrail 78/100 and templates 106.6/113, both unchanged from the pre-implementation baseline - a control-surface change is not expected to move either, and neither moved | Status, latest event, next gate and Completion Result reconciled with the merged reality | Limitations recorded in this spec stay open and routed; none is closed by the merge |

## Completion Result

**What changed.** `tools/workbench-adoption.mjs` `preflight` collects every
unreconciled root control instead of returning on the first, and refuses once as
`unreconciled-controls` with `error.controls` naming each control and its own
`missing-control` or `bracketed-control` reason, plus `error.reconcileOrder` and
`error.templateOverwriteWarning`; the message carries all three. New
`tools/workbench-classify.mjs` reports a read-only lifecycle verdict with its
reasons and the `manifest`, `versionStamp`, `supportRoot`, `lifecycleTools`,
`legacyControlShapes`, and `roomContents` evidence behind it, exiting 0 for all
four verdicts.

After the first separate-context review, the classifier's rule was repaired in
three places where it mislabelled real rooms and hardened in two more: the
harness-shaped predicate requires the managed-filename limb to be corroborated
by the control set, a manifest must read as an object carrying an integer
`schemaVersion` rather than merely parse, a `workbench/` that is not an ordinary
directory is never read through, an unreadable root control classifies as a room
condition instead of exiting 1 with an internal message, and the command line
runs only under `isMainModule`. The evidence gained `versionStamp.unreadable`,
`versionStamp.unresolved`, and `legacyControlShapes.controlsBracketed`.

The second review found each of those fixed for its named room rather than for
its class, and the second repair closed the classes: every path the room will
not let the command `lstat` is a room condition that still returns a verdict
(`ROOM_CONDITIONS`, five errno values) rather than an exit 1 carrying a
filesystem message; nothing under a `workbench/` that is not an ordinary
directory is read, the managed `workbench/tools/` lane included; and the
`schemaVersion` a manifest must carry is an integer, which no near neighbour of
a manifest satisfies.

The third review found the borrowed lane still reachable one path component
lower, and this repair closes it at every component: an ordinary `workbench/`
whose `tools` is a link is not read either, a managed name inside an ordinary
lane that is itself a link or a directory is not an installed tool, and a root
`tools/` reached through a link is reported as `rootBorrowedNames` instead of
corroborating the harness-shaped reading. `reachable()` - which folded an
unreadable legacy lane into an absent one, against the invariant the file
states - is gone, and `legacyControlShapes` gained `legacyPathsUnreadable`
beside `legacyPaths`. Three room conditions that no fixture reached
(`ENOTDIR`, `ENAMETOOLONG`, `EPERM`) are now pinned, the first two as rooms and
the third at the `fs.lstatSync` seam.

**Why.** An operator with three missing controls previously learned of one per
migration attempt and was told nothing about how to produce it, and no command
could tell an arriving agent whether a room was an installation to upgrade or a
first adoption. Both gaps were being closed by eight and nine rooms
independently, in judgment rather than in evidence.

**Risks and side effects.** Four behavior changes are worth a reader's check,
one per repair round.

1. The corroborated harness-shaped predicate: a room carrying a managed
   runtime-tool filename at its root is Workbench-shaped only when it also holds
   more of the seven controls than it is missing, so a room with exactly four of
   seven controls and such a file is the boundary case. A room with all seven
   controls is unaffected.
2. The integer `schemaVersion`: a room whose `workbench/manifest.json` carries
   `null`, `"2"`, `[2]`, or `{"n":2}` moves from `upgrade` to `unclassifiable`.
   No Workbench release writes such a manifest - `validateManifest` accepts an
   integer only - so the rooms this moves are near neighbours of a manifest, and
   `unclassifiable` names what they are rather than reporting an installation.
3. The widened room-condition class: seven fixture rooms that exited 1 with a
   leaked `lstat` message now return a verdict with the undetermined lane named
   as evidence. Nothing that returned a verdict before returns a different one.
4. The lane-ownership gate at every component: a room whose root `tools/` is a
   link out of the room no longer has that lane corroborate the harness-shaped
   limb, so a room with four of seven controls and a borrowed root `tools/`
   moves from `unclassifiable` to `adoption`; and a managed lane reached through
   a `workbench/tools` link now reports `read: false` with `installed` and
   `receipt` `null` instead of another room's tools. The evidence gained
   `lifecycleTools.rootBorrowedNames` and
   `legacyControlShapes.legacyPathsUnreadable`; both additions are additive, and
   `grep` finds no reader of this evidence outside the tool, its tests,
   `RUNBOOK.md`, and this spec.

The batched refusal replaces the two single-control error codes with one; `grep`
found no reader of either outside `tools/workbench-adoption.mjs`, and each
control keeps its original reason. The classifier writes nothing and authorizes
nothing, so a wrong verdict costs an escalation, not a migration. A
harness-shaped room with no manifest and no stamp returns `unclassifiable` by
design rather than a guess.

**How verified.** Both slices red before green, and each repair round red before
green in its own evidence row above, with the coverage pins red only under the
mutant that makes them pins. Then the full `AGENTS.md` suite,
`evaluate-workbench --path templates --include-controls`, `render`, `doctor`
(exit 0), and `check-append-only.py` (CLEAN). The third round also re-ran
mutation testing over `tools/workbench-classify.mjs`: 33 mutations, 23 caught,
10 survivors each argued equivalent. Six are the same argument - `lstat` never
reports a symlink as a file or a directory, so dropping an `isSymbolicLink()`
limb beside an `isFile()` or `isDirectory()` test cannot change an outcome
(`ordinaryFile`, `ownDirectory`, `supportRootEvidence.ordinaryDirectory`, the
control and manifest ordinary-file tests, and the project-path guard). Two are
call-site equivalences: `ownDirectory` returning `true` rather than `null` for a
path the room did not answer for, because both call sites compare `=== false`;
and Rule 1's non-ordinary limb, because `manifestEvidence` already returns
`readable: false` under exactly that condition. Two are carried forward from the
previous round: `Array.isArray`, subsumed by the integer `schemaVersion` test,
and the unlistable room's `empty: false` default, which Rules 3 and 5 make
unreachable.

Current Verified State above describes the pre-change tree at `b3633e5` and is
left as the record the evidence rows cite; this section states what the change
made true instead.

Remaining gate: independent integration review before `claude/s044-v3-1-2`
merges into `integration`.

## Remaining Limitations Or Follow-Up Specs

- **Six of the seventeen `classify` cases do not compare a before/after
  snapshot**, so the suite proves the read-only property for eleven of them. The
  sharpest gap is the EPERM seam probe - the one case that runs the classifier
  under a monkey-patched `fs`, and it has no write check of its own. The property
  itself was independently re-proven with 23 `fs` mutators poisoned; adding the
  six snapshots would make the Proof column's original claim true and is a
  test-only follow-up, owned by [S-045](../S-045-v3-1-2-follow-ups/SPEC.md)
  TK-003. Recorded here because it was previously carried only in an
  evidence-log cell, where a reader checking what this spec still owes would not
  find it.

- Classification reads a room's contents. A room whose contents genuinely do not
  determine its history returns `unclassifiable`, and that is the correct
  answer; it does not become determinable by a better classifier.
- `skills/update-harness/SKILL.md` route selection does not yet read the
  classifier. That file is owned by S-040 and S-041 in this same round, so the
  one-sentence edit is deferred rather than made across lanes; the command is
  reachable from `templates/ADOPTION.md` and `RUNBOOK.md` meanwhile.
- `LEXICON.md` records none of the four verdicts. `genesis`, `adoption`, and
  `upgrade` are already the manifest's own lifecycle values, and
  `unclassifiable` is currently used by one tool and two docs rather than
  across controls; promote it when a second control depends on it.

## Supersession

- Supersedes: none
- Superseded by: none
