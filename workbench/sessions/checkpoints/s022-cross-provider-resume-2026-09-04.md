<!-- checkpoint: promoted 2026-09-04 from workbench/sessions/handoffs/s022-cross-provider-resume-2026-09-04.md -->
# S-022 cross-provider resume proof — 2026-09-04

Promoted evidence for S-022/TK-002. Provider budget was spent once for the
proof run and once for a sandbox-blocked attempt recorded below.

## Identity

- Candidate: `902aa5f8faa77853db89b7ce5d7a32b6a7836f4d` (`claude/v3.1-release`, manifest v3.0.0)
- Planning provider: Claude (this session) using the candidate's own
  `workbench/tools` copies through `tools/cross-provider-resume.mjs plan`
- Planning checkpoint pushed: `f31cc0082b358fa33ad8c1955920e5cd5ddf6f51` (spec S-001, TK-001
  claimed, notepad promoted to `workbench/sessions/checkpoints/`, live notepad
  absent from the commit); the planning clone was then deleted
- Resuming provider: Codex CLI `gpt-5.6-terra`, `CODEX_HOME` pointed at an
  isolated home holding only the candidate's twelve skills (installed with
  `tools/core-skill-installer.mjs install --home <workspace>/provider-home`,
  24 copies across both discovery roots) and no
  global skill; authentication stayed the owner's own store via a symlink
- Resumed commit pushed by Codex: `e480d254e903947188f0c556267fcbb07ea8b64f`
  ("Implement greeting CLI"), read back from the bare remote

## Verify result (fresh clone, `tools/cross-provider-resume.mjs verify`)

```json
{"status": "passed", "planningSha": "f31cc0082b358fa33ad8c1955920e5cd5ddf6f51", "finalSha": "e480d254e903947188f0c556267fcbb07ea8b64f", "transcriptFindings": {"foundry": false, "privatePaths": false}, "failures": []}
```

The verify clone proved: the remote advanced past the planning checkpoint;
TK-001 is `done` with proof; `node --test tests/greet.test.mjs` passes;
`node src/greet.mjs Ada` prints `Hello, Ada!`; doctor is clean; the tools
receipt names the exact candidate release and commit; no Foundry path exists;
the live notepad never travelled; the transcript names nothing outside the
repository and no private home path.

## What the resumer ran (repository state only)

```text
/bin/zsh -lc 'node workbench/tools/spec-workbench.mjs doctor && node workbench/tools/spec-workbench.mjs next --json' in <workspace>/resume-clone
/bin/zsh -lc 'node workbench/tools/spec-workbench.mjs show S-001 && git status --short && git log -1 --oneline' in <workspace>/resume-clone
/bin/zsh -lc 'node --test tests/greet.test.mjs' in <workspace>/resume-clone
/bin/zsh -lc 'node --test tests/greet.test.mjs && node src/greet.mjs Ada && node src/greet.mjs && git diff --check && git diff -- src/greet.mjs tests/greet.test.mjs' in <workspace>/resume-clone
/bin/zsh -lc 'node workbench/tools/spec-workbench.mjs close S-001 --proof "node --test tests/greet.test.mjs passed: 2 tests; node src/greet.mjs Ada printed Hello, Ada!" --docs "README.md already documents CLI usage; no documentation changes needed." --remaining-gap "none" && node workbench/tools/spec-workbench.mjs render && node workbench/tools/spec-workbench.mjs doctor && git status --short && git diff --stat' in <workspace>/resume-clone
/bin/zsh -lc 'git diff -- TASKBOARD.md workbench/specs/S-001-greeting/SPEC.md && git diff --no-index /dev/null src/greet.mjs; test $? -eq 1 && git diff --no-index /dev/null tests/greet.test.mjs; test $? -eq 1 && git add src/greet.mjs tests/greet.test.mjs TASKBOARD.md workbench/specs/S-001-greeting/SPEC.md && git commit -m "Implement greeting CLI" && git push origin main && git rev-parse HEAD && git status --short' in <workspace>/resume-clone
```

The resumer read `AGENTS.md`, ran doctor and `next --json`, loaded the spec
with `show`, wrote the failing test first and observed the missing module,
implemented `src/greet.mjs`, ran the test green, closed the ticket with the
spec tool, rendered, ran doctor, committed, and pushed. It read no skill file
in this run; the isolated installation was present and exact. In an earlier
attempt against a previous planning checkpoint it read `implement` and
`code-review` from the isolated home and also completed the slice.

## Recorded attempt that stayed truthful

A run with the Codex `workspace-write` sandbox stopped at the commit
checkpoint because the sandbox refuses writes under `.git`; the resumer
reported "Blocked at the required commit checkpoint" and "No pushed commit
SHA exists" instead of claiming completion. The fixture now runs the
isolated provider unsandboxed in a disposable workspace.

## Limitation: the fresh-Claude CLI leg

`claude -p --disable-slash-commands ...` on a fresh clone of the resumed
state failed twice with "Failed to authenticate: OAuth session expired and
could not be refreshed". Renewing the CLI session is an owner action; the
leg is rerun with:

```bash
claude -p --disable-slash-commands --allowedTools "Bash(node *)" "Bash(git log *)" "Read" --max-turns 12 \
  "Read AGENTS.md, run node workbench/tools/spec-workbench.mjs doctor and next --json and node --test tests/greet.test.mjs, and report the results without modifying any file."
```

Claude compatibility with the same repository state is otherwise exercised
by this Claude session, which built and drove the candidate exclusively
through the repository's own tools.
