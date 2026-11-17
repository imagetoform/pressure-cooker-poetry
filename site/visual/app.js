(function () {
  'use strict';
  const P=window.PCP,V=P.visual,$=id=>document.getElementById('vp-'+id);
  const randomSeed=()=>Array.from(crypto.getRandomValues(new Uint32Array(2)),n=>n.toString(36)).join('-');
  let deal=randomSeed(),pool=V.rounds(deal),round=0,selected=[null,null,null],current=null,lastMode='';
  const status=text=>{$('status').textContent=text;};
  // Stand-in art: the family's own palette as torn bands. No old imagery (CANON D-19).
  function art(id){const f=V.byId[id],e=document.createElement('span'),c=f.colors,n=c.length,stops=c.map((col,i)=>col+' '+(i*100/n)+'% '+((i+1)*100/n)+'%').join(',');e.className='vp-art';e.style.backgroundImage='linear-gradient('+(160+f.tile*7)+'deg,'+stops+')';e.setAttribute('role','img');e.setAttribute('aria-label',f.description);return e;}
  function draw(focus=false){
    $('picker').hidden=false;$('result').hidden=true;
    $('step').textContent='Round '+(round+1)+' / 3';$('grid').replaceChildren();
    pool[round].forEach((id,index)=>{const f=V.byId[id],b=document.createElement('button');b.type='button';b.className='vp-tile';b.dataset.family=id;b.setAttribute('aria-label','Option '+(index+1)+' of 10: '+f.description);b.setAttribute('aria-pressed',String(selected[round]===id));
      const caption=document.createElement('span');caption.className='vp-caption';caption.textContent=String(index+1).padStart(2,'0')+(selected[round]===id?' / Selected ✓':' / Pick this');
      const a=art(id);a.setAttribute('aria-hidden','true');b.append(a,caption);b.onclick=()=>{selected[round]=id;draw();$('grid').querySelector('[data-family="'+id+'"]').focus();};$('grid').append(b);
    });
    $('next').disabled=!selected[round];$('back').disabled=round===0;$('next').textContent=round===2?'Cook my room →':'Next round →';
    $('hint').textContent=selected[round]?'Fragment selected. Continue when you’re ready.':'Choose the fragment that catches you.';
    if(focus)$('step').focus();
  }
  function mode(){return matchMedia('(max-width: 700px)').matches?'narrow':'wide';}
  function renderRoom(){
    const c=V.compose(current,mode());lastMode=mode();P.visualCurrent=c;
    document.body.dataset.sty=c.genome.styles[0];
    const room=P.render(c.genome,{poem:c.poem,ingredients:c.ingredients,assets:P.assets});
    // All three selected originals remain visible together, outside the poem's reading region.
    const strip=document.createElement('div');strip.className='vp-room-fragments';strip.setAttribute('aria-label','Your three selected fragments');current.families.forEach(id=>strip.append(art(id)));room.append(strip);
    $('room').replaceChildren(room);
  }
  function show(r,write=true){
    current=V.validate(r);renderRoom();$('picker').hidden=true;$('result').hidden=false;
    $('families').textContent=current.families.map(id=>V.byId[id].name).join(' + ');
    $('fragments').replaceChildren();
    current.families.forEach(id=>{const f=document.createElement('figure'),c=document.createElement('figcaption');c.textContent=V.byId[id].name;f.append(art(id),c);$('fragments').append(f);});
    $('json').textContent=JSON.stringify(current,null,2);$('seed').value=current.seed;
    if(write)history.pushState(null,'','#recipe='+V.encode(current));
    $('result-title').focus();status('Room cooked. Keep its receipt to reopen this interpretation.');
  }
  function safely(fn){try{fn();}catch(e){status(e.message);}}
  $('next').onclick=()=>{if(!selected[round])return;if(round<2){round++;draw(true);}else safely(()=>show(V.receipt(selected,current?current.seed:randomSeed())));};
  $('back').onclick=()=>{if(round>0){round--;draw(true);}};
  $('edit').onclick=()=>{selected=current.families.slice();pool=V.rounds(deal);
    // Reopened receipts have no display-order dependency. Restore one selected family per round.
    const others=V.families.map(f=>f.id).filter(id=>!selected.includes(id));const rng=P.engine.makeRng('edit|'+deal),rest=rng.shuffle(others);
    pool=selected.map(id=>rng.shuffle([id,...rest.splice(0,9)]));round=0;draw(true);};
  $('remix').onclick=()=>safely(()=>show(V.receipt(current.families,randomSeed())));
  $('seed-form').onsubmit=e=>{e.preventDefault();safely(()=>show(V.receipt(current.families,$('seed').value)));};
  $('copy').onclick=async()=>{try{await navigator.clipboard.writeText(location.origin+'/#recipe='+V.encode(current));status('Replay link copied.');}catch(e){status('Clipboard is unavailable. Copy the replay link from your address bar, or save the receipt file.');}};
  $('save').onclick=()=>{const u=URL.createObjectURL(new Blob([JSON.stringify(current,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=u;a.download='pcp-'+current.seed+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);status('Receipt file prepared.');};
  $('local').onclick=()=>{try{localStorage.setItem('pcp-visual-receipt-v1',JSON.stringify(current));status('Saved in this browser. Saving again replaces this one receipt.');}catch(e){status('Browser storage is unavailable. Save a receipt file instead.');}};
  $('load').onclick=()=>safely(()=>{const s=localStorage.getItem('pcp-visual-receipt-v1');if(!s)throw Error('No receipt saved in this browser yet.');show(JSON.parse(s));});
  $('import').onchange=async()=>{const f=$('import').files[0];if(!f)return;if(f.size>4096){status('Receipt file is too large.');return;}try{show(JSON.parse(await f.text()));}catch(e){status(e.message);}finally{$('import').value='';}};
  function route(){const h=location.hash;if(h.startsWith('#/')){location.replace('/kitchen/'+h);return;}if(h.startsWith('#recipe=')){safely(()=>show(V.decode(h.slice(8)),false));}else{draw();}}
  window.addEventListener('popstate',route);window.addEventListener('hashchange',route);
  window.addEventListener('resize',()=>{if(current&&!$('result').hidden&&mode()!==lastMode)safely(renderRoom);});
  draw();route();
})();
