# Landmark Tracker

This directory is the Landmark Tracker root declared by the `landmarkTracker`
block in [`workbench/manifest.json`](../manifest.json). It holds two flat JSON
record collections and one generated projection:

| Path | Holds | Author |
|---|---|---|
| `destination-questions/<ID>.json` | Destination Question Cards (DQCs), `DQC-` identities | the runtime, on an agent's or owner's command |
| `landmarks/<ID>.json` | Landmarks, `LMK-` identities | the runtime, on an agent's or owner's command |
| `TRACKER.json` | The generated documentation-progress view | `rebuild` only; never edit by hand |

What these records mean, and why the Tracker exists beside the Taskboard, is
owned by [S-01T](../specs/S-01T-landmark-tracker-foundation/SPEC.md) and
[ADR-000N](../docs/adr/000N-landmark-tracker-connects-evolving-understanding-to-durable-knowledge.md).
This file owns only the procedure. A record, the projection or a confirmed
answer never grants implementation or promotion authority.

All commands run from anywhere inside the room (or take `--path DIR`) and
accept `--json` for a machine-readable result. A refusal exits 1 and names its
code: `tracker-undeclared`, `invalid-manifest`, `missing-collection`,
`unsafe-path`, `invalid-record`, `identity-collision`, `unknown-identity`,
`stale-revision`, `private-content`, `dependency-cycle`, `projection-drift` or
`invalid-invocation`.

## Capture

Capture a DQC as soon as a meaningful concept exists, before any landmark,
Spec, Task, final answer or Wiki destination:

```bash
node workbench/tools/landmark-tracker.mjs capture \
  --title "A meaningful concept name" \
  --question "The synthesized question this concept answers" \
  --source WF-8H@<revision> --source <another-question-id> \
  --uncertainty "What is still unknown" \
  --reason "Why this card exists"
```

`--source ID@REVISION` keeps each contributing source identity and the
revision it was read at (`ID` alone records an unknown revision). The card is
stored with an empty landmark relation, no answer, no Expected result, no
Result and no assessment. Its captured title, question and sources are kept
as `origin` and never change. The identity is allocated through the shared
visible-identity allocator; `--id DQC-...` preserves an existing identity and
is refused if it is already held.

Capture a landmark the same way when an important feature or framework pillar
emerges:

```bash
node workbench/tools/landmark-tracker.mjs add-landmark \
  --title "Pillar name" --summary "What it covers" \
  --importance "Why it matters" --reason "Which cards it emerged from"
```

## Revise

Every revision names the revision you read and a reason:

```bash
node workbench/tools/landmark-tracker.mjs show DQC-001 --json   # read revision N
node workbench/tools/landmark-tracker.mjs revise DQC-001 --expect-revision N \
  --title "A clearer name" \
  --answer "The owner's answer" \
  --confirm "Who confirmed what scope" \
  --expected-change "The intended durable change" --expected-home "where it belongs" \
  --source <new-question-id>@<revision> \
  --correction "What an earlier reading got wrong" \
  --resolve-uncertainty "An uncertainty now settled" \
  --reason "Why this changed"
```

Retitling never reallocates the identity. Each revision appends a history
entry recording each changed field's before and after, its reason and its
time; corrections stay in that history. Expected result (the intended durable
change and its home) is distinct from Result (achieved delivery). A landmark
revises its `--title`, `--summary` and `--importance` the same way.

Assess documentation progress with fractions over the exact vocabulary Idea,
Aligning, Confirmed, Mapped, Planned, Journey, Review, Verified. Fractions sum
to one and always carry a basis and at least one piece of evidence:

```bash
node workbench/tools/landmark-tracker.mjs revise DQC-001 --expect-revision N \
  --assess Journey=0.6,Review=0.4 \
  --basis "How the fractions were judged" --evidence "<artifact>@<revision>" \
  --reason "Why the assessment changed"
```

A status such as `done` is not a step and is refused; completing a Task never
stands in for Verified.

A DQC's own assessment can instead be derived from its related items (see
[Relate](#relate-constituents)): `--assess derived --basis "..."`, with no
`--evidence`, because the evidence is the related items' own. A derived card
contributes the mean of its related items' fractions, is `derived-incomplete`
while any of them is unassessed or unknown, and is refused with
`dependency-cycle` - naming the chain, for example `DQC-001 -> DQC-004 ->
DQC-001` - if it would depend on itself through other derived cards.

### Claims and changed understanding

Name the specific statements a card's documentation must carry, and the
evidence for each:

```bash
node workbench/tools/landmark-tracker.mjs revise DQC-001 --expect-revision N \
  --claim "C1=The statement" --claim-evidence "C1=<artifact>@<revision>" \
  --reason "Why these claims"
```

Evidence is appended with the record revision it was recorded at and is never
replaced. When understanding changes, the same revision that changes it names
each claim it affects and assesses why:

```bash
node workbench/tools/landmark-tracker.mjs revise DQC-001 --expect-revision N \
  --answer "The corrected answer" \
  --affects "C1=Why C1 no longer holds as stated" --reason "Why it changed"
```

`--affects` is refused unless the revision changes understanding (title,
question, answer, confirmation, Expected result, sources, uncertainty,
corrections or assessment), names an existing claim, and does not also
re-evidence that claim. The claim becomes `affected` - with what changed, why
and the revision - and appears in the projection's `reconciliation` list until
new `--claim-evidence` for it is recorded at a later revision. Other claims,
the card's assessment and every record related to it are untouched: a relation
alone never makes a target stale.

## Link

Connect a DQC to zero, one or several landmarks, at any time:

```bash
node workbench/tools/landmark-tracker.mjs link DQC-001 --landmark LMK-001 \
  --expect-revision N --reason "Why this concept belongs to that landmark"
```

The relation lives on the DQC. Linking an unknown landmark is refused.

## Relate constituents

Declare what contributes to a DQC's documentation progress - related grilling
questions, Specs, ADRs, Tasks and other DQCs - by type and room-scoped
identity:

```bash
node workbench/tools/landmark-tracker.mjs relate DQC-001 --item spec:S-01T@<revision> \
  --expect-revision N --reason "Why it is related" \
  [--assess Planned=1 --basis "..." --evidence "<artifact>@<revision>"]
```

`--item` is `TYPE:IDENTITY[@REVISION]` with `TYPE` one of `dqc`,
`grilling-question`, `spec`, `adr` or `task`. A letter-bearing Task label
(`task:TK-01X`) is unique in the room; a legacy numeric one is unique only in
its Spec and must be written Spec-qualified (`task:S-00H/TK-003`), keeping
those bytes - a bare numeric label is refused. The relation and any assessment
of a non-DQC item live on this DQC's record; there is no second assessment
store. A related DQC contributes its own record's assessment, so assessing the
relation is refused. `relate` on an item already related re-assesses it
(`--assess`) or records a newer `@REVISION`; with neither it is refused.

Specs, Tasks and ADRs resolve against the room's own lanes in any lifecycle
folder (`room`), DQCs against the Tracker (`tracker`); an identity that does
not resolve is `unknown` and makes every aggregate holding it incomplete.
Grilling questions live in untracked notes a clone does not have, so they are
taken as `declared`. The resolver reads identities only, never a record's
status: a done Task or an accepted ADR contributes only what an assessment
says. A capture's `--source` lineage is navigation; a source counts once it is
declared with `relate`. Every declared item counts as one unit - there is no
supporting-reference exclusion and no effort weight.

## Rebuild

Every successful write rebuilds `TRACKER.json`. Rebuild it explicitly, or
check that it is current, with:

```bash
node workbench/tools/landmark-tracker.mjs rebuild
node workbench/tools/landmark-tracker.mjs rebuild --check   # refuses projection-drift
node workbench/tools/landmark-tracker.mjs show              # readable view
```

The projection is derived from the records and the room's resolvable
identities and is byte-for-byte deterministic, so a fresh clone rebuilds the
same view. It shows meaningful titles, an explicit `No landmark` group, each
card's origin, sources, corrections, history, assessment, related items,
`relatedBy`, expandable `lineage` and claims, an `items` index of every
distinct identity with its holders, a `reconciliation` list, and per-step
distributions at three scopes:

`percentage = sum(item contributions to step) / distinct item count * 100`

| Scope | Distinct items counted |
|---|---|
| Card (`questions[].distribution`) | the DQC itself and its declared related items |
| Landmark (`landmarks[].aggregate`) | the union of its DQCs' card scopes |
| Workbench (`workbench`) | the union of every card scope |

Each aggregate carries its `numerators` (per-step sums), `denominator`,
`counted` identities, a `bySourceType` breakdown, and a `contributions` row
per item with its fractions, basis, evidence, the revision it was assessed at,
the record holding it and the item revision read - the fraction rationale and
evidence revision at every scope. A card with 0.6 Journey / 0.4 Review plus one
related Verified item gives 30% Journey, 20% Review, 50% Verified at card,
landmark and Workbench scope alike.

A shared identity counts once in an aggregate, and stays visible beneath each
card that relates it (`relatedBy`, `items[].holders`). A related DQC is one
item carrying its own assessment; expanding its lineage shows its children for
navigation but never adds them to the parent's aggregate. A DQC met again on
the lineage path is marked `cycle` and not expanded: navigation cycles are
kept. Outcomes are explicit:

| Status | When | Distribution |
|---|---|---|
| `empty` | no items | none; never completion |
| `incomplete` | an item is unassessed or unknown | computed, the missing items in the denominator and named |
| `invalid` | a fraction is nonfinite, negative, an unknown step or does not sum to one, or one identity carries two different assessments | withheld; the item is named with its codes and never dropped |
| `complete` | every item assessed | computed |

Writes refuse invalid fractions, so an invalid state reaches the view only
through two relations assessing one identity differently; a bad fraction that
arrives on disk refuses `rebuild` with `invalid-record` instead.

Schema 1 records written before these fields existed still load, and are
upgraded to schema 2 (empty related and claims lists, recorded in history) on
their next write.

## Write safety and the concurrency guarantee

Before the first byte is written, a mutation is validated as a complete
record, checked against the whole inventory (identity collisions, unknown
landmarks), privacy-scanned (records are tracked in Git) and preflighted for
unsafe, symlinked or hard-linked paths. The record and the projection are then
each published through a temporary file and an atomic rename; a new record is
published with a no-replace link, so two captures cannot silently overwrite one
file. A refused write leaves every record and the projection byte-for-byte
unchanged.

`--expect-revision` is a stale-read check, **not a lock**. It refuses a write
based on an older revision, but two writers that both read revision N and
write within the same moment are not isolated from each other: the later
rename wins and the earlier revision's changes can be lost without an error.
Keep one writer per record at a time. Record and projection are two files, so
a crash between their renames can leave a stale projection; `rebuild --check`
detects that and `rebuild` repairs it from the records.
