# TK-00JA - Ship the adapted domain-modeling skill in every room's lane

**Task ID:** TK-00JA
**Spec ID:** S-004J
**Slice:** Ship the adapted domain-modeling skill in every room's lane
**Status:** ready
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: A fresh clone discovers `domain-modeling` through both adapters; the manifest, layout bundle, catalog and count-bearing documents agree.
**Planned verification:** A scoped source test (`tools/test-domain-modeling-skill.mjs`) red on the absent lane source, then green; catalog, layout and skills-lane tests red on the undeclared skill, then green; runbook-index check; full RUNBOOK suite on a committed candidate; self-drift pre/post.

## Scope and authority

Owner, 2026-10-06: "New Spec! You will be one of 3 running at the same time." with `/implement-spec` on this Spec.

Adopt Matt Pocock's pinned glossary-based source (`mattpocock/skills` at `d81f3a183412e71a5b1e84ca21bc1a35eea03a60`, `skills/engineering/domain-modeling/SKILL.md` and `GLOSSARY-FORMAT.md`) into `workbench/skills/domain-modeling/` with only the Workbench adapters Desired Behavior 3, 5, 6, 8 and 9 name: the bounded upstream consequence trace; capture in the objective's notepad and promotion instead of inline glossary or Canon writes; reading the current Lexicon while the glossary owner is absent; manifest decision-record owners and the ADR/DDR scope test through `to-docs`; no shadow `CONTEXT.md`, `UBIQUITOUS_LANGUAGE.md` or local `docs/adr/`. Keep the source pin and attribution under `THIRD_PARTY_NOTICES.md`. The PR #251 candidate and draft PR #374 are historical input only.

Join the required bundle and reach it from the Contract: manifest `skillPolicy.required`, layout `coreSkills`, the skills catalog and every count-bearing document the catalog test derives, and one RUNBOOK operations index row. Assign no release and bump no version. Do not touch `skills-pending/`, `LEXICON.md`, `lexicon`, `ubiquitous-language`, `grilling` or the personal catalog.

## Done criteria

Both adapters resolve the lane source; the scoped source test proves the operating contract, the preserved upstream moves and glossary format, and absent shadow stores; distribution tests and the full suite pass on a committed candidate; each adapter is recorded with its reason.
