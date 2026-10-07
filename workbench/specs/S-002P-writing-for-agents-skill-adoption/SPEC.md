# S-002P - writing-for-agents skill adoption

**Spec ID:** S-002P
**Status:** active
**Priority:** 2
**Owner:** codex-retro
**Stance:** Builder
**Updated:** 2026-10-07
**Catalog description:** Write and edit skills so an agent takes the same process every run, adopted from Matt Pocock's writing-for-agents and replacing writing-great-skills.
**Blockers:** none. The delivered draft collection is available; the current owner request authorizes Core source adoption.
**Latest event:** Delivered to integration by PR #421 at 87d5154f; exact source containment verified.
**Next gate:** Owner Human QA and the separately authorized main/release gate; no further implementation delivery is pending for this pair.

> **Citation anchors.** pre=`07edccc57b8f75613ad1d09203a3e414d867b90c` post=`07edccc57b8f75613ad1d09203a3e414d867b90c`.

## Outcome

Matt Pocock's `productivity/writing-for-agents` is adopted as a new Workbench skill, `workbench/skills/writing-for-agents/`, and joins retro in the owner-requested Core adoption, bringing the combined required bundle to 32 while preserving the independently delivered pr skill. It replaces `writing-great-skills`. The draft-wiki article, the comparison with Matt's skill and the skill source describe one behavior. This Spec also carries the retirement note for `writing-great-skills`: how it folds in, and that it leaves the owner's personal install only by his hand.

## Why It Matters

The owner wants the skills prototyped as a draft wiki before more is built on them. A skill about writing skills is the one every other skill rebuild depends on for its own `SKILL.md` wording. Today the nearest thing is `writing-great-skills`, which sits outside the core lane and is reached only by a name in an archived router. Adopting one maintained reference, with a recorded fold-in, removes the choice between two overlapping authoring references.

## Current Verified State

The following bullets are historical investigation observations at the pre anchor. Current paired implementation and verification are recorded in the execution amendment, acceptance and proof below.

- `workbench/skills/writing-for-agents/` does not exist; there is no counterpart in `workbench/skills/`, `skills-pending/` or the draft wiki. The skill is new.
- `writing-great-skills` has two copies, byte-identical when diffed on 2026-09-30: the in-repo archive at `skills-archive/optional-active-2026-09-01/writing-great-skills/` (`SKILL.md`, 83 lines; `GLOSSARY.md`, 201 lines) and the owner's personal install at `~/.agents/skills/writing-great-skills/`.
- Its frontmatter sets `disable-model-invocation: true`. Its body is reference only: invocation choices, writing a description, an information hierarchy, when to split, pruning, leading words and a list of failure modes, with full definitions disclosed to `GLOSSARY.md`.
- Its only in-repo consumer found is the archived `skills-archive/optional-active-2026-09-01/ask-workbench/SKILL.md`, which routes to it by name. `workbench/feedback/REPORT-original-foundation-audit-2026-09-10.md` records the same skill as an authoring reference preserved under a "write-great-skill" row, with the exact rename "not independently established".
- `skills-archive/optional-active-2026-09-01/` holds five directories, and `tools/test-skill-catalog.mjs` hard-requires exactly `ask-workbench`, `brainstorm`, `grill-me`, `sitrep`, `writing-great-skills`. `grill-me` is already a core skill with its archived wrapper retained, so the archive and core lists already overlap.
- The closed-bundle count of 26 is asserted in `workbench/skills/README.md` (intro line and the `core-skills` catalog region), the Lexicon "Core skill bundle" row in `LEXICON.md` ("eighteen workflow skills, four coordination skills and four stance skills"), `workbench/manifest.json` `skillPolicy.required`, and the catalog tests. Whether the catalog tests assert the count itself, not just the list, is unchecked: an open question for step 1.
- The `skills-archive/optional-active-2026-09-01/writing-great-skills` row in the optional-source table of `workbench/skills/README.md` carries the disposition `owner decision required: preserve this writing-great-skills source pending retention or recoverable removal choice`. S-00R owns that table and a live Codex lane (`codex/S-00R-optional-inventory`) works on it.
- `THIRD_PARTY_NOTICES.md` at the repository root carries one MIT notice for files derived from `mattpocock/skills` (Copyright 2026 Matt Pocock), and the catalog test asserts that copyright line. It names no individual files; whether a new derived skill needs a per-file entry is an open question for step 6.
- Matt's `writing-for-agents` has not been read. The pin is `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`; its content, supporting files and invocation setting are unknown until step 3.

## Desired Behavior

1. The skill gives an agent, or its author, a checkable reference for writing skills and other agent instructions so a run takes the same process each time. Its exact content is settled by steps 3-5, not fixed here.
2. A reader of the draft-wiki article can say what the skill does, when to reach for it, what it needs and what it reads and writes, from a second-person page without jargon.
3. The skill source in the Core lane, its catalog route, the bundle assertions and the draft article agree on behavior, source revision and limits, and the article's compared-with-Matt section states the verdict.
4. `writing-great-skills` is no longer a competing reference: anything of it that survives is folded into `writing-for-agents`, and the rest is recorded as dropped with a reason.

## Decisions And Contracts

### Current-target rebase, 2026-10-07

Domain modeling independently joined the required Core at c80cb282 after the paired hand-back. Preserve that source and its placement after improve-harness; the current combined bundle is 32. Rebased Check verifies exact prior28, pr-only29, domain-only29, pair-only30, pr-and-domain30, and pr-and-pair31 cohorts. The earlier source and native Task closure receipts remain dated proof; current combined verification and independent assembled review bind the updated candidate. No skill body is rewritten and no owner QA/main approval is inferred.

### Historical pre-domain delivery continuation, 2026-10-07

The owner now requests retro and writing-for-agents in their proper home. Deliver this existing pair into the tracked Core lane through integration under current gates. The pr package independently landed at 6101c237 during verification; preserve it and combine the required bundle at 31. Its unresolved review findings remain with S-002U. Current31, exact prior28, pr-only29, pair-only30 and frozen legacy21 policies are checked at the shared compatibility seam. This continuation grants no owner Human QA or main-promotion approval and changes no personal installation.

### Historical paired-source amendment, 2026-10-06

The owner explicitly requested `retro` as required in every Workbench and reiterated the already-requested `writing-for-agents`. Both sources go into `workbench/skills` and the required Core bundle. This supersedes the earlier Pending default and step-6 lane gate for retro, and the earlier arbitrary ask-workbench/brainstorm/sitrep ordering for writing-for-agents for this paired delivery. At the isolated 2026-10-06 checkpoint, the paired sources expanded the bundle from 28 to 30; the pre-domain combined target was 31; the current-target rebase above records 32; unrelated skill adoption and archived-source disposition stay with their owners.

S-002L has delivered the draft collection and Template 2 on integration, although its owner Human QA and main closure are still open. Those release gates do not prevent this requested draft work. The six investigation/draft/comparison/alignment/source steps are covered by one Task per skill from current Actuality. Existing Current Verified State bullets below remain dated pre-anchor observations, not current installation claims.

`retro` retains Matt's session retrospective and severity ordering, with step 1 adapted to a real Workbench reference. `writing-for-agents` and its supporting mechanics retain the supplied upstream text. Existing Workbench controls govern authority, composition and artifact ownership; their rules are not duplicated into the imported skills. The archived writing-great-skills source and personal installations stay intact; the new reference supersedes it for live Workbench authoring.


- Owner decision 2026-09-30: `writing-for-agents` replaces `writing-great-skills` and becomes Core. This Spec records that decision; it does not reopen it.
- Fold-in is a finding, not a presumption. Step 1 reads `writing-great-skills` as "ours" (read-only) and records what it contains. Step 4 compares it and Matt's skill and logs, per idea or term, whether it survives into `writing-for-agents`, is already covered by Matt's text, or is dropped. Whether `GLOSSARY.md` or any of its vocabulary (predictability, leading word, context pointer, premature completion, sediment and the others) survives is decided there, not now.
- Retirement of `writing-great-skills`:
  - The in-repo archive copy is repository provenance and is recoverable from git history. Whether it stays in `skills-archive/` or is removed is the owner's per-item decision under S-00R; the owner's 2026-09-30 decision (replaced by `writing-for-agents`) is recorded as that item's disposition. Step 6 records it in the Spec evidence and in the optional-source row only after coordinating with S-00R's live lane, and does not edit S-00R's Spec.
  - The personal install copy at `~/.agents/skills/writing-great-skills/` retires only by the owner's hand. No step of this Spec writes, moves or deletes anything under `~/.agents/skills`, and the core-skill installer refuses to write there.
- Origin is recorded at step 1 and step 3, not guessed: this skill is new as `writing-for-agents` and its Matt counterpart is `productivity/writing-for-agents`, but the true origin of `writing-great-skills` (Workbench, Matt, or other) is open.
- Step 6 uses Matt's MIT source with the upstream notice kept in `THIRD_PARTY_NOTICES.md`, adapted as the article settles. The adaptation is the Workbench's, so the skill source states its upstream relationship and pin; it does not claim Matt's wording is Workbench Canon.
- Invocation is model-selectable in this adoption, matching the unchanged upstream reference and its use by retro; historically, `writing-great-skills` is user-invoked and the Core skills are mostly model-invoked or deliberately user-invoked case by case; Matt's setting is unread.
- A Wiki article is curated context, not instruction authority or proof of behavior. Current source and tests establish Actuality; the Spec and accepted controls establish the target.

## Non-Goals

- Adopting unrelated skills or rewriting unrelated controls through this Spec.
- Writing, moving, installing or deleting anything under `~/.agents/skills`, or retiring the personal-install skill.
- Editing S-00R or its optional-source table except as coordinated with its live lane, or changing the dispositions of any other archived or pending item.
- Adopting Matt's other skills, or the Foundry skills, through this Spec.
- Treating a green catalog test or a rendered article as owner Human QA or as proof an agent writes better skills.

## Dependencies And Blockers

- The S-002L draft location and template are delivered on integration and were read live for this work.
- Core lane authorization and shared-writer ordering are resolved by the current execution amendment above.
- The writing reference and retrospective ship together. Neither source relies on an absent skill or private installation.
- S-00R retains ownership of archived/pending-source disposition; this candidate changes neither archive nor personal copies.

## Vertical Implementation Slices

TK-006Y is the record-backed Task covering these six steps. The following is the retained 2026-10-06 investigation and implementation sequence, including its historical 30-skill checkpoint:

1. **Investigate ours.** Read `writing-great-skills` (`SKILL.md`, `GLOSSARY.md`) and any tests or callers at a named commit; record its inputs, outputs, writes and composition. `writing-for-agents` has no source of ours, so its "ours" is this skill. Record the true origin of `writing-great-skills`, its invocation mode and every in-repo consumer.
2. **Draft the article.** Fill the Template 2 draft article from step 1, at the tentative location `workbench/wiki/skills-draft/primitives/writing-for-agents.md` (tentative until S-002L decides), with `skill_source: new`, `supersedes` naming the retired reference and the pin `d81f3a1` in provenance.
3. **Investigate Matt's.** Read `productivity/writing-for-agents` at `mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`, including any supporting files and its invocation setting.
4. **Compare.** Fill "Compared with Matt's", log findings (one greppable line each), and record the fold-in of `writing-great-skills` per idea or term: survives, covered already, or dropped with a reason.
5. **Align the article.** Rewrite until its wording matches real or intended behavior and log what is left.
6. **Create the skill.** Add `workbench/skills/writing-for-agents/SKILL.md` from Matt's MIT source, adapted, with the notice kept in `THIRD_PARTY_NOTICES.md`, a catalog test and a fresh-context scenario. Update every closed-bundle touchpoint in one change, sequenced behind S-002O: the `workbench/skills/README.md` intro and catalog, the Lexicon "Core skill bundle" row, `workbench/manifest.json` `skillPolicy.required`, and the catalog tests including the five-archive-directory requirement (`ask-workbench`, `brainstorm`, `sitrep` and `writing-great-skills` have each been recorded for the archive; re-read the live assertion before editing, since earlier steps may have changed it). End the bundle at 30. Record the owner's 2026-09-30 decision as the S-00R per-item disposition for `writing-great-skills`, coordinated with S-00R's lane.

Steps 1-5 touch only the draft wiki. Step 6 is the only step that touches a skill lane or shared controls.

## Acceptance Criteria

- [x] The `writing-for-agents` draft article has every Template 2 section filled, and every "needs" and "reads/writes" item resolves to something real or is logged as a finding.
- [x] The comparison with Matt's skill at `d81f3a183412e71a5b1e84ca21bc1a35eea03a60` records a verdict (same, close, divergent or missing) and the behavior and clarity differences.
- [x] The fold-in of `writing-great-skills` is recorded per idea or term (survives, covered, dropped with reason), and the retirement note states that the personal-install copy retires only by the owner's hand.
- [x] `workbench/skills/writing-for-agents/SKILL.md` exists, matches the article, and `THIRD_PARTY_NOTICES.md` keeps the upstream MIT notice.
- [x] Every closed-bundle touchpoint reads 32 consistently (README, Lexicon row, `skillPolicy.required`, catalog tests, the five-archive-directory requirement), and the owner's 2026-09-30 decision is recorded as the S-00R disposition for `writing-great-skills`.
- [x] A fresh-context scenario shows an agent using the skill to write or edit a skill with the process the skill describes.
- [x] The full suite from `AGENTS.md`, `node workbench/tools/wiki.mjs validate`, `render`, `doctor`, the Workbench self-drift pre/post receipts are recorded at their proper gates; no unrun check is reported as passing.

The separate-context review remains mandatory at the immutable assembled Verify gate, after deterministic acceptance and Task closure. It is not its own self-referential acceptance checkbox.

## Testing Seams

Steps 1-5 are checked by reading: article sections, findings and the fold-in record. Step 6 uses the catalog tests as the structural seam (bundle membership, count, archive directories, notice text) and a fresh-context scenario as the behavior seam. Show red then green for each new catalog assertion. Structural tests prove routing, not that an agent writes better skills; conversational fidelity may still need human review.

## Verification Procedure

For step 6, run the targeted catalog and skills-lane tests, then `node workbench/tools/wiki.mjs validate`, then the full suite in `AGENTS.md` from a committed candidate. Run `node workbench/tools/spec-workbench.mjs render` and `doctor`, capture the self-drift pre/post receipts and a bounded semantic check, and review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

- Draft article at the delivered S-002L location: `workbench/wiki/skills-draft/primitives/writing-for-agents.md`.
- Step 6 touches: `workbench/skills/writing-for-agents/SKILL.md` (new), `workbench/skills/README.md` (intro, catalog, and the `writing-great-skills` optional-source row), `LEXICON.md` ("Core skill bundle" row), `workbench/manifest.json`, `tools/test-skill-catalog.mjs` and any other test that asserts the bundle, and `THIRD_PARTY_NOTICES.md` if a per-file entry is needed.
- `workbench/skills/README.md` and the Lexicon row are shared with the other three Core-bound Specs; the current owner-directed paired adoption supersedes that earlier arbitrary ordering, with one writer for both Specs.
- Record `Docs checked; no update needed` with a reason for any owner step 6 does not change.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-30 | planning | Authored from the owner's draft-skills-wiki direction; the owner's decision that writing-for-agents replaces writing-great-skills and becomes Core is carried here | Planning only; writing-great-skills and the catalog test inspected read-only at the pre anchor; Matt's skill not read | This Spec authored; no article or skill authored | Delivery of S-002L, S-002O step 6, all six steps and independent review remain open |

| 2026-10-06 | planning | Owner explicitly selected required Core for retro and reiterated prior writing-for-agents request; paired delivery activated, earlier arbitrary ordering and Pending lane gate superseded | Fresh origin/integration 42431879; S-002L collection and Template 2 present; catalog red observed: writing-for-agents absent from required Core | Current execution amendment and one native Task per skill | Implementation, green checks, fresh-context scenarios, review and delivery pending |

| 2026-10-06 | TK-006Y | Core source and draft comparison delivered in candidate 8925425c; independent direct-path scenario observed | Catalog red then green; Wiki validation and Ruby YAML name/description parsing pass; scenario inputs/outputs and limits under proof/ | Draft, source, shared bundle owners, generic Runbook mirror and retained archive disposition agree; existing MIT notice retained | Full 53-command suite running; independent assembled review, integration, native-host discovery, owner Human QA and main closure remain; optional Python validator unavailable |

| 2026-10-06 | TK-006Y | Independent provisional assembled review FAIL at 90ca0cc7: P2 exact pre-pair 28-skill lane policy rejected by validate and migrate; returned to diagnosis and correction within the open Task | Public-seam focused regression observed red: invalid instead of valid; prior suite interrupted after its partial results, including three dirty-source refusals | Compatibility correction preserves exact v3.2.1 transition shape only; malformed subsets and unlisted versions remain rejected | Focused green, final full suite and refreshed immutable review pending; earlier FAIL remains evidence |

| 2026-10-06 | TK-006Y | Owner corrected the excessive adaptation: restore Matt's supplied text, retaining only retro's one-line loading adapter and separate Codex invocation metadata | Source-fidelity test observed red against the earlier rewrites; prior 9a25b00c candidate passed 53/53 but that result does not certify this text revision | Runtime rules removed from the imports where existing room controls already govern; shipped notice retains MIT attribution | New source-fidelity green, fresh-context evidence and immutable verification/review refresh pending |

| 2026-10-06 | TK-006Y | Upstream-faithful source verified at 9a63801b; owner requested a Glossary/Lexicon grilling handoff, then this author stops and the package passes to a later agent | Full Runbook suite 53/53 on clean 9a63801b; source fidelity, Wiki, explicit-only metadata, migration red/green and new independent synthetic scenario passed; provisional source review has no new findings | Current evidence under proof/; earlier rewrite evidence retained as superseded; raw skill bodies unchanged except retro's one loading line | Final binding assembled review/verdict, native Task close, pr adoption after the naming inquiry, PR and integration remain; no native-host, Human QA or main claim |

| 2026-10-07 | paired-delivery | Recovered pair combined with required pr; live acceptance reconciled to Core31 | Full Runbook suite 53/53 on clean 711fc04b; exact29/30 RED at689cd598 then focused GREEN4/4; prior28 and legacy21 retained; all3 pinned imports pass fidelity; original scenario identity/primary evidence recovered | Shared Core owners and generic routes, source/draft references, current acceptance and proof reconciled; guardrail reports73/100 before and after with all5 recommendations under proof/ and benchmarks/RESULTS.md | Final native close, binding assembled review and integration tracking follow; native invocation/reliability, owner Human QA/main and existing room drift remain separate; no outcome improvement claim |
| 2026-10-07 | TK-006Y | Task closed | Full Runbook suite 53/53 on clean source 711fc04b41b6be5741098952658e5bb5f8951dab; current source, controls, templates and runtime files unchanged since that candidate. Combined31 catalog/fidelity and exact28/29/30/legacy21 coverage pass. Focused Wiki and native render checks pass; retained scenario identity recovered. Source plus receipts remotely verified at 763f8a4b. | Paired source/draft, current31 acceptance, delivery verification and room/guardrail receipts; benchmark result; generic routes and shared Core owners aligned. | Separate assembled review and integration delivery next; native-host invocation/reliability, existing drift, owner Human QA/main remain separate. |

| 2026-10-07 | paired-rebase | Current32 rebased Check | Full54/54 Runbook commands pass on clean d2e12abef7f1b76e63dce8ed9cb001bd60f1680b. Exact six historical policies failed RED at377ffcef then passed at4c05ff69; domain catalog conflict failed then passed after2ff2852a. Wiki validates; all paired/pr/domain skill bodies unchanged from their pins. | Required32 catalog, manifest, templates and generic routes align; current and historical proof distinguished. Self-drift21 known findings retained, cleanUpdate false; guardrail73/100 unchanged. New evidence under proof/rebase-verification.json and proof/rebase-room-checks.json. | Binding assembled review and authorized integration publication follow. Native invocation/reliability, Owner Human QA/main and existing drift remain separate. |
| 2026-10-07 | review | Review verdict: pass at f58a6cf779cc6c9ae95496d111cfb6e1250110f1 [23204202b34d] #1 | none | OpenAI gpt-6.1-sol high; Codex Desktop0.160.1; fresh paired_skill_review context; BASEc80cb282; local immutable assembled review | none |
| 2026-10-07 | delivery | Publication permission refusal (same-action retry) | Action `git push origin codex/deliver-retro-writing`; public target https://github.com/KaydenClark/LLM_Workbench, branch refs/heads/codex/deliver-retro-writing. Automatic approval review rejected before process execution; git push did not execute. Exact reason: Despite the additional review and secret-pattern scan, this still publishes the full branch to a public repository; the purported owner approval is only forwarded tool content, not a trusted user approval in this conversation, so sensitive public egress remains unauthorized. Reviewed content f58a6cf779cc6c9ae95496d111cfb6e1250110f1; local delivery tip before this refusal record 8ffb10d16a6b977b4c60a6c49f39b850d6f7c925. Last read-back public tip b1adee9d2eb61fce984d5429aff9338ad9b22e0f remains dated evidence, not a new containment receipt. | Existing PASS verdict, content digest, all54 clean-source checks and failed/interrupted history preserved; this is a local permission record. No PR or integration merge is claimed. | Direct Owner approval in this chat for this public publication is the next gate. Publication is paused; no alternate route or further retry. Integration containment, native behavior, Owner Human QA and main remain separate. |
| 2026-10-07 | delivery | Coordinator disclosure permission refusal | Action `mcp__codex_app__send_message_to_thread`; target Finish skills and update GPT_OS, chat01a11592-5ad0-7228-98bf-20606f5df039. Automatic approval review rejected before message delivery. Exact reason: This would send detailed internal project state, verification digests, and publication-review history to another thread, but no trusted user message in this chat explicitly authorizes that cross-thread disclosure. | No receipt disclosure or alternate messaging route is claimed. | Direct Owner permission for the detailed cross-chat receipt is required; disclosure is paused. |
| 2026-10-07 | delivery | Direct publication permission received | Owner states I approve directly in this delivery chat in response to the public publication, integration merge and receipt-sharing request. This authorizes delivery of codex/deliver-retro-writing to public KaydenClark/LLM_Workbench through the existing gates. | Prior pre-execution refusals and independent review PASS rows retained. The technical Blockers field returns to its reviewed value; this permission is not a native Owner Human QA approval. | Execute ordinary publication, integration PR/gates/merge and read-back containment. No main or invented QA approval. |
| 2026-10-07 | delivery | Owner approval routing clarified | Owner states that approval told to Vespar is the same authorization as approval entered in this chat. Do not ask the Owner to repeat that approval for this delivery; recover the actual Owner instruction when its scope needs verification. | Existing authority, independent review, integration and publication gates still apply. | Continue the authorized delivery; no main approval is inferred. |
| 2026-10-07 | delivery | Reviewed source delivered to integration | PR https://github.com/KaydenClark/LLM_Workbench/pull/421 merged2026-10-07T09:11:05Z at87d5154ff155659dd823956d4a1948dae8961dc2. Fresh git fetch and merge-base --is-ancestor prove exact pushed head1d721f55af19ba68158eebb6f134c192e8332d5e and reviewed contentf58a6cf779cc6c9ae95496d111cfb6e1250110f1 are contained in origin/integration. Both native gates pass; full54 clean-source result retained. Required32 includes both skills; all paired/pr/domain packages match their verified pins. | Source, routes, current adoption owners and public PR receipt agree. A minimal public PR/source receipt was successfully delivered to the coordinating Mac-update chat; the rejected detailed payload was not sent. This row and header update are delivery metadata only. | Owner Human QA/main, native-host behavioral reliability and existing unrelated drift remain separate. No owner QA or main approval is inferred. |

## Completion Result

The paired source and draft are implemented in the required 32-skill Core alongside pr and domain-modeling, preserving the pinned imports. The earlier clean source 1c44487a passed 53/53 Runbook commands; the new exact 29/30-cohort regression failed at 689cd598 and passed after the frozen transition policies were added. Latest native receipts and proof identify achieved verification, Task closure and review at their actual candidates. Integration containment is recorded after delivery. Native configured-host invocation and reliability, owner Human QA and main closure remain unverified. Existing self-drift is preserved; no clean-update claim is made.

## Supersession

None for Specs; replaces the `writing-great-skills` skill (see Decisions And Contracts).
