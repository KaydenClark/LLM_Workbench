import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {assembleSpecReport,recordReviewVerdict} from '../workbench/tools/spec-report.mjs';
import {gate} from '../workbench/tools/spec-workbench.mjs';
const root=fs.mkdtempSync(path.join(os.tmpdir(),'verdict-git-reads-'));
const peer=fs.mkdtempSync(path.join(os.tmpdir(),'verdict-git-peer-'));
const file=path.join(root,'specs/S-701-fixture/SPEC.md');
const cli=path.resolve('workbench/tools/spec-workbench.mjs');
const git=(dir,...args)=>execFileSync('git',['-C',dir,...args],{encoding:'utf8'}).trim();
const spec=['# S-701 - Git reader fixture','','**Spec ID:** S-701','**Status:** active','**Priority:** 1','**Owner:** fixture','**Updated:** 2026-10-01','**Catalog description:** Disposable fixture.','**Blockers:** none','**Latest event:** Fixture.','**Next gate:** Review.','','## Vertical Implementation Slices','','| Task | Slice | Status | Blockers | Proof |','|---|---|---|---|---|','| TK-001 | Fixture | done | none | fixture |','','## Acceptance Criteria','','- [x] Original committed acceptance.','','## Append-Only Evidence And Execution Log','','| Date | Task | Event | Verification | Docs | Remaining gap |','|---|---|---|---|---|---|','| 2026-10-01 | TK-001 | Task closed | Fixture proof | none | none |','','## Completion Result','','Disposable fixture delivered.',''].join('\n');
function refusal(empty,label){
 const before=fs.readFileSync(file,'utf8');
 const report=assembleSpecReport(root,'S-701',{candidate:empty});
 assert.equal(report.candidate.matchesContent,false,`${label}: actual empty object must not acquire peer Spec bytes`);
 for(const result of ['pass','fail']){
  const r=spawnSync('node',[cli,'verdict','S-701','--candidate',empty,'--result',result,'--findings',result==='pass'?'none':'Synthetic defect','--reviewer','separate fixture context','--path',root,'--json'],{encoding:'utf8'});
  assert.equal(r.status,1,`${label}: public ${result} must refuse`);
  assert.equal(fs.readFileSync(file,'utf8'),before,`${label}: every Spec byte unchanged`);
  assert.equal(fs.existsSync(path.join(root,'specs/S-701-fixture/tasks')),false,`${label}: no corrective Tasks`);
 }
 assert.equal(gate(root,{spec:'S-701',candidate:empty}).refused,true,`${label}: gate refuses replacement candidate`);
}
const saved=Object.fromEntries(Object.entries(process.env).filter(([key])=>key.startsWith('GIT_')));
try{
 git(root,'init','-q');git(root,'config','user.name','Fixture');git(root,'config','user.email','fixture@example.invalid');
 git(root,'commit','--allow-empty','-qm','Empty candidate');const empty=git(root,'rev-parse','HEAD');
 fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,spec);git(root,'add','.');git(root,'commit','-qm','Actual Spec candidate');const good=git(root,'rev-parse','HEAD');
 recordReviewVerdict(root,'S-701',{candidate:good,result:'pass',findings:'none',reviewer:'separate fixture context'});
 git(root,'replace',empty,good);refusal(empty,'Git replacement ref');git(root,'replace','-d',empty);
 git(peer,'clone','--no-hardlinks',root,'.');git(peer,'replace',empty,good);
 process.env.GIT_DIR=path.join(peer,'.git');process.env.GIT_WORK_TREE=peer;refusal(empty,'Inherited peer selectors');
 for(const key of Object.keys(process.env))if(key.startsWith('GIT_'))delete process.env[key];
 assert.equal(assembleSpecReport(root,'S-701',{candidate:good}).candidate.matchesContent,true,'ordinary local committed reads still work');
 console.log('ok - replacement objects and inherited Git selectors cannot substitute named candidate bytes; PASS/FAIL/gate refuse without writes');
}finally{
 for(const key of Object.keys(process.env))if(key.startsWith('GIT_'))delete process.env[key];Object.assign(process.env,saved);
 fs.rmSync(root,{recursive:true,force:true});fs.rmSync(peer,{recursive:true,force:true});
}
