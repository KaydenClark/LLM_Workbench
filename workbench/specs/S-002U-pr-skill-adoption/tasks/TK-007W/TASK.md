# TK-007W - Exercise pr body authoring in a fresh context

**Task ID:** TK-007W
**Spec ID:** S-002U
**Slice:** Exercise pr body authoring in a fresh context
**Status:** in-progress
**Stance:** Builder
**Blockers:** TK-007U
**Destination:** spec-acceptance: A fresh-context scenario produces a useful brief visual summary, actual before/after evidence and accurate door/blast-radius discussion, using supplied canonical glossary terms.
**Planned verification:** Fresh-context run of the installed skill on a known change with real failing/passing evidence and a supplied glossary fixture; observed artifact and environment diff recorded (no Git state change, no PR opened or merged); evidence linked from the Spec.
**Claimed by:** claude-s002u-worker-w, claude-s002u-correction-worker
**Proof:** Fresh-context pr body scenario on known change 6dbec705 with real before/after output and a GLOSSARY.md fixture: proof/scenario-input/, proof/scenario-output.md (verbatim body), proof/scenario-environment-diff.md (no Git or PR change), proof/scenario-result.json (per-criterion judgment). Full Runbook suite 53/53 at 2b2164ed; wiki validate ok; doctor ok.

## Scope

Run the installed `pr` skill in a fresh agent context against a known, bounded change with real before/after test output and a supplied `GLOSSARY.md` fixture. Record the input, produced body, environment diff and a judgment against the Spec's acceptance criteria under the Spec's `proof/`, observing artifact output rather than exact prose. Record that the room's own `GLOSSARY.md` is not yet delivered (S-004O) rather than asserting it.

## Out of scope

Opening, publishing, reviewing or merging any PR; configured-host invocation claims beyond what was observed.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s002u-tk007w | 2b2164edadd12dc705b426a167ad3ba7f59f45d9 | ahead 0 behind 0 | 0 | Candidate 2b2164edadd12dc705b426a167ad3ba7f59f45d9 (clean, merged assembly 62b44a98). Fresh-context pr run: a Claude Code subagent with no conversation history loaded workbench/skills/pr/SKILL.md (sha256 ab63f1cf) by path and wrote a body for known change 6dbec705 from proof/scenario-input (real evidence: catalog test on 6dbec705 tree without pr exit 1 'must carry the pinned upstream source'; with pr the isolated pin assertion exit 0; suite 46/7 at 56eb7a9b; GLOSSARY.md scenario fixture). Body (proof/scenario-output.md, sha256 461848f2) judged in proof/scenario-result.json: visual summary pass, real before/after pass, two-way door and branch-local blast radius pass with one miscount (five added files vs four added plus one edited), fixture glossary terms used pass. Environment diff (proof/scenario-environment-diff.md): HEAD, porcelain incl. ignored, lane refs, worktree count and gh pr list identical before/after, no PR exists. Pre-merge suite at 5af1119d 46/7 (only the known invalid-bundled-core seven). Full Runbook suite 53/53 at 309e4195 and at 2b2164ed. wiki.mjs validate ok; spec-workbench doctor ok. | workbench/wiki/skills-draft/main-workflow/pr.md observed-behavior, Compared-with-Matt, F:pr:03 narrowed, fresh-clone discovery result, history; proof/ under the Spec | Single run with a fixture glossary (room GLOSSARY.md undelivered, S-004O); same host and model as the caller; invoked by path, not from an ordinary prompt; no Codex run; F:pr:01 merge answers still absent from the template | 6fec48ea6d4730893726290cd278581921b170f9991de8d349a14fec0f69e70e |
| 2 | claude/s002u-tk007w | cb28cf4edcd75054ed39209c34213afabb06a0b6 | ahead 0 behind 0 | 0 | Fresh-context pr body scenario on known change 6dbec705 with real before/after output and a GLOSSARY.md fixture: proof/scenario-input/, proof/scenario-output.md (verbatim body), proof/scenario-environment-diff.md (no Git or PR change), proof/scenario-result.json (per-criterion judgment). Full Runbook suite 53/53 at 2b2164ed; wiki validate ok; doctor ok. | pr draft article observed behavior, comparison, F:pr:03 and history updated; Spec proof added | Single run, fixture glossary (S-004O owns GLOSSARY.md), same host and model, path invocation not ordinary-prompt discovery, no Codex run; assembled independent review and integration delivery remain with the Dispatcher | b55f1bb763f9ab1608b0740333ed840670bb4b75da4872fdc7b5291373bac3fa |

## Continuation

| Run | Date | Answers | Adjusted handoff |
|---|---|---|---|
| 1 | 2026-10-07 | evidence row 7 (fail verdict at 24d47f0644dc5881582e9dedf04581de3be743cd on 2026-10-07) | Low, the scenario input proof/scenario-input/CHANGE.md states the door and blast-radius facts and says the commit only adds files and one test block, so the scenario shows faithful restatement of supplied facts rather than independent merge-danger derivation, and the five-files miscount was partly seeded by that framing. The fix adds this limit to proof/scenario-result.json and to the pr draft article (It is working if, Findings) without rerunning or editing the recorded body |
| 2 | 2026-10-07 | evidence row 7 (fail verdict at 24d47f0644dc5881582e9dedf04581de3be743cd on 2026-10-07) | Low, draft finding F:pr:01 (the template has no place for the Worker merge-safety and completion answers) is routed to this Spec in workbench/wiki/skills-draft/main-workflow/pr.md, but no Spec evidence row, remaining gap or Task carries it. The fix records it as a named remaining gap in the Spec evidence or routes it to an owner that records it |
| 3 | 2026-10-07 | evidence row 7 (fail verdict at 24d47f0644dc5881582e9dedf04581de3be743cd on 2026-10-07) | Low, the assembly reached review with all seven acceptance lines unchecked and a Completion Result still reading Not complete. Planning reconciliation only, although lines 1, 2, 4 and 5 are evidenced at this candidate. The fix has whole-Spec QA check only the lines the evidence supports, scope line 3 to the fixture glossary and line 6 to the prior28 and legacy21 cohorts that exist on this base, and write a real Completion Result naming the remaining gaps (GLOSSARY.md undelivered, current30 unlanded, ordinary-prompt discovery unobserved, single scenario run) |
