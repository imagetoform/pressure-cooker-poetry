const { chromium } = require('playwright');
const out = require('path').join(__dirname, '..', 'shots');
(async () => {
  const b = await chromium.launch(); const errors = [];
  const c = await b.newContext({ viewport: { width: 1400, height: 900 } }); const p = await c.newPage();
  p.on('pageerror', e => errors.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errors.push(m.text()); });
  const base = 'http://127.0.0.1:8765/index.html';
  await p.goto(base + '#/kitchen'); await p.waitForTimeout(800);
  const vis = sel => p.$eval(sel, e => !!(e.offsetWidth || e.offsetHeight)).catch(() => 'missing');
  const visitor = { tiles: await p.$$eval('.tile', x => x.length), flavor: await vis('#dials'), poemSel: await vis('#poemSelect'), seed: await vis('#seedInput'), inspector: await vis('#inspector'), coupon: await vis('#couponBtn'), sliders: await p.$$eval('input[type=range]', x => x.length) };
  const poem0 = await p.evaluate(() => PCP.app.cooked.poemId);
  await p.click('.tile[data-id="mutual-aid"]'); await p.click('.tile[data-id="insulin-patent"]');
  await p.click('#cookBtn'); await p.waitForTimeout(1800);
  const poem1 = await p.evaluate(() => PCP.app.cooked.poemId);
  // determinism: same pot -> same poem
  await p.click('.pot-item >> nth=1'); await p.click('.tile[data-id="insulin-patent"]');
  const poem1b = await p.evaluate(() => document.getElementById('poemSelect').value);
  await p.screenshot({ path: out + '/30-visitor-console.png', clip: { x: 0, y: 0, width: 1400, height: 900 } });
  await p.evaluate(() => document.querySelector('.console-scroll').scrollTo(0, 99999)); await p.waitForTimeout(200);
  await p.screenshot({ path: out + '/31-visitor-console-bottom.png', clip: { x: 0, y: 0, width: 420, height: 900 } });
  // lab mode
  await p.goto(base + '?lab=1#/kitchen'); await p.waitForTimeout(700);
  const lab = { flavor: await vis('#dials'), seed: await vis('#seedInput'), inspector: await vis('#inspector') };
  await p.goto(base + '?lab=0#/kitchen'); await p.waitForTimeout(500);
  const labOff = await vis('#dials');
  const m = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
  await m.goto(base + '#/kitchen'); await m.waitForTimeout(700); await m.click('#sheetBtn'); await m.waitForTimeout(400);
  await m.screenshot({ path: out + '/32-mobile-sheet.png' });
  console.log(JSON.stringify({ visitor, poem0, poem1, poem1b, lab, labOff }));
  console.log('ERRORS', errors.length ? errors : 'none');
  await b.close();
})();
