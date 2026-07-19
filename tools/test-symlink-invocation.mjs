#!/usr/bin/env node
// Regression test: every CLI tool must still run its main entry when invoked
// through a symlinked directory path. Node resolves import.meta.url through
// the real path while process.argv[1] keeps the symlinked path, so a naive
// `import.meta.url === pathToFileURL(process.argv[1])` guard silently no-ops
// (exit 0, no output) — observed live when the GPT_OS checkout folder was
// renamed with a compatibility symlink left behind (S-008 TK-006).
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.dirname(toolsDir);
const linkHolder = fs.mkdtempSync(path.join(os.tmpdir(), 'symlink-guard-'));
const linkedRepo = path.join(linkHolder, 'linked-repo');
fs.symlinkSync(repoRoot, linkedRepo);

// Each tool run with no args produces a known loud output (usage line or a
// report header) when its main actually runs; the broken guard produces
// nothing at all.
const cases = [
  { tool: 'spec-workbench.mjs', expect: /Usage: spec-workbench\.mjs/ },
  { tool: 'feedback-automation.mjs', expect: /usage: feedback-automation\.mjs/ },
  { tool: 'context-pack.mjs', expect: /AGENTS\.md|usage/i },
  { tool: 'audit-guardrails.mjs', expect: /Guardrail Audit/ },
  { tool: 'run-outcome-trials.mjs', expect: /--task is required/ },
  { tool: 'score-outcome-trials.mjs', expect: /result file is required/ },
  { tool: 'new-research-project.mjs', expect: /--slug or a positional slug/ },
];

try {
  for (const { tool, expect } of cases) {
    const linkedTool = path.join(linkedRepo, 'tools', tool);
    let stdout = '';
    let stderr = '';
    try {
      stdout = execFileSync(process.execPath, [linkedTool], {
        encoding: 'utf8',
        cwd: linkedRepo,
      });
    } catch (err) {
      stdout = err.stdout?.toString() ?? '';
      stderr = err.stderr?.toString() ?? '';
    }
    const combined = stdout + stderr;
    assert.ok(
      combined.trim().length > 0 && expect.test(combined),
      `${tool}: main did not run via symlinked path (silent no-op); output=${JSON.stringify(combined.slice(0, 200))}`
    );
  }
  console.log('ok - CLI tools run their main entry through symlinked paths');
} finally {
  fs.rmSync(linkHolder, { recursive: true, force: true });
}
