# S-044 - Legacy Room Classification And Control Reconcile Order

**Spec ID:** S-044
**Status:** active
**Priority:** 3
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-06
**Catalog description:** Let an agent arriving at a legacy room classify it from its own contents and learn every missing control at once with the reconcile-before-migrate order, instead of deriving both alone.
**Blockers:** none
**Latest event:** Spec captured from upstream items UP-022 and UP-023; both re-verified against `b3633e5`, and the preflight was found to fail on the first missing control rather than naming all of them.
**Next gate:** Claim TK-001 and reproduce the first-control-only refusal red.

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
| TK-001 | Report every missing or unfilled control in one preflight result, with the reconcile order and the template-overwrite warning | ready | none | pending |
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
| 2026-09-06 | spec | Spec captured from upstream UP-022 and UP-023 and re-verified at `b3633e5` | Read `workbench-adoption.mjs:63-78` (returns on the first failing control), `workbench-layout.mjs:21,226`, `templates/ADOPTION.md:218-222,274-275`; grepped `classify` across `tools/` and `workbench/tools/` (four matching files: `control-fidelity.mjs`, `feedback-automation.mjs`, and their two test files) and found no lifecycle classifier | Blueprint catalog regenerated by render | Both slices open; the first-control-only behavior sharpens UP-022 beyond the upstream statement |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Classification reads a room's contents. A room whose contents genuinely do not
  determine its history returns `unclassifiable`, and that is the correct
  answer; it does not become determinable by a better classifier.

## Supersession

- Supersedes: none
- Superseded by: none
