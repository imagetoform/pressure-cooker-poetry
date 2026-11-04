const { chromium } = require('playwright');
const out = require('path').join(__dirname, '..', 'shots');
(async () => {
  const b = await chromium.launch(); const errors = [];
  const p = await (await b.newContext({ viewport: { width: 1400, height: 900 } })).newPage();
  p.on('pageerror', e => errors.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/404/.test(m.text())) errors.push(m.text()); });
  const base = 'http://127.0.0.1:8765/index.html';
  const pots = { bitter: ['insulin-patent', 'landlord-apology'], sweet: ['grandmothers-hands', 'porch-light'], angry: ['drum-solo', 'rent-strike', 'red-ink'], mixed: ['grandmothers-hands', 'insulin-patent', 'drum-solo'], calm: ['store-brand-silence', 'honest-sentence'] };
  const res = {};
  for (const [name, ings] of Object.entries(pots)) {
    await p.goto(base + '#/kitchen?s=PCP-0001&v=0&g=' + ings.join(',')); await p.waitForTimeout(900);
    const g = await p.evaluate(() => PCP.app.genome);
    res[name] = { family: g.family, styles: g.styles, darts: g.darts.map(d => d.tags.join('+')), layers: await p.$$eval('.sty-layer', x => x.map(e => e.dataset.style)) };
    await p.screenshot({ path: out + '/40-room-' + name + '.png' });
  }
  // visitor: no board
  const boardVisible = await p.$eval('#dartboard', e => !!e.offsetHeight);
  // lab
  await p.goto(base + '?lab=1#/kitchen?s=PCP-0001&v=0&g=' + pots.mixed.join(',')); await p.waitForTimeout(900);
  await p.evaluate(() => document.getElementById('dartboard').scrollIntoView());
  await p.screenshot({ path: out + '/41-lab-board.png', clip: { x: 0, y: 0, width: 420, height: 900 } });
  const labBoard = await p.$$eval('#dartboard .dart', x => x.length);
  // tagger: upload a generated PNG
  await p.goto(base + '?lab=1#/lab'); await p.waitForTimeout(500);
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
  await p.setInputFiles('#labFiles', [{ name: 'red-fist.png', mimeType: 'image/png', buffer: png }, { name: 'old-photo.png', mimeType: 'image/png', buffer: png }]);
  await p.waitForTimeout(300);
  await p.click('.lab-board [data-tag="rage"]'); await p.click('.lab-board [data-tag="contempt"]');
  await p.fill('.lab-pane input[type=text]', 'raised red fist');
  await p.click('.lab-thumb >> nth=1'); await p.click('.lab-board [data-tag="pensiveness"]');
  const manifest = await p.$eval('.lab-ta', e => e.value);
  await p.screenshot({ path: out + '/42-lab-tagger.png' });
  await p.goto(base + '?lab=0#/how'); await p.waitForTimeout(400);
  const howStyles = await p.$$eval('.sty-list dt', x => x.length);
  console.log(JSON.stringify({ res, boardVisible, labBoard, manifest, howStyles }, null, 1));
  console.log('ERRORS', errors.length ? errors : 'none');
  await b.close();
})();
