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
| **writable roots** (`[PRIMARY_SOURCE_DIR]`, `[TEST_DIR]`, docs to keep current) | `allow` (Edit and Write) | edits and new files inside these paths run without a prompt |
| **forbidden paths** (secrets, credentials, build output) | `deny` | hard-blocked - takes precedence over everything |
| **requires review** (schema/migrations, `git push`, destructive commands, `workbench/tools/`) | `ask` | pauses for owner confirmation before running |
| **Workbench authorship lanes** (`workbench/specs/`, `workbench/docs/`, `workbench/wiki/`, `workbench/feedback/`, `workbench/sessions/`) | `allow` (Edit and Write) | agents can create and revise specs, ADRs, wiki pages, feedback rows, and checkpoints without a prompt |

Edit and Write are separate grants. `Edit(...)` revises a file that already
exists; `Write(...)` creates one. Creating a record - a new `SPEC.md`, ADR,
wiki page, feedback row, or promoted checkpoint - needs `Write`, so every
directory rule in `allow` carries both. Single-file root controls
(`AGENTS.md`, `LEXICON.md`, ...) are revised, never created, so `Edit` alone
is the right grant there.

The manifest-declared lanes (`workbench/manifest.json` -> `lanes`) are the
prose scope's mechanical counterpart. `workbench/tools/` is the one lane that
stays in `ask`: the managed runtime tools change only through the explicit
Workbench update, and the file says so rather than staying silent. The
`Bash(node workbench/tools/<tool>.mjs:*)` rules let agents run those tools
without touching them.

`doctor` reports `permission-scope-drift` when this file exists and withholds
a declared authorship lane (no covering `Edit` and `Write` allow rule, or a
`deny` or `ask` rule covering it, since both override `allow` and an asked
lane prompts on every write) or grants `workbench/tools/` in `allow`; the Genesis
readiness check fails closed on the same finding. The check recognises
`./<lane>/**` and a covering parent glob such as `./workbench/**`; any other
shape is treated as not granting, so widen the rule or record the deliberate
denial in `AGENTS.md`.

Notes:

- `deny` wins over `allow`, so the secret/credential rules hold even if a broad
  `allow` glob would otherwise match.
- If a scope covers several directories, expand the single placeholder rule into
  one rule per directory (e.g. `Edit(./src/**)`, `Edit(./lib/**)`), keeping the
  paired `Write` rule beside each.
- Delete any placeholder rule that does not apply to this project rather than
  leaving it unfilled.
- This file is optional. Delete it if the project does not use Claude Code; the
  prose scope in `AGENTS.md` remains the source of truth for every agent.
