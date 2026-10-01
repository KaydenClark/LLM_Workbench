# S-01S - reconciler skill rebuild

**Spec ID:** S-01S
**Status:** active
**Priority:** 2
**Owner:** codex-s01s-tk01j
**Stance:** Builder
**Updated:** 2026-10-01
**Catalog description:** Leave achieved work and its existing truth owners consistent for continuation.
**Blockers:** none for assigned implementation; separate immutable review and raw scenario verification remain delivery gates.
**Latest event:** Same TK-01J replacement-object correction passed all 51 required commands and focused 9/9 checks at 6c85b1aa480f1c356aa82884a8bf7d423fc15047; prior independent FAIL remains preserved.
**Next gate:** Verify the routed current-base assembly, then obtain fresh independent review of the immutable candidate. Original raw scenario verification remains open.

> **Citation anchors.** pre=`d90785908b26517068a474bb88136c81995a2f18` post=`5433310e`.

## Outcome

Leave achieved work and its existing truth owners consistent for continuation. This Spec owns the reconciler skill's source review, supported repair or update, focused behavioral verification and its individual Wiki article. A source change is required only when the review finds an actual gap against accepted behavior.

## Why It Matters

The prior Skills Wiki packet grouped the whole core inventory into one completion gate. A skill-sized owner lets reconciler reach a checkable destination without waiting for unrelated skill rebuilds. The article explains the result to readers; it does not instruct the agent or replace the executable source.

## Current Verified State

- Achieved corrective source is `5433310e`; read its Reconciler source and linked
  reference. Every documented Git evidence command uses the subshell helper
  with replacement objects disabled and inherited Git selectors cleared.
- Existing TK-01J remains in-progress. The prior immutable draft `e0a75d8b`
  has an independent early review FAIL P2, relayed by the parent from reviewer
  01a0f689: replaced objects can substitute completion/approval text while the
  original candidate SHA is reported. No passed review is claimed.
- Four new executable regressions failed at `d180ab8c`; all nine focused checks
  pass after `5433310e`, including fabricated ancestry and inherited repository,
  index, object-store and configuration selection. Current-base full proof passed all51 at6c85b1aa; earlier suite success did not cover this defect.
- The correction branch contains integration `25d3f4d2` via merge `247639ea`.
  Shared upstream changes were adopted unchanged, not edited in this lane.
- The article remains Spec-linked and is now reachable through the sole MEMORY index, applied by the coordinator. The earlier fresh-reader observation is locally reported;
  its raw evidence has not been independently verified. This correction makes
  no new fresh-context or behavioral-reliability claim.

## Desired Behavior

1. The assigned Reconciler stance aligns source, Spec state, projections, docs and next gate with what actually happened.
2. It does not manufacture completion, discard unresolved material or create a universal handoff.
3. The skill's declared source, catalog/discovery route, tests, and one routed Wiki article agree on verified current behavior, intended limits and source revision. The article gives purpose, when to use it, a concrete example, inputs/outputs, completion signs, composition, limits and governing links.

## Decisions And Contracts

- This Spec owns reconciler alone. Shared controls, manifest, catalog and the sole Wiki router are edited only as required by this skill's proven change; neighboring skill specs retain their own source and article ownership.
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

Active state and proof: [TK-01J](tasks/TK-01J/TASK.md).

### TK-01J - Deliver the reconciler skill destination

**Stance:** Builder

Inspect the current source, its callers/composition and relevant tests. Demonstrate the first meaningful gap at a stable seam or record that no source defect was found. Repair only the supported gap, exercise the scenario below, reconcile this skill's Wiki article and router, then record exact evidence and limits. Keep this task one skill wide.

## Acceptance Criteria

- [x] The assigned Reconciler stance aligns source, Spec state, projections, docs and next gate with what actually happened.
- [x] It does not manufacture completion, discard unresolved material or create a universal handoff.
- [ ] The named scenario is observed in a fresh or otherwise independent context: A cold reader can follow the existing owners to the exact achieved output and next action.
- [ ] `workbench/wiki/skill-reconciler.md` accurately distinguishes verified current behavior from remaining intended behavior, links the current source and governing owners, and is reachable from `workbench/wiki/MEMORY.md`.
- [ ] Relevant targeted tests/scenarios, Wiki validation, the required full suite, Workbench self-drift pre/post receipts and separate-context review are recorded at their proper gates; no unrun check is reported as passing.

## Testing Seams

Use the skill's public entry and its nearest source/test seam for the scenario: A cold reader can follow the existing owners to the exact achieved output and next action. Structural catalog and Wiki checks prove routing, not agent behavior. If the skill changes behavior, show red then green at the closest meaningful seam. A human review may still be needed for conversational fidelity.

## Verification Procedure

Run targeted tests for the changed source and `node workbench/tools/wiki.mjs validate`, then the current full suite in AGENTS.md. Run `node workbench/tools/spec-workbench.mjs render` and `doctor`; capture the self-drift pre/post receipts and a bounded semantic check. Review the immutable candidate separately before integration. Record actual commands and results in this Spec.

## Documentation Impact

Maintain `workbench/wiki/skill-reconciler.md` and its sole router entry alongside the skill change. Update shared controls or generic template wording only where this skill changes their meaning; record `Docs checked; no update needed` with a reason when they do not change.

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

## Implementation review

The baseline entry says to compare actual output, verification and owners but offers
no executable pinned observation or explicit Task-receipt, candidate-drift and
inability treatment. TK-01J addresses those continuation gaps without adding a
runtime or lifecycle policy. See [source reference](../../skills/reconciler/references/reconcile.md)
and the [individual article](../../wiki/skill-reconciler.md). The article was drafted
and compared with the named nearest neighbor, `to-docs`: both route each claim
once, while Reconciler owns achieved-state consistency and cold read-back. The
assigned Spec declares no Matt counterpart, so no upstream import is warranted.
Existing TK-01J remains the sole slice; no global identity was allocated.

[Original verification receipt](proof/verification.json) records the prior exact 51-command
union, focused red/green, failed attempts, one fresh reader and its limits.
[Pre self-drift](proof/self-drift-pre.json) and
[post self-drift](proof/self-drift-post.json) retain the same seven findings
and `cleanUpdate: false`. This is not a clean whole-Workbench update. The
[replacement correction receipt](proof/replacement-correction.json) preserves
the independent FAIL, executable red/green and current-base revalidation.
The original scenario checkbox remains open pending independent verification
of its raw evidence; the historical local observation is preserved.

Docs checked; no update needed in controls, templates, manifest or skill catalog:
the stance purpose, public authority and lifecycle contract are unchanged. The
canonical skill source supplies the installed bundle; there is no duplicate
template skill to edit. The coordinator applied the sole MEMORY route in this isolated assembly.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-24 | planning | Owner directed one delivery Spec per skill; this Spec names reconciler's destination and first slice | Current manifest, core catalog, source presence and Wiki route inspected at pre anchor; no behavior change or scenario trial | This Spec authored; article remains future work | TK-01J and independent delivery proof remain open |
| 2026-09-24 | planning verification | Skill-sized ownership and routing checked on the isolated candidate | All 47 required AGENTS commands passed; Wiki validation and exact 21 core plus one proposed entry coverage passed; doctor has no blocking finding; pre/post self-drift at 4940233 retained the same seven pre-existing findings and cleanUpdate false | No skill source or new article authored in this planning pass | Immutable separate-context review and actual skill behavior remain open |

| 2026-10-01 | TK-01J | Rebuild source and command regression | Red commit 3c243888: 5 failures because entry lacks linked pinned observations; green ef80692c: 5/5 focused checks and 3/3 delivery checks. Catalog found missing explicit ADR path; source corrected at 1e403cbb and catalog plus focused checks passed. These execute Git observations, not model judgment | Reconciler source/reference updated; individual article drafted; controls/templates/catalog unchanged because public contract and purpose are unchanged | Full suite and durable fresh-reader proof still pending; coordinator MEMORY route and independent review open |
| 2026-10-01 | TK-01J | First fresh-context continuation observation | Separate read-only context followed ordinary routes and identified ef80692c, in-progress state and next action. It found dirty owner updates, an untracked article, no Task receipt and no MEMORY link; no tests or remote proof inferred. Native CLI launch separately failed before model initialization with read-only app-server state | Add Task receipt and commit the updated owners/article; reserve MEMORY to coordinator | One observation only; not independent candidate review, owner QA, repeated trials or reliability proof |

| 2026-10-01 | TK-01J | Exact required union and history/drift verification | All 51 distinct current AGENTS/RUNBOOK commands passed at 652bff5200197a1ea9385e1c5fdc0c3ab0d4c196; focused 5/5, delivery 3/3 and Wiki validation pass. Installer has two case-insensitive-platform skips. Full first-published append-only history check CLEAN. Pre/post self-drift retain seven findings and cleanUpdate false; guardrail remains 78/100. See proof/verification.json for commands, failures, reruns and limits | Source/reference, article, Spec, native Task receipt and generated projections reconciled; shared MEMORY untouched | Coordinator route, independent candidate review, owner QA and main promotion remain outside this achieved draft; GitHub API Forbidden requires parent publication if direct PR creation is unavailable |

| 2026-10-01 | TK-01J | Integration advancement observed before handback | Refreshed origin/integration is 25d3f4d2, ahead of branch base d9078590 through PR 240. Re-extracted current AGENTS/RUNBOOK union remains exactly the same 51 commands. No overlapping reconciler source, article or assigned Spec/Task changes; shared projections need regeneration when assembled | Preserve this immutable draft and proof against its named base | No current-base assembly or review is claimed; coordinator owns MEMORY and regenerated projections before independent assembled review |

| 2026-10-01 | TK-01J | Independent early review FAIL P2 and executable correction | Parent relayed reviewer 01a0f689 FAIL of exact e0a75d8b: Git replacements substitute completion/approval text while the original SHA is printed. Reproduced at d180ab8c: five prior tests pass, four new tests fail. At 5433310e all nine pass; plain Git fixture controls demonstrate substituted owner text and fabricated ancestry before protected reads reject them | Governed disposition test in this owning Spec; documented helper disables replacements for every observation and isolates inherited Git selection. Existing evidence rows and Task receipts retained; no new Task or identity | Full current-base union and fresh independent review pending; original fresh-context raw evidence not independently verified; coordinator MEMORY route open |

| 2026-10-01 | TK-01J | Current-base corrective full verification | Exact current AGENTS/RUNBOOK union 51/51 exit 0 at 6c85b1aa480f1c356aa82884a8bf7d423fc15047 on integration base 25d3f4d2. Focused 9/9, delivery 3/3, GitHub coordination 10/10, collision 34/34 and Wiki validation pass. Append-only history CLEAN. Pre/post seven findings unchanged and cleanUpdate false; guardrail78/100 unchanged. See proof/replacement-correction.json | Same Task, source/helper, article, proof and native receipts; original failed candidate and evidence retained. No authored shared runtime/control/manifest/identity/carry/MEMORY changes | Fresh exact-candidate review, coordinator MEMORY route, independent raw scenario verification and owner QA remain open; no approval or integration/main promotion |

## Completion Result

Corrective source at `5433310e` addresses the independent early review FAIL P2
of `e0a75d8b` under the existing in-progress TK-01J. Four new regressions first
failed and all nine focused checks now pass. The branch contains current
integration `25d3f4d2`; all 51 current required commands passed at
`6c85b1aa480f1c356aa82884a8bf7d423fc15047`, with focused 9/9, delivery 3/3,
GitHub coordination 10/10 and collision 34/34 checks passing. The earlier
51-command proof remains historical and did not cover replacement objects.
The sole MEMORY route is now applied. No review PASS, completion, owner QA or merge is claimed. Independent assembled review and verification of the original raw scenario remain open.

## Supersession

- Supersedes: the reconciler article assignment in the unmerged oversized Skills Wiki packet, not its historical evidence.
- Superseded by: none.
