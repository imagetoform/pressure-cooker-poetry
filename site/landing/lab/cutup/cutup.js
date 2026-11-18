/* Cutup maker SANDBOX (go-live Step 3, CANON D-32/D-33, Q-14).
   A playable draft for Brandon to react to, not the finished front door.

   make(data, input) -> card plan (plain JSON). render(plan, el) -> draws it.
   Same picks + same words + same seed + same knobs = same plan (AGENTS.md law 2): every choice goes through PCP.prng.
   Poem strips are exact runs of Brandon's words, sliced out of the stored line by character position, never retyped (law 1, D-32).
*/
(function () {
  'use strict';
  const P = window.PCP = window.PCP || {};

  const ACCENTS = ['#ff2e88', '#ffe14d', '#2ec4d6', '#8a4dff', '#ff6a2b', '#c6ff3d'];
  const POEM_PAPER = ['#f4f1e8', '#ffe14d', '#ffd1e6', '#cfeffa', '#ffffff'];
  const YOU_PAPER = '#111111';
  const KNOBS = { picks: 3, strips: 5, mine: 0.4, maxWords: 4, ground: 'dark', shape: 'portrait' };

  // Word spans in a line: [start, end] character positions of each run of non-space characters.
  function spans(line) { const out = [], re = /\S+/g; let m; while ((m = re.exec(line))) out.push([m.index, m.index + m[0].length]); return out; }

  // An exact slice of the stored line: n consecutive words, original spacing and punctuation kept.
  function cut(R, line, maxWords) {
    const t = spans(line); if (!t.length) return '';
    const n = Math.min(t.length, R.int(1, maxWords)), s = R.int(0, t.length - n);
    return line.slice(t[s][0], t[s + n - 1][1]);
  }

  // The visitor's words, in their own order, in chunks of 1-3 words. At most 12 words are used.
  function chunks(R, text) {
    const w = String(text || '').trim().split(/\s+/).filter(Boolean).slice(0, 12), out = [];
    for (let i = 0; i < w.length;) { const n = Math.min(w.length - i, R.int(1, 3)); out.push(w.slice(i, i + n).join(' ')); i += n; }
    return out;
  }

  // A torn-paper outline as a CSS polygon. jx/jy = how deep the tears bite on the sides / top and bottom (in %).
  function torn(R, jx, jy, step) {
    const p = [], f = v => v.toFixed(1) + '%';
    for (let x = 0; x <= 100; x += step) p.push(f(x) + ' ' + f(R.range(0, jy)));
    for (let y = step; y <= 100; y += step) p.push(f(100 - R.range(0, jx)) + ' ' + f(y));
    for (let x = 100 - step; x >= 0; x -= step) p.push(f(x) + ' ' + f(100 - R.range(0, jy)));
    for (let y = 100 - step; y > 0; y -= step) p.push(f(R.range(0, jx)) + ' ' + f(y));
    return 'polygon(' + p.join(',') + ')';
  }

  function make(D, input) {
    const k = Object.assign({}, KNOBS, input.knobs || {});
    const picks = input.picks.slice(), text = String(input.text || '');
    const key = 'cutup|' + input.seed + '|' + picks.join(',') + '|' + text + '|' + [k.strips, k.mine, k.maxWords, k.ground, k.shape].join(',');
    const R = P.prng.makeRng(key), sub = name => P.prng.makeRng(key + '|' + name);
    const byId = {}; D.assets.forEach(a => { byId[a.id] = a; });
    const picked = picks.map(id => byId[id]).filter(Boolean);

    // 1. Words: the visitor's chunks + exact runs cut from one or two poems, shuffled together.
    const RW = sub('words');
    const mine = chunks(RW, text);
    const total = Math.max(3, Math.min(8, k.strips));
    const youCount = mine.length ? Math.min(mine.length, Math.max(1, Math.round(total * k.mine))) : 0;
    const poemCount = total - youCount;
    const poems = RW.shuffle(D.poems).slice(0, RW.chance(0.5) ? 1 : 2);
    const lines = [];
    poems.forEach(p => p.stanzas.forEach((st, si) => st.forEach((l, li) => { if (l.trim()) lines.push({ p, si, li, line: l }); })));
    const used = RW.shuffle(lines).slice(0, poemCount);
    const strips = used.map(u => ({ text: cut(RW, u.line, k.maxWords), src: 'poem', poem: u.p.id, at: [u.si, u.li] }))
      .concat(RW.shuffle(mine).slice(0, youCount).map(t => ({ text: t, src: 'you' })));
    // keep the visitor's own words in their typed order relative to each other; shuffle everything into slots
    const order = RW.shuffle(strips.map((_, i) => i));
    const youInOrder = mine.slice(0, youCount);
    let yi = 0;
    const seq = order.map(i => strips[i]).map(s => s.src === 'you' ? Object.assign({}, s, { text: youInOrder[yi++] }) : s);

    // 2. Imagery: the picked cutouts, plus up to two wildcards that share an emotion with them.
    const RI = sub('images');
    const emo = [...new Set(picked.flatMap(a => a.emo || []))];
    const pool = D.assets.filter(a => !picks.includes(a.id) && (a.emo || []).some(e => emo.includes(e)));
    const wild = RI.shuffle(pool).slice(0, RI.int(2, 3));
    const imgs = picked.concat(wild).map((a, i) => {
      const hero = i === 0;
      return { id: a.id, src: a.src, label: a.label || '', picked: i < picked.length,
        w: hero ? RI.range(78, 104) : RI.range(32, 52), x: hero ? RI.range(-14, 22) : RI.range(-10, 66), y: hero ? RI.range(-4, 30) : RI.range(-8, 70),
        rot: hero ? RI.range(-6, 6) : RI.range(-16, 16), z: hero ? 1 : RI.int(2, 3) };
    });

    // 3. Ground and torn colour blocks from the picked families' own colours plus one loud accent.
    const RC = sub('colour');
    const famColors = picked.flatMap(a => (D.families[a.family] || { colors: [] }).colors);
    const accent = RC.pick(ACCENTS);
    const blocks = [famColors[0] || accent, accent, famColors[2] || RC.pick(ACCENTS)].map((c, i) => ({
      color: c, x: RC.range(-10, 55), y: RC.range(-10, 70), w: RC.range(45, 85), h: RC.range(22, 48),
      rot: RC.range(-8, 8), clip: torn(RC, 3, 5, 5), z: 0 }));

    // 4. Strip styling and placement: stacked, staggered, slightly rotated, like a ransom-note stanza.
    const RS = sub('strips');
    const papers = RS.shuffle(POEM_PAPER);
    const placed = seq.map((s, i) => Object.assign({}, s, {
      paper: s.src === 'you' ? YOU_PAPER : papers[i % papers.length],
      ink: s.src === 'you' ? '#ffffff' : '#111111',
      face: s.src === 'you' ? 'type' : RS.pick(['serif', 'serif', 'heavy']),
      size: RS.range(5.2, 7.4) * (s.text.length > 22 ? 0.82 : 1),
      indent: RS.range(0, 22), rot: RS.range(-3.5, 3.5), clip: torn(RS, 2.5, 9, 6) }));

    const tags = emo.slice(0, 3);
    const credit = poems.filter(p => placed.some(s => s.poem === p.id)).map(p => ({ id: p.id, title: p.title }));
    return { v: 'cutup-sandbox/1', key, knobs: k, ground: k.ground, shape: k.shape, blocks, imgs, strips: placed, tags, credit };
  }

  function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function render(plan, into, opts) {
    opts = opts || {};
    const card = el('figure', 'cc-card cc-' + plan.ground + ' cc-' + plan.shape);
    const art = el('div', 'cc-art'); art.setAttribute('aria-hidden', 'true');
    plan.blocks.forEach(b => {
      const d = el('div', 'cc-block');
      d.style.cssText = 'left:' + b.x + '%;top:' + b.y + '%;width:' + b.w + '%;height:' + b.h + '%;background:' + b.color +
        ';transform:rotate(' + b.rot.toFixed(1) + 'deg);clip-path:' + b.clip;
      art.append(d);
    });
    plan.imgs.forEach(m => {
      const i = el('img', 'cc-img'); i.src = (opts.assetBase || '') + m.src; i.alt = ''; i.loading = 'lazy';
      i.style.cssText = 'left:' + m.x + '%;top:' + m.y + '%;width:' + m.w + '%;z-index:' + m.z + ';transform:rotate(' + m.rot.toFixed(1) + 'deg)';
      art.append(i);
    });
    const words = el('div', 'cc-words');
    plan.strips.forEach(s => {
      const w = el('span', 'cc-strip cc-' + s.src + ' cc-face-' + s.face, s.text);
      w.style.cssText = '--paper:' + s.paper + ';--ink:' + s.ink + ';--size:' + s.size.toFixed(2) + ';margin-left:' + s.indent.toFixed(1) +
        '%;transform:rotate(' + s.rot.toFixed(1) + 'deg);clip-path:' + s.clip;
      words.append(w);
    });
    card.append(art, words);
    const cap = el('figcaption', 'cc-cap');
    plan.tags.forEach(t => cap.append(el('span', 'cc-tag', '#' + t)));
    if (plan.credit.length) {
      const c = el('span', 'cc-credit', 'cut from ');
      plan.credit.forEach((p, i) => {
        if (i) c.append(' + ');
        if (opts.poemBase) { const a = el('a', '', p.title); a.href = opts.poemBase + p.id + '/'; c.append(a); } else c.append(el('cite', '', p.title));
      });
      cap.append(c);
    }
    card.append(cap);
    into.replaceChildren(card);
    return card;
  }

  P.cutup = { make, render, cut, spans, chunks, KNOBS };
})();
