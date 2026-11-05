const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://127.0.0.1:8765/index.html#/kitchen'); await p.waitForTimeout(800);
  const d = await p.evaluate(() => ({
    ingredients: PCP.ingredients.map(i => ({ id: i.id, text: i.text, cat: i.cat, t: i.t })),
    styles: PCP.styles.ALL.map(s => ({ id: s.id, branch: s.branch, layout: s.layout, motion: s.motion, texture: s.texture || null, emo: s.emo, colors: s.colors, name: s.name })),
    tags: PCP.board.TAGS, aliases: PCP.board.ALIASES,
    assets: (PCP.assets || []).map(a => ({ id: a.id, emo: a.emo, fallback: a.fallback, cats: a.cats })),
    cats: [...new Set(PCP.ingredients.map(i => i.cat))]
  }));
  require('fs').writeFileSync('current.json', JSON.stringify(d, null, 1));
  console.log(d.ingredients.length, 'ingredients', d.styles.length, 'styles', (d.tags||[]).length, 'tags', d.assets.length, 'assets', d.cats);
  console.log(JSON.stringify(d.styles[0]));
  await b.close();
})();
