# TK-003L - Cover manifest-resolved skills references

**Task ID:** TK-003L
**Spec ID:** S-00I
**Slice:** Cover manifest-resolved skills references
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: S-00I safe lifecycle references and verified-main discard
**Planned verification:** Tests-first red at bd218db, focused test-spec-workbench and strongest negative probes, followed by parent-coordinated immutable aggregate verification and fresh assembled review

**Proof:** Red on bd218db: installed-skill move link stale. Additional red on 394f8e6: hard-linked incoming reference leaves a staged rename before refusal. Green at 2254cb0: manifest and legacy skills move/scan/discard/diagnostics, six-lane compatibility, unsupported-lane refusal, linked/hard-linked no-write preflight and unchanged unrelated hard-linked skills pass. Bounded independent review PASS at 2254cb0. Parent notice-route repair removes exactly 22 newly exposed README findings; original 22 unrelated findings remain. Final aggregate, assembled review and delivery pending.

## Bounded Correction

Include the manifest-resolved skills lane in the shared live-reference collector while retaining legacy root skills coverage. Prove Spec and Task moves rewrite links, append-only evidence stays unchanged and counted, scanReferences reports broken skill links, live skill dependencies refuse discard without mutation, and doctor reports reintroduced links to discarded records. Keep unrelated existing scan findings visible.

## Dispatcher Disposition

Refines this existing record created by fail verdict #4 at bd218db. The
semicolon split in the original findings was accidental; TK-003L and TK-003M
are the complete two-record correction set, not extra findings or IDs.
The Director assigns S-00I as assembled capability owner and one writer for
workbench/tools/spec-workbench.mjs, tools/test-spec-workbench.mjs, S-00I
Spec/Tasks and generated projections. TK-003L implementation is verified
before TK-003M starts. S-00T latest-incarnation/directory-recovery acceptance
remains the governing existing contract; S-00U approval code is unchanged.

## Limits

No real record retirement/discard, owner approval, main promotion, remote
push/merge, unrelated route edits, extra corrective IDs or approval-row copying.
Local immutable commits are allowed for source-identity proof. Full aggregate
verification and separate-context review remain coordinated by the parent.

## Scoped Current Routing Repair — 2026-09-30

The owner-directed continuation repaired 20 live skill links and matching
source_paths in 14 existing active Wiki articles after the source moved to
workbench/skills. Exact destination existence was checked, Wiki validation
and all 14 Wiki tests passed, and original historical claims, immutable
citations and earlier freshness dates were preserved. Each article records
the narrow navigation correction in History, not a semantic re-review.

Together with the 22 skills-catalog notice-link corrections, the repaired
scanner reports two remaining findings: Markdown snippets in inline code
in S-002C/TK-002Y intended for insertion into Wiki MEMORY. Their relative
links are correct at that destination; the examples are left unchanged and
the scanner's conservative findings remain visible. No global clean-scan or
new parser policy is claimed.
