# TK-002R - Reconcile identity procedures and run the assembled WBID QA

**Task ID:** TK-002R
**Spec ID:** S-01W
**Slice:** Reconcile identity procedures and run the assembled WBID QA
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-01W acceptance line 5 (ADR, procedures and generic mirrors describe actual delivery; full suite, drift receipts and assembled review are recorded).
**Planned verification:** Red: a read-only semantic check finds RUNBOOK's Visible Identifiers section, the LEXICON WBID entry, their `templates/` mirrors and the notepad skill's allocate wording still describing mixed-case base62, minimum width three and `N-00A`-style examples for artifact labels, and none of them naming dual-form selection or `widen-id`; green: each of those passages describes the delivered behavior exactly (uppercase `0-9A-Z` minimum width four for Specs, Tasks, ADRs and notepads; every spelling reserved; dual-form selectors; `widen-id` with `**Former ID:**`, run when substantive work starts on an open record; base62 kept only for Workbench connection IDs and legacy reading), templates stay generic and `[BRACKETED]`, the read-only QA inventory of live active records still short and of alias collisions is recorded with its counts, and the full suite plus S-00K pre/post self-drift receipts are clean of new findings.
**Proof:** Second attempt (claude-opus-5-5, carry). Docs verified against source at HEAD: visible-ids.mjs allocateArtifactId/compareVisibleIds/visibleIdKey, spec-workbench.mjs nextIdentity/occupiedIdentities/widenId, notepads.mjs allocateNote and --id resolution, adr.mjs occupiedAdrLabels. Stale JSON Notepads allocation text in RUNBOOK and templates/RUNBOOK found by the semantic check and reconciled (8c8d13f). Read-only QA inventory at b6261db: no stored-record alias collision; 47 of 95 open Specs and 52 of 55 open Tasks short (22 record-backed, widen-id eligible); nothing renamed. Full AGENTS suite 48/48 at b6261db (read-only runner, dirty []); after merging integration 5adcbaa: render, doctor no blocking finding, wiki validate ok. Guardrail 106.6/113 unchanged. S-00K self-drift pre (cbb3d5b) and post (b6261db): only pre-existing findings plus this Task's own stale claim.

## Outcome

A cold-start agent reading RUNBOOK and LEXICON gets the identity rules the code
now enforces. The owner's "sweep during QA/verify" (E-8) is performed as a
read-only inventory: it lists open records whose IDs are still short and any
alias collisions, and mutates nothing. The capability is then ready for the
assembled-Spec review.

## Authority And Source

Lane I (`claude-lane-I`) cut this Task under the owner's 2026-09-26 instruction
relayed by the Claude Director. The Director decided (2026-09-26, option A)
that S-01W's QA Task edits only RUNBOOK's Visible Identifiers section, the
LEXICON WBID entry and their `templates/` mirrors, because S-00P's control
rewrite is hours away and stale ID rules misroute cold-start agents. Ledger
E-8: "We can do the sweep during the QA/verify, and find what we missed."

## Released Lane

Write lane: `RUNBOOK.md` (Visible Identifiers section only),
`templates/RUNBOOK.md` (its mirror only), `LEXICON.md` (WBID entry only),
`templates/LEXICON.md` (its mirror only), the allocate wording in
`workbench/skills/notepad/SKILL.md` (and its managed receipt through the
supported installer route if the skills lane requires one), and the ADR-0041
remaining-work paragraph. No other control, template or skill passage. The QA
inventory is a read-only command or script run whose output is summarized in
evidence; no new shipped command. Run the S-00K self-drift receipt before and
after. The direct `spec-report.mjs` library pass-through stays a named limit
unless the trace shows a fix inside this lane.

## Decisions

| Choice | Scope | Disposition | Durable owner |
|---|---|---|---|
| Second attempt of this Task (2026-10-02, claude-opus-5-5 under the owner's carry instruction) continues the first attempt's pushed branch at `1616bbd` rather than cutting a new Task, and merges current integration (`cbb3d5b`) into it instead of rebasing, so the published branch history is not rewritten. | task-local | reconciled | This Task's Receipt and the S-01W evidence log |
| The released lane widens to RUNBOOK's JSON Notepads allocation paragraph and its `templates/` mirror, the visible-identifiers Wiki design-concept page and the Wiki router's identifier line. The Director narrowed the lane on 2026-09-26 only because S-00P's control rewrite was about to land; that rewrite is now contained in integration, and the JSON Notepads paragraph still described the width-three mixed-case allocator TK-002Q replaced, which acceptance line 5 forbids. AGENTS.md requires the Wiki page whose current-facing claim the work changed to be updated on the same branch. | task-local | reconciled | RUNBOOK.md (JSON Notepads), templates/RUNBOOK.md, workbench/wiki/design-concepts/spec-S-047-visible-workbench-identifiers.md, workbench/wiki/MEMORY.md |
| S-01W itself is not widened. Its substantive work began when TK-02B was claimed (`b35a65a`, 2026-09-26 09:56 -0600), before PR #208 delivered the `widen-id` verb (`761f1f5`, 16:06 the same day), and the verb's trigger is the start of substantive work; widening it now would rename a Spec at its assembled review and rewrite links in other lanes' records. The inventory lists it among the open short records like every other untouched one. | task-local | reconciled | S-01W evidence log |
| The QA inventory is a throwaway read-only script run against the candidate (it imports the room's own loaders and writes nothing); no command is shipped, per the Released Lane. Its counts live in the S-01W evidence log rather than ADR-0041, so the ADR does not carry numbers that go stale as records change. | task-local | reconciled | workbench/docs/adr/0041-visible-base62-workbench-identifiers.md; S-01W evidence log |

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s01w-assembled-qa | f2a6c9e980be1384a62916ce911dc1752cdaa2de | ahead 0 behind 0 | 0 | Full AGENTS suite 48/48 at b6261db (read-only runner, dirty []); after merging integration 5adcbaa (PR #270): render, doctor no blocking finding, wiki.mjs validate ok; guardrail evaluate-workbench 106.6/113 unchanged from cbb3d5b; S-00K self-drift pre at cbb3d5b and post at b6261db carry only the pre-existing stale-claim S-00Q, five stale-seed and unverified-provenance findings plus this Task's own stale claim (pre's detached-head came from the detached inspection worktree); read-only QA inventory at b6261db found no stored-record alias collision | RUNBOOK.md and templates/RUNBOOK.md (Visible Identifiers from the first attempt; JSON Notepads allocation paragraph and read --id example); LEXICON.md and templates/LEXICON.md WBID row; ADR-0041 delivery paragraphs; workbench/skills/notepad/SKILL.md allocation wording; workbench/wiki/design-concepts/spec-S-047-visible-workbench-identifiers.md and workbench/wiki/MEMORY.md | S-003W hand-labelled numeric Task rows routed to its owner; widen-id stays a manual touch with 47 open Specs and 22 eligible open Task records short; spec-report.mjs library callers still echo the caller's selector spelling; assembled-Spec separate-context review pending | 71a7f83e6e65897e253d062a20ef625cff6cd170e18512baa2b30258985c3205 |
| 2 | claude/s01w-assembled-qa | 3605bfa3192252a7a8c974d4f688e1275bfa4571 | ahead 0 behind 0 | 0 | Second attempt (claude-opus-5-5, carry). Docs verified against source at HEAD: visible-ids.mjs allocateArtifactId/compareVisibleIds/visibleIdKey, spec-workbench.mjs nextIdentity/occupiedIdentities/widenId, notepads.mjs allocateNote and --id resolution, adr.mjs occupiedAdrLabels. Stale JSON Notepads allocation text in RUNBOOK and templates/RUNBOOK found by the semantic check and reconciled (8c8d13f). Read-only QA inventory at b6261db: no stored-record alias collision; 47 of 95 open Specs and 52 of 55 open Tasks short (22 record-backed, widen-id eligible); nothing renamed. Full AGENTS suite 48/48 at b6261db (read-only runner, dirty []); after merging integration 5adcbaa: render, doctor no blocking finding, wiki validate ok. Guardrail 106.6/113 unchanged. S-00K self-drift pre (cbb3d5b) and post (b6261db): only pre-existing findings plus this Task's own stale claim. | RUNBOOK.md and templates/RUNBOOK.md Visible Identifiers and JSON Notepads; LEXICON.md and templates/LEXICON.md WBID row; ADR-0041 delivery paragraphs; workbench/skills/notepad/SKILL.md; workbench/wiki/design-concepts/spec-S-047-visible-workbench-identifiers.md and workbench/wiki/MEMORY.md | S-003W hand-labelled numeric Task rows routed to its owner before activation; widen-id stays a manual touch; spec-report.mjs library callers still echo the caller's selector spelling; assembled-Spec separate-context review and owner Human QA remain | 52ce4b1ea999de5f1b55b7605b490bfb370a49cce76b6e1b730069a3c5b29476 |
