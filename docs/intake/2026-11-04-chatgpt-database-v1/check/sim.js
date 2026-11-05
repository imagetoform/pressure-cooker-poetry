// Seeded audit of thousands of pots through the real engine in the built page.
const { chromium } = require('playwright');
const url = process.argv[2] || 'http://127.0.0.1:8765/index.html', N = +(process.argv[3] || 6000), out = process.argv[4] || 'sim-after.json';
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto(url + '#/kitchen'); await p.waitForTimeout(800);
  const res = await p.evaluate((N) => {
    const E = PCP.engine, ING = PCP.ingredients, ctx = { families: PCP.families, assets: PCP.assets, ingredients: ING, mode: 'wide' };
    const DEF = { energy: 62, clarity: 44, intimacy: 52, chaos: 58 };
    const rng = E.makeRng('audit-pots');
    const C = (o, k) => (o[k] = (o[k] || 0) + 1);
    const rings = {}, petals = {}, prim = {}, sec = {}, fam = {}, branch = {}, assets = {}, layoutFrom = { style: 0, pressure: 0 };
    let bull = 0, darts = 0, sameDiff = 0, dupInRoom = 0, rooms = 0, perIngRings = {};
    const clamp = v => Math.max(0, Math.min(100, v));
    for (let i = 0; i < N; i++) {
      const n = 1 + Math.floor(rng.next() * 3), ids = [];
      while (ids.length < n) { const x = ING[Math.floor(rng.next() * ING.length)].id; if (ids.indexOf(x) < 0) ids.push(x); }
      const d = { e: 0, c: 0, i: 0, x: 0 }; ids.forEach(id => { const g = ING.find(q => q.id === id).d; d.e += g.e; d.c += g.c; d.i += g.i; d.x += g.x; });
      const recipe = { energy: clamp(DEF.energy + d.e), clarity: clamp(DEF.clarity + d.c), intimacy: clamp(DEF.intimacy + d.i), chaos: clamp(DEF.chaos + d.x), seed: 'SIM-' + i, variant: 0, ingredients: ids, force: null };
      const g = E.genome(recipe, ctx), g2 = E.genome(JSON.parse(JSON.stringify(recipe)), ctx);
      if (JSON.stringify(g) !== JSON.stringify(g2)) sameDiff++;
      rooms++;
      g.darts.forEach(t => { darts++; if (t.r === 0) { bull++; return; } C(rings, t.r < .42 ? 'intense' : t.r < .72 ? 'core' : 'mild'); C(petals, PCP.board.readPoint(t.angle, t.r).petal); });
      if (g.darts.some(t => t.r === 0)) C(rings, 'pots with bull');
      const s0 = g.styles[0]; C(prim, s0); if (g.styles[1]) C(sec, g.styles[1]);
      C(branch, PCP.styles.BY_ID[s0].branch);
      C(fam, g.family); PCP.styles.BY_ID[s0].layout ? layoutFrom.style++ : layoutFrom.pressure++;
      if (new Set(g.assets).size !== g.assets.length) dupInRoom++;
      g.assets.forEach(a => C(assets, a));
    }
    // each ingredient's own dart (one-ingredient pot, fixed seed)
    ING.forEach(q => { const t = PCP.board.throwDarts([q.id], ING, {}, 'single')[0]; C(perIngRings, t.ring); });
    return { N: rooms, darts, bull, rings, petals, perIngRings, prim, sec, branch, fam, layoutFrom, assets, dupInRoom, nondeterministic: sameDiff, ingredients: ING.length, styles: PCP.styles.ALL.length, assetCount: PCP.assets.length, unpickedAssets: PCP.assets.map(a => a.id).filter(id => !assets[id]) };
  }, N);
  require('fs').writeFileSync(out, JSON.stringify(res, null, 1));
  const top = (o, k = 40) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, k).map(([a, v]) => a + ' ' + (100 * v / res.N).toFixed(1) + '%').join(', ');
  console.log(url, '| ingredients', res.ingredients, '| styles', res.styles, '| rooms', res.N, '| nondeterministic', res.nondeterministic, '| dup cutouts in a room', res.dupInRoom);
  console.log(' single-ingredient rings', JSON.stringify(res.perIngRings));
  console.log(' dart rings', JSON.stringify(res.rings), '| bull darts', res.bull, 'of', res.darts);
  console.log(' petals', JSON.stringify(res.petals));
  console.log(' primary style:', top(res.prim));
  console.log(' branch:', top(res.branch));
  console.log(' layout family:', top(res.fam), '| layout set by style', (100 * res.layoutFrom.style / res.N).toFixed(1) + '%');
  console.log(' cutouts never picked:', res.unpickedAssets.join(', ') || 'none');
  await b.close();
})();
