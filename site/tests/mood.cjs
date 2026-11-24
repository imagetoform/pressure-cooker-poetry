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
  check(await p.locator('.pressure-transition').count()===1,width+': transition follows final answer');
  await p.waitForSelector('.world-title');
  const catalog = await p.evaluate(() => PCP.cutupData.assets.map(a => a.src));
  const displayed = await p.locator('.stage-art').evaluateAll(nodes => nodes.map(n => n.getAttribute('src')));
  check(displayed.length >= Math.min(6,catalog.length) && displayed.every(src => catalog.includes(src)),width+': only active cutouts appear');
  check((await p.locator('.door').count())===5,width+': all five canonical destinations present');
  for(const title of ['Brain Candies','My Two Cents','Contact','Mission Statement','Learning Curve']) check(await p.locator('.door', {hasText:title}).count()===1,width+': destination '+title);
  check(await p.locator('.secret-eye[href="/the-eye/"]').count()===1,width+': eye exists in generated world');
  check(await p.locator('#audio-mic').count()===1 && await p.locator('#hold-still').count()===1,width+': audio opt-in and still controls present');
  check(await p.locator('.world[data-layout]').count()===1,width+': seed-specific structural composition exists');
  // Paste-up layer: torn paper with print-marks is the art while the cutout library is empty (Nov 19 reset).
  check(await p.locator('.stage-scrap').count()>=4,width+': paste-up scraps fill the stage');
  check(await p.locator('.stage-scrap.alive-piece').count()===await p.locator('.stage-scrap').count(),width+': every scrap is a live, movable piece');
  const split=await p.evaluate(()=>{const t=document.querySelector('.world-title');return [...t.querySelectorAll('.fit-word')].filter(w=>w.getBoundingClientRect().right>innerWidth||w.getClientRects().length>1).map(w=>w.textContent)});
  check(split.length===0,width+': headline words never split or run off screen ('+split.join(',')+')');
  const before=await p.evaluate(()=>({art:[...document.querySelectorAll('.stage-art')].map(n=>n.src),title:document.querySelector('.world-title').textContent,grammar:document.querySelector('.world').className,paste:[...document.querySelectorAll('.stage-scrap')].map(n=>n.dataset.family+':'+n.dataset.mark+':'+n.textContent)}));
  const link=p.url();await p.reload();await p.waitForSelector('.world-title');
  const after=await p.evaluate(()=>({art:[...document.querySelectorAll('.stage-art')].map(n=>n.src),title:document.querySelector('.world-title').textContent,grammar:document.querySelector('.world').className,paste:[...document.querySelectorAll('.stage-scrap')].map(n=>n.dataset.family+':'+n.dataset.mark+':'+n.textContent)}));
  check(JSON.stringify(before)===JSON.stringify(after),width+': same link restores composition');
  await p.click('#remix');await p.waitForSelector('.world-title');check(p.url()!==link,width+': remix creates new seed revision');
  const over=await p.evaluate(()=>({px:document.documentElement.scrollWidth-innerWidth,offenders:[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect();return r.right>innerWidth+1&&getComputedStyle(el).position!=='absolute'}).slice(0,6).map(el=>el.tagName+'.'+String(el.className).slice(0,65))}));
  check(over.px<=1,width+': no horizontal overflow ('+JSON.stringify(over)+')');
  check(errors.length===0,width+': errors '+errors.join(' | '));
  check(missing.length===0,width+': missing '+missing.join(' | '));
  if(width===390)await p.screenshot({path:'shots/mood-390.png',fullPage:true});
  await c.close();
 }
 // D-42: distinct visitor signals/seeds must produce distinct artworks AND different page structures.
 // Structural diversity is not artistic QA; it prevents accidentally collapsing back to one fixed template.
 const context=await b.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'});
 const worldPage=await context.newPage(), signatures=new Set(), structures=new Set();
 const variants=[[0,1,0,2],[1,4,2,0],[2,2,1,2],[3,3,1,1],[4,0,2,1],[5,5,3,0],[0,3,0,1],[2,4,1,2],[5,0,3,2],[3,1,1,0]];
 for(let i=0;i<variants.length;i++){
  const receipt=Buffer.from(JSON.stringify({p:variants[i],s:'architecture-'+String(i).padStart(2,'0'),r:i%3})).toString('base64');
  await worldPage.goto(BASE+'/#world='+encodeURIComponent(receipt));
  await worldPage.waitForSelector('.world-title');
  const view=await worldPage.evaluate(()=>({
    layout:document.querySelector('.world').dataset.layout,
    grammar:document.querySelector('.world').className.match(/grammar-([a-z-]+)/)?.[1],
    headline:document.querySelector('.world-title').textContent,
    art:[...document.querySelectorAll('.stage-art')].map(n=>n.getAttribute('src')),
    paste:[...document.querySelectorAll('.stage-scrap')].map(n=>n.dataset.mark+':'+n.textContent)
  }));
  signatures.add(JSON.stringify(view));structures.add(view.layout);
  check(await worldPage.locator('.door').count()===5,'variant '+i+': fixed destinations survive generation');
  check(await worldPage.locator('.secret-eye').count()===1,'variant '+i+': eye survives generation');
 }
 check(signatures.size===variants.length,'different answers and seeds produce different complete designs ('+signatures.size+'/'+variants.length+')');
 check(structures.size>=3,'ten editions must use at least three structural grammars (saw '+[...structures].join(', ')+')');
 await context.close();
 await b.close();
 if(fails.length){console.error('FAIL:\n - '+fails.join('\n - '));process.exit(1)}
 console.log('PASS: mood front door / 4 steps, assets, seeded worlds, responsive and linked rooms');
})().catch(e=>{console.error(e);process.exit(1)});
