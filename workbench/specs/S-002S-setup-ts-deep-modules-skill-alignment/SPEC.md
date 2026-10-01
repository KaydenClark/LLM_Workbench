# S-002S - setup-ts-deep-modules skill alignment

**Spec ID:** S-002S
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Set up enforceable TypeScript module boundaries in a repo that has chosen deep modules, and prove the rules catch a violation.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

The draft Wiki article for `setup-ts-deep-modules`, its comparison with Matt Pocock's counterpart, and the skill source all describe one behavior. The skill belongs to the getting-started group of the owner's draft skills wiki.

## Why It Matters

The owner wants to prototype the skills Wiki on the current skills to find what is wrong: skills that should connect and do not, and skills that connect and do not work together. This skill has a visible connection to check. It tells the agent to run `/codebase-design` for its vocabulary, and that skill is itself still pending. Writing the article forces "What it needs" to say whether that dependency resolves in a Workbench room.

## Current Verified State

- The source is `skills-pending/setup-ts-deep-modules/SKILL.md` plus `skills-pending/setup-ts-deep-modules/dependency-cruiser.config.cjs`. It is a user-invoked skill (`disable-model-invocation: true`) that installs dependency-cruiser, writes `.dependency-cruiser.cjs`, adds a `lint:boundaries` script, scaffolds an example package, proves the rules fail on a deep import, and writes a packages README plus an agent-instructions pointer.
- `skills-pending/` is not a discovery lane. `workbench/skills/README.md` calls it historical rewrite source and lists the directory with the disposition "No operational consumer established", so no Workbench skill invokes this one. The same README row for `skills-pending/codebase-design` records that pending `improve-codebase-architecture` and `setup-ts-deep-modules` name it.
- The skill's prose says "Four rules" and step 3 says "the four forbidden rules are present", but the shipped config declares five forbidden rules (`entrypoint-boundary-from-app`, `entrypoint-boundary-across-packages`, `tests-through-entrypoints`, `tests-folder-is-private`, `no-circular`). This is an observed mismatch, not yet a recorded finding.
- The handoff states pending skills appear to be unmodified copies of Matt's, per the third-party notice, but they were not byte-diffed. Matt's counterpart is `in-progress/setup-ts-deep-modules`, which the handoff reports is not promoted upstream. Neither fact is verified here; steps 1 and 3 settle them.
- No Wiki article for this skill exists, and no Workbench test, template or room has been checked for exercising the skill.

## Desired Behavior

1. A draft article at the tentative path `workbench/wiki/skills-draft/getting-started/setup-ts-deep-modules.md` fills Template 2 from observed source: what it does, when to reach for it, what it needs, what it reads and writes, how it works, limits, observable signs of success, and where it fits.
2. Every "needs" and "reads/writes" item resolves to something real or is logged as a finding: `/codebase-design`, the package manager, `tsconfig.json`, the umbrella check script, `CLAUDE.md` or `AGENTS.md`, and the packages README.
3. The article records the true `origin` (workbench, matt or foundry) from step 1, a comparison verdict against Matt's counterpart, and findings in the `F:setup-ts-deep-modules:NN | kind | one line | who fixes it` form.
4. After step 6, the skill source matches the article, with catalog tests and a fresh-context scenario.

## Decisions And Contracts

- This Spec owns this skill alone. It owns neither the draft-wiki location nor the article template; S-002L does, and the path above stays tentative until S-002L decides.
- Adoption status is not decided here. The skill stays Pending unless step 4 or 5 findings justify otherwise; any move out of `skills-pending/` needs a per-item owner decision (S-00R disposition) and its own Spec.
- Source authority for step 6: `skills-pending/` is not in the `AGENTS.md` Edit Scope list. Step 6 must name how an edit there is authorized (S-00R's pending-source disposition, or an owner decision), or stop and record the gap. This Spec does not authorize the edit.
- Matt's skill at the pin `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60` is outside evidence, not Canon. His MIT-licensed files carry a notice in `THIRD_PARTY_NOTICES.md`; summarize and cite, do not reproduce.
- Do not copy live task state into the article or this Spec.

## Non-Goals

- Moving, archiving, installing or retiring the skill, or deciding whether it becomes Core.
- Rebuilding `codebase-design` or `improve-codebase-architecture`; those have their own Specs.
- Editing the manifest, `workbench/wiki/SCHEMA.md`, the skills README catalog, the Lexicon bundle row or any test, except what step 6 proves necessary.
- Answering Q2A (where `wayfinder` keeps pre-Spec decisions) or touching `grill-with-docs`.

## Dependencies And Blockers

- S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5.
- Step 6 needs the pending-source edit authorization described under Decisions And Contracts.
- Likely overlap with `codebase-design`: the skill delegates its vocabulary to it. Step 4 checks whether the two overlap, and the codebase-design skill's own Spec (S-003M) must not be edited from here.

## Vertical Implementation Slices

These six steps are intended slice direction in prose. No Task is cut yet; Tasks are cut from live Actuality when this Spec is activated, using `/to-tasks`.

1. Investigate ours. Read `skills-pending/setup-ts-deep-modules/SKILL.md` and its config at a named commit and record inputs, outputs, writes and composition. Settle whether the skill is a byte copy of Matt's, record the true `origin`, and check any tests or catalog entries that mention it.
2. Draft the article. Fill Template 2 from step 1 at the tentative path `workbench/wiki/skills-draft/getting-started/setup-ts-deep-modules.md`, tentative until S-002L decides.
3. Investigate Matt's. Read `in-progress/setup-ts-deep-modules` at `d81f3a183412e71a5b1e84ca21bc1a35eea03a60`. If it does not exist there, name `setup-pre-commit` or `codebase-design` as the nearest neighbor and say why.
4. Compare. Fill "Compared with Matt's" with a verdict (same, close, divergent or missing) and log findings, including the four-versus-five rules mismatch, the `/codebase-design` dependency, and any overlap.
5. Align the article. Rewrite until its wording matches real or intended behavior, and log what is left.
6. Fix or create the skill. Edit `SKILL.md` in its lane with catalog tests and a fresh-context scenario, under the authorization named above. Steps 1-5 touch only the draft wiki; step 6 is the only step that touches a skill lane.

## Acceptance Criteria

- [ ] The draft article fills every Template 2 section, with the Matt comparison and findings sections present.
- [ ] Every "needs" and "reads/writes" item resolves to something real or is a recorded finding, including the `/codebase-design` dependency.
- [ ] A comparison verdict against Matt's counterpart (or the named neighbor) is recorded, with the true `origin`.
- [ ] The four-versus-five rules mismatch is either corrected in the skill source or recorded as an open finding with an owner.
- [ ] After step 6, the skill source matches the article, a fresh-context scenario shows the skill ending on a pass, a fail, then a pass, and the required suites are green.
- [ ] The source edit's authorization is named, or the gap is recorded.

## Testing Seams

Steps 1-5 are checked by reading: each article claim cites source at a commit. Step 6 uses the skill's public entry (a user invoking it in a TypeScript repo) and the existing catalog tests for structure. A fresh-context scenario observes the skill's own completion criterion: `lint:boundaries` passes on the clean example, fails on a deliberate deep import with `tests-through-entrypoints`, and passes after revert. Structural checks prove routing, not agent behavior.

## Verification Procedure

For steps 1-5, run `node workbench/tools/wiki.mjs validate` if S-002L adds the collection to validation. For step 6, run the targeted catalog tests, the full suite in `AGENTS.md`, `node workbench/tools/spec-workbench.mjs render` and `doctor`, and the self-drift pre/post receipts. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

- The draft article at `workbench/wiki/skills-draft/getting-started/setup-ts-deep-modules.md` (tentative until S-002L decides).
- Step 6 may touch `skills-pending/setup-ts-deep-modules/SKILL.md` and the config, and the `skills-pending/setup-ts-deep-modules` row in `workbench/skills/README.md` if its disposition changes. Otherwise record `Docs checked; no update needed` with the reason.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; planning only, no implementation | Skill source and config read at the pre anchor; no behavior exercised and no tests run | This Spec authored; no article or skill source changed | S-002L, all six steps and independent review remain open |

## Completion Result

Not complete.

## Supersession

None.
