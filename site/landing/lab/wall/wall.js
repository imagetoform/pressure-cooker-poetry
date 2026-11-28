/* PCP paste-up wall — SANDBOX (/lab/wall/). Not linked from visitor pages.
   Brandon's kept cutouts are the whole page: background, structure, doors. Nothing here is
   drawn by code to look like an object (no CSS paper, no fake tape, no stand-in shapes).
   The code only sets type, flat ink colours and where the cutouts go.
   Same seed + same viewport bucket = same page. */
(function(){
"use strict";
const D=window.PCP&&PCP.cutupData;
const ALL=((D&&D.assets)||[]).filter(a=>a&&a.src&&a.s&&a.s[0]>0);
const FAM=(D&&D.families)||{};
const DOORS=[["Brain Candies","/brain-candy/"],["My Two Cents","/my-two-cents/"],["Mission Statement","/about/"],["Learning Curve","/learning/"],["Contact","/contact/"]];
const TITLE=["Pressure","Cooker","Poetry"];
const TAG="Not a machine for producing answers. A machine for multiplying possibilities.";
const RM=matchMedia("(prefers-reduced-motion: reduce)");

/* ---------- seeded randomness ---------- */
function hash(s){let h=1779033703^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=h<<13|h>>>19}return h>>>0}
function rng(seed){let a=hash(String(seed));
 const f=()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
 f.range=(lo,hi)=>lo+f()*(hi-lo);f.int=(lo,hi)=>lo+Math.floor(f()*(hi-lo+1));
 f.pick=x=>x[Math.floor(f()*x.length)];f.chance=p=>f()<p;
 f.weighted=(xs,ws)=>{let t=0;ws.forEach(w=>t+=w);let x=f()*t;for(let i=0;i<xs.length;i++){x-=ws[i];if(x<=0)return xs[i]}return xs[xs.length-1]};
 f.shuffle=x=>{x=x.slice();for(let i=x.length-1;i>0;i--){const j=Math.floor(f()*(i+1));const t=x[i];x[i]=x[j];x[j]=t}return x};
 return f}
const freshSeed=()=>Math.random().toString(36).slice(2,8);

/* ---------- colour (flat inks only) ---------- */
const hx=h=>{h=String(h).replace("#","");if(h.length===3)h=h.split("").map(c=>c+c).join("");return[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)||0)};
const toHex=c=>"#"+c.map(v=>Math.round(Math.max(0,Math.min(255,v))).toString(16).padStart(2,"0")).join("");
const mix=(a,b,t)=>{const A=hx(a),B=hx(b);return toHex(A.map((v,i)=>v+(B[i]-v)*t))};
const lum=h=>{const c=hx(h).map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4)});return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const contrast=(a,b)=>{const x=lum(a),y=lum(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const sat=h=>{const c=hx(h);return(Math.max.apply(0,c)-Math.min.apply(0,c))/255};

/* ---------- the menus the seed draws from ---------- */
const SKELETONS=["blowup","wall","spine","grid","table","bands","ransom"];
const SKELETON_NAMES={blowup:"Blow-up crop",wall:"Wheatpaste wall",spine:"Spine",grid:"Modular grid",table:"Specimen table",bands:"Ribbon bands",ransom:"Ransom cluster"};
const BACKS={tile:"One cutout tiled as wallpaper",blowup:"One cutout xeroxed huge",wheat:"Every surface pasted over",ribbons:"Repeating strips",ground:"Bare ink ground"};
const MOTIONS={drift:"Drift (follows the pointer)",stop:"Stop-motion jitter",breathe:"Slow breath",still:"Still"};
const TYPES={
 tabloid:{d:"Impact,'Anton','Arial Black',sans-serif",b:"Georgia,'Times New Roman',serif",l:"'Courier New',monospace",up:1,name:"Tabloid"},
 poster:{d:"'Anton',Impact,sans-serif",b:"'Archivo',Arial,sans-serif",l:"'Space Mono','Courier New',monospace",up:1,name:"Poster"},
 swiss:{d:"'Archivo',Arial,sans-serif",dw:800,b:"'Archivo',Arial,sans-serif",l:"'Space Mono',monospace",up:0,name:"Grotesk"},
 fell:{d:"'IM Fell English',Georgia,serif",b:"'IM Fell English',Georgia,serif",l:"'Special Elite','Courier New',monospace",up:0,name:"Old face"},
 zine:{d:"'Special Elite','Courier New',monospace",b:"'Special Elite','Courier New',monospace",l:"'Space Mono',monospace",up:1,name:"Typewriter"}
};
const TYPE_LEAN={"art-nouveau":["fell","swiss"],"gothic-revival":["fell","tabloid"],swiss:["swiss","poster"],brutalism:["swiss","poster","tabloid"],
 punk:["tabloid","zine","poster"],"zine-diy":["zine","tabloid","poster"],"pop-art":["poster","tabloid"],dada:["zine","fell","tabloid"],
 surrealism:["fell","swiss"],maximalism:["poster","fell","tabloid"],futurism:["swiss","poster"],cyberpunk:["swiss","poster"]};

/* ---------- plan: every choice, no DOM ---------- */
function plan(seed,W,H,forced){
 forced=forced||{};
 const r=rng("pcp-wall-v1|"+seed);const mobile=W<700;
 const counts={};ALL.forEach(a=>{counts[a.family]=(counts[a.family]||0)+1});
 const fams=Object.keys(counts);
 const f1=r.weighted(fams,fams.map(f=>Math.pow(counts[f],.5)));
 const rest=fams.filter(f=>f!==f1);const f2=rest.length?r.weighted(rest,rest.map(f=>Math.pow(counts[f],.5))):f1;
 const pool=ALL.filter(a=>a.family===f1||a.family===f2),wild=ALL.filter(a=>a.family!==f1&&a.family!==f2);
 // palette: the two families' own inks, flattened to a paper or night ground
 let inks=[].concat((FAM[f1]||{}).colors||[],(FAM[f2]||{}).colors||[]);if(inks.length<2)inks=["#111111","#e8dcc4","#c4161c"];
 const tone=r.chance(.58)?"paper":"night";
 const byL=inks.slice().sort((a,b)=>lum(a)-lum(b));
 let ground,ink;
 if(tone==="paper"){ground=mix(byL[byL.length-1],"#efe8da",r.range(.45,.8));ink=mix(byL[0],"#111111",.55)}
 else{ground=mix(byL[0],"#0c0c0c",r.range(.35,.7));ink=mix(byL[byL.length-1],"#f3efe6",.6)}
 if(contrast(ink,ground)<7)ink=tone==="paper"?"#111111":"#f3efe6";
 const loud=inks.filter(c=>sat(c)>.35&&contrast(c,ground)>=3).sort((a,b)=>sat(b)-sat(a));
 const accent=loud.length?loud[0]:ink;
 const fills=r.shuffle(inks.concat([ground,ink]));
 const skel=forced.skel||r.pick(SKELETONS);
 const backOK={blowup:["tile","wheat","ribbons"],wall:["wheat"],spine:["tile","ribbons","blowup"],grid:["ground"],table:["ground","tile","blowup"],bands:["ribbons"],ransom:["blowup","tile","ground"]}[skel];
 const back=forced.back&&backOK.indexOf(forced.back)>=0?forced.back:r.pick(backOK);
 const motion=forced.motion||r.weighted(Object.keys(MOTIONS),[3,3,2,1]);
 const leanT=TYPE_LEAN[f1]||Object.keys(TYPES);const type=forced.type||(r.chance(.75)?r.pick(leanT):r.pick(Object.keys(TYPES)));
 const doorSkin=r.pick(["index","plain","piece"]);
 return {seed,r,W,H,mobile,f1,f2,pool,wild,tone,ground,ink,accent,inks,fills,skel,back,motion,type,doorSkin};
}

/* ---------- drawing pieces from the library ---------- */
function drawer(P){
 const used=new Set(),pins=new Set(),r=P.r;const pin=a=>a.id.replace(/-\d\d$/,"");
 function draw(filter,weightBy){
  filter=filter||(()=>true);
  const src=r.chance(.86)?P.pool:P.wild;
  const tries=[a=>!used.has(a.id)&&!pins.has(pin(a)),a=>!used.has(a.id),()=>true];
  for(const ok of tries){for(const set of [src,P.pool,ALL]){const c=set.filter(a=>filter(a)&&ok(a));if(c.length){
   const a=weightBy?r.weighted(c,c.map(weightBy)):r.pick(c);used.add(a.id);pins.add(pin(a));return a}}}
  return r.pick(ALL);
 }
 return draw;
}
const asp=a=>a.s[1]/a.s[0];
const isWord=a=>a.k==="lettering",isBody=a=>a.k==="figure"||a.k==="creature";
const big=a=>Math.pow(a.s[0]*a.s[1],1.1);

/* ---------- DOM helpers ---------- */
function el(tag,cls,html){const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let pieceIndex=0;
function pc(a,x,y,w,o){o=o||{};
 const d=el("div","pc"+(o.cls?" "+o.cls:""));
 d.style.cssText="left:"+x.toFixed(1)+"px;top:"+y.toFixed(1)+"px;width:"+w.toFixed(1)+"px;--r:"+(o.r||0).toFixed(2)+"deg;--d:"+(o.d==null?1:o.d)+";--i:"+(pieceIndex++)+";z-index:"+(o.z||1);
 const im=new Image();im.alt="";im.decoding="async";im.src=a.src;im.width=a.s[0];im.height=a.s[1];d.appendChild(im);d.dataset.piece=a.id;return d}
function bgImg(a){return'url("'+a.src+'")'}
function words(P,cls){const T=TYPES[P.type];const h=el("h1","title "+(cls||""));
 TITLE.forEach((w,i)=>{const s=el("span","w w"+i,esc(T.up?w.toUpperCase():w));h.appendChild(s)});return h}
function tagline(P,cls){return el("p","tag "+(cls||""),esc(TAG))}
function doorLinks(P,draw,skin){
 return DOORS.map(([label,href],i)=>{const a=el("a","door door-"+skin);a.href=href;
  if(skin==="index")a.innerHTML='<span class="no">0'+(i+1)+'</span><span class="lb">'+esc(label)+'</span>';
  else if(skin==="piece"){const p=draw(a=>a.k!=="lettering"&&asp(a)<1.6);a.innerHTML='<img alt="" src="'+p.src+'" width="'+p.s[0]+'" height="'+p.s[1]+'"><span class="lb">'+esc(label)+'</span>'}
  else a.innerHTML='<span class="lb">'+esc(label)+'</span>';
  return a});
}
function nav(links,cls){const n=el("nav","doors "+(cls||""));n.setAttribute("aria-label","Main");links.forEach(l=>n.appendChild(l));return n}
function eye(P,stage,x,y){
 const eyes=ALL.filter(a=>/\b(human eye|eye)\b/i.test(a.label)&&!/heart eyes/i.test(a.label));
 const a=P.r.pick(eyes.length?eyes:ALL);const l=el("a","secret-eye");l.href="/the-eye/";l.setAttribute("aria-label","The eye");
 const w=P.mobile?46:64;l.style.cssText="left:"+x+"px;top:"+y+"px;width:"+w+"px";
 l.innerHTML='<img alt="" src="'+a.src+'" width="'+a.s[0]+'" height="'+a.s[1]+'">';stage.appendChild(l)}

/* ---------- background engines (all cutouts) ---------- */
function background(P,draw,stage,W,H){
 const b=el("div","bg bg-"+P.back);stage.appendChild(b);const r=P.r;
 if(P.back==="tile"){const a=draw(a=>a.k!=="lettering"||r.chance(.4));const s=r.range(110,P.mobile?170:250);
  b.style.cssText="background-image:"+bgImg(a)+";background-size:"+s.toFixed(0)+"px auto;--o:"+r.range(.16,.32).toFixed(2);b.dataset.piece=a.id}
 else if(P.back==="blowup"){const a=draw(isBody,big);const w=W*r.range(1.25,1.9);const im=pc(a,W*r.range(-.45,.1),H*r.range(-.25,.05),w,{cls:"xerox",d:.3,z:0});b.appendChild(im)}
 else if(P.back==="ribbons"){const n=r.int(3,6),bh=H/n;for(let i=0;i<n;i++){const a=draw();const h=bh*r.range(.55,.95);const rb=el("div","ribbon");
  const tw=h/asp(a);rb.style.cssText="top:"+(i*bh+(bh-h)/2).toFixed(0)+"px;height:"+h.toFixed(0)+"px;background-image:"+bgImg(a)+";--tw:"+tw.toFixed(0)+"px;--dir:"+(i%2?-1:1)+";--sd:"+r.range(40,90).toFixed(0)+"s";rb.dataset.piece=a.id;b.appendChild(rb)}}
 else if(P.back==="wheat"){if(P.skel!=="wall")b.classList.add("dim");const c=Math.max(110,Math.min(230,W/(P.mobile?3.2:7.5)));const cols=Math.ceil(W/c)+1,rows=Math.ceil(H/c)+1;
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const a=draw();const w=Math.min(c*2.3,Math.sqrt(c*c*r.range(1.3,2.1)/asp(a)));
   b.appendChild(pc(a,i*c+r.range(-.45,.25)*c-w*.15,j*c+r.range(-.45,.25)*c-w*asp(a)*.15,w,{r:r.range(-11,11),d:.4,z:1}))}}
 return b;
}

/* ---------- the seven skeletons ---------- */
const SK={};
SK.blowup=function(P,draw,stage,W){
 const r=P.r,m=P.mobile,H=m?Math.max(P.H*1.75,1100):Math.max(P.H,720);stage.style.height=H+"px";background(P,draw,stage,W,H);
 const a=draw(a=>isBody(a)&&asp(a)>1.05,big);const left=r.chance(.5);
 const w=m?W*1.35:W*r.range(.62,.8);const h=w*asp(a);
 stage.appendChild(pc(a,m?W*r.range(-.35,-.05):(left?W*r.range(-.18,.02):W-w*r.range(.85,1.05)),m?-h*.08:Math.min(-h*.04,(H-h)*r.range(.2,.8)),w,{r:r.range(-4,4),d:1.2,z:3,cls:"hero"}));
 const n=r.int(2,4);for(let i=0;i<n;i++){const s=draw(isWord);const sw=(m?W*.42:W*r.range(.12,.2));
  stage.appendChild(pc(s,m?r.range(0,W-sw):(left?W*r.range(.55,.85):W*r.range(.03,.3)),m?H*r.range(.48,.9):H*r.range(.05,.85),sw,{r:r.range(-14,14),z:4,d:2}))}
 const c=el("div","copy "+(m?"c-bottom":left?"c-right":"c-left"));c.appendChild(words(P,"huge strip"));c.appendChild(tagline(P,"strip-soft"));
 c.appendChild(nav(doorLinks(P,draw,P.doorSkin==="piece"?"index":P.doorSkin),"col"));stage.appendChild(c);
 eye(P,stage,m?W*.78:(left?W*.05:W*.9),m?H*.42:H*.88);
};
SK.wall=function(P,draw,stage,W){
 const r=P.r,m=P.mobile,H=m?Math.max(P.H*1.5,1000):Math.max(P.H*1.12,760);stage.style.height=H+"px";background(P,draw,stage,W,H);
 const pos=m?"c-panel-m":r.pick(["c-panel-l","c-panel-c","c-panel-r"]);
 const c=el("div","copy panel "+pos);c.style.setProperty("--tilt",r.range(-2.2,2.2).toFixed(2)+"deg");
 c.appendChild(words(P,"big"));c.appendChild(tagline(P));c.appendChild(nav(doorLinks(P,draw,P.doorSkin==="piece"?"plain":P.doorSkin),"col"));stage.appendChild(c);
 eye(P,stage,W*r.range(.05,.9),H*r.range(.75,.92));
};
SK.spine=function(P,draw,stage,W){
 const r=P.r,m=P.mobile,H=m?Math.max(P.H*2,1300):Math.max(P.H*1.5,1050);stage.style.height=H+"px";background(P,draw,stage,W,H);
 const cx=m?W*.5:W*r.range(.36,.6);let y=H*.04;const parts=[];
 while(y<H*.92){const a=draw(isWord);const w=(m?W*.62:W*r.range(.17,.27));parts.push(pc(a,cx-w/2+r.range(-.08,.08)*w,y,w,{r:r.range(-7,7),z:2+parts.length%3,d:.9}));y+=w*asp(a)*r.range(.62,.85)}
 parts.forEach(p=>stage.appendChild(p));
 const t=words(P,"vertical strip");const c=el("div","copy c-spine");c.style.left=(m?8:cx+W*.15)+"px";c.appendChild(t);stage.appendChild(c);
 const links=doorLinks(P,draw,P.doorSkin==="plain"?"piece":P.doorSkin);const n=nav(links,"scatter");
 links.forEach((l,i)=>{const side=i%2?1:-1;const top=H*(.14+i*.16);const x=m?(side<0?W*.2:W*.46):(side<0?Math.max(16,cx-W*.42):cx+W*.17);
  l.style.cssText="top:"+top.toFixed(0)+"px;left:"+x.toFixed(0)+"px;--tilt:"+r.range(-3,3).toFixed(1)+"deg"});
 stage.appendChild(n);const tg=tagline(P,"strip-soft c-tag");tg.style.top=(H*.88)+"px";stage.appendChild(tg);
 eye(P,stage,cx+r.range(-.3,.3)*W*.2,H*.95);
};
SK.grid=function(P,draw,stage,W){
 const r=P.r,m=P.mobile;stage.classList.add("is-flow");background(P,draw,stage,W,P.H);
 const cols=m?2:r.pick([4,5,6]);const g=el("div","gridwall");g.style.setProperty("--cols",cols);g.style.setProperty("--gap",r.pick([0,0,4,10])+"px");
 const cells=[];const fill=i=>P.fills[i%P.fills.length];
 const tc=el("div","cell cell-title");tc.style.setProperty("--span",m?2:Math.min(cols,r.pick([2,3])));tc.style.background=P.ground;tc.appendChild(words(P,"big"));cells.push(tc);
 doorLinks(P,draw,P.doorSkin==="piece"?"index":P.doorSkin).forEach((l,i)=>{const c=el("div","cell cell-door");l.classList.add("fill");c.appendChild(l);
  const f=fill(i+2);c.style.background=f;c.style.color=contrast("#111111",f)>contrast("#f3efe6",f)?"#111111":"#f3efe6";cells.push(c)});
 const tg=el("div","cell cell-tag");tg.appendChild(tagline(P));tg.style.setProperty("--span",m?2:2);cells.push(tg);
 const nArt=m?8:cols*3;for(let i=0;i<nArt;i++){const a=draw();const c=el("div","cell cell-art "+(r.chance(.45)?"crop":"whole"));c.style.background=fill(i);
  if(r.chance(.18)&&!m)c.style.setProperty("--span",2);if(r.chance(.15)&&!m)c.style.setProperty("--rows",2);
  c.innerHTML='<img alt="" src="'+a.src+'" width="'+a.s[0]+'" height="'+a.s[1]+'">';c.dataset.piece=a.id;cells.push(c)}
 const fixed=cells.slice(0,7),art=cells.slice(7);const order=r.shuffle(art);
 const at=[0,r.int(2,4),r.int(5,7),r.int(8,10),r.int(11,13),r.int(14,16),r.int(17,19)];
 const out=order.slice();fixed.forEach((c,i)=>out.splice(Math.min(at[i],out.length),0,c));
 out.forEach(c=>g.appendChild(c));
 // one nav landmark around the whole grid; the five door cells sit inside it in reading order
 const wrap=el("nav","doors grid-landmark");wrap.setAttribute("aria-label","Main");wrap.appendChild(g);stage.appendChild(wrap);
 eye(P,stage,W*r.range(.1,.85),r.range(80,300));
};
SK.table=function(P,draw,stage,W){
 const r=P.r,m=P.mobile,H=m?Math.max(P.H*2.2,1500):Math.max(P.H*1.6,1100);stage.style.height=H+"px";background(P,draw,stage,W,H);
 const head=el("div","copy c-label");head.appendChild(words(P,"small"));head.appendChild(tagline(P));stage.appendChild(head);
 const boxes=[[0,0,m?W:W*.45,m?260:220]];const placed=[];const scale=m?[.38,.5,.62,.8]:[.12,.16,.2,.26,.34];
 const links=DOORS.map(([label,href],i)=>{const a=el("a","door door-caption");a.href=href;a.innerHTML='<span class="no">fig. '+(i+1)+'</span> <span class="lb">'+esc(label)+'</span>';return a});
 const n=nav(links,"scatter");
 const N=m?9:r.int(11,15);
 for(let i=0;i<N;i++){const a=draw();const w=W*r.pick(scale)*(isWord(a)?1.1:1);const h=w*asp(a);let ok=false,x=0,y=0;
  for(let t=0;t<60&&!ok;t++){x=r.range(W*.03,W-w-W*.03);y=r.range(m?280:240,H-h-60);ok=boxes.every(b=>x+w<b[0]-18||x>b[0]+b[2]+18||y+h+40<b[1]||y>b[1]+b[3]+18)}
  if(!ok)continue;boxes.push([x,y,w,h+40]);stage.appendChild(pc(a,x,y,w,{r:r.range(-3,3),z:2,d:.8}));placed.push([x,y,w,h])}
 const slots=r.shuffle(placed.map((p,i)=>i)).slice(0,5).sort((a,b)=>placed[a][1]-placed[b][1]);
 links.forEach((l,i)=>{const p=placed[slots[i]];if(!p){l.style.cssText="position:static";return}l.style.cssText="left:"+p[0].toFixed(0)+"px;top:"+(p[1]+p[3]+8).toFixed(0)+"px;max-width:"+Math.max(150,p[2]).toFixed(0)+"px"});
 stage.appendChild(n);eye(P,stage,W*r.range(.05,.9),H-90);
};
SK.bands=function(P,draw,stage,W){
 const r=P.r,m=P.mobile;stage.classList.add("is-flow");
 const col=el("div","bands");stage.appendChild(col);
 const ribbon=(h)=>{const a=draw();const rb=el("div","ribbon band-r");rb.style.cssText="height:"+h+"px;background-image:"+bgImg(a)+";--tw:"+(h/asp(a)).toFixed(0)+"px;--dir:"+(r.chance(.5)?1:-1)+";--sd:"+r.range(45,95).toFixed(0)+"s;background-color:"+r.pick(P.fills);rb.dataset.piece=a.id;return rb};
 const typeBand=(child,f)=>{const b=el("div","band band-t");b.style.background=f;b.style.color=contrast("#111111",f)>contrast("#f3efe6",f)?"#111111":"#f3efe6";b.appendChild(child);return b};
 const rh=()=>Math.round(m?r.range(70,130):r.range(90,190));
 col.appendChild(ribbon(rh()));col.appendChild(typeBand(words(P,"huge row"),P.ground));col.appendChild(ribbon(rh()));
 const f=P.fills.find(c=>c!==P.ground)||P.ink;col.appendChild(typeBand(nav(doorLinks(P,draw,P.doorSkin==="piece"?"piece":"index"),"row"),f));
 col.appendChild(ribbon(rh()));col.appendChild(typeBand(tagline(P),P.ground));col.appendChild(ribbon(rh()));
 eye(P,stage,W*r.range(.1,.85),r.range(30,60));
};
SK.ransom=function(P,draw,stage,W){
 const r=P.r,m=P.mobile,H=m?Math.max(P.H*1.45,980):Math.max(P.H,740);stage.style.height=H+"px";background(P,draw,stage,W,H);
 const cx=W*(m?.5:r.range(.4,.6)),cy=H*(m?.36:r.range(.38,.5));const n=m?9:r.int(11,16);
 for(let i=0;i<n;i++){const a=draw(isWord,big);const w=(m?W*r.range(.3,.55):W*r.range(.13,.26))*(1-i/n*.35);const ang=i*2.399,rad=Math.sqrt(i)*(m?W*.1:W*.055);
  stage.appendChild(pc(a,cx+Math.cos(ang)*rad*1.5-w/2,cy+Math.sin(ang)*rad-w*asp(a)/2,w,{r:r.range(-16,16),z:2+(n-i),d:1+i*.08}))}
 const c=el("div","copy c-under");c.style.top=(cy+(m?H*.16:H*.2))+"px";c.appendChild(words(P,"big strip"));c.appendChild(tagline(P,"strip-soft"));stage.appendChild(c);
 const links=doorLinks(P,draw,P.doorSkin);const nv=nav(links,"corners");stage.appendChild(nv);
 eye(P,stage,cx+r.range(-.2,.2)*W,cy+r.range(-.2,.2)*H);
};

/* ---------- render ---------- */
let current=null,params=new URLSearchParams(location.search);
const embed=params.has("embed");
function render(seed){
 const root=document.getElementById("wall");root.innerHTML="";pieceIndex=0;
 const W=root.clientWidth||innerWidth,H=innerHeight;
 const forced={skel:params.get("skel"),back:params.get("back"),motion:params.get("motion"),type:params.get("type")};
 const P=plan(seed,W,H,forced);current=P;const draw=drawer(P);const T=TYPES[P.type];
 const stage=el("div","stage sk-"+P.skel+" tone-"+P.tone+" m-"+P.motion+" t-"+P.type+(P.mobile?" is-m":""));
 stage.style.cssText="--ground:"+P.ground+";--ink:"+P.ink+";--accent:"+P.accent+";--fd:"+T.d+";--fb:"+T.b+";--fl:"+T.l+";--dw:"+(T.dw||400);
 root.appendChild(stage);SK[P.skel](P,draw,stage,W);
 const fit=()=>{if(stage.classList.contains("is-flow"))return;const top=stage.getBoundingClientRect().top;let need=0;stage.querySelectorAll(".copy,.doors a,.c-tag").forEach(e=>{need=Math.max(need,e.getBoundingClientRect().bottom-top)});const h=parseFloat(stage.style.height)||0;if(need+70>h)stage.style.height=Math.ceil(need+70)+"px"};
 fit();if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);setTimeout(fit,600);
 document.documentElement.style.background=P.ground;
 const meta=document.getElementById("meta");
 if(meta)meta.innerHTML='<b>'+esc(seed)+'</b> · '+SKELETON_NAMES[P.skel]+' · '+esc(BACKS[P.back])+' · '+esc((FAM[P.f1]||{}).name||P.f1)+' × '+esc((FAM[P.f2]||{}).name||P.f2)+' · '+TYPES[P.type].name+' · '+MOTIONS[P.motion]+' · '+stage.querySelectorAll("[data-piece]").length+' cutouts';
 document.title="Wall "+seed+" · PCP lab";
}
function seedFromUrl(){return params.get("seed")||(location.hash.match(/seed=([\w-]+)/)||[])[1]}
function go(seed,push){params.set("seed",seed);history[push?"pushState":"replaceState"](null,"","?"+params.toString());render(seed)}

/* motion: pointer drift, and Hold still */
let px=0,py=0,raf=0;
addEventListener("pointermove",e=>{if(!current||current.motion!=="drift"||RM.matches||document.body.classList.contains("hold"))return;
 px=(e.clientX/innerWidth-.5)*-24;py=(e.clientY/innerHeight-.5)*-18;if(!raf)raf=requestAnimationFrame(()=>{raf=0;const s=document.querySelector(".stage");if(s){s.style.setProperty("--px",px.toFixed(2));s.style.setProperty("--py",py.toFixed(2))}})},{passive:true});
let lastBucket=0;addEventListener("resize",()=>{clearTimeout(window.__wr);window.__wr=setTimeout(()=>{if(!current||document.body.classList.contains("sheet-mode"))return;const b=innerWidth<700?1:2;if(b!==lastBucket||current.skel!=="grid"){lastBucket=b;render(current.seed)}},250)});

function sheet(){
 document.body.classList.add("sheet-mode");const root=document.getElementById("wall");root.innerHTML="";
 const phone=params.get("sheet")==="phone";const vw=phone?390:1280,vh=phone?844:820;
 const head=el("div","sheet-head",'<h1>12 editions</h1><p>Every frame is the same engine, a different seed. Tap a frame to open it full size.</p>');
 const again=el("button","tb","Cut 12 more");again.type="button";again.onclick=()=>{params.set("s0",freshSeed());history.replaceState(null,"","?"+params.toString());sheet()};
 const sw=el("a","tb",phone?"Desktop frames":"Phone frames");const q=new URLSearchParams(params);q.set("sheet",phone?"1":"phone");sw.href="?"+q.toString();
 head.appendChild(again);head.appendChild(sw);root.appendChild(head);
 const g=el("div","sheet "+(phone?"sheet-phone":""));root.appendChild(g);
 const base=params.get("s0")||freshSeed();if(!params.get("s0")){params.set("s0",base);history.replaceState(null,"","?"+params.toString())}
 for(let i=0;i<12;i++){const s=base+i.toString(36);const P=plan(s,vw,vh);
  const card=el("figure","frame");const box=el("div","fbox");box.style.setProperty("--vw",vw);box.style.setProperty("--vh",vh);
  const f=el("iframe");f.title="Edition "+s;f.loading=i<6?"eager":"lazy";f.src="?seed="+encodeURIComponent(s)+"&embed=1";f.width=vw;f.height=vh;f.tabIndex=-1;box.appendChild(f);
  const a=el("a","fopen");a.href="?seed="+encodeURIComponent(s);a.setAttribute("aria-label","Open edition "+s);box.appendChild(a);
  card.appendChild(box);card.appendChild(el("figcaption","",'<b>'+esc(s)+'</b> '+SKELETON_NAMES[P.skel]+' · '+esc(BACKS[P.back])+'<br>'+esc((FAM[P.f1]||{}).name||P.f1)+' × '+esc((FAM[P.f2]||{}).name||P.f2)+' · '+TYPES[P.type].name+' · '+P.tone));
  g.appendChild(card)}
 const fit=()=>g.querySelectorAll(".fbox").forEach(b=>b.style.setProperty("--k",(b.clientWidth/vw).toFixed(4)));fit();addEventListener("resize",fit);
}

function boot(){
 if(!ALL.length){document.getElementById("wall").innerHTML='<p style="padding:2rem">The cutout library did not load.</p>';return}
 if(embed)document.body.classList.add("embed");
 if(params.has("sheet"))return sheet();
 lastBucket=innerWidth<700?1:2;
 let s=seedFromUrl();if(!s){s=freshSeed();go(s,false)}else render(s);
 const again=document.getElementById("again"),hold=document.getElementById("hold");
 if(again)again.onclick=()=>go(freshSeed(),true);
 if(hold)hold.onclick=()=>{const on=document.body.classList.toggle("hold");hold.setAttribute("aria-pressed",on)};
 addEventListener("keydown",e=>{if(e.target.closest&&e.target.closest("input,textarea"))return;if(e.key==="r"&&!e.metaKey&&!e.ctrlKey)go(freshSeed(),true)});
 addEventListener("popstate",()=>{params=new URLSearchParams(location.search);const s2=seedFromUrl();if(s2)render(s2)});
}
window.PCPWall={plan,render,SKELETONS};
boot();
})();
