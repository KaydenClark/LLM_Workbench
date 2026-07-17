#!/usr/bin/env python3
"""Deterministic tests for the multi-task evaluation report."""

from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

import score


def row(
    task: str,
    task_class: str,
    evidence_class: str,
    condition: str,
    trial: int,
    value: float,
) -> dict:
    return {
        "run_id": "fixture",
        "task": task,
        "task_class": task_class,
        "evidence_class": evidence_class,
        "condition": condition,
        "condition_ref": f"refs/heads/{condition}",
        "condition_sha": condition[-1] * 40,
        "provider": "fixture",
        "model": "fixture-model",
        "reasoning_effort": "fixture",
        "trial": trial,
        "trial_count": 2,
        "scores": {"correctness": value, "scope_adherence": value},
    }


class MultiTaskReportTests(unittest.TestCase):
    def test_reports_task_classes_intervals_and_synthetic_exclusion(self) -> None:
        rows = []
        for task, task_class in (
            ("task_a_scope_honesty", "development"),
            ("task_b_path_safety", "heldout"),
        ):
            for condition, value in (("c0_none", 0.0), ("c3_candidate", 1.0)):
                rows.extend(
                    row(task, task_class, "synthetic", condition, trial, value)
                    for trial in range(2)
                )

        report = score.render(rows, "c0_none")

        self.assertIn("## Evidence inventory", report)
        self.assertIn("Eligible real-agent evidence rows: **0**", report)
        self.assertIn(
            "Excluded from real-agent totals: **8 synthetic**, **0 unclassified**",
            report,
        )
        self.assertIn("## Per-task composite outcomes", report)
        self.assertIn(
            "| `task_a_scope_honesty` | development | synthetic | `c0_none` | 2 |",
            report,
        )
        self.assertIn(
            "| `task_b_path_safety` | heldout | synthetic | `c3_candidate` | 2 |",
            report,
        )
        self.assertIn("95% CI", report)
        self.assertIn("## Real-agent composite comparison", report)
        self.assertIn("No eligible real-agent rows", report)

    def test_real_composite_excludes_synthetic_rows(self) -> None:
        rows = []
        for condition, synthetic_value, real_value in (
            ("c0_none", 0.0, 1.0),
            ("c3_candidate", 1.0, 0.0),
        ):
            rows.extend(
                row(
                    "task_b_path_safety",
                    "heldout",
                    "synthetic",
                    condition,
                    trial,
                    synthetic_value,
                )
                for trial in range(2)
            )
            rows.extend(
                row(
                    "task_b_path_safety",
                    "heldout",
                    "real-agent",
                    condition,
                    trial,
                    real_value,
                )
                for trial in range(2)
            )

        report = score.render(rows, "c0_none")

        self.assertIn("Eligible real-agent evidence rows: **4**", report)
        self.assertIn(
            "Excluded from real-agent totals: **4 synthetic**, **0 unclassified**",
            report,
        )
        real_section = report.split("## Real-agent composite comparison", 1)[1]
        self.assertIn("### `c3_candidate` vs `c0_none`", real_section)
        self.assertIn("Equal-task composite: **0.000 vs 1.000**", real_section)
        self.assertIn("candidate n=2; baseline n=2", real_section)

    def test_unclassified_legacy_rows_still_render_but_do_not_count_as_real(self) -> None:
        legacy = {
            "run_id": "legacy",
            "task": "task_a_scope_honesty",
            "condition": "c0_none",
            "model": "legacy-model",
            "scores": {"correctness": 1.0},
        }

        report = score.render([legacy], "c0_none")

        self.assertIn("Eligible real-agent evidence rows: **0**", report)
        self.assertIn(
            "Excluded from real-agent totals: **0 synthetic**, **1 unclassified**",
            report,
        )
        self.assertIn("| `task_a_scope_honesty` | unclassified | unclassified |", report)

    def test_claim_totals_require_canonical_evidence_and_task_classes(self) -> None:
        malformed_task = row(
            "malformed_task", "heldout", "real-agent", "c0_none", 0, 1.0
        )
        malformed_task["task_class"] = ["heldout"]
        rows = [
            row("heldout_ok", "heldout", "real-agent", "c0_none", 0, 1.0),
            row("heldout_ok", "heldout", "real-agent", "c3_candidate", 0, 1.0),
            row("alias_real", "heldout", "real", "c0_none", 0, 1.0),
            row("alias_real_agent", "heldout", "real_agent", "c0_none", 0, 1.0),
            row("alias_dev", "dev", "real-agent", "c0_none", 0, 1.0),
            row("unknown_task", "experiment", "real-agent", "c0_none", 0, 1.0),
            malformed_task,
        ]

        report = score.render(rows, "c0_none")

        self.assertIn("Eligible real-agent evidence rows: **2**", report)
        self.assertIn("Non-canonical evidence class: **2**", report)
        self.assertIn("Non-canonical task class: **3**", report)
        real_section = report.split("## Real-agent composite comparison", 1)[1]
        self.assertNotIn("alias_real", real_section)
        self.assertNotIn("alias_real_agent", real_section)
        self.assertNotIn("alias_dev", real_section)
        self.assertNotIn("unknown_task", real_section)

    def test_equal_task_headline_is_not_trial_weighted(self) -> None:
        rows = []
        for trial in range(10):
            rows.append(
                row(
                    "large_development",
                    "development",
                    "real-agent",
                    "c0_none",
                    trial,
                    0.0,
                )
            )
            rows.append(
                row(
                    "large_development",
                    "development",
                    "real-agent",
                    "c3_candidate",
                    trial,
                    1.0,
                )
            )
        rows.extend([
            row("small_heldout", "heldout", "real-agent", "c0_none", 0, 1.0),
            row("small_heldout", "heldout", "real-agent", "c3_candidate", 0, 0.0),
        ])

        report = score.render(rows, "c0_none")
        real_section = report.split("## Real-agent composite comparison", 1)[1]

        self.assertIn("Comparable tasks: **2**", real_section)
        self.assertIn("Equal-task composite: **0.500 vs 0.500**", real_section)
        self.assertIn("Δ=+0.000", real_section)

    def test_missing_task_condition_cells_are_explicitly_excluded(self) -> None:
        rows = [
            row("complete", "development", "real-agent", "c0_none", 0, 0.0),
            row("complete", "development", "real-agent", "c3_candidate", 0, 1.0),
            row("missing_candidate", "heldout", "real-agent", "c0_none", 0, 0.0),
        ]

        report = score.render(rows, "c0_none")
        real_section = report.split("## Real-agent composite comparison", 1)[1]

        self.assertIn("Comparable tasks: **1**", real_section)
        self.assertIn("Excluded tasks: **1**", real_section)
        self.assertIn("`missing_candidate` (missing `c3_candidate`)", real_section)
        self.assertIn("candidate n=1; baseline n=1", real_section)

    def test_headline_is_suppressed_without_any_complete_task_cell(self) -> None:
        rows = [
            row("baseline_only", "development", "real-agent", "c0_none", 0, 0.0),
            row("candidate_only", "heldout", "real-agent", "c3_candidate", 0, 1.0),
        ]

        report = score.render(rows, "c0_none")
        real_section = report.split("## Real-agent composite comparison", 1)[1]

        self.assertIn("Headline suppressed", real_section)
        self.assertIn("`baseline_only` (missing `c3_candidate`)", real_section)
        self.assertIn("`candidate_only` (missing `c0_none`)", real_section)

    def test_overlapping_result_patterns_are_deduplicated_by_resolved_path(self) -> None:
        with tempfile.TemporaryDirectory() as temp:
            result = Path(temp) / "run.jsonl"
            result.write_text(json.dumps(
                row("task", "development", "real-agent", "c0_none", 0, 1.0)
            ) + "\n")

            rows = score.load_rows([str(result), str(Path(temp) / "*.jsonl")])

        self.assertEqual(1, len(rows))


class StatisticsEdgeTests(unittest.TestCase):
    def test_stratified_diff_equal_weights_tasks(self) -> None:
        result = score.stats.bootstrap_stratified_diff(
            {"large": [1.0] * 10, "small": [0.0]},
            {"large": [0.0] * 10, "small": [1.0]},
            iters=100,
        )

        self.assertEqual(0.5, result.mean_treatment)
        self.assertEqual(0.5, result.mean_control)
        self.assertEqual(0.0, result.diff)
        self.assertEqual(-1.0, result.ci_low)
        self.assertEqual(1.0, result.ci_high)
        self.assertFalse(result.significant)

    def test_stratified_diff_rejects_mismatched_or_empty_strata(self) -> None:
        with self.assertRaisesRegex(ValueError, "same non-empty task strata"):
            score.stats.bootstrap_stratified_diff({"a": [1.0]}, {"b": [0.0]})
        with self.assertRaisesRegex(ValueError, "at least one observation"):
            score.stats.bootstrap_stratified_diff({"a": []}, {"a": [0.0]})
        with self.assertRaisesRegex(ValueError, "finite"):
            score.stats.bootstrap_stratified_diff(
                {"a": [float("nan")]}, {"a": [0.0]}
            )
        with self.assertRaisesRegex(ValueError, "iters must be at least 1"):
            score.stats.bootstrap_stratified_diff(
                {"a": [1.0]}, {"a": [0.0]}, iters=0
            )


if __name__ == "__main__":
    unittest.main()
