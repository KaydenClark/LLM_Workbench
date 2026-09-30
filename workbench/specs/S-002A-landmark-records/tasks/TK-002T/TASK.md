# TK-002T - Validate a readable Landmark article across all bytes

**Task ID:** TK-002T
**Spec ID:** S-002A
**Slice:** Validate a readable Landmark article across all bytes
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Explicit Landmark article validation rejects WBIDs in complete bytes, accepts readable valid content, and preserves files/index on every refusal.
**Planned verification:** Red: a public fresh-process validation call accepts WBIDs in actual designated article metadata, prose, comments, URLs or link targets, or cannot validate an identifier-free article. Green: each offending article returns a named useful refusal with location; valid designated article passes; unsafe/missing inputs visibly fail without writes; unrelated feature article with legitimate identity-bearing retirement provenance remains valid under its existing validator. Targeted node tools/test-landmark-wiki.mjs and existing Wiki/Tracker suites, full AGENTS checks on immutable committed candidate, self-drift/guardrail pre/post and one-command under-minute demo.

## Outcome

A caller explicitly designates an existing readable Landmark Markdown article
and runs a public read-only validation command/API. Every byte is checked for
WBIDs; named findings identify offending content. A passing article can be
maintained by several delivery Specs while structured identity provenance stays
in records. This is a complete usable author-to-validator path; shared Wiki
validator integration is a later slice after its file slot is released.

## Required Behavior

- Add the smallest public command/API in `workbench/tools/landmark-wiki.mjs`
  with ordinary project path/CLI/output conventions. Explicit designation is
  the validation call, not a broad rule applied to every design-concept article.
- Check metadata, body, hidden comments, URLs/link targets and all remaining
  Markdown bytes. Trace actual WBID grammar/type inventory; preserve legacy
  identifiers, avoid treating unrelated ordinary hyphenated words as identities.
  Do not scan only rendered prose, exempt source links, or weaken the rule to
  fit existing fixtures. State any ambiguity in detection precisely.
- Validate inputs and safe existing readable article path first using existing
  public helpers. Useful missing/unsafe/non-Markdown/non-file errors; no write
  or generated projection update on success or refusal.
- Fixture a valid readable article and structured identity-bearing provenance
  outside it. Ordinary feature/retirement article provenance keeps existing
  rules: do not change shared Wiki schema/type/collection or historical articles.
- Tests use actual article files, CLI in a fresh process, refusal snapshots and
  meaningful expected results. No real records are retired/discarded/approved.

## File Lane

New module `workbench/tools/landmark-wiki.mjs`; new test
`tools/test-landmark-wiki.mjs`; narrow new usage document
`workbench/landmark-tracker/LANDMARK-WIKI.md` if needed. Assigned TASK receipt
only. Director inspected lane-H diff and released exactly the untouched
`RUNTIME_TOOLS` list stanza in `workbench/tools/workbench-layout.mjs`: add only
`landmark-wiki.mjs` adjacent to `landmark-tracker.mjs` in the worker isolated
checkout. No feature/import/layout/schema logic changes and no H checkout writes.
The canonical tool-list test must remain unchanged. Add a public installed-CLI
smoke test in the assigned new test file using the real install seam/disposable
room; verify receipt distribution and behavior without a version/release change.
All other shared-file changes still require explicit release.

Do not mutate `landmark-tracker.mjs`, `test-landmark-tracker.mjs`, `wiki.mjs`,
`test-wiki.mjs`, manifest, path/layout logic outside the released tool-list hunk,
lifecycle/diagnostics, schema or
root/generic controls. DQC owns first shared runtime slot; active S-00I TK-01U
owns shared Wiki/lifecycle consumers. Request narrowly necessary file release
through dispatcher; do not wait for a whole Spec.

## Sources To Load

Assigned S-002A desired behavior 3/4 and acceptance; root AGENTS entry controls;
existing `visible-ids.mjs`, `workbench-paths.mjs`, `wiki.mjs`, Tracker README
and delivered TK-01X/TK-01Y proof at b00a2e3. Existing source is read-only evidence.

## Done Criteria And Closing Proof

Record semantic red failure and green immutable SHAs, dirty state, targeted and
full suite commands/results, documentation, remaining gap, self-drift and
78/100 baseline guardrail limits. Supply a reproducible public command demo in
under one minute using a disposable valid/offending article, no manual fixture
construction needed by the owner. Shared wiring/assessment/lifecycle remain
explicit later obligations, not completion claims for this Task.

Worker self-checks and reports. Dispatcher owns shared Spec/evidence and whole
Spec QA. Separate-context review follows immutable candidate; fixture success
never resets owner Human QA. No integration/main merge by this worker.

## Task Receipt

Append named runtime receipts as work proceeds under current TASK conventions.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/landmark-article-tk002t | 04d54b165c06a6a46a5cec53bda3cbe79e0caeec | none | 2 | Entry doctor no blockers; guardrail pre 78/100; self-drift pre cleanUpdate=false | Read exact packet; no source changes yet | Red/green public validator, full candidate checks and demo pending | 73c9f58945e9fbadb52f37e4a22cf5f12f5a95e99e0f06ae602d36fa325b2d68 |
| 2 | codex/landmark-article-tk002t | 59439b55c7a28085cbd0eb7ca44e1ddd5d6cdb13 | none | 3 | Red 59439b5: 12 failed absent public module; green working tree: 13 pass 0 fail CLI/API actual bytes and snapshots | LANDMARK-WIKI.md public API CLI detection scope demo; no shared controls edited | Immutable candidate full checks pending; installer RUNTIME_TOOLS seam shared; Wiki wiring assessment lifecycle later | e88af558bc159a876c2124f9950aaf883a553c07baa0eaa3e92c7e84be722f14 |
| 3 | codex/landmark-article-tk002t | 7d0d1e36db7d19f9c993170a39345c8327d7056a | none | 4 | Correction red 7d0d1e3: custom default ambiguity percent-encoded tests 3 failed; revised green working tree 16 pass 0 fail | LANDMARK-WIKI.md custom types incomplete default percent decoding and current project-type compatibility limits | Superseded candidate full suite stopped after receipt projection drift; revised candidate full checks pending; shared installer and Wiki wiring later | 1b8fe429548c7bccbc716185a79291749b272753fcaa034a68c4fb5f5c5dcb58 |
| 4 | codex/landmark-article-tk002t | b6da8db87dec3ceb6a296fef65c628d7188b751c | ahead 1 behind 0 | 0 | Full immutable 6688a94 clean: 50 commands 49 pass 1 fail (runtime registration mismatch); new validator16/16 Wiki13/13 Tracker23/23; installed semantic red b6da8db missing module | Public command/API, generic ambiguity, percent decoding and current compatibility limits documented | Await narrowly released RUNTIME_TOOLS registration; full green immutable candidate pending; Wiki integration assessment lifecycle later | 3ae69969177823f14d5361ee418739179bef30e50c5eccf6402b6f8715819cae |
| 5 | codex/landmark-article-tk002t | 232d5cbcf7fdab13650727064e1f31c6f693d071 | ahead 3 behind 0 | 2 | Installed semantic red b6da8db; immutable6688a94 full49/50; registry commit auto-review rejected before execution | Clearance imported232d5cb preserving receipts; exact registry hunk and installed docs prepared uncommitted | Direct owner approval pending for one-line shared registry commit; corrected installed/full immutable checks pending; later Wiki wiring assessment lifecycle | f42d1a9b78b28c09a402a9a8f68ec56c980d548d741132a71d6aae0dfdd504b6 |
| 6 | codex/v4-next-slice | ac6fadbcd97abf8a9d502e0b724bfba7d98b6c6f | ahead 0 behind 0 | 4 | Entry: fresh doctor/next no blockers; claim refused no eligible ready Task, restored tree; resume existing in-progress TK-002T. Historical installed red retained, fresh installed red pending. | Recovered exact worker validator, acceptance tests and LANDMARK-WIKI.md; current Spec state reconciled | Released one-line RUNTIME_TOOLS registration, immutable full verification and fresh integration review pending; later Wiki wiring, assessment and lifecycle outside this slice | c6f98695289e9a605969f1f6df2c75353e14a58337c549e70b3d2d37ca3fbb5e |
| 7 | codex/v4-next-slice | 8faf09ada475b710427617c5be22238115f13f54 | ahead 1 behind 0 | 2 | Observed red at clean 8faf09ad: validator 16/17 pass; installed public CLI test fails managed installation must include the new public validator | LANDMARK-WIKI.md explains receipt-backed distribution through released runtime registration | One-line registration prepared; commit exact source before installed green; full current checks and separate-context review pending | 8a13bf964ff194890614464650a5014692232a1e8846d3d2a6eeeb5bda836a72 |

## Narrow Installer Clearance And Proof Correction

At immutable 6688a946fb454cec9b557dd19fcf3230437e1bea, all 50 commands
completed: 49 passed; the canonical runtime lane assertion failed because the
new tool was missing from RUNTIME_TOOLS. This is change-caused, not baseline.
Director grants the disjoint registry-byte lane above, preserving H pending
features changes. Retain that red receipt and record public installed behavior
red/green; rerun full checks on a new clean immutable candidate, keeping old
verification as history rather than substituting it for corrected proof.
