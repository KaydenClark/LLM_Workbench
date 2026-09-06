# S-044 - Legacy Room Classification And Control Reconcile Order

**Spec ID:** S-044
**Status:** active
**Priority:** 3
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-06
**Catalog description:** Let an agent arriving at a legacy room classify it from its own contents and learn every missing control at once with the reconcile-before-migrate order, instead of deriving both alone.
**Blockers:** none
**Latest event:** TK-001 closed: one `unreconciled-controls` refusal now names every failing control with its own reason, the reconcile order, and the template-overwrite warning.
**Next gate:** Implement TK-002 against the classification rule recorded in Decisions And Contracts.

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
   which of manifest, version stamp, support root, lifecycle tools, and legacy
   control shapes were found. It writes nothing.
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
never as the verdict. Five evidence categories are gathered, all read-only:
`manifest`, `versionStamp`, `supportRoot`, `lifecycleTools`, and
`legacyControlShapes`.

Two derived predicates:

- **stamped** - at least one present root control carries a
  `Generated from | Part of LLM Workbench vX.Y.Z` stamp
  (`workbench-layout.mjs` `versionStamp`). A release demonstrably wrote here.
- **harness-shaped** - all seven root controls are present, or the room's own
  root `tools/` carries a file named in the managed runtime-tool set. The seven
  controls are the Workbench's exact closed set; either shape is what a
  Workbench installation leaves behind.

Ordered, first match wins:

1. `workbench/` exists but `workbench/manifest.json` is absent, unreadable, or
   not an ordinary JSON file -> **`unclassifiable`**. A support root without its
   own authority is neither an installed room nor a clean adoption target, and
   Adoption's preflight already refuses it as `support-root-exists`.
2. `workbench/manifest.json` reads as JSON -> **`upgrade`**. The room is an
   installed Workbench room, so it is neither a genesis nor a second adoption;
   every move from here is an upgrade. Whether it needs one - schema 1 migrate,
   a version bump, or nothing - is `validateManifest`'s answer, and the
   classifier reports the manifest's `schemaVersion`, `workbenchVersion`, and
   `provenance.lifecycle` as evidence so the reader can see which.
3. Not stamped, no manifest, but harness-shaped -> **`unclassifiable`**. The
   shape says a Workbench-shaped harness; the absent stamp and manifest say no
   release recorded itself. An unstamped Workbench room (upgrade) and an
   independent dialect reusing the same names (adoption) both produce exactly
   this evidence, and the room does not say which. Both readings are listed as
   reasons so the agent escalates with evidence instead of guessing.
4. Stamped, no manifest -> **`upgrade`**. This is the already-adopted v2-root
   room `workbench-upgrade.mjs upgrade --layout-only` exists for.
5. The room is empty apart from `.git` -> **`genesis`**. No content to derive
   filled controls from.
6. Otherwise -> **`adoption`**. A working room with real content, no Workbench
   installation to upgrade, and no Workbench-shaped ambiguity.

Rule 6 is why a repository carrying only application code and a `README.md`
is `adoption` and not `genesis`: `templates/ADOPTION.md` already routes a target
with real code to Adoption, and Genesis derives from a founding prompt rather
than from a repository.

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
| TK-002 | Add a read-only classify command reporting `genesis \| adoption \| upgrade \| unclassifiable` with its evidence | ready | none | pending |

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

- [ ] A project missing several controls produces one refusal naming each.
- [ ] The refusal names the reconcile-before-migrate order and the
      template-overwrite warning.
- [ ] A read-only classify command returns one of the four verdicts with the
      evidence for it, and writes nothing.
- [ ] `unclassifiable` lists the reasons the room could not be classified.
- [ ] `node tools/test-workbench-adoption.mjs`,
      `node tools/test-workbench-layout.mjs`, and
      `node tools/test-workbench-upgrade.mjs` pass, new cases red before green.
- [ ] The full `AGENTS.md` verification suite passes.

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

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Classification reads a room's contents. A room whose contents genuinely do not
  determine its history returns `unclassifiable`, and that is the correct
  answer; it does not become determinable by a better classifier.

## Supersession

- Supersedes: none
- Superseded by: none
