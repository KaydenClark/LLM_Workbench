#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { probeConfiguredHost } from './configured-host.mjs';
const root = path.resolve(import.meta.dirname, '..');
function fixture() {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'wb-host-test-'));
  fs.mkdirSync(path.join(home, 'relative'));
  fs.mkdirSync(path.join(home, 'skills/demo'), { recursive: true });
  fs.writeFileSync(path.join(home, 'skills/demo/SKILL.md'), '# Fixture skill\n');
  return { root, home, cwd: home, lanes: ['relative', '~/relative', path.join(home, 'relative')], skill: path.join(home, 'skills/demo/SKILL.md') };
}
test('actual probes preserve lanes and never promote file readability to native discovery', () => {
  const options = fixture();
  try {
    const report = probeConfiguredHost(options);
    assert.equal(report.checks.length, 5);
    assert.deepEqual(report.checks.map(c => c.status), ['pass', 'unverified', 'pass', 'pass', 'pass']);
    assert.equal(report.checks[1].readable, true);
    assert.equal(report.enforcement, 'unverified');
    assert.equal(report.reliability, 'unverified');
    assert.deepEqual(fs.readdirSync(path.join(options.home, 'relative')), []);
    assert.deepEqual(report.checks[0].results.map(r => r.form), ['relative', 'home', 'absolute']);
  } finally { fs.rmSync(options.home, { recursive: true, force: true }); }
});
test('missing writable lane affects only its dependent check and is never created', () => {
  const options = fixture();
  try {
    options.lanes = ['missing'];
    const report = probeConfiguredHost(options);
    assert.equal(report.checks[0].status, 'fail');
    assert.equal(report.checks[2].status, 'pass');
    assert.equal(fs.existsSync(path.join(options.home, 'missing')), false);
  } finally { fs.rmSync(options.home, { recursive: true, force: true }); }
});
test('invalid declarations fail before any probe writes', () => {
  const options = fixture();
  try {
    for (const lanes of [[], [''], ['~someone/private'], [42]]) assert.throws(() => probeConfiguredHost({ ...options, lanes }), /lane/i);
    assert.deepEqual(fs.readdirSync(path.join(options.home, 'relative')), []);
  } finally { fs.rmSync(options.home, { recursive: true, force: true }); }
});
test('unavailable Node and missing skill stay operation scoped', () => {
  const options = fixture();
  try {
    const report = probeConfiguredHost({ ...options, node: path.join(options.home, 'absent-node'), skill: path.join(options.home, 'absent-skill') });
    assert.equal(report.checks[1].status, 'unverified');
    assert.equal(report.checks[1].readable, false);
    assert.equal(report.checks[2].status, 'unverified');
    assert.equal(report.checks[0].status, 'pass');
  } finally { fs.rmSync(options.home, { recursive: true, force: true }); }
});
test('relative cwd supports directory adapters', () => {
  const options = fixture();
  try {
    options.cwd = path.relative(process.cwd(), options.home);
    assert.equal(probeConfiguredHost(options).checks[3].status, 'pass');
  } finally { fs.rmSync(options.home, { recursive: true, force: true }); }
});
test('linked records are refused before read and malformed ordinary records fail', () => {
  const options = fixture();
  try {
    const project = path.join(options.home, 'project');
    const adr = path.join(project, 'workbench/docs/adr');
    fs.mkdirSync(adr, { recursive: true });
    fs.writeFileSync(path.join(project, 'workbench/manifest.json'), JSON.stringify({ collections: { adr: 'workbench/docs/adr' } }));
    const outside = path.join(options.home, 'outside.md');
    fs.writeFileSync(outside, '---\nstatus: accepted\n---\n# Outside\n');
    const record = path.join(adr, '001-test.md');
    fs.symlinkSync(outside, record);
    assert.equal(probeConfiguredHost({ ...options, root: project }).checks[4].status, 'fail');
    fs.unlinkSync(record);
    fs.writeFileSync(record, 'Malformed record');
    assert.equal(probeConfiguredHost({ ...options, root: project }).checks[4].status, 'fail');
    fs.unlinkSync(record);
    assert.equal(probeConfiguredHost({ ...options, root: project }).checks[4].status, 'unverified');
  } finally { fs.rmSync(options.home, { recursive: true, force: true }); }
});
test('linked manifest is rejected before the managed child can consume it', () => {
  const options = fixture();
  try {
    const project = path.join(options.home, 'project');
    fs.mkdirSync(path.join(project, 'workbench/tools'), { recursive: true });
    const external = path.join(options.home, 'manifest.json');
    fs.copyFileSync(path.join(root, 'workbench/manifest.json'), external);
    fs.symlinkSync(external, path.join(project, 'workbench/manifest.json'));
    const marker = path.join(options.home, 'child-ran');
    fs.writeFileSync(path.join(project, 'workbench/tools/spec-workbench.mjs'), `import fs from 'node:fs'; fs.writeFileSync(${JSON.stringify(marker)}, 'ran');`);
    const report = probeConfiguredHost({ ...options, root: project });
    assert.equal(fs.existsSync(marker), false, 'unsafe source must not reach child execution');
    assert.equal(report.checks[2].status, 'fail');
    assert.equal(report.checks[0].status, 'pass');
  } finally { fs.rmSync(options.home, { recursive: true, force: true }); }
});
