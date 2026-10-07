# [PROJECT_NAME]

> Generated from LLM Workbench v[HARNESS_VERSION].

[ONE-SENTENCE DESCRIPTION OF WHAT THIS PROJECT DOES AND FOR WHOM.] This glossary is the canonical vocabulary for terms whose meaning is shared across the project; read it when a request, spec, test, or skill uses project language that could be ambiguous.

## Language

### Destination and direction

**Destination Question Card (DQC)**:
A structured, evolving synthesis of related grilling questions about a concept, preserving understanding, unresolved matters, changes, expected results, source lineage and evidence-bearing alignment assessments.

**Landmark**:
A direction toward the destination at the largest scale below the Blueprint: a `LANDMARK.md` artifact, PRD-shaped like a Spec but much bigger, saying where the work goes and what success looks like.

**Landmark Tracker**:
The documentation and alignment view generated from DQCs, landmark records and related source evidence, displaying relationships and distributions across documentation workflow steps.

**Landmark Wiki page**:
The landmark's evolving synthesis page: a coherent, human-readable Markdown summary of what its question cards add up to, updated whenever a card changes.

**Expected result**:
The intended change or knowledge to become durable once a question is answered, naming the destination when known.

**Design concept**:
The shared understanding between the parties working on a project about what that project is.

**Traverse, don't search**:
The core Workbench navigation principle: reach task-relevant context by following links from known entry points to its owners.

**Map**:
The direction to a destination, at two scales: a landmark and a Spec are each a map, and Tasks are the steps taken on it; a low-resolution view around a destination shows decisions so far, Fog and out-of-scope work. As a workflow verb, Map is writing the direction to a destination: landmarks, Specs and decision records.

**Decisions so far**:
The Map's concise index of conclusions, linked to their current owners and evidence.

**Fog**:
Anticipated work toward a destination that cannot yet be stated as a precise decision question.

**Frontier**:
The open, unblocked and unclaimed Tasks at the edge of the current Map.

### Workflow verbs

**Align**:
The inquiry, usually grilling, in which an idea becomes a design concept the owner and the agents share.

**Workflow**:
Workflows are composed from workflow verbs, and the verb set stays open. The delivery workflow reads Idea, Align, Confirm, Map, Plan, Journey, Review, Verify, Approve, Delivered, Clean Up.

**Workflow verb**:
A defined action or process that workflows are built from and that people use in ordinary language; each verb has its own glossary entry.

**Idea**:
The owner's starting thought, recorded as given, before any alignment.

**Confirm**:
The owner's agreement to a readback that names the concept, its direction, cost, reason and what will be created. It authorizes the agents to carry the concept to its endpoint.

**Prototype**:
Building a rough version to answer a question words cannot. Optional; it needs no map and lands nothing in enduring context.

**Plan**:
The slicing of Map into bounded, executable, planned units of work with provable outcomes and results.

**Implement**:
Changing the source of truth, or what the project is working on.

**Check**:
The deterministic verifications the building agent runs in the environment on its own Task: tests, builds, lints and diagnostics.

**QA**:
The building agent's self-judgement of its own Task: whether the work actually does what the Task asked, beyond what Check can prove.

**Submit**:
Handing a Task back through its merge request into its parent branch, carrying its merge answers: can this merge into the branch it targets, and did it complete the Task or is a new one needed.

**Review**:
The judgement, after the Journey is over, of a completed destination against its Map by an agent that did not build it. It decides whether another Journey is needed.

**Verify**:
Confirming the work once it has merged to integration and passed Review.

**Journey**:
Journey is Implement, Check, QA and Submit. Map and Plan come before it; Review comes after it and decides whether another Journey is needed.

**Approve**:
The owner's Human QA judgment that the delivered result is viable; the alternative is sending it back.

**Delivered**:
The verb is Delivered, not Complete: the owner's approved work is on main and the concept is delivered.

**Clean Up**:
Clearing away the scaffolding once its knowledge is kept.

### Workbench, room and artifacts

**Context Map**:
The navigable relationships among Workbench concepts, root files, specs, Wiki context, and referenced source/evidence, entered through the routes in `ARCHITECTURE.md`.

**Workbench**:
An agentic management system for a project: the safe rules, progressively disclosed project truth, executable work and proof requirements that agents running in a harness such as Claude Code or Codex load, so they can align the owner's ideas and implement the owner's design concepts.

**Project**:
The product or body of work a Workbench exists to deliver.

**Owner**:
The person whose ideas the project realizes: the one who aligns, confirms, approves and unblocks, approves delivered work, and alone promotes it to main.

**Room**:
A project, seen as the place its work happens. The workbench is the table set in it; agents take what they need from the table and work on the project in the center.

**Scaffolding**:
The architecture artifacts used to reach a destination (Specs, Tasks, landmarks, handoffs and notepads), cleared away once their knowledge is kept.

**Contract artifact**:
An artifact the agent loads, and pays tokens for, on every turn of every session: today AGENTS.md, with the host adapter that loads it. It holds only lines that apply everywhere.

**Routing artifact**:
A durable artifact an agent reaches by pointer when its work needs it, and that routes to the detail: the Blueprint, `ARCHITECTURE.md`, the Runbook and the README.

**Architecture artifact**:
An artifact built to reach a destination and cleared away once its knowledge is kept: landmarks, Specs, Tasks, handoffs and notepads. Also called scaffolding, or transient.

**Control**:
A one-action tool. Agents work the workbench through controls, each one action, and open the underlying record only to verify a claim, audit, debug a control, or when a control is missing or disagrees with its record.
_Avoid_: root controls

**Portable Workbench**:
A fully packaged, deployable agentic management system. Everything an agent needs to do the work is in the project's Git repository, so any agent on any machine, or several at once in the cloud, can clone it, do the authorized work, push it, and clean up after itself.

**Host portability**:
The property that the Workbench's plain files and tools behave the same on every configured host: case-sensitive and case-insensitive filesystems, Windows and POSIX paths, symlinked invocation.

**Ownership origin model**:
The model of where an ownership assignment comes from, upstream Workbench or project-local, and of how a room's deliberate differences from upstream are classified and preserved across updates.

**Workbench self-drift check**:
A read-only check of the canonical Workbench's own current-facing artifacts before and after a Workbench update.

**Blueprint**:
A high-level summary of the direction we want to head and the choices that got us this far, written as the four-part short page (what it is, who it serves, promised outcomes, non-goals) for every room.

### Specs and Tasks

**Spec**:
A PRD-shaped scoped objective with its own destination, derived from Blueprint needs, active ADRs, verified Actuality and required evidence. It owns requirements, decisions, acceptance, verification, evidence and completion while needed for delivery.

**Task**:
One bounded executable thin vertical slice that reaches or repairs a destination, with its own state, proof, blockers and assigned stance in TASK.md. Its Worker self-checks and hands back.
_Avoid_: ticket

**Packet**:
The bounded Task entry material: TASK.md, the active Spec acceptance lines it satisfies, cited source/test paths and the Contract. A Scoped handoff and objective notepad join only when they exist.

**Assembled-Spec review**:
Destination-level verification of the complete Task results: the Dispatcher owns whole-Spec QA and a separate Director reviews the immutable assembled candidate before integration.

**Human QA**:
The owner-led evaluation of delivered work, whose timing the owner chooses at useful milestones, accumulated work, valued Specs or escalations; failed findings remain visible until resolved.

**Retired**:
A transient staging location for reconciled Spec and Task scaffolding, removed from ordinary pickup while needed history remains reachable.

**Archive**:
Permanent storage for superseded and deprecated decision records (ADRs and DDRs), preserving their original bodies and reachable decision history.

### Chats and roles

**Chat**:
One owner-visible working context in a host, in which participants have a Conversation. A Chat works at most one Task: a Chat that works a Task completes it, cleans up and ends.

**Conversation**:
The human-agent exchange taking place in a Chat.

**Thread**:
A connected series or tree of related Chats.

**Role**:
The assigned scope of responsibility and action for an agent.

**Director**:
The role scoped to the whole project and its integration branch: it coordinates Spec-bound Dispatchers and cross-Spec work.

**Dispatcher**:
The role scoped to one assigned Spec and its branch, coordinating parallel Task work and owning assembled-Spec verification.

**Worker**:
The role scoped to one assigned Task and one attempt, producing a self-checked result and hand-back to its Dispatcher.

**Coordination hand-back**:
A point during an assigned run where the owner had to supply something that was not a preference, tradeoff, authorization, or unavailable resource under `AGENTS.md`'s governing gate: a settled decision repeated, evidence already in the project located for the agent, a routine technical finding reconciled, or an already-authorized step prompted.

### Feedback disposition

**Feedback disposition**:
The one outcome, from a closed set, that every feedback finding has recorded in its owning Spec.

**`diagnostic`**:
The finding became a registered doctor code with mandatory remediation text.

**`test`**:
The finding became a check added at a stable testing seam.

**`repaired`**:
The finding got a direct code, configuration or documentation fix, named by its commit, that did not become a registered diagnostic or stable-seam test.

**`declined`**:
The finding was not pursued, with the reason recorded.

**`accepted-open`**:
The finding is real and accepted but not scheduled, naming the owning Spec; if no owner is established, report that gap explicitly.

### Workbench meanings of AI coding terms

**Automated review**:
An agent other than the one that did the work forming a judgement on it. It is a judgement, so it can miss what a check would not.

**Grilling**:
Building a design concept through an interview that settles one decision at a time, each with a recommended answer.

### Continuity terms

**Notepad**:
A local, objective-scoped JSON working record with a compact editable current view and an append-oriented work record. Grilling records are notepads and therefore JSON.

**Scoped handoff**:
A separate local Markdown (`.md`) brief with a specified recipient purpose, job and endpoint, compressed context and instructions for reaching the relevant objective notepad and sources: the readable map to the high-fidelity context, so the recipient does not redo work.

**WBID**:
The visible identifier comprising an artifact's type prefix and a value replacing the numeric portion.

### Stance terms

**Stance**:
The job, method and obligations applied within an assigned role scope.

**Spec Planner**:
The stance that plans small Tasks and parallel vertical slices for one Spec at flight launch.

**Spec Manager**:
The stance that dispatches and monitors execution of planned Task groups within one Spec.

**Builder**:
The stance that delivers a scoped, verified result and maintains its documentation.

**Auditor**:
The stance that checks claims against named evidence and reports a bounded verdict.

**Reviewer**:
The stance that challenges a candidate's correctness, impact and evidence.

**Reconciler**:
The stance that reconciles achieved work with the state and owners needed for continuation.

### Governance core

These terms are shared by every Workbench.

**Governance Plane**:
The role one claim plays in one operation: **Intent** (the request), **Canon** (the binding current-state rule), **Grounding** (evidence about intended truth or whether work was done correctly), **Enduring Context** (durable reference consulted), **Actuality** (the target being changed, including files, source, runtime, and verified state), and **Projection** (a source-derived report).

**Workbench Contract**:
The binding claim set `AGENTS.md` Instruction Authority names: `AGENTS.md` itself, the explicitly assigned Spec's bounded capability requirements and, while an operation is performed, the binding requirements of the lane skill the Contract points to for it.

**Instruction authority**:
What an agent may do: the current owner request, then `AGENTS.md` with platform safety, then the explicitly assigned spec as a bounded capability delegate, then the other Contract carriers.

**State resolution**:
How a Canon claim and verified Actuality are reconciled: newer Canon is an implementation gap, newer verified Actuality is documentation drift, unclear ordering is an ambiguity to investigate.

**No-governance-tax rule**:
Ordinary owner-directed project work requires only the Workbench Contract and its verification; no coordination system, order form, flight, or external mechanism is a prerequisite.

**Diagnostic**:
A registered finding a Workbench tool emits with a stable code, a severity of `error` or `attention`, a scope, and a blocking effect of `all`, `selection`, `selected-slice`, or `none`.

**Support lane**:
One of the seven manifest-declared slots under lowercase `workbench/`: `docs`, `specs`, `wiki`, `sessions`, `feedback`, `tools`, `skills`.

**Skills lane**:
The `workbench/skills` lane: the core skills tracked inside this room, marked by a receipt naming their source release, commit and hash, and replaced only by the Workbench update. The tracked `.agents/skills` and `.claude/skills` links resolve into it.

**Collection**:
A manifest-declared, machine-used directory inside a lane, such as `docs/adr`, `wiki/design-concepts` or `sessions/notepads`.

**ADR**:
An architecture decision record in `workbench/docs/adr/`: title, decision, considered alternatives, consequences, provenance, and frontmatter naming its operational owners.

**Decision Record**:
A record of one consequential decision and why it was made: an ADR for an architectural choice and a DDR for a destination choice.

**DDR**:
A Destination Decision Record in `workbench/docs/ddr/`: one consequential choice about what the finished product must be or do, and why it was chosen over the alternatives, with the frontmatter keys `date`, `supersedes` and `canonicalized_in` and a free-prose body.

**Read words**:
The five kinds of read every record is to answer, defined once: **list** (the records that exist), **show** (one whole record; `get` is an accepted synonym), **search** (records found by a query), **history** (how a record changed) and **inspect** (part of a record, a field or a range).

**Checkpoint**:
A retained historical tracked copy in `sessions/checkpoints/`; new copy creation is retired.

**Operational recovery**:
Local rollback receipts and backups in the ignored `sessions/recovery/` collection.

**Design Concept article**:
An encyclopedic wiki article in `wiki/design-concepts/` explaining one durable cross-cutting design model or one landmark's evolving synthesis, ending with `Evidence and Sources` and carrying `History`.

**Wiki profile**:
The manifest's declared wiki shape: `project` (one room's memory router and collections) or `deployment` (adds owner, machine, and project pointer collections).

**Managed runtime tool**:
A file in `workbench/tools/` installed from the Workbench release and listed in the tools receipt with its source release, commit, and hash.

**Declared integration branch**:
The branch, named by exact case in `workbench/manifest.json` `git.integrationBranch`, into which the independent review gate merges task branches; `git.defaultBranch` names the branch it is created from.

### Continuity and evidence boundaries

**Workbench connection identity**:
The stable namespace selected for optional private session transport.

**Private session transport**:
Explicitly configured synchronization of selected live working records.

**Direct promotion**:
Deliberate selected-claim reconciliation into a named durable owner, with privacy/validity checks and verified destination recovery before scoped source cleanup.

**Configured-host capability**:
An operation exercised in the actual host and configuration.

**Core compatibility**:
The explicit supported range between one selected installed global core release and room versions.

### Project terms

**[TERM]**:
[ONE- OR TWO-SENTENCE DEFINITION]
_Avoid_: [ALIASES TO AVOID]
