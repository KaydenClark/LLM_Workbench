# LLM Workbench Harness Review, Mac Side - 2026-07-08

**Scope reviewed:** All harness-touched repos in `/Users/kayden/GPT_OS/Projects` on this Mac: LLM_Workbench, Little_Local_World (+2 worktrees), Dungeon_Friends_Game (+1 worktree, +1 full backup copy), AI_Agents_Presentation, DnDWebApp, OpenBrain, eredent, Command Information Center. Companion to the PC review of the same date; finding IDs here (M1-M8) map to the PC review's F1-F7 where they confirm or extend it.

**Assumptions and constraints stated up front:**
- All reads were done through the sandbox mount. The sandbox cannot perform git writes in these mounts (`index.lock` / `maintenance.lock` unlink is blocked), which is itself finding M2. Nothing was modified.
- The three "-worktrees"-style sibling folders (Little_Local_World-test-productivity-audit, Little_Local_World_pr46_gate_126f185, Dungeon_Friends_Game_free_asset_plan) are git worktrees whose `.git` pointers use absolute Mac paths; they resolve fine on the Mac but are unreadable from the sandbox, so their internal state was not assessed.
- GitHub-side PR/branch states were inferred from local refs and logs, not the GitHub API.

---

## Part 1: Repo-by-repo state

| Repo | Branch | Dirty | Harness | TASKBOARD | BLUEPRINT | Archive | CI | HARNESS_FEEDBACK |
|---|---|---:|---|---:|---:|---|---|---|
| LLM_Workbench | integration | 0 | source repo | 24 KB | 16 KB | no | none | n/a |
| workbench templates (GPT_OS root) | integration | 0 | duplicate clean checkout, same commit (debd8b6) | - | - | - | - | - |
| Little_Local_World | adopt/llm-workbench-v2.1 | **29** | v2.1, **uncommitted** | 20 KB (untracked!) | 28 KB | untracked | none | 2 rows, both `new` |
| Dungeon_Friends_Game | docs/readme-screenshots | 1 | v2.x | **92 KB** | **68 KB** | no | none | 1 row, `new` |
| DF backup copy (pre4.7) | feature/phase2-tutorial-dungeon | 1 | full divergent clone | - | - | - | - | - |
| AI_Agents_Presentation | codex/presentation-friction-polish | 9 | **v2.1** (PC review said pre-v2) | none | 24 KB | no | none | none |
| DnDWebApp | Workbench-v2-Update | 0 | v2, **unmerged since 07-01** | none | 12 KB | no | none | none |
| OpenBrain | Workbench-v2-Update | 0 | v2, **unmerged since 07-01** | none | 12 KB | no | none | none |
| eredent | Astral | 1* | v2.1 | 16 KB | 16 KB | no | **ci.yml + pages.yml** | 1 row, `new` |
| Command Information Center | codex/cic-workbench-harness | **29** | v2.1, adoption **uncommitted** | 16 KB | 16 KB | no | none | none |

*eredent's 1 dirty file is just `.claude/settings.local.json` (untracked), effectively clean.

---

## Part 2: Findings

### M1. The Little Local World adoption is stranded again, and it will rot the same way PR #40 did (extends F3) - highest severity
The Mac LLW checkout sits on `adopt/llm-workbench-v2.1` with 29 dirty files. The entire v2 harness - TASKBOARD.md, HARNESS_FEEDBACK.md, CLAUDE.md, `archive/`, `docs/proof/` - exists only as **untracked files**. The branch's last commit is 2026-06-30; `origin/integration` is **70 commits ahead** (0/70). This is the exact failure mode LLW's own HARNESS_FEEDBACK row 1 documented for the first adoption attempt (PR #40 rotted against 19 commits of drift and died on doc conflicts). The redo is now aging against 70 commits. Every day this sits uncommitted, the eventual merge gets worse.

### M2. The sandbox cannot git-write, and the harness has no protocol for that (new, Mac-specific)
Confirmed live during this review: `index.lock` / `maintenance.lock` unlink blocked in LLW, CIC, AIP, DF, and eredent mounts. LLW's HARNESS_FEEDBACK row 1 (2026-07-02, status `new`) describes precisely this and proposes the fix - and it has sat unharvested for six days while the same failure produced M1 and the CIC state below. Consequence: any Cowork-sandbox agent session on this Mac produces dirty trees and untracked control docs that wait for owner-side commits. Your review/merge bottleneck (PC F1) is actually a review/merge/**commit** bottleneck on the Mac. The harness assumes agents can run git; on this machine, half your agent sessions cannot.

### M3. The PR #46 gate loop burned at least 8 re-gate cycles with nothing committed (extends F1)
LLW's untracked `docs/run_reports/` holds analyzer outputs for PR #46 at eight distinct SHAs (126f185, 5f51cc5, 8fc3f23, ee919e3, f711f0a, f83a52b, fa5f601, plus base), all 2026-07-03 - the same day the PC-side AFK loop produced its 10 no-op commits. There is also a dedicated worktree, `Little_Local_World_pr46_gate_126f185`, spun up just to gate one SHA of one PR. One PR consumed 8+ manual gate runs, a worktree, and a pile of proof artifacts that never landed anywhere durable. This is the F1 human-gate spin measured from the other side: the gate re-runs because the window keeps re-opening, not because the code changed meaningfully.

### M4. Dungeon Friends is actively growing in the wrong direction (extends F2)
Mac DF: TASKBOARD 92 KB, BLUEPRINT 68 KB, no TASKBOARD_ARCHIVE. The Executive Brief section runs ~52 lines and contains full proof-log-style rows (200+ word cells) instead of the intended five lines. T-036 is marked "DONE - see Done lane" while still sitting in the Ready table (same hygiene decay as PC). And the newest commit on this checkout - 8c29664, today - is "retire Gameplan.md, fold design rationale into BLUEPRINT": it moves *more* design-doc content *into* the 68 KB file the reshape plan says to split. The consolidation instinct is right; the destination is wrong. That content belongs in `docs/design/` with BLUEPRINT as an index.

### M5. Checkout sprawl has a third form on the Mac: full backup copies (extends F7)
Worktrees are already in use here (LLW x2, DF x1, AIP x1, workbench x1) - good, that is the F7 fix ahead of schedule. But alongside them:
- `Dungeon_Friends_Game_backup_pre4.7_20260707_191530` is a **full divergent clone** sitting on `feature/phase2-tutorial-dungeon`. Its tip (9d200fe, T-036) is already contained in the active checkout's history, though not yet on `main`. Once the active line reaches main, this 400+ MB-class copy is pure risk: an agent that cd's into the wrong folder works on a dead tree.
- The workbench itself is checked out twice (`Projects/LLM_Workbench` and `GPT_OS/workbench templates`), both clean on integration at the same commit. Benign today, but nothing declares which is canonical, and they will drift.
- DF carries 14 local branches; at least 4 (adopt, chore, research-audit, test suite) look merged or dead.

### M6. The feedback loop is open on this machine too, with the fix for M2 sitting in it (extends F6)
Four HARNESS_FEEDBACK rows across LLW (2), DF (1), eredent (1), all status `new`, oldest from 2026-07-02. The LLW rows are directly actionable: (a) the sandbox-git-writes adoption protocol, (b) template eval sections referencing workbench-only `tools/`/`evals/` paths. The harness's highest-value pending change is already written down inside its own return channel; nothing reads it.

### M7. Three adoptions are stalled in three different ways (extends F1/F6)
- **DnDWebApp** and **OpenBrain**: harness installed 2026-07-01 on `Workbench-v2-Update`, exactly 1 commit ahead of main, unmerged for a week. Two two-minute owner merges are the entire blocker.
- **CIC**: adoption is 29 uncommitted dirty files on `codex/cic-workbench-harness` (same M1/M2 shape), plus six untracked planning docs in repo root (`CIC-Atlas-Integration-Plan.md`, `INTELLIGENCE_REDESIGN_FINISH_PLAN.md`, etc.) - planning sprawl the harness is supposed to absorb into BLUEPRINT/TASKBOARD.
- **AI_Agents_Presentation**: stamped v2.1 here while the PC review recorded it as pre-v2 - the *project's own harness state* now differs by machine, and its 9 dirty files include BLUEPRINT/ROADMAP/RUNBOOK edits.

### M8. Eredent is the proof the harness works when the missing pieces exist (positive)
Eredent is the only repo with real CI (ci.yml + pages.yml on main), a v2.1 stamp, an Executive Brief that is actually brief (6 tight bullets), current Pending Decisions with resolutions dated, a 16 KB TASKBOARD, and an effectively clean tree. It is the reference implementation for reshape Chunks 2 and 3: copy its CI shape and its brief discipline into LLW and DF rather than designing from scratch.

---

## Part 3: What the Mac evidence changes about the reshape plan

The PC review's five chunks stand. The Mac adds one prerequisite chunk and amends three others.

### Chunk 0 (new, do first) - Flush the stranded state; it decays daily
1. **LLW**: Mac-side (Terminal or Claude Code, not sandbox): commit the 29-file adoption on `adopt/llm-workbench-v2.1`, rebase onto `origin/integration` (70 behind), push, PR. Decide which PR #46 analyzer outputs to keep (probably only the final SHA's), commit those to `docs/run_reports/`, delete the rest.
2. **CIC**: commit the 29-file adoption; triage the six root-level planning docs into BLUEPRINT/`docs/` or delete.
3. **DnDWebApp + OpenBrain**: merge the two 1-commit `Workbench-v2-Update` branches. Two minutes each.
4. **DF**: delete the pre4.7 backup copy once its tip is confirmed on integration/main; prune the 4+ dead local branches; delete the `pr46_gate` worktree in LLW.
5. Declare one canonical workbench checkout (recommend `GPT_OS/workbench templates` since it is the mounted, dogfooded one) and note it in the other's README or delete the other.

### Amend Chunk 1 (LOOP.md) - add a sandbox-agent protocol
The idle contract from the PC plan is necessary but not sufficient here. Add to LOOP.md / AGENTS.md:
- **Environment probe first**: an agent must test git-write capability (e.g., `git stash list` then a no-op write) before claiming any task that requires commits. If git-write fails, the agent works in **handoff mode**: file edits only, plus a generated `HANDOFF.md` (or `git diff > patch`) listing exact owner-side commands to commit/branch/push. Never leave silent dirty trees.
- This is literally LLW HARNESS_FEEDBACK row 1's proposal. Ship it; mark the row `shipped`. That closes part of F6/M6 in the same stroke.
- Practical routing rule for you: harness/git-heavy work on the Mac goes to Claude Code in Terminal (git-capable); Cowork sandbox sessions are for read/analyze/author work. Write that into RUNBOOK per-machine notes (pairs with Chunk 5's MACHINE.md).

### Amend Chunk 2 (CI) - copy eredent, don't design
Eredent's ci.yml is your in-house pattern: checkout, hygiene checks, test job, concurrency group. Port it to LLW (`python -m unittest` + smoke) and DF (Godot headless `--import` + test suite) targeting `integration` PRs. This also collapses M3: PR gate = CI link, so a PR like #46 gets one authoritative green/red per push instead of 8 hand-run analyzer passes archived nowhere.

### Amend Chunk 3 (context diet) - reverse today's DF consolidation direction
Chunk 3 stands as written, with one addition: DF commit 8c29664 folded Gameplan.md into BLUEPRINT. When you split BLUEPRINT into index + `docs/design/`, that folded content is the first thing to move back out. Also: LLW already created `archive/` and `docs/proof/` directories (untracked) - the rotation mechanism is half-built; committing M1 ships it.

### Chunks 4 and 5 stand
One correction to Chunk 4's premise: the *Mac* workbench checkout is already clean on integration - the stale v1 tree is a PC-only problem. Chunk 5's MACHINE.md gains a field from M2: `git-writes: sandbox-blocked | full`, which the Chunk 1 environment probe reads.

### Priority order for this machine
| # | Action | Effort | Unblocks |
|---|---|---|---|
| 1 | Chunk 0 items 1-3 (commit/merge stranded adoptions) | ~1 hr owner-side | M1, M7; stops daily decay |
| 2 | Ship sandbox handoff protocol + harvest the 4 `new` feedback rows | 2-3 hrs | M2, M6; closes F6 loop |
| 3 | Port eredent CI to LLW + DF | 2-3 hrs | F4, M3; widens your review bottleneck |
| 4 | DF context diet (BLUEPRINT split, archive rotation, brief cap) | 2-3 hrs | F2, M4 |
| 5 | Sprawl cleanup + canonical checkouts + MACHINE.md | 2 hrs | F5, F7, M5 |

---

## What is already working on the Mac - keep it
- Worktrees per task/agent are already in use across four repos. Formalize the pattern (Chunk 5); don't reinvent it.
- Eredent end-to-end: CI, brief discipline, dated decision resolutions, clean tree. Treat it as the harness's living reference and say so in the workbench README.
- The Mac workbench checkout is on integration and clean - the branch discipline holds here.
- LLW's HARNESS_FEEDBACK rows are high quality: specific doc/section, impact rating, concrete proposed change. The authoring side of the feedback loop works; only harvesting is missing.

## Verification notes
- All branch names, dirty counts, file sizes, and commit hashes were read directly from the mounted repos on 2026-07-08 via git and du; sizes are du -k block sizes (4 KB granularity), so small files read as 4 KB.
- The 8 PR #46 analyzer outputs were counted from untracked filenames in `Little_Local_World/docs/run_reports/`; the gate runs themselves were not re-executed.
- LLW drift (0 ahead / 70 behind) measured with `rev-list --left-right --count adopt/llm-workbench-v2.1...origin/integration` against last-fetched remote refs; a stale fetch would change the number but not the direction.
- DF backup redundancy: `9d200fe` confirmed in the active checkout's log; confirmed NOT yet an ancestor of local `main` - hence "delete after it reaches main," not "delete now."
- Not verified: internal state of the three sandbox-unreadable worktrees; GitHub-side PR states; whether newer remote work exists beyond the last fetch on each repo.
