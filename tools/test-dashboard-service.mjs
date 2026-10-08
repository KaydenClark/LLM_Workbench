#!/usr/bin/env node
// The login service is configuration the owner installs; nothing here runs
// launchctl bootstrap/bootout or writes ~/Library. launchctl and the port
// probe are injected; the restart check runs a disposable room on 127.0.0.1.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import net from 'node:net';
import * as service from './dashboard-service.mjs';

const ROOT = '/tmp/room & <demo> "quoted"';
const NODE = '/usr/local/bin/node';
const LABEL = 'com.kayden.workbench-dashboard';

function strings(xml, key) {
  const match = xml.match(new RegExp(`<key>${key}</key>\\s*<array>([\\s\\S]*?)</array>`));
  return [...match[1].matchAll(/<string>([\s\S]*?)<\/string>/g)].map(found => found[1]);
}
const unescape = value => value.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');

test('login service configuration pins the checkout and Node and stays local', () => {
  const text = service.servicePlist({ root: ROOT, node: NODE, port: 4646, label: LABEL });
  assert.match(text, /<key>KeepAlive<\/key><true\/>/);
  assert.match(text, /<key>RunAtLoad<\/key><true\/>/);
  assert.match(text, /room &amp; &lt;demo&gt; &quot;quoted&quot;/);
  assert.doesNotMatch(text, /room & </);
  const args = strings(text, 'ProgramArguments').map(unescape);
  assert.deepEqual(args, [NODE, `${ROOT}/tools/grill-board.mjs`, 'serve', '--path', ROOT, '--port', '4646']);
  assert.ok(args.every((arg, index) => index > 1 || arg.startsWith('/')), 'Node and the server are absolute paths');
  assert.equal(args.some(arg => /host|0\.0\.0\.0|::/.test(arg)), false, 'no host override: serve binds 127.0.0.1');
  assert.match(text, new RegExp(`<key>WorkingDirectory</key><string>${'/tmp/room &amp; &lt;demo&gt; &quot;quoted&quot;'}</string>`));
  assert.match(text, /<key>PATH<\/key><string>\/usr\/local\/bin:\/usr\/bin:\/bin:\/usr\/sbin:\/sbin<\/string>/);
  assert.match(text, /workbench\/grill-board\/service\.log/);
  for (const bad of [{ port: 0 }, { port: 70000 }, { port: 46.5 }, { label: 'unsafe label' }, { label: 'com.x</string>' }, { root: 'relative/room' }, { node: 'node' }]) {
    assert.throws(() => service.servicePlist({ root: ROOT, node: NODE, port: 4646, label: LABEL, ...bad }));
  }
});

test('the served board binds 127.0.0.1 only', () => {
  const source = fs.readFileSync(new URL('./grill-board.mjs', import.meta.url), 'utf8');
  const listens = [...source.matchAll(/\.listen\(([^)]*)\)/g)].map(match => match[1]);
  assert.ok(listens.length >= 1);
  for (const call of listens) assert.match(call, /'127\.0\.0\.1'/);
});

test('status parses launchd state and the port probe through injected runners', async () => {
  const printed = [
    `gui/501/${LABEL} = {`,
    '\tactive count = 1',
    `\tpath = /Users/owner/Library/LaunchAgents/${LABEL}.plist`,
    '\tstate = running',
    '\tprogram = /usr/local/bin/node',
    '\tendpoints = {',
    '\t\tstate = inactive',
    '\t}',
    '\tpid = 4242',
    '\tlast exit code = (never exited)',
    '}'
  ].join('\n');
  const calls = [];
  const running = await service.serviceStatus({
    label: LABEL, port: 4646, platform: 'darwin', uid: 501, home: '/Users/owner',
    exists: file => { calls.push(['exists', file]); return true; },
    read: file => { calls.push(['read', file]); return service.servicePlist({ root: '/Users/owner/LLM_Workbench', node: NODE, port: 4646, label: LABEL }); },
    run: (command, args) => { calls.push([command, ...args]); return { status: 0, stdout: printed, stderr: '' }; },
    probe: async port => { calls.push(['probe', port]); return { answers: true, statusCode: 200 }; }
  });
  assert.deepEqual(calls, [['exists', `/Users/owner/Library/LaunchAgents/${LABEL}.plist`], ['read', `/Users/owner/Library/LaunchAgents/${LABEL}.plist`], ['launchctl', 'print', `gui/501/${LABEL}`], ['probe', 4646]]);
  assert.deepEqual(running.plist, { path: `/Users/owner/Library/LaunchAgents/${LABEL}.plist`, exists: true });
  assert.deepEqual(running.launchd, { checked: true, loaded: true, state: 'running', pid: 4242, lastExitCode: '(never exited)' });
  assert.deepEqual(running.port, { host: '127.0.0.1', port: 4646, answers: true, statusCode: 200 });

  const absent = await service.serviceStatus({
    label: LABEL, port: 4799, platform: 'darwin', uid: 501, home: '/Users/owner',
    exists: () => false,
    run: () => ({ status: 113, stdout: '', stderr: `Bad request.\nCould not find service "${LABEL}" in domain for user gui: 501\n` }),
    probe: async () => ({ answers: false, error: 'ECONNREFUSED' })
  });
  assert.equal(absent.plist.exists, false);
  assert.equal(absent.launchd.loaded, false);
  assert.match(absent.launchd.detail, /Could not find service/);
  assert.equal(absent.port.answers, false);

  const linux = await service.serviceStatus({ label: LABEL, port: 4799, platform: 'linux', uid: 1000, home: '/home/owner', exists: () => false, run: () => assert.fail('launchctl is macOS only'), probe: async () => ({ answers: false }) });
  assert.equal(linux.launchd.checked, false);
});

test('status output prints exact install, restart, uninstall and inspect instructions', () => {
  const text = service.serviceInstructions({ root: '/Users/owner/LLM Workbench', port: 4646, label: LABEL, uid: 501, home: '/Users/owner' });
  const plist = `/Users/owner/Library/LaunchAgents/${LABEL}.plist`;
  assert.match(text, /node '\/Users\/owner\/LLM Workbench\/tools\/dashboard-service\.mjs' install --path '\/Users\/owner\/LLM Workbench' --port 4646 --label com\.kayden\.workbench-dashboard/);
  assert.ok(text.includes(`launchctl bootstrap gui/501 ${plist}`));
  assert.ok(text.includes(`launchctl kickstart -k gui/501/${LABEL}`));
  assert.ok(text.includes(`launchctl bootout gui/501/${LABEL}`));
  assert.ok(text.includes(`rm ${plist}`));
  assert.ok(text.includes(`launchctl print gui/501/${LABEL}`));
  assert.ok(text.includes('http://127.0.0.1:4646/'));
  const formatted = service.formatStatus({ plist: { path: plist, exists: false }, launchd: { checked: true, loaded: false, detail: 'Could not find service' }, port: { host: '127.0.0.1', port: 4646, answers: false, error: 'ECONNREFUSED' } }, text);
  assert.match(formatted, /not installed/);
  assert.match(formatted, /not loaded/);
  assert.match(formatted, /127\.0\.0\.1:4646 does not answer/);
  assert.ok(formatted.endsWith(`${text}\n`));
});

async function socketsAllowed() {
  return new Promise(resolve => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.listen(0, '127.0.0.1', () => server.close(() => resolve(true)));
  });
}

test('restart check: a killed and restarted local server keeps workflow state and answers', async t => {
  if (!(await socketsAllowed())) { t.skip('sockets unavailable in this sandbox; run with sockets allowed'); return; }
  const result = await service.restartCheck({ port: await service.freePort() });
  assert.equal(result.persisted, true, JSON.stringify(result.differences));
  assert.equal(result.before.workflow.requests.length, 1);
  assert.equal(result.before.workflow.comments.length, 1);
  assert.equal(result.before.workflow.rounds.length, 1);
  assert.equal(result.before.answers['GB-0001'].verdict, 'confirm');
  assert.deepEqual(result.after, result.before);
  assert.match(result.bound, /^127\.0\.0\.1:\d+$/);
  assert.equal(fs.existsSync(result.room), false, 'the disposable room is removed');
});

// The owner's installed shape: no --path argument (the server finds the room
// from WorkingDirectory), the stable Homebrew launcher and logs under
// ~/Library/Logs. Built here; the real ~/Library is never read.
const OWNER_PLIST = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>${LABEL}</string>
  <key>ProgramArguments</key>
  <array>
    <string>/opt/homebrew/bin/node</string>
    <string>/Users/owner/LLM_Workbench/tools/grill-board.mjs</string>
    <string>serve</string>
    <string>--port</string>
    <string>4646</string>
  </array>
  <key>WorkingDirectory</key>
  <string>/Users/owner/LLM_Workbench</string>
  <key>RunAtLoad</key>
  <true/>
  <key>KeepAlive</key>
  <true/>
  <key>StandardOutPath</key>
  <string>/Users/owner/Library/Logs/workbench-dashboard/out.log</string>
  <key>StandardErrorPath</key>
  <string>/Users/owner/Library/Logs/workbench-dashboard/err.log</string>
</dict>
</plist>
`;
const RUNNING = [`gui/501/${LABEL} = {`, '\tstate = running', '\tpid = 78048', '}'].join('\n');

test('the installed service target is read from its plist, including the owner shape without --path', () => {
  assert.deepEqual(service.installedTarget(OWNER_PLIST), {
    label: LABEL, node: '/opt/homebrew/bin/node', script: '/Users/owner/LLM_Workbench/tools/grill-board.mjs',
    root: '/Users/owner/LLM_Workbench', rootFrom: 'WorkingDirectory', port: 4646, portFrom: '--port',
    stdout: '/Users/owner/Library/Logs/workbench-dashboard/out.log', stderr: '/Users/owner/Library/Logs/workbench-dashboard/err.log'
  });
  const bare = service.installedTarget(OWNER_PLIST.replace('<string>--port</string>\n    <string>4646</string>\n', ''));
  assert.deepEqual([bare.port, bare.portFrom], [4646, 'default'], 'without --port the server serves the default port');
  const ours = service.installedTarget(service.servicePlist({ root: ROOT, node: NODE, port: 4712, label: LABEL }));
  assert.deepEqual([ours.root, ours.rootFrom, ours.port, ours.portFrom, ours.node], [ROOT, '--path', 4712, '--port', NODE]);
});

test('status reports a mismatch between the installed service and the request and never attributes the probe to it', async () => {
  const status = await service.serviceStatus({
    root: '/tmp/demo-copy', port: 4720, node: '/opt/homebrew/bin/node', label: LABEL, platform: 'darwin', uid: 501, home: '/Users/owner',
    exists: () => true, read: () => OWNER_PLIST,
    run: () => ({ status: 0, stdout: RUNNING, stderr: '' }),
    probe: async () => ({ answers: true, statusCode: 200 })
  });
  assert.deepEqual(status.requested, { root: '/tmp/demo-copy', port: 4720, node: '/opt/homebrew/bin/node' });
  assert.equal(status.installed.root, '/Users/owner/LLM_Workbench');
  assert.deepEqual(status.match, { root: false, port: false, node: true, matches: false });
  const text = service.formatStatus(status, service.serviceInstructions({ root: '/tmp/demo-copy', port: 4720, label: LABEL, uid: 501, home: '/Users/owner', status }));
  assert.match(text, /installed service serves \/Users\/owner\/LLM_Workbench on port 4646, not the requested \/tmp\/demo-copy on port 4720/);
  assert.match(text, /pid 78048 \(the installed service: \/Users\/owner\/LLM_Workbench on port 4646\)/);
  assert.match(text, /127\.0\.0\.1:4720 answers \(HTTP 200\); this probes the requested port only and is not the installed service, which uses port 4646/);
  assert.match(text, /already exists[\s\S]*install refuses to replace it/);
  assert.match(text, /Inspect it first:[\s\S]*cat \/Users\/owner\/Library\/LaunchAgents\/com\.kayden\.workbench-dashboard\.plist/);
  assert.match(text, /--label com\.kayden\.workbench-dashboard\.demo-copy/);
  assert.match(text, /Open: {7}http:\/\/127\.0\.0\.1:4646\/ \(the installed service\)/);
  assert.doesNotMatch(text, /> \/Users\/owner\/Library\/LaunchAgents\/com\.kayden\.workbench-dashboard\.plist/, 'no instruction writes over the existing configuration');
  assert.doesNotMatch(text, /install --path \/tmp\/demo-copy --port 4720 --label com\.kayden\.workbench-dashboard\n/, 'no same-label install is offered');

  const same = await service.serviceStatus({
    root: '/Users/owner/LLM_Workbench', port: 4646, node: '/opt/homebrew/bin/node', label: LABEL, platform: 'darwin', uid: 501, home: '/Users/owner',
    exists: () => true, read: () => OWNER_PLIST, run: () => ({ status: 0, stdout: RUNNING, stderr: '' }), probe: async () => ({ answers: true, statusCode: 200 })
  });
  assert.equal(same.match.matches, true);
  assert.match(service.formatStatus(same, ''), /the installed service matches the request/);
  assert.match(service.formatStatus(same, ''), /127\.0\.0\.1:4646 answers \(HTTP 200\); the installed service uses this port/);

  const none = await service.serviceStatus({
    root: '/tmp/demo-copy', port: 4720, node: NODE, label: LABEL, platform: 'darwin', uid: 501, home: '/Users/owner',
    exists: () => false, read: () => assert.fail('no plist to read'), run: () => ({ status: 113, stdout: '', stderr: 'Could not find service' }), probe: async () => ({ answers: true, statusCode: 200 })
  });
  assert.equal(none.installed, null);
  assert.match(service.formatStatus(none, ''), /127\.0\.0\.1:4720 answers \(HTTP 200\); no service is installed under this label, so this is some other process/);
  const fresh = service.serviceInstructions({ root: '/tmp/demo-copy', port: 4720, label: LABEL, uid: 501, home: '/Users/owner', status: none });
  assert.match(fresh, /set -o noclobber/, 'even the manual equivalent refuses to overwrite');
});

test('print prefers a stable Node launcher that resolves to the running Node', () => {
  const cellar = '/opt/homebrew/Cellar/node/26.3.0/bin/node';
  const links = { '/opt/homebrew/bin/node': cellar, [cellar]: cellar, '/usr/local/bin/node': '/usr/local/Cellar/node/20/bin/node' };
  const fsCheck = { exists: file => file in links, realpath: file => links[file] ?? file };
  assert.deepEqual(service.resolveNode({ execPath: cellar, ...fsCheck }), { node: '/opt/homebrew/bin/node', reason: 'stable launcher /opt/homebrew/bin/node resolves to the running Node' });
  assert.deepEqual(service.resolveNode({ execPath: '/usr/local/Cellar/node/20/bin/node', ...fsCheck }), { node: '/usr/local/bin/node', reason: 'stable launcher /usr/local/bin/node resolves to the running Node' });
  assert.deepEqual(service.resolveNode({ execPath: '/nix/store/x/bin/node', ...fsCheck }), { node: '/nix/store/x/bin/node', reason: 'no stable launcher resolves to the running Node; using its own path' });
  assert.deepEqual(service.resolveNode({ flag: '/custom/node', execPath: cellar, ...fsCheck }), { node: '/custom/node', reason: 'chosen with --node' });
});
