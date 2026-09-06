# S-037 - Line-Ending-Agnostic Record Parsing

**Spec ID:** S-037
**Status:** active
**Priority:** 0
**Owner:** claude-opus-5
**Stance:** Builder
**Updated:** 2026-09-06
**Catalog description:** Parse ADR and Wiki frontmatter by its structure rather than by a bare line feed, so a Workbench room checked out on a CRLF host reports its real record state instead of declaring every record broken.
**Blockers:** none
**Latest event:** Red/green landed for the shared frontmatter parser and the adoption memory writer; a simulated CRLF room drops from 30 findings to 0.
**Next gate:** Independent review of the exact candidate, then merge into `integration`.

## Outcome

A Workbench room behaves identically on LF and CRLF checkouts. ADR and Wiki
records parse, validate, and register on a Git for Windows clone, and the
adoption memory writer preserves whichever terminator the room's own file uses.

## Why It Matters

Git for Windows sets `core.autocrlf=true` at system level, so a normal clone
rewrites every Markdown file to CRLF. `parseFrontmatter()` anchored on
`'---\n'`, so on those hosts every ADR and every Wiki note parsed as having no
frontmatter at all. On this repository that is 25 `invalid-adr`, 4
`invalid-note`, and a knock-on `stale-register` finding - 30 error-severity
findings produced entirely by line endings, none of them true.

The findings do not block selection, so the failure is quiet rather than loud:
`doctor` still exits 0 while telling the operator that the entire decision
record and knowledge base are malformed. That trains an operator to ignore
error-severity output, and it makes ADR and Wiki state unreadable to any agent
working in a Windows room. Every room adopted on such a host inherits it,
which is why this blocks deployment rather than only affecting this repository.

## Current Verified State

Verified on 2026-09-06 at `ec3fcf58a7a91f5ca3dc5e387555a14252e6b73d`:

- `workbench/tools/adr.mjs parseFrontmatter()` tests `content.startsWith('---\n')`
  and locates the closing fence with `content.indexOf('\n---\n', 4)`. A direct
  probe returns parsed data for LF input and `null` for the same bytes in CRLF.
- `workbench/tools/wiki.mjs` imports that one parser, so note validation fails
  for the same reason and reports `invalid-note`.
- `tools/workbench-adoption.mjs` locates the frontmatter fence itself with the
  same LF-only anchor when adding missing memory fields.
- A clone of this repository at `ec3fcf5` with all 172 Markdown files converted
  to CRLF reports 25 `invalid-adr`, 4 `invalid-note`, and 1 `stale-register`.
- `tools/control-fidelity.mjs`, `workbench/tools/privacy.mjs`, and
  `tools/feedback-automation.mjs` already normalize with `/\r?\n/`, so the
  defect is specific to the shared frontmatter parser and the adoption writer.
- The defect predates the v3.1.2 candidate; the same code is present at
  `b2918ee`, so this is not a v3.1.2 regression.

## Desired Behavior

1. `parseFrontmatter()` recognizes a frontmatter block delimited by CRLF, CR,
   or LF, and returns field values and list items with no carriage-return
   residue. The parsed body is normalized for reading and is never written back
   to disk, so no file's terminator is rewritten as a side effect.
2. ADR validation, register rendering, Wiki note validation, and `doctor`
   report the same result for a CRLF room as for the byte-equivalent LF room.
3. The adoption memory writer inserts missing fields using the terminator the
   target file already uses, and returns without writing when the frontmatter
   fence cannot be located rather than splicing at index `-1`.

## Decisions And Contracts

- **Normalize at the parser, not in the repository.** A `.gitattributes` would
  only protect this repository's own checkout. Adopted rooms are separate
  repositories whose Git configuration this harness does not own, so the fix
  must live in the code that reads records.
- **Read normalized, write native.** Parsing normalizes a copy. Writers keep
  the room's own terminator so the fix never produces a whole-file diff in a
  downstream room.
- **One parser stays one parser.** ADR and Wiki continue to share
  `parseFrontmatter()`; the correction is made once at that seam.

## Non-Goals

- Converting existing files, adding `.gitattributes`, or prescribing a room's
  Git configuration.
- Auditing every remaining `split('\n')` in reporting tools that do not change
  a validation verdict.
- Repairing the four Windows-host test failures unrelated to line endings
  (`core.hooksPath=/dev/null`, a POSIX `0644` mode assertion, a host path
  assertion, and a backslash-home leak check).
- Publishing v3.1.2, tagging, or merging `integration` into `main`.

## Dependencies And Blockers

- Builds on the S-036 corrected candidate; it does not modify S-036's evidence.

## Vertical Implementation Slices

| Ticket | Slice | Status | Blockers | Proof |
|---|---|---|---|---|
| TK-001 | Parse ADR and Wiki frontmatter independently of the line terminator and preserve the room's terminator when adoption adds memory fields | done | none | Red: a new CRLF corpus test in tools/test-adr.mjs failed at ec3fcf5 with a clean tree, 7 pass / 1 fail, with `TypeError: Cannot read properties of null (reading 'status')` at tools/test-adr.mjs:61 - the parser returned `data: null`, so the property access threw before any assertion message could render. Green: 8/8 after the fix; full AGENTS.md suite 25/25 pass on a clean tree; doctor exit 0. A cloned CRLF room went from 25 invalid-adr + 4 invalid-note + 1 stale-register to 0 record findings. |
| TK-002 | Obtain independent review of the exact candidate and land it on `integration` | ready | TK-001 | Pending. |

### TK-001 - One parser, any terminator

**Stance:** Builder

Red first with a CRLF ADR corpus asserting parsed fields, parsed list items,
title extraction, empty `validateAdrs`, and no `adr`-scope `doctor` finding.
Then normalize inside `parseFrontmatter()` and make the adoption writer use the
target file's own terminator.

### TK-002 - Candidate delivery

**Stance:** Builder, with the review performed in a separate context against
the immutable candidate SHA.

Run the complete suite, obtain an independent review of the exact commit, open
the PR into `integration`, merge it, and prove remote containment. Stop before
`main`, publication, and downstream deployment.

## Acceptance Criteria

- [x] A CRLF ADR corpus parses its fields and list items with no carriage-return residue and reports no `invalid-adr`.
- [x] A CRLF Wiki corpus reports no `invalid-note` caused by line endings.
- [x] A simulated CRLF checkout of this repository reports zero record findings from `doctor`.
- [x] The adoption memory writer locates the closing fence by the terminator that delimits that fence, splices missing fields in that terminator, and writes a created frontmatter block in the terminator the body already uses.
- [x] The unchanged full `AGENTS.md` suite passes with the fix applied on a clean tree.
- [ ] An exact-SHA independent review, PR, and remote `integration` containment are recorded; `main` remains untouched.

## Testing Seams

- `parseFrontmatter(content)` in `workbench/tools/adr.mjs`.
- `validateAdrs(root)`, `listAdrs(root)`, `writeRegister(root)`, and the `adr`
  scope of `doctor(root)`.
- Wiki note validation in `workbench/tools/wiki.mjs`.
- The memory-field writer in `tools/workbench-adoption.mjs`.
- A cloned checkout whose Markdown is converted to CRLF, compared by finding
  code against the same clone with LF.

## Verification Procedure

```bash
node tools/test-adr.mjs
node tools/test-wiki.mjs
node tools/test-workbench-adoption.mjs
```

Then every command in `AGENTS.md` Full suite, `render`, `doctor`, and
`git diff --check`. The CRLF demo is a one-minute check:

```bash
git clone -c core.autocrlf=false . /tmp/crlfroom && cd /tmp/crlfroom \
  && find . -path ./.git -prune -o -name '*.md' -print0 \
   | xargs -0 perl -pi -e 's/(?<!\r)\n/\r\n/g' \
  && node workbench/tools/spec-workbench.mjs doctor | sed 's/ .*//' | sort | uniq -c
```

Because `sourceIdentity()` refuses a dirty Workbench source, the suite is run
against the committed candidate rather than the working tree; that ordering
constraint is recorded as a follow-up on S-036.

## Documentation Impact

- Code comments at the corrected seams state why the terminator is normalized.
- No control routing changes: the owning spec records the behavior and no
  operator command or permission contract changes.

## Append-Only Evidence And Execution Log

| Date | Ticket | Event | Verification | Docs | Remaining gap |
|---|---|---|---|---|---|
| 2026-09-06 | spec | Defect reproduced and scoped while reviewing the S-036 candidate for downstream deployment | Direct `parseFrontmatter` probe returned data for LF and `null` for CRLF; a CRLF clone at `ec3fcf5` reported 25 invalid-adr, 4 invalid-note, 1 stale-register; the same code confirmed present at `b2918ee`, so it is not a v3.1.2 regression | S-037 created as the owning spec; S-036 evidence untouched | TK-001 and TK-002 |
| 2026-09-06 | TK-001 | Ticket closed | Red: new CRLF corpus test failed at `ec3fcf5` on a clean tree, 7 pass / 1 fail, with `TypeError: Cannot read properties of null (reading 'status')` at `tools/test-adr.mjs:61`. Green: 8/8; full suite 25/25 pass; template evaluation 106.6/113 and guardrail 78/100 unchanged; doctor exit 0; the CRLF room dropped from 30 record findings to 0 | Docs checked; no update needed - the correction is internal to two parsers and is explained at both seams | TK-002 independent review, PR, and integration containment |
| 2026-09-06 | TK-001 | Separate-context review returned CHANGES REQUESTED; the writer half of the change was repaired and given the test it lacked | Reviewer reproduced a regression against the base commit: `addWikiFrontmatter` derived the terminator from the whole file, so one pasted CRLF line in an otherwise-LF room brain hid the LF fence and the writer returned without writing, dropping five required fields while `migrate` still exited 0 and reported `complete`. The create branch also still joined with a hard-coded line feed, so the checked criterion was false for that branch. Red: three splice cases (all-CRLF, LF fence with one CRLF body line, CR-only) plus one create case added to `tools/test-workbench-adoption.mjs`, failing on the mixed case with `adoption must fill missing required metadata, sensitivity: normal is absent`. Green: both new blocks pass; `locateClosingFence` derives the splice point and terminator from the fence itself and `nativeEol` gives the create branch the body's terminator; an unlocatable fence now throws instead of returning silently | Two false citations corrected in this spec (the unreachable red assertion message, and the acceptance criterion that claimed create-branch behavior that did not exist); BOM and trailing-delimiter whitespace recorded as remaining limitations | TK-002 fresh independent review of the repaired candidate, PR, and integration containment |

## Completion Result

Pending.

## Remaining Limitations Or Follow-Up Specs

- Native verification on a real Windows host is not part of this spec; the
  proof is a byte-faithful CRLF simulation on the development host.
- Reporting-only `split('\n')` sites that do not change a validation verdict
  are unaudited and may leave a trailing carriage return in generated prose.
- The four unrelated Windows-host test failures remain open and need their own
  spec before the suite can be green on that host.
- A UTF-8 BOM before the opening `---`, and trailing whitespace after a
  delimiter, still parse as "no frontmatter" and still report `invalid-adr`
  with that misleading message. Neither is produced by a `core.autocrlf`
  checkout, so this spec's outcome holds as worded, but a record re-saved by a
  Windows editor that adds a BOM hits the adjacent failure mode. Direct probe
  at the repaired candidate: `BOM+CRLF -> null`, `trailing space -> null`.

## Supersession

- Supersedes: none
- Superseded by: none
