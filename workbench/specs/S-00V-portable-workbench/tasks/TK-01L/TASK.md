# TK-01L - `claim` pushes the claim on its task branch and `next` skips a Task claimed on any remote tip

**Task ID:** TK-01L
**Spec ID:** S-00V
**Slice:** `claim` pushes the claim on its task branch and `next` skips a Task claimed on any remote tip
**Status:** done
**Blockers:** none
**Destination:** spec-acceptance: S-00V box 4 (`claim` pushes the claim on the task branch; a second instance running `next` after a fetch does not receive that Task)
**Stance:** Builder
**Planned verification:** Red: a bare-remote fixture in `tools/test-spec-workbench.mjs` where instance A claims (task branch cut from integration, claim as its first commit, pushed) and instance B runs `next` after a fetch and does not receive that Task; a second test for the no-remote fallback that says so; green after `claim`/`next` change; the claim-on-branch ADR; `adr validate`; full AGENTS suite; separate-context review.
**Proof:** Red: the TK-01L push-on-claim block in tools/test-spec-workbench.mjs failed first at '(1) a room with origin and a declared integration branch coordinates through the remote' (claim returned no coordination and pushed nothing). Green: its five ok lines at 730c6d4, on a bare origin with one clone per instance: A on integration cuts alpha/s801-tk002 from origin/integration with the claim as its first commit, pushed, integration unchanged; B, cloned before the claim, runs next after the fetch and gets TK-003 with remoteClaimed S-801/TK-002 on origin/alpha/s801-tk002, and claim skips it too; a third instance gets null; A resumes its own claim; deleting the remote branch releases the claim. Claim behavior matrix: integration or default branch = cut the task branch from fetched origin/<integration>, commit Claim <Spec> <Task> (Task record, Spec header, re-rendered projections), push -u to the same-named branch; already-cut task branch = commit the claim there and push to the same-named branch, never the tracked upstream, integration or default, no second branch; detached HEAD = cut like integration; no remote, no declared integration branch, no origin/<integration>, or --local = today's local write left uncommitted, coordination.mode local with the reason, CLI stderr says so; push failure = refused, claim commit undone, starting checkout restored, cut branch removed, nothing written left; fetch failure = claim refused before any write, next answers from the last fetched refs with fetched false and the error. ADR-000O accepted (owner PW-6 lock, agent choices separated); adr validate ok; test-adr corpus re-counted 23 files/27 Spec links and 36 files/65 intra-ADR links; test-workbench-round-trip, test-cross-provider-fixture, test-diagnostics, test-visible-id-consumers, test-workbench-dogfood, test-workbench-layout, test-spec-report green; full 48-command AGENTS suite pass=48 fail=0 on 730c6d4; self-drift pre/post show only pre-existing findings; live next in this repo skipped S-00J/TK-01T and S-01T/TK-01X claimed on other lanes' pushed branches.

## Delivery

Desired Behavior 4 and grilling decision-007. `claim` creates the task branch
from the integration branch, commits the claim as the first commit and pushes.
`next` and `claim` fetch every ref from origin, read integration as the base and
overlay Task state from every remote tip; a Task in-progress on any tip is
taken. The PR carries the claim's closure with the work, so integration stays
review-only. A session without a remote keeps today's local behavior and says
so. Record claim-on-branch with fetch-all (hard to reverse, a real trade-off
against direct integration commits) in a new ADR. `occupiedIdentities` in
`workbench/tools/spec-workbench.mjs` already scans every `refs/remotes` tip:
follow that pattern.

**Collision hold.** `S-00M` in Blockers stands for the narrower real condition:
S-00M TK-001 (the repository-state reader) is contained in `origin/integration`.
Reuse that reader for branch, upstream and dirty state instead of writing a
second one. S-00M TK-002/TK-003 also edit `close` and git-state reading in
`spec-workbench.mjs` and `diagnostics.mjs`: rebase often. When S-00M TK-001 is
contained, the S-00V dispatcher removes `S-00M` from Blockers in its own commit
with an evidence row citing the containing commit.

The Taskboard display of remote claims is a separate Task because S-01X (the generated JSON taskboard Spec from S-00O)
replaces the Markdown board. Control wording (AGENTS Git Rules claim push,
RUNBOOK claim procedure) is written by the controls sweep, not here.

## Done Criteria

- Box 4 holds in the fixture: the second instance never receives the claimed
  Task.
- A push failure fails the claim visibly; nothing reports a claim that did not
  reach the remote.

## Receipt

| Run | Branch | HEAD SHA | Upstream | Dirty | Tests | Docs touched | Remaining gap | Checksum |
|---|---|---|---|---|---|---|---|---|
| 1 | claude/s00v-tk01l-push-on-claim | dbf6a750c3773222cdfd03a0829f85618a0c500e | ahead 0 behind 0 | 0 | Red: the TK-01L push-on-claim block in tools/test-spec-workbench.mjs failed first at '(1) a room with origin and a declared integration branch coordinates through the remote' (claim returned no coordination and pushed nothing). Green: its five ok lines at 730c6d4, on a bare origin with one clone per instance: A on integration cuts alpha/s801-tk002 from origin/integration with the claim as its first commit, pushed, integration unchanged; B, cloned before the claim, runs next after the fetch and gets TK-003 with remoteClaimed S-801/TK-002 on origin/alpha/s801-tk002, and claim skips it too; a third instance gets null; A resumes its own claim; deleting the remote branch releases the claim. Claim behavior matrix: integration or default branch = cut the task branch from fetched origin/<integration>, commit Claim <Spec> <Task> (Task record, Spec header, re-rendered projections), push -u to the same-named branch; already-cut task branch = commit the claim there and push to the same-named branch, never the tracked upstream, integration or default, no second branch; detached HEAD = cut like integration; no remote, no declared integration branch, no origin/<integration>, or --local = today's local write left uncommitted, coordination.mode local with the reason, CLI stderr says so; push failure = refused, claim commit undone, starting checkout restored, cut branch removed, nothing written left; fetch failure = claim refused before any write, next answers from the last fetched refs with fetched false and the error. ADR-000O accepted (owner PW-6 lock, agent choices separated); adr validate ok; test-adr corpus re-counted 23 files/27 Spec links and 36 files/65 intra-ADR links; test-workbench-round-trip, test-cross-provider-fixture, test-diagnostics, test-visible-id-consumers, test-workbench-dogfood, test-workbench-layout, test-spec-report green; full 48-command AGENTS suite pass=48 fail=0 on 730c6d4; self-drift pre/post show only pre-existing findings; live next in this repo skipped S-00J/TK-01T and S-01T/TK-01X claimed on other lanes' pushed branches. | New ADR workbench/docs/adr/000O-claims-are-pushed-on-the-task-branch-and-read-from-every-remote-tip.md in the active roster, REGISTER.md and HISTORY.md regenerated; S-00V Decisions And Contracts links ADR-000O and acceptance box 4 is checked with its test citation; header comments in the new managed tool workbench/tools/claim-coordination.mjs and in spec-workbench.mjs; the CLI usage string names --local and --branch. AGENTS.md, RUNBOOK.md, LEXICON.md, BLUEPRINT.md and templates/ not edited (S-00P holds them; wording recorded in the remaining gap for TK-01P). | TK-01P wording needed: AGENTS.md Git Rules - claim commits the claim as the task branch's first commit and pushes it; run it from the integration branch to have it cut the branch, or from an already-cut task branch; do not commit the claim by hand afterwards; --local only for a deliberately single-instance room. AGENTS.md Work Selection step 5 - claim S-### --agent NAME commits and pushes the claim on the task branch. RUNBOOK claim procedure - next and claim fetch origin and skip a Task claimed on any remote tip (stderr names each), --branch NAME, --local, and the refusals (fetch failure, push failure rolled back, uncommitted base checkout, uncommitted claim paths). TK-01M shows remote claims on the Taskboard. TK-01N converts tools/test-workbench-round-trip.mjs and tools/cross-provider-resume.mjs from claim --local to claim by pushing. adr.mjs new allocated 000L, already used on origin/claude/adr-notepad-objective-ownership, so the ADR takes 000O, the first id free on every local and remote ref; adr new does not scan remote refs (no owning Spec). Remote claims are never aged out automatically: the stale-claim rule reads only the local tree. A push the server accepted but reported as failed is not re-verified. | 816b14207536518aafb1aef3128553b3936d2c596bfe0b0720b56b9ff205df74 |
