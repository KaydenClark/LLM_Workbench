#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { doctor, nextWork } from './spec-workbench.mjs';
import { validateManifest } from './workbench-layout.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

assert.equal(fs.existsSync(path.join(root, 'workbench', 'manifest.json')), true,
  'the Workbench repository must dogfood its own v3 manifest');
assert.equal(fs.existsSync(path.join(root, 'specs')), false,
  'the retired root specs lane must not remain active after dogfood migration');
assert.equal(fs.existsSync(path.join(root, 'workbench', 'specs', 'S-021-portable-workbench-v3', 'SPEC.md')), true,
  'S-021 must be recoverable at its manifest-declared stable path');
assert.equal(validateManifest(root).status, 'valid', 'the dogfood manifest must validate');
assert.deepEqual(doctor(root), [], 'doctor must resolve only the manifest-declared spec lane');
assert.equal(nextWork(root).specId, 'S-021', 'cold selection must resolve S-021 from the manifest without chat history');

console.log('ok - LLM Workbench dogfoods its manifest-declared v3 support root');
