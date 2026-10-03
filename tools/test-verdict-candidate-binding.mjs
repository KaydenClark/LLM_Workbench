import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync,spawnSync} from 'node:child_process';
import {assembleSpecReport,recordReviewVerdict} from '../workbench/tools/spec-report.mjs';
import {gate} from '../workbench/tools/spec-workbench.mjs';

const cli=path.resolve('workbench/tools/spec-workbench.mjs');
const root=fs.mkdtempSync(path.join(os.tmpdir(),'verdict-candidate-binding-'));
const file=path.join(root,'specs/S-701-fixture/SPEC.md');
function git(...args){return execFileSync('git',['-C',root,...args],{encoding:'utf8'}).trim();}
function commit(){git('add','.');git('commit','-qm','Fixture candidate');return git('rev-parse','HEAD');}
function invoke(...args){return spawnSync('node',[cli,...args,'--path',root,'--json'],{encoding:'utf8'});}
const spec=['# S-701 - Candidate binding fixture','','**Spec ID:** S-701','**Status:** active','**Priority:** 1','**Owner:** fixture','**Updated:** 2026-10-01','**Catalog description:** Disposable fixture.','**Blockers:** none','**Latest event:** Fixture.','**Next gate:** Review.','','## Vertical Implementation Slices','','| Task | Slice | Status | Blockers | Proof |','|---|---|---|---|---|','| TK-001 | Fixture | done | none | fixture |','','## Acceptance Criteria','','- [x] Original committed acceptance.','','## Append-Only Evidence And Execution Log','','| Date | Task | Event | Verification | Docs | Remaining gap |','|---|---|---|---|---|---|','| 2026-10-01 | TK-001 | Task closed | Fixture proof | none | none |','','## Completion Result','','Disposable fixture delivered.',''].join('\n');
try {
  git('init','-q');git('config','user.name','Fixture');git('config','user.email','fixture@example.com');
  git('commit','--allow-empty','-qm','Empty unrelated candidate');const empty=git('rev-parse','HEAD');
  fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,spec);const candidate=commit();
  for(const result of ['pass','fail']){
    for(const suppliedDigest of [false,true]){
      const before=fs.readFileSync(file,'utf8');const report=assembleSpecReport(root,'S-701',{candidate:empty});
      const args=['verdict','S-701','--candidate',empty,'--result',result,'--findings',result==='pass'?'none':'new Task: Fixture defect','--reviewer','disposable separate context'];
      if(suppliedDigest)args.push('--digest',report.specDigest);
      const refused=invoke(...args);
      assert.equal(refused.status,1,`candidate missing the Spec must refuse ${result}, digest=${suppliedDigest}`);
      assert.match(refused.stderr,/committed|candidate.*content/i);
      assert.equal(fs.readFileSync(file,'utf8'),before,'refusal preserves every Spec byte');
      assert.equal(fs.existsSync(path.join(root,'specs/S-701-fixture/tasks')),false,'FAIL refusal creates no corrective Tasks');
    }
  }
  fs.writeFileSync(file,spec.replace('Original committed acceptance.','Changed uncommitted acceptance.'));
  const changed=fs.readFileSync(file,'utf8');const report=assembleSpecReport(root,'S-701',{candidate});
  assert.equal(report.candidate.matchesHead,true,'even HEAD equality cannot prove working-tree equality');
  assert.equal(report.candidate.matchesContent,false);
  const refused=invoke('verdict','S-701','--candidate',candidate,'--digest',report.specDigest,'--result','pass','--findings','none','--reviewer','disposable separate context');
  assert.equal(refused.status,1,'current digest cannot bind dirty substantive content to a committed candidate');
  assert.equal(fs.readFileSync(file,'utf8'),changed);
  fs.writeFileSync(file,spec);const passing=recordReviewVerdict(root,'S-701',{candidate,result:'pass',findings:'none',reviewer:'disposable separate context'});
  assert.equal(gate(root,{spec:'S-701',candidate}).refused,false);
  assert.equal(gate(root,{spec:'S-701',candidate:empty}).refused,true,'existing PASS cannot be lent to an unrelated candidate');
  const passed=fs.readFileSync(file,'utf8');
  fs.writeFileSync(file,passed.replace('**Updated:** 2026-10-01','**Updated:** 2026-10-02'));
  git('commit','--allow-empty','-qm','Unrelated HEAD advancement');
  const equivalent=assembleSpecReport(root,'S-701',{candidate});
  assert.equal(equivalent.candidate.matchesHead,false);
  assert.equal(equivalent.candidate.matchesContent,true,'administrative/evidence changes retain normalization');
  assert.equal(gate(root,{spec:'S-701',candidate}).refused,false);
  assert.equal(equivalent.specDigest,passing.digest);
  const fail=recordReviewVerdict(root,'S-701',{candidate,result:'fail',findings:'new Task: First fixture finding; new Task: Second fixture finding',reviewer:'another disposable separate context'});
  assert.equal(fail.correctiveTasks.length,2,'valid immutable FAIL still creates one Task per finding');
  assert.ok(fs.readFileSync(file,'utf8').includes(passing.row),'prior verdict bytes survive FAIL');
  console.log('ok - public PASS/FAIL reject missing and mismatched committed content without writes; gate cannot borrow PASS; normalized cross-checkout review and valid corrective FAIL remain supported');
}finally{fs.rmSync(root,{recursive:true,force:true});}
