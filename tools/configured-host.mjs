#!/usr/bin/env node
// Explicit, temporary local probes. A filesystem check cannot attest provider
// discovery, sandbox enforcement, another device, or agent reliability.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseFrontmatter } from '../workbench/tools/adr.mjs';
import { isMainModule } from '../workbench/tools/workbench-paths.mjs';

export function probeConfiguredHost(options) {
  const { root, cwd, home, lanes, skill, node = process.execPath } = options;
  for (const [name, value] of Object.entries({ root, cwd, home, skill, node })) {
    if (typeof value !== 'string' || !value || value.includes('\0')) throw new Error(`Invalid ${name} declaration.`);
  }
  if (!Array.isArray(lanes) || !lanes.length || lanes.some(lane => typeof lane !== 'string' || !lane || lane.includes('\0') || (lane.startsWith('~') && !lane.startsWith('~/')))) throw new Error('Invalid writable lane declarations.');
  const checks = [];
  const results = lanes.map(lane => {
    const form = lane.startsWith('~/') ? 'home' : path.isAbsolute(lane) ? 'absolute' : 'relative';
    const target = form === 'home' ? path.resolve(home, lane.slice(2)) : path.resolve(cwd, lane);
    let temporary;
    const result = { form, status: 'pass' };
    try {
      // The caller declares the lane. Never create a missing lane or alter its files.
      if (!fs.statSync(target).isDirectory()) throw new Error('not a directory');
      temporary = fs.mkdtempSync(path.join(target, '.workbench-probe-'));
      const file = path.join(temporary, 'probe.json');
      fs.writeFileSync(file, '{"probe":true}\n', { flag: 'wx', mode: 0o600 });
      if (fs.readFileSync(file, 'utf8') !== '{"probe":true}\n') throw new Error('read-back mismatch');
    } catch (error) { result.status = 'fail'; result.reason = error.code ?? error.message; }
    finally {
      if (temporary) try { fs.rmSync(temporary, { recursive: true }); }
      catch (error) { result.status = 'fail'; result.reason = `cleanup:${error.code}`; result.recovery = temporary; }
    }
    return result;
  });
  checks.push({ capability: 'writable-lanes', status: results.every(r => r.status === 'pass') ? 'pass' : 'fail', results, scope: 'declared lanes under this runner only' });
  let readable = false;
  try { readable = fs.statSync(skill).isFile() && fs.readFileSync(skill).length > 0; } catch {}
  checks.push({ capability: 'native-skill-discovery-and-invocation', status: 'unverified', readable, reason: 'Requires a native provider discovery and invocation trace; readable bytes are insufficient.' });
  const execution = spawnSync(node, [path.resolve(root, 'workbench/tools/spec-workbench.mjs'), 'doctor'], { cwd: root, encoding: 'utf8', timeout: 30000, maxBuffer: 8 * 1024 * 1024 });
  checks.push({ capability: 'node-managed-tools', status: execution.error ? 'unverified' : execution.status === 0 ? 'pass' : 'fail', exit: execution.status, reason: execution.error?.code ?? null, scope: 'managed doctor execution; diagnostics retain their own effects' });
  let temporary;
  const adapter = { capability: 'directory-adapter', status: 'pass', mechanism: process.platform === 'win32' ? 'junction' : 'symlink', scope: 'temporary directory under declared cwd only' };
  try {
    temporary = fs.mkdtempSync(path.join(cwd, '.workbench-adapter-probe-'));
    const canonical = path.join(temporary, 'canonical');
    fs.mkdirSync(canonical);
    fs.writeFileSync(path.join(canonical, 'probe'), 'adapter');
    fs.symlinkSync(canonical, path.join(temporary, 'alias'), process.platform === 'win32' ? 'junction' : 'dir');
    if (fs.readFileSync(path.join(temporary, 'alias/probe'), 'utf8') !== 'adapter') throw new Error('adapter read-back mismatch');
  } catch (error) { adapter.status = 'unverified'; adapter.reason = error.code ?? error.message; }
  finally {
    if (temporary) try { fs.rmSync(temporary, { recursive: true }); }
    catch (error) { adapter.status = 'fail'; adapter.reason = `cleanup:${error.code}`; adapter.recovery = temporary; }
  }
  checks.push(adapter);
  const syntax = { capability: 'checkout-record-syntax', status: 'pass', records: 0, scope: 'actual local ADR checkout; LF/CRLF/CR variants are structural checks only' };
  try {
    const manifest = JSON.parse(fs.readFileSync(path.join(root, 'workbench/manifest.json'), 'utf8'));
    const relative = manifest.collections.adr;
    const lane = path.resolve(root, relative);
    if (!lane.startsWith(path.resolve(root) + path.sep)) throw new Error('invalid ADR lane');
    for (const name of fs.readdirSync(lane).filter(name => /^[0-9A-Za-z]{3,}-.+\.md$/.test(name))) {
      const content = fs.readFileSync(path.join(lane, name), 'utf8');
      const parsed = parseFrontmatter(content);
      if (!parsed.data?.status) throw new Error('invalid checkout record');
      for (const eol of ['\n', '\r\n', '\r']) {
        const variant = parseFrontmatter(content.replace(/\r\n?/g, '\n').replaceAll('\n', eol));
        if (JSON.stringify(variant) !== JSON.stringify(parsed)) throw new Error('line-ending mismatch');
      }
      syntax.records++;
    }
    if (!syntax.records) throw new Error('no checkout records available');
  } catch (error) { syntax.status = 'unverified'; syntax.reason = error.code ?? error.message; }
  checks.push(syntax);
  return { evidence: 'local-runner-capability-probe', host: { platform: process.platform, release: os.release(), architecture: process.arch, node: process.version }, checks, enforcement: 'unverified', reliability: 'unverified' };
}

if (isMainModule(import.meta.url)) {
  try {
    if (process.argv.length !== 4 || process.argv[2] !== '--probe') throw new Error('Usage: configured-host.mjs --probe CONFIG.json (writes temporary probes only in declared lanes and cwd)');
    const report = probeConfiguredHost(JSON.parse(fs.readFileSync(process.argv[3], 'utf8')));
    process.stdout.write(JSON.stringify(report, null, 2) + '\n');
    process.exitCode = report.checks.some(check => check.status === 'fail') ? 1 : 0;
  } catch (error) { process.stderr.write(error.message + '\n'); process.exitCode = 1; }
}
