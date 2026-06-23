#!/usr/bin/env python3
"""Run the agent on a task under one or more conditions and grade each trial.

For every (task x condition x trial) this:
  1. copies the task fixture into a fresh temp repo;
  2. injects the condition's instruction files (none / generic / a git ref of
     our harness) and commits a pristine baseline;
  3. runs the agent headless via the `claude` CLI inside that repo;
  4. captures the final message, runs the task's grader, and appends a JSON
     result row to the output file.

Requires the `claude` CLI to be authenticated (ANTHROPIC_API_KEY or a logged-in
session). It deliberately does nothing clever if that is missing: it prints how
to fix it and exits, rather than fabricating results.

    python3 evals/run.py \
        --task evals/tasks/task_a_scope_honesty \
        --conditions c0_none,c1_generic,c2_ours_main,c3_ours_v2 \
        --trials 10 --model claude-sonnet-4-6 \
        --out evals/results/run_$(date +%F).jsonl
"""

from __future__ import annotations

import argparse
import datetime as dt
import json
import os
import shutil
import subprocess
import sys
import tempfile
import uuid
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
EVALS = Path(__file__).resolve().parent


def sh(cmd, cwd=None, check=True, capture=True):
    return subprocess.run(cmd, cwd=cwd, check=check,
                          capture_output=capture, text=True)


def load_conditions() -> dict:
    data = json.loads((EVALS / "conditions" / "conditions.json").read_text())
    return data["conditions"]


def inject_condition(repo: Path, cond_id: str, cond: dict) -> None:
    """Place the condition's instruction files into the task repo."""
    src = cond.get("source")
    if src == "none":
        return
    if src == "file":
        for dst, rel in cond["files"].items():
            shutil.copyfile(EVALS / rel, repo / dst)
        return
    if src == "git":
        ref = cond["ref"]
        for f in cond["files"]:
            out = sh(["git", "-C", str(REPO_ROOT), "show", f"{ref}:{f}"], check=False)
            if out.returncode != 0:
                continue
            target = repo / f
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_text(out.stdout)
        # Claude Code reads CLAUDE.md; import the harness entry file so it loads.
        entry = cond.get("entry", "AGENTS.md")
        (repo / "CLAUDE.md").write_text(f"@{entry}\n")
        return
    raise ValueError(f"unknown condition source: {src}")


def setup_repo(task_dir: Path, cond_id: str, cond: dict) -> Path:
    work = Path(tempfile.mkdtemp(prefix=f"eval_{cond_id}_"))
    shutil.copytree(task_dir / "fixture", work, dirs_exist_ok=True)
    inject_condition(work, cond_id, cond)
    sh(["git", "init", "-q"], cwd=work)
    sh(["git", "add", "-A"], cwd=work)
    sh(["git", "-c", "user.email=eval@local", "-c", "user.name=eval",
        "commit", "-qm", "pristine baseline (fixture + injected condition)"], cwd=work)
    return work


def run_agent(repo: Path, prompt: str, model: str) -> str:
    """Invoke the headless agent, return its final message text."""
    cmd = ["claude", "-p", prompt, "--output-format", "json",
           "--dangerously-skip-permissions"]
    if model:
        cmd += ["--model", model]
    proc = subprocess.run(cmd, cwd=str(repo), capture_output=True, text=True)
    if proc.returncode != 0:
        return f"[agent error rc={proc.returncode}] {proc.stderr[:2000]}"
    try:
        return json.loads(proc.stdout).get("result", proc.stdout)
    except json.JSONDecodeError:
        return proc.stdout


def grade(task_dir: Path, repo: Path, transcript_file: Path) -> dict:
    grader = task_dir / "grade.py"
    out = sh(["python3", str(grader), "--repo", str(repo),
              "--transcript", str(transcript_file)], check=False)
    try:
        return json.loads(out.stdout)
    except json.JSONDecodeError:
        return {"scores": {}, "detail": {"grader_error": out.stdout + out.stderr}}


def preflight() -> None:
    if shutil.which("claude") is None:
        sys.exit("ERROR: `claude` CLI not found on PATH.")
    if not os.environ.get("ANTHROPIC_API_KEY"):
        # A logged-in CLI session also works; warn rather than hard-fail.
        print("WARNING: ANTHROPIC_API_KEY is not set. The run will fail unless "
              "the claude CLI is otherwise authenticated.", file=sys.stderr)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--task", required=True, help="path to a task dir")
    ap.add_argument("--conditions", default="c0_none,c1_generic,c2_ours_main,c3_ours_v2")
    ap.add_argument("--trials", type=int, default=10)
    ap.add_argument("--model", default="")
    ap.add_argument("--out", required=True)
    ap.add_argument("--keep", action="store_true", help="keep temp repos for inspection")
    args = ap.parse_args()

    preflight()
    task_dir = Path(args.task).resolve()
    task = json.loads((task_dir / "task.json").read_text())
    prompt = (task_dir / task["prompt_file"]).read_text()
    conditions = load_conditions()
    chosen = [c.strip() for c in args.conditions.split(",") if c.strip()]

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    run_id = uuid.uuid4().hex[:8]
    n = 0
    with out_path.open("a") as fh:
        for cond_id in chosen:
            cond = conditions[cond_id]
            for trial in range(args.trials):
                repo = setup_repo(task_dir, cond_id, cond)
                transcript_file = repo.parent / f"{repo.name}_final.txt"
                final = run_agent(repo, prompt, args.model)
                transcript_file.write_text(final)
                result = grade(task_dir, repo, transcript_file)
                row = {
                    "run_id": run_id,
                    "timestamp": dt.datetime.utcnow().isoformat() + "Z",
                    "task": task["id"],
                    "condition": cond_id,
                    "condition_label": cond.get("label", cond_id),
                    "condition_ref": cond.get("ref"),
                    "model": args.model or "default",
                    "trial": trial,
                    "scores": result.get("scores", {}),
                    "detail": result.get("detail", {}),
                }
                fh.write(json.dumps(row) + "\n")
                fh.flush()
                n += 1
                print(f"[{n}] {cond_id} trial {trial}: {row['scores']}")
                if not args.keep:
                    shutil.rmtree(repo, ignore_errors=True)
                    transcript_file.unlink(missing_ok=True)
    print(f"\nWrote {n} rows to {out_path}")
    print(f"Now score it:\n  python3 evals/score.py {out_path} --baseline c0_none")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
