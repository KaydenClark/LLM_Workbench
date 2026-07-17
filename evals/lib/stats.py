"""Small, dependency-free statistics for comparing eval conditions.

Everything here works on plain lists of per-trial scores. Two families:

- proportions (binary outcomes, e.g. "did tests pass": 1/0) -> two-proportion
  z-test and Fisher's exact for small samples;
- means (graded scores in [0,1]) -> bootstrap confidence interval on the
  difference between two conditions.

No numpy/scipy: this must run anywhere Python 3 runs, so the framework has no
install step that could itself fail and muddy a result.
"""

from __future__ import annotations

import math
import random
from dataclasses import dataclass


# --------------------------------------------------------------------------- #
# Proportions (binary metrics)
# --------------------------------------------------------------------------- #

def _normal_sf(z: float) -> float:
    """Upper-tail probability of the standard normal (1 - CDF)."""
    return 0.5 * math.erfc(z / math.sqrt(2.0))


@dataclass
class ProportionTest:
    p_treatment: float
    p_control: float
    diff: float          # treatment - control, in percentage points / 1.0
    z: float
    p_value: float       # two-sided
    n_treatment: int
    n_control: int

    def summary(self) -> str:
        return (
            f"{self.p_treatment:.1%} vs {self.p_control:.1%} "
            f"(Δ={self.diff:+.1%}, z={self.z:.2f}, p={self.p_value:.4f}, "
            f"n={self.n_treatment}/{self.n_control})"
        )


def two_proportion_z(succ_t: int, n_t: int, succ_c: int, n_c: int) -> ProportionTest:
    """Two-sided two-proportion z-test (treatment vs control).

    Use when each trial is a clean pass/fail and you have a reasonable number
    of trials. For very small n, prefer fisher_exact below.
    """
    if n_t == 0 or n_c == 0:
        raise ValueError("both groups need at least one trial")
    p_t = succ_t / n_t
    p_c = succ_c / n_c
    p_pool = (succ_t + succ_c) / (n_t + n_c)
    se = math.sqrt(p_pool * (1 - p_pool) * (1 / n_t + 1 / n_c))
    if se == 0:
        z = 0.0
        p = 1.0
    else:
        z = (p_t - p_c) / se
        p = 2 * _normal_sf(abs(z))
    return ProportionTest(p_t, p_c, p_t - p_c, z, p, n_t, n_c)


def fisher_exact(succ_t: int, n_t: int, succ_c: int, n_c: int) -> float:
    """Two-sided Fisher's exact p-value for a 2x2 table. Exact, good for small n."""
    a, b = succ_t, n_t - succ_t          # treatment: success, failure
    c, d = succ_c, n_c - succ_c          # control:   success, failure
    row1, row2 = a + b, c + d
    col1, col2 = a + c, b + d
    total = a + b + c + d

    def hyper(a_):
        b_, c_, d_ = row1 - a_, col1 - a_, d + (a - a_)
        if min(b_, c_, d_) < 0:
            return 0.0
        return math.exp(
            math.lgamma(row1 + 1) + math.lgamma(row2 + 1)
            + math.lgamma(col1 + 1) + math.lgamma(col2 + 1)
            - math.lgamma(total + 1)
            - math.lgamma(a_ + 1) - math.lgamma(b_ + 1)
            - math.lgamma(c_ + 1) - math.lgamma(d_ + 1)
        )

    p_observed = hyper(a)
    lo = max(0, a + c - n_c if False else max(0, col1 - row2))
    hi = min(row1, col1)
    total_p = 0.0
    for a_ in range(lo, hi + 1):
        p_ = hyper(a_)
        if p_ <= p_observed * (1 + 1e-7):
            total_p += p_
    return min(1.0, total_p)


# --------------------------------------------------------------------------- #
# Means (graded metrics in [0,1])
# --------------------------------------------------------------------------- #

@dataclass
class DiffCI:
    mean_treatment: float
    mean_control: float
    diff: float
    ci_low: float
    ci_high: float
    significant: bool     # does the 95% CI exclude 0?

    def summary(self) -> str:
        star = "  *significant*" if self.significant else ""
        return (
            f"{self.mean_treatment:.3f} vs {self.mean_control:.3f} "
            f"(Δ={self.diff:+.3f}, 95% CI [{self.ci_low:+.3f}, {self.ci_high:+.3f}]){star}"
        )


@dataclass
class MeanCI:
    mean: float
    ci_low: float
    ci_high: float
    n: int

    def summary(self) -> str:
        return (
            f"{self.mean:.3f} "
            f"(95% CI [{self.ci_low:.3f}, {self.ci_high:.3f}], n={self.n})"
        )


def bootstrap_mean(
    observations: list[float],
    iters: int = 10000,
    seed: int = 0,
) -> MeanCI:
    """95% bootstrap CI for one sample mean."""
    if not observations:
        raise ValueError("at least one observation is required")
    rng = random.Random(seed)
    means = []
    for _ in range(iters):
        means.append(mean([
            observations[rng.randrange(len(observations))]
            for _ in observations
        ]))
    means.sort()
    lo = means[int(0.025 * iters)]
    hi = means[int(0.975 * iters)]
    return MeanCI(mean(observations), lo, hi, len(observations))


def bootstrap_stratified_diff(
    treatment: dict[str, list[float]],
    control: dict[str, list[float]],
    iters: int = 10000,
    seed: int = 0,
) -> DiffCI:
    """Equal-task mean difference with a two-stage task/observation bootstrap."""
    tasks = sorted(treatment)
    if not tasks or set(tasks) != set(control):
        raise ValueError("treatment and control need the same non-empty task strata")
    if iters < 1:
        raise ValueError("iters must be at least 1")
    for task in tasks:
        for observations in (treatment[task], control[task]):
            if not observations:
                raise ValueError(f"task {task!r} needs at least one observation per condition")
            if not all(math.isfinite(value) for value in observations):
                raise ValueError(f"task {task!r} observations must be finite")

    mean_treatment = mean([mean(treatment[task]) for task in tasks])
    mean_control = mean([mean(control[task]) for task in tasks])
    rng = random.Random(seed)
    diffs = []
    for _ in range(iters):
        sampled_tasks = [tasks[rng.randrange(len(tasks))] for _ in tasks]
        treatment_means = []
        control_means = []
        for task in sampled_tasks:
            treatment_values = treatment[task]
            control_values = control[task]
            treatment_means.append(mean([
                treatment_values[rng.randrange(len(treatment_values))]
                for _ in treatment_values
            ]))
            control_means.append(mean([
                control_values[rng.randrange(len(control_values))]
                for _ in control_values
            ]))
        diffs.append(mean(treatment_means) - mean(control_means))

    diffs.sort()
    lo = diffs[int(0.025 * iters)]
    hi = diffs[int(0.975 * iters)]
    diff = mean_treatment - mean_control
    return DiffCI(
        mean_treatment,
        mean_control,
        diff,
        lo,
        hi,
        significant=(lo > 0 or hi < 0),
    )


def bootstrap_diff(
    treatment: list[float],
    control: list[float],
    iters: int = 10000,
    seed: int = 0,
) -> DiffCI:
    """95% bootstrap CI on (mean(treatment) - mean(control)).

    Resamples each group with replacement `iters` times. The CI excluding 0 is
    the headline claim: "this condition scores higher, and the difference is
    not plausibly noise."
    """
    if not treatment or not control:
        raise ValueError("both groups need at least one observation")
    rng = random.Random(seed)
    mt, mc = mean(treatment), mean(control)
    diffs = []
    for _ in range(iters):
        rt = mean([treatment[rng.randrange(len(treatment))] for _ in treatment])
        rc = mean([control[rng.randrange(len(control))] for _ in control])
        diffs.append(rt - rc)
    diffs.sort()
    lo = diffs[int(0.025 * iters)]
    hi = diffs[int(0.975 * iters)]
    return DiffCI(mt, mc, mt - mc, lo, hi, significant=(lo > 0 or hi < 0))


def mean(xs: list[float]) -> float:
    return sum(xs) / len(xs) if xs else 0.0


def required_n_for_proportions(p_control: float, mde: float, alpha=0.05, power=0.8) -> int:
    """Rough per-group sample size to detect an absolute lift `mde` over
    `p_control` (two-sided). Lets you answer "how many trials do we need?"
    before spending API budget."""
    z_a = 1.959963985  # two-sided 0.05
    z_b = 0.841621234  # power 0.80
    p1, p2 = p_control, min(0.999, p_control + mde)
    pbar = (p1 + p2) / 2
    num = (z_a * math.sqrt(2 * pbar * (1 - pbar)) + z_b * math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))) ** 2
    return math.ceil(num / (mde ** 2))
