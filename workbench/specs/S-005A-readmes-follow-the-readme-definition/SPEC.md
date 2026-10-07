# S-005A - READMEs Follow The README Definition

**Spec ID:** S-005A
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-07
**Catalog description:** The root README and the template README follow the README definition and the owner's README template, orienting a human with installation, usage, testing and support, while release history moves to the Wiki and operation procedures move to their Runbook owners.
**Blockers:** S-004Z
**Latest event:** Authored from the owner grilling of 2026-10-07; no Task is cut.
**Next gate:** Delivery of Project History Lives In The Wiki, then activation and a Task cut from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`d0fb161c1ff36caf936758b7492f7ef7fce8176e` post=`d0fb161c1ff36caf936758b7492f7ef7fce8176e`.

## Outcome

A person who opens `README.md` in this repository, or in a room the template
created, learns what the project is, why they would want it and how to set it
up, run it and test it, and where to go next. Each README follows the README
definition in the Lexicon and the owner's README template section by section.
The root README no longer carries release history, which lives in the Wiki
history page, and carries no operation procedure, which lives with its Runbook
owner.

## Why It Matters

The owner's reason: a README orients a human learning the project (what the
Workbench is, why they need it, how to set it up); the Runbook drives agent
operations; progressive disclosure. The root README today mixes orientation
with release history, agent entry routing and operation command lists, and
neither README has the owner's template sections.

## Current Verified State

At the pre anchor:

- `README.md` has 386 lines under the sections Core Files, From Project
  Evidence To A Fresh Workbench, This Repo Dogfoods Its Own Harness,
  Supporting Files, How To Use It (with One-Prompt Bootstrap and Adopting Into
  An Existing Project), Versioning And Upgrades, Visual And Asset Guidance, How
  To Test Template Changes, Context And Research Workflow, License and Ordinary
  Agent Entry. None of the template's Installation, Usage, Testing,
  Documentation & Support or Contributing & License sections exists.
- `README.md:198-223`, in Versioning And Upgrades, is the release-history
  paragraph for v3.0.0 through v3.2.0, including "twenty-one core skills"
  (`README.md:218`). The same section also states the current harness version,
  v3.2.1, recorded in `workbench/manifest.json`. The closing lines of Ordinary
  Agent Entry (`README.md:384-386`) add another version note.
- Sections that read as operations rather than orientation include the
  Versioning And Upgrades upgrade and release-gate steps, How To Test Template
  Changes (command lists the Runbook's Test And Build owns), Context And
  Research Workflow, the adoption fresh-clone proof requirements and Ordinary
  Agent Entry (agent routing that `AGENTS.md` and the Runbook own).
- `templates/README.md` has 92 lines under How This Project Is Run, Getting
  Started, Working With Agents, Project Status and License.
- README states the bundle size once as current state, "the closed 32-skill
  core bundle" (`README.md:88`), and `tools/test-skill-catalog.mjs:142` pins
  that exact phrase against the manifest.
- Dependencies on README content: `tools/evaluate-workbench.mjs:187-201`
  scores README phrases (plain Markdown, Codex and Claude, the Claude Code
  `@AGENTS.md` note, house style and asset guidance);
  `tools/control-fidelity.mjs:15` lists `README.md` among the templated
  controls; and `doctor` reports `room-brain-unrouted` when a room's README
  does not name `MEMORY.md` (`templates/ADOPTION.md:353-356`).

## Desired Behavior

Canon describing the template leads; the template artifacts follow it.

1. The README definition is read from [LEXICON.md's README row](../../../LEXICON.md),
   promoted separately; this Spec links to it and does not restate it at
   length.
2. `templates/README.md` follows the owner's README template with
   placeholders a Genesis or Adoption run fills: `# Name` and one or two
   sentences; `## Installation` with `### Requirements`, `### Setup` as
   numbered steps with commands and `**Verify setup:**`; `## Usage` with the
   main use case, a command and `**Expected result:**`; `## Testing` with
   prerequisites, a command and `**Expected result:**`;
   `## Documentation & Support` with important files, a Resource | Purpose
   table and `**Maintainer:**`; and `## Contributing & License`.
3. The root `README.md` follows the same template for this repository: what
   the Workbench is, the problem it solves and who it is for; how to install
   and verify it; its main use; how to test it; where its documentation and
   support live; and its contributing and license terms.
4. README's release-history paragraph (`README.md:198-223`) moves into the
   history page that
   [Project History Lives In The Wiki](../S-004Z-project-history-lives-in-the-wiki/SPEC.md)
   creates, and the remaining version notes in README move with it.
5. The current harness version and the core skill bundle size stay in the root
   README as current-state facts. The bundle count stays correct through the
   broadened count test that
   [Adding A Required Core Skill](../S-004X-adding-a-required-core-skill/SPEC.md)
   delivers, not through a second check here.
6. Every operation procedure in either README moves to its Runbook owner (the
   Runbook's index row and the skill it points to), and the README links to it
   where a reader needs the pointer. Nothing a README removes is lost: each
   removed claim is recorded as moved to a named owner or as already held
   there.
7. Each README still names `MEMORY.md`, still satisfies the evaluator patterns
   it is scored on or carries that claim in the named alternative owner, and
   root and template agree as control fidelity requires.

## Decisions And Contracts

- **README definition** (owner, 2026-10-07): a README is introductory
  documentation accompanying a project, package or directory: an overview of
  the contents and purpose, the information needed to get started, and
  references to further documentation, support and applicable terms. The
  Lexicon's README row holds it.
- **Root README template** (owner, 2026-10-07): `# Name` plus one or two
  sentences (what it does, the problem, the audience); `## Installation`
  (`### Requirements`, `### Setup` as numbered steps with commands,
  `**Verify setup:**`); `## Usage` (main use case, command,
  `**Expected result:**`); `## Testing` (prerequisites, command,
  `**Expected result:**`); `## Documentation & Support` (important files, a
  Resource | Purpose table, `**Maintainer:**`); `## Contributing & License`.
- **Operation procedures never live in a README** (owner, 2026-10-07). Why
  (owner): a README orients a human learning the project; the Runbook drives
  agent operations; progressive disclosure.
- **History lives in the Wiki** (owner, 2026-10-07): README's release-history
  paragraph moves to the Wiki history page; this Spec, not Adding A Required
  Core Skill, makes that move, so two parallel Specs never edit README.
- **Stated counts are enforced** (owner, 2026-10-07): where README states the
  core skill count, the catalog test checks it against the manifest.
- **Template-targeted** (owner, 2026-10-07, governance-stack lens): this Spec
  updates the Canon describing the template first, then `templates/README.md`
  and the root README.
- Checks are never weakened to pass (`AGENTS.md` testing rule): an evaluator
  pattern or fidelity check that a moved claim no longer meets is met in the
  claim's new owner or surfaced as a finding, never deleted.

## Non-Goals

- Writing the README definition into the Lexicon; that promotion happens
  separately.
- Creating the Wiki history page or the written value test; Project History
  Lives In The Wiki owns both.
- The core skill count test itself; Adding A Required Core Skill owns it.
- READMEs inside subdirectories, such as the Wiki, skills or Grill Board
  READMEs. This Spec covers the root README and `templates/README.md`.

## Dependencies And Blockers

- Blocked by [Project History Lives In The Wiki](../S-004Z-project-history-lives-in-the-wiki/SPEC.md):
  README's release-history paragraph moves into the page that Spec creates.
- Not blocking: [Adding A Required Core Skill](../S-004X-adding-a-required-core-skill/SPEC.md)
  delivers the broadened count test that holds README's bundle count. If this
  Spec lands first, the existing catalog pin on README's bundle phrase still
  holds the count, so the rewrite keeps a stated count the test can find.
- Blocks the slice of [Adding A Required Core Skill](../S-004X-adding-a-required-core-skill/SPEC.md)
  that turns its broadened count test on: that test exempts nothing and would
  flag README's release-history paragraph until this Spec moves it.

## Vertical Implementation Slices

No Task is cut. Tasks are cut from live Actuality at activation with
`/to-tasks`. The intended direction is: the template README in the owner's
shape with the fidelity and evaluator checks green; then the root README's
history paragraph moved into the Wiki page; then the root README rebuilt in the
template shape, with each operation procedure moved to its Runbook owner.

## Acceptance Criteria

- [ ] `templates/README.md` has exactly the owner's template sections in order, with placeholders, and a Genesis round trip fills it without a remaining placeholder.
- [ ] The root `README.md` has the same sections, filled for this repository, and states the current harness version and the core skill bundle size, with the count checked against the manifest by the catalog test.
- [ ] README's release-history paragraph and other version notes appear in the Wiki history page and no longer in README.
- [ ] No operation procedure remains in either README; each moved procedure is reachable from its Runbook owner, and every removed claim is recorded as moved or already held.
- [ ] Both READMEs name `MEMORY.md`, `doctor` reports no `room-brain-unrouted`, and the evaluator and control-fidelity checks pass without being weakened.
- [ ] Named verification and remaining limitations are recorded without claiming owner approval.

## Testing Seams

- `tools/test-control-fidelity.mjs` for root and template README agreement.
- `tools/test-evaluate-workbench.mjs` and `tools/evaluate-workbench.mjs` for
  the scored README phrases.
- `tools/test-workbench-round-trip.mjs` and `tools/test-genesis-from-decisions.mjs`
  for a room's README filled from the template.
- `tools/test-skill-catalog.mjs` for the stated bundle count.
- A section-order check on both READMEs, added where an existing test owns
  README shape, can fail before the rewrite and pass after it.

## Verification Procedure

Red/green at the section-order seam, then the fast check, `doctor` and the
Runbook's Full suite on a committed candidate. Record actual commands and
results in this Spec.

## Documentation Impact

`README.md`, `templates/README.md`, the Wiki history page (receiving the
release-history paragraph), and the `RUNBOOK.md` rows and skills that receive
moved procedures, with their template counterparts.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-10-07 | none | Authored from the owner grilling of 2026-10-07 at integration d0fb161c1ff36caf936758b7492f7ef7fce8176e; carries D3 (README definition and template, no operation procedures), the README part of D2 (release history moves to the Wiki), D1 (stated counts enforced) and D5 (template-targeted). | Map only; both READMEs, their checks and the release-history paragraph were read at that tip; no runtime proof claimed. | This Spec. | Owner approval, delivery of Project History Lives In The Wiki, Plan, implementation and proof remain. |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Subdirectory READMEs are not reshaped here; a later Spec can apply the
  definition to them.

## Supersession

- Supersedes: none
- Superseded by: none
