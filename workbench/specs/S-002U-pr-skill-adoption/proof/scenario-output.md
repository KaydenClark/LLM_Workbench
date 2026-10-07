## Summary

Installs Matt Pocock's `pr` skill into the Skills lane as a pinned upstream import (`mattpocock/skills` `skills/engineering/pr` @ `d81f3a18`). This change adds files only.

```diff
 tools/
 └── test-skill-catalog.mjs     # + pins the pr/SKILL.md source hash
 workbench/skills/              # Skills lane
+└── pr/
+    ├── SKILL.md               # upstream, byte-identical
+    ├── CREDITS.md             # upstream, Dex Horthy / Humanlayer show-me lineage
+    ├── NOTICE.md              # local: pin, no adapter, GLOSSARY.md ref kept, PR-body-only, MIT text
+    └── agents/openai.yaml     # upstream Codex interface metadata
```

The new catalog assertion:

```text
for each pinned import (pr/SKILL.md @ d81f3a18)
  fail if the file is missing
  normalize CRLF to LF, drop trailing newlines
  fail if sha256 != bb2f9427…3e998b
```

This change does not touch `workbench/manifest.json` or `coreSkills`. A follow-up Task on this Spec will declare `pr` in the Core skill bundle.

## Evidence

- **Before:** pinned-source assertion with `workbench/skills/pr/` absent
  `AssertionError: workbench/skills/pr/SKILL.md must carry the pinned upstream source`, exit 1
  **After:** the same assertion on the tree as committed
  `pinned-source assertion: ok (pr/SKILL.md sha256 matches pin)`, exit 0

- **Expected red until the follow-up Task:** the full `node tools/test-skill-catalog.mjs` still fails on the commit. The Skills lane now holds `pr`, but the Core skill bundle does not declare it yet:
  `live discovery source must contain exactly the locked 28 skills and the 4 declared maintainer skills` (actual has an extra `'pr'`)
  Full suite on clean candidate `56eb7a9b`: `pass=46 fail=7`. The failing checks are skill-catalog, core-composition, core-skill-installer, workbench-layout, workbench-adoption, workbench-upgrade and diagnostics.

## Merge Danger

**Door:** two-way

The commit adds five files and one test block. It deletes or rewrites nothing, so a revert removes it cleanly.

**Blast Radius:** branch-local

The commit targets the Spec's assembly branch, not `main`, and cuts no release, so no Room receives `pr`. The suite on the assembly branch stays red (7 checks) until the follow-up Task declares `pr` in the Core skill bundle. Until then, other Tasks on this branch cannot get a green suite.
