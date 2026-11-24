// Browser checks for Brain Candy: the arcade hub and the standalone Spin Cycle. Serve site/public on :8765 first.
const { chromium, devices } = require('playwright');
const BASE = process.env.PCP_BASE || 'http://127.0.0.1:8765';
const fails = []; const check = (ok, what) => { if (!ok) fails.push(what); };
(async () => {
  const b = await chromium.launch();
  for (const [name, opt] of [['desktop', { viewport: { width: 1280, height: 900 } }], ['phone', { ...devices['Pixel 7'] }], ['reduced', { viewport: { width: 1000, height: 800 }, reducedMotion: 'reduce' }]]) {
    const ctx = await b.newContext(opt); const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message)); p.on('response', r => { if (r.status() >= 400) errs.push(r.url() + ' ' + r.status()); });
    await p.goto(BASE + '/brain-candy/spin-cycle/'); await p.waitForSelector('.box');
    check(await p.locator('.box').count() === 8, name + ': 8 detergents');
    check(await p.locator('#drum span').count() > 5, name + ': the fact tumbles in the drum');
    check(await p.locator('#spin').isDisabled(), name + ': spin is locked until 3 are loaded');
    await p.click('.box[data-id="fog"]'); await p.click('.box[data-id="stack"]'); await p.click('.box[data-id="glitter"]');
    await p.click('.box[data-id="wagon"]');   // a 4th is refused
    check((await p.evaluate(() => SPIN_STATE().picked)).length === 3, name + ': max 3 loaded');
    await p.click('#spin'); await p.waitForSelector('#release.show', { timeout: 5000 });
    check(await p.locator('#releaseLines .line').count() === 3, name + ': release has 3 spun sentences');
    check((await p.textContent('#results')).includes('Truth left'), name + ': results show calm and truth');
    await p.click('#xray');
    check(await p.evaluate(() => document.body.classList.contains('xray-on')), name + ': X-ray turns on');
    check(await p.locator('.why').first().isVisible(), name + ': X-ray shows what each sentence hides');
    check(await p.locator('#truthbox').isVisible(), name + ': X-ray shows what actually happened');
    // round 2: answer the first sentence right, the second wrong, the third right, for 3 memos
    await p.click('#toSpot');
    for (let m = 0; m < 3; m++) {
      await p.waitForFunction(i => SPIN_STATE().memoI === i && document.querySelectorAll('.sent:not(.done)').length === 3, m, { timeout: 8000 });
      for (let s = 0; s < 3; s++) {
        const sent = p.locator('.sent:not(.done)').first(); const id = await sent.getAttribute('data-id');
        await sent.click(); await p.waitForSelector('#picker.on');
        if (s === 1) { const wrong = id === 'fog' ? 2 : 1; await p.keyboard.press(String(wrong)); }   // keys 1-8 work
        else { const ids = await p.evaluate(() => SPIN.techniques.map(t => t.id)); await p.keyboard.press(String(ids.indexOf(id) + 1)); }
      }
    }
    await p.waitForSelector('#end.on', { timeout: 8000 });
    const st = await p.evaluate(() => SPIN_STATE());
    check(st.caught === 6 && st.missed === 3, name + ': 6 caught, 3 missed (got ' + st.caught + '/' + st.missed + ')');
    check(st.jar.length >= 1, name + ': caught tricks land in the jar');
    check(await p.locator('#jar .wrapper.got').count() === st.jar.length, name + ': jar shows the wrappers');
    check(await p.locator('#cards .card').count() === 8, name + ': 8 learn cards');
    check(errs.length === 0, name + ': no errors ' + errs.join(' | '));
    await p.screenshot({ path: 'shots/spin-' + name + '.png', fullPage: false });
    // the arcade hub (/brain-candy/): six cabinets, a way back to the site, Department Zero sealed until a full jar, cipher dial decodes
    await p.goto(BASE + '/brain-candy/'); await p.waitForSelector('.cab');
    check(await p.locator('.cab').count() === 6, name + ': arcade shows 6 cabinets');
    for (const href of ['/', '/my-two-cents/', '/learning/', '/about/', '/contact/']) check(await p.locator('.pcp-strip a[href="' + href + '"]').count() === 1, name + ': site strip links ' + href);
    check(await p.evaluate(() => document.fonts.check('40px Anton')), name + ': self-hosted Anton loads');
    for (const id of ['spin-cycle', 'soft', 'bias-factory', 'cutup-bench']) { await p.goto(BASE + '/brain-candy/#' + id); await p.waitForTimeout(250); check(await p.getByRole('button', { name: /All machines/ }).count() >= 1, name + ': machine opens ' + id); }
    await p.goto(BASE + '/brain-candy/#department-zero'); await p.waitForTimeout(250);
    check((await p.textContent('main')).includes('File 001 is sealed'), name + ': empty jar keeps File 001 sealed');
    await p.getByRole('button', { name: /open it anyway/i }).click();
    for (let i = 0; i < 13; i++) await p.getByRole('button', { name: 'Shift forward one letter' }).click();
    check((await p.textContent('main')).includes('NOTHING IS INEVITABLE'), name + ': ROT13 dial decodes File 001');
    check(!(await p.content()).includes('fonts.googleapis'), name + ': no Google Fonts request');
    await ctx.close();
  }
  await b.close();
  if (fails.length) { console.log('FAIL:\n - ' + fails.join('\n - ')); process.exit(1); }
  console.log('PASS: brain candy — spin cycle (load/limit/spin/release/x-ray/truth, catch-the-spin 3 memos via keys, scoring, jar, learn cards) on desktop, phone, reduced motion; arcade hub: 6 cabinets, site strip, 4 machines open, Department Zero seal and ROT13 dial.');
})();
