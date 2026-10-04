# TK-004 - Landmark synthesis pages seeded from question cards for every landmark; assessment reads them

**Task ID:** TK-004
**Spec ID:** S-003W
**Slice:** Landmark synthesis pages seeded from question cards for every landmark; assessment reads them
**Status:** in-progress
**Blockers:** none
**Destination:** spec-acceptance: S-003W Acceptance Criteria

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003w-tk-004-landmark-synthesis | bc08972b5d6f8e4f3e34a47eaf104126b259abd4 | ahead 1 behind 0 | 0 | Full RUNBOOK suite 51 commands plus test-landmark-wiki and test-landmark-tracker: 53/53 exit 0 on clean candidate bc08972b; tools/test-landmark-wiki.mjs new test 'every landmark has one routed synthesis page that passes the identifier rule' (red: router had no Landmark Synthesis Pages section, then missing pages; green after 24 pages and router section); landmark-wiki.mjs validate valid on all 24 pages; wiki.mjs validate ok | workbench/wiki/design-concepts (24 landmark-*.md synthesis pages, README and templates mirror), workbench/wiki/MEMORY.md (Landmark Synthesis Pages section), workbench/landmark-tracker/LANDMARK-WIKI.md (page convention and assessment boundary) | Expected-claim assessment does not read Wiki pages: revise --claim-evidence/--assess --evidence record named artifact@revision refs and rebuild derives claim status from record revisions only (landmark-tracker.mjs claimView); reading page bytes is a new public contract for the Landmark Records Spec (S-002A), not built here. Pages record card answers still conflicting with newer decisions as open, cards not edited | aa2e3fe2a21c7fc330e93d931ba9c521aa4b37894aa25561a50031aaf69a752c |
