---
type: project
status: active
sensitivity: normal
knowledge_role: canonical
provenance:
  - Compiled 2026-09-24 by Claude Opus 5.5 (Claude Code) from the local grilling notes, the 2026-09-19 grilling progress board, the 2026-09-23 destination audit (254 verdict rows), its completeness addendum, and the owner answers recovered from transcripts (triage v2)
source_paths:
  - workbench/wiki/grilling-destination-audit-ledger.md
last_verified: 2026-09-24
---

# Grilling Destination Audit Ledger

This is the official list of every unique question put to the owner while designing the Workbench in grilling sessions, including the few still open or withdrawn, with the answer, the reason for it, and the result the answer was meant to produce. It is the destination the v4 Workbench is audited against: for each row, an auditor checks that the named Result exists in the Workbench and says what the Answer says.

The grilling notes themselves are local, untracked working records. This ledger is their durable, tracked summary. It records the destination, not progress: it never says whether a result was built. Implementation state belongs to the owning Specs and to the audit that runs against this ledger. Like every wiki note, it routes and records; it authorizes no work by itself (`AGENTS.md` -> Authority Order).

## How To Read A Row

- **Question**: the latest faithful wording. Reconstructed questions are flagged in Notes.
- **Status**: `locked` (settled in the notes); `answered-in-chat` (the owner answered in a session but the note was never updated; recovered from his own messages); `partially-answered` (the owner answered part of the question; the row says which part is open); `open`; `deferred` (settled as later work); `withdrawn` (not an owner question, or withdrawn in session); `superseded` (replaced by a later answer, named in the row); `not-a-question`.
- **Answer**: the owner's settled answer, in his words where they carry the meaning.
- **Reason**: why he answered that way. `Inference:` marks a reason derived from context; `Not recorded.` means no reason survives in any source.
- **Result**: the durable effect the answer should have: an artifact to create, update or retire, and what must be true there. This is what the audit checks.
- Paths are as of 2026-09-24. An ADR or Spec that later moves between lifecycle folders (`proposed/`, `archive/`, `retired/`) keeps its ID; find it by ID.
- **Provenance**: the grilling record and entry the row came from. These are local, untracked working records (notepads, session transcripts, recovery files), named so the source can be traced on the owner's machine; they are not durable evidence, and this ledger is their durable copy.

## Counting

The 2026-09-23 destination audit held 254 rows for 240 distinct question IDs. Fourteen IDs (CAND-N, FND-Q20, FND-Q21A, FND-Q21B, FND-Q21C, FND-Q21D, FND-Q22, FND-Q22A, FND-Q23, FND-Q23A, FND-Q24, FND-Q24B, RB-Q6, WF-11) were assessed twice, once by the 2026-09-19 board pass and once by the later pass; each appears here once, with its current answer. The twelve original Task/Ticket/Chat questions (Q1-Q12 of the 2026-09-10 clarification note) are the same questions as TT-Q1..TT-Q12 and are listed as aliases. This ledger therefore has **240 questions**, plus **4 recovered questions** (REC-01..REC-04) that were asked and answered before their note existed and are kept outside the 240 count.

Status of the 240 questions: locked 179, superseded 25, open 14, answered-in-chat 10, withdrawn 6, partially-answered 3, deferred 2, not-a-question 1.

## Sources

- **V3** (73) - LLM Workbench v3 layout and shared skills, 2026-08-31. Record: llm-workbench-v3-layout-and-shared-skills-2026-08-31.
- **WB** (16) - Workbench boundaries redesign, 2026-09-04. Record: workbench-boundaries-redesign-2026-09-04.
- **U313** (14) - Unblocking v3.1.3 open work, 2026-09-07. Record: unblocking-v3-1-3-open-work-2026-09-07.
- **CAND** (1) - Private session transport (CAND-N), 2026-09-07, revisited 2026-09-21. Record: cand-n-private-session-transport-2026-09-07; blocked-obligations-review-2026-09-21.
- **BPR** (25) - Blueprint and ADR boundary review, 2026-09-09. Record: blueprint-adr-boundary-review-2026-09-09.
- **FND** (38) - Foundation ownership, 2026-09-10 to 2026-09-22. Record: fnd-foundation-ownership-2026-09-15; workbench-foundation-rework-2026-09-11; blocked-obligations-review-2026-09-21.
- **RB** (10) - Foundation rework, 2026-09-11. Record: workbench-foundation-rework-2026-09-11.
- **TT** (12) - Task, Ticket and Chat terms, 2026-09-10 to 2026-09-23. Record: tt-task-ticket-chat-terms-2026-09-15; task-ticket-chat-workflow-clarification-2026-09-10.
- **WF** (20) - Workbench workflow, 2026-09-10 to 2026-09-19. Record: wf-workbench-workflow-2026-09-15; workbench-workflow-2026-09-10.
- **TRACK** (1) - Blocked-obligations track choice, 2026-09-21. Record: blocked-obligations-review-2026-09-21.
- **E** (14) - Taskboard and work representation, 2026-09-22. Record: blocked-obligations-review-2026-09-21.
- **ACC** (5) - ADR acceptance and Contract binding, 2026-09-21 to 2026-09-23. Record: blocked-obligations-review-2026-09-21.
- **PW** (11) - Portable, cloud-deployable Workbench, 2026-09-22 to 2026-09-23. Record: portable-workbench-cloud-deployable-2026-09-22.
- **REC** (4) - Recovered pre-notepad questions, 2026-09-07. Record: recovered from transcript by the 2026-09-23 completeness audit.

## Index

**V3 - LLM Workbench v3 layout and shared skills**

- [V3-1](#v3-1) Root surface stays seven files (locked)
- [V3-2](#v3-2) Standard workbench support directory (superseded)
- [V3-3](#v3-3) Where custom skills live (superseded)
- [V3-4](#v3-4) Genesis, Adoption, update-harness routes (locked)
- [V3-5](#v3-5) Foundry machinery stays out (locked)
- [V3-6](#v3-6) Final release gate (locked)
- [V3-7](#v3-7) No dependency on private skills repo (locked)
- [V3-7A](#v3-7a) Private catalog not required (locked)
- [V3-7B](#v3-7b) No substitute catalog contract (locked)
- [V3-8](#v3-8) Skill versions bound to release (locked)
- [V3-8A](#v3-8a) Skills version with Workbench (locked)
- [V3-8B](#v3-8b) One release ships skills and installer (locked)
- [V3-9](#v3-9) What the setup skill check proves (superseded)
- [V3-9A](#v3-9a) Identities checked by setup (superseded)
- [V3-9B](#v3-9b) Modified skills do not block setup (locked)
- [V3-9C](#v3-9c) What normal setup may mutate (superseded)
- [V3-10](#v3-10) Manifest is the single authority (locked)
- [V3-10A](#v3-10a) Required manifest base fields (locked)
- [V3-10B](#v3-10b) Skill contract in manifest (superseded)
- [V3-10C](#v3-10c) Only small bounded tools (locked)
- [V3-11](#v3-11) Tracked versus local support lanes (superseded)
- [V3-11A](#v3-11a) Which lanes are tracked (superseded)
- [V3-11B](#v3-11b) Local grilling and checkpoint copies (superseded)
- [V3-11C](#v3-11c) Empty lanes kept by placeholder (locked)
- [V3-12](#v3-12) Layout move is v3 (locked)
- [V3-12A](#v3-12a) v3 is a major version (locked)
- [V3-12B](#v3-12b) Dogfood the v3 layout here (locked)
- [V3-12C](#v3-12c) No permanent dual paths (locked)
- [V3-13](#v3-13) Core skills read the manifest (locked)
- [V3-13A](#v3-13a) The 12 named core skills (superseded)
- [V3-13B](#v3-13b) Generic handoff outside the core (superseded)
- [V3-13C](#v3-13c) Skills and layout ship together (locked)
- [V3-14](#v3-14) What Adoption produces (locked)
- [V3-14A](#v3-14a) Migrating mixed inputs (locked)
- [V3-14B](#v3-14b) When legacy local skills retire (superseded)
- [V3-15](#v3-15) What Genesis produces (superseded)
- [V3-15A](#v3-15a) What exists right after Genesis (locked)
- [V3-15B](#v3-15b) Genesis when a skill cannot install (superseded)
- [V3-16](#v3-16) What the v2-to-v3 update produces (locked)
- [V3-16A](#v3-16a) What the v3 update changes (locked)
- [V3-16B](#v3-16b) Recovery proof for the v3 update (locked)
- [V3-17](#v3-17) Acceptance for v3 (locked)
- [V3-17A](#v3-17a) Mandatory synthetic test cases (locked)
- [V3-17B](#v3-17b) Mandatory end-to-end exercises (locked)
- [V3-17C](#v3-17c) No second model trial for v3 (locked)
- [V3-17D](#v3-17d) The one-minute v3 demo (locked)
- [V3-18](#v3-18) Implementation and publication topology (locked)
- [V3-18A](#v3-18a) Where v3 work was authored (locked)
- [V3-18B](#v3-18b) One repository for v3 (locked)
- [V3-19](#v3-19) Reconcile stale public control state (locked)
- [V3-19A](#v3-19a) S-011 skill ownership superseded (locked)
- [V3-19B](#v3-19b) S-014 stale claim reconciled (locked)
- [V3-19C](#v3-19c) Obsolete PR #42 handling (locked)
- [V3-19D](#v3-19d) Repair red skill-catalog baseline (locked)
- [V3-20](#v3-20) Final implementation handoff scope (locked)
- [V3-20A](#v3-20a) What the v3 handoff authorizes (locked)
- [V3-20B](#v3-20b) What the v3 handoff excludes (locked)
- [V3-21](#v3-21) Self-contained Workbench skill bundle (superseded)
- [V3-21A](#v3-21a) Bundle preserves full workflow (locked)
- [V3-21B](#v3-21b) Intended core skill set (superseded)
- [V3-21C](#v3-21c) Where core skills are installed (superseded)
- [V3-22](#v3-22) Existing skill root or skill (superseded)
- [V3-22A](#v3-22a) No automatic skill replacement (locked)
- [V3-22B](#v3-22b) Presence-only normal setup (superseded)
- [V3-22C](#v3-22c) Explicit skill update behavior (locked)
- [V3-23](#v3-23) Guidebook-first procedures (locked)
- [V3-23A](#v3-23a) No monolithic lifecycle program (locked)
- [V3-23B](#v3-23b) Guidebook authority routing (locked)
- [V3-23C](#v3-23c) Broad guidebook library (deferred)
- [V3-24](#v3-24) Governing v3 release constraint (locked)
- [V3-24A](#v3-24a) Minimum complete v3 release (locked)
- [V3-24B](#v3-24b) Excluded tempting work (locked)
- [V3-24C](#v3-24c) v3 delivery boundary (locked)

**WB - Workbench boundaries redesign**

- [WB-1](#wb-1) First proof of redesigned Workbench (locked)
- [WB-2](#wb-2) Ordinary entry route and controls (locked)
- [WB-3](#wb-3) Packaging the four stance skills (locked)
- [WB-4](#wb-4) When independent review is required (locked)
- [WB-5](#wb-5) What survives for cold continuation (locked)
- [WB-6](#wb-6) Autonomy when work is underspecified (locked)
- [WB-7](#wb-7) Where reports and follow-up live (locked)
- [WB-8](#wb-8) Relation to unreleased v3.1 candidate (locked)
- [WB-9](#wb-9) Evidence before Master Workbench (locked)
- [WB-10](#wb-10) Required steps must enable delivery (locked)
- [WB-11](#wb-11) Smallest v3.1.1 implementation slice (locked)
- [WB-12](#wb-12) Common stance skill contract (locked)
- [WB-13](#wb-13) What Round One must prove (locked)
- [WB-14](#wb-14) Round One returns in chat only (locked)
- [WB-15](#wb-15) No self-created next task (locked)
- [WB-16](#wb-16) Who sets the normal stance (locked)

**U313 - Unblocking v3.1.3 open work**

- [U313-0](#u313-0) v3.1.3 does not publish yet (locked)
- [U313-1](#u313-1) S-045 tickets land in v3.1.3 (locked)
- [U313-1A](#u313-1a) All six S-045 tickets (locked)
- [U313-1B](#u313-1b) Ownership of S-045 tickets (locked)
- [U313-2](#u313-2) Install carry via TK-005 route (locked)
- [U313-2A](#u313-2a) Git-owned/symlinked skill root supported (locked)
- [U313-3](#u313-3) Which assignment carry measures (withdrawn)
- [U313-4](#u313-4) S-014/S-022 release reconciliation (withdrawn)
- [U313-5](#u313-5) S-046 ownership stays with Codex (withdrawn)
- [U313-6](#u313-6) S-047/S-048 in v3.1.3 scope (withdrawn)
- [U313-7](#u313-7) Decision-recovery zip relocation (locked)
- [U313-8](#u313-8) Correct stale main-has-no-workbench claim (locked)
- [U313-9](#u313-9) GENESIS template skill count (withdrawn)
- [U313-10](#u313-10) Grilling the five CAND adjudications (superseded)

**CAND - Private session transport (CAND-N)**

- [CAND-N](#cand-n) Cross-machine session continuity (locked)

**BPR - Blueprint and ADR boundary review**

- [BPR-1](#bpr-1) Blueprint vs ADR reader contracts (locked)
- [BPR-2](#bpr-2) Universal reading and routing owner (locked)
- [BPR-3](#bpr-3) Governance Planes inside ADRs (locked)
- [BPR-4](#bpr-4) Accepted ADRs as architectural Canon (locked)
- [BPR-5](#bpr-5) Blueprint destination-only time horizon (locked)
- [BPR-5A](#bpr-5a) Blueprint vs Spec vs ADR placement (locked)
- [BPR-6](#bpr-6) ADR lifecycle and whole-record supersession (locked)
- [BPR-6A](#bpr-6a) Historical ADR retention and reachability (superseded)
- [BPR-7](#bpr-7) Scope of the v3.2 ownership repair (locked)
- [BPR-7A](#bpr-7a) Release proof and missing Blueprints (locked)
- [BPR-7B](#bpr-7b) Example_Workbench becomes Workbench Template (locked)
- [BPR-7B1](#bpr-7b1) v3.2 template proof boundary (locked)
- [BPR-7B2](#bpr-7b2) Staged template-to-project capabilities (locked)
- [BPR-7C](#bpr-7c) No automatic downstream rollout (locked)
- [BPR-8A](#bpr-8a) Current-state material leaves Blueprint (locked)
- [BPR-8B](#bpr-8b) Eight-section generic Blueprint shape (locked)
- [BPR-8C](#bpr-8c) How ADRs appear in Blueprint (locked)
- [BPR-8D](#bpr-8d) Lossless Blueprint claim migration (locked)
- [BPR-8E](#bpr-8e) Guarding against Blueprint ownership drift (locked)
- [BPR-8F](#bpr-8f) Integration review vs main review (superseded)
- [BPR-8F1](#bpr-8f1) What a readiness request authorizes (locked)
- [BPR-R1](#bpr-r1) Endpoint after a grilling session (locked)
- [BPR-R2](#bpr-r2) Handoffs are human-readable Markdown (locked)
- [BPR-R3](#bpr-r3) Promotion-and-scoping handoff scope (locked)
- [BPR-R4](#bpr-r4) Handoff success criterion (locked)

**FND - Foundation ownership**

- [FND-Q01](#fnd-q01) Idea-to-verified-completion workflow (locked)
- [FND-Q02](#fnd-q02) Where the owner sees the journey (locked)
- [FND-Q02A](#fnd-q02a) Taskboard ownership of work state (locked)
- [FND-Q03](#fnd-q03) Context boundary and resume load (answered-in-chat)
- [FND-Q04](#fnd-q04) Software-only or general work (not-a-question)
- [FND-Q05](#fnd-q05) What the Blueprint must explain (answered-in-chat)
- [FND-Q06](#fnd-q06) Blueprint acceptance: outline or meaning (answered-in-chat)
- [FND-Q07](#fnd-q07) Specs and Tasks are disposable (superseded)
- [FND-Q08](#fnd-q08) Current-contract route after retirement (superseded)
- [FND-Q09](#fnd-q09) Lexicon role; no open questions (locked)
- [FND-Q10](#fnd-q10) Pre-schema notes compatibility (open)
- [FND-Q11](#fnd-q11) Whole-record supersession exception (open)
- [FND-Q12](#fnd-q12) Functions a fresh install must provide (answered-in-chat)
- [FND-Q13](#fnd-q13) When grilling answers enter Canon (locked)
- [FND-Q14](#fnd-q14) When the human inspects results (locked)
- [FND-Q15](#fnd-q15) Measuring the redesign's effect (answered-in-chat)
- [FND-Q16](#fnd-q16) Live vs historical release claims (open)
- [FND-Q17a](#fnd-q17a) Six-box sketch: sketch or boundary (open)
- [FND-Q17b](#fnd-q17b) Frontier concept vs Taskboard (locked)
- [FND-Q17c](#fnd-q17c) Multi-Spec objectives and Spec nesting (answered-in-chat)
- [FND-Q17d](#fnd-q17d) Leftover behavior from Spec managers/Captain (open)
- [FND-Q17e](#fnd-q17e) Portable unattended runner or coordinator (deferred)
- [FND-Q17f](#fnd-q17f) Recurring approved maintenance actions (open)
- [FND-Q17g](#fnd-q17g) Which residual sketch names still matter (open)
- [FND-Q18](#fnd-q18) First terrain for foundation grilling (locked)
- [FND-Q19](#fnd-q19) Blueprint, Spec and Task altitudes (locked)
- [FND-Q20](#fnd-q20) Ownership map relation vocabulary (locked)
- [FND-Q21](#fnd-q21) Allocating responsibilities across artifacts (locked)
- [FND-Q21A](#fnd-q21a) Ownership schema covers every Core type (locked)
- [FND-Q21B](#fnd-q21b) Six scoped responsibility rows (locked)
- [FND-Q21C](#fnd-q21c) Where decisions are recorded (locked)
- [FND-Q21D](#fnd-q21d) The 21 single-owner rows and row 28 (locked)
- [FND-Q22](#fnd-q22) What the Contract is (locked)
- [FND-Q22A](#fnd-q22a) Ownership map routes, not copies (locked)
- [FND-Q23](#fnd-q23) Changing ownership assignments safely (locked)
- [FND-Q23A](#fnd-q23a) Separate root OWNERSHIP.json (locked)
- [FND-Q24](#fnd-q24) Upstream vs project ownership origins (locked)
- [FND-Q24B](#fnd-q24b) Classifying project-vs-upstream row differences (open)

**RB - Foundation rework**

- [RB-Q1](#rb-q1) Task packet and receipt contents (locked)
- [RB-Q1A](#rb-q1a) Packet name and optional members (locked)
- [RB-Q2](#rb-q2) No level beneath Task (locked)
- [RB-Q2A](#rb-q2a) Run history on the Taskboard (locked)
- [RB-Q2B](#rb-q2b) Context unit is 200k goalpost (locked)
- [RB-Q3](#rb-q3) Contract word budget (locked)
- [RB-Q3A](#rb-q3a) What budget grading grades (locked)
- [RB-Q4](#rb-q4) Close gate for dirty or unpushed work (locked)
- [RB-Q5](#rb-q5) Dispositions for feedback findings (locked)
- [RB-Q6](#rb-q6) Notepad fixes and installed core skills (superseded)

**TT - Task, Ticket and Chat terms**

- [TT-Q1](#tt-q1) Name for a host chat (locked)
- [TT-Q2](#tt-q2) Task is a standalone artifact (locked)
- [TT-Q3](#tt-q3) Workbench Project Spec Task cardinality (locked)
- [TT-Q4](#tt-q4) One Task per Chat (locked)
- [TT-Q5](#tt-q5) Meaning of next (open)
- [TT-Q6](#tt-q6) Selection, claim and authorization (answered-in-chat)
- [TT-Q7](#tt-q7) When a fresh chat is needed (answered-in-chat)
- [TT-Q8](#tt-q8) Owner-facing versus internal skills (partially-answered)
- [TT-Q9](#tt-q9) Chat, notepad and handoff continuity (answered-in-chat)
- [TT-Q10](#tt-q10) Board name and Task identifiers (answered-in-chat)
- [TT-Q11](#tt-q11) Accepted aliases and retired terms (open)
- [TT-Q12](#tt-q12) Where settled answers are promoted (partially-answered)

**WF - Workbench workflow**

- [WF-1](#wf-1) Blueprint versus Spec PRD role (locked)
- [WF-2](#wf-2) What starts and ends Align (locked)
- [WF-3](#wf-3) Align investigation methods and prototypes (locked)
- [WF-4](#wf-4) When to prototype and code reuse (locked)
- [WF-5](#wf-5) Task replaces Ticket everywhere (locked)
- [WF-6](#wf-6) Blueprint Spec Task Taskboard relation (locked)
- [WF-7](#wf-7) Nested Spec and Task branches (locked)
- [WF-8](#wf-8) QA and verify at each altitude (locked)
- [WF-8A](#wf-8a) Corrective work after Spec retirement (locked)
- [WF-8B](#wf-8b) No per-Task review ceremony (locked)
- [WF-8C](#wf-8c) Failed Spec review creates corrective Tasks (locked)
- [WF-8D](#wf-8d) What retiring a completed Task means (locked)
- [WF-8E](#wf-8e) When a Spec closes and retires (locked)
- [WF-8F](#wf-8f) Where knowledge lives after retirement (locked)
- [WF-8G](#wf-8g) Corrective Task versus new Spec (locked)
- [WF-8H](#wf-8h) Wiki feature articles for Specs (locked)
- [WF-9](#wf-9) Recursive loop back after QA (locked)
- [WF-10](#wf-10) Coordinator later, single Task first (locked)
- [WF-11](#wf-11) Mission success proof on another workbench (locked)
- [WF-12](#wf-12) Rollout scope for the workflow (locked)

**TRACK - Blocked-obligations track choice**

- [TRACK](#track) Board first before ADR-000B/C/D (locked)

**E - Taskboard and work representation**

- [E-1](#e-1) TASKBOARD becomes generated six-lane JSON (locked)
- [E-2](#e-2) Director role definition (withdrawn)
- [E-3](#e-3) Board grain: Specs and Tasks (locked)
- [E-4](#e-4) Backlog meaning and done flow (locked)
- [E-4A](#e-4a) Where Backlog items live (locked)
- [E-4B](#e-4b) Planned status means Backlog (locked)
- [E-4C](#e-4c) Needs review lane meaning (locked)
- [E-5](#e-5) Board tooling and lane derivation (locked)
- [E-6](#e-6) Board and WBID Specs in v4 (locked)
- [E-7](#e-7) No mass re-statusing of Specs (locked)
- [E-8](#e-8) WBID widening by touch-and-update (locked)
- [E-9](#e-9) Home for spec-less Tasks (locked)
- [E-10](#e-10) sitrep returns as core skill (locked)
- [E-11](#e-11) Complete-card cleanup substates (locked)

**ACC - ADR acceptance and Contract binding**

- [ACC-1](#acc-1) Timing of ADR-000B/C/D acceptance (open)
- [ACC-2](#acc-2) Seven-vs-eight root file window (open)
- [ACC-3](#acc-3) Blueprint outside the Contract (partially-answered)
- [ACC-4](#acc-4) Routes-not-claims guardrail violation (open)
- [ACC-5](#acc-5) Repointing links in completed Specs (open)

**PW - Portable, cloud-deployable Workbench**

- [PW-1](#pw-1) Portable Workbench definition (locked)
- [PW-2](#pw-2) FND-Q24B stays under S-00G (locked)
- [PW-3](#pw-3) Core skills tracked per room (locked)
- [PW-3A](#pw-3a) Move producer skills to lane (locked)
- [PW-4](#pw-4) Non-core skills and backup catalog (locked)
- [PW-5](#pw-5) Cloud continuity and committing notes (locked)
- [PW-6](#pw-6) Shared claim surface for instances (locked)
- [PW-7](#pw-7) Host floor and missing capabilities (locked)
- [PW-8](#pw-8) Owner-machine truth goes to Wiki (locked)
- [PW-9](#pw-9) Proof of portability (locked)
- [PW-10](#pw-10) Where portability answers land (locked)

**REC - Recovered pre-notepad questions**

- [REC-01](#rec-01) Name the skill carry (locked)
- [REC-02](#rec-02) carry joins core bundle (locked)
- [REC-03](#rec-03) Bump to v3.1.3 for carry (locked)
- [REC-04](#rec-04) Downstream rooms run v3.1.2 (locked)

## V3 - LLM Workbench v3 layout and shared skills

### V3-1

**Topic:** Root surface stays seven files

**Question:** What remains universally discoverable at the project root?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** The seven root surfaces remain AGENTS.md, BLUEPRINT.md, LEXICON.md, RUNBOOK.md, TASKBOARD.md, CLAUDE.md and README.md; workbench/ is a support-record directory, "not a second control root".

**Reason:** Inference: keep one small, universally discoverable control surface while moving support records (then still at root: specs/, skills/) out of the root, per the session's constraint to make the Workbench portable without redesigning it (Q24). ADR-0013 later adds that including the Lexicon gives a fresh agent shared vocabulary without host context.

**Result:**

- create `workbench/docs/adr/0013-seven-file-workbench-contract.md` - Records the seven root files and that support records live behind workbench/; no eighth coequal root control.
- update `LEXICON.md (Root controls, Support root, Workbench Contract rows)` - Defines the seven root controls and states the support root is not a second control plane.
- update `templates/LEXICON.md` - Mirrors the generic root-control and support-root definitions.
- create `workbench/specs/S-021-portable-workbench-v3/SPEC.md (Desired Behavior)` - Every Genesis or Adoption ends with exactly the seven root controls plus lowercase workbench/.

**Related:** [V3-2](#v3-2), [V3-15](#v3-15)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q1

**Notes:** Board flags this row superseded, but only an accepted later decision can replace it: ADR-000B (a proposal for eight root files adding OWNERSHIP.json) does not supersede ADR-0013 unless the owner accepts it.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:5; workbench/specs/S-021-portable-workbench-v3/SPEC.md; workbench/docs/adr/0013-seven-file-workbench-contract.md

### V3-2

**Topic:** Standard workbench support directory

**Question:** What standard support interface does every Genesis or Adoption produce?

**Status:** superseded · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** A lowercase workbench/ directory with a machine-readable manifest and declared specs/, wiki/, grilling/, handoffs/ and feedback/ lanes. Superseded by the owner-reviewed v3.1 decisions (ADR-0017/ADR-0032: six lanes docs, specs, wiki, sessions, feedback, tools, with grilling and handoffs as sessions/ collections) and then PW-3 (ADR-000M: a seventh skills lane).

**Reason:** Homework findings: the three referenced chats' durable correction was the intended lowercase workbench/ design; live integration still mixed support records at the root and had no manifest. S-021 Why It Matters: mixed root records made portable setup ambiguous.

**Result:**

- update `workbench/manifest.json (lanes)` - Declares every lane: seven lanes (docs, specs, wiki, sessions, feedback, tools, skills) under schema 2.
- create `workbench/docs/adr/0032-manifest-schema-2-declares-lanes-and-collections.md` - Schema 2 declares the lanes and collections and migrates the five-lane v3.0 layout once (grilling -> sessions/grilling, handoffs -> sessions/checkpoints).
- create `workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md` - Adds workbench/skills as the seventh lane, superseding ADR-0017's six-lane count.
- update `LEXICON.md (Support root row) and templates/LEXICON.md` - Define the lowercase support root and its declared lanes.

**Related:** [V3-1](#v3-1), [V3-11A](#v3-11a), [V3-11C](#v3-11c), [PW-3](#pw-3)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q2

**Notes:** The five-lane answer (v3.0.0, S-021 TK-002) is preserved as history. ADR-0017 (six lanes) was itself superseded by ADR-000M.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:6; workbench/specs/S-021-portable-workbench-v3/SPEC.md; workbench/docs/adr/0032-manifest-schema-2-declares-lanes-and-collections.md; workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md; workbench/docs/adr/archive/0017-workbench-support-directory-has-six-lanes.md

### V3-3

**Topic:** Where custom skills live

**Question:** Where do custom skills live?

**Status:** superseded · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** Generated and adopted projects carry no project-local skill discovery tree. On a brand-new installation only, LLM Workbench supplies a missing required core skill from its tracked skills/ source into user-scoped discovery; an installed skill stays untouched unless the user explicitly requests an update; the private Kayden catalog is not a product dependency. Superseded by PW-3/PW-3A/PW-4 (ADR-000M): core skills ship in every room at workbench/skills with tracked .agents/skills and .claude/skills adapters.

**Reason:** S-021 Why It Matters: the v2.3 product treated its broad local skills catalog as project discovery and tied a public product to Kayden's private machine topology; homework found copying external skills back into projects would recreate the prohibited shadow.

**Result:**

- create `workbench/specs/S-021-portable-workbench-v3/SPEC.md TK-001` - Missing-only install of the core into user-scoped discovery; no project-local discovery tree (historical v3.0 result).
- create `workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md` - Replaces the user-scoped model: core skills live in each room's workbench/skills lane, reached by tracked discovery adapters; personal catalog is backup and publication target only.
- update `workbench/docs/adr/0046-core-personal-shared-and-room-local-skill-ownership.md` - Amended 2026-09-23: 'per-room core copies' became the decision; ownership scopes and one-source-per-skill invariants stay.
- update `LEXICON.md (Core skill bundle, Normal setup rows) and templates/LEXICON.md` - Define the core bundle as carried in the workbench/skills lane.

**Related:** [V3-7](#v3-7), [V3-9](#v3-9), [V3-9A](#v3-9a), [V3-21](#v3-21), [V3-21C](#v3-21c), [V3-22](#v3-22), [PW-3](#pw-3), [PW-3A](#pw-3a), [PW-4](#pw-4)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q3

**Notes:** Intermediate change: S-045 TK-005 (owner decision 2026-09-07) allowed install into a symlinked or Git-owned user root. The 'not a product dependency' clause on the private catalog survives in ADR-000M.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:7; workbench/specs/S-021-portable-workbench-v3/SPEC.md; workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md; workbench/specs/S-00V-portable-workbench/SPEC.md; workbench/docs/adr/0046-core-personal-shared-and-room-local-skill-ownership.md

### V3-4

**Topic:** Genesis, Adoption, update-harness routes

**Question:** Which lifecycle route applies?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** /genesis creates a greenfield Workbench, /adoption migrates an unmanaged existing project once, and /update-harness upgrades an already-adopted project; "none substitutes for another".

**Reason:** Inference: each route has a different starting state and preservation duty (new project, one-time migration of an unmanaged project, upgrade of an adopted one); homework notes Genesis and Adoption are repository templates/protocols with thin command entrypoints.

**Result:**

- create `workbench/docs/adr/0047-preservation-contracts-for-genesis-adoption-and-upgrade.md` - Records a separate preservation contract for each of genesis, adoption and upgrade.
- update `workbench/skills/genesis, workbench/skills/adoption, workbench/skills/update-harness` - Three distinct command entrypoints, one per lifecycle route.
- update `templates/GENESIS.md, templates/ADOPTION.md; RUNBOOK.md (Template Upgrade Release Gate, V3 Adoption migration check, V3 explicit upgrade check)` - Procedures route each lifecycle through its own entrypoint.
- update `README.md` - Public orientation names the three routes.

**Related:** [V3-14](#v3-14), [V3-15](#v3-15), [V3-16](#v3-16)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q4

**Notes:** PW-3A/ADR-000M relocated skill paths from root skills/ to workbench/skills; the route split itself is unchanged.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:8; workbench/specs/S-021-portable-workbench-v3/SPEC.md; workbench/docs/adr/0047-preservation-contracts-for-genesis-adoption-and-upgrade.md

### V3-5

**Topic:** Foundry machinery stays out

**Question:** Which GPT_OS improvements stay out of the portable product?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** FUIDs, Job Orders, flights, Claims, Journal/CAS, Halls, sockets, Captain, CIC, scheduling and runtime visibility remain Foundry augmentation.

**Reason:** Governing constraint from the same session (Q24): make LLM Workbench "good enough, current, and safely reusable in other projects while Foundry finishes; do not redesign it into Foundry or expand optional architecture."

**Result:**

- update `BLUEPRINT.md` - States the portable Workbench does not import Foundry runtime machinery.
- create `workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md` - Workbench supplies the base; Foundry adds coordination.
- create `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md` - Foundry is a downstream extension of the sole Workbench source.
- update `LEXICON.md (Foundry row) and workbench/specs/S-021-portable-workbench-v3/SPEC.md (Non-Goals)` - Foundry defined as downstream extension; S-021 lists these concepts as non-goals.

**Related:** [V3-24](#v3-24), [V3-24B](#v3-24b), [V3-20B](#v3-20b)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q5

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:9; workbench/specs/S-021-portable-workbench-v3/SPEC.md; workbench/docs/adr/0015-workbench-base-and-foundry-capabilities.md; workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md

### V3-6

**Topic:** Final release gate

**Question:** What is the final release gate?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** Verified work reaches public integration; one integration to main PR is left open for Kayden's approval and "is never merged by the implementation agent".

**Reason:** Homework: "The intended final flow remains owner-gated: implementation and audit may prepare the public integration to main PR, but Kayden alone approves or merges it." Repeated as the delivery boundary in Q24C.

**Result:**

- update `AGENTS.md (Git Rules) and templates/AGENTS.md` - Only the owner merges integration into main; agents may merge below integration.
- update `CLAUDE.md` - States the integration target and that only the owner merges integration to main.
- update `workbench/specs/S-014-workbench-release-candidate/SPEC.md` - Records the v3 exact-head integration-to-main promotion PR choreography as historical.

**Related:** [V3-20](#v3-20), [V3-24C](#v3-24c)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q6

**Notes:** The owner-only main merge still holds. The 'one PR left open' choreography is historical to S-014, and release readiness belongs to S-00O; ADR-000F (two QA gates) is a later proposal and changes this answer only if the owner accepts it.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:10; workbench/specs/S-021-portable-workbench-v3/SPEC.md; workbench/specs/S-014-workbench-release-candidate/SPEC.md

### V3-7

**Topic:** No dependency on private skills repo

**Question:** How should the public LLM Workbench behave when [the owner's private skills repository] is private, unavailable, or unauthenticated?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** It must remain fully set up without that repository; "the instruction is to replace confusing bundled/project-local skill copies, not to make Kayden's private catalog mandatory."

**Reason:** Homework: the live external catalog is the private [the owner's private skills repository] repo; Genesis and Adoption do not need it. The owner's intent was to remove confusing skill copies, not to create a private dependency.

**Result:**

- update `BLUEPRINT.md` - A fresh room works without the personal catalog.
- create `workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md` - Personal catalog is only a backup and publication target, never on a room's critical path; doctor never reads it.
- create `workbench/specs/S-021-portable-workbench-v3/SPEC.md (Decisions And Contracts)` - LLM Workbench is not a dependency on [the owner's private skills repository].

**Related:** [V3-7A](#v3-7a), [V3-7B](#v3-7b), [V3-3](#v3-3), [PW-4](#pw-4)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q7

**Notes:** Core answer still holds and is strengthened by PW-4/ADR-000M. Its side remark about replacing project-local skill copies was reversed by PW-3: core skills ship per room in workbench/skills.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:11; workbench/specs/S-021-portable-workbench-v3/SPEC.md; workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md

### V3-7A

**Topic:** Private catalog not required

**Question:** Is the exact private catalog mandatory for completion?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** No. Genesis and Adoption complete from public Workbench-owned templates, tools, and any public Workbench-owned skill package.

**Reason:** Homework: Genesis and Adoption are fundamentally repository templates/protocols and do not require Kayden's private skills catalog.

**Result:**

- update `workbench/skills/README.md` - Documents the public Workbench-owned core skill source that setup uses.
- create `workbench/specs/S-021-portable-workbench-v3/SPEC.md (Acceptance Criteria)` - Source and installed-skill contracts never depend on [the owner's private skills repository].
- create `workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md` - Genesis and Adoption lay the lane down from the release checkout, not a catalog.

**Related:** [V3-7](#v3-7), [V3-7B](#v3-7b), [V3-21](#v3-21)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q7A

**Notes:** PW-3A relocated the package from root skills/ to workbench/skills; the answer is unchanged.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:12; workbench/specs/S-021-portable-workbench-v3/SPEC.md

### V3-7B

**Topic:** No substitute catalog contract

**Question:** May another catalog substitute for Kayden's repository?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** No. "No substitution contract is needed because the public product does not validate or depend on Kayden's catalog at all."

**Reason:** Stated in the answer: the public product never validates or depends on Kayden's catalog, so there is nothing for a substitute to satisfy.

**Result:**

- create `workbench/docs/adr/0046-core-personal-shared-and-room-local-skill-ownership.md` - A fresh room must work without the personal catalog; no catalog substitution contract exists.
- create `workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md` - Doctor never reads the personal catalog.

**Related:** [V3-7](#v3-7), [V3-7A](#v3-7a)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q7B

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:13; workbench/specs/S-021-portable-workbench-v3/SPEC.md

### V3-8

**Topic:** Skill versions bound to release

**Question:** If LLM Workbench ships a Workbench-owned skill package, what compatibility/version contract binds it to the Workbench release?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** The checked-out LLM Workbench release owns the bundled versions. Normal setup is presence-only; an explicitly authorized skill update backs up changed destinations and synchronizes the required core to the exact bundled versions.

**Reason:** Inference from Q22: presence satisfies setup so existing skills are never silently replaced; contents converge only when the user explicitly asks for an update.

**Result:**

- update `LEXICON.md (Core skill bundle, Normal setup, Explicit skill update rows) and templates/LEXICON.md` - Define release-owned core versions and the explicit update that backs up and replaces changed skills.
- update `tools/workbench-skills.mjs; RUNBOOK.md (Skills lane check)` - install/verify/update --explicit-update/rollback with a receipt naming release, commit and per-skill hash.
- update `workbench/manifest.json (skillPolicy)` - Records setup and update policy.

**Related:** [V3-8A](#v3-8a), [V3-8B](#v3-8b), [V3-22](#v3-22), [V3-22C](#v3-22c), [PW-3](#pw-3)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q8

**Notes:** Partly superseded by PW-3/ADR-000M: 'presence-only' normal setup became lane-install (manifest normalSetup: lane-install, updates: workbench-update). Release ownership of versions and the explicit, backed-up update still stand.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:14; workbench/specs/S-021-portable-workbench-v3/SPEC.md; workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md

### V3-8A

**Topic:** Skills version with Workbench

**Question:** Do skill versions move independently?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** No. No separate release dependency is required; the bundled skill sources version with LLM Workbench.

**Reason:** Inference: shipping skills and Workbench together avoids a second release to coordinate (see Q8B, Q13C).

**Result:**

- create `workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md` - The skills lane is owned and versioned by LLM Workbench.
- update `tools/workbench-skills.mjs receipt (.workbench-skills.json)` - Receipt records the source release and commit for each installed core skill.

**Related:** [V3-8](#v3-8), [V3-8B](#v3-8b), [V3-13C](#v3-13c)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q8A

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:15; workbench/specs/S-021-portable-workbench-v3/SPEC.md

### V3-8B

**Topic:** One release ships skills and installer

**Question:** Does one release contain both skill sources and installer behavior?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** Yes, so no second repository or publication gate is required.

**Reason:** Stated in the answer: keeping both in one release removes any second repository or publication gate (reinforced by Q18B: one repository, no [the owner's private skills repository] PR).

**Result:**

- create `workbench/specs/S-021-portable-workbench-v3/SPEC.md (Decisions And Contracts)` - No Forge publication step or private skills-repository change is part of the capability.
- update `workbench/skills and tools/workbench-skills.mjs` - Skill sources and installer ship in the same LLM Workbench release.

**Related:** [V3-8](#v3-8), [V3-8A](#v3-8a), [V3-13C](#v3-13c), [V3-18B](#v3-18b)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q8B

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:16; workbench/specs/S-021-portable-workbench-v3/SPEC.md

### V3-9

**Topic:** What the setup skill check proves

**Question:** What exactly must the normal installed-skill check prove, and what must it never mutate?

**Status:** superseded · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** It proves every required core skill name is discoverable at user scope and that generated/adopted projects do not shadow them locally; it ignores unrelated catalogs and does not compare existing skill contents during normal setup. Superseded by PW-3 (ADR-000M): the check reads the room's workbench/skills lane and its adapters, never the provider home.

**Reason:** Q22: ordinary setup is additive and fail-closed, so it checks presence only and never alters existing skills.

**Result:**

- create `workbench/specs/S-021-portable-workbench-v3/SPEC.md TK-001` - Historical v3.0 presence-only user-scope check.
- update `RUNBOOK.md (Skills lane check); tools/workbench-skills.mjs verify` - Current check: lane and adapters, skill-lane-missing / skills-receipt-drift findings.
- create `workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md` - Doctor reads the lane and adapters, never the provider home; a root skills/ is a shadow finding.

**Related:** [V3-9A](#v3-9a), [V3-9B](#v3-9b), [V3-9C](#v3-9c), [V3-22](#v3-22), [V3-22B](#v3-22b), [PW-3](#pw-3)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q9

**Notes:** The 'ignore unrelated catalogs' part survives (doctor never reads the personal catalog).

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:17; workbench/specs/S-021-portable-workbench-v3/SPEC.md; workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md

### V3-9A

**Topic:** Identities checked by setup

**Question:** What identities and bindings are checked?

**Status:** superseded · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** Required Workbench-owned names, user-scoped Codex/Claude discovery, and absence of project-local shadows; no remote identity or Kayden catalog check. Superseded by PW-3 (ADR-000M): discovery is the tracked .agents/skills and .claude/skills adapters into the in-room workbench/skills lane.

**Reason:** Inference from Q3 and Q7: user-scope discovery avoided project-local copies and a private-catalog dependency.

**Result:**

- update `workbench/manifest.json (skillPolicy.required, discovery)` - Lists required names and the two in-room discovery roots, .agents/skills and .claude/skills.
- create `workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md` - Tracked adapters into the lane replace user-scoped discovery.

**Related:** [V3-9](#v3-9), [V3-3](#v3-3), [PW-3](#pw-3)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q9A

**Notes:** No Kayden catalog check still holds.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:18; workbench/specs/S-021-portable-workbench-v3/SPEC.md; workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md

### V3-9B

**Topic:** Modified skills do not block setup

**Question:** Do locally modified installed skills warn or block normal setup?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** No content comparison occurs in normal setup; explicit skill update is the synchronization boundary.

**Reason:** Q22B: "Presence satisfies setup; contents are compared only during an explicitly requested update."

**Result:**

- update `LEXICON.md (Normal setup, Explicit skill update rows) and templates/LEXICON.md` - Setup never replaces content; only the explicit update does.
- update `RUNBOOK.md (Skills lane check)` - update requires --explicit-update and backs up changed core skills.

**Related:** [V3-9](#v3-9), [V3-22B](#v3-22b), [V3-22C](#v3-22c)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q9B

**Notes:** Context changed under PW-3/ADR-000M: installed skills sit in the tracked lane with a per-skill hash receipt, and verify/doctor report modified core skills (skills-receipt-drift; earlier skill-content-modified as a non-blocking attention finding). Replacement happens only through the explicit update.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:19; workbench/specs/S-021-portable-workbench-v3/SPEC.md; workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md

### V3-9C

**Topic:** What normal setup may mutate

**Question:** What may normal setup mutate?

**Status:** superseded · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** It may install a missing bundled skill only into an absent or Workbench-managed destination. Foreign Git roots, existing same-named skills, credentials, unrelated catalogs and repository checkouts remain untouched; blocked installation gets exact remediation. Superseded first by S-045 TK-005 (owner decision 2026-09-07: symlinked or Git-owned discovery roots are supported, written without Git operations), then by PW-3 (ADR-000M: install writes into the room's lane).

**Reason:** Q22: ordinary setup is additive and fail-closed; homework showed ~/.claude/skills and ~/.codex/skills resolve to the owner's private Git checkout, which setup must not alter.

**Result:**

- update `tools/core-skill-installer.mjs` - Limited to separately authorized catalog publication; per S-045 it installs missing skills into a linked or Git-owned root without add/commit/stash.
- update `tools/workbench-skills.mjs install; RUNBOOK.md (Skills lane check)` - Refuses an existing receipt, an unreceipted core name, or a colliding discovery root (adapter-collision).
- create `workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md` - Lane install never touches room-added skills or the provider home.

**Related:** [V3-9](#v3-9), [V3-22](#v3-22), [V3-22A](#v3-22a), [PW-3](#pw-3)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q9C

**Notes:** Never replacing existing same-named skills and giving exact remediation still hold in the lane model.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:20; workbench/specs/S-021-portable-workbench-v3/SPEC.md; workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md; workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md

### V3-10

**Topic:** Manifest is the single authority

**Question:** What exact manifest format and authority contract should the new layout use?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** Committed workbench/manifest.json is the single machine-readable authority; copied document stamps remain human-readable projections and must agree with it.

**Reason:** Inference: one machine-readable source prevents path and version drift between tools and documents (S-021 Desired Behavior: human-readable version stamps agree with the manifest).

**Result:**

- create `workbench/manifest.json` - Single machine-readable authority for layout, version, provenance and skill policy.
- create `workbench/tools/workbench-layout.mjs` - Validates the manifest and resolves support paths through it.
- create `workbench/docs/adr/0032-manifest-schema-2-declares-lanes-and-collections.md` - Schema 2: all consumers resolve paths through one reader.

**Related:** [V3-10A](#v3-10a), [V3-10B](#v3-10b), [V3-10C](#v3-10c), [V3-12C](#v3-12c)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q10

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:21; workbench/specs/S-021-portable-workbench-v3/SPEC.md; workbench/docs/adr/0032-manifest-schema-2-declares-lanes-and-collections.md

### V3-10A

**Topic:** Required manifest base fields

**Question:** Which base fields are required?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** Manifest schema version, LLM Workbench version, Genesis/Adoption/upgrade provenance, and the canonical support-lane paths.

**Reason:** Not recorded.

**Result:**

- update `workbench/manifest.json` - Carries schemaVersion, workbenchVersion, provenance and lanes.
- create `workbench/tools/workbench-layout.mjs` - Rejects a manifest missing or mis-stating required fields.
- create `workbench/docs/adr/0032-manifest-schema-2-declares-lanes-and-collections.md` - Schema 2 adds collections and exact source release/commit provenance.

**Related:** [V3-10](#v3-10), [V3-2](#v3-2)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q10A

**Notes:** Schema 2 (ADR-0032) extended the field set (collections, source release and commit, git branches, workbenchId); the base fields remain.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:22; workbench/specs/S-021-portable-workbench-v3/SPEC.md; workbench/docs/adr/0032-manifest-schema-2-declares-lanes-and-collections.md

### V3-10B

**Topic:** Skill contract in manifest

**Question:** What skill contract is recorded?

**Status:** superseded · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** The 12 required Workbench-owned skill names plus user-scoped installation, presence-only normal setup, and explicit-update synchronization policies. Superseded: the required list grew to 21 through later owner-approved specs (S-046, S-050, S-051), and PW-3 (ADR-000M) replaced user-scoped, presence-only policy with lane-install and workbench-update.

**Reason:** Inference: recording the skill policy in the manifest lets tools check it mechanically (Q10: the manifest is the single machine-readable authority).

**Result:**

- update `workbench/manifest.json (skillPolicy)` - required (21 names), discovery (.agents/skills, .claude/skills), normalSetup: lane-install, updates: workbench-update.
- create `workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md` - Reshapes skillPolicy for the in-room lane.
- update `LEXICON.md (Core skill bundle row) and templates/LEXICON.md` - Counts the bundle from the manifest.

**Related:** [V3-10](#v3-10), [V3-13A](#v3-13a), [V3-21B](#v3-21b), [PW-3](#pw-3)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q10B

**Notes:** The idea that the manifest records the skill contract is unchanged; its contents changed.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:23; workbench/specs/S-021-portable-workbench-v3/SPEC.md; workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md

### V3-10C

**Topic:** Only small bounded tools

**Question:** Which small, bounded tools are justified?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** Keep spec-workbench.mjs focused and manifest-aware; retain the source-catalog test; add only a layout/manifest check and a bounded installed-skill check/install/update helper. Each markdown procedure invokes only its relevant mechanical check; "there is no umbrella lifecycle program."

**Reason:** Q23 and homework: guidebook-first; .mjs tools only for narrow deterministic checks, because the owner "prefers chunked procedures that limit agent context and cognitive load."

**Result:**

- update `workbench/tools/spec-workbench.mjs` - Stays bounded to spec/task mechanics and resolves paths through the manifest.
- create `workbench/tools/workbench-layout.mjs; tools/test-skill-catalog.mjs` - Layout/manifest check and retained catalog test.
- create `tools/core-skill-installer.mjs (later tools/workbench-skills.mjs)` - Bounded skill check/install/update helper.
- update `AGENTS.md and RUNBOOK.md` - Procedures stay in Markdown and call only their relevant check.

**Related:** [V3-23](#v3-23), [V3-23A](#v3-23a), [V3-23B](#v3-23b)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q10C

**Notes:** Later specs may add more narrow tools (e.g. workbench-tools.mjs, self-drift.mjs, workbench-skills.mjs); none may be an umbrella lifecycle program.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:24; workbench/specs/S-021-portable-workbench-v3/SPEC.md

### V3-11

**Topic:** Tracked versus local support lanes

**Question:** Which support lanes are tracked, local-only, append-only, or archival?

**Status:** superseded · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** The manifest, specs, Wiki, feedback and explicit recovery checkpoints are tracked durable records; provisional conversational state stays local until deliberately checkpointed or promoted. Superseded by ADR-0054 and S-048: checkpoint copies are retired and selected material is promoted directly into its durable owner; PW (S-00V) further lets notes and handoffs be committed temporarily as transport.

**Reason:** Inference: durable records need to be recoverable from Git, while provisional conversation state should not become evidence until deliberately reviewed.

**Result:**

- create `workbench/docs/adr/0028-live-session-records-stay-untracked-and-checkpoints-are-durable.md` - Live session records stay untracked; durable references target promoted copies (narrowed in v3.2.0).
- create `workbench/docs/adr/0054-direct-promotion-into-durable-owners.md` - Direct promotion into durable owners; existing checkpoints frozen as history.
- create `workbench/specs/S-048-checkpoint-retirement/SPEC.md` - Retires checkpoint creation and migrates active consumers.
- update `AGENTS.md (Session Records And Checkpoints) and templates/AGENTS.md` - Live notes and handoffs stay untracked; promote into owners.

**Related:** [V3-11A](#v3-11a), [V3-11B](#v3-11b), [V3-11C](#v3-11c), [PW-5](#pw-5)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q11

**Notes:** Tracked status of manifest, specs, Wiki and feedback still holds.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:25; workbench/specs/S-021-portable-workbench-v3/SPEC.md; workbench/docs/adr/0028-live-session-records-stay-untracked-and-checkpoints-are-durable.md; workbench/docs/adr/0054-direct-promotion-into-durable-owners.md; workbench/specs/S-048-checkpoint-retirement/SPEC.md

### V3-11A

**Topic:** Which lanes are tracked

**Question:** Which lanes are tracked?

**Status:** superseded · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** workbench/specs/, workbench/wiki/ and workbench/feedback/ are tracked; durable checkpoint handoffs are tracked under [the retired v3.0 handoffs lane]. Superseded by ADR-0032 (handoff checkpoints moved to sessions/checkpoints; sessions/handoffs untracked) and then ADR-0054/S-048 (no new checkpoints).

**Reason:** Inference: durable records must survive a clone; checkpoints were then the chosen durable form of session records.

**Result:**

- create `workbench/docs/adr/0032-manifest-schema-2-declares-lanes-and-collections.md` - Maps tracked v3.0 handoffs checkpoints to sessions/checkpoints.
- create `workbench/docs/adr/0054-direct-promotion-into-durable-owners.md; workbench/specs/S-048-checkpoint-retirement/SPEC.md` - Freezes checkpoints as history; no new checkpoint promotions.
- update `workbench/sessions/.gitignore (written by workbench/tools/workbench-layout.mjs)` - Keeps grilling, handoffs, notepads and recovery local.

**Related:** [V3-11](#v3-11), [V3-11B](#v3-11b), [V3-2](#v3-2)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q11A

**Notes:** specs, wiki and feedback remain tracked.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:26; workbench/specs/S-021-portable-workbench-v3/SPEC.md; workbench/docs/adr/0032-manifest-schema-2-declares-lanes-and-collections.md; workbench/docs/adr/0054-direct-promotion-into-durable-owners.md

### V3-11B

**Topic:** Local grilling and checkpoint copies

**Question:** Which records remain local?

**Status:** superseded · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** Live grilling records remain local provisional Intent. /checkpoint copies the needed record into the tracked handoff lane; ordinary transient handoff state is not promoted automatically. Superseded by ADR-0054 and S-048: /checkpoint copying is retired and settled claims are promoted directly into owners.

**Reason:** Inference: grilling records are provisional until the owner's decisions are deliberately captured, so they should not be tracked by default.

**Result:**

- create `workbench/specs/S-048-checkpoint-retirement/SPEC.md` - Retires new checkpoint copies; the checkpoint skill explains the retired workflow and routes to notepads or direct promotion.
- create `workbench/docs/adr/0054-direct-promotion-into-durable-owners.md` - Direct promotion into durable owners.
- create `workbench/docs/adr/0040-json-notepads-preserve-objective-continuity.md` - Live grilling records become local JSON notepads.

**Related:** [V3-11](#v3-11), [V3-11A](#v3-11a), [V3-13B](#v3-13b)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q11B

**Notes:** Live grilling state staying local still holds (AGENTS.md), narrowed by S-00V letting notes be committed temporarily as transport.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:27; workbench/specs/S-021-portable-workbench-v3/SPEC.md; workbench/specs/S-048-checkpoint-retirement/SPEC.md; workbench/docs/adr/0054-direct-promotion-into-durable-owners.md

### V3-11C

**Topic:** Empty lanes kept by placeholder

**Question:** How are declared empty lanes preserved?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** The manifest declares every lane and a minimal tracked placeholder preserves any required empty directory "without implying that a record exists".

**Reason:** Inference: Git does not keep empty directories, so a placeholder keeps the declared slot present in every clone. ADR-0017 later framed an empty lane as "a slot rather than an unkept promise."

**Result:**

- update `workbench/manifest.json` - Declares every lane and collection.
- update `workbench/tools/workbench-layout.mjs` - Writes .gitkeep placeholders and ignores them when counting records.
- create `workbench/docs/adr/0032-manifest-schema-2-declares-lanes-and-collections.md` - Schema 2 declares lanes and collections whether or not they hold records.

**Related:** [V3-2](#v3-2), [V3-11](#v3-11), [V3-15A](#v3-15a)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q11C

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:28; workbench/specs/S-021-portable-workbench-v3/SPEC.md; workbench/docs/adr/0032-manifest-schema-2-declares-lanes-and-collections.md

### V3-12

**Topic:** Layout move is v3

**Question:** What release and migration boundary applies?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021 the same day)

**Answer:** Treat the breaking support-path move as LLM Workbench v3 while keeping the implementation limited to this portable layout contract.

**Reason:** Q12A: "Moving stable support paths and changing skill installation ownership is a major layout contract."

**Result:**

- create `workbench/specs/S-021-portable-workbench-v3/SPEC.md` - Records the v3 capability: v3.0.0 with a dogfooded workbench/ support root.
- update `README.md` - Publishes the v3 setup contract.

**Related:** [V3-12A](#v3-12a), [V3-12B](#v3-12b), [V3-12C](#v3-12c), [V3-24](#v3-24)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q12

**Notes:** Historical release decision; later versions belong to later specs (v4.0.0 to S-00O).

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:29; workbench/specs/S-021-portable-workbench-v3/SPEC.md

### V3-12A

**Topic:** v3 is a major version

**Question:** Is this v3?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling Q12A

**Answer:** Yes. "Moving stable support paths and changing skill installation ownership is a major layout contract."

**Reason:** The answer states it: moving stable support paths and changing who owns skill installation is a breaking layout contract, so it earns a major version.

**Result:**

- update `workbench/specs/S-021-portable-workbench-v3/SPEC.md (Decisions And Contracts)` - Records that the breaking stable-path change is v3 and that Genesis creates only v3.
- update `LEXICON.md (v3.0.0 row)` - Defines v3.0.0 as the portable-layout candidate (S-021).
- update `workbench/manifest.json` - workbenchVersion carries a v3 label.

**Related:** [V3-12](#v3-12), [V3-12B](#v3-12b), [V3-12C](#v3-12c)

**Aliases:** v3 layout grilling Q12A

**Notes:** Later stamps (v3.1.x, v3.2.x) continue the v3 line per the Lexicon.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:30

### V3-12B

**Topic:** Dogfood the v3 layout here

**Question:** Does this repository dogfood the layout?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling Q12B

**Answer:** Yes. Move this repository's own affected durable support records under workbench/ with Git history preserved, "so the published source proves the same contract it generates."

**Reason:** Stated in the answer: the published source should prove the same contract it generates.

**Result:**

- update `workbench/specs/S-021-portable-workbench-v3/SPEC.md TK-006` - This repo moves its support records under workbench/ with history preserved and dogfoods v3.
- create `workbench/manifest.json` - This repo carries its own manifest-backed workbench/ support root.
- create `tools/test-workbench-dogfood.mjs` - Asserts the manifest exists, root specs/ is gone, and specs live under workbench/specs/.

**Related:** [V3-12](#v3-12), [V3-12A](#v3-12a), [V3-12C](#v3-12c)

**Aliases:** v3 layout grilling Q12B

**Notes:** Matches the standing AGENTS.md dogfood boundary (root is real, templates/ is the blank product). PW-3A later extended the same dogfood logic to move root skills/ into workbench/skills.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:31

### V3-12C

**Topic:** No permanent dual paths

**Question:** Is there permanent dual-path support?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling Q12C

**Answer:** No. Genesis writes only v3 paths; Adoption and update recognize legacy inputs during a one-time migration, then the manifest becomes the sole path authority.

**Reason:** Inference: S-021 records "Permanent dual sources are forbidden"; two live path sets would let records drift apart and confuse which path is true.

**Result:**

- update `workbench/specs/S-021-portable-workbench-v3/SPEC.md (Decisions And Contracts)` - Forbids permanent dual sources; Adoption and upgrades perform one migration.
- update `workbench/tools/workbench-layout.mjs` - init writes only the current layout; an older manifest is reported as needing a one-time migrate.
- create `tools/workbench-adoption.mjs` - Recognizes legacy lanes (specs, Wiki, feedback, grilling diary, handoffs) once and moves them.
- create `tools/workbench-upgrade.mjs` - Moves a v2-root room onto the v3 support root once.

**Related:** [V3-12](#v3-12), [V3-10](#v3-10), [V3-16](#v3-16)

**Aliases:** v3 layout grilling Q12C

**Notes:** ADR-0032 (manifest schema 2) reused the same pattern: schema 1 is upgrade-required with one lossless migration, not accepted as current.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:32

### V3-13

**Topic:** Core skills read the manifest

**Question:** Which bundled core skills become manifest-aware?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling Q13

**Answer:** Every one of the 12 core skills resolves any project support path through workbench/manifest.json; a skill that does not touch support records remains behaviorally unchanged.

**Reason:** Inference from the grilling homework: the skills hard-coded old record paths, so a new layout could not work end-to-end until they learned the manifest.

**Result:**

- update `workbench/specs/S-021-portable-workbench-v3/SPEC.md TK-005` - The planning-to-delivery core skills resolve every support path through the manifest.
- create `workbench/tools/workbench-paths.mjs` - One reader through which consumers resolve lanes and collections; nothing hardcodes a support path.
- update `tools/test-skill-catalog.mjs` - Checks core skills name manifest authority for support paths.
- update `RUNBOOK.md (V3 support-root check)` - States that every consumer resolves lanes and collections through the manifest reader.

**Related:** [V3-13A](#v3-13a), [V3-10](#v3-10), [V3-21B](#v3-21b)

**Aliases:** v3 layout grilling Q13

**Notes:** The principle stands; the count does not. The S-051 owner waiver (2026-09-09) permits a 21-skill core, ADR-000H renamed to-tickets to to-tasks, and ADR-000M places the skills in workbench/skills.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:33

### V3-13A

**Topic:** The 12 named core skills

**Question:** Which named skills are in scope?

**Status:** superseded · answered 2026-08-31, v3 layout and shared-skills grilling Q13A

**Answer:** genesis, adoption, update-harness, grilling, checkpoint, make-it-so, to-docs, to-spec, to-tickets, tracer-bullet, implement, and code-review; handoff and unrelated feedback/router skills are outside the 12-skill release. Superseded by the S-051 owner waiver (2026-09-09) permitting a 21-skill core including handoff, and by ADR-000H renaming to-tickets to to-tasks.

**Reason:** Recorded in the homework: grilling closes over checkpoint, make-it-so, to-docs, to-spec, to-tickets, tracer-bullet, implement and code-review; adding the three setup entrypoints gives 12. Router skills stay optional.

**Result:**

- update `workbench/specs/S-021-portable-workbench-v3/SPEC.md` - Original contract: exactly the 12 locked core skills (historical).
- update `workbench/manifest.json (required core skills)` - Lists the 21-skill core: the 12 with to-tasks, plus carry, notepad, save, promote, handoff and the four stances.
- update `workbench/specs/S-051-core-skill-ownership-and-compatibility/SPEC.md (Decisions And Contracts)` - Owner waiver keeps v3.2.0 while permitting the 21-skill core including handoff.
- update `LEXICON.md (Core skill bundle row)` - Defines the core as seventeen workflow skills and four stance skills counted from the manifest.

**Related:** [V3-13](#v3-13), [V3-21B](#v3-21b), [V3-13B](#v3-13b)

**Aliases:** v3 layout grilling Q13A

**Notes:** Also the same list as V3-21B. checkpoint stays in the required core, but S-048 retired its checkpoint collection.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:34; workbench/specs/S-051-core-skill-ownership-and-compatibility/SPEC.md:61

### V3-13B

**Topic:** Generic handoff outside the core

**Question:** Does generic /handoff change?

**Status:** superseded · answered 2026-08-31, v3 layout and shared-skills grilling Q13B (recorded as deferred)

**Answer:** No in this release. Its host-level transient lane remains outside the portable core; [the retired v3.0 handoffs lane] is used by the bundled checkpoint/recovery contract. Superseded: handoff joined the required core under the S-051 owner waiver (2026-09-09), handoffs became untracked Markdown in workbench/sessions/handoffs, and the tracked [the retired v3.0 handoffs lane] lane was retired.

**Reason:** Recorded in the answer: the handoff skill's host-level transient lane was outside the portable 12-skill core for v3.

**Result:**

- update `workbench/specs/S-021-portable-workbench-v3/SPEC.md (Remaining Limitations)` - Lists generic /handoff as deferred and not blocking v3.
- update `workbench/specs/S-051-core-skill-ownership-and-compatibility/SPEC.md` - Adds handoff to the required core as a bundled skill.
- update `workbench/docs/adr/0032-manifest-schema-2-declares-lanes-and-collections.md` - Maps the old tracked handoffs lane to sessions/checkpoints and declares a sessions/handoffs collection.
- update `AGENTS.md (Session Records And Checkpoints) and templates/AGENTS.md` - Handoffs are human-readable Markdown in the handoffs collection, untracked in project Git.

**Related:** [V3-13A](#v3-13a), [V3-11A](#v3-11a), [V3-11B](#v3-11b)

**Aliases:** v3 layout grilling Q13B

**Notes:** Source marks this [deferred] though it states a firm "no" for v3. Checkpoints themselves were later retired (S-048) and are frozen history.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:35; workbench/specs/S-051-core-skill-ownership-and-compatibility/SPEC.md:61

### V3-13C

**Topic:** Skills and layout ship together

**Question:** How do skill and layout changes ship?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling Q13C

**Answer:** Together in the same LLM Workbench v3 candidate so no external skills-repository dependency exists.

**Reason:** Stated in the answer: shipping both in one candidate avoids any dependency on an external skills repository.

**Result:**

- update `workbench/specs/S-021-portable-workbench-v3/SPEC.md (Decisions And Contracts)` - No Forge publication step or private skills-repository change is part of the capability; skills and layout land in one candidate.

**Related:** [V3-8B](#v3-8b), [V3-18B](#v3-18b), [V3-7](#v3-7)

**Aliases:** v3 layout grilling Q13C

**Notes:** Historical delivery decision for the v3 candidate; the one-release principle continues under ADR-000M, where the release owns and versions the skills lane.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:36

### V3-14

**Topic:** What Adoption produces

**Question:** What must /adoption produce?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling Q14

**Answer:** A lossless, manifest-backed v3 Workbench for an existing project, preserving project truth and history while removing only proven obsolete local shadows.

**Reason:** Inference: Adoption migrates a live project once, so losing its records, history or truth would be unrecoverable; only proven shadows may go.

**Result:**

- update `templates/ADOPTION.md` - Adoption migrates an existing project onto the manifest-backed support root without losing records or history.
- create `tools/workbench-adoption.mjs` - Bounded migrate seam that moves known records, refuses collisions, and writes a recovery record.
- update `RUNBOOK.md (V3 Adoption migration check)` - Documents the Adoption migration and its checks.
- update `workbench/specs/S-021-portable-workbench-v3/SPEC.md TK-003` - Lossless Adoption of one mixed existing project.

**Related:** [V3-14A](#v3-14a), [V3-14B](#v3-14b), [V3-4](#v3-4)

**Aliases:** v3 layout grilling Q14

**Notes:** ADR-0047 later restated the preservation contract for Genesis, Adoption and upgrade.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:37

### V3-14A

**Topic:** Migrating mixed inputs

**Question:** How are mixed inputs migrated?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling Q14A

**Answer:** Inventory and classify first; preserve durable specs, Wiki, feedback, and checkpoints; move known records with history where practical; stop on conflicting destinations or unclear ownership instead of overwriting.

**Reason:** Inference: stopping on conflicts instead of overwriting is what keeps Adoption lossless (V3-14).

**Result:**

- update `templates/ADOPTION.md` - Inventory and classify before migrating; stop and reconcile collisions instead of overwriting.
- update `tools/workbench-adoption.mjs` - Legacy lane table; refuses an existing support root or any legacy collision before mutation.
- update `RUNBOOK.md (V3 Adoption migration check)` - States the command refuses collisions before mutation.

**Related:** [V3-14](#v3-14), [V3-14B](#v3-14b)

**Aliases:** v3 layout grilling Q14A

**Notes:** Legacy handoffs/checkpoints go to the frozen workbench/sessions/checkpoints collection; S-048 retired checkpoints as a live capability. S-044 adds a separate classification step before migration.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:38

### V3-14B

**Topic:** When legacy local skills retire

**Question:** When may legacy project-local skills be removed?

**Status:** superseded · answered 2026-08-31, v3 layout and shared-skills grilling Q14B

**Answer:** Only after every required core skill is present in user-scoped discovery and the old folder is backed up or recoverable; existing user-scoped skills are never replaced during ordinary Adoption. Superseded in part by PW-3/PW-3A (ADR-000M): Adoption lays the core into the room's workbench/skills lane, so user-scoped presence is not the gate.

**Reason:** Inference: removing local skills before a replacement is discoverable would leave the project with no working skills; backup keeps removal recoverable.

**Result:**

- update `tools/workbench-adoption.mjs` - Lays the skills lane down and preserves a legacy root skills/ as workbench/sessions/recovery/adoption-legacy-skills.
- update `templates/ADOPTION.md` - Adoption installs core skills into workbench/skills and never reads or writes skills in the user home.
- create `workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md` - Core skills ship in the room lane; a root skills/ is a doctor finding.

**Related:** [V3-14](#v3-14), [V3-9C](#v3-9c), [V3-22](#v3-22), [PW-3](#pw-3), [PW-3A](#pw-3a)

**Aliases:** v3 layout grilling Q14B

**Notes:** The "back up or keep recoverable" half and "never replace existing user-scoped skills" still hold (Adoption must not touch the provider home at all). Only the user-scoped presence gate was replaced. Owner decisions PW-3/PW-3A/PW-4 (2026-09-22, ADR-000M, S-00V TK-001) place the core skills in each room's tracked workbench/skills lane; Genesis, Adoption and upgrade lay the lane down and never read or gate on the provider home.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:39; workbench/sessions/notepads/grilling/portable-workbench-cloud-deployable-2026-09-22.json#decision-003; workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md

### V3-15

**Topic:** What Genesis produces

**Question:** What must /genesis produce?

**Status:** superseded · answered 2026-08-31, v3 layout and shared-skills grilling Q15; supersession recorded 2026-09-23 gap triage

**Answer:** A greenfield project with the seven filled root controls, a valid workbench/manifest.json, declared support lanes, user-scoped core-skill presence, and its first spec under workbench/specs/. Superseded in part: Genesis lays down the workbench/skills lane (S-00V, ADR-000M), so user-scoped skill presence is not a Genesis concern.

**Reason:** Inference: a greenfield project should be ready to work on first run, with controls, support root, skills and a first spec in place.

**Result:**

- update `templates/GENESIS.md` - Genesis produces the seven filled controls, manifest, declared lanes including workbench/skills with receipt and discovery adapters, and a first spec.
- update `workbench/tools/workbench-layout.mjs (validate --genesis)` - Readiness requires filled controls, manifest, first spec, tools receipt and a resolving skills lane.
- update `workbench/specs/S-021-portable-workbench-v3/SPEC.md TK-002` - Fresh Genesis (historical v3 slice).
- create `workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md` - Genesis readiness fails closed on a missing lane receipt or a broken discovery adapter.

**Related:** [V3-15A](#v3-15a), [V3-15B](#v3-15b), [V3-1](#v3-1), [V3-2](#v3-2), [PW-3A](#pw-3a)

**Aliases:** v3 layout grilling Q15

**Notes:** The seven-control, manifest, lanes and first-spec parts still stand. The 2026-09-23 gap triage recorded the user-scoped presence part as superseded. Owner decisions PW-3/PW-3A/PW-4 (2026-09-22, ADR-000M, S-00V TK-001) place the core skills in each room's tracked workbench/skills lane; Genesis, Adoption and upgrade lay the lane down and never read or gate on the provider home.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:40; workbench/sessions/handoffs/destination-audit-gap-triage-2026-09-23.md:90

### V3-15A

**Topic:** What exists right after Genesis

**Question:** What exists immediately?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling Q15A

**Answer:** Manifest and required lane directories exist; the first durable spec is created; lanes without records remain explicitly empty.

**Reason:** Inference: consistent with V3-11C, a declared empty lane is kept visible without pretending a record exists.

**Result:**

- update `workbench/tools/workbench-layout.mjs (init)` - Writes the manifest and every lane and collection, adding a placeholder to an empty directory.
- update `templates/GENESIS.md` - Lanes without records stay declared and empty; the first spec is created under workbench/specs/.
- update `RUNBOOK.md (V3 support-root check)` - Readiness requires one actionable first spec at its manifest-declared path.

**Related:** [V3-15](#v3-15), [V3-11C](#v3-11c)

**Aliases:** v3 layout grilling Q15A

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:41

### V3-15B

**Topic:** Genesis when a skill cannot install

**Question:** What happens when a missing skill cannot be installed safely?

**Status:** superseded · answered 2026-08-31, v3 layout and shared-skills grilling Q15B; supersession recorded 2026-09-23 gap triage

**Answer:** Genesis records a truthful recoverable partial scaffold and stops incomplete with exact remediation rather than claiming readiness. Superseded: Genesis lays the workbench/skills lane down from the release (S-00V, ADR-000M), so a provider-home skill install is not part of Genesis.

**Reason:** Stated in the answer: never claim readiness that was not reached; leave a recoverable result and exact remediation.

**Result:**

- update `workbench/specs/S-021-portable-workbench-v3/SPEC.md (Desired Behavior)` - A blocked skill installation or path collision leaves a truthful recoverable partial result with exact remediation.
- create `tools/core-skill-installer.mjs` - Reports blocked or partial status with remediation text.
- create `workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md` - Genesis readiness fails closed on a missing lane receipt or broken adapter instead.

**Related:** [V3-15](#v3-15), [V3-9C](#v3-9c), [V3-22](#v3-22), [PW-3](#pw-3)

**Aliases:** v3 layout grilling Q15B

**Notes:** The truthful-partial-result principle still applies to lane and adapter failures. The 2026-09-23 gap triage recorded the provider-home install part as superseded.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:42; workbench/sessions/handoffs/destination-audit-gap-triage-2026-09-23.md:90

### V3-16

**Topic:** What the v2-to-v3 update produces

**Question:** What must /update-harness produce for an existing v2 Workbench?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling Q16

**Answer:** A one-time, recoverable v3 migration using the same manifest, path, and missing-only skill rules as Adoption.

**Reason:** Inference: one migration rule set shared with Adoption avoids two diverging paths onto v3.

**Result:**

- create `tools/workbench-upgrade.mjs` - One command moves a v2-root room onto the v3 support root through the Adoption seam and records upgrade provenance.
- update `RUNBOOK.md (V3 explicit upgrade and recovery check)` - Documents the one-time upgrade and its two modes.
- update `workbench/skills/update-harness/SKILL.md` - Upgrade guidance routes v2 rooms through the one-time migration.
- update `workbench/specs/S-021-portable-workbench-v3/SPEC.md TK-004` - Explicit v2 upgrade with recovery.

**Related:** [V3-16A](#v3-16a), [V3-16B](#v3-16b), [V3-14](#v3-14), [V3-4](#v3-4)

**Aliases:** v3 layout grilling Q16

**Notes:** The "missing-only skill rules" part changed: under ADR-000M (PW-3) both upgrade modes lay the skills lane down and never read or replace the provider home.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:43

### V3-16A

**Topic:** What the v3 update changes

**Question:** What changes?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling Q16A

**Answer:** Move affected durable records, update links/tools/scopes, remove legacy local skill shadows only after the presence gate, and retain the migration result in the owning spec evidence.

**Reason:** Not recorded beyond the answer. Inference: follows the Adoption rules in V3-14B and keeps proof in the spec.

**Result:**

- update `tools/workbench-upgrade.mjs` - Migrates legacy lanes once through the Adoption seam and installs the tools and skills lane.
- update `RUNBOOK.md (V3 explicit upgrade and recovery check)` - Describes what the upgrade moves and records.
- update `workbench/specs/S-021-portable-workbench-v3/SPEC.md (evidence log)` - Holds the migration result as spec evidence.

**Related:** [V3-16](#v3-16), [V3-14B](#v3-14b)

**Aliases:** v3 layout grilling Q16A

**Notes:** The "presence gate" clause is superseded by ADR-000M (PW-3): the upgrade lays down workbench/skills and does not gate on user-scoped presence.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:44

### V3-16B

**Topic:** Recovery proof for the v3 update

**Question:** What recovery proof is required?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling Q16B

**Answer:** Record the pre-migration Git recovery point, preserve or back up every retired path before removal, verify the new paths and references, and leave no unattributed dirty residue.

**Reason:** Inference: S-021 says the pre-migration SHA, path inventory and backup "make rollback concrete".

**Result:**

- update `tools/workbench-upgrade.mjs` - Refuses a dirty or unrecoverable project and writes upgrade-recovery.json with the pre-migration SHA and path inventory.
- update `RUNBOOK.md (V3 explicit upgrade and recovery check)` - Records the pre-migration SHA, tracked path inventory and tools receipt.
- update `workbench/specs/S-021-portable-workbench-v3/SPEC.md TK-004` - Retired paths disappear only after new-path readback; rollback is proven.

**Related:** [V3-16](#v3-16), [V3-14A](#v3-14a)

**Aliases:** v3 layout grilling Q16B

**Notes:** Recovery records belong in the ignored workbench/sessions/recovery/ collection.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:45

### V3-17

**Topic:** Acceptance for v3

**Question:** What acceptance is required?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling Q17

**Answer:** Focused red/green fixtures plus real Genesis and Adoption exercises prove the portable contract; the v2 upgrade path receives its own migration fixture.

**Reason:** Inference: follows the AGENTS.md red/green TDD rule and the need to prove each lifecycle route separately.

**Result:**

- update `workbench/specs/S-021-portable-workbench-v3/SPEC.md (Acceptance Criteria, Testing Seams, Verification Procedure)` - Names the red/green fixtures and the fresh Genesis, mixed Adoption and v2 update exercises.
- create `tools/test-workbench-layout.mjs, tools/test-workbench-adoption.mjs, tools/test-workbench-upgrade.mjs` - Focused fixtures for Genesis, Adoption and the v2 upgrade.

**Related:** [V3-17A](#v3-17a), [V3-17B](#v3-17b), [V3-17C](#v3-17c), [V3-17D](#v3-17d)

**Aliases:** v3 layout grilling Q17

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:46

### V3-17A

**Topic:** Mandatory synthetic test cases

**Question:** Which synthetic cases are mandatory?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling Q17A

**Answer:** Valid and invalid manifests, legacy-path migration, missing-skill install, existing-skill preservation, explicitly authorized update with backup, project-local shadows, conflicting destinations, and portable path handling.

**Reason:** Not recorded. Inference: each case matches a rule locked in V3-9 to V3-16.

**Result:**

- update `workbench/specs/S-021-portable-workbench-v3/SPEC.md (Testing Seams)` - Lists disposable homes, filesystem fixtures and manifest parser cases covering each named case.
- create `tools/test-core-skill-installer.mjs` - Missing-only install, existing-skill preservation, foreign root and explicit update with backup cases.
- create `tools/test-workbench-layout.mjs` - Manifest validity, traversal and absolute path rejection cases.

**Related:** [V3-17](#v3-17), [V3-9C](#v3-9c), [V3-22](#v3-22)

**Aliases:** v3 layout grilling Q17A

**Notes:** The skill-install cases targeted the provider-home installer; under ADR-000M the equivalent lane cases belong in tools/test-skills-lane.mjs.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:47

### V3-17B

**Topic:** Mandatory end-to-end exercises

**Question:** Which end-to-end exercises are mandatory?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling Q17B

**Answer:** One fresh Genesis, one mixed existing-project Adoption, and one v2 update fixture from clean recoverable starting points.

**Reason:** Not recorded. Inference: one exercise per lifecycle route (V3-4).

**Result:**

- update `workbench/specs/S-021-portable-workbench-v3/SPEC.md (Verification Procedure) and TK-006` - Runs fresh Genesis, mixed Adoption and v2 update fixtures from clean recoverable starting points.

**Related:** [V3-17](#v3-17), [V3-4](#v3-4)

**Aliases:** v3 layout grilling Q17B

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:48

### V3-17C

**Topic:** No second model trial for v3

**Question:** Is a second autonomous model trial required?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling Q17C

**Answer:** No. Prove both Codex and Claude user-scoped discovery paths deterministically and perform one cold-context resume; broader model-outcome trials are outside this interim release.

**Reason:** Inference: this was an interim release (V3-24) proving setup, not agent outcomes; outcome claims need repeated controlled trials.

**Result:**

- update `workbench/specs/S-021-portable-workbench-v3/SPEC.md (Non-Goals, Acceptance Criteria)` - Requires both engine discovery-path checks and one cold-context resume; no claim of better model outcomes.

**Related:** [V3-17](#v3-17), [V3-17D](#v3-17d), [V3-24](#v3-24)

**Aliases:** v3 layout grilling Q17C

**Notes:** Under ADR-000M, discovery goes through the tracked .agents/skills and .claude/skills adapters into workbench/skills, not user-scoped homes.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:49

### V3-17D

**Topic:** The one-minute v3 demo

**Question:** What is the under-one-minute demo?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling Q17D

**Answer:** Show the manifest and lanes, run the bounded layout/spec/skill checks, and demonstrate that an existing installed skill was preserved; make no model-outcome claim.

**Reason:** Inference: the AGENTS.md milestone rule needs a demo checkable in under a minute, and outcome claims are out of scope.

**Result:**

- update `workbench/specs/S-021-portable-workbench-v3/SPEC.md (Acceptance Criteria)` - The under-one-minute demo passes without an unsupported model-outcome claim.
- update `RUNBOOK.md` - Holds the installer and layout check commands the demo runs.

**Related:** [V3-17](#v3-17), [V3-17C](#v3-17c)

**Aliases:** v3 layout grilling Q17D

**Notes:** The demo may be assembled from existing RUNBOOK checks; the answer does not require a single named v3 demo procedure.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:50

### V3-18

**Topic:** Implementation and publication topology

**Question:** What is the implementation and publication topology?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling Q18

**Answer:** Implement directly in the public LLM Workbench repository from current integration; do not wait on or route through unfinished Forge producer work.

**Reason:** Stated in the answer: do not wait on unfinished Forge producer work. V3-24 adds that the Workbench must be usable while Foundry finishes.

**Result:**

- update `workbench/specs/S-021-portable-workbench-v3/SPEC.md (Decisions And Contracts)` - Portable work is authored directly in LLM Workbench from current integration; no Forge publication step.
- none `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md` - Carries the same direction: portable work is authored in LLM Workbench, which Foundry extends.

**Related:** [V3-18A](#v3-18a), [V3-18B](#v3-18b), [V3-24](#v3-24), [V3-5](#v3-5)

**Aliases:** v3 layout grilling Q18

**Notes:** Historical delivery decision for the v3 candidate.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:51

### V3-18A

**Topic:** Where v3 work was authored

**Question:** Where is portable work authored?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling Q18A

**Answer:** Directly on an isolated codex/ branch from refreshed origin/integration in LLM Workbench.

**Reason:** Not recorded beyond the answer. Inference: matches the AGENTS.md branch-per-task rule from integration.

**Result:**

- none `none` - One-off branching instruction for the v3 run; the durable branch rule belongs in AGENTS.md Git Rules.

**Related:** [V3-18](#v3-18)

**Aliases:** v3 layout grilling Q18A

**Notes:** Historical and operational.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:52

### V3-18B

**Topic:** One repository for v3

**Question:** How many repositories are involved?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling Q18B

**Answer:** One. Skills, templates, guidebook edits, focused tools, migrations, and proof ship in LLM Workbench; there is no [the owner's private skills repository] PR.

**Reason:** Inference: the private catalog must not be a product dependency (V3-7), so nothing ships through it.

**Result:**

- update `workbench/specs/S-021-portable-workbench-v3/SPEC.md (Decisions And Contracts, Non-Goals)` - No private skills-repository change is part of the capability.
- update `tools/test-skill-catalog.mjs` - Fails if the catalog depends on [the owner's private skills repository].

**Related:** [V3-18](#v3-18), [V3-13C](#v3-13c), [V3-7](#v3-7), [PW-4](#pw-4)

**Aliases:** v3 layout grilling Q18B

**Notes:** PW-4 (2026-09-22) later kept [the owner's private skills repository] as a backup and optional publication target, still never on a room's critical path.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:53

### V3-19

**Topic:** Reconcile stale public control state

**Question:** How is stale public control state reconciled?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021)

**Answer:** Repair the current integration baseline and preserve historical evidence before claiming the v3 release candidate.

**Reason:** Inference: the grilling's homework found integration was not a clean release baseline - a red skill-catalog test, a stale S-014 claim, stale skill ownership in S-011, and an obsolete open PR #42 - so a v3 candidate could not honestly be claimed on top of it.

**Result:**

- update `workbench/specs/S-021-portable-workbench-v3/SPEC.md` - Records the baseline repairs (S-011, S-014, PR #42, red catalog test) as prerequisites the v3 runway must clear first.
- update `workbench/specs/S-014-workbench-release-candidate/SPEC.md` - Reconciles its current state to live refs while its append-only evidence rows stay unchanged.

**Related:** [V3-19A](#v3-19a), [V3-19B](#v3-19b), [V3-19C](#v3-19c), [V3-19D](#v3-19d), [V3-20A](#v3-20a)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q19

**Notes:** Parent question; sub-answers 19A-19D name each repair.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:54

### V3-19A

**Topic:** S-011 skill ownership superseded

**Question:** What happens to S-011?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021)

**Answer:** Supersede its obsolete project-local skill ownership through a new linked capability record; never rewrite its completed historical evidence.

**Reason:** Inference: homework found S-011 still claimed project-local skill ownership, which the v3 skill decisions replaced; completed spec evidence is append-only, so the change goes to a new linked spec instead of an edit.

**Result:**

- update `workbench/specs/S-011-agent-skills-adoption/SPEC.md` - Marks its status superseded for skill ownership, distribution and completion only; historical proof stays intact.
- create `workbench/specs/S-021-portable-workbench-v3/SPEC.md` - New linked capability that names 'Supersedes: S-011 skill ownership/distribution/completion contract only'.

**Related:** [V3-19](#v3-19), [V3-3](#v3-3), [V3-21](#v3-21)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q19A

**Notes:** The project-local ownership that S-011 lost was itself later changed again: ADR-000M (2026-09-23) put the core skills back inside each room at workbench/skills. That does not reopen S-011.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:55

### V3-19B

**Topic:** S-014 stale claim reconciled

**Question:** What happens to S-014?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021)

**Answer:** Reconcile its stale claim against the actual 46-commit integration candidate before release-gate proof.

**Reason:** Inference: homework showed integration 46 commits ahead of main (main an ancestor) and doctor reporting a stale S-014 claim, so S-014's recorded state no longer matched the candidate it was supposed to gate.

**Result:**

- update `workbench/specs/S-014-workbench-release-candidate/SPEC.md` - Reconciles current state, blocker and ticket status to the exact integration refs; release work waits until the S-021 v3 candidate reaches integration.

**Related:** [V3-19](#v3-19), [V3-20](#v3-20), [V3-24C](#v3-24c)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q19B

**Notes:** Later decisions route release gates to S-00O and S-052; that is later history, not a change to this answer.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:56

### V3-19C

**Topic:** Obsolete PR #42 handling

**Question:** What happens to open PR #42?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021)

**Answer:** Rebuild only still-useful intent on current integration; after replacement proof exists, close the obsolete July-base PR rather than merging it as-is.

**Reason:** Inference: homework found PR #42 targeted integration from a July base, overlapped S-011/S-014/grilling work, and proposed an ancestry repair that was already obsolete.

**Result:**

- retire `GitHub PR #42 (claude/respec-forge-verticality -> integration)` - Closed unmerged after S-021 replacement proof exists; only still-useful intent is rebuilt on current integration.
- update `workbench/specs/S-014-workbench-release-candidate/SPEC.md` - Evidence names PR #42 as obsolete in the v3 dependency reconciliation.

**Related:** [V3-19](#v3-19), [V3-20A](#v3-20a)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q19C

**Notes:** The answer's destinations for PR #42 are GitHub (closed unmerged after replacement proof) and S-014 evidence (named obsolete); it names no separate durable record of which intent is rebuilt.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:57

### V3-19D

**Topic:** Repair red skill-catalog baseline

**Question:** What happens to the red skill-catalog baseline?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021)

**Answer:** Repair its stale canonical-path contract as the first prerequisite and establish a green baseline before broader v3 behavior changes.

**Reason:** Homework: test-skill-catalog failed because update-harness named the retired [a retired Foundry socket path] path while the test expected the older Workbench Factory name, so the full suite was not a clean release baseline.

**Result:**

- update `tools/test-skill-catalog.mjs` - The canonical-path assertion matches the current path, so the catalog test is green before other v3 changes.
- update `workbench/specs/S-021-portable-workbench-v3/SPEC.md` - States the red catalog test is a prerequisite baseline failure that the first slice (TK-001) repairs.

**Related:** [V3-19](#v3-19)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q19D

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:58

### V3-20

**Topic:** Final implementation handoff scope

**Question:** What does the final implementation handoff authorize and exclude?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021)

**Answer:** It authorizes the minimum complete single-repository v3 runway and preserves Kayden's owner-only promotion gate.

**Reason:** Inference: follows the governing constraint (V3-24) to keep the release minimal and single-repository, and the homework finding that the flow stays owner-gated - agents prepare the integration-to-main PR, Kayden alone approves it.

**Result:**

- create `workbench/specs/S-021-portable-workbench-v3/SPEC.md` - Scope and Non-Goals limit the runway to the minimum v3 capability in LLM Workbench only; merging integration into main is a non-goal.
- update `AGENTS.md (Git Rules) and templates/AGENTS.md` - Only the owner merges integration into main.

**Related:** [V3-20A](#v3-20a), [V3-20B](#v3-20b), [V3-6](#v3-6), [V3-24C](#v3-24c), [V3-18](#v3-18)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q20

**Notes:** Parent question; 20A lists what is authorized, 20B what is excluded.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:59

### V3-20A

**Topic:** What the v3 handoff authorizes

**Question:** What is authorized?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021)

**Answer:** Promote the settled diary into the owning docs/spec, implement through red/green slices from refreshed integration, verify exact pushed heads, perform independent review, reconcile obsolete PR #42 after replacement proof, and open the final integration-to-main PR.

**Reason:** Inference: this is the full path from settled grilling to an owner-approvable release that V3-24C names as the delivery boundary, with nothing added beyond it.

**Result:**

- create `workbench/specs/S-021-portable-workbench-v3/SPEC.md` - Promoted capability with six dependency-ordered red/green tickets (TK-001..TK-006) and independent review of the exact pushed candidate.
- update `workbench/specs/S-014-workbench-release-candidate/SPEC.md` - Resumes its exact-head audit, status and integration-to-main promotion PR after the S-021 candidate lands.
- retire `GitHub PR #42` - Closed unmerged after replacement proof exists.

**Related:** [V3-20](#v3-20), [V3-19C](#v3-19c), [V3-24C](#v3-24c)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q20A

**Notes:** Exact pushed-head verification and the PR #42 reconciliation are recorded in S-014 evidence and on GitHub rather than a separate durable owner.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:60

### V3-20B

**Topic:** What the v3 handoff excludes

**Question:** What is excluded?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021)

**Answer:** Merging to main, changing visibility or credentials, editing the private skills repository, importing Foundry machinery, broad guidebook or skill-catalog redesign, and claiming release without source/test/fresh-exercise proof.

**Reason:** Inference: keeps the release inside the governing constraint (V3-24/V3-24B) and the owner-only promotion gate, and keeps Kayden's private catalog out of the product.

**Result:**

- create `workbench/specs/S-021-portable-workbench-v3/SPEC.md` - Non-Goals list each exclusion: main merge, credentials/visibility/private skills repo, Foundry machinery, full catalog or guidebook rewrite, unproven outcome claims.

**Related:** [V3-20](#v3-20), [V3-24B](#v3-24b), [V3-5](#v3-5), [V3-23C](#v3-23c)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q20B

**Notes:** Scope for the v3 runway only. Later S-00V/ADR-000M allow publishing room skills to the personal catalog as a separately authorized operation; that does not change this runway's exclusion.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:61

### V3-21

**Topic:** Self-contained Workbench skill bundle

**Question:** Does the public LLM Workbench ship a self-contained Workbench-owned skill bundle?

**Status:** superseded · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021)

**Answer:** Yes, as a brand-new-install fallback only: it supplies a required skill from its own skills/ source only when absent, ignores [the owner's private skills repository], and never replaces or re-sources an existing skill without an explicit update request. Superseded by ADR-000M (owner decisions PW-3, PW-3A, PW-4, 2026-09-22/23): the core ships inside every room at workbench/skills, not as a provider-home fallback.

**Reason:** Homework: the public product must work without Kayden's private catalog (V3-7), and copying external skills into projects would recreate the prohibited shadow. ADR-000M later reasoned that a clone with provider-home skills discovers nothing, so a cloud instance cannot start from the repository alone.

**Result:**

- create `workbench/specs/S-021-portable-workbench-v3/SPEC.md` - Records LLM Workbench as brand-new-install source of last resort for its core skills, not a dependency on [the owner's private skills repository].
- create `workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md` - Supersedes the fallback model: every room carries the core in the workbench/skills lane with tracked adapters; the personal catalog is backup and publication target only.
- update `LEXICON.md (Core skill bundle, Skills lane rows) and templates/LEXICON.md` - Define the bundle as the closed core every room carries in its skills lane.

**Related:** [V3-3](#v3-3), [V3-7](#v3-7), [V3-21A](#v3-21a), [V3-21B](#v3-21b), [V3-21C](#v3-21c), [V3-22](#v3-22)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q21

**Notes:** Status superseded by owner-locked PW-3/PW-3A/PW-4 carried into S-00V TK-001. The 'never replace without explicit update' part survives (see V3-22A).

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:65

### V3-21A

**Topic:** Bundle preserves full workflow

**Question:** What experience does the bundle preserve?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021)

**Answer:** The complete current setup and grilling-to-implementation workflow, not merely template-only setup.

**Reason:** Homework: grilling is not standalone - its interview-to-execution behavior closes over checkpoint, make-it-so, to-docs, to-spec, to-tickets, tracer-bullet, implement and code-review - so shipping setup skills alone would break the workflow.

**Result:**

- create `workbench/specs/S-021-portable-workbench-v3/SPEC.md` - Outcome states the bundle is the minimum closed workflow, setup through implementation and review.
- update `workbench/skills/README.md` - Describes the closed core bundle covering setup and the grilling-to-delivery workflow.

**Related:** [V3-21](#v3-21), [V3-21B](#v3-21b), [V3-13A](#v3-13a)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q21A

**Notes:** Still holds; later decisions enlarged the bundle (see V3-21B) and ADR-000M places it in the workbench/skills lane.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:66

### V3-21B

**Topic:** Intended core skill set

**Question:** What is the intended core set?

**Status:** superseded · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021)

**Answer:** genesis, adoption, update-harness, grilling, checkpoint, make-it-so, to-docs, to-spec, to-tickets, tracer-bullet, implement and code-review; routing and unrelated Kayden skills are outside the product. Superseded by later owner decisions: the core is 21 skills (17 workflow plus 4 stances), adding carry, notepad, save, promote, handoff and the four stances, with to-tickets renamed to-tasks (ADR-000H).

**Reason:** Homework: grilling closes over eight skills; adding the three setup entrypoints gives a closed 12-skill bundle, while router/convenience skills stay optional.

**Result:**

- update `workbench/manifest.json (skillPolicy.required)` - Lists the 21 required core names, including to-tasks.
- create `workbench/specs/S-021-portable-workbench-v3/SPEC.md` - Records the original 12-skill core as v3 history.
- update `LEXICON.md (Core skill bundle row) and templates/LEXICON.md` - States the closed set of seventeen workflow skills and four stance skills.

**Related:** [V3-13A](#v3-13a), [V3-10B](#v3-10b), [V3-21A](#v3-21a), [V3-24A](#v3-24a)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q21B

**Notes:** Supersession chain: S-027/ADR-0036 (stances), S-046/S-049 (notepad, carry), S-050/S-051 (save, promote, handoff), S-00H/ADR-000H (to-tasks). checkpoint stays in the core only as the retirement explainer after S-048. Duplicate of V3-13A.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:67

### V3-21C

**Topic:** Where core skills are installed

**Question:** Where are these skills installed?

**Status:** superseded · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021)

**Answer:** From LLM Workbench's tracked skills/ source into user-scoped Codex/Claude discovery when missing; generated and adopted projects receive no project-local skill copies. Superseded by ADR-000M (PW-3/PW-4): every room carries the core in its own workbench/skills lane, reached by tracked .agents/skills and .claude/skills links; normal setup never reads the provider home.

**Reason:** Homework: copying the external skills into projects would recreate the prohibited shadow. ADR-000M reversed this because a clone with provider-home skills discovers nothing and cannot run in the cloud from the repository alone.

**Result:**

- update `workbench/manifest.json (skillPolicy discovery, lanes.skills)` - Discovery roots .agents/skills and .claude/skills point into the workbench/skills lane.
- create `workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md` - Installed core moves from the provider home into each room; root skills/ becomes a doctor finding.
- create `tools/workbench-skills.mjs` - Lays the lane down with a receipt during Genesis/Adoption and updates it on explicit update.

**Related:** [V3-3](#v3-3), [V3-21](#v3-21), [V3-9A](#v3-9a), [V3-14B](#v3-14b)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q21C

**Notes:** The 'no project-local skill copies' rule was reversed: ADR-0046 had rejected per-room core copies; ADR-000M made them the decision. Root skills/ still counts as a shadow.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:68

### V3-22

**Topic:** Existing skill root or skill

**Question:** What happens when the user-scoped skill root or a required skill already exists?

**Status:** superseded · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021)

**Answer:** Ordinary setup is additive and fail-closed: it installs only into an absent or Workbench-managed destination, leaves foreign Git roots and existing same-named skills untouched, and reports exact remediation. Replacement requires an explicit request to update the skills. Superseded in part: ADR-0046 allowed installing missing skills into a Git-owned root, and ADR-000M moved setup into the room's workbench/skills lane.

**Reason:** Inference: protect the user's own skills and their personal Git catalog from silent overwrite; the private catalog lived at the user-scoped root. Later decisions judged a room-local lane safer and portable.

**Result:**

- update `LEXICON.md (Normal setup, Explicit skill update rows) and templates/LEXICON.md` - Normal setup lays the lane down and never touches room skills under other names; only explicit update replaces a core skill.
- create `workbench/docs/adr/0046-core-personal-shared-and-room-local-skill-ownership.md` - Allows missing installs inside a Git-owned or linked discovery root without changing its tracked source.
- create `workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md` - Setup targets the in-room lane, not the user-scoped root.

**Related:** [V3-22A](#v3-22a), [V3-22B](#v3-22b), [V3-22C](#v3-22c), [V3-9C](#v3-9c), [V3-21C](#v3-21c)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q22

**Notes:** Additive, fail-closed and explicit-update-only replacement survive in lane form; the user-scoped target and foreign-Git-root refusal do not. S-051 treated blanket refusal prose as drift.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:69

### V3-22A

**Topic:** No automatic skill replacement

**Question:** May setup replace an existing differing skill automatically?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021)

**Answer:** No. Existing content is preserved unless the user explicitly authorizes a skill update.

**Reason:** Inference: an installed skill may carry the user's own changes, so only a deliberate update may overwrite it.

**Result:**

- update `LEXICON.md (Explicit skill update row) and templates/LEXICON.md` - Explicit update is the only path that may replace a core skill; routine setup and doctor cannot imply it.
- update `workbench/manifest.json (skillPolicy.updates)` - Update policy requires an explicit request (workbench-update via --explicit-update).
- create `tools/workbench-skills.mjs` - update refuses without --explicit-update.

**Related:** [V3-22](#v3-22), [V3-9B](#v3-9b), [V3-8](#v3-8)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q22A

**Notes:** Still holds after ADR-000M; the replaced skill is the lane copy rather than a provider-home copy.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:70

### V3-22B

**Topic:** Presence-only normal setup

**Question:** Is exact content identity required during normal setup?

**Status:** superseded · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021)

**Answer:** No. Presence satisfies setup; contents are compared only during an explicitly requested update. Superseded by ADR-000M: normal setup is 'lane-install' - Genesis/Adoption lay the lane down from the release with a receipt holding a content hash per skill.

**Reason:** Inference: avoid blocking setup on harmless local edits to existing skills; comparison belongs to the deliberate update. ADR-000M replaced presence checks in the provider home with a room-owned lane whose receipt records identity.

**Result:**

- update `workbench/manifest.json (skillPolicy.normalSetup)` - lane-install for rooms with the skills lane; older six-lane rooms keep presence-only until they update.
- create `workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md` - Normal setup lays down the lane with a per-skill hash receipt.
- update `LEXICON.md (Normal setup row) and templates/LEXICON.md` - Normal setup lays the lane and adapters down from the release.

**Related:** [V3-9B](#v3-9b), [V3-22](#v3-22), [V3-22C](#v3-22c)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q22B

**Notes:** Content is still compared only on explicit update; what changed is the setup model, not the no-compare-on-setup intent for room-added skills.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:71

### V3-22C

**Topic:** Explicit skill update behavior

**Question:** What does an explicitly authorized skill update do?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021)

**Answer:** It backs up changed existing content and converges the required core to the exact versions bundled with the checked-out Workbench release.

**Reason:** Inference: an explicit update is the one moment the owner has asked for replacement, so it must converge exactly while keeping a recoverable backup of whatever it overwrites.

**Result:**

- update `LEXICON.md (Explicit skill update row) and templates/LEXICON.md` - Replace only changed core skills, back up the previous directories, record the rollback path in the receipt.
- update `RUNBOOK.md (skills lane procedures) and templates/RUNBOOK.md` - Update and rollback procedure for the lane.
- create `tools/workbench-skills.mjs` - update --explicit-update and rollback that accepts only a recorded backup.

**Related:** [V3-8](#v3-8), [V3-16](#v3-16), [V3-22A](#v3-22a)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q22C

**Notes:** S-051 narrowed it: an unmanaged same-named skill is refused rather than backed up and replaced. ADR-000M moved the update into the room lane; the provider-home installer (core-skill-installer.mjs) is only for personal-catalog publication.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:72

### V3-23

**Topic:** Guidebook-first procedures

**Question:** Should Workbench procedures be program-first or guidebook-first?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021)

**Answer:** Guidebook-first. Agents work through small markdown procedures that explain purpose, inputs, decisions, actions, stopping conditions, and proof; .mjs tools exist only for narrow deterministic checks that are clearer and safer as code.

**Reason:** Homework: the owner prefers chunked procedures that limit agent context and cognitive load; Node tools suit deterministic parsing and validation but do not replace task-sized guides.

**Result:**

- create `workbench/specs/S-021-portable-workbench-v3/SPEC.md` - States Markdown guidebooks own procedures in bounded chunks and Node tools only do narrow deterministic work; no umbrella lifecycle program.
- update `RUNBOOK.md and templates/RUNBOOK.md` - Procedures stay in Markdown, each invoking only its own mechanical check.

**Related:** [V3-23A](#v3-23a), [V3-23B](#v3-23b), [V3-10C](#v3-10c)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q23

**Notes:** The principle belongs in S-021 and BLUEPRINT's plain-files wording; the answer does not require the phrase 'guidebook-first' in a root control.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:73

### V3-23A

**Topic:** No monolithic lifecycle program

**Question:** Should one large workbench.mjs orchestrate the entire lifecycle?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021)

**Answer:** No. Keep spec-workbench.mjs bounded to spec/ticket mechanics and avoid a monolithic lifecycle program.

**Reason:** Homework: the owner prefers chunked procedures that limit context and cognitive load; small deterministic tools are proof mechanisms, not orchestrators.

**Result:**

- update `workbench/tools/spec-workbench.mjs` - Stays scoped to spec/task mechanics and manifest-aware; no workbench.mjs orchestrator.
- create `workbench/specs/S-021-portable-workbench-v3/SPEC.md` - Records that only bounded layout/manifest and skill seams are added and no monolithic orchestrator appears.

**Related:** [V3-23](#v3-23), [V3-10C](#v3-10c)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q23A

**Notes:** ADR-000H renamed 'ticket' to 'task'. spec-workbench.mjs may carry several spec/task commands (render, doctor, next, claim, close, move, report) but stays spec/task-scoped; the answer sets no size bound.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:74

### V3-23B

**Topic:** Guidebook authority routing

**Question:** How is guidebook authority routed?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021)

**Answer:** Root RUNBOOK.md remains the authoritative index; AGENTS.md may approve bounded subordinate guidebooks when a procedure genuinely needs one.

**Reason:** Inference: keeps one procedure index so agents find operations by traversal, while allowing a split only when one guide would overload a task.

**Result:**

- update `RUNBOOK.md and templates/RUNBOOK.md` - Remains the authoritative procedure index.
- update `LEXICON.md (Procedures route; Wiki article and guidebook row) and templates/LEXICON.md` - A linked Wiki guidebook may hold an extended procedure; it cannot authorize work.
- update `workbench/manifest.json (collections.guidebooks = workbench/wiki/guidebooks)` - Declares the guidebook collection.
- update `AGENTS.md and templates/AGENTS.md` - States that AGENTS.md may approve a bounded subordinate guidebook when a procedure genuinely needs one.

**Related:** [V3-23](#v3-23), [V3-23C](#v3-23c)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q23B

**Notes:** The approval clause belongs in AGENTS.md as well as S-021 (see the AGENTS.md result).

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:75

### V3-23C

**Topic:** Broad guidebook library

**Question:** Which broad guidebook library should eventually exist?

**Status:** deferred · answered 2026-08-31 v3 grilling (deferred); 2026-09-23 chat (triage v2: backlog after v4)

**Answer:** Defer a general guidebook reorganization. This release updates the existing Genesis, Adoption, upgrade, skill, and Runbook instructions and adds only a task-sized guide when required for immediate usability. The owner later placed it in the backlog after v4.

**Reason:** Inference: a broad guidebook taxonomy was outside the minimum v3 release (V3-24B); the owner kept it deferred and put it in the post-v4 backlog.

**Result:**

- none `workbench/specs/S-021-portable-workbench-v3/SPEC.md` - Records broad guidebook taxonomy as deferred and not blocking v3.
- none `workbench/wiki/guidebooks (manifest-declared collection)` - Home of any guidebook library once the owner decides.

**Related:** [V3-23B](#v3-23b), [V3-24B](#v3-24b), [V3-20B](#v3-20b)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q23C

**Notes:** Deferred, not open: triage v2 (2026-09-23) lists it under 'Backlog after v4' as owner-deferred.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:76

### V3-24

**Topic:** Governing v3 release constraint

**Question:** What is the governing release constraint?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021)

**Answer:** Make LLM Workbench good enough, current, and safely reusable in other projects while Foundry finishes; do not redesign it into Foundry or expand optional architecture.

**Reason:** Inference: the owner needed a usable, portable Workbench for other projects now, while the larger Foundry effort was unfinished, so v3 had to stay small rather than absorb Foundry concepts.

**Result:**

- create `workbench/specs/S-021-portable-workbench-v3/SPEC.md` - Outcome: ready to use in other projects while Foundry remains unfinished, without turning it into Foundry.
- update `BLUEPRINT.md and templates/BLUEPRINT.md` - Portable Workbench does not require Foundry or import its machinery.
- none `workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md` - Carries the Workbench/Foundry boundary.

**Related:** [V3-5](#v3-5), [V3-24A](#v3-24a), [V3-24B](#v3-24b), [V3-24C](#v3-24c)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q24

**Notes:** Parent question; 24A-24C refine it.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:77

### V3-24A

**Topic:** Minimum complete v3 release

**Question:** What is the minimum complete release?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021)

**Answer:** The workbench/ layout and manifest; the 12-skill missing-only brand-new-install contract; updates to existing setup/upgrade instructions and affected paths; focused deterministic checks; one fresh Genesis proof; and one existing-project Adoption proof.

**Reason:** Inference: the smallest set that makes the Workbench reusable in other projects under the V3-24 constraint.

**Result:**

- create `workbench/specs/S-021-portable-workbench-v3/SPEC.md` - Acceptance and TK-001..TK-006 cover the layout, manifest, 12-skill core, focused checks, fresh Genesis and Adoption proofs.
- create `workbench/manifest.json` - Single machine-readable authority for layout and skill policy.

**Related:** [V3-24](#v3-24), [V3-17](#v3-17), [V3-21B](#v3-21b), [V3-21](#v3-21)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q24A

**Notes:** Scope of v3.0.0. Later decisions superseded the 12-skill and missing-only parts (21 skills; in-room lane per ADR-000M); S-021 keeps the original as history.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:78

### V3-24B

**Topic:** Excluded tempting work

**Question:** Which tempting work is excluded?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021)

**Answer:** Broad guidebook taxonomy, Foundry runtime concepts, orchestration, generalized plugin/catalog architecture, unrelated pending skills, and aesthetic refactors.

**Reason:** Inference: each would expand optional architecture beyond the governing constraint (V3-24).

**Result:**

- create `workbench/specs/S-021-portable-workbench-v3/SPEC.md` - Non-Goals exclude Foundry machinery, orchestration, a generalized plugin/marketplace, pending-skill rewrites and guidebook reorganization.

**Related:** [V3-24](#v3-24), [V3-20B](#v3-20b), [V3-23C](#v3-23c), [V3-5](#v3-5)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q24B

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:79

### V3-24C

**Topic:** v3 delivery boundary

**Question:** What remains the delivery boundary?

**Status:** locked · answered 2026-08-31, v3 layout and shared-skills grilling (promoted to S-021)

**Answer:** Verified public integration, followed by one open integration-to-main PR for Kayden to approve.

**Reason:** Inference: matches the owner-only promotion gate (V3-6); agents may prepare the release but only Kayden approves or merges it.

**Result:**

- update `AGENTS.md (Git Rules, Branch Completion) and templates/AGENTS.md` - Agents merge below integration; only the owner merges integration into main.
- update `workbench/specs/S-014-workbench-release-candidate/SPEC.md` - Owns the open integration-to-main promotion PR after S-021 lands.
- create `workbench/specs/S-021-portable-workbench-v3/SPEC.md` - Hands the pushed integration candidate to S-014.

**Related:** [V3-6](#v3-6), [V3-20](#v3-20), [V3-19B](#v3-19b)

**Aliases:** llm-workbench-v3-layout-and-shared-skills Q24C

**Notes:** Same answer as V3-6.

**Provenance (local records):** workbench/sessions/grilling/llm-workbench-v3-layout-and-shared-skills-2026-08-31.md:80

## WB - Workbench boundaries redesign

### WB-1

**Topic:** First proof of redesigned Workbench

**Question:** What exact first outcome should establish that the redesigned Workbench works: a reviewed harness report, or a report followed by an implemented repair?

**Status:** locked · answered 2026-09-04, workbench-boundaries-redesign grilling Q1

**Answer:** Build the redesigned workflow, then complete Round One: a fresh agent uses the reduced route, Wiki and ADRs to confirm the Workbench is set up correctly. Only after Round One succeeds, produce a reviewed, evidence-backed harness-feedback report and show cold continuation to its accepted next action. The report must not authorize or include a repair to the harness it evaluates.

**Reason:** Owner direction for the redesign: 'Start proving the base through harness feedback reviews and reports.' Recorded rationale (ADR-0038): starting with a report or mandatory handoff confuses the first configuration proof with a feedback/review test.

**Result:**

- create `workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md` - Spec owns the sequence: build route and stances, chat-only Round One, then feedback reporting and fresh-context continuation.
- create `workbench/docs/adr/0038-setup-proof-precedes-feedback-reporting.md` - Accepted decision: setup proof precedes feedback reporting; reports never repair or authorize repair of their targets.
- update `RUNBOOK.md (Ordinary Entry; Manual Harness Feedback Reports) and templates/RUNBOOK.md` - Round One precedes feedback testing; the report workflow runs only after a setup-only Round One succeeds.

**Related:** [WB-7](#wb-7), [WB-11](#wb-11), [WB-13](#wb-13), [WB-14](#wb-14)

**Aliases:** workbench-boundaries Q1

**Notes:** Earlier progress board wrongly said 'no settled result recorded'; the Markdown source carries the locked decision. Resume header asked promotion to reconcile Q1 wording with Q14's chat-only Round One; the reconciled wording belongs in S-027 and ADR-0038.

**Provenance (local records):** workbench/sessions/grilling/workbench-boundaries-redesign-2026-09-04.md:238; workbench/sessions/checkpoints/workbench-boundaries-grilling-2026-09-04.md; workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md (Decisions And Contracts, Q1 row)

### WB-2

**Topic:** Ordinary entry route and controls

**Question:** Which artifacts and entrypoints should an agent need for ordinary work, and should the present seven-control contract remain?

**Status:** locked · answered 2026-09-04, workbench-boundaries-redesign grilling Q2

**Answer:** Keep the seven-control Workbench Contract. Shrink ordinary entry to AGENTS.md, RUNBOOK.md and LEXICON.md; the Lexicon routes to other owners only when the task needs them. Blueprint is not default reading but is consulted for architecture or cross-cutting direction. The selected SPEC.md stays mandatory after selection because it delegates the work's scope and verification.

**Reason:** Recorded rationale (ADR-0035): reading all controls and archives at startup burdens each task. Inference: follows the redesign aim to keep the whole route short enough to exercise.

**Result:**

- update `AGENTS.md (opening paragraph) and templates/AGENTS.md` - Ordinary entry is AGENTS -> RUNBOOK -> LEXICON; assigned SPEC mandatory after selection; Blueprint only for architecture or cross-cutting direction.
- create `workbench/docs/adr/0035-reduced-entry-and-assigned-autonomy.md` - Accepted decision keeping the seven-control Contract and the reduced entry route.
- update `RUNBOOK.md (Ordinary Entry) and LEXICON.md routing, with template mirrors` - Runbook entry procedure and Lexicon routing send agents to other owners only when the task needs them.

**Related:** [WB-5](#wb-5), [WB-11](#wb-11)

**Aliases:** workbench-boundaries Q2

**Notes:** Earlier progress board wrongly said 'no settled result recorded'; the Markdown source carries the locked decision. Proposed ADR-000B/000C later revisit the seven-control part; this row records the 2026-09-04 answer only.

**Provenance (local records):** workbench/sessions/grilling/workbench-boundaries-redesign-2026-09-04.md:240; workbench/sessions/checkpoints/workbench-boundaries-grilling-2026-09-04.md; workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md (Q2, Q5 row)

### WB-3

**Topic:** Packaging the four stance skills

**Question:** How should Builder, Auditor, Reviewer, and Reconciler stances be packaged and invoked within the portable skill bundle?

**Status:** locked · answered 2026-09-04, workbench-boundaries-redesign grilling Q3

**Answer:** Package all four as portable stance skills. A stance says how an agent performs one task with the authority, responsibilities, good practices and composing skills suited to that work. Loading a stance never spawns a sub-agent; Builder, for example, must make sure review and verification happen. Keep cross-provider discovery: a stance stored under ~/.agents/skills/stances/ also needs a flat top-level symlink for Claude's one-level scan.

**Reason:** Owner direction: stances 'are ways of approaching work, not permanent departments or agent identities.' Recorded rationale (ADR-0036): permanent agent departments and a handoff per stance change create machinery unrelated to the task.

**Result:**

- create `workbench/skills/builder, auditor, reviewer, reconciler (SKILL.md each)` - Four portable stance skills ship flat in the core bundle for both providers.
- create `workbench/docs/adr/0036-stances-change-method-not-authority.md` - Accepted decision: four stances; nested install needs a flat symlink for one-level discovery; loading never spawns an agent.
- update `AGENTS.md (Assigned Work And Stances) and templates/AGENTS.md; LEXICON.md (Stance Terms)` - Controls name the four stances as portable behavior skills that never spawn an agent.

**Related:** [WB-12](#wb-12), [WB-16](#wb-16), [WB-11](#wb-11)

**Aliases:** workbench-boundaries Q3

**Notes:** Earlier progress board wrongly said 'no settled result recorded'; the Markdown source carries the locked decision. The agent's recommendation (embed stance sections instead) was not adopted.

**Provenance (local records):** workbench/sessions/grilling/workbench-boundaries-redesign-2026-09-04.md:242; workbench/sessions/checkpoints/workbench-boundaries-grilling-2026-09-04.md; workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md (Q3, Q12, Q16 row)

### WB-4

**Topic:** When independent review is required

**Question:** When must a review be independent, and what separation is sufficient for the first report and later code changes?

**Status:** locked · answered 2026-09-04, workbench-boundaries-redesign grilling Q4

**Answer:** Independent review is required only when work is ready to merge into integration: the proposed integration candidate gets a separate-context review before branches combine. That reviewer checks the candidate and its evidence, which is enough to challenge consequential claims, code changes and report recommendations. Earlier review, verification and audit are supports, not mandatory independent ceremonies.

**Reason:** Recorded rationale (ADR-0037): independent review of every intermediate change duplicates the final gate and creates unnecessary stops.

**Result:**

- update `AGENTS.md (Git Rules, integration review paragraph) and templates/AGENTS.md` - A separate-context reviewer checks the immutable candidate before branches combine into integration; earlier review is support, not a mandatory ceremony.
- create `workbench/docs/adr/0037-independent-review-at-integration.md` - Accepted decision: independent review at the integration merge; changed candidates need fresh review.
- update `workbench/skills/implement and workbench/skills/code-review` - Implementation and review skills point to the integration review gate.

**Related:** [WB-1](#wb-1)

**Aliases:** workbench-boundaries Q4

**Notes:** Earlier progress board wrongly said 'no settled result recorded'; the Markdown source carries the locked decision. Later WF-8C refined the reviewed unit to the assembled Spec; consistent with this answer.

**Provenance (local records):** workbench/sessions/grilling/workbench-boundaries-redesign-2026-09-04.md:244; workbench/sessions/checkpoints/workbench-boundaries-grilling-2026-09-04.md; workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md (Q4 row)

### WB-5

**Topic:** What survives for cold continuation

**Question:** What information must survive completion or interruption, and which reconciliation checks establish a truthful cold continuation?

**Status:** locked · answered 2026-09-04, workbench-boundaries-redesign grilling Q5

**Answer:** A cold start needs the Workbench Contract, the selected work packet and its linked owners, the exact achieved output or commit, current ticket/spec state, named verification, and the next executable action or blocker. An interrupted agent cannot be forced to save, but should record this state in existing owners as it works and promote a checkpoint when its session reasoning is material. No universal handoff artifact or duplicated truth.

**Reason:** Owner direction: project prose, Wiki, decisions, specs and instructions are the memory that enables cold starts - 'one distributed handoff.' Inference: a separate handoff artifact would duplicate truth that owners already hold.

**Result:**

- update `AGENTS.md (Assigned Work And Stances, cold continuation paragraph) and templates/AGENTS.md` - Cold continuation uses existing owners and lists the six items; no universal handoff artifact is required.
- create `workbench/docs/adr/0035-reduced-entry-and-assigned-autonomy.md` - Records continuation through existing truth owners; checkpoint only when session reasoning matters.

**Related:** [WB-2](#wb-2), [WB-14](#wb-14)

**Aliases:** workbench-boundaries Q5

**Notes:** Earlier progress board wrongly said 'no settled result recorded'; the Markdown source carries the locked decision. The 'promote a checkpoint' clause was later superseded by direct promotion into durable owners (ADR-0054, S-048; noted in ADR-0035's v3.2.0 reconciliation). The rest stands.

**Provenance (local records):** workbench/sessions/grilling/workbench-boundaries-redesign-2026-09-04.md:246; workbench/sessions/checkpoints/workbench-boundaries-grilling-2026-09-04.md; workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md (Q2, Q5 row)

### WB-6

**Topic:** Autonomy when work is underspecified

**Question:** How much task construction should pickup perform when existing work is blocked, stale, or insufficiently specified?

**Status:** locked · answered 2026-09-04, workbench-boundaries-redesign grilling Q6

**Answer:** The Workbench is autonomous within its standing authority. An arriving agent investigates the Contract, relevant ADRs, specs, task state, Wiki and project evidence, makes the best supported choice, and may construct the next decision from that evidence. Only when it cannot find a confident good next decision does it record the blocker and stop; the owner can open a grilling session on return. Platform safety and owner-only boundaries still apply.

**Reason:** Recorded rationale (ADR-0035): automatic backlog creation enlarges scope. Inference: the owner wants agents to resolve gaps from project evidence instead of stopping for routine questions.

**Result:**

- update `AGENTS.md (Assigned Work And Stances) and templates/AGENTS.md` - Investigate through Contract, ADRs, specs, Wiki and evidence; if no confident next action, record the blocker in the existing work owner and stop.
- create `workbench/docs/adr/0035-reduced-entry-and-assigned-autonomy.md` - Accepted decision: investigate missing details within assigned work.
- update `RUNBOOK.md (Ordinary Entry) and templates/RUNBOOK.md` - Runbook says investigate within the task; do not invent a next task when blocked.

**Related:** [WB-15](#wb-15)

**Aliases:** workbench-boundaries Q6

**Notes:** Earlier progress board wrongly said 'no settled result recorded'; the Markdown source carries the locked decision. Resume header: Q6 autonomy stays within an assigned task per Q15; the promoted wording reflects that.

**Provenance (local records):** workbench/sessions/grilling/workbench-boundaries-redesign-2026-09-04.md:248; workbench/sessions/checkpoints/workbench-boundaries-grilling-2026-09-04.md; workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md (Q6, Q15 row)

### WB-7

**Topic:** Where reports and follow-up live

**Question:** Where should the report and its accepted follow-up live, and what separates review/report work from automated repair?

**Status:** locked · answered 2026-09-04, workbench-boundaries-redesign grilling Q7

**Answer:** Harness-feedback reports go in the manifest-declared workbench/feedback/ lane - never loose, in the Wiki, or in an ad-hoc folder. Accepted follow-up work goes in its owning linked spec. A report does not repair its target or authorize automated repair.

**Reason:** Inference from the design packet: 'A finding is not permission to fix it'; the existing scheduled repair/merge automation was judged the wrong model for the first report workflow.

**Result:**

- create `workbench/feedback/REPORT_FORMAT.md` - Report format for the feedback lane.
- update `RUNBOOK.md (Manual Harness Feedback Reports) and templates/RUNBOOK.md` - Report workflow stores reports in the feedback lane; follow-up lives in its owning spec; reports never repair.
- create `workbench/docs/adr/0038-setup-proof-precedes-feedback-reporting.md` - States reports never repair or authorize repair of their targets.

**Related:** [WB-1](#wb-1)

**Aliases:** workbench-boundaries Q7

**Notes:** Earlier progress board wrongly said 'no settled result recorded'; the Markdown source carries the locked decision.

**Provenance (local records):** workbench/sessions/grilling/workbench-boundaries-redesign-2026-09-04.md:250; workbench/sessions/checkpoints/workbench-boundaries-grilling-2026-09-04.md; workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md (Q7 row)

### WB-8

**Topic:** Relation to unreleased v3.1 candidate

**Question:** How should the redesign relate to the preserved unreleased v3.1 candidate and the pending S-022/S-014 release path?

**Status:** locked · answered 2026-09-04, workbench-boundaries-redesign grilling Q8

**Answer:** This is continuing LLM Workbench work under the v3.1.1 direction, not a pivot away from an abandoned candidate. Existing v3.1 work, specs and proof are the baseline to continue and improve. The provisional label does not publish a version, create a release claim, or rewrite historical evidence.

**Reason:** Inference from the design packet: the v3.1 name already belonged to an unreleased candidate, and historical proof must not be silently relabeled or completed records reopened.

**Result:**

- create `workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md` - Outcome states v3.1.1 continues the preserved v3.1 candidate; no publication claimed.
- create `workbench/docs/adr/0038-setup-proof-precedes-feedback-reporting.md` - 'Continue v3.1 as v3.1.1'; preserve historical release proof.
- update `BLUEPRINT.md and templates/BLUEPRINT.md` - Direction continues v3.1 as v3.1.1 without rewriting proof (per S-027 question map).

**Aliases:** workbench-boundaries Q8

**Notes:** Earlier progress board wrongly said 'no settled result recorded'; the Markdown source carries the locked decision. The recommendation (new linked pivot spec, settle version ownership) was not adopted as worded.

**Provenance (local records):** workbench/sessions/grilling/workbench-boundaries-redesign-2026-09-04.md:252; workbench/sessions/checkpoints/workbench-boundaries-grilling-2026-09-04.md; workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md (Q8 row)

### WB-9

**Topic:** Evidence before Master Workbench

**Question:** Which later Workbenches and what evidence count as 'several working' before considering Master Workbench?

**Status:** locked · answered 2026-09-04, workbench-boundaries-redesign grilling Q9

**Answer:** Validate through real, contrasting existing Workbenches and products, not artificial pilots. Candidates include LLM Workbench, Master Workbench, GPT_OS, Cashflow Calculator, CIC, OpenBrain and Foundry; pick the next from live owner priorities. Each proof must show owner-useful delivery, named verification and truthful fresh-session continuation. Revisit Master Workbench only when several such proofs show a concrete need for its registry, observation audit or visualization role.

**Reason:** Owner direction: park Master Workbench and set Foundry down until several functioning Workbenches show a need to connect. Recorded rationale (ADR-0038): artificial pilot projects do not establish real usefulness.

**Result:**

- create `workbench/docs/adr/0038-setup-proof-precedes-feedback-reporting.md` - Defer Master Workbench until real contrasting deliveries establish an observation need.
- create `workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md` - Records the Master Workbench deferral in its completion result.

**Aliases:** workbench-boundaries Q9

**Notes:** The Markdown source carries the locked decision (the 2026-09-19 board wrongly said 'no settled result'). Named example projects are candidates, not pilot assignments. ADR-0038 and S-027 own the sequencing; the Blueprint describes the finished product and does not carry it.

**Provenance (local records):** workbench/sessions/grilling/workbench-boundaries-redesign-2026-09-04.md:254; workbench/sessions/checkpoints/workbench-boundaries-grilling-2026-09-04.md; workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md (Q9 row)

### WB-10

**Topic:** Required steps must enable delivery

**Question:** What concrete evidence should show that an imposed step enables direct delivery rather than creating bureaucracy?

**Status:** locked · answered 2026-09-04, workbench-boundaries-redesign grilling Q10

**Answer:** A required step must name its immediate delivery value and leave a checkable artifact, decision or risk reduction. When that value is uncertain, keep the step optional and visible for review until the owner can grill it; do not silently make it mandatory or discard it.

**Reason:** Recorded owner principle (provisional ADR section): 'The Workbench is about process, not ceremony'; a step that exists only to satisfy another step is bureaucracy. ADR-0034: a universal lifecycle checklist makes compliance its own product.

**Result:**

- create `workbench/docs/adr/0034-required-steps-must-enable-delivery.md` - Accepted decision: imposed steps need immediate delivery value and a checkable output.
- update `AGENTS.md (Assigned Work And Stances) and templates/AGENTS.md` - Required steps name delivery value; uncertain steps stay optional and visible for owner review.
- update `BLUEPRINT.md and templates/BLUEPRINT.md` - Canonicalized product principle per ADR-0034.

**Aliases:** workbench-boundaries Q10 (spawned)

**Notes:** Earlier progress board wrongly said 'no settled result recorded'; the Markdown source carries the locked decision.

**Provenance (local records):** workbench/sessions/grilling/workbench-boundaries-redesign-2026-09-04.md:273; workbench/sessions/grilling/workbench-boundaries-redesign-2026-09-04.md:289 (Provisional ADR decision); workbench/sessions/checkpoints/workbench-boundaries-grilling-2026-09-04.md

### WB-11

**Topic:** Smallest v3.1.1 implementation slice

**Question:** What is the smallest v3.1.1 implementation slice that must exist before the first harness-feedback report can exercise this redesigned workflow?

**Status:** locked · answered 2026-09-04, workbench-boundaries-redesign grilling Q11

**Answer:** Build only the four stance skills, the reduced ordinary entry route (AGENTS.md -> RUNBOOK.md -> LEXICON.md), and the feedback-report workflow and format in the existing feedback lane before running the first report. Implement it step by step.

**Reason:** Inference from the packet's design consequences: prove a useful result early and add only what the proof needs.

**Result:**

- create `workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md TK-001` - One ticket builds route and stances, runs Round One, then delivers feedback reporting and continuation.
- create `workbench/feedback/REPORT_FORMAT.md` - Report format in the feedback lane.
- create `workbench/skills/builder, auditor, reviewer, reconciler` - The four stance skills.

**Related:** [WB-1](#wb-1), [WB-2](#wb-2), [WB-3](#wb-3), [WB-7](#wb-7)

**Aliases:** workbench-boundaries Q11 (spawned)

**Notes:** Earlier progress board wrongly said 'no settled result recorded'; the Markdown source carries the locked decision. Resume header: sequence Q11's feedback workflow after Round One; S-027 carries that sequence.

**Provenance (local records):** workbench/sessions/grilling/workbench-boundaries-redesign-2026-09-04.md:275; workbench/sessions/checkpoints/workbench-boundaries-grilling-2026-09-04.md; workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md (Q1, Q11, Q13, Q14 row)

### WB-12

**Topic:** Common stance skill contract

**Question:** What common minimum contract should every stance skill contain, beyond its stance-specific practices and composing skills?

**Status:** locked · answered 2026-09-04, workbench-boundaries-redesign grilling Q12

**Answer:** A stance never grants, removes or transfers authority; it only changes how the model behaves within authority set before adoption. Every stance defines Purpose, Method / Posture, Obligations, and Completion / Exit Condition, and may add intrinsic constraints (e.g. Reviewer evaluates rather than quietly repairs). Changing stance creates no handoff, so one task may move Builder -> Reviewer -> Builder -> Reconciler uninterrupted.

**Reason:** Recorded rationale (ADR-0036): a handoff per stance change creates machinery unrelated to the task. Handoff belongs only to the continuation mechanism at a real execution boundary.

**Result:**

- create `workbench/skills/builder, auditor, reviewer, reconciler (SKILL.md)` - Each stance has exactly the four sections: Purpose, Method / Posture, Obligations, Completion / Exit Condition.
- update `AGENTS.md (Assigned Work And Stances) and templates/AGENTS.md` - A stance never grants, removes or transfers authority; changing stance alone creates no handoff.
- update `LEXICON.md (Stance Terms) and templates/LEXICON.md` - Stance defined as method within established authority, not identity or authority grant.

**Related:** [WB-3](#wb-3), [WB-16](#wb-16)

**Aliases:** workbench-boundaries Q12 (spawned)

**Notes:** Earlier progress board wrongly said 'no settled result recorded'; the Markdown source carries the locked decision.

**Provenance (local records):** workbench/sessions/grilling/workbench-boundaries-redesign-2026-09-04.md:277; workbench/sessions/checkpoints/workbench-boundaries-grilling-2026-09-04.md; workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md (Q3, Q12, Q16 row)

### WB-13

**Topic:** What Round One must prove

**Question:** What exactly must the first harness-feedback report prove about the newly built workflow, beyond identifying findings about the harness?

**Status:** locked · answered 2026-09-04, workbench-boundaries-redesign grilling Q13

**Answer:** Round One is not a harness-feedback or review test. It succeeds when a fresh agent uses the reduced entry route, consults the Wiki and relevant ADRs, and determines the Workbench is set up correctly. Passing that orientation-and-configuration proof is mission success for Round One; review and feedback testing follow afterward.

**Reason:** Recorded rationale (ADR-0038): starting with a report confuses the first configuration proof with a feedback/review test.

**Result:**

- update `RUNBOOK.md (Ordinary Entry, Round One paragraph) and templates/RUNBOOK.md` - Round One is a setup-only check by a fresh agent and precedes feedback testing.
- create `workbench/docs/adr/0038-setup-proof-precedes-feedback-reporting.md` - Setup proof by a fresh agent precedes feedback reporting.
- create `workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md` - Desired Behavior 3 and acceptance: fresh Round One agent verifies setup via the intended route.

**Related:** [WB-1](#wb-1), [WB-14](#wb-14)

**Aliases:** workbench-boundaries Q13 (spawned)

**Notes:** Earlier progress board wrongly said 'no settled result recorded'; the Markdown source carries the locked decision. The question was framed around the report; the answer rejected that framing. Its 'leaves a recoverable outcome' wording was narrowed by Q14 to a chat-only result.

**Provenance (local records):** workbench/sessions/grilling/workbench-boundaries-redesign-2026-09-04.md:279; workbench/sessions/checkpoints/workbench-boundaries-grilling-2026-09-04.md; workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md (Q1, Q11, Q13, Q14 row)

### WB-14

**Topic:** Round One returns in chat only

**Question:** What exact, checkable outcome should a Round One agent leave to demonstrate that it verified the Workbench setup correctly?

**Status:** locked · answered 2026-09-04, workbench-boundaries-redesign grilling Q14 (after a same-turn reversal)

**Answer:** The agent inspects the Workbench using the intended route and returns to the current chat to confirm it works. Round One creates no feedback report, handoff, checkpoint, self-created task or other prose artifact.

**Reason:** Owner, reversing his first answer: 'undo 14... an agent works its task. that is what the workbench is for... NO.'

**Result:**

- update `RUNBOOK.md (Ordinary Entry, Round One paragraph) and templates/RUNBOOK.md` - Round One returns its result in chat only: no report, handoff, checkpoint, self-created task or other prose artifact.
- update `AGENTS.md (Assigned Work And Stances) and templates/AGENTS.md` - 'A read-only setup check may return only in chat.'
- create `workbench/docs/adr/0038-setup-proof-precedes-feedback-reporting.md` - Round One creates no prose artifact.

**Related:** [WB-13](#wb-13), [WB-15](#wb-15), [WB-5](#wb-5)

**Aliases:** workbench-boundaries Q14 (spawned)

**Notes:** Earlier progress board wrongly said 'no settled result recorded'; the Markdown source carries the locked decision. Owner reversal: he first locked an answer letting the agent 'create the task for itself and leave a summary of its findings... a handoff', then reversed it in the same turn. The reversal was only recorded on 2026-09-23, recovered from the transcript.

**Provenance (local records):** workbench/sessions/grilling/workbench-boundaries-redesign-2026-09-04.md:281; workbench/sessions/grilling/workbench-boundaries-redesign-2026-09-04.md:283 (correction added 2026-09-23); workbench/sessions/checkpoints/workbench-boundaries-grilling-2026-09-04.md

### WB-15

**Topic:** No self-created next task

**Question:** When an autonomous agent creates its own next task, what minimum information must make that task eligible for pickup rather than merely a note?

**Status:** locked · answered 2026-09-04, workbench-boundaries-redesign grilling Q15

**Answer:** It does not create a next task for itself. An agent picks up its assigned task and works it autonomously; if information is missing it investigates and resolves it within that task from project evidence. Only when it cannot is a separate new task needed for a new agent, and the current agent does not manufacture that queue item or treat its absence as routine blockage.

**Reason:** Owner in the Q14 reversal: 'an agent works its task. that is what the workbench is for.' Recorded rationale (ADR-0035): automatic backlog creation enlarges scope.

**Result:**

- update `AGENTS.md (Assigned Work And Stances) and templates/AGENTS.md` - Record the blocker in the existing work owner and stop; do not create a next task for yourself or manufacture a queue item.
- create `workbench/docs/adr/0035-reduced-entry-and-assigned-autonomy.md` - 'Never manufacture the next task.'

**Related:** [WB-6](#wb-6), [WB-14](#wb-14)

**Aliases:** workbench-boundaries Q15 (spawned)

**Notes:** Earlier progress board wrongly said 'no settled result recorded'; the Markdown source carries the locked decision. The question's premise (agents create their own next tasks) was withdrawn by the answer itself; the locked rule is that they do not.

**Provenance (local records):** workbench/sessions/grilling/workbench-boundaries-redesign-2026-09-04.md:284; workbench/sessions/checkpoints/workbench-boundaries-grilling-2026-09-04.md; workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md (Q6, Q15 row)

### WB-16

**Topic:** Who sets the normal stance

**Question:** How should an agent choose the appropriate stance for an assigned task without turning stance selection into another required ritual?

**Status:** locked · answered 2026-09-04, workbench-boundaries-redesign grilling Q16

**Answer:** Normal task stance is set in the assigned SPEC and TASK; the agent does not choose or record its own. A stance decision may arise only once work enters troubleshooting mode, and what happens there is outside this grilling session's scope.

**Reason:** Recorded rationale (ADR-0036): mandatory stance selection creates machinery unrelated to the task.

**Result:**

- update `AGENTS.md (Assigned Work And Stances) and templates/AGENTS.md` - Normal stance is set in the assigned SPEC and TASK, not selected or recorded by the arriving agent; troubleshooting stance policy is outside the contract.
- update `templates/SPEC.md and Spec/TASK records` - Spec and Task records carry a Stance field.
- create `workbench/docs/adr/0036-stances-change-method-not-authority.md` - SPEC and TASK assign normal stance; troubleshooting policy deferred.

**Related:** [WB-3](#wb-3), [WB-12](#wb-12)

**Aliases:** workbench-boundaries Q16 (spawned)

**Notes:** Earlier progress board wrongly said 'no settled result recorded'; the Markdown source carries the locked decision. Troubleshooting-mode stance policy remains deliberately undecided.

**Provenance (local records):** workbench/sessions/grilling/workbench-boundaries-redesign-2026-09-04.md:286; workbench/sessions/checkpoints/workbench-boundaries-grilling-2026-09-04.md; workbench/specs/S-027-workbench-v3-1-1-boundaries/SPEC.md (Q3, Q12, Q16 row)

## U313 - Unblocking v3.1.3 open work

### U313-0

**Topic:** v3.1.3 does not publish yet

**Question:** Does v3.1.3 publish to main now?

**Status:** locked · answered 2026-09-07, unblocking-v3-1-3 notepad (owner, unprompted)

**Answer:** No. main is not updated until the v3.1.3 build is done.

**Reason:** Owner: v3.1.3 'is under construction'. Related owner words the same day: 'I decide when we merge up with main.'

**Result:**

- update `workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md (Decisions And Contracts)` - 'v3.1.3 does not publish': work is delivered to the declared integration branch; whether integration reaches main is the owner's call.

**Related:** [U313-4](#u313-4), [U313-6](#u313-6)

**Aliases:** unblocking-v3-1-3 planned_questions id 0

**Notes:** Stated by the owner unprompted rather than asked as a question.

**Provenance (local records):** workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#planned_questions[id=0]; workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#boundaries

### U313-1

**Topic:** S-045 tickets land in v3.1.3

**Question:** S-045's six remaining tickets are blocked on 'Owner decides whether the remaining six land in v3.1.3'. v3.1.3 now exists. Do they land in it?

**Status:** locked · answered 2026-09-07, unblocking-v3-1-3 notepad

**Answer:** Yes - all six land in v3.1.3, TK-005 first.

**Reason:** Recorded rationale: TK-005/TK-001 settle the discovery-root question blocking carry's install; TK-007 withdraws published false claims; TK-006 adds a recurrence guard. 'A patch release that clears its predecessor's debt is a clean release.'

**Result:**

- update `workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md (Decisions And Contracts; ticket table Blockers column)` - Withdraws 'every ticket blocked pending owner direction'; all six land in v3.1.3 with TK-005 declared first.

**Related:** [U313-1A](#u313-1a), [U313-1B](#u313-1b), [U313-2](#u313-2)

**Aliases:** unblocking-v3-1-3 planned_questions id 1

**Notes:** The rationale text is recorded next to the owner's answer; it reads as the agent's framing that the owner accepted.

**Provenance (local records):** workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#planned_questions[id=1]

### U313-1A

**Topic:** All six S-045 tickets

**Question:** If yes: all six, or a named subset?

**Status:** locked · answered 2026-09-07, unblocking-v3-1-3 notepad

**Answer:** All six: TK-001, TK-002, TK-003, TK-005, TK-006, TK-007. Order starts at TK-005.

**Reason:** Not recorded.

**Result:**

- update `workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md (ticket table)` - All six tickets unblocked; the other five declare TK-005 as blocker, so TK-005 runs first. Further ordering is the implementing agent's.

**Related:** [U313-1](#u313-1)

**Aliases:** unblocking-v3-1-3 planned_questions id 1A

**Notes:** 'TK-005 first' is the owner's only ordering constraint (S-045).

**Provenance (local records):** workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#planned_questions[id=1A]

### U313-1B

**Topic:** Ownership of S-045 tickets

**Question:** Who owns them - this session, or codex?

**Status:** locked · answered 2026-09-07, unblocking-v3-1-3 notepad

**Answer:** This session owns all six.

**Reason:** Recorded rationale: this session had the freshest context on supportedLegacy, the new guards and the Git-owned root failure; Codex stays in its S-046 notepad lane; one durable writer for spec/Taskboard state.

**Result:**

- update `workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md (header Owner and ticket owners)` - S-045 owned by the Claude session for all six tickets; Codex's S-046 lane untouched.

**Related:** [U313-1](#u313-1), [U313-5](#u313-5)

**Aliases:** unblocking-v3-1-3 planned_questions id 1B

**Provenance (local records):** workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#planned_questions[id=1B]

### U313-2

**Topic:** Install carry via TK-005 route

**Question:** carry is not installed in either discovery root because the root is a Git repo and the installer refuses it. Hand-copy now as a workaround, or do TK-005 first and install via whatever route it defines?

**Status:** locked · answered 2026-09-07, unblocking-v3-1-3 notepad

**Answer:** TK-005 first, then install carry via whatever route it defines. No hand-copy workaround.

**Reason:** Not recorded. Inference: TK-005 already existed to decide whether such a root is supported, so a hand-copy would bypass the decision.

**Result:**

- update `workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md TK-005 then TK-001` - TK-005 decides the root route; TK-001 implements it; carry is installed only through that route.
- update `tools/core-skill-installer.mjs` - Installer is the route used to place carry in the discovery roots, with its marker.

**Related:** [U313-2A](#u313-2a), [REC-01](#rec-01), [REC-02](#rec-02)

**Aliases:** unblocking-v3-1-3 planned_questions id 2

**Provenance (local records):** workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#planned_questions[id=2]; workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#execution_plan_locked

### U313-2A

**Topic:** Git-owned/symlinked skill root supported

**Question:** What should TK-005 decide for a symlinked and/or Git-owned discovery root: supported, refused-with-remediation, or routed to an alternate destination?

**Status:** locked · answered 2026-09-07, unblocking-v3-1-3 notepad

**Answer:** Supported: resolve the symlink, write the missing skill into the real directory, never touch Git (no add/commit/stash). Keep the .workbench-skill.json marker.

**Reason:** Recorded context (S-045): the guards added in 26c34e9 rightly aimed to stop the harness mutating a user's own versioned skills collection, but left no supported route, so the refusal was total rather than bounded. The owner's root is exactly that layout.

**Result:**

- update `workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md (Decisions And Contracts; TK-005)` - Records: a symlinked and/or Git-owned discovery root is SUPPORTED, with the write-without-Git rule.
- update `tools/core-skill-installer.mjs and tools/skill-presence.mjs` - Resolve links, write only missing skills into the real directory with marker, never run Git; presence gates agree with the installer.
- update `tools/test-core-skill-installer.mjs` - Tests prove Git-owned and symlinked roots install without touching HEAD or the index.

**Related:** [U313-2](#u313-2)

**Aliases:** unblocking-v3-1-3 planned_questions id 2A

**Notes:** Covers installing missing skills only; replacing an existing skill in a Git-owned root is not part of this answer.

**Provenance (local records):** workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#planned_questions[id=2A]; workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#findings[why-install-is-blocked]

### U313-3

**Topic:** Which assignment carry measures

**Question:** S-049 TK-002 is the first real-use measurement of carry. Which assignment gets carried?

**Status:** withdrawn · answered 2026-09-07, unblocking-v3-1-3 notepad

**Answer:** Withdrawn. Owner: 'This is a you thing. The spec and vertical slice with tracer rounds should be defining this.'

**Reason:** Owner: choosing the assignment is the agent's job, defined by the spec and its tracer-bullet slices, not an owner decision.

**Result:**

- none `none` - No owner decision; the agent picks the assignment. The miss belongs in the notepad as a coordination hand-back.

**Related:** [U313-9](#u313-9), [U313-5](#u313-5)

**Aliases:** unblocking-v3-1-3 planned_questions id 3

**Notes:** The asking agent recorded this as a hand-back: ticket ordering inside an assigned spec is the agent's, per carry's ask gate.

**Provenance (local records):** workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#planned_questions[id=3]; workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#coordination_hand_backs

### U313-4

**Topic:** S-014/S-022 release reconciliation

**Question:** S-014 and S-022 have been blocked on 'owner release-direction reconciliation' since the v3.1.0 era. Given v3.1.3 is the live build, do these get reconciled, superseded, or left parked?

**Status:** withdrawn · answered 2026-09-07, unblocking-v3-1-3 notepad (owner correction)

**Answer:** Out of the agent's scope. Owner: 'You just need to get to the point where you can merge up to integration, I decide when we merge up with main. Main isnt really your concern unless I say to worry about it.'

**Reason:** Owner: main-release direction is his alone; the agent's job ends at integration.

**Result:**

- none `none` - No change to S-014 or S-022; the boundary 'deliver to integration, main is the owner's' governs the session.

**Related:** [U313-0](#u313-0), [U313-6](#u313-6)

**Aliases:** unblocking-v3-1-3 planned_questions id 4

**Provenance (local records):** workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#planned_questions[id=4]; workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#boundaries

### U313-5

**Topic:** S-046 ownership stays with Codex

**Question:** S-046 TK-002 is ready and owned by codex. Is codex still active on it, or does ownership move?

**Status:** withdrawn · answered 2026-09-07, unblocking-v3-1-3 notepad (self-resolved)

**Answer:** No owner answer; withdrawn by the asking agent. It chose to stay out of S-046 entirely - Codex owns it, and not touching it is safe under any answer.

**Reason:** Agent's reasoning: staying out is safe whatever the answer, so the question failed carry's ask gate.

**Result:**

- none `none` - No change; S-046 stays in Codex's lane.

**Related:** [U313-1B](#u313-1b)

**Aliases:** unblocking-v3-1-3 planned_questions id 5

**Notes:** Self-resolved by the asking agent; not an owner decision.

**Provenance (local records):** workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#planned_questions[id=5]; workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#coordination_hand_backs

### U313-6

**Topic:** S-047/S-048 in v3.1.3 scope

**Question:** S-047 (visible identifiers) and S-048 (checkpoint retirement) are planned, unblocked, unassigned. In v3.1.3's scope or not?

**Status:** withdrawn · answered 2026-09-07, unblocking-v3-1-3 notepad (owner correction)

**Answer:** Out of the agent's scope. Owner: 'You just need to get to the point where you can merge up to integration, I decide when we merge up with main. Main isnt really your concern unless I say to worry about it.'

**Reason:** Owner: release contents and main are his call; the agent only needs to reach integration.

**Result:**

- none `none` - No scope decision for S-047/S-048 taken in this session.

**Related:** [U313-0](#u313-0), [U313-4](#u313-4)

**Aliases:** unblocking-v3-1-3 planned_questions id 6

**Provenance (local records):** workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#planned_questions[id=6]

### U313-7

**Topic:** Decision-recovery zip relocation

**Question:** workbench/feedback/llm-workbench-decision-recovery.zip is untracked and 869KB. Commit, relocate, or delete? A spec evidence row cites it, and a cold reader currently cannot resolve that citation.

**Status:** locked · answered 2026-09-07, unblocking-v3-1-3 notepad; owner words recovered 2026-09-23 (triage v2)

**Answer:** Move it to the GPT_OS workbench root (a private repo): 'We can do something with it later.' The private copy must be byte-identical by sha256, and no copy stays in the LLM_Workbench tree.

**Reason:** Recorded finding: LLM_Workbench is a public repo, the feedback lane is not ignored, and the zip held personal conversation content one 'git add -A' from publication.

**Result:**

- create `llm-workbench-decision-recovery.zip in the GPT_OS workbench root (private, outside this repo)` - Holds the zip privately, byte-identical to the original by sha256.
- retire `workbench/feedback/llm-workbench-decision-recovery.zip` - No copy in the public LLM_Workbench tree.
- update `workbench/specs/S-049-assignment-ownership-and-coordination-record/SPEC.md (evidence) and workbench/feedback/REPORT-decision-triage-2026-09-07.md, decision-triage-2026-09-07.json, decision-triage-second-pass-2026-09-07/first-pass-snapshot.json` - Record the relocation and its sha256 check, and cite the private location rather than the old repo path.

**Aliases:** unblocking-v3-1-3 planned_questions id 7

**Notes:** Citations that name the old in-repo path repoint to the private location (see the S-049 result).

**Provenance (local records):** workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#planned_questions[id=7]; workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#findings[public-repo-exposure]; workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md:48

### U313-8

**Topic:** Correct stale main-has-no-workbench claim

**Question:** The stale 'main carries no workbench/ root' claim survives in the append-only evidence of six completed specs (S-037, S-038, S-040, S-041, S-042, S-044). Leave it, or open a correcting spec?

**Status:** locked · answered 2026-09-07, unblocking-v3-1-3 notepad

**Answer:** Fold one correcting row into S-045 naming the false claim, the completed specs carrying it, and the measurement that disproves it. No new spec.

**Reason:** Not recorded.

**Result:**

- update `workbench/specs/S-045-v3-1-2-follow-ups/SPEC.md (append-only evidence, correcting row)` - One row names the false claim, every completed spec carrying it, and the disproving measurement; the completed specs' own rows stay unedited.

**Aliases:** unblocking-v3-1-3 planned_questions id 8

**Notes:** When measured, the count was seven specs, not six. The correcting row was itself later corrected by an appended withdrawal row.

**Provenance (local records):** workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#planned_questions[id=8]

### U313-9

**Topic:** GENESIS template skill count

**Question:** templates/GENESIS.md hardcodes 'exact 17-skill policy' - a release-specific number inside the generic template. Pre-existing dogfood smell. Fix in v3.1.3 or accept?

**Status:** withdrawn · answered 2026-09-07, unblocking-v3-1-3 notepad (self-resolved)

**Answer:** No owner answer; withdrawn by the asking agent as its own call: leave the count as-is.

**Reason:** Agent's reasoning: the count is correct at copy time, pre-existing, and held by the S-049 guard so it cannot go stale silently; a low-risk reversible in-scope call to state, not ask.

**Result:**

- none `templates/GENESIS.md and tools/test-skill-catalog.mjs` - Count stays as written; the catalog test keeps it matched to the bundle size.

**Related:** [U313-3](#u313-3)

**Aliases:** unblocking-v3-1-3 planned_questions id 9

**Notes:** Self-resolved by the asking agent; not an owner decision. The count follows the bundle, which later owner decisions set at 21.

**Provenance (local records):** workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#planned_questions[id=9]; workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#coordination_hand_backs

### U313-10

**Topic:** Grilling the five CAND adjudications

**Question:** Grill the five CAND adjudications (CAND-F/N/O/P/Q) from today's decision triage, or leave them to their own docket and session?

**Status:** superseded · answered Never answered as asked; overtaken 2026-09-08 (S-050 reconciliation)

**Answer:** Not put to the owner in this session; the five were carried forward as open owner decisions. Superseded by the owner's 2026-09-08 decisions and make-it-so promotion, which gave each candidate its own accepted ADR (CAND-F 0046, CAND-N 0051, CAND-O 0052, CAND-P 0053, CAND-Q 0054).

**Reason:** Not recorded.

**Result:**

- create `workbench/docs/adr/0046-core-personal-shared-and-room-local-skill-ownership.md, 0051, 0052, 0053, 0054` - One accepted ADR per CAND item.
- update `workbench/specs/S-050-workbench-v3-2-0-release/reconciliation.json` - Records the CAND reconciliation and owner answer sources.

**Related:** [CAND-N](#cand-n)

**Aliases:** unblocking-v3-1-3 spawned_branches id 10

**Notes:** Listed as a spawned branch, not a planned question.

**Provenance (local records):** workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#spawned_branches[id=10]; workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#promoted.open_carried_forward

## CAND - Private session transport (CAND-N)

### CAND-N

**Topic:** Cross-machine session continuity

**Question:** How should session continuity cross machines? (2026-09-21 follow-up: should CAND-N stay deferred until the private repository and live Mac/Windows/provider resources exist, or are they now available for a separately authorized proof?)

**Status:** locked · answered 2026-09-08 (owner message, make-it-so promotion); reconfirmed 2026-09-21 blocked-obligations-review decision-001 (recorded 2026-09-22T01:57Z)

**Answer:** 2026-09-08: use optional private Git transport (workbench_sessions) with a stable Workbench identity, selected live collections, one writer per note, preserved conflicts and explicit remote confirmation; Git history retention accepted. 2026-09-21: 'Approved transport design remains settled. Clean up the failed audit first; then use the real PC handoff as a deployment-readiness test before any merge to main.' That interview authorized no test or cleanup.

**Reason:** 2026-09-07: the owner works on two machines, is open to a shared private Git repo, found Meshnet file transfer unsatisfactory, and the OpenBrain solution had not been built. 2026-09-21: the prior audit failed, so the Workbench was not ready for the PC readiness test.

**Result:**

- create `workbench/docs/adr/0051-optional-private-git-transport-for-session-continuity.md` - Accepted transport decision, including accepted Git-history retention and non-authority of transported notes.
- update `workbench/specs/S-052-private-session-transport/SPEC.md TK-004` - Record the sequencing: clean up the failed audit, then the real Mac/Windows Claude/Codex handoff as the pre-main readiness test.
- update `workbench/tools/session-transport.mjs; RUNBOOK.md session transport; AGENTS.md Session Records and templates/AGENTS.md` - Sync helper and controls allow explicitly configured private sync of selected live collections.

**Related:** [U313-10](#u313-10), [ACC-1](#acc-1)

**Aliases:** decision-triage CAND-N (R054, R136); blocked-obligations-review CAND-N

**Notes:** Original wording 'How continuity crosses machines' is a triage title, reconstructed as a question. The 2026-09-07 six-point recommendation was an agent proposal; the owner's 2026-09-08 selection adopted it. The 2026-09-21 answer makes the real cross-device handoff the pre-main readiness test.

**Provenance (local records):** workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-001; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#current.questions[CAND-N]; workbench/sessions/grilling/cand-n-private-session-transport-2026-09-07.json; workbench/specs/S-050-workbench-v3-2-0-release/reconciliation.json (CAND-N)

## BPR - Blueprint and ADR boundary review

### BPR-1

**Topic:** Blueprint vs ADR reader contracts

**Question:** What is the actual problem: why did BLUEPRINT.md appear to restate ADRs, and what reader contract should each artifact satisfy?

**Status:** locked · answered 2026-09-08, blueprint-adr-boundary-2026-09-08 decision-002 (with decision-001); restated in BPR review 2026-09-09 decision-001

**Answer:** Each artifact has one job. BLUEPRINT.md is the 'future state and grand design' of the finished product; active ADRs are authoritative cross-cutting decisions with their reasoning; Specs detail the capabilities that move verified Actuality toward the Blueprint within ADR limits; AGENTS owns behavior and authority, RUNBOOK operation, LEXICON shared language and navigation. Formula: Blueprint target + active ADRs + verified Actuality -> Specs.

**Reason:** Kayden rejected the premise that binding architecture must be copied out of ADRs, so ADRs 'regain architectural importance' and keep the reasons for what was done. Recorded interpretation: the Blueprint seemed to restate ADRs because ownership had drifted and it was carrying decision and operational material.

**Result:**

- create `workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md` - Record the ownership split: Blueprint is the destination narrative, not status, catalog or ADR inventory; active ADR decisions are Canon; the Lexicon owns the only Context Map; Specs own scoped delivery.
- update `AGENTS.md (Authority Order, State Resolution) and templates/AGENTS.md` - State that active ADR decisions are architectural Canon and the Blueprint describes the desired finished product without status or catalogs.
- update `LEXICON.md (Artifact Ownership Schema) and templates/LEXICON.md` - Route each question type to its single owning artifact under this split.
- create `workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md` - Carry the ownership model as a capability with the full question disposition.

**Related:** [BPR-2](#bpr-2), [BPR-4](#bpr-4), [BPR-5](#bpr-5), [BPR-5A](#bpr-5a)

**Aliases:** BPR source id 1; workbench-foundation-rework BPR-1; blueprint-adr-boundary-2026-09-08 decision-002 (ownership model)

**Notes:** The question itself is a retrospective framing written in the 2026-09-09 review; it was not asked in these words. The answer is the owner's locked ownership model from the 2026-09-08 note. ADR-000A wholly supersedes ADR-0002 and ADR-0025.

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[0]; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#finding-001; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#decision-001; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#finding-001; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#decision-001; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#decision-002; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-1); workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md (Grilling Record Reconciliation)

### BPR-2

**Topic:** Universal reading and routing owner

**Question:** What must every agent read on every run, and which control owns routing to everything else?

**Status:** locked · answered 2026-09-08, blueprint-adr-boundary-2026-09-08 decision-003 (Q2) and decision-005 (Q4); restated in BPR review 2026-09-09 decision-003

**Answer:** Only AGENTS.md, RUNBOOK.md and LEXICON.md are universal reading on every run; Blueprint and ADRs are not universal startup context and are reached by routing. LEXICON.md owns the single Context Map, RUNBOOK.md owns the ordinary entry procedure and points to it, and AGENTS.md requires traverse-don't-search without duplicating the map.

**Reason:** Inference: keep startup reading small and reach Blueprint, ADRs, Specs, Wiki and source only when the task needs them, through one map instead of several copies. No further stated reason is recorded.

**Result:**

- update `LEXICON.md (Task Routing / Context Map entry routes) and templates/LEXICON.md` - Hold the one Context Map from needs to owning artifacts.
- update `RUNBOOK.md (entry procedure) and templates/RUNBOOK.md` - Own ordinary entry AGENTS -> RUNBOOK -> LEXICON and direct agents to the Lexicon map.
- update `AGENTS.md (opening, Traverse Don't Search) and templates/AGENTS.md` - Require traversal from the entry route and link to the map without copying it.
- create `workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md` - State that the Lexicon owns the only Context Map.

**Related:** [BPR-1](#bpr-1)

**Aliases:** BPR source id 2; workbench-foundation-rework BPR-2; blueprint-adr-boundary-2026-09-08 Q2 and Q4

**Notes:** BPR-2 merges two original questions: 2026-09-08 Q2 (universal reading) and Q4 (routing owner), so BPR numbers 2-4 do not match the original note. Wording and ruling in the 2026-09-09 review were reconstructed retrospectively from the owner's locked 2026-09-08 grilling note (blueprint-adr-boundary-2026-09-08) and the task chat, not asked again live; the owner's original lock is cited in source_refs.

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[1]; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#decision-003; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#decision-003; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#decision-005; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-2); workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md (Grilling Record Reconciliation)

### BPR-3

**Topic:** Governance Planes inside ADRs

**Question:** How do Governance Planes apply to an ADR?

**Status:** locked · answered 2026-09-08, blueprint-adr-boundary-2026-09-08 decision-004; restated in BPR review 2026-09-09 decision-002

**Answer:** Planes classify claims, not whole ADRs. In an accepted, non-superseded ADR the active decision claim is architectural Canon; rationale and alternatives usually give Grounding; provenance and history may give Enduring Context. A proposed ADR holds no Canon. A superseded ADR keeps historical context while its explicit successor carries active Canon.

**Reason:** The owner's lock says this 'restores intended ADR authority' and corrects the then-current rule that an ADR decision binds only after being copied into another control.

**Result:**

- create `workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md` - Say planes classify one claim in one operation, never a whole ADR; rationale, provenance and alternatives stay distinct from the active decision.
- retire `workbench/docs/adr/archive/0025-planes-classify-claims-not-whole-artifacts.md` - Wholly superseded by ADR-000A.
- update `AGENTS.md (State Resolution) and templates/AGENTS.md` - Active ADR decision claims are Canon; rationale and historical alternatives remain evidence.
- update `LEXICON.md (Governance Core, ADR term) and templates/LEXICON.md` - Define ADR so decision and rationale stay distinguishable.

**Related:** [BPR-4](#bpr-4)

**Aliases:** BPR source id 3; workbench-foundation-rework BPR-3; blueprint-adr-boundary-2026-09-08 Q3

**Notes:** Wording and ruling in the 2026-09-09 review were reconstructed retrospectively from the owner's locked 2026-09-08 grilling note (blueprint-adr-boundary-2026-09-08) and the task chat, not asked again live; the owner's original lock is cited in source_refs.

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[2]; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#decision-002; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#decision-004; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-3); workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md (Grilling Record Reconciliation)

### BPR-4

**Topic:** Accepted ADRs as architectural Canon

**Question:** Should an accepted, non-superseded ADR decision be authoritative architectural Canon?

**Status:** locked · answered 2026-09-08, blueprint-adr-boundary-2026-09-08 decision-001 (Q1); restated in BPR review 2026-09-09 decision-002

**Answer:** Yes. An accepted, non-superseded ADR is authoritative for its cross-cutting decision until it is explicitly superseded, and it 'preserves the reasons behind what has been done'. It does not need to be copied into another control to bind.

**Reason:** Kayden challenged the premise that execution must not depend on decision history (2026-09-08 finding-001). ADR-000A records the rejected alternative: requiring every ADR rule to be duplicated in another control obscures ownership.

**Result:**

- create `workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md` - Accepted, non-superseded ADR decision claims are architectural Canon directly; canonicalized_in names operational owners and is not a duplication prerequisite; no instruction authority is granted.
- retire `workbench/docs/adr/archive/0002-binding-rules-stay-in-current-controls.md` - Wholly superseded by ADR-000A.
- update `AGENTS.md (State Resolution) and templates/AGENTS.md` - State accepted active ADR decision claims are architectural Canon without enlarging instruction authority.

**Related:** [BPR-3](#bpr-3), [BPR-1](#bpr-1)

**Aliases:** BPR source id 4; workbench-foundation-rework BPR-4; blueprint-adr-boundary-2026-09-08 Q1

**Notes:** BPR-4 is the original 2026-09-08 Q1 ('Should accepted non-superseded ADRs be authoritative?'). Wording and ruling in the 2026-09-09 review were reconstructed retrospectively from the owner's locked 2026-09-08 grilling note (blueprint-adr-boundary-2026-09-08) and the task chat, not asked again live; the owner's original lock is cited in source_refs.

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[3]; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#decision-002; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#finding-001; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#decision-001; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-4); workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md (Grilling Record Reconciliation)

### BPR-5

**Topic:** Blueprint destination-only time horizon

**Question:** How should Blueprint distinguish the desired finished product from achieved state, version history, health, and evidence?

**Status:** locked · answered 2026-09-08, blueprint-adr-boundary-2026-09-08 decision-006; restated in BPR review 2026-09-09 decision-004

**Answer:** Blueprint describes the destination: the coherent narrative of the finished product, its goals, what it solves, desired behavior, qualities and how the architectural parts work together. It excludes current activity, completion status, version goals, release mechanics and implementation evidence. It may summarize how active ADRs combine but is not a list of ADRs. Project-wide client requirements may belong there.

**Reason:** Inference from S-00A: the old Blueprint mixed destination, version, status, evidence and a generated catalog, so agents had to reconstruct which claims were current. No separate owner reason is recorded.

**Result:**

- update `BLUEPRINT.md and templates/BLUEPRINT.md` - Rewrite as destination-only narrative with no status, version, evidence or catalog material.
- create `workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md` - Define the Blueprint as the adaptable narrative of the desired finished product.
- update `AGENTS.md (State Resolution) and templates/AGENTS.md` - The Blueprint carries no current status, release chronology or generated capability catalog.
- update `LEXICON.md (Blueprint term) and templates/LEXICON.md` - Define Blueprint as destination narrative, not status, ADR inventory or proof archive.

**Related:** [BPR-5A](#bpr-5a), [BPR-8A](#bpr-8a), [BPR-8B](#bpr-8b)

**Aliases:** BPR source id 5; workbench-foundation-rework BPR-5; blueprint-adr-boundary-2026-09-08 Q5

**Notes:** Wording and ruling in the 2026-09-09 review were reconstructed retrospectively from the owner's locked 2026-09-08 grilling note (blueprint-adr-boundary-2026-09-08) and the task chat, not asked again live; the owner's original lock is cited in source_refs.

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[4]; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#decision-004; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#decision-006; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-5); workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md (Grilling Record Reconciliation)

### BPR-5A

**Topic:** Blueprint vs Spec vs ADR placement

**Question:** What placement rule separates Blueprint requirements, Spec requirements, and ADR-worthy decisions?

**Status:** locked · answered 2026-09-08, blueprint-adr-boundary-2026-09-08 decision-007; restated in BPR review 2026-09-09 decision-004

**Answer:** Blueprint holds durable whole-product outcomes and constraints. Specs hold scoped, testable capability requirements. ADRs hold accepted cross-cutting architectural choices from consequential tradeoffs. A whole-product client requirement can sit in the Blueprint without an ADR; implementation specifics and acceptance go in Specs; an ADR exists only for the architectural choice and why.

**Reason:** Stated in the lock: an ADR exists 'only for the architectural choice and why', so requirements and acceptance must not be pushed into ADRs. Worked through a client-requirement example.

**Result:**

- update `LEXICON.md (Artifact Ownership Schema: Destination, Requirements, Decisions rows) and templates/LEXICON.md` - Route whole-product outcomes to Blueprint, scoped requirements to Specs, consequential cross-cutting choices to ADRs.
- create `workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md` - Decisions And Contracts and Blueprint rebuild contract apply this placement rule.
- create `workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md` - Specs own scoped delivery; the Blueprint is not a decision ledger.

**Related:** [BPR-5](#bpr-5), [FND-Q21C](#fnd-q21c), [FND-Q21](#fnd-q21), [TT-Q12](#tt-q12)

**Aliases:** BPR source id 5A; workbench-foundation-rework BPR-5A; blueprint-adr-boundary-2026-09-08 Q5A

**Notes:** Later extended, not reversed: FND-Q21C (2026-09-12) built a four-tier Decisions rule on locked BPR-5A, adding execution-local choices in the Task body and 'always an ADR' for a change to what a Core artifact type owns. Wording and ruling in the 2026-09-09 review were reconstructed retrospectively from the owner's locked 2026-09-08 grilling note (blueprint-adr-boundary-2026-09-08) and the task chat, not asked again live; the owner's original lock is cited in source_refs.

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[5]; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#decision-004; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#decision-007; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-5A); workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md (Grilling Record Reconciliation)

### BPR-6

**Topic:** ADR lifecycle and whole-record supersession

**Question:** What ADR lifecycle and supersession contract makes active traversal deterministic?

**Status:** locked · answered 2026-09-08, blueprint-adr-boundary-2026-09-08 decision-008 (locked except retention, settled in Q6A); restated in BPR review 2026-09-09 decision-005

**Answer:** ADRs are atomic decision units. Proposed has no Canon; accepted carries active architectural Canon; superseded is replaced by an explicit successor that states the complete current decision; deprecated ends Canon without a replacement and needs an explanation. The register separates active and historical records. Partial supersession is prohibited.

**Reason:** Recorded finding: every ADR was marked accepted and supersession was inconsistent free text, including partial supersession, so finding active Canon needed prose reconstruction. An atomic unit with a machine-visible successor fixes that.

**Result:**

- update `workbench/tools/adr.mjs and tools/test-adr.mjs` - Validate proposed/accepted/superseded/deprecated, one whole-record successor, deprecation reason, and reject partial or broken supersession (S-00A TK-00A).
- update `RUNBOOK.md (ADR procedure) and templates/RUNBOOK.md` - Document whole-record supersession and deprecation rules.
- create `workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md` - Supersession replaces a whole record through one valid successor; deprecated records keep an explanation and no active Canon.

**Related:** [BPR-6A](#bpr-6a), [FND-Q23](#fnd-q23)

**Aliases:** BPR source id 6; workbench-foundation-rework BPR-6; blueprint-adr-boundary-2026-09-08 Q6

**Notes:** 'rejected' was kept as historical compatibility (ADR-000A); FND-Q23 later locked the five record statuses. The WF-8F answer later placed lifecycle in folder location (ADR-000I, S-00I), which changes where state lives but not the four-state contract. Wording and ruling in the 2026-09-09 review were reconstructed retrospectively from the owner's locked 2026-09-08 grilling note (blueprint-adr-boundary-2026-09-08) and the task chat, not asked again live; the owner's original lock is cited in source_refs.

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[6]; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#decision-005; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#finding-002; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#decision-008; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-6); workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md (Grilling Record Reconciliation)

### BPR-6A

**Topic:** Historical ADR retention and reachability

**Question:** Should historical ADRs remain reachable?

**Status:** superseded · answered 2026-09-08, blueprint-adr-boundary-2026-09-08 decision-009; restated in BPR review 2026-09-09 decision-005; stable-path half replaced by the WF-8F answer (2026-09-16)

**Answer:** Yes. Superseded and deprecated ADRs stay in the current tree 'at stable paths' as historical evidence; ordinary routing and the default register show only active accepted decisions; history is reached through predecessor/successor links or a history-focused investigation. 'Tidy navigation, not evidence deletion.' Superseded in part by WF-8F (ADR-000I): lifecycle is folder location, and retired ADRs move to a permanent archive/ with link-rewriting moves instead of keeping stable paths.

**Reason:** Kayden asked whether retired ADRs could be deleted since Git keeps them; a committed deletion breaks current-tree links and forces history reconstruction. Keeping them while routing only to active records stops agents treating retired architecture as current.

**Result:**

- update `workbench/docs/adr/REGISTER.md and workbench/docs/adr/HISTORY.md (rendered by workbench/tools/adr.mjs)` - REGISTER shows only accepted active decisions; HISTORY keeps every retained record reachable.
- create `workbench/docs/adr/archive/` - Permanent home for superseded and deprecated ADRs under the later folder lifecycle.
- update `AGENTS.md (Edit Scope dogfood boundary) and templates/AGENTS.md` - Record that the stable-path rule is retired and reachability comes from moves that rewrite links.
- update `workbench/docs/adr/proposed/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md` - Accepted successor rule for where retired records live (S-00P TK-004).

**Related:** [BPR-6](#bpr-6), [WF-8F](#wf-8f), [FND-Q23](#fnd-q23)

**Aliases:** BPR source id 6A; workbench-foundation-rework BPR-6A; blueprint-adr-boundary-2026-09-08 Q6A

**Notes:** Partial supersession: the reachability and active-only-routing halves still stand; only 'stable paths' was replaced. FND-Q23 finding-015 named the locked stable-path rule as an obstacle to folder moves. Wording and ruling in the 2026-09-09 review were reconstructed retrospectively from the owner's locked 2026-09-08 grilling note (blueprint-adr-boundary-2026-09-08) and the task chat, not asked again live; the owner's original lock is cited in source_refs.

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[7]; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#decision-005; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#finding-003; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#decision-009; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-6A); workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md (Grilling Record Reconciliation)

### BPR-7

**Topic:** Scope of the v3.2 ownership repair

**Question:** How broad is the canonical repair?

**Status:** locked · answered 2026-09-08, blueprint-adr-boundary-2026-09-08 decision-010 (after correction-001); restated in BPR review 2026-09-09 decision-006

**Answer:** The comprehensive ownership and routing repair is part of v3.2 and covers the full upstream LLM_Workbench source and generic templates, not only the newest Blueprint section. Downstream project Workbenches get it only through their own explicit update path; an upstream release alone does not change them.

**Reason:** Clarified in correction-001: 'do not repair only v3.2' meant do not edit only the newest v3.2-era Blueprint section, because older sections still in the file carried the same ownership drift.

**Result:**

- update `workbench/specs/S-050-workbench-v3-2-0-release/SPEC.md` - Include the full ownership and routing repair in the v3.2.0 release scope.
- create `workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md` - Deliver the repair across root controls and their templates/ mirrors.
- update `AGENTS.md, RUNBOOK.md, LEXICON.md, BLUEPRINT.md and their templates/ mirrors` - Agree on one ownership model and Context Map.

**Related:** [BPR-7A](#bpr-7a), [BPR-7C](#bpr-7c)

**Aliases:** BPR source id 7; workbench-foundation-rework BPR-7; blueprint-adr-boundary-2026-09-08 Q7

**Notes:** Wording and ruling in the 2026-09-09 review were reconstructed retrospectively from the owner's locked 2026-09-08 grilling note (blueprint-adr-boundary-2026-09-08) and the task chat, not asked again live; the owner's original lock is cited in source_refs.

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[8]; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#decision-006; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#correction-001; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#decision-010; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-7); workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md (Grilling Record Reconciliation)

### BPR-7A

**Topic:** Release proof and missing Blueprints

**Question:** What proves a Workbench version update, and how should missing or unverified Blueprints be handled?

**Status:** locked · answered 2026-09-08, blueprint-adr-boundary-2026-09-08 decision-011 ('locked in part'); narrowed by Q7B1 correction-002; restated in BPR review 2026-09-09 decision-006

**Answer:** Every Workbench version must be proved by successfully updating Example_Workbench (now Workbench Template) to that version. Genesis for a project with no Blueprint should seed a starting Blueprint and a prepared grilling notepad grounded in the project's evidence, and an update should not silently treat an existing Blueprint as owner-validated. Those mechanisms are future capabilities and must not be claimed before built and verified.

**Reason:** For Blueprints, the owner's recorded reason: an update 'cannot assume Kayden participated in the existing Blueprint's creation'. For the release proof, no reason beyond 'always requires proving' is recorded.

**Result:**

- update `AGENTS.md (Template Upgrade Release Gate)` - Every new version must update Workbench_Template before release readiness; producer-only rule, deliberately not mirrored into templates/.
- update `RUNBOOK.md (Template Upgrade Release Gate)` - Own the procedure for the installed-upgrade proof.
- update `workbench/specs/S-050-workbench-v3-2-0-release/SPEC.md` - Record the Workbench Template update proof for v3.2.0.
- create `workbench/specs/S-00C-project-evidence-and-blueprint-grilling/SPEC.md` - Future capability: prepare a project-informed Blueprint grilling record from verified evidence.

**Related:** [BPR-7B](#bpr-7b), [BPR-7B1](#bpr-7b1), [BPR-7B2](#bpr-7b2)

**Aliases:** BPR source id 7A; workbench-foundation-rework BPR-7A; blueprint-adr-boundary-2026-09-08 Q7A

**Notes:** The original 7A lock also required each v3.2-updated room to prepare a Blueprint grilling review; Q7B1 correction-002 removed those future capabilities from v3.2 acceptance, so the BPR restatement treats them as future work. Wording and ruling in the 2026-09-09 review were reconstructed retrospectively from the owner's locked 2026-09-08 grilling note (blueprint-adr-boundary-2026-09-08) and the task chat, not asked again live; the owner's original lock is cited in source_refs.

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[9]; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#decision-011; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-7A); workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md (Grilling Record Reconciliation)

### BPR-7B

**Topic:** Example_Workbench becomes Workbench Template

**Question:** What is Example_Workbench intended to be?

**Status:** locked · answered 2026-09-09 (00:00 UTC), blueprint-adr-boundary-2026-09-08 decision-012; restated in BPR review 2026-09-09 decision-006

**Answer:** Workbench Template: a copyable starter for a blank project. The owner copies it, starts a grilling session, and the Workbench guides project discovery, the project Blueprint and active ADRs, and Spec derivation. The Example-specific product story and CLI tour are not the template's role.

**Reason:** Kayden said it was originally intended to be the reusable starting room. A recorded finding showed the filled Example Blueprint said it was not a template, so 'template from Example' was ambiguous.

**Result:**

- create `workbench/specs/S-00B-workbench-template-reformation/SPEC.md` - Recast the named reference room as a copyable Workbench Template and prove the v3.2 ownership update there.
- update `AGENTS.md and README.md (Workbench_Template, formerly Example_Workbench)` - Name the reference repository Workbench_Template.

**Related:** [BPR-7A](#bpr-7a), [BPR-7B1](#bpr-7b1)

**Aliases:** BPR source id 7B; workbench-foundation-rework BPR-7B; blueprint-adr-boundary-2026-09-08 Q7B

**Notes:** Wording and ruling in the 2026-09-09 review were reconstructed retrospectively from the owner's locked 2026-09-08 grilling note (blueprint-adr-boundary-2026-09-08) and the task chat, not asked again live; the owner's original lock is cited in source_refs.

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[10]; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#decision-006; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#finding-004; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#decision-012; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-7B); workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md (Grilling Record Reconciliation)

### BPR-7B1

**Topic:** v3.2 template proof boundary

**Question:** What template proof belongs in v3.2?

**Status:** locked · answered 2026-09-09 (00:04 UTC), blueprint-adr-boundary-2026-09-08 decision-013 (after correction-002); restated in BPR review 2026-09-09 decision-006

**Answer:** For v3.2 it is enough that LLM Workbench applies the newly settled ownership and routing rules to update Workbench Template successfully. Fresh-copy personalization, prepared project grilling, Genesis completion and validation of a personalized Workbench are future capabilities; v3.2 must not claim them.

**Reason:** Correction-002: requiring v3.2 to copy the template, run Blueprint grilling and Genesis, and validate a personalized room would claim capabilities that still had to be built. The destination stays; only the acceptance boundary moved.

**Result:**

- create `workbench/specs/S-00B-workbench-template-reformation/SPEC.md` - Acceptance is a successful Workbench Template update with the new rules, with no personalization claim.
- update `workbench/specs/S-050-workbench-v3-2-0-release/SPEC.md` - v3.2.0 release proof is the template update; no future personalization is claimed.

**Related:** [BPR-7A](#bpr-7a), [BPR-7B](#bpr-7b), [BPR-7B2](#bpr-7b2)

**Aliases:** BPR source id 7B1; workbench-foundation-rework BPR-7B1; blueprint-adr-boundary-2026-09-08 Q7B1

**Notes:** Wording and ruling in the 2026-09-09 review were reconstructed retrospectively from the owner's locked 2026-09-08 grilling note (blueprint-adr-boundary-2026-09-08) and the task chat, not asked again live; the owner's original lock is cited in source_refs.

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[11]; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#decision-006; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#correction-002; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#decision-013; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-7B1); workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md (Grilling Record Reconciliation)

### BPR-7B2

**Topic:** Staged template-to-project capabilities

**Question:** How should the missing template-to-project path be partitioned?

**Status:** locked · answered 2026-09-09 (00:25 UTC), blueprint-adr-boundary-2026-09-08 decision-014; restated in BPR review 2026-09-09 decision-007

**Answer:** Staged capability Specs: first a valid copyable Workbench Template; then project-evidence intake with a prepared Blueprint grilling notepad; then Genesis turning locked Blueprint and ADR decisions into Specs and a valid project Workbench; then fresh-copy end-to-end proof. Each stage proves its own seam, and the Blueprint keeps the full destination without claiming delivery.

**Reason:** Stated in the lock: 'Each stage proves its own seam.' Inference: staging keeps later steps visible without claiming them in v3.2.

**Result:**

- create `workbench/specs/S-00B-workbench-template-reformation/SPEC.md` - Stage 1: valid copyable Workbench Template.
- create `workbench/specs/S-00C-project-evidence-and-blueprint-grilling/SPEC.md` - Stage 2: project-evidence intake and prepared Blueprint grilling.
- create `workbench/specs/S-00D-genesis-from-blueprint-and-adrs/SPEC.md` - Stage 3: Genesis from locked Blueprint/ADR decisions plus Actuality into Specs and a valid room.
- create `workbench/specs/S-00E-fresh-template-project-proof/SPEC.md` - Stage 4: fresh-copy end-to-end proof.

**Related:** [BPR-7B1](#bpr-7b1), [BPR-7C](#bpr-7c)

**Aliases:** BPR source id 7B2; workbench-foundation-rework BPR-7B2; blueprint-adr-boundary-2026-09-08 Q7B2

**Notes:** The original lock names four stages (template first); the BPR restatement lists the three stages after the template, which is S-00B. Wording and ruling in the 2026-09-09 review were reconstructed retrospectively from the owner's locked 2026-09-08 grilling note (blueprint-adr-boundary-2026-09-08) and the task chat, not asked again live; the owner's original lock is cited in source_refs.

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[12]; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#decision-007; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#decision-014; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-7B2); workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md (Grilling Record Reconciliation)

### BPR-7C

**Topic:** No automatic downstream rollout

**Question:** Does v3.2 itself update every existing downstream Workbench?

**Status:** locked · answered 2026-09-09 (01:08 UTC), blueprint-adr-boundary-2026-09-08 decision-022; restated in BPR review 2026-09-09 decision-007

**Answer:** No. LLM Workbench builds and maintains the reusable system and Workbench Template; it owns no portfolio rollout, automatic propagation, monitoring or automation suite. A real project Workbench is updated only when Kayden explicitly points LLM Workbench at it and asks; otherwise the project is left untouched. 'This is the plan until Kayden changes it.'

**Reason:** Inference: keeps each downstream change target-specific and owner-authorized. The lock states the boundary but no further reason.

**Result:**

- update `AGENTS.md (Template Upgrade Release Gate) and RUNBOOK.md` - The producer release gate does not authorize other room updates or add an external prerequisite to project work.
- create `S-00B through S-00E SPEC.md Non-Goals` - Exclude portfolio rollout and automation; a real project update needs a named target.

**Related:** [BPR-7](#bpr-7), [BPR-7B2](#bpr-7b2)

**Aliases:** BPR source id 7C; workbench-foundation-rework BPR-7C; blueprint-adr-boundary-2026-09-08 Q7C

**Notes:** Wording and ruling in the 2026-09-09 review were reconstructed retrospectively from the owner's locked 2026-09-08 grilling note (blueprint-adr-boundary-2026-09-08) and the task chat, not asked again live; the owner's original lock is cited in source_refs.

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[13]; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#decision-022; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-7C); workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md (Grilling Record Reconciliation)

### BPR-8A

**Topic:** Current-state material leaves Blueprint

**Question:** What current-state material leaves Blueprint completely?

**Status:** locked · answered 2026-09-09 (00:27 UTC), blueprint-adr-boundary-2026-09-08 decision-015; restated in BPR review 2026-09-09 decision-008

**Answer:** Blueprint contains no version history or release goals, live status or current health, implementation evidence, or generated Spec catalog. Version identity goes to the manifest and release Specs; current work and status to Specs and TASKBOARD; verification to tests and evidence; the full Spec inventory is manifest-derived. Blueprint keeps the destination and selective links.

**Reason:** Inference: each of those kinds of material already has its own owner, so keeping a copy in the Blueprint duplicates and goes stale.

**Result:**

- update `BLUEPRINT.md and templates/BLUEPRINT.md` - Remove version, status, evidence and catalog material.
- create `tools/test-blueprint-contract.mjs` - Mechanically check the destination-only shape.
- update `workbench/specs/CATALOG.md` - Own the generated capability inventory instead of the Blueprint.

**Related:** [BPR-5](#bpr-5), [BPR-8D](#bpr-8d), [BPR-8E](#bpr-8e)

**Aliases:** BPR source id 8A; workbench-foundation-rework BPR-8A; blueprint-adr-boundary-2026-09-08 Q8A

**Notes:** Wording and ruling in the 2026-09-09 review were reconstructed retrospectively from the owner's locked 2026-09-08 grilling note (blueprint-adr-boundary-2026-09-08) and the task chat, not asked again live; the owner's original lock is cited in source_refs.

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[14]; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#decision-008; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#decision-015; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-8A); workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md (Grilling Record Reconciliation)

### BPR-8B

**Topic:** Eight-section generic Blueprint shape

**Question:** What is the first adaptable generic Blueprint narrative structure?

**Status:** locked · answered 2026-09-09 (00:30 UTC), blueprint-adr-boundary-2026-09-08 decision-016; restated in BPR review 2026-09-09 decision-008

**Answer:** As a first version, explicitly adaptable through use: product destination; people and problems served; promised outcomes; desired experience and behavior; integrated system design; cross-cutting qualities and constraints; desired creation/update/repair/validation/deployment lifecycle; non-goals. Headings can be adapted and genuinely inapplicable sections omitted.

**Reason:** Stated in the lock: future evidence may refine the shape without weakening the ownership boundary. Why these eight sections was not recorded.

**Result:**

- update `BLUEPRINT.md and templates/BLUEPRINT.md` - Use the eight destination sections.
- create `workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md` - Blueprint Definition And Rebuild Contract lists the eight sections with omission allowed.
- update `LEXICON.md (Blueprint term) and templates/LEXICON.md` - Name the eight elements.

**Related:** [BPR-5](#bpr-5), [BPR-8A](#bpr-8a), [FND-Q06](#fnd-q06)

**Aliases:** BPR source id 8B; workbench-foundation-rework BPR-8B; blueprint-adr-boundary-2026-09-08 Q8B

**Notes:** FND-Q06 later asked whether Blueprint acceptance should rest on recoverable meaning or a fixed outline; its recovered answer limits the exact-heading test to the root and template Blueprints, so downstream rooms keep the 'omit inapplicable sections' latitude. Wording and ruling in the 2026-09-09 review were reconstructed retrospectively from the owner's locked 2026-09-08 grilling note (blueprint-adr-boundary-2026-09-08) and the task chat, not asked again live; the owner's original lock is cited in source_refs.

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[15]; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#decision-008; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#decision-016; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-8B); workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md (Grilling Record Reconciliation)

### BPR-8C

**Topic:** How ADRs appear in Blueprint

**Question:** How should active ADRs appear in Blueprint?

**Status:** locked · answered 2026-09-09 (00:34 UTC), blueprint-adr-boundary-2026-09-08 decision-017; restated in BPR review 2026-09-09 decision-008

**Answer:** Blueprint links active ADRs selectively and inline, only where they materially explain or constrain the destination, synthesizing them into narrative rather than listing them. The active ADR register owns the inventory. Each newly accepted ADR gets a Blueprint relevance check, but the Blueprint changes only when the decision materially changes the destination; there is no mandatory duplication pass.

**Reason:** Recorded in the lock: the Blueprint may start with few or no ADR links because most architectural decisions are discovered while building.

**Result:**

- update `BLUEPRINT.md and templates/BLUEPRINT.md` - Only selective inline links to active ADRs; no ADR list.
- update `workbench/docs/adr/REGISTER.md` - Remain the complete active decision inventory.
- update `RUNBOOK.md (Independent Review Boundaries) and templates/RUNBOOK.md` - Main-readiness review accepts only materially relevant active ADR links in the Blueprint.

**Related:** [BPR-8E](#bpr-8e), [BPR-5](#bpr-5)

**Aliases:** BPR source id 8C; workbench-foundation-rework BPR-8C; blueprint-adr-boundary-2026-09-08 Q8C

**Notes:** The per-ADR relevance check from the original lock is shortened out of the BPR restatement. Wording and ruling in the 2026-09-09 review were reconstructed retrospectively from the owner's locked 2026-09-08 grilling note (blueprint-adr-boundary-2026-09-08) and the task chat, not asked again live; the owner's original lock is cited in source_refs.

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[16]; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#decision-008; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#decision-017; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-8C); workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md (Grilling Record Reconciliation)

### BPR-8D

**Topic:** Lossless Blueprint claim migration

**Question:** How is current Blueprint content migrated without losing meaning?

**Status:** locked · answered 2026-09-09 (00:57 UTC), blueprint-adr-boundary-2026-09-08 decision-018; restated in BPR review 2026-09-09 decision-009

**Answer:** Rewriting the Blueprint requires a complete claim-level disposition: destination claims stay; architectural decisions and rationale go to active ADRs; scoped requirements and delivery state to Specs; procedures to RUNBOOK; terms and routes to LEXICON; evidence and release history to their existing owners. Verify content in its proper owner before removal, keep lineage and supersession; 'nothing is discarded merely for tidiness'.

**Reason:** Stated in the lock: nothing is discarded merely for tidiness; content already in its owner is verified there first so meaning is not lost.

**Result:**

- create `workbench/specs/S-00A-blueprint-active-adr-and-context-map/blueprint-claim-disposition.json` - Source-linked disposition of every claim removed from the root and template Blueprints (S-00A TK-00B).
- update `BLUEPRINT.md and templates/BLUEPRINT.md` - Rewritten only after the disposition exists.

**Related:** [BPR-8A](#bpr-8a), [BPR-8E](#bpr-8e)

**Aliases:** BPR source id 8D; workbench-foundation-rework BPR-8D; blueprint-adr-boundary-2026-09-08 Q8D

**Notes:** Wording and ruling in the 2026-09-09 review were reconstructed retrospectively from the owner's locked 2026-09-08 grilling note (blueprint-adr-boundary-2026-09-08) and the task chat, not asked again live; the owner's original lock is cited in source_refs.

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[17]; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#decision-009; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#decision-018; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-8D); workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md (Grilling Record Reconciliation)

### BPR-8E

**Topic:** Guarding against Blueprint ownership drift

**Question:** What prevents future Blueprint ownership drift?

**Status:** locked · answered 2026-09-09 (00:59 UTC), blueprint-adr-boundary-2026-09-08 decision-019; restated in BPR review 2026-09-09 decision-009

**Answer:** When Kayden asks whether a candidate is ready for main, the independent reviewer checks the Blueprint boundary: destination narrative and whole-product constraints only; no version chronology, live status, Spec inventory, evidence or displaced ADR/Spec/Runbook content; ADR links selective, active and coherent; each new ADR has a recorded Blueprint relevance disposition. Mechanical checks support structure and links but cannot replace semantic review.

**Reason:** Stated in the lock: mechanical checks can catch obvious structure and link faults but cannot judge semantic ownership.

**Result:**

- update `RUNBOOK.md (Independent Review Boundaries, main-readiness) and templates/RUNBOOK.md` - Require an explicit semantic pass/fail verdict on the Blueprint checklist; structure and link checks alone are insufficient.
- create `tools/test-blueprint-contract.mjs` - Mechanical exclusions and link checks for the destination-only shape.
- create `workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md` - Blueprint Review Checklist for the main-readiness reviewer.

**Related:** [BPR-8C](#bpr-8c), [BPR-8F](#bpr-8f), [BPR-8F1](#bpr-8f1)

**Aliases:** BPR source id 8E; workbench-foundation-rework BPR-8E; blueprint-adr-boundary-2026-09-08 Q8E

**Notes:** Wording and ruling in the 2026-09-09 review were reconstructed retrospectively from the owner's locked 2026-09-08 grilling note (blueprint-adr-boundary-2026-09-08) and the task chat, not asked again live; the owner's original lock is cited in source_refs.

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[18]; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#decision-009; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#decision-019; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-8E); workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md (Grilling Record Reconciliation)

### BPR-8F

**Topic:** Integration review vs main review

**Question:** How do integration and main reviews relate?

**Status:** superseded · answered 2026-09-09 (01:02 UTC), blueprint-adr-boundary-2026-09-08 decision-020; restated in BPR review 2026-09-09 decision-009; task-level half replaced by WF-8/WF-8B (2026-09-12)

**Answer:** Integration merge is task-level: a bounded separate-context review of the task candidate. Main is whole-Workbench release-level: independently review the exact integration candidate against the last release, disposition drift, verify coherent Blueprint/ADR/Spec/evidence/template state, then release that exact candidate. Superseded in part by WF-8/WF-8B (ADR-000F): the integration gate reviews the assembled Spec branch, not each Task; the main half stands.

**Reason:** Not recorded for the original split. For the change, ADR-000F records that a Task is too small to show a Spec's acceptance, so a task-level gate can pass repeatedly while the capability stays unmet.

**Result:**

- update `RUNBOOK.md (Independent Review Boundaries) and templates/RUNBOOK.md` - Whole-Workbench main-readiness review checks drift and semantic ownership; integration review wording names the assembled Spec (S-00P TK-003).
- update `AGENTS.md (Git Rules) and templates/AGENTS.md` - Integration gate reviews the Spec branch rather than a per-Task candidate (S-00P TK-002).
- update `workbench/docs/adr/proposed/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md` - Accepted rule fixing the reviewed unit at integration as the Spec branch.
- update `BLUEPRINT.md and templates/BLUEPRINT.md` - Describe independent review of the assembled Spec, not a per-Task ceremony.

**Related:** [BPR-8F1](#bpr-8f1), [BPR-8E](#bpr-8e), [WF-8](#wf-8), [WF-8B](#wf-8b), [FND-Q07](#fnd-q07), [WF-12](#wf-12)

**Aliases:** BPR source id 8F; workbench-foundation-rework BPR-8F; blueprint-adr-boundary-2026-09-08 Q8F

**Notes:** Partial supersession: the main-release half still stands. AGENTS.md and RUNBOOK.md integration wording follows the Spec-branch half (S-00P TK-002, TK-003); the 2026-09-23 gap triage grouped this as 'BPR-8F residual'. Wording and ruling in the 2026-09-09 review were reconstructed retrospectively from the owner's locked 2026-09-08 grilling note (blueprint-adr-boundary-2026-09-08) and the task chat, not asked again live; the owner's original lock is cited in source_refs.

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[19]; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#decision-009; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#decision-020; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-8F); workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md (Grilling Record Reconciliation)

### BPR-8F1

**Topic:** What a readiness request authorizes

**Question:** What does a readiness request authorize?

**Status:** locked · answered 2026-09-09 (01:05 UTC), blueprint-adr-boundary-2026-09-08 decision-021; restated in BPR review 2026-09-09 decision-009

**Answer:** Asking whether a candidate is ready for main authorizes an independent release review and a verdict only, not merge or publication. Kayden keeps approval and merge authority for integration to main. An agent may create the release PR only when explicitly asked, and Kayden still approves and merges it.

**Reason:** Inference: main promotion is owner-only, so a readiness question must not be read as permission to merge. No further reason recorded.

**Result:**

- update `RUNBOOK.md (task routing 'Review a candidate or readiness'; Independent Review Boundaries) and templates/RUNBOOK.md` - Readiness review is review-only; only Kayden approves and merges main.
- update `AGENTS.md (Git Rules) and templates/AGENTS.md` - Only the owner merges integration into main.
- create `workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md` - Whole-Workbench readiness review never authorizes a main merge.

**Related:** [BPR-8F](#bpr-8f), [BPR-8E](#bpr-8e)

**Aliases:** BPR source id 8F1; workbench-foundation-rework BPR-8F1; blueprint-adr-boundary-2026-09-08 Q8F1

**Notes:** Wording and ruling in the 2026-09-09 review were reconstructed retrospectively from the owner's locked 2026-09-08 grilling note (blueprint-adr-boundary-2026-09-08) and the task chat, not asked again live; the owner's original lock is cited in source_refs.

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[20]; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#decision-009; workbench/sessions/notepads/work/blueprint-adr-boundary-2026-09-08.json#decision-021; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-8F1); workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md (Grilling Record Reconciliation)

### BPR-R1

**Topic:** Endpoint after a grilling session

**Question:** What was the correct endpoint after the grilling session?

**Status:** locked · answered 2026-09-09, BPR review decision-010 (locked by Kayden)

**Answer:** The prior chat 'failed at the beginning' because it never actually started a grilling session. Had it started correctly, stopping the grilling session would have been the endpoint. The handoff should then carry the owner-authorized task and authority plus all needed context from the grilling notepad.

**Reason:** Correction-002 records that the handoff scope drifted while the assistant reasoned about make-it-so, from stop-short to running the whole implementation runway. Kayden placed the failure earlier: no real grilling session was started.

**Result:**

- update `workbench/skills/grilling/SKILL.md` - Explicit user direction to stop or hand off ends the interview; hand-off exit composes a Markdown handoff with the exact requested job.
- update `workbench/skills/handoff/SKILL.md` - State the exact job and endpoint; mentioning make-it-so or carry cannot expand it; carry inherited authorization and notepad context.

**Related:** [BPR-R2](#bpr-r2), [BPR-R3](#bpr-r3), [BPR-R4](#bpr-r4)

**Aliases:** BPR source id R1; workbench-foundation-rework BPR-R1

**Notes:** Asked live in the 2026-09-09 retrospective review, not reconstructed. Concerns the handoff incident after the 2026-09-08 grilling (task 01a08334).

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[21]; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#correction-002; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#decision-010; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-R1)

### BPR-R2

**Topic:** Handoffs are human-readable Markdown

**Question:** What handoff format and content were required?

**Status:** locked · answered 2026-09-09, BPR review decision-011 (locked by Kayden)

**Answer:** A human-readable Markdown handoff. The handoff skill 'already should require' this, and its wording should say explicitly that a handoff is a human-readable Markdown file. The JSON notepad stays the working context and is not the handoff.

**Reason:** The assistant had written a JSON handoff, claiming repository rules overrode the skill; the owner could not read it to understand what happened (correction-001).

**Result:**

- update `workbench/skills/handoff/SKILL.md` - Say handoffs are readable Markdown in the declared handoffs collection; never generate a new JSON handoff.
- update `AGENTS.md (Session Records And Checkpoints) and templates/AGENTS.md` - Handoffs are separate human-readable Markdown files; do not serialize a handoff as a JSON notepad.

**Related:** [BPR-R1](#bpr-r1), [BPR-R3](#bpr-r3), [BPR-R4](#bpr-r4)

**Aliases:** BPR source id R2; workbench-foundation-rework BPR-R2

**Notes:** Asked live in the 2026-09-09 retrospective review.

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[22]; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#correction-001; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#decision-011; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-R2)

### BPR-R3

**Topic:** Promotion-and-scoping handoff scope

**Question:** What should the receiving session have been told to do?

**Status:** locked · answered 2026-09-09, BPR review decision-012 (locked by Kayden)

**Answer:** This was a promotion and scoping handoff. The receiving chat should promote the grilling notepad into docs and Specs, using all the skills named for that process, so implementation could happen in a later step. It was not authorized to implement the promoted work in the same step.

**Reason:** Finding-002: the receiving session pushed a specs-only commit and stopped on blockers amid scope ambiguity, because the handoff had drifted toward full implementation. Kayden fixed the endpoint at promotion and specification.

**Result:**

- update `workbench/skills/handoff/SKILL.md` - Carry explicit exclusions: for 'create specifications; do not implement' the recipient authors the named specifications only.
- create `workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md` - Durable record of the locked decisions (with S-00B to S-00E as the staged successors), leaving implementation to later Tasks.

**Related:** [BPR-R1](#bpr-r1), [BPR-R2](#bpr-r2), [BPR-R4](#bpr-r4)

**Aliases:** BPR source id R3; workbench-foundation-rework BPR-R3

**Notes:** Asked live in the 2026-09-09 retrospective review.

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[23]; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#finding-002; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#decision-012; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#finding-004; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-R3)

### BPR-R4

**Topic:** Handoff success criterion

**Question:** What evidence must be checked before claiming the handoff or implementation succeeded?

**Status:** locked · answered 2026-09-09, BPR review decision-013 (locked by Kayden)

**Answer:** The handoff succeeds when the new chat can complete the task it was created for, using the authority and context the handoff carries. Success is not measured by completing ceremony after the handoff file exists.

**Reason:** Recorded interpretation: the proof is the recipient completing the task within scope, not file existence or post-handoff ritual. It answers the agent's broader proof checklist (correction-003) with a simpler test.

**Result:**

- update `workbench/skills/handoff/SKILL.md` - Read the Markdown as the recipient: can they state the job, limits and next step; file existence alone is insufficient.

**Related:** [BPR-R1](#bpr-r1), [BPR-R2](#bpr-r2), [BPR-R3](#bpr-r3)

**Aliases:** BPR source id R4; workbench-foundation-rework BPR-R4

**Notes:** Asked live in the 2026-09-09 retrospective review. Correction-003's detailed proof checklist (read back note, inspect branch, run diagnostics) was the agent's proposed rule; the owner's lock is the simpler recipient-completion test.

**Provenance (local records):** workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#current.questions[24]; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#finding-003; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#correction-003; workbench/sessions/notepads/grilling/blueprint-adr-boundary-review-2026-09-09.json#decision-013; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (BPR-R4)

## FND - Foundation ownership

### FND-Q01

**Topic:** Idea-to-verified-completion workflow

**Question:** What must a fresh Workbench support from an undeveloped idea, before a Spec exists?

**Status:** locked · answered 2026-09-10, decision-016 (locked); approved 2026-09-12 decision-037; phase names 2026-09-12 decision-047

**Answer:** The workflow starts when the owner brings an idea and runs six phases: Idea -> Align (grilling to a shared design concept) -> Scope (Blueprint plus Specs, updating ADRs and docs) -> Plan (decompose into Tasks) -> Implement (loop over Tasks, tracked on TASKBOARD) -> Verify (to Spec and/or human QA). Destination is in BLUEPRINT, the Journey is a SPEC, each walked Path is a TASK. Prototype is optional, not a standard phase.

**Reason:** Prototype is demoted because the owner 'cares about the idea half far more'. Inference: the workflow must carry an owner's idea through to verified completion, not only execute already-written Specs (the core rhythm of human-directed work within limited context).

**Result:**

- update `BLUEPRINT.md (Desired Experience And Behavior, Desired Lifecycle)` - States the idea-to-verified-completion ladder with Align, Scope, Plan, Implement, Verify; prototype optional; Blueprint is the Destination, Spec the Journey, Task the Path (S-00P TK-001).
- update `workbench/docs/adr/proposed/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md` - Names the six owner phases in place of Explore/Prototype/Implement and treats Prototype as optional (S-00P TK-004).
- update `AGENTS.md, RUNBOOK.md, LEXICON.md (workflow rewrite)` - Controls describe the same six-phase workflow (S-00P TK-002 to TK-004).
- update `templates/BLUEPRINT.md, templates/AGENTS.md, templates/RUNBOOK.md, templates/LEXICON.md` - Generic mirror of the reworked workflow (S-00P TK-005).

**Related:** [FND-Q05](#fnd-q05), [FND-Q17b](#fnd-q17b), [FND-Q02](#fnd-q02)

**Aliases:** original-foundation-audit Q01; RB-workflow-phases

**Notes:** The source notepad records status 'approved' (owner-settled). decision-016 also said verified Specs and Tasks may be deleted; that thread continues in FND-Q07/FND-Q08. The owner said Task-versus-Ticket renaming was not a priority (later settled by ADR-000H). A board note flagged a narrowed reading (the rung ladder instead of the words Scope/Plan/Verify); the destination is the owner's phase names as answered.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-016; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-037; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-047; workbench/specs/S-00P-workflow-canon-rework/SPEC.md TK-001

### FND-Q02

**Topic:** Where the owner sees the journey

**Question:** Where should the owner see the journey from today's product to the destination, including phase rationale and independent work?

**Status:** locked · answered 2026-09-11, decision-021 corrected by correction-005 (via FND-Q02A); approved 2026-09-12 decision-037

**Answer:** TASKBOARD.md is the sole live project-management and Kanban view of the Frontier. It mostly renders active Specs and Tasks (priority, what is hot, progress, lanes, blockers) and holds no irreplaceable detail; Specs and Tasks own that. Agents update or regenerate it as Tasks move, and completed verified Specs and Tasks disappear so the board clears.

**Reason:** Recorded rationale: one board so sitrep can read the active picture from it alone, while single ownership keeps the board regenerable instead of a second tracker (correction-005, decision-021 interpretation).

**Result:**

- update `workbench/docs/adr/proposed/000E-the-frontier-is-the-active-landscape-and-taskboard-renders-it.md` - Accepted decision that the Frontier is the active landscape and TASKBOARD renders it (S-00P TK-004).
- update `LEXICON.md (Taskboard / Hot projection / Work state rows)` - Taskboard is the Kanban and project-management view that projects Spec and Task state; completed work leaves the board.
- update `TASKBOARD.md and templates/TASKBOARD.md` - Board shows active Specs and Tasks only, rendered from their owners, and clears when work is verified complete.

**Related:** [FND-Q02A](#fnd-q02a), [FND-Q17b](#fnd-q17b), [E-1](#e-1)

**Aliases:** original-foundation-audit Q02

**Notes:** decision-037 requires promoting the ownership sentence in the FND-Q02A form because as first worded it contradicted LEXICON.md (board owning state). Later E-1 (2026-09-22, workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-003) redirected the board to a six-lane TASKBOARD.json Agile board; that later answer governs board shape.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-021; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#correction-005; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-037

### FND-Q02A

**Topic:** Taskboard ownership of work state

**Question:** Which artifact owns priority, hotness, swim-lane status, progress, and blockers: TASKBOARD.md itself or the underlying Specs and Tasks?

**Status:** locked · answered 2026-09-11, decision-022; corrected 2026-09-12 decision-035; approved decision-036

**Answer:** The underlying Specs and Tasks own substantive progress, issues, evidence and recoverable context; TASKBOARD.md renders and summarizes them and should hold as little irreplaceable context as possible. Sitrep must be able to read only the board for a complete active picture. Correction: do not call the board the navigation view. It is the Kanban and project-management view; it links to Tasks only because everything is navlinked. The Lexicon keeps the Context Map and Navlink hub role.

**Reason:** Recorded rationale: the board must stay regenerable, so working facts live in the owning Spec or Task; navigation is the Lexicon's job, not the board's (decision-022, decision-035).

**Result:**

- update `workbench/docs/adr/proposed/000E-the-frontier-is-the-active-landscape-and-taskboard-renders-it.md` - Board renders Spec and Task state and authors none; says Kanban/project-management view, not navigation view (S-00P TK-004).
- update `LEXICON.md (Taskboard row, Context Map section) and templates/LEXICON.md` - Taskboard is the Kanban/project-management view; the Lexicon remains the Context Map and Navlink hub.
- update `TASK.md records (ADR-000H) and workbench/tools/spec-workbench.mjs render` - Work state is authored in Spec/TASK.md and projected to the board, never authored on it.

**Related:** [FND-Q02](#fnd-q02), [FND-Q17b](#fnd-q17b), [E-1](#e-1), [RB-Q2A](#rb-q2a)

**Aliases:** FND-Q02A-taskboard-naming

**Notes:** decision-035 corrects decision-022's 'navigation view' wording. RB-Q2A (decision-052) applies this: the board shows only a derived run signal per Task. E-1 (2026-09-22) later reshaped the board into a six-lane TASKBOARD.json; whether it is generated or hand-written was left unconfirmed there.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-022; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-035; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-036; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-052

### FND-Q03

**Topic:** Context boundary and resume load

**Question:** What should end one useful working context, and what must the next one load?

**Status:** answered-in-chat · answered 2026-09-11 decision-026 (FND-Q19); 2026-09-12 chat 05:06-05:42; 2026-09-23 chat TT-Q4 lock (decision-067); recovered in triage v2

**Answer:** A Task is the smallest bounded work that fits one useful context; work expected to exceed one context unit (about 200k tokens, 'a goalpost, not a gate') is a Spec with Tasks. A context ends when its Task is complete and cleaned up: one Chat does one Task, then ends. The next context loads the Contract plus the Task (its Spec acceptance, optional handoff or notepad).

**Reason:** Core rhythm: keep each working window focused while preserving understanding outside it. 200k was chosen because around 200k answer quality starts to degrade and 250k is where a context is compacted or gone (ADR-000H).

**Result:**

- update `workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md (What a Task carries in and out; One Task, one context)` - Packet (TASK.md, Spec acceptance lines, cited paths, Contract; optional handoff/notepad) and per-run Receipt; work over one context unit becomes a Spec with Tasks.
- update `workbench/manifest.json (contextUnit)` - Declares the 200k context unit with provenance as a planning goalpost, never a gate.
- update `LEXICON.md (Task, Packet, Task receipt, Chat, Director rows) and templates/LEXICON.md` - One Chat works one Task, completes and cleans up, then ends; a director starts the next unblocked Task.
- update `workbench/skills/carry/SKILL.md` - Carry works one Task per Chat or acts as director behaviour, never a whole Spec in one Chat (TT-Q4 consequence).

**Related:** [TT-Q4](#tt-q4), [TT-Q3](#tt-q3), [FND-Q19](#fnd-q19), [FND-Q17e](#fnd-q17e)

**Aliases:** TT-Q4 (overlap)

**Notes:** Audit-origin question; the source notepad records it as open; the answer recovered by triage v2 and TT decision-067 settles it. Agent proposal-009 (Suggested A/B) is not the answer. TT decision-067 states FND-Q03 closes on the TT-Q4 answer (context ends at Task close plus cleanup).

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json current.questions[2]; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-026; workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#decision-067; workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md; workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md

### FND-Q04

**Topic:** Software-only or general work

**Question:** Is the reusable Workbench only for software projects, or should the same discovery, validation and continuity model support other work products?

**Status:** not-a-question · answered 2026-09-10 22:56 chat (directive-003, FND-core-rhythm); recovered in triage v2 2026-09-23

**Answer:** Not a question. The owner's core rhythm answers the scope: the Workbench makes 'complex, human-directed work executable within limited AI context windows' by balancing context conservation with context continuity.

**Reason:** The owner stated the governing principle instead of choosing a domain: the project can accumulate knowledge without every working session having to carry all of it.

**Result:**

- none `none` - No separate artifact; the core rhythm is the governing principle carried by FND-Q01 and the Blueprint.

**Related:** [FND-Q01](#fnd-q01), [FND-Q17f](#fnd-q17f)

**Notes:** Came from the agent-run original-foundation-audit. Agent proposals (proposal-015 software core plus project recipes; report options A/B) and the gap-triage 'software first; backlog the rest' are not owner answers.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#directive-003; workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md; workbench/feedback/REPORT-original-foundation-audit-2026-09-10.md

### FND-Q05

**Topic:** What the Blueprint must explain

**Question:** What concrete user situations must the Blueprint explain so a fresh collaborator can reconstruct the intended Workbench?

**Status:** answered-in-chat · answered 2026-09-08 23:07 chat; recovered in triage v2 2026-09-23

**Answer:** The Blueprint is 'the grand design of the finished product', the future-looking goal: what we want and what it should be and have, while Specs fill in the details. 'BLUEPRINT + ADRs = SPECs'. For LLM_Workbench it describes the perfect workbench and how agents deploy it.

**Reason:** Owner: the Blueprint is 'the agents ultimate readme about how to create what we want', the executive-level statement of the goal, so agents can derive Specs from it plus the ADRs.

**Result:**

- update `BLUEPRINT.md` - Future-state description of the finished Workbench against every workflow rung; no current status (S-00P TK-001).
- none `workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md` - Defines the Blueprint as the adaptable destination narrative of the finished product.
- update `templates/BLUEPRINT.md` - Generic destination-only Blueprint shape (S-00P TK-005 if the shape changes).

**Related:** [FND-Q06](#fnd-q06), [FND-Q01](#fnd-q01)

**Notes:** Audit-origin question; the source notepad records it as open; the answer recovered by triage v2 settles it. The owner's answer predates the question (given 2026-09-08) and was mapped to it by triage v2. Agent report options (five scenario walkthroughs) were never adopted.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json current.questions[4]; workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md; workbench/specs/S-00P-workflow-canon-rework/SPEC.md TK-001

### FND-Q06

**Topic:** Blueprint acceptance: outline or meaning

**Question:** Should Blueprint acceptance be defined by recoverable product meaning or by a fixed outline?

**Status:** answered-in-chat · answered 2026-09-09 22:39 (owner-accepted S-00A text); recovered in triage v2 2026-09-23

**Answer:** Eight sections, with headings adapted to the product and a genuinely inapplicable section omitted rather than filled with boilerplate. The fixed-heading test applies only to the root and template Blueprints.

**Reason:** Inference: the Blueprint is an adaptable destination narrative (ADR-000A, S-00A), so rooms adapt it; the exact-heading test only dogfood-checks the two canonical files.

**Result:**

- none `workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md` - Records the eight-section shape with adaptable headings and omission of inapplicable sections.
- none `tools/test-blueprint-contract.mjs` - Requires the exact eight headings only in BLUEPRINT.md and templates/BLUEPRINT.md.
- none `templates/BLUEPRINT.md` - Tells downstream rooms to adapt headings and omit a genuinely inapplicable section.

**Related:** [FND-Q05](#fnd-q05)

**Notes:** Audit-origin question; the source notepad records it as open; the answer recovered by triage v2 settles it. The recovered answer is the S-00A text the owner accepted, not a direct reply to this question. Report noted stale Genesis/Adoption Blueprint wording as factual drift (S-00D), not an owner decision.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json current.questions[5]; workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md; workbench/specs/S-00A-blueprint-active-adr-and-context-map/SPEC.md:76-80

### FND-Q07

**Topic:** Specs and Tasks are disposable

**Question:** Was disposability intended for the working synthesis only, or for the feature specification itself?

**Status:** superseded · answered 2026-09-10 decision-017; refined 2026-09-12 correction-011 and decision-039 (held); superseded 2026-09-16 WF decision-070/079/080

**Answer:** For the Spec itself: Specs and Tasks are temporary journey and execution artifacts that may be deleted after QA once surviving truth is reconciled into durable owners; Git history is recovery. Refined to a transient archive cleared after main verification behind a five-part gate, held. Superseded by WF-8D/8E/8F (2026-09-16): same disposability, but Specs are reconciled into the Wiki and retired, discarded only after verified main, no archive; the hold is lifted.

**Reason:** Owner rejected the defense that Specs must stay as history, saying it conflated Spec history with ADR responsibility. WF-8F: once useful content becomes human-readable documentation, the Spec/Task 'is junk and clutter'.

**Result:**

- update `workbench/specs/S-00I-folder-lifecycle-for-records/SPEC.md TK-005, TK-006` - Closed Specs and Tasks are reconciled into durable owners and retired by folder; discard only after verified main, clean reference scan and recoverable Git identity.
- update `workbench/docs/adr/proposed/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md` - Carries no FND-Q07/Q08 hold or transient-archive clearing; matches the WF-8D/8E/8F retirement model (S-00P TK-004).
- update `AGENTS.md (Dogfood boundary lifecycle rule) and templates/AGENTS.md` - Stable-declared-path rule retired; lifecycle is folder location, moved only by move-spec/move-task.
- create `workbench/wiki/ (reconciled capability articles)` - Each retired Spec's current truth lives in a Wiki article per WF-8F/WF-8H.

**Related:** [FND-Q08](#fnd-q08), [WF-8D](#wf-8d), [WF-8E](#wf-8e), [WF-8F](#wf-8f), [WF-8H](#wf-8h), [FND-Q23](#fnd-q23)

**Aliases:** FND-Q07-Q08-archive-lifecycle; FND-Q07-Q08-deletion-gate

**Notes:** The source notepad register records it as 'held'; the later WF decision-079 and decision-080 answers settle the hold (S-00I records the same). Agent report option A (keep held, sixth precondition) was not adopted.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-017; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#correction-011; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-039; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#finding-016; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-080; workbench/specs/S-00I-folder-lifecycle-for-records/SPEC.md Dependencies And Blockers

### FND-Q08

**Topic:** Current-contract route after retirement

**Question:** After three Specs alter one capability, what single route gives a new agent its current contract?

**Status:** superseded · answered 2026-09-10 decision-018; archive reversal 2026-09-12 correction-011, held decision-039; superseded 2026-09-16 WF decision-080

**Answer:** Before a Spec is deleted, every surviving claim is reconciled into its durable owner: Blueprint (destination), ADRs (decisions), source and tests (Actuality), README (setup and use), RUNBOOK (procedures), Wiki (explanation), with Git history for recovery; the Lexicon Context Map routes a fresh agent to those owners. No archive. Superseded by WF-8F (2026-09-16): the Wiki stores the reconciled retired Spec and later corrective Tasks update it; Blueprint, Wiki and Taskboard are the enduring and navigational surfaces.

**Reason:** Recorded rationale: the owner rejected archiving Specs; current truth must not be stranded in a temporary artifact, and a fresh agent must not reconstruct deleted Specs (decision-018, decision-039).

**Result:**

- create `workbench/wiki/ (one reconciled article per retired Spec/feature)` - The Wiki carries each retired capability's current explanation and is the landing route after retirement (WF-8F/WF-8H).
- update `LEXICON.md Context Map (Spec catalog route) and templates/LEXICON.md` - Does not describe the Spec catalog as including completed history; routes current-contract questions to Blueprint, ADRs, Wiki, source/tests, README and RUNBOOK.
- update `workbench/specs/S-00I-folder-lifecycle-for-records/SPEC.md TK-005` - Reconcile-and-retire step moves a closed Spec's surviving claims into these owners before retirement.

**Related:** [FND-Q07](#fnd-q07), [WF-8F](#wf-8f), [WF-8H](#wf-8h), S-00Q

**Notes:** correction-011 reversed decision-018's 'no replacement archive' into a transient archive; WF-8D/8F later replaced that with retire-by-folder and Wiki reconciliation. The source notepad records it as 'held'; the WF-8F answer settles it. Agent proposal-016 (cold-start test) and report option A (OWNERSHIP.json routing, no capability record) were not adopted.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-018; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#correction-011; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-039; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-080

### FND-Q09

**Topic:** Lexicon role; no open questions

**Question:** Where do contested terms, relationships and unresolved design ambiguities live, and how does the Lexicon lead to them?

**Status:** locked · answered 2026-09-11, decision-019

**Answer:** The Lexicon is the Workbench's shared dictionary, Context Map, record of shared understanding and hub of the Navlink system: settled terms, what they mean to the owner and agents, and a link from each to the artifact holding deeper context. It is the starting surface for Traverse, don't search. Unsettled questions do not belong in the Lexicon as if they were defined meaning.

**Reason:** Recorded rationale: the Lexicon owns settled vocabulary plus navigation, while deeper content and open questions stay in their linked owners (decision-019 interpretation).

**Result:**

- update `LEXICON.md (header and Task Routing / Context Map) and templates/LEXICON.md` - Describes the Lexicon as dictionary, Context Map, shared-understanding record and Navlink hub, holding only settled meaning.
- update `owner's personal installed lexicon skill (outside the repo)` - Carries no instruction to record unsettled questions beside settled terms.

**Related:** [FND-Q02A](#fnd-q02a), [FND-Q13](#fnd-q13)

**Notes:** The lexicon skill this answer governs is the owner's personal installed copy, outside the repository; the grilling notepad owns open questions.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-019

### FND-Q10

**Topic:** Pre-schema notes compatibility

**Question:** What compatibility obligation applies to still-needed pre-schema notes?

**Status:** open

**Answer:** Open - no owner answer.

**Reason:** Not recorded.

**Result:**

- none `workbench/tools/notepads.mjs (migrate) and ADR-0040 notepad continuity` - Would own the rule for legacy notes that note discovery cannot read, once decided.

**Related:** [FND-Q11](#fnd-q11)

**Notes:** Audit-origin question. Context: five legacy records were unreadable to note discovery and blocked identifier allocation. Report option A (migrate or retire, never ignore) and gap-triage 'backlog; S-00Q lane' are agent suggestions, not owner answers. A bounded search of the owner's own transcript messages on 2026-09-24 found no answer. The 2026-09-23 triage v2 classed it as agent-carryable, not an owner decision.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json current.questions[9]; workbench/feedback/REPORT-foundation-question-review-2026-09-11.md FND-Q10

### FND-Q11

**Topic:** Whole-record supersession exception

**Question:** Should the whole-record rule govern these older active records too, or is a clearly marked exception intended?

**Status:** open

**Answer:** Open - no owner answer.

**Reason:** Not recorded.

**Result:**

- none `workbench/docs/adr/0054-direct-promotion-into-durable-owners.md, 0028-live-session-records-stay-untracked-and-checkpoints-are-durable.md, workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md` - Would decide whether ADR-0054's partial supersession of ADR-0028 gets a whole successor or a marked exception to ADR-000A.

**Related:** [FND-Q10](#fnd-q10)

**Notes:** Audit-origin question; 'these older active records' means pre-ADR-000A ADRs such as ADR-0054, which partially supersedes ADR-0028. Report option A (successor to ADR-0028 in S-00I TK-002) is an agent suggestion. A bounded search of the owner's own transcript messages on 2026-09-24 found no answer. The 2026-09-23 triage v2 classed it as agent-carryable, not an owner decision.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json current.questions[10]; workbench/feedback/REPORT-foundation-question-review-2026-09-11.md FND-Q11

### FND-Q12

**Topic:** Functions a fresh install must provide

**Question:** Which original functions must a brand-new installation provide, even if their old skill names disappear?

**Status:** answered-in-chat · answered 2026-09-08 06:30 and 2026-09-10 01:47, 01:49 chat; recovered in triage v2 2026-09-23

**Answer:** The Workbench_Template is the answer: each release must 'fully build a working template ... that a room can turn into its own project', and updating the Template to the new version is the release gate.

**Reason:** Owner: updating the example Template 'is how we test the update workbench'; once it works, the version can be called working and applied to active workbenches.

**Result:**

- update `AGENTS.md (Template Upgrade Release Gate) and RUNBOOK.md procedure` - Every new version must upgrade KaydenClark/Workbench_Template and pass its checks before release readiness.
- update `workbench/specs/S-00F-template-upgrade-release-gate/SPEC.md` - Owns the Template upgrade release gate capability.
- update `Workbench_Template repository (external)` - Updated to each release and able to become a working project on its own (S-00E fresh-copy proof).

**Related:** [FND-Q04](#fnd-q04), [FND-Q01](#fnd-q01), [BPR-7A](#bpr-7a)

**Notes:** Audit-origin question; the source notepad records it as open; the answer recovered by triage v2 settles it. The owner quotes were release instructions mapped to this question by triage v2, not a direct reply. Agent proposal-012 (named core skill set) and gap-triage 'the 21-skill lane is the answer' are not owner answers.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json current.questions[11]; workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md; workbench/specs/S-00E-fresh-template-project-proof/SPEC.md

### FND-Q13

**Topic:** When grilling answers enter Canon

**Question:** When grilling and domain modeling run together, when may a settled answer enter Canon, and which helper owns that crossing?

**Status:** locked · answered 2026-09-11, decision-020; reaffirmed 2026-09-22 FND-Q21C (blocked-obligations decision-025)

**Answer:** A grilling answer does not enter Canon inline. Settled material is promoted through ordinary scoped work: a TASK when the change is small and localized, or a SPEC with Tasks when it affects many things. Updating the Lexicon will usually be one Task, which performs and verifies the Canon update under the Contract.

**Reason:** Recorded rationale: grilling plus notepad owns decision capture; a separately authorized Task or Spec owns the Canon edit, which keeps the interview endpoint and resolves domain-modeling's inline-write instruction (decision-020 interpretation).

**Result:**

- update `workbench/skills/grilling/SKILL.md and workbench/skills/promote/SKILL.md` - Grilling never writes Canon during the interview; promotion runs as scoped Task or Spec work.
- update `skills-pending/domain-modeling/SKILL.md ('Update CONTEXT.md inline')` - If the skill enters core, it promotes through Task-based work and makes no inline Canon writes.
- update `LEXICON.md Task row and workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md` - Allow a spec-less Task for small promotion work (E-3 generalizes this).

**Related:** [FND-Q21C](#fnd-q21c), [E-3](#e-3), [TT-Q12](#tt-q12), [FND-Q09](#fnd-q09)

**Notes:** ADR-000H placed Tasks under Specs, which conflicted with the spec-less Task implied here; E-3 (decision-005) later made Tasks-without-Spec an owner answer. FND-Q21C confirmed that editing a Contract artifact is Task execution, not a new decision tier.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-020; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#correction-004; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-025

### FND-Q14

**Topic:** When the human inspects results

**Question:** At what point must the human inspect the actual result before work proceeds, and what should they be shown?

**Status:** locked · answered 2026-09-11 decision-024; corrected 2026-09-12 decision-032; approved decision-036

**Answer:** Two named gates. Spec QA gate: working branch into integration, triggered by the merge request; it checks every Task in the Spec is done and the branch is up to Spec, passing merges and failing denies. Human QA gate: integration into main; integration is the Human QA branch where the owner decides if work is ready or needs more. Human QA is not a release ceremony and is not batched by release.

**Reason:** Owner replaced three overlapping statements with two named gates. Earlier rationale kept: per-Spec owner QA of parallel Specs is inefficient and cannot judge the integrated whole (decision-024).

**Result:**

- update `workbench/docs/adr/proposed/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md` - Records the two gates as an accepted decision (S-00P TK-004).
- update `workbench/specs/S-00J-spec-qa-gate-at-integration/SPEC.md` - Owns the Spec QA gate at the Spec branch into integration and requires recorded owner Human QA approval before closure.
- update `AGENTS.md (Git Rules, Human QA) and templates/AGENTS.md` - Name the Spec QA gate and the integration-to-main Human QA gate (S-00P TK-002, TK-005).
- update `BLUEPRINT.md (Desired Lifecycle)` - Describes Spec review into integration and owner Human QA before main.

**Related:** [FND-Q19](#fnd-q19), [WF-8](#wf-8), [WF-8E](#wf-8e)

**Aliases:** FND-Q14-Q19-qa-lifecycle

**Notes:** decision-032 supersedes decision-024's release-batch reading. The 'what should they be shown' half was not answered here; WF-8 and agent proposal-020 (Human QA lane plus demo artifact) cover it. Notepad status 'approved'.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-024; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-032; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-036

### FND-Q15

**Topic:** Measuring the redesign's effect

**Question:** What observable failure should the redesign reduce, and how will we know it did?

**Status:** answered-in-chat · answered 2026-09-11 directive-004 (held); 2026-09-12 05:42, 05:46 chat; recovered in triage v2 2026-09-23

**Answer:** Out of LLM_Workbench scope: measurement belongs to the audit workbench. 'No budget limit, but budget grading'; 'This is the audit workbench's problem'. Earlier (2026-09-11) the owner held the question until the workflow and foundation were settled.

**Reason:** Owner: a fixed number 'was instantly started to be gamed'; 'we want to optimize, not restrict'. Tracking artifact efficiency across updates is an audit workbench feature, and LLM_Workbench does not run harness feedback reviews.

**Result:**

- none `none (audit workbench project)` - No LLM_Workbench artifact; the audit workbench owns measurement and budget grading.

**Related:** [RB-Q3](#rb-q3), [RB-Q3A](#rb-q3a)

**Aliases:** RB-Q3 (overlap)

**Notes:** The 2026-09-12 quotes answered RB-Q3 (budget/size grading); triage v2 applied them to FND-Q15. The source notepad records it as open; the triage v2 mapping of the 2026-09-12 answer settles it. Agent proposal-014 counters were not adopted.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#directive-004; workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-059

### FND-Q16

**Topic:** Live vs historical release claims

**Question:** Which release or continuity claims should remain live obligations, and which should become explicitly historical or superseded?

**Status:** open

**Answer:** Open - no owner answer.

**Reason:** Not recorded.

**Result:**

- none `TASKBOARD.md projection and the affected Specs (S-014, S-022, S-050, S-052), README.md and LEXICON.md release wording` - Would decide which v3.x release and continuity Specs stay live and which are marked historical or superseded.

**Related:** [FND-Q07](#fnd-q07)

**Notes:** Audit-origin question. Report option A (retire S-014/S-022 as superseded, keep S-050/S-052) and gap-triage remark are agent suggestions. A bounded search of the owner's own transcript messages on 2026-09-24 found no answer. The 2026-09-23 triage v2 classed it as agent-carryable, not an owner decision.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json current.questions[15]; workbench/feedback/REPORT-foundation-question-review-2026-09-11.md FND-Q16

### FND-Q17a

**Topic:** Six-box sketch: sketch or boundary

**Question:** Was this merely an explanatory sketch, or did it contain a structural boundary the current model lacks? ('this' = the six-box sketch: Frontline, Source of Truth, Rules/Reports, Memory/Structure, Intent, Projection)

**Status:** open

**Answer:** Open - no owner answer.

**Reason:** Not recorded.

**Result:**

- none `workbench/wiki/ (design-concept crosswalk) if decided` - Would record whether the six boxes are explanatory only or need a structural home.

**Related:** [FND-Q17c](#fnd-q17c), [FND-Q17d](#fnd-q17d), [FND-Q17e](#fnd-q17e), [FND-Q17f](#fnd-q17f), [FND-Q17g](#fnd-q17g)

**Notes:** Audit-origin residual-sketch question from the original operating-principles reference. Report option A (close as explanatory, Wiki crosswalk) and gap-triage 'backlog as one group' are agent suggestions. A bounded search of the owner's own transcript messages on 2026-09-24 found no answer. The 2026-09-23 triage v2 classed it as agent-carryable, not an owner decision.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json current.questions[16]; workbench/feedback/REPORT-original-foundation-audit-2026-09-10.md section 4.3; workbench/feedback/REPORT-foundation-question-review-2026-09-11.md FND-Q17a

### FND-Q17b

**Topic:** Frontier concept vs Taskboard

**Question:** Was Frontier only a proposed name or a different planning experience?

**Status:** locked · answered 2026-09-11 decision-023; approved 2026-09-12 decision-037; refined 2026-09-19 progress-audit decision-002

**Answer:** Frontier is not a rename of Kanban or Taskboard: it names the active landscape of Specs (Journeys) and Tasks (Paths) managed at once toward the Blueprint; TASKBOARD.md renders it. Refined 2026-09-19 with Matt Pocock's model adapted to Tasks: a Map is a low-resolution index around a destination, Fog is not-yet-specifiable work, the Frontier is the open, unblocked, unclaimed Tasks; the map links, not duplicates.

**Reason:** Recorded rationale: use Frontier for the domain concept and TASKBOARD.md for its projection, and do not conflate concept with file; detailed truth stays in one owning record.

**Result:**

- update `LEXICON.md (Map, Fog, Frontier rows) and templates/LEXICON.md` - Define Map, Fog and Frontier as shared vocabulary; no new structural artifact.
- update `workbench/docs/adr/proposed/000E-the-frontier-is-the-active-landscape-and-taskboard-renders-it.md` - States the Map/Fog/Frontier model and the E-1 six-lane board, not the superseded Journey/Path Frontier wording.
- none `TASKBOARD.md` - Projects the Frontier across Specs and owns no state.

**Related:** [FND-Q02](#fnd-q02), [FND-Q02A](#fnd-q02a), [E-1](#e-1), [TT-Q1](#tt-q1)

**Notes:** The 2026-09-19 refinement replaces decision-023's Journey/Path wording.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-023; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-037; workbench/sessions/notepads/work/grilling-artifact-progress-audit-2026-09-19.json#decision-002

### FND-Q17c

**Topic:** Multi-Spec objectives and Spec nesting

**Question:** Does one objective span multiple capabilities without the owner rebuilding its state?

**Status:** answered-in-chat · answered 2026-09-16 22:06 chat (triage v2; Claude session e6998d8a line 73)

**Answer:** Specs nest and block each other, the same way Tasks do: "SPECs can nest and block each other, same as tasks. we are changing that." In the same message he said a Task can be created and merged into integration without a Spec branch.

**Reason:** Inference: said while planning the rework itself as several Specs run through the system ("an orchestration spec, a rework spec, and a build spec kind of thing ... if we are going to use one let's use a few"), so a multi-capability objective is carried by nested, blocking Specs rather than a new object.

**Result:**

- update `LEXICON.md (Spec row) and templates/LEXICON.md` - A Spec may nest under and block other Specs, as Tasks do.
- update `workbench/tools/spec-workbench.mjs (Blockers) and the board Spec (TASKBOARD.json dependsOn/unblocks, blocked-obligations decision-011)` - Spec-to-Spec blocking is recorded on the Spec record and projected on the board so the chain is visible without the owner rebuilding it.

**Related:** [FND-Q19](#fnd-q19), [FND-Q17d](#fnd-q17d), [FND-Q17e](#fnd-q17e), [TT-Q3](#tt-q3), [WF-12](#wf-12)

**Aliases:** original-foundation-audit Q17c; REPORT-foundation-question-review FND-Q17c (residual sketches)

**Notes:** Both source notepads record it as open; the answer recovered from the owner chat by triage v2 settles it. The 2026-09-11 review proposed a "Journey group" of Specs plus one notepad (agent proposal, not adopted). TT decision-067 (2026-09-23) says a director/dispatcher monitors the Spec and starts each unblocked Task, which also informs this question.

**Provenance (local records):** workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md:33; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#current.questions[18]; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions[18]; workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#decision-067; workbench/feedback/REPORT-foundation-question-review-2026-09-11.md:353

### FND-Q17d

**Topic:** Leftover behavior from Spec managers/Captain

**Question:** Is any missing behavior left after Q02 or Q03, or were these merely possible implementations?

**Status:** open

**Answer:** Open - no owner answer.

**Reason:** Not recorded.

**Result:**

- none `none` - No owner answer; nothing to carry. If later settled, the owning artifact would be the Lexicon Director row and AGENTS.md stance rules.

**Related:** [FND-Q02](#fnd-q02), [FND-Q03](#fnd-q03), [FND-Q17e](#fnd-q17e), [FND-Q17g](#fnd-q17g), [TT-Q5](#tt-q5)

**Aliases:** original-foundation-audit Q17d; REPORT-foundation-question-review FND-Q17d (residual sketches)

**Notes:** The 2026-09-11 review (proposal-002, agent) called it effectively closed by FND-Q02A and TT-Q5 and needing only a restatus; the owner never adopted that. Related owner context: blocked-obligations correction-001 (2026-09-22) says a director is whoever tells the agent what to do and becomes a stance later; TT decision-067 describes the dispatcher/director. Question wording names Q02/Q03 of the original audit; the "Spec managers and Captain" gloss comes from the review report.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#current.questions[19]; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions[19]; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#proposal-002; workbench/feedback/REPORT-foundation-question-review-2026-09-11.md:362

### FND-Q17e

**Topic:** Portable unattended runner or coordinator

**Question:** Is a portable unattended runner actually required, or should core describe a bounded host capability?

**Status:** deferred · answered 2026-09-16 20:13 chat (triage v2; Claude session 16e531bc line 167)

**Answer:** A coordinator comes later; first prove single-Task execution: "There should be a coordinator, but that will be built in a little bit. Right now let's just prove that we can execute a task every single time consistently." Backlog after v4.

**Reason:** "Let's get that bottom rung of the loop done before we start moving up the chain. We don't need every single spec built right now. We just want the future planned on the blueprint."

**Result:**

- update `BLUEPRINT.md (future direction)` - A coordinator/runner is planned future direction, not a v4 build obligation.
- none `none for v4` - No runner Spec before v4; the backlog item waits until single-Task execution is proven.

**Related:** [FND-Q03](#fnd-q03), [FND-Q17c](#fnd-q17c), [FND-Q17d](#fnd-q17d), [WF-7](#wf-7), [WF-10](#wf-10)

**Aliases:** original-foundation-audit Q17e; REPORT-foundation-question-review FND-Q17e (residual sketches)

**Notes:** The source notepads record it as open and the recovered owner answer settles it; proposal-010 (agent, options A/B) was never chosen explicitly. The owner message began "Its more B"; which question and option list that B referred to in that chat is not verified, so it is not recorded as a choice. TT decision-067 (2026-09-23) later names a dispatcher/director that starts the next unblocked Task.

**Provenance (local records):** workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md:34; workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md:64; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#proposal-010; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#proposal-010; workbench/feedback/REPORT-foundation-question-review-2026-09-11.md:371

### FND-Q17f

**Topic:** Recurring approved maintenance actions

**Question:** Are there recurring approved data-retrieval or maintenance actions the present contract cannot express?

**Status:** open

**Answer:** Open - no owner answer. Sorted "backlog after v4" by the 2026-09-23 triage v2 ("recurring maintenance; no need yet").

**Reason:** Not recorded. Inference: the triage judged there is no present need; the owner said on 2026-09-23 that none of the audited rows needs a new owner decision.

**Result:**

- none `none` - No v4 obligation. If revived, the proposed home was a recurring Task form under a standing Spec (agent proposal only).

**Related:** [FND-Q04](#fnd-q04), [FND-Q17g](#fnd-q17g)

**Aliases:** original-foundation-audit Q17f; REPORT-foundation-question-review FND-Q17f (residual sketches)

**Notes:** The 2026-09-23 triage v2 sorted it as backlog after v4 ('recurring maintenance; no need yet'); that is the triage agent's sort, not an owner quote. The review report suggestion (recurring Task form in S-00H) is an agent proposal that was not adopted.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#current.questions[21]; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions[21]; workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md:64-65; workbench/feedback/REPORT-foundation-question-review-2026-09-11.md:382

### FND-Q17g

**Topic:** Which residual sketch names still matter

**Question:** Which residual sketch still expresses a needed behavior after the scope and workflow questions above?

**Status:** open

**Answer:** Open - no owner answer.

**Reason:** Not recorded.

**Result:**

- none `none` - No owner answer; nothing to carry.

**Related:** [FND-Q17a](#fnd-q17a), [FND-Q17d](#fnd-q17d), [FND-Q17f](#fnd-q17f), [WF-2](#wf-2)

**Aliases:** original-foundation-audit Q17g; REPORT-foundation-question-review FND-Q17g (residual sketches)

**Notes:** The 2026-09-11 review (proposal-002, agent) said it was effectively closed by existing routes and suggested disposing each sketch name and closing; the owner never adopted that. Triage v2 sorted it agent-carryable, with no owner decision needed.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#current.questions[22]; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions[22]; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#proposal-002; workbench/feedback/REPORT-foundation-question-review-2026-09-11.md:393

### FND-Q18

**Topic:** First terrain for foundation grilling

**Question:** Which open terrain should we tackle first: ownership and Contract boundaries, workflow and domain scope, continuity and recovery, human validation and completion, skills and capabilities, or outcome and lifecycle proof?

**Status:** locked · answered 2026-09-11, workbench-foundation-rework decision-025 (merged from original-foundation-audit decision-010)

**Answer:** The owner chose the recommended first terrain: artifact ownership and Workbench Contract boundaries, starting with the scope relationship among Blueprint, Spec and Task before allocating the full responsibility inventory or designing any map.

**Reason:** Not recorded. Inference: the recorded order (Blueprint/Spec/Task scope before responsibilities, before any map) treats ownership boundaries as the base the other terrains depend on.

**Result:**

- none `none` - Sequencing choice for the interview; it ordered FND-Q19 onward and carries no durable claim.

**Related:** [FND-Q19](#fnd-q19), [FND-Q21](#fnd-q21)

**Aliases:** original-foundation-audit Q18

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-025; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-025

### FND-Q19

**Topic:** Blueprint, Spec and Task altitudes

**Question:** For a single claim, how should Blueprint at 10,000 ft, Spec at 1,000 ft, and Task at 100 ft divide ownership, refinement, inherited constraints, and upward discoveries?

**Status:** locked · answered 2026-09-11, decision-026 and correction-006; 2026-09-12 decision-046 (approved per decision-036)

**Answer:** Blueprint owns the grand design, start to destination. A Spec is a journey step derived from Blueprint, active ADRs, evidence and Actuality: a smaller goalpost. Tasks are tracer-round vertical slices of a Spec, the smallest work fitting one useful context. The Workbench QAs the finished Spec branch before integration; integration is the owner's Human QA branch; he merges to main. A Task is one fresh context, one branch, a packet and a receipt.

**Reason:** Not recorded as a stated reason. The owner gave a worked example (a webapp Blueprint yielding login-page, email-form and shopping-cart Specs). correction-006 separates Workbench branch QA from Human QA, so Human QA is not a release batch by default.

**Result:**

- update `workbench/docs/adr/proposed/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md` - Accepted record that Blueprint, Spec and Task are three altitudes of one delivery chain.
- update `workbench/docs/adr/proposed/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md` - Accepted two QA gates: Spec branch to integration (Workbench QA), integration to main (owner Human QA).
- update `workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md` - Task is a standalone TASK.md, the unit of context, branch and receipt.
- update `LEXICON.md (Blueprint, Spec, Task rows) and templates/LEXICON.md` - Altitude definitions match the answer.

**Related:** [FND-Q13](#fnd-q13), [FND-Q03](#fnd-q03), [FND-Q14](#fnd-q14), [FND-Q20](#fnd-q20), [TT-Q2](#tt-q2), [TT-Q3](#tt-q3), [RB-Q1](#rb-q1), [RB-Q2](#rb-q2), [FND-Q17c](#fnd-q17c)

**Aliases:** original-foundation-audit Q19; RB-task-unit (decision-046)

**Notes:** Owner caveat on decision-046: "If you meant as something entirely different than our current task.md, then I think you figured out what should be our ticket definition" (resolved by RB-Q2: no level beneath Task). Later answers refine it: Tasks may exist without a Spec (E-3/E-9, blocked-obligations correction-004; FND-Q13 decision-020); on 2026-09-16 the owner said a Task can merge to integration without a Spec branch; S-00O exemption 2 defers the Spec-branch topology (S-00P WF-7). TT-Q2 reads a standalone TASK.md as already approved through this answer.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-026; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#correction-006; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-036; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-046; workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#decision-042; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#correction-004

### FND-Q20

**Topic:** Ownership map relation vocabulary

**Question:** Which relationship terms are necessary and sufficient for agents to traverse the ownership model without flattening it?

**Status:** locked · answered 2026-09-12, workbench-foundation-rework decision-060; reconfirmed 2026-09-22, blocked-obligations decision-002

**Answer:** Nine relations: owns, inherits, refines, references, summarizes, provides evidence for, canonicalizes, supersedes, blocks. Each is stored once, directional, with no inverse vocabulary (the query renders reverse labels), and each carries an instance_edge route to where instances are recorded. Inherits and refines stay separate. On 2026-09-22 he confirmed it stays locked: the decision was never blocked, only S-00G delivery was, and inherits-versus-refines needs a durable explanation.

**Reason:** A hand-kept inverse list is a derived view maintained by hand, which the maintain-once-derive-views rule forbids. Inherits and refines answer different questions: refines narrows a destination down the delivery chain; inherits binds a constraint the child may never weaken, which carries the upward-discovery rule.

**Result:**

- create `workbench/specs/S-00G-ownership-map-root-control/SPEC.md (TK-001 schema) and OWNERSHIP.json` - The map schema carries the nine directional relations, each with an instance_edge route; no inverse terms.
- update `workbench/docs/adr/proposed/000D-the-ownership-map-is-an-exhaustive-type-level-framework-answered-by-structured-query.md` - Accepted ownership-map ADR states every relation is type-level with the instance-identifier guard applying to all nine.
- create `Durable explanation of inherits vs refines (owner not yet named; candidates LEXICON.md or a Wiki article)` - The settled inherits/refines distinction is written where agents read it.

**Related:** [FND-Q19](#fnd-q19), [FND-Q21](#fnd-q21), [FND-Q21B](#fnd-q21b), [FND-Q23](#fnd-q23)

**Aliases:** original-foundation-audit Q20; blocked-obligations-review FND-Q20 (2026-09-22 revisit)

**Notes:** decision-060 settles a reviewer counter-proposal (proposal-021) in part: it took the no-inverse substitution, rejected the collapse of inherits and refines into derives_from, and widened the type-level point. The board wording adds "Owner says the proposed vocabulary looks mostly complete". The 2026-09-22 revisit asked "Should FND-Q20 remain locked as recorded?". FND-Q24 decision-066 later notes that primary ownership versus supporting roles is not yet expressible in these nine.

**Provenance (local records):** workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-060; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#proposal-021; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-002; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#current.questions (FND-Q20)

### FND-Q21

**Topic:** Allocating responsibilities across artifacts

**Question:** How should the 27 responsibilities be allocated across artifact types and scopes, starting with the most consequential boundary that current controls leave ambiguous?

**Status:** locked · answered 2026-09-12 (decisions 061-063); refined 2026-09-22 in blocked-obligations decisions 018, 019, 025, 026

**Answer:** Answered through its sub-questions: comprehensive type-level coverage answered by query (FND-Q21A); six scoped rows, with the Taskboard first-class as the project-wide representation of work state (FND-Q21B); a four-tier Decisions rule (FND-Q21C); 21 single-owner rows plus a 28th Representation/monitoring row, so the inventory is 28, owner-locked (FND-Q21D).

**Reason:** directive-007: every artifact type exists to answer a question an agent asks, so the question column is the query key and a row answering a distinct question earns its own row.

**Result:**

- create `workbench/specs/S-00G-ownership-map-root-control/SPEC.md and OWNERSHIP.json` - The map carries the 28 responsibility rows as allocated by FND-Q21A-D; S-00G does not describe FND-Q21 as open.
- update `LEXICON.md (Artifact Ownership Schema) and templates/LEXICON.md` - The Lexicon carries no draft allocation and routes ownership questions to OWNERSHIP.json.

**Related:** [FND-Q21A](#fnd-q21a), [FND-Q21B](#fnd-q21b), [FND-Q21C](#fnd-q21c), [FND-Q21D](#fnd-q21d), [FND-Q20](#fnd-q20), [TT-Q12](#tt-q12)

**Aliases:** original-foundation-audit Q21

**Notes:** The umbrella question has no decision entry of its own; both FND notepads and the board record it as open, and the 2026-09-22 sub-question answers settle it (gap triage records it locked via the sub-questions). The count moved 27 -> 28 (decision-026 supersedes decision-063's "no 28th row"). decision-062 says the first clause of TT-Q12 closes on FND-Q21 as a whole.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#current.questions[27]; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#proposal-017; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#directive-009; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-062; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-026; workbench/sessions/handoffs/destination-audit-gap-triage-2026-09-23.md

### FND-Q21A

**Topic:** Ownership schema covers every Core type

**Question:** Should the schema comprehensively map every ownership and relationship interaction among Workbench Core Artifact types, using Blueprint -> Spec -> Task only as one example route?

**Status:** locked · answered 2026-09-11, decisions 030-031 and correction-008 (approved per decision-036); 2026-09-12 directive-007; reconfirmed 2026-09-22, blocked-obligations decision-018

**Answer:** Yes. Blueprint -> Spec -> Task is only an example. The schema is an exhaustive type-level framework for every Core artifact type, its relationships and ownership interactions, so a fresh agent with no prior context can use the Workbench as intended. Instances keep their facts in their own artifacts. It is queried, not read whole, and sits outside the Contract. Reconfirmed 2026-09-22; the map also needs rows for OWNERSHIP.json and TASKBOARD.json.

**Reason:** "you never know what goes where when I ask." Every artifact type exists to answer a question an agent asks; condensing two types that answer the same question is fine, removing types on principle is not; an agent that does not need an artifact should not read it, so only the Contract is mandatory.

**Result:**

- create `workbench/specs/S-00G-ownership-map-root-control/SPEC.md and OWNERSHIP.json` - Exhaustive type-level map answered by query, including rows for OWNERSHIP.json and TASKBOARD.json; S-00G does not describe the allocation as open.
- update `workbench/docs/adr/proposed/000D-the-ownership-map-is-an-exhaustive-type-level-framework-answered-by-structured-query.md` - Accepted: the ownership map is an exhaustive type-level framework answered by structured query.

**Related:** [FND-Q21](#fnd-q21), [FND-Q22A](#fnd-q22a), [FND-Q23A](#fnd-q23a), [FND-Q20](#fnd-q20)

**Aliases:** original-foundation-audit Q21A; blocked-obligations-review FND-Q21A (2026-09-22 revisit)

**Notes:** directive-007 records the owner rejecting a reviewer proposal to reduce to six record types. The 2026-09-22 revisit asked whether it should "remain approved as comprehensive coverage"; the owner separated the decision from its delivery, which depends on ADR-000B/C/D acceptance.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#correction-008; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-030; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-031; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#directive-007; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-018

### FND-Q21B

**Topic:** Six scoped responsibility rows

**Question:** For the six rows that need an owner at each of the three altitudes - Destination, Boundaries, Requirements, Acceptance, Evidence, Work state - what does the Blueprint, the Spec and the Task each own?

**Status:** locked · answered 2026-09-12, decision-061; refined 2026-09-22 via the ownership-model return handoff, blocked-obligations decision-019

**Answer:** An altitude is a scope, not a file. Boundaries, Requirements, Acceptance and Evidence have owners at all three scopes; Destination (Blueprint, Spec) and Work state (Spec, Task) at two. Gaps are declared with a route. Boundaries splits inside one row: permission limits arrive by inherits, product exclusions by refines. Refined 2026-09-22 (Option B): the Taskboard is first-class as the project-wide representation of work state; TASKBOARD.json summarizes the Spec and Task records that author it.

**Reason:** 2026-09-22: these rows are responsibilities, and the Taskboard is responsible for representing and monitoring work state even though it does not author it; if the Blueprint appears as an owner on Acceptance, the Taskboard should appear for Work state.

**Result:**

- create `workbench/specs/S-00G-ownership-map-root-control/SPEC.md and OWNERSHIP.json` - Six scoped rows with per-scope owners, declared gaps with routes, and the Taskboard as representation owner with a summarizes relation.
- update `LEXICON.md Boundaries wording and templates/LEXICON.md` - Does not read as if a Spec could narrow a safety boundary.

**Related:** [FND-Q21](#fnd-q21), [FND-Q21D](#fnd-q21d), [FND-Q20](#fnd-q20), [FND-Q02A](#fnd-q02a), [E-1](#e-1)

**Aliases:** blocked-obligations-review FND-Q21B (2026-09-22 revisit)

**Notes:** History: decision-061 said project-scope Work state = none (the board is the view, not the author); correction-007 (2026-09-22) moved it to tentative when the owner pushed back; decision-019 settled Option B, keeping "none" only for a project-wide author of state values. decision-061 corrected the reviewer's inverse count (two and four).

**Provenance (local records):** workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-061; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#proposal-022; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#correction-007; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-019

### FND-Q21C

**Topic:** Where decisions are recorded

**Question:** Is the Decisions row rule locked BPR-5A plus the Task-Receipt clause plus the always-an-ADR clause for a change to what a Core artifact type owns, and does answering it close TT-Q12?

**Status:** locked · answered 2026-09-12, decision-062; reconfirmed with clarifications 2026-09-22, blocked-obligations decision-025

**Answer:** Four tiers: ADR for a consequential cross-cutting choice with rationale; Spec for a scoped capability choice; Task body (not the Receipt) for an execution-local choice; a change to what a Core type owns is always an ADR naming OWNERSHIP.json in canonicalized_in. A durable Task choice escalates at close, listed as a remaining gap until then. Editing a Contract or routing artifact is Task work, not a tier. The owns-vs-content rule lives in OWNERSHIP.json.

**Reason:** A choice is not a run fact: the Receipt records what a run did, not what it chose, and adding a decision field would widen an existing Lexicon term. Writing an unescalated durable choice as a remaining gap reuses an existing field and lets the Spec QA gate refuse it.

**Result:**

- create `workbench/specs/S-00G-ownership-map-root-control/SPEC.md and OWNERSHIP.json (Decisions row and change rule)` - The Decisions row carries the four-tier rule; the map carries the owns-vs-content change rule.
- update `TASK.md body section (shape owned by the S-00H successor) and workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md` - Execution-local choices live in the Task body; Receipt gains no decision field.
- update `workbench/specs/S-00J-spec-qa-gate-at-integration/SPEC.md` - Spec QA can refuse a Spec whose closed Tasks still name an unescalated durable choice.

**Related:** [FND-Q21](#fnd-q21), [TT-Q12](#tt-q12), [FND-Q13](#fnd-q13), [BPR-5A](#bpr-5a), [FND-Q23](#fnd-q23)

**Aliases:** blocked-obligations-review FND-Q21C (2026-09-22 revisit)

**Notes:** decision-062 rejected the reviewer's "Task records the choice in its Receipt" clause and withdrew the claim that this closes TT-Q12: its first clause closes on FND-Q21 as a whole; its evidence-threshold clause stays open. The TASK.md body-section shape belongs to the S-00H successor.

**Provenance (local records):** workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-062; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#proposal-023; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-025

### FND-Q21D

**Topic:** The 21 single-owner rows and row 28

**Question:** Are the remaining 21 rows accepted as the draft allocation with the four wording repairs applied, or does any one of them need its own question?

**Status:** locked · answered 2026-09-13, decision-063; 2026-09-22, blocked-obligations decision-026

**Answer:** The 21 single-owner rows stand as one bundle with the four proposal-017 repairs and three proposal-024 additions (Navigation is an ordered pair, Lexicon Context Map then OWNERSHIP.json; Evaluation owns method, Evidence owns results; distinct question strings for Provenance, History, Delivery, Release). On 2026-09-22 he added a 28th row, Representation/monitoring (Frontier view), owned by TASKBOARD.json, sitrep and README. The inventory is 28, owner-locked.

**Reason:** The new row answers a different agent question, "where do I see the whole active picture and monitor progress?", than Work state's "what is happening with this unit?", so under the question-key rule (directive-007) it earns its own row.

**Result:**

- create `workbench/specs/S-00G-ownership-map-root-control/SPEC.md and OWNERSHIP.json` - 28 rows: 21 single-owner, 6 scoped, 1 representation, with distinct question strings and the ordered Navigation pair.
- update `LEXICON.md Context Map and templates/LEXICON.md` - The Lexicon Context Map is the first route and points to OWNERSHIP.json.
- create `sitrep core skill (board Spec, blocked-obligations decision-015)` - sitrep is the read-out owner of the representation row.

**Related:** [FND-Q21](#fnd-q21), [FND-Q21B](#fnd-q21b), [FND-Q21C](#fnd-q21c), [FND-Q02A](#fnd-q02a), [E-10](#e-10)

**Aliases:** blocked-obligations-review FND-Q21D (2026-09-22 revisit)

**Notes:** decision-063 (2026-09-13) said "no 28th row; the inventory stays fixed at 27". correction-008 (2026-09-23 00:57) said not to present 28 as locked; decision-026 (01:09) then locked 28, superseding both. proposal-024 records that the question was asked on 2026-09-12 and answered on 2026-09-13.

**Provenance (local records):** workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-063; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#proposal-024; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#correction-008; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-026

### FND-Q22

**Topic:** What the Contract is

**Question:** What is the Contract, how does it relate to Core Artifacts, and how does an agent route from it to the artifact that owns a claim?

**Status:** locked · answered 2026-09-11 decision-027, revised 2026-09-12 decision-033 (approved per decision-036), decision-044, directive-006; 2026-09-22 blocked-obligations decisions 020, 021, 027

**Answer:** The Contract is AGENTS.md, RUNBOOK.md and LEXICON.md, read every run, plus the assigned Spec after selection. CLAUDE.md is a host adapter, not a carrier. The Contract routes by intent to Routed artifacts (Blueprint, Taskboard, Ownership map, README, Specs, Tasks, Wiki, ADRs and more), which are not all loaded. Core is the Contract plus the routing artifacts. ADR-0033 is superseded, not amended.

**Reason:** Putting an exhaustive ownership framework in the always-read Contract contradicts reduced entry (ADR-0035). ADR-0033 never says what the Contract is and states seven carriers, a direct contradiction. He would prefer one file but "still needs RUNBOOK and LEXICON".

**Result:**

- update `workbench/docs/adr/proposed/000C-the-workbench-contract-is-the-obligation-claim-set-carried-by-three-root-controls-and-the-assigned-spec.md` - Accepted: the Contract is the claim set carried by three root controls plus the assigned Spec.
- retire `workbench/docs/adr/0033-workbench-contract-is-a-claim-set.md` - Archived as superseded by ADR-000C; live links repointed.
- update `LEXICON.md (Workbench Contract row, Routed artifacts, Core) and templates/LEXICON.md` - Contract row names the three carriers plus assigned Spec instead of seven root controls; Routed artifacts and Core defined.
- update `AGENTS.md and templates/AGENTS.md` - Entry and authority text match the three-carrier Contract and routing by intent.

**Related:** [FND-Q22A](#fnd-q22a), [FND-Q23A](#fnd-q23a), [ACC-3](#acc-3), [RB-Q3](#rb-q3), [FND-Q23](#fnd-q23)

**Aliases:** original-foundation-audit Q22; blocked-obligations-review FND-Q22 (2026-09-22 revisit)

**Notes:** decision-027 (2026-09-11) first put the ownership schema in the Contract; decision-033 removed it. Vocabulary was consolidated on 2026-09-22 (blocked decision-027): OWNERSHIP.json is a routing artifact, not a Contract carrier or root control. The root-file count (eighth file) follows ADR-000B. The gap triage cites "owner-authored ADRs are accepted"; the transcript audit (F8) labels that blanket rule an agent interpretation.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-027; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-033; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-044; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#directive-006; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-020; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-021; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-027

### FND-Q22A

**Topic:** Ownership map routes, not copies

**Question:** Does the Responsibility and Ownership Schema own the maintained cross-artifact map of classes, responsibilities, scopes, relations, and routes, while mapped artifacts continue to own their actual claims?

**Status:** locked · answered 2026-09-11, decisions 028-029 and correction-007; approved 2026-09-12 (decision-037); reconfirmed 2026-09-22, blocked-obligations decisions 020/024

**Answer:** Yes. The ownership map owns the maintained record of artifact classes, responsibilities, scopes, routes and relations, and answers where a truth belongs, including the Blueprint -> Spec -> Task relationships the other controls do not answer. It routes to the artifacts holding claims and never copies them or tracks live card instances. The Taskboard is a derived projection that summarizes Spec and Task records.

**Reason:** Not recorded. Inference: routing without copying keeps one owner per claim and keeps the map from becoming a second tracker.

**Result:**

- create `workbench/specs/S-00G-ownership-map-root-control/SPEC.md and OWNERSHIP.json` - Map holds classes, responsibilities, scopes, routes and relations only; query results return routes, never claim text.
- update `workbench/docs/adr/proposed/000D-the-ownership-map-is-an-exhaustive-type-level-framework-answered-by-structured-query.md` - Accepted with the routes-not-claims boundary.

**Related:** [FND-Q21A](#fnd-q21a), [FND-Q23](#fnd-q23), [FND-Q23A](#fnd-q23a), [FND-Q21B](#fnd-q21b), [FND-Q02A](#fnd-q02a)

**Aliases:** original-foundation-audit Q22A; blocked-obligations-review FND-Q22A (2026-09-22 revisit)

**Notes:** correction-007 changed Blueprint -> Spec -> Taskboard to Blueprint -> Spec -> Task and said not to infer a Taskboard relationship from this answer; the 2026-09-22 answers later added the Taskboard as a summarizing projection. decision-028's "four governing artifacts" Contract is superseded by FND-Q22 (three carriers) and the 2026-09-22 vocabulary (Core = Contract + routing artifacts).

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-028; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-029; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#correction-007; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-037; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-024

### FND-Q23

**Topic:** Changing ownership assignments safely

**Question:** How are accepted ownership assignments changed, how do tentative proposals remain outside active Canon, and what prevents a maintained map from becoming a duplicate work tracker?

**Status:** locked · answered 2026-09-15, decision-065 (with decision-064); framing corrected 2026-09-22, blocked-obligations correction-009

**Answer:** OWNERSHIP.json holds accepted rows only, with no lifecycle field; lifecycle belongs to records (ADR, Spec, Task). A proposed change lives in the proposing ADR until acceptance; then the applying Task rewrites the row. Changing which type answers a responsibility is an ADR; adjusting route or wording is a Task. Three guards: no instance identifiers, no status-shaped field, routes only. Framing fixed 2026-09-22: no "canon owners"; the map is a routing artifact.

**Reason:** His reframe: "why does an agent need to even know about a superseded or rejected ADR unless they need to look up what replaced it". A working agent should see only current routes; history stays reachable through ADRs and Git.

**Result:**

- update `workbench/specs/S-00G-ownership-map-root-control/SPEC.md (TK-002, TK-004) and OWNERSHIP.json` - No lifecycle or status field; tests for the three guards (identifier scan within values, not anchored); governance-core allow-list entry for OWNERSHIP.json; no "in-record status required" or "FND-Q23 open" text.
- update `workbench/docs/adr/proposed/000D-the-ownership-map-is-an-exhaustive-type-level-framework-answered-by-structured-query.md` - States OWNERSHIP.json rows carry no lifecycle and ADR-000I does not apply to it.
- update `workbench/tools/adr.mjs and workbench/docs/adr/REGISTER.md` - REGISTER header shows a computed count of proposed records with a when-to-care hint; adr.mjs offers list --status (decision-064).
- update `workbench/docs/adr/proposed/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md` - Lifecycle by folder location for ADRs, Specs, Tasks: archive permanent, retired transient (decisions 040-041).

**Related:** [FND-Q23A](#fnd-q23a), [FND-Q20](#fnd-q20), [FND-Q21C](#fnd-q21c), [FND-Q22A](#fnd-q22a), [WF-8F](#wf-8f)

**Aliases:** original-foundation-audit Q23; Q23.1-Q23.4 (deep-dive decomposition); blocked-obligations-review FND-Q23 (2026-09-22 revisit)

**Notes:** Asked as one bundle on 2026-09-15, withdrawn as put (correction-015: "that is a lot of questions in one"), deep-dived in a separate chat and returned. correction-017 fixed decision-065's "no tool change" clause (one allow-list entry in tools/test-governance-core.mjs); finding-030 fixed guard 1 to scan within values. Earlier folder-lifecycle decisions 040/041 were recorded under this ID; the reviewer objection (finding-019) was noted as "valid, I will take it into consideration".

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-065; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-064; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#proposal-025; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#finding-030; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#correction-017; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-040; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-041; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#directive-011; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#correction-009

### FND-Q23A

**Topic:** Separate root OWNERSHIP.json

**Question:** Does the Workbench need a separate machine-readable ownership map, or is the Lexicon itself the canonical map?

**Status:** locked · answered 2026-09-12, decision-034, corrections 012-013, decision-038; relabeled 2026-09-22, blocked-obligations decision-027

**Answer:** A separate map is needed: OWNERSHIP.json at the repository root as the eighth root file, a Core routing artifact outside the three-file Contract; root placement never implies Contract membership. The ownership schema leaves LEXICON.md, which keeps shared language and routes ownership questions to the map. ADR-0013 must be superseded. On 2026-09-22 the "root control" label was dropped: it is the Ownership map, a routing artifact.

**Reason:** JSON "so a tool can retrieve just the artifacts and relationships relevant to a question and return which artifacts to look at"; he accepted the tension with traverse-dont-search and framed it as asking a question, not searching.

**Result:**

- create `OWNERSHIP.json (repo root) and templates/OWNERSHIP.json` - The ownership map exists at root as a routing artifact, outside the Contract.
- update `workbench/docs/adr/proposed/000B-the-workbench-root-surface-is-eight-files-and-contract-membership-is-separate-from-root-placement.md` - Accepted: eight root files; Contract membership separate from root placement; file list names TASKBOARD.json per E-1.
- retire `workbench/docs/adr/0013-seven-file-workbench-contract.md` - Archived as superseded; its seven-file, no-eighth-control rule no longer holds.
- update `workbench/specs/S-00G-ownership-map-root-control/SPEC.md and workbench/specs/CATALOG.md` - Title, catalog description and outcome do not call it a "root control".
- update `Root-surface consumers: workbench/tools/workbench-layout.mjs, tools/control-fidelity.mjs, their tests, RUNBOOK.md, templates/ADOPTION.md` - They know about the eighth root file.

**Related:** [FND-Q22](#fnd-q22), [FND-Q22A](#fnd-q22a), [FND-Q21A](#fnd-q21a), [FND-Q23](#fnd-q23), [E-1](#e-1)

**Aliases:** original-foundation-audit Q23A; blocked-obligations-review FND-Q23A (2026-09-22 revisit)

**Notes:** Two reversals: correction-009 (2026-09-11) said the Lexicon is the map and no separate document; decision-034 reversed it; correction-012 said separate but not a root control; correction-013 made it the eighth root control; 2026-09-22 renamed it a routing artifact, not a root control. The board question string was stale (finding-027).

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#correction-009; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-034; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#correction-012; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#correction-013; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-038; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#finding-014; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-027; workbench/sessions/handoffs/destination-audit-gap-triage-2026-09-23.md

### FND-Q24

**Topic:** Upstream vs project ownership origins

**Question:** Which ownership assignments must be shared portable Workbench core, and which may be project-specific extensions while preserving ordinary entry and core compatibility?

**Status:** locked · answered 2026-09-15, decision-066; renamed 2026-09-22, blocked-obligations correction-010 and PW decision-001

**Answer:** Two ownership origins (upstream Workbench, project-local) and three classifications (portable invariants and defaults, project bindings, optional extensions). A deliberate change to a baseline assignment is divergence and needs an explicit disposition. Define relationships, including primary ownership and supporting roles, rather than the full cross-product. "An added row is a mechanical comparison fact"; "a core artifact type does not by itself prove compatibility." Renamed the Ownership origin model on 2026-09-22.

**Reason:** Owner goal: "a fresh agent can operate any Workbench project through familiar responsibilities and reliable routes, while each project retains its own product truth and can receive harness improvements safely." Updates must keep deliberate local differences and expose conflicts without silently restoring upstream choices.

**Result:**

- update `LEXICON.md (Ownership origin model row) and templates/LEXICON.md` - The term, the two origins and the retired "portability model" name are defined.
- update `workbench/specs/S-00G-ownership-map-root-control/SPEC.md (TK-003, TK-004) and OWNERSHIP.json` - Rows classified by origin and the three classifications; primary vs supporting roles expressible; a row-keyed JSON comparator for upgrades; S-00G does not describe FND-Q24 as open.
- update `workbench/docs/adr/proposed/000D-the-ownership-map-is-an-exhaustive-type-level-framework-answered-by-structured-query.md` - Does not carry FND-Q24 as open.

**Related:** [FND-Q24B](#fnd-q24b), [FND-Q20](#fnd-q20), [PW-1](#pw-1), [PW-2](#pw-2), [FND-Q21D](#fnd-q21d)

**Aliases:** original-foundation-audit Q24; Ownership origin model (formerly "portability model"); blocked-obligations-review FND-Q24 (2026-09-22 revisit)

**Notes:** The owner rejected the proposal-019 definition of core (11 classes x 27 responsibilities) and demoted the presence and type tests from deciders to facts. His success criterion moved to the Portable Workbench term and gained "cleaning up after itself" (PW decision-001). The divergence disposition needs its own closed set; ADR-000K dispositions do not fit. The field shape is FND-Q24B.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-066; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#proposal-019; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#finding-033; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#correction-010; workbench/sessions/notepads/grilling/portable-workbench-cloud-deployable-2026-09-22.json#decision-001

### FND-Q24B

**Topic:** Classifying project-vs-upstream row differences

**Question:** If absence from the template does not classify a differing row, what does - and where is that classification authored (in OWNERSHIP.json, without a status-shaped field)?

**Status:** open

**Answer:** Open - no owner answer. On 2026-09-22 he ruled it stays live under S-00G as an ownership-origin question, not parked and not part of the Portable Workbench Spec.

**Reason:** PW-2 (2026-09-22): "OWNERSHIP.json is still being built, so FND-Q24B still needs an answer; it simply belongs to a different Spec."

**Result:**

- none `workbench/specs/S-00G-ownership-map-root-control/SPEC.md (TK-004)` - Owns the answer, decided within S-00G with an agent proposal first.

**Related:** [FND-Q24](#fnd-q24), [FND-Q23](#fnd-q23), [PW-2](#pw-2)

**Aliases:** blocked-obligations-review FND-Q24B

**Notes:** The 2026-09-22 revisit worded it: what field shape in OWNERSHIP.json classifies a project-vs-upstream row difference without a status-shaped field? Asked 2026-09-15 with proposal-026 (two authored facts: upstream strength, project intent; conflict computed) and an unanswered sub-fork (is an undeclared difference a conflict or a reportable finding?). The owner paused, then on 2026-09-15 said not to resume it automatically (directive-012). Handed off 2026-09-22 for a deep-dive.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#proposal-026; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#current.questions (FND-Q24B); workbench/sessions/notepads/grilling/portable-workbench-cloud-deployable-2026-09-22.json#decision-002; workbench/sessions/handoffs/fnd-q24b-divergence-disposition-shape-2026-09-22.md; workbench/sessions/handoffs/destination-audit-gap-triage-2026-09-23.md

## RB - Foundation rework

### RB-Q1

**Topic:** Task packet and receipt contents

**Question:** What does a Task packet contain and what must a Task receipt state, so one Task is one fresh context, one branch and one receipt?

**Status:** locked · answered 2026-09-12, workbench-foundation-rework decision-049

**Answer:** Suggested A. Packet: TASK.md, the Spec acceptance lines the Task satisfies, the cited source and test paths, and the Contract; nothing else loads at entry. Receipt: commit SHA on the Task branch, tests run with result, docs touched, dirty files remaining, remaining gap; written into TASK.md and shown on the Taskboard. "Receipt" keeps its existing Lexicon meaning. Ticket-to-Task is the intended fix, not drift.

**Reason:** On the term: "it sounds like we are using Receipt here basically the same way its used in the lexicon" - a record of the run's source and result, so one term, one meaning. Inference for the contents: a small fixed packet keeps one Task to one fresh context.

**Result:**

- update `workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md` - Defines the Packet members and Receipt contents.
- update `LEXICON.md (Packet, Task receipt rows) and templates/LEXICON.md` - Packet and Task receipt defined as locked.
- update `workbench/tools/spec-workbench.mjs (show/close/render)` - Loads the packet, writes the receipt into TASK.md and renders it on the board.

**Related:** [RB-Q1A](#rb-q1a), [RB-Q2](#rb-q2), [RB-Q2A](#rb-q2a), [RB-Q4](#rb-q4), [FND-Q19](#fnd-q19), [FND-Q03](#fnd-q03)

**Aliases:** from-scratch review suggestion (proposal-003)

**Notes:** The open remainder became RB-Q1A. RB-Q2 and RB-Q4 later extended the receipt (append-only per-run rows, upstream distance). decision-059 (2026-09-12) directed its promotion into ADR-000H.

**Provenance (local records):** workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#proposal-003; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-049; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-059

### RB-Q1A

**Topic:** Packet name and optional members

**Question:** What is the entry bundle called, and is a Handoff a member of it?

**Status:** locked · answered 2026-09-12, workbench-foundation-rework decision-050

**Answer:** Suggested A with one extension: keep the incumbent name Packet and define it in LEXICON.md; Ticket stays retired and points to Task. Required members: TASK, the Spec acceptance lines it satisfies, the cited source and test paths, the Contract. Optional members, in his words "optional handoff or notepad": a Scoped handoff and the objective's local notepad when they exist.

**Reason:** Not recorded as an owner reason. Recorded context (finding-020, 2026-09-12): Packet was then the tool-backed term, and reusing Ticket would give one word two meanings, which the Lexicon forbids.

**Result:**

- update `LEXICON.md (Packet row) and templates/LEXICON.md` - Packet defined with required and optional members; optional members are working context only and a Task stays executable from required members alone.
- update `workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md` - Carries the Packet definition.

**Related:** [RB-Q1](#rb-q1), [TT-Q9](#tt-q9), [FND-Q03](#fnd-q03), [FND-Q24](#fnd-q24)

**Notes:** Two reviewer constraints (optional members never instruct or prove; notepads and handoffs are untracked, so a Task must run from required members alone) were carried as drafting constraints; the owner did not rule on them separately. The Lexicon Packet row states both (see result).

**Provenance (local records):** workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-050; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#finding-020; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-059

### RB-Q2

**Topic:** No level beneath Task

**Question:** Does Task-as-context-unit reintroduce a level beneath Task, or is TASK.md the single execution-slice artifact?

**Status:** locked · answered 2026-09-12, workbench-foundation-rework decision-051

**Answer:** Suggested A with sub-answer (ii): TASK.md is the single execution-slice artifact (context, branch and receipt unit); no level beneath Task; Ticket stays retired. Receipt is append-only, one row per run. "A is an aspiration, not a rule or a guarantee." New sizing rule: a Task expected to need more than one context unit should be a Spec that Tasks are cut from. He stated the unit as 250k tokens (revised to 200k in RB-Q2B).

**Reason:** Per-run rows mean an interrupted run leaves a visible trace rather than nothing. One Task per fresh context is intent, not something the harness can enforce.

**Result:**

- update `workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md` - Single execution-slice artifact, append-only per-run receipt, Spec-not-Task sizing rule.
- update `LEXICON.md (Task, Task receipt rows) and templates/LEXICON.md` - Task and receipt definitions match.

**Related:** [FND-Q19](#fnd-q19), [RB-Q1](#rb-q1), [RB-Q2A](#rb-q2a), [RB-Q2B](#rb-q2b), [WF-5](#wf-5), [TT-Q4](#tt-q4), [FND-Q03](#fnd-q03)

**Aliases:** from-scratch review suggestion (proposal-004)

**Notes:** Resolves the owner caveat on decision-046 (FND-Q19) about a possible "ticket definition" level. The 250k figure was superseded by 200k in RB-Q2B. TT decision-067 (2026-09-23) later adds one Task per Chat.

**Provenance (local records):** workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#proposal-004; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-051; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-046; workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#finding-035

### RB-Q2A

**Topic:** Run history on the Taskboard

**Question:** How much of the append-only run history may TASKBOARD show without becoming a proof archive?

**Status:** locked · answered 2026-09-12, workbench-foundation-rework decision-052

**Answer:** Suggested A. The per-run receipt rows live in TASK.md as evidence; the Taskboard shows only a generated signal per active Task: run count and the latest run's branch, short SHA and dirty-file count. The full run table is never on the board.

**Reason:** "I just wanted to see it on the Taskboard." He accepted the cost that the board shows the symptom, not the story; it keeps the board from becoming a second tracker or proof archive.

**Result:**

- update `workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md` - States the Taskboard derived-signal boundary.
- update `workbench/tools/spec-workbench.mjs render (TASKBOARD, later TASKBOARD.json)` - Projects run count, latest branch, short SHA and dirty count per active Task only.

**Related:** [RB-Q2](#rb-q2), [RB-Q1](#rb-q1), [FND-Q02A](#fnd-q02a), [E-1](#e-1)

**Notes:** E-1 (2026-09-22) later redirected the board to TASKBOARD.json; the boundary carries over.

**Provenance (local records):** workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-052; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-059

### RB-Q2B

**Topic:** Context unit is 200k goalpost

**Question:** Is the one-context sizing rule stated as a literal 250k tokens, or as a host-configured context unit?

**Status:** locked · answered 2026-09-12, workbench-foundation-rework decisions 053-054

**Answer:** A declared host context unit of 200k tokens: "One number 200k seems easier." It is a planning goalpost during Plan (work that will not comfortably finish inside it becomes a Spec), "a good goalpost, not a gate or blocker". It grows over time, so it is recorded in workbench/manifest.json with provenance, not in control prose.

**Reason:** Claude's window is 1M and he treats chat context as used up near 25%; Codex compacts at 250k; the "smart zone" is typically below 200k. "I was going to say 150k, but you have all gotten a lot better in the last month. So this grows over time."

**Result:**

- update `workbench/manifest.json (contextUnit)` - Declares 200000 tokens with decision date, source, alternatives and reason.
- update `workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md` - Sizing guidance reads the declared value, never restates it.
- update `workbench/tools/workbench-layout.mjs (manifest validation)` - Validates the contextUnit declaration.

**Related:** [RB-Q2](#rb-q2), [FND-Q03](#fnd-q03), [TT-Q4](#tt-q4), [RB-Q3](#rb-q3)

**Notes:** decision-053 first kept a number on Suggested A terms; decision-054 settled on B at 200k after the reviewer noted 250k is the ceiling while ~200k is where quality degrades. Triage v2 cites this as the ~200k "goalpost, not a gate" behind FND-Q03/TT-Q4.

**Provenance (local records):** workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-053; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-054; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-059; workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md:21

### RB-Q3

**Topic:** Contract word budget

**Question:** What always-read word budget does the three-file Contract get, and what enforces it?

**Status:** locked · answered 2026-09-12, workbench-foundation-rework decision-055 (scope set by decision-056); triage v2 2026-09-12 05:42, 05:46

**Answer:** Neither suggestion: "No budget limit, but budget grading." Record artifact sizes on each project during each Workbench update and monitor them; aim for artifacts that say the same thing in fewer words and stay human-readable. The mechanism belongs to the audit/evaluation workbench, not LLM_Workbench.

**Reason:** "We had a number and it was instantly started to be gamed. We want to optimize, not restrict." "This is the audit workbench's problem."

**Result:**

- none `none in LLM_Workbench` - No word budget and no size gate here; budget grading is owned by the audit workbench project.

**Related:** [RB-Q3A](#rb-q3a), [FND-Q15](#fnd-q15), [FND-Q22](#fnd-q22)

**Aliases:** from-scratch review suggestion (proposal-005)

**Notes:** Not promoted by decision (decision-059); finding-021 (always-read surface about 8,104 words) stays an unowned observation in this repo. directive-006 (FND-Q22) called shrinking the always-read surface accepted direction, "not yet a budget".

**Provenance (local records):** workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-055; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-056; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#finding-021; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-059; workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md:36

### RB-Q3A

**Topic:** What budget grading grades

**Question:** What is budget grading a grade of: measurement trend, a rubric score, or a measured trend plus a separate agent-outcome eval?

**Status:** locked · answered 2026-09-12, workbench-foundation-rework decision-056

**Answer:** Scoped out rather than answered: "This is the audit workbench's problem to grill. It would be something like C. LLM_Workbench doesnt actually do the workbench harness feedback reviews." Direction is roughly C (per-update size measurement plus a separate agent-outcome evaluation), owned elsewhere.

**Reason:** "LLM_Workbench doesnt actually do the workbench harness feedback reviews." The reviewer confirmed no harness-review skill ships in this repo.

**Result:**

- none `none in LLM_Workbench (audit workbench project owns it)` - Nothing drafted into LLM_Workbench Canon; finding-022 conflicts are inputs for that separate grilling.

**Related:** [RB-Q3](#rb-q3), [FND-Q15](#fnd-q15)

**Notes:** finding-022 recorded two conflicts (presence-rubric gaming; AGENTS.md ban on turning structural improvement into an agent-outcome claim) as inputs for the audit workbench, not obligations here.

**Provenance (local records):** workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-056; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#finding-022; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-059

### RB-Q4

**Topic:** Close gate for dirty or unpushed work

**Question:** What must every run leave behind so a completion report cannot hide uncommitted or unpushed work?

**Status:** locked · answered 2026-09-12, workbench-foundation-rework decision-057

**Answer:** Suggested B: visibility plus a gate at the claim. Doctor gains attention-level git diagnostics (detached HEAD, untracked files in the controls, ADR and spec lanes) that never block; upstream distance joins the receipt row. close refuses a dirty tree or unpushed branch unless the receipt records that state and a reason. Doctor must not block on detached HEAD.

**Reason:** An attention finding cannot stop a false completion report by definition, and the false claim is made at close. Detached HEAD is a legitimate inspection state. He accepted two costs: close gains a Git dependency, and the reason text must stay visible in the receipt for reviewers.

**Result:**

- update `workbench/docs/adr/000J-completion-claims-are-checked-against-repository-state.md` - Accepted record of the close gate and diagnostics.
- update `workbench/specs/S-00M-completion-claims-against-repository-state/SPEC.md` - Owns the build: close refusal, git-state diagnostics, receipt upstream distance.
- update `workbench/tools/diagnostics.mjs and workbench/tools/spec-workbench.mjs` - Git-scope attention findings; close checks repository state.
- update `AGENTS.md, RUNBOOK.md and templates/` - Carry the completion-claim rule (ADR-000J canonicalized_in).

**Related:** [RB-Q1](#rb-q1), [RB-Q2](#rb-q2), [RB-Q5](#rb-q5), [RB-Q6](#rb-q6)

**Aliases:** from-scratch review suggestion (proposal-006)

**Notes:** decision-059 (2026-09-12) promoted it as ADR-000J; S-00M owns delivery.

**Provenance (local records):** workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#proposal-006; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#finding-023; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-057; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-059; workbench/sessions/handoffs/destination-audit-gap-triage-2026-09-23.md

### RB-Q5

**Topic:** Dispositions for feedback findings

**Question:** What is the failure-class disposition rule for feedback findings: diagnostic with remediation, test, or explicit decline?

**Status:** locked · answered 2026-09-12, workbench-foundation-rework decision-058 (direction set by decision-048)

**Answer:** Suggested A with four classes: every finding gets exactly one disposition in its owning Spec, and REPORT_FORMAT.md requires the field: diagnostic (doctor code with mandatory remediation), test, declined (with reason), accepted-open (real, unscheduled, naming the owning Spec). A suite test fails if any registered doctor finding lacks remediation text.

**Reason:** "Otherwise it's just ceremony" (decision-048). accepted-open was added because most current findings are real but unscheduled; forcing them into declined would make the record lie.

**Result:**

- update `workbench/docs/adr/000K-every-feedback-finding-carries-one-of-four-dispositions.md` - Accepted closed disposition vocabulary.
- update `workbench/feedback/REPORT_FORMAT.md and templates/feedback/REPORT_FORMAT.md` - Require the disposition field (template stays generic).
- update `LEXICON.md (Feedback Dispositions) and templates/LEXICON.md` - Define the vocabulary.
- update `tools/test-diagnostics.mjs; workbench/specs/S-00N-feedback-finding-dispositions/SPEC.md` - Remediation-text ratchet test; S-00N owns delivery.

**Related:** [RB-Q4](#rb-q4), [WF-8](#wf-8)

**Aliases:** from-scratch review suggestion 6 (decision-048); proposal-007

**Notes:** The locked notepad answer has four classes. ADR-000K's text records a fifth, "repaired", as added "during the same exchange", while its filename says four; the ADR text is the only source for the fifth.

**Provenance (local records):** workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-048; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#proposal-007; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#finding-024; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-058

### RB-Q6

**Topic:** Notepad fixes and installed core skills

**Question:** How do the two unmerged notepad safety fixes and the v3.1.4 installed skills converge so continuity is reliable?

**Status:** superseded · answered premise found stale 2026-09-11 (correction-014, finding-025); superseded by the owner's 2026-09-23 skills-lane direction (S-00V TK-001)

**Answer:** No owner answer to either suggestion: on 2026-09-11 verification found both notepad fixes already present and the installed skills current, so the question's premise was stale (correction-014, finding-025). The installed-core half was reopened on 2026-09-22 as whether to authorize a core update. Superseded by the owner's 2026-09-23 skills-lane direction (S-00V TK-001): core skills ship in the room's workbench/skills lane, so the global installed copy is not inspected.

**Reason:** Not recorded as an owner reason; it dissolved on verification. The owner direction behind S-00V TK-001 (2026-09-23): every core skill lives in workbench/skills and the running workbench uses its local skills.

**Result:**

- update `workbench/specs/S-00V-portable-workbench/SPEC.md TK-001` - Rooms read core skills from their workbench/skills lane and the owner's installed catalog is refreshed from that lane, so the global installed copy is not a convergence target.
- none `workbench/tools/notepads.mjs` - Carries the basename privacy scan and the safe-integer entry-suffix guard; no forward-port Task or Spec is owed (premise found stale 2026-09-11).

**Related:** [PW-3](#pw-3), [RB-Q4](#rb-q4)

**Aliases:** from-scratch review suggestion (proposal-008); blocked-obligations-review RB-Q6 (installed-core mismatch)

**Notes:** The source notepad records it as locked and the blocked-obligations revisit as open; the owner's 2026-09-23 skills-lane direction (S-00V TK-001; PR #145 as provenance) settles it rather than either label. Triage v2 lists it among closed or out-of-scope rows.

**Provenance (local records):** workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#proposal-008; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#correction-014; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#finding-025; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-059; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#current.questions (RB-Q6); workbench/sessions/handoffs/destination-audit-gap-triage-2026-09-23.md

## TT - Task, Ticket and Chat terms

### TT-Q1

**Topic:** Name for a host chat

**Question:** What is the canonical name for the owner-visible thing opened in Codex: chat, task, thread, conversation, or another term?

**Status:** locked · answered 2026-09-10, TT note decision-014; sharpened by owner clarification 2026-09-19

**Answer:** Chat. A Chat is the owner-visible working context in which a Conversation happens; many connected Chats form a Thread. Conversation is informal descriptive language, not a separate Workbench object. 'Codex Task' is rejected as the name. These are vocabulary, not structure.

**Reason:** Calling a Chat a Task would overload Task, which is reserved for the bounded executable work artifact.

**Result:**

- update `LEXICON.md (Chat, Conversation, Thread rows)` - Defines Chat, Conversation and Thread as continuity vocabulary, distinct from Task.
- update `templates/LEXICON.md` - Mirrors the Chat, Conversation and Thread rows.

**Related:** [TT-Q4](#tt-q4), [TT-Q11](#tt-q11), [TT-Q2](#tt-q2)

**Aliases:** task-ticket-chat-workflow-clarification-2026-09-10 Q1; workbench-foundation-rework-2026-09-11 TT-Q1

**Notes:** The 2026-09-19 clarification (Chat is the context in which a Conversation occurs, rather than the Conversation itself) is recorded only in the 2026-09-19 progress board, not in the TT note.

**Provenance (local records):** workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#decision-014; workbench/sessions/notepads/grilling/task-ticket-chat-workflow-clarification-2026-09-10.json#decision-001; workbench/sessions/recovery/grilling-artifact-progress-audit/GRILLING-PROGRESS-BOARD.json (TT-Q1 owner-clarification-2026-09-19)

### TT-Q2

**Topic:** Task is a standalone artifact

**Question:** What exactly is a Workbench Task, and is TASK a canonical concept or only a compatibility alias for an assigned Ticket?

**Status:** locked · answered 2026-09-11/12, decision-042 (approved_at 2026-09-11), after tentative decision-015 on 2026-09-10

**Answer:** Task is a canonical concept, not an alias. TASK.md becomes its own artifact: a bounded, executable thin vertical slice of a Spec that carries blocking relationships so Tasks can complete in parallel, built with the tracer skill and picked up task after task with high-fidelity context. Task was meant to replace Ticket completely. The folder lifecycle applies to Tasks with no exception.

**Reason:** The owner reads approved FND-Q19 (Tasks are tracer-round vertical slices of a Spec, the smallest bounded work that fits one useful context) as entailing a standalone TASK.md.

**Result:**

- create `workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md` - Accepted ADR: a Task is a standalone artifact.
- update `workbench/specs/retired/S-00H-task-artifact-and-terminology-migration/SPEC.md` - Standalone TASK.md records live under tasks/<id>/, and slice generation produces them.
- update `LEXICON.md (Task, TASK, Ticket rows) and templates/LEXICON.md` - Task defined as the standalone execution slice; TASK no longer an alias for a Ticket.
- create `workbench/skills/to-tasks/SKILL.md` - Generates Task files instead of embedded Ticket rows.

**Related:** [WF-5](#wf-5), [TT-Q10](#tt-q10), [TT-Q3](#tt-q3), [FND-Q19](#fnd-q19)

**Aliases:** task-ticket-chat-workflow-clarification-2026-09-10 Q2; workbench-foundation-rework-2026-09-11 TT-Q2

**Notes:** Register status is 'approved' (2026-09-11). History checks found no earlier TASK.md in LLM_Workbench, GPT_OS or Foundry, so this is locked as new or recovered intent. FND-Q19 itself does not say 'standalone file'; that is the owner's reading. Later answers (E-3, E-9, TT-Q3) allow a Task with no parent Spec.

**Provenance (local records):** workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#decision-015; workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#finding-006; workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#finding-007; workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#decision-042; workbench/sessions/notepads/grilling/task-ticket-chat-workflow-clarification-2026-09-10.json#decision-002

### TT-Q3

**Topic:** Workbench Project Spec Task cardinality

**Question:** What are the hierarchy and cardinality among Project, Workbench, host chat, assignment, Spec, and Ticket (now Task)?

**Status:** locked · answered 2026-09-23 chat, TT note decision-067, refined by decision-068; earlier pieces 2026-09-11 (FND-Q13) and 2026-09-22 (E-9), per triage v2

**Answer:** A Workbench is a 'room' that holds many Workbenches and many Projects; each Project has exactly one Workbench of its own. A Workbench is one set of Contract and routing artifacts with one Blueprint. A Blueprint has many Specs and many Tasks; a Spec has many Tasks and many Chats; a Task maps to one Chat. Spec is the destination, Task the steps; small work may be a standalone Task.

**Reason:** 'Each workbench is a room, and projects are what we are doing in those rooms. so each project also its own workbench, that is why a workbench has a 1 : * relationship with itself.'

**Result:**

- update `LEXICON.md (Workbench, Project, Blueprint, Spec, Task rows) and templates/LEXICON.md` - State the room nesting and the 1:many cardinalities.
- create `Durable artifact-model article in workbench/wiki with diagram, plus ownership-map relation rows (S-00G)` - The 1:many artifact model is modeled out and visible to agents before v4 is complete (owner requirement in decision-068).
- update `workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md and AGENTS.md stance rule (plus templates/AGENTS.md)` - Allow a Task directly under the Blueprint with no Spec, with a home at workbench/tasks/TK-XXXX/TASK.md (E-9).
- create `Spec 'Artifact model and definitions' (proposed in TT note finding-037)` - Owns the model article, the spec-less Task home, the carry skill change and the Director way of working.

**Related:** [TT-Q4](#tt-q4), [E-3](#e-3), [E-9](#e-9), [FND-Q13](#fnd-q13), [FND-Q19](#fnd-q19), [FND-Q03](#fnd-q03), [FND-Q17c](#fnd-q17c), [WF-6](#wf-6)

**Aliases:** task-ticket-chat-workflow-clarification-2026-09-10 Q3; workbench-foundation-rework-2026-09-11 TT-Q3

**Notes:** Every source note recorded it as open until the 2026-09-23 answer, which settles it; board and verdict rows that say open predate that answer. The note reads 'A Contract artifacts : A Blueprint' as one Blueprint per Workbench artifact set, with the Blueprint routed outside the three-control Contract, and asks to flag it if the owner meant otherwise. 'assignment' is not separately answered.

**Provenance (local records):** workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#decision-067; workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#decision-068; workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#finding-034; workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#finding-037; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-014; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#correction-004; workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md:26; workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md:51

### TT-Q4

**Topic:** One Task per Chat

**Question:** Must one Ticket (now Task) fit in one host chat/context, and may one chat carry more than one?

**Status:** locked · answered 2026-09-23 chat, TT note decision-067, refined by decision-068

**Answer:** A Task should be 1:1 with a Chat. A few Chats for one Task is allowed but 'is not how it should be done': make the Task smaller, still vertical. One Chat should not do several Tasks: 'The chat should complete the task, clean up, and be done.' A dispatcher or director watches the Spec, writes handoffs and opens a new Chat per unblocked Task, and approves; it never executes Tasks itself.

**Reason:** Recorded basis: a Task is the smallest bounded work that fits one useful context (about 200k tokens, 'a goalpost, not a gate'); larger work is a Spec with Tasks (FND-Q19; owner chat 2026-09-12). Inference: one Chat per Task keeps each context clean for the next Task.

**Result:**

- update `LEXICON.md (Task, Chat, Director rows) and templates/LEXICON.md` - One Task per Chat; a Chat ends after its Task; Director (alias Dispatcher) watches and dispatches, never executes.
- update `workbench/skills/carry/SKILL.md` - Carrying a Spec means directing it (a new Chat per Task), or carry is not used on a Spec.
- update `AGENTS.md and RUNBOOK.md (Director way of working) plus templates mirrors` - Document the Director as the way a Spec is worked.
- create `Spec 'Artifact model and definitions' (proposed in TT note finding-037)` - Owns the carry and Director changes.

**Related:** [TT-Q3](#tt-q3), [FND-Q03](#fnd-q03), [TT-Q7](#tt-q7), [WF-10](#wf-10), [FND-Q17e](#fnd-q17e)

**Aliases:** task-ticket-chat-workflow-clarification-2026-09-10 Q4; workbench-foundation-rework-2026-09-11 TT-Q4

**Notes:** Supersedes a 2026-09-23 agent derivation that one Chat may run several Tasks in sequence. Earlier RB-Q2/RB-Q2B settled context sizing as an aspiration, not a hard gate. FND-Q03 closes on this answer.

**Provenance (local records):** workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#decision-067; workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#decision-068; workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#finding-035; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#decision-051; workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md:21; workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md:51

### TT-Q5

**Topic:** Meaning of next

**Question:** What does next mean: next eligible Ticket (now Task), next action inside current work, or owner recommendation?

**Status:** open · answered Not answered by the owner; the 2026-09-23 triage v2 cites AGENTS.md, not an owner message

**Answer:** No owner answer. AGENTS.md Work Selection already gives the working meaning: `next` is the next eligible Task returned by `spec-workbench.mjs next`.

**Reason:** Not recorded.

**Result:**

- update `AGENTS.md (Work Selection And Lifecycle) and templates/AGENTS.md` - 'next' names the tool's next eligible Task, and keeps that meaning through the S-00P TK-002 rewrite.

**Related:** [TT-Q6](#tt-q6)

**Aliases:** task-ticket-chat-workflow-clarification-2026-09-10 Q5; workbench-foundation-rework-2026-09-11 TT-Q5

**Notes:** The triage listed AGENTS.md as the answer's source, so this is the existing Workbench rule, not an owner ruling. Agent-carryable per triage v2: confirming the control wording needs no new owner decision.

**Provenance (local records):** workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#current.questions (TT-Q5); workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md:27

### TT-Q6

**Topic:** Selection, claim and authorization

**Question:** How do selection, activation, assignment, claim, and authorization differ?

**Status:** answered-in-chat · answered 2026-09-23 07:35 UTC chat (triage v2)

**Answer:** The owner's instruction is the authorization; the claim is recorded by pushing it on the Task branch (PW-6).

**Reason:** Not recorded. Inference: consistent with the owner's 2026-09-23 rejection of agent-manufactured owner gates (gap triage).

**Result:**

- update `AGENTS.md (Instruction Authority, Work Selection claim step) and templates/AGENTS.md` - The owner's instruction authorizes work; the claim is pushed on the Task branch.
- update `LEXICON.md and templates/LEXICON.md` - Distinguish selection, claim and authorization if the terms are kept.

**Related:** [PW-6](#pw-6), [TT-Q5](#tt-q5)

**Aliases:** task-ticket-chat-workflow-clarification-2026-09-10 Q6; workbench-foundation-rework-2026-09-11 TT-Q6

**Notes:** The TT note register records it as open; the answer recovered here settles it. Activation and assignment are not separately answered.

**Provenance (local records):** workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#current.questions (TT-Q6); workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md:28

### TT-Q7

**Topic:** When a fresh chat is needed

**Question:** When is a fresh chat required, optional, or prohibited, including independent review and continuation?

**Status:** answered-in-chat · answered 2026-09-12 05:26 and 2026-09-09 01:48 UTC chats (triage v2)

**Answer:** A fresh Chat is needed when the context is used up, and for the separate-context review. Handoffs are Markdown written for a new Chat. TT-Q4 adds that each Task gets its own Chat.

**Reason:** Not recorded. Inference: a reviewer must not share the builder's context, and a used-up context cannot continue reliably.

**Result:**

- update `AGENTS.md (Session Records, integration review gate) and templates/AGENTS.md` - Fresh Chat for exhausted context and for separate-context review; handoffs are Markdown for a new Chat.
- update `LEXICON.md (Chat, Scoped handoff rows) and templates/LEXICON.md` - Consistent with one Task per Chat.

**Related:** [TT-Q4](#tt-q4), [TT-Q9](#tt-q9), [WF-8C](#wf-8c)

**Aliases:** task-ticket-chat-workflow-clarification-2026-09-10 Q7; workbench-foundation-rework-2026-09-11 TT-Q7

**Notes:** The TT note register records it as open; the answer recovered here settles it. No 'prohibited' case is stated.

**Provenance (local records):** workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#current.questions (TT-Q7); workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md:29

### TT-Q8

**Topic:** Owner-facing versus internal skills

**Question:** Which skills are owner-facing commands and which are internal composition details?

**Status:** partially-answered · answered 2026-09-23 07:35 UTC chat (triage v2)

**Answer:** Answered part: the owner wants a Wiki skills reference in the aihero.dev/skills shape, one readable entry per skill (2026-09-23). Open part: which skills are owner-facing versus internal; he gave no classification.

**Reason:** Not recorded.

**Result:**

- update `workbench/wiki/skill-<name>.md pages and workbench/wiki/MEMORY.md` - One Wiki page per owner-facing skill in the aihero.dev/skills shape, routed from MEMORY.md.

**Related:** [TT-Q11](#tt-q11)

**Aliases:** task-ticket-chat-workflow-clarification-2026-09-10 Q8; workbench-foundation-rework-2026-09-11 TT-Q8

**Notes:** The earlier 'skills the owner invokes are owner-facing' line was an agent summary, not his words; a bounded transcript search found no such statement. The TT note register records it as open.

**Provenance (local records):** workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#current.questions (TT-Q8); workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md:30

### TT-Q9

**Topic:** Chat, notepad and handoff continuity

**Question:** What continuity relationship should hold among a chat, JSON Notepad, Markdown Scoped handoff, Spec, and Ticket (now Task)?

**Status:** answered-in-chat · answered 2026-09-09 01:48 and 23:03 UTC chats (triage v2); ADR-000L direction owner-directed 2026-09-15 (TT note finding-032)

**Answer:** A handoff is Markdown for a new Chat or agent; a notepad is the JSON working record; a notepad belongs to its objective, not to the Chat, model or host that created it (ADR-000L).

**Reason:** The owner saw agents on some models read 'one writer per note' as one Chat per note while others appended across Chats; tying the note to its objective lets any context resume it.

**Result:**

- create `ADR-000L 'notepad belongs to its objective' (proposed on PR #92)` - A notepad belongs to its objective; writers are serialized, not exclusive.
- update `AGENTS.md (Session Records) and templates/AGENTS.md` - Notepads are objective-owned JSON; handoffs are Markdown for a new Chat.
- update `LEXICON.md (Notepad row) and templates/LEXICON.md` - Notepad belongs to its objective.
- update `workbench/skills/notepad/SKILL.md` - Reword 'one writer per note' to one writer at a time.

**Related:** [TT-Q7](#tt-q7), [TT-Q4](#tt-q4)

**Aliases:** task-ticket-chat-workflow-clarification-2026-09-10 Q9; workbench-foundation-rework-2026-09-11 TT-Q9

**Notes:** The TT note register records it as open; the answer recovered here settles it. The Spec and Task parts of the relationship are not stated beyond the Packet row (handoff and notepad join a Task's packet only when they exist).

**Provenance (local records):** workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#finding-032; workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md:31

### TT-Q10

**Topic:** Board name and Task identifiers

**Question:** What should TASKBOARD and other Projections call the current unit of work?

**Status:** answered-in-chat · answered 2026-09-17, recorded in S-00H SPEC.md (TK-003) and the LEXICON Ticket row

**Answer:** Task (Task replaces Ticket, WF-5). Newly allocated identifiers keep the TK-### form, with TK read as the Task prefix.

**Reason:** Inference: keeping TK-### means the allocator, prefix check and record folder names need no change, so the rename stays vocabulary only (S-00H TK-003).

**Result:**

- update `workbench/specs/retired/S-00H-task-artifact-and-terminology-migration/SPEC.md TK-003` - Rename is vocabulary only; TK-### kept with TK as the Task prefix.
- update `LEXICON.md (Ticket row) and templates/LEXICON.md` - TK is the Task identifier prefix; historical TK-### stays readable.
- update `TASKBOARD.md (generated by spec-workbench render)` - Column naming uses Task for the current unit of work.

**Related:** [WF-5](#wf-5), [TT-Q2](#tt-q2)

**Aliases:** task-ticket-chat-workflow-clarification-2026-09-10 Q10; workbench-foundation-rework-2026-09-11 TT-Q10; S-00H TT-Q10 (rephrased: what form do new Task identifiers take)

**Notes:** The TT note register records it as open, and the S-00H record settles it; finding-036 records that a later session rephrased the question as the identifier form (T-### versus TASK-### had been considered) and that answer was recorded in S-00H. The owner message itself was not found in a bounded transcript search.

**Provenance (local records):** workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#finding-036; workbench/specs/retired/S-00H-task-artifact-and-terminology-migration/SPEC.md:10; workbench/specs/retired/S-00H-task-artifact-and-terminology-migration/SPEC.md:155

### TT-Q11

**Topic:** Accepted aliases and retired terms

**Question:** Which legacy or host-native terms remain accepted aliases, and which terms should be retired or avoided?

**Status:** open

**Answer:** Open - no owner answer.

**Reason:** Not recorded.

**Result:**

- none `LEXICON.md (alias and retired-term entries) and templates/LEXICON.md` - Would own the alias list once decided.

**Related:** [TT-Q1](#tt-q1), [WF-5](#wf-5), [TT-Q8](#tt-q8)

**Aliases:** task-ticket-chat-workflow-clarification-2026-09-10 Q11; workbench-foundation-rework-2026-09-11 TT-Q11

**Notes:** Only piecemeal rulings exist: Ticket retired (WF-5), 'Codex Task' rejected as a name for a Chat and Conversation kept informal (TT-Q1), Dispatcher accepted as an alias for Director (decision-068). The gap triage calls this vocabulary hygiene that blocks nothing.

**Provenance (local records):** workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#current.questions (TT-Q11)

### TT-Q12

**Topic:** Where settled answers are promoted

**Question:** Which settled answers belong in the Lexicon, root controls, an owning Spec, or an ADR, and what evidence must precede promotion?

**Status:** partially-answered · answered 2026-09-12, FND note decision-062 (first clause); 2026-09-09 01:48 and 2026-09-23 02:28 UTC chats (triage v2, PW-10)

**Answer:** First clause: settled answers route by the whole ownership map (FND-Q21): definitions to the Lexicon, obligations to root controls, scoped capability choices to a Spec, cross-cutting choices to an ADR. Owner: locked answers go 'in some state of durable in the contract, docs, or specs' / 'in their durable places'.

**Reason:** decision-062: the Decisions row routes only decision-shaped claims, so the first clause needs the whole map. The owner's reason for the promotion rule is not recorded.

**Result:**

- update `LEXICON.md (Artifact ownership schema) and templates/LEXICON.md` - Routes each kind of settled answer to its owner.
- update `AGENTS.md (Documentation Ownership And Proof) and templates/AGENTS.md` - Locked answers are promoted to their durable owners.
- update `Ownership map from S-00G (workbench/specs/S-00G-ownership-map-root-control/SPEC.md)` - Carries the type-level routing rows.

**Related:** [FND-Q21](#fnd-q21), [FND-Q21C](#fnd-q21c), [FND-Q13](#fnd-q13), [PW-10](#pw-10)

**Aliases:** task-ticket-chat-workflow-clarification-2026-09-10 Q12; workbench-foundation-rework-2026-09-11 TT-Q12

**Notes:** Answered part: where settled answers go (decision-062 and the owner's 'in their durable places'). Open part: the evidence threshold before promotion; reading 'locked' as that threshold is an interpretation, not his ruling. proposal-017's claim that FND-Q21C closed TT-Q12 was withdrawn by decision-062.

**Provenance (local records):** workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#decision-062; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#proposal-023; workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#current.questions (TT-Q12); workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md:32

## WF - Workbench workflow

### WF-1

**Topic:** Blueprint versus Spec PRD role

**Question:** What does the Blueprint own, and where does the PRD role belong?

**Status:** locked · answered 2026-09-16, owner workflow chat (Codex thread 01a0a783, line 97), WF note decision-067; wording confirmed by correction-022

**Answer:** The Blueprint owns the product destination and user journey (the whole of "counting to 100"); each Spec is the PRD-shaped smaller destination derived from it. The Workbench Contract, not the Blueprint, owns the agreement (instructions, authority, boundaries, language, process, completion, verification). LLM_Workbench's Blueprint maps the Workbench product; each project blueprints its own product; the template supplies only the reusable shape.

**Reason:** These are distinct responsibilities and altitudes, not competing copies of the same product definition.

**Result:**

- update `BLUEPRINT.md` - States the product-level destination and journey; each Spec is the PRD-shaped smaller destination; the Contract, not the Blueprint, owns the operating agreement.
- update `templates/BLUEPRINT.md` - Stays a generic reusable shape; each project fills its own product destination.
- update `workbench/docs/adr/proposed/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md` - Reconciled (accepted, amended or superseded) under S-00P TK-004 so it no longer claims the Blueprint owns the future-facing PRD function.
- update `LEXICON.md (Blueprint, Spec rows) and templates/LEXICON.md` - Blueprint defined as the product destination; Spec as the PRD-shaped scoped destination.

**Related:** [WF-2](#wf-2), [WF-6](#wf-6), [FND-Q05](#fnd-q05)

**Aliases:** workbench-workflow-2026-09-10 Q1; workbench-foundation-rework-2026-09-11 WF-1

**Notes:** Original wording: 'Does BLUEPRINT.md remain the single PRD-shaped destination artifact, rather than adding a separate PRD?' The owner objected to the shorthand 'no separate PRD' (correction-019); the replacement wording proposed there was withdrawn by correction-022 and must not be presented again. The allocation itself is settled. Supersedes the ADR-000G assumption that the Blueprint owns the future-facing PRD function.

**Provenance (local records):** workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#current.questions[0]; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-067; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#correction-019; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#correction-022; workbench/sessions/notepads/grilling/workbench-workflow-2026-09-10.json#current.questions[0]

### WF-2

**Topic:** What starts and ends Align

**Question:** What starts Align, and what ends it?

**Status:** locked · answered 2026-09-16, owner workflow chat (Codex thread 01a0a783, line 97), WF note decision-067

**Answer:** An owner idea starts Align through grilling; owner and agent explicitly confirm a shared design concept, then blueprint it. Workflow: Idea -> Align through grilling -> confirmed design concept -> Blueprint -> recursive delivery loop.

**Reason:** The exit is shared understanding, not a document count.

**Result:**

- update `BLUEPRINT.md` - Workflow opens with Idea -> Align (grilling) -> confirmed shared design concept -> Blueprint.
- update `LEXICON.md (new Align and design concept rows) and templates/LEXICON.md` - Align replaces Explore as the term; S-00P TK-004 owns defining Align and design concept.

**Related:** [WF-1](#wf-1), [WF-3](#wf-3), [WF-9](#wf-9)

**Aliases:** workbench-workflow-2026-09-10 Q2; workbench-foundation-rework-2026-09-11 WF-2

**Notes:** Original wording: 'What starts an Explore phase, and what is the minimum exit artifact or decision?' Explore was renamed Align. proposal-011 (agent Suggestions A/B, including a drafted Blueprint delta as exit artifact) was not adopted; the answer comes from decision-067. The source note treats Lexicon promotion of Align as follow-on promotion work, not an open choice.

**Provenance (local records):** workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#current.questions[1]; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-067; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#proposal-011; workbench/sessions/notepads/grilling/workbench-workflow-2026-09-10.json#current.questions[1]

### WF-3

**Topic:** Align investigation methods and prototypes

**Question:** Beyond the agreed grilling and shared-understanding exit, when does Align need additional investigation?

**Status:** locked · answered 2026-09-16, WF note decision-071

**Answer:** Research, brainstorming and wayfinding are allowed Align investigations to resolve a named uncertainty (Suggestion A minus prototypes). Prototypes are not an Align method now: 'right now it would come after we blueprint but before we spec to see if its plausible. we dont need to add it in right now.'

**Reason:** Owner: prototyping is a plausibility check that belongs after the Blueprint and before the Spec, 'maybe later on when the workbench is more autonomous'; investigation stays targeted at a named uncertainty.

**Result:**

- update `BLUEPRINT.md` - Align allows research, brainstorming and wayfinding for a named uncertainty; an optional future Prototype step sits between Blueprint and Create Spec and is not in the standard flow now.

**Related:** [WF-2](#wf-2), [WF-4](#wf-4)

**Aliases:** workbench-workflow-2026-09-10 Q3; workbench-foundation-rework-2026-09-11 WF-3

**Notes:** Original wording: 'Are research, grilling, and wayfinding optional Explore methods, and are any others part of the standard flow?' Reworded by correction-020 because grilling and the confirmation exit were already settled in WF-2. Suggestions were written by a reconciliation agent; the owner adopted A without prototypes.

**Provenance (local records):** workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#current.questions[2]; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-071; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#correction-020; workbench/sessions/notepads/grilling/workbench-workflow-2026-09-10.json#current.questions[2]

### WF-4

**Topic:** When to prototype and code reuse

**Question:** When should we prototype before committing to delivery, and what may carry forward?

**Status:** locked · answered 2026-09-16, WF note decision-072

**Answer:** Suggestion A: prototype code may carry forward once it meets ordinary implementation and verification requirements. 'I would prefer it when we have an established project, but not when we are starting out fresh.' A fresh project can build something quick in a separate codebase, or build a proving stack and then move to the real stack. Prototyping stays optional, after Blueprint and before Spec.

**Reason:** 'We dont need the ground work to prototype' - a concept can be tested before building out a stack, and the real stack is built once the concept holds.

**Result:**

- update `BLUEPRINT.md` - Records the optional prototype step, the carry-forward rule, and the established-versus-fresh-project nuance.

**Related:** [WF-3](#wf-3)

**Aliases:** workbench-workflow-2026-09-10 Q4; workbench-foundation-rework-2026-09-11 WF-4

**Notes:** Original wording: 'When is a Prototype needed, what feedback does it seek, and what makes it ready to promote or discard?' An earlier always-discard recommendation (Suggestion B) was an agent proposal and was not adopted.

**Provenance (local records):** workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#current.questions[3]; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-072; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#correction-020; workbench/sessions/notepads/grilling/workbench-workflow-2026-09-10.json#current.questions[3]

### WF-5

**Topic:** Task replaces Ticket everywhere

**Question:** Should Task replace Ticket throughout the Workbench as the execution-slice term, including tools and stable IDs, or only in explanatory workflow prose?

**Status:** locked · answered 2026-09-12, decision-043 (approved_at 2026-09-12; register repaired by correction-018 and correction-021)

**Answer:** Task replaces Ticket as the execution-slice term across prose, tools, TASKBOARD columns, the to-tickets skill and new visible IDs. Existing TK-### identifiers inside completed Specs stay frozen as history and are never rewritten.

**Reason:** One execution-slice concept should have one live term while historical evidence stays faithful. The Lexicon forbids one term for two concepts, and the standalone TASK.md (TT-Q2) changes the tool seam anyway, so a prose-only rename would create an immediate collision.

**Result:**

- create `workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md` - Accepted ADR: Task is a standalone artifact and replaces Ticket as the execution-slice term.
- update `workbench/specs/retired/S-00H-task-artifact-and-terminology-migration/SPEC.md` - Delivers the rename across tools, board columns, skills and templates (TK-003, TK-004).
- update `LEXICON.md (Task and Ticket rows) and templates/LEXICON.md` - Ticket retired as a live term; Task names the execution slice; historical TK-### stays readable.
- create `workbench/skills/to-tasks/SKILL.md` - Replaces the to-tickets skill so slices are generated as Tasks.

**Related:** [TT-Q2](#tt-q2), [TT-Q10](#tt-q10), [TT-Q11](#tt-q11)

**Aliases:** workbench-workflow-2026-09-10 Q5; workbench-foundation-rework-2026-09-11 WF-5

**Notes:** The merged note showed WF-5 open until correction-018 (2026-09-15) repaired the register to the 2026-09-12 decision. RB-Q2 (decision-051) later confirmed there is no level beneath Task, so WF-5 stands. Acceptance of the decision was recorded as separate from completing the migration.

**Provenance (local records):** workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#current.questions[4]; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-043; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#correction-018; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#correction-021; workbench/sessions/notepads/grilling/workbench-workflow-2026-09-10.json#current.questions[4]

### WF-6

**Topic:** Blueprint Spec Task Taskboard relation

**Question:** How do Blueprint, Spec, Task and Taskboard relate?

**Status:** locked · answered 2026-09-16, WF note decision-067, corrected by correction-023

**Answer:** The Blueprint defines the product-level destination: count to 100. Each Spec is a mini-PRD, a scoped objective with its own destination, the next number to count to. Tasks do the counting. Stacked Specs together realize the Blueprint journey. TASKBOARD is the Kanban projection of progress and coordination, not truth or a second tracker.

**Reason:** Blueprint, Spec and Task work at different altitudes: overall destination, scoped destination, and executable progress.

**Result:**

- update `BLUEPRINT.md` - Describes the three altitudes and stacked Specs realizing the Blueprint journey.
- update `LEXICON.md (Spec row) and templates/LEXICON.md` - Spec described as an objective with a destination (mini-PRD) instead of a stable capability record; owned by S-00P TK-004.
- update `workbench/docs/adr/proposed/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md` - Reconciled under S-00P TK-004 against the three-altitude answer.

**Related:** [WF-1](#wf-1), [WF-8G](#wf-8g), [TT-Q3](#tt-q3)

**Aliases:** workbench-workflow-2026-09-10 Q6; workbench-foundation-rework-2026-09-11 WF-6

**Notes:** Original wording: 'How do Blueprint, specs, and the generated Taskboard relate after the terminology change?' correction-023 fixed the owner's readback: a Spec is an objective with a destination, not only an objective. Derive Specs from Blueprint needs, active ADRs, verified Actuality and required evidence.

**Provenance (local records):** workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#current.questions[5]; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-067; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#correction-023; workbench/sessions/notepads/grilling/workbench-workflow-2026-09-10.json#current.questions[5]

### WF-7

**Topic:** Nested Spec and Task branches

**Question:** What branch structure supports the recursive delivery loop?

**Status:** locked · answered 2026-09-16, WF note decision-067 and decision-068 (Codex thread 01a0a783, lines 97 and 147)

**Answer:** Branches nest by delivery altitude: main contains integration; each Spec branch starts from integration; each Task branch starts from its Spec branch, preferably in its own worktree. Proven Task results merge into the Spec branch, and contained Task branches and worktrees are cleaned up after their results are preserved.

**Reason:** The branch ancestry follows the delivery altitudes.

**Result:**

- update `BLUEPRINT.md` - Describes the nested integration -> Spec branch -> Task branch topology as the destination.
- update `AGENTS.md (Git Rules, Branch Completion) and templates/AGENTS.md` - Branch-per-Task from the Spec branch, merge into the Spec branch, cleanup after containment; owned by S-00P TK-002 and TK-005.
- update `workbench/specs/S-00O-workbench-v4-0-0-release/SPEC.md` - Bootstrap exemption 2: until Spec-branch tooling exists, each Task lands as its own PR into integration.

**Related:** [WF-10](#wf-10), [WF-12](#wf-12), [WF-8B](#wf-8b)

**Aliases:** workbench-workflow-2026-09-10 Q7; workbench-foundation-rework-2026-09-11 WF-7

**Notes:** Original wording: 'What does the Implement loop do, and how should dependencies and parallel work be represented?' Branch separation alone does not prevent conflicting work; coordination is WF-10. Same day, the owner deferred WF-7 for the rollout itself (directive-018: 'We can work tasks without having a spec branch'), recorded as S-00O exemption 2; the nested topology stays the destination.

**Provenance (local records):** workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#current.questions[6]; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-067; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-068; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#directive-018; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-083; workbench/sessions/notepads/grilling/workbench-workflow-2026-09-10.json#current.questions[6]

### WF-8

**Topic:** QA and verify at each altitude

**Question:** What must QA/Verify demonstrate at each delivery altitude?

**Status:** locked · answered 2026-09-16, WF note decision-068 and decision-069 (Codex thread 01a0a783, lines 147 and 172)

**Answer:** Tasks use red/green TDD, make relevant tests green, exercise what was built to confirm it works, and preserve proof before handoff. A separate context checks the assembled Spec. Integration is the assembled surface for owner Human QA, which can return work to Align before owner-only main promotion.

**Reason:** Each recipient needs demonstrated results and disclosed gaps, not an unsupported completion claim.

**Result:**

- update `BLUEPRINT.md` - States the QA/Verify duty at Task, Spec and integration altitudes.
- update `workbench/specs/S-00J-spec-qa-gate-at-integration/SPEC.md` - Spec QA gate and corrective-Task return path at the assembled-Spec level.
- update `AGENTS.md (Engineering And Verification, Work Selection) and templates/AGENTS.md` - Task proof duties and assembled-Spec review replace the Spec-embedded ticket procedure; owned by S-00P TK-002 and TK-005.
- update `RUNBOOK.md and templates/RUNBOOK.md` - Procedures for Task verification, assembled-Spec review and Human QA; owned by S-00P TK-003 and TK-005.

**Related:** [WF-8B](#wf-8b), [WF-8C](#wf-8c), [WF-8E](#wf-8e), [WF-9](#wf-9)

**Aliases:** workbench-workflow-2026-09-10 Q8; workbench-foundation-rework-2026-09-11 WF-8

**Notes:** Original wording: 'What does QA/Verify require, including a human check, and what exact conditions stop or return work to implementation?' Earlier detailed gate conditions (proposal-013, proposal-020, restated in directive-009 on 2026-09-12: one new Task per unmet acceptance line, a Human QA lane showing the demo artifact) were agent-verified proposals; the locked answer is the 2026-09-16 altitude model. Spec retirement is separate (WF-8E).

**Provenance (local records):** workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#current.questions[7]; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-068; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-069; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#proposal-013; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#proposal-020; workbench/sessions/notepads/grilling/fnd-foundation-ownership-2026-09-15.json#directive-009; workbench/sessions/notepads/grilling/workbench-workflow-2026-09-10.json#current.questions[7]

### WF-8A

**Topic:** Corrective work after Spec retirement

**Question:** When QA or later use finds a gap, which existing or new Spec owns the corrective work?

**Status:** locked · answered 2026-09-16, WF note decision-073 (answered under the label '8.')

**Answer:** No reopen ceremony. A small corrective change against a retired Spec is a Task plus an update to the Wiki record of the reconciled retired Spec; SPEC.md is not resurrected, though a Spec branch may still carry the commit. 'What we wanted was the Spec, if that is right, then we are okay.'

**Reason:** The Spec is documentation and the thing work is proved against; QA asks whether the destination was reached, not whether every Task path was followed, since paths may be wrong. Resurrecting a Spec to move a banner 3px is needless ceremony.

**Result:**

- update `LEXICON.md (Task row) and templates/LEXICON.md` - Task widened so it can prove against a reconciled Wiki record, not only an active SPEC.md; owned by S-00P TK-004.
- update `workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md` - Packet membership widened for Tasks that prove against a Wiki record.
- update `RUNBOOK.md and templates/RUNBOOK.md` - Corrective-Task procedure after retirement; owned by S-00P TK-003 and TK-005.
- update `workbench/wiki (features or design-concepts article of the retired Spec)` - A corrective Task updates the Wiki record that holds the reconciled retired Spec.

**Related:** [WF-8G](#wf-8g), [WF-8H](#wf-8h), [WF-8E](#wf-8e)

**Aliases:** workbench-foundation-rework-2026-09-11 WF-8A (grill-2026-09-12)

**Notes:** Original wording asked whether a retired Spec reopens or every finding becomes a new linked Spec. Suggestions A/B were a reconciliation agent's; the owner rejected the reopen framing. The boundary between a corrective Task and a new Spec is refined by WF-8G.

**Provenance (local records):** workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#current.questions[8]; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-073; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-085; workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json#current.questions (WF-8A)

### WF-8B

**Topic:** No per-Task review ceremony

**Question:** Does every Task need mandatory separate-context review?

**Status:** locked · answered 2026-09-16, WF note decision-068 (Codex thread 01a0a783, line 147)

**Answer:** No per-Task independent-review ceremony just because it is a Task. Ordinary verification and proof are mandatory: red/green TDD, relevant tests green, exercising what was built, and preserved proof before handoff.

**Reason:** The owner asked for accountability before handoff, not ceremony; independent review examines the assembled Spec.

**Result:**

- update `AGENTS.md (Engineering And Verification, integration review gate) and templates/AGENTS.md` - Task proof is mandatory; separate-context review is required for the assembled Spec, not each Task; owned by S-00P TK-002 and TK-005.
- none `workbench/specs/S-00O-workbench-v4-0-0-release/SPEC.md` - S-00O must keep separate-context review per PR during the bootstrap exemptions, because each Task lands as its own PR.

**Related:** [WF-8](#wf-8), [WF-8C](#wf-8c), [WF-7](#wf-7)

**Aliases:** WF note previous wording: separate-context review per Task before merge into the Spec branch

**Notes:** Previous wording: 'Does every completed Task require separate-context independent review before it merges into the Spec branch, or ordinary Task verification with independent review reserved for the completed Spec branch?' Do not add an unapproved risk-triggered review policy.

**Provenance (local records):** workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#current.questions (WF-8B); workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-068; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#directive-018

### WF-8C

**Topic:** Failed Spec review creates corrective Tasks

**Question:** What does separate-context Spec review do when something fails?

**Status:** locked · answered 2026-09-16, WF note decision-069 (Codex thread 01a0a783, line 172)

**Answer:** Keep a separate-context review whose unit is the assembled Spec and the combined result of its Tasks. A failed review is diagnostic, not blame: state what is wrong, create new corrective Tasks under the still-open Spec, update the Taskboard, execute and prove them, then present a fresh immutable Spec candidate. Passing lets the Spec branch move toward integration.

**Reason:** Completed Tasks have already been reconciled and retired, so corrective work needs a new bounded path; the interaction model is accountability and repair, not gatekeeping.

**Result:**

- update `workbench/specs/S-00J-spec-qa-gate-at-integration/SPEC.md` - Assembled-Spec report, verdict bound to candidate SHA, corrective Tasks under the still-open Spec.
- update `AGENTS.md (integration review gate) and templates/AGENTS.md` - Names the assembled-Spec review and corrective-Task loop; owned by S-00P TK-002 and TK-005.
- update `RUNBOOK.md and templates/RUNBOOK.md` - Procedure for a failed Spec review and fresh candidate; owned by S-00P TK-003 and TK-005.

**Related:** [WF-8](#wf-8), [WF-8B](#wf-8b), [WF-8D](#wf-8d)

**Notes:** Previous wording asked whether the completed Spec candidate still needs a separate-context reviewer or whether Task proof plus whole-Spec proof replace it. The meaning of 'threw the old Tasks away' was left to WF-8D.

**Provenance (local records):** workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#current.questions (WF-8C); workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-069; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-085

### WF-8D

**Topic:** What retiring a completed Task means

**Question:** What does throwing away a completed Task mean?

**Status:** locked · answered 2026-09-16, WF note decision-070 (Codex thread 01a0a783, line 193)

**Answer:** After a completed Task's results and needed proof are reconciled into the owning Spec, the Task is retired: its branch and worktree are deleted after verified containment, it leaves the hot Taskboard and ordinary pickup, and its TASK.md survives only as retired history reachable by an explicit historical route.

**Reason:** Retirement removes the attention burden while keeping an explicit historical route; it is attention disposal, not destructive erasure.

**Result:**

- update `workbench/specs/S-00I-folder-lifecycle-for-records/SPEC.md` - Task retirement by folder location after reconciliation; retired Tasks leave ordinary discovery.
- update `workbench/docs/adr/proposed/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md` - Folder-lifecycle ADR reconciled under S-00P TK-004.
- update `AGENTS.md (Branch Completion) and templates/AGENTS.md` - Task branch and worktree cleanup after verified containment.

**Related:** [WF-8C](#wf-8c), [WF-8F](#wf-8f), [WF-7](#wf-7)

**Notes:** Previous wording asked whether only the branch/worktree and board presence are thrown away, or also the TASK.md record. The recorded result says this does not approve irreversible evidence deletion or a transient-folder clearing policy; that is the agent's interpretation. WF-8F later made Specs and Tasks transient, discardable after the change is verified on main.

**Provenance (local records):** workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#current.questions (WF-8D); workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-070; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-085

### WF-8E

**Topic:** When a Spec closes and retires

**Question:** What product evidence and owner judgment make a Spec ready to complete, reconcile and retire?

**Status:** locked · answered 2026-09-16, WF note decision-079 (explicit lock: 'Yes. That matches my previous statements.')

**Answer:** A Spec closes only after separate-context Spec review passes and owner Human QA on integration confirms the destination is actually there. It is then reconciled into the Wiki and retired. No Git merge closes it automatically; main promotion stays a separate owner action.

**Reason:** Closure is the owner-confirmed judgment that the destination was reached ('once its there we can close it'); Git containment and main promotion are separate facts, and reaching main can come before completion.

**Result:**

- update `BLUEPRINT.md` - Fixes the order: assembled-Spec review -> integration -> owner Human QA -> close -> Wiki reconciliation -> SPEC.md retirement.
- update `workbench/specs/S-00J-spec-qa-gate-at-integration/SPEC.md` - Records owner Human QA approval before Spec closure.
- update `workbench/specs/S-00I-folder-lifecycle-for-records/SPEC.md` - Retirement happens after Wiki reconciliation in the WF-8E order.
- update `AGENTS.md (Work Selection And Lifecycle) and templates/AGENTS.md` - Spec completion follows this order instead of a merge; owned by S-00P TK-002 and TK-005.

**Related:** [WF-8F](#wf-8f), [WF-8G](#wf-8g), [WF-8H](#wf-8h), [WF-8A](#wf-8a)

**Aliases:** WF note previous wording: independent retirement-readiness review without treating any Git merge as completion

**Notes:** The owner first said not to lock this (proposal-027, chat line 216), then gave input under '8.' (decision-074), then explicitly locked Suggestion A the same day. Suggestion text was a reconciliation agent's.

**Provenance (local records):** workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#current.questions (WF-8E); workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#proposal-027; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-074; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-079

### WF-8F

**Topic:** Where knowledge lives after retirement

**Question:** After Specs retire, where can an arriving agent learn what the product does and inspect why we trust it?

**Status:** locked · answered 2026-09-16, WF note decision-075 then decision-080 (locked; directive-016 says do not reopen)

**Answer:** Specs and Tasks are transient working artifacts, not product documentation. Once their useful content is turned into readable durable documentation and the exact change is verified on main, they are retired and discarded. The Wiki stores the reconciled retired Spec and later corrective Tasks update it; Blueprint, Wiki and Taskboard are the enduring and navigational surfaces.

**Reason:** Once a Spec or Task has been transformed into documentation a human can read and understand, the source is junk and clutter and may be thrown away.

**Result:**

- update `BLUEPRINT.md` - Blueprint owns direction, Wiki owns readable current capability knowledge, Taskboard projects active work, ADRs own decisions, source/tests own proof, Git keeps history.
- update `LEXICON.md (Spec and 'SPEC and TASK' rows) and templates/LEXICON.md` - Stop calling the Spec the durable capability owner; owned by S-00P TK-004.
- update `AGENTS.md (documentation ownership table) and templates/AGENTS.md` - Remove durable-Spec ownership wording; owned by S-00P TK-002 and TK-005.
- update `workbench/specs/S-00I-folder-lifecycle-for-records/SPEC.md` - Discard gated on verified main; never archive Specs or Tasks.
- update `workbench/docs/adr/proposed/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md` - Reconciled under S-00P TK-004 to the transient lifecycle.

**Related:** [WF-8E](#wf-8e), [WF-8H](#wf-8h), [WF-8A](#wf-8a), [WF-8D](#wf-8d)

**Notes:** The owner paused this once ('this question really feels like we keep rehashing this one... specs might go to the archive', directive-015); finding-035 reconstructed the lineage before decision-080 locked the transient lifecycle. The owner asked that the lifecycle be tested against varied examples (footer banner, add-to-cart, game asset, GitHub guide).

**Provenance (local records):** workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#current.questions (WF-8F); workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-075; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#directive-015; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#finding-035; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-080; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#directive-016

### WF-8G

**Topic:** Corrective Task versus new Spec

**Question:** After a Spec is reconciled and retired, what separates a change that is a Task against the Wiki record from a change that needs a new Spec?

**Status:** locked · answered 2026-09-16, WF note decision-081, corrected by correction-023

**Answer:** Route by scope and destination, not Task count. A gap against an existing Spec destination is fixed with reopened or corrective Tasks, even when several are needed. A new Spec is only for a distinct scoped objective with its own destination, such as investigating why the journey missed something. TASK.md holds active work state and TASKBOARD projects it; a Spec is open if it has Tasks on the board.

**Reason:** A Spec is a mini-PRD with a destination and Tasks do the counting: 'if the journey missed counting 15 and is already at 58', the fix stays against that destination. Effort alone does not create a new destination.

**Result:**

- update `BLUEPRINT.md` - States the scope-and-destination rule for Tasks versus new Specs.
- update `AGENTS.md (documentation ownership table) and templates/AGENTS.md` - Active work state moves from SPEC.md to TASK.md, with TASKBOARD as projection; owned by S-00P TK-002 and TK-005.
- update `LEXICON.md (Spec, Task rows) and templates/LEXICON.md` - Spec as objective with a destination; Task as the open work item; owned by S-00P TK-004.
- update `workbench/specs/retired/S-00H-task-artifact-and-terminology-migration/SPEC.md` - TASK.md owns active work state and the board projects it.

**Related:** [WF-8A](#wf-8a), [WF-6](#wf-6), [WF-8E](#wf-8e)

**Notes:** The owner first picked Suggestion B ('B, we would need to reopen the spec if it was big enough or create a new one'); decision-081 read that as a size-based rule. The owner's correction-023 replaced that reading with scope and destination. Agent Suggestion A (destination-statement test) was not adopted as written.

**Provenance (local records):** workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#current.questions (WF-8G); workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-081; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#correction-023

### WF-8H

**Topic:** Wiki feature articles for Specs

**Question:** Where should ordinary verified feature documentation live, and when must that article be created?

**Status:** locked · answered 2026-09-18/19, Claude chat, WF note decision-086; confirmed as v4 scope 2026-09-23 20:12 (triage v2)

**Answer:** A new Wiki collection named 'features' (not 'capabilities'), rather than widening design-concepts: '1, but features. Once a spec is a feature and not just a specification, then it needs a wiki article.' The article is written at the WF-8E closure point, not a new gate. Completed Specs and Tasks become wiki articles describing the product; this is a v4 requirement.

**Reason:** design-concepts/ is scoped to cross-cutting models and excludes single requirements, so an ordinary Spec (like the footer-banner example) had no collection to retire into. The owner later placed it in the main v4 documentation overhaul.

**Result:**

- create `workbench/wiki/features/ (with features/README.md)` - Collection for single-Spec feature articles, scoped narrowly enough to stay distinct from design-concepts.
- update `workbench/wiki/design-concepts/README.md` - Reconcile the 'owner alone authorizes' rule with routine agent authorship under an already-approved Spec.
- update `workbench/manifest.json and templates/wiki` - Declare the features collection and mirror it into the generic template.
- update `retire-spec Wiki-type gate (S-00I TK-005 tooling)` - Accept a feature-typed article as a valid retirement target.
- update `workbench/wiki/MEMORY.md` - Route to feature articles.

**Related:** [WF-8E](#wf-8e), [WF-8F](#wf-8f), [WF-8A](#wf-8a), [PW-8](#pw-8)

**Notes:** Question wording is reconstructed from decision-086; the WF note has no question object for WF-8H. decision-086 left two README conflicts unsettled; the design-concepts README result carries their reconciliation. The 2026-09-23 gap triage called it a v4.x addition; the owner corrected that to v4 scope.

**Provenance (local records):** workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-086; workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md:13; workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md:39; workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md:45

### WF-9

**Topic:** Recursive loop back after QA

**Question:** How does delivery loop back when the result needs revision?

**Status:** locked · answered 2026-09-16, WF note decision-067 (Codex thread 01a0a783, line 97)

**Answer:** Delivery repeats recursively. A failed Human QA result returns to Align and the design-concept/delivery loop at the appropriate scope.

**Reason:** The observed result feeds the next agreed work.

**Result:**

- update `BLUEPRINT.md` - Describes the recursive loop and the return from failed Human QA to Align at the right scope.
- update `RUNBOOK.md and templates/RUNBOOK.md` - Human QA failure procedure; owned by S-00P TK-003 and TK-005.

**Related:** [WF-2](#wf-2), [WF-8](#wf-8), [WF-8A](#wf-8a), [WF-8G](#wf-8g)

**Aliases:** workbench-workflow-2026-09-10 Q9; workbench-foundation-rework-2026-09-11 WF-9

**Notes:** Original wording: 'Which transitions are optional, repeatable, or permitted to loop backward?' correction-020: not every defect means the design concept was wrong or needs a Blueprint rewrite; repair ownership is WF-8A and WF-8G.

**Provenance (local records):** workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#current.questions (WF-9); workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-067; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#correction-020; workbench/sessions/notepads/grilling/workbench-workflow-2026-09-10.json#current.questions[8]

### WF-10

**Topic:** Coordinator later, single Task first

**Question:** What must an agent be able to trust when picking up parallel work or resuming after another agent stops?

**Status:** locked · answered 2026-09-16, WF note decision-076

**Answer:** 'Its more B': there should be a coordinator, but it will be built later. 'Right now let's just prove that we can execute a task every single time consistently.' Future capabilities are planned on the Blueprint; not every Spec is built now.

**Reason:** 'Let's get that bottom rung of the loop done before we start moving up the chain.'

**Result:**

- update `BLUEPRINT.md` - Plans the coordinator as future scope; the current proof target is consistent single-Task execution. The coordinator gets no Spec in the current rollout.

**Related:** [FND-Q17e](#fnd-q17e), [WF-7](#wf-7), [TT-Q4](#tt-q4), [WF-12](#wf-12)

**Notes:** Added by correction-020 as an unapproved agent question; Suggestion A was the agent's recommendation and the owner chose closer to B, deferred. The 2026-09-23 Director role (TT-Q3/TT-Q4) later describes how a Spec is watched and dispatched.

**Provenance (local records):** workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#current.questions (WF-10); workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-076; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#finding-037

### WF-11

**Topic:** Mission success proof on another workbench

**Question:** What real-world proof will demonstrate this workflow works across Template, Audit and our projects?

**Status:** locked · answered 2026-09-16, WF note decision-077 (chat 2026-09-16 20:13 UTC)

**Answer:** Mission success is one full cycle on another workbench: LLM_Workbench creates or updates it, a grilling session runs, the contract and Specs are created or updated, Tasks are created and executed correctly, and the Spec is verified and on integration for owner review. 'Once that cycle is complete on another workbench we will say mission success.'

**Reason:** 'The real final proof that it works is that I can use it in another project and it work just like it did here.'

**Result:**

- update `workbench/specs/S-00O-workbench-v4-0-0-release/SPEC.md TK-004` - Run one full WF-11 cycle on another workbench as the v4 exit run, with pass or fail evidence per rung.
- update `workbench/specs/S-00O-workbench-v4-0-0-release/SPEC.md TK-005` - Release receipt records the WF-11 cycle result before readiness is claimed.

**Related:** [WF-12](#wf-12), [FND-Q12](#fnd-q12)

**Aliases:** blocked-obligations-review-2026-09-21 WF-11

**Notes:** This is the acceptance test for the rollout; earlier pilots are supporting evidence. A separate question in blocked-obligations-review ('Should WF-11 remain blocked until its declared predecessors complete...') concerns sequencing, not this answer. A 2026-09-23 verdict row mislabeled WF-11 open; the addendum confirmed it is locked.

**Provenance (local records):** workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#current.questions (WF-11); workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-077; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#directive-018; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#current.questions (WF-11); workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md:37

### WF-12

**Topic:** Rollout scope for the workflow

**Question:** What is the smallest rollout we will approve, and what makes it safe to expand or necessary to stop?

**Status:** locked · answered 2026-09-16, WF note decision-078 and decision-082 (Suggestion A)

**Answer:** 'I want every spec completed before we call this done.' The rollout must complete the Blueprint rework and every Spec needed to establish the full workflow. The reworked Blueprint describes every rung and the full recursive Spec/Task loop (Create Spec -> Create Tasks -> Complete and Reconcile Tasks -> Verify Whole Spec -> Corrective Tasks -> Repeat Until Approved -> Integrate Spec). Future Blueprint capabilities outside that scope need no Specs now.

**Reason:** 'We need to establish the workflow and foundational blueprint rework into the framework of the workbench. Everything needs to be done before we can say this is done.'

**Result:**

- update `BLUEPRINT.md` - Describes every rung and the full recursive Spec/Task delivery loop (S-00P TK-001).
- update `workbench/specs/S-00P-workflow-canon-rework/SPEC.md` - Carries the controls rewrite (AGENTS, RUNBOOK, LEXICON, templates) that completes the workflow.
- update `workbench/specs/S-00O-workbench-v4-0-0-release/SPEC.md` - Release Spec: all rollout Specs (S-00H, S-00I, S-00J, S-00P) complete before v4.0.0; exemption 1 records the reduced delivery route.

**Related:** [WF-11](#wf-11), [WF-10](#wf-10), [WF-7](#wf-7)

**Notes:** Same day the owner said 'Yes I guess WF-12 is being contradicted' and chose to run the rollout through five Specs rather than a Spec per capability (directive-018); S-00O exemption 1 limits that to the delivery route and keeps the scope. Suggestion text was a reconciliation agent's.

**Provenance (local records):** workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#current.questions (WF-12); workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-078; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-082; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#directive-018; workbench/sessions/notepads/grilling/wf-workbench-workflow-2026-09-15.json#decision-083

## TRACK - Blocked-obligations track choice

### TRACK

**Topic:** Board first before ADR-000B/C/D

**Question:** Which track first: ADR-000E adoption (the readable board) or ADR-000B/C/D acceptance (enlarges v4)?

**Status:** locked · answered 2026-09-22, blocked-obligations-review (ADR-000B/C/D/E grilling session)

**Answer:** Recorded as: 'Owner backed up to ADR-000E / TASKBOARD.md first.' The owner did not pick an option; he said 'we need to back way up', that the six lanes he specified should be the lanes on TASKBOARD.md, and asked what they were right now.

**Reason:** Owner: the board being described did not sound like TASKBOARD.md, and TASKBOARD.md was meant to be an Agile board for his agents with six lanes.

**Result:**

- create `New board Spec (TASKBOARD.json, six lanes), placed in workbench/specs/S-00O-workbench-v4-0-0-release/SPEC.md build order` - The readable board track is worked before ADR-000B/C/D acceptance.
- update `workbench/docs/adr/proposed/000E-the-frontier-is-the-active-landscape-and-taskboard-renders-it.md` - Amend 000E to the locked E-1..E-11 board answers.
- none `ADR-000B/000C/000D (proposed)` - Acceptance waits behind the board track; ACC-1..ACC-5 follow it.

**Related:** [E-1](#e-1), [E-6](#e-6), [ACC-1](#acc-1), [FND-Q02A](#fnd-q02a)

**Aliases:** blocked-obligations-review TRACK

**Notes:** The 'locked' status is the agent's reading of an owner redirect, not a literal choice of option A. Later E-6 (decision-017) ordered v4 as WBID Spec, then board Spec, then S-00P rewrites, then the S-00O release.

**Provenance (local records):** workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#current.questions[TRACK]; Claude session d0f544c9-14ff-47fd-bc58-963bfa29a8c8 (owner message 2026-09-22T20:19Z)

## E - Taskboard and work representation

### E-1

**Topic:** TASKBOARD becomes generated six-lane JSON

**Question:** Should TASKBOARD.md itself be restructured into the six lanes (Backlog, To do, In progress, Blocked, Needs review, Complete), replacing the single Active Specs table?

**Status:** locked · answered 2026-09-22, blocked-obligations-review decision-003 with correction-002 (owner answers in directive-002/003)

**Answer:** Redirected answer: a generated TASKBOARD.json Agile Kanban board replaces TASKBOARD.md as the root contract artifact, with no TASKBOARD.md view. Six lanes (backlog, toDo, inProgress, blocked, needsReview, complete); cards keyed by WBID, no kind field; loose schema v1; owner = assignee; agents never write it. Complete cards 'stay until promoted to a durable place' and the record is deleted.

**Reason:** Owner: TASKBOARD 'was supposed to be an AGILE board for his agents' tracking work until it moves somewhere durable. 'SPECs and TASKs are transient... after they have been captured in the durable place and deleted, we can remove them... so we know they are not just done, but cleaned up.'

**Result:**

- update `workbench/docs/adr/proposed/000E-the-frontier-is-the-active-landscape-and-taskboard-renders-it.md` - Amended or superseded: the board is generated TASKBOARD.json with six lanes; Complete holds until capture and record deletion (replaces 'completed verified work leaves the board').
- update `workbench/docs/adr/0013-seven-file-workbench-contract.md` - Amended: the root artifact is TASKBOARD.json, not TASKBOARD.md.
- update `workbench/docs/adr/proposed/000B-the-workbench-root-surface-is-eight-files-and-contract-membership-is-separate-from-root-placement.md` - Its root file list names TASKBOARD.json instead of TASKBOARD.md.
- create `board Spec (TASKBOARD.json board)` - Owns the generator, card schema v1 and six lanes, listed in S-00O's build order.
- create `TASKBOARD.json (root) and templates/TASKBOARD.md` - Generated TASKBOARD.json replaces TASKBOARD.md in the root and in templates.
- update `AGENTS.md, LEXICON.md, README.md (+ templates mirrors)` - Describe TASKBOARD.json as the generated board instead of the TASKBOARD.md projection.

**Related:** [E-3](#e-3), [E-5](#e-5), [E-10](#e-10), [E-11](#e-11), [ACC-2](#acc-2), [FND-Q21B](#fnd-q21b), [FND-Q21D](#fnd-q21d), [FND-Q02A](#fnd-q02a)

**Notes:** decision-003 wrongly listed generated vs hand-written, keeping TASKBOARD.md, and Complete-hold as unconfirmed; correction-002 records the owner saying these were already settled. Waiting Tasks in To do is the owner's tentative 'I would guess'. Owner also asked for owner, approver, dependencies, priority, start/due date fields. Later decision-023 adds: every card value must be reproducible from a non-generated owner.

**Provenance (local records):** workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#directive-001; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#directive-002; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-003; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#directive-003; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#correction-002

### E-2

**Topic:** Director role definition

**Question:** Define director/steward/captain now, or keep 'director' undefined as the record does?

**Status:** withdrawn · answered 2026-09-22, blocked-obligations-review correction-001

**Answer:** Owner: this 'should never have been asked'; defining the director role was out of scope and already answered. Director = whoever is telling the agent what to do: the owner now, or a directing agent (maybe called the orchestrator), escalating to the owner when it cannot decide. The full process is not added to v4; director becomes a stance later.

**Reason:** Owner: the director process is defined elsewhere and is explicitly out of v4 scope.

**Result:**

- none `none` - No v4 artifact from this question; director as a stance is later work. Wherever LEXICON.md defines Director (from the TT-Q3/TT-Q4 answers, not E-2), it must stay consistent with this answer: the Director is whoever tells the agent what to do, the owner or a directing agent that escalates to the owner when it cannot decide.

**Related:** [TT-Q3](#tt-q3), [TT-Q4](#tt-q4), [FND-Q17e](#fnd-q17e)

**Notes:** Same correction records the owner saying the six lanes he specified were meant for TASKBOARD itself (feeds E-1).

**Provenance (local records):** workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#correction-001

### E-3

**Topic:** Board grain: Specs and Tasks

**Question:** Board grain: Task-level lanes, Spec-level lanes, or both?

**Status:** locked · answered 2026-09-22, blocked-obligations-review decision-005

**Answer:** Both. A Task is a nested part of a Spec, so Spec and Task cards show progression, not duplicate work; a Spec card can count its child Tasks. A Spec cannot move to needsReview or complete until all its Tasks are in needsReview or complete. 'Not every Task has to belong to a Spec.' Specs always appear as cards.

**Reason:** Owner says he already defined this when he defined Tasks and Specs (FND-Q13 decision-020: small localized change = a Task; larger = a Spec with Tasks).

**Result:**

- update `LEXICON.md Task row (+ templates/LEXICON.md)` - A Task may exist without a parent Spec; a Spec's lane is gated by its Tasks' lanes.
- update `workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md` - Amended so a Task need not be a slice of a Spec.
- create `board Spec (TASKBOARD.json board)` - Spec and Task cards both shown; Spec card carries child-Task progress; Spec lane gated by its Tasks.

**Related:** [E-9](#e-9), [E-5](#e-5), [TT-Q3](#tt-q3), [FND-Q13](#fnd-q13), [FND-Q19](#fnd-q19)

**Notes:** The agent's 'Spec gets its own card only when...' rule was rejected. finding-003 missed the earlier definition; correction-004 found FND-Q13 decision-020. TT-Q3 was later locked (decision-067) consistent with this.

**Provenance (local records):** workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-005; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#finding-003; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#correction-004; workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#decision-067

### E-4

**Topic:** Backlog meaning and done flow

**Question:** What counts as Backlog, and does a done Task go straight to Complete or to Needs review until a verdict/approval exists?

**Status:** locked · answered 2026-09-22, blocked-obligations-review decision-006 (rest via decision-007..009)

**Answer:** Backlog: 'things I have asked for, but we have not decided to start yet. They are wish list items basically... just on the edge of the frontier that we know we want to go there.' It is the residual lane. The done-Task half was split into E-4A, E-4B and E-4C and answered there.

**Reason:** Owner's own description of Backlog; it rejects the agent's proposal that planned Specs are Backlog by status alone (later refined in E-4B).

**Result:**

- create `board Spec (TASKBOARD.json board)` - Backlog lane defined as owner-requested wish-list work not yet started; residual lane.
- update `workbench/docs/adr/proposed/000E-the-frontier-is-the-active-landscape-and-taskboard-renders-it.md` - Amended to carry the Backlog meaning.
- update `LEXICON.md (+ templates/LEXICON.md)` - Inference: LEXICON.md defines Backlog as a board term.

**Related:** [E-4A](#e-4a), [E-4B](#e-4b), [E-4C](#e-4c), [E-1](#e-1)

**Notes:** Umbrella question; its sub-parts are E-4A (where Backlog lives), E-4B (planned = Backlog), E-4C (Needs review). E-4B later made 'planned' the Backlog separator, which narrows decision-006's rejection.

**Provenance (local records):** workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-006

### E-4A

**Topic:** Where Backlog items live

**Question:** Where does a Backlog item live?

**Status:** locked · answered 2026-09-22, blocked-obligations-review decision-007 (with correction-005)

**Answer:** As a bare-bones Spec, which can be as little as one sentence and be improved later. 'Why can't we have backlog spec items?... Anything not a part of v4 got moved to the backlog.' 'If I have asked for it, and described it, it should go on here.' Backlog is the residual lane. No separate BL- record type.

**Reason:** Owner: work set aside from v4 belongs in Backlog as Spec items, and a Spec can start as one sentence.

**Result:**

- create `board Spec (TASKBOARD.json board)` - Spec validation accepts a one-sentence Spec without flagging it; such Specs sit in Backlog.
- update `workbench/tools/spec-workbench.mjs and templates/SPEC.md` - Doctor and the Spec parser accept a minimal Backlog Spec.

**Related:** [E-4](#e-4), [E-4B](#e-4b)

**Notes:** Agent option A (separate BL- record) rejected. correction-005: the agent wrongly treated 'nothing is labeled backlog today' as a gap; the interview designs the future board.

**Provenance (local records):** workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-007; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#correction-005

### E-4B

**Topic:** Planned status means Backlog

**Question:** Is a Spec's Backlog vs To do lane decided by its status (planned = Backlog, active = its Tasks' lanes), and which of today's planned Specs (S-003, S-00G, S-00M, S-00O) stay Backlog?

**Status:** locked · answered 2026-09-22, blocked-obligations-review decision-008 with correction-006

**Answer:** 'planned' is the Backlog separator going forward. to-spec scopes a Spec and it enters Backlog as planned; its Tasks are not cut until it moves to To do, when to-tasks runs from live Actuality. Correction: this applies to new Specs only; in-flight Specs keep their existing Tasks, and pre-cut Tasks in planned Specs are not an issue.

**Reason:** So Tasks start from live Actuality at the real start of the work.

**Result:**

- update `workbench/skills/to-spec/SKILL.md` - A new Spec enters Backlog as planned, with no Tasks cut.
- update `workbench/skills/to-tasks/SKILL.md` - Tasks are cut when a Spec moves from Backlog to To do.
- create `board Spec (TASKBOARD.json board)` - Lane function maps planned Specs to Backlog.

**Related:** [E-4](#e-4), [E-4A](#e-4a), [E-7](#e-7)

**Notes:** S-00O's lane was not addressed here and was carried to E-7. The process change is part of v4.

**Provenance (local records):** workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-008; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#correction-006

### E-4C

**Topic:** Needs review lane meaning

**Question:** Does a done Task go straight to Complete, or wait in Needs review until a verdict/approval exists?

**Status:** locked · answered 2026-09-22, blocked-obligations-review decision-009

**Answer:** Needs review is the independent reviewer (QA/verify) stage. Most Tasks go In progress -> Needs review -> Complete to await cleanup; work needing no independent review may go straight to Complete. Tasks collect in Needs review and Complete while their Spec is In progress, and move to Complete together when the Spec is reviewed.

**Reason:** Not recorded beyond the owner's statement that Needs review is the QA/verify step in the workflow.

**Result:**

- update `workbench/docs/adr/proposed/000E-the-frontier-is-the-active-landscape-and-taskboard-renders-it.md` - Needs review covers the independent-reviewer stage, not only work cleared by a director.
- update `workbench/tools/task-record.mjs` - Tasks support a needs-review status.
- create `board Spec (TASKBOARD.json board)` - Needs review lane holds Tasks awaiting independent QA/verification.

**Related:** [E-5](#e-5), [E-3](#e-3), [FND-Q17b](#fnd-q17b)

**Notes:** Rejects the agent's recommendation that independent review is part of doing the work.

**Provenance (local records):** workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-009

### E-5

**Topic:** Board tooling and lane derivation

**Question:** Tooling: does next read the To do lane; does doctor treat needsReview as non-blocking; what advances a Spec from In progress to Needs review (automatic when all Tasks are in needsReview/complete)?

**Status:** locked · answered 2026-09-22, blocked-obligations-review decision-010

**Answer:** Confirmed the agent's proposal: one shared lane function for render, next and doctor; next offers only To do cards (cards with unfinished dependsOn visible but not offered); next --review lists Needs review; doctor never blocks on needsReview or Backlog; Blocked stays attention; a Spec's lane is derived from its Tasks, never hand-set.

**Reason:** Owner: 'the hope is we can get this board entirely generated in the future.'

**Result:**

- update `workbench/tools/spec-workbench.mjs` - Shared lane function; next reads To do; next --review; doctor non-blocking on needsReview/Backlog; derived Spec lane.
- update `RUNBOOK.md Spec Lifecycle And Retrieval (+ templates/RUNBOOK.md)` - Document next, next --review and lane behavior.
- create `board Spec (TASKBOARD.json board)` - Owns this tooling.

**Related:** [E-1](#e-1), [E-3](#e-3), [E-4C](#e-4c)

**Notes:** Agent proposal adopted by owner confirmation.

**Provenance (local records):** workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-010

### E-6

**Topic:** Board and WBID Specs in v4

**Question:** Owner is a v4 build: one rebuild Spec or two (board vs WBID renumbering), and where in v4 order relative to S-00P?

**Status:** locked · answered 2026-09-22, blocked-obligations-review decision-011, amended by decision-013 and decision-017

**Answer:** Two new v4 build Specs added to S-00O's build list, not folded into S-00P. Final order ('Yes, lets do it'): (1) WBID Spec (uppercase width 4 allocator, dual-form lookup, ADR-0041 amendment); (2) board Spec (TASKBOARD.json, lanes, lane function, sitrep; ADR-000E and ADR-0013 amendments); (3) S-00P TK-002..TK-005 rewriting controls once around the new board; (4) S-00O release.

**Reason:** Board lands before S-00P TK-002 so S-00P rewrites AGENTS/RUNBOOK/LEXICON/templates once; WBID first so new Specs get new-form IDs.

**Result:**

- create `WBID Spec` - Allocator + dual-form lookup + ADR-0041 amendment; first in v4 build order.
- create `board Spec (TASKBOARD.json board)` - Second in v4 build order.
- update `workbench/specs/S-00O-workbench-v4-0-0-release/SPEC.md` - Build list and order include both new Specs before S-00P TK-002 and the release.
- update `workbench/specs/S-00P-workflow-canon-rework/SPEC.md` - TK-002..TK-005 depend on the board Spec.

**Related:** [E-8](#e-8), [E-1](#e-1), [E-10](#e-10)

**Notes:** decision-011 first put the WBID Spec last (a full re-pad); decision-013 shrank it (touch-and-update) and left its position open; decision-017 placed it first. Authoring and implementing the two Specs is a separate authorized run.

**Provenance (local records):** workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-011; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-013; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-017

### E-7

**Topic:** No mass re-statusing of Specs

**Question:** Approve re-statusing: seven Human-QA Specs (S-00I,J,K,N,S,T,U) active -> needs-review; S-00O planned -> active/To do (or stays Backlog)?

**Status:** locked · answered 2026-09-22, blocked-obligations-review decision-012

**Answer:** No. Do not handle Spec statuses now, and the board Spec's migration does not re-status them either; it uses each Spec's status as found, and a Spec is put in the right place the next time it is used. 'We don't go back and do these mass edit sweeps.' Touch-and-update as we go.

**Reason:** Owner's touch-and-update principle: no mass edit sweeps.

**Result:**

- create `board Spec (TASKBOARD.json board)` - Migration keeps Spec statuses as found; no re-statusing step.
- none `none named` - Owner did not name a durable home for the touch-and-update principle.

**Related:** [E-8](#e-8), [E-4B](#e-4b)

**Notes:** Rejects the agent's recommendation to activate S-00O and auto-place the seven Human-QA Specs. The principle was extended to the whole v4 update in E-8.

**Provenance (local records):** workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-012

### E-8

**Topic:** WBID widening by touch-and-update

**Question:** Given no mass sweeps: does the WBID Spec re-pad all existing IDs/folders to width 4, or do existing IDs stay and get widened only when touched (new allocations width 4)?

**Status:** locked · answered 2026-09-22, blocked-obligations-review decision-013

**Answer:** Touch-and-update, locked 'for the whole update'. New WBIDs are uppercase width 4; existing IDs widen only when their record is next touched (move-spec/move-task, former ID kept); the allocator treats S-00Q and S-000Q as the same; completed records are not renamed. 'We can do the sweep during the QA/verify, and find what we missed.'

**Reason:** Resolves the conflict (finding-005) between a full re-pad and the owner's E-7 no-mass-sweeps principle.

**Result:**

- update `workbench/docs/adr/0041-visible-base62-workbench-identifiers.md` - Amended: uppercase 0-9A-Z, width 4, former IDs retained, dual-form lookup.
- update `workbench/tools/visible-ids.mjs` - Allocator uppercase width 4; S-00Q and S-000Q resolve as one value.
- create `WBID Spec` - Scoped to allocator + dual-form lookup + ADR-0041 amendment; a sweep is a verification-time check only.

**Related:** [E-6](#e-6), [E-7](#e-7)

**Notes:** Builds on decision-004/correction-003 (every artifact gets a WBID, width 4, uppercase; recycling not adopted). Amends decision-011's re-pad plan.

**Provenance (local records):** workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-004; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#correction-003; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#finding-005; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-013

### E-9

**Topic:** Home for spec-less Tasks

**Question:** Where does a Task with no parent Spec live (path, WBID, board card), given tools today require <spec>/tasks/<id>/TASK.md?

**Status:** locked · answered 2026-09-22, blocked-obligations-review decision-014

**Answer:** At workbench/tasks/TK-XXXX/TASK.md beside the Specs, under the same ADR-000I folder lifecycle, in the same Workbench-unique TK- series. Its card has an empty spec field and moves through lanes on its own. Used for small localized changes; a standalone Task that outgrows one context unit becomes a Spec.

**Reason:** Inference: follows the owner's FND-Q13 rule (small localized change = a Task) and his E-3 answer that Tasks need not belong to a Spec.

**Result:**

- create `workbench/tasks/ (new lane directory)` - Home for spec-less Task records.
- update `workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md` - A Task may live directly under the Blueprint at workbench/tasks/.
- update `LEXICON.md Task row (+ templates/LEXICON.md)` - Names the standalone Task home.
- update `workbench/tools/spec-workbench.mjs and workbench/tools/task-record.mjs` - Read, lifecycle and render standalone Tasks.
- update `workbench/wiki/design-concepts/task-artifact-and-lifecycle.md` - Path rule covers standalone Tasks.

**Related:** [E-3](#e-3), [TT-Q3](#tt-q3), [FND-Q13](#fnd-q13), [FND-Q19](#fnd-q19)

**Notes:** Resolves the FND-Q13 decision-020 vs FND-Q19 decision-026 tension. TT note finding-037 proposes an 'Artifact model and definitions' Spec to carry the ADR-000H/AGENTS amendment.

**Provenance (local records):** workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-014; workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#finding-034; workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#decision-067; workbench/sessions/notepads/grilling/tt-task-ticket-chat-terms-2026-09-15.json#finding-037

### E-10

**Topic:** sitrep returns as core skill

**Question:** Does sitrep return as a core skill that reads TASKBOARD.json?

**Status:** locked · answered 2026-09-22, blocked-obligations-review decision-015

**Answer:** Yes: sitrep (Situation Report) returns as a core skill reading TASKBOARD.json, delivered with the board Spec. Shape: lead with what needs his attention: (1) needs his review, (2) what he can unblock, (3) in progress, (4) to do, each in priority order, in plain language: 'I don't want to be reading a bunch of WBID. I want to know what the specs and tasks actually are, what the progress actually is.'

**Reason:** Owner wants a plain-language report of real progress, not ID lists; the board is sitrep's intended reader.

**Result:**

- create `workbench/skills/sitrep/SKILL.md` - Core skill reading TASKBOARD.json with the owner's report order.
- update `workbench/manifest.json skillPolicy` - sitrep listed as a required core skill.
- create `board Spec (TASKBOARD.json board)` - Delivers sitrep; cards carry human-readable titles and progress.

**Related:** [E-1](#e-1), [E-11](#e-11), [PW-7](#pw-7), [PW-4](#pw-4), [FND-Q02A](#fnd-q02a)

**Notes:** PW-7 relies on sitrep surfacing blocked/needs-review Tasks; under PW-3/PW-4 it ships in workbench/skills. The PW-4 tentative catalog candidate list names sitrep.

**Provenance (local records):** workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-015; workbench/sessions/notepads/grilling/portable-workbench-cloud-deployable-2026-09-22.json#decision-008

### E-11

**Topic:** Complete-card cleanup substates

**Question:** Should a Complete card show a 'captured, ready to delete' state between capture and deletion (ADR-000I retired folder already marks it)?

**Status:** locked · answered 2026-09-22, blocked-obligations-review decision-016

**Answer:** Derived, never authored on the board: complete record in a live folder = ready to capture; in retired/ (ADR-000I) = captured, ready to delete; deleted = card drops. 'The state should show that we are good to move forward, not the taskboard. Updating that it's ready only to wipe it is pointless.' sitrep reports Complete as two counts.

**Reason:** Owner: the record's own state should show readiness; writing a board flag just before deletion is pointless.

**Result:**

- create `board Spec (TASKBOARD.json board)` - Complete-card substate derived from record state/folder.
- create `workbench/skills/sitrep/SKILL.md` - Reports Complete as two counts (ready to capture, ready to delete).
- none `workbench/docs/adr/proposed/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md` - ADR-000I keeps retired/ as the folder that marks captured records; the derived Complete substate relies on it.

**Related:** [E-1](#e-1), [E-10](#e-10)

**Notes:** Agent proposal agreed by owner.

**Provenance (local records):** workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-016

## ACC - ADR acceptance and Contract binding

### ACC-1

**Topic:** Timing of ADR-000B/C/D acceptance

**Question:** Does ADR-000B/C/D acceptance land before or after the v4 PC handoff?

**Status:** open

**Answer:** Open - no owner answer.

**Reason:** Not recorded.

**Result:**

- none `workbench/docs/adr/proposed/000B-the-workbench-root-surface-is-eight-files-and-contract-membership-is-separate-from-root-placement.md, workbench/docs/adr/proposed/000C-the-workbench-contract-is-the-obligation-claim-set-carried-by-three-root-controls-and-the-assigned-spec.md, workbench/docs/adr/proposed/000D-the-ownership-map-is-an-exhaustive-type-level-framework-answered-by-structured-query.md` - Once decided: moved out of proposed/ at the chosen time.
- none `workbench/specs/S-00G-ownership-map-root-control/SPEC.md` - Its Next gate records the chosen acceptance timing for 000B/C/D.

**Related:** [ACC-2](#acc-2), [ACC-5](#acc-5), [FND-Q22](#fnd-q22), [FND-Q23](#fnd-q23), [CAND-N](#cand-n)

**Notes:** Owner's only related words: "For ADR acceptances, I guess we need to talk about those, but if I just created them, then they should be correct" (2026-09-23). This is a conditional view on accepting his own ADRs plus a wish to talk; it does not answer the timing. A gap-triage reading of 'now' is interpretation, and whether 000B/C/D count as ADRs he just created is not established.

**Provenance (local records):** workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json (questions ACC-1, current.next_action); workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#source_record-001; workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md

### ACC-2

**Topic:** Seven-vs-eight root file window

**Question:** Is a window where accepted Canon says eight root files while AGENTS/LEXICON/BLUEPRINT say seven acceptable, or must acceptance and S-00G migration land together?

**Status:** open

**Answer:** Open - no owner answer.

**Reason:** Not recorded.

**Result:**

- none `workbench/docs/adr/proposed/000B-the-workbench-root-surface-is-eight-files-and-contract-membership-is-separate-from-root-placement.md` - Once decided: accepted with its file list naming TASKBOARD.json (per E-1).
- none `workbench/docs/adr/0013-seven-file-workbench-contract.md` - Archived as superseded when 000B is accepted.
- none `AGENTS.md, LEXICON.md, BLUEPRINT.md (+ templates)` - Root-file count changes with or after acceptance, per the answer.

**Related:** [ACC-1](#acc-1), [E-1](#e-1), [FND-Q22](#fnd-q22), [FND-Q23A](#fnd-q23a)

**Notes:** Since E-1 (2026-09-22), ACC-2 also covers TASKBOARD.md -> TASKBOARD.json in 000B's list. Owner's related words: "For ADR acceptances, I guess we need to talk about those, but if I just created them, then they should be correct" (2026-09-23); reading 'land in one change so no window opens' from them is interpretation.

**Provenance (local records):** workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json (questions ACC-2, current.next_action); workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#source_record-001; workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md

### ACC-3

**Topic:** Blueprint outside the Contract

**Question:** With BLUEPRINT.md outside the Contract (000C), what keeps its claims from reading as non-binding?

**Status:** partially-answered · answered 2026-09-23 01:24 UTC chat (triage v2); recorded as blocked-obligations-review decision-027

**Answer:** Contract = AGENTS.md, RUNBOOK.md and LEXICON.md, read on every run, plus the assigned Spec; the Blueprint is a routed artifact the Contract directs agents to by intent.

**Reason:** Inference: the owner's settled vocabulary (decision-024, correction-009) says Canon classifies accepted claims in context rather than by file, so a routed Blueprint's accepted claims still bind where they apply.

**Result:**

- update `workbench/docs/adr/proposed/000C-the-workbench-contract-is-the-obligation-claim-set-carried-by-three-root-controls-and-the-assigned-spec.md` - States the three-carrier Contract with the Blueprint as a routed artifact.
- update `AGENTS.md Authority Order (+ templates/AGENTS.md)` - Blueprint listed as a routed artifact, not a Contract carrier.
- update `LEXICON.md Workbench Contract row (+ templates/LEXICON.md)` - Contract = three carriers + assigned Spec.

**Related:** [FND-Q22](#fnd-q22), [ACC-4](#acc-4), [FND-Q23](#fnd-q23)

**Notes:** Answered part: the Blueprint's place (a routed artifact outside the three-carrier Contract). Open part: what makes its accepted claims binding; the reason given is an inference from decision-024 and correction-009, and the gap triage proposed agent wording for owner confirmation.

**Provenance (local records):** workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-020; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#decision-027; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#correction-009; workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md (ACC-3 row)

### ACC-4

**Topic:** Routes-not-claims guardrail violation

**Question:** What would a first violation of 000D's routes-not-claims guardrail look like, and what catches it?

**Status:** open

**Answer:** Open - no owner answer.

**Reason:** Not recorded.

**Result:**

- none `workbench/docs/adr/proposed/000D-the-ownership-map-is-an-exhaustive-type-level-framework-answered-by-structured-query.md` - Once decided: names the violation shape and its check.
- none `workbench/specs/S-00G-ownership-map-root-control/SPEC.md TK-004` - Red test proving an ownership query returns routes, never claim text.

**Related:** [ACC-3](#acc-3), [FND-Q20](#fnd-q20), [FND-Q23](#fnd-q23)

**Notes:** Gap triage calls it agent-answerable from decision-024/027 (Canon classifies claims in context; planes are lenses), with owner confirmation; no answer is recorded.

**Provenance (local records):** workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json (questions ACC-4)

### ACC-5

**Topic:** Repointing links in completed Specs

**Question:** May links to archived ADR-0013/0033 be repointed inside completed Specs S-024 and S-022?

**Status:** open

**Answer:** Open - no owner answer.

**Reason:** Not recorded.

**Result:**

- none `workbench/specs/S-024-governance-core-adrs-and-diagnostics/SPEC.md:69 and workbench/specs/S-022-llm-workbench-v3-1-release/SPEC.md:97` - Links to ADR-0033 repointed or left, per the answer, once 0033 is archived.
- none `LEXICON.md Workbench Contract row` - Its ADR-0033 link repointed on archive.
- none `workbench/docs/adr/REGISTER.md` - Shows 0013/0033 archived after 000B/C acceptance.

**Related:** [ACC-1](#acc-1), [ACC-2](#acc-2), [FND-Q23](#fnd-q23)

**Notes:** The question applies once ADR-0013 and ADR-0033 are archived after 000B/C acceptance. Owner's related words: "For ADR acceptances, I guess we need to talk about those, but if I just created them, then they should be correct" (2026-09-23). The gap-triage reading 'agents repoint links' is interpretation.

**Provenance (local records):** workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json (questions ACC-5); workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#source_record-001; workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md

## PW - Portable, cloud-deployable Workbench

### PW-1

**Topic:** Portable Workbench definition

**Question:** What does Portable Workbench mean as a Lexicon term, and which of the three existing senses (S-021 support-root layout, the Windows/POSIX matrix, FND-Q24 upstream-vs-project ownership origins) get renamed so the word stops being overloaded?

**Status:** locked · answered 2026-09-22, portable-workbench-cloud-deployable decision-001

**Answer:** Portable Workbench = 'a fully packaged and deployable agentic harness': everything an agent needs is in the Git repository, so any agent, or several at once in the cloud, can clone it, do authorized work, push, and clean up after itself. All three renames accepted: support-root layout, host portability, ownership origin model. The success criterion gains 'cleaning up after itself'.

**Reason:** Owner wants cloud sessions spun up from the GitHub repo alone, ten at a time; the drafted wording was 'a bit fluffy' and too much 'techno dev speak', so he wanted it basic.

**Result:**

- update `LEXICON.md Core Terms (Portable Workbench, Host portability, Ownership origin model; retired Portable layout, Portability model)` - Defines Portable Workbench, Host portability and Ownership origin model, and lists Portable layout and Portability model as retired terms.
- update `templates/LEXICON.md` - Mirrors the generic rows.
- update `BLUEPRINT.md portability quality sentence (+ templates/BLUEPRINT.md)` - The portability quality sentence states the plain definition.
- update `RUNBOOK.md Portability and privacy matrix` - The matrix is framed as host portability.

**Related:** [PW-2](#pw-2), [PW-10](#pw-10), [FND-Q24](#fnd-q24)

**Provenance (local records):** workbench/sessions/notepads/grilling/portable-workbench-cloud-deployable-2026-09-22.json#finding-001; workbench/sessions/notepads/grilling/portable-workbench-cloud-deployable-2026-09-22.json#decision-001; workbench/sessions/notepads/grilling/portable-workbench-cloud-deployable-2026-09-22.json#verification-001

### PW-2

**Topic:** FND-Q24B stays under S-00G

**Question:** Given PW-1, what happens to FND-Q24B and S-00G: renamed and kept open behind cloud-deployability, folded in, or dropped?

**Status:** locked · answered 2026-09-22, portable-workbench-cloud-deployable decision-002

**Answer:** FND-Q24B stays live under S-00G, relabeled an ownership-origin-model question. It is neither parked behind nor folded into Portable Workbench; the two are independent. The existing FND-Q24B handoff stays valid for a separate deep-dive chat. No priority order between them was set.

**Reason:** Owner: OWNERSHIP.json depends on FND-Q24B, so FND-Q24B still needs an answer; it just belongs to a different Spec.

**Result:**

- update `workbench/specs/S-00G-ownership-map-root-control/SPEC.md` - S-00G carries FND-Q24B as its gate, labeled an ownership-origin question, until the owner answers it.
- update `LEXICON.md Ownership origin model row` - Points to S-00G and FND-Q24B.
- update `workbench/specs/S-00V-portable-workbench/SPEC.md` - Non-Goal: FND-Q24B is independent of Portable Workbench.

**Related:** [PW-1](#pw-1), [FND-Q24](#fnd-q24), [FND-Q24B](#fnd-q24b)

**Notes:** Owner corrected the agent's recommendation to park FND-Q24B.

**Provenance (local records):** workbench/sessions/notepads/grilling/portable-workbench-cloud-deployable-2026-09-22.json#decision-002; workbench/sessions/notepads/grilling/blocked-obligations-review-2026-09-21.json#correction-010

### PW-3

**Topic:** Core skills tracked per room

**Question:** How do the core skills reach a cloud session, given a clone discovers zero skills today and ADR-0046 keeps installed core outside the clone: tracked project discovery root, a session-start bootstrap command, a declared fetchable skills dependency, or a combination?

**Status:** locked · answered 2026-09-22, portable-workbench-cloud-deployable decision-003

**Answer:** 'We already locked in a version of 1. When we update the workbenches, we update the skills. LLM_Workbench owns the skills it needs to. We store them all in workbench/skills.' Core skills are tracked in every room at workbench/skills and replaced by the ordinary Workbench update; no provider home, personal catalog or bootstrap is on the critical path.

**Reason:** Owner says this was already decided earlier: the clone must be self-contained and skills update with the Workbench.

**Result:**

- create `workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md` - Records the seventh lane, tracked adapters and update-only replacement.
- retire `workbench/docs/adr/archive/0017-workbench-support-directory-has-six-lanes.md` - The six-lane ADR is marked superseded.
- update `workbench/docs/adr/0046-core-personal-shared-and-room-local-skill-ownership.md` - Core tracked per room on the ADR-0031 managed model.
- update `workbench/manifest.json` - Declares lanes.skills and the reshaped skillPolicy.
- create `.claude/skills and .agents/skills` - Tracked adapters into workbench/skills.
- update `LEXICON.md, RUNBOOK.md (+ templates mirrors)` - Support lane, Normal setup, Explicit skill update rows and skills lane procedure.
- create `workbench/specs/S-00V-portable-workbench/SPEC.md TK-001` - Owns the lane build.

**Related:** [PW-3A](#pw-3a), [PW-4](#pw-4), [PW-7](#pw-7)

**Notes:** finding-003: no earlier record of the workbench/skills decision was found; this note became its recording owner. Triage v2 records PW-3 as settled.

**Provenance (local records):** workbench/sessions/notepads/grilling/portable-workbench-cloud-deployable-2026-09-22.json#finding-002; workbench/sessions/notepads/grilling/portable-workbench-cloud-deployable-2026-09-22.json#decision-003; workbench/sessions/notepads/grilling/portable-workbench-cloud-deployable-2026-09-22.json#finding-003

### PW-3A

**Topic:** Move producer skills to lane

**Question:** In this producer repo, does root skills/ (the 21-skill source) move to workbench/skills so the dogfood room matches every other room, and do templates/ ship the skills lane so Genesis and update-harness lay it down?

**Status:** locked · answered 2026-09-22, portable-workbench-cloud-deployable decision-004

**Answer:** 'Move its sources to workbench/skills, and give templates what it needs to.' The 21-skill source moves from root skills/ to workbench/skills and root skills/ is removed; templates gain what Genesis and update-harness need to lay down and refresh the lane. A root skills/ becomes a doctor finding.

**Reason:** Recorded rationale: the dogfood room matches every other room and one path is both source and installed lane; rejected keeping two copies with a sync step that can drift.

**Result:**

- create `workbench/skills/` - Holds the producer's skill source; no root skills/ directory remains.
- update `templates/GENESIS.md, templates/ADOPTION.md` - Genesis and Adoption lay down the lane from the release checkout.
- update `workbench/tools/spec-workbench.mjs doctor` - A root skills/ directory is reported as a finding.
- update `RUNBOOK.md, README.md` - Describe the lane instead of root skills/.

**Related:** [PW-3](#pw-3), [PW-4](#pw-4)

**Notes:** Reverses the Genesis prohibition on a root skills/ shadow into a doctor finding.

**Provenance (local records):** workbench/sessions/notepads/grilling/portable-workbench-cloud-deployable-2026-09-22.json#decision-004

### PW-4

**Topic:** Non-core skills and backup catalog

**Question:** Are the non-core skills the owner uses in practice (lexicon, domain-modeling, land, preflight, harness-review-*, brainstorm, research...) part of the portable loop, or personal extras a cloud session must work without?

**Status:** locked · answered 2026-09-22, portable-workbench-cloud-deployable decision-005

**Answer:** 'If we need it, it should be included in workbench/skills. But we should keep [the owner's private skills repository] as a backup of all of the skills, and a place every workbench can publish skills to that they create.' The Contract names only skills that ship in the lane. The specific candidate list was not confirmed.

**Reason:** Inference: a cloud agent only has what the room ships, so a needed skill must be in the lane; the personal catalog stays useful as backup and publication target.

**Result:**

- update `workbench/specs/S-00V-portable-workbench/SPEC.md` - Catalog-review Task: owner confirms which non-core skills join the lane, starting from the tentative list.
- update `workbench/docs/adr/0046-core-personal-shared-and-room-local-skill-ownership.md` - Names [the owner's private skills repository] as backup and publication target, never on the critical path.
- update `RUNBOOK.md Portable Save, Promote And Room-Local Skills` - Names the publication destination; publishing stays separately authorized.

**Related:** [PW-3](#pw-3), [PW-3A](#pw-3a), [E-10](#e-10)

**Notes:** Candidate list (lexicon, domain-modeling, land, preflight, brainstorm, research, sitrep) is tentative; the catalog-review Task settles it.

**Provenance (local records):** workbench/sessions/notepads/grilling/portable-workbench-cloud-deployable-2026-09-22.json#decision-005

### PW-5

**Topic:** Cloud continuity and committing notes

**Question:** What is continuity for a cloud instance whose notepads and handoffs die with it: durable owners only with promote-before-end as the exit obligation, ADR-0051 private transport as the cloud default, or tracked notes?

**Status:** locked · answered 2026-09-22, portable-workbench-cloud-deployable decision-006

**Answer:** Promote-before-end is the goal for almost every session: promote settled claims, append the receipt, push, let the notepad die. With an amendment: 'we can have the notepads and handoffs stay if needed... we should be able to commit them for a bit if we need to, undoing the lock on them never being committed.' Committed notes are transport, not evidence; privacy rules stand; ADR-0051 stays optional.

**Reason:** Owner: notepads and handoffs are structured records, so committing them temporarily is safe when continuation needs it.

**Result:**

- update `AGENTS.md Session Records (+ templates/AGENTS.md)` - Allows temporary commits of notes and handoffs in place of 'Live notes and handoffs stay untracked'; states the promote-before-end exit rule.
- update `workbench/sessions/.gitignore` - Allow temporary commits of notepads/handoffs.
- update `LEXICON.md Packet row` - Does not describe notes as always untracked.
- create `new ADR narrowing ADR-0051 / ADR-0040 / ADR-0028` - Notes may be committed temporarily as transport.
- update `RUNBOOK.md and tools/test-workbench-round-trip.mjs` - Neither asserts 'the notepad never enters the commit'.
- update `workbench/specs/S-00V-portable-workbench/SPEC.md` - Slice: notes may travel.

**Related:** [PW-9](#pw-9), [PW-10](#pw-10)

**Provenance (local records):** workbench/sessions/notepads/grilling/portable-workbench-cloud-deployable-2026-09-22.json#decision-006

### PW-6

**Topic:** Shared claim surface for instances

**Question:** With ten instances, what is the shared claim surface so two instances do not take the same Task: a pushed claim commit that next consults, a remote branch as the claim, or optimistic collision resolved at the review gate?

**Status:** locked · answered 2026-09-22, portable-workbench-cloud-deployable decision-007

**Answer:** Option 1: push the claim, read the remotes. claim creates the task branch from integration, commits the claim as its first commit and pushes at once; next and claim fetch all refs and overlay Task state from every remote tip. No direct claim commit on integration. The PR carries closure. A no-remote session falls back to local and says so.

**Reason:** Recorded rationale: keeps integration review-only; direct commits to integration would race with ten instances; branch-name-only has no record; collision at review throws away sessions.

**Result:**

- update `workbench/tools/spec-workbench.mjs claim and next` - Push on claim; fetch-before-select; remote-tip overlay.
- create `new ADR: claim on the task branch with fetch-all` - Records the claim mechanism.
- update `RUNBOOK.md claim procedure` - Documents push/fetch.
- update `TASKBOARD render` - Reads remote tips so in-flight claims show.
- update `workbench/specs/S-00V-portable-workbench/SPEC.md` - Slice: push-on-claim and fetch-before-select.

**Related:** [TT-Q6](#tt-q6), [E-1](#e-1)

**Notes:** Owner asked whether the claim commits to integration; the answer 'no, task branch' was accepted.

**Provenance (local records):** workbench/sessions/notepads/grilling/portable-workbench-cloud-deployable-2026-09-22.json#decision-007

### PW-7

**Topic:** Host floor and missing capabilities

**Question:** What is the host capability floor a cloud session must provide (node, python3, git, gh with push rights, GitHub network), and how are unavailable capabilities (simulator, Chronicle, MCPs, Foundry, Workbench_Template) reported rather than faked?

**Status:** locked · answered 2026-09-22, portable-workbench-cloud-deployable decision-008

**Answer:** 'When we lack something, flag the task as blocked or needs review so when I do sitrep I find it.' Mechanics were delegated: floor = Node 18+, Python 3.9+, git, gh authenticated with push rights, GitHub network, checked at session start (missing = all-effect doctor finding); other capabilities are optional and named by the Task.

**Reason:** Owner wants gaps surfaced through sitrep, never faked or skipped; he called PW-7..PW-10 'you questions' and delegated mechanics.

**Result:**

- update `workbench/tools/spec-workbench.mjs doctor` - Tracked host-floor check; missing item is an all-effect finding.
- update `AGENTS.md (+ templates/AGENTS.md)` - Capability-blocked Task rule: set blocked or needs-review naming the missing capability.
- update `RUNBOOK.md Prerequisites` - Floor names gh with push rights and GitHub network.
- update `workbench/specs/S-00V-portable-workbench/SPEC.md` - Slice: host floor check and routing.

**Related:** [E-10](#e-10), [PW-3](#pw-3)

**Notes:** Only the one-line ruling is the owner's; floor list and doctor mechanics are agent-resolved under his delegation. Relies on sitrep (E-10). doctor --home retires with the global core.

**Provenance (local records):** workbench/sessions/notepads/grilling/portable-workbench-cloud-deployable-2026-09-22.json#decision-008

### PW-8

**Topic:** Owner-machine truth goes to Wiki

**Question:** What happens to owner-machine-only truth (Claude auto-memory, personal catalog knowledge): audited and promoted into repo owners, or accepted as convenience the cloud never needs?

**Status:** locked · answered 2026-09-22, portable-workbench-cloud-deployable decision-009 (chat 2026-09-23 02:28 UTC, triage v2)

**Answer:** 'This is what the wiki is for.' Owner-machine-only truth a cloud agent would need goes into the room's Wiki (MEMORY.md router), not host memory. Host auto-memory stays a per-machine convenience the Workbench never depends on.

**Reason:** Owner: the Wiki is the room's knowledge base, so needed knowledge belongs there.

**Result:**

- update `workbench/wiki/ (articles + MEMORY.md router)` - Holds the project truth a fresh agent needs from host memory and the personal catalog.
- update `workbench/specs/S-00V-portable-workbench/SPEC.md` - Wiki audit Task over ~/.claude project memory and the personal catalog.

**Related:** [PW-1](#pw-1), [WF-8H](#wf-8h)

**Notes:** Audit mechanics are agent-resolved. Owner 2026-09-23 correction: 'PW-8 and the whole of portability are v4 scope', overruling a gap-triage label that it only matters for cloud use.

**Provenance (local records):** workbench/sessions/notepads/grilling/portable-workbench-cloud-deployable-2026-09-22.json#decision-009; workbench/sessions/recovery/destination-audit-2026-09-23/TRIAGE-v2-owner-answers-recovered.md (PW-8 row)

### PW-9

**Topic:** Proof of portability

**Question:** What proves portability: extend the existing round-trip cold-clone test into a release gate, plus one real cloud session run as the milestone demo, plus a two-instance parallel demo?

**Status:** locked · answered 2026-09-22, portable-workbench-cloud-deployable decision-010

**Answer:** 'End clean up.' Recorded as the agent's interpretation: proof is a run that ends clean. Extend the round-trip test to start with nothing outside the clone, claim by pushing, and end with everything promoted, pushed and nothing left on the instance; demos are one real cloud session and a two-instance parallel run.

**Reason:** Inference: matches the owner's PW-1 success criterion 'cleaning up after itself'.

**Result:**

- update `tools/test-workbench-round-trip.mjs` - Cold-clone, ends-clean round trip as a release gate.
- update `workbench/specs/S-00V-portable-workbench/SPEC.md` - Acceptance: round-trip gate, real cloud session demo, two-instance demo.

**Related:** [PW-1](#pw-1), [PW-5](#pw-5), [PW-6](#pw-6), [WF-11](#wf-11)

**Notes:** The owner's answer is three words; the reading is unconfirmed by the owner, so S-00V carries it as open to correction.

**Provenance (local records):** workbench/sessions/notepads/grilling/portable-workbench-cloud-deployable-2026-09-22.json#decision-010

### PW-10

**Topic:** Where portability answers land

**Question:** Where does this land: Lexicon row now, Blueprint quality sentence sharpened, a new Spec via to-spec, and an ADR only for the skills-in-clone decision if PW-3 is a real trade-off?

**Status:** locked · answered 2026-09-22, portable-workbench-cloud-deployable decision-011 (chat 2026-09-23 02:28 UTC)

**Answer:** 'In their durable places in the workbench, wherever that may be.' The agent drew the landing map: Lexicon term and renames; Blueprint sentence; AGENTS and RUNBOOK rules; ADRs for the skills lane, note transport and claim-on-branch; manifest and templates; and a new Portable Workbench Spec owning the Tasks.

**Reason:** Owner delegated the mechanics ('seem like you questions'); locked answers go to their durable owners.

**Result:**

- create `workbench/specs/S-00V-portable-workbench/SPEC.md` - Portable Workbench Spec owning the Tasks.
- update `LEXICON.md, templates/LEXICON.md` - Defines the Portable Workbench term and records the renames.
- update `BLUEPRINT.md, AGENTS.md, RUNBOOK.md (+ templates mirrors)` - Sharpened quality sentence, note-tracking and capability rules, procedures.
- create `ADRs superseding ADR-0017, amending ADR-0046, narrowing ADR-0051/0040, recording claim-on-branch` - Each authored by the Task that makes the change.
- update `workbench/manifest.json` - lanes.skills and skillPolicy reshape.

**Related:** [PW-1](#pw-1), [PW-3](#pw-3), [PW-5](#pw-5), [PW-6](#pw-6), [TT-Q12](#tt-q12)

**Notes:** Map is agent-resolved under the owner's delegation. The whole portability set is v4 scope (owner, 2026-09-23).

**Provenance (local records):** workbench/sessions/notepads/grilling/portable-workbench-cloud-deployable-2026-09-22.json#decision-011; workbench/sessions/notepads/grilling/portable-workbench-cloud-deployable-2026-09-22.json#verification-002; workbench/sessions/notepads/grilling/portable-workbench-cloud-deployable-2026-09-22.json#verification-004

## REC - Recovered pre-notepad questions

### REC-01

**Topic:** Name the skill carry

**Question:** What should the skill be called? (This name lands in ~10 files including tests and templates, so a later rename is a real sweep.)

**Status:** locked · answered 2026-09-07 chat (question UI, 07:49Z)

**Answer:** carry (chosen from carry, escort, own, finish).

**Reason:** Not recorded beyond the choice. The recommended option's stated case: a one-word imperative matching 'carry it through', which the repo already used. S-049 classes it as an owner Preference.

**Result:**

- create `workbench/skills/carry/SKILL.md` - The skill is named carry.
- update `workbench/specs/S-049-assignment-ownership-and-coordination-record/SPEC.md (Decisions And Contracts)` - 'The name is carry. Owner decision, 2026-09-07, from four candidates.'

**Related:** [REC-02](#rec-02), [U313-2](#u313-2)

**Aliases:** unblocking-v3-1-3 recovered_prior_questions REC-01

**Notes:** Recovered from transcript; not in the 240-ID count. Only the outcome survived in the notepad context before recovery.

**Provenance (local records):** workbench/sessions/recovery/grilling-transcript-completeness-2026-09-23/recovered-questions.json#REC-01; workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#recovered_prior_questions; Claude session 7f601d2b-dccd-43a5-9c63-0cc2750325e4 lines 164-165

### REC-02

**Topic:** carry joins core bundle

**Question:** Does this ship inside the closed core bundle, or stay outside it?

**Status:** locked · answered 2026-09-07 chat (question UI, 07:49Z)

**Answer:** 17th core skill (chosen over local-only outside the bundle, or contract text in AGENTS.md).

**Reason:** Recorded rationale (S-049): the behavior is harness-level, and the coordination measurement only means something if it runs on every assignment in every room.

**Result:**

- update `workbench/manifest.json skillPolicy and workbench/tools/workbench-layout.mjs coreSkills` - carry is a required core skill; the bundle grows from sixteen to seventeen.
- update `skills README, LEXICON.md, templates/GENESIS.md and tools/test-skill-catalog.mjs` - Counts and catalog pin seventeen skills including carry.
- update `workbench/specs/S-049-assignment-ownership-and-coordination-record/SPEC.md (Decisions And Contracts)` - 'carry is a core-bundle skill, not a repo-local one.'

**Related:** [REC-01](#rec-01), [REC-03](#rec-03)

**Aliases:** unblocking-v3-1-3 recovered_prior_questions REC-02

**Notes:** Recovered from transcript; not in the 240-ID count. S-049 notes the question was asked with its cost understated, before origin/main had been checked.

**Provenance (local records):** workbench/sessions/recovery/grilling-transcript-completeness-2026-09-23/recovered-questions.json#REC-02; workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#recovered_prior_questions; Claude session 7f601d2b-dccd-43a5-9c63-0cc2750325e4 lines 164-165

### REC-03

**Topic:** Bump to v3.1.3 for carry

**Question:** origin/main already carries a v3.1.2 manifest with the sixteen-skill policy (via PR #73), so growing the bundle inside v3.1.2 redefines a version that shipped and makes main's manifest fail validation. Which version carries the seventeen-skill bundle?

**Status:** locked · answered 2026-09-07 chat (question UI, 08:10Z)

**Answer:** Bump to v3.1.3: freeze v3.1.2 at sixteen in supportedLegacy and set the room's manifest to v3.1.3.

**Reason:** Recorded rationale (S-049): keeps one bundle policy per version, as the twelve-to-sixteen growth did; accepting both sizes would lose that, and v3.1.2 at seventeen only would break main and downstream rooms.

**Result:**

- update `workbench/tools/workbench-layout.mjs supportedLegacy` - v3.1.2 frozen at the sixteen-skill policy; v3.1.3 carries the seventeen-skill policy.
- update `workbench/manifest.json` - Stamps the room v3.1.3 for this release.
- update `workbench/specs/S-049-assignment-ownership-and-coordination-record/SPEC.md (Decisions And Contracts; Dependencies And Blockers)` - Withdraws 'lands in v3.1.2'; records the v3.1.3 decision and the rejected alternatives.

**Related:** [REC-04](#rec-04), [REC-02](#rec-02), [U313-1](#u313-1)

**Aliases:** unblocking-v3-1-3 recovered_prior_questions REC-03

**Notes:** Recovered from transcript; not in the 240-ID count. Replaced an earlier agent-recorded 'lands in v3.1.2' decision based on a stale claim that v3.1.2 was unpublished. Opening v3.1.3 made the S-045 question (U313-1) live.

**Provenance (local records):** workbench/sessions/recovery/grilling-transcript-completeness-2026-09-23/recovered-questions.json#REC-03; workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#recovered_prior_questions; Claude session 7f601d2b-dccd-43a5-9c63-0cc2750325e4 lines 524-529

### REC-04

**Topic:** Downstream rooms run v3.1.2

**Question:** Is any project outside this repo currently running a v3.1.2 manifest with the sixteen-skill policy? I can't see beyond this repository, and it decides whether the compatibility argument is real or theoretical.

**Status:** locked · answered 2026-09-07 chat (question UI, 08:10Z)

**Answer:** Yes - rooms are on v3.1.2.

**Reason:** Not recorded; a factual report of room state outside the repo, which the agent could not see (S-049 classes it as an unavailable resource).

**Result:**

- update `workbench/specs/S-049-assignment-ownership-and-coordination-record/SPEC.md (Decisions And Contracts; Dependencies And Blockers)` - Records that rooms outside the repo ran v3.1.2 on 2026-09-07, so freezing v3.1.2 prevents a live break, not a theoretical one.

**Related:** [REC-03](#rec-03)

**Aliases:** unblocking-v3-1-3 recovered_prior_questions REC-04

**Notes:** Recovered from transcript; not in the 240-ID count.

**Provenance (local records):** workbench/sessions/recovery/grilling-transcript-completeness-2026-09-23/recovered-questions.json#REC-04; workbench/sessions/grilling/unblocking-v3-1-3-open-work-2026-09-07.json#recovered_prior_questions; Claude session 7f601d2b-dccd-43a5-9c63-0cc2750325e4 lines 524-529

## Destination By Artifact

Each durable artifact the answers name, with the questions whose Result lands there. Audit an artifact by reading these rows together.

- `.claude/skills`: [PW-3](#pw-3)
- `ADR-0002`: [BPR-4](#bpr-4)
- `ADR-000A`: [BPR-1](#bpr-1), [BPR-2](#bpr-2), [BPR-3](#bpr-3), [BPR-4](#bpr-4), [BPR-5](#bpr-5), [BPR-5A](#bpr-5a), [BPR-6](#bpr-6), [BPR-8F1](#bpr-8f1)
- `ADR-000B`: [FND-Q23A](#fnd-q23a), [E-1](#e-1)
- `ADR-000C`: [FND-Q22](#fnd-q22), [ACC-3](#acc-3)
- `ADR-000D`: [FND-Q20](#fnd-q20), [FND-Q21A](#fnd-q21a), [FND-Q22A](#fnd-q22a), [FND-Q23](#fnd-q23), [FND-Q24](#fnd-q24)
- `ADR-000E`: [FND-Q02](#fnd-q02), [FND-Q02A](#fnd-q02a), [FND-Q17b](#fnd-q17b), [TRACK](#track), [E-1](#e-1), [E-4](#e-4), [E-4C](#e-4c)
- `ADR-000F`: [BPR-8F](#bpr-8f), [FND-Q14](#fnd-q14), [FND-Q19](#fnd-q19)
- `ADR-000G`: [FND-Q01](#fnd-q01), [FND-Q19](#fnd-q19), [WF-1](#wf-1), [WF-6](#wf-6)
- `ADR-000H`: [FND-Q02A](#fnd-q02a), [FND-Q03](#fnd-q03), [FND-Q13](#fnd-q13), [FND-Q19](#fnd-q19), [FND-Q21C](#fnd-q21c), [RB-Q1](#rb-q1), [RB-Q1A](#rb-q1a), [RB-Q2](#rb-q2), [RB-Q2A](#rb-q2a), [RB-Q2B](#rb-q2b), [TT-Q2](#tt-q2), [TT-Q3](#tt-q3), [WF-5](#wf-5), [WF-8A](#wf-8a), [E-3](#e-3), [E-9](#e-9)
- `ADR-000I`: [BPR-6A](#bpr-6a), [FND-Q07](#fnd-q07), [FND-Q23](#fnd-q23), [WF-8D](#wf-8d), [WF-8F](#wf-8f)
- `ADR-000J`: [RB-Q4](#rb-q4)
- `ADR-000K`: [RB-Q5](#rb-q5)
- `ADR-000L (not yet created)`: [TT-Q9](#tt-q9)
- `ADR-000M`: [V3-2](#v3-2), [V3-3](#v3-3), [V3-7](#v3-7), [V3-7A](#v3-7a), [V3-7B](#v3-7b), [V3-8A](#v3-8a), [V3-9](#v3-9), [V3-9A](#v3-9a), [V3-9C](#v3-9c), [V3-10B](#v3-10b), [V3-14B](#v3-14b), [V3-15](#v3-15), [V3-15B](#v3-15b), [V3-21](#v3-21), [V3-21C](#v3-21c), [V3-22](#v3-22), [V3-22B](#v3-22b), [PW-3](#pw-3)
- `ADR-0013`: [V3-1](#v3-1), [FND-Q23A](#fnd-q23a), [E-1](#e-1)
- `ADR-0015`: [V3-5](#v3-5)
- `ADR-0017`: [PW-3](#pw-3), [PW-10](#pw-10)
- `ADR-0025`: [BPR-3](#bpr-3)
- `ADR-0026`: [V3-5](#v3-5)
- `ADR-0028`: [V3-11](#v3-11), [PW-5](#pw-5)
- `ADR-0032`: [V3-2](#v3-2), [V3-10](#v3-10), [V3-10A](#v3-10a), [V3-11A](#v3-11a), [V3-11C](#v3-11c), [V3-13B](#v3-13b)
- `ADR-0033`: [FND-Q22](#fnd-q22)
- `ADR-0034`: [WB-10](#wb-10)
- `ADR-0035`: [WB-2](#wb-2), [WB-5](#wb-5), [WB-6](#wb-6), [WB-15](#wb-15)
- `ADR-0036`: [WB-3](#wb-3), [WB-16](#wb-16)
- `ADR-0037`: [WB-4](#wb-4)
- `ADR-0038`: [WB-1](#wb-1), [WB-7](#wb-7), [WB-8](#wb-8), [WB-9](#wb-9), [WB-13](#wb-13), [WB-14](#wb-14)
- `ADR-0040`: [V3-11B](#v3-11b), [PW-5](#pw-5)
- `ADR-0041`: [E-8](#e-8)
- `ADR-0046`: [V3-3](#v3-3), [V3-7B](#v3-7b), [V3-22](#v3-22), [U313-10](#u313-10), [PW-3](#pw-3), [PW-4](#pw-4), [PW-10](#pw-10)
- `ADR-0047`: [V3-4](#v3-4)
- `ADR-0051`: [CAND-N](#cand-n), [PW-5](#pw-5), [PW-10](#pw-10)
- `ADR-0054`: [V3-11](#v3-11), [V3-11A](#v3-11a), [V3-11B](#v3-11b)
- `AGENTS.md`: [V3-6](#v3-6), [V3-10C](#v3-10c), [V3-11](#v3-11), [V3-13B](#v3-13b), [V3-20](#v3-20), [V3-23B](#v3-23b), [V3-24C](#v3-24c), [WB-2](#wb-2), [WB-3](#wb-3), [WB-4](#wb-4), [WB-5](#wb-5), [WB-6](#wb-6), [WB-10](#wb-10), [WB-12](#wb-12), [WB-14](#wb-14), [WB-15](#wb-15), [WB-16](#wb-16), [CAND-N](#cand-n), [BPR-1](#bpr-1), [BPR-2](#bpr-2), [BPR-3](#bpr-3), [BPR-4](#bpr-4), [BPR-5](#bpr-5), [BPR-6A](#bpr-6a), [BPR-7](#bpr-7), [BPR-7A](#bpr-7a), [BPR-7B](#bpr-7b), [BPR-7C](#bpr-7c), [BPR-8F](#bpr-8f), [BPR-8F1](#bpr-8f1), [BPR-R2](#bpr-r2), [FND-Q01](#fnd-q01), [FND-Q07](#fnd-q07), [FND-Q12](#fnd-q12), [FND-Q14](#fnd-q14), [FND-Q22](#fnd-q22), [RB-Q4](#rb-q4), [TT-Q3](#tt-q3), [TT-Q4](#tt-q4), [TT-Q5](#tt-q5), [TT-Q6](#tt-q6), [TT-Q7](#tt-q7), [TT-Q9](#tt-q9), [TT-Q12](#tt-q12), [WF-7](#wf-7), [WF-8](#wf-8), [WF-8B](#wf-8b), [WF-8C](#wf-8c), [WF-8D](#wf-8d), [WF-8E](#wf-8e), [WF-8F](#wf-8f), [WF-8G](#wf-8g), [E-1](#e-1), [ACC-3](#acc-3), [PW-5](#pw-5), [PW-7](#pw-7), [PW-10](#pw-10)
- `BLUEPRINT.md`: [V3-5](#v3-5), [V3-7](#v3-7), [V3-24](#v3-24), [WB-8](#wb-8), [WB-10](#wb-10), [BPR-5](#bpr-5), [BPR-7](#bpr-7), [BPR-8A](#bpr-8a), [BPR-8B](#bpr-8b), [BPR-8C](#bpr-8c), [BPR-8D](#bpr-8d), [BPR-8F](#bpr-8f), [FND-Q01](#fnd-q01), [FND-Q05](#fnd-q05), [FND-Q14](#fnd-q14), [FND-Q17e](#fnd-q17e), [WF-1](#wf-1), [WF-2](#wf-2), [WF-3](#wf-3), [WF-4](#wf-4), [WF-6](#wf-6), [WF-7](#wf-7), [WF-8](#wf-8), [WF-8E](#wf-8e), [WF-8F](#wf-8f), [WF-8G](#wf-8g), [WF-9](#wf-9), [WF-10](#wf-10), [WF-12](#wf-12), [PW-1](#pw-1), [PW-10](#pw-10)
- `CLAUDE.md`: [V3-6](#v3-6)
- `LEXICON.md`: [V3-1](#v3-1), [V3-2](#v3-2), [V3-3](#v3-3), [V3-5](#v3-5), [V3-8](#v3-8), [V3-9B](#v3-9b), [V3-10B](#v3-10b), [V3-12A](#v3-12a), [V3-13A](#v3-13a), [V3-21](#v3-21), [V3-21B](#v3-21b), [V3-22](#v3-22), [V3-22A](#v3-22a), [V3-22B](#v3-22b), [V3-22C](#v3-22c), [V3-23B](#v3-23b), [WB-2](#wb-2), [WB-3](#wb-3), [WB-12](#wb-12), [BPR-1](#bpr-1), [BPR-2](#bpr-2), [BPR-3](#bpr-3), [BPR-5](#bpr-5), [BPR-5A](#bpr-5a), [BPR-7](#bpr-7), [BPR-8B](#bpr-8b), [FND-Q01](#fnd-q01), [FND-Q02](#fnd-q02), [FND-Q02A](#fnd-q02a), [FND-Q03](#fnd-q03), [FND-Q08](#fnd-q08), [FND-Q09](#fnd-q09), [FND-Q13](#fnd-q13), [FND-Q17b](#fnd-q17b), [FND-Q17c](#fnd-q17c), [FND-Q19](#fnd-q19), [FND-Q20](#fnd-q20), [FND-Q21](#fnd-q21), [FND-Q21B](#fnd-q21b), [FND-Q21D](#fnd-q21d), [FND-Q22](#fnd-q22), [FND-Q24](#fnd-q24), [RB-Q1](#rb-q1), [RB-Q1A](#rb-q1a), [RB-Q2](#rb-q2), [RB-Q5](#rb-q5), [TT-Q1](#tt-q1), [TT-Q2](#tt-q2), [TT-Q3](#tt-q3), [TT-Q4](#tt-q4), [TT-Q6](#tt-q6), [TT-Q7](#tt-q7), [TT-Q9](#tt-q9), [TT-Q10](#tt-q10), [TT-Q12](#tt-q12), [WF-1](#wf-1), [WF-2](#wf-2), [WF-5](#wf-5), [WF-6](#wf-6), [WF-8A](#wf-8a), [WF-8F](#wf-8f), [WF-8G](#wf-8g), [E-1](#e-1), [E-3](#e-3), [E-4](#e-4), [E-9](#e-9), [ACC-3](#acc-3), [PW-1](#pw-1), [PW-2](#pw-2), [PW-3](#pw-3), [PW-5](#pw-5), [PW-10](#pw-10), [REC-02](#rec-02)
- `README.md`: [V3-4](#v3-4), [V3-12](#v3-12), [BPR-7B](#bpr-7b), [WF-8H](#wf-8h), [E-1](#e-1), [PW-3A](#pw-3a)
- `RUNBOOK.md`: [V3-4](#v3-4), [V3-8](#v3-8), [V3-9](#v3-9), [V3-9B](#v3-9b), [V3-9C](#v3-9c), [V3-10C](#v3-10c), [V3-13](#v3-13), [V3-14](#v3-14), [V3-14A](#v3-14a), [V3-15A](#v3-15a), [V3-16](#v3-16), [V3-16A](#v3-16a), [V3-16B](#v3-16b), [V3-17D](#v3-17d), [V3-22C](#v3-22c), [V3-23](#v3-23), [V3-23B](#v3-23b), [WB-1](#wb-1), [WB-2](#wb-2), [WB-6](#wb-6), [WB-7](#wb-7), [WB-13](#wb-13), [WB-14](#wb-14), [CAND-N](#cand-n), [BPR-2](#bpr-2), [BPR-6](#bpr-6), [BPR-7](#bpr-7), [BPR-7A](#bpr-7a), [BPR-7C](#bpr-7c), [BPR-8C](#bpr-8c), [BPR-8E](#bpr-8e), [BPR-8F](#bpr-8f), [BPR-8F1](#bpr-8f1), [FND-Q01](#fnd-q01), [FND-Q12](#fnd-q12), [FND-Q23A](#fnd-q23a), [RB-Q4](#rb-q4), [TT-Q4](#tt-q4), [WF-8](#wf-8), [WF-8A](#wf-8a), [WF-8C](#wf-8c), [WF-9](#wf-9), [E-5](#e-5), [PW-1](#pw-1), [PW-3](#pw-3), [PW-3A](#pw-3a), [PW-4](#pw-4), [PW-5](#pw-5), [PW-6](#pw-6), [PW-7](#pw-7), [PW-10](#pw-10)
- `Spec S-00A`: [BPR-1](#bpr-1), [BPR-5A](#bpr-5a), [BPR-7](#bpr-7), [BPR-8B](#bpr-8b), [BPR-8D](#bpr-8d), [BPR-8E](#bpr-8e), [BPR-R3](#bpr-r3)
- `Spec S-00B`: [BPR-7B](#bpr-7b), [BPR-7B1](#bpr-7b1), [BPR-7B2](#bpr-7b2), [BPR-7C](#bpr-7c)
- `Spec S-00C`: [BPR-7A](#bpr-7a), [BPR-7B2](#bpr-7b2)
- `Spec S-00D`: [BPR-7B2](#bpr-7b2)
- `Spec S-00E`: [BPR-7B2](#bpr-7b2), [BPR-7C](#bpr-7c)
- `Spec S-00F`: [FND-Q12](#fnd-q12)
- `Spec S-00G`: [FND-Q20](#fnd-q20), [FND-Q21](#fnd-q21), [FND-Q21A](#fnd-q21a), [FND-Q21B](#fnd-q21b), [FND-Q21C](#fnd-q21c), [FND-Q21D](#fnd-q21d), [FND-Q22A](#fnd-q22a), [FND-Q23](#fnd-q23), [FND-Q23A](#fnd-q23a), [FND-Q24](#fnd-q24), [TT-Q3](#tt-q3), [TT-Q12](#tt-q12), [PW-2](#pw-2)
- `Spec S-00H`: [FND-Q21C](#fnd-q21c), [TT-Q2](#tt-q2), [TT-Q10](#tt-q10), [WF-5](#wf-5), [WF-8G](#wf-8g)
- `Spec S-00I`: [FND-Q07](#fnd-q07), [FND-Q08](#fnd-q08), [WF-8D](#wf-8d), [WF-8E](#wf-8e), [WF-8F](#wf-8f), [WF-8H](#wf-8h)
- `Spec S-00J`: [FND-Q14](#fnd-q14), [FND-Q21C](#fnd-q21c), [WF-8](#wf-8), [WF-8C](#wf-8c), [WF-8E](#wf-8e)
- `Spec S-00M`: [RB-Q4](#rb-q4)
- `Spec S-00N`: [RB-Q5](#rb-q5)
- `Spec S-00O`: [WF-7](#wf-7), [WF-11](#wf-11), [WF-12](#wf-12), [TRACK](#track), [E-6](#e-6)
- `Spec S-00P`: [WF-12](#wf-12), [E-6](#e-6)
- `Spec S-00V`: [RB-Q6](#rb-q6), [PW-2](#pw-2), [PW-3](#pw-3), [PW-4](#pw-4), [PW-5](#pw-5), [PW-6](#pw-6), [PW-7](#pw-7), [PW-8](#pw-8), [PW-9](#pw-9), [PW-10](#pw-10)
- `Spec S-011`: [V3-19A](#v3-19a)
- `Spec S-014`: [V3-6](#v3-6), [V3-19](#v3-19), [V3-19B](#v3-19b), [V3-19C](#v3-19c), [V3-20A](#v3-20a), [V3-24C](#v3-24c)
- `Spec S-021`: [V3-1](#v3-1), [V3-3](#v3-3), [V3-5](#v3-5), [V3-7](#v3-7), [V3-7A](#v3-7a), [V3-8B](#v3-8b), [V3-9](#v3-9), [V3-12](#v3-12), [V3-12A](#v3-12a), [V3-12B](#v3-12b), [V3-12C](#v3-12c), [V3-13](#v3-13), [V3-13A](#v3-13a), [V3-13B](#v3-13b), [V3-13C](#v3-13c), [V3-14](#v3-14), [V3-15](#v3-15), [V3-15B](#v3-15b), [V3-16](#v3-16), [V3-16A](#v3-16a), [V3-16B](#v3-16b), [V3-17](#v3-17), [V3-17A](#v3-17a), [V3-17B](#v3-17b), [V3-17C](#v3-17c), [V3-17D](#v3-17d), [V3-18](#v3-18), [V3-18B](#v3-18b), [V3-19](#v3-19), [V3-19A](#v3-19a), [V3-19D](#v3-19d), [V3-20](#v3-20), [V3-20A](#v3-20a), [V3-20B](#v3-20b), [V3-21](#v3-21), [V3-21A](#v3-21a), [V3-21B](#v3-21b), [V3-23](#v3-23), [V3-23A](#v3-23a), [V3-24](#v3-24), [V3-24A](#v3-24a), [V3-24B](#v3-24b), [V3-24C](#v3-24c)
- `Spec S-027`: [WB-1](#wb-1), [WB-8](#wb-8), [WB-9](#wb-9), [WB-11](#wb-11), [WB-13](#wb-13)
- `Spec S-045`: [U313-0](#u313-0), [U313-1](#u313-1), [U313-1A](#u313-1a), [U313-1B](#u313-1b), [U313-2](#u313-2), [U313-2A](#u313-2a), [U313-8](#u313-8)
- `Spec S-048`: [V3-11](#v3-11), [V3-11A](#v3-11a), [V3-11B](#v3-11b)
- `Spec S-049`: [U313-7](#u313-7), [REC-01](#rec-01), [REC-02](#rec-02), [REC-03](#rec-03), [REC-04](#rec-04)
- `Spec S-050`: [U313-10](#u313-10), [BPR-7](#bpr-7), [BPR-7A](#bpr-7a), [BPR-7B1](#bpr-7b1)
- `Spec S-051`: [V3-13A](#v3-13a), [V3-13B](#v3-13b)
- `Spec S-052`: [CAND-N](#cand-n)
- `TASKBOARD.json`: [FND-Q17c](#fnd-q17c), [RB-Q2A](#rb-q2a), [TRACK](#track), [E-1](#e-1), [E-3](#e-3), [E-4](#e-4), [E-4A](#e-4a), [E-4B](#e-4b), [E-4C](#e-4c), [E-5](#e-5), [E-6](#e-6), [E-7](#e-7), [E-10](#e-10), [E-11](#e-11)
- `TASKBOARD.md`: [FND-Q02](#fnd-q02), [TT-Q10](#tt-q10)
- `templates`: [BPR-7](#bpr-7), [RB-Q4](#rb-q4)
- `tools/control-fidelity.mjs`: [FND-Q23A](#fnd-q23a)
- `tools/core-skill-installer.mjs`: [V3-9C](#v3-9c), [V3-10C](#v3-10c), [V3-15B](#v3-15b), [U313-2](#u313-2), [U313-2A](#u313-2a)
- `tools/skill-presence.mjs`: [U313-2A](#u313-2a)
- `tools/test-adr.mjs`: [BPR-6](#bpr-6)
- `tools/test-blueprint-contract.mjs`: [BPR-8A](#bpr-8a), [BPR-8E](#bpr-8e)
- `tools/test-core-skill-installer.mjs`: [V3-17A](#v3-17a), [U313-2A](#u313-2a)
- `tools/test-diagnostics.mjs`: [RB-Q5](#rb-q5)
- `tools/test-skill-catalog.mjs`: [V3-10C](#v3-10c), [V3-13](#v3-13), [V3-18B](#v3-18b), [V3-19D](#v3-19d), [REC-02](#rec-02)
- `tools/test-workbench-adoption.mjs`: [V3-17](#v3-17)
- `tools/test-workbench-dogfood.mjs`: [V3-12B](#v3-12b)
- `tools/test-workbench-layout.mjs`: [V3-17](#v3-17), [V3-17A](#v3-17a)
- `tools/test-workbench-round-trip.mjs`: [PW-5](#pw-5), [PW-9](#pw-9)
- `tools/test-workbench-upgrade.mjs`: [V3-17](#v3-17)
- `tools/workbench-adoption.mjs`: [V3-12C](#v3-12c), [V3-14](#v3-14), [V3-14A](#v3-14a), [V3-14B](#v3-14b)
- `tools/workbench-skills.mjs`: [V3-8](#v3-8), [V3-8A](#v3-8a), [V3-8B](#v3-8b), [V3-9](#v3-9), [V3-9C](#v3-9c), [V3-10C](#v3-10c), [V3-21C](#v3-21c), [V3-22A](#v3-22a), [V3-22C](#v3-22c)
- `tools/workbench-upgrade.mjs`: [V3-12C](#v3-12c), [V3-16](#v3-16), [V3-16A](#v3-16a), [V3-16B](#v3-16b)
- `workbench/docs/adr/archive`: [BPR-6A](#bpr-6a)
- `workbench/docs/adr/HISTORY.md`: [BPR-6A](#bpr-6a)
- `workbench/docs/adr/REGISTER.md`: [BPR-6A](#bpr-6a), [BPR-8C](#bpr-8c), [FND-Q23](#fnd-q23)
- `workbench/feedback/llm-workbench-decision-recovery.zip`: [U313-7](#u313-7)
- `workbench/feedback/REPORT-decision-triage-2026-09-07.md`: [U313-7](#u313-7)
- `workbench/feedback/REPORT_FORMAT.md`: [WB-7](#wb-7), [WB-11](#wb-11), [RB-Q5](#rb-q5)
- `workbench/manifest.json`: [V3-2](#v3-2), [V3-8](#v3-8), [V3-9A](#v3-9a), [V3-10](#v3-10), [V3-10A](#v3-10a), [V3-10B](#v3-10b), [V3-11C](#v3-11c), [V3-12A](#v3-12a), [V3-12B](#v3-12b), [V3-13A](#v3-13a), [V3-21B](#v3-21b), [V3-21C](#v3-21c), [V3-22A](#v3-22a), [V3-22B](#v3-22b), [V3-23B](#v3-23b), [V3-24A](#v3-24a), [FND-Q03](#fnd-q03), [RB-Q2B](#rb-q2b), [WF-8H](#wf-8h), [E-10](#e-10), [PW-3](#pw-3), [PW-10](#pw-10), [REC-02](#rec-02), [REC-03](#rec-03)
- `workbench/sessions/.gitignore`: [V3-11A](#v3-11a), [PW-5](#pw-5)
- `workbench/skills`: [V3-8B](#v3-8b), [PW-3A](#pw-3a)
- `workbench/skills/adoption`: [V3-4](#v3-4)
- `workbench/skills/builder`: [WB-3](#wb-3), [WB-11](#wb-11), [WB-12](#wb-12)
- `workbench/skills/carry`: [FND-Q03](#fnd-q03), [TT-Q4](#tt-q4), [REC-01](#rec-01)
- `workbench/skills/code-review`: [WB-4](#wb-4)
- `workbench/skills/genesis`: [V3-4](#v3-4)
- `workbench/skills/grilling`: [BPR-R1](#bpr-r1), [FND-Q13](#fnd-q13)
- `workbench/skills/handoff`: [BPR-R1](#bpr-r1), [BPR-R2](#bpr-r2), [BPR-R3](#bpr-r3), [BPR-R4](#bpr-r4)
- `workbench/skills/implement`: [WB-4](#wb-4)
- `workbench/skills/notepad`: [TT-Q9](#tt-q9)
- `workbench/skills/promote`: [FND-Q13](#fnd-q13)
- `workbench/skills/README`: [V3-7A](#v3-7a), [V3-21A](#v3-21a)
- `workbench/skills/sitrep`: [E-10](#e-10), [E-11](#e-11)
- `workbench/skills/to-spec`: [E-4B](#e-4b)
- `workbench/skills/to-tasks`: [TT-Q2](#tt-q2), [WF-5](#wf-5), [E-4B](#e-4b)
- `workbench/skills/update-harness`: [V3-4](#v3-4), [V3-16](#v3-16)
- `workbench/specs/CATALOG.md`: [BPR-8A](#bpr-8a), [FND-Q23A](#fnd-q23a)
- `workbench/tasks`: [E-9](#e-9)
- `workbench/tools/adr.mjs`: [BPR-6](#bpr-6), [BPR-6A](#bpr-6a), [FND-Q23](#fnd-q23)
- `workbench/tools/diagnostics.mjs`: [RB-Q4](#rb-q4)
- `workbench/tools/session-transport.mjs`: [CAND-N](#cand-n)
- `workbench/tools/spec-workbench.mjs`: [V3-10C](#v3-10c), [V3-23A](#v3-23a), [FND-Q02A](#fnd-q02a), [FND-Q17c](#fnd-q17c), [RB-Q1](#rb-q1), [RB-Q2A](#rb-q2a), [RB-Q4](#rb-q4), [E-4A](#e-4a), [E-5](#e-5), [E-9](#e-9), [PW-3A](#pw-3a), [PW-6](#pw-6), [PW-7](#pw-7)
- `workbench/tools/task-record.mjs`: [E-4C](#e-4c), [E-9](#e-9)
- `workbench/tools/visible-ids.mjs`: [E-8](#e-8)
- `workbench/tools/workbench-layout.mjs`: [V3-10](#v3-10), [V3-10A](#v3-10a), [V3-10C](#v3-10c), [V3-11A](#v3-11a), [V3-11C](#v3-11c), [V3-12C](#v3-12c), [V3-15](#v3-15), [V3-15A](#v3-15a), [FND-Q23A](#fnd-q23a), [RB-Q2B](#rb-q2b), [REC-02](#rec-02), [REC-03](#rec-03)
- `workbench/tools/workbench-paths.mjs`: [V3-13](#v3-13)
- `workbench/wiki`: [FND-Q07](#fnd-q07), [FND-Q08](#fnd-q08), [TT-Q3](#tt-q3), [WF-8A](#wf-8a), [PW-8](#pw-8)
- `workbench/wiki/design-concepts/README.md`: [WF-8H](#wf-8h)
- `workbench/wiki/design-concepts/task-artifact-and-lifecycle.md`: [E-9](#e-9)
- `workbench/wiki/features`: [WF-8H](#wf-8h)
- `workbench/wiki/guidebooks`: [V3-23B](#v3-23b)
- `workbench/wiki/MEMORY.md`: [TT-Q8](#tt-q8), [WF-8H](#wf-8h)
- `workbench/wiki/skill-<name>.md`: [TT-Q8](#tt-q8)
- `templates/ADOPTION.md`: [V3-4](#v3-4), [V3-14](#v3-14), [V3-14A](#v3-14a), [V3-14B](#v3-14b), [FND-Q23A](#fnd-q23a), [PW-3A](#pw-3a)
- `templates/AGENTS.md`: [V3-6](#v3-6), [V3-11](#v3-11), [V3-13B](#v3-13b), [V3-20](#v3-20), [V3-23B](#v3-23b), [V3-24C](#v3-24c), [WB-2](#wb-2), [WB-3](#wb-3), [WB-4](#wb-4), [WB-5](#wb-5), [WB-6](#wb-6), [WB-10](#wb-10), [WB-12](#wb-12), [WB-14](#wb-14), [WB-15](#wb-15), [WB-16](#wb-16), [CAND-N](#cand-n), [BPR-1](#bpr-1), [BPR-2](#bpr-2), [BPR-3](#bpr-3), [BPR-4](#bpr-4), [BPR-5](#bpr-5), [BPR-6A](#bpr-6a), [BPR-8F](#bpr-8f), [BPR-8F1](#bpr-8f1), [BPR-R2](#bpr-r2), [FND-Q01](#fnd-q01), [FND-Q07](#fnd-q07), [FND-Q14](#fnd-q14), [FND-Q22](#fnd-q22), [TT-Q3](#tt-q3), [TT-Q5](#tt-q5), [TT-Q6](#tt-q6), [TT-Q7](#tt-q7), [TT-Q9](#tt-q9), [TT-Q12](#tt-q12), [WF-7](#wf-7), [WF-8](#wf-8), [WF-8B](#wf-8b), [WF-8C](#wf-8c), [WF-8D](#wf-8d), [WF-8E](#wf-8e), [WF-8F](#wf-8f), [WF-8G](#wf-8g), [ACC-3](#acc-3), [PW-5](#pw-5), [PW-7](#pw-7)
- `templates/BLUEPRINT.md`: [V3-24](#v3-24), [WB-8](#wb-8), [WB-10](#wb-10), [BPR-5](#bpr-5), [BPR-8A](#bpr-8a), [BPR-8B](#bpr-8b), [BPR-8C](#bpr-8c), [BPR-8D](#bpr-8d), [BPR-8F](#bpr-8f), [FND-Q01](#fnd-q01), [FND-Q05](#fnd-q05), [WF-1](#wf-1), [PW-1](#pw-1)
- `templates/feedback/REPORT_FORMAT.md`: [RB-Q5](#rb-q5)
- `templates/GENESIS.md`: [V3-4](#v3-4), [V3-15](#v3-15), [V3-15A](#v3-15a), [PW-3A](#pw-3a), [REC-02](#rec-02)
- `templates/LEXICON.md`: [V3-1](#v3-1), [V3-2](#v3-2), [V3-3](#v3-3), [V3-8](#v3-8), [V3-9B](#v3-9b), [V3-10B](#v3-10b), [V3-21](#v3-21), [V3-21B](#v3-21b), [V3-22](#v3-22), [V3-22A](#v3-22a), [V3-22B](#v3-22b), [V3-22C](#v3-22c), [V3-23B](#v3-23b), [WB-12](#wb-12), [BPR-1](#bpr-1), [BPR-2](#bpr-2), [BPR-3](#bpr-3), [BPR-5](#bpr-5), [BPR-5A](#bpr-5a), [BPR-8B](#bpr-8b), [FND-Q01](#fnd-q01), [FND-Q02A](#fnd-q02a), [FND-Q03](#fnd-q03), [FND-Q08](#fnd-q08), [FND-Q09](#fnd-q09), [FND-Q17b](#fnd-q17b), [FND-Q17c](#fnd-q17c), [FND-Q19](#fnd-q19), [FND-Q21](#fnd-q21), [FND-Q21B](#fnd-q21b), [FND-Q21D](#fnd-q21d), [FND-Q22](#fnd-q22), [FND-Q24](#fnd-q24), [RB-Q1](#rb-q1), [RB-Q1A](#rb-q1a), [RB-Q2](#rb-q2), [RB-Q5](#rb-q5), [TT-Q1](#tt-q1), [TT-Q2](#tt-q2), [TT-Q3](#tt-q3), [TT-Q4](#tt-q4), [TT-Q6](#tt-q6), [TT-Q7](#tt-q7), [TT-Q9](#tt-q9), [TT-Q10](#tt-q10), [TT-Q12](#tt-q12), [WF-1](#wf-1), [WF-2](#wf-2), [WF-5](#wf-5), [WF-6](#wf-6), [WF-8A](#wf-8a), [WF-8F](#wf-8f), [WF-8G](#wf-8g), [E-3](#e-3), [E-4](#e-4), [E-9](#e-9), [ACC-3](#acc-3), [PW-1](#pw-1), [PW-10](#pw-10)
- `templates/OWNERSHIP.json`: [FND-Q23A](#fnd-q23a)
- `templates/RUNBOOK.md`: [V3-22C](#v3-22c), [V3-23](#v3-23), [V3-23B](#v3-23b), [WB-1](#wb-1), [WB-6](#wb-6), [WB-7](#wb-7), [WB-13](#wb-13), [WB-14](#wb-14), [BPR-2](#bpr-2), [BPR-6](#bpr-6), [BPR-8C](#bpr-8c), [BPR-8E](#bpr-8e), [BPR-8F](#bpr-8f), [BPR-8F1](#bpr-8f1), [FND-Q01](#fnd-q01), [WF-8](#wf-8), [WF-8A](#wf-8a), [WF-8C](#wf-8c), [WF-9](#wf-9), [E-5](#e-5)
- `templates/SPEC.md`: [WB-16](#wb-16), [E-4A](#e-4a)
- `templates/TASKBOARD.md`: [FND-Q02](#fnd-q02), [E-1](#e-1)
- `templates/wiki`: [WF-8H](#wf-8h)
- `Outside the repo or not yet created: GitHub PR #42`: [V3-19C](#v3-19c), [V3-20A](#v3-20a)
- `Outside the repo or not yet created: llm-workbench-decision-recovery.zip in the GPT_OS workbench root`: [U313-7](#u313-7)
- `Outside the repo or not yet created: new ADR: claim on the task branch with fetch-all`: [PW-6](#pw-6)
- `Outside the repo or not yet created: owner's personal installed lexicon skill`: [FND-Q09](#fnd-q09)
- `Outside the repo or not yet created: sitrep core skill`: [FND-Q21D](#fnd-q21d)
- `Outside the repo or not yet created: skills-pending/domain-modeling/SKILL.md`: [FND-Q13](#fnd-q13)
- `Outside the repo or not yet created: Spec 'Artifact model and definitions'`: [TT-Q3](#tt-q3), [TT-Q4](#tt-q4)
- `Outside the repo or not yet created: TASKBOARD render`: [PW-6](#pw-6)
- `Outside the repo or not yet created: WBID Spec`: [E-6](#e-6), [E-8](#e-8)
- `Outside the repo or not yet created: Workbench_Template repository`: [FND-Q12](#fnd-q12)

## Maintenance

Add a row only for a question the owner actually answered in a grilling session, with its source record. When a later answer replaces an earlier one, mark the earlier row `superseded` and name the replacement; never delete a row. An audit result belongs in the audit report and the owning Spec, not here.
