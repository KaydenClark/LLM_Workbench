#!/usr/bin/env node
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'workbench-context-tools-'));

fs.mkdirSync(path.join(temp, 'src'), { recursive: true });
fs.mkdirSync(path.join(temp, 'node_modules/pkg'), { recursive: true });
fs.writeFileSync(path.join(temp, 'README.md'), '# Demo\n');
fs.writeFileSync(path.join(temp, 'src/app.js'), 'console.log("hello");\n');
fs.writeFileSync(path.join(temp, 'src/app.test.js'), 'assert.equal(1, 1);\n');
fs.writeFileSync(path.join(temp, 'secret.env'), 'TOKEN=do-not-include\n');
fs.writeFileSync(path.join(temp, 'node_modules/pkg/index.js'), 'ignored\n');
fs.writeFileSync(path.join(temp, '.gitignore'), 'secret.env\n');

const packer = path.join(repoRoot, 'tools/context-pack.mjs');
const markdown = execFileSync('node', [
  packer,
  temp,
  '--markdown',
  '--extension', 'md',
  '--extension', 'js',
  '--ignore', '*.test.js',
  '--line-numbers'
], { encoding: 'utf8' });

assert.match(markdown, /README\.md/);
assert.match(markdown, /src\/app\.js/);
assert.match(markdown, /1\s+console\.log\("hello"\);/);
assert.doesNotMatch(markdown, /secret\.env/);
assert.doesNotMatch(markdown, /node_modules/);
assert.doesNotMatch(markdown, /app\.test\.js/);

const xml = execFileSync('node', [
  packer,
  path.join(temp, 'README.md'),
  '--cxml'
], { encoding: 'utf8' });

assert.match(xml, /<documents>/);
assert.match(xml, /<source>README\.md<\/source>/);
assert.match(xml, /<document_content>/);

const researchRoot = path.join(temp, 'research');
const scaffold = path.join(repoRoot, 'tools/new-research-project.mjs');
execFileSync('node', [
  scaffold,
  '--root', researchRoot,
  '--slug', 'agent-context-packing',
  '--title', 'Agent Context Packing',
  '--question', 'How should agents package project context?'
], { encoding: 'utf8' });

const projectDir = path.join(researchRoot, 'agent-context-packing');
assert.equal(fs.existsSync(path.join(projectDir, 'notes.md')), true);
assert.equal(fs.existsSync(path.join(projectDir, 'README.md')), true);
assert.match(fs.readFileSync(path.join(projectDir, 'README.md'), 'utf8'), /How should agents package project context\?/);

console.log('ok - context tools self-test passed');
