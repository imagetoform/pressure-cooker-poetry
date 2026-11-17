/* Visual recipes v1: a narrow adapter around the existing Kitchen mathematics. */
(function () {
  'use strict';
  const P = window.PCP, E = P.engine;
  const PRNG = 'cyrb128-sfc32/warmup15';
  const order = ['art-nouveau','art-deco','psychedelia','minimalism','swiss','bauhaus','brutalism','constructivism','dada','punk','futurism','cyberpunk','vaporwave','maximalism','pop-art','abstract-expressionism','geometric-abstraction','op-art','surrealism','expressionism','memphis','rococo','gothic-revival','ukiyo-e','grunge-design','zine-diy','situationism','mexican-muralism','afrofuturism','y2k'];
  const descriptions = ['Purple iris with curling green paper vines','Gold sun above a stepped paper temple','An eye inside a swirling pink flower','Red thread wrapped around a solitary black stone','Red grid and cropped black numerals','Primary-colour shapes joined into a small machine','Raw concrete stairs and heavy cantilevers','Red rays and a cut-paper shouting face','Scissors, a clock and mismatched newspaper eyes','Safety pin and torn black-and-pink photocopies','Mechanical bird sweeping through speed lines','Neon pink and blue circuitry in rain','Lilac column beneath a striped pink sunset','Flowers, jewels and overlapping ornate frames','Open red tin can against yellow halftone dots','Thick black and red gestural paint','Overlapping translucent circles and rectangles','Black-and-cream checkerboard twisting inward','Clouds drifting through an antique keyhole','Jagged blue paper face','Confetti, squiggles and colourful geometric pieces','Pink shell and intricate golden curls','Pointed stone arch and stained glass','Indigo waves beneath a red sun','Scratched olive paper and a torn ticket','Photocopied hands with staples and torn paper','Walking eye on a remade street sign','Hands holding maize and the earth','Gold celestial figure encircled by stars','Chrome butterfly and translucent blue bubbles'];
  const families = order.map((id, tile) => ({...P.styles.BY_ID[id], tile, description: descriptions[tile]}));
  const byId = Object.fromEntries(families.map(f => [f.id, f]));
  // Each round samples the whole shuffled inventory without replacement. No fixed privileged slot.
  function rounds(seed) { const pool = E.makeRng('visual-deal/v1|' + seed).shuffle(order); return [pool.slice(0,10),pool.slice(10,20),pool.slice(20)]; }
  function validate(r) {
    if (!r || r.schema !== 'pcp-visual/1' || r.engine !== 'kitchen-adapter/1' || r.prng !== PRNG) throw Error('This receipt format is not supported. Keep the original file.');
    if (r.build !== P.visualBuild) throw Error('This receipt needs a different engine or artwork version. Keep the file and reopen it with its original build.');
    if (!Array.isArray(r.families) || r.families.length !== 3 || new Set(r.families).size !== 3 || r.families.some(id => !byId[id])) throw Error('Choose three different known families.');
    if (typeof r.seed !== 'string' || !/^[A-Za-z0-9_.:-]{1,64}$/.test(r.seed)) throw Error('Seed must be 1–64 letters, digits, dots, colons, underscores or hyphens.');
    return {schema:r.schema, engine:r.engine, prng:r.prng, build:r.build, families:r.families.slice(), seed:r.seed};
  }
  function receipt(ids, seed) { return validate({schema:'pcp-visual/1',engine:'kitchen-adapter/1',prng:PRNG,build:P.visualBuild,families:ids,seed}); }
  function encode(r) { return encodeURIComponent(JSON.stringify(validate(r))); }
  function decode(s) { if(s.length > 4096) throw Error('Receipt is too large.'); return validate(JSON.parse(decodeURIComponent(s))); }
  function compose(input, mode) {
    const r = validate(input), fs = r.families.map(id => byId[id]);
    const key = r.families.join('|') + '|' + r.seed + '|' + r.build;
    // Keep each tag as its own dart: opposing cues are never averaged away on the board.
    const darts = fs.flatMap(f => f.emo.map(tag => {
      const t = P.board.TAGS[P.board.resolve(tag)], angle = (t.angle - 90) * Math.PI / 180;
      return {label:f.name, tags:[tag], angle:t.angle, r:t.r, x:Math.cos(angle)*t.r, y:Math.sin(angle)*t.r};
    }));
    const tasteByPetal = ['sweet','umami','sour','sour','bitter','bitter','spicy','salty'];
    const ingredients = fs.map(f => {
      const t = {};
      f.emo.forEach(tag => { const pt = P.board.TAGS[P.board.resolve(tag)]; const k = tasteByPetal[Math.round(pt.angle / 45) % 8]; t[k] = (t[k] || 0) + 3; });
      return {id:f.id,text:f.name,cat:'concept',t:P.tastes.full(t),d:P.tastes.push(t)};
    });
    const axes = {energy:'e',clarity:'c',intimacy:'i',chaos:'x'}, inputs = {};
    Object.entries(axes).forEach(([axis,k]) => { inputs[axis] = Math.max(0,Math.min(100,50 + ingredients.reduce((n,i)=>n+i.d[k],0)/3)); });
    const pot = P.tastes.flavorOf(inputs);
    const poems = P.poems.map(p => ({p,d:P.tastes.LIST.reduce((n,t)=>n+Math.pow(P.tastes.flavorOf(p.profile)[t.key]-pot[t.key],2),0)})).sort((a,b)=>a.d-b.d || a.p.id.localeCompare(b.p.id));
    const poem = E.makeRng(key+'|poem').pick(poems.slice(0,5)).p;
    // Layout remains a separate grammar. Selected movements bias, rather than dictate, its odds.
    const odds = E.familyOdds(E.semantic(inputs),P.families);
    const layout = E.makeRng(key+'|layout').weighted(odds.map(o=>o.id),odds.map(o=>o.p*(1+fs.filter(f=>f.layout===o.id).length*2)));
    const recipe = {...inputs, seed:key, variant:0, ingredients:r.families, poemId:poem.id,force:layout};
    const g = E.genome(recipe,{families:P.families,assets:P.assets,ingredients,mode});
    g.styles = r.families.slice();
    g.darts = darts;
    g.assets = P.board.pickAssets(E.makeRng(key+'|visual-assets'),darts,P.assets,['concept'],Math.max(3,g.assets.length));
    g.fingerprint = E.hashString(JSON.stringify(r)+'|'+mode).slice(0,12).toUpperCase();
    return {receipt:r,genome:g,poem,ingredients};
  }
  P.visual = {families,byId,rounds,validate,receipt,encode,decode,compose};
})();
