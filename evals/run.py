#!/usr/bin/env python3
"""Run the agent on a task under one or more conditions and grade each trial.

For every (task x condition x trial) this:
  1. copies the task fixture into a fresh temp repo;
  2. injects the condition's instruction files (none / generic / a git ref of
     our harness) and commits a pristine baseline;
  3. runs the selected headless provider (`claude` or `codex`) inside that repo;
  4. captures the final message, runs the task's grader, and appends a JSON
     result row to the output file.

Requires the selected CLI to be authenticated. It deliberately does nothing
clever if that is missing: it reports the provider error instead of fabricating
results.

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


def load_conditions(ref_overrides: dict[str, str] | None = None) -> dict:
    data = json.loads((EVALS / "conditions" / "conditions.json").read_text())
    conditions = data["conditions"]
    for condition_id, ref in (ref_overrides or {}).items():
        if condition_id not in conditions:
            raise ValueError(f"unknown condition for --condition-ref: {condition_id}")
        if conditions[condition_id].get("source") != "git":
            raise ValueError(f"--condition-ref requires a git condition: {condition_id}")
        conditions[condition_id] = {**conditions[condition_id], "ref": ref}
    return conditions


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


def run_agent(repo: Path, prompt: str, provider: str, model: str,
              reasoning_effort: str, output_file: Path) -> str:
    """Invoke one supported headless provider and return its final message."""
    if provider == "claude":
        cmd = provider_command(
            "claude",
            ["-p", prompt, "--output-format", "json",
             "--dangerously-skip-permissions"]
        )
        if model:
            cmd += ["--model", model]
        proc = subprocess.run(cmd, cwd=str(repo), capture_output=True, text=True)
        if proc.returncode != 0:
            return f"[agent error rc={proc.returncode}] {proc.stderr[:2000]}"
        try:
            return json.loads(proc.stdout).get("result", proc.stdout)
        except json.JSONDecodeError:
            return proc.stdout

    cmd = provider_command("codex", [
        "exec", "--ephemeral", "--ignore-user-config", "--sandbox",
        "workspace-write", "--output-last-message", str(output_file)
    ])
    if model:
        cmd += ["--model", model]
    if reasoning_effort:
        cmd += ["-c", f'model_reasoning_effort="{reasoning_effort}"']
    cmd.append("-")
    proc = subprocess.run(
        cmd, cwd=str(repo), input=prompt, capture_output=True, text=True
    )
    if proc.returncode != 0:
        return f"[agent error rc={proc.returncode}] {proc.stderr[:2000]}"
    if output_file.exists():
        return output_file.read_text(errors="ignore")
    return proc.stdout


def provider_command(provider: str, args: list[str]) -> list[str]:
    """Resolve provider shims safely, including Windows batch launchers."""
    executable = shutil.which(provider) or provider
    if os.name == "nt" and Path(executable).suffix.lower() in {".bat", ".cmd"}:
        return [os.environ.get("COMSPEC", "cmd.exe"), "/d", "/s", "/c",
                executable, *args]
    return [executable, *args]


def grade(task_dir: Path, repo: Path, transcript_file: Path) -> dict:
    grader = task_dir / "grade.py"
    out = sh([sys.executable, str(grader), "--repo", str(repo),
              "--transcript", str(transcript_file)], check=False)
    try:
        return json.loads(out.stdout)
    except json.JSONDecodeError:
        return {"scores": {}, "detail": {"grader_error": out.stdout + out.stderr}}


def preflight(provider: str) -> None:
    if shutil.which(provider) is None:
        sys.exit(f"ERROR: `{provider}` CLI not found on PATH.")
    if provider == "claude" and not os.environ.get("ANTHROPIC_API_KEY"):
        # A logged-in CLI session also works; warn rather than hard-fail.
        print("WARNING: ANTHROPIC_API_KEY is not set. The run will fail unless "
              "the claude CLI is otherwise authenticated.", file=sys.stderr)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--task", required=True, help="path to a task dir")
    ap.add_argument("--conditions", default="c0_none,c1_generic,c2_ours_main,c3_ours_v2")
    ap.add_argument("--trials", type=int, default=10)
    ap.add_argument("--provider", choices=["claude", "codex"], default="claude")
    ap.add_argument("--model", default="")
    ap.add_argument("--reasoning-effort", default="")
    ap.add_argument("--condition-ref", action="append", default=[], metavar="ID=REF")
    ap.add_argument("--feedback-fingerprint", default="")
    ap.add_argument("--base-sha", default="")
    ap.add_argument("--candidate-sha", default="")
    ap.add_argument("--out", required=True)
    ap.add_argument("--keep", action="store_true", help="keep temp repos for inspection")
    args = ap.parse_args()

    preflight(args.provider)
    task_dir = Path(args.task).resolve()
    task = json.loads((task_dir / "task.json").read_text())
    prompt = (task_dir / task["prompt_file"]).read_text()
    ref_overrides = {}
    for item in args.condition_ref:
        if "=" not in item:
            ap.error("--condition-ref must use ID=REF")
        condition_id, ref = item.split("=", 1)
        ref_overrides[condition_id] = ref
    conditions = load_conditions(ref_overrides)
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
                final = run_agent(
                    repo, prompt, args.provider, args.model,
                    args.reasoning_effort, transcript_file
                )
                transcript_file.write_text(final)
                result = grade(task_dir, repo, transcript_file)
                condition_ref = cond.get("ref")
                condition_sha = ""
                if condition_ref:
                    resolved = sh(
                        ["git", "-C", str(REPO_ROOT), "rev-parse", condition_ref],
                        check=False
                    )
                    if resolved.returncode == 0:
                        condition_sha = resolved.stdout.strip()
                row = {
                    "run_id": run_id,
                    "timestamp": dt.datetime.utcnow().isoformat() + "Z",
                    "task": task["id"],
                    "condition": cond_id,
                    "condition_label": cond.get("label", cond_id),
                    "condition_ref": cond.get("ref"),
                    "condition_sha": condition_sha,
                    "provider": args.provider,
                    "model": args.model or "default",
                    "reasoning_effort": args.reasoning_effort,
                    "trial": trial,
                    "trial_count": args.trials,
                    "feedback_fingerprint": args.feedback_fingerprint,
                    "base_sha": args.base_sha,
                    "candidate_sha": args.candidate_sha,
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
