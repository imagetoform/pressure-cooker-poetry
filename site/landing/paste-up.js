/* Pressure Cooker Poetry — the paste-up layer.
   Torn paper, printed type and family print-marks, laid down per seed on the homepage stage.
   It needs no image files: it is the art when the cutout library is empty (Nov 19 reset; Brandon is
   making the cutouts himself), and the paper ground under his cutouts once they arrive.
   Every choice comes from the seeded rng handed in, so a shared link rebuilds the same paste-up. */
(function(){
"use strict";
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

/* Which print-marks a movement leaves on paper. Each name is a recipe in plate() below. */
const MARKS={
 "punk":["halftone","ransom","xerox"],"dada":["ransom","type","stamp"],"zine-diy":["type","xerox","stamp"],
 "situationism":["ad","type","stamp"],"constructivism":["wedge","stencil","stripes"],"mexican-muralism":["rays","blocks","stencil"],
 "grunge-design":["xerox","type","halftone"],
 "art-nouveau":["whiplash","frame","type"],"art-deco":["rays","frame","stencil"],"gothic-revival":["arch","type","frame"],
 "ukiyo-e":["waves","blocks","type"],"psychedelia":["rings","whiplash","rays"],
 "bauhaus":["primaries","stencil","grid"],"swiss":["grid","numeral","type"],"brutalism":["slab","type","numeral"],"minimalism":["line","numeral","grid"],
 "futurism":["speed","stencil","wedge"],"cyberpunk":["scan","numeral","type"],"y2k":["chrome","rings","ad"],
 "vaporwave":["horizon","chrome","scan"],"afrofuturism":["rings","rays","stencil"],
 "maximalism":["halftone","ad","rings"],"memphis":["squiggle","primaries","halftone"],"pop-art":["halftone","ad","numeral"],
 "rococo":["frame","whiplash","ad"],
 "abstract-expressionism":["brush","brush","type"],"geometric-abstraction":["primaries","grid","blocks"],"op-art":["optic","rings","stripes"],
 "surrealism":["eye","horizon","type"],"expressionism":["brush","type","wedge"]
};

/* Found print: the voice of the paste-up. Satire aims up — at bosses, landlords, ad men — never down. */
const FOUND={
 revolt:["NO GODS NO LANDLORDS","THIS WALL IS A NEWSPAPER","UNAUTHORIZED","THE BOSS NEEDS YOU MORE THAN YOU NEED THE BOSS","SAY IT PLAIN","STRIKE WHILE THE IRON","READ BETWEEN THE LIES","THE MAP IS NOT THE MARKET"],
 ornament:["THE SOFT MACHINERY","NOTHING HERE IS FOR SALE","A GARDEN NOBODY OWNS","SLOWLY, LIKE ROOTS","THE OLDEST LANGUAGE","STILL HERE"],
 order:["SHOW YOUR WORK","WHO BENEFITS?","CHECK THE SOURCE","A QUESTION WITH TEETH","FORM FOLLOWS FURY","DEFINE YOUR TERMS"],
 future:["THE FUTURE IS NOT A PRODUCT","SIGNAL / NOISE","DO NOT ACCEPT THE DEFAULT SETTINGS","TRANSMISSION INTERRUPTED","NOBODY OWNS TOMORROW","LOG OFF, LOOK UP"],
 excess:["NOW 300% MORE NOTHING","BUY NOW, THINK NEVER","FREE GIFT WITH YOUR SOUL","LIMITED TIME: FOREVER","AS SEEN ON A SCREEN","ACT NOW"],
 abstract:["THE SPACE BETWEEN","NOT WHAT IT LOOKS LIKE","A STRANGER LOGIC","LOOK AGAIN","UNFINISHED","WHERE THE EDGES GO"]
};
const FINE=["*terms apply to you, not to them","*offer void where people are paid fairly","*results not typical. results not real.","*no landlords were harmed. yet.","*supplies of attention are limited","*this ad paid for by nobody"];
const STAMPS=["UNAUTHORIZED","NOT FOR SALE","PROPERTY OF NOBODY","VOID","OVERDUE","CENSORED","APPROVED BY NO ONE","RETURN TO SENDER"];
const RANSOM_FONTS=['Georgia,serif','"Arial Black",Impact,sans-serif','"Courier New",monospace','Impact,"Arial Narrow",sans-serif','"Times New Roman",serif','Verdana,sans-serif','"Trebuchet MS",sans-serif'];

/* A torn edge: walk each side of the box with small seeded bites. */
function torn(r,bite){
 const pts=[],n=7,b=bite==null?2.6:bite;
 const j=()=>(r.next()*b).toFixed(1);
 for(let i=0;i<=n;i++)pts.push((i/n*100).toFixed(1)+"% "+j()+"%");
 for(let i=1;i<=n;i++)pts.push((100-+j())+"% "+(i/n*100).toFixed(1)+"%");
 for(let i=n-1;i>=0;i--)pts.push((i/n*100).toFixed(1)+"% "+(100-+j())+"%");
 for(let i=n-1;i>0;i--)pts.push(j()+"% "+(i/n*100).toFixed(1)+"%");
 return "polygon("+pts.join(",")+")";
}
function svg(body,vb){return '<svg class="pu-svg" viewBox="'+(vb||"0 0 100 100")+'" preserveAspectRatio="none" aria-hidden="true" focusable="false">'+body+'</svg>'}

/* The printed content of one scrap, by mark. c = [ink, accent, third] from the family palette. */
function plate(mark,r,c,words){
 const [a,b,d]=c;
 switch(mark){
 case "halftone":return {cls:"pu-halftone",style:"--dot:"+a+";--dot-size:"+(5+r.int(0,7))+"px",html:'<b class="pu-big">'+esc(words.short)+'</b>'};
 case "ransom":return {cls:"pu-ransom",html:[...words.short].map(ch=>ch===" "?'<i class="sp"></i>':'<span style="font-family:'+RANSOM_FONTS[r.int(0,RANSOM_FONTS.length-1)]+';background:'+r.pick([a,b,d,"#f4efe2","#111"])+';color:'+r.pick(["#111","#f4efe2",a])+';transform:rotate('+r.int(-9,9)+'deg)">'+esc(ch)+'</span>').join("")};
 case "xerox":return {cls:"pu-xerox",html:'<b class="pu-big">'+esc(words.found)+'</b>'};
 case "type":return {cls:"pu-type",html:'<p>'+esc(words.note)+'</p><p class="pu-by">— '+esc(words.answer)+'</p>'};
 case "stamp":return {cls:"pu-stamp",style:"--ink:"+a,html:'<span>'+esc(r.pick(STAMPS))+'</span>'};
 case "ad":return {cls:"pu-ad",style:"--ink:"+a,html:'<b>'+esc(r.pick(FOUND.excess))+'</b><span class="pu-price">$'+r.int(1,99)+'<sup>.99</sup></span><small>'+esc(r.pick(FINE))+'</small>'};
 case "wedge":return {cls:"pu-wedge",style:"--w1:"+a+";--w2:"+b,html:'<b class="pu-stencil">'+esc(words.short)+'</b>'};
 case "stencil":return {cls:"pu-stencilplate",style:"--ink:"+a,html:'<b class="pu-stencil">'+esc(words.found)+'</b>'};
 case "stripes":return {cls:"pu-stripes",style:"--s1:"+a+";--s2:"+b+";--ang:"+r.pick([45,-45,90,0,30])+"deg"};
 case "rays":return {cls:"pu-rays",style:"--r1:"+a+";--r2:"+b+";--n:"+r.pick([10,12,16,24])};
 case "blocks":return {cls:"pu-blocks",style:"--b1:"+a+";--b2:"+b+";--b3:"+d,html:'<i></i><i></i><i></i>'};
 case "whiplash":return {cls:"pu-plain",html:svg('<path d="M8 92 C 30 60, 5 35, 40 22 S 70 40, 60 60 S 85 90, 94 8" fill="none" stroke="'+a+'" stroke-width="3.2" stroke-linecap="round"/><path d="M14 96 C 40 70, 18 44, 48 30 S 80 50, 92 20" fill="none" stroke="'+b+'" stroke-width="1.4"/>')};
 case "frame":return {cls:"pu-frame",style:"--ink:"+a,html:'<span>'+esc(words.short)+'</span>'};
 case "arch":return {cls:"pu-arch",style:"--ink:"+a+";--glow:"+b,html:'<span>'+esc(words.found)+'</span>'};
 case "waves":return {cls:"pu-waves",style:"--w1:"+a+";--w2:"+b};
 case "rings":return {cls:"pu-rings",style:"--r1:"+a+";--r2:"+b+";--gap:"+(6+r.int(0,8))+"px"};
 case "primaries":return {cls:"pu-plain",html:svg('<circle cx="'+r.int(25,45)+'" cy="'+r.int(28,45)+'" r="'+r.int(16,26)+'" fill="'+a+'"/><rect x="'+r.int(40,55)+'" y="'+r.int(35,50)+'" width="38" height="38" fill="'+b+'"/><polygon points="10,95 40,95 25,62" fill="'+d+'"/>')};
 case "grid":return {cls:"pu-grid",style:"--ink:"+a,html:'<b class="pu-num">'+r.int(1,99)+'</b>'};
 case "numeral":return {cls:"pu-numeral",style:"--ink:"+a,html:'<b>'+r.pick(["?","!","%","&","¶","§","∞","0","No."])+'</b>'};
 case "slab":return {cls:"pu-slab",html:'<b>'+esc(words.found)+'</b>'};
 case "line":return {cls:"pu-line",style:"--ink:"+a};
 case "speed":return {cls:"pu-speed",style:"--ink:"+a,html:'<b class="pu-italic">'+esc(words.short)+'</b>'};
 case "scan":return {cls:"pu-scan",style:"--ink:"+b,html:'<b class="pu-mono">'+esc(words.found)+'</b>'};
 case "chrome":return {cls:"pu-chrome",style:"--c1:"+a+";--c2:"+b,html:'<b>'+esc(words.short)+'</b>'};
 case "horizon":return {cls:"pu-horizon",style:"--sun:"+b+";--ink:"+a};
 case "squiggle":return {cls:"pu-plain",html:svg('<path d="M5 30 q 10 -18 20 0 t 20 0 t 20 0 t 20 0 t 20 0" fill="none" stroke="'+a+'" stroke-width="5"/><path d="M5 70 l 15 -15 l 15 15 l 15 -15 l 15 15 l 15 -15 l 15 15" fill="none" stroke="'+b+'" stroke-width="4"/>')};
 case "optic":return {cls:"pu-optic"};
 case "eye":return {cls:"pu-plain",html:svg('<path d="M6 50 Q 50 8 94 50 Q 50 92 6 50 Z" fill="#f4efe2" stroke="#111" stroke-width="2.5"/><circle cx="50" cy="50" r="17" fill="'+a+'"/><circle cx="50" cy="50" r="7" fill="#111"/><circle cx="55" cy="44" r="3" fill="#fff"/>')};
 case "brush":return {cls:"pu-plain",html:svg('<path d="M10 '+r.int(20,40)+' C 30 '+r.int(0,20)+', 60 '+r.int(40,70)+', 92 '+r.int(15,35)+' L 88 '+r.int(55,70)+' C 60 '+r.int(85,98)+', 30 '+r.int(60,80)+', 8 '+r.int(70,92)+' Z" fill="'+a+'" filter="url(#pu-rough)"/><path d="M15 70 C 40 40, 60 80, 90 50" fill="none" stroke="'+b+'" stroke-width="7" stroke-linecap="round" filter="url(#pu-rough)"/>')};
 default:return {cls:"pu-type",html:'<p>'+esc(words.found)+'</p>'};
 }
}

/* Paper stocks: newsprint, kraft, bond, carbon. The surface the marks are printed on. */
const PAPERS=["#efe9d8","#f4efe2","#e9dfc6","#d9c7a3","#f7f4ec","#1b1a1f"];

/* Lay out the paste-up.
   ctx: {families:[{id,colors,name}], branch, energy (0..1), answers:[{name,note}], title:[a,b], withCutouts:bool, narrow:bool} */
function pasteUp(r,ctx){
 const fams=ctx.families.length?ctx.families:[{id:"dada",colors:["#111","#d33","#f4efe2"]}];
 const count=Math.round((ctx.withCutouts?3:5)+ctx.energy*(ctx.withCutouts?3:5));
 /* Words are dealt like cards, not rolled like dice: no line shows up twice on one page. */
 const ansDeck=r.shuffle(ctx.answers),foundDeck=r.shuffle(FOUND[ctx.branch]||FOUND.abstract);let ai=0,fi=0;
 const words=()=>{const ans=ansDeck[ai++%ansDeck.length];const found=foundDeck[fi++%foundDeck.length];
  const shortPool=[ctx.title[0],ctx.title[1],ans.name.split(" ").slice(-1)[0],found.split(" ")[0]].filter(w=>w&&w.length<=11);
  return {answer:ans.name,note:ans.note,found,short:(r.pick(shortPool)||"PRESS").toUpperCase()}};
 /* Content first (which marks, words, paper, edges): identical on every screen for the same link.
    Placement second: the phone gets its own authored arrangement and fewer scraps, never different ones. */
 const content=[];
 /* Each movement deals its own marks in a shuffled cycle, so one mark can't flood the page. */
 const markDecks=fams.map(f=>r.shuffle(MARKS[f.id]||MARKS.dada)),used=fams.map(()=>0);
 for(let i=0;i<count;i++){
  const fi2=i%fams.length, fam=fams[fi2], deck=markDecks[fi2], mark=deck[used[fi2]++%deck.length];
  const p=plate(mark,r,fam.colors,words());
  const paper=mark==="xerox"||mark==="scan"?r.pick(["#f4efe2","#1b1a1f"]):r.pick(PAPERS);
  content.push({fam,mark,p,paper,edge:torn(r),tape:r.next()<.55?[r.int(8,70),r.int(-30,30)]:null,rot:r.int(-14,14)});
 }
 const shown=ctx.narrow?content.slice(0,Math.min(content.length,6)):content;
 const cols=ctx.narrow?2:3,rows=Math.ceil(shown.length/cols),cells=[];
 for(let i=0;i<cols*rows;i++)cells.push(i);
 const order=r.shuffle(cells).slice(0,shown.length);
 const pieces=shown.map((k,i)=>{
  const cell=order[i],col=cell%cols,row=Math.floor(cell/cols);
  const w=(ctx.narrow?42:24)+r.next()*(ctx.narrow?16:16), h=(ctx.narrow?20:18)+r.next()*16;
  const x=col/cols*100+(r.next()-.35)*(100/cols)*.55-4, y=row/rows*100*.86+(r.next()-.3)*12;
  const dark=k.paper==="#1b1a1f";
  const tape=k.tape?'<i class="pu-tape" style="left:'+k.tape[0]+'%;transform:rotate('+k.tape[1]+'deg)"></i>':"";
  return '<div class="stage-scrap pu-'+k.mark+'-wrap'+(dark?" pu-dark":"")+'" data-family="'+esc(k.fam.id)+'" data-mark="'+k.mark+'" aria-label="'+esc((k.fam.name||k.fam.id)+" scrap: "+k.mark)+'" style="--x:'+x.toFixed(1)+'%;--y:'+y.toFixed(1)+'%;--w:'+w.toFixed(1)+'%;--h:'+h.toFixed(1)+'%;--r:'+k.rot+'deg;--paper:'+k.paper+';z-index:'+(i+1)+'">'+
   '<div class="pu-paper '+k.p.cls+'" style="clip-path:'+k.edge+';'+(k.p.style||"")+'">'+(k.p.html||"")+'</div>'+tape+'</div>';
 });
 const defs='<svg class="pu-defs" aria-hidden="true" focusable="false"><filter id="pu-rough"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="'+(count*37%997)+'"/><feDisplacementMap in="SourceGraphic" scale="9"/></filter></svg>';
 return defs+pieces.join("");
}
window.PCP=window.PCP||{};PCP.pasteUp=pasteUp;PCP.pasteUpMarks=MARKS;
})();
