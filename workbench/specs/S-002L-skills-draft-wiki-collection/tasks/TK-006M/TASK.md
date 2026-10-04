# TK-006M - Confirm the draft-wiki location and make the validator accept a nested draft collection

**Task ID:** TK-006M
**Spec ID:** S-002L
**Slice:** Confirm the draft-wiki location and make the validator accept a nested draft collection
**Status:** ready
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: DRAFT-LOC, DECL and DRAFT-STATUS are each recorded as confirmed or changed, with the owner tradeoff stated where a shared contract widens.
**Planned verification:** Failing `tools/test-wiki.mjs` cases first (a nested draft validates; `status: draft` outside the collection, a draft with a mismatched group or skill, and a non-draft status inside it are refused by name; the existing wiki still validates), then green; `node workbench/tools/wiki.mjs validate`; full suite from a committed candidate.
