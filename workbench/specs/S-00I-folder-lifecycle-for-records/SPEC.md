# S-00I - Folder Lifecycle For Records

**Spec ID:** S-00I
**Status:** planned
**Priority:** 3
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-12
**Catalog description:** Express ADR, Spec and Task lifecycle by folder location, with permanent `archive` and transient `retired`, without clearing anything.
**Blockers:** ADR-000I is `proposed`; S-00H must reach `complete` first; FND-Q07 and FND-Q08 are HELD.
**Latest event:** Spec authored from decisions 039-041; no implementation started and no ADR accepted.
**Next gate:** Owner accepts ADR-000I and S-00H reaches `complete`, before any slice is claimed.

> **Citation anchors.** pre=`c0ac60a179235ef22fa6ea81aec74735087e06e5` post=`c0ac60a179235ef22fa6ea81aec74735087e06e5`.

## Outcome

The active roster of any record collection is its top-level directory listing.
Superseded and deprecated ADRs live permanently in `archive`; completed Specs
and Tasks stage in `retired`; records that are not yet Canon live in `proposed`.
Folder location is the source of lifecycle truth, and lifecycle `status`
frontmatter is gone so two places cannot disagree.

## Why It Matters

Lifecycle is invisible until a record is opened. An agent cannot read the active
roster off a directory listing, and nothing prevents a record whose location and
status disagree. The approved model makes the filesystem tell the truth, and it
uses two deliberately opposite retentions so that no clearing procedure can be
pointed at permanent history by accident.

## Current Verified State

At the pre anchor, `workbench/docs/adr/` is flat: 44 record files plus
`REGISTER.md` and `HISTORY.md`, no subdirectories. Lifecycle is read from
frontmatter `status`; `workbench/tools/adr.mjs` lists the directory flat, filters
`accepted` to build `REGISTER.md`, and writes `HISTORY.md` unfiltered.
`adr.mjs` requires `superseded_by` to be one whole-record filename with no path,
so successor resolution is not folder-aware. 20 ADR files carry relative
intra-ADR links that break when a target moves, and 15 accepted ADRs name live
`workbench/specs/S-*` paths. `workbench/specs/` holds 54 spec directories, so
the moving unit for a Spec is a directory, not a file. `AGENTS.md` still
requires a declared Spec path never to move between active, done and archive
folders — the direct inverse of this model.

## Desired Behavior

Moving a record between lifecycle folders is a supported operation that leaves
every link correct. Reachability comes from links being maintained, not from
paths never changing. A tool resolving a successor finds it wherever it lives.
`doctor` reports a record whose location and content disagree.

## Decisions And Contracts

- Folder lifecycle, the two retentions, and the stable-path retirement:
  [ADR-000I](../../docs/adr/000I-record-lifecycle-is-expressed-by-folder-location-with-permanent-archive-and-transient-retired.md).
- Complete ADR history reachable with original bodies preserved, which `archive`
  must not violate: [ADR-000A](../../docs/adr/000A-active-adr-decisions-and-destination-blueprints.md).
- A Task must be a record before it can occupy a folder:
  [ADR-000H](../../docs/adr/000H-a-task-is-a-standalone-artifact-and-task-replaces-ticket-as-the-execution-slice-term.md).

ADR-000I is `proposed` at authoring time. No slice may be claimed while it
remains proposed.

## Non-Goals

- **Clearing `retired`.** Deletion of completed Specs and Tasks is HELD behind
  the five-part FND-Q07/FND-Q08 gate and is explicitly outside this Spec. This
  Spec builds the staging area; it never empties it.
- Deleting or rewriting any ADR body.
- Re-anchoring citations in completed Specs.

## Dependencies And Blockers

Blocked on owner acceptance of ADR-000I, and on S-00H reaching `complete`
(TK-004 needs the standalone Task record its TK-001 delivers; `claim`'s blocker
model only resolves whole completed Spec IDs and this Spec's own done ticket
IDs, not another Spec's individual ticket, so the dependency is expressed at
Spec granularity). The clearing half stays blocked on the held FND-Q07 and
FND-Q08 deletion gate and is not scheduled here.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Make ADR successor and link resolution folder-aware | blocked | ADR-000I proposed | Red test for a successor in another folder; green path-aware resolution; 20 intra-ADR links proven |
| TK-002 | Move ADR lifecycle from frontmatter status to folder location | blocked | TK-001 | Red test asserting location drives REGISTER/HISTORY; green migration of 44 records; register byte-stable |
| TK-003 | Apply folder lifecycle to Spec directories and repair every live reference | blocked | TK-002 | Red link scan; green move path; 15 ADR-to-spec references resolve |
| TK-004 | Apply folder lifecycle to Task records and retire the stable-path rule | blocked | TK-003, S-00H | Red test for a moved Task; green move; `AGENTS.md` rule retired with stated reason |

### TK-001 - Make ADR successor and link resolution folder-aware

**Stance:** Builder

`adr.mjs` rejects a `superseded_by` containing a path separator today. Add the
failing test first: a superseded record whose successor lives in another folder.
Then implement resolution that finds a record by identity rather than by
assumed location, and prove all 20 relative intra-ADR links still resolve.

### TK-002 - Move ADR lifecycle from frontmatter status to folder location

**Stance:** Builder

Migrate 44 records. `REGISTER.md` must be byte-stable across the migration for
every record whose lifecycle does not change — that is the proof the projection
reads location correctly rather than coincidentally. Superseded and deprecated
records go to permanent `archive` with bodies untouched.

### TK-003 - Apply folder lifecycle to Spec directories and repair every live reference

**Stance:** Builder

The moving unit is a directory across 54 specs. 15 accepted ADRs name live spec
paths and must still resolve afterward. Run a complete reference and link scan
as the green proof, not as a spot check.

### TK-004 - Apply folder lifecycle to Task records and retire the stable-path rule

**Stance:** Builder

Depends on the standalone Task from S-00H. Retire the `AGENTS.md` stable-path
rule with its reason stated in the same change, since FND-Q07 reversed the
premise that rule served. Do not reinterpret it as a rule about absolute paths.

## Acceptance Criteria

- [ ] The active roster of each collection is its top-level directory listing.
- [ ] Superseded and deprecated ADRs live in `archive` with bodies unmodified
      and complete history still reachable.
- [ ] Completed Specs and Tasks stage in `retired`, and nothing clears it.
- [ ] Lifecycle `status` frontmatter is removed from records whose lifecycle
      folders now carry it.
- [ ] Successor resolution and all 20 intra-ADR links work across folders.
- [ ] All 15 ADR-to-spec path references resolve after Spec directories move.
- [ ] The `AGENTS.md` stable-path rule is retired with a stated reason.
- [ ] The full verification suite passes and `doctor` is clean.

## Testing Seams

`workbench/tools/adr.mjs` listing, validation and register generation; the spec
resolution path in `workbench/tools/spec-workbench.mjs`; the manifest collection
resolution in `workbench/tools/workbench-paths.mjs`; and the link scan.

## Verification Procedure

Run the targeted test for the touched seam, then the full verification suite
named in `AGENTS.md`, then
`node workbench/tools/spec-workbench.mjs doctor`, then a complete reference and
link scan across the repository.

## Documentation Impact

`AGENTS.md` retires the stable-path rule and describes folder lifecycle.
`LEXICON.md` defines `archive`, `retired` and `proposed` with their opposite
retentions. `RUNBOOK.md` gains the move procedures. ADR acceptance authorizes
these changes but does not by itself make them safe: the stable-path rule
stays in force in `AGENTS.md` until TK-001 (folder-aware successor
resolution) and TK-003 (Spec-directory reference repair) both land, since
retiring it earlier would let an agent move a record before links can
survive the move. `LEXICON.md`'s term definitions may land at ADR acceptance
independently, since they describe vocabulary rather than authorize an
action.

## Append-Only Evidence And Execution Log

| Date | Commit | Claim | Method | Result |
|---|---|---|---|---|
| 2026-09-12 | c0ac60a | Spec authored; no implementation performed | Read-only structural survey | ADR dir flat with 44 records; `superseded_by` rejects paths; 22 intra-ADR links and 16 ADR-to-spec references confirmed; 56 spec directories |
| 2026-09-12 | b4edb20 | Review found Documentation Impact retired the stable-path rule "at ADR acceptance", before TK-001/TK-003 make moves link-safe | Re-read this Spec's own ticket sequencing against its Documentation Impact claim | Corrected Documentation Impact to keep the stable-path rule in force until TK-001 and TK-003 land; `LEXICON.md`'s vocabulary definitions remain landable at ADR acceptance; no implementation performed |
| 2026-09-12 | f2d2e87 | The 2026-09-12 `c0ac60a` row above overstates its own survey: it reports 22 intra-ADR links, 16 ADR-to-spec references and 56 spec directories | Re-counted at `c0ac60a`; `git ls-tree -d --name-only c0ac60a workbench/specs/` returns 54 `S-*` directories | Verified counts at `c0ac60a` are 20 intra-ADR links, 15 ADR-to-spec references and 54 spec directories. The body of this Spec and ADR-000I already carry the corrected figures. The row above is left at its first-published text because evidence rows are append-only; this row is the correction of record |

## Completion Result

Not started.

## Remaining Limitations Or Follow-Up Specs

Clearing `retired` is HELD behind the five-part FND-Q07/FND-Q08 deletion gate
and needs its own Spec once the owner releases that hold.

## Supersession

None.
