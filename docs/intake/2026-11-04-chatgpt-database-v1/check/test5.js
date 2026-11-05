// Browser checks for the Nov 4 merge: hidden controls, poems untouched, fallbacks, reduced motion, phone layout, each new movement.
const { chromium, devices } = require('playwright');
const shots = '/root/tasks/pcp-site-update/shots/';
const NEW = ['surrealism', 'expressionism', 'memphis', 'zine-diy', 'situationism', 'grunge-design', 'afrofuturism', 'y2k', 'gothic-revival', 'ukiyo-e'];
const A = 'http://127.0.0.1:8765/index.html', B = 'http://127.0.0.1:8766/index.html';
(async () => {
  const br = await chromium.launch(); const errs = []; const r = {};
  const mk = async (opts) => { const c = await br.newContext(opts); const p = await c.newPage(); p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/404|Failed to load resource/.test(m.text())) errs.push(m.text()); }); return p; };
  // poems byte-for-byte
  const p = await mk({ viewport: { width: 1400, height: 900 } });
  await p.goto(B + '#/kitchen'); await p.waitForTimeout(600); const before = await p.evaluate(() => JSON.stringify(PCP.poems));
  await p.goto(A + '#/kitchen'); await p.waitForTimeout(600); const after = await p.evaluate(() => JSON.stringify(PCP.poems));
  r.poemsIdentical = before === after; r.poemCount = await p.evaluate(() => PCP.poems.length);
  // find a pot for each new movement (seed PCP-0001, as a visitor would cook it)
  const pots = await p.evaluate((NEW) => {
    const E = PCP.engine, ING = PCP.ingredients, ctx = { families: PCP.families, assets: PCP.assets, ingredients: ING, mode: 'wide' }, rng = E.makeRng('find'), out = {};
    const clamp = v => Math.max(0, Math.min(100, v));
    for (let i = 0; i < 40000 && Object.keys(out).length < NEW.length; i++) {
      const n = 1 + Math.floor(rng.next() * 3), ids = [];
      while (ids.length < n) { const x = ING[Math.floor(rng.next() * ING.length)].id; if (ids.indexOf(x) < 0) ids.push(x); }
      const d = { e: 0, c: 0, i: 0, x: 0 }; ids.forEach(id => { const g = ING.find(q => q.id === id).d; d.e += g.e; d.c += g.c; d.i += g.i; d.x += g.x; });
      const g = E.genome({ energy: clamp(62 + d.e), clarity: clamp(44 + d.c), intimacy: clamp(52 + d.i), chaos: clamp(58 + d.x), seed: 'PCP-0001', variant: 0, ingredients: ids }, ctx);
      if (NEW.indexOf(g.styles[0]) >= 0 && !out[g.styles[0]]) out[g.styles[0]] = ids;
    }
    return out;
  }, NEW);
  r.potsFound = Object.keys(pots).length;
  r.rooms = {};
  for (const m of NEW) {
    if (!pots[m]) { r.rooms[m] = 'no pot found'; continue; }
    await p.goto(A + '#/kitchen?s=PCP-0001&v=0&g=' + pots[m].join(',')); await p.waitForTimeout(900);
    const g = await p.evaluate(() => PCP.app.genome);
    const info = await p.evaluate(() => ({ sty: document.body.dataset.sty, layers: [...document.querySelectorAll('.sty-layer')].map(e => e.dataset.style), motifs: document.querySelectorAll('.sty-layer .sty-m svg').length,
      btn: (b => b ? getComputedStyle(b).backgroundImage + ' ' + getComputedStyle(b).backgroundColor : null)(document.querySelector('.btn-cook')) }));
    r.rooms[m] = { pot: pots[m], primary: g.styles[0], family: g.family, ...info };
    await p.screenshot({ path: shots + '50-new-' + m + '.png' });
  }
  // a second load of the same recipe gives the same room
  const one = pots[NEW[0]] || ['a-bruised-peach'];
  await p.goto(A + '#/kitchen?s=PCP-0001&v=0&g=' + one.join(',')); await p.waitForTimeout(800); const g1 = await p.evaluate(() => JSON.stringify(PCP.app.genome));
  await p.goto('about:blank'); await p.goto(A + '#/kitchen?s=PCP-0001&v=0&g=' + one.join(',')); await p.waitForTimeout(800); const g2 = await p.evaluate(() => JSON.stringify(PCP.app.genome));
  r.sameRecipeSameRoom = g1 === g2;
  // visitor sees no controls
  r.visitorHidden = await p.evaluate(() => [...document.querySelectorAll('.lab-only, #dartboard')].every(e => !e.offsetHeight));
  r.pantryTiles = await p.$$eval('.ing-tile, [data-ing]', x => x.length);
  // missing cutout files fall back to drawings
  r.fallbacks = await p.evaluate(() => document.querySelectorAll('.room svg, .room canvas').length > 0);
  // reduced motion
  const rm = await mk({ viewport: { width: 1400, height: 900 }, reducedMotion: 'reduce' });
  await rm.goto(A + '#/kitchen?s=PCP-0001&v=0&g=' + one.join(',')); await rm.waitForTimeout(900);
  r.reducedMotion = await rm.evaluate(() => ({ noMotionClass: document.documentElement.classList.contains('no-motion'), running: [...document.querySelectorAll('.sty-m')].filter(e => getComputedStyle(e).animationName !== 'none').length }));
  // phone (Android-sized)
  const ph = await mk({ ...devices['Pixel 7'] });
  for (const m of ['memphis', 'y2k', 'gothic-revival']) if (pots[m]) {
    await ph.goto(A + '#/kitchen?s=PCP-0001&v=0&g=' + pots[m].join(',')); await ph.waitForTimeout(900);
    r['phoneOverflow-' + m] = await ph.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    await ph.screenshot({ path: shots + '51-phone-' + m + '.png' });
  }
  await ph.goto(A + '#/kitchen'); await ph.waitForTimeout(700);
  r.phonePantryOverflow = await ph.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  await ph.screenshot({ path: shots + '52-phone-pantry.png' });
  r.errors = errs;
  console.log(JSON.stringify(r, null, 1));
  await br.close();
})();
