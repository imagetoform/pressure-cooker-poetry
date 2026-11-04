const { chromium } = require('playwright');
const out = require('path').join(__dirname, '..', 'shots');
(async () => {
  const b = await chromium.launch(); const errors = [];
  async function page(w, h, n) { const c = await b.newContext({ viewport: { width: w, height: h } }); const p = await c.newPage();
    p.on('pageerror', e => errors.push(n + ' ' + e.message)); p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errors.push(n + ' ' + m.text()); }); return p; }
  const base = 'http://127.0.0.1:8765/index.html';
  const p = await page(1400, 900, 'wide');
  await p.goto(base + '#/kitchen'); await p.waitForTimeout(700);
  await p.click('.tile[data-id="grandmothers-hands"]'); await p.click('.tile[data-id="earnings-call"]');
  const fl = await p.$$eval('.fl-row', rs => rs.map(r => r.dataset.taste + '=' + r.querySelector('.fl-v').textContent).join(' '));
  await p.screenshot({ path: out + '/20-console.png', clip: { x: 0, y: 0, width: 420, height: 900 } });
  await p.goto(base + '#/food-bank'); await p.waitForTimeout(400);
  await p.screenshot({ path: out + '/21-foodbank.png' });
  const cans = await p.$$eval('.fb-can', x => x.length);
  await p.click('.fb-dir a >> nth=5'); await p.waitForTimeout(400);
  const y = await p.evaluate(() => [location.hash, Math.round(document.getElementById('aisle-esoteric').getBoundingClientRect().top)]);
  await p.screenshot({ path: out + '/22-aisle.png' });
  await p.goto(base + '#/essays/mailman-and-drill-sergeant'); await p.waitForTimeout(400);
  await p.evaluate(() => document.querySelector('.fb-strip').scrollIntoView({ block: 'center' }));
  await p.screenshot({ path: out + '/23-essay-strip.png' });
  await p.click('.fb-strip a >> nth=1'); await p.waitForTimeout(500);
  const afterStrip = await p.evaluate(() => [location.hash, Math.round(document.getElementById('aisle-labor').getBoundingClientRect().top)]);
  await p.goto(base + '#/read/arsonist-01-first-mark'); await p.waitForTimeout(400);
  const readerStrip = await p.$$eval('.reader .fb-strip a', x => x.map(a => a.getAttribute('href')));
  for (const w of [1000, 1180]) { await p.setViewportSize({ width: w, height: 800 }); await p.goto(base + '#/kitchen'); await p.waitForTimeout(400); await p.screenshot({ path: out + '/24-nav-' + w + '.png', clip: { x: 0, y: 0, width: w, height: 70 } }); }
  const m = await page(390, 844, 'narrow');
  await m.goto(base + '#/food-bank'); await m.waitForTimeout(500);
  await m.screenshot({ path: out + '/25-mobile-foodbank.png' });
  await m.evaluate(() => document.getElementById('aisle-poetry').scrollIntoView()); await m.waitForTimeout(200);
  await m.screenshot({ path: out + '/26-mobile-aisle.png' });
  console.log(JSON.stringify({ fl, cans, y, afterStrip, readerStrip }));
  console.log('ERRORS', errors.length ? errors : 'none');
  await b.close();
})();
