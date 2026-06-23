# Evidence-Based Selection of an LLM Agent Harness Template: A Four-Branch Comparison

**Author:** Automated review agent (Cowork / Claude), commissioned by Kayden Clark
**Repository:** `KaydenClark/LLM_Workbench`
**Date:** 2026-06-23
**Status:** Read-only study. No candidate branch was merged, rebased, deleted, or modified.

---

## Abstract

The LLM Workbench is a set of plain-Markdown instruction templates (`AGENTS.md`, `BLUEPRINT.md`, `ROADMAP.md`, `RUNBOOK.md`, `VISUAL_DESIGN.md`, and a `team templates/` set) intended to govern how a coding agent behaves inside a project. Four branches each propose a different "best" version. We evaluated all four against a fixed rubric and two controls (no template; a single generic instruction file), audited the two included evaluators for fairness, and reproduced every quantitative claim. We find that the template-quality improvements and the measurement apparatus live on *different* branches: `claude/harness-template-upgrades-v2` (and, transitively, `codex/workbench-evaluation-harness`, which is built on it) carry the strongest templates, while `claude/harness-eval-framework` carries the only scientifically sound, behavior-based evaluation harness, which kept the older templates. We recommend `codex/workbench-evaluation-harness` as the go-forward base because it is a strict superset of the best templates plus an evidence layer, and we recommend grafting in the behavioral harness from `claude/harness-eval-framework`. We show that the static rubric scores (main 84.5/100, the upgraded branches 100/100) measure *section coverage*, not agent behavior, and that no branch has yet produced a single real behavioral result. The recommended next experiment is a powered behavioral A/B that the eval-framework harness is already built to run.

---

## 1. Introduction

A project instruction template is not a document to be admired; it is an intervention on an agent doing work. The scientific question is therefore not "which file reads best" but "which version most improves agent outcomes, and how do we know." The repository under study contains four competing answers as git branches. The owner asked for a winner chosen by evidence, an explicit separation of *static template quality* from *proven real-world behavior*, and an audit of whether any included evaluator is fair or self-serving.

This paper treats each branch as a candidate, applies one identical process to all of them, and reports exact commands and results.

## 2. Materials: the four branches

All four branches share a single merge base, `main@a2cdd45`. Their relationship is the single most important structural fact in this study, because it determines what is actually new in each.

| Branch | Commits ahead of `main` | Relationship | Net change vs `main` |
|---|---|---|---|
| `main` | 0 | baseline | baseline |
| `claude/harness-template-upgrades-v2` | 1 | `main` + template upgrades | 9 files, +51/-6 lines |
| `claude/harness-eval-framework` | 1 | `main` + eval harness (does **not** contain the v2 upgrades) | +1,140 lines, new `evals/` tree |
| `codex/workbench-evaluation-harness` | 2 | **contains the v2 commit** + a static evaluator | +556 lines; template files byte-identical to v2 |

Consequence: "template quality" is shared by v2 and codex (identical template files), while "can it prove itself" is split between codex (a static rubric) and eval-framework (a behavioral harness on older templates). No single branch has both the best templates and the best proof method.

## 3. Methods

### 3.1 Procedure (identical for every candidate)

1. Enumerate each branch's file set with `git ls-tree`.
2. Diff each branch against `main` to isolate exactly what it changes.
3. Read the full content of changed templates and any evaluator code.
4. Score each candidate on an 11-criterion rubric (Section 3.2), plus the two controls.
5. Audit any included evaluator for fairness (Section 5).
6. Reproduce every quantitative claim from a fresh clone.

### 3.2 Rubric

Eleven criteria, the ones the owner specified, scored 0-3 (0 absent, 1 partial, 2 solid, 3 strong) for a go-forward-fitness view (Table 2). Independently, we ran the static rubric that ships on the codex branch (12 weighted criteria, max 100) unmodified against all candidates for an objective, reproducible coverage number (Table 3).

### 3.3 Controls

- **c0 / no-template:** an empty instruction set.
- **c1 / single-instruction file:** one generic `AGENTS.md` saying, in effect, "follow style, run tests, ask before risky changes." This is the realistic "what people usually paste in" baseline, not a strawman.

### 3.4 Environment

`node v22.22.3`, `python 3.10.12`. The static evaluator was run in `--path` (local) mode against per-branch git worktrees, which avoids any network dependency. The behavioral harness self-test was run on synthetic data.

## 4. Results

### 4.1 What each branch actually adds

**`harness-template-upgrades-v2`** adds, in one focused commit, exactly the capabilities `main` lacked: a *Staying On Track* anti-drift section with explicit post-context-summary re-reading; an ask/proceed/stop decision boundary; version-control conventions in the runbook; WCAG-AA accessibility plus a "never encode state with color alone" rule; multi-agent write-collision safety (single durable writer, re-read-before-append on the shared task board); a live-checkbox roadmap ledger; and a note that Claude Code loads `CLAUDE.md`, not `AGENTS.md`. Every addition maps to a named failure mode. This is high-signal, not padding.

**`harness-eval-framework`** adds `EVALUATION.md` and a runnable `evals/` harness: four conditions (no-template, an honest generic template, ours@main, ours@v2), four deterministic and independently-graded dimensions (correctness, scope adherence, verification honesty, docs upkeep), bootstrap confidence intervals plus two-proportion z-test and Fisher exact, a dev-vs-held-out task split, pre-registration of N and metric, and an explicit threats-to-validity section. It did not adopt the v2 template upgrades, so its templates equal `main`.

**`codex/workbench-evaluation-harness`** carries the v2 templates unchanged and adds a static rubric scorer (`tools/evaluate-workbench.mjs`) with a self-test, a benchmarks README documenting a behavioral task-trial protocol, and a results log. Its protocol documentation is candid that static coverage is necessary but not sufficient.

### 4.2 Ranking

Ranking criterion: fitness as the go-forward base = template quality + evidence quality + no regressions.

**Table 1. Overall ranking.**

| Rank | Branch | Rubric /33 | Static rubric /100 | One-line reason |
|---|---|---:|---:|---|
| 1 | `codex/workbench-evaluation-harness` | 32 | 100 | Best templates (= v2) + evidence layer; superset, no regressions |
| 2 | `claude/harness-template-upgrades-v2` | 30 | 100 | Same best templates, no proof layer |
| 3 | `claude/harness-eval-framework` | 26 | 84.5 | Best proof methodology, but templates lag `main` and harness is unrun |
| 4 | `main` | 23 | 84.5 | Strong baseline; no drift / accessibility / proof coverage |
| 5 | control: single-instruction file | 7 | 2 | "Follow style, run tests, ask if unsure" only |
| 6 | control: no template | 0 | 0 | Nothing |

**Table 2. Per-criterion rubric (0-3), reviewer judgment.**

| Criterion | none | generic | main | v2 | eval-fw | codex |
|---|---:|---:|---:|---:|---:|---:|
| Authority / read / edit scope | 0 | 1 | 3 | 3 | 3 | 3 |
| Project model clarity | 0 | 0 | 3 | 3 | 3 | 3 |
| Current work tracking | 0 | 0 | 2 | 3 | 2 | 3 |
| Run / test / build ops | 0 | 1 | 3 | 3 | 3 | 3 |
| Verification / proof requirements | 0 | 1 | 3 | 3 | 3 | 3 |
| Documentation ownership | 0 | 1 | 3 | 3 | 3 | 3 |
| Safety / privacy boundaries | 0 | 1 | 2 | 3 | 2 | 3 |
| Long-session drift control | 0 | 0 | 0 | 3 | 0 | 3 |
| Multi-agent coordination | 0 | 0 | 2 | 3 | 2 | 3 |
| Portability across tools | 0 | 2 | 2 | 3 | 2 | 3 |
| Ability to prove improvement | 0 | 0 | 0 | 0 | 3 | 2 |
| **Total** | **0** | **7** | **23** | **30** | **26** | **32** |

**Table 3. Static rubric, codex evaluator, reproduced (score / weight).**

| Criterion (weight) | main | v2 | eval-fw | codex | none | single |
|---|---:|---:|---:|---:|---:|---:|
| Core control surfaces (10) | 10 | 10 | 10 | 10 | 0 | 2 |
| Authority/read/edit scope (10) | 10 | 10 | 10 | 10 | 0 | 0 |
| Project model & contracts (8) | 8 | 8 | 8 | 8 | 0 | 0 |
| Active work state (9) | 7.2 | 9 | 7.2 | 9 | 0 | 0 |
| Operations & recovery (8) | 8 | 8 | 8 | 8 | 0 | 0 |
| Verification contract (12) | 12 | 12 | 12 | 12 | 0 | 0 |
| Documentation ownership (8) | 8 | 8 | 8 | 8 | 0 | 0 |
| Long-session drift control (8) | 0 | 8 | 0 | 8 | 0 | 0 |
| Team coordination (8) | 6.4 | 8 | 6.4 | 8 | 0 | 0 |
| Safety & change control (8) | 8 | 8 | 8 | 8 | 0 | 0 |
| Tool portability (5) | 3.3 | 5 | 3.3 | 5 | 0 | 0 |
| Visual & accessibility (6) | 3.6 | 6 | 3.6 | 6 | 0 | 0 |
| **Total** | **84.5** | **100** | **84.5** | **100** | **0** | **2** |

The entire 15.5-point gap from `main` to the upgraded branches is concentrated in exactly the five areas v2 added: drift control (8), the checkable roadmap, single durable writer, the Claude Code import note, and accessibility. The eval-framework branch scores identically to `main` (84.5) on this rubric because it kept `main`'s templates and the rubric reads only Markdown, so it cannot see the Python harness that is the branch's entire contribution.

## 5. Evaluator audit

The owner asked specifically whether any included evaluator is fair or self-serving. The two branches ship two very different instruments.

### 5.1 The codex static rubric: fair dimensions, self-serving mechanism

The 12 rubric areas are reasonable and map to genuine failure modes, and the controls are honestly constructed. But the mechanism is keyword / section-presence detection via regular expressions. Several patterns are the *exact strings the v2 commit introduced* (for example `Staying On Track`, `WCAG AA`, the Claude Code `@AGENTS.md`/`init` note). Because the codex branch is built on v2, the evaluator awards its own template 100/100. Three structural weaknesses follow:

1. It rewards the presence of a heading, not the quality of what is under it. A template could score 100 with empty sections that contain the right titles.
2. It reads only `.md`/`.txt`, so it is blind to non-Markdown contributions. It scored the eval-framework branch 84.5, identical to `main`, ignoring the entire `evals/` harness.
3. The author of the rubric and the author of the template it rewards are effectively the same lineage, so a perfect score is partly self-fulfilling.

The benchmarks README is commendably explicit about this: it states static coverage is necessary but not sufficient (its hypothesis H4) and that behavior still needs task trials. Verdict: useful as a fast coverage / regression gate in CI; not admissible as evidence of agent behavior.

### 5.2 The eval-framework harness: not self-serving, but unrun

This instrument is built to resist exactly the biases above. The grader is deterministic and condition-blind (it sees a repo and a transcript, never which template produced them). It is anti-tamper: it measures scope adherence from the agent's diff before restoring pristine canonical tests, and measures correctness only after restoring them, so a tampered test cannot fake a pass. It separates verification honesty from correctness, scoring an honest "tests still fail" as truthful even when the fix is wrong. The generic control is written to be representative, not weak. It pre-registers N and the metric, splits dev from held-out tasks, and documents its own threats to validity. Tellingly, its bundled synthetic self-test even shows the newer version slightly behind the older one on one dimension, which is the opposite of a rigged instrument.

The one decisive limitation: it has never been run for real. The results ledger is empty. It therefore proves that a sound instrument exists, not that any template changes outcomes.

## 6. Discussion

The contributions are complementary, not competing. The strongest templates and the strongest proof method are on different branches, and the codex branch already unifies the strongest templates with a (weaker) evidence layer. The rational synthesis is: adopt codex as the base, then replace its static rubric as the primary evidence with the eval-framework harness, demoting the static rubric to a cheap coverage gate. This yields one branch with the best templates and the best available proof engine, and discards nothing of value.

Ranking `harness-eval-framework` third should not be read as a judgment that its harness is weak. Its harness is the single most valuable asset in the repository for the owner's stated goal. It ranks third only as a *base* because its templates lag v2 and its harness has produced no number yet.

## 7. Threats to validity

- **Construct validity.** Table 3 measures section coverage, not instruction quality or efficacy. A high score means the guidance is present, not that an agent will follow it or that following it helps.
- **Reviewer judgment.** Table 2 is the reviewer's 0-3 scoring and is inherently subjective; Table 3 is mechanical and reproducible and should be treated as the objective anchor.
- **External validity.** No external templates (agents.md, Cursor rules, and similar) were scored or trialed, so no claim of superiority over them is made.
- **No behavioral data.** Every result here is static or synthetic. The central efficacy question is untested.

## 8. What the evidence proves, and what it does not

**Proven.** `main` is already a strong template far above both controls. `v2` adds five distinct coverage features absent in `main`, each mapping to a named failure mode. `codex` carries the v2 templates with no regression and adds an evidence scaffold. The static gap (84.5 to 100) is real coverage and was reproduced exactly.

**Not proven.** That any template version changes agent *behavior* or outcomes. That "v2 beats main" in practice (only on paper coverage). That the templates beat external alternatives. The 100/100 is coverage of section presence, not quality or efficacy.

## 9. Recommendations

1. **Base going forward:** `codex/workbench-evaluation-harness`.
2. **Graft in** the entire `evals/` tree and `EVALUATION.md` from `claude/harness-eval-framework` as the primary proof engine.
3. **Keep** `tools/evaluate-workbench.mjs` but reframe it as a CI coverage gate, and stop reporting its 100/100 as a quality verdict.
4. **Do not** claim real-world improvement until behavioral trials exist.

## 10. Recommended next experiment

Run the eval-framework harness for real; it is runnable in the analysis environment (the `claude` CLI is present). Concretely: on the merged base, run `evals/run.py` over conditions c0_none, c1_generic, c2_ours_main, c3_ours_v2 with N >= 10 trials each on one fixed model and temperature with randomized trial order; score with `evals/score.py` using bootstrap confidence intervals; headline only composite lifts whose 95% CI excludes 0, and report verification-honesty separately. Before any "improving over time" claim, author at least one held-out task in a different domain so the single dev task cannot be gamed. This converts the static 100/100 into an outcome number with a confidence interval, which is the evidence the whole effort is reaching for.

## Appendix A. Exact commands

All commands were run against a fresh clone; nothing was pushed to or modified on any candidate branch. See `reproduce.sh` in this directory for the runnable version.

```
git clone https://github.com/KaydenClark/LLM_Workbench.git
git ls-tree -r --name-only origin/<branch>            # file sets
git merge-base origin/main origin/<branch>            # all = a2cdd45
git rev-list --count origin/main..origin/<branch>     # v2=1, eval-fw=1, codex=2
git log --oneline origin/main..origin/<branch>        # codex contains the v2 commit fb406e1
git diff --stat origin/main origin/<branch>           # v2: 9 files +51/-6; eval-fw: +1140; codex: +556
git diff --stat origin/.../v2 origin/.../codex        # shared template .md files identical
git diff origin/main origin/.../v2                    # full read of the template upgrade

# Static rubric (codex evaluator), reproduced for every branch + controls:
node tools/test-evaluate-workbench.mjs                # -> self-test passes; local 100, single-file 2
node tools/evaluate-workbench.mjs --path <worktree> --json
#   main 84.5 ; v2 100 ; eval-framework 84.5 ; codex 100
#   control:no-template 0 ; control:single-instruction-file 2

# Behavioral harness (eval-framework), verified on synthetic data, no API budget:
python3 evals/lib/stats.py                            # EXIT 0
python3 evals/results/_make_selftest.py               # writes 48 SYNTHETIC rows
python3 evals/score.py evals/results/_pipeline_selftest.jsonl --baseline c0_none
#   report renders; model field reads SYNTHETIC-not-a-real-run; CI/z/Fisher all compute
git ls-files evals/results/ | grep -v '/_'            # no real result files
grep -c "none yet" evals/results/LEDGER.md            # 1 -> zero real runs
```

## Appendix B. Raw data

The complete per-criterion output of the static evaluator for all four branches and both controls is in `static_breakdown.jsonl` (one JSON object per line), the source for Table 3.
