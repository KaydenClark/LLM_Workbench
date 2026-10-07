# TK-007W - Exercise pr body authoring in a fresh context

**Task ID:** TK-007W
**Spec ID:** S-002U
**Slice:** Exercise pr body authoring in a fresh context
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-007U
**Destination:** spec-acceptance: A fresh-context scenario produces a useful brief visual summary, actual before/after evidence and accurate door/blast-radius discussion, using supplied canonical glossary terms.
**Planned verification:** Fresh-context run of the installed skill on a known change with real failing/passing evidence and a supplied glossary fixture; observed artifact and environment diff recorded (no Git state change, no PR opened or merged); evidence linked from the Spec.
**Claimed by:** claude-s002u-worker-w

## Scope

Run the installed `pr` skill in a fresh agent context against a known, bounded change with real before/after test output and a supplied `GLOSSARY.md` fixture. Record the input, produced body, environment diff and a judgment against the Spec's acceptance criteria under the Spec's `proof/`, observing artifact output rather than exact prose. Record that the room's own `GLOSSARY.md` is not yet delivered (S-004O) rather than asserting it.

## Out of scope

Opening, publishing, reviewing or merging any PR; configured-host invocation claims beyond what was observed.
