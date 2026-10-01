#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { test } from 'node:test';
const root = path.resolve(import.meta.dirname, '..');
const rootNames = ['AGENTS', 'BLUEPRINT', 'LEXICON', 'RUNBOOK', 'TASKBOARD', 'CLAUDE', 'README'].map(s => `${s}.md`);
export function scanRootSurface(text) {
  const hits = [];
  for (const match of text.matchAll(/\[[^\[\]]{0,2000}\]/g)) {
    const names = rootNames.filter(name => new RegExp(`['"\x60]${name.replace('.', '\\.')}['"\x60]`).test(match[0]));
    if (names.length >= 5 && !match[0].includes('OWNERSHIP.json')) hits.push({ offset: match.index, kind: 'array', text: match[0] });
  }
  for (const match of text.matchAll(/\b(?:seven|7)\s+(?:(?:ordinary,?\s+|filled\s+|stamped\s+|root\s+)){0,3}(?:controls|root files)\b/gi)) hits.push({ offset: match.index, kind: 'prose', text: match[0] });
  const writes = [...text.matchAll(/\bwrite\((\w+),\s*['"]([^'"]+)['"]/g)];
  for (const target of new Set(writes.map(match => match[1]))) {
    const targetWrites = writes.filter(match => match[1] === target);
    const setupNames = new Set(targetWrites.map(match => match[2]));
    if (rootNames.filter(name => setupNames.has(name)).length >= 5 && !setupNames.has('OWNERSHIP.json')) {
      hits.push({ offset: targetWrites[0].index, kind: 'literal-setup', text: `${target}: ${[...setupNames].filter(name => rootNames.includes(name)).sort().join(', ')}` });
    }
  }
  return hits;
}
const hash = text => crypto.createHash('sha256').update(text).digest('hex');
test('sweep discovers new multiline root arrays and prose, without treating lane counts as roots', () => {
  assert.equal(scanRootSurface(`[\n${rootNames.map(n => JSON.stringify(n)).join(',\n')}\n]`).length, 1);
  assert.equal(scanRootSurface('seven filled root controls').length, 1);
  assert.equal(scanRootSurface('seven lowercase lanes').length, 0);
  const setup = rootNames.map(name => `write(room, '${name}', 'fixture');`).join('\n');
  assert.equal(scanRootSurface(setup).length, 1);
  assert.equal(scanRootSurface(setup + `write(otherRoom, 'OWNERSHIP.json', '{}');`).length, 1);
});
test('repository-wide root surface inventory has no unaccounted old enumeration', () => {
  const inventoryPath = path.join(root, 'workbench/specs/S-00G-ownership-map-root-control/root-surface-inventory.json');
  const dispositions = fs.existsSync(inventoryPath) ? JSON.parse(fs.readFileSync(inventoryPath)).dispositions : [];
  const files = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
  const unresolved = [];
  for (const file of files) {
    if (!/\.(?:mjs|js|py|md|json)$/.test(file) || !fs.statSync(path.join(root, file)).isFile()) continue;
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    for (const hit of scanRootSurface(text)) {
      const entry = dispositions.find(item => item.file === file && item.sha256 === hash(hit.text));
      if (!entry || !(['historical', 'bounded-subset'].includes(entry.disposition) || (process.argv.includes('--runtime-only') && entry.disposition === 'TK-003-template')))  unresolved.push(`${file}:${text.slice(0, hit.offset).split('\n').length} ${hit.kind} ${hit.text.slice(0, 100)}`);
    }
  }
  assert.deepEqual(unresolved, [], `Unaccounted root consumers:\n${unresolved.join('\n')}`);
});
