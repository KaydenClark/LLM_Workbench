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

assert.match(adoption, /source remote[^\n]*ref[^\n]*resolved commit/i,
  'ADOPTION must require source remote, ref, and resolved commit provenance');
assert.match(adoption, /owning spec/i,
  'ADOPTION must persist adoption provenance in the owning spec');
assert.match(adoption, /fresh-clone verification commands?/i,
  'ADOPTION must require exact fresh-clone verification commands');
assert.match(adoption, /project(?:'s)?[\s\S]{0,30}RUNBOOK\.md/i,
  'ADOPTION must persist executable verification in the project Runbook');
assert.match(adoption, /vendored-helper checksum/i,
  'ADOPTION must require a checksum when a helper is vendored');
assert.match(readme, /fresh-clone verification/i,
  'README must expose the independent fresh-clone verification contract');
assert.match(readme, /remote[^\n]*ref[^\n]*resolved commit/i,
  'README must expose the durable source provenance fields');

console.log('ok - adoption fallback and provenance contracts are documented');
