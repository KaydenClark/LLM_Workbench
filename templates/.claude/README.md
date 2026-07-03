# `.claude/settings.json` - mechanical scope enforcement

`AGENTS.md` describes the edit scope in prose (honor system). This file makes the
boundary mechanical for Claude Code: the harness enforces it instead of trusting
the agent to remember. Other agents still read `AGENTS.md`; this is the belt to
that suspenders.

Fill the `[BRACKETED]` placeholders from the same scope you filled in
`AGENTS.md`. Each of the three permission buckets maps to one declarative scope
idea:

| Scope idea (from `AGENTS.md`) | Permission bucket | Effect |
|---|---|---|
| **writable roots** (`[PRIMARY_SOURCE_DIR]`, `[TEST_DIR]`, docs to keep current) | `allow` | edits inside these paths run without a prompt |
| **forbidden paths** (secrets, credentials, build output) | `deny` | hard-blocked - takes precedence over everything |
| **requires review** (schema/migrations, `git push`, destructive commands) | `ask` | pauses for owner confirmation before running |

Notes:

- `deny` wins over `allow`, so the secret/credential rules hold even if a broad
  `allow` glob would otherwise match.
- If a scope covers several directories, expand the single placeholder rule into
  one rule per directory (e.g. `Edit(./src/**)`, `Edit(./lib/**)`).
- Delete any placeholder rule that does not apply to this project rather than
  leaving it unfilled.
- This file is optional. Delete it if the project does not use Claude Code; the
  prose scope in `AGENTS.md` remains the source of truth for every agent.
