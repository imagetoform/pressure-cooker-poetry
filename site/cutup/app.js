/* The cutup maker's page logic, shared by the front door (/) and the lab (/lab/cutup/, which adds knobs).
   Needs on the page: prng.js, data.js (PCP.cutupData), alive.js, cutup.js, and the element ids used below.
   Visitors only make choices (AGENTS.md law 3): pick images, type words, pick a word game, cut, save, share, sound. */
(function () {
  'use strict';
  const P = window.PCP, D = P.cutupData, C = P.cutup, $ = id => document.getElementById(id);
  const OPTS = { assetBase: D.assetBase || '', poemBase: D.poemBase || '' };
  const STORE = 'pcp-cutups-sandbox', FOUND = 'pcp-cutup-found', A = P.alive;
  P.assets = D.assets;   // the motion engine reads each cutout's emotions from here
  let live = null;
  const freshSeed = () => { const a = new Uint32Array(2); crypto.getRandomValues(a); return a[0].toString(36) + a[1].toString(36).slice(0, 3); };
  const knobs = Object.assign({}, C.KNOBS);
  let picks = [], dealSeed = freshSeed(), seed = '', shown = null, game = 'none';

  // ---- deal: 12 images from 12 different families, order set by the deal seed ----
  function deal() {
    const R = P.prng.makeRng('deal|' + dealSeed);
    const families = Object.keys(D.families).sort();
    const fams = R.shuffle(families).slice(0, 12);
    const choice = family => ({ id: 'movement:' + family, family, label: D.families[family].name });
    const hand = fams.map(f => {
      const images = D.assets.filter(a => a.family === f);
      return images.length ? R.pick(images) : choice(f);
    });
    picks.forEach(id => { if (!hand.some(a => a.id === id)) { const family = id.startsWith('movement:') && id.slice(9);
      const a = D.families[family] ? choice(family) : D.assets.find(x => x.id === id); if (a) hand.pop() && hand.unshift(a); } });
    const box = $('deal'); box.replaceChildren();
    hand.forEach((a, n) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'tile'; b.dataset.id = a.id; b.style.setProperty('--i', n);
      b.setAttribute('aria-label', (a.label || a.id) + ' (' + (D.families[a.family] || {}).name + ')');
      if (a.src) { const i = document.createElement('img'); i.src = OPTS.assetBase + a.src; i.alt = ''; b.append(i); }
      const s = document.createElement('small'); s.textContent = (D.families[a.family] || {}).name || '';
      b.append(s); b.addEventListener('click', () => toggle(a.id)); box.append(b);
    });
    marks();
  }
  function toggle(id) {
    picks = picks.includes(id) ? picks.filter(x => x !== id) : picks.concat(id).slice(-knobs.picks);
    marks();
  }
  function marks() {
    document.querySelectorAll('.tile').forEach(b => { const n = picks.indexOf(b.dataset.id); b.setAttribute('aria-pressed', String(n >= 0)); if (n >= 0) b.dataset.n = n + 1; });
    $('pick-hint').textContent = 'Tap ' + knobs.picks + ' that pull at you.';
    $('pick-count').textContent = picks.length + ' of ' + knobs.picks + ' picked';
    $('cut').disabled = picks.length !== knobs.picks;
  }

  // ---- make + show ----
  function show(state, push) {
    const plan = C.make(D, state);
    if (live) { live.detach(); live = null; }
    const card = C.render(plan, $('card'), Object.assign({ live: true, enter: true }, OPTS));
    const art = card.querySelector('.cc-art'); art.classList.add('room', 'cut');
    art.setAttribute('aria-label', 'Your cutup. Drag the pictures; arrow keys move a focused one.');
    live = A.attach(art, { assets: [], seed: 'card|' + state.seed });
    card.classList.toggle('is-still', A.isStill());
    shown = state; ['legend', 'after', 'sound', 's-note'].forEach(id => { $(id).hidden = false; }); $('said').textContent = '';
    found(plan);
    if (push) { try { history.replaceState(null, '', '#' + encodeURIComponent(JSON.stringify(state))); } catch (e) { /* some embeds block this; the card still shows */ } }
  }
  const current = () => Object.assign({ picks: picks.slice(), text: $('words').value, seed, knobs: Object.assign({}, knobs) }, game !== 'none' ? { game } : {});
  // ---- word games (Oulipo): on your words only, never the poems ----
  function setGame(g) {
    game = C.GAMES[g] ? g : 'none';
    document.querySelectorAll('.games [role=radio]').forEach(b => b.setAttribute('aria-checked', String(b.dataset.game === game)));
    preview();
  }
  function preview() {
    const t = $('words').value.trim();
    const box = $('game-preview'); box.replaceChildren();
    if (game === 'none' || !t) return;
    box.append('Your words become: ');
    C.play(t, game, P.prng.makeRng('preview|' + game + '|' + t)).words.join(' ').split(/(█+)/).forEach(part => {
      if (!part) return;
      if (part[0] === '█') { const r = document.createElement('span'); r.className = 'cc-redact'; r.textContent = part; r.setAttribute('aria-label', 'blacked out'); box.append(r); } else box.append(part);
    });
    if (game === 'lipo') box.append('  (the banned letter is picked per card)');
  }
  document.querySelectorAll('.games [role=radio]').forEach(b => {
    b.addEventListener('click', () => { setGame(b.dataset.game); if (shown && picks.length === knobs.picks) show(current(), true); });
    b.addEventListener('keydown', e => { if (!/Arrow(Left|Right|Up|Down)/.test(e.key)) return; e.preventDefault();
      const all = [...document.querySelectorAll('.games [role=radio]')], n = all.indexOf(b) + (/Right|Down/.test(e.key) ? 1 : -1), nb = all[(n + all.length) % all.length]; nb.focus(); nb.click(); });
  });
  $('words').addEventListener('input', preview);
  $('cut').addEventListener('click', () => { seed = freshSeed(); show(current(), true); });
  $('again').addEventListener('click', () => { seed = freshSeed(); show(Object.assign(current(), { picks: shown.picks, text: shown.text }), true); });
  setGame('none');
  $('redeal').addEventListener('click', () => { dealSeed = freshSeed(); deal(); });
  $('words').addEventListener('input', () => { const n = $('words').value.trim().split(/\s+/).filter(Boolean).length; $('word-count').textContent = n ? n + (n > 12 ? ' words (only the first 12 get used)' : ' words') : ''; });

  // ---- found poems: which of the poems your cards have cut from (kept in this browser only) ----
  function found(plan) {
    let have = []; try { have = JSON.parse(localStorage.getItem(FOUND) || '[]'); } catch (e) { have = []; }
    const fresh = plan ? plan.credit.map(c => c.id).filter(id => !have.includes(id)) : [];
    have = have.concat(fresh);
    try { localStorage.setItem(FOUND, JSON.stringify(have)); } catch (e) { /* private mode: count just won't stick */ }
    const box = $('found'); box.replaceChildren();
    if (!have.length) return;
    const p = document.createElement('p'); p.style.margin = '0';
    p.innerHTML = 'Poems you’ve cut from: <b>' + have.length + '</b> of ' + D.poems.length + (fresh.length ? ' · <b>new: ' + fresh.length + '</b>' : '');
    const ticks = document.createElement('div'); ticks.className = 'ticks'; ticks.setAttribute('aria-hidden', 'true');
    D.poems.forEach(po => { const t = document.createElement('i'); t.className = 'tick' + (have.includes(po.id) ? ' on' : '') + (fresh.includes(po.id) ? ' is-new' : ''); t.title = have.includes(po.id) ? po.title : ''; ticks.append(t); });
    box.append(p, ticks);
  }

  // ---- sound + stillness (the alive engine) ----
  $('s-song').addEventListener('click', () => $('s-file').click());
  $('s-file').addEventListener('change', async e => { const f = e.target.files[0]; if (!f) return; try { await A.feed(f); $('s-song').textContent = 'Playing: ' + f.name.slice(0, 24); } catch (err) { $('s-song').textContent = 'Couldn’t play that file'; } });
  $('s-hear').addEventListener('click', async () => {
    const b = $('s-hear');
    if (b.getAttribute('aria-pressed') === 'true') { A.deafen(); b.setAttribute('aria-pressed', 'false'); b.textContent = 'Let it hear you'; return; }
    try { await A.listen(); b.setAttribute('aria-pressed', 'true'); b.textContent = 'Stop listening'; } catch (e) { b.textContent = 'No microphone allowed'; }
  });
  $('s-still').addEventListener('click', () => { const on = !A.isStill(); A.still(on); $('s-still').setAttribute('aria-pressed', String(on)); });
  let lastGlitch = 0;
  A.onChange(S => {
    const c = document.querySelector('#card .cc-card'); if (!c) return;
    c.classList.toggle('is-still', A.isStill());
    // Glitch on a hard hit: the pictures split and slip for a blink. Words never glitch. Live reaction only; the card itself doesn't change.
    const now = performance.now();
    if (S && S.onset > 0.6 && A.drama > 0 && !A.isStill() && now - lastGlitch > 240) {
      lastGlitch = now; c.style.setProperty('--glitch', Math.min(1.6, A.drama / 1.5).toFixed(2));
      c.classList.add('cc-glitching'); setTimeout(() => c.classList.remove('cc-glitching'), 140);
    }
  });
  const dr = $('k-drama');
  if (dr) { dr.value = A.drama; $('k-drama-out').textContent = A.drama; dr.addEventListener('input', () => { A.setDrama(dr.value); $('k-drama-out').textContent = Number(dr.value).toFixed(1); }); }

  // ---- save + share ----
  function load() { try { return JSON.parse(localStorage.getItem(STORE) || '[]'); } catch (e) { return []; } }
  function shelf() {
    const list = load(), box = $('shelf'); box.replaceChildren(); $('shelf-empty').hidden = list.length > 0;
    list.forEach(st => {
      const b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', 'Open saved cutup');
      C.render(C.make(D, st), b, OPTS); b.addEventListener('click', () => { picks = st.picks.slice(); $('words').value = st.text; seed = st.seed; Object.assign(knobs, st.knobs); setGame(st.game); syncKnobs(); deal(); show(st, true); scrollTo({ top: 0 }); });
      box.append(b);
    });
  }
  $('save').addEventListener('click', () => {
    try { const list = load().filter(s => JSON.stringify(s) !== JSON.stringify(shown)); list.unshift(shown); localStorage.setItem(STORE, JSON.stringify(list.slice(0, 24))); $('said').textContent = 'Saved in this browser.'; }
    catch (e) { $('said').textContent = 'This browser won’t let the page save.'; }
    shelf();
  });
  $('share').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); $('said').textContent = 'Link copied. The same link makes the same card.'; }
    catch (e) { $('said').textContent = 'Copy this link: ' + location.href; }
  });

  // ---- knobs ----
  const KN = ['picks', 'strips', 'mine', 'maxWords', 'ground', 'shape'], HAS_KNOBS = !!$('knobs');   // knobs exist only on the lab page
  function syncKnobs() { if (!HAS_KNOBS) return; KN.forEach(k => { const i = $('k-' + k); i.value = knobs[k]; const o = i.parentElement.querySelector('output'); if (o) o.textContent = knobs[k]; }); }
  if (HAS_KNOBS) KN.forEach(k => $('k-' + k).addEventListener('input', e => {
    knobs[k] = e.target.type === 'range' ? Number(e.target.value) : e.target.value; syncKnobs();
    if (k === 'picks') { picks = picks.slice(-knobs.picks); marks(); }
    else if (shown && picks.length === knobs.picks) show(current(), true);
  }));

  // ---- start: a shared link opens its card ----
  try {
    const st = location.hash.length > 1 ? JSON.parse(decodeURIComponent(location.hash.slice(1))) : null;
    if (st && Array.isArray(st.picks)) { picks = st.picks.slice(); $('words').value = st.text || ''; seed = st.seed; Object.assign(knobs, st.knobs || {}); setGame(st.game); syncKnobs(); deal(); show(st, false); }
    else { syncKnobs(); deal(); }
  } catch (e) { syncKnobs(); deal(); }
  shelf(); found(null);
})();
