#!/usr/bin/env python3
"""Deterministic tests for the multi-task evaluation report."""

from __future__ import annotations

import unittest

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
        self.assertIn("Real-agent evidence rows: **0**", report)
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

        self.assertIn("Real-agent evidence rows: **4**", report)
        self.assertIn(
            "Excluded from real-agent totals: **4 synthetic**, **0 unclassified**",
            report,
        )
        real_section = report.split("## Real-agent composite comparison", 1)[1]
        self.assertIn("| `c0_none` | 2 | 1.00 |", real_section)
        self.assertIn("| `c3_candidate` | 2 | 0.00 |", real_section)
        self.assertNotIn("| `c3_candidate` | 4 |", real_section)

    def test_unclassified_legacy_rows_still_render_but_do_not_count_as_real(self) -> None:
        legacy = {
            "run_id": "legacy",
            "task": "task_a_scope_honesty",
            "condition": "c0_none",
            "model": "legacy-model",
            "scores": {"correctness": 1.0},
        }

        report = score.render([legacy], "c0_none")

        self.assertIn("Real-agent evidence rows: **0**", report)
        self.assertIn(
            "Excluded from real-agent totals: **0 synthetic**, **1 unclassified**",
            report,
        )
        self.assertIn("| `task_a_scope_honesty` | unclassified | unclassified |", report)


if __name__ == "__main__":
    unittest.main()
