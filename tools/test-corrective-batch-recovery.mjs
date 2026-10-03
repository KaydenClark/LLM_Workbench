import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync, spawnSync} from 'node:child_process';

const cli = path.resolve('workbench/tools/spec-workbench.mjs');
const reportModule = path.resolve('workbench/tools/spec-report.mjs');
const cases = ['verdict-no-final-newline', 'verdict-first-task', 'verdict-second-task', 'verdict-spec', 'owner-second-task', 'narrow-second-task', 'wiki-second-task', 'verdict-directory-failure', 'verdict-rollback-interference', 'verdict-spec-interference', 'verdict-task-content-interference', 'verdict-task-replacement-interference', 'verdict-nested-interference'];
for (const scenario of cases) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'corrective-batch-recovery-'));
  try {
    const git = (...args) => execFileSync('git', ['-C', root, ...args], {encoding:'utf8'}).trim();
    const write = (name, content) => {const p=path.join(root,name);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,content);return p;};
    git('init','-q');git('config','user.name','Fixture');git('config','user.email','fixture@example.invalid');
    write('BLUEPRINT.md','# Fixture\n\n<!-- spec-catalog:start -->\n<!-- spec-catalog:end -->\n');
    write('TASKBOARD.md','# Fixture\n\n<!-- hot-specs:start -->\n<!-- hot-specs:end -->\n');
    const specPath = write('specs/S-701-fixture/SPEC.md', '# S-701 - Fixture\n\n**Spec ID:** S-701\n**Status:** active\n**Priority:** 1\n**Owner:** fixture\n**Updated:** 2026-10-01\n**Catalog description:** Fixture.\n**Blockers:** none\n**Latest event:** Fixture.\n**Next gate:** Review.\n\n## Vertical Implementation Slices\n\n| Task | Slice | Status | Blockers | Proof |\n|---|---|---|---|---|\n| TK-001 | Existing task | done | none | existing proof |\n\n## Acceptance Criteria\n\n- [x] Fixture behavior.\n\n## Append-Only Evidence And Execution Log\n\n| Date | Task | Event | Verification | Docs | Remaining gap |\n|---|---|---|---|---|---|\n| 2026-10-01 | TK-001 | Task closed | original proof | original docs | none |\n\n## Completion Result\n\nFixture delivered.\n');
    write('unrelated.txt','Unrelated bytes remain intact.\n');
    if(scenario==='verdict-no-final-newline') fs.writeFileSync(specPath,fs.readFileSync(specPath,'utf8').trimEnd());
    git('add','.');git('commit','-qm','Fixture content');const candidate=git('rev-parse','HEAD');
    const findings='First bounded defect; Second bounded defect';
    const args=['verdict','S-701','--candidate',candidate,'--result','fail','--findings',findings,'--reviewer','Disposable independent simulation'];
    let script;
    if (scenario.startsWith('owner')) args.splice(0,args.length,'approve','S-701','--candidate',candidate,'--result','finding','--finding',findings,'--owner','Disposable simulated owner');
    if (scenario.startsWith('narrow')) {
      // A pre-existing durable fail row is the narrower recovery seam's input.
      const digest=JSON.parse(spawnSync(process.execPath,[cli,'report','S-701','--candidate',candidate,'--path',root,'--json'],{encoding:'utf8'}).stdout).specDigest.slice(0,12);
      fs.writeFileSync(specPath,fs.readFileSync(specPath,'utf8').replace('## Completion Result','| 2026-10-01 | review | Review verdict: fail at '+candidate+' ['+digest+'] #1 | '+findings+' | disposable simulation | 2 |\n\n## Completion Result'));
      script=write('invoke.mjs',`import {createCorrectiveTasks} from ${JSON.stringify('file://'+reportModule)};createCorrectiveTasks(${JSON.stringify(root)},'S-701',{candidate:${JSON.stringify(candidate)},findings:${JSON.stringify(findings)}});`);
    }
    if (scenario.startsWith('wiki')) {
      write('workbench/wiki/fixture.md','# Fixture\n\n## Kept claim\n\nExisting reconciled claim.\n');
      script=write('invoke.mjs',`import {createCorrectiveTasks} from ${JSON.stringify('file://'+reportModule)};createCorrectiveTasks(${JSON.stringify(root)},'S-702',{candidate:${JSON.stringify(candidate)},findings:${JSON.stringify(findings)},wikiClaim:'workbench/wiki/fixture.md#Kept claim'});`);
    }
    const target=scenario.endsWith('first-task')?1:2;
    let injection=`if(${scenario.endsWith('spec')?"String(b).endsWith('/SPEC.md')":`String(b).endsWith('/TASK.md') && ++n===${target}`})throw Error('INJECTED_BATCH_FAILURE');`;
    if(scenario==='verdict-rollback-interference') injection="if(String(b).endsWith('/TASK.md') && ++n===2){fs.writeFileSync(require('node:path').join(require('node:path').dirname(b),'unrelated-arrival.txt'),'Preserve concurrent bytes.');throw Error('INJECTED_BATCH_FAILURE');}";
    if(scenario==='verdict-spec-interference') injection=`if(String(b).endsWith('/TASK.md') && ++n===2){fs.appendFileSync(${JSON.stringify(specPath)},'Concurrent Spec bytes.');throw Error('INJECTED_BATCH_FAILURE');}`;
    if(scenario==='verdict-task-content-interference') injection="if(String(b).endsWith('/TASK.md')){if(++n===1)global.firstTask=b;else if(n===2){fs.writeFileSync(global.firstTask,'FOREIGN TASK CONTENT');throw Error('INJECTED_BATCH_FAILURE');}}";
    if(scenario==='verdict-task-replacement-interference') injection="if(String(b).endsWith('/TASK.md')){if(++n===1)global.firstTask=b;else if(n===2){const replacement=global.firstTask+'.foreign';fs.writeFileSync(replacement,fs.readFileSync(global.firstTask));rename(replacement,global.firstTask);throw Error('INJECTED_BATCH_FAILURE');}}";
    if(scenario==='verdict-nested-interference') injection="if(String(b).endsWith('/TASK.md')){if(++n===1)global.firstTask=b;else if(n===2){const incoming=require('node:path').join(require('node:path').dirname(global.firstTask),'foreign');fs.mkdirSync(incoming);fs.writeFileSync(require('node:path').join(incoming,'keep.txt'),'Nested foreign bytes.');throw Error('INJECTED_BATCH_FAILURE');}}";
    let hookText=`const fs=require('node:fs');const rename=fs.renameSync;let n=0;fs.renameSync=function(a,b){${injection}return rename.apply(this,arguments);};`;
    if(scenario==='verdict-directory-failure') hookText="const fs=require('node:fs');const mkdir=fs.mkdirSync;let n=0;fs.mkdirSync=function(a){if(/TK-[^/]+$/.test(String(a)) && ++n===2)throw Error('INJECTED_BATCH_FAILURE');return mkdir.apply(this,arguments);};";
    const hook=write('fault.cjs',hookText);
    function tree() {
      const result={};
      function visit(dir) {for(const name of fs.readdirSync(dir).sort()){if(name==='.git')continue;const p=path.join(dir,name);const s=fs.lstatSync(p);const relative=path.relative(root,p);result[relative]=s.isDirectory()?'directory':s.isSymbolicLink()?'symlink:'+fs.readlinkSync(p):fs.readFileSync(p).toString('base64');if(s.isDirectory())visit(p);}}
      visit(root);return result;
    }
    const before=tree();
    const invoke=(fault)=>spawnSync(process.execPath,[...(fault?['--require',hook]:[]),...(script?[script]:[cli,...args,'--path',root,'--json'])],{encoding:'utf8'});
    const failed=invoke(true);assert.equal(failed.status,1,scenario+' injected failure is visible');assert.match(failed.stderr,/INJECTED_BATCH_FAILURE/);
    if(scenario.endsWith('interference')) {
      assert.match(failed.stderr,/rollback also failed|changed during corrective/,'interference reports incomplete recovery');
      assert.ok(fs.readFileSync(specPath,'utf8').includes('Review verdict: fail at '+candidate),'incomplete cleanup preserves its exact durable anchor');
      if(scenario==='verdict-rollback-interference') assert.ok(Object.entries(tree()).some(([name,value])=>name.endsWith('/unrelated-arrival.txt') && value===Buffer.from('Preserve concurrent bytes.').toString('base64')),'never recursively remove concurrently arriving bytes');
      else if(scenario==='verdict-spec-interference') assert.ok(fs.readFileSync(specPath,'utf8').endsWith('Concurrent Spec bytes.'),'never overwrite concurrent Spec edits');
      else if(scenario==='verdict-task-content-interference') assert.ok(Object.entries(tree()).some(([name,value])=>name.endsWith('/TASK.md') && value===Buffer.from('FOREIGN TASK CONTENT').toString('base64')),'never delete modified first Task bytes');
      else if(scenario==='verdict-task-replacement-interference') assert.ok(Object.keys(tree()).some(name=>name.endsWith('/TASK.md')),'never delete a replaced first Task even when bytes match');
      else if(scenario==='verdict-nested-interference') assert.ok(Object.entries(tree()).some(([name,value])=>name.endsWith('/foreign/keep.txt') && value===Buffer.from('Nested foreign bytes.').toString('base64')),'never recursively delete nested foreign files');
      assert.equal(fs.readFileSync(path.join(root,'unrelated.txt'),'utf8'),'Unrelated bytes remain intact.\n');
      console.log('ok - '+scenario+' preserves unexpected bytes and reports explicit incomplete recovery');
      continue;
    }
    assert.deepEqual(tree(),before,scenario+' rollback preserves every original file and removes only new operation artifacts');
    const retry=invoke(false);assert.equal(retry.status,0,scenario+' same supported operation retries successfully: '+retry.stderr);
    const taskRoot=path.join(root,'specs',scenario.startsWith('wiki')?'corrective':'S-701-fixture','tasks');
    const records=fs.readdirSync(taskRoot).filter(n=>fs.existsSync(path.join(taskRoot,n,'TASK.md')));
    assert.equal(records.length,2,scenario+' retry creates complete two-finding batch');
    assert.ok(fs.readFileSync(specPath,'utf8').includes('| 2026-10-01 | TK-001 | Task closed | original proof | original docs | none |'));
    console.log('ok - '+scenario+' refuses visibly, preserves original bytes and retries a complete batch');
  } finally {fs.rmSync(root,{recursive:true,force:true});}
}
