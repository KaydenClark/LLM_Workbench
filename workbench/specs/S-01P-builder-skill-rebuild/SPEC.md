# S-01P - builder skill rebuild

**Spec ID:** S-01P
**Status:** active
**Priority:** 2
**Owner:** codex-s01p-builder
**Stance:** Builder
**Updated:** 2026-10-01
**Catalog description:** Deliver the assigned result with useful verification and truthful documentation.
**Blockers:** none for assigned evidence update; independent evidence assessment and separate exact-candidate review remain delivery gates.
**Latest event:** Sole Wiki index now routes the Builder article; historical observations/source remain unchanged. Current integration assembly and separate exact review remain pending.
**Next gate:** Test the current integration assembly and obtain separate exact-candidate review of the evidence/routed-article update; behavioral raw-evidence assessment remains held. Do not close or merge yet.

> **Citation anchors.** pre=`4940233e74a93a8390f73f8ac6ba39ef53131798` post=`82cd8d1fbc79cb871429439a059be792bc59c137`.

## Outcome

Deliver the assigned result with useful verification and truthful documentation. This Spec owns the builder skill's source review, supported repair or update, focused behavioral verification and its individual Wiki article. A source change is required only when the review finds an actual gap against accepted behavior.

## Why It Matters

The prior Skills Wiki packet grouped the whole core inventory into one completion gate. A skill-sized owner lets builder reach a checkable destination without waiting for unrelated skill rebuilds. The article explains the result to readers; it does not instruct the agent or replace the executable source.

## Current Verified State

- At the original pre anchor, Builder was the manifest-declared source and its individual article was not authored. The source and article are present at `git show 74dd407aef68d63c597637dab9b7cfe9706f7243:workbench/skills/builder/SKILL.md` and `git show 74dd407aef68d63c597637dab9b7cfe9706f7243:workbench/wiki/skill-builder.md`; the sole MEMORY index now routes the article, applied by the coordinator at 3b0451ce2330325da9390663f1614b2b27285828.
- The stance remains set by the assigned Spec and Task. Source SHA-256 `03af6e33fcc07a38152ecc66f94e4f12b506ca0c23120dd3c3353f2b954170fc` matches the source named in the coordinator's two Servitor trial reports.
- The new reports are attributed producer observations, not raw behavioral evidence independently inspected by this author. The evidence log and `proof/producer-observations.md` state their limits; acceptance remains unchecked.

## Desired Behavior

1. The assigned Builder stance plans the narrow change, performs relevant proof and updates the owning records.
2. Loading a stance never grants authority, chooses a new assignment or spawns an agent.
3. The skill's declared source, catalog/discovery route, tests, and one routed Wiki article agree on verified current behavior, intended limits and source revision. The article gives purpose, when to use it, a concrete example, inputs/outputs, completion signs, composition, limits and governing links.

## Decisions And Contracts

- This Spec owns builder alone. Shared controls, manifest, catalog and the sole Wiki router are edited only as required by this skill's proven change; neighboring skill specs retain their own source and article ownership.
- A Wiki article is curated context, not instruction authority or proof of behavior. Current source and tests establish Actuality; accepted controls and this assigned Spec establish the target.
- The oversized unmerged Skills Wiki packet is planning evidence, not a live S-00V owner. S-00V now names Portable Workbench. For the shared grilling/notepad/grill-me journey, S-00W remains the design source while the individual skill Specs own delivery.

## Non-Goals

- Rebuilding another skill, changing an unrelated room or publishing to a personal catalog.
- Treating a source review, string assertion, article or green suite as owner Human QA.
- Introducing a new skill taxonomy, Wiki collection, parallel router or global installation.

## Dependencies And Blockers

No other skill rebuild is a blanket prerequisite. Check current controls and the relevant source owner before changing shared wording. A newly observed architecture, safety or public-contract choice remains an owner gate in this Spec; do not invent its answer.

## Vertical Implementation Slices

| Task | Slice | Status | Blockers | Proof |
|---|---|---|---|---|

### TK-01G - Deliver the builder skill destination

**Stance:** Builder

Inspect the current source, its callers/composition and relevant tests. Demonstrate the first meaningful gap at a stable seam or record that no source defect was found. Repair only the supported gap, exercise the scenario below, reconcile this skill's Wiki article and router, then record exact evidence and limits. Keep this task one skill wide.

## Acceptance Criteria

- [ ] The assigned Builder stance plans the narrow change, performs relevant proof and updates the owning records.
- [ ] Loading a stance never grants authority, chooses a new assignment or spawns an agent.
- [ ] The named scenario is observed in a fresh or otherwise independent context: A Task finishes with actual result, evidence, docs state and remaining risk.
- [ ] `workbench/wiki/skill-builder.md` accurately distinguishes verified current behavior from remaining intended behavior, links the current source and governing owners, and is reachable from `workbench/wiki/MEMORY.md`.
- [ ] Relevant targeted tests/scenarios, Wiki validation, the required full suite, Workbench self-drift pre/post receipts and separate-context review are recorded at their proper gates; no unrun check is reported as passing.

## Testing Seams

Use the skill's public entry and its nearest source/test seam for the scenario: A Task finishes with actual result, evidence, docs state and remaining risk. Structural catalog and Wiki checks prove routing, not agent behavior. If the skill changes behavior, show red then green at the closest meaningful seam. A human review may still be needed for conversational fidelity.

## Verification Procedure

Run targeted tests for the changed source and `node workbench/tools/wiki.mjs validate`, then the current full suite in AGENTS.md. Run `node workbench/tools/spec-workbench.mjs render` and `doctor`; capture the self-drift pre/post receipts and a bounded semantic check. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

Maintain `workbench/wiki/skill-builder.md` and its sole router entry alongside the skill change. Update shared controls or generic template wording only where this skill changes their meaning; record `Docs checked; no update needed` with a reason when they do not change.

## Draft-wiki alignment (owner direction 2026-09-30)

Group: stances. Matt counterpart: none. Enabling Spec: S-002L.
Intended slice direction: the six per-skill steps of the draft skills wiki
(1 investigate ours, 2 draft the article, 3 investigate Matt's skill at
`mattpocock/skills@d81f3a183412e71a5b1e84ca21bc1a35eea03a60`, 4 compare,
5 align the article, 6 fix or create the skill), to be cut into Tasks by
`/to-tasks` (at activation for a planned Spec; as additional Tasks when the
Dispatcher takes up an already-active one). Tasks already cut stay as they
are. This section changes none of this Spec's acceptance, evidence or status;
steps 1-5 touch only the draft wiki and step 6 only this skill's lane. When there is no Matt counterpart, steps 3 and 4 compare with the named nearest neighbor skill instead.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-24 | planning | Owner directed one delivery Spec per skill; this Spec names builder's destination and first slice | Current manifest, core catalog, source presence and Wiki route inspected at pre anchor; no behavior change or scenario trial | This Spec authored; article remains future work | TK-01G and independent delivery proof remain open |
| 2026-09-24 | planning verification | Skill-sized ownership and routing checked on the isolated candidate | All 47 required AGENTS commands passed; Wiki validation and exact 21 core plus one proposed entry coverage passed; doctor has no blocking finding; pre/post self-drift at 4940233 retained the same seven pre-existing findings and cleanUpdate false | No skill source or new article authored in this planning pass | Immutable separate-context review and actual skill behavior remain open |

| 2026-10-01 | TK-01G activation | Native `convert-tasks S-01P --activate` preserved TK-01G; remote claim by codex-s01p-builder committed and pushed at `59c67a916f24f8cd41745c26edf50925fa879952` | Fetched all advertised remote heads from integration `e96766f0e7b73e7159d1a748dffefc79569d267d`; every reachable S-01P header was planned/unassigned; no owner collision; first two claim attempts correctly refused uncommitted native conversion/projection before committing them | Existing Task converted; generated Taskboard and catalog only; no global ID allocation | Assigned implementation only; no merge or main modification |
| 2026-10-01 | TK-01G source contract | Unbounded helper-composition wording and implicit completion report repaired at `82cd8d1f` | New `node tools/test-builder-skill.mjs` failed 2/3 at red commit `64c46d64`; 3/3 green after repair; `proof/contract-red.txt` and `proof/contract-green.txt` preserve outputs; these are source-text checks, not behavioral validation | Individual article and synthetic scenario authored; `proof/wiki-validation.txt` records successful Wiki validation | Fresh-context behavioral observation and independent review remain unperformed; coordinator serializes MEMORY route |

| 2026-10-01 | TK-01G verification | All required suite commands executed; source implementation candidate `82cd8d1f` | `proof/suite-results.json`: 48/48 exact AGENTS commands, 3/3 additional RUNBOOK commands and 1/1 focused test passed; Wiki validate, diff whitespace check, citation-anchor check and proposed MEMORY patch application check passed | Article is curated partial context; coordinator owns single router hunk in `proof/memory-route.patch`; `proof/pr-body.md` prepared after GitHub API Forbidden | Actual fresh-context Builder behavior and independent review not run; TK-01G remains in progress; no review or Human QA PASS |
| 2026-10-01 | TK-01G drift | Guardrail score unchanged at 78/100; no clean-update claim | `proof/verification-notes.md` distinguishes flawed initial in-tree receipt captures from reconstructed clean-base receipt and corrected outside-tree post capture; seven baseline findings remain outside this Task | Docs checked; no update needed for shared controls, runtime, identity or generic templates because their contracts are unchanged | Repeated outcome trials, coordinator route and independent candidate review remain; no private scenario material transferred |

| 2026-10-01 | TK-01G producer observations | Parent and release coordinator relayed two fresh Servitor trials from separate observer `01a0f166`, using source `74dd407aef68d63c597637dab9b7cfe9706f7243`; limited attributed update authorized | `proof/producer-observations.md`: producer reports genuine red to 2/2 green at local candidate `504dfa1023a241be42dcf213f97bef800561c7f0`, and red to 13/13 behavior green with required module still failing `ERR_MODULE_NOT_FOUND` exit 1 at `0d232bc95b89df9e9ebb988c4d1b302144c5247a`; this context checked only the matching Builder hash, not raw traces or fixture commits | Both reportedly maintained scoped records, in-progress receipts and truthful exact handbacks; no spawn or push events observed; seven setup/launch failures retained; untracked collector artifact prevents any clean-final-tree claim | Raw evidence remains producer-local; no independent author inspection, reliability, installed discovery, acceptance, closure or Human QA claim; prior source-only review PASS is parent-reported and does not review this update |
| 2026-10-01 | TK-01G current-base assembly | Preserved original branch and candidate; assembled on integration `d90785908b26517068a474bb88136c81995a2f18` in separate branch `codex/s01p-tk01g-current-base` at `9b132fed1d138cce3308cdda1cec5d159857ec7f` | Merge applied cleanly; Builder source unchanged and matching reported hash; shared runtime changes are inherited from integration, not authored in this Task | Historical proof retained; coordinator's single MEMORY hunk remains unapplied here | Refreshed full checks and separate review of the updated immutable candidate remain required; no merge into integration or main |

| 2026-10-01 | TK-01G current-base verification | Refreshed source-proof checks on evidence candidate `00c1cff52784a28305a8bacd4fc9c3f078e68236`, assembled from integration `d90785908b26517068a474bb88136c81995a2f18` | `proof/suite-currentbase-results.json`: all 48 exact AGENTS commands, three additional RUNBOOK commands and the focused Builder contract test passed; Wiki validation, citation-anchor check, whitespace check and MEMORY patch application check passed; six prior evidence rows and unchanged Builder hash checked locally | Coordinator confirms later serialized MEMORY assembly; `proof/pr-body.md` updated for the preserved-original/current-base branches; no acceptance checkboxes changed | Separate exact-candidate review remains pending; reported trials are not author-inspected raw evidence; no closure, native verdict, Human QA, integration or main claim |

## Completion Result

Implementation candidate only. The Builder source now bounds composed helpers to the assigned Task and caller endpoint and names result, evidence, documentation state and remaining risk at exit. TK-01G remains in progress. Two fresh trials are now coordinator-reported from a separate Servitor observer, with explicit raw-evidence and fixture limitations. The parent reports prior source-only review PASS; this evidence/current-base candidate still needs separate exact review. The individual article is reachable from the sole MEMORY index. No acceptance checkoff, independent author verification of the trials, integration or release is claimed.

## Supersession

- Supersedes: the builder article assignment in the unmerged oversized Skills Wiki packet, not its historical evidence.
- Superseded by: none.
