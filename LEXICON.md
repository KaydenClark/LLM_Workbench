# LLM Workbench - Lexicon

**Last reviewed:** 2026-09-22
**Status:** active

This is the canonical lookup table for shared Workbench language. It helps the
owner and agents recover the same meaning when a term appears across multiple
specs, skills, or conversations.

## Task Routing

The ordinary entry route is `AGENTS.md` -> `RUNBOOK.md` -> `LEXICON.md`.
Continue to the assigned `SPEC.md` resolved through `workbench/manifest.json`.
Use `BLUEPRINT.md` for architecture and cross-cutting direction; use the
manifest-declared Wiki `MEMORY.md` for task-relevant durable knowledge and the
ADR `REGISTER.md` for decision rationale. Read only the relevant linked owners.
`TASKBOARD.md` is a dashboard, not a prerequisite reading archive.

These are the Context Map's entry routes. Follow the smallest applicable route:

| Need | Route to the owner |
|---|---|
| Artifact jobs, information ownership, and where to ask a question | [Artifact Ownership Schema](#artifact-ownership-schema) |
| Accepted terminology | This Lexicon -> the relevant definition |
| Product destination | [Blueprint](BLUEPRINT.md) |
| Assigned work, evidence, and implementation | [Manifest](workbench/manifest.json) -> assigned stable spec -> its referenced source/tests |
| Complete capability inventory | [Spec catalog](workbench/specs/CATALOG.md) -> stable spec; includes completed history |
| Landmark Tracker design and delivery | [Readable model](workbench/wiki/design-concepts/landmark-tracker.md) -> [Landmark Tracker Foundation](workbench/specs/S-01T-landmark-tracker-foundation/SPEC.md); the specification distinguishes accepted design from implementation |
| Durable knowledge and design concepts | [Wiki router](workbench/wiki/MEMORY.md) -> relevant note -> its governing sources |
| Decision rationale | [ADR register](workbench/docs/adr/REGISTER.md) -> active decision -> its operational owners; [history](workbench/docs/adr/HISTORY.md) remains explicit |
| Operations and procedures | [Runbook](RUNBOOK.md) -> relevant procedure -> named tool |
| Recovery after interruption or failure | [Runbook](RUNBOOK.md) -> recovery procedure -> existing Spec, source and local working context |

The Wiki retains its single `MEMORY.md` router. This table connects existing
owners; it does not add a second Wiki index or copy their contents.

## Ownership Rules

- Add a term after the parties have agreed on its meaning, not while it is still
  being debated.
- Put project-wide definitions here. Keep capability-specific language in its
  owning spec until it becomes shared.
- Definitions explain what a term means. Requirements and decisions remain in
  `BLUEPRINT.md` or the owning `SPEC.md`.
- Surface a conflict before changing an established definition. Do not silently
  use one term for two concepts or several terms for the same concept.
- Prefer links to the owning artifact over copying its detail into this file.

## Artifact Ownership Schema

An **artifact** is an identifiable document, structured record, source file or
output used by the Workbench. A **responsibility** is the job that needs doing.
An **artifact owner** is the maintained location of a particular kind of truth;
a **maintainer** is the person or assigned agent responsible for keeping it
current. Owning information does not grant permission to change it.

The Workbench Contract spans its existing controls and the assigned Spec; it is
not another document. The following jobs are distinct even when one document
serves several. This is an ownership map, not a requirement to create one file,
agent or workflow stage per row. Paths below use the standard layout; the
manifest resolves an installed project's actual lanes and collections.

### Responsibilities And Lookup

| Job | Definition and owned content | Agent question | Maintained owner / route |
|---|---|---|---|
| **Authority** | Establish who may authorize an action and which instructions apply. | Who can authorize this? | Current user request -> [AGENTS](AGENTS.md#authority-order); the assigned Spec delegates only its bounded capability. |
| **Boundaries** | Limit the authorized action: scope, protected resources, prohibitions, approvals, privacy and external effects. | May I change or expose this? | [AGENTS](AGENTS.md); the current request and assigned Spec may narrow the task. |
| **Destination** | Describe the desired finished product, its people, purpose, experience, outcomes, qualities and non-goals. | What are we trying to build, and why? | [Blueprint](BLUEPRINT.md). |
| **Requirements** | Define the behavior, interfaces, constraints and exclusions of one capability. | What must this capability do? | Assigned stable `SPEC.md` -> Desired Behavior, Decisions And Contracts, Non-Goals. Cross-cutting qualities stay in the Blueprint. |
| **Decisions** | Preserve an accepted choice, its rationale, alternatives, consequences and supersession. | What was decided, and why this choice? | [ADR register](workbench/docs/adr/REGISTER.md) -> active architectural decision; capability-local choices stay in the owning Spec. |
| **Language** | Define shared terms, aliases and distinctions precisely. | What does this word mean here? | This Lexicon; capability-only terms remain in their Spec until shared. |
| **Knowledge** | Explain durable concepts and source-backed context that help a reader understand the project. | What do I need to understand about this? | [Wiki MEMORY](workbench/wiki/MEMORY.md) -> relevant note or Design Concept article -> governing sources. |
| **Navigation** | Connect a question to its smallest relevant information owner. | Where should I look? | This Lexicon's Context Map; Wiki MEMORY routes inside the Wiki; manifest resolves locations. |
| **Work state** | Record assignment, priority, progress, dependencies, blockers, latest event and next gate. | What is happening, who owns it, and what is next? | Owning `SPEC.md` and its Tasks; [Taskboard](TASKBOARD.md) displays their generated current view. |
| **Acceptance** | Specify the observable conditions and required proof for declaring an outcome complete. | What would count as done? | Assigned Spec -> Acceptance Criteria and Verification Procedure; AGENTS owns project-wide verification and review obligations. |
| **Evidence** | Record the candidate, method, observer or producer, result, limits and source needed to assess a claim. | What was actually checked, and what does it prove? | Spec evidence log -> named test, review, report or result artifact. Evaluation records own their observations; the Spec links the proof relevant to its acceptance. |
| **Operations** | Govern how authorized work moves through selection, execution, verification, maintenance and delivery. | What operation applies, and what are its entry and exit conditions? | [AGENTS](AGENTS.md) owns lifecycle obligations; [Runbook](RUNBOOK.md) owns the available operations and their prerequisites and expected results. |
| **Procedures** | Describe the repeatable steps, inputs, commands, failure handling and checks for a particular operation. | How do I perform this operation here? | [Runbook](RUNBOOK.md) -> named procedure and tool. A linked Wiki guidebook may hold an extended procedure without copying its governing rules. |
| **Reusable behavior** | Define a method for a recurring kind of work and the posture of a stance. | Which method or stance should I apply? | Runbook -> Behavior Selection -> resolved skill `SKILL.md`; Spec/TASK assigns the normal stance. A skill inherits scope. |
| **Execution** | Carry out the authorized operation in a concrete environment and produce an observable result. | What runs, where does it run, and what happened? | Named source/tool plus actual host configuration own the mechanism; Runbook explains invocation; Spec records the resulting work state and evidence. A procedure is not a run. |
| **Configuration** | Declare paths, identity, dependencies, installed components and host settings. | What is configured here? | [Manifest](workbench/manifest.json), relevant component configuration and ownership receipts; Runbook routes setup and inspection. |
| **Capability** | Establish which operations the configured environment can actually perform and under what limitations. | Can this environment do the requested operation? | Runbook -> named capability check -> actual host/tool and its result. A manifest declaration or installed file alone is insufficient. |
| **Evolving concept understanding** | Preserve pre-delivery understanding, its unresolved questions, changes and evidence. | What do we currently understand before a Spec, Task or Wiki article exists? | DQCs and landmark records; generated Tracker presents their relationships and documentation progress. Availability is established by the room runtime, not this definition. |
| **Working context** | Preserve unfinished reasoning, corrections, source references and unresolved questions for one objective. | What would otherwise be lost with this conversation? | Local JSON notepad in the manifest-declared collection; `notepad` skill and runtime maintain it. Settled truth moves to its durable owner. |
| **Recovery** | Restore a verified, usable state after interruption or failure and establish a safe continuation point. | What survived, and how can I resume or roll back? | Runbook -> recovery procedure -> existing controls, Spec, source, relevant notepad, and any recovery receipt or backup. Recheck live state before acting. |
| **Handoff** | Transfer the context needed for a specified recipient to continue one objective within inherited scope. | What does this receiving agent need? | Requested local Markdown handoff, authored from accessible owners and relevant notes; it does not replace them or create an assignment. |
| **Feedback** | Preserve observed failures, friction, impact, uncertainties and proposed corrections. | What went wrong, and what should be investigated? | Manifest feedback lane -> occurrence/report -> source evidence. An authorized repair and its disposition belong in the owning Spec. |
| **Evaluation** | Define comparisons and assess whether a change improves outcomes, including costs and uncertainty. | Does this harness help agents complete better work? | Runbook -> Evaluation And Benchmarking -> named evaluation definitions and result ledger; the relevant Spec owns acceptance. Structural checks do not establish agent outcomes. |
| **Provenance and history** | Preserve origins, revisions, producers, corrections and superseded claims without presenting them as current. | Where did this claim or component come from? | The owning artifact's provenance/evidence, Git history, ADR history or component receipt. Retired checkpoints remain history. |
| **Delivery and release** | Establish the verified candidate, integration containment, published version and installed consumer state separately. | Is this change delivered here, or only prepared? | AGENTS owns approval/review boundaries; Runbook owns closeout procedures; the delivery Spec owns proof linked to actual Git, release and installation records. |
| **Human orientation** | Explain what the project is, who it is for, and how a person starts using it. | How do I get started? | [README](README.md), linking operational detail to the Runbook. |

### Artifact Boundaries

The table above identifies where a question is answered. These distinctions
prevent a supporting artifact from silently taking over another job:

| Artifact | Defined job and ownership limit |
|---|---|
| **Root controls** | AGENTS governs agents; Blueprint describes destination; Lexicon defines and routes; Runbook gives operations and procedures; README orients people. TASKBOARD projects Spec state; CLAUDE adapts entry for its host. They are discoverable together, but do not carry equal instruction authority. |
| **SPEC and TASK** | The Spec is the durable capability owner. Its Tasks divide delivery into temporary slices, each bound for its own `TASK.md` once [S-00H](workbench/specs/retired/S-00H-task-artifact-and-terminology-migration/SPEC.md) migrates them out of the Spec's slice table. Neither a dashboard nor a local task list replaces their accepted state. |
| **ADR** | An active accepted decision owns architectural Canon; rationale and rejected or superseded alternatives remain distinguishable. Operational owners are named by `canonicalized_in`. |
| **Wiki article and guidebook** | An article owns an explanation; a guidebook owns a linked detailed procedure. Both cite governing sources and cannot authorize work or become a second work tracker. Wiki `SCHEMA.md` owns their structure and maintenance rules. |
| **Manifest, schema, configuration and receipt** | A manifest locates and declares; a schema defines valid record shape; configuration supplies operating values; a receipt records an operation's source and result. Valid shape or recorded installation alone proves neither correct behavior nor current runtime availability. |
| **Skill and host adapter** | A skill owns reusable behavior. An adapter, including `CLAUDE.md`, makes the shared entry or capability usable in a host. Host settings implement only their actual supported controls; they do not redefine project authority. |
| **Source, tool and test** | Source implements behavior, a tool performs an operation, and a test exercises a claim at a defined seam. Tests derive expected behavior from accepted requirements. Observed results establish only the behavior and environment exercised. |
| **Evidence record and feedback report** | Evidence records observations with provenance and limits. A feedback report assembles observations, diagnosis and proposed action while keeping them distinct. Neither accepts its own recommendation. |
| **DQCs, landmarks and Tracker** | DQCs and landmarks maintain evolving concept understanding; Tracker projects it. They add documentation/alignment coverage without replacing Specs, Tasks, source questions, the ledger or durable knowledge owners. |
| **Notepad, handoff and recovery backup** | A notepad preserves working context; a handoff communicates continuation; a backup/receipt supports restoration. They have separate formats and lifecycles. None owns durable project truth or the whole continuity promise. |
| **Projection and index** | Taskboard, Spec catalog and ADR register/history views point to their source records. Correct the source and regenerate a derived view; an index owns navigation, not the indexed claim. |
| **Template** | A template owns a reusable starting shape. The filled project artifact owns local truth. Template examples and placeholders never become project decisions by being copied. |

Continuity is the result of all these owners remaining coherent and recoverable,
not a responsibility delegated entirely to the notepad or the recovery folder.
Likewise, the Contract is the set of applicable claims, not a synonym for the
Blueprint. Ownership classifies information; authority and Governance Planes
still apply to individual claims in the current operation.

## Core Terms

| Term | Definition | Distinction |
|---|---|---|
| **Destination Question Card (DQC)** | A structured, evolving synthesis of related grilling questions about a concept, preserving understanding, unresolved matters, changes, expected results, source lineage and evidence-bearing alignment assessments. | It may exist before a landmark, Spec, Task or known Wiki destination. It is not each individual interview prompt and does not grant authority. |
| **Landmark** | An evolving account of a feature or framework pillar we are exploring or building toward, and its importance to the Workbench. | It can overlap other landmarks, precede Specs and outlive several Specs. It is not a Spec or PRD and is never itself implemented; Specs and Tasks deliver work. Further landmarks can emerge from DQCs. |
| **Landmark Tracker** | The documentation and alignment view generated from DQCs, landmark records and related source evidence, displaying relationships and distributions across documentation workflow steps. | Tracker monitors documenting; Taskboard monitors implementation. It replaces neither source records nor existing artifacts, and is not a manually assigned card stage or a source of authority. |
| **Landmark Wiki page** | A coherent, human-readable Markdown explanation of confirmed durable understanding about a landmark, without WBIDs. | Several Specs may contribute to one article. It explains knowledge while structured records preserve evolving understanding; its claims remain subject to existing ownership and authority rules. |
| **Expected result** | The intended change or knowledge to become durable once a question is answered, naming the destination when known. | Result describes achieved delivery. An unanswered question need not have an expected answer or a predetermined destination. |
| **Design concept** | The shared understanding between the parties working on a project about what that project is. | It exists between participants. `BLUEPRINT.md` helps them reconstruct it but is not itself the design concept. |
| **Traverse, don't search** | The core Workbench navigation principle: reach task-relevant context by following links from known entry points to its owners. | Bounded search repairs missing routes or investigates the selected source area; broad rediscovery is not ordinary entry. `AGENTS.md` owns the behavior. |
| **Context Map** | The navigable relationships among Workbench concepts, controls, specs, Wiki context, and referenced source/evidence, entered through this Lexicon's Task Routing. | Existing owners hold the information; any rendered map is a source-derived Projection, not another truth store or authority. No graph service or Obsidian dependency is required. |
| **Workbench** | A room: the operating harness that gives agents safe rules, progressively disclosed project truth, executable work, and proof requirements, made of one set of Contract and routing artifacts with exactly one Blueprint. A Workbench can hold many other Workbenches and many Projects, and each Project it holds has its own Workbench, so rooms nest (TT-Q3, answered by the owner 2026-09-23). | It governs the workflow; it is not the product being built. Nesting is the destination; tooling for a Workbench that holds other Workbenches is not built yet. A Workbench relates to Workbenches one-to-many and to Projects one-to-many; a Project relates to its own Workbench one-to-one. |
| **Project** | What is being done in a room: the product or body of work a Workbench exists to deliver. | Every Project has exactly one Workbench of its own. The Project is the work; the Workbench is the harness around it. |
| **Portable Workbench** | A fully packaged, deployable agent harness. Everything an agent needs to do the work is in the project's Git repository, so any agent on any machine, or several at once in the cloud, can clone it, do the authorized work, push it, and clean up after itself. Nothing the agent needs lives only on the owner's machine. | It describes the repository, not a host or a session. Host portability and the support root are things it depends on, not the thing itself. Its success criterion, in the owner's words (2026-09-22): a fresh agent finding the right answer, completing authorized work, maintaining its proper owners, cleaning up after itself, and continuing without the owner reconstructing the project. |
| **Host portability** | The property that the Workbench's plain files and tools behave the same on every configured host: case-sensitive and case-insensitive filesystems, Windows and POSIX paths, symlinked invocation. | One thing a Portable Workbench depends on, checked by the Runbook's portability and privacy matrix; it is not the Portable Workbench itself. |
| **Ownership origin model** | The model of where an ownership assignment comes from, upstream Workbench or project-local, and of how a room's deliberate differences from upstream are classified and preserved across updates. | About upgrade compatibility between upstream and a room, not about a Portable Workbench. Owned by [S-00G](workbench/specs/S-00G-ownership-map-root-control/SPEC.md); the open FND-Q24B question belongs to it. Formerly the "portability model"; that name is retired. |
| **Portable layout** | Retired name. The v3 layout that [S-021](workbench/specs/S-021-portable-workbench-v3/SPEC.md) called portable is the `workbench/` support root; see Support root. | Retired 2026-09-22 so that "portable" names only the Portable Workbench. Historical records keep the old wording. |
| **Portability model** | Retired name for the Ownership origin model. | Retired 2026-09-22 for the same reason; the FND-Q24 record keeps the old wording as history. |
| **Workbench self-drift check** | A read-only check of the canonical Workbench's own current-facing artifacts before and after a Workbench update. | It is separate from a target project's drift check; structural render, doctor, or tests alone do not establish semantic freshness. |
| **Skill** | A named, reusable behavior that makes an agent follow a predictable process for one kind of work. | A skill is an interaction or execution front door, not a new truth store. |
| **Flow** | A short sequence of skills that moves work from one recognizable state to another. | A flow composes skills; it does not duplicate their instructions. |
| **Router** | A skill that recommends the smallest appropriate skill or flow for the current situation. | It selects work behavior but does not perform the selected behavior automatically. |
| **Blueprint** | The adaptable narrative of the desired finished product: destination, people, outcomes, experience, integrated design, cross-cutting qualities, lifecycle and non-goals. A Workbench has exactly one Blueprint, and a Blueprint has many Specs and many Tasks. | It supports the design concept; it is not current status, an ADR inventory, a work queue, a glossary, or a proof archive. |
| **Lexicon** | The canonical lookup table for definitions shared across the project. | It owns meanings, not requirements, implementation decisions, or work status. |
| **Spec** | A stable capability record containing scoped intent, requirements, decisions, its implementation slices, acceptance, verification, evidence, and completion. Accepted Canon moves each slice into its own `TASK.md`, landed by [S-00H](workbench/specs/retired/S-00H-task-artifact-and-terminology-migration/SPEC.md) TK-001 and TK-002: a record-backed Spec keeps its unfinished slices under `tasks/`, and a table-backed or completed Spec keeps them in its table. | It combines the useful product and engineering roles often split between a PRD and technical spec. A Spec has many Tasks and many Chats: one per Task, plus the Chats that direct and review it. |
| **Task** | The execution slice: one bounded, executable thin vertical slice of a Spec, with its own state and blocking relationships, so independent Tasks can complete in parallel. The Spec and its assigned Task carry the normal stance. One Task is worked in one Chat (TT-Q4, answered by the owner 2026-09-23). | It is execution structure, not durable capability history. A Task spanning a few Chats is tolerated but not intended; the fix is a smaller Task, still as vertical a slice as possible. The owner's answers also allow small, localized work as a Task directly under the Blueprint with no Spec; ADR-000H and the stance rule in `AGENTS.md` still assume a parent Spec until they are amended, and no home for such a Task is built, so today every `TASK.md` lives under a Spec directory. Work expected to need more than one context unit is a Spec with Tasks, not a Task ([ADR-000H](workbench/docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md)). Accepted Canon gives a Task its own `TASK.md`, landed by [S-00H](workbench/specs/retired/S-00H-task-artifact-and-terminology-migration/SPEC.md) TK-001 and TK-002: a record-backed Spec authors its unfinished Tasks under `tasks/<id>/TASK.md`, while a Spec without a `tasks/` directory still reads its slices from the table, and completed Specs keep their tables as history. |
| **Packet** | The bounded set of material a Task loads at entry: the `TASK.md`, the Spec acceptance lines that Task satisfies, the cited source and test paths, and the Contract. A Scoped handoff and the objective's local notepad join it only when they exist. | Nothing else loads at entry; the Spec body is reached by traversal, not copied in. The optional members are working context only — neither authorizes work nor proves a claim — and both are local and untracked, so a Task must stay executable from its required members alone. |
| **Task receipt** | The Task's append-only record of its own runs, one row per run, carrying that run's branch, HEAD SHA, upstream distance, dirty file count, tests run with result, docs touched and remaining gap. | This is the Lexicon's existing `receipt` sense — an operation's source and result — applied to a Task run, not a second meaning. The row is appended as the run proceeds, not deferred to a successful close, so an interrupted run leaves a trace; an unanticipated kill can still preempt an unwritten row. `TASKBOARD.md` projects a derived signal from these rows, never the rows themselves. |
| **Chat** | One owner-visible working context in a host, in which participants have a Conversation. A Chat works at most one Task: a Chat that works a Task completes it, cleans up and ends (TT-Q1 answered by the owner 2026-09-10, TT-Q4 on 2026-09-23). | A Chat is not a Task, assignment, durable record, or authority boundary, and it never works several Tasks. Directing, review and grilling Chats work no Task. Several related Chats may belong to one Thread. |
| **Conversation** | The human-agent exchange taking place in a Chat. | It is ordinary descriptive language, not another artifact or workflow level; durable state must still reach its owning project record. |
| **Thread** | A connected series or tree of related Chats. | It groups conversational continuity only. It does not replace a Spec, Task dependency, notepad, handoff, or project work owner. |
| **Director** | The way of working a Spec as a whole: watch it as it progresses, write a handoff and open a new Chat for each Task as it becomes unblocked, and approve or route review of the Tasks that need it. Dispatcher is an accepted alias. | A Director never executes a Task itself; it watches and approves. Carrying a Spec to completion means directing it, because one Chat carries only one Task; the [`carry`](workbench/skills/carry/SKILL.md) skill does not say this yet. It is not a stance or an authority grant, and it keeps the single durable writer for shared Spec state that `AGENTS.md` names. |
| **Ticket** | Retired as a live term. `Task` names the execution slice. | Historical `TK-###` identifiers stay readable exactly as written in append-only evidence and are never rewritten; `TK` is the Task identifier prefix (TT-Q10, answered by the owner 2026-09-17), so newly allocated slices keep the `TK-###` form. The tools, root controls, skills and generic `templates/` mirror say Task since [S-00H](workbench/specs/retired/S-00H-task-artifact-and-terminology-migration/SPEC.md) TK-003 and TK-004 landed; the standalone `TASK.md` itself is landed. |
| **Coordination hand-back** | A point during an assigned run where the owner had to supply something that was not a preference, tradeoff, authorization, or unavailable resource under `AGENTS.md`'s governing gate: a settled decision repeated, evidence already in the project located for the agent, a routine technical finding reconciled, or an already-authorized step prompted. | It is a defect in a record, route, skill, or tool, recorded per occurrence with its cause and smallest correction in the assigned spec's evidence log by [`carry`](workbench/skills/carry/SKILL.md). Answering a genuine owner decision is not one, and neither is a new framework built in response to one. `AGENTS.md` Safety And Change Control owns when an owner is asked; these four reasons restate that gate and never widen it ([S-049](workbench/specs/S-049-assignment-ownership-and-coordination-record/SPEC.md)). |
| **Hot projection** | The minimal current view of active, blocked, ready, or in-progress work generated from canonical specs. | `TASKBOARD.md` is a projection, not a second tracker or proof archive. |
| **Seam** | A public boundary where behavior can be exercised and verified without depending on implementation details. | Specs agree important testing seams; tests and callers use the same boundary. |
| **Support root** | The lowercase `workbench/` directory whose manifest declares the seven support lanes and declared collections (schema 2; the v3.2 layout adds typed notepads and tracked examples, and [ADR-000M](workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md) adds the skills lane); a schema 1 five-lane manifest migrates once, and a six-lane schema 2 manifest gains the skills lane through `migrate`. | Root controls remain universally discoverable; the support root is not a second control plane. |
| **Core skill bundle** | The closed set of seventeen workflow skills and four stance skills, counted from the manifest, that every room carries in its `workbench/skills` lane. | It is not Kayden's private catalog or a generalized marketplace; the lane is the room's own discovery source, reached through the tracked `.agents/skills` and `.claude/skills` adapters. |
| **Skills lane** | The seventh manifest-declared lane, `workbench/skills`: the core skills tracked inside the room, owned and versioned by LLM Workbench, marked by a receipt naming source release, commit and a hash per skill, and replaced only by the Workbench update. | A room may add its own skills to the lane under other names; the personal catalog is a backup and publication target, never on a room's critical path. |
| **Normal setup** | Laying the skills lane and its discovery adapters down from the release during Genesis or Adoption. | It never reads the provider home and never touches a skill the room added under another name. |
| **Explicit skill update** | The Workbench update's `workbench-skills.mjs update --explicit-update`: replace only changed core skills in the lane, back the previous directories up, and record the rollback path in the receipt. | It is the only path that may replace a core skill in a room; routine setup and doctor cannot imply it. The one-time v2 route (`workbench-upgrade.mjs upgrade --explicit-update` or `--layout-only`) lays the lane down through Adoption instead. Publishing the core into a personal catalog (`core-skill-installer.mjs`) is a separate operation. |
| **Control fidelity** | How a room's hand-reconciled controls relate to the templates they derive from: every template line is `filled` only when its fixed wording survives placeholder substitution, `unchanged`, `dropped`, or `changed`, and every extra room line is `added`, as `tools/control-fidelity.mjs report` states beside the checkout and manifest versions. | It is a report, never a gate: divergence is legitimate and is restored or recorded as a decision; silent divergence is the defect ([S-034](workbench/specs/S-034-control-fidelity-report/SPEC.md)). |

### Feedback Dispositions

Every feedback finding has exactly one disposition from this closed set, recorded
in its owning Spec. The report points to that owner and the supporting evidence.

- **diagnostic** — a registered doctor code with mandatory remediation text.
- **test** — a check added at a stable testing seam.
- **repaired** — a direct code, configuration or documentation fix, named by its commit, that did not become a registered diagnostic or stable-seam test.
- **declined** — not pursued, with the reason recorded.
- **accepted-open** — real and accepted but not scheduled, naming the owning Spec; if no owner is established, report that gap explicitly.

A disposition describes the supported outcome; it neither schedules a repair
nor grants permission. A report and finding ID together identify an occurrence.


## Continuity Terms

| Term | Definition | Distinction |
|---|---|---|
| **Notepad** | A local, objective-scoped JSON working record with a compact editable current view and an append-oriented work record. Grilling records are notepads and therefore JSON. As DQCs and landmarks maintain current concept understanding, grilling notepads become more historical and handoff-like, retaining useful origins, corrections and continuation context. | It is not Canon or permanent history; preserve important material until reconciled. One objective may use several linked notes. |
| **Scoped handoff** | A separate local Markdown (`.md`) compaction authored from the relevant notepad material with plain-language, destination-specific continuation instructions. | A receiving agent can read the file or the owner can paste it into a new chat. It is requested or initiated by the owner; a pointer requires accessible, retained source data. Preservation does not grant authority. |
| **WBID** | The visible identifier comprising an artifact's type prefix and a base-62 value replacing the numeric portion. | Unique within the type and Workbench, not globally; no parallel secondary ID. Existing numeric labels and stable paths remain readable; historical numeric slice identifiers remain spec-qualified, while new letter-bearing ones reserve the whole Workbench inventory. |

## Stance Terms

| Term | Definition | Distinction |
|---|---|---|
| **Stance** | The method and obligations for performing one assigned task within already established authority. | It is neither an identity nor an authority grant; switching stance creates no handoff. |
| **Builder** | The stance that delivers a scoped, verified result and maintains its documentation. | Implementation includes relevant review and verification. |
| **Auditor** | The stance that checks claims against named evidence and reports a bounded verdict. | An audit does not authorize repairs or release. |
| **Reviewer** | The stance that challenges a candidate's correctness, impact and evidence. | At integration it runs in a separate context; it does not quietly repair the candidate. |
| **Reconciler** | The stance that reconciles achieved work with the state and owners needed for continuation. | It neither manufactures completion nor duplicates truth in a universal handoff. |
| **TASK** | The assigned Task within a stable SPEC, carrying its normal stance assignment. | Defined in Core Terms above; listed here only because the assignment is where a stance is set. |

## Governance Core

Design-concept routing: a question about what a product, subsystem, or
relationship *is* starts here, then follows the term to the owner-directed
articles in `workbench/wiki/design-concepts/`; the Blueprint and the assigned
spec still decide when a requirement or verified Actuality matters.

These definitions are shared by every Workbench. They describe roles and
boundaries; the binding behavior lives in `AGENTS.md`, cross-cutting
architecture in `BLUEPRINT.md`, and rationale in the ADR collection.

| Term | Definition | Distinction |
|---|---|---|
| **Governance Plane** | The role one claim plays in one operation: **Intent** (the request), **Canon** (the binding current-state rule), **Grounding** (evidence about intended truth or whether work was done correctly), **Enduring Context** (durable reference consulted), **Actuality** (the target being changed, including files, source, runtime, and verified state), and **Projection** (a source-derived report). | Planes classify claims and their use, never whole files, directories, or artifact types. One assigned spec carries Canon, Projection, Grounding, and Enduring Context claims at once ([ADR-000A](workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md)). |
| **Workbench Contract** | The logical set of current claims owned by the seven root controls plus the explicitly assigned spec. | It is not a file; no `CONTRACT.md` or other coequal root control exists ([ADR-0033](workbench/docs/adr/0033-workbench-contract-is-a-claim-set.md)). |
| **Instruction authority** | What an agent may do: the current owner request, then `AGENTS.md` with platform safety, then the explicitly assigned spec as a bounded capability delegate, then the procedural controls. | An assigned spec cannot enlarge the request, platform safety, or `AGENTS.md` scope; an unassigned spec is evidence ([ADR-0027](workbench/docs/adr/0027-instruction-authority-is-separate-from-state-resolution.md)). |
| **State resolution** | How a Canon claim and verified Actuality are reconciled: newer Canon is an implementation gap, newer verified Actuality is documentation drift, unclear ordering is an ambiguity to investigate. | Neither "code always wins" nor "Canon proves implementation"; the touched owner is repaired rather than a universal precedence applied. |
| **No-governance-tax rule** | Ordinary owner-directed project work requires only the Workbench Contract and its verification; no coordination system, order form, flight, or external mechanism is a prerequisite. | Available mechanisms a change genuinely needs still apply; the line is availability, not ceremony ([ADR-0023](workbench/docs/adr/0023-mechanical-guarantees-and-agent-obligations.md)). |
| **Diagnostic** | A registered finding a Workbench tool emits with a stable code, a severity of `error` or `attention`, a scope, and a blocking effect of `all`, `selection`, `selected-slice`, or `none`. | The consuming command enforces the effect; no artifact chooses whether its own finding blocks ([ADR-0029](workbench/docs/adr/0029-diagnostics-carry-registered-blocking-semantics.md)). |
| **Support lane** | One of the seven manifest-declared slots under lowercase `workbench/`: `docs`, `specs`, `wiki`, `sessions`, `feedback`, `tools`, `skills`. | A lane is a structural slot, not a plane ([ADR-000M](workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md), superseding the six-lane [ADR-0017](workbench/docs/adr/archive/0017-workbench-support-directory-has-six-lanes.md)). |
| **Collection** | A manifest-declared, machine-used directory inside a lane: `docs/adr`, `wiki/design-concepts`, `wiki/guidebooks`, `wiki/archive`, `sessions/grilling`, `sessions/handoffs`, `sessions/checkpoints`, `sessions/notepads`, `sessions/notepads/templates`, `sessions/recovery`. | Collection names are lowercase; local notepads may use nested type folders; a collection is never promoted to a lane because its contents differ in kind ([ADR-0018](workbench/docs/adr/0018-the-wiki-is-the-knowledge-base.md)). |
| **ADR** | An architecture decision record in `workbench/docs/adr/`: title, decision, considered alternatives, consequences, provenance, and frontmatter naming its operational owners. | Active accepted ADR decision claims are architectural Canon; rationale and history remain distinct; `canonicalized_in` names operational owners ([ADR-000A](workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md)). |
| **Checkpoint** | A retained historical tracked copy in `sessions/checkpoints/`; new copy creation is retired. | Preserve existing bytes and citations. New claims reconcile into their durable owners; operational recovery is separate. |
| **Operational recovery** | Local rollback receipts and backups in the ignored `sessions/recovery/` collection. | Excluded from notepad discovery and durable provenance; existing historical recovery references remain valid. |
| **Design Concept article** | An owner-authorized, encyclopedic wiki article in `wiki/design-concepts/` explaining one durable cross-cutting design model, ending with `Evidence and Sources` and carrying `History`. | It documents a design concept; it is not the Blueprint, an ADR, a procedure, or task state, and agents suggest or repair it but do not create it ([ADR-0030](workbench/docs/adr/0030-every-workbench-declares-a-design-concepts-collection.md)). |
| **Wiki profile** | The manifest's declared wiki shape: `project` (one room's memory router and collections) or `deployment` (adds owner, machine, and project pointer collections). | A profile declares routing shape; it grants no authority and copies no live task state. |
| **Managed runtime tool** | A file in `workbench/tools/` installed from the Workbench release and listed in the tools receipt with its source release, commit, and hash. | It is updated only by explicit update with backup and rollback; an application's root `tools/` is application-owned ([ADR-0031](workbench/docs/adr/0031-runtime-tools-are-workbench-managed-in-the-tools-lane.md)). |
| **Managed skill marker** | The `.workbench-skill.json` file the installer or explicit upgrade writes beside an installed core skill, recording (schema 2) the source, the release and commit it came from, and a content hash. | It identifies the generation of an installed copy; a schema 1 marker proves management but names no generation and reads as `skill-generation-unknown`, and doctor only reads it ([S-031](workbench/specs/S-031-installed-skill-generation/SPEC.md)). |
| **Declared integration branch** | The branch, named by exact case in `workbench/manifest.json` `git.integrationBranch`, into which the independent review gate merges task branches; `git.defaultBranch` names the branch it is created from. | A declaration, not a prose convention: controls resolve it from the manifest, `doctor` reports it undeclared or missing without blocking selection, and only generation, adoption, and upgrade completion fail closed on it ([ADR-0039](workbench/docs/adr/0039-the-integration-branch-is-a-manifest-declared-fact.md)). |

## Project-Specific Terms

| Term | Definition | Distinction |
|---|---|---|
| **v3.0.0** | The completed portable-layout candidate (S-021, S-015) that was never promoted to `main`. | An unreleased internal candidate; v3.1.0 is also preserved and unreleased. Later stamps, each in its owning spec: S-027 continued that baseline as v3.1.1; S-035 stamped v3.1.2; S-049 opened v3.1.3; S-046 stamped v3.1.4; S-050 stamped v3.2.0, the version `main` carries; S-00E marked v3.2.1, the current `integration` candidate that `workbench/manifest.json` declares. |
| **Foundry** | The owner's downstream coordination extension that adopts released Workbench versions and adds sockets, modules, scheduling, and monitoring. | Read-only evidence for the Workbench; never its source, copy target, tool runtime, or prerequisite ([ADR-0026](workbench/docs/adr/0026-workbench-is-the-sole-source-and-foundry-extends-it.md)). |

## Continuity And Evidence Boundaries

- **Workbench connection identity:** the stable namespace selected for optional
  private session transport, stored as `workbenchId` in the manifest.
  Clones/worktrees share it; independent initialization assigns a new
  128-bit random base-62 namespace.
  It is distinct from each visible, type-scoped artifact identifier.
- **Private session transport:** explicitly configured synchronization of selected
  live working records. Private Git retention changes recoverability, not the
  record's authority or durable project ownership.
- **Direct promotion:** deliberate selected-claim reconciliation into a named
  durable owner, with privacy/validity checks and verified destination recovery
  before scoped source cleanup. It is not merely a copy or commit.
- **Configured-host capability:** an operation exercised in the actual host and
  configuration. It does not establish machine enforcement or model reliability.
- **Core compatibility:** the explicit supported range between one selected
  installed global core release and room versions; a version difference alone
  is not proof of incompatibility.
