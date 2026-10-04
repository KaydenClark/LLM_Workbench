# TK-006N - Add the owner-approved draft article template with the finding line format

**Task ID:** TK-006N
**Spec ID:** S-002L
**Slice:** Add the owner-approved draft article template with the finding line format
**Status:** ready
**Stance:** Builder
**Blockers:** TK-006M
**Destination:** spec-acceptance: Template 2 is the collection's template, carries the `F:<skill>:NN | kind | one line | who fixes it` format and the six kinds, and has any wording change forced by the validator recorded.
**Planned verification:** Failing `tools/test-wiki.mjs` case first (a draft whose `F:` line is malformed or names an unknown kind is refused by name; the template itself validates as a draft), then green; `node workbench/tools/wiki.mjs validate`; full suite from a committed candidate.
