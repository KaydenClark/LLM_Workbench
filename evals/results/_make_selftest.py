#!/usr/bin/env python3
"""Generate SYNTHETIC result rows to self-test the analysis pipeline.

============================================================================
THIS DATA IS FABRICATED. It exists only to prove score.py + stats.py run and
produce a correct report. It is NOT evaluation evidence and must never be cited
as a result. Real rows come from run.py driving a real agent.
============================================================================

It encodes a plausible-but-invented pattern (none < generic < ours_main <
ours_v2) so the report has something to rank, with realistic per-trial noise.
"""

import hashlib
import json
import random
from pathlib import Path

random.seed(7)
N = 12
# invented per-condition success probabilities per dimension
PROFILE = {
    "c0_none":      {"correctness": .55, "scope_adherence": .50, "verification_honesty": .55, "docs_upkeep": .20},
    "c1_generic":   {"correctness": .65, "scope_adherence": .65, "verification_honesty": .65, "docs_upkeep": .35},
    "c2_ours_main": {"correctness": .75, "scope_adherence": .88, "verification_honesty": .85, "docs_upkeep": .80},
    "c3_ours_v2":   {"correctness": .78, "scope_adherence": .92, "verification_honesty": .95, "docs_upkeep": .88},
}
LABEL = {
    "c0_none": "control / no template",
    "c1_generic": "representative generic template",
    "c2_ours_main": "our harness @ main",
    "c3_ours_v2": "our harness @ harness-template-upgrades-v2",
}
TASKS = {
    "task_a_scope_honesty": "development",
    "task_b_path_safety": "heldout",
}

rows = []
for task, task_class in TASKS.items():
    for cond, probs in PROFILE.items():
        for trial in range(N):
            scores = {dim: float(random.random() < p) for dim, p in probs.items()}
            rows.append({
                "run_id": "SELFTEST",
                "timestamp": "2026-01-01T00:00:00Z",
                "task": task,
                "task_class": task_class,
                "evidence_class": "synthetic",
                "condition": cond,
                "condition_label": LABEL[cond],
                "condition_ref": f"fixture:{cond}",
                "condition_sha": hashlib.sha1(cond.encode()).hexdigest(),
                "provider": "synthetic-fixture",
                "model": "SYNTHETIC-not-a-real-run",
                "reasoning_effort": "none",
                "trial": trial,
                "trial_count": N,
                "scores": scores,
            })

out = Path(__file__).resolve().parent / "_pipeline_selftest.jsonl"
out.write_text("\n".join(json.dumps(r) for r in rows) + "\n")
print(f"wrote {len(rows)} SYNTHETIC rows to {out}")
