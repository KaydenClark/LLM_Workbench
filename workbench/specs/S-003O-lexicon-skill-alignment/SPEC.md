# S-003O - lexicon skill alignment

**Spec ID:** S-003O
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-10-04
**Catalog description:** Tell an agent how to load the project's Lexicon whole, speak its terms exactly and follow each term to the document that owns it.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5. Step 6 also needs the owner's per-item source decision under S-00R (the skill has no repo source today).
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

The draft Wiki article for `lexicon`, the comparison with its nearest neighbor skills, and the skill source all describe one behavior: how an agent uses a Workbench Lexicon. The skill's behavior is checked against what the Workbench Contract now says a Lexicon is.

## Why It Matters

The owner wants to prototype the skills Wiki to find skills that should connect and do not, and skills that connect and conflict. `lexicon` is a clear test case. It is a 26-line personal skill with no repo source, nothing in the Workbench invokes it, and one line of it contradicts a locked owner answer. Drafting its article forces those facts into view before anything is built on it.

## Current Verified State

- Source: `~/.agents/skills/lexicon/SKILL.md` only (read-only; the owner's separate Git repo). It is one file with no supporting files. It does not exist in `workbench/skills/`, `skills-pending/` or `skills-archive/` at the pre anchor, so there is no second copy to diff.
- What the skill says: read the nearest `LEXICON.md` whole; speak its terms exactly and say once when a retired name surfaces; follow a term's link rather than searching; "keep open what is open", because the Lexicon "records unsettled questions beside settled ones"; supplying vocabulary is the whole job, so a flow skill running alongside keeps its own sequence and writes. When the map is wrong it routes to `/ubiquitous-language` or `/domain-modeling`. It writes nothing.
- Nothing in the repo invokes it. `workbench/skills/README.md` records `lexicon` as "out of scope" with no reference: the word "Lexicon" in controls and lane skills names the root `LEXICON.md`, and nothing names the skill. A search for `/lexicon` across the tree at the pre anchor found no skill or control calling it. No Core skill or control depends on it, so there is no Core dependency on a personal-only skill today.
- Conflict on record: locked answer FND-Q09 says the Lexicon holds settled vocabulary only and unsettled questions live in their linked owners (`workbench/sessions/grilling-destination-audit-ledger.json`). That ledger lists the personal `lexicon` skill as a result to update, so it carries no instruction to record unsettled questions beside settled terms. `workbench/feedback/REPORT-foundation-question-review-2026-09-11.md` lists the same line as a correction with no owning Spec. The current skill still says it. Whether the ledger row's progress has since changed is open for step 1.
- The two skills it routes to are in different places. `ubiquitous-language` is a pending skill (`skills-pending/ubiquitous-language/SKILL.md`, S-003L owns its alignment) that writes a `UBIQUITOUS_LANGUAGE.md` file. `domain-modeling` is a pending skill; at the pre anchor its draft rebuild was owned by S-002H, which was superseded on 2026-10-04 by Required Domain Modeling Skill (S-004J), its current owner (reference only here).
- The repo's own `LEXICON.md` is the instance the skill's text should describe. It opens with a Task Routing section and Context Map table and says it is "the canonical lookup table for shared Workbench language". S-01U owns a planned audit of the whole Lexicon; this Spec does not edit it.
- No Matt Pocock counterpart exists. Nearest neighbors: `engineering/domain-modeling` and `productivity/wait-what`. Origin (`workbench` or other) is not known; step 1 records it.

## Desired Behavior

1. The article says in plain second person what `lexicon` does, when to reach for it, what it needs (a `LEXICON.md` in the project, the files its terms link to, `ubiquitous-language`, `domain-modeling`) and that it reads the Lexicon and writes nothing.
2. Every "needs" and "reads/writes" item resolves to something real or is a recorded finding, in the Template 2 finding format, with kinds from its list (`dangling`, `stale-name`, `overlap`, `gap`, `conflict`, `missing-skill`).
3. The comparison states how `lexicon` differs from `domain-modeling` (which settles terms as decisions form) and from `wait-what` (read at step 3, not now), and records a verdict.
4. The skill source agrees with the article and with accepted Canon on what a Lexicon holds, once the owner decides how it should change.

## Decisions And Contracts

- This Spec owns the `lexicon` skill alone. `LEXICON.md` itself, the `domain-modeling` and `ubiquitous-language` skills, and the Core bundle belong to S-01U, S-004J (Required Domain Modeling Skill, which replaced S-002H), S-003L and the Core-bound Specs.
- Steps 1-5 touch only the draft wiki. Step 6 is the only step that touches a skill lane.
- Step 6 has no repo source to edit. It first brings a copy into a repo lane, read-only from the personal repo, defaulting to Pending per the owner's 2026-09-30 decision 1. `skills-pending/` is not in `AGENTS.md` Edit Scope, so the authorizing route is S-00R, which requires a per-item owner decision for relocation. This Spec records that route and does not decide it.
- A Wiki article is curated context, not instruction authority. The skill source and Canon establish behavior.
- Open for step 1: which copy is canonical. Here there is one copy, personal-only, so the question is whether it stays personal, joins Pending, or is retired in favor of the Contract's own entry route (`AGENTS.md` -> `RUNBOOK.md` -> `LEXICON.md`), which already requires reading the Lexicon.

## Non-Goals

- Editing `LEXICON.md`, `templates/LEXICON.md`, S-01U, S-004J or S-003L.
- Writing to `~/.agents/skills/`.
- Promoting `lexicon` to Core, which would change the closed Core bundle; no owner decision names it for Core.
- Answering Q2A (wayfinder storage), which is unrelated and stays open.
- Treating the article or a green suite as owner approval.

## Dependencies And Blockers

- S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5.
- Step 6 depends on the owner's per-item S-00R decision for bringing a personal-only skill into a repo lane. The default is Pending; Core is not assumed.
- Step 6 should be sequenced with S-003L (`ubiquitous-language`) and S-004J (`domain-modeling`), because the skill's two routes point at them and their final names or homes may change.

## Vertical Implementation Slices

No Task is cut. These are intended slice directions; `/to-tasks` cuts Tasks from live Actuality at activation.

1. Investigate ours: read `~/.agents/skills/lexicon/SKILL.md` and any tests or catalog entries, and record inputs, outputs, writes and composition at a named commit. Record the origin and which copy is canonical. Check the `/lexicon` reference search again, and check the FND-Q09 ledger row's current progress.
2. Draft the article from Template 2 (owned by S-002L) at `workbench/wiki/skills-draft/primitives/lexicon.md`, tentative until S-002L decides.
3. Investigate the nearest neighbors: there is no Matt counterpart, so read `engineering/domain-modeling` and `productivity/wait-what` at `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`.
4. Compare, fill "Compared with Matt's" with a verdict, and log findings. Expected candidates, to confirm: a `conflict` on recording unsettled questions; a `gap` where nothing invokes the skill; a `dangling` or `stale-name` check on `/ubiquitous-language` and `/domain-modeling`; an `overlap` with `domain-modeling` and with the Contract's own entry reading of `LEXICON.md`.
5. Align the article until its wording matches real or intended behavior, and log what is left.
6. Fix or create the skill. Bring a copy into a repo lane (read-only from the personal repo), default Pending, under S-00R. Then edit its `SKILL.md` to match the article and Canon, with catalog tests and a fresh-context scenario. Update the `lexicon` row in `workbench/skills/README.md` if the disposition changes.

## Acceptance Criteria

- [ ] Every section of the `lexicon` draft article is filled from Template 2.
- [ ] Every "needs" and "reads/writes" item resolves to a real artifact or is a finding line (`F:lexicon:NN`).
- [ ] The comparison with `domain-modeling` and `wait-what` records a verdict (same, close, divergent or missing).
- [ ] The FND-Q09 conflict (unsettled questions in the Lexicon) is resolved in the skill source or recorded as an owner-gated finding.
- [ ] The origin and canonical copy are recorded, and the S-00R owner decision for the repo copy is named.
- [ ] The repo copy's `SKILL.md` matches the article, with a fresh-context scenario observed.
- [ ] Catalog and lane tests, Wiki validation, the full suite, `render` and `doctor` are green for step 6; no unrun check is reported as passing.

## Testing Seams

Steps 1-5 are checked by reading: each article claim names a source line or a finding. Step 6 uses the skill-catalog and skills-lane tests (`tools/test-skill-catalog.mjs`, `tools/test-skills-lane.mjs`), which scan referenced skills and README rows. A fresh-context scenario shows an agent loading a `LEXICON.md`, using its terms, following a link and reporting an unsettled item as unsettled by pointing to its owner. Structural checks prove routing, not conversational behavior.

## Verification Procedure

For steps 1-5, check the article against the source and the cited Canon at the anchors. For step 6, run the targeted tests, `node workbench/tools/wiki.mjs validate` if the Wiki changes, then the full suite in `AGENTS.md`, `render` and `doctor`, with a separate-context review of the immutable candidate. Record actual commands and results in this Spec.

## Documentation Impact

- Draft article: `workbench/wiki/skills-draft/primitives/lexicon.md` (tentative until S-002L decides).
- Step 6 may touch `workbench/skills/README.md` (the `lexicon` row in the referenced-skills table) and, if the skill joins a lane, that lane's catalog, but not the Core bundle assertions unless the owner decides Core.
- Record `Docs checked; no update needed` for any control that does not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; planning only | Read `~/.agents/skills/lexicon/SKILL.md`, `workbench/skills/README.md`, the FND-Q09 ledger row and feedback report at `07edccc5`; no implementation evidence | This Spec authored; no article or skill source written | Steps 1-6 open; S-002L and the S-00R decision outstanding |
| 2026-10-04 | reference repair | The domain-modeling owner changed: S-002H was superseded by Required Domain Modeling Skill (S-004J); ownership and coordination lines now name S-004J | Read S-002H and S-004J at the remap branch; Current Verified State keeps its dated observation with the new owner noted | Current Verified State owner note, Decisions And Contracts, Non-Goals and Dependencies lines repointed | Unchanged |

## Completion Result

Not complete.

## Supersession

None.
