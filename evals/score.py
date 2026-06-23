#!/usr/bin/env python3
"""Aggregate eval result rows into a statistical comparison report.

Input: one or more JSONL files of trial results (see results/SCHEMA.md), each
line one task x condition x trial. Output: a Markdown report comparing every
condition against a baseline, per scoring dimension, with bootstrap CIs and a
two-proportion test on the binary headline metric.

Usage:
    python3 evals/score.py results/*.jsonl --baseline c0_none
    python3 evals/score.py results/run_2026-06-23.jsonl --baseline c2_ours_main \
        --report evals/results/report_2026-06-23.md
"""

from __future__ import annotations

import argparse
import collections
import glob
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent / "lib"))
import stats  # noqa: E402


def load_rows(patterns: list[str]) -> list[dict]:
    rows: list[dict] = []
    for pat in patterns:
        for path in sorted(glob.glob(pat)):
            with open(path) as fh:
                for line in fh:
                    line = line.strip()
                    if line:
                        rows.append(json.loads(line))
    return rows


def dimensions(rows: list[dict]) -> list[str]:
    dims: list[str] = []
    for r in rows:
        for d in r.get("scores", {}):
            if d not in dims:
                dims.append(d)
    return dims


def by_condition(rows: list[dict], dim: str) -> dict[str, list[float]]:
    out: dict[str, list[float]] = collections.defaultdict(list)
    for r in rows:
        if dim in r.get("scores", {}):
            out[r["condition"]].append(float(r["scores"][dim]))
    return out


def composite(rows: list[dict], dims: list[str]) -> dict[str, list[float]]:
    """Mean of available dimensions per trial -> one score per trial."""
    out: dict[str, list[float]] = collections.defaultdict(list)
    for r in rows:
        sc = [float(r["scores"][d]) for d in dims if d in r.get("scores", {})]
        if sc:
            out[r["condition"]].append(sum(sc) / len(sc))
    return out


def render(rows: list[dict], baseline: str) -> str:
    dims = dimensions(rows)
    conditions = sorted({r["condition"] for r in rows})
    n_trials = collections.Counter(r["condition"] for r in rows)
    tasks = sorted({r["task"] for r in rows})
    models = sorted({r.get("model", "?") for r in rows})

    out: list[str] = []
    out.append("# Harness Evaluation Report\n")
    out.append(f"- Conditions: {', '.join(conditions)}")
    out.append(f"- Baseline: `{baseline}`")
    out.append(f"- Tasks ({len(tasks)}): {', '.join(tasks)}")
    out.append(f"- Model(s): {', '.join(models)}")
    out.append(f"- Trials per condition: " +
               ", ".join(f"{c}={n_trials[c]}" for c in conditions))
    out.append("")

    if baseline not in conditions:
        out.append(f"> **Baseline `{baseline}` not present in data** — cannot compute lifts.")
        return "\n".join(out)

    # Per-dimension means table
    out.append("## Mean score by dimension\n")
    header = "| Condition | " + " | ".join(dims) + " | composite |"
    sep = "|" + "---|" * (len(dims) + 2)
    out.append(header)
    out.append(sep)
    comp = composite(rows, dims)
    for c in conditions:
        cells = []
        for d in dims:
            vals = by_condition(rows, d).get(c, [])
            cells.append(f"{stats.mean(vals):.2f}" if vals else "—")
        comp_vals = comp.get(c, [])
        cells.append(f"**{stats.mean(comp_vals):.2f}**" if comp_vals else "—")
        out.append(f"| `{c}` | " + " | ".join(cells) + " |")
    out.append("")

    # Per-dimension lift vs baseline with bootstrap CI
    out.append(f"## Lift vs baseline `{baseline}` (95% bootstrap CI)\n")
    out.append("A CI that excludes 0 (`*`) means the difference is unlikely to be noise.\n")
    for d in dims + ["composite"]:
        groups = comp if d == "composite" else by_condition(rows, d)
        base = groups.get(baseline, [])
        if not base:
            continue
        out.append(f"### {d}\n")
        for c in conditions:
            if c == baseline:
                continue
            treat = groups.get(c, [])
            if not treat:
                continue
            ci = stats.bootstrap_diff(treat, base)
            line = f"- `{c}`: {ci.summary()}"
            # binary metric -> also report exact / z test
            if set(treat) <= {0.0, 1.0} and set(base) <= {0.0, 1.0}:
                zt = stats.two_proportion_z(
                    int(sum(treat)), len(treat), int(sum(base)), len(base))
                fe = stats.fisher_exact(
                    int(sum(treat)), len(treat), int(sum(base)), len(base))
                line += f"  · z-test p={zt.p_value:.4f}, Fisher p={fe:.4f}"
            out.append(line)
        out.append("")

    out.append("## How to read this\n")
    out.append(
        "- **composite** is the headline: mean of all dimensions per trial. "
        "If a condition's composite lift CI excludes 0, that template version "
        "beats the baseline on this task suite for this model.\n"
        "- Dimensions are reported separately so a win on one axis "
        "(e.g. verification_honesty) is never hidden inside an average.\n"
        "- Significance here is statistical, not practical: pair it with the "
        "effect size (Δ) and decide if the lift is worth the words.")
    return "\n".join(out)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("results", nargs="+", help="JSONL result files / globs")
    ap.add_argument("--baseline", default="c0_none")
    ap.add_argument("--report", help="write Markdown here (default: stdout)")
    args = ap.parse_args()

    rows = load_rows(args.results)
    if not rows:
        print("no result rows found", file=sys.stderr)
        return 1
    report = render(rows, args.baseline)
    if args.report:
        Path(args.report).write_text(report)
        print(f"wrote {args.report} ({len(rows)} rows)")
    else:
        print(report)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
