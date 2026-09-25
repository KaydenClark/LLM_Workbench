# LLM Workbench - Blueprint

## Product Destination

LLM Workbench is a portable operating harness through which a person can entrust
an AI agent with a software project. The project itself carries enough product
understanding, authority boundaries, working context and evidence for another
capable agent to continue it without the owner reconstructing the conversation.

## People And Problems Served

The owner supplies intent and consequential decisions. Agents turn that intent
into scoped, verified work and maintain the sources that make it understandable.
The Workbench serves both: it reduces repeated explanation and routine owner
coordination while keeping meaningful choices and publication under human control.
A fresh collaborator can understand the product without reading its whole history.

## Promised Outcomes

An agent can find the right owner, reconstruct the desired result, select the
appropriate behavior and finish the authorized assignment. Decisions retain their
meaning and corrections; unfinished work remains reachable. Verification states
what actually happened, and delivery claims identify the achieved recovery boundary.
The owner can inspect both the product direction and the evidence behind progress.

## Desired Experience And Behavior

Ordinary language is sufficient to start deciding, specifying, building or
handing off. An agent follows the [Context Map](LEXICON.md#task-routing), loads
only relevant owners, and resolves routine details without asking the owner to
repeat settled answers. A specification-only request stays specification-only
through every composed skill and every receiving agent.

One ladder carries an idea to delivered software, and an agent can always say
which rung the work is on: an owner idea, Align through grilling, a confirmed
design concept, the Blueprint, then recursive Spec and Task delivery.

An owner may explore an idea in conversation before it is clear enough to
Align. `grill-me`, brainstorming or wayfinding can open Align; a grilling
session starts through `grill-me`. Align reaches for research as far as a named
uncertainty requires, and ends when owner and agent explicitly confirm a shared
design concept. That confirmed concept is what gets blueprinted, so nothing is
specified from an understanding the two have not agreed on. A prototype is
optional rather than a standard rung: it sits after the Blueprint and before a
Spec, where existing evidence cannot settle whether an approach is plausible,
and prototype code carries forward into the product only once it meets the same
implementation and verification requirements as any other work.

Grilling records answers and corrections as they arrive. Working notes remain
compact and useful through interruption; a resumed agent checks live state and
continues the same objective. A requested handoff is readable Markdown containing
the job, its boundaries, accessible context and one next action. Failed operations
remain visible and recoverable instead of becoming unsupported completion claims.

## Integrated System Design

The root controls form the entry surface. This Blueprint describes the desired
product, active ADR decisions explain cross-cutting architectural choices, the
Lexicon connects meanings and owners, and the Wiki supplies readable current
capability knowledge. [Claim-level ownership](workbench/docs/adr/000A-active-adr-decisions-and-destination-blueprints.md)
keeps these surfaces coherent without making a whole file one kind of authority.

Delivery is designed at three altitudes. The Blueprint is the product-level
destination and the journey that reaches it: the whole of counting to 100. A
Spec is one scoped objective with its own destination, PRD-shaped, the next
number to reach. Tasks do the counting; a Task is the bounded executable work
that advances a destination or repairs it. Stacked Specs realize the Blueprint
journey. Scope and destination decide where work belongs, never how much work
it turns out to be: a gap against a destination that already exists is
corrective Task work however many Tasks it takes, and a distinct scoped
objective with a destination of its own warrants a new Spec.

Each of these truths has a durable owner, and no working file is one of them.
The Blueprint owns product direction; the Wiki owns readable current capability
knowledge; ADR records own consequential architectural decisions; source, tests
and assets own implemented actuality and its proof; Git preserves recoverable
history. `SPEC.md` and `TASK.md` are transient working artifacts that carry
scope, state and evidence while their work is under way, and a later reader
depends on the durable owners rather than on them.

A manifest resolves the support collections, the managed local runtime and the
managed core skills. Core skills compose reusable behavior within the caller's
scope. The upstream-owned core ships inside every room in its skills lane,
reached by both provider discovery adapters from a fresh clone, alongside
room-owned extensions in the same lane; a personal catalog is a backup and
publication target that no room depends on
([skills lane](workbench/docs/adr/000M-core-skills-ship-in-the-workbench-skills-lane.md),
[Core ownership](workbench/docs/adr/0046-core-personal-shared-and-room-local-skill-ownership.md)).

Local JSON notepads hold unfinished reasoning, source references and corrections.
Supported settled claims move into their durable owners before cleanup. Optional
private transport can carry selected live context across devices with explicit
acknowledgment and conflict preservation; ordinary local work remains independent.

Updating a target project and updating the canonical Workbench have different
drift boundaries. A Workbench update must inspect the Workbench's own controls,
Specs, projections, procedures, manifest, templates and managed artifacts for
stale or contradictory current guidance before and after the update. A
structurally valid render or test run is not semantic freshness proof. The
Workbench is not updated successfully if a memoryless agent could still be
misdirected by an artifact that presents completed work as pending.

## Cross-Cutting Qualities And Constraints

Portability, safe autonomy, source fidelity and recoverability apply throughout.
Plain files and small deterministic local tools support multiple configured hosts.
The system exposes compatibility and unavailable capabilities without silently
replacing personal work or claiming support from file presence alone.

Instructions, accepted design, verified behavior and historical evidence remain
distinguishable. Privacy covers working content and metadata. Unrelated changes,
original decisions, corrections and completed evidence survive migration.
A structural check proves only its boundary; claims of improved agent reliability
require repeated controlled observations with uncertainty and failures preserved.

## Desired Lifecycle

New projects receive a coherent starter; existing projects adopt or explicitly
update it while preserving their product truth and deliberate local differences.
Genesis is first-time setup and leads into grilling so a new room can form its
Blueprint. Setup and updates are separate from the governing idea-to-delivery
workflow below.

The owner can revisit this destination map when deciding where work belongs.
Arrows show progression; braces show loops and branches, including the return
to Align after failed Human QA:

```text
Idea
  -> optional conversation to explore the idea
  -> Align through grill-me, wayfinding, brainstorming and needed research
  -> Confirm shared design concept
  -> Blueprint the idea
  -> {
       Main branch
         -> Integration branch
              -> Owner tells the Director to start the version
              -> Director starts a Dispatcher for each Spec and coordinates them
              -> Spec branch {
                   Dispatcher creates Spec
                     -> Create Tasks
                     -> Update Taskboard
                     -> {
                          Dispatch a Worker to a hot non-conflicting Task
                            -> Create one Task branch/worktree from the Spec branch
                            -> Implement
                            -> Worker self-checks its claims and proof, updates the card
                            -> Commit and push Task branch
                            -> Hand back to the Dispatcher
                            -> Merge Task into Spec branch
                            -> Delete Task branch after containment
                            -> Dispatcher picks the next step
                            -> Missed step: card back to In progress -> new Task to fix it
                            -> Repeat Tasks in parallel where they do not conflict
                        }
                     -> Repeat until the Spec is assembled
                     -> Dispatcher whole-Spec QA / Verify
                     -> Director QA / approval in a separate context
                     -> If findings: create corrective Tasks -> repeat Task loop
                     -> If approved: merge Spec into Integration
                 }
              -> Direct Blueprint Task {
                   Dispatch a Worker from Integration
                     -> Task branch -> Worker self-check -> Hand back
                     -> Dispatcher QA / Verify -> merge into Integration
                     -> Director QA on Integration
                 }
              -> Director has approved every Spec in the version or escalated blockers
              -> Owner Human QA on Integration
              -> {
                   Pass -> owner-only merge Integration into Main
                   Fail -> return to Align
                             -> revisit shared design concept / Blueprint as needed
                             -> repeat delivery loop
                 }
     }
```

The Blueprint owns the grand destination and what counting to 100 means. A
PRD-shaped Spec owns a local destination and its completion meaning, like
reaching 1 through 5; it is derived from Blueprint needs, active ADRs, verified evidence,
Actuality and project- or Spec-required checks. Thin executable Tasks advance
that Spec one brick at a time, each about 0.1 of the count. The Taskboard is a Kanban projection for progress
and coordination; Specs and Tasks retain substantive state and evidence.

Delivery then repeats one loop. A need in the Blueprint creates a Spec; the Spec
creates its Tasks; the Taskboard projects their state so the next hot Task is
visible without reading the whole board. A Dispatcher sends a Worker to that hot
Task; the Worker implements it with red/green TDD, verifies the behavior that
actually resulted, self-checks its claims and proof, updates its card and hands
back the proven Task branch. The finished Task is reconciled into its Spec
and then retired out of ordinary discovery, its branch cleaned up once the Spec
branch contains it, and the next hot Task follows, until the Spec is assembled.

A Task has no review or approval gate. It is one attempt at one step: its
Worker self-checks that its claims are valid and backed by proof before handing
back, and the Dispatcher reads that report and chooses the next step. Merging a
Task into its Spec branch is coordination and containment, not QA. A Task that
misses its step is not reopened and not discarded: its report stays in the Spec
evidence as diagnostic proof, its `TASK.md` stays the record until the Spec is
cleaned up into the features Wiki, its card returns to In progress, and a new
Task, named for its objective, fixes what the check found. Work that stops
unexpectedly leaves what it recorded as it went.

When the Spec is assembled, its Dispatcher verifies the whole Spec against its
own destination and the combined results of its Tasks, doing that QA itself or
dispatching it and owning the result. The Director then approves it in a
separate context; neither the Dispatcher nor any agent that implemented a Task
in the candidate can give that approval. A check that fails diagnoses the gap
and creates corrective Tasks under the still-open Spec, and the fresh candidate
is checked again. An approved Spec branch merges into integration. Once the
Director has approved every Spec in the version or escalated its blockers, the
owner performs Human QA on integration, the surface where the destinations are
genuinely there; what that Human QA consists of is each project's own choice.
No Git merge closes a Spec; the owner's confirmation does. A closed Spec is reconciled into its durable owners, the Wiki
holding the current capability knowledge a later reader needs, and is then
retired. Once the exact change is verified on the default branch, the transient
Spec and Task records may be discarded, with Git preserving recoverable history.
A later gap against that same destination is a corrective Task that updates the
reconciled record instead of reviving a closed Spec.

Branch topology follows the work, never the role. A Spec branch is cut from the
integration branch, each Task branch is cut from its Spec branch and worked in
its own worktree, and proven Task results accumulate in the Spec branch until
the assembled Spec is approved. A Task that advances the Blueprint directly,
with no intermediate Spec destination, has its Task branch cut from integration
and merged back into it: the Dispatcher sends its Worker from integration,
verifies the result and merges it, and the Director checks it there. A direct
Task that outgrows one context, or a run of them chasing one objective, becomes
a Spec. No role works from main.

Failed Human QA returns to Align at whatever scope the failure actually
implicates, and the design-concept and delivery loop runs again from there. A
defect is not by itself evidence that the shared design concept was wrong, and
the loop is chosen at the scope the diagnosis supports.

Parallel work is directed rather than improvised. Director, Dispatcher and
Worker are roles defined by responsibility, not by branch, and the owner is the
human above them, not the Director. The owner tells the Director to start a
version; the Director starts a Dispatcher for each Spec, coordinates between
them, approves each assembled Spec and escalates blockers to the owner. A
Dispatcher plans its Spec, sends Workers to as many non-conflicting Tasks as can
run in parallel, reads their reports, picks the next step and keeps a single
durable writer for shared state. A Worker carries out one Task and hands back.
That is the intended model beyond consistent single-Task execution, and no
ordinary assignment depends on it.

The Workbench Template exercises the same update contract as a real installed
room. Whole-product readiness examines the combined system before owner-controlled
publication. Installation and remote delivery are verified where they occur.

Failures lead to investigation, the smallest supported repair and corrected
records. Working context is saved before it can be lost; cleanups follow verified
reconciliation. Each completed assignment leaves an executable continuation or
truthful completion without a new mandatory coordination system.

## Non-Goals

The Workbench is not a portfolio scheduler, autonomous source of permission,
provider-specific control plane, marketplace, transcript archive or proof that
an agent always follows instructions. It does not require Foundry, a graph
service, a private catalog or network access for ordinary local work. It cannot
guarantee capture after an immediate interruption or move a running process by
synchronizing files. Publication and unrelated project rollout are owner choices.

It does not become a hosted tracker, database, paid service, broad MCP server or
general project-management application. Personal task management and replacement
of Command Information Center are outside its purpose. Startup context has no
permanent Done lane or proof archive; historical tasks are not retrofitted into
manufactured specifications. The portable Workbench does not import Foundry
FUIDs, Job Orders, flights, Claims, orchestration or CIC release machinery.
