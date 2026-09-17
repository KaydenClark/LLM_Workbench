# TK-004 - Rewrite `LEXICON.md` and reconcile ADR-000F, ADR-000G and ADR-000I

**Task ID:** TK-004
**Spec ID:** S-00P
**Slice:** Rewrite `LEXICON.md` and reconcile ADR-000F, ADR-000G and ADR-000I
**Status:** blocked
**Blockers:** TK-002
**Destination:** spec-acceptance: S-00P Acceptance Criteria
**Planned verification:** Red: `tools/test-adr.mjs` extended to assert none of the three records is `proposed` fails at the pre anchor; green: register regenerated, no active record contradicts a locked answer, Lexicon routes resolve
