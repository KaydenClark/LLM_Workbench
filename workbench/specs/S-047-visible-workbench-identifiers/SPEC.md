# S-047 - Visible Workbench Identifiers

**Spec ID:** S-047
**Status:** active
**Priority:** 2
**Owner:** codex
**Stance:** Builder
**Updated:** 2026-09-08
**Catalog description:** Introduce visible base-62 identifiers without parallel IDs or loss of existing references.
**Blockers:** none
**Latest event:** TK-002 closed with proof.
**Next gate:** Confirm acceptance criteria and completion result.

## Outcome

The visible artifact identifier contains its existing type prefix plus a
base-62 value. The full identifier is unique within that type and Workbench;
independent Workbenches may reuse it. It is not a second identity alongside
the visible label.

## Why It Matters

The owner corrected the proposal for a parallel identity: the alphanumeric
value replaces the numeric portion, for example S-00A or ADR-00A. Requiring a
global identity now would introduce a connection model the owner deferred.

## Current Verified State

At `8e9c06f6f98825925e7da6cce59fb68768b589d7`, `workbench/tools/spec-packet.mjs`
and `spec-workbench.mjs` consume numeric spec/ticket identifiers;
`workbench/tools/adr.mjs` allocates four-digit decimal ADR filenames.
This spec and S-046/S-048 deliberately use the current allocator-compatible
format. No ID parser or historical artifact is migrated by the scoping change.

## Desired Behavior

- Keep each artifact type prefix; use the base-62 value as its visible ID.
- Enforce uniqueness within a Workbench and artifact type, including allocation
  collisions. Do not add a secondary global or cross-Workbench field.
- Preserve existing stable spec paths, citations, evidence, and lookup behavior.
  Inventory consumers before changing shared parsing or comparison.
- Define alphabet ordering, width/growth, case handling on case-insensitive
  filesystems, and legacy numeric interpretation explicitly and test them.
  These are engineering proposals until evaluated, not owner-approved details.
- Deliver compatibility in slices; a new notepad may use a locally unique
  provisional visible ID while universal allocation is unimplemented.

## Decisions And Contracts

ADR-0041 and LEXICON own accepted identity semantics. S-046 records the source
reconciliation and current promotion authority. Source Q17C's parallel-field
wording is superseded by the owner's correction; Q17D fixes uniqueness scope.
No fixed alphabet, truncation length, sorting order, or big-bang renumbering was
accepted. Do not reinterpret an old decimal ID as a base-62 ordinal silently.

## Non-Goals

Cross-Workbench federation, secondary global IDs, renaming stable spec paths,
or downstream rollout during this scoping assignment.

## Dependencies And Blockers

No owner decision blocks a compatibility proposal. A change to visible meaning
or a lossy migration must be brought back as a concrete product tradeoff.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Allocate and retrieve one new visible notepad ID through a tested CLI while legacy numeric records still resolve | done | none | ffa02b1e4680e012db5bfd13e3938f25e390376b:45 notepad and3 allocator cases green after public red regressions; full35-command union green; independent bounded repair review PASS; receipt-backed installed CLI allocation and explicit ID lookup pass; guardrail78/100 unchanged |
| TK-002 | Extend visible-ID compatibility through spec ticket and ADR consumers without renaming historical paths | done | TK-001 | c78e24661de6a28259c4f9520c6e06ee617d83a3:11 consumer,4 allocator,65 layout,10 ADR and45 notepad cases; full36-command union passes; independent repaired candidate PASS; guardrail78 unchanged with4 outcome recommendations |

### TK-001 - Compatibility tracer bullet

**Stance:** Builder

Trace allocation -> storage -> discovery -> CLI lookup -> tests. Demonstrate
duplicate refusal, independent type scopes, leading zero and case behavior,
and unchanged legacy lookup. Coordinate the shared notepad seam with S-046;
do not force every artifact migration into the first slice.

### v3.2.0 assigned completion (2026-09-08)

**Stance:** Builder

[S-050](../S-050-workbench-v3-2-0-release/SPEC.md) assigns this capability through
verified delivery. TK-001 tests the note allocator first. TK-002 inventories
all parser, sorting, route, CLI, diagnostic, rendering, citation and allocator
consumers of specs, tickets and ADRs, then enables the same visible syntax.
Engineering defaults: alphabet 0-9 A-Z a-z, no silent numeric reinterpretation,
legacy numeric labels resolve exactly; new allocation refuses case-folded
collisions on supported filesystems. Width/growth must be tested and documented
before selection, and IDs never rename existing stable spec paths. Independent
Workbench connection identity under S-052 is a namespace, not another ID on
each artifact. Test old/new mixed lookup and duplicates at public CLI seams;
record full consumer coverage and remaining unsupported artifacts explicitly.

## Evaluated Compatibility Defaults

The first note slice uses alphabet `0-9 A-Z a-z`, minimum width three, and
unbounded width growth through BigInt arithmetic. Allocation selects the first
unoccupied label without decoding old numeric labels as an ordinal high-water
mark. Case-folded and leading-zero aliases reserve one identity; prefixes have
independent Workbench scopes. Existing visible IDs and filenames remain intact.
The allocator also reserves existing destination-name aliases, including a
legacy filename whose stored ID differs. Creation publishes exclusively; a file
appearing after preflight is preserved. One writer remains the supported model.

`--note` keeps its original filename/path semantics. `--id` explicitly selects
stored identity and refuses unknown or ambiguous matches; it cannot silently
fall back to a different record's filename. Unreadable inventory blocks identity
allocation/lookup until reconciled. No perpetual registry of deleted local notes,
distributed lock, chronology encoding or automatic renumbering is claimed.

The TK-002 consumer inventory found 49 existing specs carrying `TK-001` at
`f074b9e3e34a64d868be68a2419b2532cb7f6389`. The two accepted requirements—type
and Workbench uniqueness for new visible IDs, and preservation of legacy
references—require an explicit compatibility boundary: existing numeric ticket
references remain spec-qualified and unchanged; they are not retroactively
claimed globally unique. New ticket allocation must reserve the whole Workbench
inventory while tolerating the pre-existing numeric repetitions as reservations.
Case/alias collisions and new duplicate labels need explicit diagnostics. This
is the preservation-safe engineering interpretation of the accepted requirements,
not a new owner decision or implementation claim. TK-002 tests and review must
challenge it before delivery.

## TK-001 Verification Account

Initial public allocation/duplicate/inventory cases failed before implementation;
the shared encoder/allocator seam was absent. Candidate `f074b9e` passed 42
notepad, three allocator and 62 layout cases, with a receipt-backed installed
runtime allocating and reading a visible note. Its full 35-command union passed
34 checks; the privacy test flagged ordinary identifier variable names as
credential assignments. These are source-code expressions, not credentials.
The names were changed to suffix; the scanner and criteria were unchanged.

Independent review returned CHANGES REQUIRED despite those targeted passes:
unmatched identity lookup could return a legacy filename with a different ID,
and that filename could stall allocation. Two expected red regressions drove
explicit selectors and destination reservations at `8e9978a`; a third reservation
case drove alias handling independent of filesystem sensitivity at `2bc4284`.
The publication-race regression separately failed before exclusive creation was
added. The repaired target passes 45 notepad cases and three allocator cases.
Final candidate `ffa02b1e4680e012db5bfd13e3938f25e390376b` passed the full
35-command union and a fresh independent bounded review. The repaired installed
runtime allocated N-001 and retrieved it through explicit identity selection;
its receipt names that exact candidate. Guardrail score remains 78/100 with four
outcome-evidence recommendations. Spec/ticket/ADR compatibility remains TK-002;
no overall identifier or release acceptance is closed here.

## TK-002 Consumer Coverage

The [consumer inventory](consumer-inventory.json) records the parser, allocator,
route, sort, diagnostic, render, citation, workflow and installation owners,
including unchanged consumers and explicitly remaining formats. Internal entry
sequence IDs and socket/actor registries retain their existing contracts.

New spec/ticket proposals and ADR allocation require a letter in the suffix.
This distinguishes new durable labels from decimal history, including removed
numeric IDs, while retaining the accepted base-62 alphabet and width growth.
Old numeric ticket references remain qualified by spec; new letter-bearing
labels are checked across the entire Workbench. `next-id` is explicitly a
read-only proposal, never a reservation or authorization to manufacture work.
Sorting is suffix-length/alphabet ordering independent of locale, not chronology.

Five public consumer cases and Genesis, Wiki, guardrail and citation-coverage
regressions exposed numeric-only gaps before repair. Candidate `16988da94dac455355aecf3c6f9d80b933b03574` passed the full 36-command
union and scored 78/100 with the same four outcome recommendations. Independent
review nevertheless returned CHANGES REQUIRED: Genesis truncated grown IDs;
allowed legacy numeric ticket aliases conflicted during proposal allocation;
and ADR enumeration omitted matching nonordinary entries. Two grown-width
Genesis cases and five reservation/unsafe-entry cases reproduced these failures.
The repair extracts the full directory ID, collapses only already-validated
reservations by identity key, and refuses unreadable/nonordinary ADR inventory
without following links. Historical record bytes and references stay intact.
Candidate `ff706cb0a07a66f9932e5313298c575e16d32905` passes 10 consumer,
10 ADR, 65 layout cases and the full 36-command union. Fresh review confirmed
all three repairs but found a further selection mismatch: mixed ready tickets
could make next choose TK-00A while claim used table order and started TK-010.
An expected red regression drives one shared candidate selector for both paths;
claim still starts an eligible ready ticket in its explicitly assigned spec.
Final candidate `c78e24661de6a28259c4f9520c6e06ee617d83a3` passes all 36
required commands, including 11 consumer, four allocator, 65 layout, 10 ADR
and 45 notepad cases. Independent review passes after checking all repairs,
dependency filtering and assigned-spec isolation. Guardrail remains 78/100 with
four outcome-evidence recommendations; no comparative outcome gain is claimed.
The one-command demo is `node tools/test-visible-id-consumers.mjs` (about two
seconds). Integration delivery remains the whole-release S-050 gate.

## Acceptance Criteria

- [x] The accepted visible-ID semantics work through allocation and lookup.
- [x] Legacy references and stable paths are preserved with named compatibility proof.
- [x] Collision, case, width/growth, and alphabet behavior are explicit and tested.
- [x] A consumer inventory and staged migration account for specs, tickets, ADRs, notes, and other supported artifacts.
- [ ] Root/template docs, full suite, guardrail comparison, and independent review agree with implemented support.

## Testing Seams

Allocator and public lookup commands, old record fixtures, duplicate/type scope,
case-insensitive filesystems, and existing citation/lifecycle checks.

## Verification Procedure

Red/green targeted tests, full AGENTS suite, render, doctor, guardrail before/
after, legacy reference read-back, and independent candidate review.

## Documentation Impact

LEXICON/ADR-0041 hold semantics; RUNBOOK and shared tooling document exact
allocation behavior once implemented. Root and generic templates stay aligned.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-06 | spec | Accepted identity direction captured without inventing compatibility details | S-046 source reconciliation Q17C/Q17D; numeric consumers inspected at 8e9c06f | ADR-0041, LEXICON, and this spec | Runtime allocation and migration unimplemented |
| 2026-09-08 | TK-001 | Ticket closed | ffa02b1e4680e012db5bfd13e3938f25e390376b:45 notepad and3 allocator cases green after public red regressions; full35-command union green; independent bounded repair review PASS; receipt-backed installed CLI allocation and explicit ID lookup pass; guardrail78/100 unchanged | Root/template Runbook, core notepad skill, managed packaging and S047 compatibility/adverse-review account updated; scanner criteria unchanged | TK002 spec ticket ADR consumers and whole-release integration remain; no eternal deleted-ID registry or distributed allocator claim |
| 2026-09-08 | TK-002 | Ticket closed | c78e24661de6a28259c4f9520c6e06ee617d83a3:11 consumer,4 allocator,65 layout,10 ADR and45 notepad cases; full36-command union passes; independent repaired candidate PASS; guardrail78 unchanged with4 outcome recommendations | Root/template Lexicon and Runbook, planning skills, ADR0041, consumer inventory and adverse-review account updated; historical paths retained | Whole-release integration review and remote containment remain S050; legacy numeric ticket labels stay spec-qualified |

## Completion Result

Both implementation tickets are verified. Final whole-release integration and
remote containment remain S-050; no release readiness is claimed here.

## Remaining Limitations Or Follow-Up Specs

S-046 owns the local notepad foundation. Release ordering and backward
compatibility tradeoffs remain in the local rollout grilling record.

## Supersession

- Supersedes: none.
- Superseded by: none.
