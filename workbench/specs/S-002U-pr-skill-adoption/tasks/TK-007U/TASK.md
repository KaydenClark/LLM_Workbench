# TK-007U - Install the pinned pr source with lineage and its draft article

**Task ID:** TK-007U
**Spec ID:** S-002U
**Slice:** Install the pinned pr source with lineage and its draft article
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Pinned source and article agree on body authoring; the necessary adapter diff and Dex Horthy / Humanlayer lineage are recorded.
**Planned verification:** Red pinned-source fidelity check (hash of the pinned upstream text) failing on the missing source, then green; Wiki validate and lint for the draft article; GLOSSARY.md reference unchanged; full RUNBOOK suite on the committed candidate.
**Claimed by:** claude-s002u-worker-u

## Scope

Add `workbench/skills/pr/` from Matt Pocock's pinned source (`skills/engineering/pr` at `d81f3a183412e71a5b1e84ca21bc1a35eea03a60`), almost verbatim, with upstream lineage, MIT notice and Dex Horthy / Humanlayer `show-me` credits, plus any necessary runtime adapter justified in the notice. Author `workbench/wiki/skills-draft/main-workflow/pr.md` from the delivered draft Template and link its skills-draft README row. The article compares source, article and observed behavior, labels intended behavior and limitations, and records that `GLOSSARY.md` is the settled vocabulary reference whose delivery S-004O owns.

## Out of scope

Required-bundle membership, counts and compatibility (TK-007V); the fresh-context scenario (TK-007W); any PR opening, merge or Git operation authority.
