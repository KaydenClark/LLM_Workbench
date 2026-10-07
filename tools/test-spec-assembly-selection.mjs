import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
const rootPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cli = path.join(rootPath, 'workbench/tools/spec-workbench.mjs');
function fixture(states=['ready','ready'],blockers=['none','none']) {
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'assembly-task-selection-'));
 const spec=path.join(root,'specs/S-100-assembly');fs.mkdirSync(spec,{recursive:true});
 fs.writeFileSync(path.join(spec,'SPEC.md'),'# S-100 - Assembly\n\n**Spec ID:** S-100\n**Status:** active\n**Priority:** 1\n**Owner:** fixture\n**Updated:** 2026-10-06\n**Catalog description:** Exercise exact Task selection.\n**Blockers:** none\n**Latest event:** Fixture activated.\n**Next gate:** Claim a Task.\n\n## Outcome\n\nAssembly.\n\n## Acceptance Criteria\n\n- [ ] Both Tasks work.\n\n## Append-Only Evidence And Execution Log\n\n| Date | Task | Event | Evidence | Docs | Remaining gap |\n|---|---|---|---|---|---|\n\n## Completion Result\n\nNot complete.\n');
 states.forEach((status,i)=>{const id=`TK-00${i?'B':'A'}`;const dir=path.join(spec,'tasks',id);fs.mkdirSync(dir,{recursive:true});fs.writeFileSync(path.join(dir,'TASK.md'),`# ${id} - Slice ${i}\n\n**Task ID:** ${id}\n**Spec ID:** S-100\n**Slice:** Slice ${i}\n**Status:** ${status}\n**Stance:** Builder\n**Blockers:** ${blockers[i]}\n**Destination:** spec-acceptance: Both Tasks work.\n`);});
 for(const args of [['init','--quiet'],['config','user.name','Fixture'],['config','user.email','fixture@example.invalid'],['add','.'],['commit','--quiet','-m','Fixture']]){const p=spawnSync('git',args,{cwd:root,encoding:'utf8'});assert.equal(p.status,0,p.stderr);}
 const bytes=()=>[fs.readFileSync(path.join(spec,'SPEC.md'),'utf8'),...['A','B'].map(x=>fs.readFileSync(path.join(spec,`tasks/TK-00${x}/TASK.md`),'utf8'))];
 return {root,bytes,run:(...args)=>spawnSync(process.execPath,[cli,...args,'--path',root,'--json'],{encoding:'utf8'}),clean:()=>fs.rmSync(root,{recursive:true,force:true})};
}
test('claim explicitly selects the second eligible Task without touching the first',()=>{const f=fixture();try{const before=f.bytes();const r=f.run('claim','S-100','--task','TK-00B','--agent','worker','--local');assert.equal(r.status,0,r.stderr);assert.equal(f.bytes()[1],before[1]);assert.match(f.bytes()[2],/Status:\*\* in-progress/);}finally{f.clean();}});
test('unknown or blocked targeted claim never falls through to another ready Task',()=>{for(const target of ['TK-00Z','TK-00B']){const f=fixture(['ready','ready'],['none','TK-00A']);try{const before=f.bytes();const r=f.run('claim','S-100','--task',target,'--agent','worker','--local');assert.notEqual(r.status,0);assert.deepEqual(f.bytes(),before);}finally{f.clean();}}});
test('close explicitly completes the second claim and keeps the first untouched',()=>{const f=fixture(['in-progress','in-progress']);try{const before=f.bytes();const r=f.run('close','S-100','--task','TK-00B','--proof','second behavior verified','--docs','checked','--remaining-gap','none','--git-state-reason','Local test fixture has no publication remote');assert.equal(r.status,0,r.stderr);assert.equal(f.bytes()[1],before[1]);assert.match(f.bytes()[2],/Status:\*\* done/);assert.match(f.bytes()[2],/second behavior verified/);}finally{f.clean();}});
test('unknown or unclaimed targeted close never closes another active Task',()=>{for(const target of ['TK-00Z','TK-00B']){const f=fixture(['in-progress','ready']);try{const before=f.bytes();const r=f.run('close','S-100','--task',target,'--proof','verified','--docs','checked','--remaining-gap','none','--git-state-reason','Local test fixture has no publication remote');assert.notEqual(r.status,0);assert.deepEqual(f.bytes(),before);}finally{f.clean();}}});
test('omitting task preserves first-eligible claim and first-active close',()=>{const f=fixture();try{let r=f.run('claim','S-100','--agent','worker','--local');assert.equal(r.status,0,r.stderr);assert.match(f.bytes()[1],/Status:\*\* in-progress/);r=f.run('close','S-100','--proof','first behavior verified','--docs','checked','--remaining-gap','none','--git-state-reason','Local test fixture has no publication remote');assert.equal(r.status,0,r.stderr);assert.match(f.bytes()[1],/Status:\*\* done/);assert.match(f.bytes()[2],/Status:\*\* ready/);}finally{f.clean();}});
