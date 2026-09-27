# TK-002U - Inspect assessment evidence through the readable Tracker view

**Task ID:** TK-002U
**Spec ID:** S-001Z
**Slice:** Inspect assessment evidence through the readable Tracker view
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Human-readable public show for one DQC and the whole Tracker exposes existing own/related assessment evidence, basis and revisions on demand, surviving restart and rebuild without changing default compact output.
**Planned verification:** Red: capture and assess a DQC and a related item in a disposable declared room, then public readable show omits their saved evidence/revisions. Green: an explicit expanded readable view exposes each existing contribution identity, fractions, basis, evidence, assessment revision, holder and item revision; unknown/unassessed items remain explicit. Restart and rebuild preserve output; JSON/default compact output and source bytes are unchanged; existing 23 Tracker tests, demo, dedicated tests and full AGENTS suite pass at committed candidate.
**Proof:** Runtime e2b532d6dedb9fddf712bd3804a58508df138dd2: red7bd0b8d and eight expected red checks at6e451c1; readable8/8, Tracker23/23, Result5/5; AGENTS48/48 and Runbook3/3; public demos1.92s/0.43s; fresh local clone all five checks pass. Dispatcher independently reproduced8/23/5 and demo1.91s from immutable archive; no actionable bounded formatter review finding. Merge9f9f2e7 preserves runtime bytes and source-transfer history; no full-suite claim for closeout metadata.

## Outcome And Scope

The owner can inspect why an item has its recorded documentation assessment
without reading raw JSON. Use existing projection/contribution fields. Prefer
one explicit boolean show detail option over always expanding compact output;
justify its exact name in the Task receipt and document the public command.
No source schema, arithmetic, assessments, Result mutation, or authority change.
Own and related item evidence must stay tied to their named revisions/holder;
missing or unknown evidence must not be fabricated. Keep mixed DQC contribution
and shared identity semantics unchanged. Detail traversal must terminate with
existing cycle/seen markers if lineage is shown; lineage redesign is not needed.

## Packet And File Lane

- Read assigned Spec, public workbench/tools/landmark-tracker.mjs and
  workbench/landmark-tracker/README.md; existing tools/test-landmark-tracker.mjs
  and tools/landmark-tracker-demo.mjs are verification context.
- Dedicated tests: tools/test-tracker-readable-evidence.mjs. Own this file.
- Runtime lease after DQC release only: OPTIONS.show, readable format helpers,
  public CLI formatting plumbing. Do not edit DQC mutation/validation functions,
  arithmetic/buildProjection schemas or change existing JSON output.
- README lease after DQC release: only show/detail procedure and example.
- No root controls, templates, shared manifest/path/identity, existing Tracker
  tests, peer Specs/Tasks or original S-01T edits. Dispatcher owns Spec/Taskboard.
- No standalone renderer module unless a concrete need is demonstrated.

## Narrow Shared-Module Dependency

Director grants DQC S-002B TK-002S the first landmark-tracker.mjs mutation lease.
Red tests and inspection are immediately authorized in an isolated worktree.
Before runtime edits, import the exact clean DQC Result commit and obtain the
Director/dispatcher's lease release. Do not wait for whole DQC Spec completion.
No blanket Task blocker is used because independent red proof can proceed.

## Closing Proof

Return red/green SHAs, exact failing assertion and green counts, demo, full-suite
results on immutable clean candidate, source immutability evidence, docs touched,
self-drift/guardrail limits and remaining gaps. Worker may append its own receipt;
Dispatcher reconciles Spec/Taskboard and performs whole-Spec QA. Stop after this
one Task and candidate report; no self-selected follow-on or integration merge.

## Worker Receipt - 2026-09-26 (red checkpoint)

- Packet: `bf4ba683153d4b344f6439373a1a11fe27443139`; isolated worker branch
  `codex/tracker-evidence-tk002u`. No shared primary/dispatcher mutation.
- First red: `7bd0b8dd68dd868acfe328c67ea537d60ed4c66b`,
  `node tools/test-tracker-readable-evidence.mjs`: 0/1 passed, failing
  `readable own assessment evidence is missing` after public fixture writes
  succeeded. Existing JSON contribution rows already hold that evidence.
- Extended red: `05600a6` adds eight public checks for evidence/provenance,
  selected DQC/landmark/whole view, restart/rebuild and byte preservation,
  unknown/unassessed items, mixed DQC navigation cycles, shared identity,
  derived/invalid and empty outcomes. CLI refuses `show --expand` at this tree.
- Proposed detail option: boolean `show --expand`, matching the packet's
  on-demand expansion and keeping compact output unchanged. Rendering will
  consume existing aggregate contribution rows without recursive lineage walks.
- Existing verification at the red checkpoint: Tracker suite 23/23; public
  foundation demo 1.87 seconds. Guardrail baseline 78/100; missing repeated
  real outcome evidence remains a limitation. Read-only self-drift pre receipt
  reports existing stale S-00Q claim plus historical seed/provenance limits;
  no clean-update or Human QA claim.
- Shared runtime/README lease remains with DQC TK-002S. Need its exact clean
  Result seam commit and explicit module/README release before importing/editing.
  Callback was rejected by automatic review; worker reported in its own chat
  for dispatcher inspection and did not retry or use an alternate outbound route.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/landmark-tracker-split | 9f9f2e7ce498bb66fe76f8d2ec29f6503af2584c | none | 0 | Runtime e2b532d6dedb9fddf712bd3804a58508df138dd2: red7bd0b8d and eight expected red checks at6e451c1; readable8/8, Tracker23/23, Result5/5; AGENTS48/48 and Runbook3/3; public demos1.92s/0.43s; fresh local clone all five checks pass. Dispatcher independently reproduced8/23/5 and demo1.91s from immutable archive; no actionable bounded formatter review finding. Merge9f9f2e7 preserves runtime bytes and source-transfer history; no full-suite claim for closeout metadata. | Tracker README documents show --expand and limits; assigned Spec and Task proof reconciled. Generic root/template controls exempt: optional formatter flag changes no schema or shared workflow policy. | Task implementation proved; S-001Z remains open for assembled demonstration, actual article-assessment seam, whole-Spec QA and separate-context integration review. Existing stale claim and seed/provenance drift remains; guardrails78/100, no clean-update or owner Human QA claim. Git state at close: unpushed (no upstream); recorded reason: Local isolated candidate retained after automatic review rejected worker push; Director owns publication under original authorization. No rejected push retried. | 92ec5e0db5a3c4dbfda63b0b56ca32639772ff2f3318dc073b0c6ad55afc88e1 |
