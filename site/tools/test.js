const { chromium } = require('playwright');
const path = require('path');
const out = path.join(__dirname, '..', 'shots');
require('fs').mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  const errors = [];
  async function page(w, h, name) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    p.on('pageerror', e => errors.push(name + ' pageerror: ' + e.message));
    p.on('console', m => { if (m.type() === 'error') errors.push(name + ' console: ' + m.text()); });
    return p;
  }
  const base = 'http://127.0.0.1:8765/index.html';

  // ---- wide kitchen ----
  const p = await page(1400, 900, 'wide');
  await p.goto(base + '#/kitchen'); await p.waitForTimeout(800);
  await p.click('.tile[data-id="grandmothers-hands"]');
  await p.click('.tile[data-id="earnings-call"]');
  const fl1 = await p.$$eval('.fl-row', rs => rs.map(r => r.dataset.taste + '=' + r.querySelector('.fl-v').textContent));
  const tileTaste = await p.$eval('.tile[data-id="grandmothers-hands"] .tile-taste', e => e.textContent);
  const dialsGone = await p.$$eval('input[type=range]', x => x.length);
  await p.click('#cookBtn'); await p.waitForTimeout(1800);
  await p.screenshot({ path: out + '/1-kitchen-wide.png' });
  // coupon
  await p.click('#couponBtn'); await p.waitForTimeout(300);
  await p.screenshot({ path: out + '/2-coupon.png' });
  const couponCode = await p.$eval('.cp-code', e => e.textContent);
  const dl = p.waitForEvent('download', { timeout: 5000 }).catch(() => null);
  await p.click('text=Save coupon image');
  const d = await dl; const dlName = d ? d.suggestedFilename() : 'NONE';
  await p.keyboard.press('Escape');
  const modalGone = await p.$('#couponModal') === null;
  const drawer = await p.evaluate(() => PCP.coupon.drawer().length);

  // archive + sort by bitter
  await p.goto(base + '#/archive'); await p.waitForTimeout(400);
  await p.selectOption('#archSort', 'bitter'); await p.waitForTimeout(200);
  await p.screenshot({ path: out + '/3-archive.png' });

  // reader + wall: draw a circle
  await p.goto(base + '#/read/arsonist-01-first-mark'); await p.waitForTimeout(500);
  const cv = await p.$('.wall-canvas'); const bb = await cv.boundingBox();
  const cx = bb.x + bb.width / 2, cy = bb.y + bb.height / 2, r = bb.width * 0.3;
  await p.mouse.move(cx + r, cy); await p.mouse.down();
  for (let k = 1; k <= 40; k++) { const a = k / 40 * Math.PI * 2; await p.mouse.move(cx + r * Math.cos(a), cy + r * Math.sin(a)); }
  await p.mouse.up(); await p.waitForTimeout(1100);
  const guess1 = await p.$eval('.wall-guess', e => e.textContent);
  const quote1 = await p.$eval('.wall-quote', e => e.textContent);
  const hits = await p.$$eval('.wall-hit', x => x.length);
  await p.screenshot({ path: out + '/4-reader-wall.png' });
  // zigzag
  await p.click('text=Wipe the wall');
  const pts = [[0,1],[1,0],[2,1],[3,0],[4,1],[5,0],[6,1]];
  await p.mouse.move(bb.x + 20, bb.y + bb.height * .65); await p.mouse.down();
  for (const [x, y] of pts) await p.mouse.move(bb.x + 20 + x * (bb.width - 40) / 6, bb.y + bb.height * (0.35 + y * 0.3), { steps: 6 });
  await p.mouse.up(); await p.waitForTimeout(1100);
  const guess2 = await p.$eval('.wall-guess', e => e.textContent);
  const quote2 = await p.$eval('.wall-quote', e => e.textContent);

  // essays
  await p.goto(base + '#/essays'); await p.waitForTimeout(300);
  await p.screenshot({ path: out + '/5-essays.png' });
  await p.click('.es-card-t a >> nth=0'); await p.waitForTimeout(400);
  const nCites = await p.$$eval('a.cite', x => x.length);
  const nRc = await p.$$eval('.rc-item', x => x.length);
  const sents = await p.$$eval('.sent', x => x.length);
  await p.click('a.cite[data-cite="17"]'); await p.waitForTimeout(900);
  const hashAfterCite = await p.evaluate(() => location.hash);
  await p.screenshot({ path: out + '/6-receipt.png' });
  await p.goto(base + '#/essays/mailman-and-drill-sergeant'); await p.waitForTimeout(400);
  await p.screenshot({ path: out + '/7-essay2-top.png' });
  // how
  await p.goto(base + '#/how'); await p.waitForTimeout(300);
  await p.screenshot({ path: out + '/8-how.png', fullPage: true });

  // ---- narrow ----
  const m = await page(390, 844, 'narrow');
  await m.goto(base + '#/kitchen'); await m.waitForTimeout(800);
  await m.screenshot({ path: out + '/9-mobile-kitchen.png' });
  await m.click('#sheetBtn'); await m.waitForTimeout(400);
  await m.screenshot({ path: out + '/10-mobile-sheet.png' });
  await m.goto(base + '#/read/arsonist-01-first-mark'); await m.waitForTimeout(400);
  await m.evaluate(() => document.querySelector('.wall').scrollIntoView());
  await m.screenshot({ path: out + '/11-mobile-wall.png' });
  await m.goto(base + '#/essays/grimoire-grammar-glamour'); await m.waitForTimeout(400);
  await m.screenshot({ path: out + '/12-mobile-essay.png' });
  await m.evaluate(() => document.querySelector('.receipt').scrollIntoView());
  await m.screenshot({ path: out + '/13-mobile-receipt.png' });

  console.log(JSON.stringify({ fl1, tileTaste, dialsGone, couponCode, dlName, modalGone, drawer, guess1, quote1, hits, guess2, quote2, nCites, nRc, sents, hashAfterCite }, null, 1));
  console.log('ERRORS', errors.length ? errors : 'none');
  await browser.close();
})();
