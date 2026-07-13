#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const adoption = fs.readFileSync(path.join(root, 'templates', 'ADOPTION.md'), 'utf8');
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');

assert.match(adoption, /cannot write Git metadata/i,
  'ADOPTION must acknowledge hosts that cannot write Git metadata');
assert.match(adoption, /record (?:the )?blocker/i,
  'ADOPTION must require a recorded constrained-host blocker');
assert.match(adoption, /hand (?:branch|Git) operations? to the owner/i,
  'ADOPTION must hand blocked Git operations to the owner');
assert.match(readme, /cannot write Git metadata/i,
  'README must expose the constrained-host boundary');
assert.match(readme, /hand (?:branch|Git) operations? to the owner/i,
  'README must preserve the owner handoff boundary');

console.log('ok - constrained Git-write adoption fallback is documented');
