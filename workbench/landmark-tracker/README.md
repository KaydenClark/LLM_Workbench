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
`stale-revision`, `private-content`, `projection-drift` or
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

## Link

Connect a DQC to zero, one or several landmarks, at any time:

```bash
node workbench/tools/landmark-tracker.mjs link DQC-001 --landmark LMK-001 \
  --expect-revision N --reason "Why this concept belongs to that landmark"
```

The relation lives on the DQC. Linking an unknown landmark is refused.

## Rebuild

Every successful write rebuilds `TRACKER.json`. Rebuild it explicitly, or
check that it is current, with:

```bash
node workbench/tools/landmark-tracker.mjs rebuild
node workbench/tools/landmark-tracker.mjs rebuild --check   # refuses projection-drift
node workbench/tools/landmark-tracker.mjs show              # readable view
```

The projection is derived from the records alone and is byte-for-byte
deterministic, so a fresh clone rebuilds the same view. It shows meaningful
titles, an explicit `No landmark` group, each card's origin, sources,
corrections, history and assessment, and per-step distributions at card,
landmark and Workbench scope:

`percentage = sum(item contributions to step) / distinct item count * 100`

Each distinct DQC counts once, even when several landmarks share it. An
unassessed card is shown as `unassessed`, stays in the denominator and makes
its aggregate `incomplete`; it is never inferred as Idea. Empty input shows no
items and no distribution. Coverage of other source types (grilling
questions, Specs, ADRs, Tasks) is S-01T TK-01Y.

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
