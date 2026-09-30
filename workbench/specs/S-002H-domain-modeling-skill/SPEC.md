# S-002H - Domain Modeling Skill for the Workbench

**Spec ID:** S-002H
**Status:** active
**Priority:** 2
**Owner:** claude-s002h
**Stance:** Builder
**Updated:** 2026-09-30
**Catalog description:** Make active domain modeling precise and usable through the Workbench's Lexicon, Spec, ADR, Wiki, and authority boundaries.
**Blockers:** none
**Latest event:** TK-003X closed with proof.
**Next gate:** Confirm acceptance criteria and completion result.

> **Citation anchors.** pre=`2780fe66754abf69b2ab6dea23337a7be0f6d801` post=`2780fe66754abf69b2ab6dea23337a7be0f6d801`.

## Outcome

An agent can actively sharpen a room's domain model during an authorized design or delivery conversation: challenge conflicting terms, distinguish overloaded concepts, probe relationships with concrete scenarios, and check claims against verified source. Settled meaning reaches the correct Workbench owner without treating a confirmed interview answer as permission to edit Canon. Consequential architectural decisions are offered as ADRs only when they clear the three-part bar. A discoverable required room skill and its Wiki article explain and exercise this behavior. Until the release owner establishes a fresh bundle identity, the skill is prepared as a staged, unreleased candidate outside discovery.

## Why It Matters

Matt Pocock's [skill](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/SKILL.md) and [guide](https://www.aihero.dev/skills-domain-modeling) make modeling an active, interrupting practice, not a glossary cleanup at the end. The Workbench's personal adaptation preserves much of that method, but the repository only preserves a pending older source and an optional mention from grilling. A new room cannot assume it can invoke the personal copy. More importantly, the personal instruction to update Lexicon inline when a term resolves can promote an interview answer without the Workbench authorization required by AGENTS and S-00W.

## Current Verified State

Checked on 2026-09-29 against integration commit 86c8fad16b362dbe9d6af3a96dce4fdfba3a77a5 and the named external sources:

- [Preserved pending source](../../../skills-pending/domain-modeling/SKILL.md) uses CONTEXT.md, CONTEXT-MAP.md, local docs/adr, and two format files. It is outside live discovery. The [core skills catalog](../../skills/README.md) marks domain-modeling as an optional reference from grilling, and separately retains the pending directory for an owner disposition. The manifest's required bundle does not include it.
- The personal installed copy, inspected read-only, already substitutes LEXICON.md and a project-local ADR route and retains challenge, scenario, source check, inline update, and the three-part ADR bar. It is not repository-owned portable source; no behavior trial or installation parity was established.
- [LEXICON.md](../../../LEXICON.md) is the accepted shared terminology owner and Context Map, not a pure upstream glossary. Capability-specific meaning stays in its Spec; durable explanation belongs in the [Wiki](../../wiki/MEMORY.md). [ADR records](../../docs/adr/REGISTER.md) carry consequential decision rationale; binding requirements live in their control or assigned Spec.
- [AGENTS.md](../../../AGENTS.md) gives the current request and selected Spec authority, distinguishes accepted Canon from verified Actuality, and requires current-facing self-drift checks. [S-00W](../S-00W-concept-grilling-and-notepad-composition/SPEC.md) explicitly says a settled term in grilling does not authorize a Canon write. [Grilling](../../skills/grilling/SKILL.md) can challenge concepts but does not require this optional skill.
- Upstream's current main skill uses GLOSSARY.md and a glossary map, inline term updates, concrete scenario probes, code cross-checking, and the three-part ADR offer. Its [ADR format](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/ADR-FORMAT.md) is intentionally minimal. The linked [guide](https://www.aihero.dev/skills-domain-modeling) reports that automatic invocation is unreliable and glossary growth is a known failure mode. These URLs were retrieved on 2026-09-29; main is mutable and implementation must repin the exact upstream revision it reviews. The repository's preserved copy uses the earlier CONTEXT naming.
- Rechecked on 2026-09-30 at integration `2780fe66754abf69b2ab6dea23337a7be0f6d801` at activation: the required bundle in `workbench/manifest.json` `skillPolicy.required` and the layout tool's `coreSkills` hold 26 skills without domain-modeling; the v3.2.1 row is frozen at 21. The catalog's referenced-skills row still reads `domain-modeling` as an optional mention from grilling. That row describes current absence; it is not the intended distribution.

## Desired Behavior

1. **Active, scoped entry.** Define when to invoke domain modeling directly or alongside grilling, wayfinding, specification, design, or delivery. Merely reading the Lexicon remains ordinary orientation. The behavior is a reference Primitive, not a stance, independent agent, or new authority. Optional composition must not become a hidden required dependency.
2. **Challenge in the conversation.** On a conflicting term, state the current accepted meaning and ask what the speaker means. On an overloaded word, propose distinct canonical concepts. Probe a relationship with a concrete edge case. Before an upstream name, boundary or relationship settles, trace its likely downstream consequences (which owners, Specs, acceptance lines, source identifiers, tests and decisions would read or break on it) so the owner chooses with the impact visible. Ask one substantive owner question at a time where grilling owns the conversation; preserve the pending readback and correction gate.
3. **Check claims, then classify.** Follow the smallest Lexicon route to relevant Canon, Wiki, ADR, Spec, source, and tests. Quote or link the exact source behind a contradiction. Distinguish a proposed design, accepted requirement, verified implementation, documentation drift, and implementation gap; do not let source silently decide intended meaning or documentation prove runtime.
4. **Route settled meaning.** Use the owning Lexicon for agreed shared terms, the assigned Spec for capability-local meaning and acceptance, the Wiki for durable explanation, and an ADR only for qualifying architectural rationale. Keep definitions concise and about what a concept is; name rejected synonyms or retired terms when useful. Keep requirements, implementation detail, scratch reasoning and task state out of terminology entries. Respect the Lexicon's routing role rather than replacing it with upstream's pure glossary format.
5. **Honor the write boundary.** An authorized documentation or delivery request may produce an inline owner edit as soon as the meaning is settled. In a read-only review or grilling-only conversation, preserve the settled answer in its working record and propose the owner route, but do not edit Canon merely because the answer is confirmed. Unresolved contradictions stay explicitly unresolved. No skill invocation, Wiki page, ADR offer, or note grants scope.
6. **Offer ADRs sparingly.** Require all three upstream tests: meaningful cost to reverse, surprising choice without context, and a real tradeoff. Use the Workbench's registered ADR owner, format, numbering and status. A new ADR records why; the binding rule is maintained in the owning control or Spec in the authorized pass. Do not write a record for routine choices, restatements, or a merely proposed answer.
7. **Ship and explain one coherent skill.** Reconcile repository source, discovery description, optional/core catalog disposition, companion calls, test coverage, attribution, and the routed [skill article](../../wiki/skill-domain-modeling.md). The article must distinguish current behavior from the target and describe workflow placement, inputs, outputs, example, limits, and upstream divergence. The owner chose required room distribution (Decisions below). Publication into the skills lane and manifest follows its established lifecycle under a fresh bundle identity; until then the staged candidate is not described as available in any room.

## Decisions And Contracts

- The 2026-09-29 planning pass's endpoint was specification and Wiki explanation. The 2026-09-30 delivery lane stages source inside this Spec only; it changes no live skill source, manifest, installed catalog, or another room.
- This Spec owns the domain-modeling skill capability alone. S-00W owns grilling composition; S-01U owns Lexicon design-concept reconciliation; S-00R owns pending optional-source disposition. Coordinate on those shared surfaces without rewriting their evidence or treating old pending source as live instruction.
- Preserve Matt Pocock's active discipline and three-part ADR filter. Adapt artifact names and authority to this Workbench. The upstream glossary file and ADR template are examples, not new Workbench roots to create.
- **Owner answer, 2026-09-29: required room skill.** Kayden said: “domain modeling is required workbench skill,” used during grilling and rework to understand downstream impacts while decisions are still upstream, including the consequences of names and relationships. The required-versus-optional question is closed; this Spec does not reopen it. Source: the owner's words as inlined in the 2026-09-30 Claude handoff from the validated local note's `domain-modeling-required` topic.
- **Staged until release identity.** The v3.2.1 bundle identity, its policy row and installed receipts are frozen. The candidate is authored at `workbench/specs/S-002H-domain-modeling-skill/candidate/domain-modeling/`, marked unreleased, and exercised only in disposable rooms. Integrating it claims no required-room installation.
- No source or structural test alone proves that an agent interrupted at the right moment or interpreted a user correctly. Fresh-context scenario proof and owner Human QA remain distinct gates.

## Non-Goals

- A new GLOSSARY.md, CONTEXT.md, glossary map, tracking store, schema, or decision board for Workbench terminology.
- Rebuilding grilling, notepad, wayfinder, codebase-design, Lexicon reconciliation, or the ADR lifecycle.
- Bulk rewriting existing Lexicon terms or historical ADRs, or inferring approval from a confirmed answer.
- Editing the personal skill catalog, external rooms, release version, or main branch. Publishing the candidate into the required bundle is the release owner's gate, not this Spec's delivery.

## Dependencies And Blockers

Distribution is settled as required (Decisions). The remaining **publication gate** is open and belongs to the release owner, currently [S-00O](../S-00O-workbench-v4-0-0-release/SPEC.md): per RUNBOOK Release Identity a changed core bundle needs a fresh version label, and the frozen v3.2.1 row stays exact. When that identity exists, publication touches these file slots, each with one writer:

- **Source:** copy the reviewed candidate into `workbench/skills/domain-modeling/`; the installer writes `.workbench-skill.json`, never a hand edit.
- **Bundle:** `workbench/tools/workbench-layout.mjs` `coreSkills` (workflow group) and `workbench/manifest.json` `skillPolicy.required`; `tools/test-workbench-layout.mjs` keeps each frozen legacy row exact.
- **Catalog and counts:** `workbench/skills/README.md` core table row and bundle sentence; its referenced-skills row moves from optional mention to joined; the count-bearing sentences `tools/test-skill-catalog.mjs` holds in `README.md`, `RUNBOOK.md`, `templates/GENESIS.md`, `LEXICON.md` Core skill bundle and `workbench/wiki/skill-genesis.md`.
- **Tests:** `tools/test-domain-modeling-candidate.mjs` retargets from the staged path to the lane path, and joins the AGENTS full suite list (a root-control slot).
- **Composition:** grilling's companion mention stays optional unless [S-00W](../S-00W-concept-grilling-and-notepad-composition/SPEC.md) changes it; the staged source does not clear its deferred TK-002V.
- **Installed discovery:** rooms receive the skill through `workbench-skills.mjs update --explicit-update` at that release; the personal catalog only through the separately authorized missing-only installer.
- **Pending source:** `skills-pending/domain-modeling/` bytes and [S-00R](../S-00R-core-skill-lifecycle-and-optional-source-disposition/SPEC.md)'s disposition row stay; attribution stays with `THIRD_PARTY_NOTICES.md`.

A fresh room discovering no domain-modeling skill stays the honest result until that registration and install proof exist.

## Vertical Implementation Slices

Cut at activation 2026-09-30 from live Actuality at `2780fe66`: [TK-003V](tasks/TK-003V/TASK.md) stages the candidate source and its scoped test; [TK-003W](tasks/TK-003W/TASK.md) observes fresh-context scenarios red against the preserved pending source and green against the candidate (after TK-003V); [TK-003X](tasks/TK-003X/TASK.md) reconciles the Wiki article and router with the candidate and the prepared distribution (after TK-003V). One writer, this lane, holds every file. Labels TK-003V to TK-003X sit past the `next-id` proposal TK-003S because the concurrent S-01X writer's remote branch already holds TK-003R and allocates serially.

| Task | Slice | Status | Blockers | Proof |
|---|---|---|---|---|

## Acceptance Criteria

- [x] A conflicting term and an overloaded term trigger an immediate, specific challenge against the owning Lexicon/Spec; a concrete edge case exposes or resolves a relationship boundary without silently inventing a definition.
- [x] Before an upstream name, boundary or relationship settles, the agent names its likely downstream consequences in the room's owners, source and tests, and the owner chooses with them visible.
- [x] A stated runtime behavior is checked against named source/tests and classified correctly as agreement, drift, gap, or unresolved contradiction; neither verified code nor the owner's proposed design is silently substituted for the other.
- [x] In a grilling-only scenario, a confirmed answer remains in the working record and no Canon/ADR write occurs. In an authorized documentation scenario, a settled shared term is updated in the Lexicon during the work; a capability-specific term stays in its Spec and readable explanation goes to the Wiki when warranted.
- [x] An easily reversed choice, an unsurprising choice, and a choice without a real alternative each fail the ADR offer bar; a qualifying choice is offered and, when authorized, recorded in the Workbench ADR owner with its binding rule in the appropriate control/Spec.
- [ ] The source and catalog state exactly which rooms can discover the skill; no required companion points at an absent skill. Preserved pending source and third-party notice remain recoverable and attributed.
- [x] The Wiki article and sole router accurately separate upstream method, Workbench adaptation, verified current state, intended behavior, and remaining limitations.
- [ ] Red/green targeted verification for any behavior/source change, Wiki validation, full AGENTS suite, self-drift pre/post and bounded semantic checks, fresh-context scenarios, and separate-context review of an immutable candidate are recorded at their proper gates.

## Testing Seams

The stable seam is a fresh agent context given the skill, room controls, and scripted user turns. Exercise: conflicting terminology during grilling, overload with two meanings, a concrete boundary case, a code-versus-statement discrepancy, authorized and unauthorized Lexicon writes, and each ADR threshold failure plus one qualifying case. Assert observed turns and file diff, not exact prose. Targeted catalog/discovery and Wiki tests check routing and distribution, but cannot prove conversational behavior. Preserve a one-command or short transcript demo at the eventual milestone.

## Verification Procedure

Before source changes, capture guardrail and Workbench self-drift baselines. For each behavior change, demonstrate the expected failure at the nearest stable seam, implement the smallest repair, rerun the targeted check, then the current full suite in AGENTS.md. Run Wiki validation, spec render and doctor, a post self-drift receipt and bounded current-facing semantic review. Record exact candidate SHA, scenario transcripts and limits. Obtain separate-context review before integration; owner Human QA alone determines its own approval state.

## Documentation Impact

This planning pass creates the [individual article](../../wiki/skill-domain-modeling.md) and routes it from the sole Wiki MEMORY. Delivery maintains that page, source and catalog/distribution routes, plus Lexicon, Runbook, controls, template mirrors or ADR register only when their meaning actually changes. Document why an owner needs no change when checked.

## Append-Only Evidence And Execution Log

| Date | Task | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-29 | planning | Compared upstream guide/source and format, preserved pending source, read-only personal copy, and live Workbench owners at 86c8fad1; authored planned Spec with no Task | Pre self-drift: machineResult blocked and cleanUpdate false from existing findings; render and doctor succeeded (doctor reported existing attention plus untracked new Spec); Wiki validation passed; test-wiki 13/13 and spec-citation-anchors 3/3 passed; no behavior trial or installed distribution verification claimed | Spec and individual Wiki article authored; sole Wiki router linked and validated | Owner distribution choice, implementation, fresh-context trials, full delivery verification, and independent review remain open |
| 2026-09-29 | planning verification | Checked clean candidate a25fc2b4026497068544fdd393fb706b50f2630e against the AGENTS full suite | All 48 commands passed. Wiki validation passed separately. Post self-drift reported the same 8 existing attention findings as pre, machineResult blocked and cleanUpdate false; bounded read-back found no new current-facing contradiction in the touched Spec, Wiki route, article or Catalog. The first sandboxed suite attempt had one EPERM while a layout test tried to write the worktree manifest; the full rerun with worktree write access passed. | Article and router remain aligned with the planned Spec; no skill source or distribution change | Independent review of the final planning candidate and all delivery gates remain open |
| 2026-09-29 | planning review correction | Separate-context review of 9a09e1d9d7b33c659763b5ad9c284f0bcef9821a found the Wiki router placed an optional/planned skill under a core-only heading; moved it to Planned And Optional Skill References | Review finding was source-backed; corrected route awaits Wiki validation, targeted checks and fresh candidate review | Wiki MEMORY now identifies the open distribution choice at the link | Final candidate review and delivery remain open |
| 2026-09-30 | activation | Required distribution recorded; Spec activated; TK-003V, TK-003W and TK-003X cut | Owner answer of 2026-09-29 (“domain modeling is required workbench skill”) as inlined in the 2026-09-30 Claude handoff; live Actuality at `2780fe66`: 26-skill bundle without domain-modeling, frozen v3.2.1 row at 21, catalog referenced-skills row optional, pending source unchanged, no S-002H lane in `git worktree list`; records written by hand and activated with `convert-tasks S-002H --activate`; self-drift pre at `2780fe66` machineResult blocked, cleanUpdate false, 7 pre-existing attention findings (1 stale-claim S-00Q, 5 stale-seed, 1 unverified-provenance); guardrail baseline `audit-guardrails --path .` 78/100 | Spec header, Outcome, Current Verified State addendum, Desired Behavior 2 and 7, Decisions, Dependencies (publication gate and file slots), slices, one new acceptance line for downstream consequences, Non-Goals; three Task records | All three Tasks, scenarios, Wiki reconciliation, full verification, separate-context review and the release owner's publication gate remain |
| 2026-09-30 | TK-003V | Task closed | Red 84575c09: node tools/test-domain-modeling-candidate.mjs exits 1, seven tests failing on the missing candidate SKILL.md (tk003v-red.txt). Green 84779a90: the same test exits 0 (9/9); mutating the candidate (dropping 'downstream', 'Make no Canon', the any-of-three ADR rule, or the no-GLOSSARY rule) turns it red each time. test-skill-catalog, test-skill-inspection, test-workbench-layout and test-wiki exit 0 at 84779a90; test-skills-lane exits 0 in a verification clone whose integration ref is origin/integration 2780fe66 (it exits 1 on render-drift in any clone of this checkout, including the untouched baseline 2780fe66, because the primary checkout's local integration is 52 commits stale); doctor no blocking finding. Upstream reviewed at mattpocock/skills d81f3a18. | workbench/specs/S-002H-domain-modeling-skill/candidate/domain-modeling/SKILL.md (new, unreleased); candidate/UNRELEASED.md (new marker); tools/test-domain-modeling-candidate.mjs (new, standalone, not yet in the AGENTS suite list, a root-control slot reserved for publication) | Scenario behavior (TK-003W), Wiki reconciliation (TK-003X), full suite, review and the release owner's publication gate |
| 2026-09-30 | TK-003W | Task closed | Six fresh-context general-purpose agents (one model), each given only a skill copy, a disposable room path and scripted owner turns, in copies of one Workbench room built with the release tools (fixture 1771b0f: AGENTS, RUNBOOK, LEXICON, S-001, accepted ADR-0001, src/loans.js, 4 passing tests); candidate SKILL.md sha256 09dca29c, pending sha256 152e2c97. GREEN (candidate): A grilling-only - cited src/loans.js:2,6-7, test/loans.test.js:12-15, ADR-0001 and S-001 to classify '3 per household' as a new rule reversing an accepted decision; named the 'account' conflict and split it into borrower-vs-payer options; traced each option's downstream reach (memberId, MAX_LOANS_PER_MEMBER, error text, tests, S-001 lines 18 and 22, ADR-0001, Loan and Hold definitions) before asking one question; pending read-back, then on confirmation said confirming does not authorize edits; room diff empty across three turns. B authorized docs - LEXICON.md shared-term change only (Household avoids 'account'), S-001 capability term, acceptance wording, open edge-case question and implementation-gap row; no code, no glossary root. C ADR filter - declined (a) reversible, (b) unsurprising, (c) no alternative, naming each failed test; offered only (d); when authorized used adr.mjs new into proposed/000A (validate ok) and, when separately authorized, placed the binding rule as two S-001 acceptance criteria. RED (pending source, same scripts): also challenged, checked code, applied the ADR filter and kept writes inside room owners; no CONTEXT.md or root docs/adr was created (the room's own controls carried routing and the write boundary). Observed differences only: red did not trace the rename's reach into identifiers, tests and Spec lines; red put the charging rule into a new Lexicon term; red at confirmation justified an ADR by an alternative the owner never stated. Transcripts, diffs and run map kept in the session scratchpad (runs/*/transcript.md, diff.patch). | Wiki article gained 'What the scenarios observed' with the upstream-naming demo and limits (committed 0fd1a3b7 with TK-003X); no fixture content committed | One run per scenario per source, one model, scripted owner and rooms, skill handed rather than discovered; the expected scenario-seam red for the write boundary and glossary roots did not occur in a Workbench room; reliability unmeasured; owner Human QA separate |
| 2026-09-30 | TK-003X | Task closed | Article and router reconciled at 0fd1a3b7 (committed before this claim, while TK-003W ran; content scoped to this Task's Required Behavior): node workbench/tools/wiki.mjs validate ok; node tools/test-wiki.mjs 14/14; doctor no blocking finding and no room-brain-unrouted; MEMORY.md Planned And Optional Skill References reaches skill-domain-modeling.md in one hop, and the article reaches the candidate SKILL.md, the Spec, the pending source and TK-003W in one hop each; every relative link in the article resolves. | workbench/wiki/skill-domain-modeling.md (status now required-but-unreleased, placement, downstream-consequence move and table row, upstream comparison rows, pinned revision, personal-copy note, 'What the scenarios observed' with demo and limits, provenance, history line); workbench/wiki/MEMORY.md single Domain Modeling hunk | The router section heading 'Planned And Optional Skill References' was left as is (the hunk rule forbids rewriting the router); publication will move the entry to the core section |

## Completion Result

Pending. Planning and Wiki creation do not establish delivered skill behavior.

## Remaining Limitations Or Follow-Up Specs

- Upstream main may move; pin its exact revision before implementation or claiming parity with a later revision.
- Current personal installation is outside repository delivery and was inspected read-only; its runtime behavior was not exercised.

## Supersession

- Supersedes: none
- Superseded by: none
