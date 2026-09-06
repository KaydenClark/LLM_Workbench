# S-042 - Repairing Installed State The Harness Wrote

**Spec ID:** S-042
**Status:** active
**Priority:** 2
**Owner:** unassigned
**Stance:** Builder
**Updated:** 2026-09-06
**Catalog description:** Report and repair the installed state the harness itself produced - seeded lane documents behind the manifest, records without required frontmatter, and provenance placeholders - so a fix upstream reaches a room that already exists.
**Blockers:** none
**Latest event:** Spec captured from upstream items UP-018, UP-020, and UP-021; UP-020's reported impact was re-measured and largely reattributed to the line-ending defect that S-037 fixes.
**Next gate:** Claim TK-001 and register the seeded-document generation check red.

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

- `tools/workbench-tools.mjs:24-64` `RUNTIME_TOOLS` covers exactly eleven `.mjs`
  files. No seeded document is a member.
- `templates/feedback/REPORT_FORMAT.md` carries no version stamp and no
  generation marker, and no tool reads it. `grep` for
  `Generated from LLM Workbench` returns nothing in either the template or the
  installed copy.
- `workbench/tools/workbench-layout.mjs:47` `wikiContractFiles` covers three
  files; `workbench/tools/wiki.mjs:54-65` emits `stale-stamp` for those plus
  `MEMORY.md`. The feedback lane and the remaining seeded wiki documents are
  outside that set.
- `workbench/tools/adr.mjs:212` offers `validate | register | new`;
  `workbench/tools/wiki.mjs:152` offers `validate` only. Neither can bring an
  existing document into shape, so a room seeded before the frontmatter fix, or
  whose ADRs were hand-authored, can only be repaired by editing every file.
- `unrecorded` no longer exists in the layout tool; `init` and `migrate` resolve
  the release checkout from Git or refuse with `invalid-invocation` naming the
  missing flag (`sourceIdentity`, `workbench/tools/workbench-layout.mjs:333-348`),
  and `tools/test-workbench-layout.mjs:823` guards the placeholder's absence. But no
  diagnostic reads `provenance.source` on an existing manifest, and no command
  records source identity for a room after the fact.
- This repository's `workbench/manifest.json` `provenance.source` reads release
  `v3.1.0`, commit `57fb22f`, while `workbenchVersion` is `v3.1.2`. Nothing
  reports it.

**Correction to the upstream evidence for UP-020.** The report attributes six
`invalid-adr` and four `invalid-note` findings in the reporting room, and 24 and
4 in GPT_OS, to documents the harness seeded without frontmatter, and concludes
that a `normalize` command is needed to close a gap between the validator and
the harness's own output. Both rooms are Windows checkouts. S-037 established
that `parseFrontmatter()` anchored on a bare line feed, so on a Git for Windows
clone every ADR and every wiki note parsed as having no frontmatter at all -
25 `invalid-adr`, 4 `invalid-note`, and a knock-on `stale-register` in this
repository's own CRLF simulation, none of them true. At
`da95e58` on `claude/s037-line-ending-records` a direct probe returns identical
parsed data for LF and CRLF input. Once S-037 merges, most of UP-020's reported
count disappears, and the residue is narrower than the report states: documents
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
   same source verification that guards `init` - `invalid-invocation` at
   `b3633e5`, or the stricter `invalid-source-identity` check if S-036 has landed
   by then (see Dependencies).
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

- TK-002 is written against merged S-037. It may be implemented before S-037
  merges, but its scope and its test evidence assume the line-ending fix; do not
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
| TK-001 | Track the generation of seeded lane documents and register one diagnostic for a seeded document behind the manifest, covering `REPORT_FORMAT.md` | ready | none | pending |
| TK-002 | Add an explicit normalize mode to `adr` and `wiki` that inserts only missing required frontmatter keys and reports every file it changes | ready | none | pending |
| TK-003 | Register a diagnostic for placeholder or mismatched manifest provenance and provide a verified way to record source identity for an existing room | ready | none | pending |

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
refuses from a relocated partial copy. Read the tool before writing the test: at
`b3633e5` that refusal is `invalid-invocation`; S-036, unmerged, replaces it with
a stricter `invalid-source-identity`.

## Acceptance Criteria

- [ ] A room whose seeded `REPORT_FORMAT.md` is behind the manifest reports it
      from its own `doctor`; a current room reports nothing.
- [ ] `adr normalize` and `wiki normalize` bring a frontmatter-less and a
      partial-frontmatter document to valid, leave bodies otherwise unchanged,
      and list every file changed.
- [ ] `validate` on either tool still writes nothing.
- [ ] A placeholder or version-mismatched `provenance.source` is reported by a
      registered diagnostic, and a supported command records verified source
      identity for an existing room.
- [ ] The recording command refuses from a relocated or unclean checkout, with
      whichever source-verification code `init` carries at implementation time,
      and never records an identity it cannot verify.
- [ ] `node tools/test-adr.mjs`, `node tools/test-wiki.mjs`,
      `node tools/test-workbench-layout.mjs`, and `node tools/test-diagnostics.mjs`
      pass, new cases red before green.
- [ ] The full `AGENTS.md` verification suite passes.

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
| 2026-09-06 | spec | Spec captured from upstream UP-018, UP-020, and UP-021 and re-verified at `b3633e5` | Read `workbench-tools.mjs:24-64`, `workbench-layout.mjs:48,337-360`, `wiki.mjs:54-65,152`, `adr.mjs:212`, `test-workbench-layout.mjs:848`; confirmed no stamp on `templates/feedback/REPORT_FORMAT.md`; read this repository's own stale `provenance.source` | Blueprint catalog regenerated by render | Three slices open |
| 2026-09-06 | spec | Separate-context review found two false citations in the first row above | `invalid-source-identity` does not exist at `b3633e5`: `grep -rn` returns hits only inside this spec, and `registeredCodes()` carries no such code. The refusal `init`/`migrate` actually raise is `invalid-invocation` (`workbench-layout.mjs:344`, in `sourceIdentity` at `333-348`); the unmerged S-036 branch is where `invalid-source-identity` exists, and verification done there was carried here in error. The placeholder guard is `test-workbench-layout.mjs:823`, not `848` - the upstream report cited 823 correctly and this spec degraded it. Both rows above are preserved unedited; Current Verified State, Desired Behavior 3, TK-003, the acceptance criterion, and Dependencies now name `invalid-invocation` and defer to whichever check exists at implementation time | No control text changed | TK-003 must read the tool before writing its test rather than trusting either code name from this spec |
| 2026-09-06 | spec | UP-020's reported impact reattributed | Probed `parseFrontmatter()` at `da95e58` on `claude/s037-line-ending-records`: LF and CRLF input return identical parsed data; S-037 records 25 `invalid-adr` and 4 `invalid-note` in a CRLF simulation of this repository, none true | Reattribution recorded in Current Verified State rather than dropped | TK-002 residue is smaller than the upstream report states and must be sized post-S-037 |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Seeded-document coverage is a report-and-repair capability, not byte
  management; a room may still adjust a seeded document locally and the
  diagnostic will not distinguish a deliberate edit from a stale copy.
- Backfilled provenance records the source identity available at the time of
  recording, which is not the same evidence as provenance captured at install.

## Supersession

- Supersedes: none
- Superseded by: none
