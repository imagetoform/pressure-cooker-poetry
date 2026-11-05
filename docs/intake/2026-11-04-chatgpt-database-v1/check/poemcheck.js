const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch(); const out = [];
  for (const url of ['http://127.0.0.1:8766/index.html', 'http://127.0.0.1:8765/index.html']) for (let k = 0; k < 4; k++) {
    const c = await b.newContext({ viewport: { width: 1400, height: 900 } }); const p = await c.newPage();
    await p.goto(url + '#/kitchen'); await p.waitForTimeout(700);
    const ids = await p.$$eval('.tile:not([disabled])', x => x.map(e => e.dataset.id));
    const potBefore = await p.$$eval('.pot-item', x => x.length);
    for (const id of [ids[k * 23], ids[k * 23 + 11]]) await p.click('.tile[data-id="' + id + '"]');
    await p.click('#cookBtn'); await p.waitForTimeout(1800);
    out.push([url.slice(-15, -11), potBefore, await p.evaluate(() => [PCP.app.cooked.poemId, PCP.app.cooked.ingredients.join('+')])]);
    await c.close();
  }
  console.log(out.map(x => JSON.stringify(x)).join('\n')); await b.close();
})();
