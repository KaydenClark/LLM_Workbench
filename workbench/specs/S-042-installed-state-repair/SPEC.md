# S-042 - Repairing Installed State The Harness Wrote

**Spec ID:** S-042
**Status:** active
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-06
**Catalog description:** Report and repair the installed state the harness itself produced - seeded lane documents behind the manifest, records without required frontmatter, and provenance placeholders - so a fix upstream reaches a room that already exists.
**Blockers:** none
**Latest event:** All three slices landed red/green: a seed record and `stale-seed`, explicit `adr`/`wiki` normalize modes, and `unverified-provenance` with a verified `record-source` command. This repository's own manifest provenance is now reported and was deliberately left unrepaired.
**Next gate:** Independent review of the exact candidate, then merge into `integration`.

## Outcome

Every class of file the harness writes into a room can be reported when it falls
behind, and can be brought current without a reinstall and without hand-editing.
A fix that lands upstream reaches the rooms that already exist, and a room's
report of its own state is trustworthy enough to compare one release against
another.

## Why It Matters

The harness manages three kinds of installed state with three different degrees
of care. Runtime tools have a receipt with per-file hashes. Installed skills
gained generation markers and the `stale-skill` and `skill-generation-unknown`
findings. Wiki contract files gained stamps and `stale-stamp`. Everything else
the harness seeds has none of it: no receipt entry, no stamp check, no refresh
command, and no diagnostic.

That is not abstract. The reporting room's own
`workbench/feedback/REPORT_FORMAT.md` still instructs a reviewer to store the
report in the reviewed project's feedback lane. Upstream corrected exactly that
instruction, and it is the correction an independent review application depends
on to keep its evidence out of the projects it measures. Nothing in the room
reported the divergence; it was found by diffing against the source by hand.

The provenance half has the same shape from the other direction. Peptides
Website is byte-current and verifies `valid`, while its manifest provenance
reads `unrecorded` and its receipt source reads `unknown`. A later
version-over-version review cannot reproduce that installation from its own
provenance - which is precisely the input this release comparison runs on. This
repository shows a milder instance: its manifest records `release: v3.1.0` and
commit `57fb22f` while `workbenchVersion` is `v3.1.2`.

## Current Verified State

Verified in this repository on 2026-09-06. The findings were established at
`b3633e5`; the `file:line` citations were re-anchored to the post-S-036 tree
after PR #63 merged, so following one lands on what it names.

- `tools/workbench-tools.mjs:24-36` `RUNTIME_TOOLS` covers exactly eleven `.mjs`
  files. No seeded document is a member.
- `templates/feedback/REPORT_FORMAT.md` carries no version stamp and no
  generation marker, and no tool reads it. `grep` for
  `Generated from LLM Workbench` returns nothing in either the template or the
  installed copy.
- `workbench/tools/workbench-layout.mjs:48` `wikiContractFiles` covers three
  files; `workbench/tools/wiki.mjs:54-65` emits `stale-stamp` for those plus
  `MEMORY.md`. The feedback lane and the remaining seeded wiki documents are
  outside that set.
- `workbench/tools/adr.mjs:217` offers `validate | register | new`;
  `workbench/tools/wiki.mjs:152` offers `validate` only. Neither can bring an
  existing document into shape, so a room seeded before the frontmatter fix, or
  whose ADRs were hand-authored, can only be repaired by editing every file.
- `unrecorded` no longer exists in the layout tool; `init` and `migrate` resolve
  the release checkout from Git or refuse with `invalid-source-identity`
  (`sourceIdentity`, `workbench/tools/workbench-layout.mjs:337-360`; S-036
  replaced the former `invalid-invocation`, which now survives only as the CLI
  catch-all at `:713`), and `tools/test-workbench-layout.mjs:848` guards the
  placeholder's absence. But no
  diagnostic reads `provenance.source` on an existing manifest, and no command
  records source identity for a room after the fact.
- This repository's `workbench/manifest.json` `provenance.source` reads release
  `v3.1.0`, commit `57fb22f`, while `workbenchVersion` is `v3.1.2`. Nothing
  reports it.

**Correction to the upstream evidence for UP-020.** The report attributes six
`invalid-adr` and four `invalid-note` findings in the reporting room, and 24 and
4 in GPT_OS, to documents the harness seeded without frontmatter, and concludes
that a `normalize` command is needed to close a gap between the validator and
the harness's own output. Both rooms appear to be Windows checkouts - the report
never states this, and only the Audit-Workbench room cites an `E:/` path, so for
GPT_OS it is inference from the failure mode alone. S-037 established
that `parseFrontmatter()` anchored on a bare line feed, so on a Git for Windows
clone every ADR and every wiki note parsed as having no frontmatter at all -
25 `invalid-adr`, 4 `invalid-note`, and a knock-on `stale-register` in this
repository's own CRLF simulation, none of them true. At
`da95e58` on `claude/s037-line-ending-records` a direct probe returns identical
parsed data for LF and CRLF input. S-037 merged into `integration` on
2026-09-06 as PR #64, so most of UP-020's reported count has already
disappeared, and the residue is narrower than the report states: documents
seeded before the wiki frontmatter fix landed, and hand-authored ADRs. That
residue is real - the harness still cannot repair its own historical output -
but it is a low-frequency case and is scoped as such in TK-002.

Gap: no generation tracking for seeded documents, no repair for records missing
required frontmatter, and no report or backfill for placeholder provenance.

## Desired Behavior

1. Seeded lane documents carry a recorded generation, and one registered
   diagnostic reports a seeded document whose generation is behind the manifest.
   `workbench/feedback/REPORT_FORMAT.md` is covered.
2. `adr` and `wiki` each gain a normalize mode that inserts only the required
   frontmatter keys into an existing document and leaves the body untouched. It
   is explicit, never runs as a side effect of `validate`, and reports every
   file it changed.
3. A registered diagnostic reports a manifest whose `provenance.source` is a
   placeholder or disagrees with `workbenchVersion`, and a supported command
   records source identity for an existing room without a reinstall, under the
   same source verification that guards `init` - `invalid-source-identity`,
   which S-036 landed on 2026-09-06 (see Dependencies).
4. No repair path rewrites content it did not add, and none writes a source
   identity it cannot verify.

## Decisions And Contracts

- **A seed receipt, not the tools receipt, if the shapes differ.** The tools
  receipt asserts byte identity for files a room must never edit. Seeded
  documents are meant to be read and sometimes locally adjusted. TK-001 chooses
  between extending the tools receipt and adding a parallel seed record, and
  records the reason.
- **Normalize adds keys; it never edits a body.** The failure mode of an
  automatic repair is silent content loss. A document with partial frontmatter
  gains only the missing required keys, and every change is reported.
- **Backfilled provenance is verified, not asserted.** Recording source identity
  after the fact uses the same clean-release-checkout verification as `init`, so
  a relocated partial copy still cannot establish provenance.
- **Reattributed evidence is stated, not silently dropped.** UP-020's residue is
  carried forward at its real size, with the reattribution recorded above.

## Non-Goals

- Rewriting document bodies, reflowing content, or migrating schemas.
- Making seeded documents byte-managed, which would make a local adjustment a
  failure.
- Repairing any reviewed room. These are commands the room's own owner runs.

## Dependencies And Blockers

- TK-002 is written against merged S-037, which landed as PR #64 on
  2026-09-06. Its scope and test evidence assume the line-ending fix; do not
  size it from a CRLF room's finding count.
- TK-003 depends on whichever source verification `init` carries when it is
  built. At `b3633e5` that was `invalid-invocation`; S-036 merged into
  `integration` on 2026-09-06 and replaced it with a stricter
  `invalid-source-identity`. Read the tool before writing the test rather than
  trusting either name from this spec.

## Vertical Implementation Slices

Tickets are temporary tracer bullets within this stable capability record.

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Track the generation of seeded lane documents and register one diagnostic for a seeded document behind the manifest, covering `REPORT_FORMAT.md` | done | none | Red: the new case in tools/test-diagnostics.mjs failed on a clean tree with `AssertionError [ERR_ASSERTION]: init records the generation of each seeded lane document` (actual false, expected true), 10 pass / 2 fail. Red again in tools/test-workbench-layout.mjs against the base tools at 09bfff7: `invalid-invocation` for the unknown `seed-documents` command, 32 pass / 2 fail. Green: 12/12 and 34/34. `seed-documents` writes `workbench/.workbench-seed.json`; `stale-seed` (attention, scope `feedback`) fires when a recorded release is not the manifest version. |
| TK-002 | Add an explicit normalize mode to `adr` and `wiki` that inserts only missing required frontmatter keys and reports every file it changes | done | none | Red: with the `normalizeAdrs` seam returning no changes, tools/test-adr.mjs failed with `AssertionError: normalize reports every file it changed and the keys it inserted`, actual `[]` against the three expected records, 8 pass / 1 fail; tools/test-wiki.mjs failed the same way for the three notes, 10 pass / 1 fail. Green: 9/9 and 11/11, including a CRLF record and a CRLF note that keep their own terminator (`assert.doesNotMatch(content, /(?<!\r)\n/)`) and bodies byte-identical apart from the inserted keys, `validate` writing nothing, and both normalize runs idempotent. |
| TK-003 | Register a diagnostic for placeholder or mismatched manifest provenance and provide a verified way to record source identity for an existing room | done | none | Red: the new case in tools/test-diagnostics.mjs failed with `Expected values to be strictly deep-equal: actual [], expected [Array]` - doctor reported nothing for a placeholder commit, 10 pass / 2 fail. Red again for the command in tools/test-workbench-layout.mjs at base tools 09bfff7, 32 pass / 2 fail. Green: 12/12 and 34/34. `record-source` reuses `sourceIdentity` and refuses a relocated partial copy with `invalid-source-identity`, writing nothing. |

### TK-001 - Seeded documents have a generation

**Stance:** Builder

Red first: a fixture room seeded with an older `REPORT_FORMAT.md` must produce
the new finding from its own `doctor`, and a current room must produce none.
Choose between extending the tools receipt and a parallel seed record, and
record the choice with its reason in the evidence log before implementing.

### TK-002 - Normalize existing records

**Stance:** Builder

Red first: an ADR with no frontmatter, and one with partial frontmatter, must
both validate after `normalize` and must keep their bodies byte-identical apart
from the inserted keys. The same for a wiki note. Assert that `validate` alone
still writes nothing. Size this slice against a post-S-037 finding count, not
against the CRLF-inflated counts in the upstream report.

### TK-003 - Provenance a room can report and repair

**Stance:** Builder

Red first: a fixture manifest whose `provenance.source.commit` is a placeholder,
and one whose `release` disagrees with `workbenchVersion`, must both produce the
new finding; a correct manifest must not. Then add the record command, reusing
whichever source verification `init` carries at implementation time, and prove it
refuses from a relocated partial copy. Read the tool before writing the test
rather than trusting this spec: at `b3633e5` the refusal was
`invalid-invocation`; S-036 merged on 2026-09-06 and replaced it with the
stricter `invalid-source-identity`.

## Acceptance Criteria

- [x] A room whose seeded `REPORT_FORMAT.md` is behind the manifest reports it
      from its own `doctor`; a current room reports nothing.
- [x] `adr normalize` and `wiki normalize` bring a frontmatter-less and a
      partial-frontmatter document to valid, leave bodies otherwise unchanged,
      and list every file changed.
- [x] `validate` on either tool still writes nothing.
- [x] A placeholder or version-mismatched `provenance.source` is reported by a
      registered diagnostic, and a supported command records verified source
      identity for an existing room.
- [x] The recording command refuses from a relocated or unclean checkout, with
      whichever source-verification code `init` carries at implementation time,
      and never records an identity it cannot verify.
- [x] `node tools/test-adr.mjs`, `node tools/test-wiki.mjs`,
      `node tools/test-workbench-layout.mjs`, and `node tools/test-diagnostics.mjs`
      pass, new cases red before green.
- [x] The full `AGENTS.md` verification suite passes.

## Testing Seams

- `workbench/tools/adr.mjs` and `workbench/tools/wiki.mjs` command surfaces
  (`tools/test-adr.mjs`, `tools/test-wiki.mjs`).
- The registered diagnostic set (`tools/test-diagnostics.mjs`).
- `workbench/tools/workbench-layout.mjs` manifest validation and source identity
  (`tools/test-workbench-layout.mjs`).

## Verification Procedure

```bash
node tools/test-adr.mjs
node tools/test-wiki.mjs
node tools/test-diagnostics.mjs
node tools/test-workbench-layout.mjs
node tools/test-workbench-tools.mjs
node workbench/tools/spec-workbench.mjs doctor
```

## Documentation Impact

- `RUNBOOK.md`: the normalize commands, the seeded-document check, and the
  provenance recording command.
- `RUNBOOK.md:586-592` effect table: the new codes and their effects.
- `workbench/wiki/SCHEMA.md` only if normalize changes what a valid note needs.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-06 | spec | Spec captured from upstream UP-018, UP-020, and UP-021 and re-verified at `b3633e5` | Read `workbench-tools.mjs:24-36`, `workbench-layout.mjs:47,340-360`, `wiki.mjs:54-65,152`, `adr.mjs:212`, `test-workbench-layout.mjs:848`; confirmed no stamp on `templates/feedback/REPORT_FORMAT.md`; read this repository's own stale `provenance.source` | Blueprint catalog regenerated by render | Three slices open |
| 2026-09-06 | spec | Separate-context review found two false citations in the first row above | `invalid-source-identity` does not exist at `b3633e5`: `grep -rn` returns hits only inside this spec, and `registeredCodes()` carries no such code. The refusal `init`/`migrate` actually raise is `invalid-invocation` (`workbench-layout.mjs:344`, in `sourceIdentity` at `333-348`); the unmerged S-036 branch is where `invalid-source-identity` exists, and verification done there was carried here in error. The placeholder guard is `test-workbench-layout.mjs:823`, not `848` - the upstream report cited 823 correctly and this spec degraded it. Both rows above are preserved unedited; Current Verified State, Desired Behavior 3, TK-003, the acceptance criterion, and Dependencies now name `invalid-invocation` and defer to whichever check exists at implementation time | No control text changed | TK-003 must read the tool before writing its test rather than trusting either code name from this spec |
| 2026-09-06 | spec | UP-020's reported impact reattributed | Probed `parseFrontmatter()` at `da95e58` on `claude/s037-line-ending-records`: LF and CRLF input return identical parsed data; S-037 records 25 `invalid-adr` and 4 `invalid-note` in a CRLF simulation of this repository, none true | Reattribution recorded in Current Verified State rather than dropped | TK-002 residue is smaller than the upstream report states and must be sized post-S-037 |
| 2026-09-06 | spec | Fresh separate-context review found four internal contradictions and three wrong citations | TK-003's body and Desired Behavior 3 still called S-036 unmerged and named `invalid-invocation`, contradicting this spec's own Dependencies section; S-036 merged as PR #63 and every refusal `sourceIdentity` raises is now `invalid-source-identity` (`workbench-layout.mjs:337-360`), with `invalid-invocation` surviving only as the CLI catch-all at `:713`. `wikiContractFiles` is at `:48`, not `:47`; the placeholder guard is `test-workbench-layout.mjs:848`, not `:823`; the `adr.mjs` command surface is the usage string at `:217`, not `:212`. Two statements assumed S-037 was unmerged; it landed as PR #64. The third copy of "Both rooms are Windows checkouts" was still a flat assertion while two others had been softened. The append-only row above, rewritten by the prior round, is restored to its original text | No control text changed | Three slices open |
| 2026-09-06 | spec | Restored the fresh-review row that the previous commit rewrote | `f963b96` edited the row `7a386fd` had published, to change "The append-only row above" to name the capture row precisely. It is restored byte-for-byte; the clarification is recorded here instead. The row restored in this spec is the capture row at the head of this table, not the row immediately above the fresh-review row | No control text changed | Three slices open |
| 2026-09-06 | TK-001 | Recorded the seed-generation mechanism choice before implementing | Chose a parallel seed record over extending the tools receipt. Read `tools/workbench-tools.mjs:24-36,193-203`: the receipt stores a SHA-256 per member of `RUNTIME_TOOLS` and `verify` raises `tools-receipt-drift` (`error`, scope `tools`, effect `all`) on any byte difference, so making `REPORT_FORMAT.md` a receipt member would turn a room's deliberate local adjustment into a finding that blocks `doctor`, `next`, and `claim` - the exact failure this spec's Non-Goals forbid. The seed record is `workbench/.workbench-seed.json` beside the manifest, schema 1, recording only the release that seeded each document, never a hash. It is written by `init` and `migrate` and only for a document that seeding actually wrote, so an existing copy is never claimed as a generation the tool cannot verify; an unrecorded document names no generation and is silent, exactly as `wikiStamps` treats an unstamped file (`workbench/tools/wiki.mjs:46-51`) | Decision recorded here before the red test | TK-001 red still to run |
| 2026-09-06 | TK-001 | Seeded-document generation recorded and reported | Red on a clean tree: `AssertionError [ERR_ASSERTION]: init records the generation of each seeded lane document` (actual false), tools/test-diagnostics.mjs 10 pass / 2 fail; and against the base tools at `09bfff7`, tools/test-workbench-layout.mjs 32 pass / 2 fail with `invalid-invocation` for `seed-documents`. Green: 12/12 and 34/34. `seedLaneDocuments`, `readSeedRecord`, and `seededDocumentFindings` live in `workbench/tools/workbench-layout.mjs`, which owns seeding; `stale-seed` is appended at the end of the registry. Seeding is an explicit command, not an `init` side effect: `initialize` seeds the feedback lane before `tools/workbench-adoption.mjs` moves a legacy `feedback/` directory onto it with `fs.rmdirSync`, which requires an empty target, so an init-time copy broke `tools/test-workbench-adoption.mjs:140` (`1 !== 0`) - and that tool is outside this spec's file lane | `RUNBOOK.md` gains an Installed State The Harness Wrote section and the two new codes in the effect table | The seeded set is one document; widening it to another lane changes the finding's registered scope |
| 2026-09-06 | TK-001 | Findings routed to `doctor` without a cross-lane edit | `doctor` wires exactly two support-root validators, `validateAdrs` and `validateWiki` (`workbench/tools/spec-workbench.mjs:266-285`), and `spec-workbench.mjs` is outside this spec's file lane and is S-043's declared seam (`workbench/tools/spec-workbench.mjs:551-553`). Inserting a call in `collectionFindings` would have shifted every line below it and invalidated that citation. The two installed-state checks therefore ride along in `validateWiki`, which already carries the manifest-scope `invalid-wiki-profile` and `missing-collection` findings for the same reason; the checks themselves stay in `workbench-layout.mjs` and the routing is commented at the call site | No control text changed by this row | A dedicated `doctor` hook for installed-state checks stays open for the spec that owns `spec-workbench.mjs` |
| 2026-09-06 | TK-002 | Normalize modes added to `adr` and `wiki` | Red with the seams present but inert: tools/test-adr.mjs `AssertionError: normalize reports every file it changed and the keys it inserted`, actual `[]`, 8 pass / 1 fail; tools/test-wiki.mjs `AssertionError: normalize reports every file it changed`, actual `[]`, 10 pass / 1 fail. Green: 9/9 and 11/11. `insertFrontmatterKeys`, `locateClosingFence`, and `nativeEol` are exported from `adr.mjs` and reused by `wiki.mjs`, mirroring the terminator-aware writer S-037 added at `tools/workbench-adoption.mjs:198-211`; the CRLF cases assert `doesNotMatch(content, /(?<!\r)\n/)` and byte-identical bodies. Measured residue in this repository post-S-037: `node workbench/tools/adr.mjs validate --json` returns 0 findings and `wiki.mjs validate --json` returns 0 record findings, against the upstream report's 6 `invalid-adr` and 4 `invalid-note` - the residue here is zero, and the capability is for hand-authored and pre-fix rooms | `RUNBOOK.md` ADR and Wiki sections and `workbench/wiki/SCHEMA.md` Verification section document normalize | `templates/wiki/SCHEMA.md`, the dogfood counterpart, is outside this spec's file lane and still lacks the normalize paragraph |
| 2026-09-06 | TK-003 | Provenance reported and repairable | Red: tools/test-diagnostics.mjs `Expected values to be strictly deep-equal: actual [], expected [Array]` for a placeholder commit, 10 pass / 2 fail; tools/test-workbench-layout.mjs at base tools 32 pass / 2 fail. Green: 12/12 and 34/34. Verified before writing the test that S-036 has landed: `sourceIdentity` raises `invalid-source-identity` and `invalid-invocation` survives only as the CLI catch-all. It was read at `:337-364` on the unmodified base tree; in this candidate the same function is `workbench/tools/workbench-layout.mjs:348-374` and the catch-all is `:866`, both shifted by the constants and imports this ticket added above them. `record-source` reuses `sourceIdentity` unchanged and is proved to refuse from a `relocateTool` partial copy, from a mismatched `--version`, and from a mismatched `--source-commit`, writing nothing each time. `unverified-provenance` is `attention`, not `error`: an `error` finding would make this repository's own `wiki.mjs validate` exit 1 and fail `tools/test-wiki.mjs:237`, which asserts the product wiki has no error findings | `RUNBOOK.md` documents `record-source` and the code | This repository's `provenance.source` release stays `v3.1.0` under `workbenchVersion: v3.1.2`: `doctor` now reports it as one attention line, and it was deliberately not repaired because no ticket authorizes it and recording would stamp this branch's commit as the room's source |
| 2026-09-06 | spec | Full verification on the candidate | 25/25 node suites pass, `python3 evals/tasks/task_b_path_safety/test_grade.py` passes, `node workbench/tools/spec-workbench.mjs doctor` exits 0 (one new `unverified-provenance` attention line for this room, 32 pre-existing `skill-generation-unknown` lines, and S-038's `blocked-slice`), `render` leaves no drift, `python3 tools/check-append-only.py` prints CLEAN, `git diff --check` clean, `git grep -Il $'\r' -- '*.md'` empty. Guardrail baseline before and after are both 106.6/113 on `templates`, unchanged because no template byte changed | Documentation owners updated as recorded above | Independent review, then merge into `integration` |
| 2026-09-06 | spec | Recorded where the effect table moved so sibling citations can be re-anchored | This spec's Documentation Impact names `RUNBOOK.md:586-592`. The candidate adds an Installed State The Harness Wrote section and normalize paragraphs above it, so the section heading is now `RUNBOOK.md:637`, the table header `:644`, and the five effect rows `:646-650`; the two new codes were appended in place to the existing `none` (attention) row rather than inserted as a new row. Four specs cite the old range and will need re-anchoring after this merges | No further control text changed | Sibling specs citing `RUNBOOK.md:586-592` re-anchor after merge |

## Completion Result

All three slices are implemented, red before green, and verified. Awaiting
independent review of the exact candidate and the merge into `integration`.

## Remaining Limitations Or Follow-Up Specs

- Seeded-document coverage is a report-and-repair capability, not byte
  management; a room may still adjust a seeded document locally and the
  diagnostic will not distinguish a deliberate edit from a stale copy.
- Backfilled provenance records the source identity available at the time of
  recording, which is not the same evidence as provenance captured at install.

## Supersession

- Supersedes: none
- Superseded by: none
