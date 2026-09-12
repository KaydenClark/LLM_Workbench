# Workbench foundation audit against the original notes

**Date:** 2026-09-10. **Endpoint:** architecture review and questions for a later grilling session; no redesign implemented.

**Main finding:** the Workbench has a much stronger contract for executing and recording an assigned engineering slice than for establishing the product worth building. Several changes have explicit, sensible reasons. The foundational drift is that those local improvements no longer add up cleanly to the original idea → exploration → prototype → destination → human alignment → integrated slices → human verification experience. The destination-style Blueprint repair exists, but its surrounding consumers and workflow have not all caught up.

**Evidence boundary.** This reviews the two supplied reconstructions, not the original handwriting or the external talks they cite. Their embedded instructions are historical evidence, not authorization. “Reason found” means an explicit rationale in the inspected project record; it does not independently authenticate every historical conversation or prove the change worked. “No reason found” means unresolved within the named sources and bounded history inspected, not proof no explanation exists anywhere.

**Snapshot:** detached `c0ac60a179235ef22fa6ea81aec74735087e06e5`, plus pre-existing local changes. The committed Blueprint already has the destination rewrite; its live diff adds the self-drift requirement. S-00F and ADR-0055 are local additions, not delivered implementation. Findings below distinguish those states. The adjacent [evidence manifest](original-foundation-audit-2026-09-10.evidence.json) records source hashes and verification. Historical citations to commits mean `git show COMMIT:PATH`; other source links mean this audited working-tree snapshot.

Question IDs are stable. Every question is **open**; recommendations are proposals for the later chat. Existing accepted decisions are identified so that chat can reconsider them consciously rather than accidentally reopening them as unanswered history.

## 1. Structure

### 1.1 The product-design path has become secondary to the execution path

The [workflow reference](../../Workbench_Original_Workflow_Reference.md), sections 1, 4, 6 and 9, starts with exploration and code prototypes to establish shared understanding, then the destination and human alignment, then tickets, implementation and human QA. It explicitly does not make every stage mandatory for every change.

The current [Runbook behavior table](../../RUNBOOK.md#behavior-selection) offers deciding, preserving, promoting, specifying, delivering, handing off and reviewing. The [Blueprint](../../BLUEPRINT.md) emphasizes continuity, authority, distribution, compatibility, verification and release. Research and prototyping have no explicit place in that main route; product acceptance by the human is much less concrete than integration review. [Genesis](../../templates/GENESIS.md) starts from a founding prompt and produces a scaffold. A scaffold that runs is useful, but it is not necessarily a prototype used to discover whether the intended product is right.

**Classification: functional gap, with partial rationale.** S-021 intentionally narrowed the portable skill bundle and removed dependence on the private catalog. That explains packaging. It does not establish that exploration and prototype feedback ceased to be part of the product promise. S-00C, S-00D and S-00E now explicitly defer project-evidence/grilling preparation, Blueprint-to-Spec derivation, and fresh-copy usefulness proof. These are honest planned gaps, not secretly completed capabilities. They also show how much of the original front-to-back journey remains outside current delivery proof.

**Q01 — What must a fresh Workbench support from an undeveloped idea, before a Spec exists?** Recommendation: explicitly own exploration, prototype feedback and destination alignment, while letting simple or already-settled changes skip them. Alternative: define Workbench as an assigned-work execution harness and name where product discovery happens. The latter materially narrows the original ambition.

### 1.2 The journey lost a clear view above individual capabilities

**Evolution found:** `plan.md`/Roadmap → Taskboard plus Blueprint sequencing → stable Specs, their dependencies, and generated Taskboard. Commit `7de5f03f659bd85c8a43e9063a646476388c4c46` moves the live queue from ROADMAP into TASKBOARD and adds Blueprint build order. [S-001](../specs/S-001-progressive-disclosure/SPEC.md) subsequently separates durable capability records from temporary slices to reduce duplicated context. [Adoption phase 3](../../templates/ADOPTION.md) still explicitly maps combined roadmap/plan documents into Blueprint direction and planned Specs.

**What survives:** [selection code](../tools/spec-workbench.mjs) checks completed-Spec and same-Spec ticket dependencies; `next` returns one eligible/resumable slice, ordered by resumption, priority and IDs. [Team templates](../../team%20templates/README.md) support bounded parallel roles with disjoint edit lanes and one durable writer. Blocking relationships and vertical slices have not disappeared.

**What is weak:** the hot board shows one current slice per hot Spec, and the complete catalog lists capability/status rows. Neither directly explains the phased product journey, alternative paths or why the next capability advances the destination. The current Blueprint intentionally excludes delivery planning. Dependency eligibility is not product prioritization. I found the storage migration rationale, but no clear current owner for an understandable cross-capability roadmap beyond reconstructing it from Specs.

**Q02 — Where should the owner see the journey from today's product to the destination, including phase rationale and independent work?** Recommendation: a derived view of existing capability dependencies and accepted sequencing, with those decisions owned once. Do not restore a second manually maintained ticket store. A plain linked explanation may suffice; a scheduler is not implied.

### 1.3 Small context and one-ticket repetition are only partly preserved

The original memory sketch says keep baked-in context small and clear sessions; its 100k annotation is not a universal limit. S-001's recorded motivation was 7,035 startup words and its reported result was 2,012 words. Today `wc -w` counts **2,905 in AGENTS plus 2,709 in the Lexicon: 5,614 words**, before relevant Runbook material, a selected Spec, source, platform instructions or skills. Those two files alone are substantial. This is a current word count, not a token measurement or a controlled comparison with the old startup experiment.

[ADR-0035](../docs/adr/0035-reduced-entry-and-assigned-autonomy.md) explains reduced entry; [ADR-0042](../docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md) explains traversal. The Runbook correctly says to read only relevant sections, not its entire 13,905 words. Nevertheless, the always-loaded contract and whole Lexicon now contain extensive operating/distribution detail and stale release narration.

`implement` retains **one ticket per invocation**. `carry` can continue through eligible slices of an assigned Spec. JSON notes support continuation, but neither saving a note nor invoking another skill clears a host conversation. I found no portable core equivalent that establishes a fresh-context `once.sh` run for every ticket and a bounded `AFK.sh` repetition contract. That does not prove every host lacks such a capability; the original script sketch also did not settle its engineering details. The archived/pending `loop-me` is about recurring life/work workflows, not a Ralph runner.

**Q03 — What should end one useful working context, and what must the next one load?** Recommendation: define a bounded continuation boundary and measure entry cost on a real ticket. Keep host mechanisms explicit. Do not adopt a universal 100k budget or promise automatic context clearing from Markdown instructions.

### 1.4 The broader operating-system sketches were deliberately kept outside core

[ADR-0015](../docs/adr/0015-workbench-base-and-foundry-capabilities.md), [ADR-0026](../docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md), and [ADR-0036](../docs/adr/0036-stances-change-method-not-authority.md) explain a portable base independent of Foundry scheduling, captains, flights and runtime visibility. Stances change method, not authority. Team templates preserve a read-only Scout role and a bounded Captain-style coordinator. They are not evidence that the original undefined Captain became exactly one current stance.

**Classification: explained scope separation.** Heartbeats, channels, daemons, alerts, continual learning, Gemma 3 and Auto skill were open sketches, not settled core requirements. Their absence is not by itself rot. The reference's Work/Dev/AI/Worldbuild/Game/Finance/Relationships legend and WBR/invoice/Excel/SOP examples also do not automatically belong in Workbench core. Conversely, the current Blueprint specifically promises a software-project harness; I did not find a disposition resolving every broader practical use in these two summaries.

**Q04 — Is the reusable Workbench only for software projects, or should the same discovery, validation and continuity model support other work products?** Recommendation: separate the generic process from domain-specific recipes and integrations. If broader domains are excluded, say where those use cases belong; do not silently treat them as either implemented or rejected.

## 2. Artifacts

### 2.1 PRD → Blueprint was a semantic change, not a clean rename

The original PRD describes the destination with user stories and implementation notes. The earliest inspected imported Blueprint, `git show 6192df4:BLUEPRINT.md`, already calls itself a factual, source-backed description of what the project **is**, with current-product contracts and status. This repository history therefore does not prove a faithful initial conversion from the notes. The notes themselves leave PRD/Blueprint/Context/Spec equivalence unresolved.

Later history is explicit:

| Step | Recorded change and reason | Assessment |
|---|---|---|
| Early Blueprint | Current product shape, contracts, architecture and source evidence | Destination and current-state inventory were already mixed at the earliest inspected import. Initial rationale remains unlocated. |
| S-001 | Compact product map and generated capability catalog; durable detail moves to Specs to reduce startup and duplication | Reason found; the destination's own expressive role became weaker. |
| S-011 | Per-feature upstream “spec/PRD” explicitly maps to stable Specs, not Blueprint; Blueprint supports design concept | A deliberate scope distinction, not evidence all PRD functions were preserved. |
| S-00A / ADR-000A | Restore adaptable destination narrative; move catalog out; make active ADR decisions architectural Canon | Implemented in the committed root/template Blueprint. A real correction, not merely a plan. |

**Remaining drift:** the current narrative is largely about how agents maintain work. It does not walk the reader through the original discovery/prototype/product-acceptance experience. Renaming headings and relocating every old claim can preserve bytes without restoring the intended product model.

**Q05 — What concrete user situations must the Blueprint explain so a fresh collaborator can reconstruct the intended Workbench?** Recommendation: test it against “I have an idea,” “we disagree about the product,” “the prototype changes our minds,” “resume one slice,” and “decide whether the delivered result is satisfactory.” Define outcomes and relationships, not another command catalog. The initial reason for replacing destination intent with factual inventory remains an explicit historical question.

### 2.2 Blueprint consumers still speak the old model

**Confirmed contradiction:** [Genesis](../../templates/GENESIS.md) tells the agent to fill `What This Project Is`, `Core promise`, `Architecture`, and `Design Decisions`. Those sections are absent from the current [Blueprint template](../../templates/BLUEPRINT.md). It also says greenfield only, then later describes an existing-codebase Genesis path. The callable Genesis skill routes existing projects to Adoption, which is the coherent current boundary.

**Confirmed authority/state contradiction:** Adoption phase 3 says to keep existing agent rules still true and **“drop what the code disproved.”** [ADR-0027](../docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md) and AGENTS expressly reject code automatically defeating accepted requirements. Observed behavior can violate a rule. It cannot alone retire that rule.

**Form-versus-meaning tension:** [the Blueprint test](../../tools/test-blueprint-contract.mjs) requires the exact eight headings in the root and generic template. S-00A and the template say headings can be adapted and irrelevant sections omitted. This test does not establish that downstream room validators prohibit all adaptation, but it does constrain these canonical examples more tightly than the prose suggests. It checks headings and lossless disposition, not comprehension of the destination or consistency of Genesis instructions.

**Q06 — Should Blueprint acceptance be defined by recoverable product meaning or by a fixed outline?** Recommendation: assess the meaning and verify every consumer uses the same ownership model. Treat the old Genesis section references and Adoption's “code disproved” instruction as concrete reconciliation defects; no evidence was found that these contradictions were intentional.

### 2.3 Disposable synthesis became durable capability history

The reference explicitly calls the per-feature `SPEC.md` disposable. Current Specs are stable, complete records are retained, and later changes get new linked Specs. **This is a real reversal, with a reason found:** [S-001 and its approved proposal](../../benchmarks/TASKBOARD_PROGRESSIVE_DISCLOSURE_PROPOSAL.md) distinguish durable capabilities from temporary execution slices, preserve proof, and avoid copying history into startup documents.

Notepads now hold temporary reasoning and synthesis; selected claims move to durable owners before cleanup. That resembles the disposable working function, but I found no record explicitly proving “the original disposable Spec was renamed Notepad.” That is a possible functional crosswalk, not established lineage.

**Remaining design tension:** a completed immutable Spec is both a historical delivery record and the advertised durable home for capability truth. Once later Specs change the capability, reconstructing its current contract may require following several records. The catalog is not itself a consolidated present-tense capability model. Stable paths and preservation are good; they do not automatically answer where the latest integrated meaning lives.

**Q07 — Was disposability intended for the working synthesis only, or for the feature specification itself?** Recommendation: retain evidence and accepted requirements, while making temporary synthesis disposable after reconciliation. This consciously preserves S-001 unless the owner decides otherwise.

**Q08 — After three Specs alter one capability, what single route gives a new agent its current contract?** Recommendation: make the current owner/successor relationship explicit without rewriting historical evidence or inventing a second backlog. Determine whether the existing successor model is sufficient before adding another artifact.

### 2.4 Context became a glossary and navigation map; relationships and ambiguity are less secure

Original `context.md` held **definitions, relationships and flagged ambiguities**. The current Lexicon provides definitions/distinctions and a Context Map to owners; Blueprint, Specs and ADRs hold different kinds of design statements. S-011 explains the separation and [ADR-0042](../docs/adr/0042-traverse-dont-search-is-core-workbench-navigation.md) explains navigation.

**Gap:** document navigation is not the same as modeling domain relationships. The example “issue tracker holds many issues” describes the product, not a link between Markdown files. There is no comparably explicit original-to-current contract for retaining unsettled relationships. Lexicon Ownership Rules say to add a term after agreement, while the supplied `lexicon` skill says the Lexicon records unsettled questions beside settled ones. The supplied `domain-modeling` skill calls it a glossary only, while the actual Lexicon also carries procedure, distribution details and release history.

The stale `v3.1.4` “current candidate” entry is concrete drift; the unresolved-term placement is an unsettled model contract. They are different problems.

**Q09 — Where do contested terms, relationships and unresolved design ambiguities live, and how does the Lexicon lead to them?** Recommendation: one stable vocabulary map linking explicit unresolved questions and relationship owners. Do not silently discard ambiguity because only agreed definitions fit the table. Decide whether relationships belong inline or behind a bounded link.

### 2.5 JSON continuity is explained; old continuity is not uniformly retrievable

[ADR-0040](../docs/adr/0040-json-notepads-preserve-objective-continuity.md) explicitly chooses JSON for structured retrieval with corrections, and rejects permanent transcript accumulation. [ADR-0054](../docs/adr/0054-direct-promotion-into-durable-owners.md) explains direct promotion and freezing old checkpoints: a tracked copy is not itself faithful reconciliation. This is well-supported evolution beyond notes that specified no storage schema. Markdown handoffs are a separate readable transfer artifact.

**Actual checks:** the current runtime successfully created, appended to and corrected this audit's note. Its inventory reports five unreadable legacy records. An explicit read of `decision-triage-second-pass-2026-09-07.json` returned `invalid-note` with missing structural fields and an unsupported schema. That proves this retrieval route cannot read that record; it does not prove contents are lost or unreconciled. The unreadable inventory is also already named in planned S-00F.

**Q10 — What compatibility obligation applies to still-needed pre-schema notes?** Recommendation: first establish which records retain unresolved context, then give those a lossless supported read/migration route. Preserve the originals. Do not require every historical note to become active runtime state, and do not claim preservation alone proves resumability.

### 2.6 The active ADR model still contains its own supersession conflict

ADR-000A says supersession replaces a **whole** record; partial supersession makes readers reconstruct fragments. Yet ADR-0054 explicitly says it **partially supersedes** ADR-0028's checkpoint-only destination. ADR-0028 remains accepted in the active register with its old title and body, followed by a reconciliation paragraph narrowing it. Current skills and runtime use direct promotion, but the active decision surface still makes the reader perform the fragment reconstruction the new rule forbids.

**Classification: confirmed semantic migration residue, no intentional exception found.** The product-corpus ADR validation passed within the live ADR test run, showing that valid metadata and register generation do not eliminate this prose contradiction.

**Q11 — Should the whole-record rule govern these older active records too, or is a clearly marked exception intended?** Recommendation: reconcile the current decision surface through an explicit successor while preserving original bodies as history. Do not reopen the already documented reason for direct promotion.

## 3. Skills

### 3.1 Full mapping of the names in the workflow notes

The following is a **source/distribution inventory**, not proof of native invocation or successful behavior. “Pending” means source exists under `skills-pending/`, outside the portable core; “archived” means preserved optional source. Personal skills visible in this session do not prove availability in a fresh installation. [Core inventory](../../skills/README.md) and [S-021](../specs/S-021-portable-workbench-v3/SPEC.md) explain the closed portable bundle; [ADR-0046](../docs/adr/0046-core-personal-shared-and-room-local-skill-ownership.md) explains independent personal/shared ownership.

| Original label/function | Current route | Disposition |
|---|---|---|
| grilling | Core `grilling` + `notepad` | Preserved, with capture and explicit exits. |
| grill-me | Optional archived wrapper; personal entry visible this session | Core behavior is grilling; wrapper is not a core prerequisite. |
| grill-with-docs | Grilling then promote/to-docs | Explicitly split in S-011 to separate interview from canonical persistence. |
| wayfind | `skills-pending/wayfinder` | Related name/source found; no shipped core exploration recipe. |
| research | `skills-pending/research` and research templates | Research support exists; not an explicit core lifecycle stage. |
| prototype | `skills-pending/prototype` | Not shipped in core; Genesis scaffold is not automatically an equivalent feedback process. |
| to-docs | Core `to-docs` | Preserved owner-directed documentation routing. |
| to-spec | Core `to-spec` | Preserved synthesis, changed to durable Spec. |
| to-tickets / prd to issues | Core `to-tickets` inside the assigned Spec | Dependencies preserved; no parallel GitHub issue store required. |
| implement | Core `implement` | Preserved one-ticket red/green execution. |
| TDD | Required in AGENTS/implement; standalone source pending | Function is core even though standalone recipe is not bundled. |
| code-review | Core `code-review` | Preserved; immutable candidate review, separate integration boundary. |
| diagnosing-bugs | Standalone source pending; investigation obligations in AGENTS/carry | Partial functional coverage; not proof the specialist method ships. |
| QA / Verify | Tests, demo requirement, review and owner publication gate | No equivalence established to original human product inspection. |
| risks | Risks/non-goals and escalation distributed across controls/Specs | No standalone core/pending/archive skill of this name found. Notes do not require one. |
| loop me | Pending `loop-me` defines recurring life/work workflows | Do not equate it with the separate Ralph/AFK sketch. |
| codebase-design | Standalone source pending | Not bundled core. |
| domain-modeling | Standalone source pending; supplied personal skill used in this audit | Method is outside the core bundle although vocabulary/ADR obligations are core. |
| design-interface | Related pending `design-an-interface` | Name correspondence plausible; not established as an exact historical rename. |
| teach | Standalone source pending | Not bundled core. |
| handoff, Claude annotation | Core `handoff`, readable Markdown | Generalized provider-independent contract; native capability remains environment-specific. |
| set-up pre-commit | Pending `setup-pre-commit` | Not bundled core. |
| wizard | Standalone source pending | Not bundled core. |
| write-great-skill | Related archived `writing-great-skills` | Authoring reference preserved; exact rename not independently established. |
| triage, GitHub annotation | No named portable core/pending/archive match | Current diagnostics and work selection are not automatically this proposed role. |
| Workbench | Harness/product plus ordinary-language entry | Not a distinct required callable skill. |
| ask Workbench | Archived `ask-workbench`; Runbook behavior selection | Dedicated help router removed from core; function partly absorbed into ordinary language. |
| dictionary / ubiq-lang | Root Lexicon; pending `ubiquitous-language` | Vocabulary artifact survives; active modeling recipe not in portable bundle. |
| adopt | Core `adoption` | Existing-project setup is explicit. |
| genesis | Core `genesis` | Greenfield setup explicit; old template conflicts remain. |
| design-concept | Blueprint/grilling/domain-modeling functions | No exact shipped core skill; sketch remains unallocated as a separate entrypoint. |
| incubate / partially legible find command | No confident current mapping | Keep unresolved; do not infer spelling or replacement. |

**Q12 — Which original functions must a brand-new installation provide, even if their old skill names disappear?** Recommendation: decide a minimum functional journey first, then its packaging. Specifically settle research, prototype feedback, active domain modeling and help routing. Keep optional specialist recipes optional; do not restore the entire personal catalog simply because a name appeared in the notes.

### 3.2 Recipes are composed, but several composition boundaries still disagree

The core now includes carry/save/promote/notepad/handoff and four stances in addition to the earlier workflow skills. ADR-0045 gives a clear reason: independently useful primitives, one behavior owner, inherited authorization and no redundant approval. That is compatible with recipes supporting the process.

Three tensions remain:

- Core `grilling` forbids canonical writes during the interview; the supplied `domain-modeling` asks for immediate Lexicon updates when a meaning is settled. Both can be useful, but simultaneous use needs an explicit ordering rule. Recording a decision and promoting it are not the same action.
- `to-tickets` says to ask approval before changing durable work state, while ADR-0045 says not to ask again when existing authorization covers the composition. The higher authority resolves this toward inherited scope, but the helper wording can still manufacture a stop.
- `carry` says no named Spec/ticket means stop; the Runbook promises ordinary language is enough to select behavior. This is defensible for a bounded delivery primitive, but fails as a universal front door unless a prior route can turn authorized ordinary-language work into the necessary assignment. Q01 owns that gap.

The word **checkpoint** is also overloaded: the core compatibility skill refers to retired session-copying, while implement still calls Git recovery commits “checkpoints.” Those Git commits are not evidence that the retired copier is still active. The vocabulary should help readers make that distinction.

**Q13 — When grilling and domain modeling run together, when may a settled answer enter Canon, and which helper owns that crossing?** Recommendation: save each answer immediately to the notepad; promote through one explicit authorized transition, without waiting for a magic phrase or repeatedly asking permission already granted. Align the optional skill with the current contract once that behavior is settled.

### 3.3 Human verification has no equally clear recipe

The original explicitly places a human checkpoint after the destination and at QA/Verify. Current `to-tickets` offers planning approval; AGENTS requires useful demos and tests; review checks the candidate; the owner controls main publication. These are meaningful controls, but **merge permission, engineering review and product satisfaction are different decisions**. The original notes do not prescribe the frequency or exact stop rule, and the current controls do not clearly derive it from those original purposes.

**Q14 — At what point must the human inspect the actual result before work proceeds, and what should they be shown?** Recommendation: product-risk-dependent checkpoints with a concrete demo, unresolved risks and a clear acceptance question. Allow routine preapproved slices to continue. Do not equate “owner owns main” with “owner validated the product experience.”

## 4. Other findings

### 4.1 Structural correctness is masking semantic inconsistency

The original operating principles ask for reusable failure prevention and source-driven maintenance. Those functions exist in diagnostics, tests, feedback and `carry`'s occurrence-level coordination record. [ADR-0044](../docs/adr/0044-evidence-for-claims-of-improved-agent-outcomes.md) correctly refuses to infer improved agent behavior from structural scores.

What this audit demonstrates is narrower and concrete: the lifecycle and Blueprint tests pass while the consumer and ADR contradictions above remain. Existing tests are useful for their boundaries, but cannot substantiate “the foundation is coherent.” Adding more words and shape assertions can improve the measured surface without restoring the original workflow.

The live self-drift requirement and planned S-00F acknowledge this exact class. **Do not report S-00F as implemented.** It is also not yet evidence that another deterministic check can settle all semantic design questions.

**Q15 — What observable failure should the redesign reduce, and how will we know it did?** Recommendation: use a small representative idea-to-demo exercise and a fresh-context continuation, recording lost intent, repeated owner explanations, wrong-owner writes and missed human acceptance. Compare with a bounded baseline. More rules, passing syntax checks or a single successful agent run are not enough for a reliability claim.

### 4.2 Current-facing residue already has identifiable owners

| Observation at this snapshot | Meaning and disposition |
|---|---|
| TASKBOARD retains blocked S-014/S-022 v3.1-era release procedures | Historical proof should remain, but their current lifecycle/successor disposition is unresolved. Already identified by S-00F; do not assume every old ticket was completed. |
| `next --json` returns `null` | No eligible slice in this snapshot. The old board rows are not currently causing automatic execution. |
| Lexicon names v3.1.4 as current candidate; manifest is v3.2.0 | Confirmed stale current-facing narration. S-00F already names it. |
| Wiki router describes Blueprint as “v3.1 direction, and the spec catalog” | Stale destination description: catalog now lives in the Specs lane. |
| Runbook Genesis validation description still requires generated Blueprint markers | Stale prose alongside the newer destination-only/render behavior. |
| Five seeded files say v3.1.4; source provenance says v3.1.0 against v3.2.0 | Doctor reports these honestly as attention. A zero exit code means no registered blocker, not no drift. |
| S-00A's live “Grilling Record Reconciliation” table still calls delivered parts planned | It labels itself the durable current disposition, unlike its explicitly anchored historical Current Verified State. This mixed time model complicates cold recovery. |
| S-050/S-052 retain actual device/private-repository proof gates | Not classified as stale merely because code is delivered. This audit did not establish those external gates were satisfied. |

There is no evidence that these contradictory current-facing descriptions were intentional design changes. They are source-reconciliation work once authorized, with historical evidence preserved. **Q16 — Which release/continuity claims should remain live obligations, and which should become explicitly historical or superseded?** Recommendation: resolve only genuinely undecided lifecycle choices with the owner; repair factual stale routes from evidence rather than asking the owner to rediscover it.

### 4.3 Unfinished sketches that must remain questions

| Original material | Assessment for the later grilling chat |
|---|---|
| Numeric governance precedence versus the conflicting prose line | ADR-0027 provides an explicit later resolution: separate permission from state comparison. No need to reenact the ambiguous numeric rule unless deliberately reconsidering that accepted decision. |
| Claim-level planes and roles crossing planes | Preserved in AGENTS/Lexicon and ADR-0001; roles and planes are distinct dimensions. |
| Six boxes: Frontline, Source of Truth, Rules/Reports, Memory/Structure, Intent, Projection | **Q17a:** Was this merely an explanatory sketch, or did it contain a structural boundary the current model lacks? No established exact crosswalk found. Recommendation: evaluate actual operations; do not force the six boxes onto six lanes. |
| Frontier, contrasted with Kanban/Taskboard | **Q17b:** Was Frontier only a proposed name or a different planning experience? No final replacement contract found. Keep distinct from Frontline. |
| Master Objective / durable state | Current assignment owners and notepad objectives carry continuity; no proved one-to-one schema lineage. **Q17c:** Does one objective span multiple capabilities without the owner rebuilding its state? Recommendation: decide the required experience before adding another objective store. |
| Spec managers, Captain, “what do I not realize?” | Current ownership, next/show and investigation rules cover parts. No permanent Spec Manager or complete Captain identity was established in the summary. **Q17d:** Is any missing behavior left after Q02/Q03, or were these merely possible implementations? |
| once.sh / AFK.sh / prompt.md / promise? / TUI? | No complete original runner/interface contract. Q03 owns the repetition/context decision. **Q17e:** Is a portable unattended runner actually required, or should core describe a bounded host capability? |
| Heartbeat/channels/daemon/alerts/Gemma 3/Auto skill | Explained outside portable core; if still desired, Q04 decides scope before any component is revived. No model, schedule or auto-learning policy inferred. |
| WBRs, invoices, Excel, coaching logs, SOPs, playtesting, external inputs | Practical use cases, not implemented integrations. Q04 must decide scope and representative proof. No access or automation was exercised. |
| Safe list / “give GPT permission to get its own data” | Current read/edit scopes and authority boundaries are a partial functional answer. **Q17f:** Are there recurring approved data-retrieval/maintenance actions the present contract cannot express? Do not infer blanket permissions from these notes. |
| “Add instructions at end,” fetch lint?, triage, design-concept, incubate/find, README change, “What do you own?” | **Q17g:** Which still expresses a needed behavior after the scope/workflow questions above? The notes are incomplete; no exact current replacement is established. Do not convert tentative names into mandatory artifacts. |

### 4.4 Coverage and verification

**Coverage:** all substantive sections 1–12 of the workflow reference and 1–14 of the operating-principles reference were compared, including their unfinished sketches. Their synthesis and attribution/verification sections were read as boundaries, not independent requirements. The skill table preserves every recorded group/name and the later proposed commands. This is not a fresh audit of all 181 earlier research records, all historical transcripts, downstream projects or external online sources.

**Checks performed:** source and bounded Git-history inspection; current dirty-state and source identity inspection; word counts; current core/pending/archive inventory; `doctor`; `next --json`; Blueprint contract test; Spec lifecycle test; ADR test attempt; core-composition test attempt; notepad test attempt; direct audit-note create/append/correction/read/validation.

- **Passed:** Blueprint shape/lossless-disposition test; Spec lifecycle test; doctor with six attention findings; direct working-note operations.
- **Environment/setup-limited:** ADR fixtures, core-composition fixture and notepad fixtures refuse the pre-existing dirty templates/skills with `invalid-source-identity`. ADR's product-corpus test passes. These are not demonstrated defects in the intended runtime behaviors. I did not commit someone else's changes or weaken provenance checks to make tests green.
- **Not claimed:** full-suite success, fresh independent semantic review, native multi-host reliability, actual private transport, downstream readiness or resolution of the grilling questions.

**Changes made:** this report, its evidence manifest and the local JSON audit note. Existing controls, code, Specs, ADRs and unrelated dirty work were preserved. The report is local review output, not an accepted redesign, a new implementation assignment, or a published result.

**Grilling use:** start with Q01 and Q04 (product boundary), then Q05/Q02/Q14 (destination, journey, human acceptance), then Q03/Q07–Q13 (records and recipes), and finally Q15–Q17 (proof, lifecycle and residual sketches). Read the rationale already found before asking. Record answers and corrections in JSON; do not mark these recommendations accepted without the owner settling them.
