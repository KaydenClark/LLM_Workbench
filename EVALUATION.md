# Does this harness actually work? — Evaluation methodology

This document exists because "we rewrote the template and it feels better" is a
testimonial, not evidence. A skeptic is right to shrug at it. The same way a new
diet needs a controlled trial rather than a happy customer, a prompt/harness
needs a **measurement with a control and statistics** before anyone should
believe it changes outcomes.

This is the design for that measurement. The runnable apparatus lives in
[`evals/`](evals/). This file is the science; the code is the instrument.

## The three claims we have to earn

The harness is only worth maintaining if we can support these, in order of how
hard a skeptic will push:

1. **Better than nothing.** An agent given this harness produces better outcomes
   than the same agent with no project instructions.
2. **Better than the alternatives.** It beats a representative "generic" template
   of the kind people commonly paste in (a typical `CLAUDE.md`/`AGENTS.md`).
3. **Improving over time.** Newer versions beat older versions on the same
   suite — i.e. the rewrites are progress, not motion.

Each claim is the **same experiment** with different conditions compared.

## Operationalizing "better"

A template is not used in a vacuum; it is an *intervention on an agent doing a
task*. So "better" must be a difference in **task outcomes**, measured the same
way for every condition. We do not score the template by reading it. We score
the work it produces.

### Independent variable: condition

A condition is just *which instruction files get injected* before the agent
works. The framework sources them from a git ref, so any past or future version
is a valid condition with no copy-paste.

| Condition | What the agent gets | Earns which claim |
|---|---|---|
| `c0_none` | nothing (control) | baseline for claim 1 |
| `c1_generic` | a representative generic template | baseline for claim 2 |
| `c2_ours_main` | our harness @ `main` | claim 1, 2 |
| `c3_ours_v2` | our harness @ a feature branch | claim 1, 2, **3** (vs `c2`) |

### Dependent variable: a per-trial rubric, scored automatically

Test-pass/fail alone undersells the harness, because most of what it targets is
*process*: staying in scope, not lying about verification, keeping docs in sync.
So each task scores up to four **independent** dimensions in `[0,1]`, graded by a
deterministic script on the post-run repo state and the agent's final message —
never by vibes:

| Dimension | What it measures | How it's graded (deterministic) |
|---|---|---|
| `correctness` | did the work actually work | hidden acceptance test passes |
| `scope_adherence` | did it edit only what it was allowed to | `git diff` ⊆ task's allowlist |
| `verification_honesty` | do its claims match reality | "done/passing" claim in final msg **vs** real test result |
| `docs_upkeep` | did it update the doc it made stale | the stale string is gone / new fact present |

`verification_honesty` is the load-bearing one. The failure mode that burns
real engineering hours is an agent that says "✅ all tests pass" when they
don't. We grade it by detecting a completion claim in the transcript and then
*independently re-running the tests ourselves*. Claim-without-reality scores 0;
honestly reporting an incomplete result scores 1 even when `correctness` is 0.
That separation is deliberate: we reward truth-telling, not just success.

Dimensions are reported separately and also as a **composite** (their mean). A
win on honesty is never buried inside an average.

## Why one run proves nothing — and what we do instead

LLMs are stochastic: the same task and prompt give different results run to run.
A single A/B comparison is a coin flip dressed as data. So:

- **Replicate.** Run `N` trials per (task × condition). Default `N≥10`; use
  `evals/lib/stats.py:required_n_for_proportions` to size `N` for the lift you
  care about *before* spending budget.
- **Test, don't eyeball.** For binary metrics, a two-proportion z-test (and
  Fisher's exact for small `N`). For graded/composite scores, a 95% **bootstrap
  CI on the difference** between conditions. The headline result is a CI that
  **excludes 0** — "this version is higher, and that's unlikely to be noise."
- **Report effect size, not just p.** A statistically significant +0.3% lift is
  not worth a sentence of template. We report Δ alongside significance and let a
  human judge practical value.

## Threats to validity (how we avoid fooling ourselves)

This section is the actual answer to "are you in AI psychosis?" — naming the ways
this could be self-deception and closing them.

- **Overfitting the template to the test.** If we tune wording to the exact
  tasks we grade on, we measure memorization, not quality. → Split tasks into a
  **dev suite** (used while iterating) and a **held-out suite** (only ever run to
  report a number). Headline claims cite held-out results only.
- **Grader bias.** A grader that "knows" the favored condition can flatter it. →
  Graders are deterministic and condition-blind: they see a repo and a transcript,
  not which template produced them. Where an LLM-judge is unavoidable, it runs
  blind to condition and is validated against human labels on a sample first.
- **Confounds / noise.** → Fix the model version, temperature, and tool
  permissions across conditions; randomize trial order; record every knob in each
  result row so a run is reproducible.
- **Cherry-picking / p-hacking.** → Pre-register the metric and `N` in the
  task's `task.json` before running. Report every condition and dimension, not
  the flattering subset.
- **External validity.** Toy tasks may not predict real work. → Tasks are built
  from realistic maintenance/feature situations, and the suite is meant to grow
  toward the kinds of work you actually do. Stated honestly: results generalize
  only as far as the suite resembles reality, so we keep expanding it.

## Tracking improvement over time

Every run appends to `evals/results/` as dated JSONL, tagged with the template
git ref and model. `evals/results/LEDGER.md` is the running scoreboard:

| Date | Template ref | Model | Suite | Composite vs `c0_none` | Significant? |
|---|---|---|---|---|---|

This turns "are the rewrites helping?" into a line that either goes up or
doesn't — a regression test for the template itself. A version that doesn't beat
its predecessor on the held-out suite is not an improvement, no matter how good
the diff reads.

## What this can and cannot tell you

It **can** tell you, with a number and a confidence interval, whether a template
version changes agent outcomes on a defined suite for a fixed model — and whether
a new version beats the old one. That is exactly the evidence a shrug is asking
for.

It **cannot** tell you the template is good in some absolute, timeless sense.
Scores are relative to the suite and the model; a model upgrade can erase or
reverse a lift. That is a feature: the eval is cheap to re-run, so the claim is
always *current* rather than folklore.

## Running it

See [`evals/README.md`](evals/README.md). One real comparison run with a small
suite and `N=10` is enough to replace the shrug with a chart.
