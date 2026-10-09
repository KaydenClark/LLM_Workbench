#!/usr/bin/env node
// Optional installation, never part of the automatic managed-tool deployment.
import fs from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { DIRECTORY, RECEIPT_SCHEMA, sha256, ordinary, ordinaryInput, safePath, validateConfig, validateProjectRepository, renderProjectPage, verifyProject } from './grill-board-project.mjs';
const fail = message => {throw new Error(message);};
const git = (root,args) => execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
// A module specifier counts only where it is an import or re-export statement:
// at the start of a line, or after the closing brace of a multi-line import.
// Words inside a string, template or comment (such as a message that says
// 'derives from "related"') are not dependencies.
const IMPORT_STATEMENT = /^[ \t]*(?:(?:import|export)\b[^\n'"]*?\bfrom[ \t]*|import[ \t]*|\}[ \t]*from[ \t]*)['"]([^'"\n]+)['"]/gm;
export function moduleClosure(root, relative, files = new Map()) {
  if (files.has(relative)) return files;
  if (!/^(?:tools|workbench\/tools)\/[A-Za-z0-9_.\/-]+\.mjs$/.test(relative)) fail(`Unsupported module dependency ${relative}`);
  const file = safePath(root,relative); const bytes=fs.readFileSync(file); files.set(relative,bytes);
  const text=bytes.toString('utf8');
  for (const match of text.matchAll(IMPORT_STATEMENT)) {
    if (match[1].startsWith('node:')) continue;
    if (!match[1].startsWith('.')) fail(`External dependency ${match[1]} is unsupported`);
    moduleClosure(root,path.posix.normalize(path.posix.join(path.posix.dirname(relative),match[1])),files);
  }
  return files;
}
export function initializeProject({project,source,commit,config}) {
  project=path.resolve(project); source=path.resolve(source); validateConfig(config);
  ordinary(project,'directory'); ordinary(source,'directory'); safePath(project,'workbench/manifest.json');
  validateProjectRepository(project,config);
  const directory=safePath(project,DIRECTORY,{optional:true,directory:true});
  // Refuse a producer checkout; installation cannot replace its live Board.
  if (fs.existsSync(directory)) {
    const existing=verifyProject(project);
    if (!isDeepStrictEqual(existing.config,config)) fail('Existing project configuration differs; initialization never overwrites it');
    return {status:'preserved',...existing.receipt};
  }
  if (!/^[a-f0-9]{40}$/.test(commit ?? '') || git(source,['rev-parse','HEAD'])!==commit) fail('Exact checked-out source commit required');
  const repository=git(source,['remote','get-url','origin']);
  if (!/^(?:https:\/\/github\.com\/|git@github\.com:)[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(?:\.git)?$/.test(repository)) fail('Source requires a GitHub origin identity');
  if (git(source,['status','--porcelain'])) fail('Source must be clean and committed');
  let trackedAnswers='';
  try { trackedAnswers=git(project,['ls-files','--',`${DIRECTORY}/answers.json`]); } catch { fail('Target must be an adopted Git project'); }
  if (trackedAnswers) fail('Owner answers must never be tracked');
  const manifest=JSON.parse(fs.readFileSync(safePath(source,'workbench/manifest.json'),'utf8'));
  const payload = new Map();
  for (const [relative,bytes] of moduleClosure(source,'tools/grill-board.mjs')) payload.set(`runtime/producer/${relative}`,bytes);
  const sourcePage=fs.readFileSync(safePath(source,'workbench/grill-board/index.html'),'utf8');
  payload.set('runtime/producer/workbench/grill-board/index.html',sourcePage);
  payload.set('runtime/tools/grill-board-project.mjs',fs.readFileSync(safePath(source,'tools/grill-board-project.mjs')));
  payload.set('index.html',renderProjectPage(sourcePage,config));
  payload.set('project.json',`${JSON.stringify(config,null,2)}\n`);
  payload.set('.gitignore','/answers.json\n/answers.json.*.tmp\n');
  payload.set('README.md',fs.readFileSync(safePath(source,'workbench/docs/project-grill-board.md')));
  // Source commit proves every shipped byte, including an evaluated dependency closure.
  for (const relative of [...moduleClosure(source,'tools/grill-board.mjs').keys(),'tools/grill-board-project.mjs','workbench/grill-board/index.html','workbench/docs/project-grill-board.md']) {
    if (git(source,['ls-files','--',relative])!==relative) fail(`Untracked source ${relative}`);
    const committed=execFileSync('git',['show',`${commit}:${relative}`],{cwd:source,stdio:['ignore','pipe','pipe']});
    if (!committed.equals(fs.readFileSync(safePath(source,relative)))) fail(`Source drift ${relative}`);
  }
  const receipt={schema:RECEIPT_SCHEMA,source:{repository,commit,version:manifest.version ?? manifest.workbenchVersion ?? null},installedAt:new Date().toISOString(),files:Object.fromEntries([...payload].map(([relative,value])=>[relative,sha256(value)]))};
  const groups=config.topics.flatMap(topic=>topic.groups.map(id=>({id,title:topic.title})));
  const items={schema:'grill-board/items@1',title:config.title,integration:commit,generatedAt:new Date().toISOString(),notice:'Project review material; proposals require owner decisions and reconciliation.',groups,items:[]};
  // Validate all content before touching the target; stage beside final destination
  // and rename the complete component as one unit. No owner-answer file created.
  const stage=fs.mkdtempSync(path.join(path.dirname(directory),'.grill-board-install-'));
  try {
    for (const [relative,value] of payload) { const file=path.join(stage,relative); fs.mkdirSync(path.dirname(file),{recursive:true}); fs.writeFileSync(file,value,{flag:'wx'}); }
    fs.writeFileSync(path.join(stage,'items.json'),`${JSON.stringify(items,null,2)}\n`,{flag:'wx'});
    fs.writeFileSync(path.join(stage,'deployment.json'),`${JSON.stringify(receipt,null,2)}\n`,{flag:'wx'});
    if (fs.existsSync(directory)) fail('Board destination appeared during installation');
    fs.renameSync(stage,directory);
  } catch(error) { fs.rmSync(stage,{recursive:true,force:true}); throw error; }
  verifyProject(project);
  return {status:'initialized',...receipt};
}
export function main(argv) {
  const flags={}; const command=argv.shift();
  while(argv.length) { const flag=argv.shift(); if (!['--project','--source','--commit','--config'].includes(flag) || !argv.length || argv[0].startsWith('--') || flags[flag.slice(2)]) fail('Usage: grill-board-deploy.mjs init --project ROOT --source ROOT --commit SHA --config JSON | verify --project ROOT'); flags[flag.slice(2)]=argv.shift(); }
  if (!flags.project) fail('--project required');
  if (command==='verify') return {status:'verified',...verifyProject(flags.project).receipt};
  if (command!=='init' || !flags.source || !flags.config) fail('init requires --source --commit --config');
  const configPath=ordinaryInput(flags.config);
  return initializeProject({...flags,config:JSON.parse(fs.readFileSync(configPath,'utf8'))});
}
if (process.argv[1] && fs.realpathSync(process.argv[1])===fs.realpathSync(fileURLToPath(import.meta.url))) {
  try { console.log(JSON.stringify(main(process.argv.slice(2)),null,2)); } catch(error) {console.error(error.message);process.exitCode=1;}
}
