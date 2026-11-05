// Writes library folders for all movements (new ones get README) and a shopping list per movement.
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const ROOT = '/home/claude/pressure-cooker-poetry/library';
const list = JSON.parse(fs.readFileSync('/root/tasks/pcp-site-update/intake/db-expansion-v1/pcp-database-expansion/cutout-shopping-list.json', 'utf8'));
(async () => {
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto('http://127.0.0.1:8765/index.html#/kitchen'); await p.waitForTimeout(600);
  const ALL = await p.evaluate(() => PCP.styles.ALL.map(m => ({ id: m.id, name: m.name, branch: m.branch, branchName: m.branchName, blurb: m.blurb, emo: m.emo, layout: m.layout, motion: m.motion, colors: m.colors, texture: m.texture || null })));
  await b.close();
  const fixed = list.map(c => {
    const fam = c.family === 'swiss-international' ? 'swiss' : c.family;
    const id = c.id.replace(/^swiss-international-/, 'swiss-');
    return { id, label: c.label, family: fam, emo: c.emo, cats: c.cats, status: 'wanted', file: id + '.png', src: null, fallback: null, source: null, notes: 'tags are a first guess; re-tag from the real image' };
  });
  fs.writeFileSync(ROOT + '/cutouts/shopping-list.json', JSON.stringify(fixed, null, 1) + '\n');
  let made = 0;
  for (const m of ALL) {
    const dir = path.join(ROOT, 'families', m.branch, m.id);
    fs.mkdirSync(path.join(dir, 'cutouts'), { recursive: true });
    if (!fs.existsSync(path.join(dir, 'cutouts', '.gitkeep'))) fs.writeFileSync(path.join(dir, 'cutouts', '.gitkeep'), '');
    if (!fs.existsSync(path.join(dir, 'README.md'))) {
      made++;
      fs.writeFileSync(path.join(dir, 'README.md'), `# ${m.name}\n\n${m.blurb}\n\n| Kit part | Value |\n|---|---|\n| Branch | ${m.branchName} |\n| Emotions (dartboard tags) | ${m.emo.join(', ')} |\n| Layout grammar | ${m.layout || 'none (the pressure picks)'} |\n| Motion | sty-${m.motion} |\n| Button skin | \`body[data-sty="${m.id}"]\` in site/src/extra.css |\n| Colors | ${m.colors.join(' ')} |\n| Texture | ${m.texture || 'none'} |\n\n## Cutouts\n\nPut this movement's cutouts (transparent PNG or SVG) in \`cutouts/\`. Tag each one in the lab tagger (\`?lab=1#/lab\`) and paste the entries into the cutout manifest.\n`);
    }
    const want = fixed.filter(c => c.family === m.id);
    let md = `# ${m.name}: cutouts to find or make\n\nA shopping list, not images. Nothing here is loaded by the site until a real file exists.\nThe emotion tags are ChatGPT's first guess, assigned in rotation; when you have the actual picture, tag it by what it feels like (the lab tagger, \`?lab=1#/lab\`).\nWrite down where each one came from (scan, collection, your own drawing) and its rights before it goes live.\n\n| Got it | Cutout | File name | First-guess tags | Categories |\n|---|---|---|---|---|\n`;
    want.forEach(c => { md += `| [ ] | ${c.label} | \`${c.file}\` | ${c.emo.join(', ')} | ${c.cats.join(', ') || '-'} |\n`; });
    fs.writeFileSync(path.join(dir, 'SHOPPING.md'), md);
  }
  console.log('movements', ALL.length, '| new READMEs', made, '| wanted cutouts', fixed.length, '| families covered', new Set(fixed.map(c => c.family)).size);
})();
