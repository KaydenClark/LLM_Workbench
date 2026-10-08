import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import http from 'node:http';
import * as board from './grill-board.mjs';
import { createWorkflow, chainAnswers } from './dashboard-workflow.mjs';
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

async function serve(root,options){
 const server=board.createServer(root,options);
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 return {base:`http://127.0.0.1:${server.address().port}`,close:()=>new Promise(resolve=>server.close(resolve))};
}

test('search, backlinks and glossary routes delegate to the sources module and 404 without it',async()=>{
 const root=controlsRoom();
 fs.writeFileSync(path.join(root,'README.md'),'# Readme\n');
 const calls=[];
 const route=(rootDir,url,context)=>{
  calls.push({rootDir,path:url.pathname,q:url.searchParams.get('q'),items:context.items.length,read:context.readSource(rootDir,'README.md')});
  if(url.pathname==='/api/search')return{results:[{kind:'question',id:'GB-0001',title:'Standard question',snippet:'Which?',status:'pending'}]};
  if(url.pathname==='/api/glossary')return{source:null,terms:[]};
  return null;
 };
 const wired=await serve(root,{dashboardRoute:route});
 try{
  const search=await fetch(`${wired.base}/api/search?q=standard`);
  assert.equal(search.status,200);
  assert.equal((await search.json()).results[0].id,'GB-0001');
  assert.deepEqual((await (await fetch(`${wired.base}/api/glossary`)).json()),{source:null,terms:[]});
  assert.equal((await fetch(`${wired.base}/api/backlinks?path=README.md`)).status,404,'a null route result is not found');
  assert.equal(calls[0].q,'standard');
  assert.equal(calls[0].items,5,'the route receives the board items');
  assert.equal(calls[0].read,'# Readme\n','the route receives the board safe reader');
 }finally{await wired.close();}
 const absent=await serve(root,{dashboardRoute:null});
 try{
  for (const route of ['/api/search?q=x','/api/backlinks?path=README.md','/api/glossary']) assert.equal((await fetch(absent.base+route)).status,404);
 }finally{await absent.close();}
});

test('Drafts to approve groups drafts by target file, lists approvals without drafts and shows stale approval',async()=>{
 const root=controlsRoom([
  {key:'ddr',kind:'confirm-ddr',title:'Review a decision record',proposal:'Confirm the record.',draft:'# Decision\n\nProposed words.',sources:[{label:'Record',path:'docs/ddr/000A.md',ref:'abc'},{label:'Register',path:'docs/ddr/REGISTER.md'}]},
  {key:'dqc',kind:'confirm-dqc',title:'Confirm a destination question',proposal:'Confirm the understanding.'},
  {key:'withdrawn',kind:'confirm-text',title:'Withdrawn draft',proposal:'Gone.',draft:'Old words.'}
 ]);
 board.withdrawItem(root,'GB-0008',{by:'fixture',reason:'superseded'});
 board.recordAnswer(root,'GB-0006',{verdict:'confirm',note:'',itemRevision:1});
 let drafts=board.draftsToApprove(root);
 const target=drafts.groups.find(group=>group.target==='docs/ddr/000A.md');
 assert.ok(target,'a full-text review is grouped under its target file');
 assert.deepEqual(target.items.map(item=>[item.id,item.draftKind,item.approval.state]),[['GB-0006','full-text','current']]);
 assert.match(target.items[0].approval.hash,/^[a-f0-9]{64}$/);
 const undetermined=drafts.groups.find(group=>group.target===null);
 assert.deepEqual(undetermined.items.map(item=>item.id),['GB-0001'],'proposed wording without a determinable target file stays listed');
 assert.deepEqual(drafts.withoutDraft.map(item=>item.id),['GB-0005','GB-0007'],'approval questions without a draft are listed, never given an invented one');
 assert.ok(!JSON.stringify(drafts).includes('GB-0008'),'withdrawn items are not offered for approval');
 board.reviseItem(root,'GB-0006',{draft:'# Decision\n\nRevised words.'},{by:'agent',reason:'critique'});
 drafts=board.draftsToApprove(root);
 const stale=drafts.groups.find(group=>group.target==='docs/ddr/000A.md').items[0];
 assert.equal(stale.approval.state,'stale','an approval of earlier wording is visibly stale');
 assert.notEqual(stale.approval.hash,stale.approval.currentHash);
 const served=await serve(root,{dashboardRoute:null});
 try{assert.deepEqual(await (await fetch(`${served.base}/api/drafts`)).json(),JSON.parse(JSON.stringify(board.draftsToApprove(root))));}
 finally{await served.close();}
});

// ---- Page model, loaded from the served page in a VM (no browser). ----
function element() {
 return {value:'',textContent:'',innerHTML:'',hidden:false,disabled:false,dataset:{},style:{},classList:{toggle(){},add(){},remove(){}},
  querySelector:()=>null,querySelectorAll:()=>[],setAttribute(){},removeAttribute(){},scrollIntoView(){},focus(){},addEventListener(){}};
}
function pageModel({storage={},history=[]}={}) {
 const html=fs.readFileSync(new URL('../workbench/grill-board/index.html',import.meta.url),'utf8');
 const script=html.match(/<script>([\s\S]*?)<\/script>/)[1].replace('Promise.all([load()','window.model={state,matchesSlice,topicSummaries,sliceTitle,startBatch,batchProgress,resetSlice,gradeBadges,gradeDetail,answerModel,whysList,confirmedItems,dispositionTimeline,laneFor,rememberComment,commentDraftFor,forgetComment,cardWorkflowHtml,staleNotice,promotionBlocker,openQuestion,hasUnsavedWork,approvalSummary,conflictNotice}; Promise.all([load()');
 const elements=new Map();
 const localStorage={getItem:key=>storage[key]??null,setItem:(key,value)=>{storage[key]=String(value);},removeItem:key=>{delete storage[key];}};
 const ctx=vm.createContext({document:{getElementById:id=>{if(!elements.has(id))elements.set(id,element());return elements.get(id);},querySelectorAll:()=>[],documentElement:{dataset:{}}},window:{addEventListener(){},scrollTo(){},scrollY:0},history:{replaceState:(_state,_title,url)=>history.push(url)},localStorage,setInterval(){},setTimeout,clearTimeout,URL,URLSearchParams,location:{hash:''},fetch:()=>new Promise(()=>{})});
 vm.runInContext(script,ctx);
 return {model:ctx.window.model,storage};
}
const grade=(p,v)=>({...(p?{priority:{grade:p,reason:`${p} because of its source`}}:{}),...(v?{value:{grade:v,reason:`${v} because of its return`}}:{})});
function pvInventory() {
 // id number -> topic: 1 workflow, 17 direction, 14 roles, 5 context, 4 records
 const rows=[['GB-0001','P1','V2','owner-decision'],['GB-0017','P1','V1','choice'],['GB-0014','P2','V2','owner-decision'],['GB-0005','P3','V1','approve-spec'],['GB-0004','P3','V2','owner-decision'],['GB-0002','P2','V1','choice'],['GB-0006',null,null,'owner-decision'],['GB-0008','P4',null,'choice']];
 return rows.map(([id,p,v,kind])=>{
  const item={id,kind,title:`Question ${id}`,question:'Q?',current:'c',proposal:'p',draft:null,options:null,sources:[],links:[],history:[],revision:1,derivedStatus:'pending',status:'open',answer:null,...grade(p,v)};
  return {...item,controls:board.answerControls(item)};
 });
}

test('P/V filters return exactly their members and combine with the other board filters',()=>{
 const {model}=pageModel();
 const items=pvInventory();
 const ids=slice=>items.filter(item=>model.matchesSlice(item,slice)).map(item=>item.id).sort();
 assert.deepEqual(ids({priority:'P1',value:'V2'}),['GB-0001']);
 assert.deepEqual(ids({priority:'P3',value:'V1'}),['GB-0005'],'a slice without P1 works');
 assert.deepEqual(ids({priority:'P2'}),['GB-0002','GB-0014'],'P alone spans every Value');
 assert.deepEqual(ids({value:'V1'}),['GB-0002','GB-0005','GB-0017'],'V alone spans every Priority');
 assert.deepEqual(ids({priority:'unclassified'}),['GB-0006']);
 assert.deepEqual(ids({value:'unclassified'}),['GB-0006','GB-0008'],'missing grades stay reachable, never defaulted');
 assert.deepEqual(ids({priority:'all',value:'all'}),items.map(item=>item.id).sort(),'clearing restores the whole inventory');
 assert.deepEqual(ids({value:'V2',topic:'workflow'}),['GB-0001']);
 assert.deepEqual(ids({value:'V1',intent:'review'}),['GB-0005']);
 assert.deepEqual(ids({priority:'P2',query:'0014'}),['GB-0014']);
 items[1].derivedStatus='answered';
 assert.deepEqual(ids({value:'V1',lane:'pending'}),['GB-0002','GB-0005']);
 model.state.priority='P1'; model.state.value='V2'; model.state.topic='roles'; model.state.query='x';
 model.resetSlice();
 assert.deepEqual([model.state.priority,model.state.value,model.state.topic,model.state.query],['all','all','all',''],'Clear all filters also clears P/V');
 assert.equal(model.sliceTitle({topic:'all',intent:'all',priority:'P3',value:'V1'}),'All topics · Any kind of decision · P3 · V1');
});

test('topic navigation keeps matching members reachable without any aggregate P/V score',()=>{
 const {model}=pageModel();
 const items=pvInventory();
 const topics=model.topicSummaries(items,{priority:'all',value:'V2'});
 assert.deepEqual(JSON.parse(JSON.stringify(topics.flatMap(topic=>topic.members))).sort(),['GB-0001','GB-0004','GB-0014']);
 for (const topic of topics) {
  assert.deepEqual(Object.keys(topic).sort(),['counts','done','frame','id','members','outcome','title','total']);
  assert.ok(!/P[1-4]|V[1-4]|grade|score/i.test(JSON.stringify({counts:topic.counts,done:topic.done,total:topic.total})),'no topic carries a combined grade');
 }
});

test('a batch started from a P/V slice keeps its membership through saves, filters, regrades and reload',()=>{
 const storage={};
 const first=pageModel({storage}).model;
 const items=pvInventory();
 first.state.board={items};
 first.state.value='V1';
 first.startBatch(items.filter(item=>first.matchesSlice(item)));
 assert.deepEqual([...first.state.batch.ids],['GB-0017','GB-0005','GB-0002']);
 assert.match(first.state.batch.title,/V1/);
 first.state.priority='P4'; first.state.value='all';
 items.find(item=>item.id==='GB-0005').value={grade:'V3',reason:'regraded'};
 items.find(item=>item.id==='GB-0017').derivedStatus='answered';
 assert.deepEqual([...first.state.batch.ids],['GB-0017','GB-0005','GB-0002'],'filters, saves and a regrade never change membership');
 assert.equal(first.batchProgress().done,1);
 first.state.edits.set('GB-0017',{verdict:'confirm',note:'unsaved'});
 assert.equal(first.batchProgress().done,0,'an unsaved edit does not count as answered');
 const reloaded=pageModel({storage}).model;
 assert.equal(reloaded.state.inBatch,true);
 assert.deepEqual([...reloaded.state.batch.ids],['GB-0017','GB-0005','GB-0002'],'reload restores the same members');
 assert.deepEqual({...reloaded.state.batch.revisions},{'GB-0017':1,'GB-0005':1,'GB-0002':1});
});

test('red P and amber V badges open only their own reason; the central view shows both reasons',()=>{
 const {model}=pageModel();
 const item=pvInventory()[0];
 const badges=model.gradeBadges(item);
 assert.equal((badges.match(/<details class="grade priority">/g)||[]).length,1);
 assert.equal((badges.match(/<details class="grade value">/g)||[]).length,1);
 assert.ok(!/data-open|<details[^>]*open/.test(badges),'badges are closed and do not open the question');
 const [priority,value]=badges.split('</details>');
 assert.match(priority,/P1 because of its source/); assert.doesNotMatch(priority,/V2 because/);
 assert.match(value,/V2 because of its return/); assert.doesNotMatch(value,/P1 because/);
 assert.match(model.gradeBadges(pvInventory()[6]),/P · Unclassified[\s\S]*V · Unclassified/);
 const detail=model.gradeDetail(item);
 assert.match(detail,/Priority P1[\s\S]*P1 because of its source[\s\S]*Value V2[\s\S]*V2 because of its return/);
 assert.match(model.gradeDetail(pvInventory()[6]),/Priority: Unclassified[\s\S]*none is invented/);
});

test('the page answer buttons follow the server controls and require a note first',()=>{
 const {model}=pageModel();
 const root=controlsRoom();
 const view=Object.fromEntries(board.mergeBoard(root).items.map(item=>[item.id,item]));
 const buttons=(id,edit)=>model.answerModel(view[id],edit).buttons.map(b=>({role:b.role,value:b.value,label:b.label,disabled:b.disabled,pressed:b.pressed}));
 const empty=buttons(ids.standard,{verdict:'',note:''});
 assert.deepEqual(empty.map(b=>[b.label,b.disabled]),[['Confirm',false],['Rework wording',true],['Change the why',true],['Change',true]]);
 assert.deepEqual(buttons(ids.standard,{verdict:'',note:'my words'}).map(b=>b.disabled),[false,false,false,false]);
 const alternatives=buttons(ids.flagged,{verdict:'',note:''});
 assert.deepEqual(alternatives.filter(b=>b.role==='alternative').map(b=>[b.label,b.pressed,b.disabled]),[['Recommended answer: Rename the qualifier (new Spec)',true,false],['A: Keep both',false,true],['B: Rename the verb instead',false,true]]);
 assert.equal(alternatives.find(b=>b.role==='confirm').value,'rename_qualifier','Confirm confirms the preselected recommendation');
 assert.equal(alternatives.find(b=>b.role==='confirm').disabled,false);
 model.state.selected.set(ids.flagged,'keep_both');
 const other=buttons(ids.flagged,{verdict:'',note:''});
 assert.equal(other.find(b=>b.role==='confirm').value,'keep_both');
 assert.equal(other.find(b=>b.role==='confirm').disabled,true,'confirming another alternative needs a note');
 assert.equal(buttons(ids.flagged,{verdict:'',note:'Because'}).find(b=>b.role==='confirm').disabled,false);
 const unclear=model.answerModel(view[ids.unclear],{verdict:'',note:''});
 assert.equal(unclear.selected,null,'nothing is preselected without a recommendation');
 assert.match(unclear.recommendationBasis,/none is preselected/);
 assert.equal(unclear.buttons.find(b=>b.role==='confirm').disabled,true);
 const approval=buttons(ids.spec,{verdict:'',note:''});
 assert.deepEqual(approval.map(b=>[b.label,b.value]),[['Confirm','approve'],['Rework wording','rework'],['Change the why','change_why'],['Change','change']]);
 const labels=Object.keys(view).flatMap(id=>buttons(id,{verdict:'',note:'x'}).map(b=>b.label)).join('|');
 assert.doesNotMatch(labels,/Not now|Decline/);
 const legacyItem={...view[ids.standard],answer:{verdict:'decline',note:'no',itemRevision:1,at:'x'},answerLabel:'Decline'};
 const legacy=model.answerModel(legacyItem);
 assert.deepEqual({...legacy.legacy},{verdict:'decline',label:'Decline'});
 assert.ok(legacy.buttons.every(b=>!b.pressed),'a legacy answer presses no new button');
});

test('the Whys list collects Change the why answers with title, ID, note, revision and status',()=>{
 const {model}=pageModel();
 const items=[
  {id:'GB-0002',title:'Second',revision:3,derivedStatus:'stale',answer:{verdict:'change_why',note:'The reason is the cost',itemRevision:2,at:'2026-10-07T00:00:00Z',history:[{verdict:'change_why',note:'Older reason',itemRevision:1,at:'2026-10-05T00:00:00Z'}]}},
  {id:'GB-0001',title:'First',revision:1,derivedStatus:'answered',answer:{verdict:'change_why',note:'Wrong cause',itemRevision:1,at:'2026-10-08T00:00:00Z',history:[]}},
  {id:'GB-0003',title:'Third',revision:1,derivedStatus:'answered',answer:{verdict:'rework',note:'Words',itemRevision:1,at:'2026-10-08T00:00:00Z',history:[]}}
 ];
 const rows=model.whysList(items);
 assert.deepEqual(JSON.parse(JSON.stringify(rows.map(row=>[row.title,row.id,row.note,row.itemRevision,row.status]))),[['First','GB-0001','Wrong cause',1,'answered'],['Second','GB-0002','The reason is the cost',2,'stale'],['Second','GB-0002','Older reason',1,'superseded']]);
 assert.deepEqual([...model.whysList(items,{status:'stale'}).map(row=>row.id)],['GB-0002']);
 assert.deepEqual([...model.whysList(items,{query:'cost'}).map(row=>row.note)],['The reason is the cost']);
});

test('promotion readiness and the disposition timeline come from the workflow card states',()=>{
 const {model}=pageModel();
 const items=[{id:'GB-0001',title:'One',revision:1,status:'open'},{id:'GB-0002',title:'Two',revision:1,status:'open'},{id:'GB-0003',title:'Three',revision:1,status:'open'}];
 model.state.board={items};
 const request={id:'req-1',requestedAt:'2026-10-08T00:00:00Z',status:'requested',stages:['Record','Publish','Map','Publish','Plan','Publish'],cards:[{id:'GB-0002'}]};
 const receipt=(stage,extra={})=>({stage,by:'director',at:'2026-10-08T01:00:00Z',links:[],evidence:['README.md'],reason:'',...extra});
 model.state.workflow={revision:3,comments:[],requests:[request],cards:{
  'GB-0001':{state:'confirmed',label:'Confirmed; promotion not requested'},
  'GB-0002':{state:'map-published',label:'Published (map); knowledge-only, no Spec or Task: the Wiki owns it',requestId:'req-1',mapping:{implementationNeeded:false,reason:'the Wiki owns it'}},
  'GB-0003':{state:'in-grilling',label:'In grilling'}},
  dispositions:{'GB-0002':{requestId:'req-1',receipts:[receipt('Record'),receipt('Publish'),receipt('Map',{implementationNeeded:false,reason:'the Wiki owns it'}),receipt('Publish')]}}};
 assert.deepEqual(model.confirmedItems().map(item=>item.id),['GB-0001'],'only cards the workflow reports confirmed are promotable');
 model.state.edits.set('GB-0001',{verdict:'confirm',note:'unsaved'});
 assert.deepEqual(model.confirmedItems().map(item=>item.id),[],'an unsaved edit holds promotion back');
 const timeline=model.dispositionTimeline(request,model.state.workflow.dispositions['GB-0002'],model.state.workflow.cards['GB-0002']);
 assert.match(timeline,/knowledge-only, no Spec or Task: the Wiki owns it/);
 assert.equal((timeline.match(/class="done"/g)||[]).length,5,'Requested plus four reached receipts');
 assert.match(timeline,/No Spec or Task: the Wiki owns it/);
 assert.match(timeline,/class="next"><strong>Plan/);
 assert.doesNotMatch(timeline,/Implemented/,'a knowledge-only card shows no implementation step');
});

test('an unsent comment draft survives every re-render of its card and clears only after sending',()=>{
 const {model}=pageModel();
 const item={id:'GB-0034',revision:5,title:'T',status:'open',answer:null,controls:board.answerControls({kind:'owner-decision',options:null})};
 model.state.board={items:[item]};
 model.state.workflow={revision:1,comments:[],requests:[],cards:{'GB-0034':{state:'in-grilling',label:'In grilling'}},dispositions:{}};
 assert.equal(model.commentDraftFor(item),'');
 model.rememberComment(item,'Say which file owns this.');
 const html=model.cardWorkflowHtml(item);
 assert.match(html,/<textarea id="comment-GB-0034"[^>]*>Say which file owns this\.<\/textarea>/,'a re-rendered card restores the unsent text');
 assert.doesNotMatch(html,/data-comment="comment" disabled/,'the send buttons are enabled for restored text');
 assert.equal(model.hasUnsavedWork(),true,'leaving the page warns about an unsent comment');
 assert.equal(model.commentDraftFor({...item,revision:6}),'','a draft belongs to the revision it was written against');
 model.forgetComment(item);
 assert.equal(model.commentDraftFor(item),'');
 assert.match(model.cardWorkflowHtml(item),/data-comment="comment" disabled/);
 assert.equal(model.hasUnsavedWork(),false);
});

test('a confirmed re-answer clears the changed-question notice and a pending Change request is named as the blocker',()=>{
 const {model}=pageModel();
 const item={id:'GB-0034',revision:6,derivedStatus:'stale',answerLabel:'Confirm',answer:{verdict:'confirm',note:'',itemRevision:5}};
 assert.match(model.staleNotice(item),/now revision 6; you answered revision 5/);
 assert.equal(model.staleNotice({...item,derivedStatus:'answered',answer:{...item.answer,itemRevision:6}}),'');
 model.state.board={items:[item]};
 model.state.workflow={comments:[{id:'GB-0034',kind:'change',itemRevision:6,text:'Explain the source context.',at:'2026-10-08T17:30:00Z',status:'awaiting revision'}],requests:[],cards:{'GB-0034':{state:'in-grilling'}}};
 const blocker=model.promotionBlocker(item);
 assert.match(blocker,/change request/i);
 assert.match(blocker,/Explain the source context\./);
 assert.match(blocker,/agent .*revis.*fresh confirmation|revise.*confirm/i);
 model.state.workflow.comments=[];
 assert.match(model.promotionBlocker(item),/Only a card the workflow reports as confirmed/);
});

test('opening a question from the list records it in the address so a reload reopens it',()=>{
 const history=[];
 const {model}=pageModel({history});
 const item=pvInventory()[0];
 model.state.board={items:[item]};
 model.openQuestion(item.id);
 assert.equal(model.state.focus,item.id);
 assert.deepEqual(history,['#GB-0001']);
});

// ---- Local-only write guard: no cross-site or DNS-rebinding request writes. ----
function notepadRoom() {
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'dashboard-guard-'));
 fs.mkdirSync(path.join(root,board.BOARD_DIR),{recursive:true});
 fs.writeFileSync(path.join(root,'workbench/manifest.json'),JSON.stringify({schemaVersion:2,lanes:{sessions:'workbench/sessions'},collections:{notepads:'workbench/sessions/notepads','notepad-templates':'workbench/sessions/notepads/templates',handoffs:'workbench/sessions/handoffs'}}));
 fs.writeFileSync(path.join(root,'README.md'),'# Owner\n');
 fs.writeFileSync(board.boardPaths(root).items,JSON.stringify({schema:board.ITEMS_SCHEMA,title:'Fixture',groups:[{id:'one',title:'One'}],items:[]}));
 board.addItems(root,[1,2].map(n=>({key:`k${n}`,group:'one',kind:'owner-decision',title:`Question ${n}`,question:'Q?',current:'c',proposal:'Agent proposal: p',sources:[{label:'Owner',path:'README.md',ref:'x'}]})),{by:'fixture'});
 return root;
}
function snapshotWrites(root) {
 const files={};
 const walk=dir=>{ if(!fs.existsSync(dir))return; for(const entry of fs.readdirSync(dir,{withFileTypes:true})){ const file=path.join(dir,entry.name); if(entry.isDirectory())walk(file); else files[path.relative(root,file)]=fs.readFileSync(file,'utf8'); } };
 walk(path.join(root,'workbench/grill-board'));
 walk(path.join(root,'workbench/sessions'));
 return files;
}
function send(port,method,pathname,{headers={},body}={}) {
 return new Promise((resolve,reject)=>{
  const request=http.request({host:'127.0.0.1',port,method,path:pathname,headers:{host:`127.0.0.1:${port}`,...headers}},response=>{const chunks=[];response.on('data',c=>chunks.push(c));response.on('end',()=>resolve({status:response.statusCode,headers:response.headers,text:Buffer.concat(chunks).toString('utf8')}));});
  request.on('error',reject); request.end(body);
 });
}

test('write routes refuse non-JSON, foreign Origin, foreign Host and cross-site requests and write nothing',async()=>{
 const root=notepadRoom();
 const server=board.createServer(root,{dashboardRoute:null});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const port=server.address().port;
 const json={'content-type':'application/json'};
 try{
  board.recordAnswer(root,'GB-0002',{verdict:'confirm',note:'',itemRevision:1});
  const revision=()=>board.workflow(root).read().revision;
  const routes=[
   ['PUT','/api/answers/GB-0001',()=>({verdict:'confirm',note:'',itemRevision:1})],
   ['POST','/api/comments',()=>({id:'GB-0001',itemRevision:1,kind:'comment',text:'From elsewhere',actionId:'a-comment',expectedRevision:revision()})],
   ['POST','/api/rounds',()=>({actionId:'a-round',expectedRevision:revision()})],
   ['POST','/api/promotions',()=>({ids:['GB-0002'],revisions:{'GB-0002':1},actionId:'a-promote',expectedRevision:revision()})]
  ];
  const bad=[
   ['text/plain',{'content-type':'text/plain'},415],
   ['no content type',{},415],
   ['foreign Origin',{...json,origin:'https://evil.example'},403],
   ['other local port Origin',{...json,origin:`http://127.0.0.1:${port+1}`},403],
   ['foreign Host',{...json,host:`evil.example:${port}`},403],
   ['rebound Host',{...json,host:'attacker.test'},403],
   ['cross-site fetch',{...json,'sec-fetch-site':'cross-site'},403]
  ];
  for(const [method,route,payload] of routes){
   for(const [name,headers,status] of bad){
    const before=snapshotWrites(root);
    const response=await send(port,method,route,{headers,body:JSON.stringify(payload())});
    assert.equal(response.status,status,`${method} ${route} ${name}: ${response.text}`);
    assert.deepEqual(snapshotWrites(root),before,`${method} ${route} ${name} wrote nothing`);
   }
   for(const origin of [undefined,`http://127.0.0.1:${port}`,`http://localhost:${port}`]){
    if(origin===`http://localhost:${port}`&&route!=='/api/comments')continue;
    const headers={...json,...(origin?{origin}:{}),...(origin===`http://localhost:${port}`?{host:`localhost:${port}`}:{}),'sec-fetch-site':'same-origin'};
    const body=route==='/api/comments'&&origin?{...payload(),actionId:`a-comment-${origin.includes("localhost")?"localhost":"loopback"}`,text:`Same origin ${origin}`}:payload();
    const response=await send(port,method,route,{headers,body:JSON.stringify(body)});
    assert.equal(response.status,200,`${method} ${route} same-origin: ${response.text}`);
   }
  }
  for(const route of ['/','/api/board','/api/artifacts','/api/workflow','/api/drafts','/api/status']){
   const ok=await send(port,'GET',route,{headers:{origin:'https://evil.example'}});
   assert.equal(ok.headers['access-control-allow-origin'],undefined,`${route} sends no CORS grant`);
   assert.equal((await send(port,'GET',route,{headers:{host:'attacker.test'}})).status,403,`${route} refuses a rebound Host`);
  }
 }finally{await new Promise(resolve=>server.close(resolve));}
});

test('a JSON body that is not an object is refused with 400 invalid-input',async()=>{
 const root=notepadRoom();
 const served=await serve(root,{dashboardRoute:null});
 try{
  for(const [method,route] of [['PUT','/api/answers/GB-0001'],['POST','/api/comments'],['POST','/api/rounds'],['POST','/api/promotions']]){
   for(const body of ['null','[]','"text"','3']){
    const response=await fetch(served.base+route,{method,headers:{'content-type':'application/json'},body});
    assert.equal(response.status,400,`${method} ${route} ${body}`);
    assert.equal((await response.json()).error.code,'invalid-input');
   }
  }
 }finally{await served.close();}
});

test('every write the page sends is declared application/json',()=>{
 const html=fs.readFileSync(new URL('../workbench/grill-board/index.html',import.meta.url),'utf8');
 const writes=[...html.matchAll(/fetch\([^;]*method: '(PUT|POST|DELETE|PATCH)'[^;]*/g)].map(match=>match[0]);
 assert.ok(writes.length>=2);
 for (const call of writes) assert.match(call,/'content-type': 'application\/json'/);
});

test('a notepad answer stores only itself, so an old note the privacy guard refuses never blocks a new answer',()=>{
 const root=notepadRoom();
 const legacy={verdict:'correct',note:'See /Users/someone/x for my words',at:'2026-10-01T00:00:00.000Z',itemRevision:1,history:[]};
 fs.writeFileSync(board.boardPaths(root).answers,JSON.stringify({schema:board.ANSWERS_SCHEMA,owner:'Kayden',answers:{'GB-0001':legacy}}));
 const confirmed=board.recordAnswer(root,'GB-0001',{verdict:'confirm',note:'',itemRevision:1,expectedAnswerAt:legacy.at});
 assert.equal(confirmed.verdict,'confirm');
 assert.deepEqual(confirmed.history.map(entry=>[entry.verdict,entry.note]),[['correct',legacy.note]],'the returned answer carries its history');
 const reworked=board.recordAnswer(root,'GB-0001',{verdict:'rework',note:'Plainer words',itemRevision:1,expectedAnswerAt:confirmed.at});
 const stored=fs.readFileSync(path.join(root,'workbench/sessions/notepads/grilling/dashboard-answers.json'),'utf8');
 assert.ok(!stored.includes('/Users/someone'),'the notepad never repeats an earlier answer');
 const entries=JSON.parse(stored).entries.filter(entry=>entry.topic==='dashboard-answer').map(entry=>JSON.parse(entry.content));
 assert.deepEqual(entries.map(entry=>[entry.answer.verdict,entry.answer.history,entry.supersedes?.at]),[['confirm',undefined,legacy.at],['rework',undefined,confirmed.at]]);
 assert.match(entries[1].supersedes.hash,/^[a-f0-9]{64}$/);
 const answer=board.readAnswers(root).answers['GB-0001'];
 assert.deepEqual(answer.history.map(entry=>entry.verdict),['correct','confirm'],'history is rebuilt from the legacy file and earlier notepad entries');
 assert.equal(answer.history[1].approval.hash,confirmed.approval.hash,'an earlier approval snapshot stays in history');
 assert.equal(reworked.history.length,2);
 const view=board.mergeBoard(root).items[0];
 assert.equal(view.answer.history.length,2);
 assert.equal(board.workflow(root).read().cards['GB-0001'].state,'in-grilling');
});

test('a confirmation saved before snapshots existed asks to be confirmed again before promotion',()=>{
 const {model}=pageModel();
 const item={id:'GB-0007',revision:2,title:'T',status:'open',controls:board.answerControls({kind:'owner-decision',options:null}),answer:{verdict:'confirm',note:'',itemRevision:2,at:'2026-10-02T00:00:00Z'}};
 model.state.board={items:[item]};
 model.state.workflow={comments:[],requests:[],cards:{'GB-0007':{state:'in-grilling'}}};
 assert.match(model.approvalSummary(item),/saved before .*exact wording.*Confirm it again/);
 assert.match(model.promotionBlocker(item),/Confirm it again/);
 assert.match(model.approvalSummary({...item,answer:null}),/No exact-wording confirmation/);
});

test('confirming again records a fresh snapshot for a confirmation that has none, and a true repeat stays idempotent',()=>{
 const root=notepadRoom();
 const legacy={verdict:'confirm',note:'',at:'2026-10-02T00:00:00.000Z',itemRevision:1,history:[]};
 const mismatched={verdict:'confirm',note:'',at:'2026-10-02T00:00:00.000Z',itemRevision:1,history:[],approval:{hash:'0'.repeat(64),itemRevision:1,verdict:'confirm',note:'',confirmedAt:'2026-10-02T00:00:00.000Z'}};
 fs.writeFileSync(board.boardPaths(root).answers,JSON.stringify({schema:board.ANSWERS_SCHEMA,owner:'Kayden',answers:{'GB-0001':legacy,'GB-0002':mismatched}}));
 const flow=board.workflow(root);
 assert.equal(flow.read().cards['GB-0001'].state,'in-grilling');
 for (const [id,previous] of [['GB-0001',legacy],['GB-0002',mismatched]]){
  const again=board.recordAnswer(root,id,{verdict:'confirm',note:'',itemRevision:1,expectedAnswerAt:previous.at});
  assert.notEqual(again.at,previous.at,`${id}: a new answer is recorded`);
  assert.match(again.approval.hash,/^[a-f0-9]{64}$/);
  assert.notEqual(again.approval.hash,'0'.repeat(64));
  assert.equal(again.history.length,1,`${id}: the earlier confirmation stays in history`);
  assert.equal(flow.read().cards[id].state,'confirmed');
  const repeat=board.recordAnswer(root,id,{verdict:'confirm',note:'',itemRevision:1,expectedAnswerAt:again.at});
  assert.equal(repeat.at,again.at,`${id}: a repeat of a current snapshot is idempotent`);
 }
 const promoted=flow.promote({ids:['GB-0001','GB-0002'],revisions:{'GB-0001':1,'GB-0002':1},actionId:'p-reconfirm',expectedRevision:flow.read().revision});
 assert.equal(promoted.request.cards.length,2);
});

test('an answer that does not follow the one it names surfaces as a conflict; the newest stays current and none is dropped',()=>{
 const root=notepadRoom();
 const first=board.recordAnswer(root,'GB-0001',{verdict:'confirm',note:'',itemRevision:1});
 // An older server, still writing answers.json, records a newer answer.
 const newer={verdict:'rework',note:'Plainer words, from the old service',at:new Date(Date.parse(first.at)+60000).toISOString(),itemRevision:1,history:[]};
 fs.writeFileSync(board.boardPaths(root).answers,JSON.stringify({schema:board.ANSWERS_SCHEMA,owner:'Kayden',answers:{'GB-0001':newer}}));
 const answer=board.readAnswers(root).answers['GB-0001'];
 assert.equal(answer.verdict,'rework','the newest answer by time stays current');
 assert.equal(answer.conflict.answers.length,2);
 assert.deepEqual(JSON.parse(JSON.stringify(answer.conflict.answers.map(entry=>entry.verdict))).sort(),['confirm','rework'],'both answers stay visible');
 assert.ok(answer.history.some(entry=>entry.verdict==='confirm'),'the other answer is kept in history');
 const view=board.mergeBoard(root).items[0];
 assert.equal(view.answerConflict.answers.length,2);
 assert.match(view.answerConflict.message,/answer again/i);
 assert.throws(()=>board.recordAnswer(root,'GB-0001',{verdict:'confirm',note:'',itemRevision:1,expectedAnswerAt:first.at}),/stale/,'a write against the older answer is refused');
 const resolved=board.recordAnswer(root,'GB-0001',{verdict:'confirm',note:'Settled',itemRevision:1,expectedAnswerAt:newer.at});
 assert.equal(board.readAnswers(root).answers['GB-0001'].conflict,undefined,'answering again resolves the conflict');
 assert.equal(board.readAnswers(root).answers['GB-0001'].at,resolved.at);
 // The workflow's own fallback reader chains the same way.
 const fallback=createWorkflow(root,{readItems:board.readItems}).read();
 assert.equal(fallback.cards['GB-0001'].state,'confirmed');
});

test('the page shows an answer conflict and asks the owner to answer again',()=>{
 const {model}=pageModel();
 const item={id:'GB-0001',revision:1,derivedStatus:'answered',answerConflict:{message:'Two answers were saved without one following the other. Answer again to settle it.',answers:[{verdict:'confirm',note:'',at:'2026-10-08T10:00:00Z'},{verdict:'rework',note:'Plainer',at:'2026-10-08T10:01:00Z'}]}};
 const html=model.conflictNotice(item);
 assert.match(html,/Answer again/);
 assert.match(html,/2026-10-08T10:00:00Z[\s\S]*2026-10-08T10:01:00Z/);
 assert.equal(model.conflictNotice({...item,answerConflict:undefined}),'');
});

test('the served page refuses to be framed by another page',async()=>{
 const root=notepadRoom();
 fs.copyFileSync(new URL('../workbench/grill-board/index.html',import.meta.url),board.boardPaths(root).page);
 const served=await serve(root,{dashboardRoute:null});
 try{
  for (const route of ['/','/index.html']){
   const response=await fetch(served.base+route);
   assert.equal(response.status,200);
   assert.equal(response.headers.get('x-frame-options'),'DENY');
   assert.match(response.headers.get('content-security-policy')||'',/frame-ancestors 'none'/);
  }
 }finally{await served.close();}
});

// ---- An open answer conflict is visible to agents and blocks every action. ----
function conflictedRoom() {
 const root=notepadRoom();
 const change=board.recordAnswer(root,'GB-0001',{verdict:'change',note:'Drop it entirely',itemRevision:1});
 // An old server, still writing answers.json, records a newer Confirm.
 const confirm={verdict:'confirm',note:'',at:new Date(Date.parse(change.at)+60000).toISOString(),itemRevision:1,history:[]};
 fs.writeFileSync(board.boardPaths(root).answers,JSON.stringify({schema:board.ANSWERS_SCHEMA,owner:'Kayden',answers:{'GB-0001':confirm}}));
 return {root,change,confirm};
}

test('an open answer conflict is reported to agents and refused by apply, rounds and promotion',()=>{
 const {root,change,confirm}=conflictedRoom();
 const pending=board.pendingForAgents(root).find(item=>item.id==='GB-0001');
 assert.ok(pending.conflict,'pending carries the conflict');
 assert.deepEqual(JSON.parse(JSON.stringify(pending.conflict.answers.map(answer=>answer.verdict))),['change','confirm']);
 assert.match(board.statusSummary(root).conflicts.join(','),/GB-0001/);
 assert.ok(board.mergeBoard(root).items[0].answerConflict,'show includes the conflict');
 assert.throws(()=>board.applyAnswer(root,'GB-0001',{by:'agent',where:'nowhere'}),e=>e.code==='answer-conflict');
 // A conflicted confirmation that otherwise carries a valid snapshot is still not confirmed.
 const answers=JSON.parse(fs.readFileSync(board.boardPaths(root).answers,'utf8'));
 const item=board.readItems(root).items[0];
 answers.answers['GB-0001'].approval=JSON.parse(JSON.stringify(board.mergeBoard(notepadRoomWithConfirm(item)).items[0].answer.approval));
 answers.answers['GB-0001'].approval.confirmedAt=confirm.at;
 fs.writeFileSync(board.boardPaths(root).answers,JSON.stringify(answers));
 const flow=board.workflow(root);
 const state=flow.read();
 assert.equal(state.cards['GB-0001'].state,'answer-conflict');
 assert.match(state.cards['GB-0001'].label,/answer again/i);
 const round=flow.endRound({actionId:'r-conflict',expectedRevision:state.revision});
 assert.deepEqual(JSON.parse(JSON.stringify(round.round.confirmed)),[],'a round does not count a contested confirmation');
 assert.throws(()=>flow.promote({ids:['GB-0001'],revisions:{'GB-0001':1},actionId:'p-conflict',expectedRevision:round.revision}),/answer-conflict/);
 assert.ok(change);
});
function notepadRoomWithConfirm(item) {
 const other=notepadRoom();
 board.recordAnswer(other,'GB-0001',{verdict:'confirm',note:'',itemRevision:item.revision});
 return other;
}

test('re-saving the current answer settles an open conflict over the HTTP path',async()=>{
 const root=notepadRoom();
 const served=await serve(root,{dashboardRoute:null});
 const put=body=>fetch(`${served.base}/api/answers/GB-0002`,{method:'PUT',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
 try{
  const rework=await (await put({verdict:'rework',note:'Plainer',itemRevision:1})).json();
  const change={verdict:'change',note:'Narrow it',at:new Date(Date.parse(rework.at)+60000).toISOString(),itemRevision:1,history:[]};
  fs.writeFileSync(board.boardPaths(root).answers,JSON.stringify({schema:board.ANSWERS_SCHEMA,owner:'Kayden',answers:{'GB-0002':change}}));
  assert.ok(board.readAnswers(root).answers['GB-0002'].conflict);
  const again=await put({verdict:'change',note:'Narrow it',itemRevision:1,expectedAnswerAt:change.at});
  assert.equal(again.status,200);
  const body=await again.json();
  assert.notEqual(body.at,change.at,'a fresh entry is recorded');
  assert.equal(body.conflict,undefined);
  assert.equal(board.readAnswers(root).answers['GB-0002'].conflict,undefined,'the conflict is settled');
  assert.equal(board.readAnswers(root).answers['GB-0002'].verdict,'change');
 }finally{await served.close();}
});

test('a legacy full-history notepad entry never silently overrides a newer answer',()=>{
 const base={'GB-0001':{verdict:'rework',note:'newer, from answers.json',at:'2026-10-08T12:00:00.000Z',itemRevision:1,history:[]}};
 const legacyEntry={id:'GB-0001',answer:{verdict:'confirm',note:'older full-format entry',at:'2026-10-08T11:00:00.000Z',itemRevision:1,history:[]}};
 const chained=chainAnswers(base,[legacyEntry])['GB-0001'];
 assert.equal(chained.verdict,'rework','the newer answer stays current');
 assert.ok(chained.conflict);
 assert.ok(chained.history.some(entry=>entry.verdict==='confirm'),'the older answer is kept');
 // A legacy entry that does follow the answer before it chains as before.
 const follows={id:'GB-0001',answer:{verdict:'confirm',note:'next',at:'2026-10-08T13:00:00.000Z',itemRevision:1,history:[{...base['GB-0001'],history:undefined}].map(({history,...rest})=>rest)}};
 const ok=chainAnswers(base,[follows])['GB-0001'];
 assert.equal(ok.verdict,'confirm');
 assert.equal(ok.conflict,undefined);
});

test('an entry whose superseded answer is missing (a trimmed notepad) is reported, never silently chained',()=>{
 const entry={schema:'dashboard-answer@2',id:'GB-0001',answer:{verdict:'confirm',note:'',at:'2026-10-08T12:00:00.000Z',itemRevision:1},supersedes:{at:'2026-10-08T11:00:00.000Z',hash:'a'.repeat(64)}};
 const chained=chainAnswers({},[entry])['GB-0001'];
 assert.equal(chained.verdict,'confirm');
 assert.match(chained.conflict.message,/missing|not found/i);
 const after={schema:'dashboard-answer@2',id:'GB-0001',answer:{verdict:'rework',note:'x',at:'2026-10-08T13:00:00.000Z',itemRevision:1},supersedes:{at:'2026-10-08T11:30:00.000Z',hash:'b'.repeat(64)}};
 const two=chainAnswers({},[entry,after])['GB-0001'];
 assert.equal(two.verdict,'rework');
 assert.ok(two.conflict,'an entry that does not follow the answer before it is a conflict');
});

test('the page names an open answer conflict as the reason promotion is unavailable',()=>{
 const {model}=pageModel();
 const item={id:'GB-0001',revision:1,status:'open',controls:board.answerControls({kind:'owner-decision',options:null}),answer:{verdict:'confirm',note:'',itemRevision:1,approval:{hash:'x'}},answerConflict:{message:'conflict',answers:[]}};
 model.state.board={items:[item]};
 model.state.workflow={comments:[],requests:[],cards:{'GB-0001':{state:'answer-conflict',label:'Answer conflict: answer again to settle it'}}};
 assert.match(model.promotionBlocker(item),/conflict.*Answer again/i);
 assert.deepEqual(model.confirmedItems().map(entry=>entry.id),[]);
});
