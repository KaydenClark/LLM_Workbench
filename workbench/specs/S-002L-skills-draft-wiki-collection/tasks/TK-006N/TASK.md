# TK-006N - Add the owner-approved draft article template with the finding line format

**Task ID:** TK-006N
**Spec ID:** S-002L
**Slice:** Add the owner-approved draft article template with the finding line format
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-006M
**Destination:** spec-acceptance: Template 2 is the collection's template, carries the `F:<skill>:NN | kind | one line | who fixes it` format and the six kinds, and has any wording change forced by the validator recorded.
**Planned verification:** Failing `tools/test-wiki.mjs` case first (a draft whose `F:` line is malformed or names an unknown kind is refused by name; the template itself validates as a draft), then green; `node workbench/tools/wiki.mjs validate`; full suite from a committed candidate.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s002l-tk006n-template | 452134d02f34e9067225a075e30ece08a0d11684 | ahead 0 behind 0 | 0 | tools/test-wiki.mjs red (2 new tests) then green 22/22 at 452134d0; wiki.mjs validate ok; full RUNBOOK Full suite 51/51 pass at clean candidate 452134d0; Codex gpt-5.5 separate-context review PASS, no findings (read-only sandbox could not run tests) | workbench/wiki/skills-draft/TEMPLATE.md added; Spec Decisions record the four template adjustments and the personal-skill source_paths decision | TK-006O README and router link remain | c12ca8532575f7ccd6c8f01738c1221294600dc765d1db61735f310ef876a4ca |
