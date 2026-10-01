# S-003L - ubiquitous-language skill alignment

**Spec ID:** S-003L
**Status:** planned
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Extract, challenge, and normalize shared project vocabulary in the owning Lexicon, or fold that job into the skill that already does it.
**Blockers:** S-002L Skills draft wiki collection must deliver the draft-wiki location and article template before steps 2-5. The fold-or-retire decision may also depend on S-002H (domain-modeling) and S-003O (lexicon), which own the neighboring skills.
**Latest event:** Authored from the owner's 2026-09-30 draft-skills-wiki direction.
**Next gate:** Deliver S-002L, then activate this Spec and cut Tasks from live Actuality with `/to-tasks`.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

The draft Wiki article, a comparison with the nearest counterpart, and the skill source all describe one behavior for ubiquitous-language, or record a decision to fold it into another skill or retire it. This Spec owns that skill's article, its comparison, and its disposition. It does not own `domain-modeling` or `lexicon`.

## Why It Matters

The owner wants to prototype the skills Wiki with the current skills to find skills that should connect and do not, and skills that connect but do not work together. Ubiquitous-language is an early test of that. Matt Pocock removed his version upstream, superseded by `domain-modeling`, and the Workbench carries two quite different copies of it next to a `domain-modeling` skill and a `lexicon` skill that cover much of the same ground. A reader cannot currently say which of these owns "agree a term and write it down".

## Current Verified State

Checked at the pre anchor, with the personal copy read-only on 2026-09-30.

- Group: primitives. Source: pending (`skills-pending/ubiquitous-language/SKILL.md`) and a personal copy at `~/.agents/skills/ubiquitous-language/SKILL.md`. The skill is not in `workbench/skills/`, so it is not in the closed Core bundle and no room receives it.
- The two copies are not the same skill. The pending copy is Matt's older text: it scans the conversation, proposes a DDD-style glossary of tables, writes `UBIQUITOUS_LANGUAGE.md` in the working directory, and has a re-run procedure and a worked example dialogue. It sets `disable-model-invocation: true`. The personal copy is a short Workbench rewrite: collect terms from conversation, controls and source, settle one meaning at a time with examples, surface any choice that changes authority or scope, then update the nearest owning `LEXICON.md`. It has no `disable-model-invocation` line, so its description loads every session. It has no output format, no example, and no re-run procedure.
- The pending copy's destination file conflicts with the catalog: `tools/test-skill-catalog.mjs` lists `UBIQUITOUS_LANGUAGE.md` as a forbidden pattern in live Core skills. The pending source also has no operational consumer, per its row in `workbench/skills/README.md` (owner decision required to retain or remove).
- Neighbors: `skills-pending/domain-modeling/SKILL.md` and the personal `domain-modeling` also pin down terms, and the personal one already updates the owning `LEXICON.md` inline. The personal `lexicon` skill tells the agent to use `/ubiquitous-language` "to promote vocabulary" and `/domain-modeling` "to settle a term as a decision forms", so the personal set already depends on this skill by name. `workbench/wiki/skill-domain-modeling.md` is the existing article for the neighbor; there is no article for ubiquitous-language.
- Matt's counterpart was removed upstream and superseded by `engineering/domain-modeling`. An existing archive note in `workbench/wiki/archive/workbench-original-workflow-reference.md` records the move from the ubiquitous-language file to `context.md` and `grill-with-docs`; it is outside evidence, not Canon.
- Not yet verified: whether the pending copy is byte-identical to Matt's last published version (not diffed), and whether any other personal skill besides `lexicon` names this one.

## Desired Behavior

1. A reader of the draft article can say what ubiquitous-language does, when to reach for it instead of `domain-modeling` or `lexicon`, what it needs, and exactly where its output goes.
2. Every route the skill or article names resolves to a real owner (the Lexicon, a Spec, an ADR) or is recorded as a finding.
3. The skill's write behavior respects the S-00W rule that an interview writes no Canon: a settled term reaches `LEXICON.md` only in an authorized documentation or delivery pass.
4. The step 5 verdict is one of: keep as a distinct primitive with a boundary against `domain-modeling` and `lexicon`; fold into one of them; or retire. The Spec does not prejudge it.

## Decisions And Contracts

- Origin is recorded at step 1 from the evidence; this Spec does not guess it. The pending copy descends from Matt's skill; the personal copy is a Workbench rewrite.
- Which copy is canonical is a step-1 decision. The pending copy is Matt-shaped and repository-held; the personal copy is Workbench-shaped but lives in the owner's separate Git repository, which this Spec never writes.
- Steps 1-5 touch only the draft wiki. Step 6 is the only step that touches a skill lane, and `skills-pending/` is not in the `AGENTS.md` Edit Scope. S-00R is the authorizing route for any step-6 move, edit, archive or removal there, and per S-00R a per-item owner decision governs it.
- `domain-modeling` is owned by S-002H, which has a live lane. This Spec reads it and records findings against it; it plans no edit to it. `lexicon` is owned by S-003O.
- A draft article is curated context, not instruction authority or proof of behavior.

## Non-Goals

- Editing `domain-modeling`, `lexicon`, the Lexicon itself, or any other skill.
- Writing a glossary file, a new vocabulary store, or a parallel router.
- Adopting `grill-with-docs`, which is excluded.
- Writing to `~/.agents/skills`, moving or archiving any skill now, or answering Q2A (where `wayfinder` keeps pre-Spec decisions; it remains open).
- Treating a source review, a green suite or the article as owner Human QA.

## Dependencies And Blockers

- **S-002L Skills draft wiki collection** must deliver the draft-wiki location and article template before steps 2-5.
- Step 6 coordinates with S-002H (domain-modeling, live lane), S-003O (lexicon) and S-00R (pending-source disposition, live Codex lane). Do not write the same lane at the same time as any of them.
- Open question for step 1: if the personal `lexicon` skill keeps routing to `/ubiquitous-language`, retiring this skill leaves a dangling route that S-003O must repair.

## Vertical Implementation Slices

No Task is cut yet. Tasks are cut from live Actuality at activation with `/to-tasks`. The intended slice direction is:

1. **Investigate ours.** Read both copies and their tests at a named commit and record inputs, outputs, writes and composition. Decide and record which copy is canonical, the true origin, and whether the pending copy equals Matt's last version.
2. **Draft the article.** Fill the S-002L article template for the skill, at the tentative location `workbench/wiki/skills-draft/primitives/ubiquitous-language.md` (tentative until S-002L decides).
3. **Investigate Matt's.** Matt has no live counterpart; his version was removed upstream and superseded by `domain-modeling`. Read his `domain-modeling` skill at `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`, and note any history of the removed skill at the same pin.
4. **Compare.** Fill "Compared with Matt's" against `domain-modeling` and log findings, expecting `overlap` and `stale-name` kinds (including the `lexicon` route and the `UBIQUITOUS_LANGUAGE.md` filename), with a verdict of same, close, divergent or missing.
5. **Align the article.** Rewrite until its wording matches real or intended behavior, record the fold-or-retire recommendation, and log what is left.
6. **Fix or create skill.** Only if step 5 keeps the skill: edit it in its lane with catalog tests and a fresh-context scenario. If it folds or retires, the change is a disposition (relocate, archive or remove) routed through S-00R, plus repairs to dangling references.

## Acceptance Criteria

- [ ] The draft article fills every template section; each "needs" and "reads and writes" item resolves to a real owner or is a finding.
- [ ] Which copy is canonical, the true origin, and the pending-versus-personal differences are recorded.
- [ ] A verdict against `domain-modeling` is recorded, with findings logged one per line.
- [ ] A fold, retire or keep recommendation is recorded and the skill source (or its disposition) matches the article.
- [ ] No route in the skill or article dangles, including the `lexicon` reference and the forbidden `UBIQUITOUS_LANGUAGE.md` destination.
- [ ] The relevant suites, the draft-wiki checks and S-002L's template checks are green for step 6, and none is reported passing without a run.

## Testing Seams

Steps 1-5 are documentation: the seam is the article's sections and findings, checked by S-002L's template rules and by grepping each cited path. Step 6, if it keeps the skill, uses the skill's public entry and a fresh-context scenario: a conversation with a conflicting term ends with a proposed preferred term and no Canon edit unless the pass authorizes it. If it folds or retires, the seam is `tools/test-skill-catalog.mjs` and the references check. Structural checks prove routing, not conversational behavior.

## Verification Procedure

For steps 1-5, validate the draft article against S-002L's rules, check every cited path and finding line, and read the skill diff again. For step 6, run the targeted catalog tests, then the full suite in `AGENTS.md` from a committed candidate, then `node workbench/tools/spec-workbench.mjs render` and `doctor`. Review the immutable candidate separately before integration. Record the actual commands and results in this Spec.

## Documentation Impact

The draft-wiki article is `workbench/wiki/skills-draft/primitives/ubiquitous-language.md` (tentative until S-002L decides). Step 6 may touch `skills-pending/ubiquitous-language/SKILL.md` or its disposition, the `workbench/skills/README.md` optional-source row for it, `tools/test-skill-catalog.mjs` only if the disposition changes an assertion, and the `lexicon` skill reference through S-003O. Record `Docs checked; no update needed` where a control does not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Spec authored from the owner's draft-skills-wiki direction; no Task cut | Pending and personal copies diffed read-only; catalog, README and neighbor skills read at the pre anchor; no behavior change or scenario trial | This Spec authored; article remains future work | S-002L delivery, activation, Tasks and independent delivery proof remain open |

## Completion Result

Not complete.

## Supersession

None.
