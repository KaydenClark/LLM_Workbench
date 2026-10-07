# Environment diff around the fresh-context pr run

Command: `bash snap.sh` (lane worktree), captured immediately before spawning the fresh context and immediately after it replied. The body was written to a scratch file outside the repository and copied here verbatim afterwards.

## Before

```text
### git rev-parse HEAD
3082ae8c9f69c0725349aeab0a490948f700f90b
### git status --porcelain --ignored (count 0)
### this lane's refs
refs/heads/claude/s002u-tk007w 3082ae8c9f69c0725349aeab0a490948f700f90b
### git branch -a (s002u)
+ claude/s002u-pr-skill-assembly
+ claude/s002u-tk007u
+ claude/s002u-tk007v
* claude/s002u-tk007w
  remotes/origin/claude/s002u-pr-skill-assembly
  remotes/origin/claude/s002u-tk007u
### git worktree list (count)
83
### gh pr list --head claude/s002u-tk007w --state all
(exit 0)
### gh pr list --state all --search head:claude/s002u
(exit 0)
```

## After

```text
### git rev-parse HEAD
3082ae8c9f69c0725349aeab0a490948f700f90b
### git status --porcelain --ignored (count 0)
### this lane's refs
refs/heads/claude/s002u-tk007w 3082ae8c9f69c0725349aeab0a490948f700f90b
### git branch -a (s002u)
+ claude/s002u-pr-skill-assembly
+ claude/s002u-tk007u
+ claude/s002u-tk007v
* claude/s002u-tk007w
  remotes/origin/claude/s002u-pr-skill-assembly
  remotes/origin/claude/s002u-tk007u
### git worktree list (count)
83
### gh pr list --head claude/s002u-tk007w --state all
(exit 0)
### gh pr list --state all --search head:claude/s002u
(exit 0)
```

## diff before after

```text
(no differences; diff exit 0)
```

## Snapshot script

```sh
cd <scratch>/tk007w
echo "### git rev-parse HEAD"; git rev-parse HEAD
echo "### git status --porcelain --ignored (count $(git status --porcelain --ignored | wc -l | tr -d ' '))"; git status --porcelain --ignored
echo "### this lane's refs"; git for-each-ref --format='%(refname) %(objectname)' refs/heads/claude/s002u-tk007w refs/remotes/origin/claude/s002u-tk007w
echo "### git branch -a (s002u)"; git branch -a | grep s002u
echo "### git worktree list (count)"; git worktree list | wc -l | tr -d ' '
echo "### gh pr list --head claude/s002u-tk007w --state all"; gh pr list --head claude/s002u-tk007w --state all; echo "(exit $?)"
echo "### gh pr list --state all --search head:claude/s002u"; gh pr list --state all --search "head:claude/s002u"; echo "(exit $?)"
```
