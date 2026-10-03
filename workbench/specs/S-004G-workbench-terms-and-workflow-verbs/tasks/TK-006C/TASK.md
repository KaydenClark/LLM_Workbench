# TK-006C - Add the Owner, Room, Workbench Template, Scaffolding, artifact-kind and Control rows and retire "root controls"

**Task ID:** TK-006C
**Spec ID:** S-004G
**Slice:** Add the Owner, Room, Workbench Template, Scaffolding, artifact-kind and Control rows and retire "root controls"
**Status:** in-progress
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: The Lexicon has exactly one row each for Owner, Room, Workbench Template, Scaffolding, Contract artifact, Routing artifact, Architecture artifact and Control, each stating the owner confirmed meaning and its distinction from its neighbors; the Root controls row is rewritten in the artifact-kind terms.
**Planned verification:** Red: a check that each named term has exactly one row in both Lexicons, and that the Lexicons no longer use "controls" for files outside public names and retired-name rows, fails first. Green: that check, the evaluator and the full AGENTS suite on the committed candidate.

## Blocker Note

This Task waited on the last Task of the AI Coding Dictionary Terms Spec so the Lexicon keeps one writer at a time. That Task (TK-006B, the dictionary Wiki entries) is done and merged into integration (PR #307), and a plain Task blocker resolves only inside its own Spec, so the cross-Spec blocker could never clear by itself; it is removed here by the lane's single writer with that evidence.
