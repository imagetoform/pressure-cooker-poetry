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
    // Same link, same card.
    const html1 = await p.innerHTML('#card'), url = p.url();
    const p2 = await ctx.newPage(); await p2.goto(url); await p2.waitForSelector('.cc-card .cc-strip');
    check(html1 === await p2.innerHTML('#card'), label + ': opening the link rebuilds the identical card');
    await p2.close();
    // Cut again changes the card but keeps picks and words.
    await p.click('#again'); await p.waitForTimeout(100);
    check(html1 !== await p.innerHTML('#card'), label + ': Cut again makes a different card');
    // Save puts it on the shelf.
    await p.click('#save');
    check((await p.locator('#shelf .cc-card').count()) === 1, label + ': Save puts the card on the shelf');
    check(!errs.length, label + ': no page errors ' + errs.join(' | '));
    await p.screenshot({ path: 'shots/cutup-' + label.replace(/\W+/g, '') + '.png', fullPage: false });
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
        const plan = C.make(D, { picks, text: i % 3 ? 'nobody owns the weather ' + i : '', seed: 's' + i, knobs: { maxWords: 1 + (i % 7), strips: 3 + (i % 6) } });
        plan.strips.forEach(s => { if (!s.text) out.push('empty strip at seed ' + i); if (s.src === 'poem' && !poems[s.poem].stanzas[s.at[0]][s.at[1]].includes(s.text)) out.push('inexact at ' + i + ': ' + s.text); });
        if (JSON.stringify(plan) !== JSON.stringify(C.make(D, { picks, text: i % 3 ? 'nobody owns the weather ' + i : '', seed: 's' + i, knobs: { maxWords: 1 + (i % 7), strips: 3 + (i % 6) } }))) out.push('not repeatable at ' + i);
      }
      return out;
    });
    check(!bad.length, '300 seeded cards: ' + bad.slice(0, 5).join(' | '));
    await ctx.close();
  }
  await b.close();
  if (fails.length) { console.log('FAIL:\n - ' + fails.join('\n - ')); process.exit(1); }
  console.log('PASS: cutup sandbox - pick 3, add words, cut on Pixel 7, 320px and desktop; poem strips exact; your words in order; credits link; same link same card; cut again; save; 300 seeded cards exact and repeatable.');
})();
