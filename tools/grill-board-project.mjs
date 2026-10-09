#!/usr/bin/env node
// Optional project adapter. The producer Board remains the protocol/UI owner.
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const bundled = path.resolve(here, '../producer/tools/grill-board.mjs');
const core = await import(pathToFileURL(fs.existsSync(bundled) ? bundled : path.join(here, 'grill-board.mjs')));
export const DIRECTORY = 'workbench/grill-board';
export const CONFIG_SCHEMA = 'grill-board/project@1';
export const RECEIPT_SCHEMA = 'grill-board/deployment@1';
export const sha256 = value => createHash('sha256').update(value).digest('hex');
const fail = message => { throw new Error(message); };
export function ordinary(file, type = 'file', optional = false) {
  let stat;
  try { stat = fs.lstatSync(file); } catch (error) { if (optional && error.code === 'ENOENT') return false; throw error; }
  if (stat.isSymbolicLink() || (type === 'file' ? !stat.isFile() || stat.nlink !== 1 : !stat.isDirectory())) fail(`Unsafe ${type}: ${file}`);
  return true;
}
export function ordinaryRoot(root) {
  let current = path.resolve(root);
  while (current !== path.dirname(current)) {
    // macOS's system /var and /tmp aliases are trusted filesystem roots.
    if (!['/var','/tmp'].includes(current)) ordinary(current,'directory');
    current = path.dirname(current);
  }
}
export function safePath(root, relative, { optional = false, directory = false } = {}) {
  if (typeof relative !== 'string' || !relative || relative.includes('\\') || relative.includes('\0') || path.isAbsolute(relative) || relative.split('/').some(part => !part || part === '.' || part === '..')) fail('Unsafe relative path');
  ordinaryRoot(root);
  let current = root;
  const pieces = relative.split('/');
  for (let index = 0; index < pieces.length; index++) {
    current = path.join(current, pieces[index]);
    if (!fs.existsSync(current)) {
      try { fs.lstatSync(current); } catch (error) { if (optional && error.code === 'ENOENT') return current; throw error; }
    }
    ordinary(current, index < pieces.length - 1 || directory ? 'directory' : 'file');
  }
  return current;
}
export function validateConfig(config) {
  if (!config || Array.isArray(config) || config.schema !== CONFIG_SCHEMA) fail(`Configuration schema must be ${CONFIG_SCHEMA}`);
  const allowed = ['schema','title','repository','instance','port','topics'];
  if (Object.keys(config).some(key => !allowed.includes(key))) fail('Unknown configuration field');
  const text = value => typeof value === 'string' && value.trim() && value.length <= 1000 && !/[\u0000-\u001f]/.test(value);
  if (!text(config.title)) fail('Project title required');
  if (typeof config.repository !== 'string' || !/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(config.repository)) fail('Repository must be a canonical HTTPS GitHub owner/repository URL');
  if (!/^[a-z0-9][a-z0-9-]{2,79}$/.test(config.instance ?? '')) fail('Unique project instance key required (3–80 lowercase letters/digits/hyphens)');
  if (!Number.isInteger(config.port) || config.port < 1024 || config.port > 65535) fail('Manual loopback port must be 1024–65535');
  if (!Array.isArray(config.topics) || !config.topics.length || config.topics.length > 50) fail('One to fifty topics required');
  const ids = new Set(), groups = new Set();
  for (const topic of config.topics) {
    if (!topic || Object.keys(topic).some(key => !['id','title','frame','outcome','groups'].includes(key)) || !/^[a-z][a-z0-9-]*$/.test(topic.id ?? '') || topic.id === 'other' || ids.has(topic.id)) fail('Unique topic ids required; other is reserved');
    ids.add(topic.id);
    for (const key of ['title','frame','outcome']) if (!text(topic[key])) fail(`Topic ${key} required`);
    if (!Array.isArray(topic.groups) || !topic.groups.length) fail('Topic groups required');
    for (const group of topic.groups) { if (!/^[a-z][a-z0-9-]*$/.test(group ?? '') || groups.has(group)) fail('Group must belong to exactly one topic'); groups.add(group); }
  }
  return config;
}
// GitHub repository identities are case-insensitive across HTTPS and SSH remotes.
function githubIdentity(repository) {
  if (typeof repository !== 'string') return null;
  const match=repository.match(/^(?:https:\/\/github\.com\/|git@github\.com:|ssh:\/\/git@github\.com\/)([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+?)\/?$/i);
  return match ? match[1].replace(/\.git$/i,'').toLowerCase() : null;
}
export function validateProjectRepository(root, config) {
  let origin;
  try { origin=execFileSync('git',['remote','get-url','origin'],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim(); }
  catch { fail('Target origin must identify the configured GitHub repository'); }
  const identity=githubIdentity(origin);
  if (!identity || identity!==githubIdentity(config.repository)) fail('Configured repository must match the target GitHub origin');
}
const escapeHtml = value => value.replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
const js = value => JSON.stringify(value).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
function seam(html, expression, replacement, count = 1) {
  const matches = html.match(expression);
  if (!matches || matches.length !== count) fail('Producer page configuration seam drifted; deployment refused');
  return html.replace(expression, () => replacement);
}
export function renderProjectPage(page, config) {
  validateConfig(config);
  const topics = [...config.topics, { id:'other', title:'Other topics', frame:'New project questions awaiting grouping', outcome:'Every question stays reachable', groups:[] }];
  let html = seam(page, /<title>Consequential Decision Record · Grill Board<\/title>/g, `<title>${escapeHtml(config.title)} · Grill Board</title>`);
  html = seam(html, /<strong>Consequential Decision Record<\/strong>/g, `<strong>${escapeHtml(config.title)}</strong>`);
  html = seam(html, /  const TOPICS = \[[\s\S]*?\n  \];/g, `  const TOPICS = ${js(topics)};`);
  html = seam(html, /  function topicFor\(item\) \{ return TOPICS\.find\(topic => topic\.numbers\.includes\(Number\(item\.id\?\.replace\('GB-', ''\)\)\)\)\?\.id \|\| 'other'; \}/g, "  function topicFor(item) { return TOPICS.find(topic => topic.groups.includes(item.group))?.id || 'other'; }");
  html = seam(html, /item\.id === 'GB-0180' \|\| /g, '');
  html = seam(html, /'grill-board-batch'/g, js(`grill-board:${config.instance}:batch`), 3);
  html = seam(html, /'grill-board-theme'/g, js(`grill-board:${config.instance}:theme`), 2);
  return html;
}
export function verifyProject(root) {
  root = path.resolve(root);
  safePath(root, 'workbench/manifest.json');
  safePath(root, DIRECTORY, { directory: true });
  const configPath = safePath(root, `${DIRECTORY}/project.json`);
  const receipt = JSON.parse(fs.readFileSync(safePath(root, `${DIRECTORY}/deployment.json`), 'utf8'));
  const config = validateConfig(JSON.parse(fs.readFileSync(configPath, 'utf8')));
  validateProjectRepository(root,config);
  if (receipt.schema !== RECEIPT_SCHEMA || !/^[a-f0-9]{40}$/.test(receipt.source?.commit ?? '') || typeof receipt.source?.repository !== 'string' || !receipt.files || Array.isArray(receipt.files)) fail('Invalid deployment receipt');
  const required = ['project.json','index.html','.gitignore','README.md','runtime/tools/grill-board-project.mjs','runtime/producer/tools/grill-board.mjs','runtime/producer/workbench/grill-board/index.html'];
  if (required.some(file => !Object.hasOwn(receipt.files, file))) fail('Incomplete deployment receipt');
  for (const [relative, hash] of Object.entries(receipt.files)) {
    if (!/^[a-f0-9]{64}$/.test(hash) || ['items.json','answers.json','deployment.json'].includes(relative)) fail('Invalid receipt entry');
    const file = safePath(root, `${DIRECTORY}/${relative}`);
    if (sha256(fs.readFileSync(file)) !== hash) fail(`Deployment drift: ${relative}`);
  }
  safePath(root, `${DIRECTORY}/items.json`);
  safePath(root, `${DIRECTORY}/answers.json`, {optional:true});
  const tracked = execFileSync('git',['ls-files','--',`${DIRECTORY}/answers.json`],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
  if (tracked) fail('Owner answers must never be tracked');
  const board = core.readItems(root);
  core.readAnswers(root);
  const configuredGroups = new Set(config.topics.flatMap(topic => topic.groups));
  if (board.groups.some(group => !configuredGroups.has(group.id))) fail('Board has groups outside configured topics');
  const ids = new Set(board.items.map(item => item.id));
  if (Object.keys(core.readAnswers(root).answers).some(id => !ids.has(id))) fail('Owner answers reference missing items');
  // Only the private installed page/module tree is trusted at serve/CLI entry.
  const expected = renderProjectPage(fs.readFileSync(safePath(root, `${DIRECTORY}/runtime/producer/workbench/grill-board/index.html`),'utf8'),config);
  if (fs.readFileSync(safePath(root, `${DIRECTORY}/index.html`),'utf8') !== expected) fail('Configured page mismatch');
  return { root, config, receipt, board };
}
// Legacy atomic writers use these predictable temp destinations. Refuse any
// existing entry, even an ordinary file, instead of truncating someone else's data.
function guardWrites(root) {
  for (const name of ['items.json','answers.json']) {
    const relative = `${DIRECTORY}/${name}.${process.pid}.tmp`;
    const file = safePath(root,relative,{optional:true});
    try { fs.lstatSync(file); fail(`Existing Board temporary write destination: ${relative}`); } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
}
export function ordinaryInput(file) {
  const absolute = path.resolve(file);
  // Share the same ancestor and leaf checks with initialization inputs.
  ordinaryRoot(path.dirname(absolute));
  ordinary(absolute);
  return absolute;
}
function send(response, status, value) { response.writeHead(status, {'content-type':'application/json; charset=utf-8','cache-control':'no-store'}); response.end(JSON.stringify(value)); }
function projectLinks(sources, config) {
  return sources.map(source => ({...source, url: source.ref && source.ref !== 'untracked' && /^[a-f0-9]{40}$/.test(source.ref) && typeof source.path === 'string' && !path.isAbsolute(source.path) && !source.path.split('/').some(part=>!part||part==='.'||part==='..') ? `${config.repository}/blob/${source.ref}/${source.path.split('/').map(encodeURIComponent).join('/')}` : null}));
}
function projectView(root, config) {
  const view=core.mergeBoard(root); view.title=config.title;
  for (const item of view.items) item.links=projectLinks(item.sources,config);
  return view;
}
// Match the producer's read-command argument semantics. Other commands and
// missing/unknown show identities retain the producer's own validation/errors.
function readArguments(argv) {
  const positional=[], flags={};
  for (let index=0;index<argv.length;index++) {
    const arg=argv[index];
    if (arg.startsWith('--')) {
      const next=argv[index+1];
      if (next===undefined || next.startsWith('--')) flags[arg.slice(2)]=true;
      else {flags[arg.slice(2)]=next;index++;}
    } else positional.push(arg);
  }
  return {positional,flags};
}
export function createProjectServer(root) {
  verifyProject(root);
  const delegate = core.createServer(root);
  return http.createServer((request, response) => {
    try {
      const {config} = verifyProject(root);
      const address = request.socket.localAddress;
      if (!['127.0.0.1','::1'].includes(address)) fail('Only loopback requests are supported');
      const localPort = request.socket.localPort;
      if (![`127.0.0.1:${localPort}`,`localhost:${localPort}`,`[::1]:${localPort}`].includes(request.headers.host)) fail('Invalid loopback Host');
      if (request.headers.origin && ![`http://127.0.0.1:${localPort}`,`http://localhost:${localPort}`,`http://[::1]:${localPort}`].includes(request.headers.origin)) fail('Cross-origin request refused');
      const url = new URL(request.url,'http://localhost');
      guardWrites(root);
      if (request.method === 'GET' && ['/api/file','/api/artifact'].includes(url.pathname)) safePath(root,url.searchParams.get('path'));
      if (request.method === 'GET' && url.pathname === '/api/board') {
        send(response,200,projectView(root,config)); return;
      }
      // Source API already names and bounds ordinary files; answers use its
      // original revision/history protocol. Recheck write destinations per request.
      delegate.emit('request', request, response);
    } catch (error) { send(response,400,{error:{code:'project-board-refused',message:error.message}}); }
  });
}
export async function main(argv) {
  const {positional,flags}=readArguments(argv);
  const root = flags.path ? path.resolve(flags.path) : core.findRoot();
  const {config} = verifyProject(root);
  if (argv[0] === 'serve') {
    if (argv.some(argument => ['--host','--bind','--port'].includes(argument))) fail('Host/bind/port overrides are unsupported; use reviewed project configuration');
    const server = createProjectServer(root);
    await new Promise((resolve,reject) => { server.once('error',reject); server.listen(config.port,'127.0.0.1',resolve); });
    process.stdout.write(`${config.title}: http://127.0.0.1:${config.port}/ (manual localhost service; Ctrl-C stops it)\n`);
    return server;
  }
  if (!['status','pending','show','add','revise','apply','withdraw','validate'].includes(argv[0])) fail('Use serve/status/pending/show/add/revise/apply/withdraw/validate');
  guardWrites(root);
  for (const flag of ['--file','--draft-file','--options-file','--brief-file']) {
    const input=flags[flag.slice(2)];
    if (input !== undefined) { if (typeof input !== 'string') fail(`${flag} needs an ordinary file`); ordinaryInput(input); }
  }
  if (argv[0]==='show') {
    const item=projectView(root,config).items.find(candidate=>candidate.id===positional[1]);
    if (item) {process.stdout.write(`${JSON.stringify(item,null,2)}\n`);return;}
  }
  if (argv[0]==='pending' && flags.json) {
    const pending=core.pendingForAgents(root).map(item=>({...item,links:projectLinks(item.sources,config)}));
    process.stdout.write(`${JSON.stringify(pending,null,2)}\n`);return;
  }
  return core.main(argv);
}
// realpath-safe entry guard, including invocation through a symlink.
if (process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url))) main(process.argv.slice(2)).catch(error=>{ console.error(error.message); process.exitCode=1; });
