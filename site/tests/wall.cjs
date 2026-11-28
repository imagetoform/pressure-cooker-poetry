// Browser checks for the paste-up wall sandbox (/lab/wall/): every skeleton at 1280, 390 and 320 wide keeps the five
// doors and the eye, never scrolls sideways, throws nothing; same seed = same page; reduced motion = no animation;
// only library cutouts are used. Serve site/public on :8765 first.
const {chromium}=require('playwright');const B=process.env.PCP_BASE||'http://127.0.0.1:8765';
const SK=["blowup","wall","spine","grid","table","bands","ransom"];const DOORS=["/brain-candy/","/my-two-cents/","/about/","/learning/","/contact/"];
let fail=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fail++};
(async()=>{const br=await chromium.launch();
for(const vp of [{width:1280,height:820},{width:390,height:844},{width:320,height:640}]){
 const p=await br.newPage({viewport:vp});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 for(const k of SK){await p.goto(B+'/lab/wall/?seed=t-'+k+'&skel='+k);await p.waitForTimeout(500);
  const r=await p.evaluate(()=>({hrefs:[...document.querySelectorAll('nav[aria-label="Main"] a')].map(a=>a.getAttribute('href')),
   eye:!!document.querySelector('a.secret-eye[href="/the-eye/"][aria-label]'),wide:document.documentElement.scrollWidth>innerWidth+1,
   srcs:[...document.querySelectorAll('#wall img')].map(i=>new URL(i.src).pathname).concat([...document.querySelectorAll('[style*="url("]')].map(e=>(e.style.backgroundImage.match(/url\("?([^")]+)/)||[])[1]).filter(Boolean)),
   h1:document.querySelectorAll('h1').length}));
  ok(DOORS.every(d=>r.hrefs.includes(d)),vp.width+' '+k+': five doors');ok(r.eye,vp.width+' '+k+': hidden eye link');
  ok(!r.wide,vp.width+' '+k+': no sideways scroll');ok(r.h1===1,vp.width+' '+k+': one h1');
  ok(r.srcs.length>2&&r.srcs.every(s=>s.startsWith('/assets/cutouts/')),vp.width+' '+k+': only library cutouts ('+r.srcs.length+')')}
 ok(!errs.length,vp.width+': no page errors '+errs.join('; '));await p.close()}
const p=await br.newPage({viewport:{width:900,height:700},reducedMotion:'reduce'});
const sig=()=>p.evaluate(()=>[...document.querySelectorAll('[data-piece]')].map(e=>e.dataset.piece+e.style.left).join());
await p.goto(B+'/lab/wall/?seed=same');await p.waitForTimeout(400);const a=await sig();await p.reload();await p.waitForTimeout(400);
ok(a===await sig(),'same seed draws the same page');ok(await p.evaluate(()=>document.getAnimations().filter(x=>x.playState==='running').length)===0,'reduced motion: nothing animates');
const seen=new Set();for(let i=0;i<14;i++){await p.goto(B+'/lab/wall/?seed=v'+i);seen.add(await p.evaluate(()=>document.querySelector('.stage').className.match(/sk-\w+/)[0]))}
ok(seen.size>=5,'14 seeds reach '+seen.size+' skeletons');
await p.goto(B+'/lab/wall/?sheet=1&s0=ci');await p.waitForTimeout(800);ok(await p.locator('.frame iframe').count()===12,'contact sheet shows 12 editions');
await br.close();console.log(fail?fail+' FAILED':'wall: all checks passed');process.exit(fail?1:0)})();
