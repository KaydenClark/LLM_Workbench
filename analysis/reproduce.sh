#!/usr/bin/env bash
# Reproduce every measurement in analysis/PAPER.md from a fresh clone.
# Read-only: creates worktrees and temp files, never modifies candidate branches.
# Requires: git, node >= 18, python3. No API budget needed.
set -euo pipefail

REPO_URL="https://github.com/KaydenClark/LLM_Workbench.git"
WORK="$(mktemp -d)"
BRANCHES=(main claude/harness-template-upgrades-v2 claude/harness-eval-framework codex/workbench-evaluation-harness)

echo "== clone =="
git clone "$REPO_URL" "$WORK/repo"
cd "$WORK/repo"

echo; echo "== branch topology =="
for b in "${BRANCHES[@]}"; do
  echo "$b: merge-base=$(git merge-base origin/main origin/$b) ahead=$(git rev-list --count origin/main..origin/$b)"
done

echo; echo "== worktrees =="
for b in "${BRANCHES[@]}"; do
  d="$WORK/wt/$(echo $b | tr '/' '_')"
  git worktree add -f "$d" "origin/$b" >/dev/null 2>&1
  echo "$d"
done

CODEX_WT="$WORK/wt/codex_workbench-evaluation-harness"
EV="$CODEX_WT/tools/evaluate-workbench.mjs"

echo; echo "== codex evaluator self-test =="
( cd "$CODEX_WT" && node tools/test-evaluate-workbench.mjs )

echo; echo "== static rubric score per branch =="
for b in "${BRANCHES[@]}"; do
  d="$WORK/wt/$(echo $b | tr '/' '_')"
  node "$EV" --path "$d" --json 2>/dev/null \
    | python3 -c "import sys,json;e=json.load(sys.stdin)[0]['evaluation'];print(f'{\"$b\":50s} {e[\"score\"]}/{e[\"maxScore\"]}')"
done

echo; echo "== controls =="
node "$EV" --path "$WORK/wt/main" --include-controls --json 2>/dev/null \
  | python3 -c "import sys,json;[print(f'{c[\"name\"]:30s} {c[\"evaluation\"][\"score\"]}/{c[\"evaluation\"][\"maxScore\"]}') for c in json.load(sys.stdin) if c['name'].startswith('control')]"

echo; echo "== eval-framework behavioral harness (synthetic self-test, no API budget) =="
EF_WT="$WORK/wt/claude_harness-eval-framework"
( cd "$EF_WT" \
  && python3 evals/lib/stats.py \
  && python3 evals/results/_make_selftest.py \
  && python3 evals/score.py evals/results/_pipeline_selftest.jsonl --baseline c0_none | head -20 )

echo; echo "== ledger has zero real runs =="
( cd "$EF_WT" && grep -c 'none yet' evals/results/LEDGER.md || true )

echo; echo "Done. Workspace: $WORK (delete when finished: rm -rf \"$WORK\")"
