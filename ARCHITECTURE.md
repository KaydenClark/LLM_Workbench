# LLM Workbench - Architecture

**Last reviewed:** 2026-10-07
**Status:** active

This file says which artifact owns which kind of truth, how to reach it, and
what must stay true. It is a routing artifact, never a Contract file: it binds
nothing and never joins the carriers `AGENTS.md` Instruction Authority names. It
changes only when an owner, lane or invariant changes, so it is revisited a few
times a year. Terms are defined in [`GLOSSARY.md`](GLOSSARY.md); the Wiki
explains them.

## Bird's-Eye View

LLM Workbench is an agentic management system: the workbench Claude Code and
Codex use to align the owner's ideas and carry confirmed design concepts to
delivery. In this room the project is the next workbench, built with the
current one. A room is a Git repository with root controls on top, Workbench
lanes declared by `workbench/manifest.json` underneath, and the project's own
source beside them. Every kind of truth has one maintained owner; an agent
enters at `AGENTS.md`, follows a route below to the smallest owner that answers
its question, and writes a change back to that owner.

## Codemap

| Path | What lives there |
|---|---|
| Root controls | `AGENTS.md`, `BLUEPRINT.md`, `GLOSSARY.md`, `ARCHITECTURE.md`, `RUNBOOK.md`, `README.md`, `TASKBOARD.md` and the `CLAUDE.md` host adapter; their jobs are in [Ownership](#ownership). |
| `workbench/manifest.json` | Declares the room: identity, version, Git branches, lanes, collections and the Wiki profile. Tools resolve every path through it. |
| `workbench/specs/` | Spec records (`SPEC.md`) with their Task records (`tasks/<Task>/TASK.md`) and proof; `CATALOG.md` indexes them and `retired/` keeps finished ones. |
| `workbench/landmarks/` | `LANDMARK.md` artifacts, each nesting its own Specs and Tasks. |
| `workbench/landmark-tracker/` | Destination Question Cards (DQCs), landmark records and the generated Tracker view. |
| `workbench/skills/` | The core skill bundle every room ships, plus the maintainer skills the manifest declares, which never ship; `.agents/skills` and `.claude/skills` resolve into it. |
| `workbench/wiki/` | The Wiki: the `MEMORY.md` router, `SCHEMA.md`, design-concept, feature, dictionary and guidebook articles. |
| `workbench/docs/adr/`, `workbench/docs/ddr/` | Architectural and destination decision records, each collection with its `REGISTER.md` and `HISTORY.md` views. |
| `workbench/tools/` | Managed runtime tools installed into every room: the Spec and Task lifecycle (`spec-workbench`), decision records (`adr`), notepads, the Wiki validator, layout and update (`workbench-layout`), and self-drift. |
| `workbench/sessions/`, `workbench/feedback/`, `workbench/grill-board/` | Local working context (notepads, handoffs, grilling, recovery), the feedback lane, and the Grill Board review surface. |
| `templates/` | The generic room Templates Genesis, adoption and the update route copy into a room. |
| `tools/` | Maintainer tools and the test suite of this repository; never installed into a room. |
| `evals/`, `outcomes/`, `benchmarks/` | Outcome evaluation, controlled task trials and static rubric results. |
| `team templates/`, `research templates/`, `skills-pending/`, `skills-archive/` | Optional coordination and research templates, preserved non-invocable skill baselines, archived skills. |

## Ownership

An **artifact** is an identifiable document, structured record, source file or
output used by the Workbench. A **responsibility** is the job that needs doing.
An **artifact owner** is the maintained location of a particular kind of truth;
a **maintainer** is the person or assigned agent responsible for keeping it
current. Owning information does not grant permission to change it.

The Workbench Contract is the claim set `AGENTS.md` Instruction Authority
names, with the bounded assigned Spec and, while an operation is performed, the
lane skill the Contract points to for it; it is not another document. Other root
artifacts are routed by the question they answer. The following jobs are
distinct even when one document serves several. This is an ownership map, not a
requirement to create one file, agent or workflow stage per row. Paths below use
the standard layout; the manifest resolves an installed project's actual lanes
and collections.

| Job | Definition and owned content | Agent question | Maintained owner / route |
|---|---|---|---|
| **Authority** | Establish who may authorize an action and which instructions apply. | Who can authorize this? | Current user request -> [AGENTS](AGENTS.md#authority-order); the assigned Spec delegates only its bounded capability. |
| **Boundaries** | Limit the authorized action: scope, protected resources, prohibitions, approvals, privacy and external effects. | May I change or expose this? | [AGENTS](AGENTS.md); the current request and assigned Spec may narrow the task. |
| **Destination** | Describe the desired finished product, its people, purpose, experience, outcomes, qualities and non-goals. | What are we trying to build, and why? | [Blueprint](BLUEPRINT.md). |
| **Requirements** | Define the behavior, interfaces, constraints and exclusions of one capability. | What must this capability do? | Assigned stable `SPEC.md` -> Desired Behavior, Decisions And Contracts, Non-Goals. Cross-cutting qualities stay in the Blueprint. |
| **Decisions** | Preserve an accepted choice, its rationale, alternatives, consequences and supersession. | What was decided, and why this choice? | [ADR register](workbench/docs/adr/REGISTER.md) -> active architectural decision; [DDR register](workbench/docs/ddr/REGISTER.md) -> active destination decision ([ADR-000S](workbench/docs/adr/000S-destination-decision-records-are-decision-records-beside-adrs.md)); capability-local choices stay in the owning Spec. |
| **Language** | Define shared terms, aliases and distinctions precisely. | What does this word mean here? | [Glossary](GLOSSARY.md) -> the term; its Wiki lexicon article explains it. Capability-only terms remain in their Spec until shared. |
| **Knowledge** | Explain durable concepts and source-backed context that help a reader understand the project. | What do I need to understand about this? | [Wiki MEMORY](workbench/wiki/MEMORY.md) -> relevant note or Design Concept article -> governing sources. |
| **Navigation** | Connect a question to its smallest relevant information owner. | Where should I look? | This file's [Routes](#routes); Wiki MEMORY routes inside the Wiki; manifest resolves locations. |
| **Work state** | Record assignment, priority, progress, dependencies, blockers, latest event and next gate. | What is happening, who owns it, and what is next? | Owning `SPEC.md` and its Tasks; [Taskboard](TASKBOARD.md) displays their generated current view. |
| **Acceptance** | Specify the observable conditions and required proof for declaring an outcome complete. | What would count as done? | Assigned Spec -> Acceptance Criteria and Verification Procedure; AGENTS owns project-wide verification and review obligations. |
| **Evidence** | Record the candidate, method, observer or producer, result, limits and source needed to assess a claim. | What was actually checked, and what does it prove? | Spec evidence log -> named test, review, report or result artifact. Evaluation records own their observations; the Spec links the proof relevant to its acceptance. |
| **Operations** | Govern how authorized work moves through selection, execution, verification, maintenance and delivery. | What operation applies, and what are its entry and exit conditions? | [AGENTS](AGENTS.md) owns lifecycle obligations; the [Runbook operations index](RUNBOOK.md#operations-index) names the available operations and points to where each one's prerequisites and expected results live. |
| **Procedures** | Describe the repeatable steps, inputs, commands, failure handling and checks for a particular operation. | How do I perform this operation here? | [Runbook operations index](RUNBOOK.md#operations-index) -> the row's pointed skill or named procedure and tool. A linked Wiki guidebook may hold an extended procedure without copying its governing rules. |
| **Reusable behavior** | Define a method for a recurring kind of work and the posture of a stance. | Which method or stance should I apply? | Runbook operations index -> Behavior Selection -> resolved skill `SKILL.md`; Spec/TASK assigns the normal stance. A skill inherits scope. |
| **Execution** | Carry out the authorized operation in a concrete environment and produce an observable result. | What runs, where does it run, and what happened? | Named source/tool plus actual host configuration own the mechanism; Runbook explains invocation; Spec records the resulting work state and evidence. A procedure is not a run. |
| **Configuration** | Declare paths, identity, dependencies, installed components and host settings. | What is configured here? | `workbench/manifest.json`, relevant component configuration and ownership receipts; Runbook routes setup and inspection. |
| **Capability** | Establish which operations the configured environment can actually perform and under what limitations. | Can this environment do the requested operation? | Runbook operations index -> named capability check -> actual host/tool and its result. A manifest declaration or installed file alone is insufficient. |
| **Evolving concept understanding** | Preserve pre-delivery understanding, its unresolved questions, changes and evidence. | What do we currently understand, and what is still open? | DQCs hold the structured account (with landmark records until `LANDMARK.md` artifacts replace them, [ADR-000U](workbench/docs/adr/000U-landmarks-are-landmark-md-artifacts-one-size-above-specs.md)); the Wiki's landmark synthesis pages summarize it as it evolves; generated Tracker presents their relationships and documentation progress. Availability is established by the room runtime, not this definition. |
| **Working context** | Preserve unfinished reasoning, corrections, source references and unresolved questions for one objective. | What would otherwise be lost with this conversation? | Local JSON notepad in the manifest-declared collection; `notepad` skill and runtime maintain it. Settled truth moves to its durable owner. |
| **Recovery** | Restore a verified, usable state after interruption or failure and establish a safe continuation point. | What survived, and how can I resume or roll back? | Runbook operations index -> recovery procedure -> existing root files, Spec, source, relevant notepad, and any recovery receipt or backup. Recheck live state before acting. |
| **Handoff** | Communicate a delegated job, completion report or update to a specified recipient in another context, as a readable map to the context the records already hold. | What should this receiving agent do, and where is the context it needs? | Local Markdown instructions and selected context from accessible owners and relevant notes ([DDR-000K](workbench/docs/ddr/000K-a-handoff-is-the-readable-map-to-the-high-fidelity-context.md)); it does not replace them. Role-based delegation follows [AGENTS](AGENTS.md#handoff-assignments-and-shared-context). |
| **Feedback** | Preserve observed failures, friction, impact, uncertainties and proposed corrections. | What went wrong, and what should be investigated? | Manifest feedback lane -> occurrence/report -> source evidence. An authorized repair and its disposition belong in the owning Spec. |
| **Evaluation** | Define comparisons and assess whether a change improves outcomes, including costs and uncertainty. | Does this Workbench help agents complete better work? | Runbook operations index -> the [`workbench-evaluation` skill](workbench/skills/workbench-evaluation/SKILL.md) -> named evaluation definitions and result ledger; the relevant Spec owns acceptance. Structural checks do not establish agent outcomes. |
| **Provenance and history** | Preserve origins, revisions, producers, corrections and superseded claims without presenting them as current. | Where did this claim or component come from? | The owning artifact's provenance/evidence, Git history, ADR history or component receipt. Retired checkpoints remain history. |
| **Delivery and release** | Establish the verified candidate, integration containment, published version and installed consumer state separately. | Is this change delivered here, or only prepared? | AGENTS owns approval/review boundaries; the Runbook operations index points to the closeout procedures; the delivery Spec owns proof linked to actual Git, release and installation records. |
| **Human orientation** | Explain what the project is, who it is for, and how a person starts using it. | How do I get started? | [README](README.md), linking operational detail to the Runbook. |

The table above identifies where a question is answered. These distinctions
prevent a supporting artifact from silently taking over another job:

| Artifact | Defined job and ownership limit |
|---|---|
| **Root files** | AGENTS governs agents; Blueprint describes destination; `GLOSSARY.md` defines shared terms; `ARCHITECTURE.md` routes ownership; Runbook gives operations and procedures; README orients people. TASKBOARD projects Spec state; CLAUDE adapts entry for its host. AGENTS is the always-loaded brief and the only Contract file ([one Contract file](workbench/docs/ddr/001C-agents-md-is-the-map-and-the-only-contract-file.md)); the Runbook is an index of operations that binds nothing ([the Runbook decision](workbench/docs/ddr/001D-the-runbook-lines-the-workflow-verbs-up-next-to-their-scenarios-and-binds-nothing.md)); the glossary, the Wiki lexicon articles and this file take over the retiring Lexicon ([the Lexicon retirement](workbench/docs/ddr/001E-the-lexicon-retires-terms-live-in-the-wiki-and-ownership-routes-and-invariants-live-in-architecture-md.md)). The accepted destination also adds `OWNERSHIP.json` as a Core route and `TASKBOARD.json` as the projection. Root placement alone grants no Contract authority ([ADR-000B](workbench/docs/adr/000B-the-workbench-root-surface-is-eight-files-and-contract-membership-is-separate-from-root-placement.md)). |
| **SPEC and TASK** | The Spec owns scoped delivery while it and its Tasks are needed as scaffolding. After verified delivery and reconciliation, the implementation and maintained documentation hold enduring capability knowledge. Its Tasks divide delivery into temporary slices, each owning its `TASK.md`. Neither a dashboard nor a local task list replaces their accepted state. |
| **ADR** | An active accepted decision owns architectural Canon; rationale and rejected or superseded alternatives remain distinguishable. Operational owners are named by `canonicalized_in`. |
| **DDR** | An active accepted decision owns destination Canon beside the ADR: what the finished product must be or do, and why it was chosen over the alternatives. It has the ADR's layout, lifecycle and tooling; the Wiki cites it and keeps no page per DDR. |
| **Wiki** | A directory of agent-written Markdown every agent reads and updates: summaries, entity pages, concept pages, comparisons, an overview and an evolving synthesis, in prose. Its pages are Enduring Context and its schema is Canon; it authorizes nothing ([ADR-000R](workbench/docs/adr/000R-the-wiki-is-the-evolving-synthesis-every-agent-reads-and-updates.md)). |
| **Wiki article and guidebook** | An article owns an explanation or synthesis; a guidebook owns a linked detailed procedure. Both cite governing sources and cannot authorize work or become a second work tracker; Wiki `SCHEMA.md` owns their structure. |
| **Manifest, schema, configuration and receipt** | A manifest locates and declares; a schema defines valid record shape; configuration supplies operating values; a receipt records an operation's source and result. Valid shape or recorded installation alone proves neither correct behavior nor current runtime availability. |
| **Skill and host adapter** | A skill owns reusable behavior. A lane skill the Contract points to for an operation binds for that operation; an unpointed skill teaches but does not instruct ([ADR-000W](workbench/docs/adr/000W-contract-carriers-are-briefs-that-point-to-skills-and-authority-flows-through-the-pointer.md)). An adapter, including `CLAUDE.md`, makes the shared entry usable in a host without redefining project authority. |
| **Source, tool and test** | Source implements behavior, a tool performs an operation, and a test exercises a claim at a defined seam. Observed results establish only the behavior and environment exercised. |
| **Evidence record and feedback report** | Evidence records observations with provenance and limits. A feedback report keeps observations, diagnosis and proposed action distinct and never accepts its own recommendation. |
| **DQCs, landmarks and Tracker** | DQCs maintain evolving concept understanding, landmarks give it direction, and Tracker projects both. They replace no Spec, Task, source question, ledger or durable knowledge owner. |
| **Notepad, handoff and recovery backup** | A notepad captures objective context as it happens; a handoff selects and organizes that context with instructions for another agent. Both are temporary scaffolding; a backup or receipt supports restoration. None owns durable project truth. |
| **Projection and index** | Taskboard, generated Landmark Tracker, Spec catalog and ADR and DDR register/history views point to their source records. Correct the source and regenerate the view; an index owns navigation, not the indexed claim. |
| **Template** | A template owns a reusable starting shape. The filled project artifact owns local truth; placeholders never become project decisions by being copied. |

## Routes

The ordinary entry route is `AGENTS.md` -> the Runbook operations index -> `ARCHITECTURE.md`.
Continue to the assigned `SPEC.md` resolved through `workbench/manifest.json`.
Use `BLUEPRINT.md` for architecture and cross-cutting direction; use the
manifest-declared Wiki `MEMORY.md` for task-relevant durable knowledge and the
ADR `REGISTER.md` for decision rationale. Read only the relevant linked owners.
`TASKBOARD.md` is a dashboard, not a prerequisite reading archive.

These are the Context Map's entry routes. Follow the smallest applicable route:

| Need | Route to the owner |
|---|---|
| Artifact jobs, information ownership, and where to ask a question | [Ownership](#ownership) above |
| Role scope and stance composition | [Roles and stances](workbench/wiki/design-concepts/roles-and-stances.md) -> individual capability owners |
| Accepted terminology | [Glossary](GLOSSARY.md) -> the term -> its Wiki lexicon article |
| Product destination | [Blueprint](BLUEPRINT.md) |
| Assigned work, evidence, and implementation | `workbench/manifest.json` -> assigned stable spec -> its referenced source/tests |
| Capability knowledge and retained delivery records | [Wiki features](workbench/wiki/features/README.md) -> current feature article; [Spec catalog](workbench/specs/CATALOG.md) -> retained Spec for state and dated proof |
| Landmark Tracker accepted meaning | [Readable model](workbench/wiki/design-concepts/landmark-tracker.md) -> [accepted decision](workbench/docs/adr/000N-landmark-tracker-connects-evolving-understanding-to-durable-knowledge.md); [foundation transfer](workbench/specs/S-01T-landmark-tracker-foundation/SPEC.md#delivery-transfer--2026-09-26) preserves design and delivery lineage |
| Landmark Tracker delivery owners | [Tracker view](workbench/specs/S-001Z-landmark-tracker-view/SPEC.md), [Landmark records](workbench/specs/S-002A-landmark-records/SPEC.md), [DQC operations](workbench/specs/S-002B-destination-question-cards/SPEC.md); candidate evidence and Task closure do not establish integration availability |
| Available Tracker operations | [Record/view procedure](workbench/landmark-tracker/README.md), [article validator](workbench/landmark-tracker/LANDMARK-WIKI.md) -> actual manifest/runtime; check each operation in the current room |
| Durable knowledge and design concepts | [Wiki router](workbench/wiki/MEMORY.md) -> relevant note -> its governing sources |
| Decision rationale | [ADR register](workbench/docs/adr/REGISTER.md) -> active architectural decision -> its operational owners; [DDR register](workbench/docs/ddr/REGISTER.md) -> active destination decision -> its owners; [ADR history](workbench/docs/adr/HISTORY.md) and [DDR history](workbench/docs/ddr/HISTORY.md) remain explicit |
| Workflow altitude and QA boundaries | [ADR-000G](workbench/docs/adr/000G-blueprint-spec-and-task-are-three-altitudes-of-one-delivery-chain.md) -> [ADR-000F](workbench/docs/adr/000F-work-passes-two-qa-gates-spec-branch-to-integration-and-integration-to-main.md) -> [AGENTS review and closure](AGENTS.md#assembled-review-and-corrective-return) and [Runbook lifecycle](RUNBOOK.md#spec-lifecycle-and-retrieval) |
| Record lifecycle and retention | [ADR-000I](workbench/docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md) -> [AGENTS closure](AGENTS.md#owner-closure-and-reconciliation) -> [Runbook lifecycle](RUNBOOK.md#spec-lifecycle-and-retrieval) |
| Operations and procedures | [Runbook operations index](RUNBOOK.md#operations-index) -> the row's pointed skill or Runbook section -> named tool |
| Recovery after interruption or failure | [Runbook operations index](RUNBOOK.md#operations-index) -> the recovery row's [`implement` skill section](workbench/skills/implement/SKILL.md#recovery-and-rollback) -> existing Spec, source and local working context |

The Wiki retains its single `MEMORY.md` router. This table connects existing
owners; it does not add a second Wiki index or copy their contents.
For a completed capability or historical release explanation, follow its Wiki
feature article before source archives; use the Spec catalog for current
status and the original Spec for dated proof.

Design-concept routing: a question about what a product, subsystem, or
relationship *is* starts at its glossary term, then follows the term to the
articles in `workbench/wiki/design-concepts/`; the Blueprint and the assigned
spec still decide when a requirement or verified Actuality matters.

## Invariants And Boundaries

- Every kind of truth has one maintained owner. A projection or index is
  regenerated from its source, never corrected in place.
- This file binds nothing. The glossary and this file describe roles and
  boundaries; the binding behavior lives in `AGENTS.md`, cross-cutting
  architecture in `BLUEPRINT.md`, and rationale in the ADR collection.
- Add a term to `GLOSSARY.md` after the parties have agreed on its meaning, not
  while it is still being debated.
- Put project-wide definitions in `GLOSSARY.md`. Keep capability-specific
  language in its owning spec until it becomes shared.
- Definitions explain what a term means. Requirements and decisions remain in
  `BLUEPRINT.md` or the owning `SPEC.md`.
- Surface a conflict before changing an established definition. Do not silently
  use one term for two concepts or several terms for the same concept.
- Prefer links to the owning artifact over copying its detail.
- Managed runtime tools and core skills ship to every room; maintainer tools,
  maintainer skills and this repository's tests never do.
- Continuity is the result of all these owners remaining coherent and
  recoverable, not a responsibility delegated entirely to the notepad or the
  recovery folder. Likewise, the Contract is the set of applicable claims, not a
  synonym for the Blueprint. Ownership classifies information; authority and
  Governance Planes still apply to individual claims in the current operation.
