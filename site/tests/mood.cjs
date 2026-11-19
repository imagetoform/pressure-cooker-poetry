// Homepage questions, seeded editorial renderer and public links.
// Run against site/public on port 8765. Independently tests all 4 interaction steps.
const {chromium}=require('playwright');
const BASE=process.env.PCP_BASE||'http://127.0.0.1:8765';
const fails=[];const check=(ok,msg)=>{if(!ok)fails.push(msg)};
(async()=>{
 const b=await chromium.launch();
 for(const width of [320,390,1280]){
  const c=await b.newContext({viewport:{width,height:800},reducedMotion:'reduce'});
  const p=await c.newPage();const errors=[],missing=[];
  p.on('pageerror',e=>errors.push(e.message));
  p.on('response',r=>{if(r.url().startsWith(BASE)&&r.status()>=400)missing.push(r.status()+' '+r.url())});
  await p.goto(BASE+'/');await p.waitForSelector('.answer');
  check((await p.locator('.answer').count())===6,width+': six meaningful answers appear');
  check((await p.locator('.question-copy h2').textContent()).includes('weather'),width+': questions are the entrance');
  for(let i=0;i<4;i++){await p.locator('.answer').nth(i===2?1:0).click()}
  await p.waitForSelector('.world-title');check((await p.locator('.stage-art').count())>=6,width+': real image cutouts populate the composition');
  const src=await p.locator('.stage-art').first().getAttribute('src');
  check(src.startsWith('/assets/cutouts/'),width+': images come from the library');
  check((await p.locator('.door').count())===4,width+': published rooms accessible');
  const before=await p.evaluate(()=>({art:[...document.querySelectorAll('.stage-art')].map(n=>n.src),title:document.querySelector('.world-title').textContent,grammar:document.querySelector('.world').className}));
  const link=p.url();await p.reload();await p.waitForSelector('.world-title');
  const after=await p.evaluate(()=>({art:[...document.querySelectorAll('.stage-art')].map(n=>n.src),title:document.querySelector('.world-title').textContent,grammar:document.querySelector('.world').className}));
  check(JSON.stringify(before)===JSON.stringify(after),width+': same link restores composition');
  await p.click('#remix');await p.waitForSelector('.world-title');check(p.url()!==link,width+': remix creates new seed revision');
  check(await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=1,width+': no horizontal overflow');
  check(errors.length===0,width+': errors '+errors.join(' | '));
  check(missing.length===0,width+': missing '+missing.join(' | '));
  if(width===390)await p.screenshot({path:'shots/mood-390.png',fullPage:true});
  await c.close();
 }
 await b.close();
 if(fails.length){console.error('FAIL:\n - '+fails.join('\n - '));process.exit(1)}
 console.log('PASS: mood front door / 4 steps, assets, seeded worlds, responsive and linked rooms');
})().catch(e=>{console.error(e);process.exit(1)});
