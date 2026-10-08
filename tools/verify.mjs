#!/usr/bin/env node
// Execute the canonical RUNBOOK list without a second maintained suite list.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const runbook = fs.readFileSync(path.join(root, 'RUNBOOK.md'), 'utf8');
const block = runbook.match(/Full suite for controls, templates, tools, evals, or specs:\s*```bash\n([\s\S]*?)\n```/);
const commands = block?.[1].split('\n').map(line => line.trim()).filter(Boolean);
if (!commands?.length || commands.some(line => !/^(?:node|python3) (?:tools|evals|workbench\/tools)\/[A-Za-z0-9_./-]+(?: [A-Za-z0-9_./=-]+)*$/.test(line))) {
  console.error('RUNBOOK.md must contain the canonical full suite as direct Node/Python commands.');
  process.exit(1);
}
if (process.argv.length > 2 && !(process.argv.length === 3 && process.argv[2] === '--list')) {
  console.error('Usage: node tools/verify.mjs [--list]');
  process.exit(1);
}
if (process.argv[2] === '--list') console.log(commands.join('\n'));
else {
  const started = Date.now();
  for (let index = 0; index < commands.length; index += 1) {
    const [executable, ...args] = commands[index].split(/\s+/);
    console.log(`\n[${index + 1}/${commands.length}] ${commands[index]}`);
    const result = spawnSync(executable === 'node' ? process.execPath : executable, args, { cwd: root, stdio: 'inherit' });
    if (result.error || result.status !== 0) {
      console.error(`Full verification stopped: ${commands[index]} (${result.error?.message || `exit ${result.status}`}).`);
      process.exit(result.status || 1);
    }
  }
  console.log(`\nFull verification passed: ${commands.length} commands in ${((Date.now() - started) / 1000).toFixed(1)}s.`);
}
