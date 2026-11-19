// Browser checks for the cutup maker sandbox (/lab/cutup/, go-live Step 3). Serve site/public on :8765 first.
// Checks: picking + cutting works on a phone and at 320px; every poem strip is an exact slice of a stored line (law 1);
// the visitor's words stay in their typed order; the same link rebuilds the same card (law 2); save works; no page errors.
const fs = require('fs'), path = require('path');
const { chromium, devices } = require('playwright');
const BASE = process.env.PCP_BASE || 'http://127.0.0.1:8765';
const poems = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'content/poems.json'), 'utf8'));
const byId = Object.fromEntries(poems.map(p => [p.id, p]));
const fails = [];
const check = (ok, what) => { if (!ok) fails.push(what); };

async function cutOne(p, words) {
  await p.goto(BASE + '/lab/cutup/'); await p.waitForSelector('.tile img');
  const tiles = p.locator('.tile');
  for (let i = 0; i < 3; i++) await tiles.nth(i * 2).click();
  check(await p.locator('#cut').isEnabled(), 'Cut it up turns on after 3 picks');
  await p.fill('#words', words);
  await p.click('#cut'); await p.waitForSelector('.cc-card .cc-strip');
}

(async () => {
  const b = await chromium.launch();
  for (const [label, opts] of [['Pixel 7', devices['Pixel 7']], ['320px', { viewport: { width: 320, height: 720 }, hasTouch: true }], ['desktop', { viewport: { width: 1280, height: 900 } }]]) {
    const ctx = await b.newContext(opts); const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    const mine = 'the rent is a weather system';
    await cutOne(p, mine);
    // The plan the page drew: check it against the source text.
    const plan = await p.evaluate(() => { const D = PCP.cutupData; const st = JSON.parse(decodeURIComponent(location.hash.slice(1))); return PCP.cutup.make(D, st); });
    const shown = await p.$$eval('.cc-card .cc-strip', s => s.map(x => x.textContent));
    check(JSON.stringify(shown) === JSON.stringify(plan.strips.map(s => s.text)), label + ': the card shows the planned strips');
    for (const s of plan.strips.filter(s => s.src === 'poem')) {
      const line = byId[s.poem].stanzas[s.at[0]][s.at[1]];
      check(s.text.length > 0 && line.includes(s.text), label + ': poem strip "' + s.text + '" is an exact slice of its line');
    }
    const you = plan.strips.filter(s => s.src === 'you').map(s => s.text);
    check(you.length > 0, label + ': some of the visitor\'s words made it onto the card');
    check(mine.startsWith(you.join(' ')), label + ': the visitor\'s words stay in their typed order (' + you.join(' | ') + ')');
    check(plan.credit.length >= 1 && plan.credit.every(c => byId[c.id]), label + ': the card credits the poems it cut from');
    check((await p.locator('.cc-credit a').count()) === plan.credit.length, label + ': each credit links to its poem');
    const wide = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    check(wide <= 1, label + ': no sideways scroll (' + wide + 'px)');
    // Same link, same card. (The alive engine nudges pictures every frame, so compare the plan and what's printed, not raw HTML.)
    const snap = pg => pg.evaluate(() => JSON.stringify({ plan: PCP.cutup.make(PCP.cutupData, JSON.parse(decodeURIComponent(location.hash.slice(1)))),
      strips: [...document.querySelectorAll('#card .cc-strip')].map(x => x.textContent), imgs: [...document.querySelectorAll('#card .cc-img')].map(i => i.getAttribute('src')) }));
    const one = await snap(p), url = p.url();
    const p2 = await ctx.newPage(); await p2.goto(url); await p2.waitForSelector('.cc-card .cc-strip');
    check(one === await snap(p2), label + ': opening the link rebuilds the identical card');
    await p2.close();
    // Tapping a strip lifts it and says where it came from.
    const first = p.locator('#card .cc-strip').first();
    await first.click();
    const from = await first.getAttribute('data-from');
    check(from === 'yours' || /^from /.test(from || ''), label + ': tapping a strip says where it came from (' + from + ')');
    // The pictures are alive: draggable, focusable.
    check((await p.locator('#card .cc-img.alive-piece').count()) === plan.imgs.length, label + ': every picture on the card is a movable cutout');
    check(/Poems you’ve cut from: \d+ of 56/.test(await p.textContent('#found')), label + ': the found-poems count shows');
    // Cut again changes the card but keeps picks and words.
    await p.click('#again'); await p.waitForTimeout(100);
    check(one !== await snap(p), label + ': Cut again makes a different card');
    // Save puts it on the shelf.
    await p.click('#save');
    check((await p.locator('#shelf .cc-card').count()) === 1, label + ': Save puts the card on the shelf');
    check(!errs.length, label + ': no page errors ' + errs.join(' | '));
    await p.screenshot({ path: 'shots/cutup-' + label.replace(/\W+/g, '') + '.png', fullPage: false });
    await ctx.close();
  }
  // Reduced motion: the card is complete and nothing animates.
  {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' }); const p = await ctx.newPage();
    await cutOne(p, 'hold still');
    const anim = await p.$$eval('#card .cc-strip, #card .cc-img, #card .cc-block, .tile', els => els.map(e => getComputedStyle(e).animationName).filter(n => n !== 'none'));
    check(!anim.length, 'reduced motion: no animations on the card or tiles (' + anim.slice(0, 3).join(',') + ')');
    check((await p.locator('#card .cc-strip').count()) >= 3, 'reduced motion: the card is complete');
    await ctx.close();
  }
  // Word games touch only the visitor's words; poem strips stay exact under every game; a shared link keeps the game.
  {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } }); const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    await cutOne(p, 'The rent is a weather system and the landlords dream');
    for (const g of ['n7', 'lipo', 'snowball']) {
      await p.click('.games [data-game="' + g + '"]'); await p.waitForTimeout(150);
      const r = await p.evaluate(() => { const st = JSON.parse(decodeURIComponent(location.hash.slice(1))); const plan = PCP.cutup.make(PCP.cutupData, st);
        const poems = Object.fromEntries(PCP.cutupData.poems.map(x => [x.id, x]));
        return { game: st.game, note: plan.gameNote, you: plan.strips.filter(s => s.src === 'you').map(s => s.text),
          exact: plan.strips.filter(s => s.src === 'poem').every(s => poems[s.poem].stanzas[s.at[0]][s.at[1]].includes(s.text)),
          tag: document.querySelector('#card .cc-game') ? document.querySelector('#card .cc-game').textContent : '' }; });
      check(r.game === g, g + ': the game is stored in the link');
      check(r.exact, g + ': poem strips are still exact slices of the poems');
      check(r.tag.startsWith('your words:'), g + ': the card says which game your words went through (' + r.tag + ')');
      if (g === 'n7') check(!r.you.join(' ').includes('weather') && !r.you.join(' ').includes('rent '), 'n7: nouns from the list were swapped (' + r.you.join(' | ') + ')');
      if (g === 'lipo') { const L = r.note.slice(-1).toLowerCase(); check(r.you.every(w => !w.toLowerCase().includes(L)), 'lipo: no visible word of yours contains the banned letter ' + L + ' (' + r.you.join(' | ') + ')'); }
      if (g === 'snowball') { const ws = r.you.join(' ').split(' '); check(ws.every((w, i) => !i || ws[i - 1].length <= w.length), 'snowball: your words run shortest to longest (' + ws.join(' ') + ')'); }
    }
    const url = p.url(); const p2 = await ctx.newPage(); await p2.goto(url); await p2.waitForSelector('#card .cc-strip');
    check((await p2.getAttribute('.games [data-game="snowball"]', 'aria-checked')) === 'true', 'opening a link restores its word game');
    // Xerox texture: Punk/Zine/Grunge/Situationism/Dada/Constructivism pictures always get it.
    const xr = await p.evaluate(() => { const D = PCP.cutupData, ids = D.assets.filter(a => a.family === 'punk').map(a => a.id).slice(0, 3);
      const plan = PCP.cutup.make(D, { picks: ids, text: '', seed: 'x' }); return plan.imgs.filter(m => m.family === 'punk').every(m => m.xerox); });
    check(xr, 'xerox: punk pictures always get the photocopy texture');
    check(!!(await p.$('#cc-filters filter#cc-xerox')), 'xerox: the photocopy filter is on the page');
    // Glitch: a drumbeat makes the pictures glitch at least once; the words never get the glitch animation.
    await p.evaluate(() => { window.__glitched = 0; new MutationObserver(() => { if (document.querySelector('#card .cc-card.cc-glitching')) window.__glitched++; }).observe(document.getElementById('card'), { subtree: true, attributes: true, attributeFilter: ['class'] }); });
    await p.setInputFiles('#s-file', require('path').join(__dirname, 'fixtures/beat.wav')); await p.waitForTimeout(2500);
    check((await p.evaluate(() => window.__glitched)) > 0, 'glitch: a drumbeat makes the pictures glitch');
    check((await p.$$eval('#card .cc-strip', s => s.filter(x => getComputedStyle(x).animationName.includes('cc-glitch')).length)) === 0, 'glitch: the words never glitch');
    check(!errs.length, 'games/xerox/glitch: no page errors ' + errs.join(' | '));
    await ctx.close();
  }
  // No words at all: all strips come from the poems.
  {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } }); const p = await ctx.newPage();
    await cutOne(p, '');
    const srcs = await p.evaluate(() => PCP.cutup.make(PCP.cutupData, JSON.parse(decodeURIComponent(location.hash.slice(1)))).strips.map(s => s.src));
    check(srcs.length >= 3 && srcs.every(s => s === 'poem'), 'no words typed: every strip comes from the poems');
    await ctx.close();
  }
  // Many seeds, straight through the engine: every poem strip exact, nothing empty.
  {
    const ctx = await b.newContext(); const p = await ctx.newPage(); await p.goto(BASE + '/lab/cutup/'); await p.waitForSelector('.tile');
    const bad = await p.evaluate(() => {
      const D = PCP.cutupData, C = PCP.cutup, out = [], ids = D.assets.map(a => a.id), poems = Object.fromEntries(D.poems.map(p => [p.id, p]));
      for (let i = 0; i < 300; i++) {
        const R = PCP.prng.makeRng('t' + i), picks = R.shuffle(ids).slice(0, 3);
        const game = ['none', 'n7', 'lipo', 'snowball'][i % 4];
        const plan = C.make(D, { picks, text: i % 3 ? 'nobody owns the weather ' + i : '', seed: 's' + i, game, knobs: { maxWords: 1 + (i % 7), strips: 3 + (i % 6) } });
        plan.strips.forEach(s => { if (!s.text) out.push('empty strip at seed ' + i); if (s.src === 'poem' && !poems[s.poem].stanzas[s.at[0]][s.at[1]].includes(s.text)) out.push('inexact at ' + i + ': ' + s.text); });
        if (JSON.stringify(plan) !== JSON.stringify(C.make(D, { picks, text: i % 3 ? 'nobody owns the weather ' + i : '', seed: 's' + i, game, knobs: { maxWords: 1 + (i % 7), strips: 3 + (i % 6) } }))) out.push('not repeatable at ' + i);
      }
      return out;
    });
    check(!bad.length, '300 seeded cards: ' + bad.slice(0, 5).join(' | '));
    await ctx.close();
  }
  await b.close();
  if (fails.length) { console.log('FAIL:\n - ' + fails.join('\n - ')); process.exit(1); }
  console.log('PASS: cutup sandbox - pick 3, add words, cut on Pixel 7, 320px and desktop; poem strips exact; your words in order; credits link; same link same card; strips say where they came from; pictures movable; found-poems count; cut again; save; reduced motion still; word games (N+7, lipogram, snowball) on your words only; xerox texture; glitch on the beat; 300 seeded cards exact and repeatable.');
})();
