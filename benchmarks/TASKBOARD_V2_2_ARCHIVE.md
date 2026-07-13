# LLM Workbench - Taskboard v2.2 Cold Archive

> Frozen 2026-07-12 during S-001. This preserves the former queue, Done lane,
> decisions, and proof log verbatim below. It is evidence, not current state.

**Current focus:** Improve measured agent outcomes, not merely static completeness or regression health.
**Owner:** Kayden (executive); agents execute
**Last updated:** 2026-07-10

This is the live work queue and proof ledger for the workbench repo itself.
Strategy and direction live in `BLUEPRINT.md`; commands live in `RUNBOOK.md`.

## Executive Brief

Five lines for the owner who never reads code. Refreshed each work session.

- **Shipping now:** T-016 shipped the 100-point guardrail audit and raised the honest score from 55 to 70 without manufacturing outcome evidence.
- **Health:** all four self-tests pass; static contract and drift controls are full-score, but real outcome evidence remains 0/30.
- **Decision needed:** none open. Kayden directed agents to preserve the harness review and keep controls slim/readable without optimizing for a hard token target.
- **Blocked on:** one owner action - merge `integration` -> `main` to land all consolidated work. Agents no longer merge to `main`; that step is owner-only by rule (T-013).
- **Next milestone:** T-017 adds a second-domain held-out task, then T-010 runs real repeated comparisons when API spend is approved.

## Pending Decisions

Decisions only the owner should make. Agents surface tradeoffs here as product
choices - options, a recommendation, and the cost of choosing - and do not decide
them alone. Keep code-level detail out of this queue.

| ID | Decision | Options | Recommendation | Cost / impact | Owner | Status |
|---|---|---|---|---|---|---|
| D-001 | What to do with the older `codex/structured-metadata-guardrails` harness dialect (YAML frontmatter on the retired ROADMAP layout) | (A) rebase its ideas onto the current templates; (B) extract the useful ideas and close the branch | (B) extract and close - the layout it targets is gone, so carrying it forward is ongoing drift risk for little gain | (A) costs rework to port a dead layout; (B) loses the branch's standalone history | Kayden | resolved 2026-07-01: chose (B); PR #4 closed, scope-key idea folded into T-007 |
| D-002 | T-005/T-007/T-008/T-009/T-012 exist as a stacked PR chain (#11-#15) that GitHub shows closed-without-merge (except #15, still open) even though each branch's own commits mark its task `done`. None of the five have actually reached `main`. An independent audit (2026-07-02) confirmed all five merge cleanly into current `main` with zero conflicts and all three `tools/test-*.mjs` self-tests plus the evaluator still pass on the merged result (root 113/113, `templates/` 105/113) | (A) re-open and merge PRs #11-#15 in stack order on GitHub; (B) close the stale PRs and cherry-pick/re-open fresh single-base PRs against current `main`; (C) leave as-is | (B) - the stack's original base commits are now several commits behind `main`, so fresh PRs against current `main` are cleaner than resurrecting a stale stack, and preserve the "owner merges, no agent self-merge" rule | (A) is fastest if GitHub allows re-opening a closed-not-merged PR against its stale base; (B) costs one round of PR recreation but leaves cleaner history; (C) means `templates/` stays stuck at 98/113 and T-005-T-012 stay unclaimed forever | Kayden | resolved 2026-07-03: superseded by the `integration` bridge (T-013). All five branches consolidated onto `integration` via a single clean merge on top of current `main` (only overlap `TASKBOARD.md`, auto-merged; all self-tests pass). Now one owner merge `integration` -> `main` lands them all. |

## How To Use This Board

1. Read `BLUEPRINT.md` for context.
2. Pick the highest-priority `ready` task that is in scope and unclaimed.
3. Move it to `claimed` or `in-progress` before editing.
4. Do the smallest correct change.
5. Run the task's required proof and the relevant `RUNBOOK.md` checks.
6. Move the task to `done`, `blocked`, `deferred`, or `needs-review`.
7. Append one proof row with the actual result.

Do not rewrite existing proof rows. Append only.

## Status Values

| Status | Meaning |
|---|---|
| `ready` | Clear enough for the next agent to start. |
| `claimed` | An agent has picked it but has not edited yet. |
| `in-progress` | Work is underway. |
| `gated` | Implementation is done and waiting on verification, review, or merge. |
| `needs-review` | Needs human or manager review before more work. |
| `blocked` | Cannot proceed until the blocker is resolved. |
| `deferred` | Valid work, intentionally not next. |
| `done` | Proof exists and docs impact is resolved. |

## Ready

| ID | Priority | Task | Source / why now | Touches | Proof required | Docs impact | Owner | Status | Last update |
|---|---:|---|---|---|---|---|---|---|---|
| T-017 | 0 | Add a deterministic held-out eval task in a second domain | Guardrail audit is 0/30 on outcome evidence and explicitly reserves 8 points for task diversity without overfitting | `evals/tasks/`, grader self-tests, eval docs | New held-out fixture and condition-blind grader discriminate correct, dishonest, and incomplete outcomes; guardrail audit rises only if the task is genuinely `heldout` | evals README, RUNBOOK/TASKBOARD proof as needed | agent | ready | 2026-07-10 |
| T-011 | 1 | Harvest downstream `HARNESS_FEEDBACK.md` rows and validate selected changes through `evals/` | The deferred trigger has fired: the July 8 review identified four `new` feedback rows, including the Mac sandbox handoff gap | Downstream feedback evidence, `templates/`, `evals/` | Each row triaged to ship/defer/reject with evidence; selected changes pass evals/self-tests | README/RUNBOOK/templates as required | agent | ready | 2026-07-10 |
| T-015 | 4 | Add practical control-surface readability and contradiction guardrails | GPT_OS should stay slim/readable, but Kayden does not need a hard token target | evaluator/self-tests plus template proof-log policy | Deterministic stale-status/contradiction checks and a maintainable size/readability warning; no fuzzy enforcement that penalizes required safety rules | Evaluator, templates, root dogfood docs if adopted | agent | ready | 2026-07-10 |

## In Progress

| ID | Priority | Task | Owner | Started | Touches | Current note | Proof required | Status |
|---|---:|---|---|---|---|---|---|---|
| T-001 | 0 | Repo-home migration + dogfooding: merge Workbench_v2, make the local folder the repo home, split blank templates into `templates/`, write real root control docs | claude | 2026-07-01 | root docs, `templates/` | implementation done; gated on owner merging PR #5 (v2) then the dogfood PR | `node tools/test-*.mjs` all pass; evaluator scores root and `templates/` | gated |
| T-002 | 1 | Write `templates/GENESIS.md`: phased one-prompt bootstrap protocol (prompt -> BLUEPRINT -> architecture -> scaffold -> AGENTS scopes -> RUNBOOK -> seeded TASKBOARD), incl. decide-alone vs. ask boundaries and finished-bootstrap acceptance | claude | 2026-07-01 | `templates/`, README, BLUEPRINT | impl + proof done; pushed to `claude/genesis-bootstrap` and PR #7 opened via GitHub API (base `claude/dogfood-taskboard`); owner merges | `node tools/test-evaluate-workbench.mjs`; dry-run bootstrap of a toy project | gated |
| T-003 | 2 | Executive interface: add standing five-line executive brief + pending-decision queue (options, recommendation, cost) to the taskboard template, and an escalation-language contract (product tradeoffs, never code-level failures) to the agents template | claude | 2026-07-01 | `templates/`, root docs, evaluator | impl + proof done; pushed to `claude/executive-interface` and PR #8 opened via GitHub API (base `claude/genesis-bootstrap`); owner merges | evaluator rubric updated + self-tests pass | gated |
| T-004 | 3 | Product-truth acceptance: require a <1-minute demo artifact (screenshot, recording, preview URL, or one-command demo) as a proof-log column for milestone tasks | claude | 2026-07-01 | `templates/TASKBOARD.md`, `templates/AGENTS.md`, root docs, evaluator | impl + proof done; branched off `claude/executive-interface`, pushed to `claude/demo-artifact-acceptance`, PR opened into `main` via GitHub API; owner merges | self-tests pass | gated |

## Blocked

| ID | Task / area | Blocked on | Evidence | Next action | Owner | Status |
|---|---|---|---|---|---|---|
| - | none | | | | | |

## Deferred

| ID | Task | Deferred until | Why it matters | Revisit trigger |
|---|---|---|---|---|
| T-010 | Real (API-spending) eval comparison runs across template versions | T-017 lands and owner approves API spend | outcome evidence beats rubric evidence and controls the final 22 guardrail points | a held-out second task exists and the owner authorizes the sized run |

## Done

| ID | Task | Completed | Result | Proof row |
|---|---|---|---|---|
| T-016 | Add a 100-point guardrail drift audit and benchmark-driven harness goals | 2026-07-10 | Added the audit + self-test, made baseline/delta proof part of root and generic template rules, bumped the harness to v2.2, and moved the score 55 -> 70 while leaving all 30 real-outcome points unearned | 2026-07-10 / T-016 |
| T-014 | Preserve and harvest the July 8 Mac harness review | 2026-07-10 | Preserved the review unchanged; routed checkout/adoption findings to GPT_OS F-001/T-008, feedback and sandbox protocol findings to T-011, context/readability findings to T-015, and CI repetition to owning projects | 2026-07-10 / T-014 completion |
| T-013 | Branch/PR-flow rule: default PR target is `integration`, owner-only merge to `main` (+ create the `integration` bridge) | 2026-07-03 | Added the rule to root `RUNBOOK.md` (Version Control), `AGENTS.md` (When To Ask), and `CLAUDE.md`, plus the generic form in `templates/RUNBOOK.md`. Created + pushed `integration` (= `main` + consolidated D-002 work). Agents branch per task and PR into `integration`; only the owner merges `integration` -> `main`; agents may merge below the bridge when safe. | 2026-07-03 / T-013 |
| T-006 | Decide fate of `codex/structured-metadata-guardrails` (D-001) | 2026-07-01 | Chose extract + close. PR #4 targeted the retired root-ROADMAP layout; extracted its one portable idea (declarative scope keys) into T-007 and closed the branch. No template dialect resurrected. | 2026-07-01 / T-006 |
| T-009 | Add a blank `templates/README.md` product template | 2026-07-01 | Added a generic, `[BRACKETED]` product README pointing readers at the four control docs; updated root README copy instructions. Blank templates score 98 -> 105/113. | 2026-07-01 / T-009 |
| T-007 | Mechanical scope enforcement (`.claude/settings.json` template + GENESIS step) | 2026-07-01 | Added `templates/.claude/settings.json` (deny secrets/build output, allow writable roots, ask on review-required actions) + companion `.claude/README.md` mapping the extracted D-001 scope keys to permission buckets; wired generation into GENESIS Phase 4 + acceptance checklist. Root exempted from a live config (see BLUEPRINT decision). | 2026-07-01 / T-007 |
| T-005 | Lifecycle hardening (reclaim rule, proof-log archival, version stamps) | 2026-07-01 | Added a stale-claim reclaim rule (AGENTS Long Session Control + TASKBOARD status note), a proof-log archival policy to `TASKBOARD_ARCHIVE.md` past ~30 rows, and `Generated from LLM Workbench v[HARNESS_VERSION]` stamps on all six templates + an Upgrading The Harness RUNBOOK section. Declared harness v2.1 at root. | 2026-07-01 / T-005 |
| T-008 | Feedback loop (`HARNESS_FEEDBACK` convention + harvest task) | 2026-07-01 | Added `templates/HARNESS_FEEDBACK.md` return channel + wiring in templates AGENTS/RUNBOOK/README; documented the harvest+evals loop in root RUNBOOK/README; added standing harvest task T-011 (Deferred). Evals selftest passes. | 2026-07-01 / T-008 |
| T-012 | Add `templates/ADOPTION.md` migration protocol (existing-project sibling to GENESIS) | 2026-07-01 | Added the observe->map->verify migration protocol with old->new mapping (ROADMAP->BLUEPRINT+TASKBOARD, policy docs->AGENTS, design docs kept project-local), a proof checklist, and guardrails against bulldozing/history loss. Cross-linked from GENESIS + README + BLUEPRINT. Next: apply to an existing project. | 2026-07-01 / T-012 |

## Documentation Check

Documentation is part of done. Before marking a task complete, check:

| If the task changed... | Update or confirm |
|---|---|
| Purpose, product shape, architecture, invariants, decisions | `BLUEPRINT.md` |
| Task queue, blockers, deferred work, proof of completed work | `TASKBOARD.md` |
| Commands, verification, version-control conventions | `RUNBOOK.md` |
| Public-facing usage, template descriptions, copy instructions | `README.md` |
| Agent rules, scope, authority, verification policy | `AGENTS.md` |
| Harness design itself | the matching file in `templates/` |

If no docs need edits, record `Docs checked; no update needed` in the final
response and in the proof row's `Docs` field.

## Proof Log

Append a row when a task changes durable project state or produces durable
verification evidence. Use actual results, not stale claims. Milestone tasks
fill the Demo column with a <1-minute demo artifact (the Demo column was added
2026-07-01 by T-004; prior rows keep their original claims and gained a Demo
cell only, no claim was rewritten).

| Date | Task ID | Agent | Proof | Demo | Result | Docs | Remaining gap |
|---|---|---|---|---|---|---|---|
| 2026-07-10 | T-016 | Codex | Red: new audit self-test failed on missing module, then caught and drove a section-parser fix. Green: all four `tools/test-*.mjs` pass; root static score 113/113; templates 105/113. Guardrail audit moved from the untouched branch baseline 55/100 to 70/100. | `node tools/audit-guardrails.mjs --path .` -> four-layer score plus ranked improvements in under a second | pass | Updated root AGENTS/BLUEPRINT/RUNBOOK/README/TASKBOARD, generic template AGENTS/RUNBOOK, benchmark docs/results; harness v2.2 | Outcome evidence remains 0/30: add a held-out second-domain task (T-017), then run real repeated c0/c1/c2/c3 trials (T-010). |
| 2026-07-10 | T-014 completion | Codex | Preserved `HARNESS_REVIEW_MAC_2026-07-08.md` unchanged and mapped M1/M5/M7 to GPT_OS cleanup/rollout, M2/M6/M8 to T-011, M4 to T-015, and M3 to owning-project CI work. Workbench self-tests pass. | review file plus taskboard mapping | pass | Updated Workbench `TASKBOARD.md`; no template behavior changed | T-011 and T-015 remain non-blocking backlog; GPT_OS may begin OpenBrain. |
| 2026-07-10 | T-014 intake | Codex | Kept `HARNESS_REVIEW_MAC_2026-07-08.md` as required evidence, promoted the triggered harvest task, removed the duplicate Ready T-008 state, and queued practical readability guards. | n/a | pass | Updated Workbench `TASKBOARD.md` only | The review still needs to enter Workbench Git history during T-014; no template behavior changed in this intake. |
| 2026-07-01 | T-001 | claude (Fable 5) | `node tools/test-evaluate-workbench.mjs` + context/outcome self-tests + `node tools/evaluate-workbench.mjs --path templates --include-controls` | n/a (pre-Demo-column migration) | pass - all self-tests ok; root dogfood docs score 100/100; templates score 85 vs controls 0 and 2 (gap tracked as T-009) | root docs written; README updated; templates moved to `templates/` | PR #5 and dogfood PR need owner merge; T-006 branch decision open |
| 2026-07-01 | T-002 | claude (Opus 4.8) | `node tools/test-evaluate-workbench.mjs` (+ context/outcome self-tests) all ok; root score 100/100; templates score 85 (unchanged by GENESIS add). Toy dry-run bootstrap of a C<->F CLI: `node src/cli.mjs c 100` -> `212F`, `node --test` pass, four filled control docs scored 85/100 vs controls 0 and 2 | one-command: `node src/cli.mjs c 100` -> `212F` (toy bootstrap demo) | added `templates/GENESIS.md`; README + BLUEPRINT updated | dry-run did a targeted (not exhaustive) placeholder fill; optional BLUEPRINT/RUNBOOK sub-rows left bracketed per GENESIS Phase 7. Pushed to `claude/genesis-bootstrap` and PR opened via GitHub API (base `claude/dogfood-taskboard`); owner merges |
| 2026-07-01 | T-003 | claude (Opus 4.8) | red/green: added failing `executive_interface` self-test assertion (confirmed fail: criterion absent), then implemented rubric criterion + brief/decision-queue/escalation sections. `node tools/test-evaluate-workbench.mjs` (+ context/outcome self-tests) all ok; root score 108/108; templates 93/108 (up from 85, new criterion satisfied); controls 0 and 2 | one-command: `node tools/evaluate-workbench.mjs --path . --include-controls` -> root 108/108 | added Executive Brief + Pending Decisions to root & template TASKBOARD; escalation contract to template AGENTS (root already had it, tied to queue); README + BLUEPRINT updated; evaluator rubric + self-test updated | total rubric weight now 108 (was 100); pre-existing templates gaps remain (README/team-templates/portability, T-009). Pushed to `claude/executive-interface` and PR opened via GitHub API (base `claude/genesis-bootstrap`); owner merges |
| 2026-07-01 | T-004 | claude (Opus 4.8) | red/green: added failing `product_acceptance` self-test assertion (confirmed fail: criterion absent), then implemented rubric criterion + Demo column + milestone demo rule. `node tools/test-evaluate-workbench.mjs` (+ context/outcome self-tests) all ok; root score 113/113; templates 98/113; controls 0 and 2 | one-command: `node tools/evaluate-workbench.mjs --path . --include-controls` -> root 113/113 | added Demo column + milestone demo rule to root & template TASKBOARD/AGENTS; README + BLUEPRINT updated; evaluator rubric + self-test updated | rubric weight now 113; pre-existing templates gaps remain (T-009). Branched off `claude/executive-interface` (carries genesis+exec); PR opened into `main` via GitHub API; owner merges |
| 2026-07-01 | T-012 | claude (Opus 4.8) | Added `templates/ADOPTION.md` (sibling to GENESIS: inventory/classify existing harness -> map old->new -> derive scope+`.claude` -> verify on existing tests -> retire old docs to archive). Cross-linked from GENESIS ("green-field only"), templates/README, root README (Adopting Into An Existing Project), and BLUEPRINT (product shape + decision row). All three `tools/test-*.mjs` ok; root 113/113; templates 105/113 (protocol doc, not a rubric criterion). | n/a (not a milestone; template add) | templates ADOPTION/GENESIS/README; root README/BLUEPRINT/TASKBOARD | template only proves it reads correctly; real proof is applying it to an existing project (in progress next) |
| 2026-07-01 | T-008 | claude (Opus 4.8) | Added `templates/HARNESS_FEEDBACK.md` (append-only return channel) + references in templates AGENTS (Harness Feedback section), RUNBOOK (Harness Feedback Loop), and README; documented the harvest loop in root RUNBOOK + README; added standing harvest task T-011 to Deferred. Proof: `python3 evals/results/_make_selftest.py` + `python3 evals/score.py evals/results/_pipeline_selftest.jsonl --baseline c0_none` -> selftest passes (c2/c3 significant vs baseline). All three `tools/test-*.mjs` ok; root 113/113; templates 105/113. | n/a (not a milestone) | templates HARNESS_FEEDBACK/AGENTS/RUNBOOK/README; root RUNBOOK/README/BLUEPRINT/TASKBOARD | root has no `HARNESS_FEEDBACK.md` by design (it is the harvest destination) - documented in root RUNBOOK |
| 2026-07-01 | T-005 | claude (Opus 4.8) | Added stale-claim reclaim rule, proof-log archival policy (`TASKBOARD_ARCHIVE.md` past ~30 rows), and version stamps + Upgrading The Harness note across the templates; declared harness v2.1 in root BLUEPRINT and documented versioning in root README. All three self-tests ok; root 113/113; templates 105/113 (unchanged; conventions, not rubric criteria). | n/a (not a milestone) | templates AGENTS/TASKBOARD/RUNBOOK/BLUEPRINT/README/GENESIS stamped; root BLUEPRINT (v2.1 + decision row) + README (Versioning And Upgrades) | forward reference to `HARNESS_FEEDBACK` in the RUNBOOK upgrade note is satisfied by T-008 (next in the stack) |
| 2026-07-01 | T-007 | claude (Opus 4.8) | Added `templates/.claude/settings.json` + `templates/.claude/README.md`; wired into GENESIS Phase 4 and the bootstrap acceptance checklist. `node -e JSON.parse(...)` -> valid JSON. `node tools/test-evaluate-workbench.mjs` ok (root 113/113); `--path templates` -> 105/113 (unchanged; feature adds product value, not rubric points). Root `.claude/` intentionally not created (dogfood exemption recorded in BLUEPRINT; attempt was also blocked as unrequested self-modification). | n/a (not a milestone) | added `.claude/` template set; BLUEPRINT decision row; root README Core Files + How To Use It | **Proof gap:** could not validate live permission behavior in an interactive Claude Code session from here - verified JSON parses and matches the documented settings/permissions schema shape only. Owner should confirm the rules load in a real session. |
| 2026-07-01 | T-009 | claude (Opus 4.8) | Added `templates/README.md` (generic `[BRACKETED]` product README). `node tools/evaluate-workbench.mjs --path templates` -> 105/113 (was 98); closed the `user-facing readme` gap plus the three Tool portability items (plain markdown, multi-agent compatibility, Claude Code import note). `node tools/test-evaluate-workbench.mjs` still ok (root 113/113). | n/a (not a milestone; template add) | added `templates/README.md`; updated root README Core Files + How To Use It copy steps | remaining templates gap is Team coordination (8 pts), which lives in `team templates/`, outside T-005-T-009 scope |
| 2026-07-01 | T-006 | claude (Opus 4.8) | Reviewed PR #4 diff vs merge-base: 10 files against the retired root-ROADMAP layout (root `ROADMAP.md`, root docs as product). Prompt-injection boundary, CLAUDE bridge, and guardrails already exist in v2; only the machine-readable scope frontmatter (`writable_roots`/`forbidden_paths`/`requires_review_for`) was net-new and portable. Docs-only change; `node tools/test-evaluate-workbench.mjs` still ok (root 113/113). | n/a (not a milestone; decision/doc task) | resolved D-001 (extract + close); BLUEPRINT risk row marked resolved + decision row added; TASKBOARD brief/decision/Ready/Done updated; T-007 enriched to carry the extracted idea | branch not yet closed at write time - PR #4 close is an owner/gh action recorded here; scope-key idea now lives only in T-007's description until T-007 implements it |
| 2026-07-03 | T-013 | claude (Opus 4.8) | Verified device state: newest work sat on `claude/adoption-protocol-t012` (pushed, clean tree); `main` lacked its 5 task commits / 15 files. Built `integration` from `origin/main` + merged the device branch (only overlap `TASKBOARD.md`, auto-merged, no conflict). Added the branch/PR-flow rule to root `RUNBOOK.md`/`AGENTS.md`/`CLAUDE.md` + `templates/RUNBOOK.md`. `node tools/test-evaluate-workbench.mjs` + context + outcome self-tests all ok on the merged bridge; root 113/113. | one-command: `git log --oneline --graph main..integration` shows the bridge = `main` + T-005/T-007/T-008/T-009/T-012 + the rule | root RUNBOOK/AGENTS/CLAUDE + templates/RUNBOOK; TASKBOARD brief + D-002 resolved + Done T-013 | rule permits agent merges below `integration`; this PR left for owner review by default. `integration` -> `main` is owner-only and still pending. |
