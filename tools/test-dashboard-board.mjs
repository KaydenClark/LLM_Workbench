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
 assert.throws(()=>board.recordAnswer(root,'GB-0001',{verdict:'rework',note:'Stale tab',itemRevision:1,expectedAnswerAt:null}),/stale/);
 board.reviseItem(root,'GB-0001',{draft:'# Revised'},{by:'agent',reason:'Critique',expectedRevision:1});
 assert.throws(()=>board.reviseItem(root,'GB-0001',{draft:'Stale revision'},{by:'agent',reason:'stale',expectedRevision:1}),/stale/);
 const next=board.recordAnswer(root,'GB-0001',{verdict:'rework',note:'Needs context',itemRevision:2,expectedAnswerAt:answer.at});
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

// Answer controls: Confirm, Rework wording, Change the why and Change; a note
// before every answer except confirming the recommended one; no Not now or
// Decline for new answers; legacy answers keep their words and meaning.
function controlsRoom(extra = []) {
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'dashboard-controls-'));
 fs.mkdirSync(path.join(root,board.BOARD_DIR),{recursive:true});
 fs.writeFileSync(board.boardPaths(root).items,JSON.stringify({schema:board.ITEMS_SCHEMA,title:'Fixture',groups:[{id:'one',title:'One'}],items:[]}));
 const base={group:'one',question:'Which?',current:'Now.',sources:[{label:'Source',path:'README.md',ref:'abc'}]};
 const legacyMeta=[{value:'correct',label:'Correct with my notes'},{value:'decline',label:'Decline'},{value:'defer',label:'Not now'}];
 board.addItems(root,[
  {...base,key:'standard',kind:'owner-decision',title:'Standard question',proposal:'Agent proposal: yes.',draft:'Exact words.'},
  {...base,key:'flagged',kind:'choice',title:'Flagged alternatives',proposal:'Agent proposal: rename the qualifier.',options:[{value:'keep_both',label:'Keep both'},{value:'rename_qualifier',label:'Rename the qualifier (new Spec)',recommended:true},{value:'rename_verb',label:'Rename the verb instead'},...legacyMeta]},
  {...base,key:'named',kind:'choice',title:'Recommendation names a label',proposal:'Agent proposal: Keep LMK and show the full name first.',options:[{value:'keep_lmk',label:'Keep LMK'},{value:'new_prefix',label:'Use a new prefix'},...legacyMeta]},
  {...base,key:'unclear',kind:'choice',title:'Recommendation names no label',proposal:'Agent proposal: do not close this yet.',options:[{value:'close_answered',label:'Already answered, close'},{value:'answer',label:'Answer now (note)'},...legacyMeta]},
  {...base,key:'spec',kind:'approve-spec',title:'Approve a delivered Spec',proposal:'Approve on evidence.',options:[{value:'approve',label:'Approve'},{value:'finding',label:'Send back'},{value:'destination_change',label:'Return to Align'},{value:'defer',label:'Not now'},{value:'drop',label:'Drop this Spec'},...legacyMeta.slice(0,2)]},
  ...extra.map(raw=>({...base,...raw}))
 ],{by:'fixture'});
 return root;
}
const ids={standard:'GB-0001',flagged:'GB-0002',named:'GB-0003',unclear:'GB-0004',spec:'GB-0005'};

test('one shared answerControls helper drives the four answer words and the board view',()=>{
 const root=controlsRoom();
 const items=board.readItems(root).items;
 const standard=board.answerControls(items[0]);
 assert.equal(standard.mode,'standard');
 assert.deepEqual(standard.options.map(o=>[o.value,o.label,o.requiresNote]),[['confirm','Confirm',false],['rework','Rework wording',true],['change_why','Change the why',true],['change','Change',true]]);
 const all=items.flatMap(item=>board.answerControls(item).options.map(o=>o.label));
 assert.ok(!all.includes('Not now')&&!all.includes('Decline'),'new answers never offer Not now or Decline');
 const view=board.mergeBoard(root);
 for (const item of view.items) assert.deepEqual(item.controls,JSON.parse(JSON.stringify(board.answerControls(items.find(i=>i.id===item.id)))),'the page reads the same controls the server enforces');
});

test('alternatives present Recommended answer then A, B, C with the recommended one preselected',()=>{
 const root=controlsRoom();
 const items=board.readItems(root).items;
 const flagged=board.answerControls(items[1]);
 assert.equal(flagged.mode,'alternatives');
 assert.equal(flagged.recommended,'rename_qualifier');
 assert.deepEqual(flagged.alternatives.map(a=>[a.value,a.marker,a.requiresNote]),[['rename_qualifier','Recommended answer',false],['keep_both','A',true],['rename_verb','B',true]]);
 assert.ok(!flagged.alternatives.some(a=>['correct','decline','defer'].includes(a.value)),'legacy meta options are not alternatives');
 assert.deepEqual(flagged.options.map(o=>o.value),['rename_qualifier','keep_both','rename_verb','rework','change_why','change']);
 const named=board.answerControls(items[2]);
 assert.equal(named.recommended,'keep_lmk','a recommendation that names exactly one alternative label identifies it');
 const unclear=board.answerControls(items[3]);
 assert.equal(unclear.recommended,null);
 assert.match(unclear.recommendationBasis,/none is preselected/i);
 assert.deepEqual(unclear.alternatives.map(a=>[a.marker,a.requiresNote]),[['A',true],['B',true]],'without a recommendation every alternative needs a note');
});

test('recordAnswer enforces notes, refuses legacy and foreign verdicts and freezes only confirmations',()=>{
 const root=controlsRoom();
 const refuse=(id,verdict,note,pattern)=>assert.throws(()=>board.recordAnswer(root,id,{verdict,note,itemRevision:1}),pattern);
 for (const verdict of ['rework','change_why','change']) refuse(ids.standard,verdict,'  ',/note/);
 for (const verdict of ['defer','decline','correct']) refuse(ids.standard,verdict,'words',/legacy|not an option/);
 refuse(ids.flagged,'keep_both','',/note/);
 refuse(ids.flagged,'confirm','',/not an option/);
 refuse(ids.unclear,'close_answered','',/note/);
 for (const verdict of ['finding','destination_change','drop','defer','decline']) refuse(ids.spec,verdict,'words',/legacy|not an option/);
 assert.equal(fs.existsSync(board.boardPaths(root).answers),false,'refused answers write nothing');
 const rework=board.recordAnswer(root,ids.standard,{verdict:'rework',note:'Say it plainly',itemRevision:1});
 assert.equal(rework.derivedStatus,'answered');
 assert.equal(rework.approval,undefined,'a send-back freezes no approval');
 const confirmed=board.recordAnswer(root,ids.standard,{verdict:'confirm',note:'',itemRevision:1,expectedAnswerAt:rework.at});
 assert.match(confirmed.approval.hash,/^[a-f0-9]{64}$/);
 assert.equal(confirmed.approval.draft,'Exact words.');
 const recommended=board.recordAnswer(root,ids.flagged,{verdict:'rename_qualifier',note:'',itemRevision:1});
 assert.equal(recommended.approval.verdict,'rename_qualifier','Confirm on alternatives stores the selected alternative');
 const other=board.recordAnswer(root,ids.named,{verdict:'new_prefix',note:'Collides with nothing',itemRevision:1});
 assert.equal(other.approval.verdict,'new_prefix');
 const approved=board.recordAnswer(root,ids.spec,{verdict:'approve',note:'',itemRevision:1});
 assert.equal(approved.approval.verdict,'approve');
 const sentBack=board.recordAnswer(root,ids.spec,{verdict:'change',note:'Missing proof',itemRevision:1,expectedAnswerAt:approved.at});
 assert.equal(sentBack.approval,undefined);
 assert.equal(board.recordAnswer(root,ids.unclear,{verdict:'',note:'Thinking',itemRevision:1}).derivedStatus,'pending','notes still save progressively without an answer');
});

test('legacy answers still read with their original words and status semantics',()=>{
 const root=controlsRoom();
 const at='2026-10-01T00:00:00.000Z';
 const legacy=(verdict,note)=>({verdict,note,at,itemRevision:1,history:[]});
 fs.writeFileSync(board.boardPaths(root).answers,JSON.stringify({schema:board.ANSWERS_SCHEMA,owner:'Kayden',answers:{
  [ids.standard]:legacy('defer','later'),[ids.flagged]:legacy('decline','no'),[ids.named]:legacy('correct',''),[ids.unclear]:legacy('answer','My answer'),[ids.spec]:legacy('finding','Fix it')
 }}));
 const view=Object.fromEntries(board.mergeBoard(root).items.map(item=>[item.id,item]));
 assert.deepEqual([ids.standard,ids.flagged,ids.named,ids.unclear,ids.spec].map(id=>[view[id].derivedStatus,view[id].answerLabel]),[
  ['pending','Not now'],['answered','Decline'],['pending','Correct with my notes'],['answered','Answer now (note)'],['answered','Send back']
 ]);
 assert.equal(board.answerLabel({kind:'owner-decision',options:null},'correct'),'Correct','default-option legacy words are the original ones');
 assert.equal(board.answerLabel({kind:'owner-decision',options:null},'decline'),'Decline');
 assert.equal(board.answerLabel({kind:'owner-decision',options:null},'defer'),'Not now');
 assert.deepEqual(board.pendingForAgents(root).map(item=>[item.id,item.verdictLabel]),[[ids.flagged,'Decline'],[ids.unclear,'Answer now (note)'],[ids.spec,'Send back']]);
});
