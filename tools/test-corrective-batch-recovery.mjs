import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync, spawnSync} from 'node:child_process';

const cli = path.resolve('workbench/tools/spec-workbench.mjs');
const reportModule = path.resolve('workbench/tools/spec-report.mjs');
const cases = ['verdict-first-task', 'verdict-second-task', 'verdict-spec', 'owner-second-task', 'narrow-second-task', 'wiki-second-task'];
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
    git('add','.');git('commit','-qm','Fixture content');const candidate=git('rev-parse','HEAD');
    const findings='First bounded defect; Second bounded defect';
    const args=['verdict','S-701','--candidate',candidate,'--result','fail','--findings',findings,'--reviewer','Disposable independent simulation'];
    let script;
    if (scenario.startsWith('owner')) args.splice(0,args.length,'approve','S-701','--candidate',candidate,'--result','finding','--findings',findings,'--owner','Disposable simulated owner');
    if (scenario.startsWith('narrow')) {
      // A pre-existing durable fail row is the narrower recovery seam's input.
      fs.appendFileSync(specPath,'\n| 2026-10-01 | review | Review verdict: fail at '+candidate+' [fixture] #1 | '+findings+' | disposable simulation | 2 |\n');
      script=write('invoke.mjs',`import {createCorrectiveTasks} from ${JSON.stringify('file://'+reportModule)};createCorrectiveTasks(${JSON.stringify(root)},'S-701',{candidate:${JSON.stringify(candidate)},findings:${JSON.stringify(findings)}});`);
    }
    if (scenario.startsWith('wiki')) {
      write('wiki/fixture.md','# Fixture\n\n## Kept claim\n\nExisting reconciled claim.\n');
      script=write('invoke.mjs',`import {createCorrectiveTasks} from ${JSON.stringify('file://'+reportModule)};createCorrectiveTasks(${JSON.stringify(root)},'S-702',{candidate:${JSON.stringify(candidate)},findings:${JSON.stringify(findings)},wikiClaim:'wiki/fixture.md#Kept claim'});`);
    }
    const target=scenario.endsWith('first-task')?1:2;
    const hook=write('fault.cjs', `const fs=require('node:fs');const rename=fs.renameSync;let n=0;fs.renameSync=function(a,b){if(${scenario.endsWith('spec')?"String(b).endsWith('/SPEC.md')":`String(b).endsWith('/TASK.md') && ++n===${target}`})throw Error('INJECTED_BATCH_FAILURE');return rename.apply(this,arguments);};`);
    function tree() {
      const result={};
      function visit(dir) {for(const name of fs.readdirSync(dir).sort()){if(name==='.git')continue;const p=path.join(dir,name);const s=fs.lstatSync(p);const relative=path.relative(root,p);result[relative]=s.isDirectory()?'directory':s.isSymbolicLink()?'symlink:'+fs.readlinkSync(p):fs.readFileSync(p).toString('base64');if(s.isDirectory())visit(p);}}
      visit(root);return result;
    }
    const before=tree();
    const invoke=(fault)=>spawnSync(process.execPath,[...(fault?['--require',hook]:[]),...(script?[script]:[cli,...args,'--path',root,'--json'])],{encoding:'utf8'});
    const failed=invoke(true);assert.equal(failed.status,1,scenario+' injected failure is visible');assert.match(failed.stderr,/INJECTED_BATCH_FAILURE/);
    assert.deepEqual(tree(),before,scenario+' rollback preserves every original file and removes only new operation artifacts');
    const retry=invoke(false);assert.equal(retry.status,0,scenario+' same supported operation retries successfully: '+retry.stderr);
    const taskRoot=path.join(root,'specs',scenario.startsWith('wiki')?'corrective':'S-701-fixture','tasks');
    const records=fs.readdirSync(taskRoot).filter(n=>fs.existsSync(path.join(taskRoot,n,'TASK.md')));
    assert.equal(records.length,2,scenario+' retry creates complete two-finding batch');
    assert.ok(fs.readFileSync(specPath,'utf8').includes('| 2026-10-01 | TK-001 | Task closed | original proof | original docs | none |'));
    console.log('ok - '+scenario+' refuses visibly, preserves original bytes and retries a complete batch');
  } finally {fs.rmSync(root,{recursive:true,force:true});}
}
