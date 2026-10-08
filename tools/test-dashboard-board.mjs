import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import * as board from './grill-board.mjs';
function room() {
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'dashboard-board-test-'));
 fs.mkdirSync(path.join(root,board.BOARD_DIR),{recursive:true});
 fs.writeFileSync(board.boardPaths(root).items,JSON.stringify({schema:board.ITEMS_SCHEMA,title:'Fixture',groups:[{id:'one',title:'One'}],items:[]}));
 board.addItems(root,[{key:'one',group:'one',kind:'confirm-text',title:'A concrete draft',question:'Approve these exact words?',current:'Previous words',proposal:'Use the revised text',draft:'# Proposed\n\nConcrete words.',sources:[{label:'Source',path:'README.md',ref:'abc'}]}],{by:'fixture'});
 return root;
}
test('P/V validated atomic grade updates keep answers and question revision intact',()=>{
 const root=room();const before=fs.readFileSync(board.boardPaths(root).items);
 assert.equal(typeof board.gradeItems,'function');
 const grade={id:'GB-0001',expectedGradeRevision:0,priority:{grade:'P2',reason:'Source: README.md; removes a blocker'},value:{grade:'V1',reason:'Source: README.md; avoids repeated work'}};
 for (const changes of [{priority:{grade:'P5',reason:'bad'}},{value:{grade:'V0',reason:'bad'}},{value:{grade:'V1',reason:''}},{score:3}]) {
  assert.throws(()=>board.gradeItems(root,[{...grade,...changes}],{by:'test',reason:'test'}));
  assert.deepEqual(fs.readFileSync(board.boardPaths(root).items),before);
 }
 board.recordAnswer(root,'GB-0001',{verdict:'confirm',note:'Exact text',itemRevision:1});
 const answers=fs.readFileSync(board.boardPaths(root).answers);
 board.gradeItems(root,[grade],{by:'test',reason:'Source-backed grades'});
 assert.equal(board.readItems(root).items[0].revision,1);
 assert.equal(board.mergeBoard(root).items[0].derivedStatus,'answered');
 assert.deepEqual(fs.readFileSync(board.boardPaths(root).answers),answers);
 assert.throws(()=>board.gradeItems(root,[grade],{by:'test',reason:'stale'}),/stale/);
});
test('confirmation freezes exact draft; stale browser edits and stale approvals cannot overwrite',()=>{
 const root=room();
 const answer=board.recordAnswer(root,'GB-0001',{verdict:'confirm',note:'Confirmed',itemRevision:1,expectedAnswerAt:null});
 assert.equal(answer.approval.draft,'# Proposed\n\nConcrete words.');
 assert.ok(answer.approval.hash);
 assert.throws(()=>board.recordAnswer(root,'GB-0001',{verdict:'correct',note:'Stale tab',itemRevision:1,expectedAnswerAt:null}),/stale/);
 board.reviseItem(root,'GB-0001',{draft:'# Revised'},{by:'agent',reason:'Critique',expectedRevision:1});
 assert.throws(()=>board.reviseItem(root,'GB-0001',{draft:'Stale revision'},{by:'agent',reason:'stale',expectedRevision:1}),/stale/);
 const next=board.recordAnswer(root,'GB-0001',{verdict:'correct',note:'Needs context',itemRevision:2,expectedAnswerAt:answer.at});
 assert.equal(next.approval,undefined);
 assert.equal(next.history[0].approval.draft,'# Proposed\n\nConcrete words.');
});
test('P/V filters intersect independently and preserve unclassified questions',()=>{
 const html=fs.readFileSync(new URL('../workbench/grill-board/index.html',import.meta.url),'utf8');
 const script=html.match(/<script>([\s\S]*?)<\/script>/)[1].replace('Promise.all([load()','window.model={matchesSlice,gradeBadges,state}; Promise.all([load()');
 const ctx=vm.createContext({document:{getElementById:()=>({}),documentElement:{dataset:{}}},window:{addEventListener(){}},setInterval(){},URL,URLSearchParams,fetch:()=>new Promise(()=>{})});
 vm.runInContext(script,ctx);
 const m=ctx.window.model;const item={id:'GB-0001',title:'One',derivedStatus:'pending',priority:{grade:'P1',reason:'Urgent'},value:{grade:'V2',reason:'Useful'}};
 assert.equal(m.matchesSlice(item,{priority:'P1',value:'V2'}),true);
 assert.equal(m.matchesSlice(item,{priority:'P1',value:'V1'}),false);
 assert.equal(m.matchesSlice(item,{priority:'all',value:'V2'}),true);
 assert.equal(m.matchesSlice({...item,priority:undefined},{priority:'unclassified'}),true);
 assert.match(m.gradeBadges(item),/P1/);assert.match(m.gradeBadges(item),/Urgent/);
});
test('native rooms preserve legacy answers and write new answers only through native notepad',()=>{
 const root=room();
 const legacy=board.recordAnswer(root,'GB-0001',{verdict:'confirm',note:'Legacy approval',itemRevision:1});
 const before=fs.readFileSync(board.boardPaths(root).answers);
 fs.writeFileSync(path.join(root,'workbench/manifest.json'),JSON.stringify({schemaVersion:2,lanes:{specs:'workbench/specs',wiki:'workbench/wiki'},collections:{notepads:'workbench/sessions/notepads'}}));
 const updated=board.recordAnswer(root,'GB-0001',{verdict:'confirm',note:'Native approval',itemRevision:1,expectedAnswerAt:legacy.at});
 assert.deepEqual(fs.readFileSync(board.boardPaths(root).answers),before);
 assert.equal(board.readAnswers(root).answers['GB-0001'].note,'Native approval');
 assert.equal(updated.history[0].approval.note,'Legacy approval');
 assert.ok(fs.existsSync(path.join(root,'workbench/sessions/notepads/grilling/dashboard-answers.json')));
});
