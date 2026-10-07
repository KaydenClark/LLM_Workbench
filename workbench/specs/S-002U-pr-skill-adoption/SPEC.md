# S-002U - pr skill adoption

**Spec ID:** S-002U
**Status:** active
**Priority:** 2
**Owner:** claude-s002u-worker-w
**Stance:** Builder
**Updated:** 2026-10-07
**Catalog description:** Ship Matt's PR body-authoring skill as required Core in every Workbench, preserving its visual summary, before/after evidence, merge danger and GLOSSARY.md vocabulary reference.
**Blockers:** none for specification. Delivery coordinates the required-skill package writer and the glossary migration; no pending-lane permission gate remains.
**Latest event:** TK-007W claimed by claude-s002u-worker-w.
**Next gate:** Close TK-007W with verification and documentation proof.

> **Citation anchors.** pre=`42431879fab3057db9e26ae661b4e92512c281f0` post=`42431879fab3057db9e26ae661b4e92512c281f0`.

## Outcome

Every Workbench carries a discoverable required `pr` skill for writing a PR body. Matt's pinned source, its draft Wiki article and the delivered skill agree. The body uses a small useful visual summary, concrete before/after evidence, and merge danger expressed as door reversibility and blast radius. It uses the project's canonical vocabulary from `GLOSSARY.md`.

## Why It Matters

The owner explicitly approved `pr` as required in every Workbench on 2026-10-06. The earlier Spec conflated description writing with opening and landing PRs and defaulted it to Pending. The supplied Matt source authors a body. Existing Git operations remain in their current owners; adding policy rewrites to this small source would hide its useful purpose.

## Current Verified State

At refreshed integration `42431879fab3057db9e26ae661b4e92512c281f0`, the required bundle has 28 skills and lacks `pr`; no `workbench/skills/pr/` or draft `workbench/wiki/skills-draft/main-workflow/pr.md` exists. The draft Wiki collection and Template 2 already exist under [Skills draft wiki collection (S-002L)](../S-002L-skills-draft-wiki-collection/SPEC.md); its remaining owner Human QA does not make the draft location unknown.

The owner-supplied [Matt PR source at d81f3a183412e71a5b1e84ca21bc1a35eea03a60](https://github.com/mattpocock/skills/blob/d81f3a183412e71a5b1e84ca21bc1a35eea03a60/skills/engineering/pr/SKILL.md) says to write the PR body and credits Dex Horthy / Humanlayer's `show-me`. It does not open or land a PR. Its `GLOSSARY.md` reference matches the confirmed destination in [refined Lexicon retirement (DDR-001E)](../../docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md). The glossary is not yet delivered; [Lexicon Retirement And ARCHITECTURE.md (S-004O)](../S-004O-lexicon-retirement-and-architecture-md/SPEC.md) owns that gap.

The separate local required-skill package checkpoint `005bc9c4d18c2d51a52023bb5498330970679771` is recoverable on `codex/retro-skill`. Its source candidate is `9a63801b5abf1ad7b0d3265abe4cac96a7a74544`; the checkpoint adds receipts and continuation state. Its manifest carries 30 required skills, adding writing-for-agents and retro, but still lacks `pr`. Adding PR there would make 31; these are package/base counts, not a fixed count to impose on a future target. Inspect the tracked package owners with `git show 005bc9c4d18c2d51a52023bb5498330970679771:workbench/specs/S-002P-writing-for-agents-skill-adoption/SPEC.md` and its S-002V counterpart. Their verification and review do not prove this skill or a final combined package; do not overwrite their receipts or close their Tasks from this planning record.

## Desired Behavior

1. Add `workbench/skills/pr/SKILL.md` to required Core and both tracked discovery adapters. Use the pinned source almost verbatim; justify only necessary runtime or reference adapters and preserve Dex Horthy / Humanlayer credits.
2. Preserve the source's Summary, Evidence and Merge Danger structure. Choose the smallest useful diagram, diff, pseudocode or tree; place it beside brief prose. Report actual before/after evidence and reversibility/blast radius without inventing checks or screenshots.
3. Retain `GLOSSARY.md` unchanged as the vocabulary reference. Follow S-004O's delivered canonical vocabulary layout; do not substitute `LEXICON.md` or silently create another vocabulary store.
4. Author the main-workflow draft article using the delivered draft collection. Compare source, article and observed behavior, explicitly labeling intended behavior and limitations.
5. Coordinate Core lists, counts, layout and catalog tests with the existing package writer. Preserve valid installed-room transitions for the current30, prior28 and legacy21 v3.2.1 cohorts where applicable; reject malformed subsets and unsupported versions.
6. Exercise body authoring in a fresh context with a known change and real evidence. Merely authoring a body performs no GitHub publication, merge or branch cleanup.

## Decisions And Contracts

- Required Core placement is the owner's explicit 2026-10-06 answer, replacing the old Pending default; do not reopen it as an extra permission request.
- Scope is PR body authoring, as the pinned source states. [Implement](../../skills/implement/SKILL.md#version-control-procedures) and the [Runbook](../../../RUNBOOK.md#version-control-procedures) retain Git operations; this skill adds no merge or main authority.
- DDR-001E owns the settled glossary destination. That answer resolves the vocabulary question; implementation availability remains a dependency.
- Preserve upstream pin and source lineage, including Dex Horthy / Humanlayer credits, outside any unnecessary local policy rewrite.
- Group remains main-workflow. This Spec owns only `pr`; the writing-for-agents and retro Specs keep their assignments, evidence and final-package gates.

## Non-Goals

- Opening, publishing, reviewing, landing or cleaning up a PR from the body-authoring invocation.
- Rewriting branch rules or the review gate; deciding the fate of land or other Foundry skills.
- Glossary or Lexicon migration, domain-modeling adoption, personal installs or pending/archive removal.
- Activation, Task cuts, implementation, release stamping or main promotion during this planning pass.

## Dependencies And Blockers

- S-002L supplies the existing draft collection and article template; inspect its actual delivered owners rather than treating its whole-Spec closure as a new writing gate.
- S-004O supplies canonical glossary availability. The reference is settled; a package lacking the glossary needs an explicit delivered prerequisite or truthful scoped limitation before claiming the vocabulary scenario passed.
- Coordinate one writer with [writing-for-agents skill adoption (S-002P)](../S-002P-writing-for-agents-skill-adoption/SPEC.md) and [retro skill adoption (S-002V)](../S-002V-retro-skill-adoption/SPEC.md) for the combined catalog, count and compatibility changes. Recover their local checkpoint and compare current integration before assembling.
- The [release owner](../S-00O-workbench-v4-0-0-release/SPEC.md) retains bundle identity, installed Template and owner gates. No release or merge is authorized by this record.

## Vertical Implementation Slices

Tasks cut at activation on 2026-10-06 as TK-007U, TK-007V and TK-007W; combined verification and review run at the assembly boundary. Original plan: at activation, `/to-tasks` cuts from live Actuality: source and draft fidelity; required bundle/discovery with compatibility regressions red then green; fresh-context body-authoring evidence; combined-package verification and review. Preserve existing package Tasks under their owners.

## Acceptance Criteria

- [ ] Both adapters discover the required skill in a fresh clone; manifest, bundle, catalog and counts agree.
- [ ] Pinned source and article agree on body authoring; the necessary adapter diff and Dex Horthy / Humanlayer lineage are recorded.
- [ ] A fresh-context scenario produces a useful brief visual summary, actual before/after evidence and accurate door/blast-radius discussion, using supplied canonical glossary terms.
- [ ] `GLOSSARY.md` stays unchanged in the source reference; any unavailable vocabulary prerequisite is recorded rather than asserted delivered.
- [ ] The invocation authors a body without opening or merging a PR or changing Git state.
- [ ] Compatibility accepts valid current30, prior28 and legacy21 cohorts where supported and refuses malformed subsets or unsupported versions; combined-package final proof is recorded without reusing old receipts as new proof.
- [ ] Targeted checks, Wiki validation, full suite, render, doctor and required immutable assembled review are recorded with their actual limits before integration delivery is claimed.

## Testing Seams

Source-fidelity and catalog/lane/layout tests; valid transition and malformed-subset fixtures; a fresh-context body-writing scenario with known diff, glossary, failing/passing evidence and expected reversibility. Observe artifact output and environment diff, not exact prose. Structural discovery is distinct from configured-host invocation and conversational judgment.

## Verification Procedure

Capture before/after room checks. Demonstrate the meaningful catalog/compatibility failures before implementation, then run targeted checks and the full Runbook suite on the clean committed candidate. Validate and lint the draft Wiki page, render and doctor. Preserve final combined-package proof and required independent assembled review at its immutable candidate, including unverified host behavior, ongoing Human QA findings and remaining release gates.

## Documentation Impact

Draft `workbench/wiki/skills-draft/main-workflow/pr.md`, required skills catalog, manifest/layout/count owners and appropriate operation routes during implementation. Source attribution and comparison stay with the skill and article; S-004O owns glossary and Template vocabulary migration. This planning-only pass changes no Core bundle or runtime Template.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; planning only | Nearest existing behavior read at the pre anchor (`AGENTS.md`, `RUNBOOK.md`, personal `land`); no implementation, article or skill source touched | This Spec authored; article and skill remain future work | S-002L, steps 1-6 and pending-lane authority remain open |
| 2026-10-06 | planning | Reconciled the owner-approved required-Core body-authoring scope and confirmed glossary reference; removed the stale Pending and PR-opening gates. | Integration base 42431879fab3057db9e26ae661b4e92512c281f0 and local package checkpoint 005bc9c4d18c2d51a52023bb5498330970679771 inspected; source content supplied at Matt pin d81f3a183412e71a5b1e84ca21bc1a35eea03a60. No PR behavior or final-package proof claimed. | Existing Spec reconciled; source, draft and Core installation remain future work. | Activation, Tasks, glossary dependency, package assembly and all delivery gates. |
| 2026-10-06 | planning-check | Verified documentation reconciliation; all delivery acceptance remains open. | Source `3d40a86505a339096c4629b814eb4fed1c789d5d`: full suite 53/53; ADR/Wiki, citation and diff checks passed. [Shared planning receipt](../S-004O-lexicon-retirement-and-architecture-md/proof/planning-verification.json) preserves the initial Blueprint-link failure, repair, bounded self-drift summaries and existing doctor findings. | Source owners read back; render regenerated projections. | No implementation, independent assembled review, PR or integration delivery claimed; self-drift remains 15 findings and cleanUpdate false. |
| 2026-10-07 | TK-007U | Task closed | RED at the TK-007U lane (context tk007u-red.txt): node tools/test-skill-catalog.mjs exit 1, workbench/skills/pr/SKILL.md must carry the pinned upstream source. GREEN: SKILL.md, CREDITS.md and agents/openai.yaml byte-identical to mattpocock/skills engineering/pr at d81f3a183412e71a5b1e84ca21bc1a35eea03a60 (SKILL.md sha256 ab63f1cf, pin hash bb2f9427 asserted by test-skill-catalog); NOTICE MIT text equals upstream LICENSE; Dex Horthy / Humanlayer show-me credits preserved; wiki.mjs validate ok. Full Runbook suite 53 pass, 0 fail on clean candidate 5e965265a832d931457526601ee0acc3d1719d98, where TK-007V declares pr required Core; spec-workbench doctor ok. | workbench/skills/pr/NOTICE.md (pin, no adapter, show-me lineage, MIT); workbench/wiki/skills-draft/main-workflow/pr.md drafted from Template 2; skills-draft README pr row; MEMORY.md router summary | GLOSSARY.md undelivered on this base (S-004O owns delivery); the pr source reference stays unchanged and the vocabulary instruction is a recorded limitation. Fresh-context body-authoring scenario not run (TK-007W). |
| 2026-10-07 | TK-007V | Task closed | RED then GREEN at candidate 5e965265a832d931457526601ee0acc3d1719d98: test-skill-catalog failed on pr must ship in the required Core bundle, then passed; layout tests (generated room requires pr; prior28 v3.2.1 validates and migrates unchanged, malformed subset, swapped entry and v9.9.9 refused invalid-skill-policy; legacy21 six-lane and legacy-version cohorts stay valid) 4/4 green. Fresh clone: .agents/skills/pr/SKILL.md and .claude/skills/pr/SKILL.md resolve into the lane, sha256 ab63f1cf equal to the pin. Full Runbook suite 53/53 on the clean committed candidate; doctor ok; wiki.mjs validate ok. | workbench/skills/README.md catalog row and 29-skill count; README.md; LEXICON.md Core skill bundle; templates/GENESIS.md; workbench-room-checks SKILL.md; workbench/wiki/skill-genesis.md; implement-spec draft count-free; RUNBOOK.md and templates/RUNBOOK.md Write a PR body rows | current30 cohort transition belongs to the S-002P/S-002V package merge (unlanded); combined-package proof, assembled review and the TK-007W scenario remain; configured-host invocation from an ordinary prompt not observed. |

## Completion Result

Not complete. Planning reconciliation only.

## Supersession

None.
