# TK-001 - Link-safe `wiki.mjs move-note` proven by moving one per-Spec article into features as a feature article with a router summary line

**Task ID:** TK-001
**Spec ID:** S-003W
**Slice:** Link-safe `wiki.mjs move-note` proven by moving one per-Spec article into features as a feature article with a router summary line
**Status:** done
**Blockers:** none
**Destination:** spec-acceptance: S-003W Acceptance Criteria
**Proof:** Task PR review PASS (Codex gpt-5.5, separate context) on d8a3fb24 vs 58ca0d20; full RUNBOOK suite 51/51 green on candidate 43a8797; tools/test-wiki.mjs 18/18 incl. 4 move-note tests (red: missing moveNote export); wiki.mjs validate ok; PR merged to integration

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s003w-tk-001-move-note | 43a87976821c3510cacb525806f69c979bf7abf9 | none | 0 | node tools/test-wiki.mjs 18/18 (4 new move-note tests: red = missing moveNote export, green after implementation); full RUNBOOK Full suite 51 commands all exit 0 on candidate 43a8797 (test-workbench-round-trip hit one transient SIGTERM, rc 143, and passed alone rc 0); wiki.mjs validate ok; spec doctor no blocking finding; durable-owner gate probe in a throwaway worktree accepts the moved article for S-033 (real retire-spec stops earlier at owner Human QA approval, not run) | workbench/wiki/MEMORY.md, workbench/wiki/features/README.md, templates/wiki/features/README.md, RUNBOOK.md, templates/RUNBOOK.md, workbench/skills/workbench-runtime/SKILL.md | summary-line validator attention left to TK-002; remaining per-Spec articles not moved; MIGRATION_INVENTORY.json plain-path mentions of the old note path left as historical | fd21f33b6c2d6d6cb6623893ff72b5b1731071c34f6bf4f9bc610c8f16ce38fc |
| 2 | claude/s003w-close-wave1 | 8084d99529020b6bc31119e4990eaa0cc3e18955 | ahead 0 behind 0 | 0 | Task PR review PASS (Codex gpt-5.5, separate context) on d8a3fb24 vs 58ca0d20; full RUNBOOK suite 51/51 green on candidate 43a8797; tools/test-wiki.mjs 18/18 incl. 4 move-note tests (red: missing moveNote export); wiki.mjs validate ok; PR merged to integration | RUNBOOK.md, templates/RUNBOOK.md, workbench-runtime skill (move-note procedure), features README root+template, MEMORY.md router, moved feature article | summary-line validator attention and the other 50 per-Spec articles: TK-002 | aec32a0749576a706d40412d2d04e7fc47acdd800e64d4264c3d786f57748d2a |
