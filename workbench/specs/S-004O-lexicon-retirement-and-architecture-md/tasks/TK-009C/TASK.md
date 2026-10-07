# TK-009C - GLOSSARY.md carries concise project vocabulary in Matt's pinned format

**Task ID:** TK-009C
**Spec ID:** S-004O
**Slice:** GLOSSARY.md carries concise project vocabulary in Matt's pinned format
**Status:** done
**Stance:** Builder
**Blockers:** TK-009A
**Destination:** spec-acceptance: Root and Template glossary use the pinned Matt format with concise project-specific definitions and avoided aliases; general terms are classified rather than copied.
**Planned verification:** Red: a glossary format and scope check (context heading, one or two sentence context description, `Language` section, one or two sentence definitions, `_Avoid_` aliases; Spec, Task, Landmark and Review present; context window and cache tokens absent) fails first against the missing `GLOSSARY.md`. Green: that check for root and Template, the term-row checks re-pointed from the Lexicon to the glossary, then the full suite.
**Claimed by:** claude-s004o-worker-c
**Proof:** Red e6816ffc (glossary format and landing checks fail, GLOSSARY.md missing), green fba7513d and 7ed2569f: glossary format, scope and landing checks with mutation cases in test-control-fidelity, term-row checks moved to the glossary in test-control-fidelity, test-adr, test-skill-catalog and the vocabulary sweep; full suite 53/53 on 7ed2569f, and 53/53 on merged assembly e387aeed (log-asm-e387.txt); merged by PR #414

## Scope

Write root `GLOSSARY.md` and its generic `templates/GLOSSARY.md` in [Matt's pinned glossary format](https://github.com/mattpocock/skills/blob/d81f3a183412e71a5b1e84ca21bc1a35eea03a60/skills/engineering/domain-modeling/GLOSSARY-FORMAT.md) from the census's `glossary` lines. Definitions stay one or two sentences; fuller meaning stays in the Wiki. General AI and programming concepts are classified, not copied. Do not change what any term means and do not remove Lexicon lines here. Re-point the tests that pin Lexicon term rows to the glossary where the term now lives.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s004o-lexicon-retirement | e387aeedaa16289e89c16a60d9d844060bc4801a | ahead 0 behind 0 | 0 | Red e6816ffc (glossary format and landing checks fail, GLOSSARY.md missing), green fba7513d and 7ed2569f: glossary format, scope and landing checks with mutation cases in test-control-fidelity, term-row checks moved to the glossary in test-control-fidelity, test-adr, test-skill-catalog and the vocabulary sweep; full suite 53/53 on 7ed2569f, and 53/53 on merged assembly e387aeed (log-asm-e387.txt); merged by PR #414 | New GLOSSARY.md and templates/GLOSSARY.md in Matt's pinned format (13 groupings, retired names as _Avoid_ aliases); template-placeholders registers GLOSSARY.md with two new placeholders; glossary landedText refined on a few entries without changing meaning | Distinction text and the Lexicon checks still reading Distinction, routing or AI Coding Terms rows are for the Wiki Tasks and TK-009F; the governance-core Lexicon row check is removed with the Lexicon | 7faa3a2fb3332a71dbe4d37066f00895cc5b256eab36ba20501a01d3c8435834 |
