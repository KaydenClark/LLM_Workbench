#!/usr/bin/env python3
"""Aggregate eval result rows into a statistical comparison report.

Input: one or more JSONL files of trial results (see results/SCHEMA.md), each
line one task x condition x trial. Output: a Markdown report with per-task
diagnostics plus a canonical, same-task, equal-task-weighted real-agent
comparison with bootstrap CIs.

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
    seen_paths: set[Path] = set()
    for pat in patterns:
        for path in sorted(glob.glob(pat)):
            resolved = Path(path).resolve()
            if resolved in seen_paths:
                continue
            seen_paths.add(resolved)
            with resolved.open() as fh:
                for line in fh:
                    line = line.strip()
                    if line:
                        row = json.loads(line)
                        row["_source_file"] = str(resolved)
                        rows.append(row)
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


def row_composite(row: dict, dims: list[str]) -> float | None:
    scores = [
        float(row["scores"][dim])
        for dim in dims
        if dim in row.get("scores", {})
    ]
    return sum(scores) / len(scores) if scores else None


def task_class(row: dict) -> str:
    value = row.get("task_class", row.get("suite"))
    return (
        value
        if isinstance(value, str) and value in {"development", "heldout"}
        else "unclassified"
    )


def evidence_class(row: dict) -> str:
    source = Path(str(row.get("_source_file", ""))).name
    run_id = str(row.get("run_id", "")).upper()
    model = str(row.get("model", "")).upper()
    explicit = row.get("evidence_class")
    if (
        explicit == "synthetic"
        or source.startswith("_")
        or run_id == "SELFTEST"
        or model.startswith("SYNTHETIC")
    ):
        return "synthetic"
    if explicit == "real-agent":
        return "real-agent"
    return "unclassified"


def eligible_real_row(row: dict) -> bool:
    return (
        evidence_class(row) == "real-agent"
        and task_class(row) in {"development", "heldout"}
    )


def joined_metadata(rows: list[dict], key: str) -> str:
    values = sorted({
        str(row.get(key, "")).strip()
        for row in rows
        if str(row.get(key, "")).strip()
    })
    return ", ".join(values) if values else "—"


def ref_metadata(rows: list[dict]) -> str:
    refs = []
    for row in rows:
        ref = str(row.get("condition_ref", "")).strip()
        sha = str(row.get("condition_sha", "")).strip()
        value = ref or "—"
        if sha:
            value += f"@{sha[:12]}"
        if value not in refs:
            refs.append(value)
    return ", ".join(sorted(refs)) if refs else "—"


def per_task_rows(rows: list[dict]) -> dict[tuple[str, str, str, str], list[dict]]:
    grouped: dict[tuple[str, str, str, str], list[dict]] = collections.defaultdict(list)
    for row in rows:
        grouped[(
            str(row.get("task", "unclassified")),
            task_class(row),
            evidence_class(row),
            str(row["condition"]),
        )].append(row)
    return grouped


def render_task_outcomes(rows: list[dict], dims: list[str], baseline: str) -> list[str]:
    grouped = per_task_rows(rows)
    out = [
        "## Per-task composite outcomes\n",
        "These rows preserve task and evidence class. Synthetic and unclassified "
        "rows remain visible as apparatus diagnostics but cannot enter real-agent totals.\n",
        "| Task | Task class | Evidence class | Condition | n | Composite mean | "
        "95% CI | Lift vs baseline (95% CI) | Provider | Model | Reasoning | Ref@SHA |",
        "|---|---|---|---|---:|---:|---|---|---|---|---|---|",
    ]
    for key in sorted(grouped):
        task, task_kind, evidence_kind, condition = key
        group_rows = grouped[key]
        values = [
            value for row in group_rows
            if (value := row_composite(row, dims)) is not None
        ]
        if not values:
            mean_text = interval_text = "—"
        else:
            interval = stats.bootstrap_mean(values)
            mean_text = f"{interval.mean:.2f}"
            interval_text = f"[{interval.ci_low:.2f}, {interval.ci_high:.2f}]"
        if condition == baseline:
            lift_text = "baseline"
        else:
            base_rows = grouped.get((task, task_kind, evidence_kind, baseline), [])
            base = [
                value for row in base_rows
                if (value := row_composite(row, dims)) is not None
            ]
            lift_text = stats.bootstrap_diff(values, base).summary() if values and base else "—"
        out.append(
            f"| `{task}` | {task_kind} | {evidence_kind} | `{condition}` | "
            f"{len(values)} | {mean_text} | {interval_text} | {lift_text} | "
            f"{joined_metadata(group_rows, 'provider')} | "
            f"{joined_metadata(group_rows, 'model')} | "
            f"{joined_metadata(group_rows, 'reasoning_effort')} | "
            f"{ref_metadata(group_rows)} |"
        )
    out.append("")
    return out


def render_real_comparison(rows: list[dict], dims: list[str], baseline: str) -> list[str]:
    real_rows = [row for row in rows if eligible_real_row(row)]
    out = ["## Real-agent composite comparison\n"]
    if not real_rows:
        out.append(
            "No eligible real-agent rows. Synthetic, non-canonical evidence, and "
            "non-canonical task classes are mechanically excluded from this section.\n"
        )
        return out
    task_conditions: dict[str, dict[str, list[float]]] = collections.defaultdict(
        lambda: collections.defaultdict(list)
    )
    for row in real_rows:
        value = row_composite(row, dims)
        if value is not None:
            task_conditions[str(row["task"])][str(row["condition"])].append(value)

    conditions = sorted({
        condition
        for groups in task_conditions.values()
        for condition in groups
        if condition != baseline
    })
    out.append(
        "Only canonical `real-agent` rows from `development` or `heldout` tasks "
        "enter this claim-facing section. Each comparison uses same-task complete "
        "cells and weights every comparable task equally.\n"
    )
    if not conditions:
        out.append("No non-baseline condition is available for comparison.\n")
        return out

    tasks = sorted(task_conditions)
    for condition in conditions:
        comparable = [
            task for task in tasks
            if baseline in task_conditions[task]
            and condition in task_conditions[task]
        ]
        excluded = []
        for task in tasks:
            missing = [
                name for name in (baseline, condition)
                if name not in task_conditions[task]
            ]
            if missing:
                excluded.append(
                    f"`{task}` (missing "
                    + " and ".join(f"`{name}`" for name in missing)
                    + ")"
                )

        out.append(f"### `{condition}` vs `{baseline}`\n")
        out.append(
            f"- Comparable tasks: **{len(comparable)}** "
            f"({', '.join(f'`{task}`' for task in comparable) or 'none'})"
        )
        out.append(
            f"- Excluded tasks: **{len(excluded)}** "
            f"({'; '.join(excluded) or 'none'})"
        )
        if not comparable:
            out.append(
                f"- **Headline suppressed:** no task has both `{baseline}` and "
                f"`{condition}` rows.\n"
            )
            continue

        treatment = {
            task: task_conditions[task][condition]
            for task in comparable
        }
        control = {
            task: task_conditions[task][baseline]
            for task in comparable
        }
        comparison = stats.bootstrap_stratified_diff(treatment, control)
        treatment_n = sum(len(values) for values in treatment.values())
        control_n = sum(len(values) for values in control.values())
        out.append(
            f"- Samples: candidate n={treatment_n}; baseline n={control_n}"
        )
        out.append(
            f"- Equal-task composite: **{comparison.mean_treatment:.3f} vs "
            f"{comparison.mean_control:.3f}**"
        )
        out.append(f"- Task-stratified lift: {comparison.summary()}\n")
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

    evidence_counts = collections.Counter(evidence_class(row) for row in rows)
    real_rows = [row for row in rows if eligible_real_row(row)]
    invalid_task_rows = [
        row for row in rows
        if evidence_class(row) == "real-agent"
        and task_class(row) == "unclassified"
    ]
    out.append("## Evidence inventory\n")
    out.append("| Evidence class | Rows | Tasks | Conditions |")
    out.append("|---|---:|---:|---:|")
    for kind in ("real-agent", "synthetic", "unclassified"):
        classified = [row for row in rows if evidence_class(row) == kind]
        out.append(
            f"| {kind} | {len(classified)} | "
            f"{len({row.get('task') for row in classified})} | "
            f"{len({row.get('condition') for row in classified})} |"
        )
    out.append("")
    out.append(f"Eligible real-agent evidence rows: **{len(real_rows)}**")
    out.append(
        "Excluded from real-agent totals: "
        f"**{evidence_counts['synthetic']} synthetic**, "
        f"**{evidence_counts['unclassified']} unclassified**"
    )
    out.append(
        f"Non-canonical evidence class: **{evidence_counts['unclassified']}**"
    )
    out.append(f"Non-canonical task class: **{len(invalid_task_rows)}**")
    out.append("")
    out.extend(render_task_outcomes(rows, dims, baseline))
    out.extend(render_real_comparison(rows, dims, baseline))

    if baseline not in conditions:
        out.append(f"> **Baseline `{baseline}` not present in data** — cannot compute lifts.")
        return "\n".join(out)

    # Per-dimension means table
    out.append("## Mean score by dimension\n")
    out.append(
        "> Apparatus diagnostic over every input row. This table is not a "
        "real-agent evidence claim unless every row is eligible above.\n"
    )
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
    out.append(
        "> Apparatus diagnostic over every input row. It may contain synthetic "
        "or unmatched task-condition cells and must not be cited as the "
        "claim-facing lift; use the real-agent comparison above.\n"
    )
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
        "- **Real-agent composite** is claim-facing only when it uses canonical "
        "evidence/task classes and same-task complete condition cells. Every task "
        "has equal weight regardless of trial count.\n"
        "- The all-row composite remains an apparatus diagnostic so fixture and "
        "legacy single-file scoring stays inspectable.\n"
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
