---
date: 2026-09-26
canonicalized_in:
  - BLUEPRINT.md
  - LEXICON.md
  - AGENTS.md
  - RUNBOOK.md
  - workbench/specs/S-01T-landmark-tracker-foundation/SPEC.md
---

# Landmark Tracker connects evolving understanding to durable knowledge

The owner confirmed the design through grilling on September 25–26 and
explicitly authorized documentation and specification on September 26, with
no Tasks or implementation yet. This accepted decision promotes the settled
architecture; runtime delivery remains planned in the named capability Spec.

## Decision

Destination Question Cards (DQCs) synthesize related grilling questions into
concept-level understanding, preserving uncertainty, corrections, expected
results, source lineage and evidence-bearing alignment assessments. Landmarks
connect that understanding around features or framework pillars and their
importance. DQCs and landmarks maintain the current account before Specs,
Tasks or Wiki articles exist; grilling notepads remain more historical and
handoff-like, with useful origins and corrections retained.

Tracker is a generated documentation/alignment view. Taskboard remains the
implementation view. The new system replaces nothing: the grilling ledger,
source questions, Specs, Tasks, ADRs, Contract and Wiki retain their jobs.
The earlier sole-Taskboard claim in the historical proposal ADR-000E does not
exclude this second view. The broader informal use of Frontier does not rename
or redefine the technical ready-Task sense; Tracker's behavior uses explicit
concept and documentation terms instead.

The four pieces are DQCs, landmarks, generated Tracker, and readable Landmark
Wiki pages. The approved root is `workbench/landmark-tracker/`, with generated
`TRACKER.json` and flat JSON `destination-questions/` and `landmarks/` records.
Manifest/runtime support must be implemented together; these paths do not imply
an installed collection or a new eighth support lane. Landmarks and DQCs use
WBIDs while preserving existing source question labels and lineage. Wiki pages
are human-readable Markdown without WBIDs, including metadata and link targets;
identity-bearing provenance stays in structured records and delivery evidence.

Documentation steps are Idea, Aligning, Confirmed, Mapped, Planned, Journey,
Review and Verified. Each distinct related item contributes one unit total;
a mixed item splits that unit across steps. A step's percentage is its summed
contributions divided by distinct item count, times 100. A shared item counts
once per aggregate, while relationships remain visible. Mixed DQCs contribute
their fractions without being flattened into their children. The same meaning
applies at DQC, landmark and Workbench scope. No supporting-reference exclusion
or effort weighting was selected. Task completion alone does not prove durable
knowledge, and dashboard cards have no reset/reopening lifecycle.

Workflow activity maintains underlying records with what changed, why and
evidence. The grilling primitive stays unaware of Tracker mechanics. Wiki work
is ordinary authorized Spec/Task delivery, with planning and review also
reconciling documentation. No separate publishing ceremony is introduced.
An answered question states Expected result, naming the home when known;
Result states achieved delivery. Unanswered questions need no fabricated answer
or predetermined destination. DQCs can remain ungrouped, displayed with no
landmark. Main-project association is optional and was not selected as a
mandatory placeholder.

A landmark is not a Spec or PRD and is never itself implemented. Several Specs
may contribute to the same article. A landmark can precede delivery and outlive
it; overlap is allowed. Its significance to the core path earns Blueprint
representation. The initial inventory is a starting map, not a closed taxonomy:
more landmarks emerge from DQCs. Exhaustive curation is not a foundation gate.
The first delivery path is an ungrouped DQC, a later landmark connection, and
a generated, evidence-backed documentation-progress view.

## Rationale and alternatives

The gap is preserving evolving understanding and checking whether it has become
correct durable knowledge. A delivery board or raw interview ledger alone does
not answer that question. Separate source records and a generated projection
avoid making the dashboard a second author. Readable Wiki explanations serve
both agents and the owner, who cannot conveniently read the structured JSON.

Rejected or superseded interpretations: replace/move the grilling ledger;
turn every interview prompt into a card; make landmarks parent Specs/PRDs;
status folders or one manually assigned card stage; reopen/reset completed
cards; flatten nested question contributions; infer documentation verification
from finished Tasks; require a known Wiki destination before an answer; or
finish the entire landmark inventory before building the foundation.

## Consequences and limits

The capability needs explicit schemas, safe record operations, resolvers,
finite validated aggregation, source-evidence assessment and workflow/Wiki
integration. These are implementation obligations in the Spec, not delivered
features or invented commands. Normal claim-level authority, privacy, recovery,
review and owner QA rules remain. Local notes are retained while needed; this
decision does not authorize their deletion or make ignored files Git-recoverable.

Documentation and specification are authorized now. Tasks, runtime changes,
version stamping and release are outside this planning delivery. New tests and
commands belong to subsequent authorized implementation. Original corrections
are preserved locally; the accepted claims are reproduced here and in their
operational owners so a clone does not depend on that ignored source.
