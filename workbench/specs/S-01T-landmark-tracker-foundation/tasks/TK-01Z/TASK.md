# TK-01Z - Assess actual Landmark Wiki content so two Specs maintain one readable article

**Task ID:** TK-01Z
**Spec ID:** S-01T
**Slice:** Assess actual Landmark Wiki content so two Specs maintain one readable article
**Status:** deferred
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Completing a linked Task without the expected durable documentation does not produce Verified; actual content comparison and applicable gates do; several delivery Specs maintain one readable article with no WBIDs in any bytes while structured provenance stays recoverable; feature/design-concept routes and collection/schema/retirement consumers agree with delivered Wiki behavior; workflow composition maintains sources while the grilling primitive stays independent
**Planned verification:** Red: in a disposable room, a done linked Task with missing or wrong Landmark Wiki content, stale evidence, an unresolved gate, a WBID hidden in article metadata, a comment, a URL or a link target, and a duplicate-article requirement each still produce Verified or pass. Green: actual readable claims match Expected result with revision and gate proof; complete-byte no-WBID scans pass for Landmark Wiki pages; provenance is recoverable from DQC, landmark and delivery records; feature articles consumed from S-00I validate unchanged; the grilling primitive is byte-unchanged. Targeted tests, then the full AGENTS suite; a demo contrasting missing knowledge with the assessed two-Spec article in under a minute.

## Release

Lane J releases this Task by setting Status `ready` once TK-01Y is done and
[S-00I TK-01U](../../../S-00I-folder-lifecycle-for-records/tasks/TK-01U/TASK.md)
is done on integration. It is `deferred` with no Blockers entry because the
runtime cannot resolve a cross-Spec Task blocker.

## Compatibility Pin

S-00I TK-01U is the single writer of the `features` collection, schema, type
and consumers, and feature articles keep the Spec-ID-bearing retirement
`source_paths` provenance that `retireSpec` and discard use. This Task
consumes that contract and never writes it. Requirement 16's no-WBID rule
applies to **Landmark Wiki pages** (the design-concept article type that
explains a landmark), which are a different article type from feature
articles; no provenance bridge between the two is needed and neither
contract is weakened. Requirement 16's "deliver the missing collection, schema
and retirement compatibility" is satisfied by consuming TK-01U.

## Required Behavior

- Assess specific claims against Expected result and named durable bytes with
  applicable owner gates. Article existence, done Tasks and accepted ADRs alone
  never generate Verified. Changed claims expose supported reconciliation, not
  blanket staleness.
- Two Specs contribute distinct claims to one coherent Landmark Wiki page
  rather than duplicating it. No WBIDs anywhere in its bytes; identity-bearing
  lineage lives in structured records; readable identifier-free routes keep
  article navigation.
- Composition maintains records within caller authority during planning,
  building and review; the grilling primitive stays Tracker-unaware; useful
  historical notepads are retained; no publishing ceremony or automatic
  assignment is introduced.

## Paths

Tracker runtime and test; `workbench/tools/wiki.mjs` and `tools/test-wiki.mjs`
only for the assessment seam; `workbench/wiki/design-concepts/landmark-tracker.md`
and `workbench/wiki/MEMORY.md` if the article changes. Skill composition edits
(`workbench/skills/*`) follow the released per-skill owners and S-00P's
composition contract at release time; root controls stay with S-00P.

## Done Criteria And Closing Proof

Red and green SHAs, targeted tallies, full suite on the committed candidate,
doctor, demo command, docs touched and Remaining Gaps.
