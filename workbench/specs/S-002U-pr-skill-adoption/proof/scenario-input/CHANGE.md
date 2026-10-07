# Scenario input: the change to describe

This is the input for a fresh-context run of the installed `pr` skill (S-002U, TK-007W). The change is real: commit `6dbec705b9c3600c39e80eb6e708f15ecfc6d068` in the LLM Workbench repository. Every output file under `evidence/` was produced by an actual command run; none is invented.

## Commit

```text
6dbec705b9c3600c39e80eb6e708f15ecfc6d068
Install the pinned pr skill source with lineage

Adds Matt Pocock's pr skill (mattpocock/skills skills/engineering/pr at
d81f3a183412e71a5b1e84ca21bc1a35eea03a60) byte-identical, with its
CREDITS.md for the Dex Horthy / Humanlayer show-me lineage, its Codex
interface metadata and a NOTICE.md recording the pin, the absent adapter
and the MIT text. The skill catalog test now pins the source hash.
```

Parent: `6c1824d6` (a lifecycle claim record). The branch targets the Spec's assembly branch, not `main`.

## Diff stat

```text
 tools/test-skill-catalog.mjs           |  15 +++
 workbench/skills/pr/CREDITS.md         |   3 +
 workbench/skills/pr/NOTICE.md          |  29 ++++++
 workbench/skills/pr/SKILL.md           | 170 +++++++++++++++++++++++++++++++++
 workbench/skills/pr/agents/openai.yaml |   3 +
 5 files changed, 220 insertions(+)
```

- `workbench/skills/pr/SKILL.md`, `CREDITS.md` and `agents/openai.yaml` are byte-identical copies of the upstream files at the pinned revision (the installed `SKILL.md` is the one you load for this run).
- `workbench/skills/pr/NOTICE.md` is new local lineage: upstream pin, "no adapter", the `GLOSSARY.md` reference left unchanged, Dex Horthy / Humanlayer `show-me` credit, the statement that the skill writes a PR body only, and the MIT text.
- `tools/test-skill-catalog.mjs` gains the hash pin shown in `test-diff.patch`.

## Facts about where this change sits

- The commit only adds files and one test block; it deletes and rewrites nothing.
- It does not edit `workbench/manifest.json` or the `coreSkills` list in `workbench/tools/workbench-layout.mjs`. Declaring `pr` as required Core is a separate follow-up Task on the same Spec.
- Because the new `workbench/skills/pr/` directory sits in the Skills lane without being declared, the catalog and layout checks that compare the lane with the declared Core skill bundle fail at this commit (see `evidence/after.txt` and `evidence/suite-summary-at-56eb7a9b.txt`). Those failures are expected until the follow-up Task lands.
- Rooms receive Core skills from a Workbench release. No release is cut by this change.

## Evidence files

| File | What was run | Where |
|---|---|---|
| `evidence/before.txt` | `node tools/test-skill-catalog.mjs` | Exported tree of `6dbec705` with `workbench/skills/pr/` moved aside (the new test, without the new source) |
| `evidence/after.txt` | `node tools/test-skill-catalog.mjs` | Exported tree of `6dbec705` as committed |
| `evidence/isolated.txt` | The commit's pinned-source assertion block alone (copied verbatim into a standalone script), run on both trees | Same two trees |
| `evidence/suite-summary-at-56eb7a9b.txt` | The full verification suite | Clean committed candidate `56eb7a9b` (this commit plus a draft documentation article) |

Stack-frame lines were removed from the captured output and local scratch paths shown as `<scratch>`; nothing else was edited.

## Vocabulary

Use the terms in `GLOSSARY.md` in this directory. It is a scenario fixture: the room's own `GLOSSARY.md` has not been delivered yet.
