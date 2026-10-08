#!/usr/bin/env node
// macOS local login service for the existing producer-room board.
//
//   print          write the launchd property list to stdout
//   install        owner action: save the property list under
//                  ~/Library/LaunchAgents and bootstrap it; refuses to replace
//                  an existing configuration
//   status         read-only: is the property list there and what checkout,
//                  port and Node it serves (compared with the request), what
//                  launchd reports, and, separately, whether 127.0.0.1:<port>
//                  answers; prints the exact install, restart, uninstall and
//                  inspect commands
//   restart-check  start the board on a disposable room, kill it, start it
//                  again and compare workflow state and answers (no launchd)
//
// The served board binds 127.0.0.1 only; the property list passes no host.
import fs from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { isDeepStrictEqual } from 'node:util';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const DEFAULT_LABEL = 'com.kayden.workbench-dashboard';
export const DEFAULT_PORT = 4646;
const HOST = '127.0.0.1';
const SERVER_SCRIPT = fileURLToPath(new URL('./grill-board.mjs', import.meta.url));
const SERVICE_SCRIPT = fileURLToPath(import.meta.url);

const xml = value => String(value).replace(/[<>&"']/g, char => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[char]));
const shellQuote = value => /^[A-Za-z0-9_\/.:@%+=,-]+$/.test(value) ? value : `'${String(value).replace(/'/g, `'\\''`)}'`;

function checkConfig({ root, node, port, label }) {
  if (!path.isAbsolute(root) || !path.isAbsolute(node)) throw new Error('Absolute room and Node paths are required');
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('A port from 1 to 65535 is required');
  if (!/^com\.[a-zA-Z0-9.-]+$/.test(label)) throw new Error('The service label must look like com.example.name');
}

export function plistPath(label = DEFAULT_LABEL, home = os.homedir()) {
  return path.join(home, 'Library/LaunchAgents', `${label}.plist`);
}

export function servicePlist({ root, node = process.execPath, port = DEFAULT_PORT, label = DEFAULT_LABEL }) {
  checkConfig({ root, node, port, label });
  const args = [node, path.join(root, 'tools/grill-board.mjs'), 'serve', '--path', root, '--port', String(port)];
  const searchPath = [...new Set([path.dirname(node), '/usr/bin', '/bin', '/usr/sbin', '/sbin'])].join(':');
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">',
    '<plist version="1.0"><dict>',
    `<key>Label</key><string>${xml(label)}</string>`,
    `<key>ProgramArguments</key><array>${args.map(arg => `<string>${xml(arg)}</string>`).join('')}</array>`,
    `<key>WorkingDirectory</key><string>${xml(root)}</string>`,
    `<key>EnvironmentVariables</key><dict><key>PATH</key><string>${xml(searchPath)}</string></dict>`,
    '<key>RunAtLoad</key><true/>',
    '<key>KeepAlive</key><true/>',
    '<key>ThrottleInterval</key><integer>10</integer>',
    `<key>StandardOutPath</key><string>${xml(path.join(root, 'workbench/grill-board/service.log'))}</string>`,
    `<key>StandardErrorPath</key><string>${xml(path.join(root, 'workbench/grill-board/service-error.log'))}</string>`,
    '</dict></plist>',
    ''
  ].join('\n');
}

// A label for another checkout's service: the default label plus the
// checkout's folder name, so two checkouts never share one configuration.
export function distinctLabel(root, label = DEFAULT_LABEL) {
  const slug = path.basename(root).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'room';
  return `${label}.${slug}`;
}

// status (optional) is a serviceStatus result: when a configuration already
// exists under the label, the instructions say install refuses to replace
// it, show how to inspect it, and suggest a distinct label when it serves a
// different checkout or port.
export function serviceInstructions({ root, port = DEFAULT_PORT, label = DEFAULT_LABEL, uid = process.getuid?.(), home = os.homedir(), status = null }) {
  const plist = shellQuote(plistPath(label, home));
  const tool = shellQuote(path.join(root, 'tools/dashboard-service.mjs'));
  const flags = `--path ${shellQuote(root)} --port ${port} --label ${label}`;
  const lines = ['Owner actions (this tool never runs them for you):'];
  if (status?.plist?.exists) {
    lines.push(
      `  A configuration already exists at ${plist}; install refuses to replace it.`,
      `  Inspect it first: cat ${plist}`,
      `                    launchctl print gui/${uid}/${label}`
    );
    if (status.match && !status.match.matches) {
      const other = distinctLabel(root, label);
      lines.push(`  It serves a different checkout or port. For this checkout use a distinct label:`,
        `              node ${tool} install --path ${shellQuote(root)} --port ${port} --label ${other}`);
    }
  }
  // Under an existing label the same-label install lines are omitted: install
  // would refuse, and the configuration there is the installed service's.
  const install = status?.plist?.exists ? [] : [
    `  Install:    node ${tool} install ${flags}`,
    `              equivalent (refuses an existing file): (set -o noclobber; node ${tool} print ${flags} > ${plist})`,
    `                          launchctl bootstrap gui/${uid} ${plist}`
  ];
  if (status?.plist?.exists) lines.push('  The commands below act on the service installed under this label:');
  return [
    ...lines,
    ...install,
    `  Restart:    launchctl kickstart -k gui/${uid}/${label}`,
    `  Uninstall:  launchctl bootout gui/${uid}/${label}`,
    `              rm ${plist}`,
    `  Inspect:    launchctl print gui/${uid}/${label}`,
    status?.installed ? `  Open:       http://${HOST}:${status.installed.port}/ (the installed service)` : `  Open:       http://${HOST}:${port}/`
  ].join('\n');
}

const unxml = value => value.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');

// What an installed property list actually serves. Without --path the
// server finds the room from its WorkingDirectory; without --port it serves
// the default port.
export function installedTarget(text) {
  const value = key => { const found = text.match(new RegExp(`<key>${key}</key>\\s*<string>([\\s\\S]*?)</string>`)); return found ? unxml(found[1]) : null; };
  const array = text.match(/<key>ProgramArguments<\/key>\s*<array>([\s\S]*?)<\/array>/);
  const args = array ? [...array[1].matchAll(/<string>([\s\S]*?)<\/string>/g)].map(found => unxml(found[1])) : [];
  const flag = name => { const index = args.indexOf(name); return index >= 0 && index + 1 < args.length ? args[index + 1] : null; };
  const pathFlag = flag('--path'), portFlag = flag('--port');
  return {
    label: value('Label'), node: args[0] ?? null, script: args[1] ?? null,
    root: pathFlag ?? value('WorkingDirectory'), rootFrom: pathFlag ? '--path' : 'WorkingDirectory',
    port: portFlag ? Number(portFlag) : DEFAULT_PORT, portFrom: portFlag ? '--port' : 'default',
    stdout: value('StandardOutPath'), stderr: value('StandardErrorPath')
  };
}

// The Node the service should run: --node when given, else a stable launcher
// (not a versioned Cellar path a Homebrew upgrade removes) that resolves to
// the running Node, else the running Node's own path.
export const STABLE_NODES = Object.freeze(['/opt/homebrew/bin/node', '/usr/local/bin/node']);
export function resolveNode({ flag, execPath = process.execPath, exists = fs.existsSync, realpath = fs.realpathSync } = {}) {
  if (flag) return { node: flag, reason: 'chosen with --node' };
  const running = realpath(execPath);
  for (const candidate of STABLE_NODES) {
    try { if (exists(candidate) && realpath(candidate) === running) return { node: candidate, reason: `stable launcher ${candidate} resolves to the running Node` }; } catch {}
  }
  return { node: execPath, reason: 'no stable launcher resolves to the running Node; using its own path' };
}

// The top-level fields of `launchctl print gui/<uid>/<label>`; nested blocks
// (endpoints, event triggers) are indented further and ignored.
export function parseLaunchctlPrint(stdout) {
  const field = name => stdout.match(new RegExp(`^\\t${name} = (.+)$`, 'm'))?.[1].trim() ?? null;
  const pid = field('pid');
  return { state: field('state'), pid: pid === null ? null : Number(pid), lastExitCode: field('last exit code') };
}

function probePort(port) {
  return new Promise(resolve => {
    const request = http.get({ host: HOST, port, path: '/api/status', timeout: 1500 }, response => {
      response.resume();
      resolve({ answers: true, statusCode: response.statusCode });
    });
    request.on('timeout', () => request.destroy(Object.assign(new Error('timeout'), { code: 'ETIMEDOUT' })));
    request.on('error', error => resolve({ answers: false, error: error.code ?? error.message }));
  });
}

export async function serviceStatus({
  root = null,
  node = null,
  label = DEFAULT_LABEL,
  port = DEFAULT_PORT,
  platform = process.platform,
  uid = process.getuid?.(),
  home = os.homedir(),
  exists = fs.existsSync,
  read = file => fs.readFileSync(file, 'utf8'),
  run = (command, args) => spawnSync(command, args, { encoding: 'utf8' }),
  probe = probePort
} = {}) {
  const file = plistPath(label, home);
  const plist = { path: file, exists: Boolean(exists(file)) };
  let installed = null;
  if (plist.exists) {
    try { installed = installedTarget(read(file)); }
    catch (error) { plist.readError = error.message; }
  }
  const requested = { root, port, node };
  const match = installed ? {
    root: root === null ? null : path.resolve(installed.root ?? '') === path.resolve(root),
    port: installed.port === port,
    node: node === null ? null : installed.node === node
  } : null;
  if (match) match.matches = match.root !== false && match.port && match.node !== false;
  let launchd;
  if (platform !== 'darwin') launchd = { checked: false, detail: 'launchd is macOS only' };
  else {
    const result = run('launchctl', ['print', `gui/${uid}/${label}`]);
    if (result.status === 0) launchd = { checked: true, loaded: true, ...parseLaunchctlPrint(result.stdout ?? '') };
    else launchd = { checked: true, loaded: false, detail: `${result.stderr ?? ''}${result.stdout ?? ''}`.trim() || `launchctl exited ${result.status}` };
  }
  return { requested, plist, installed, match, launchd, port: { host: HOST, port, ...(await probe(port)) } };
}

// The installed service (from its configuration and launchd) and the port
// probe are reported separately: something answering on the requested port
// is never presented as the installed service unless it uses that port.
export function formatStatus(status, instructions) {
  const { plist, launchd, port, installed, match, requested = {} } = status;
  const where = target => `${target.root ?? '(unknown checkout)'} on port ${target.port}`;
  const lines = ['Dashboard login service'];
  if (requested.root) lines.push(`  requested      ${requested.root} on port ${requested.port}${requested.node ? ` with ${requested.node}` : ''}`);
  lines.push(`  configuration  ${plist.path} (${plist.exists ? 'installed' : 'not installed'})${plist.readError ? `; unreadable: ${plist.readError}` : ''}`);
  if (installed) {
    lines.push(`  installed      serves ${where(installed)} with ${installed.node ?? '(unknown Node)'} (checkout from ${installed.rootFrom}, port from ${installed.portFrom})`);
    if (match?.matches) lines.push('  match          the installed service matches the request');
    else {
      const parts = [];
      if (match.root === false || match.port === false) parts.push(`installed service serves ${where(installed)}, not the requested ${requested.root ?? '(this checkout)'} on port ${requested.port}`);
      if (match.node === false) parts.push(`it runs ${installed.node}, not ${requested.node}`);
      lines.push(`  MISMATCH       the ${parts.join('; ')}`);
    }
  }
  const owner = installed ? ` (the installed service: ${where(installed)})` : '';
  const launchdLine = !launchd.checked ? `not checked (${launchd.detail})`
    : !launchd.loaded ? `not loaded (${launchd.detail.split('\n').filter(Boolean).at(-1) ?? ''})`
    : `loaded, state ${launchd.state ?? 'unknown'}${launchd.pid ? `, pid ${launchd.pid}` : ''}${launchd.lastExitCode ? `, last exit ${launchd.lastExitCode}` : ''}${owner}`;
  lines.push(`  launchd        ${launchdLine}`);
  const answer = port.answers ? `${port.host}:${port.port} answers (HTTP ${port.statusCode})` : `${port.host}:${port.port} does not answer (${port.error ?? 'no response'})`;
  const attribution = !installed ? (port.answers ? '; no service is installed under this label, so this is some other process' : '')
    : installed.port === port.port ? '; the installed service uses this port'
    : `; this probes the requested port only and is not the installed service, which uses port ${installed.port}`;
  lines.push(`  http           ${answer}${attribution}`);
  return [...lines, '', instructions, ''].join('\n');
}

// A free port in the test range 4700-4799 on 127.0.0.1 (never 4646).
export async function freePort(from = 4700, to = 4799) {
  const ports = Array.from({ length: to - from + 1 }, (_, index) => from + index).sort(() => Math.random() - 0.5);
  for (const port of ports) {
    const free = await new Promise(resolve => {
      const server = net.createServer();
      server.once('error', () => resolve(false));
      server.listen(port, HOST, () => server.close(() => resolve(true)));
    });
    if (free) return port;
  }
  throw new Error(`No free port from ${from} to ${to}`);
}

function call(port, method, pathname, body) {
  return new Promise((resolve, reject) => {
    const payload = body === undefined ? null : JSON.stringify(body);
    const request = http.request({ host: HOST, port, method, path: pathname, headers: payload ? { 'content-type': 'application/json' } : {} }, response => {
      const chunks = [];
      response.on('data', chunk => chunks.push(chunk));
      response.on('end', () => {
        const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        if (response.statusCode >= 400) reject(new Error(`${method} ${pathname}: ${response.statusCode} ${JSON.stringify(parsed.error ?? parsed)}`));
        else resolve(parsed);
      });
    });
    request.on('error', reject);
    request.end(payload ?? undefined);
  });
}

function startServer({ node, script, room, port }) {
  const child = spawn(node, [script, 'serve', '--path', room, '--port', String(port)], { stdio: ['ignore', 'pipe', 'pipe'] });
  let output = '';
  const ready = new Promise((resolve, reject) => {
    const onData = chunk => {
      output += chunk;
      if (output.includes(`open  http://${HOST}:${port}/`)) resolve(child);
    };
    child.stdout.on('data', onData);
    child.stderr.on('data', chunk => { output += chunk; });
    child.once('exit', code => reject(new Error(`server exited ${code} before listening: ${output.trim()}`)));
  });
  const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error(`server did not listen within 10s: ${output.trim()}`)), 10_000).unref());
  return Promise.race([ready, timeout]).catch(error => { child.kill('SIGKILL'); throw error; });
}

function stopServer(child) {
  if (child.exitCode !== null || child.signalCode !== null) return Promise.resolve();
  return new Promise(resolve => {
    child.once('exit', () => resolve());
    child.kill('SIGKILL');
  });
}

// The listening address the operating system reports for the child, when
// lsof is available; otherwise "unverified".
function boundAddress(pid, port) {
  const result = spawnSync('lsof', ['-nP', '-a', '-p', String(pid), `-iTCP:${port}`, '-sTCP:LISTEN', '-Fn'], { encoding: 'utf8' });
  const names = (result.stdout ?? '').split('\n').filter(line => line.startsWith('n')).map(line => line.slice(1));
  return names.length ? [...new Set(names)].join(', ') : 'unverified';
}

async function snapshot(port) {
  const [workflow, view] = await Promise.all([call(port, 'GET', '/api/workflow'), call(port, 'GET', '/api/board')]);
  return { workflow, answers: Object.fromEntries(view.items.map(item => [item.id, item.answer])), statuses: Object.fromEntries(view.items.map(item => [item.id, item.derivedStatus])) };
}

function disposableRoom(board) {
  const room = fs.mkdtempSync(path.join(os.tmpdir(), 'dashboard-restart-'));
  fs.mkdirSync(path.join(room, board.BOARD_DIR), { recursive: true });
  fs.writeFileSync(path.join(room, 'workbench/manifest.json'), JSON.stringify({ schemaVersion: 2, lanes: { sessions: 'workbench/sessions' }, collections: { notepads: 'workbench/sessions/notepads', 'notepad-templates': 'workbench/sessions/notepads/templates', handoffs: 'workbench/sessions/handoffs' } }));
  fs.writeFileSync(path.join(room, 'README.md'), '# Disposable room\n');
  fs.writeFileSync(board.boardPaths(room).items, JSON.stringify({ schema: board.ITEMS_SCHEMA, title: 'Restart check', groups: [{ id: 'one', title: 'One' }], items: [] }));
  board.addItems(room, [1, 2].map(n => ({ key: `restart-${n}`, group: 'one', kind: 'confirm-text', title: `Restart question ${n}`, question: 'Approve these exact words?', current: 'Working words.', proposal: 'Durable words.', draft: `# Draft ${n}\n`, sources: [{ label: 'Owner', path: 'README.md', ref: 'fixture' }] })), { by: 'restart-check' });
  return room;
}

// Start the board on a disposable room, record an answer, a Change, a round
// and a promotion request through its HTTP API, kill it without warning,
// start it again and compare what it serves.
export async function restartCheck({ port, node = process.execPath, script = SERVER_SCRIPT, keep = false } = {}) {
  if (!Number.isInteger(port) || port === DEFAULT_PORT) throw new Error('restart-check needs an explicit test port other than 4646');
  const board = await import(pathToFileURL(script).href);
  const room = disposableRoom(board);
  let child;
  try {
    child = await startServer({ node, script, room, port });
    const bound = boundAddress(child.pid, port);
    await call(port, 'PUT', '/api/answers/GB-0001', { verdict: 'confirm', note: '', itemRevision: 1, expectedAnswerAt: null });
    let revision = (await call(port, 'GET', '/api/workflow')).revision;
    revision = (await call(port, 'POST', '/api/comments', { id: 'GB-0002', itemRevision: 1, kind: 'change', text: 'Say which file owns this.', actionId: 'restart-change', expectedRevision: revision })).revision;
    revision = (await call(port, 'POST', '/api/rounds', { actionId: 'restart-round', expectedRevision: revision })).revision;
    await call(port, 'POST', '/api/promotions', { ids: ['GB-0001'], revisions: { 'GB-0001': 1 }, actionId: 'restart-promotion', expectedRevision: revision });
    const before = await snapshot(port);
    await stopServer(child);
    child = await startServer({ node, script, room, port });
    const after = await snapshot(port);
    const differences = ['workflow', 'answers', 'statuses'].filter(key => !isDeepStrictEqual(before[key], after[key]));
    return { port, room, bound, persisted: differences.length === 0, differences, before, after };
  } finally {
    if (child) await stopServer(child);
    if (!keep) fs.rmSync(room, { recursive: true, force: true });
  }
}

function parseFlags(args) {
  const flags = {};
  for (let index = 0; index < args.length; index += 1) {
    if (!args[index].startsWith('--')) throw new Error(`Unexpected argument ${args[index]}`);
    const name = args[index].slice(2);
    if (args[index + 1] === undefined || args[index + 1].startsWith('--')) flags[name] = true;
    else flags[name] = args[++index];
  }
  return flags;
}

const USAGE = 'Usage: dashboard-service.mjs print|install|status --path ROOT [--port 4646] [--label com.kayden.workbench-dashboard] [--node PATH] [--json] | restart-check --port 47xx [--keep]';

if (process.argv[1] && path.resolve(process.argv[1]) === SERVICE_SCRIPT) {
  try {
    const [command, ...args] = process.argv.slice(2);
    const flags = parseFlags(args);
    const root = path.resolve(typeof flags.path === 'string' ? flags.path : process.cwd());
    const label = typeof flags.label === 'string' ? flags.label : DEFAULT_LABEL;
    const port = Number(flags.port ?? DEFAULT_PORT);
    const chosen = resolveNode({ flag: typeof flags.node === 'string' ? flags.node : undefined });
    if (command === 'print') {
      process.stderr.write(`Node: ${chosen.node} (${chosen.reason})\n`);
      process.stdout.write(servicePlist({ root, port, label, node: chosen.node }));
    } else if (command === 'status') {
      checkConfig({ root, node: chosen.node, port, label });
      const status = await serviceStatus({ root, node: chosen.node, label, port });
      const instructions = serviceInstructions({ root, port, label, status });
      process.stdout.write(flags.json ? `${JSON.stringify({ ...status, nodeChoice: chosen, instructions }, null, 2)}\n` : formatStatus(status, instructions));
    } else if (command === 'restart-check') {
      if (flags.port === undefined) throw new Error('restart-check needs --port in 4700-4799');
      const result = await restartCheck({ port, keep: Boolean(flags.keep) });
      process.stdout.write(`${JSON.stringify({ port: result.port, bound: result.bound, persisted: result.persisted, differences: result.differences, room: flags.keep ? result.room : '(removed)' }, null, 2)}\n`);
      if (!result.persisted) process.exitCode = 1;
    } else if (command === 'install') {
      const text = servicePlist({ root, port, label, node: chosen.node });
      if (process.platform !== 'darwin') throw new Error('Login service installation requires macOS; use grill-board.mjs serve on other hosts');
      if (!fs.existsSync(path.join(root, 'tools/grill-board.mjs'))) throw new Error('The selected checkout has no Dashboard server');
      const destination = plistPath(label);
      if (fs.existsSync(destination)) {
        const status = await serviceStatus({ root, node: chosen.node, label, port });
        throw new Error(`Existing service configuration preserved: ${destination}. Inspect it before replacing it.\n${formatStatus(status, serviceInstructions({ root, port, label, status }))}`);
      }
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.writeFileSync(destination, text, { flag: 'wx' });
      const result = spawnSync('launchctl', ['bootstrap', `gui/${process.getuid()}`, destination], { encoding: 'utf8' });
      if (result.status !== 0) throw new Error(`Service configuration saved at ${destination}; bootstrap failed: ${result.stderr.trim()}`);
      console.log(`Dashboard login service installed: ${destination} (Node: ${chosen.node}, ${chosen.reason})\n${serviceInstructions({ root, port, label })}`);
    } else throw new Error(USAGE);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
