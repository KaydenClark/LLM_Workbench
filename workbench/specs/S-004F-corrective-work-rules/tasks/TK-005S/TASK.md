# TK-005S - Retire the Wiki-claim corrective route and refuse corrective work on delivered Specs

**Task ID:** TK-005S
**Spec ID:** S-004F
**Slice:** Retire the Wiki-claim corrective route and refuse corrective work on delivered Specs
**Status:** blocked
**Stance:** Builder
**Blockers:** TK-005R
**Destination:** spec-acceptance: No command creates, selects, claims or closes a corrective Task anchored to a Wiki claim or creates one inside a retired Spec's folder; each retired path refuses with a message naming the new-Spec route.
**Planned verification:** Red, at `createCorrectiveTasks` (`workbench/tools/spec-report.mjs`) and `next`, `claim`, `close` (`workbench/tools/spec-workbench.mjs`) in a fixture room: today a discarded Spec plus `wikiClaim` writes a standalone Task under the specs lane's `corrective/` folder that `next` selects and `close` closes into the Wiki note; a fail verdict or owner finding against a retired or complete Spec creates Tasks in its folder. Green: every one of those paths throws an error naming the new-Spec route (a later gap against delivered work becomes a new Spec under its landmark or the Blueprint); `next` never selects a standalone corrective record; an existing standalone record is still read for identifier occupancy so no identifier collides; a fixture shows a later gap against a completed Spec carried by a new planned Spec that names the delivered Spec and cites a Wiki page as evidence, and `doctor` and `render` accept it; the `wiki-claim` destination type still parses for a Task whose destination is producing a Wiki page. The corrective tests that exercised the retired route are replaced by refusal tests. `tools/test-spec-workbench.mjs`, `tools/test-spec-report.mjs`, `tools/test-taskboard-json.mjs`, `tools/test-diagnostics.mjs` and the full AGENTS suite pass on the committed candidate.

## Outcome

The Wiki stops being a place to anchor a correction. A gap against work that is
already delivered cannot be carried by a corrective Task anywhere; the command
says so and names the route the owner chose: a new Spec under its landmark or
the Blueprint, citing Wiki pages as evidence for its direction and plan.

## Scope

- `createCorrectiveTasks` and its discarded-Spec Wiki-claim branch, the
  corrective creation and continuation path for a retired or complete Spec, and
  the standalone corrective claim, select and close paths in
  `workbench/tools/spec-workbench.mjs`.
- The test-room fixture of a later gap carried by a new planned Spec.
- The Wiki lifecycle tool page's description of the standalone corrective close.

## Acceptance

- [ ] No command creates, selects, claims or closes a corrective Task anchored to
      a Wiki claim or creates one inside a retired Spec's folder.
- [ ] Each retired path refuses with a message naming the new-Spec route.
- [ ] A fixture shows a later gap against a completed Spec carried by a new
      planned Spec, citing Wiki evidence without taking it as its destination.
- [ ] The `wiki-claim` destination still serves a Task that produces a Wiki page.

## Boundaries

No rename of any command, status or folder; no deletion of a retired Spec; no
change to what `retire-spec` and `discard` do. A standalone corrective record
that already exists is not deleted or migrated here. `AGENTS.md`, `RUNBOOK.md`,
the Lexicon, the Blueprint and the templates are not edited by this Task.
