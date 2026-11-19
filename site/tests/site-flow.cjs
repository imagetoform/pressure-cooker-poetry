// Site flow test: front door, Brain Candy hub + bench, reading pages, Food Bank, retired Kitchen links.
// Runs against a static server of site/public (see .github/workflows/site-build.yml).
const {chromium,devices}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const base=process.env.PCP_TEST_URL||'http://127.0.0.1:8765';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||(fs.existsSync('/usr/bin/chromium')?'/usr/bin/chromium':undefined),args:['--no-sandbox']});
 const errors=[],broken=[];fs.mkdirSync('shots',{recursive:true});
 const noOverflow=async(page,label)=>assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,label+' horizontal overflow');
 try{
 for(const [name,options] of [['desktop',{viewport:{width:1440,height:1000}}],['android',{...devices['Pixel 7']}],['small-mobile',{viewport:{width:320,height:740},isMobile:true,hasTouch:true}]]){
  const context=await browser.newContext({...options,reducedMotion:'reduce'});const page=await context.newPage();
  page.on('pageerror',e=>errors.push(name+': '+e.message));
  page.on('response',r=>{const u=r.url();if(u.startsWith(base)&&r.status()>=400)broken.push(u+' '+r.status());});

  // front door: mission + the big door into Brain Candy, no Kitchen
  await page.goto(base+'/');
  assert.match(await page.locator('h1').innerText(),/hungry/i);
  assert.equal(await page.locator('a.door[href="/brain-candy/"]').count(),1);
  assert.equal(await page.locator('nav a[href="/brain-candy/"]').count(),1);
  assert.equal(await page.locator('a[href^="/kitchen"],a[href^="/collage"]').count(),0,'front door still links the Kitchen');
  await noOverflow(page,name+' home');await page.screenshot({path:`shots/home-${name}.png`,fullPage:true});

  // Brain Candy hub -> bench
  await page.locator('a.door').click();await page.waitForURL(/\/brain-candy\/$/);
  assert.equal(await page.locator('.grid a.card').count(),9);await noOverflow(page,name+' hub');
  await page.screenshot({path:`shots/brain-candy-${name}.png`,fullPage:true});
  await page.locator('a.door').click();await page.waitForURL(/\/brain-candy\/bench\/$/);
  await page.waitForFunction(()=>typeof pieces!=="undefined"&&pieces.length===1);
  assert.equal(await page.locator('[data-tool]').count(),6);assert.equal(await page.locator('[data-station]').count(),5);
  assert.ok(await page.evaluate(()=>SOURCES.filter(s=>s.id.startsWith('poem:')).length)>=50,'bench is missing the site poems');
  // knife cut through the page splits it
  await page.evaluate(()=>setTool('knife'));
  const pt=(x,y)=>page.evaluate(([x,y])=>{const r=document.getElementById('stage').getBoundingClientRect();return [r.left+view.ox+x*view.s,r.top+view.oy+y*view.s];},[x,y]);
  const [px]=await page.evaluate(()=>[PAGE.x]);const a2=await pt(px+20,300),b2=await pt(px+580,330);
  await page.mouse.move(...a2);await page.mouse.down();await page.mouse.move(...b2,{steps:12});await page.mouse.up();
  assert.equal(await page.evaluate(()=>pieces.length),2,name+' knife did not cut');
  await page.screenshot({path:`shots/bench-${name}.png`});
  // stations open from deep links and land on the bench
  await page.goto(base+'/brain-candy/bench/#station=n7');await page.waitForSelector('#stDlg:not([hidden])');
  assert.match(await page.locator('#stInfo').innerText(),/nouns swapped/);
  await page.locator('#stGo').click();assert.equal(await page.evaluate(()=>pieces.length),3,'N+7 page did not land on the bench');
  await page.goto(base+'/brain-candy/bench/#station=meso');await page.waitForSelector('#stDlg:not([hidden])');
  await page.screenshot({path:`shots/station-${name}.png`});

  // poems -> plain reading page -> cut this up
  await page.goto(base+'/poems/');await page.waitForSelector('#section-list a.go');
  const href=await page.locator('#section-list a.go').first().getAttribute('href');assert.match(href,/^\/read\/\?poem=/);
  await page.goto(base+href);await page.waitForSelector('.poem-body p');
  const title=await page.locator('h1').innerText();
  await noOverflow(page,name+' poem');await page.screenshot({path:`shots/read-poem-${name}.png`,fullPage:true});
  await page.locator('a.btn.red').click();await page.waitForFunction(()=>typeof sheets!=="undefined"&&sheets.length===1);
  assert.equal((await page.evaluate(()=>sheets[0].name)).toUpperCase(),title.toUpperCase(),'Cut this up did not bring the poem');

  // essays -> reading page with receipts
  await page.goto(base+'/essays/');await page.waitForSelector('#section-list a.go');
  await page.goto(base+await page.locator('#section-list a.go').first().getAttribute('href'));
  await page.waitForSelector('.receipt li');assert.ok(await page.locator('.receipt li').count()>0);
  assert.ok(await page.locator('.essay-body p').count()>3);await noOverflow(page,name+' essay');

  // Food Bank on its own page, aisle links still work
  await page.goto(base+'/food-bank/');await page.waitForSelector('.fb-aisle');
  assert.ok(await page.locator('.fb-can').count()>10);await noOverflow(page,name+' food bank');

  // retired Kitchen: old links forward, bare /kitchen/ explains
  const pid=href.split('=')[1];
  await page.goto(base+'/kitchen/#/read/'+pid);await page.waitForURL(/\/read\/\?poem=/);
  await page.goto(base+'/kitchen/#/food-bank/');await page.waitForURL(/\/food-bank\//);
  await page.goto(base+'/kitchen/');assert.match(await page.locator('h1').innerText(),/closed/i);

  // other pages load with the new nav
  for(const p of ['/about/','/contact/','/learning/']){await page.goto(base+p);assert.equal(await page.locator('a[href="/brain-candy/"]').count()>0,true,p+' missing Brain Candy link');}
  await context.close();
 }
 }finally{await browser.close();}
 assert.deepEqual(errors,[],'page errors:\n'+errors.join('\n'));
 assert.deepEqual(broken,[],'broken requests:\n'+broken.join('\n'));
 console.log('site flow: ok');
})().catch(e=>{console.error(e);process.exit(1);});
