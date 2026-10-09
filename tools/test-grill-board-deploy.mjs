#!/usr/bin/env node
// Public CLI/HTTP behavior on committed, disposable source and project fixtures.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import http from 'node:http';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { once } from 'node:events';
import { initializeProject, main as deploy } from './grill-board-deploy.mjs';
import { renderProjectPage, verifyProject, createProjectServer } from './grill-board-project.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'project-board-test-'));
const source=path.join(temp,'source');fs.mkdirSync(source);
const git=(cwd,args)=>execFileSync('git',args,{cwd,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
function copy(relative, seen=new Set()) {
  if(seen.has(relative))return;seen.add(relative);
  const text=fs.readFileSync(path.join(root,relative));const target=path.join(source,relative);fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,text);
  if(relative.endsWith('.mjs'))for(const match of text.toString().matchAll(/(?:from\s+|import\s*)['"]([^'"]+)['"]/g))if(match[1].startsWith('.'))copy(path.posix.normalize(path.posix.join(path.posix.dirname(relative),match[1])),seen);
}
for(const relative of ['tools/grill-board.mjs','tools/grill-board-project.mjs','tools/grill-board-deploy.mjs','workbench/manifest.json','workbench/grill-board/index.html','workbench/docs/project-grill-board.md'])copy(relative);
git(source,['init','-q']);git(source,['config','user.name','Disposable fixture']);git(source,['config','user.email','fixture@example.invalid']);git(source,['remote','add','origin','https://github.com/KaydenClark/LLM_Workbench.git']);git(source,['add','.']);git(source,['commit','-qm','Fixture clean source']);
const commit=git(source,['rev-parse','HEAD']);
const config={schema:'grill-board/project@1',title:'Gun decisions </script><b>data</b>',repository:'https://github.com/KaydenClark/RingWorld',instance:'ringworld-guns',port:4767,topics:[{id:'guns',title:'Guns',frame:'Weapon choices </script><img src=x onerror=alert(1)>',outcome:'Approved sprites',groups:['pistol','rifle']}]};
function project(name){const directory=path.join(temp,name);fs.mkdirSync(path.join(directory,'workbench'),{recursive:true});fs.writeFileSync(path.join(directory,'workbench/manifest.json'),'{}');git(directory,['init','-q']);git(directory,['config','user.name','Fixture']);git(directory,['config','user.email','fixture@example.invalid']);git(directory,['remote','add','origin',config.repository+'.git']);return directory;}
const target=project('target');const init=directory=>initializeProject({project:directory,source,commit,config});
let count=0;const check=(name,fn)=>{fn();count++;console.log(`ok ${count} - ${name}`);};
const boardFile=(name,directory=target)=>path.join(directory,'workbench/grill-board',name);
const snapshot=directory=>{const map={};function walk(here){for(const entry of fs.readdirSync(here,{withFileTypes:true})){if(entry.name==='.git')continue;const full=path.join(here,entry.name);if(entry.isDirectory())walk(full);else map[path.relative(directory,full)]=entry.isSymbolicLink()?`link:${fs.readlinkSync(full)}`:fs.readFileSync(full).toString('base64');}}walk(directory);return map;};
const reject=(directory,fn,pattern)=>{const before=snapshot(directory);assert.throws(fn,pattern);assert.deepEqual(snapshot(directory),before);};
const input=path.join(temp,'config.json');fs.writeFileSync(input,JSON.stringify(config));
try {
  check('public initializer creates empty Board and no answers',()=>{const result=JSON.parse(execFileSync('node',[path.join(source,'tools/grill-board-deploy.mjs'),'init','--project',target,'--source',source,'--commit',commit,'--config',input],{encoding:'utf8'}));assert.equal(result.status,'initialized');assert.deepEqual(JSON.parse(fs.readFileSync(boardFile('items.json'))).items,[]);assert.ok(!fs.existsSync(boardFile('answers.json')));assert.equal(result.source.commit,commit);});
  check('repository mismatch refuses initialization without writes',()=>{
    const directory=project('wrong-repository');
    reject(directory,()=>initializeProject({project:directory,source,commit,config:{...config,repository:'https://github.com/Other/Project'}}),/repository.*origin|origin.*repository/i);
  });
  check('equivalent GitHub HTTPS and SSH origins retain project identity',()=>{
    for(const [index,origin] of ['https://github.com/kaydenclark/ringworld','https://github.com/KaydenClark/RingWorld.git/','git@github.com:KaydenClark/RingWorld.git','ssh://git@github.com/KaydenClark/RingWorld.git'].entries()){
      const directory=project(`origin-format-${index}`);git(directory,['remote','set-url','origin',origin]);
      assert.equal(init(directory).status,'initialized');verifyProject(directory);
    }
  });
  check('missing unsupported and changed origins refuse without Board mutation',()=>{
    const missing=project('missing-origin');git(missing,['remote','remove','origin']);reject(missing,()=>init(missing),/origin/i);
    for(const [index,origin] of ['/local/clone','https://example.invalid/KaydenClark/RingWorld.git','https://github.com/Other/Project.git'].entries()){
      const directory=project(`invalid-origin-${index}`);git(directory,['remote','set-url','origin',origin]);reject(directory,()=>init(directory),/origin/i);
    }
    const before=snapshot(target);git(target,['remote','set-url','origin','git@github.com:Other/Project.git']);
    try {
      assert.throws(()=>verifyProject(target),/origin/i);
      assert.throws(()=>createProjectServer(target),/origin/i);
      assert.throws(()=>init(target),/origin/i);
      const result=spawnSync('node',[boardFile('runtime/tools/grill-board-project.mjs'),'status','--path',target,'--json'],{encoding:'utf8'});
      assert.notEqual(result.status,0);assert.match(result.stderr,/origin/i);assert.deepEqual(snapshot(target),before);
    } finally {git(target,['remote','set-url','origin',config.repository+'.git']);}
  });
  check('initializer rejects linked configuration ancestors before target writes',()=>{
    const inputs=path.join(temp,'config-inputs');fs.mkdirSync(inputs);fs.writeFileSync(path.join(inputs,'config.json'),JSON.stringify(config));
    const linkedParent=path.join(temp,'config-parent-link');fs.symlinkSync(inputs,linkedParent);
    const directory=project('linked-config-target');
    reject(directory,()=>deploy(['init','--project',directory,'--source',source,'--commit',commit,'--config',path.join(linkedParent,'config.json')]),/Unsafe/);
    const linkedLeaf=path.join(temp,'config-leaf-link');fs.symlinkSync(path.join(inputs,'config.json'),linkedLeaf);
    reject(directory,()=>deploy(['init','--project',directory,'--source',source,'--commit',commit,'--config',linkedLeaf]),/Unsafe/);
  });
  check('receipt verifies source identity, hashes, configured rendering',()=>{const {receipt}=verifyProject(target);assert.equal(receipt.source.repository,'https://github.com/KaydenClark/LLM_Workbench.git');assert.ok(Object.keys(receipt.files).length>=10);const page=fs.readFileSync(boardFile('index.html'),'utf8');assert.match(page,/Gun decisions &lt;\/script&gt;/);assert.ok(!page.includes('topic.numbers'));assert.ok(!page.includes('GB-0180'));assert.ok(page.includes('grill-board:ringworld-guns:batch'));assert.ok(page.includes('grill-board:ringworld-guns:theme'));assert.ok(page.includes('\\u003c/script\\u003e'));assert.ok(!page.includes('what the Workbench is'));});
  const runtime=boardFile('runtime/tools/grill-board-project.mjs');
  const cli=args=>execFileSync('node',[runtime,...args,'--path',target],{encoding:'utf8'});
  const namedTexts={
    'workbench/specs/S-FIX-guns/SPEC.md':'# Gun capability\nCurrent requirements',
    'workbench/specs/S-FIX-guns/tasks/TK-FIX/TASK.md':'# Pistol correction\nCurrent task context',
    'workbench/wiki/gun-context.md':'# Gun knowledge\nCurrent project context'
  };
  const adoptedManifest={schemaVersion:2,workbenchVersion:'v3.2.1',lanes:{docs:'workbench/docs',specs:'workbench/specs',wiki:'workbench/wiki',sessions:'workbench/sessions',feedback:'workbench/feedback',tools:'workbench/tools',skills:'workbench/skills'},collections:{adr:'workbench/docs/adr',ddr:'workbench/docs/ddr','design-concepts':'workbench/wiki/design-concepts',features:'workbench/wiki/features',guidebooks:'workbench/wiki/guidebooks',archive:'workbench/wiki/archive'},wiki:{profile:'project'}};
  fs.writeFileSync(path.join(target,'workbench/manifest.json'),JSON.stringify(adoptedManifest));
  for(const [relative,text] of Object.entries(namedTexts)){const file=path.join(target,relative);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,text);}
  for(const collection of ['workbench/docs/adr','workbench/docs/ddr'])fs.mkdirSync(path.join(target,collection),{recursive:true});
  const incoming=path.join(temp,'incoming.json');fs.writeFileSync(incoming,JSON.stringify([{key:'pistol-sizing',group:'pistol',kind:'choice',title:'Pistol art',question:'Approve this art?',current:'Original art',proposal:'Corrected candidate',draft:'# Draft\n<img src=x onerror=alert(1)>',sources:[{label:'Gun context',path:'GUNS.md',ref:commit},{label:'Draft file',path:'DRAFT.md',ref:'untracked'},...Object.keys(namedTexts).map(relative=>({label:relative,path:relative,ref:'untracked'}))],tags:[]}]));
  fs.writeFileSync(path.join(target,'GUNS.md'),'# Current gun context\nSilver pistol');fs.writeFileSync(path.join(target,'DRAFT.md'),'# Draft only\nNo approval yet');
  check('installed add/status CLI reuses protocol including symlink entry',()=>{cli(['add','--file',incoming,'--by','fixture']);const link=path.join(temp,'project-board-link.mjs');fs.symlinkSync(runtime,link);const status=JSON.parse(execFileSync('node',[link,'status','--path',target,'--json'],{encoding:'utf8'}));assert.equal(status.total,1);});
  check('show JSON and structured text use configured project source links',()=>{for(const args of [['show','GB-0001','--json'],['show','GB-0001']]){const output=cli(args);const item=JSON.parse(output);assert.equal(item.links[0].url,`${config.repository}/blob/${commit}/GUNS.md`);assert.equal(item.links[1].url,null);assert.ok(!output.includes('https://github.com/KaydenClark/LLM_Workbench/blob/'));}});
  check('read commands retain producer path precedence and missing-id errors',()=>{const alias=path.join(temp,'cli-target-link');fs.symlinkSync(target,alias);const result=JSON.parse(execFileSync('node',[runtime,'show','--path',alias,'--path',target,'GB-0001','--json'],{encoding:'utf8'}));assert.equal(result.id,'GB-0001');assert.notEqual(spawnSync('node',[runtime,'show','GB-0001','--path',target,'--path',alias]).status,0);assert.notEqual(spawnSync('node',[runtime,'show','--path',target]).status,0);assert.notEqual(spawnSync('node',[runtime,'show','GB-9999','--path',target]).status,0);});
  check('effective final duplicate input flags reject linked files and parents without mutation',()=>{
    const inputs=path.join(temp,'duplicate-inputs');fs.mkdirSync(inputs);
    const content={
      '--file':JSON.stringify([{key:'duplicate-guard',group:'pistol',kind:'choice',title:'New item',question:'Question?',current:'Current',proposal:'Proposal',sources:[],tags:[]}]),
      '--draft-file':'# Exact draft',
      '--options-file':JSON.stringify([{value:'confirm',label:'Confirm'}]),
      '--brief-file':JSON.stringify({scope:'TASK',summary:'Summary',why:'Why',recommendation:'Recommendation',impact:'Impact',changes:'Changes',history:'History',artifacts:'Artifacts'})
    };
    for(const [flag,text] of Object.entries(content)){
      const ordinary=path.join(inputs,flag.slice(2));fs.writeFileSync(ordinary,text);
      const leaf=ordinary+'.link';fs.symlinkSync(ordinary,leaf);
      const parent=ordinary+'.parent';fs.symlinkSync(inputs,parent);
      for(const linked of [leaf,path.join(parent,flag.slice(2))]){
        const args=flag==='--file'?['add']:['revise','GB-0001','--reason','Guard test'];
        const before=snapshot(target);
        const result=spawnSync('node',[runtime,...args,flag,ordinary,flag,linked,'--by','fixture','--path',target],{encoding:'utf8'});
        assert.notEqual(result.status,0,`${flag}: unvalidated final input was accepted`);
        assert.match(result.stderr,/Unsafe/);assert.deepEqual(snapshot(target),before);
      }
    }
  });
  check('ordinary duplicate input flags use the effective final value',()=>{
    const repeated=project('ordinary-repeated');init(repeated);
    const run=args=>execFileSync('node',[boardFile('runtime/tools/grill-board-project.mjs',repeated),...args,'--path',repeated,'--by','fixture'],{encoding:'utf8'});
    const first=path.join(temp,'ordinary-first.json'),last=path.join(temp,'ordinary-last.json');
    const item={key:'last-value',group:'pistol',kind:'choice',title:'Final title',question:'Final question?',current:'Current',proposal:'Proposal',sources:[],tags:[]};
    fs.writeFileSync(first,JSON.stringify([{...item,key:'ignored-value'}]));fs.writeFileSync(last,JSON.stringify([item]));run(['add','--file',first,'--file',last]);
    assert.equal(JSON.parse(fs.readFileSync(boardFile('items.json',repeated))).items[0].key,'last-value');
    const content={
      '--draft-file':['First draft','Final draft'],
      '--options-file':[JSON.stringify([{value:'decline',label:'First'}]),JSON.stringify([{value:'confirm',label:'Final'}])],
      '--brief-file':[JSON.stringify({scope:'TASK',summary:'First',why:'Why',recommendation:'Recommendation',impact:'Impact',changes:'Changes',history:'History',artifacts:'Artifacts'}),JSON.stringify({scope:'TASK',summary:'Final',why:'Why',recommendation:'Recommendation',impact:'Impact',changes:'Changes',history:'History',artifacts:'Artifacts'})]
    };
    for(const [flag,texts] of Object.entries(content)){fs.writeFileSync(first,texts[0]);fs.writeFileSync(last,texts[1]);run(['revise','GB-0001','--reason','Effective final input',flag,first,flag,last]);}
    const updated=JSON.parse(fs.readFileSync(boardFile('items.json',repeated))).items[0];assert.equal(updated.draft,'Final draft');assert.equal(updated.options[0].label,'Final');assert.equal(updated.brief.summary,'Final');
  });
  check('literal configuration dollar tokens survive initialization and script serialization',()=>{
    const literalConfig={...config,title:"Project $& $` $' decisions",instance:'literal-config',topics:[{...config.topics[0],title:"Guns $& $` $'",frame:"Think $& $` $' literally",outcome:"Keep $& $` $' as data"}]};
    const literalProject=project('literal-config');
    initializeProject({project:literalProject,source,commit,config:literalConfig});
    const html=fs.readFileSync(boardFile('index.html',literalProject),'utf8');
    assert.ok(html.includes("<title>Project $&amp; $` $&#39; decisions · Grill Board</title>"));
    assert.ok(html.includes("<strong>Project $&amp; $` $&#39; decisions</strong>"));
    assert.equal((html.match(/const TOPICS =/g)||[]).length,1);
    const topics=JSON.parse(html.match(/  const TOPICS = (.*);/)[1]);
    assert.deepEqual(topics[0],literalConfig.topics[0]);
  });
  check('linked CLI inputs refuse without altering Board',()=>{const linked=path.join(temp,'linked-input.json');fs.symlinkSync(incoming,linked);const before=snapshot(target);assert.throws(()=>cli(['add','--file',linked,'--by','fixture']),/Unsafe/);assert.deepEqual(snapshot(target),before);});
  let server=createProjectServer(target);server.listen(0,'127.0.0.1');await once(server,'listening');const port=server.address().port;const base=`http://127.0.0.1:${port}`;
  const fetchJson=async(route,options)=>{const response=await fetch(base+route,options);return{response,body:await response.json()};};
  let result=await fetchJson('/api/board');assert.equal(result.body.title,config.title);assert.equal(result.body.items[0].links[0].url,`${config.repository}/blob/${commit}/GUNS.md`);assert.equal(result.body.items[0].links[1].url,null);count++;console.log(`ok ${count} - configured repository links and project title via HTTP`);
  for(const file of ['GUNS.md','DRAFT.md']){result=await fetchJson(`/api/file?path=${file}`);assert.equal(result.response.status,200);assert.equal(result.body.text,fs.readFileSync(path.join(target,file),'utf8'));}count++;console.log(`ok ${count} - named current context and draft sources retain exact text`);
  let answer=await fetchJson('/api/answers/GB-0001',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({verdict:'correct',note:'Owner exact words',itemRevision:1})});assert.equal(answer.response.status,200);
  answer=await fetchJson('/api/answers/GB-0001',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({verdict:'confirm',note:'Owner confirms after review',itemRevision:1})});assert.equal(answer.body.history[0].note,'Owner exact words');count++;console.log(`ok ${count} - owner answers and edit history saved only through HTTP`);
  check('pending JSON retains owner words and configured project links',()=>{const output=cli(['pending','--json']);const pending=JSON.parse(output);assert.equal(pending[0].note,'Owner confirms after review');assert.equal(pending[0].sources[0].ref,commit);assert.equal(pending[0].links[0].url,`${config.repository}/blob/${commit}/GUNS.md`);assert.equal(pending[0].links[1].url,null);assert.ok(!output.includes('https://github.com/KaydenClark/LLM_Workbench/blob/'));assert.match(cli(['pending']),/GB-0001.*Confirm/);});
  check('reinitialization preserves questions answers and config byte for byte',()=>{const before=snapshot(target);assert.equal(init(target).status,'preserved');assert.deepEqual(snapshot(target),before);});
  check('reordered configuration object keys preserve every installed byte',()=>{
    const reordered=Object.fromEntries(Object.entries(config).reverse());
    reordered.topics=config.topics.map(topic=>Object.fromEntries(Object.entries(topic).reverse()));
    const reorderedInput=path.join(temp,'reordered-config.json');fs.writeFileSync(reorderedInput,JSON.stringify(reordered));
    const before=snapshot(target);
    const result=deploy(['init','--project',target,'--source',source,'--commit',commit,'--config',reorderedInput]);
    assert.equal(result.status,'preserved');assert.deepEqual(snapshot(target),before);
    reject(target,()=>initializeProject({project:target,source,commit,config:{...config,topics:[{...config.topics[0],groups:[...config.topics[0].groups].reverse()}]}}),/configuration differs/);
  });
  check('answers are ignored and no answer CLI exists',()=>{assert.equal(git(target,['check-ignore','workbench/grill-board/answers.json']),'workbench/grill-board/answers.json');assert.equal(git(target,['ls-files','workbench/grill-board/answers.json']),'');assert.notEqual(spawnSync('node',[runtime,'answer','GB-0001','--path',target]).status,0);});
  check('revision invalidates answer and stale apply refuses preserving owner file',()=>{const before=fs.readFileSync(boardFile('answers.json'));cli(['revise','GB-0001','--question','New approved question?','--by','fixture','--reason','New evidence']);assert.equal(JSON.parse(cli(['show','GB-0001','--json'])).derivedStatus,'stale');assert.throws(()=>cli(['apply','GB-0001','--by','fixture','--where','GUNS.md']),/stale|older|revision/);assert.ok(fs.readFileSync(boardFile('answers.json')).equals(before));});
  result=await fetchJson('/api/answers/GB-0001',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({verdict:'confirm',note:'Second revision confirmed',itemRevision:1})});assert.equal(result.response.status,409);count++;console.log(`ok ${count} - HTTP refuses stale item revision`);
  await fetchJson('/api/answers/GB-0001',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({verdict:'confirm',note:'Second revision confirmed',itemRevision:2})});
  check('fresh confirm can apply with exact owner words',()=>{cli(['apply','GB-0001','--by','fixture','--where','GUNS.md']);const item=JSON.parse(cli(['show','GB-0001','--json']));assert.equal(item.derivedStatus,'applied');assert.equal(item.applied.note,'Second revision confirmed');});
  result=await fetchJson('/api/answers/GB-0001',{method:'PUT',headers:{'content-type':'application/json',origin:'https://evil.invalid'},body:JSON.stringify({verdict:'decline',note:'Attack',itemRevision:2})});assert.equal(result.response.status,400);const hostStatus=await new Promise((resolve,reject)=>{const request=http.get(base+'/api/board',{headers:{host:`evil.invalid:${port}`}},response=>{response.resume();resolve(response.statusCode);});request.on('error',reject);});assert.equal(hostStatus,400);count++;console.log(`ok ${count} - foreign Origin and Host refused`);
  for(const file of ['../outside.md','workbench/grill-board/answers.json','.git/config','NOT-NAMED.md']){result=await fetchJson(`/api/file?path=${encodeURIComponent(file)}`);assert.equal(result.response.status,400);}count++;console.log(`ok ${count} - unnamed private and escaping sources refused`);
  const tmpWrite=boardFile(`answers.json.${process.pid}.tmp`);fs.writeFileSync(tmpWrite,'Existing work');
  const beforeAnswer=fs.readFileSync(boardFile('answers.json'));
  result=await fetchJson('/api/answers/GB-0001',{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify({verdict:'decline',note:'Never written',itemRevision:2})});assert.equal(result.response.status,400);assert.ok(fs.readFileSync(boardFile('answers.json')).equals(beforeAnswer));assert.equal(fs.readFileSync(tmpWrite,'utf8'),'Existing work');fs.unlinkSync(tmpWrite);count++;console.log(`ok ${count} - predictable temporary write collisions preserve answers and existing work`);
  await new Promise(resolve=>server.close(resolve));
  check('modified managed bytes refuse repeat without mutation',()=>{const page=boardFile('index.html');const saved=fs.readFileSync(page);fs.appendFileSync(page,'tamper');reject(target,()=>init(target),/drift/);fs.writeFileSync(page,saved);});
  check('configuration change refuses without overwriting owner content',()=>reject(target,()=>initializeProject({project:target,source,commit,config:{...config,title:'Other title'}}),/configuration differs/));
  check('malformed configuration refuses before any writes',()=>{for(const bad of [{...config,port:0},{...config,repository:'javascript:evil'},{...config,instance:'bad/key'},{...config,topics:[]},{...config,extra:true}]){const directory=project(`invalid-${count}-${Math.random()}`);reject(directory,()=>initializeProject({project:directory,source,commit,config:bad}),/Configuration|configuration|port|Repository|instance|topics|Unknown|Unique|One/);}});
  check('producer page seam drift refuses fail closed',()=>assert.throws(()=>renderProjectPage(fs.readFileSync(path.join(source,'workbench/grill-board/index.html'),'utf8').replace('  const TOPICS = [','  const TOPICS_CHANGED = ['),config),/seam/));
  check('unpinned dirty source refuses before target writes',()=>{const directory=project('dirty-target');fs.writeFileSync(path.join(source,'untracked'),'dirty');reject(directory,()=>init(directory),/clean/);fs.unlinkSync(path.join(source,'untracked'));reject(directory,()=>initializeProject({project:directory,source,commit:'0'.repeat(40),config}),/Exact/);});
  check('ordinary file and directory collisions preserved',()=>{for(const directoryCollision of [true,false]){const directory=project(`collision-${directoryCollision}`);const dest=boardFile('',directory);if(directoryCollision){fs.mkdirSync(dest);fs.writeFileSync(path.join(dest,'items.json'),'owner content');}else fs.writeFileSync(dest,'owner content');reject(directory,()=>init(directory),/ENOENT|Unsafe|file|directory/);}});
  check('symlink Board/root/ancestor and hardlinked protected files refused',()=>{const outside=path.join(temp,'outside');fs.mkdirSync(outside);const directory=project('linked-target');fs.symlinkSync(outside,boardFile('',directory));reject(directory,()=>init(directory),/Unsafe/);const rootLink=path.join(temp,'root-link');fs.symlinkSync(target,rootLink);assert.throws(()=>init(rootLink),/Unsafe/);const directory2=project('ancestor-link');fs.rmSync(path.join(directory2,'workbench'),{recursive:true});fs.symlinkSync(path.join(target,'workbench'),path.join(directory2,'workbench'));assert.throws(()=>init(directory2),/Unsafe/);const answers=boardFile('answers.json');const linked=path.join(temp,'linked-answer');fs.linkSync(answers,linked);assert.throws(()=>verifyProject(target),/Unsafe/);fs.unlinkSync(linked);});
  check('linked project parent and forced tracked answers refused',()=>{const alias=path.join(temp,'parent-alias');fs.symlinkSync(temp,alias);assert.throws(()=>verifyProject(path.join(alias,'target')),/Unsafe/);git(target,['add','-f','workbench/grill-board/answers.json']);assert.throws(()=>verifyProject(target),/never be tracked/);git(target,['rm','--cached','-q','workbench/grill-board/answers.json']);});
  check('receipt and unsafe relative entry refuse without writes',()=>{const file=boardFile('deployment.json');const saved=fs.readFileSync(file);const receipt=JSON.parse(saved);receipt.files['../escape']='a'.repeat(64);fs.writeFileSync(file,JSON.stringify(receipt));reject(target,()=>init(target),/Unsafe/);fs.writeFileSync(file,saved);});
  check('clean clone retains executable component but no local answers',()=>{git(target,['add','.']);git(target,['commit','-qm','Project Board fixture']);const cloned=path.join(temp,'clone');git(temp,['clone','-q','--no-hardlinks',target,cloned]);git(cloned,['remote','set-url','origin',config.repository+'.git']);assert.ok(!fs.existsSync(boardFile('answers.json',cloned)));verifyProject(cloned);fs.renameSync(source,path.join(temp,'source-hidden'));const status=JSON.parse(execFileSync('node',[boardFile('runtime/tools/grill-board-project.mjs',cloned),'status','--path',cloned,'--json'],{encoding:'utf8'}));assert.equal(status.total,1);fs.renameSync(path.join(temp,'source-hidden'),source);});
  const cloned=path.join(temp,'clone');
  fs.renameSync(source,path.join(temp,'source-hidden'));
  const installed=await import(pathToFileURL(boardFile('runtime/tools/grill-board-project.mjs',cloned)));
  const clonedServer=installed.createProjectServer(cloned);clonedServer.listen(0,'127.0.0.1');await once(clonedServer,'listening');
  try{
    const clonedBase=`http://127.0.0.1:${clonedServer.address().port}`;
    for(const [relative,text] of Object.entries(namedTexts)){
      const response=await fetch(`${clonedBase}/api/file?path=${encodeURIComponent(relative)}`);assert.equal(response.status,200);assert.equal((await response.json()).text,text);
    }
    const artifacts=await fetch(`${clonedBase}/api/artifacts`);assert.equal(artifacts.status,200);
    assert.ok(!fs.existsSync(boardFile('answers.json',cloned)));count++;console.log(`ok ${count} - clean cloned HTTP runtime reads named Spec Task and Wiki sources without producer checkout`);
  }finally{await new Promise(resolve=>clonedServer.close(resolve));fs.renameSync(path.join(temp,'source-hidden'),source);}
  console.log(`${count} optional project Board checks passed`);
} finally {fs.rmSync(temp,{recursive:true,force:true});}
