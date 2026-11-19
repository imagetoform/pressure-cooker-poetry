/* Pressure Cooker Poetry — living front door
   Input → emotion signals → movement weights → curated grammars and real library art.
   No diagnosis. No tracking. Seeded and reproducible. */
(function(){
"use strict";
const $=id=>document.getElementById(id);
const esc=s=>String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const questions=[
 {n:"01 / INNER WEATHER",title:"What is the weather inside?",hint:"Forget the correct answer. What has been following you around today?",answers:[
  {name:"A beautiful riot",note:"Restless. Electric. Ready to overturn a table.",emo:["anger","aggressiveness","anticipation"],branch:"revolt",families:["punk","constructivism","mexican-muralism"]},
  {name:"A slow eclipse",note:"Quiet, heavy, looking inward.",emo:["pensiveness","sadness","serenity"],branch:"ornament",families:["gothic-revival","ukiyo-e","surrealism"]},
  {name:"Ten open windows",note:"Curious, overloaded, gloriously distracted.",emo:["distraction","interest","amazement","overwhelm"],branch:"excess",families:["dada","maximalism","memphis"]},
  {name:"Static in my teeth",note:"Something is coming. You can almost hear it.",emo:["apprehension","vigilance","awe"],branch:"future",families:["cyberpunk","futurism","op-art"]},
  {name:"A small, stubborn light",note:"Tenderness, possibility, a pulse of hope.",emo:["love","serenity","optimism"],branch:"ornament",families:["art-nouveau","ukiyo-e","geometric-abstraction"]},
  {name:"An unsolved equation",note:"Concentrated, sceptical, assembling the pieces.",emo:["interest","trust","anticipation"],branch:"order",families:["bauhaus","swiss","brutalism"]}
 ]},
 {n:"02 / THE ATTRACTION",title:"Which door would you open?",hint:"One of them is probably a terrible idea. That doesn't make it less interesting.",answers:[
  {name:"The abandoned theatre",note:"A velvet seat. A stage nobody remembers.",emo:["awe","pensiveness","admiration"],branch:"ornament",families:["art-deco","gothic-revival","rococo"]},
  {name:"The underground printshop",note:"Ink, contraband posters, arguments at 2 a.m.",emo:["contempt","aggressiveness","interest"],branch:"revolt",families:["dada","zine-diy","punk"]},
  {name:"The impossible museum",note:"Things that refuse to belong to the same century.",emo:["amazement","interest","distraction"],branch:"abstract",families:["surrealism","op-art","ukiyo-e"]},
  {name:"The room full of machines",note:"The future humming behind a locked door.",emo:["anticipation","vigilance","awe"],branch:"future",families:["futurism","cyberpunk","y2k"]},
  {name:"The wild overgrown garden",note:"A place that escaped its own blueprints.",emo:["love","serenity","ecstasy"],branch:"ornament",families:["art-nouveau","psychedelia","expressionism"]},
  {name:"The people's archive",note:"Marginalia, lost voices and a useful conspiracy of books.",emo:["trust","admiration","interest"],branch:"order",families:["mexican-muralism","constructivism","swiss"]}
 ]},
 {n:"03 / A NECESSARY CONTRADICTION",title:"What should art do to you?",hint:"Choose the kind of trouble you're in the mood for.",answers:[
  {name:"Shake the foundations",note:"Make the familiar impossible to ignore.",emo:["rage","disapproval","aggressiveness"],branch:"revolt",families:["punk","brutalism","situationism"]},
  {name:"Show me something strange",note:"Rearrange my expectations.",emo:["amazement","awe","distraction"],branch:"abstract",families:["surrealism","dada","op-art"]},
  {name:"Find the hidden tenderness",note:"Even a broken world has its soft machinery.",emo:["love","serenity","pensiveness"],branch:"ornament",families:["art-nouveau","ukiyo-e","expressionism"]},
  {name:"Build a better question",note:"Give me ambiguity with teeth.",emo:["interest","anticipation","trust"],branch:"order",families:["bauhaus","geometric-abstraction","constructivism"]}
 ]},
 {n:"04 / THE VOLUME",title:"How loudly should it speak?",hint:"This determines visual pressure, rhythm and how densely the artwork is assembled.",answers:[
  {name:"In a whisper",note:"Give the details room to haunt.",energy:0.28,emo:["serenity","pensiveness"],branch:"ornament",families:["minimalism","ukiyo-e"]},
  {name:"With conviction",note:"Clear enough to cut through the noise.",energy:0.58,emo:["interest","anticipation"],branch:"order",families:["constructivism","bauhaus"]},
  {name:"At full fucking volume",note:"A glorious collision. Make the walls participate.",energy:0.94,emo:["ecstasy","overwhelm","amazement"],branch:"excess",families:["maximalism","punk","psychedelia"]}
 ]}
];
const movements={
"art-nouveau":["ornament","serenity","love","admiration"],"art-deco":["ornament","admiration","anticipation","ecstasy"],"psychedelia":["ornament","amazement","ecstasy","distraction"],"gothic-revival":["ornament","awe","apprehension","pensiveness"],"ukiyo-e":["ornament","serenity","interest","pensiveness"],"minimalism":["order","serenity","acceptance","pensiveness"],"swiss":["order","trust","interest","vigilance"],"bauhaus":["order","anticipation","trust","interest"],"brutalism":["order","disapproval","vigilance","boredom"],"constructivism":["revolt","anticipation","aggressiveness","admiration"],"dada":["revolt","amazement","distraction","contempt"],"punk":["revolt","rage","contempt","aggressiveness"],"zine-diy":["revolt","interest","annoyance","acceptance"],"situationism":["revolt","contempt","interest","aggressiveness"],"grunge-design":["revolt","loathing","annoyance","pensiveness"],"mexican-muralism":["revolt","admiration","anger","optimism"],"futurism":["future","anticipation","ecstasy","aggressiveness"],"cyberpunk":["future","apprehension","vigilance","awe"],"vaporwave":["future","pensiveness","boredom","distraction"],"afrofuturism":["future","vigilance","awe","admiration"],"y2k":["future","anticipation","amazement","interest"],"maximalism":["excess","ecstasy","overwhelm","amazement"],"pop-art":["excess","joy","amazement","contempt"],"memphis":["excess","ecstasy","distraction","optimism"],"rococo":["excess","ecstasy","distraction","contempt"],"abstract-expressionism":["abstract","rage","grief","overwhelm"],"geometric-abstraction":["abstract","serenity","interest","trust"],"op-art":["abstract","distraction","amazement","apprehension"],"surrealism":["abstract","amazement","awe","pensiveness"],"expressionism":["abstract","grief","terror","admiration"]
};
const combos={
 revolt:[["BEAUTIFUL","DISORDER"],["NOTHING","STAYS STILL"],["THE UNRULY","HUMAN"]],
 ornament:[["A SECRET","GARDEN"],["THE OTHER","SIDE"],["TENDER","MACHINERY"]],
 abstract:[["A STRANGER","LOGIC"],["THE SPACE","BETWEEN"],["UNFINISHED","WONDERS"]],
 future:[["ELECTRIC","GHOSTS"],["A FUTURE","UNWRITTEN"],["SIGNAL /","NOISE"]],
 order:[["THE SHAPE","OF THOUGHT"],["AN OPEN","QUESTION"],["THE QUIET","REVOLUTION"]],
 excess:[["TOO MUCH","IS NEVER ENOUGH"],["THE WHOLE","WEIRD WORLD"],["RIOTOUS","POSSIBILITY"]]
};
const grammarByBranch={revolt:"revolt",ornament:"ornament",abstract:"archive",future:"signal",order:"archive",excess:"spectrum"};
const prepositions={revolt:"a page that refuses to stay inside its margins",ornament:"an atmosphere between a relic and a dream",abstract:"an arrangement of things that were never meant to meet",future:"a broadcast intercepted from a possible tomorrow",order:"a map for questions without easy answers",excess:"a riot of useful contradictions"};
const app=$("app");
let picks=[],step=0,revision=0,seed="",lastPlan=null;
function freshSeed(){const bytes=new Uint32Array(2);crypto.getRandomValues(bytes);return Array.from(bytes).map(x=>x.toString(36)).join("-")}
function rng(key){return window.PCP.prng.makeRng(key)}
function asWorld(){document.body.classList.add("show-world");document.body.classList.remove("show-questions")}
function asQuestions(){document.body.classList.remove("show-world");document.body.classList.add("show-questions")}
function renderQ(){
 asQuestions();step=Math.min(3,Math.max(0,step));const q=questions[step];
 const intro=step===0?["TELL US","WHAT'S","<em>brewing.</em>"]:step===1?["FOLLOW","YOUR","<em>curiosity.</em>"]:step===2?["MAKE","A LITTLE","<em>trouble.</em>"]:["TURN","UP THE","<em>pressure.</em>"];
 app.innerHTML='<section class="intake" aria-label="The entrance questionnaire">'+
 '<aside class="intro-panel"><div class="eyebrow">An experiment in perception / No. 001</div><h1 class="intro-headline">'+intro.join("<br>")+'</h1>'+
 '<div class="intro-bottom"><p>You bring the feeling. The machine builds the world around it.</p>'+
 '<div class="micro">Four small decisions. No correct answers.<br>No personality diagnosis, no account, no surveillance.</div></div></aside>'+
 '<section class="question-panel"><div class="q-progress"><span>Intake / '+String(step+1).padStart(2,"0")+' of 04</span><div class="progress-rail" aria-hidden="true">'+questions.map((_,i)=>'<i class="'+(i<=step?"done":"")+'"></i>').join("")+'</div></div>'+
 '<div class="question-copy" aria-live="polite"><div class="q-number">'+esc(q.n)+'</div><h2>'+esc(q.title)+'</h2><p>'+esc(q.hint)+'</p></div>'+
 '<div class="answer-grid" role="group" aria-label="'+esc(q.title)+'">'+q.answers.map((a,i)=>'<button type="button" class="answer" data-answer="'+i+'"><span class="answer-n">OPTION / '+String(i+1).padStart(2,"0")+'</span><strong>'+esc(a.name)+'</strong><small>'+esc(a.note)+'</small></button>').join("")+'</div>'+
 '<div class="q-bottom"><button type="button" id="go-back" class="q-back" '+(step===0?"disabled":"")+'>← '+(step===0?"Just arrived":"Previous question")+'</button><span>Nothing you choose is a diagnosis.</span></div>'+
 '</section></section>';
 app.querySelectorAll("[data-answer]").forEach(b=>b.addEventListener("click",()=>select(+b.dataset.answer)));
 $("go-back").addEventListener("click",()=>{if(step){step--;picks=picks.slice(0,step);renderQ()}});
}
function select(index){picks[step]=index;picks.length=step+1;if(step<3){step++;renderQ()}else{seed=freshSeed();revision=0;renderWorld()}}
function scoreFamilies(assets,r){
 const chosen=picks.map((choice,i)=>questions[i].answers[choice]);const allEmo=new Map(), branchWeights=new Map(),preferred=new Map();
 chosen.forEach((a,q)=>{a.emo.forEach(e=>allEmo.set(e,(allEmo.get(e)||0)+[3,2.4,2.6,1.3][q]));branchWeights.set(a.branch,(branchWeights.get(a.branch)||0)+[2.5,2.2,2.6,1.3][q]);a.families.forEach((f,i)=>preferred.set(f,(preferred.get(f)||0)+4.5-i*1.1))});
 const counts=new Map();assets.forEach(a=>counts.set(a.family,(counts.get(a.family)||0)+1));
 const entries=Object.keys(movements).filter(id=>(counts.get(id)||0)>0).map(id=>{
 const [branch,...tags]=movements[id];const em=tags.reduce((s,t)=>s+(allEmo.get(t)||0),0);
 const affinity=em*1.6+(preferred.get(id)||0)*2+(branchWeights.get(branch)||0)*1.2;
 return {id,branch,weight:Math.max(.15,affinity+1.1),count:counts.get(id)};
 }).sort((a,b)=>b.weight-a.weight);
 // A biased weighted draw keeps surprise without severing the connection to the visitor.
 const pool=entries.slice(0,15);let taken=[];
 for(let i=0;i<3 && pool.length;i++){let chosen=r.weighted(pool,pool.map(f=>Math.pow(f.weight,1.45)));taken.push(chosen);pool.splice(pool.indexOf(chosen),1)}
 const summed={};for(const x of taken)summed[x.branch]=(summed[x.branch]||0)+x.weight;
 let dominant=taken[0].branch;
 // A quieter response gives the archive and ornament grammars more space.
 if(picks[3]===0 && (taken.some(x=>["ornament","order","abstract"].includes(x.branch)))) dominant=(taken.find(x=>["ornament","order","abstract"].includes(x.branch))||taken[0]).branch;
 return {taken,dominant,emotions:allEmo,branches:branchWeights,entries};
}
function cleanSrc(src){return typeof src==="string"&&/^\/assets\/cutouts\/[a-z0-9-]+\.(?:png|webp)$/.test(src)?src:""}
function chooseArt(assets,selected,emotions,r,count){
 const pool=assets.filter(a=>a.family&&cleanSrc(a.src));
 const used=new Set(), out=[];
 const take=list=>{if(!list.length)return;const pick=r.weighted(list,list.map(a=>{let s=1;const emo=a.emo||[];emo.forEach(t=>s+=(emotions.get(t)||0)*1.35);return s;}));out.push(pick);used.add(pick.id)};
 selected.forEach(f=>take(pool.filter(a=>a.family===f.id&&!used.has(a.id))));
 while(out.length<count){let options=pool.filter(a=>!used.has(a.id));if(!options.length)break;
 let weighted=options.map(a=>{const f=selected.findIndex(x=>x.id===a.family);let w=f>=0?7-f*1.5:.6;for(const t of a.emo||[])w+=(emotions.get(t)||0)*1.4;return Math.max(.1,w)});
 let a=r.weighted(options,weighted);out.push(a);used.add(a.id)}
 return r.shuffle(out);
}
function seedTitle(r,branch){return r.pick(combos[branch]||combos.abstract)}
function selectedNames(){return picks.map((n,i)=>questions[i].answers[n].name)}
function renderWorld(same){
 if(!seed)seed=freshSeed();
 const data=window.PCP&&PCP.cutupData;
 const assets=(data&&Array.isArray(data.assets)?data.assets:[]).filter(a=>a&&a.id&&cleanSrc(a.src));
 if(!assets.length){app.innerHTML='<section class="intake"><div class="intro-panel"><h1 class="intro-headline">THE<br>ART IS<br><em>missing.</em></h1></div><div class="question-panel"><h2>The image library did not load.</h2><p>Please reload the page. No choices have been sent anywhere.</p><button id="retry-art" class="answer">Reload</button></div></section>';$("retry-art").onclick=()=>location.reload();return}
 asWorld();const r=rng("pcp-world-v1|"+seed+"|"+picks.join(".")+"|"+revision);
 const ranked=scoreFamilies(assets,r);
 let branch=ranked.dominant;
 // The graphic grammars are not presets for every visit; the answers bias them.
 const grammar=grammarByBranch[branch]||"archive";
 const phrase=seedTitle(r,branch),energy=questions[3].answers[picks[3]].energy;
 const count=energy>.75?10:energy<.35?6:8;
 const art=chooseArt(assets,ranked.taken,ranked.emotions,r,count);
 const chosen=selectedNames();
 const titleA=esc(phrase[0]),titleB=esc(phrase[1]);
 const artPositions=[
 [5,13,40,-15],[45,2,43,13],[40,44,48,-4],[7,54,36,10],[63,32,32,-15],
 [21,29,31,20],[64,70,28,13],[-1,79,30,-18],[76,3,25,22],[28,76,31,4]
 ];
 const placement=r.shuffle(artPositions).slice(0,art.length);
 const scene=art.map((a,i)=>{let p=placement[i];return '<img class="stage-art" alt="'+esc(a.label||a.family||"Archive fragment")+'" loading="'+(i<4?"eager":"lazy")+'" src="'+esc(a.src)+'" style="--x:'+p[0]+'%;--y:'+p[1]+'%;--w:'+p[2]+'%;--r:'+p[3]+'deg;--duration:'+(6+r.int(0,5))+'s;--delay:-'+r.int(0,5)+'s;--drift:'+r.int(-6,10)+'px;z-index:'+(i+1)+'">';
 }).join("");
 const familyNames=ranked.taken.map(x=>data.families[x.id]?.name||x.id);
 const subt='You arrived carrying '+chosen[0].toLowerCase()+'. You followed '+chosen[1].toLowerCase()+'. What emerged is '+prepositions[branch]+'.';
 const moodTag=ranked.taken.map(x=>x.id).join(" / ");
 lastPlan={choices:picks.slice(),seed,revision,grammar,art:art.map(a=>a.id),families:ranked.taken.map(f=>f.id)};
 try{history.replaceState(null,"",location.pathname+location.search+"#world="+encodeURIComponent(btoa(JSON.stringify({p:picks,s:seed,r:revision}))))}catch(e){}
 app.innerHTML='<div class="world grammar-'+grammar+'"><div class="world-topline"><span class="world-id">PCP / Living edition '+esc(seed.slice(0,7))+'</span><span class="world-mix">Aesthetic collision  /  '+esc(ranked.taken.length)+' movements</span></div>'+
 '<div class="world-content"><section class="world-hero" aria-label="Your generated living cover"><div class="world-copy">'+
 '<div class="world-kicker">A publication that changes its skin</div><h1 class="world-title">'+titleA+'<span class="accent">'+titleB+'</span></h1>'+
 '<p class="world-desc">'+esc(subt)+'</p><div class="world-inscription">This cover is yours for this moment. Not a psychological profile. A visual interpretation of four choices.</div>'+
 '<div class="world-actions"><button id="remix" class="primary" type="button">↻ Another version</button><button id="start-over" type="button">Change my answers</button><button id="share-world" type="button">Copy this edition</button></div>'+
 '</div><div class="stage" aria-label="A new composition using actual artwork from the PCP library"><div class="stage-inner">'+
 '<div class="stage-floor"></div><div class="stage-grid"></div><div class="stage-plate"></div>'+scene+
 '<span class="stage-vertical">An unstable editorial organism</span><span class="stage-mark">'+esc(familyNames.join(" × "))+'</span></div></div></section>'+
 '<div class="world-ticker"><span>Entry / '+esc(chosen[0])+'</span><span>+ / '+esc(chosen[2])+'</span><span>Result / '+esc(familyNames[0])+'</span></div>'+
 '<section class="world-doors" id="explore"><div class="door-head"><h2>Go<br>deeper.</h2><p>The skin changes. The work beneath it stays human. Wander into something worth arguing with.</p></div><nav class="door-grid" aria-label="Explore the publication">'+
 door(1,"Poems","/poems/","P")+door(2,"Essays","/essays/","E")+door(3,"Brain Candy","/brain-candy/","B")+door(4,"Learning Curve","/learning/","L")+
 '</nav></section>'+
 '<section class="world-note"><p><strong>How this edition formed</strong><br>'+esc(familyNames.join(" / "))+'<br>Real cutout images, weighted by your chosen emotional signals. The composition, scale, density, typography and motion are drawn anew for this seed.</p>'+
 '<p><strong>No mind-reading bullshit</strong><br>Those were aesthetic choices, not an assessment. Your answers stay in this browser. The address can reproduce the same edition without creating an account.</p></section>'+
 '<section class="world-entry"><h2>Not your<br>last answer.</h2><p>Same feelings, another composition. That's the point of a living publication.</p><button id="more-worlds" type="button">Remix the world ↗</button></section>'+
 '</div></div>';
 $("remix").onclick=$("more-worlds").onclick=()=>{revision++;renderWorld();scrollTo({top:0,behavior:"smooth"})};
 $("start-over").onclick=()=>{picks=[];step=0;revision=0;history.replaceState(null,"",location.pathname+location.search);renderQ();scrollTo({top:0,behavior:"smooth"})};
 $("share-world").onclick=async()=>{const btn=$("share-world");try{await navigator.clipboard.writeText(location.href);btn.textContent="Copied ✓"}catch(e){btn.textContent="Copy the address above"}};
}
function door(n,title,url,letter){return '<a class="door" href="'+url+'"><span class="door-num">ROOM '+String(n).padStart(2,"0")+'</span><span class="door-watermark" aria-hidden="true">'+letter+'</span><span class="door-title">'+title+'</span><span class="door-arrow" aria-hidden="true">↗</span></a>'}
function restore(){const hash=location.hash;if(!hash.startsWith("#world="))return false;try{let x=JSON.parse(atob(decodeURIComponent(hash.slice(7))));if(!Array.isArray(x.p)||x.p.length!==4||!x.p.every((p,i)=>Number.isInteger(p)&&p>=0&&p<questions[i].answers.length)||typeof x.s!=="string"||!/^[a-z0-9-]{5,80}$/.test(x.s)||!Number.isInteger(x.r)||x.r<0||x.r>5000)return false;picks=x.p;seed=x.s;revision=x.r;renderWorld(true);return true}catch(e){return false}}
document.addEventListener("keydown",e=>{if(e.altKey||e.ctrlKey||e.metaKey||e.target.closest("input,textarea"))return;if(document.body.classList.contains("show-questions")&&/^[1-6]$/.test(e.key)){const ix=+e.key-1;if(ix<questions[step].answers.length)select(ix)}});
window.addEventListener("hashchange",()=>{if(!restore()){picks=[];step=0;renderQ()}});
if(!window.PCP||!PCP.prng||!PCP.cutupData){app.innerHTML='<p role="alert" style="padding:32px">The visual library is temporarily unavailable. Please reload.</p>';return}
if(!restore())renderQ();
})();