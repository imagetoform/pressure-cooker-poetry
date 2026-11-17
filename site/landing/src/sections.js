/* Browse published writing directly from the Kitchen manifests; no replacement prose. */
(function(){
'use strict';
const name=location.pathname.includes('/poems')?'poems':'essays',poems=name==='poems';
const $=id=>document.getElementById(id),items=window.PCP[name]||[];
document.title=(poems?'Poems':'Essays')+' | Pressure Cooker Poetry';
$('section-title').textContent=poems?'Poems':'Essays';$('section-kicker').textContent=poems?'THE LINE BREAK':'THE LONG ARGUMENT';
$('section-intro').textContent=poems?'Original poems from the Kitchen archive. Read a line. Follow it somewhere.':'Published essays, arguments and their sources. Read critically; disagreement is welcome.';
document.querySelector('[data-section="'+name+'"]').setAttribute('aria-current','page');
function el(t,c,text){const e=document.createElement(t);e.className=c;e.textContent=text;return e;}
function draw(){const q=$('section-search').value.trim().toLowerCase();$('section-list').replaceChildren();let count=0;
items.forEach(p=>{const text=[p.title,p.dek,p.author,p.collection,JSON.stringify(p.stanzas||[])].join(' ');if(!text.toLowerCase().includes(q))return;count++;
const a=el('article','entry','');a.append(el('span','kind',poems?'Poem':'Essay'),el('h2','',p.title));a.append(el('p','',poems?(p.stanzas?.[0]||[]).slice(0,2).join(' / '):p.dek||''));
const link=el('a','go','Read '+(poems?'poem':'essay'));link.href='/kitchen/#/'+(poems?'read/':'essays/')+encodeURIComponent(p.id);a.append(link);$('section-list').append(a);});
$('section-count').textContent=count+' of '+items.length+' entries';if(!count)$('section-list').append(el('p','','Nothing matches that search.'));}
$('section-search').addEventListener('input',draw);draw();
})();
