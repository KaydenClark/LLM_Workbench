# TK-002 - Move ADR lifecycle from frontmatter status to folder location

**Task ID:** TK-002
**Spec ID:** S-00I
**Slice:** Move ADR lifecycle from frontmatter status to folder location
**Status:** in-progress
**Blockers:** TK-001
**Destination:** spec-acceptance: S-00I Acceptance Criteria
**Planned verification:** Red: a test asserting `REGISTER.md` and `HISTORY.md` are driven by location fails; green: every record migrated (52 at the anchor), register byte-stable for unchanged lifecycles, `archive` holds superseded and deprecated bodies untouched
