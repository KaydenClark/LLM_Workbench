# TK-002Z - Stage the bounded Worker entry and recoverable hand-back

**Task ID:** TK-002Z
**Spec ID:** S-002E
**Slice:** Stage the Worker operating entry, explanation and scenario proof
**Status:** done
**Stance:** Builder
**Blockers:** none
**Destination:** spec-acceptance: Load the assigned Task, its owning Spec and branch, acceptance, write scope and required stance before acting; a Worker has no authority over neighboring Tasks merely because their files are visible.
**Planned verification:** Focused source contract red/green; actual configured-agent vertical slice and conflict refusal; full AGENTS and RUNBOOK suite; self-drift pre/post.
**Proof:** Full AGENTS suite 48/48 PASS at d920826f (integration 226212f1 merged); tools/test-worker-role.mjs PASS; wiki validate ok; configured-session scenario evidence in tasks/TK-002Z/evidence

## Assignment

One attempt on `codex/s002e-worker-candidate`, based on integration `95176a4`.
Single durable writer: codex-s002e-worker for this Spec and its Task records.
Write scope: this Spec and Tasks, Spec-local `candidate/worker/SKILL.md`,
`tools/test-worker-role.mjs`, `workbench/wiki/skill-worker-role.md`.
Generated projections are refreshed by native tooling; no manual shared index edits.
No managed discovery, manifest, layout, root controls, frozen v3.2.1 or Factory edits.
Stop at immutable candidate ready for separate independent review; no self-approval.

## Scoped acceptance

- Stage a portable Worker entry composing assigned stance and one Task/attempt.
- Explain its inputs, refusal boundary and recoverable Dispatcher hand-back in Wiki.
- Exercise an actual configured agent on an assigned branch with red/green proof,
  conflicting-writer and out-of-scope refusals, exact output/tests/docs/gaps.
- Record verification and all installation/publication limits truthfully.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | codex/s002e-worker-candidate | 648e00f2bf66e15073ecce85c6b87be85fb5b29f | none | 3 | Source contract red: missing candidate ENOENT; green: node tools/test-worker-role.mjs; Wiki validation passed. Full suite and configured-session-agent scenario running. | Staged Worker entry and skill-worker-role.md; MEMORY router reserved for coordinator. | Independent review; managed bundle identity/install; full verification pending. gh API Forbidden; standalone codex app-server read-only initialization failed. | 426f869ef5519e37d285388f4dd7f00c282f4e0aa663d90f8d6b7574583caafd |
| 2 | codex/s002e-worker-candidate | 89f7593fefd5975c03733c6c038a2dcd3873f258 | none | 4 | Final serial AGENTS/Runbook union 51/51 PASS at 89f7593; tools/test-worker-role.mjs source and actual scenario inspection PASS; Wiki validation PASS; self-drift pre/post retain baseline limitations; guardrail 78/100 unchanged. | Spec-local candidate/worker/SKILL.md, skill-worker-role.md, Task scenario and command evidence. MEMORY index reserved for coordinator. | Separate immutable review; managed bundle/install and MEMORY assembly. gh API Forbidden blocks draft PR. One explicitly loaded session-agent fixture, not installed behavior. Preserve newer integration metadata at assembly. | 0f1a619712705d9cc9458299bf45583bbd93889a13d8ed1108efdb9a3b76f3b2 |
| 3 | claude/land-249-worker-role | d920826fa54d965cbf15b583c0eee0358f09b9e4 | ahead 0 behind 0 | 0 | Full AGENTS suite 48/48 PASS serially at d920826f on integration 226212f1 merged in; node tools/test-worker-role.mjs PASS; wiki validate ok | workbench/wiki/MEMORY.md Roles And Stances router line for skill-worker-role.md (the reserved coordinator hunk) | Managed discovery, bundle identity and installation stay release-owned; one explicitly loaded configured-session fixture is not installed behavior or repeated-outcome proof; owner Human QA pending | 88904bd61a03b8938abe3e062384fb4b0258e06cd0d6ceee178875da2d4dd8e7 |
| 4 | claude/land-249-worker-role | 94512764e932068a731494d478c6069006d9764a | ahead 0 behind 0 | 0 | Full AGENTS suite 48/48 PASS at d920826f (integration 226212f1 merged); tools/test-worker-role.mjs PASS; wiki validate ok; configured-session scenario evidence in tasks/TK-002Z/evidence | MEMORY.md router line for skill-worker-role.md; staged candidate/worker/SKILL.md and skill-worker-role.md from the Task | Managed discovery, bundle identity and installation remain release-owned; installed behavior and repeated outcomes unproved; owner Human QA pending | de1cc3c2aa89c6a81f5015b42f4086f5a1d249fbc3399f79fe13ddd4ca40686e |
