const {chromium,devices}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.PCP_TEST_URL||'http://127.0.0.1:8765';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 const errors=[],broken=[];fs.mkdirSync('shots',{recursive:true});
 try{
 for(const [name,options] of [['desktop',{viewport:{width:1440,height:1000}}],['android',{...devices['Pixel 7']}],['small-mobile',{viewport:{width:320,height:740},isMobile:true,hasTouch:true}]]){
  const context=await browser.newContext({...options,reducedMotion:'reduce',acceptDownloads:true});const page=await context.newPage();
  page.on('pageerror',e=>errors.push(name+': '+e.message));page.on('response',r=>{if(r.url().startsWith(base)&&r.status()>=400)broken.push(r.url()+' '+r.status());});
  await page.goto(base);await page.waitForSelector('.vp-tile');
  assert.equal(await page.locator('.vp-tile').count(),10);assert.equal(await page.locator('#vp-next').isDisabled(),true);
  await page.screenshot({path:`shots/visual-${name}.png`,fullPage:true});
  const ids=[];
  for(let round=0;round<3;round++){
   const tiles=await page.locator('.vp-tile').evaluateAll(es=>es.map(e=>e.dataset.family));ids.push(...tiles);
   const button=page.locator('.vp-tile').nth(round);await button.focus();await page.keyboard.press('Space');
   assert.equal(await button.getAttribute('aria-pressed'),'true');
   if(round===1){await page.locator('#vp-back').click();assert.equal(await page.locator('.vp-tile[aria-pressed=true]').count(),1);await page.locator('#vp-next').click();assert.equal(await page.locator('.vp-tile[aria-pressed=true]').count(),1);}
   await page.locator('#vp-next').click();
  }
  assert.equal(new Set(ids).size,30);await page.waitForSelector('#vp-room .room');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${name} horizontal overflow`);
  const before=await page.evaluate(()=>JSON.stringify(PCP.visualCurrent.genome)),receipt=await page.evaluate(()=>PCP.visualCurrent.receipt),url=page.url();
  await page.reload();await page.waitForSelector('#vp-room .room');assert.equal(await page.evaluate(()=>JSON.stringify(PCP.visualCurrent.genome)),before,'same seed replay');
  await page.screenshot({path:`shots/room-${name}.png`,fullPage:true});
  await page.locator('#vp-remix').click();const remixed=await page.evaluate(()=>PCP.visualCurrent.receipt);assert.deepEqual(remixed.families,receipt.families);assert.notEqual(remixed.seed,receipt.seed);
  assert.notEqual(await page.evaluate(()=>JSON.stringify(PCP.visualCurrent.genome)),before);
  await page.locator('#vp-local').click();await page.goto(base);await page.locator('#vp-load').click();assert.deepEqual(await page.evaluate(()=>PCP.visualCurrent.receipt),remixed);
  const download=page.waitForEvent('download');await page.locator('#vp-save').click();const file=await download;await file.saveAs(`shots/receipt-${name}.json`);
  await page.locator('#vp-import').setInputFiles(`shots/receipt-${name}.json`);assert.deepEqual(await page.evaluate(()=>PCP.visualCurrent.receipt),remixed);
  await page.locator('#vp-edit').click();assert.equal(await page.locator('.vp-tile[aria-pressed=true]').count(),1);
  await page.goto(base+'/#recipe='+encodeURIComponent(JSON.stringify({...receipt,build:'old-build'})));await page.waitForFunction(()=>document.querySelector('#vp-status').textContent.includes('different engine'));
  assert.equal(await page.locator('#vp-result').isHidden(),true);
  for(const route of ['/poems/','/essays/','/learning/','/about/','/contact/','/learning-curve/','/collage/','/kitchen/']){
   const response=await page.goto(base+route,{waitUntil:'domcontentloaded'});assert.equal(response.status(),200,route);
   await page.waitForLoadState('domcontentloaded');
   if(route==='/poems/'||route==='/essays/'){
    await page.waitForSelector('.entry');const link=await page.locator('.entry a').first().getAttribute('href');await page.locator('#section-search').fill('NO_MATCH_000');assert.equal(await page.locator('.entry').count(),0);await page.goto(base+link);await page.waitForSelector(route==='/poems/'?'.rd-stz':'.es-article');
   }
  }
  // Pure mathematical tests execute against the exact browser-loaded build.
  await page.goto(base);const report=await page.evaluate(()=>{
   const V=PCP.visual,layouts=new Set(),signatures=new Set(),seen=new Set();let allInputs=true;
   const baseIds=['art-nouveau','punk','cyberpunk'];const original=V.compose(V.receipt(baseIds,'fixed'),'wide');
   for(let slot=0;slot<3;slot++){const next=baseIds.slice();next[slot]='minimalism';const c=V.compose(V.receipt(next,'fixed'),'wide');allInputs=allInputs&&JSON.stringify(c.genome)!==JSON.stringify(original.genome);}
   for(let i=0;i<200;i++){
    const pool=V.rounds(String(i));pool.flat().forEach(x=>seen.add(x));if(new Set(pool.flat()).size!==30)throw Error('Invalid deal');
    const r=V.receipt(pool.map(row=>row[i%10]),'variant-'+i),a=V.compose(r,'wide'),b=V.compose(V.decode(V.encode(r)),'wide');
    if(JSON.stringify(a)!==JSON.stringify(b))throw Error('Non-deterministic composition');
    layouts.add(a.genome.family);signatures.add(a.genome.fingerprint);
    const node=PCP.render(a.genome,{poem:a.poem,ingredients:a.ingredients,assets:PCP.assets});
    const text=node.textContent.replace(/\s+/g,' ');for(const stanza of a.poem.stanzas)for(const line of stanza)if(!text.includes(line.replace(/\s+/g,' ')))throw Error('Lost authored line');
   }
   return {families:seen.size,layouts:[...layouts],unique:signatures.size,allInputs};
  });
  assert.equal(report.families,30);assert.equal(report.unique,200);assert.equal(report.allInputs,true);assert.ok(report.layouts.length>=5);console.log(name,report);
  await context.close();
 }
 assert.deepEqual(errors,[]);assert.deepEqual(broken,[]);console.log('PASS: desktop, Pixel 7 emulation, 320px touch; replay/import/save/edit; 600 deterministic compositions; authored text; routes; no page errors or local asset failures.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
