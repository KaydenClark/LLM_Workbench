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
only. Runtime installation registration may require traced additional files;
report precise needed seam to dispatcher before touching shared installer files.

Do not mutate `landmark-tracker.mjs`, `test-landmark-tracker.mjs`, `wiki.mjs`,
`test-wiki.mjs`, manifest, path/layout modules, lifecycle/diagnostics, schema or
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
