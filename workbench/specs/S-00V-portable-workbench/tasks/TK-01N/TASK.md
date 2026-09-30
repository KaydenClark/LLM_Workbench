# TK-01N - The round-trip gate starts with nothing outside the clone, claims by pushing and ends clean

**Task ID:** TK-01N
**Spec ID:** S-00V
**Slice:** The round-trip gate starts with nothing outside the clone, claims by pushing and ends clean
**Status:** blocked
**Blockers:** TK-00G, TK-01K, TK-01L
**Destination:** spec-acceptance: S-00V box 7 (the round-trip test starts with nothing outside the clone and ends with everything promoted, pushed, and nothing needed left on the instance)
**Stance:** Builder
**Planned verification:** Red: extended `tools/test-workbench-round-trip.mjs` fails on the candidate because it still installs skills into an isolated provider home, claims locally and commits by hand; green when it reads skills from the lane through the adapters, claims by pushing, and ends asserting settled claims promoted, receipt appended, branch pushed, clean worktree, no unpushed commits and no needed state left in the instance's notes; full AGENTS suite; separate-context review.

## Delivery

Desired Behavior 7 and grilling decision-010. "Ends clean" is the agent's
reading of the owner's "End clean up"; the owner delegated PW-7..PW-10 mechanics
to the agent, so this Task proceeds on that reading and the owner may correct it.
Define "nothing needed left on the instance" as checkable assertions (clean
worktree, no unpushed commits, no untracked non-ignored files, notes promoted
or removed) rather than prose.

## Done Criteria

- The gate needs no provider home, personal catalog or host memory.
- A run that leaves an unpromoted note or an unpushed commit fails the gate.
