#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ensureIntegrationBranch, defaultBranchName, gitDeclaration } from '../workbench/tools/workbench-layout.mjs';

const project = fs.mkdtempSync(path.join(os.tmpdir(), 'integration-setup-'));
function git(...args) {
  const result = spawnSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@invalid.example', ...args], { cwd: project, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  return result.stdout.trim();
}
try {
  assert.equal(ensureIntegrationBranch(project, { defaultBranch: 'main', integrationBranch: 'integration' }).error.code, 'integration-branch-missing');
  git('init', '-q', '-b', 'main');
  git('commit', '-q', '--allow-empty', '-m', 'Default branch baseline');
  const base = git('rev-parse', 'main');
  git('switch', '-q', '-c', 'codex/adoption');
  git('commit', '-q', '--allow-empty', '-m', 'Migration work');
  const head = git('rev-parse', 'HEAD');
  assert.equal(gitDeclaration(project, { '--default-branch': 'main', '--integration-branch': 'MAIN' }).error.code, 'integration-branch-not-distinct');
  assert.equal(defaultBranchName(project), 'main', 'a task branch is not the default branch');
  const declaration = { defaultBranch: 'main', integrationBranch: 'Integration' };
  const created = ensureIntegrationBranch(project, declaration);
  assert.equal(created.status, 'created');
  assert.equal(git('rev-parse', 'Integration'), base);
  assert.equal(git('rev-parse', 'HEAD'), head);
  assert.equal(git('branch', '--show-current'), 'codex/adoption');
  assert.equal(ensureIntegrationBranch(project, declaration).status, 'existing');
  assert.equal(git('rev-parse', 'Integration'), base, 'existing integration is preserved');
  assert.equal(ensureIntegrationBranch(project, { defaultBranch: 'main', integrationBranch: 'main' }).error.code, 'integration-branch-not-distinct');
  assert.equal(ensureIntegrationBranch(project, { defaultBranch: 'absent', integrationBranch: 'new-staging' }).error.code, 'default-branch-missing');
  git('remote', 'add', 'origin', project);
  git('update-ref', 'refs/remotes/origin/staging', base);
  assert.equal(ensureIntegrationBranch(project, { defaultBranch: 'main', integrationBranch: 'staging' }).status, 'existing', 'a remote branch is preserved');
  console.log('ok - integration setup creates from default, preserves HEAD and existing refs, and refuses unresolved or identical branches');
} finally { fs.rmSync(project, { recursive: true, force: true }); }

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const scenario of ['not-in-git', 'missing-default']) {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'integration-adoption-refusal-'));
  try {
    for (const control of ['AGENTS.md', 'BLUEPRINT.md', 'LEXICON.md', 'RUNBOOK.md', 'TASKBOARD.md', 'CLAUDE.md', 'README.md']) {
      fs.writeFileSync(path.join(target, control), `# ${control}\n\nProject-specific setup truth.\n`);
    }
    const args = [path.join(root, 'tools/workbench-adoption.mjs'), 'migrate', '--project', target, '--home', target, '--version', JSON.parse(fs.readFileSync(path.join(root, 'workbench/manifest.json'))).workbenchVersion];
    if (scenario === 'missing-default') {
      for (const command of [['init', '-q', '-b', 'main'], ['commit', '-q', '--allow-empty', '-m', 'Baseline']]) {
        const result = spawnSync('git', ['-c', 'user.name=Fixture', '-c', 'user.email=fixture@invalid.example', ...command], { cwd: target, encoding: 'utf8' });
        assert.equal(result.status, 0, result.stderr);
      }
      args.push('--default-branch', 'absent');
    }
    const result = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' });
    const report = JSON.parse(result.stdout);
    assert.notEqual(result.status, 0, `${scenario}: adoption must refuse failed branch setup`);
    assert.equal(report.error.code, scenario === 'not-in-git' ? 'integration-branch-missing' : 'default-branch-missing');
    assert.equal(fs.existsSync(path.join(target, 'workbench')), false, `${scenario}: branch refusal precedes layout migration`);
  } finally { fs.rmSync(target, { recursive: true, force: true }); }
}
console.log('ok - adoption CLI refuses both branch setup errors before layout migration');
