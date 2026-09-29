# TK-002X - Ship the director core skill entry with catalog, manifest, layout and test proof

**Task ID:** TK-002X
**Spec ID:** S-002C
**Slice:** Ship the director core skill entry with catalog, manifest, layout and test proof
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-002C Acceptance Criteria, boxes 1 to 5 (the operating contract the entry states) and box 7 (source, templates, discovery and managed installation agree)
**Planned verification:** Red: `node tools/test-skill-catalog.mjs` fails at a new director contract assertion before `workbench/skills/director/SKILL.md` exists, and again at the bundle-size derivation once `coreSkills` grows to twenty-three (the count-word table stops at eighteen and `tools/test-workbench-layout.mjs` asserts the frozen v3.2.1 row by filtering only `grill-me`). Green: catalog, layout, installer, skills-lane, cross-provider, core-composition, upgrade and adoption tests pass on the committed candidate; `.agents/skills/director` and `.claude/skills/director` resolve through the tracked lane links in a scrubbed clone; `doctor` has no blocking finding; the full AGENTS suite is green on the committed SHA.

## Outcome

A fresh agent on integration finds `workbench/skills/director/SKILL.md` through
the existing skills lane and both provider discovery links, reads a complete
Director operating contract in the same four-section shape the portable
stances use, and every place the repository counts or lists the core bundle
(manifest, layout export, catalog table, bundle sentence, count literals,
frozen-row tests) agrees that the bundle now holds this entry.

## Content Source Of Truth

Derive the skill text from these owners only; cite them, do not paraphrase
them into new rules:

- `LEXICON.md` rows Role, Director, Dispatcher, Worker, Stance (Role scope
  composes with stance; the Director "never executes a Task or acquires
  authority merely by occupying a branch"; Human QA and main promotion remain
  owner acts).
- `AGENTS.md` "Assigned Work And Stances" (Director coordinates cross-Spec
  dependencies and shared writers; a stance never grants authority; loading
  it spawns nothing), "Git Rules" (Task branch -> Spec branch -> integration;
  separate-context reviewer; never merge a PR left open for review; only the
  owner merges integration into main), "Safety And Change Control" (owner
  escalations are product tradeoffs with options, recommendation and cost)
  and "Long Session Control" (one durable writer for shared Spec/Taskboard
  state; subagents return proof to that writer).
- `RUNBOOK.md` "Role And Stance Coordination" and "Independent Review
  Boundaries".
- `workbench/docs/adr/000P-roles-scope-work-and-stances-define-the-job.md`
  and `workbench/docs/adr/0036-stances-change-method-not-authority.md`.
- `workbench/wiki/design-concepts/roles-and-stances.md` and ledger rows
  ROLE-1 to ROLE-4 in `workbench/wiki/grilling-destination-audit-ledger.json`.
- The Spec's Desired Behavior 1 to 5, which the skill's Obligations must
  cover one for one.

The 2026-09-26 Director roster and protocol are evidence of what the role had
to do in practice (shared-writer decisions, landing order, fresh review of a
rebased tip, permission refusals recorded rather than routed around, IDs
allocated only at commit time). Use them to choose which obligations matter;
import no policy, model allocation, scheduling, private path or external
repository prerequisite from them.

## Required Behavior

`workbench/skills/director/SKILL.md`:

- Frontmatter `name: director` and a one-line `description` of the form the
  stances use ("Adopt the assigned Director role for one project and its
  integration branch within existing authority.").
- Sections `## Purpose`, `## Method / Posture`, `## Obligations`,
  `## Completion / Exit Condition`, in that order, matching the four portable
  stances so the existing skill contract holds without a new shape.
- Purpose states the scope: the whole project and its integration branch,
  coordinating Spec-bound Dispatchers and cross-Spec work; the owner remains
  the human above the Director. It carries the authority sentences verbatim
  from the stance contract: the role "never grants, removes, or transfers
  authority", "Loading this skill never spawns an agent", and role scope
  composes with the assigned stance (name Spec Planner, Spec Manager,
  Reviewer and Auditor as jobs a Dispatcher performs, not extra roles).
- Method / Posture: load the project controls and current integration state
  first; recover accepted decisions, open gates and assigned Specs from
  tracked owners (assigned `SPEC.md` through `workbench/manifest.json`, the
  rendered Taskboard, the ADR collection under `workbench/docs/adr`, the Wiki
  router) rather than from a local chat, private memory or an unmerged
  branch; keep a compact durable record of its own coordination decisions in
  the existing owners.
- Obligations, covering Desired Behavior 1 to 5 in order: assign one Spec and
  its branch to each Dispatcher; name the single durable writer for every
  shared artifact and record the dependency and landing order so independent
  lanes proceed in parallel; monitor Dispatcher reports and resolve
  coordination inside the assignment; escalate only a genuine owner choice,
  phrased as options, recommendation and cost, and never re-ask a settled
  question; arrange separate-context review of each immutable assembled
  candidate and coordinate its merge request into the integration branch,
  treating a rebased or re-merged tip as a new candidate; state that neither
  a Dispatcher nor an implementing Worker supplies independent approval of
  its own candidate and that the Director does not approve a candidate it
  built; keep decisions, progress, branch and candidate references and
  remaining gates in the tracked owners on integration through reviewed
  changes; record a permission refusal or unsupported host capability rather
  than routing around it or acting on a Worker's behalf.
- Boundaries stated plainly: the Director never executes a Task itself,
  never takes a Dispatcher's Spec, never merges a PR whose review has not
  passed, never merges integration into main, and treats owner Human QA and
  main promotion as owner acts; an out-of-scope request (another project, a
  Spec outside the assignment, a main merge) is reported, not performed.
- Completion / Exit Condition: every assigned Spec is at its named endpoint
  (reviewed integration delivery or a recorded blocker) with its PR, merged
  SHA, review verdict and remaining gates written in the owning Spec, and a
  report to the owner names what landed, what remains and each open owner
  choice. Nothing in the exit claims owner approval.
- Portable wording only: no room-specific Spec ID, no private machine path,
  no provider or model name, no scheduler, no count of Dispatchers.
  `tools/test-skill-catalog.mjs` forbids retired paths and the release-owner
  ID in every core skill; keep the Task-PR exemption generic if mentioned.

Bundle registration, kept minimal and mirrored where the suite proves a
mirror exists:

- `workbench/tools/workbench-layout.mjs`: export `roleSkills = ['director']`
  and compose `coreSkills = [...currentCoreSkills, 'carry', 'notepad',
  'save', 'promote', 'handoff', 'grill-me', ...roleSkills, ...stanceSkills]`
  so every `slice(-4)` stance read stays exact. `stanceSkills` and every
  frozen historical row stay byte-identical; do not add a frozen row for the
  current release.
- `workbench/manifest.json` `skillPolicy.required`: insert `director`
  immediately before `builder` (the manifest is this room's declared policy;
  `validateManifest` compares it to the live export).
- `workbench/skills/README.md`: add the `director` row to the core-skills
  table and rewrite the bundle sentence to the true count with a category
  breakdown that names the role separately from the four portable stances,
  for example "a closed 23-skill bundle (eighteen workflow skills, one role
  skill and four stances)". Sibling Specs will increment the role and add a
  coordination-stance category later; leave them a sentence that extends.
- `tools/test-skill-catalog.mjs`: derive the workflow word from
  `bundleSize - stanceCount - roleSkills.length` (import `roleSkills`), and
  hold the README sentence to the role count as well; add a director contract
  assertion (the four section headings, the authority sentences, the
  never-executes / never-approves-own-candidate / owner-acts boundaries, the
  cross-Spec single-writer obligation). Write the assertion first and record
  the red.
- `tools/test-workbench-layout.mjs`: the frozen v3.2.1 twenty-one row must
  filter out `roleSkills` as well as `grill-me`; the `slice(-4)` assertions
  are unchanged.
- Count literals only, because the catalog test enforces them: `README.md`
  "closed 22-skill core bundle", `RUNBOOK.md` "the 22 core skills" and
  `templates/GENESIS.md` "exact 22-skill policy" become 23. `LEXICON.md`
  "closed set of eighteen workflow skills and four stance skills" stays
  true under the role category; do not edit it. These three edits are the
  only control or template edits this Task makes; record them in the Spec
  evidence and the Director report because S-00P owns control wording.
- Do not add `director` to the stance loops in `tools/test-delivery-skills.mjs`,
  `tools/test-core-skill-installer.mjs`, `tools/test-cross-provider-fixture.mjs`
  or `workbench-layout.mjs stanceSkills`: a role is not a portable stance.

## Smallest Concrete Path Set

| Path | Minimum necessary change |
|---|---|
| `workbench/skills/director/SKILL.md` | New entry, contract above. |
| `workbench/tools/workbench-layout.mjs` | `roleSkills` export; `coreSkills` composition; one comment naming the growth. |
| `workbench/manifest.json` | `director` before `builder` in `skillPolicy.required`. |
| `workbench/skills/README.md` | Table row; bundle sentence with category breakdown. |
| `tools/test-skill-catalog.mjs` | Role-aware count derivation; director contract assertion. |
| `tools/test-workbench-layout.mjs` | Frozen twenty-one row filters `roleSkills`. |
| `README.md`, `RUNBOOK.md`, `templates/GENESIS.md` | Count literal 22 -> 23 only. |

Add any other path only after a failing test names it.

## Expected Red And Green

Source-grounded predictions at `1450e7a8`, not observed results.

1. Red: `node tools/test-skill-catalog.mjs` fails at the new director
   assertion (`ENOENT workbench/skills/director/SKILL.md`) before the entry
   exists. After `coreSkills` grows: the same test fails at the README bundle
   sentence (`undefined workflow skills`) until the count derivation is
   role-aware, and `node tools/test-workbench-layout.mjs` fails
   `assert.equal(twentyOne.length, 21)` until the frozen row filters
   `roleSkills`.
2. Green: `node tools/test-skill-catalog.mjs`, `node tools/test-workbench-layout.mjs`,
   `node tools/test-core-skill-installer.mjs`, `node tools/test-skills-lane.mjs`,
   `node tools/test-cross-provider-fixture.mjs`, `node tools/test-core-composition.mjs`,
   `node tools/test-workbench-upgrade.mjs`, `node tools/test-workbench-adoption.mjs`,
   `node tools/test-delivery-skills.mjs`, then the full AGENTS suite on the
   committed candidate.

## Done Criteria And Closing Proof

- The entry exists, obeys the section and authority contract, and states the
  Director's five obligations and its boundaries in portable wording.
- Manifest, layout export, catalog table, bundle sentence and count literals
  agree at 23; the frozen historical rows are unchanged.
- Red recorded (command, failing assertion, SHA), green recorded (commands,
  SHA), full suite tally with SHA and log path, `doctor` no blocking finding.
- Docs status from the actual diff: `workbench/skills/README.md` and the three
  count literals; `LEXICON.md`, `templates/LEXICON.md`, `BLUEPRINT.md` checked
  with the reason no update is needed.
- The Worker self-checks and hands back the exact SHA, proof text, docs status
  and remaining gap to the Dispatcher, who remains the single writer of
  `SPEC.md`, this record and the rendered projections. The Worker does not
  review or approve its own candidate and does not merge.

## Remaining Gaps

- S-00P: `RUNBOOK.md` and `LEXICON.md` may want a sentence that the core
  bundle now carries role entries beside the four stances; only the count
  literal changes here.
- Installed personal copies of the bundle are not updated by a source change;
  the release owner stamps the grown bundle.
