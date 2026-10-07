# TK-009C - GLOSSARY.md carries concise project vocabulary in Matt's pinned format

**Task ID:** TK-009C
**Spec ID:** S-004O
**Slice:** GLOSSARY.md carries concise project vocabulary in Matt's pinned format
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-009A
**Destination:** spec-acceptance: Root and Template glossary use the pinned Matt format with concise project-specific definitions and avoided aliases; general terms are classified rather than copied.
**Planned verification:** Red: a glossary format and scope check (context heading, one or two sentence context description, `Language` section, one or two sentence definitions, `_Avoid_` aliases; Spec, Task, Landmark and Review present; context window and cache tokens absent) fails first against the missing `GLOSSARY.md`. Green: that check for root and Template, the term-row checks re-pointed from the Lexicon to the glossary, then the full suite.
**Claimed by:** claude-s004o-worker-c

## Scope

Write root `GLOSSARY.md` and its generic `templates/GLOSSARY.md` in [Matt's pinned glossary format](https://github.com/mattpocock/skills/blob/d81f3a183412e71a5b1e84ca21bc1a35eea03a60/skills/engineering/domain-modeling/GLOSSARY-FORMAT.md) from the census's `glossary` lines. Definitions stay one or two sentences; fuller meaning stays in the Wiki. General AI and programming concepts are classified, not copied. Do not change what any term means and do not remove Lexicon lines here. Re-point the tests that pin Lexicon term rows to the glossary where the term now lives.
