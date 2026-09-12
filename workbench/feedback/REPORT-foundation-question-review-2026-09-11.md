# Foundation question review

**Date:** 2026-09-11. **Source record:** `workbench/sessions/notepads/grilling/workbench-foundation-rework-2026-09-11.json` at revision 28, 80 questions, 84 entries. **Endpoint:** rewritten suggested answers for every unsettled question, with at least one option each and two where a real fork exists. This report changes no Canon, restatuses no question, and authorizes no work; the owner picks in the grilling session.

**Evidence base.** The merged grilling note and its 45 decisions and 13 corrections; the eight proposed ADRs 000B to 000I and planned Specs S-00F to S-00J; the four handoffs of 2026-09-10 and 2026-09-11; the original-foundation audit report and the two handwritten-note reconstructions; the live diffs on AGENTS, LEXICON, RUNBOOK, BLUEPRINT and README; the live ADR register; the core skill catalog and skills-pending inventory; tools/test-blueprint-contract.mjs, workbench/tools/visible-ids.mjs, and the notepads runtime usage. Live state was read at detached `c0ac60a` with the pre-existing dirty tree preserved. Nothing here is verified agent-outcome evidence; it is source inspection.

**Coverage.** 40 unsettled questions rewritten (37 open, 2 held, 1 tentative). 11 settled answers reviewed for drift against the new evidence. Five questions that new evidence has effectively closed are marked with a single option that says so (WF-1, WF-6, TT-Q10, FND-Q17d, FND-Q17g).

## How to read an option

Option A is the recommendation. Its basis is the evidence line above it, and it is chosen against the core rhythm first: context conservation, then context continuity, then verified completion. Option B is the strongest alternative the evidence still supports, with its cost stated. Dependencies name the questions whose answer this one assumes.

## The working loop

Context boundary, chats, next, the Implement loop, gate failure.

### FND-Q03 (open)

**Question.** What should end one useful working context, and what must the next one load?

**What changed.** FND-Q19 (approved) already defines a Task as the smallest bounded work an agent can complete without overflowing its useful context, so the Task is the context unit by definition. ADR-000H makes it a standalone TASK.md. The audit measured 5,614 words in AGENTS plus Lexicon before any Spec; S-00G moves the ownership schema out of the Lexicon, which is the largest single entry cut on the table. The original notes say one ticket, then repeat, and their 100k figure is a sketch, not a limit. The notepad runtime triggers on survival value, not elapsed time.

- **A. The Task is the boundary** *(recommended)* One Chat completes one Task. The context ends at the Task close event: proof recorded in TASK.md, board regenerated, recovery push made, and a stop. The next context loads exactly the three Contract controls, the assigned SPEC's current sections, the claimed TASK.md, and only the sources they cite. A notepad enters only when a Task is interrupted mid-way. Entry cost is measured in words on a real Task, not tokens (FND-Q15). This also answers TT-Q4 and settles the Chat cardinality in TT-Q3.
- **B. The boundary stays advisory** A Chat may carry several Tasks of one Spec, as `carry` does today, and ends on the agent's judgment or a host summary. The next context loads the same set plus the notepad's current view. Cheaper to keep, but continuity then rides on notepad discipline and conservation weakens with every extra Task in the window.

*A is the reading closest to the original one-ticket-repeat loop and to the approved Task definition. B preserves `carry` unchanged.*

Depends on: TT-Q4, TT-Q3, FND-Q15

### TT-Q3 (open)

**Question.** What are the hierarchy and cardinality among Project, Workbench, host chat, assignment, Spec, and Task?

**What changed.** TT-Q1 locked Chat and Thread. FND-Q19 fixed the three altitudes. ADR-000H makes Task a record. The manifest binds one Workbench to one project. A Spec owns its own branch (FND-Q14). Cross-Spec needs are already expressed as Spec-level Blockers (S-00C blocked by S-00B, and so on).

- **A. One Task per Chat, one Spec per Task** *(recommended)* Project 1:1 Workbench. Workbench 1:* Specs (the Frontier). Spec 1:* Tasks, and a Task belongs to exactly one Spec; anything spanning Specs is a Spec dependency, never a shared Task. Chat 1:1 Task in progress. Thread 1:* Chats and may span the Tasks of one Spec. Assignment is the claim binding one agent to one Task with its stance.
- **B. One Chat may carry several Tasks of one Spec** Same tree, but Chat 1:* Tasks sequentially within one Spec. This is the `carry` model and the same fork as FND-Q03 option B.

Depends on: FND-Q03

### TT-Q4 (open)

**Question.** Must one Task fit in one host chat/context, and may one chat carry more than one Task?

**What changed.** The first half is now answered by the approved FND-Q19 definition: a Task fits one useful context by construction. Only the second half is open, and it is the same choice as FND-Q03.

- **A. Yes, and one Task then stop** *(recommended)* A Task fits one Chat by definition. A Chat carries a second Task only after a full close event on the first, and the default is to stop and start fresh, matching the original one-ticket-repeat loop.
- **B. Yes, and carry may continue** A Chat may continue through eligible Tasks of the same Spec while the agent judges the window healthy. Keeps `carry`; accepts the conservation risk.

Depends on: FND-Q03

### TT-Q5 (open)

**Question.** What does next mean: next eligible Task, next action inside current work, or owner recommendation?

**What changed.** Today `next --json` returns one eligible or resumable slice ordered by resumption, priority and ID, or null. Every Spec already carries a Next gate field. The notepad current view already carries next_action. FND-Q01 (approved) describes the owner asking the Workbench to pick the next path toward the destination, or running sitrep then authorizing carry.

- **A. Three words for three things** *(recommended)* `next` stays the tool's selection of the next eligible Task. "Next gate" stays the next owner decision on a Spec. "Next action" stays the notepad's next executable step inside current work. An owner recommendation is a sitrep output read from the board, not a fourth meaning of `next`. Promote the three definitions to the Lexicon and stop overloading the word in prose.
- **B. Teach `next` to explain itself** Same three meanings, and `next` additionally returns why this Task advances the destination by linking the Spec's Blueprint section. Richer for the owner; depends on the Frontier render in ADR-000E, so it is a later slice, not a different answer.

### TT-Q6 (open)

**Question.** How do selection, activation, assignment, claim, and authorization differ?

**What changed.** The planned specs S-00C to S-00F and S-00G to S-00J all sit in a planned-until-explicitly-activated state, so activation is already a real event without a definition. `claim` is an existing command. ADR-0035 and ADR-0036 fix that assignment carries bounded autonomy and a stance, not authority.

- **A. A ladder of five distinct events** *(recommended)* Authorization: the user grants scope (Authority Order item 1). Activation: the owner moves a planned Spec to active, releasing its Tasks to selection. Selection: `next` picks one eligible Task. Claim: an agent binds itself to that Task, recorded in TASK.md. Assignment: the resulting agent-Task-stance binding shown on the board. Each has its own record and none implies the one before it.
- **B. Fold activation into authorization** Activation is simply the user request that names the Spec. One fewer word, but the Frontier render loses the planned-versus-active distinction that today's specs already rely on.

### TT-Q7 (open)

**Question.** When is a fresh chat required, optional, or prohibited, including independent review and continuation?

**What changed.** AGENTS and ADR-0037 already require a separate-context reviewer at the integration gate and reject self-review. ADR-000F makes the reviewed unit the Spec branch. The handoff skill exists precisely to start a new Chat. The BPR-R1 to R4 corrections showed what goes wrong when a Chat's endpoint drifts.

- **A. Required at the gate and at each Task; optional for Explore** *(recommended)* Required: the Spec QA gate review runs in a separate context (already Canon), and a new Task starts in a fresh Chat (FND-Q03 A). Optional: Explore and grilling continue across Chats through the notepad; an interrupted Task resumes in a new Chat from TASK.md plus the notepad. Prohibited: reviewing your own candidate anywhere in the same Thread, and carrying a Task across Chats without its state written to TASK.md or the note first.
- **B. Required only for review** Only the gate review needs a separate context; Tasks may continue across Chats freely under `carry`. Pairs with FND-Q03 option B.

Depends on: FND-Q03

### WF-7 (open)

**Question.** What does the Implement loop do, and how should dependencies and parallel work be represented?

**What changed.** ADR-000H puts blocking relationships on TASK.md. FND-Q14 puts each Spec on its own branch, so Specs run in parallel already. Team templates already require disjoint edit lanes and one durable writer. `next` already excludes blocked work. S-00H TK-002 migrates selection, claim, close and render onto Task records.

- **A. One loop, two dependency kinds, two parallel scopes** *(recommended)* Loop: claim the next eligible Task, red/green, record proof in TASK.md, recovery push, regenerate the board, close, stop. Dependencies: `blocked_by` on TASK.md for Task-to-Task within a Spec; the existing Blockers field for Spec-to-Spec. Parallelism: Specs in parallel on their own branches always; Tasks within one Spec in parallel only when their blockers are clear and their edit lanes are disjoint, with one durable writer for SPEC.md and the board.
- **B. Add Task branches under the Spec branch** Same as A, plus each Task on a stacked branch beneath the Spec branch. More Git ceremony; the Spec QA gate reviews the Spec branch either way, so this buys isolation for parallel Tasks and nothing else.

### WF-8 (open)

**Question.** What does QA/Verify require, including a human check, and what exact conditions stop or return work to implementation?

**What changed.** The requirement half is settled: ADR-000F fixes two gates, and S-00J delivers the refusal at the first one. What remains is the return path, which S-00J explicitly leaves out. New evidence: the original notes say a failure message must tell the recipient how to fix it; integration is the Human QA branch and must hold assembled work; FND-Q02A says nothing irreplaceable lives on the board.

- **A. Failure returns to the Spec as a Task, never to a person** *(recommended)* Spec QA gate failure: the gate writes a finding naming the unmet acceptance criterion or the incomplete Task, the Spec reopens with one new top-priority Task derived from that finding, the branch stays open, and the merge request is closed rather than left pending. Human QA failure: the owner's finding becomes a Task in the owning Spec, or a new Spec if it is a new requirement; integration keeps the assembled work unless the owner asks for a revert. Every failure message names the fix.
- **B. Failure reverts integration and reopens the branch** A failed Human QA reverts the Spec's merge out of integration and the Spec returns to in-progress. Integration stays clean, but it stops being the place where the owner inspects assembled behavior, which is the whole point of FND-Q14.

### WF-9 (open)

**Question.** Which transitions are optional, repeatable, or permitted to loop backward?

**What changed.** FND-Q01 fixes the sequence; the original notes say stages may be skipped. The altitude handoff says discoveries travel upward and a child must not silently weaken parent acceptance. ADR-000I retires Specs only after main verification. WF-8 supplies the failure return.

- **A. Optional, repeatable and backward, each only through a record** *(recommended)* Optional: Explore and Prototype when an owner artifact already answers the question; handoff. Repeatable: Explore at any time, the Task loop, the Spec QA gate per merge request. Backward, always through a record: Task to Spec when a finding reopens it; Spec to Blueprint when a discovery proposes a destination change through grilling and, if architectural, an ADR; gate failure to Task (WF-8). Prohibited: a child editing a parent's acceptance, skipping the Spec QA gate, and a Spec entering `retired` before main verification.
- **B. Same, with Prototype mandatory for new Blueprint ground** As A, but any Spec whose Blueprint section is new must be preceded by a prototype. Heavier; it turns an Explore method into a gate.

## Explore and Prototype

What starts exploration, what ends it, when a prototype earns its keep.

### WF-1 (open)

**Question.** Does BLUEPRINT.md remain the single PRD-shaped destination artifact, rather than adding a separate PRD?

**What changed.** Answered by the approved FND-Q01, which assigns the future-facing PRD function to the Blueprint, and by ADR-000G. S-011 already maps a per-feature PRD to a Spec.

- **A. Yes; close as settled by FND-Q01** *(recommended)* The Blueprint is the only product-wide PRD. A per-feature PRD is a Spec. Record WF-1 as settled by FND-Q01 and ADR-000G rather than answering it again.

### WF-2 (open)

**Question.** What starts an Explore phase, and what is the minimum exit artifact or decision?

**What changed.** FND-Q01 names grilling, research, supporting documents and optional prototypes. FND-Q13 (locked) says a grilling answer enters Canon only through a Task or Spec. The BPR-R1 correction established that stopping a grilling session is itself a valid endpoint. S-00C plans project-evidence grilling for adopted projects.

- **A. A question no owner artifact answers; exit is a routed answer** *(recommended)* Explore starts when the owner brings an idea, a disagreement, or a question that no Contract or Core artifact answers. The minimum exit is one approved answer in the grilling note with a named promotion target: a Blueprint section, an ADR, a Spec, or an explicit discard. The exit is a decision about where the understanding lives, not a document. Research and prototypes write their findings into the same note.
- **B. Exit is a Blueprint delta** Explore ends with a Blueprint change or an explicit no-change. Stronger, but it forces destination edits for small explorations that belong in a Spec and makes every exploration look like architecture.

### WF-3 (open)

**Question.** Are research, grilling, and wayfinding optional Explore methods, and are any others part of the standard flow?

**What changed.** Grilling is the only method that produces approved answers the note can carry. Research, prototype and wayfinder exist as pending skill source outside the core bundle. Domain modeling is required by FND-Q09's Lexicon discipline. This question decides part of FND-Q12.

- **A. Grilling is the spine; the rest feed it** *(recommended)* Grilling is the required Explore method because it is what records owner answers. Research, wayfinding, prototype, domain modeling and supporting documents are optional feeders whose output lands in the grilling note. No other standard methods. The core bundle must ship the feeders it names (FND-Q12).
- **B. Everything optional; only the exit is required** Any method may be used and only the WF-2 exit is checked. Lighter, but exploration can end without a decision record, which is the failure the notepad was built to prevent.

Depends on: FND-Q12, WF-2

### WF-4 (open)

**Question.** When is a Prototype needed, what feedback does it seek, and what makes it ready to promote or discard?

**What changed.** The original notes: hash out ideas in code to get feedback. The pending prototype skill defines a small reversible artifact answering one concrete question. A Genesis scaffold is not a prototype. FND-Q14 puts two gates on every branch that reaches integration.

- **A. A prototype answers one grilling question and never merges as itself** *(recommended)* Needed when a grilling question cannot be answered by argument: behavior, feel, feasibility. The grilling names the question; the feedback sought is the owner's answer to it. Ready to promote when that answer is recorded as an approved grilling answer. The code is discarded, or if kept becomes the first Task of a Spec rebuilt under normal TDD. It lives on a throwaway branch or outside the room's source and never enters integration.
- **B. Prototype branches may graduate** A prototype branch may become the Spec branch once tests are added. Faster when the prototype is nearly right; blurs the Spec QA gate because the branch was never derived from a Spec.

### WF-5 (open)

**Question.** Should Task replace Ticket throughout the Workbench as the execution-slice term, including tools and stable IDs, or only in explanatory workflow prose?

**What changed.** Settled on 2026-09-12 by decision-043: full rename across prose, tools and newly allocated IDs, with historical TK-### frozen. Carried by ADR-000H and S-00H. The note's question record still reads open.

- **A. Close as settled by decision-043** *(recommended)* Restatus WF-5 to approved in the note; no further answer is needed. The only residue is the identifier prefix, which TT-Q10 carries.

Depends on: TT-Q10

### WF-6 (open)

**Question.** How do Blueprint, specs, and the generated Taskboard relate after the terminology change?

**What changed.** Settled by ADR-000E, ADR-000G and ADR-000H together: the board renders Spec and TASK.md state and authors nothing. The one residue is the Spec catalog, whose Lexicon route still says it includes completed history; that belongs to FND-Q08.

- **A. Close as settled; route the catalog residue to FND-Q08** *(recommended)* Blueprint owns the Destination, each Spec a Journey, each Task a Path; TASKBOARD.md is regenerated from SPEC.md and TASK.md and holds nothing irreplaceable. Record WF-6 as settled by the three ADRs and move the catalog question under FND-Q08.

Depends on: FND-Q08

## Ownership map contents

What goes into OWNERSHIP.json, how it changes, what is portable.

### FND-Q20 (tentative)

**Question.** Which relationship terms are necessary and sufficient for agents to traverse the ownership model without flattening it?

**What changed.** The handoff proposed six: owns, inherits, refines, references, summarizes, provides evidence for. Live tools already encode three more relations that the map must name at type level: an ADR canonicalizes a control (`canonicalized_in`), an ADR or Spec supersedes another, and a Task or Spec blocks another. S-00G TK-001 needs this vocabulary as its schema input.

- **A. Confirm six, add the three the tools already use** *(recommended)* Keep the six. Add canonicalizes (ADR to control), supersedes (ADR to ADR, Spec to Spec) and blocks (Task to Task, Spec to Spec). Define every relation as directional with a named inverse so a query can traverse either way. Settle this before S-00G TK-001, since the schema cannot be written without it.
- **B. Six only; lifecycle relations stay record fields** Treat supersedes and blocks as instance-level fields outside the map. Consistent with the type-level rule, but the map must still say that ADRs supersede ADRs, so the three names appear either way.

Depends on: FND-Q21

### FND-Q21 (open)

**Question.** How should the 27 responsibilities be allocated across artifact types and scopes, starting with the most consequential boundary that current controls leave ambiguous?

**What changed.** A 24-row draft allocation already exists in the live LEXICON.md diff (it merged Provenance with History and Delivery with Release). It predates three approved corrections: the three-altitude scoping of requirements, the three-file Contract, and the Q02A board wording. S-00G TK-004 cannot start until this is answered. BPR-5A already gives the placement rule for decisions.

- **A. Start from the live 24-row draft and apply the known corrections** *(recommended)* Use the draft as the baseline instead of allocating from zero. Apply: split back to 27 rows; make Requirements, Boundaries, Destination, Acceptance, Evidence and Work state scoped rows with an owner at each of the three altitudes; replace the seven-control Contract wording and the Taskboard row with the approved forms; split Navigation into Lexicon (Context Map) and OWNERSHIP.json (ownership routes). The most consequential ambiguous boundary is Decisions: which choices are ADR-worthy versus Spec-local versus Task-local. Answer it first by adopting BPR-5A as that row's rule. The owner then reviews only the scoped rows.
- **B. Allocate all 27 fresh, one grilling question each** Highest fidelity, roughly 27 owner answers. Recommended only if the draft is judged untrustworthy rather than merely stale.

Depends on: FND-Q20, FND-Q23, FND-Q24

### FND-Q23 (open)

**Question.** How are accepted ownership assignments changed, how do tentative proposals remain outside active Canon, and what prevents a maintained map from becoming a duplicate work tracker?

**What changed.** OWNERSHIP.json is one file, so the folder lifecycle of ADR-000I cannot apply; the promotion handoff already concluded that entry lifecycle must be an in-record status the query filters on. Decision-045 established the proposed-then-accepted method for ADRs. ADR-000D's guardrail forbids per-record work state. FND-Q13 routes promotion through a Task.

- **A. In-record status, Task-driven change, and a test that forbids instances** *(recommended)* Each map entry carries status proposed, accepted or superseded, mirroring the ADR vocabulary. The query returns accepted rows by default and shows proposed rows only on request. Changing an accepted row is an ordinary Task under a Spec (FND-Q13); changing what a type's job is also needs an ADR under the BPR-5A rule. Tracker prevention is mechanical: the schema forbids any instance identifier (S-###, T-###, N-###) in any field, and S-00G TK-004's guardrail test asserts it.
- **B. Accepted rows only; proposals live in the notepad** The file holds no status field; tentative rows stay in the grilling note until accepted. Simplest file, but proposals are invisible to the query and the ADR parallel with a proposed location is lost.

### FND-Q24 (open)

**Question.** Which ownership assignments must be shared portable Workbench core, and which may be project-specific extensions while preserving ordinary entry and core compatibility?

**What changed.** S-00G TK-003 ships a bracketed template OWNERSHIP.json. ADR-0050 already gives the mechanism for visible, deliberate control divergence during upgrade, and ADR-0047 the preservation contract. The ownership handoff asked that updates preserve deliberate project differences.

- **A. Two sections in one file: core and extensions** *(recommended)* `core` is exactly the types the template ships and is replaced on update. `extensions` holds project-added artifact types and routes and is preserved on update. A project may add types and routes freely; it may not re-route a core responsibility to a different owner without an ADR, and the upgrade tool reports that re-route as deliberate divergence through the ADR-0050 mechanism.
- **B. One flat map, whole-file divergence report** No structural distinction; the upgrade diffs the whole file and reports every difference. Simpler schema; noisier updates, and no machine way to tell an extension from drift.

## Record lifecycle

Retiring Specs, the current-contract route, legacy notes, old ADRs.

### FND-Q07 (held)

**Question.** Was disposability intended for the working synthesis only, or for the feature specification itself?

**What changed.** Direction is settled (decision-039, ADR-000I): Specs and Tasks are temporary, move to `retired`, and are cleared after main verification behind a five-part gate. New evidence sharpens the gate: exactly 16 accepted ADRs name a Spec path in `canonicalized_in`, and adr.mjs requires an accepted record to name an owner. Clearing those Specs would leave 16 accepted ADRs with a missing operational owner. S-00I builds the staging area and never clears it.

- **A. Keep HELD; release through one clearing Spec with a sixth precondition** *(recommended)* The hold stays. Release comes through a dedicated retired-clearing Spec, sequenced after S-00H, S-00I and the map contents (FND-Q21). Add the sixth precondition the 16-ADR scan exposes: every accepted ADR whose `canonicalized_in` names a Spec is re-anchored to a durable owner, or carries the requirement itself, before that Spec is cleared. Historical provenance keeps commit plus historical path, as decision-039 already requires.
- **B. Release early for a narrow class** Clear only Specs that no accepted ADR names and whose ADRs already name root-control owners. The scan has not been run; today it may be an empty set, so the value is small.

Depends on: FND-Q08, FND-Q21

### FND-Q08 (held)

**Question.** After three Specs alter one capability, what single route gives a new agent its current contract?

**What changed.** With Specs retired, the only present-tense owners left are the ones decision-039 lists. The Lexicon route for the Spec catalog still says it includes completed history, which cannot survive clearing. Tests already cite the requirement they prove (tools/test-spec-citation-anchors.mjs), so source and tests can stand in for a retired Spec's requirements. FND-Q07's earlier answer said a Wiki summary is possible but not required.

- **A. Four durable owners, routed by OWNERSHIP.json; no capability record** *(recommended)* The current contract of a capability is read from the Blueprint (what it promises), active ADRs (what was decided), source and tests (what holds), and Runbook plus README (how it is used). OWNERSHIP.json routes the question. The Spec catalog stops being a capability inventory and becomes the Frontier list; its includes-completed-history route retires. The precondition is that tests name the requirement they prove, which the citation-anchor test already enforces from S-036 onward.
- **B. One Wiki capability article per retired Spec** At retirement, the reconciliation step writes one design-concept article naming the capability's current owners. Gives a single landing page at the cost of a second summary that can drift; ADR-0030 already declares the collection.

Depends on: FND-Q07

### FND-Q10 (open)

**Question.** What compatibility obligation applies to still-needed pre-schema notes?

**What changed.** Five legacy records are unreadable to note discovery; one read confirmed an unsupported schema. Unreadable records already block identifier allocation, which S-00F recorded as a live cost. The runtime already has a `migrate` command. Four superseded grilling notes are retained as source of record.

- **A. Readable or explicitly retired, never silently ignored** *(recommended)* For each of the five: if it still holds unresolved context, run `notepads.mjs migrate` to notepad-1 and keep the original bytes beside it; otherwise move it to the retired location with a one-line reason. Either way discovery and allocation stop refusing. Add this as a slice of S-00F, which already names the unreadable inventory.
- **B. Make the runtime tolerate unreadable records** Allocation proves uniqueness over the readable set plus an explicit skip list. Smaller change, but it weakens the identity guarantee ADR-0041 relies on.

### FND-Q11 (open)

**Question.** Should the whole-record rule govern these older active records too, or is a clearly marked exception intended?

**What changed.** ADR-0054 still says it partially supersedes ADR-0028, and both are accepted in the live register. ADR-000A forbids partial supersession. ADR-000I moves superseded records to a permanent archive, and a partially superseded record cannot be placed. Decision-045 fixed the legal ordering: author proposed, accept, then supersede.

- **A. No exception; author a successor to ADR-0028 inside the lifecycle migration** *(recommended)* Write one proposed successor restating ADR-0028's still-valid claims (live records stay untracked) together with the direct-promotion destination from ADR-0054. On acceptance, ADR-0028 is superseded whole. ADR-0054's partial-supersession sentence stays untouched as preserved body text and reads as history once the register shows the successor. Do it as part of S-00I TK-002, which is when every record moves anyway.
- **B. A grandfather list in ADR-000A** Add a marked exception naming pre-000A partial supersessions. Cheaper, but it leaves the fragment reconstruction the rule forbids and gives S-00I a record it cannot place.

## Scope, Blueprint and skills

What the Workbench is for, what the Blueprint must explain, what a fresh install ships.

### FND-Q04 (open)

**Question.** Is the reusable Workbench only for software projects, or should the same discovery, validation and continuity model support other work products?

**What changed.** The core-rhythm directive says complex, human-directed work. The approved FND-Q01 workflow is domain-neutral in wording, but the two approved QA gates are Git branch gates, which are software-shaped. ADR-0015 and ADR-0026 kept Foundry and GPT OS ideas out of core. S-00E's fresh-copy proof is a software project. FND-Q24 now gives extensions a home.

- **A. Generic process, software-shaped proof, domain recipes as extensions** *(recommended)* Core defines the domain-neutral rhythm and artifacts: Explore, Blueprint, Spec, Task, two gates. The Git branch gates are the software instance of the two gates; a non-software project supplies its own verified-on-main equivalent, such as an accepted deliverable. Domain recipes and integrations are project extensions under FND-Q24, never core. The Blueprint's Non-Goals state plainly that no non-software proof exists yet.
- **B. Software only, stated outright** Scope core to software projects and say in the Blueprint that other work products live downstream. Cheaper and narrower; it contradicts the wording of the core rhythm the owner supplied.

Depends on: FND-Q24

### FND-Q05 (open)

**Question.** What concrete user situations must the Blueprint explain so a fresh collaborator can reconstruct the intended Workbench?

**What changed.** ADR-000E and ADR-000G both name BLUEPRINT.md as an owner at acceptance, so the Blueprint changes anyway. The audit found the current narrative is about how agents maintain work, not the product experience. FND-Q03 and FND-Q14 now supply the resume and acceptance halves of the story.

- **A. Five scenario walkthroughs under the existing headings** *(recommended)* Blueprint acceptance is that each of five situations is answerable from the Blueprint plus one link: I have an idea (Explore); we disagree about the product (grilling to Blueprint alignment); the prototype changes our minds (Blueprint revision and Spec re-derivation); resume one Task cold (the FND-Q03 boundary); is the delivered result satisfactory (the Human QA gate on integration). Written into the Blueprint at ADR-000E and ADR-000G acceptance.
- **B. Outcomes in the Blueprint, walkthroughs in a Wiki design concept** Keep the Blueprint to outcomes and link one design-concept article carrying the five scenarios (ADR-0030 collection). Shorter Blueprint; the scenario truth then lives where it cannot carry Canon.

Depends on: FND-Q06

### FND-Q06 (open)

**Question.** Should Blueprint acceptance be defined by recoverable product meaning or by a fixed outline?

**What changed.** tools/test-blueprint-contract.mjs requires the exact eight headings in the root and template Blueprints. S-00A prose says headings may be adapted. templates/GENESIS.md still tells the agent to fill What This Project Is, Core promise and Design Decisions, none of which exist. templates/ADOPTION.md still says drop what the code disproved, which ADR-0027 rejects. S-00D will rewrite Genesis derivation anyway.

- **A. Meaning first; the outline is a dogfood check on the two canonical files only** *(recommended)* Acceptance for any room's Blueprint is the FND-Q05 scenarios plus lossless disposition. The eight-heading test stays for the root and template files as a dogfood guard, and the template states that downstream rooms may adapt. The stale Genesis headings and the Adoption code-disproved line are factual drift, not owner decisions: fix them under S-00D and the S-00F manual self-check.
- **B. Fixed outline everywhere** Make the eight headings a hard contract in every room and extend the test to downstream validation. Easiest to check mechanically; it forfeits the adaptability S-00A promised.

### FND-Q12 (open)

**Question.** Which original functions must a brand-new installation provide, even if their old skill names disappear?

**What changed.** The core bundle is 21 skills. Research, prototype, wayfinder, tdd and domain-modeling all sit in skills-pending outside discovery. FND-Q01 names research, supporting documents and prototypes as part of the workflow. AGENTS requires TDD. FND-Q09 and FND-Q13 depend on domain-modeling discipline. The CAND-F decision of 2026-09-07 fixed the invariant that a fresh Workbench must function without the personal skills repository, and that the bundle count derives from the catalog.

- **A. Core ships every function the approved workflow names** *(recommended)* Map FND-Q01 to functions, not names. Explore: grilling (core), research and wayfinding (pending). Prototype (pending). Blueprint alignment: grilling plus to-docs (core). Frontier planning: to-spec and to-tasks (core after S-00H). Implement: implement, carry, and tdd (pending yet required by AGENTS). Gates: code-review (core) and the S-00J gate. Continuity: notepad, handoff, save, promote (core). So promote research, prototype, wayfinder, tdd and domain-modeling into core; keep teach, wizard and the setup skills optional. The count follows the catalog.
- **B. Keep 21; Explore methods stay shared-tier** Treat the pending Explore skills as personal or shared-tier skills the Workbench can detect but does not own (ADR-0046). A fresh install then cannot run the front half of FND-Q01 without the personal catalog, which breaks the CAND-F invariant.

Depends on: WF-3

## Proof and lifecycle claims

What failure the rework reduces, and which old release claims stay live.

### FND-Q15 (open)

**Question.** What observable failure should the redesign reduce, and how will we know it did?

**What changed.** The deferral condition is met: the workflow (FND-Q01, Q19, Q14) and the terms are settled. ADR-0044 forbids outcome claims without repeated controlled trials, and ADR-0049 accepts an unavailable baseline for a harness-only change. The core rhythm names the two failure classes directly. S-00E's fresh-copy proof and Master_Workbench's per-version upstream fix lists already exist as measurement venues.

- **A. Two measured failures, one per half of the rhythm** *(recommended)* Conservation: the words a fresh agent must load to start one Task (AGENTS, Runbook entry, Lexicon, current Spec sections, TASK.md). Baseline is 5,614 words for the two controls today; set the target after S-00G moves the schema out. Continuity: the count of owner re-explanations and wrong-owner writes across one idea-to-demo run in the Workbench Template (S-00E) with a cold resume forced mid-way. Record both as an outcome trial under ADR-0044 before and after the foundation specs land. Neither is a release gate.
- **B. Use the upstream fix list as the longitudinal signal** Count Master_Workbench UP-### items classed as lost intent, re-explanation or wrong-owner write per harness version. Already flowing and cheap; observational only, so it supports but cannot make the improvement claim.

### FND-Q16 (open)

**Question.** Which release or continuity claims should remain live obligations, and which should become explicitly historical or superseded?

**What changed.** The hot board still projects S-014 and S-022 as blocked v3.1-era release work naming no successor; README names S-014 as the release gate; the Lexicon names v3.1.4 as current candidate. S-050 and S-052 are blocked on real external proof (device and private repository), which is not stale narration. FND-Q14 says Human QA is not batched by release, but a release remains a versioning act (BPR-7A: proved by updating the Template).

- **A. Retire the two v3.1 specs as superseded; keep the two with real gates** *(recommended)* Mark S-014 and S-022 completed-as-superseded by S-027 and S-050 so the board clears; they are history with explicit scope. Keep S-050 and S-052 live because their blockers are genuine external proofs. Repair the README and Lexicon release wording as factual drift under the S-00F manual self-check. Release stays a versioning and Template-update act, distinct from the Human QA gate.
- **B. Fold them into `retired` once S-00I lands** Wait for folder lifecycle and stage S-014 and S-022 there. Ties routine cleanup to a spec that is blocked twice over.

## Residual sketches

The unfinished handwritten ideas: six boxes, Master Objective, Captain, runner, safe list.

### FND-Q17a (open)

**Question.** Was the six-box sketch merely an explanatory sketch, or did it contain a structural boundary the current model lacks?

**What changed.** Since the audit, every box has acquired a named owner: the three-file Contract (Rules), OWNERSHIP.json (Structure), TASKBOARD.md (Projection), Specs and Tasks (Intent), the six planes of ADR-0001. No box now lacks a type-level home.

- **A. Close as explanatory; record the crosswalk once** *(recommended)* Frontline maps to Actuality; Source of Truth to the Canon carriers; Rules/Reports to Canon plus Grounding; Memory/Structure to Enduring Context plus OWNERSHIP.json; Intent to Specs and Tasks; Projection to the board. Write the crosswalk once as a Wiki design-concept article and add no artifact.
- **B. Hold until the map has contents** Re-check after FND-Q21 whether any box lacks a type-level owner. Costs nothing but delay.

### FND-Q17c (open)

**Question.** Does one objective span multiple capabilities without the owner rebuilding its state?

**What changed.** The notepad runtime already makes the objective, not the Chat or Task, the continuity unit, and one objective may use several linked notes. Multi-Spec objectives already exist in practice: S-00B through S-00E form one chain carried only by Blockers and prose. ADR-000G fixes three altitudes; Foundry's Job Order was kept out.

- **A. No new object; a Journey group is Specs plus one objective note** *(recommended)* A multi-Spec objective is a Blueprint-anchored group of Specs that declare predecessor and successor in their Blockers, rendered as a chain on the board (part of the ADR-000E render), with one objective-scoped notepad carrying working context across them. The only gap is the chain view.
- **B. A light Journey record** One Markdown record per multi-Spec objective listing members and order. It becomes a fourth altitude and a second tracker, which ADR-000G and ADR-000D both forbid.

### FND-Q17d (open)

**Question.** Is any missing behavior left after FND-Q02 and FND-Q03, or were Spec managers and Captain merely possible implementations?

**What changed.** FND-Q02A makes sitrep readable from the board alone, which answers why don't I know what is about to be worked on. TT-Q5 gives `next` one meaning. ADR-0036 keeps stances from becoming roles. The remaining note, what do I not realize, is an investigation habit, not a role.

- **A. Closed by Q02A and TT-Q5; add an uncertainty field to TASK.md** *(recommended)* No Spec Manager or Captain enters core. The what-do-I-not-realize prompt becomes a TASK.md field listing the least-confident assumptions to investigate first, which S-00H can carry at no extra cost.
- **B. Captain stays a team-template role only** Already the case; closing this way changes nothing and records nothing.

### FND-Q17e (open)

**Question.** Is a portable unattended runner actually required, or should core describe a bounded host capability?

**What changed.** Under FND-Q03 option A a Task is exactly one run. ADR-0053 fixes minimum configured-host capability and its evidence limits, and hosts differ in permission models. `implement` is already one Task per invocation. The pending loop-me is not this.

- **A. Core describes the run contract; the runner is a declared host capability** *(recommended)* Core states what an unattended run is: input one claimed Task; output proof, recovery push, board regeneration and a stop; safety: no owner decisions inside, stop on any blocker. The runner itself is a host or room capability declared under ADR-0053. One reference once-style script may ship in the tools lane as optional.
- **B. Ship a portable Node runner in core** Adds a host-specific permission surface to the portable bundle and a proof obligation per provider. Larger scope for a capability the owner has not asked to prove.

Depends on: FND-Q03

### FND-Q17f (open)

**Question.** Are there recurring approved data-retrieval or maintenance actions the present contract cannot express?

**What changed.** The handwritten loop (read the source, analyze, update canon, exception list, ask only what cannot be inferred) is exactly what S-00F's self-drift check does to the Workbench itself. Read and Edit Scope already name a safe list. What the contract lacks is recurrence: a standing Spec never completes.

- **A. Expressible now, except recurrence; add a recurring Task form to S-00H** *(recommended)* A maintenance action is an ordinary Task under a standing Spec, with Edit Scope as the safe list; no new permission class. Add one thing to the TASK.md shape in S-00H: a recurring Task that is re-issued per run rather than closed once, so a standing Spec can stay active without pretending to complete.
- **B. Defer to FND-Q04** If non-software domains stay out of core, external-data maintenance is a downstream concern and the question closes with it.

Depends on: FND-Q04

### FND-Q17g (open)

**Question.** Which residual sketch still expresses a needed behavior after the scope and workflow questions above?

**What changed.** Every remaining name now has a route: ownership (OWNERSHIP.json), design concept (grilling, Blueprint, ADR-0030 articles), reviewers-on-push and triage (the S-00J gate and diagnostics), lint and fetch (project-local pre-commit), add instructions at the end (the feedback lane and the upstream fix list), README change (delivered by S-00A).

- **A. Dispose each and close** *(recommended)* Record the disposition of each name against its route and close the question. Only incubate and the illegible find command have no route; treat them as candidate names for the WF-2 Explore entry, nothing more.
- **B. Keep only incubate and find open** Close everything else and carry those two into WF-2 as naming candidates. Same outcome with one extra open item.

## Terminology and promotion

Aliases, the unit of work in projections, where settled answers go.

### TT-Q8 (open)

**Question.** Which skills are owner-facing commands and which are internal composition details?

**What changed.** FND-Q01 describes the owner experience in verbs: pick the next path, sitrep then carry. ADR-0045 governs composition. Stances are assigned by the Spec and Task, not invoked. The archived ask-workbench router was removed from core.

- **A. One owner verb per workflow stage; the rest internal** *(recommended)* Owner-facing: explore (grilling, research, prototype, wayfinder), design concept (to-docs into the Blueprint), to-spec, to-tasks, next and carry or implement, review, save, handoff, sitrep. Internal: notepad, promote, tracer-bullet, the four stances, checkpoint, and make-it-so as a composition. Record the split as two columns in the skills README and the Runbook's Behavior Selection table.
- **B. Everything stays invocable; order by stage** No split; the Runbook lists all 21 by workflow stage. Simpler to maintain, higher entry cost for the owner.

### TT-Q9 (open)

**Question.** What continuity relationship should hold among a chat, JSON Notepad, Markdown handoff, Spec, and Task?

**What changed.** The notepad runtime fixes the objective as the continuity unit and forbids a note from being a handoff. ADR-000H gives TASK.md its own state. FND-Q02A forbids irreplaceable context on the board. The BPR-R2 correction fixed handoffs as readable Markdown for a named recipient.

- **A. Layered: state in Task and Spec, working context in the note, transfer in the handoff, nothing in the Chat** *(recommended)* TASK.md and SPEC.md own state that lasts their lifecycle. The notepad owns one objective's working context across Chats: unresolved items and corrections. The handoff owns transfer to a named recipient for one endpoint. The Chat owns nothing. Rule: at a Task close, no claim needed for continuation may live only in the Chat or the note. A Task's objective key defaults to its Task ID so note and Task route one-to-one; an Explore objective with no Task yet keys on its grilling note.
- **B. Fold working context into TASK.md; notes for Explore only** Fewer artifacts during implementation, but TASK.md then carries unreconciled reasoning that must be cleared before retirement, which is the mixing FND-Q07 is trying to end.

### TT-Q10 (open)

**Question.** What should TASKBOARD and other Projections call the current unit of work?

**What changed.** Settled by WF-5 and ADR-000H: Task. Only the identifier form is open. Visible identifiers already use S, TK, N and H; the prefix rule allows any uppercase prefix, and each prefix scopes independently.

- **A. Task, with T-### identifiers** *(recommended)* Column header Task; new slices allocate T-### through the existing allocator; historical TK-### stays frozen. Record TT-Q10 as settled by WF-5 with this one sub-choice.
- **B. Task, with TASK-### identifiers** Same, with the longer prefix for readability in prose. Costs width in every board column.

### TT-Q11 (open)

**Question.** Which legacy or host-native terms remain accepted aliases, and which terms should be retired or avoided?

**What changed.** WF-5 retires Ticket. TT-Q1 rejected Codex task as a name for a Chat. The audit found checkpoint overloaded between the retired copier and Git recovery commits in `implement`. Room is used informally for an installed Workbench in skills and memory. Foundry's Job, Job Order and Hall were verified as history.

- **A. Retire three, define one, list the rest as history** *(recommended)* Retire from live use: Ticket; checkpoint for Git recovery commits (say recovery commit); the host word task for a Chat. Define Room as an installed Workbench instance if it stays in tool output, otherwise keep it informal with conversation. Add a short Retired Terms list to the Lexicon (TK-###, checkpoint copies, Job, Job Order, Hall) so agents recognize them in history without reviving them.
- **B. Retire Ticket only** Handle the others as they come up. Cheaper now; leaves the checkpoint overload that already misleads readers of `implement`.

### TT-Q12 (open)

**Question.** Which settled answers belong in the Lexicon, root controls, an owning Spec, or an ADR, and what evidence must precede promotion?

**What changed.** The promotion pass of 2026-09-11 already practised an answer: ADRs authored as proposed, control edits deferred to acceptance, Specs for anything needing code, and a read-only consumer scan before each record. Decision-045 verified this needs no new mechanism. BPR-5A gives the placement rule.

- **A. Adopt the promotion pass as the rule** *(recommended)* Term meaning goes to the Lexicon, at ADR acceptance when the term is decision-borne. Obligations and procedures go to AGENTS and the Runbook. A cross-cutting decision goes to an ADR, proposed until accepted. Anything needing code, tests or templates goes to a Spec with Tasks, blocked on its ADR. Preconditions: the answer is marked approved in the note, and a read-only live scan names every consumer the change touches. Write it once into the grilling skill's exits and the promote skill.
- **B. Same routing plus an independent read-back per ADR before acceptance** Adds a separate-context read of each proposed ADR before the owner accepts it. Extra gate on top of the acceptance the owner already performs; worth it only for records that supersede.

## Settled answers that new evidence touches

These are not rewritten. Each line says what the newer record does to the older answer and what, if anything, the note should restatus.

| Question | Status | Effect of newer evidence |
|---|---|---|
| BPR-8F | locked | Says integration review is task-level. Superseded by FND-Q14 (decision-032) and ADR-000F, which make the Spec branch the reviewed unit. The note still shows it locked; restatus it as superseded by FND-Q14. |
| BPR-6A | locked | Says preserve stable paths. Retired by ADR-000I (reachability comes from links, not unmoving paths). The note still shows it locked; restatus it as retired by ADR-000I. |
| BPR-2 | locked | Only AGENTS, RUNBOOK and LEXICON are universal entry reading. Now carried by ADR-000C's three-file Contract; consistent, and the earlier seven-control Lexicon wording is the drift to repair at acceptance. |
| BPR-7B | locked | Example_Workbench becomes the Workbench Template. Delivered by S-00B (complete). Consistent. |
| BPR-8A / BPR-8B | locked | Blueprint excludes status and takes an eight-section narrative shape. The heading test enforces the shape literally on the two canonical files; FND-Q06 decides whether that stays a dogfood check or becomes a room contract. |
| FND-Q09 | locked | The Lexicon holds settled vocabulary only. The live diff added a 27-row ownership schema to the Lexicon; FND-Q23A moves it to OWNERSHIP.json, so the two agree. The lexicon skill's record-unsettled-questions instruction is still unowned by any spec. |
| FND-Q13 | locked | Grilling answers enter Canon through a Task or Spec. The promotion pass followed it. The domain-modeling skill's inline-write instruction is still unowned by any spec. |
| FND-Q01 | approved | Records that renaming Ticket was not a priority; WF-5 (decision-043) since made the rename full. No conflict, but a reader of Q01 alone would be misled; the ADR-000H provenance already explains it. |
| FND-Q14 / FND-Q19 | approved | Two gates, Spec branch reviewed. S-00J delivers the first gate's refusal; WF-8 owns the return path. The v3.1 release specs on the hot board still describe release-batched review, which FND-Q16 retires. |
| TT-Q2 / WF-5 | approved | Standalone TASK.md and Task replaces Ticket. Carried by ADR-000H and S-00H. TT-Q10 reduces to the identifier prefix. |
| FND-Q22 / Q22A / Q21A / Q23A | approved | Three-file Contract; OWNERSHIP.json as the eighth root control, exhaustive by query. Carried by ADR-000B, 000C, 000D and S-00G. Contents remain FND-Q21, Q23 and Q24 above. |

## Corrections with no owner yet

Each was settled by a locked or approved answer or an accepted ADR, and none of the planned specs S-00F to S-00J names it. They are factual drift, not open decisions; they need a slice, not a question.

- The `lexicon` skill still tells agents to record unsettled questions in the Lexicon, contrary to locked FND-Q09.
- The `domain-modeling` skill still instructs inline Lexicon writes during an interview, contrary to locked FND-Q13.
- templates/GENESIS.md names Blueprint sections that no longer exist (What This Project Is, Core promise, Design Decisions).
- templates/ADOPTION.md instructs agents to drop rules the code disproved, contrary to ADR-0027.
- ADR-0054 still declares a partial supersession of ADR-0028 in the active register (FND-Q11).
- No spec owns the retirement of the AGENTS stable-path rule's twin in BPR-6A inside the note's own status records.

## Suggested order for the session

1. FND-Q03 first: it decides TT-Q3, TT-Q4, TT-Q7 and FND-Q17e in one stroke.
2. FND-Q20, then FND-Q21, FND-Q23, FND-Q24: they unblock S-00G TK-004 and are the only content the map is waiting on.
3. WF-8 and WF-9: they unblock S-00J's failure path.
4. FND-Q07 and FND-Q08 together, with the 16-ADR precondition on the table.
5. FND-Q12 with WF-3: one decision about the core bundle.
6. FND-Q04, Q05, Q06: the Blueprint set, all edited at ADR-000E and 000G acceptance anyway.
7. FND-Q15 and Q16 last, now that their deferral condition is met.
8. Close the five effectively-settled questions and restatus BPR-6A and BPR-8F in one read-back.

## Next action

Bring this report into the grilling session and answer FND-Q03. Recording each pick as an approved answer in the note is the same promotion path the eight proposed ADRs took; nothing here shortcuts it.
