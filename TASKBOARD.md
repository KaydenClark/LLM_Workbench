# LLM Workbench - Taskboard

**Current focus:** Close the gaps between the current harness and the founding intent: one-prompt bootstrap and a true executive interface.
**Owner:** Kayden (executive); agents execute
**Last updated:** 2026-07-01

This is the live work queue and proof ledger for the workbench repo itself.
Strategy and direction live in `BLUEPRINT.md`; commands live in `RUNBOOK.md`.

## Executive Brief

Five lines for the owner who never reads code. Refreshed each work session.

- **Shipping now:** T-005-T-009 complete - templates are copy-ready (product README, mechanical scope enforcement, lifecycle hardening, and the downstream feedback loop). PRs #10-#14 stacked and awaiting owner merge.
- **Health:** green - all self-tests + evals selftest pass; root dogfood docs score full rubric (113/113); blank templates score 105/113 (remaining 8-pt gap is the team-coordination templates, tracked separately, outside T-005-T-009).
- **Decision needed:** none open. D-001 resolved 2026-07-01 (extract + close PR #4).
- **Blocked on:** nothing; PRs #10 (T-006) -> #11 (T-009) -> #12 (T-007) -> #13 (T-005) -> #14 (T-008) await owner merge in stack order.
- **Next milestone:** hand the copy-ready templates to a real downstream project; then T-011 harvests its first `HARNESS_FEEDBACK`.

## Pending Decisions

Decisions only the owner should make. Agents surface tradeoffs here as product
choices - options, a recommendation, and the cost of choosing - and do not decide
them alone. Keep code-level detail out of this queue.

| ID | Decision | Options | Recommendation | Cost / impact | Owner | Status |
|---|---|---|---|---|---|---|
| D-001 | What to do with the older `codex/structured-metadata-guardrails` harness dialect (YAML frontmatter on the retired ROADMAP layout) | (A) rebase its ideas onto the current templates; (B) extract the useful ideas and close the branch | (B) extract and close - the layout it targets is gone, so carrying it forward is ongoing drift risk for little gain | (A) costs rework to port a dead layout; (B) loses the branch's standalone history | Kayden | resolved 2026-07-01: chose (B); PR #4 closed, scope-key idea folded into T-007 |

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
| T-008 | 7 | Feedback loop: `HARNESS_FEEDBACK` convention for downstream projects + a harvest task here; template changes validated via `evals/` before "better" claims | closes the "ruleset updates the ruleset" loop | `templates/`, `evals/` | evals selftest passes | README, RUNBOOK | agent | ready | 2026-07-01 |

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
| T-010 | Real (API-spending) eval comparison runs across template versions | GENESIS + executive interface land | outcome evidence beats rubric evidence | two or more template versions worth comparing |
| T-011 | Standing harvest: collect downstream `HARNESS_FEEDBACK.md` rows, triage each into a template change validated via `evals/` (`c3_candidate`) before shipping as a new harness version | a downstream project reports harness feedback | closes the "ruleset updates the ruleset" loop on evidence, not taste | first `HARNESS_FEEDBACK` row arrives from any project using the harness |

## Done

| ID | Task | Completed | Result | Proof row |
|---|---|---|---|---|
| T-006 | Decide fate of `codex/structured-metadata-guardrails` (D-001) | 2026-07-01 | Chose extract + close. PR #4 targeted the retired root-ROADMAP layout; extracted its one portable idea (declarative scope keys) into T-007 and closed the branch. No template dialect resurrected. | 2026-07-01 / T-006 |
| T-009 | Add a blank `templates/README.md` product template | 2026-07-01 | Added a generic, `[BRACKETED]` product README pointing readers at the four control docs; updated root README copy instructions. Blank templates score 98 -> 105/113. | 2026-07-01 / T-009 |
| T-007 | Mechanical scope enforcement (`.claude/settings.json` template + GENESIS step) | 2026-07-01 | Added `templates/.claude/settings.json` (deny secrets/build output, allow writable roots, ask on review-required actions) + companion `.claude/README.md` mapping the extracted D-001 scope keys to permission buckets; wired generation into GENESIS Phase 4 + acceptance checklist. Root exempted from a live config (see BLUEPRINT decision). | 2026-07-01 / T-007 |
| T-005 | Lifecycle hardening (reclaim rule, proof-log archival, version stamps) | 2026-07-01 | Added a stale-claim reclaim rule (AGENTS Long Session Control + TASKBOARD status note), a proof-log archival policy to `TASKBOARD_ARCHIVE.md` past ~30 rows, and `Generated from LLM Workbench v[HARNESS_VERSION]` stamps on all six templates + an Upgrading The Harness RUNBOOK section. Declared harness v2.1 at root. | 2026-07-01 / T-005 |
| T-008 | Feedback loop (`HARNESS_FEEDBACK` convention + harvest task) | 2026-07-01 | Added `templates/HARNESS_FEEDBACK.md` return channel + wiring in templates AGENTS/RUNBOOK/README; documented the harvest+evals loop in root RUNBOOK/README; added standing harvest task T-011 (Deferred). Evals selftest passes. | 2026-07-01 / T-008 |

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
| 2026-07-01 | T-001 | claude (Fable 5) | `node tools/test-evaluate-workbench.mjs` + context/outcome self-tests + `node tools/evaluate-workbench.mjs --path templates --include-controls` | n/a (pre-Demo-column migration) | pass - all self-tests ok; root dogfood docs score 100/100; templates score 85 vs controls 0 and 2 (gap tracked as T-009) | root docs written; README updated; templates moved to `templates/` | PR #5 and dogfood PR need owner merge; T-006 branch decision open |
| 2026-07-01 | T-002 | claude (Opus 4.8) | `node tools/test-evaluate-workbench.mjs` (+ context/outcome self-tests) all ok; root score 100/100; templates score 85 (unchanged by GENESIS add). Toy dry-run bootstrap of a C<->F CLI: `node src/cli.mjs c 100` -> `212F`, `node --test` pass, four filled control docs scored 85/100 vs controls 0 and 2 | one-command: `node src/cli.mjs c 100` -> `212F` (toy bootstrap demo) | added `templates/GENESIS.md`; README + BLUEPRINT updated | dry-run did a targeted (not exhaustive) placeholder fill; optional BLUEPRINT/RUNBOOK sub-rows left bracketed per GENESIS Phase 7. Pushed to `claude/genesis-bootstrap` and PR opened via GitHub API (base `claude/dogfood-taskboard`); owner merges |
| 2026-07-01 | T-003 | claude (Opus 4.8) | red/green: added failing `executive_interface` self-test assertion (confirmed fail: criterion absent), then implemented rubric criterion + brief/decision-queue/escalation sections. `node tools/test-evaluate-workbench.mjs` (+ context/outcome self-tests) all ok; root score 108/108; templates 93/108 (up from 85, new criterion satisfied); controls 0 and 2 | one-command: `node tools/evaluate-workbench.mjs --path . --include-controls` -> root 108/108 | added Executive Brief + Pending Decisions to root & template TASKBOARD; escalation contract to template AGENTS (root already had it, tied to queue); README + BLUEPRINT updated; evaluator rubric + self-test updated | total rubric weight now 108 (was 100); pre-existing templates gaps remain (README/team-templates/portability, T-009). Pushed to `claude/executive-interface` and PR opened via GitHub API (base `claude/genesis-bootstrap`); owner merges |
| 2026-07-01 | T-004 | claude (Opus 4.8) | red/green: added failing `product_acceptance` self-test assertion (confirmed fail: criterion absent), then implemented rubric criterion + Demo column + milestone demo rule. `node tools/test-evaluate-workbench.mjs` (+ context/outcome self-tests) all ok; root score 113/113; templates 98/113; controls 0 and 2 | one-command: `node tools/evaluate-workbench.mjs --path . --include-controls` -> root 113/113 | added Demo column + milestone demo rule to root & template TASKBOARD/AGENTS; README + BLUEPRINT updated; evaluator rubric + self-test updated | rubric weight now 113; pre-existing templates gaps remain (T-009). Branched off `claude/executive-interface` (carries genesis+exec); PR opened into `main` via GitHub API; owner merges |
| 2026-07-01 | T-008 | claude (Opus 4.8) | Added `templates/HARNESS_FEEDBACK.md` (append-only return channel) + references in templates AGENTS (Harness Feedback section), RUNBOOK (Harness Feedback Loop), and README; documented the harvest loop in root RUNBOOK + README; added standing harvest task T-011 to Deferred. Proof: `python3 evals/results/_make_selftest.py` + `python3 evals/score.py evals/results/_pipeline_selftest.jsonl --baseline c0_none` -> selftest passes (c2/c3 significant vs baseline). All three `tools/test-*.mjs` ok; root 113/113; templates 105/113. | n/a (not a milestone) | templates HARNESS_FEEDBACK/AGENTS/RUNBOOK/README; root RUNBOOK/README/BLUEPRINT/TASKBOARD | root has no `HARNESS_FEEDBACK.md` by design (it is the harvest destination) - documented in root RUNBOOK |
| 2026-07-01 | T-005 | claude (Opus 4.8) | Added stale-claim reclaim rule, proof-log archival policy (`TASKBOARD_ARCHIVE.md` past ~30 rows), and version stamps + Upgrading The Harness note across the templates; declared harness v2.1 in root BLUEPRINT and documented versioning in root README. All three self-tests ok; root 113/113; templates 105/113 (unchanged; conventions, not rubric criteria). | n/a (not a milestone) | templates AGENTS/TASKBOARD/RUNBOOK/BLUEPRINT/README/GENESIS stamped; root BLUEPRINT (v2.1 + decision row) + README (Versioning And Upgrades) | forward reference to `HARNESS_FEEDBACK` in the RUNBOOK upgrade note is satisfied by T-008 (next in the stack) |
| 2026-07-01 | T-007 | claude (Opus 4.8) | Added `templates/.claude/settings.json` + `templates/.claude/README.md`; wired into GENESIS Phase 4 and the bootstrap acceptance checklist. `node -e JSON.parse(...)` -> valid JSON. `node tools/test-evaluate-workbench.mjs` ok (root 113/113); `--path templates` -> 105/113 (unchanged; feature adds product value, not rubric points). Root `.claude/` intentionally not created (dogfood exemption recorded in BLUEPRINT; attempt was also blocked as unrequested self-modification). | n/a (not a milestone) | added `.claude/` template set; BLUEPRINT decision row; root README Core Files + How To Use It | **Proof gap:** could not validate live permission behavior in an interactive Claude Code session from here - verified JSON parses and matches the documented settings/permissions schema shape only. Owner should confirm the rules load in a real session. |
| 2026-07-01 | T-009 | claude (Opus 4.8) | Added `templates/README.md` (generic `[BRACKETED]` product README). `node tools/evaluate-workbench.mjs --path templates` -> 105/113 (was 98); closed the `user-facing readme` gap plus the three Tool portability items (plain markdown, multi-agent compatibility, Claude Code import note). `node tools/test-evaluate-workbench.mjs` still ok (root 113/113). | n/a (not a milestone; template add) | added `templates/README.md`; updated root README Core Files + How To Use It copy steps | remaining templates gap is Team coordination (8 pts), which lives in `team templates/`, outside T-005-T-009 scope |
| 2026-07-01 | T-006 | claude (Opus 4.8) | Reviewed PR #4 diff vs merge-base: 10 files against the retired root-ROADMAP layout (root `ROADMAP.md`, root docs as product). Prompt-injection boundary, CLAUDE bridge, and guardrails already exist in v2; only the machine-readable scope frontmatter (`writable_roots`/`forbidden_paths`/`requires_review_for`) was net-new and portable. Docs-only change; `node tools/test-evaluate-workbench.mjs` still ok (root 113/113). | n/a (not a milestone; decision/doc task) | resolved D-001 (extract + close); BLUEPRINT risk row marked resolved + decision row added; TASKBOARD brief/decision/Ready/Done updated; T-007 enriched to carry the extracted idea | branch not yet closed at write time - PR #4 close is an owner/gh action recorded here; scope-key idea now lives only in T-007's description until T-007 implements it |
