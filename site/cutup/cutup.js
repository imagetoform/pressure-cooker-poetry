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

  // ---- Oulipo word games (Brandon, 2026-11-18: yes). They touch ONLY the visitor's own words, never the poems (law 1). ----
  // N+7 swaps each noun for the noun seven places later in this list. The list is the site's own, small on purpose (CANON D-38).
  const NOUNS = ('acorn alarm alley altar anchor angel ankle answer apple apron arch archive arm army arrow ash attic auction axe baby back badge bag bakery '
    + 'ballot band bank banner barn barrel basement basket bath battery beach beam bean bear bed bee bell belly bench bible bicycle bill bird blade blanket '
    + 'blood bloom boat body bone book boot border boss bottle boundary bowl box brain branch bread brick bridge broom brother bucket budget bullet bus '
    + 'butcher button cabin cage cake camera candle canal cap car card carpet cart cash castle cat cathedral ceiling cellar chain chair chalk chapel charity '
    + 'cheek chest child chimney church cigarette circle city clerk cliff clock cloud coat code coffee coin collar comet committee copper corner cotton court '
    + 'cow crack crane creek crow crown cup curtain debt deed desert desk dial diamond dog doll door dream dress drum dust eagle ear earth egg elbow empire '
    + 'engine envelope eye factory family farm fault feather fence fever field finger fire fish flag flame flood floor flower fog font foot forest fork fountain '
    + 'fox frame freezer fridge garden gate ghost gift girl glass glove god gold grave gravel ground gun hair hall hammer hand harbor hat hawk head heart hill '
    + 'hinge hive hole honey hook horn horse hospital house hunger ice idol ink iron island jacket jail jar jaw jewel judge jungle kettle key king kitchen kite '
    + 'knee knife ladder lake lamp landlord lantern law lawn leaf ledger leg lemon letter library lid light lightning lily line lion lip lock loom lung machine '
    + 'map market mask meadow medal memory mill mirror money monster moon morning moth mother mountain mouth mud nail name needle nest net newspaper night '
    + 'nose note oath ocean office oil orchard oven owl paint palace pan paper parade park path pen pencil pepper piano pigeon pillow pipe pistol planet plate '
    + 'pocket poison pole police pond prayer prison prophet pulpit pump queen rabbit radio rail rain rat razor receipt rent ribbon rifle ring river road robe '
    + 'rock roof room root rope rose rust saint salt sand saw scale school scissors screen sea seed shadow shelf shell ship shirt shoe shop shovel shrine sign '
    + 'silver sink sister skin skull sky smoke snake snow soap soldier song soup spoon spring stair star statue steam stone storm stove street string sugar '
    + 'suitcase sun swamp sword table tail tax teeth telephone temple thread throat throne thunder ticket tide tiger tongue tooth tower town toy track tractor '
    + 'train tree truck trumpet tunnel umbrella valley vault vein violin voice wage wall wallet war water wave weather well whale wheel whistle window wine '
    + 'wing wire wolf woman wood wool word worm wound yard').split(' ').sort();
  const NOUN_AT = {}; NOUNS.forEach((n, i) => { NOUN_AT[n] = i; });
  const GAMES = { none: 'no game', n7: 'N+7', lipo: 'lipogram', snowball: 'snowball' };

  // Keep a word's punctuation and capital letter, change only its core.
  function swapCore(word, fn) {
    const m = /^([^A-Za-z]*)([A-Za-z']+)([^A-Za-z]*)$/.exec(word); if (!m) return word;
    const core = m[2], out = fn(core.toLowerCase());
    if (out == null) return word;
    return m[1] + (core[0] === core[0].toUpperCase() && core[0] !== core[0].toLowerCase() ? out[0].toUpperCase() + out.slice(1) : out) + m[3];
  }
  function play(text, game, R) {
    const words = String(text || '').trim().split(/\s+/).filter(Boolean).slice(0, 12);
    if (game === 'n7') {
      const singular = w => NOUN_AT[w] != null ? w : (w.endsWith('s') && NOUN_AT[w.slice(0, -1)] != null ? w.slice(0, -1) : null);
      return { words: words.map(w => swapCore(w, c => { const n = singular(c); if (n == null) return null; const next = NOUNS[(NOUN_AT[n] + 7) % NOUNS.length]; return c === n ? next : next + 's'; })), note: 'N+7' };
    }
    if (game === 'lipo') {
      const letter = R.pick(['e', 'a', 'o', 'i', 't', 's']);
      return { words: words.map(w => w.toLowerCase().includes(letter) ? '█'.repeat(w.length) : w), note: 'no ' + letter.toUpperCase() };
    }
    if (game === 'snowball') return { words: words.map((w, i) => [w, i]).sort((a, b) => a[0].length - b[0].length || a[1] - b[1]).map(x => x[0]), note: 'snowball' };
    return { words, note: '' };
  }

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
    const w = (Array.isArray(text) ? text : String(text || '').trim().split(/\s+/).filter(Boolean)).slice(0, 12), out = [];
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
    const game = GAMES[input.game] ? input.game : 'none';
    const key = 'cutup|' + input.seed + '|' + picks.join(',') + '|' + text + '|' + [k.strips, k.mine, k.maxWords, k.ground, k.shape].join(',') + (game !== 'none' ? '|' + game : '');
    const R = P.prng.makeRng(key), sub = name => P.prng.makeRng(key + '|' + name);
    const byId = {}; D.assets.forEach(a => { byId[a.id] = a; });
    const picked = picks.map(id => byId[id]).filter(Boolean);

    // 1. Words: the visitor's chunks + exact runs cut from one or two poems, shuffled together.
    const RW = sub('words');
    const played = play(text, game, sub('game'));
    const mine = chunks(RW, played.words);
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
      return { id: a.id, src: a.src, label: a.label || '', picked: i < picked.length, family: a.family,
        w: hero ? RI.range(78, 104) : RI.range(32, 52), x: hero ? RI.range(-14, 22) : RI.range(-10, 66), y: hero ? RI.range(-4, 30) : RI.range(-8, 70),
        rot: hero ? RI.range(-6, 6) : RI.range(-16, 16), z: hero ? 1 : RI.int(2, 3) };
    });

    // 2b. Xerox: photocopy-toner texture on some pictures (always on Punk/Zine/Grunge/Situationism/Dada/Constructivism ones).
    const RX = sub('xerox'), XEROX = ['punk', 'zine-diy', 'grunge-design', 'situationism', 'dada', 'constructivism'];
    imgs.forEach(m => { m.xerox = XEROX.includes(m.family) || RX.chance(0.15); });

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
      // your words: white type on black; a strip with blacked-out words (lipogram) flips to white paper so the bars read as redaction
      paper: s.src === 'you' ? (s.text.includes('█') ? '#ffffff' : YOU_PAPER) : papers[i % papers.length],
      ink: s.src === 'you' ? (s.text.includes('█') ? '#111111' : '#ffffff') : '#111111',
      face: s.src === 'you' ? 'type' : RS.pick(['serif', 'serif', 'heavy']),
      size: RS.range(5.2, 7.4) * (s.text.length > 22 ? 0.82 : 1),
      indent: RS.range(0, 22), rot: RS.range(-3.5, 3.5), clip: torn(RS, 2.5, 9, 6) }));

    const tags = emo.slice(0, 3);
    const credit = poems.filter(p => placed.some(s => s.poem === p.id)).map(p => ({ id: p.id, title: p.title }));
    return { v: 'cutup-sandbox/1', key, knobs: k, game, gameNote: played.note, ground: k.ground, shape: k.shape, blocks, imgs, strips: placed, tags, credit };
  }

  function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

  function render(plan, into, opts) {
    opts = opts || {};
    const card = el('figure', 'cc-card cc-' + plan.ground + ' cc-' + plan.shape + (opts.enter ? ' cc-enter' : '') + (opts.live ? ' cc-live' : ''));
    const art = el('div', 'cc-art'); if (!opts.live) art.setAttribute('aria-hidden', 'true');
    const titles = {}; plan.credit.forEach(c => { titles[c.id] = c.title; });
    plan.blocks.forEach((b, n) => {
      const d = el('div', 'cc-block'); d.style.setProperty('--i', n);
      d.style.cssText = 'left:' + b.x + '%;top:' + b.y + '%;width:' + b.w + '%;height:' + b.h + '%;background:' + b.color +
        ';transform:rotate(' + b.rot.toFixed(1) + 'deg);clip-path:' + b.clip;
      art.append(d);
    });
    plan.imgs.forEach(m => {
      const i = el('img', 'cc-img' + (m.xerox ? ' cc-xerox' : '')); i.src = (opts.assetBase || '') + m.src; i.alt = opts.live ? m.label : ''; i.loading = 'lazy'; i.draggable = false;
      i.style.setProperty('--i', plan.imgs.indexOf(m));
      i.style.cssText = 'left:' + m.x + '%;top:' + m.y + '%;width:' + m.w + '%;z-index:' + m.z + ';transform:rotate(' + m.rot.toFixed(1) + 'deg)';
      art.append(i);
    });
    const words = el('div', 'cc-words');
    plan.strips.forEach(s => {
      const w = el('span', 'cc-strip cc-' + s.src + ' cc-face-' + s.face);
      s.text.split(/(█+)/).forEach(part => { if (!part) return; if (part[0] === '█') { const r = el('span', 'cc-redact', part); r.setAttribute('aria-label', 'blacked out'); w.append(r); } else w.append(part); });
      w.style.cssText = '--paper:' + s.paper + ';--ink:' + s.ink + ';--size:' + s.size.toFixed(2) + ';margin-left:' + s.indent.toFixed(1) +
        '%;transform:rotate(' + s.rot.toFixed(1) + 'deg);clip-path:' + s.clip + ';--i:' + plan.strips.indexOf(s) + ';--sway:' + (s.rot >= 0 ? 1 : -1);
      if (opts.live) {   // tap or Enter: the strip lifts and says where it came from
        w.tabIndex = 0; w.setAttribute('role', 'button');
        const from = s.src === 'you' ? 'yours' : 'from ' + (titles[s.poem] || 'a poem');
        w.setAttribute('aria-label', s.text + ' (' + from + ')');
        const lift = () => { w.dataset.from = from; w.classList.remove('is-lifted'); void w.offsetWidth; w.classList.add('is-lifted'); };
        w.addEventListener('click', lift); w.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); lift(); } });
        w.addEventListener('animationend', e => { if (e.animationName === 'cc-lift') w.classList.remove('is-lifted'); });
      }
      words.append(w);
    });
    card.append(art, words);
    const cap = el('figcaption', 'cc-cap');
    plan.tags.forEach(t => cap.append(el('span', 'cc-tag', '#' + t)));
    if (plan.gameNote) cap.append(el('span', 'cc-tag cc-game', 'your words: ' + plan.gameNote));
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

  // The photocopy filter, our own: grain from turbulence knocks out toner and nudges edges a hair. Added once per page.
  function filters() {
    if (document.getElementById('cc-filters')) return;
    const box = document.createElement('div');
    box.innerHTML = '<svg id="cc-filters" width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' +
      '<filter id="cc-xerox" x="-4%" y="-4%" width="108%" height="108%" color-interpolation-filters="sRGB">' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="11" result="grain"/>' +
      '<feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.6 1.55" result="speck"/>' +
      '<feComposite in="SourceGraphic" in2="speck" operator="in" result="toner"/>' +
      '<feTurbulence type="fractalNoise" baseFrequency="0.015 0.4" numOctaves="1" seed="4" result="wobble"/>' +
      '<feDisplacementMap in="toner" in2="wobble" scale="3" xChannelSelector="R" yChannelSelector="G"/>' +
      '</filter></defs></svg>';
    document.body.append(box.firstChild);
  }

  P.cutup = { make, render: function (plan, into, opts) { filters(); return render(plan, into, opts); }, cut, spans, chunks, play, NOUNS, GAMES, KNOBS };
})();
