// Browser checks for the Cut-Up Bench (/brain-candy/#cutup-bench): plays it with a mouse on desktop and with real
// touch events on a phone — knife tap/strip/re-cut/split, glue stick, Hand drags, marker, every source. Serve site/public on :8765 first.
const {chromium}=require('playwright');const B=process.env.PCP_BASE||'http://127.0.0.1:8765';const S=(process.env.PCP_SHOTS||'shots')+'/';require('fs').mkdirSync(S,{recursive:true});
const freeWord=async(p,test,k=0)=>p.evaluate(([src,k])=>{const t=new Function('w','return ('+src+')(w)');let n=0;const ws=[...document.querySelectorAll('.page .wd')];for(let i=0;i<ws.length;i++){const w=ws[i];if(w.classList.contains('cut')||!t(w))continue;w.scrollIntoView({block:'center'});const r=w.getBoundingClientRect();const e=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);if(e===w&&n++===k)return i}return -1},[test.toString(),k]);
const out=[];const ok=(log,c,m)=>{log.push((c?'ok ':'FAIL ')+m)};
async function touchDrag(p,cdp,a,b,steps=12){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:a.x,y:a.y}]});for(let i=1;i<=steps;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:a.x+(b.x-a.x)*i/steps,y:a.y+(b.y-a.y)*i/steps}]});await p.waitForTimeout(16)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(120)}
(async()=>{const br=await chromium.launch();
for(const [name,vp,touch] of [['desk',{width:1280,height:900},false],['phone',{width:390,height:844},true]]){
 const ctx=await br.newContext({viewport:vp,hasTouch:touch,isMobile:touch});const p=await ctx.newPage();const log=[],errs=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 const cdp=touch?await ctx.newCDPSession(p):null;
 const tap=async(x,y)=>touch?p.touchscreen.tap(x,y):p.mouse.click(x,y);
 const drag=async(a,b)=>{if(touch)return touchDrag(p,cdp,a,b);await p.mouse.move(a.x,a.y);await p.mouse.down();await p.mouse.move(b.x,b.y,{steps:14});await p.mouse.up();await p.waitForTimeout(120)};
 const tool=async n=>{await p.locator('.tool',{hasText:n}).click();await p.waitForTimeout(80)};
 const box=async l=>{await l.scrollIntoViewIfNeeded();return l.boundingBox()};
 await p.goto(B+'/brain-candy/#cutup-bench');await p.waitForSelector('.page .wd');await p.waitForTimeout(600);
 const groups=await p.$$eval('#src optgroup',g=>g.map(x=>x.label+':'+x.children.length));ok(log,groups.some(g=>g.startsWith('My Two Cents')),'site writing in the menu: '+groups.join(' | '));
 const head=await p.locator('.page .head').textContent();ok(log,true,'opened on: '+head);
 // knife tap a short word
 await tool('Knife');let W=p.locator('.page .wd');
 const shortI=await p.$$eval('.page .wd',ws=>ws.findIndex(w=>w.textContent.replace(/\W/g,'').length>=1&&w.textContent.length<=3));
 let r=await box(W.nth(shortI));const wordText=await W.nth(shortI).textContent();await tap(r.x+r.width/2,r.y+r.height/2);await p.waitForTimeout(250);
 let sc=await p.locator('.scrap').allTextContents();ok(log,sc.includes(wordText),'knife tap cut "'+wordText+'" -> pieces '+JSON.stringify(sc));
 const sb=await p.locator('.scrap').first().boundingBox();ok(log,sb&&sb.y>0&&sb.y<vp.height,'cut piece is on screen where it was cut (y='+(sb&&Math.round(sb.y))+')');
 ok(log,await W.nth(shortI).evaluate(e=>e.classList.contains('cut')),'the page shows a hole where the word was');
 // knife strip: drag across the next line's words
 const li=await p.$$eval('.page p',ps=>ps.findIndex((p,i)=>i>0&&p.querySelectorAll('.wd:not(.cut)').length>=4));
 const lw=p.locator('.page p').nth(li).locator('.wd');const a=await box(lw.nth(0)),b=await box(lw.nth(3));
 await drag({x:a.x+2,y:a.y+a.height/2},{x:b.x+b.width-2,y:b.y+b.height/2});
 sc=await p.locator('.scrap').allTextContents();const strip=sc.find(t=>t.split(' ').length>=3);ok(log,!!strip,'knife drag cut a strip: "'+strip+'"');
 // knife on the strip splits it
 const sl=p.locator('.scrap',{hasText:strip}).first();let srect=await box(sl);await tap(srect.x+srect.width*0.5,srect.y+srect.height/2);await p.waitForTimeout(200);
 sc=await p.locator('.scrap').allTextContents();ok(log,!sc.includes(strip)&&sc.length>=3,'knife re-cut the strip -> '+JSON.stringify(sc));
 // split a long word into halves, twice
 for(let k=0;k<2;k++){const li2=await freeWord(p,w=>w.textContent.replace(/[^A-Za-z]/g,'').length>=7,0);const wr=await W.nth(li2).boundingBox();await tap(wr.x+wr.width*0.5,wr.y+wr.height/2);await p.waitForTimeout(200)}
 const halves=await p.locator('.scrap.half').allTextContents();ok(log,halves.length>=4,'two long words split into halves: '+JSON.stringify(halves));
 // glue stick: first half of word one + second half of word two
 await tool('Glue stick');const hs=p.locator('.scrap.half');
 const c1=await box(hs.nth(0)),c2=await box(hs.nth(3));const t1=await hs.nth(0).textContent(),t2=await hs.nth(3).textContent();
 await tap(c1.x+c1.width/2,c1.y+c1.height/2);await p.waitForTimeout(100);const c2b=await box(p.locator('.scrap.half',{hasText:t2}).first());await tap(c2b.x+c2b.width/2,c2b.y+c2b.height/2);await p.waitForTimeout(250);
 sc=await p.locator('.scrap').allTextContents();const coined=sc.find(t=>t===t1.replace(/[^\p{L}'’]+$/u,'')+t2.replace(/^[^\p{L}'’]+/u,''));ok(log,!!coined,'glue stick joined "'+t1+'" + "'+t2+'" -> "'+coined+'"');
 // hand: drag four pieces (measure right before each drag; stay inside the screen)
 await tool('Hand');let movedN=0;
 for(let k=0;k<4;k++){const idx=await p.evaluate(k=>{const ss=[...document.querySelectorAll('.scrap')];let n=0;for(let i=0;i<ss.length;i++){ss[i].scrollIntoView({block:'center'});const r=ss[i].getBoundingClientRect();if(document.elementFromPoint(r.left+r.width/2,r.top+r.height/2)?.closest('.scrap')===ss[i]&&n++===k)return i}return 0},k);const pc=p.locator('.scrap').nth(idx);const s0=await pc.getAttribute('style');const bb=await pc.boundingBox();
  const to={x:Math.min(vp.width-60,bb.x+bb.width/2+40+k*25),y:Math.min(vp.height-90,bb.y+bb.height/2+120)};await drag({x:bb.x+bb.width/2,y:bb.y+bb.height/2},to);
  if((await pc.getAttribute('style'))!==s0)movedN++}
 ok(log,movedN===4,'hand dragged '+movedN+'/4 pieces to new spots');
 // long drag past the bottom edge auto-scrolls
 { const pc=p.locator('.scrap').first();await pc.scrollIntoViewIfNeeded();const y0=await p.evaluate(()=>scrollY);const bb=await pc.boundingBox();
   if(!touch){await p.mouse.move(bb.x+bb.width/2,bb.y+bb.height/2);await p.mouse.down();await p.mouse.move(bb.x+bb.width/2,vp.height-20,{steps:8});for(let i=0;i<25;i++){await p.mouse.move(bb.x+bb.width/2+(i%2),vp.height-20);await p.waitForTimeout(16)}await p.mouse.up()}
   else{await touchDrag(p,cdp,{x:bb.x+bb.width/2,y:bb.y+bb.height/2},{x:bb.x+bb.width/2,y:vp.height-20},8);}
   const y1=await p.evaluate(()=>scrollY);ok(log,touch||y1>y0+50,'dragging at the bottom edge scrolls the page ('+Math.round(y0)+' -> '+Math.round(y1)+')') }
 await p.screenshot({path:S+'bench2-'+name+'-table.png'});
 // marker drag on another line
 await tool('Marker');const li3=await p.evaluate(()=>{const ps=[...document.querySelectorAll('.page p')];for(let i=3;i<ps.length;i++){const ws=[...ps[i].querySelectorAll('.wd')].slice(0,4);if(ws.length<4||ws.some(w=>w.classList.contains('cut')))continue;ps[i].scrollIntoView({block:'center'});if(ws.every(w=>{const r=w.getBoundingClientRect();return document.elementFromPoint(r.left+r.width/2,r.top+r.height/2)===w}))return i}return -1});
 const mw=p.locator('.page p').nth(li3).locator('.wd');const m1=await mw.nth(0).boundingBox(),m2=await mw.nth(3).boundingBox();
 await drag({x:m1.x+2,y:m1.y+m1.height/2},{x:m2.x+m2.width-2,y:m2.y+m2.height/2});
 const blacks=await p.locator('.page .wd.black').count();ok(log,blacks>=4,'marker blacked out '+blacks+' words');
 const made=await p.locator('.found').innerText();ok(log,made.trim().length>0,'What you made: '+JSON.stringify(made.slice(0,120)));
 const goals=(await p.locator('.goals li.done').allTextContents()).map(g=>g.replace('✓','').split('.')[0]);ok(log,goals.includes('Cut-up')&&goals.includes('Strip')&&goals.includes('Coinage'),'commissions done: '+goals.join(', '));
 // sources: a speech, a poem pick, own words, link pull (same site + an external that must fail politely)
 await p.selectOption('#src',{label:'Lincoln, Gettysburg Address (1863)'});await p.waitForTimeout(200);ok(log,(await p.locator('.page').innerText()).includes('Four score and seven years ago'),'speech loads (Lincoln)');
 await p.getByRole('button',{name:'Random poem'}).click();await p.waitForTimeout(200);ok(log,(await p.locator('.page .credit').textContent()).includes('My Two Cents'),'random poem from the site: '+(await p.locator('.page .head').textContent()));
 await p.getByRole('button',{name:'Paste'}).click();await p.fill('textarea[aria-label="Your own words"]','my landlord texted at midnight about the rent again');await p.getByRole('button',{name:'Put it on the bench'}).click();await p.waitForTimeout(150);ok(log,(await p.locator('.page').innerText()).includes('landlord texted'),'own words load');
 await p.getByRole('button',{name:'Link',exact:true}).click();await p.fill('input[type=url]',B+'/essays/mailman-and-drill-sergeant/');await p.getByRole('button',{name:'Pull the text'}).click();await p.waitForTimeout(800);
 const lt=await p.locator('.page').innerText();ok(log,lt.includes('Bukowski')&&!lt.includes('Sources\n'),'link pull from the site works ('+lt.split(/\s+/).length+' words)');
 await p.getByRole('button',{name:'Link',exact:true}).click();await p.fill('input[type=url]','https://example.com/some-speech');await p.getByRole('button',{name:'Pull the text'}).click();await p.waitForTimeout(1500);
 const msg=await p.locator('[role=status]').allTextContents();ok(log,msg.some(m=>m.includes('paste')),'external link that refuses -> honest message');
 await p.screenshot({path:S+'bench2-'+name+'-end.png'});
 const wide=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);ok(log,!wide,'no sideways scroll');
 out.push({name,log,errs:errs.filter(e=>!/example\.com|ERR_|Failed to fetch|CORS|Access-Control/.test(e)),rawErrs:errs.length});await ctx.close()}
await br.close();const bad=out.flatMap(o=>[...o.log.filter(l=>l.startsWith('FAIL')).map(l=>o.name+': '+l),...o.errs.map(e=>o.name+': page error '+e)]);if(bad.length){console.error(bad.join('\n'));process.exit(1)}console.log('PASS cutup-bench: '+out.map(o=>o.name+' '+o.log.length+' checks').join(', '))})().catch(e=>{console.error('CRASH',e.message);process.exit(1)});
