# TK-006M - Confirm the draft-wiki location and make the validator accept a nested draft collection

**Task ID:** TK-006M
**Spec ID:** S-002L
**Slice:** Confirm the draft-wiki location and make the validator accept a nested draft collection
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: DRAFT-LOC, DECL and DRAFT-STATUS are each recorded as confirmed or changed, with the owner tradeoff stated where a shared contract widens.
**Planned verification:** Failing `tools/test-wiki.mjs` cases first (a nested draft validates; `status: draft` outside the collection, a draft with a mismatched group or skill, and a non-draft status inside it are refused by name; the existing wiki still validates), then green; `node workbench/tools/wiki.mjs validate`; full suite from a committed candidate.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s002l-draft-wiki-collection | 10aa26933edc7aa089a13d008f841fe86c13b077 | ahead 0 behind 0 | 0 | tools/test-wiki.mjs red (draft collection tests failed on the base validator, then missing-skill/group case failed) then green 16/16 at 10aa2693; wiki.mjs validate ok; full RUNBOOK Full suite 51/51 pass at candidate 10aa2693 (clean tree); first candidate 57486cec failed separate-context review (medium: draft skill/group optional) - fixed in 10aa2693 | SCHEMA.md (skills-draft nesting exception, index README exception); Spec Decisions DRAFT-LOC confirmed, DECL changed, DRAFT-STATUS confirmed; templates/wiki/SCHEMA.md deliberately untouched (repo-only prototype) | Task PR review of any later state commits; TK-006N and TK-006O open | bd2d2e2c04f3c17bb1a318d1c0a49ef408186e9d894a288983fd6ed90895228a |
