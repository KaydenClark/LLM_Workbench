# S-003M - codebase-design skill alignment

**Spec ID:** S-003M
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Give the agent one shared vocabulary and a few design tests for deep modules, seams and change locality before structural work.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

The `codebase-design` skill has a draft Wiki article, a recorded comparison with Matt Pocock's counterpart, and a skill source that all describe one behavior. The article says what the skill does for a reader, what it needs, what it reads and writes, and where it connects to its neighbors. The skill stays Pending unless the findings justify a different disposition, which this Spec records and does not decide in advance.

## Why It Matters

The owner wants the skills prototyped as a draft Wiki to expose skills that should connect and do not, and skills that connect and do not work together. `codebase-design` is a connection hub: `skills-pending/improve-codebase-architecture/SKILL.md` and `skills-pending/setup-ts-deep-modules/SKILL.md` both tell the agent to run `/codebase-design` for vocabulary, and the `design-an-interface` skill covers the same design-it-twice pattern that this skill carries as a supporting file. Whether those links resolve to one coherent behavior is the question this Spec answers.

## Current Verified State

- The repository copy is `skills-pending/codebase-design/` with three files: `SKILL.md`, `DEEPENING.md` and `DESIGN-IT-TWICE.md`. It is listed as an optional pending source in `workbench/skills/README.md` (owner decision required: preserve pending retention or recoverable removal); the catalog row says it appears only in that inventory and authorizes no promotion into core.
- The personal copy `~/.agents/skills/codebase-design/SKILL.md` is a different file, not a copy. It is a short Workbench rewrite (a few sentences: map behavior, callers, data ownership and seams; prefer one-responsibility modules and explicit adapters; route durable choices to `BLUEPRINT.md` or the assigned `SPEC.md`; then use `/tracer-bullet` or `/tdd`). It has a different `description`, no glossary, and none of the supporting files. A read-only diff on 2026-09-30 shows the in-repo `SKILL.md` differs from it from the `description` line onward; the two supporting files exist only in the repository.
- The in-repo `SKILL.md` carries the full deep-module glossary (module, interface, implementation, depth, seam, adapter, leverage, locality), the deletion test, "the interface is the test surface", "one adapter means a hypothetical seam; two means a real one", testability guidance, rejected framings, and links to its two supporting files. `DEEPENING.md` classifies dependencies into four categories and sets a replace-don't-layer test rule. `DESIGN-IT-TWICE.md` is a parallel sub-agent procedure (frame the problem, spawn 3 or more agents with different constraints, compare and recommend).
- `DESIGN-IT-TWICE.md` tells the agent to include `CONTEXT.md` vocabulary in each sub-agent brief; the improve-codebase-architecture source does the same. This repository's shared vocabulary owner is `LEXICON.md`, so the `CONTEXT.md` name is unverified as a live route here.
- `skills-pending/design-an-interface/SKILL.md` is a separate skill that also applies "Design It Twice" with parallel sub-agents; `skills-pending/improve-codebase-architecture/SKILL.md` sends its "explore alternative interfaces" step to `/codebase-design`, not to `design-an-interface`.
- The personal install holds `~/.agents/skills/codebase-design`, so the skill is both installed (as the rewrite) and in-repo (as the Matt-derived text). No behavior scenario for either has been run by this planning pass.

## Desired Behavior

1. When the agent is designing or restructuring code, `codebase-design` supplies one consistent vocabulary and a small set of tests, and the agent uses those terms exactly.
2. Pending neighbors that depend on the vocabulary find it where they expect it, and the design-it-twice pattern has one owner that the neighbors name consistently.
3. The draft article, the comparison with Matt's skill, and the skill source describe the same behavior, including its limits.

## Decisions And Contracts

- This Spec owns `codebase-design` alone. `design-an-interface` (S-002Z), `improve-codebase-architecture` (S-003G), `setup-ts-deep-modules` (S-002S), `tdd` (S-003N) and `domain-modeling` (S-002H) own their own articles and sources; findings about them are recorded here as `overlap`, `dangling` or `stale-name` and routed to those Specs, not resolved here.
- The article draft is curated context, not instruction authority; source and tests establish Actuality.
- Steps 1-5 touch only the draft Wiki. Step 6 is the only step that touches a skill lane.
- Matt Pocock's skills are outside evidence, compared at the pin `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`, not Workbench Canon.

## Non-Goals

- Moving, archiving, installing or promoting the skill, or changing its Pending status by itself.
- Resolving the overlap with `design-an-interface`, the vocabulary routes in neighbors, or the retention decision in `workbench/skills/README.md`.
- Editing `~/.agents/skills`, which is the owner's separate repository.
- Rebuilding any neighbor skill.

## Dependencies And Blockers

- S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5. Step 1 (investigation) can begin earlier.
- Step 6 edits `skills-pending/codebase-design/`, which `AGENTS.md` Edit Scope does not list. S-00R is the authorizing route for pending-lane edits and relocation; step 6 must name it and honor its per-item owner decision before touching the directory. The `skills-pending/` row for this skill is an open S-00R disposition.
- S-002Z, S-003G, S-002S and S-003N carry related findings; coordinate through finding lines, not shared edits.

## Vertical Implementation Slices

No Task is cut yet. Tasks are cut from live Actuality when this Spec is activated. The intended slice direction is:

1. Investigate ours: read `SKILL.md`, `DEEPENING.md`, `DESIGN-IT-TWICE.md` and the personal copy at a named commit. Record inputs, outputs, writes and composition, and decide which copy is canonical (the Matt-derived in-repo text or the Workbench rewrite). Record the true `origin` and whether any test or catalog entry touches the skill.
2. Draft the article from Template 2, owned by S-002L, at `workbench/wiki/skills-draft/primitives/codebase-design.md` (tentative until S-002L decides).
3. Investigate Matt's: read `engineering/codebase-design` in `mattpocock/skills` at the pin. Check whether his version also keeps design-it-twice and deepening as supporting files.
4. Compare: fill "Compared with Matt's" with a verdict (same, close, divergent or missing) and log findings, including the `overlap` with `design-an-interface`, the `CONTEXT.md` versus `LEXICON.md` question, and the divergence between the two local copies.
5. Align the article: rewrite until the wording matches real or intended behavior and log what remains.
6. Fix or create the skill: edit `SKILL.md` in its lane under the S-00R route, with catalog tests and a fresh-context scenario.

## Acceptance Criteria

- [ ] The draft article has every section of Template 2 filled for `codebase-design`.
- [ ] Every "needs" and "reads/writes" item (including the supporting files, `LEXICON.md` or `CONTEXT.md`, `BLUEPRINT.md`, `/tracer-bullet`, `/tdd` and the Agent tool) resolves to something real or is recorded as a finding.
- [ ] Which copy is canonical, in-repo or personal, is decided and recorded, with the difference between them explained.
- [ ] A verdict on Matt's counterpart is recorded, with findings on the `design-an-interface` overlap and on the `improve-codebase-architecture` and `setup-ts-deep-modules` links.
- [ ] The skill source matches the article, and its catalog entry or Pending disposition is accurate.
- [ ] A fresh-context scenario is observed for step 6, and the suites named for step 6 are green.

## Testing Seams

Steps 1-5 are documentation: check that the article validates under the Wiki checks S-002L delivers, and that findings are one greppable line each. For step 6, use the catalog and lane tests (`tools/test-skill-catalog.mjs`, `tools/test-skills-lane.mjs`) and a fresh-context scenario in which an agent applies the vocabulary to a real module and names the seam correctly. Structural checks prove routing, not agent behavior.

## Verification Procedure

For steps 1-5, run the Wiki validation S-002L specifies, then `node workbench/tools/spec-workbench.mjs render` and `doctor`. For step 6, run the targeted catalog tests, the full suite in `AGENTS.md`, the self-drift receipts and a separate-context review of the immutable candidate. Record actual commands and results below.

## Documentation Impact

The draft article is `workbench/wiki/skills-draft/primitives/codebase-design.md` (tentative until S-002L decides). Step 6 may touch `skills-pending/codebase-design/` and the `skills-pending/codebase-design` row and the `codebase-design` catalog row in `workbench/skills/README.md`. No other control changes unless step 6 finds drift. Record `Docs checked; no update needed` when so.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; the skill source and both local copies were read-only inspected at the pre anchor | Planning only; no implementation evidence, no scenario run, no suite run | This Spec authored; no article or skill source changed | S-002L delivery, activation, Task cutting and all six steps remain open |

## Completion Result

Not complete.

## Supersession

None.
