// Whole-site checks after the reset (CANON D-31..D-34). Serve site/public on :8765 first.
// Run: node site/tests/site.cjs   (needs playwright; PLAYWRIGHT_BROWSERS_PATH if browsers live elsewhere)
// Checks every built page at 320 px and desktop: no page errors, no missing local files, no sideways scroll.
// Checks every poem page shows every line exactly as content/poems.json stores it (AGENTS.md law 1).
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const BASE = process.env.PCP_BASE || 'http://127.0.0.1:8765';
const PUB = path.join(__dirname, '..', 'public');
const REPO = path.join(__dirname, '..', '..');
const fails = [];
const check = (ok, what) => { if (!ok) fails.push(what); };

function pages(dir, rel = '/') {
  let out = [];
  for (const f of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) out = out.concat(pages(p, rel + f + '/'));
    else if (f === 'index.html') out.push(rel);
  }
  return out;
}

(async () => {
  const urls = pages(PUB);
  const poems = JSON.parse(fs.readFileSync(path.join(REPO, 'content/poems.json'), 'utf8'));
  const essays = JSON.parse(fs.readFileSync(path.join(REPO, 'content/essays.json'), 'utf8'));
  check(urls.length >= poems.length + essays.length + 8, 'expected every poem, essay and section page (found ' + urls.length + ' pages)');
  check(!fs.existsSync(path.join(PUB, 'kitchen')), 'the Kitchen is not in the build');
  const redirects = fs.readFileSync(path.join(PUB, '_redirects'), 'utf8');
  check(/^\/kitchen\/\* \/poems\/ 301$/m.test(redirects), 'old /kitchen/ links redirect to /poems/');

  const b = await chromium.launch();
  for (const [label, viewport] of [['320px', { width: 320, height: 700 }], ['desktop', { width: 1280, height: 900 }]]) {
    const ctx = await b.newContext({ viewport });
    const p = await ctx.newPage();
    let errs = [], missing = [];
    p.on('pageerror', e => errs.push(e.message));
    p.on('response', r => { if (r.url().startsWith(BASE) && r.status() >= 400) missing.push(r.status() + ' ' + r.url().slice(BASE.length)); });
    for (const u of urls) {
      const raw = fs.readFileSync(path.join(PUB, u, 'index.html'), 'utf8');
      const fwd = raw.match(/http-equiv="refresh" content="0;url=([^"]+)"/);
      if (fwd) { check(urls.includes(fwd[1]), u + ' forwards to a real page (' + fwd[1] + ')'); continue; }
      errs = []; missing = [];
      await p.goto(BASE + u, { waitUntil: 'load' });
      const wide = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      check(wide <= 1, label + ' ' + u + ': no sideways scroll (' + wide + 'px over)');
      check(!errs.length, label + ' ' + u + ': page errors ' + errs.join(' | '));
      check(!missing.length, label + ' ' + u + ': missing files ' + missing.join(', '));
    }
    await ctx.close();
  }

  // Every poem line, verbatim, in order.
  const ctx = await b.newContext({ viewport: { width: 390, height: 800 } });
  const p = await ctx.newPage();
  let lines = 0;
  for (const poem of poems) {
    await p.goto(BASE + '/poems/' + poem.id + '/');
    const shown = await p.$$eval('.stanza', ss => ss.map(s => [...s.querySelectorAll('.line')].map(l => l.textContent)));
    const ok = JSON.stringify(shown) === JSON.stringify(poem.stanzas);
    check(ok, 'poem ' + poem.id + ' shows every line exactly as written');
    lines += poem.stanzas.flat().length;
    check((await p.textContent('h1')) === poem.title, 'poem ' + poem.id + ' title');
  }
  for (const e of essays) {
    await p.goto(BASE + '/essays/' + e.id + '/');
    const n = await p.$$eval('.receipts li', l => l.length);
    check(n === (e.receipts || []).length, 'essay ' + e.id + ' prints all ' + (e.receipts || []).length + ' sources (got ' + n + ')');
    const cites = await p.$$eval('a.cite', a => a.map(x => x.getAttribute('href')));
    check(cites.every(h => /^#r-\d+$/.test(h)), 'essay ' + e.id + ' citation links point at its sources');
  }
  await ctx.close();
  await b.close();
  // Contact: a Netlify form Netlify can detect at deploy, a honeypot, a required message, and a real thank-you page.
  const contact = fs.readFileSync(path.join(PUB, 'contact/index.html'), 'utf8');
  check(/<form[^>]*name="contact"[^>]*data-netlify="true"/.test(contact) && /name="form-name" value="contact"/.test(contact), 'contact form is a detectable Netlify form');
  check(/netlify-honeypot="bot-field"/.test(contact) && /name="bot-field"/.test(contact), 'contact form has a honeypot');
  check(/<textarea[^>]*name="message"[^>]*required/.test(contact), 'contact message is required');
  check(/action="\/contact\/sent\/"/.test(contact) && fs.existsSync(path.join(PUB, 'contact/sent/index.html')), 'contact form lands on /contact/sent/');
  if (fails.length) { console.log('FAIL:\n - ' + fails.join('\n - ')); process.exit(1); }
  console.log('PASS: site - ' + urls.length + ' pages at 320px and desktop (no errors, no missing files, no sideways scroll); ' +
    poems.length + ' poems, ' + lines + ' lines verbatim; ' + essays.length + ' essays with sources; Kitchen gone and redirected.');
})();
