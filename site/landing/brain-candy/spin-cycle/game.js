/* THE SPIN CYCLE: Brain Candy machine 01. Play (spin it) → Reveal (X-ray) → Learn (labels),
 * then flip sides (catch the spin). Plain JS, no network, nothing stored but this browser's
 * wrapper jar and sound/timer choices. Reduced motion respected by the CSS.
 */
(function () {
  'use strict';
  const D = window.SPIN, T = D.techniques, byId = Object.fromEntries(T.map(t => [t.id, t]));
  const $ = id => document.getElementById(id);
  const say = t => { $('say').textContent = ''; setTimeout(() => { $('say').textContent = t; }, 30); };
  const store = {
    get(k, d) { try { const v = localStorage.getItem('pcp-spin-' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('pcp-spin-' + k, JSON.stringify(v)); } catch (e) { /* private mode: fine */ } },
  };
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let sc = Math.floor(Math.random() * D.scenarios.length), picked = [], score = 0, combo = 0, caught = 0, missed = 0;
  let soundOn = store.get('sound', true), timed = store.get('timed', true);
  const jar = new Set(store.get('jar', []));

  // ---------- sound: synthesized, starts only after a click ----------
  let ac = null;
  function ctx() { if (!soundOn) return null; if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } } if (ac.state === 'suspended') ac.resume(); return ac; }
  function tone(type, f0, f1, dur, vol, when) {
    const a = ctx(); if (!a) return; const t = a.currentTime + (when || 0);
    const o = a.createOscillator(), g = a.createGain(); o.type = type;
    o.frequency.setValueAtTime(f0, t); if (f1) o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + 0.02);
  }
  function noise(dur, freq, vol) {
    const a = ctx(); if (!a) return; const n = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate), d = n.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const s = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain(); s.buffer = n; f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = 0.8;
    g.gain.setValueAtTime(vol, a.currentTime); g.gain.exponentialRampToValueAtTime(0.0001, a.currentTime + dur);
    s.connect(f).connect(g).connect(a.destination); s.start();
  }
  const sfx = {
    clunk() { noise(0.09, 500, 0.5); tone('sine', 110, 60, 0.14, 0.5); },
    unclunk() { noise(0.06, 900, 0.3); },
    whirr(d) { tone('sawtooth', 50, 240, d, 0.08); noise(d, 300, 0.12); },
    ding() { tone('sine', 1320, 0, 0.6, 0.25); tone('sine', 990, 0, 0.8, 0.18, 0.12); },
    good() { tone('square', 660, 0, 0.08, 0.12); tone('square', 990, 0, 0.12, 0.12, 0.08); },
    bad() { tone('square', 110, 90, 0.3, 0.12); },
    tick() { tone('sine', 1800, 0, 0.03, 0.05); },
  };

  // ---------- round 1: the washer ----------
  function scenario() { return D.scenarios[sc]; }
  function renderTicket() {
    $('client').textContent = scenario().client;
    $('fact').textContent = scenario().fact;
    const drum = $('drum'); drum.replaceChildren();
    scenario().fact.split(/\s+/).forEach((w, i, all) => {
      const s = document.createElement('span'), a = (i / all.length) * Math.PI * 2 + Math.random() * 0.5, r = 12 + Math.random() * 26;
      s.textContent = w; s.style.left = (50 + r * Math.cos(a)) + '%'; s.style.top = (50 + r * Math.sin(a)) + '%';
      s.style.transform = 'translate(-50%,-50%) rotate(' + Math.round(Math.random() * 360) + 'deg)';
      drum.append(s);
    });
  }
  function renderShelf() {
    const shelf = $('shelf'); shelf.replaceChildren();
    T.forEach((t, n) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'box'; b.style.setProperty('--c', t.color); b.dataset.id = t.id;
      b.setAttribute('aria-pressed', 'false');
      b.innerHTML = '<span class="tm">' + (n + 1) + ' · new! 2× stronger</span><b>' + t.name + '™</b><p>' + t.what + '</p>';
      b.addEventListener('click', () => pick(t.id));
      shelf.append(b);
    });
  }
  function pick(id) {
    const i = picked.indexOf(id);
    if (i >= 0) { picked.splice(i, 1); sfx.unclunk(); }
    else if (picked.length < 3) { picked.push(id); sfx.clunk(); }
    else { say('Three detergents max. Take one out first.'); sfx.bad(); return; }
    syncPicks();
  }
  function meters(ids) {
    const calm = Math.min(100, Math.round(ids.reduce((s, id) => s + byId[id].calm, 0) / 68 * 100));
    const truth = Math.max(0, Math.round(100 - ids.reduce((s, id) => s + byId[id].hides, 0) * 1.25));
    return { calm, truth };
  }
  function setGauges(calm, truth) {
    $('n-calm').style.transform = 'rotate(' + (-80 + calm * 1.6) + 'deg)';
    $('n-truth').style.transform = 'rotate(' + (-80 + truth * 1.6) + 'deg)';
    $('v-calm').textContent = calm + '%'; $('v-truth').textContent = truth + '%';
  }
  function syncPicks() {
    document.querySelectorAll('.box').forEach(b => b.setAttribute('aria-pressed', String(picked.includes(b.dataset.id))));
    const slots = $('slots'); slots.replaceChildren();
    for (let i = 0; i < 3; i++) {
      const d = document.createElement('div'), id = picked[i];
      d.className = 'slot' + (id ? ' full' : '');
      if (id) { d.style.background = byId[id].color; d.textContent = byId[id].name; } else d.textContent = 'empty';
      slots.append(d);
    }
    const m = meters(picked); setGauges(m.calm, m.truth);
    $('spin').disabled = picked.length !== 3;
    $('spin').textContent = picked.length === 3 ? 'Spin it' : 'Load ' + (3 - picked.length) + ' more';
  }
  function suds() {
    const s = $('suds'); s.replaceChildren();
    for (let i = 0; i < 16; i++) { const b = document.createElement('i'); b.style.setProperty('--x', Math.random() * 100 + '%'); b.style.setProperty('--s', 10 + Math.random() * 30 + 'px'); b.style.setProperty('--d', Math.random() * 1.2 + 's'); s.append(b); }
  }

  function spin() {
    if (picked.length !== 3) return;
    $('spin').disabled = true; $('release').classList.remove('show'); $('releaseActions').hidden = true;
    document.body.classList.remove('xray-on'); $('xray').setAttribute('aria-pressed', 'false');
    const w = $('washer'), dur = reduce ? 200 : 2400;
    w.classList.add('spinning'); sfx.whirr(dur / 1000); say('Spinning.');
    setTimeout(() => { w.classList.remove('spinning'); sfx.ding(); showRelease(); }, dur);
  }
  function rank(calm) { return calm < 45 ? 'Intern' : calm < 62 ? 'Account Executive' : calm < 80 ? 'Spin Doctor' : 'Minister of Truth'; }
  function showRelease() {
    const s = scenario(), lines = $('releaseLines'); lines.replaceChildren();
    picked.forEach(id => {
      const t = byId[id], p = document.createElement('span'), why = document.createElement('div');
      p.className = 'line'; p.style.setProperty('--c', t.color); p.textContent = s.lines[id];
      why.className = 'why'; why.style.setProperty('--c', t.color);
      why.innerHTML = '<span class="tag">' + t.name + '</span>' + t.hides_line + ' <br>Ask: ' + t.ask;
      lines.append(p, why);
    });
    const m = meters(picked);
    $('results').innerHTML = '<span>Public calm ' + m.calm + '%</span><span>Truth left ' + m.truth + '%</span><span class="rank">' + rank(m.calm) + '</span>';
    $('truthbox').innerHTML = '<b>What actually happened:</b> ' + s.fact;
    $('release').classList.add('show'); $('releaseActions').hidden = false;
    addScore(m.calm);
    say('Press release printed. Public calm ' + m.calm + ' percent, truth left ' + m.truth + ' percent. Rank: ' + rank(m.calm) + '. Press X-ray it to see what it hides.');
  }
  function xray() {
    const on = document.body.classList.toggle('xray-on');
    $('xray').setAttribute('aria-pressed', String(on));
    sfx.tick();
    say(on ? 'X-ray on. Each sentence shows its trick and what it hides.' : 'X-ray off.');
  }
  function addScore(n) { score += Math.round(n); $('score').textContent = score; }

  // ---------- round 2: catch the spin ----------
  let memos = [], memoI = 0, memoLeft = 0, timer = null, tLeft = 0, active = null;
  const TIME = 40;
  function startSpot() {
    $('spot').classList.add('on'); $('end').classList.remove('on');
    const others = shuffle(D.scenarios.filter((_, i) => i !== sc)).slice(0, 3);
    memos = others.map(s => ({ s, ids: shuffle(T.map(t => t.id)).slice(0, 3) }));
    memoI = 0; combo = 0; caught = 0; missed = 0;
    showMemo();
    $('spot').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }
  function showMemo() {
    const m = memos[memoI]; $('memoN').textContent = memoI + 1; $('memoClient').textContent = m.s.client.toUpperCase();
    const box = $('memoLines'); box.replaceChildren(); memoLeft = m.ids.length; closePicker(); $('feedback').textContent = '';
    m.ids.forEach(id => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'sent'; b.textContent = m.s.lines[id]; b.dataset.id = id;
      b.addEventListener('click', () => openPicker(b));
      box.append(b);
    });
    clearInterval(timer); tLeft = TIME; $('timerBar').style.width = '100%';
    if (timed) timer = setInterval(() => {
      tLeft -= 0.25; $('timerBar').style.width = Math.max(0, tLeft / TIME * 100) + '%';
      if (tLeft <= 0) { clearInterval(timer); timeUp(); }
    }, 250);
    else $('timerBar').style.width = '100%';
    say('Memo ' + (memoI + 1) + ' of 3 from ' + m.s.client + '. Three spun sentences. Tap one, then name the trick.');
    box.querySelector('button').focus({ preventScroll: true });
  }
  function openPicker(sentence) {
    if (sentence.classList.contains('done')) return;
    active = sentence; const opts = $('opts'); opts.replaceChildren();
    T.forEach((t, n) => {
      const b = document.createElement('button'); b.type = 'button'; b.style.setProperty('--c', t.color);
      b.textContent = (n + 1) + ' · ' + t.name; b.addEventListener('click', () => answer(t.id));
      opts.append(b);
    });
    $('pickerQ').textContent = '“' + sentence.textContent.slice(0, 70) + (sentence.textContent.length > 70 ? '…' : '') + '” — which trick? (keys 1–8)';
    $('picker').classList.add('on'); opts.firstChild.focus({ preventScroll: true });
  }
  function closePicker() { $('picker').classList.remove('on'); active = null; }
  function popAt(el, text) {
    if (reduce) return; const r = el.getBoundingClientRect(), p = document.createElement('div');
    p.className = 'pop'; p.textContent = text; p.style.left = (r.left + r.width / 2 - 30) + 'px'; p.style.top = (r.top) + 'px';
    document.body.append(p); setTimeout(() => p.remove(), 900);
  }
  function mark(sentence, ok) {
    const t = byId[sentence.dataset.id];
    sentence.classList.add('done'); sentence.style.setProperty('--c', t.color);
    sentence.dataset.label = (ok ? '✓ ' : '✗ ') + t.name + ' — ' + t.hides_line;
    sentence.setAttribute('aria-label', sentence.textContent + '. ' + (ok ? 'Caught: ' : 'It was: ') + t.name);
  }
  function answer(guess) {
    if (!active) return; const s = active, right = s.dataset.id, t = byId[right];
    if (guess === right) {
      combo++; caught++; const pts = 100 * (1 + (combo - 1) * 0.5); addScore(pts);
      sfx.good(); popAt(s, '+' + pts + (combo > 1 ? ' ×' + combo : ''));
      if (!jar.has(right)) { jar.add(right); store.set('jar', [...jar]); }
      $('feedback').className = 'feedback good'; $('feedback').textContent = 'Caught it: ' + t.name + '. ' + t.ask;
      mark(s, true);
    } else {
      combo = 0; missed++; sfx.bad(); s.classList.remove('miss'); void s.offsetWidth; s.classList.add('miss');
      $('feedback').className = 'feedback bad';
      $('feedback').textContent = 'Not ' + byId[guess].name + '. That was ' + t.name + ': ' + t.what;
      mark(s, false);
    }
    $('combo').textContent = combo > 1 ? 'combo ×' + combo : '';
    say($('feedback').textContent);
    closePicker(); memoLeft--;
    if (memoLeft === 0) nextMemo();
    else { const n = document.querySelector('.sent:not(.done)'); if (n) n.focus({ preventScroll: true }); }
  }
  function timeUp() {
    document.querySelectorAll('.sent:not(.done)').forEach(s => { missed++; mark(s, false); });
    combo = 0; closePicker(); sfx.bad();
    $('feedback').className = 'feedback bad'; $('feedback').textContent = 'Time. The spin got past you this round.';
    say('Time is up.'); nextMemo();
  }
  function nextMemo() {
    clearInterval(timer);
    setTimeout(() => { memoI++; if (memoI < memos.length) showMemo(); else finish(); }, 1500);
  }
  function finish() {
    $('spot').classList.remove('on'); $('end').classList.add('on');
    const total = caught + missed, acc = total ? Math.round(caught / total * 100) : 0;
    $('endTitle').textContent = acc >= 89 ? 'Stain detector' : acc >= 66 ? 'Sharp reader' : acc >= 34 ? 'Getting the smell of it' : 'Freshly laundered';
    $('endText').textContent = 'You caught ' + caught + ' of ' + total + ' tricks (' + acc + '%). Score ' + score + '. The point isn’t the score: it’s that now you can see these in real press releases, ads and speeches. Including ours.';
    renderJar();
    $('end').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    say($('endTitle').textContent + '. ' + $('endText').textContent);
  }
  function renderJar() {
    const j = $('jar'); j.replaceChildren();
    T.forEach(t => { const w = document.createElement('div'); w.className = 'wrapper' + (jar.has(t.id) ? ' got' : ''); w.style.setProperty('--c', t.color); w.textContent = jar.has(t.id) ? t.name : '?'; w.setAttribute('aria-label', jar.has(t.id) ? 'Wrapper: ' + t.name : 'Wrapper not found yet'); j.append(w); });
    $('eye').classList.toggle('on', jar.size === T.length);
  }

  // ---------- learn ----------
  function renderLearn() {
    const c = $('cards');
    T.forEach(t => {
      const a = document.createElement('article'); a.className = 'card'; a.style.setProperty('--c', t.color);
      a.innerHTML = '<h3>' + t.name + '</h3><p>' + t.what + '</p><p class="ask">Ask: ' + t.ask + '</p><p class="origin">' + t.origin + '</p>';
      c.append(a);
    });
    const ul = $('sources');
    D.sources.forEach(s => { const li = document.createElement('li'); li.innerHTML = '<a href="' + s.url + '" rel="noopener">' + s.title + '</a>'; ul.append(li); });
  }

  // ---------- wiring ----------
  function newClient() { sc = (sc + 1) % D.scenarios.length; picked = []; renderTicket(); syncPicks(); $('release').classList.remove('show'); $('releaseActions').hidden = true; document.body.classList.remove('xray-on'); }
  $('spin').addEventListener('click', spin);
  $('xray').addEventListener('click', xray);
  $('again').addEventListener('click', () => { newClient(); $('stage').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); });
  $('nextClient').addEventListener('click', newClient);
  $('toSpot').addEventListener('click', startSpot);
  $('restart').addEventListener('click', () => { $('end').classList.remove('on'); newClient(); $('stage').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); });
  $('sound').setAttribute('aria-pressed', String(soundOn)); $('sound').textContent = soundOn ? 'Sound on' : 'Sound off';
  $('sound').addEventListener('click', e => { soundOn = !soundOn; store.set('sound', soundOn); e.currentTarget.setAttribute('aria-pressed', String(soundOn)); e.currentTarget.textContent = soundOn ? 'Sound on' : 'Sound off'; });
  $('timed').setAttribute('aria-pressed', String(timed)); $('timed').textContent = timed ? 'Timer on' : 'Timer off';
  $('timed').addEventListener('click', e => { timed = !timed; store.set('timed', timed); e.currentTarget.setAttribute('aria-pressed', String(timed)); e.currentTarget.textContent = timed ? 'Timer on' : 'Timer off'; });
  document.addEventListener('keydown', e => {
    if ($('picker').classList.contains('on')) {
      if (e.key === 'Escape') { const a = active; closePicker(); if (a) a.focus(); return; }
      const n = parseInt(e.key, 10); if (n >= 1 && n <= T.length) { e.preventDefault(); answer(T[n - 1].id); }
      return;
    }
    if (document.activeElement && document.activeElement.closest('#shelf')) {
      const n = parseInt(e.key, 10); if (n >= 1 && n <= T.length) { e.preventDefault(); pick(T[n - 1].id); }
    }
  });

  renderTicket(); renderShelf(); syncPicks(); suds(); renderLearn(); renderJar();
  // test hook (read-only view of state)
  window.SPIN_STATE = () => ({ sc, picked: picked.slice(), score, combo, caught, missed, jar: [...jar], memoI, memos: memos.map(m => m.ids) });
})();
