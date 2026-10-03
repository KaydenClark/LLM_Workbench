# TK-006F - Record the Journey correction and the current workflow verb decision in a decision record

**Task ID:** TK-006F
**Spec ID:** S-004G
**Slice:** Record the Journey correction and the current workflow verb decision in a decision record
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-006E
**Destination:** spec-acceptance: A decision record carries the Journey correction and the current verb decision, ADR-000X is narrowed or superseded for the changed points through the record lifecycle, and no active accepted decision claim still says Journey is Map, Plan, Implement, Review and Verify.
**Planned verification:** `node workbench/tools/adr.mjs validate`, `register`, the decision-record tests, a search for the superseded Journey claim across active decision records and the Lexicon, and the full AGENTS suite on the committed candidate.
