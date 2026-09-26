# Landmark Tracker Foundation — executable packet plan

Spec: [S-01T](SPEC.md). Authoring baseline: `89d4042fb8931b9d720af75bffea1c28803d72aa`.

The September 26 Director -> Dispatcher -> Worker assignment authorizes Task
creation and delivery beyond the original specification-only endpoint. These
Worker-authored packets are staged here while the Director coordinates the
exclusive global Task allocation lease and shared write lanes. No label is
allocated, no record is claimable, and no implementation result is claimed.
Dispatcher remains sole durable writer for this Spec and its Task state.

## Order, interfaces and release

| Packet | Concrete result | Dependencies |
|---|---|---|
| Foundation | Persist an unanswered ungrouped DQC, evolve it, connect a later landmark and rebuild its evidence-backed view | Director releases path/layout, Tracker runtime/test and coordinated identity interface |
| Distributions | Inspect all accepted source types and DQC/landmark/Workbench distributions with explicit exceptional outcomes | Foundation public persistence/projection seam |
| Documentation | Several Specs maintain one readable identifier-free article; composition records actual documentation evidence | Foundation and Distributions; I feature/schema interface and P composition lane |
| Recovery | Supported moves/retirement preserve live JSON references and historical proof; tracked discard is recoverable | Foundation and Documentation association bridge; I lifecycle lane |

Task IDs must come from the current `next-id S-01T --prefix TK --json` result,
not a remembered proposed range. Publish one allocated record, coordinate the
Director's render/doctor, then request the next. Publish valid statuses and
ID-backed blockers; pending lane coordination belongs in the owning Spec and
packet, not fabricated dependency IDs. Keep planned Spec status until actual
execution is established. No whole-Spec completion prerequisite is inferred
from the narrower integration seams below.

Implementation choices within S-01T's accepted latitude (field names, commands,
result objects, fractional tolerance and safe write mechanism) belong to the
released Worker, documented with tests. Director release coordinates shared
ownership and identity compatibility; it is not another owner approval gate
for routine field choices. A contradiction with an accepted contract remains
open in this Spec. Do not accept proposed ADRs, change review gates, replace
Taskboard, stamp a release, or infer Human QA from green tests.

## Foundation packet

**Task ID:** unallocated; **Spec ID:** S-01T; **Stance:** Builder.
**Slice:** Capture understanding before delivery and retain it through later grouping.
**Destination:** spec-acceptance: An unanswered, ungrouped DQC is valid and visible without a Spec, Task, landmark or predetermined Wiki destination; confirmation and Expected result can be added without destroying origin history.
**Planned verification:** Public disposable-room persistence/read/revise/association/rebuild fixtures, exact 30/20/50 example, invalid-write preservation, restart and clone discovery; targeted tests then full AGENTS suite.

Deliver one vertical behavior, rather than separate schema/runtime/UI Tasks:

1. Discover manifest-declared tracked collections under the approved
   `workbench/landmark-tracker/` root, retaining seven support lanes and readable
   legacy layout shapes. The current resolver rejects unknown collection keys;
   the layout validator compares exact collection objects. Both seams must agree.
2. Persist an unanswered meaningful DQC with optional empty landmark relations,
   retained source identities/revisions, uncertainty and correction lineage.
   Distinguish Expected result from Result; neither a final answer nor a Wiki
   destination is required at capture.
3. Retitle, confirm, add Expected result and later connect zero/many landmarks
   without changing origin/type/room identity or deleting useful history.
   Validate before writing; stale revisions, collisions, unsafe/symlink paths
   and invalid shapes preserve prior source/projection bytes. State the actual
   concurrency guarantee; revision comparison alone does not prove isolation.
4. Rebuild generated `TRACKER.json` with titles, explicit no-landmark display,
   inspectable origins/assessments and a valid two-item 30/20/50 distribution.
   Preserve flat JSON source folders. Generated output is never the source author.

Red: exercise absent/missing public behavior, then fail persistence, identity,
revision, association and distribution assertions at its stable boundary.
Green: restart a fresh reader, rebuild without ignored notes, retain old proof,
reject invalid mutation without partial writes, demonstrate the complete path.
No inferred Idea for an unevidenced unanswered card and no done -> Verified.

Proposed exact new files: `workbench/tools/landmark-tracker.mjs`,
`tools/test-landmark-tracker.mjs`, `workbench/landmark-tracker/README.md`,
`workbench/landmark-tracker/destination-questions/.gitkeep`,
`workbench/landmark-tracker/landmarks/.gitkeep`, and generated
`workbench/landmark-tracker/TRACKER.json`. No invented real owner concepts as fixtures.
Shared enabling files: `workbench/tools/workbench-paths.mjs`,
`workbench/tools/workbench-layout.mjs`, `workbench/manifest.json`,
`tools/test-workbench-layout.mjs`, `RUNBOOK.md`, `templates/RUNBOOK.md`.
Identity files `workbench/tools/visible-ids.mjs` and
`tools/test-visible-ids.mjs` are coordinated with O; change only a proved gap.
Generic runtime propagation extends the layout's closed `RUNTIME_TOOLS` inventory and its existing installer tests; inspect `tools/workbench-tools.mjs` and `tools/test-workbench-tools.mjs` before propagation. It uses the actual distribution inventory,
not an invented `templates/workbench/tools/` tree.

Acceptance advanced: discovery, ungrouped capture, additive lineage/grouping,
rebuildable view and bounded arithmetic/input safety. This does not establish
full contributor coverage, Wiki/workflow delivery, recovery, Spec completion,
Director review or owner Human QA.

Demo: a one-command disposable-room scenario in the public test/demo seam
captures/reloads an ungrouped card, evolves it, adds a landmark and rebuilds
visible lineage plus evidence distributions in under one minute.

## Distributions packet

**Task ID:** unallocated; **Spec ID:** S-01T; **Stance:** Builder.
**Slice:** Inspect documentation distributions across source types and scopes.
**Destination:** spec-acceptance: Exact eight-step vocabulary, the 30/20/50 example, shared identity deduplication, mixed-question contribution and Workbench-wide aggregation pass deterministic examples without filtering or flattening away meaning.
**Planned verification:** Persisted source-type by scope tables, invalid/incomplete outcomes, arithmetic/navigation cycle contrast and claim revision fixtures at the Foundation public seam; targeted then full verification.

Extend the Foundation runtime/test serially. Related grilling questions, Specs,
ADRs, Tasks and DQCs use the same evidence-bearing documentation meanings and
typed room-scoped identity, preserving legacy Spec-qualified numeric Tasks.
Keep exact order: Idea, Aligning, Confirmed, Mapped, Planned, Journey, Review,
Verified. Each distinct declared constituent contributes one unit; mixed
fractions sum to one. Deduplicate shared identity in each aggregate while
retaining every relationship for navigation. A mixed DQC remains one item;
expanding lineage does not flatten its children into the aggregate, and no
supporting-reference exclusion or effort weighting is introduced.

Empty input displays no items; unknown identities/missing assessments report
incomplete, bad fractions report invalid. Preserve navigation cycles but refuse
arithmetic dependency cycles with their identity chain. Test nonfinite, negative,
unknown-step and wrong-sum inputs; do not drop bad records to produce totals.
Inspect numerator, denominator, evidence revision and fraction rationale at
DQC, landmark and room scopes, including the exact 30/20/50 example.

Assess changed understanding at specific claims with what changed, why and
revision evidence; retain original proof and unaffected supported claims.
A done Task or accepted ADR never automatically yields Verified. Full actual
Wiki/gate assessment is delivered by the Documentation packet.

Exact primary paths: `workbench/tools/landmark-tracker.mjs`,
`tools/test-landmark-tracker.mjs`; procedure patch to `RUNBOOK.md` and
`templates/RUNBOOK.md` through the released writer. No second assessment store.

Red/green: prove missing cross-type/scope behavior, then retain arithmetic and
identity meaning through persist/restart/rebuild; invalid update leaves bytes
unchanged. Demo extends the Foundation scenario with shared identity,
lineage expansion, navigation cycle, explicit incomplete/invalid outcomes and
scoped reconciliation in under one minute.

## Documentation packet

**Task ID:** unallocated; **Spec ID:** S-01T; **Stance:** Builder.
**Slice:** Two delivery Specs maintain one correct, readable article.
**Destination:** spec-acceptance: Completing a linked Task without the expected durable documentation does not produce Verified; actual content comparison and applicable gates do.
**Planned verification:** Disposable-room public Tracker/Wiki/composition fixtures; complete-byte no-WBID scans, claim/content/revision/gate evidence, unchanged grilling primitive and full verification.

Deliver actual claim assessment against Expected result and named durable bytes,
with applicable owner gates. Two Specs contribute distinct claims to one
coherent article, rather than duplicating it. No WBIDs appear in any article
bytes, including metadata, comments, URLs and targets. Identity-bearing lineage
and immutable proof live in structured records; readable identifier-free routes
retain article navigation. Article existence, done Tasks and accepted ADRs alone
cannot generate Verified. Changed claims expose supported reconciliation, not
blanket staleness.

Coordinate feature collection/schema with I. Current Wiki types omit features;
feature and design-concept jobs remain distinct. Composition maintains records
within caller authority during planning/building/review. Coordinate P's existing
workflow/skill endpoints; the grilling primitive remains Tracker-unaware and
useful historical notepads are retained. Wiki delivery introduces no separate
publishing ceremony or automatic assignment.

Proposed paths: Foundation runtime/test; `workbench/tools/wiki.mjs`,
`tools/test-wiki.mjs`, `workbench/wiki/SCHEMA.md`, `workbench/wiki/MEMORY.md`,
`workbench/wiki/design-concepts/landmark-tracker.md`,
`workbench/wiki/features/README.md`,
`workbench/wiki/features/evolving-understanding-and-durable-knowledge.md`;
generic `templates/wiki/SCHEMA.md`, `templates/wiki/MEMORY.project.md`, `templates/wiki/MEMORY.root.md`,
`templates/wiki/features/README.md`; declaration/layout files from Foundation;
`tools/test-core-composition.mjs`, `tools/test-skills-lane.mjs`; released
`workbench/skills/carry/SKILL.md`, `workbench/skills/to-docs/SKILL.md`,
`workbench/skills/code-review/SKILL.md` and root/template Runbook. The narrower
composition endpoint set must follow P's released owner contract; inspect the
existing skill distribution before any corresponding generic edits.

Red: done Task/missing or wrong article content, stale evidence, unresolved gate,
hidden WBID, duplicate article requirement and undeclared feature route.
Green: actual readable claims match expected contents with revision/gate proof,
structured provenance is recoverable, grilling unchanged, routes validate.
Demo contrasts missing knowledge with the assessed two-Spec article in under
one minute. Lifecycle rewriting is the separate Recovery packet.

## Recovery packet

**Task ID:** unallocated; **Spec ID:** S-01T; **Stance:** Builder.
**Slice:** Move delivery records without losing current navigation or historical proof.
**Destination:** spec-acceptance: Live and historical references survive supported movement/retirement; discarded tracked source proof can be recovered from the named commit.
**Planned verification:** Disposable committed-room JSON move/retire/discard integration fixtures, exact-byte Git recovery, no-rewrite immutable citation tests and full verification.

Coordinate I's lifecycle seam after Documentation establishes a structured
record-to-article association. Current retirement checks expect the Spec path
in Wiki `source_paths`, which contains a WBID and conflicts with strict article
bytes. Preserve both accepted meanings using an explicit structured bridge;
do not weaken no-WBID compliance or bypass durable-owner proof.

Extend live JSON reference consumers for supported moves and retirement while
leaving immutable commit/path proof interpreted at its original tree. Refuse
discard with a genuine live dependency, prove approved tracked discard recovers
exact source bytes from the named commit, and never imply ignored notes are
recoverable through Git. Reuse F4/F5/F7 and identity repairs; do not reopen
already repaired behavior or manufacture owner-only main containment.

Proposed paths: `workbench/tools/spec-workbench.mjs`,
`workbench/tools/spec-report.mjs`, `workbench/tools/wiki.mjs`, Foundation
runtime/test; `tools/test-spec-workbench.mjs`, `tools/test-spec-report.mjs`,
`tools/test-wiki.mjs`; root/template Runbook and feature/schema association owners.
Final exact additions depend on I's released implementation; no real project
record retirement or discard is authorized as a test.

Red/green: disposable-room move rewrites live JSON without changing historical
citations; retirement accepts the valid structured owner bridge; dangling
references refuse discard; permitted fixture discard is recovered byte-for-byte.
Demo executes the supported public move/recovery path in under one minute.

## Evidence and limits

These packets were authored by Sol Workers and consolidated by the Dispatcher
against the assigned Spec, accepted ADR-000N and live runtime seams. No runtime
red/green cycle occurred during authorship. Full-suite results, pre/post drift,
guardrail findings and immutable candidate belong in the Spec evidence and
coordination report. Run one Task per Worker context after release; workers
return proof, Dispatcher judges whole-Spec destination, Director reviews the
immutable assembled candidate. Owner Human QA and main promotion remain owner-led.
