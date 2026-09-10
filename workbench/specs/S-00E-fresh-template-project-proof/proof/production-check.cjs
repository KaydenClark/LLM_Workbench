const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
(async()=>{
 const out=process.argv[2];fs.mkdirSync(out,{recursive:true});
 const browser=await chromium.launch({...(process.env.CHROME_EXECUTABLE ? {executablePath:process.env.CHROME_EXECUTABLE} : {}),headless:true});
 const result={url:'http://127.0.0.1:4174/',checks:[]};
 try{
 for(const [name,width,height] of [['desktop',1536,1024],['phone',390,844]]){
  const ctx=await browser.newContext({viewport:{width,height}});const page=await ctx.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  await page.goto(result.url);await page.waitForFunction(()=>[...document.images].every(x=>x.complete&&x.naturalWidth>0));
  const check=await page.evaluate(()=>{const animals=[...document.querySelectorAll('.pond-animal')];const water=document.querySelector('#underwater').getBoundingClientRect();return {puffers:document.querySelectorAll('.pond-animal--puffer').length,snails:document.querySelectorAll('.pond-animal--snail').length,noOverflow:document.documentElement.scrollWidth===innerWidth&&document.documentElement.scrollHeight===innerHeight,underwater:animals.every(x=>x.getBoundingClientRect().top>=water.top),visible:animals.every(x=>{const r=x.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.bottom<=innerHeight}),credit:document.querySelector('.pond-scene__credit a').getAttribute('href')}});
  assert.equal(check.puffers,5);assert.equal(check.snails,2);assert.ok(check.noOverflow&&check.underwater&&check.visible);
  const credit=await page.request.get(new URL(check.credit,result.url).href);assert.equal(credit.status(),200,'credit target must ship in the production build');
  assert.match(await credit.text(),/MIT License/);assert.deepEqual(errors,[]);
  await page.screenshot({path:path.join(out,`${name}.png`)});
  await page.emulateMedia({reducedMotion:'reduce'});const paused=await page.locator('.pond-animal').evaluateAll(nodes=>nodes.every(x=>getComputedStyle(x).animationName==='none'||getComputedStyle(x).animationPlayState==='paused'));assert.ok(paused);
  result.checks.push({name,width,height,...check,creditStatus:credit.status(),browserErrors:errors,reducedMotionPaused:paused});await ctx.close();
 }
 result.passed=true;fs.writeFileSync(path.join(out,'result.json'),JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result));
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
