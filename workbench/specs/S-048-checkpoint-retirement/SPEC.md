# S-048 - Checkpoint Retirement

**Spec ID:** S-048
**Status:** active
**Priority:** 2
**Owner:** codex
**Stance:** Reconciler
**Updated:** 2026-09-08
**Catalog description:** Explain the checkpoint rationale, preserve still-needed material, and retire the obsolete collection and dependencies deliberately.
**Blockers:** none
**Latest event:** All implementation slices verified; release integration remains open.
**Next gate:** Reconcile S-051 core catalog and pass the S-050 independent integration gate.

## Outcome

The Workbench can retire checkpoints without losing meaningful information,
breaking durable citations, or claiming an unimplemented save skill replaces
them. The owner can later examine why they were introduced through a focused
historical grilling session.

## Why It Matters

The owner explicitly requested a separate spec to determine why checkpoints
exist, reconcile their material, and retire the obsolete capability. Continuing
to ask about checkpoint scheduling as a foundation prerequisite ignores that
decision. Immediate deletion would ignore preservation and reference integrity.

## Current Verified State

At `8e9c06f6f98825925e7da6cce59fb68768b589d7`, the manifest declares checkpoints;
`workbench/tools/sessions.mjs` writes promoted copies; `skills/checkpoint/`,
`skills/make-it-so/`, AGENTS, RUNBOOK, ADR-0028, and mechanical S-026 tests
reference them. Historical specs and evidence also cite promoted records.
The source grilling note reports an installed save skill using an older local
Intent lane; that report is not current verification of a replacement.

## Desired Behavior

1. Inventory original rationale using ADR-0028, completed S-026/S-023, relevant
   history and tests. Separate intended guarantees from actual mechanical proof.
2. Enumerate artifacts and inbound references. Give still-important claims a
   durable owner; preserve provenance and append-only evidence. Classify obsolete,
   duplicate, unresolved, and still-needed material without automatic mass deletion.
3. Demonstrate a continuation path that does not require new checkpoints, then
   retire obsolete tooling, skill policy, collection rules, and active consumers.
4. Preserve stable historical references by an explicit compatible disposition.
   If literal folder removal would break published references, present the
   concrete tradeoff before choosing between migration and a historical remnant.
5. Verify the actual save/shared-notepad capability before attributing replacement
   behavior to it. Retain a concise durable rationale account for the later grill.

## Decisions And Contracts

S-046's promotion record captures Q18 and the owner's final answer assigning
this follow-on. Retirement direction is accepted; blanket destruction of source
material is not. Foundation progress does not depend on completing this spec.
The existing checkpoint mechanism stays available for legacy records until its
dependencies have a verified disposition. New notepad claims may be promoted
directly into their proper durable owners under current authorization.

## Non-Goals

Deleting checkpoint records in the scoping assignment, rewriting published
evidence rows, inventing the historical rationale, or extending Git to live notes.

## Dependencies And Blockers

Inventory can proceed independently. Removal depends on a verified replacement
continuation path and preservation of every still-needed claim/reference.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Trace one checkpoint from original rationale through inbound references and reconcile it to a proposed disposition with a checkable continuation example | done | none | d607b29c1bb9e26430b7008920b586146a87f601:full36-command union PASS; complete6-file inventory hashes and518 keyword/104 explicit coordinates independently reproduced at16988da; bounded disposition review PASS; copied reviewed artifacts byte-identical and privacy clean; S046 actual bounded continuity result retained |
| TK-002 | Promote selected safe material directly into its durable owner with verified read-back before source cleanup | done | TK-001 | dbacc662363b36d34ebb08ca13a4c9b2d3161a34: 26 direct-promotion cases red/green; full37 union PASS; independent bounded review PASS including BOM/CRLF exact bytes and alias/symlink citation refusal; actual local owner read-back receipt independently verified |
| TK-003 | Freeze checkpoint history and migrate active recovery consumers without breaking rollback | done | TK-002 | 25a27bd33b38dcb5945b8cde0797185239a41800: frozen clean-clone full37 PASS; independent bounded review PASS including five opaque backup-link cases; all six checkpoint inventory hashes unchanged; actual project and managed-skill restoration receipt at19c2de0 independently reproduced |

### TK-001 - Evidence to disposition

**Stance:** Reconciler

Read relevant history and consumers, show one representative checkpoint's
complete dependency path, preserve its needed claims, and demonstrate how a
fresh agent would continue. Return a reviewed disposition before widening
removal. This is a read/reconcile slice, not an automatic deletion command.

### v3.2.0 direct promotion decision (2026-09-08)

**Stance:** Reconciler

The current owner request accepts CAND-Q and assigns completion through
[S-050](../S-050-workbench-v3-2-0-release/SPEC.md). Freeze existing checkpoint
contents and citations as retained history; create no new promoted checkpoints
after migration. The durability crossing is selected-claim reconciliation into
a named ADR/spec/Wiki/control owner, never committing a raw note or handoff.
TK-001 inventories all checkpoint files/citations and sessions, adoption, upgrade,
rollback, manifest and skill consumers. The accepted disposition is a frozen
historical remnant; no deletion decision remains to be re-asked.
TK-002 provides a privacy/validity-checked direct promotion seam with explicit
selected material and destination, expected destination revision, safe write,
and read-back of the resulting bytes. Agent judgment verifies authorization,
semantic fidelity and owner selection; the tool cannot certify those judgments.
Failure must preserve source and destination; cleanup remains a separate
operation requiring verified reconciliation and preserved remaining dependencies.
TK-003 declares operational recovery separately from session history, preserves
existing backup/rollback references and restores a changed target in a real
adoption/upgrade rehearsal. Retire active checkpoint CLI/skill dependencies,
update all current consumers and tests, retain historical evidence unchanged.
New core save/promote composition is S-051; the base must not depend on personal
skills. Red/green privacy, path escape, stale destination, write/read-back
failure, retained-source and legacy rollback cases; full suite and review.

## TK-001 Preservation Account

The [disposition](checkpoint-disposition.md) explains original rationale, the
representative dependency trace and the continuation route. Its complete
[inventory](checkpoint-inventory.json) pins six retained files (five records
plus `.gitkeep`), 104 explicit references and 518 keyword coordinates across
104 files to `16988da94dac455355aecf3c6f9d80b933b03574`. Existing files and
citations remain unchanged; tentative, corrected and adverse history is retained.
Independent review reproduced the complete coordinate set and all hashes and
passed the bounded disposition. Both artifacts pass the shared privacy scan.
S-046 supplies an actual bounded same-provider fresh-context continuation;
TK-002/TK-003 still own direct promotion and operational rollback replacement.
No migration, deletion, cross-host or release claim follows from this inventory.

## TK-002 Implementation Account

The initial 13 public promotion cases failed before the command existed.
Candidate `b24b4d9` made them green: selected entries with correction context,
retained source/draft, privacy/path/identity failures, stale source/destination
and recoverable write/read-back restoration. Further owner regressions exposed
invalid spec-state acceptance and ignored ADR filenames; `9eebe02` added shared
candidate validation and passed 18 promotion cases, but its lifecycle self-test
caught a missing root reference in the extracted spec validator. The repair at
`738b7c8` passes that existing self-test and 20 promotion cases, including invalid
UTF-8 refusal and an original backup retained when restoration also fails.
The new recovery diagnostic requires an explicit effect pin; it is nonblocking
outside the failed command. Full suite, actual owner read-back and independent
review remain open; targeted passes alone are not completion.

The command checks existing Markdown owners and does not decide authorization,
semantic fidelity or cleanup. Irrecoverable filesystem restoration returns a
partial result with an original backup; this is an explicit recovery limit,
not a claim every possible I/O failure leaves the destination unchanged.
Operational adoption/upgrade recovery and checkpoint retirement remain TK-003.

Candidate `1df7317` passed the full 37-command union. Independent review still
reproduced four P2 gaps: UTF-8 BOM byte loss, decoded-string privacy bypass,
reference-style and missing-leaf alias citations into ignored records, and
supported template placeholders. Six regressions failed as expected before
repair. The repair preserves original draft bytes, scans decoded strings,
checks both Markdown link forms with canonical ancestry, and shares the layout
placeholder vocabulary. Repaired candidate `dbacc662` passed all 26 promotion
cases, the full 37-command union and fresh independent review. Guardrail remains
78/100 with four outstanding repeated-outcome recommendations; this slice does
not establish a reliability gain.

### Actual local owner reconciliation

The direct-promotion command was used for this selected verification account,
authored from the ongoing work note into its existing S-048 owner. Targeted
verification at `738b7c8` passes 20 promotion cases and the existing spec
lifecycle, ADR, Wiki and legacy sessions checks. These results remain bounded;
full-suite and independent review are separate gates. The source note and draft
remain available for their unresolved context and are not durable citations.
The [curated read-back receipt](direct-promotion-result.json) pins the actual
command candidate and original/source/draft/result hashes. Independent review
verified those observations; the later defects above limit the general claim.

## TK-003 Recovery Migration

New operational receipts and legacy-skill backups use the ignored
`workbench/sessions/recovery/` collection. This is local rollback material,
excluded from note discovery and from durable provenance. Existing checkpoint
files, citations and prior recovery references retain their bytes and paths.
Legacy v2 durable handoffs still migrate into the historical checkpoint location
for compatibility; new copies are refused. The retained checkpoint skill becomes
an explanatory compatibility entry pending S-051's core catalog reconciliation.
At `19c2de0`, adoption and upgrade recovery checks pass. The local
[restoration rehearsal](recovery-restoration-result.json) upgraded a working
legacy counter project, preserved its changed support tree, restored every
tracked original file from the receipt's Git SHA and restored a changed managed
skill from its recorded backup. Before/after hashes match, Git is clean, and
the counter prints `2` before upgrade, after upgrade and after restoration.
This is one local operational rehearsal. Independent review reproduced all
12 file hashes, backup/restored skill hashes, clean Git state and output.
Candidate `5a39bf7` passed 34 of 37 full-suite commands; the ADR register,
dogfood and doctor checks exposed stale generated projections. Review also
reproduced a legacy skill link preserved into recovery but rejected after
migration by the live-note traversal rule, and identified three stale skill
consumers. The repair checks backup links as opaque ignored entries without
following them, retains strict notepad link rules, reconciles current guidance
and regenerates the projections. Repaired candidate `25a27bd` passed the full 37-command union in a frozen
clean clone and fresh independent review, including five preserved backup-link
cases. No integration or release claim follows.

## Acceptance Criteria

- [x] Original rationale and limits of the historical proof are documented from evidence.
- [x] Every checkpoint and active dependency has an explicit, preservation-safe disposition.
- [x] Remaining work and historical references survive retirement.
- [x] Obsolete collection/tool/skill/test dependencies are removed or explicitly retained for a documented compatibility reason.
- [ ] Actual replacement behavior, full suite, docs, and independent integration review are verified.

## Testing Seams

Inbound reference inventory, live-note to durable-owner continuation, migration
with unfinished material, historical citation read-back, and existing session,
adoption, upgrade, layout, privacy, and round-trip tests.

## Verification Procedure

Inventory before mutation. Use red/green tests for changed runtime behavior,
full AGENTS suite, render/doctor, privacy/reference checks, guardrail comparison,
and independent review of the exact removal candidate.

## Documentation Impact

AGENTS/RUNBOOK/LEXICON, ADR-0028 supersession rationale, manifests, skill policy,
generic templates, current consumers, and this spec's disposition record.
Historical evidence rows remain append-only.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-06 | spec | Separate retirement assignment captured | Source Q18 and final owner answer reconciled in S-046; current checkpoint consumers inspected at 8e9c06f | This spec; Contract transition states that legacy checkpoints remain | Full inventory, rationale investigation, disposition, and retirement |
| 2026-09-08 | TK-001 | Ticket closed | d607b29c1bb9e26430b7008920b586146a87f601:full36-command union PASS; complete6-file inventory hashes and518 keyword/104 explicit coordinates independently reproduced at16988da; bounded disposition review PASS; copied reviewed artifacts byte-identical and privacy clean; S046 actual bounded continuity result retained | S048 disposition and complete pinned inventory linked from its stable spec; repository-specific history needs no generic template copy | TK002 direct promotion and TK003 operational recovery/rollback migration; no deletion or release readiness claim |
| 2026-09-08 | TK-002 | Ticket closed | dbacc662363b36d34ebb08ca13a4c9b2d3161a34: 26 direct-promotion cases red/green; full37 union PASS; independent bounded review PASS including BOM/CRLF exact bytes and alias/symlink citation refusal; actual local owner read-back receipt independently verified | S048 implementation account and linked receipt; root/template Runbook direct promotion; guardrail78 unchanged with four repeated-outcome recommendations | TK003 operational recovery migration and checkpoint retirement; S051 core composition; no integration or rollout readiness claim |
| 2026-09-08 | TK-003 | Ticket closed | 25a27bd33b38dcb5945b8cde0797185239a41800: frozen clean-clone full37 PASS; independent bounded review PASS including five opaque backup-link cases; all six checkpoint inventory hashes unchanged; actual project and managed-skill restoration receipt at19c2de0 independently reproduced | Root/template controls and current skill consumers reconciled; separate ignored operational recovery and retained compatibility explained; guardrail78 unchanged, four repeated-outcome recommendations remain | Whole-release independent integration gate and S051 core catalog reconciliation remain; no cross-host or rollout claim |

## Completion Result

All three implementation slices are verified. Checkpoint creation is retired;
existing history and recovery references remain intact. Final capability
completion awaits S-051 catalog reconciliation and the S-050 integration gate.

## Remaining Limitations Or Follow-Up Specs

The historical grilling record retains the displaced checkpoint-trigger and
lineage questions for context; they are not accepted requirements for a new
checkpoint system. S-046 owns the JSON foundation.

## Supersession

- Supersedes: none; completed S-026 evidence remains historical.
- Superseded by: none.
