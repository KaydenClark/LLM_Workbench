# TK-002X - Deliver the dispatcher operating entry with catalog, installer and layout proof

**Task ID:** TK-002X
**Spec ID:** S-002D
**Slice:** Deliver the dispatcher operating entry with catalog, installer and layout proof
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-002D boxes 1-5 and 7 (the dispatcher operating entry at workbench/skills/dispatcher/SKILL.md, discoverable through the existing skills lane and adapters, with source, templates, discovery and managed installation agreeing)
**Planned verification:** Red: at the pre-change tree a new `tools/test-skill-catalog.mjs` block asserting the dispatcher entry's contract sections, authority sentence, no-spawn sentence, one-assigned-Spec scope, single durable writer, never-approves-its-own rule and Task-branch-to-Spec-branch route fails because `workbench/skills/dispatcher/SKILL.md` does not exist, and the bundle-size assertions fail once the entry is added without its consumers. Green: `tools/test-skill-catalog.mjs`, `tools/test-workbench-layout.mjs`, `tools/test-core-skill-installer.mjs`, `tools/test-skills-lane.mjs`, `tools/test-delivery-skills.mjs` and `tools/test-cross-provider-fixture.mjs` pass on the committed candidate, then the full AGENTS suite passes on that SHA.

## Outcome

A fresh clone discovers `workbench/skills/dispatcher/SKILL.md` through both
adapters, the manifest declares it in `skillPolicy.required` immediately before
`builder`, `workbench-layout.mjs` counts it in the live bundle without changing
the four portable stances or any frozen release row, the catalog table and
bundle sentence in `workbench/skills/README.md` name it, and every prose count
the catalog test derives agrees with the new bundle size.

## Required Behavior

- The entry obeys the existing skill contract: frontmatter `name` and
  `description`, then `## Purpose`, `## Method / Posture`, `## Obligations`
  and `## Completion / Exit Condition`, and the shared sentences that it
  "never grants, removes, or transfers authority" and "never spawns" an
  agent (ADR-0036; AGENTS "Assigned Work And Stances").
- Its text keeps the Dispatcher Spec-bound: one assigned Spec and its branch,
  one durable writer for Spec/TASK/projection state, Workers returning proof to
  that writer, Task-branch merge requests into the Spec branch then a reviewed
  Spec-branch merge request into integration under Director coordination, the
  current release owner's bootstrap exception respected until retired, and a
  Dispatcher or Worker never approving its own candidate. It imports no GPT_OS
  policy, model allocation, scheduling or external repository prerequisite.
- `workbench/manifest.json` `skillPolicy.required` gains `dispatcher`
  immediately before `builder`, so `required.slice(-4)` stays the four
  portable stances.
- `workbench/tools/workbench-layout.mjs` exports the new group (proposed
  `coordinationSkills`, holding `dispatcher`) and composes `coreSkills` from
  the workflow skills, that group and the unchanged `stanceSkills`; every
  frozen legacy row stays byte-identical.
- `tools/test-workbench-layout.mjs` derives its frozen v3.2.1 twenty-one-skill
  row by excluding `grill-me` and the new group, not by a hard-coded filter.
- `tools/test-skill-catalog.mjs` derives the workflow-skill word from the
  bundle size minus the stances and the new group, and holds
  `workbench/skills/README.md` to the new bundle sentence.
- The catalog sentence names the true count with a category breakdown that
  separates the role entry from the four portable stances; the row for
  `dispatcher` joins the table before `builder`.

## Smallest Concrete Path Set

| Path | Minimum necessary change |
|---|---|
| `workbench/skills/dispatcher/SKILL.md` | New entry from the Dispatcher's content brief; wording changes only where a test forces them, each reported. |
| `workbench/manifest.json` | Insert `dispatcher` before `builder` in `skillPolicy.required`. |
| `workbench/tools/workbench-layout.mjs` | Export the coordination group; compose it into `coreSkills` ahead of the stances. |
| `workbench/skills/README.md` | Table row and bundle sentence. |
| `tools/test-skill-catalog.mjs`, `tools/test-workbench-layout.mjs` | Red/green at the existing seams. |
| `README.md`, `RUNBOOK.md`, `LEXICON.md` (Core skill bundle row), `templates/GENESIS.md` | Count-only edits the catalog test pins; no other control wording. |

Add any other path only after tracing a demonstrated dependency (for example a
fixture that embeds the required list). `.agents/skills` and `.claude/skills`
are directory links into the lane and need no per-skill entry.

## Done Criteria And Closing Proof

- Red observed and quoted at the pre-change tree; green on the committed
  candidate with the targeted tests named above.
- Full AGENTS suite run in the foreground on the committed candidate with its
  tally, SHA and log path recorded.
- Exact SHA, the list of files touched, any skill-wording change against the
  brief, docs status and remaining gap handed back to the Dispatcher. The
  Worker does not review or approve its own candidate and does not merge.

## Remaining Gaps

- Root-control wording beyond the pinned counts (RUNBOOK role procedure,
  LEXICON bundle definition prose, templates mirrors) is routed to
  [S-00P](../../../S-00P-workflow-canon-rework/SPEC.md).
