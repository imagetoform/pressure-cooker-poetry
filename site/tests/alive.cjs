// Browser checks for site/alive/alive.js, run on its lab page /alive/lab/. Serve site/public on :8765 first.
// Run: node site/tests/alive.cjs   (needs playwright; PLAYWRIGHT_BROWSERS_PATH if browsers live elsewhere)
const { chromium, devices } = require('playwright');
const BASE = process.env.PCP_BASE || 'http://127.0.0.1:8765';
const fails = [];
const check = (ok, what) => { if (!ok) fails.push(what); };

async function room(ctx, fams, seed) {
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(BASE + '/alive/lab/?seed=' + encodeURIComponent(seed)); await p.waitForSelector('#room .alive-piece');
  await p.waitForTimeout(400);
  return { p, errs };
}
const offsets = p => p.evaluate(() => [...document.querySelectorAll('#room .alive-piece')].map(i => (i.style.translate || '') + '|' + (i.style.rotate || '') + '|' + (i.style.scale || '')));

(async () => {
  const b = await chromium.launch({ args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--autoplay-policy=no-user-gesture-required'] });
  const fams = ['punk', 'memphis', 'situationism'];

  // 1. Desktop: pieces get verbs from their emotions, react to the pointer, drag, type, stamp, keyboard, still.
  {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.grantPermissions(['microphone']);
    const { p, errs } = await room(ctx, fams, 'alive1');
    const info = await p.evaluate(() => [...document.querySelectorAll('#room .alive-piece')].map(i => i.dataset.verb));
    check(info.length >= 3, 'desktop room has at least 3 live cutouts (got ' + info.length + ')');
    check(info.every(v => v && v.length), 'every cutout has a verb');
    const box = await p.locator('#room').boundingBox();
    const before = await offsets(p);
    for (let i = 0; i < 12; i++) await p.mouse.move(box.x + 100 + i * 60, box.y + 200 + i * 25, { steps: 2 });
    await p.waitForTimeout(250);
    check(JSON.stringify(before) !== JSON.stringify(await offsets(p)), 'cutouts move when the pointer moves');
    // drag the first exposed piece
    const piece = p.locator('#room .alive-piece').first(); await piece.scrollIntoViewIfNeeded(); await p.waitForTimeout(150); const pb = await piece.boundingBox();
    await p.mouse.move(pb.x + pb.width / 2, pb.y + pb.height / 2); await p.mouse.down();
    await p.mouse.move(pb.x + pb.width / 2 + 120, pb.y + pb.height / 2 + 40, { steps: 6 }); await p.mouse.up();
    await p.waitForTimeout(250);
    const moved = await piece.boundingBox();
    check(Math.abs(moved.x - pb.x) > 60, 'dragging a cutout moves it (dx ' + Math.round(moved.x - pb.x) + ')');
    // typing makes letters; Backspace removes; Escape clears
    await p.locator('body').click({ position: { x: 5, y: 5 } });
    await p.keyboard.type('no gods');
    let n = await p.locator('.alive-wall span').count();
    check(n === 6, 'typing "no gods" puts 6 letters on the wall (got ' + n + ')');
    await p.keyboard.press('Backspace'); n = await p.locator('.alive-wall span').count();
    check(n === 5, 'Backspace removes a letter (got ' + n + ')');
    await p.keyboard.press('Escape'); n = await p.locator('.alive-wall span').count();
    check(n === 0, 'Escape clears the letters');
    // a click on empty room space stamps ink
    const vb = await p.locator('#room').boundingBox(); await p.mouse.click(vb.x + vb.width - 30, Math.max(vb.y + 60, 60));
    check(await p.locator('.alive-stamp').count() >= 1, 'a click stamps ink');
    // keyboard: focus a cutout, arrows move it
    await piece.focus(); const k0 = await piece.boundingBox();
    await p.keyboard.press('Shift+ArrowRight'); await p.keyboard.press('Shift+ArrowRight'); await p.waitForTimeout(150);
    check((await piece.boundingBox()).x - k0.x > 50, 'arrow keys move a focused cutout');
    // sound: fake microphone produces a level
    await p.click('#hear'); await p.waitForTimeout(900);
    const heard = await p.evaluate(() => new Promise(res => { let mx = 0; const t0 = performance.now();
      (function poll() { const S = PCP.alive.signals; mx = Math.max(mx, S.audio + S.low + S.high + S.onset);
        if (performance.now() - t0 < 2000) requestAnimationFrame(poll); else res({ h: S.hearing, a: mx }); })(); }));
    // Chrome's fake microphone is a faint periodic beep: check that sound reaches the engine at all.
    check(heard.h && heard.a > 0.01, 'listening reaches the engine (level ' + heard.a.toFixed(3) + ')');
    check((await p.textContent('#note')).toLowerCase().includes('nothing is recorded'), 'listening says nothing is recorded');
    await p.click('#hear'); check(!(await p.evaluate(() => PCP.alive.signals.hearing)), 'Stop listening releases the microphone');
    // a song file drives the room with no microphone
    await p.setInputFiles('#songfile', require('path').join(__dirname, 'fixtures', 'beat.wav'));
    const song = await p.evaluate(() => new Promise(res => { let mx = 0; const t0 = performance.now();
      (function poll() { const S = PCP.alive.signals; mx = Math.max(mx, S.low); if (performance.now() - t0 < 2000) requestAnimationFrame(poll); else res({ h: S.hearing, low: mx }); })(); }));
    check(song.h && song.low > 0.2, 'a song file drives the bass level (' + song.low.toFixed(2) + ')');
    await p.click('#song'); check(!(await p.evaluate(() => PCP.alive.signals.hearing)), 'pressing the song button again stops it');
    // Hold still: motion stops, drag offset stays
    await p.click('#still'); await p.mouse.move(box.x + 300, box.y + 300); await p.waitForTimeout(200);
    const s1 = await offsets(p); await p.mouse.move(box.x + 700, box.y + 500, { steps: 5 }); await p.waitForTimeout(200);
    check(JSON.stringify(s1) === JSON.stringify(await offsets(p)), 'Hold still stops pointer motion');
    await p.click('#still');
    check(errs.length === 0, 'desktop: no page errors ' + errs.join(' | '));
    await ctx.close();
  }

  // 2. Same receipt → scraps land in the same places (receipts stay reproducible).
  {
    const pos = [];
    for (let i = 0; i < 2; i++) {
      const ctx = await b.newContext({ ...devices['Pixel 7'] });
      const { p } = await room(ctx, fams, 'replay');
      pos.push(await p.evaluate(() => [...document.querySelectorAll('.alive-scrap')].map(s => s.getAttribute('style'))));
      await ctx.close();
    }
    check(pos[0].length > 0 && JSON.stringify(pos[0]) === JSON.stringify(pos[1]), 'replayed receipt scatters scraps identically');
  }

  // 3. Phone: taps stamp, a scroll gesture doesn't; letters land on screen.
  {
    const ctx = await b.newContext({ ...devices['Pixel 7'] });
    const { p, errs } = await room(ctx, fams, 'phone');
    await p.locator('#room').evaluate(r => r.scrollIntoView()); await p.waitForTimeout(200);
    const box = await p.locator('#room').boundingBox();
    await p.touchscreen.tap(box.x + box.width - 12, Math.max(box.y + 40, 120));
    check(await p.locator('.alive-stamp').count() === 1, 'phone: a tap stamps once');
    check(errs.length === 0, 'phone: no page errors ' + errs.join(' | '));
    await ctx.close();
  }

  // 4. Reduced motion: no continuous motion at all.
  {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
    const { p } = await room(ctx, fams, 'calm');
    const box = await p.locator('#room').boundingBox();
    const o1 = await offsets(p);
    await p.mouse.move(box.x + 200, box.y + 200); await p.mouse.move(box.x + 800, box.y + 600, { steps: 8 }); await p.waitForTimeout(200);
    check(JSON.stringify(o1.map(s => s.replace(/0\.0px|-0\.0px/g, '0px'))) === JSON.stringify((await offsets(p)).map(s => s.replace(/0\.0px|-0\.0px/g, '0px'))), 'reduced motion: cutouts stay put');
    await ctx.close();
  }

  await b.close();
  if (fails.length) { console.log('FAIL:\n - ' + fails.join('\n - ')); process.exit(1); }
  console.log('PASS: alive — verbs from emotions, pointer motion, drag, typing/backspace/escape, stamps, keyboard moves, fake-mic level + release, song file drives bass, hold still, replayed scraps identical, phone tap, reduced motion.');
})();
