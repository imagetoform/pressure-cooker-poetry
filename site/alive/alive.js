/* PRESSURE COOKER POETRY — ALIVE
 * One input layer for the whole site: touch / pointer, keys, sound (opt-in), tilt (opt-in).
 * Every input becomes a few plain numbers (the "signals"). Every cutout reads those numbers
 * through a behaviour picked from its own emotion tags on the wheel (CANON D-17, D-29).
 *
 * What it never does: record, upload or remember sound; track anyone; change a receipt.
 * Live motion is a layer on top of the composition. Same receipt = same room; your touch
 * just moves it while you're there.
 *
 * Use:  const live = PCP.alive.attach(roomElement, {assets, seed});   live.detach();
 * Global controls: PCP.alive.listen() (microphone) / .feed(file) (a song) / .deafen(), .tilt(), .still(true|false)
 */
(function () {
  'use strict';
  const P = (window.PCP = window.PCP || {});
  const A = (P.alive = {});

  // ---------- 1. SIGNALS: every input, as numbers between 0 and 1 ----------
  const S = (A.signals = {
    px: 0.5, py: 0.5, vx: 0, vy: 0, speed: 0, down: false, inside: false,
    keys: 0,        // typing heat: jumps on each key, cools down
    tap: 0,         // jumps on each tap/click/keystroke, cools fast
    audio: 0, low: 0, high: 0, onset: 0, hearing: false,
    tiltX: 0, tiltY: 0, tilting: false,
    energy: 0,      // everything combined, cools slowly
    idle: 0,        // seconds since the last input
    t: 0,
  });

  const reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  let stillByChoice = false;
  try { stillByChoice = localStorage.getItem('pcp-still') === '1'; } catch (e) { /* storage blocked: default to moving */ }
  A.isStill = () => stillByChoice || reduce.matches || document.documentElement.classList.contains('no-motion');
  A.still = function (on) {
    stillByChoice = !!on;
    try { localStorage.setItem('pcp-still', on ? '1' : '0'); } catch (e) { /* fine */ }
    rooms.forEach(r => r.applyStill());
    emit();
  };

  const listeners = new Set();
  A.onChange = fn => { listeners.add(fn); return () => listeners.delete(fn); };
  // DRAMA: how hard sound hits the pieces (0 = no beat layer, 1 = firm, 3 = wild). Silence is unaffected.
  // Brandon asked for more dramatic motion with music (2026-11-18); 1.5 is a first guess, tune it in /alive/lab/.
  A.drama = 1.5;
  A.setDrama = function (v) { A.drama = Math.max(0, Math.min(3, Number(v) || 0)); emit(); wake(); };
  function emit() { listeners.forEach(fn => { try { fn(S); } catch (e) { /* a bad listener never breaks the loop */ } }); }

  function poke(amount) { S.idle = 0; S.tap = Math.min(1, S.tap + amount); S.energy = Math.min(1, S.energy + amount * 0.6); wake(); }

  // ---------- 2. SOUND (opt-in, local only) ----------
  let audioCtx = null, analyser = null, stream = null, freq = null, wave = null, avg = 0;
  A.listen = async function () {
    if (S.hearing) return true;
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error('This browser can’t listen.');
    // Create and resume the audio engine inside the click, before waiting on permission:
    // browsers start it "suspended" (deaf) if it's created after the wait.
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const resumed = audioCtx.resume();
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: true } }); }
    catch (e) { audioCtx.close(); audioCtx = null; throw e; }
    await resumed;
    const src = audioCtx.createMediaStreamSource(stream);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 1024; analyser.smoothingTimeConstant = 0.6;
    src.connect(analyser);           // never connected to the speakers, never recorded
    freq = new Uint8Array(analyser.frequencyBinCount); wave = new Uint8Array(analyser.fftSize);
    S.hearing = true; emit(); wake();
    return true;
  };
  // Feed it a song: play an audio file the visitor picks; the room hears it. No microphone needed.
  let song = null;
  A.feed = async function (file) {
    if (S.hearing) A.deafen();
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();   // made inside the click
    const resumed = audioCtx.resume();
    song = new Audio(URL.createObjectURL(file)); song.loop = true;
    const src = audioCtx.createMediaElementSource(song);
    analyser = audioCtx.createAnalyser(); analyser.fftSize = 1024; analyser.smoothingTimeConstant = 0.6;
    src.connect(analyser); analyser.connect(audioCtx.destination);       // you hear the song too
    freq = new Uint8Array(analyser.frequencyBinCount); wave = new Uint8Array(analyser.fftSize);
    await resumed; await song.play();
    S.hearing = true; emit(); wake();
    return true;
  };
  A.deafen = function () {
    if (song) { song.pause(); URL.revokeObjectURL(song.src); song = null; }
    if (stream) stream.getTracks().forEach(t => t.stop());
    if (audioCtx) audioCtx.close();
    stream = audioCtx = analyser = null; S.hearing = false; S.audio = S.low = S.high = S.onset = 0; emit();
  };
  function readAudio() {
    if (!analyser) return;
    analyser.getByteTimeDomainData(wave);
    let sum = 0; for (let i = 0; i < wave.length; i++) { const v = (wave[i] - 128) / 128; sum += v * v; }
    const rms = Math.min(1, Math.sqrt(sum / wave.length) * 4);
    analyser.getByteFrequencyData(freq);
    const hz = audioCtx.sampleRate / analyser.fftSize, band = (a, b) => {
      let s = 0, n = 0; for (let i = Math.floor(a / hz); i <= Math.min(freq.length - 1, Math.ceil(b / hz)); i++) { s += freq[i]; n++; }
      return n ? s / n / 255 : 0;
    };
    S.audio = S.audio * 0.6 + rms * 0.4;
    S.low = S.low * 0.6 + band(30, 250) * 0.4;
    S.high = S.high * 0.6 + band(2000, 7000) * 0.4;
    S.onset = rms > 0.12 && rms > avg * 1.7 ? 1 : S.onset * 0.85;   // a clap, a shout, a beat
    avg = avg * 0.95 + rms * 0.05;
    if (rms > 0.06) S.idle = 0;
  }

  // ---------- 3. TILT (opt-in where the phone asks for permission) ----------
  A.tilt = async function () {
    const D = window.DeviceOrientationEvent;
    if (!D) throw new Error('No tilt sensor here.');
    if (typeof D.requestPermission === 'function' && (await D.requestPermission()) !== 'granted') throw new Error('Tilt not allowed.');
    window.addEventListener('deviceorientation', e => {
      if (e.gamma == null) return;
      S.tiltX = Math.max(-1, Math.min(1, e.gamma / 35)); S.tiltY = Math.max(-1, Math.min(1, (e.beta - 40) / 35));
      if (!S.tilting) { S.tilting = true; emit(); }
      wake();
    });
    return true;
  };

  // ---------- 4. BEHAVIOURS: each cutout moves the way its emotions feel ----------
  // The first emotion on a cutout picks its verb; the second, if any, adds a quieter second verb.
  const VERB = {
    rage: 'jolt', anger: 'jolt', aggressiveness: 'jolt', annoyance: 'jolt', overwhelm: 'jolt',
    terror: 'flinch', fear: 'flinch', apprehension: 'flinch',
    ecstasy: 'bounce', joy: 'bounce', optimism: 'bounce',
    serenity: 'drift',
    trust: 'lean', acceptance: 'lean', admiration: 'lean', submission: 'lean',
    amazement: 'pop', surprise: 'pop', distraction: 'pop',
    grief: 'sink', sadness: 'sink', pensiveness: 'sink', remorse: 'sink',
    loathing: 'recoil', disgust: 'recoil', boredom: 'recoil', contempt: 'recoil', disapproval: 'recoil',
    vigilance: 'track', anticipation: 'track', interest: 'track',
    awe: 'breathe', love: 'breathe',
  };
  A.VERB = VERB;
  // Each verb returns an offset {x, y (px), r (deg), s (scale delta)} from the signals.
  // d = this piece's distance to the pointer (0 = on it, 1 = far), ax/ay = unit vector piece→pointer.
  const VERBS = {
    jolt: (S, c) => { const k = S.energy * 9 + S.onset * 14 + S.keys * 6; return { x: (c.rnd() - 0.5) * k, y: (c.rnd() - 0.5) * k, r: (c.rnd() - 0.5) * k * 0.5, s: S.onset * 0.04 }; },
    flinch: (S, c) => { const near = Math.max(0, 1 - c.d * 2.4) * (0.5 + S.speed); return { x: -c.ax * near * 28, y: -c.ay * near * 28, r: -c.ax * near * 6, s: -near * 0.05 }; },
    bounce: (S, c) => { const b = Math.abs(Math.sin(S.t * 3.1 + c.phase)) * (S.energy * 10 + S.low * 18); return { x: 0, y: -b, r: 0, s: S.tap * 0.06 + S.audio * 0.1 }; },
    drift: (S, c) => ({ x: Math.sin(S.t * 0.31 + c.phase) * 7, y: Math.cos(S.t * 0.23 + c.phase) * 6, r: Math.sin(S.t * 0.17 + c.phase) * 1.5, s: 0 }),
    lean: (S, c) => ({ x: c.ax * 4 * S.inside, y: 0, r: c.ax * 7 * (S.inside ? 1 : 0.3), s: 0 }),
    pop: (S, c) => ({ x: 0, y: 0, r: S.tap * (c.phase > 3 ? 4 : -4), s: S.tap * 0.16 + S.high * 0.08 }),
    sink: (S, c) => ({ x: 0, y: Math.min(16, S.idle * 1.4) - S.energy * 14, r: Math.min(3, S.idle * 0.25) * (c.phase > 3 ? 1 : -1), s: 0 }),
    recoil: (S, c) => { const near = Math.max(0, 1 - c.d * 2) ; return { x: -c.ax * near * 10, y: -c.ay * near * 6, r: -c.ax * near * 10, s: -near * 0.08 }; },
    track: (S, c) => ({ x: c.ax * 14 * (S.inside ? 1 : 0.2), y: c.ay * 10 * (S.inside ? 1 : 0.2), r: 0, s: 0 }),
    breathe: (S, c) => ({ x: 0, y: 0, r: 0, s: Math.sin(S.t * 0.9 + c.phase) * 0.025 + S.audio * 0.12 + S.low * 0.06 }),
  };

  function hash(str) { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let a = hash(String(seed)); return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  // ---------- 5. ROOMS ----------
  const rooms = new Set();

  A.attach = function (room, opts) {
    opts = opts || {};
    const seed = String(opts.seed || 'pcp');
    const byId = {}; (P.assets || []).forEach(a => { byId[a.id] = a; });
    const pieces = [];           // {el, img, asset, verbs, phase, cx, cy, off, drag, rnd}
    const added = [];            // elements alive created, removed on detach
    const off = [];              // listeners to remove on detach
    const on = (t, ev, fn, o) => { t.addEventListener(ev, fn, o); off.push(() => t.removeEventListener(ev, fn, o)); };
    room.classList.add('is-alive');

    // a) Loose scraps: the room's chosen cutouts that its layout didn't place. Positions come
    //    from the receipt seed, so a replayed receipt scatters them the same way.
    const placed = new Set([...room.querySelectorAll('.cut img')].map(i => (i.getAttribute('src') || '').split('/').pop().replace(/\.\w+$/, '')));
    const loose = (opts.assets || []).filter(id => !placed.has(id) && byId[id] && byId[id].src);
    const R = rng(seed + '|scraps');
    const narrow = room.offsetWidth < 640, max = opts.maxScraps || (narrow ? 3 : 5), free = opts.scatter === 'free';
    const layer = document.createElement('div'); layer.className = 'alive-scraps'; layer.setAttribute('aria-hidden', 'false');
    loose.slice(0, max).forEach((id, n) => {
      const a = byId[id], wrap = document.createElement('div'), img = new Image();
      wrap.className = 'alive-scrap';
      if (free) {   // a bare room (the lab): scatter anywhere, mid-sized
        wrap.style.left = (R() * 78).toFixed(1) + '%'; wrap.style.top = (R() * 80).toFixed(1) + '%';
        wrap.style.width = ((narrow ? 26 : 13) + R() * (narrow ? 16 : 10)).toFixed(1) + '%';
      } else {      // a room with words: margins only, under the text
        const side = n % 2 ? 'right' : 'left';
        wrap.style.setProperty(side, (R() * (narrow ? 4 : 8) - 3).toFixed(1) + '%');
        wrap.style.top = ((n + 0.3 + R() * 0.6) / (max + 0.2) * 100).toFixed(1) + '%';
        wrap.style.width = ((narrow ? 30 : 18) + R() * (narrow ? 12 : 10)).toFixed(1) + '%';
      }
      wrap.style.rotate = ((R() - 0.5) * 18).toFixed(1) + 'deg';
      img.src = a.src; img.alt = a.label || ''; img.decoding = 'async'; img.loading = 'lazy'; img.draggable = false;
      wrap.append(img); layer.append(wrap);
    });
    if (layer.children.length) { room.insertBefore(layer, room.querySelector('.content')); added.push(layer); }

    // b) Every cutout in the room gets a behaviour from its emotion tags.
    room.querySelectorAll('.cut img, .alive-scrap img, .stage-art').forEach((img, n) => {
      const id = (img.getAttribute('src') || '').split('/').pop().replace(/\.\w+$/, ''), a = byId[id] || {};
      const emo = a.emo && a.emo.length ? a.emo : ['interest'];
      const verbs = [VERB[emo[0]] || 'drift'].concat(emo[1] && VERB[emo[1]] && VERB[emo[1]] !== VERB[emo[0]] ? [VERB[emo[1]]] : []);
      const r = rng(seed + '|' + id + '|' + n);
      img.classList.add('alive-piece');
      img.tabIndex = 0;
      img.setAttribute('role', 'img');
      img.setAttribute('aria-roledescription', 'movable cutout');
      if (!img.alt) img.alt = a.label || 'cutout';
      img.dataset.verb = verbs.join('+');
      pieces.push({ img, asset: a, verbs, phase: r() * 6.28, rnd: r, cx: 0, cy: 0, cur: { x: 0, y: 0, r: 0, s: 0 }, drag: { x: 0, y: 0 } });
    });

    function measure() {
      const rr = room.getBoundingClientRect();
      pieces.forEach(p => { const b = p.img.getBoundingClientRect(); p.cx = (b.left + b.width / 2 - rr.left) / rr.width; p.cy = (b.top + b.height / 2 - rr.top) / rr.height; });
    }

    // c) Pointer / touch: position, speed, drag a cutout, tap empty space for an ink stamp.
    let last = null, dragging = null;
    on(room, 'pointermove', e => {
      const rr = room.getBoundingClientRect(), x = (e.clientX - rr.left) / rr.width, y = (e.clientY - rr.top) / rr.height, now = performance.now();
      if (last) { const dt = Math.max(8, now - last.t); S.vx = (x - last.x) / dt * 1000; S.vy = (y - last.y) / dt * 1000; S.speed = Math.min(1, Math.hypot(S.vx, S.vy * rr.height / rr.width) / 3); }
      last = { x, y, t: now }; S.px = x; S.py = y; S.inside = true; S.idle = 0;
      S.energy = Math.min(1, S.energy + S.speed * 0.08);
      if (dragging) { dragging.p.drag.x = dragging.ox + (e.clientX - dragging.sx); dragging.p.drag.y = dragging.oy + (e.clientY - dragging.sy); }
      wake();
    }, { passive: true });
    on(room, 'pointerleave', () => { S.inside = false; last = null; });
    on(room, 'pointerdown', e => {
      let p = pieces.find(q => q.img === e.target);
      // Mouse or pen: grab a cutout even when the text block lies over it (the art sits under the words).
      if (!p && e.pointerType !== 'touch' && !e.target.closest('a,button,input,textarea,select,summary,label') && document.elementsFromPoint) {
        const hit = document.elementsFromPoint(e.clientX, e.clientY).find(el => el.classList && el.classList.contains('alive-piece'));
        p = hit && pieces.find(q => q.img === hit);
      }
      if (p) {
        dragging = { p, sx: e.clientX, sy: e.clientY, ox: p.drag.x, oy: p.drag.y };
        p.img.setPointerCapture && p.img.setPointerCapture(e.pointerId);
        p.img.classList.add('is-held'); e.preventDefault(); poke(0.5); return;
      }
      poke(0.2);
    });
    // Ink stamps on a real tap or click only (a scroll on a phone never stamps).
    on(room, 'click', e => {
      if (e.target.closest('a,button,input,textarea,select,summary,label,.alive-piece')) return;
      if (window.getSelection && String(window.getSelection())) return;   // selecting text to read or copy: leave it alone
      stamp(e.clientX, e.clientY); poke(0.7);
    });
    const drop = () => { if (dragging) { dragging.p.img.classList.remove('is-held'); dragging = null; measure(); } };
    on(room, 'pointerup', drop); on(room, 'pointercancel', drop);

    // d) Keys: type and the room answers with cut-out letters. Arrows move a focused cutout.
    const wall = document.createElement('div'); wall.className = 'alive-wall'; wall.setAttribute('aria-hidden', 'true');
    room.append(wall); added.push(wall);
    let line = 0, col = 0, lineTop = null, prevTop = null;
    // Where a new line of letters starts: at the pointer if it's in the room, else in the middle of what's on screen.
    function anchor() {
      const rr = room.getBoundingClientRect();
      if (S.inside) return S.py * rr.height;
      const mid = Math.min(window.innerHeight, rr.bottom) * 0.35 + Math.max(0, -rr.top);
      return Math.max(20, Math.min(rr.height - 80, mid));
    }
    const fonts = ['Georgia,serif', '"Arial Black",Impact,sans-serif', '"Courier New",monospace', 'Impact,"Arial Narrow",sans-serif', '"Times New Roman",serif', 'Verdana,sans-serif'];
    const css = getComputedStyle(room);
    // Letter tiles use the room's own colours; the letter takes whichever of ink/paper reads on that tile.
    const rgbOf = c => { const d = document.createElement('i'); d.style.color = c; document.body.append(d); const m = getComputedStyle(d).color.match(/\d+(\.\d+)?/g) || [0, 0, 0]; d.remove(); return m.slice(0, 3).map(Number); };
    const lum = c => { const [r, g, b] = rgbOf(c).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const seen = new Set(), colours = [];
    ['--ground', '--ink', '--accent'].map(v => css.getPropertyValue(v).trim()).filter(Boolean).concat(['#f3eadb', '#111111', '#e4ef65'])
      .forEach(c => { const k = rgbOf(c).join(','); if (!seen.has(k)) { seen.add(k); colours.push({ c, l: lum(c) }); } });
    const readable = bg => bg.l > 0.18 ? '#111111' : '#f3eadb';
    const KR = rng(seed + '|letters');
    on(document, 'keydown', e => {
      if (!room.isConnected || room.closest('[hidden]')) return;
      const t = e.target;
      if (t && t.closest && t.closest('input,textarea,select,[contenteditable="true"]')) return;
      const p = pieces.find(q => q.img === t);
      if (p && e.key.startsWith('Arrow')) {
        const k = e.shiftKey ? 40 : 10;
        if (e.key === 'ArrowLeft') p.drag.x -= k; if (e.key === 'ArrowRight') p.drag.x += k;
        if (e.key === 'ArrowUp') p.drag.y -= k; if (e.key === 'ArrowDown') p.drag.y += k;
        e.preventDefault(); poke(0.3); return;
      }
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === 'Escape') { wall.textContent = ''; line = col = 0; lineTop = prevTop = null; return; }
      if (e.key === 'Backspace') { if (wall.lastChild) { wall.lastChild.remove(); col = Math.max(0, col - 1); } return; }
      if (e.key === 'Enter' && (!t || !t.closest || !t.closest('a,button,summary'))) { line++; col = 0; lineTop = null; return; }
      if (e.key.length !== 1 || (e.key === ' ' && t && t.closest && t.closest('a,button,summary'))) return;
      S.keys = Math.min(1, S.keys + 0.25); poke(0.45);
      if (e.key === ' ') { col++; return; }
      if (wall.children.length >= 80) wall.firstChild.remove();
      const ch = document.createElement('span'), bg = colours[Math.floor(KR() * colours.length)], fg = readable(bg);
      ch.textContent = e.key;
      ch.style.cssText = 'font-family:' + fonts[Math.floor(KR() * fonts.length)] + ';background:' + bg.c + ';color:' + fg +
        ';rotate:' + ((KR() - 0.5) * 14).toFixed(1) + 'deg;font-size:' + (1.4 + KR() * 1.4).toFixed(2) + 'em;--i:' + col;
      const perLine = Math.max(8, Math.floor(room.offsetWidth / 34));
      if (col >= perLine) { line++; col = 0; lineTop = null; }
      if (lineTop === null) { const a = anchor(); lineTop = prevTop !== null && Math.abs(a - prevTop) < 46 ? prevTop + 46 : a; prevTop = lineTop; }
      ch.style.left = (4 + col * (92 / perLine)).toFixed(2) + '%';
      ch.style.top = lineTop.toFixed(0) + 'px';
      wall.append(ch); col++;
    });

    function stamp(x, y) {
      if (wall.querySelectorAll('.alive-stamp').length > 14) wall.querySelector('.alive-stamp').remove();
      const rr = room.getBoundingClientRect(), s = document.createElement('i');
      s.className = 'alive-stamp';
      s.style.left = ((x - rr.left) / rr.width * 100).toFixed(2) + '%';
      s.style.top = (y - rr.top) + 'px';
      s.style.background = colours[Math.floor(KR() * colours.length)].c;
      s.style.rotate = Math.floor(KR() * 360) + 'deg';
      wall.append(s);
      if (!A.isStill()) setTimeout(() => s.remove(), 1600);
    }

    // e) Each frame: smooth every piece toward where its verbs want it.
    const self = {
      room, pieces,
      step(dt) {
        if (!room.isConnected) return;
        const still = A.isStill();
        pieces.forEach(p => {
          let x = 0, y = 0, r = 0, s = 0;
          if (!still) {
            const ax0 = S.px - p.cx, ay0 = (S.py - p.cy) * (room.offsetHeight / Math.max(1, room.offsetWidth)), len = Math.hypot(ax0, ay0) || 1;
            const c = { d: Math.min(1, len), ax: ax0 / len, ay: ay0 / len, phase: p.phase, rnd: p.rnd };
            p.verbs.forEach((v, i) => { const o = VERBS[v](S, c), w = i ? 0.45 : 1; x += o.x * w; y += o.y * w; r += o.r * w; s += o.s * w; });
            x += S.tiltX * 16 * (0.5 + p.phase / 6.28); y += S.tiltY * 12 * (0.5 + p.phase / 6.28);
            // Beat layer: bass lifts, a hit kicks and spins, loudness swells. Each piece leans its own way (phase).
            const D = A.drama, loud = Math.min(1, S.audio * 1.4);
            if (D > 0 && (S.hearing || loud > 0.02 || S.onset > 0.02)) {
              const side = p.phase > Math.PI ? 1 : -1, amp = 1 + (D - 1) * 0.5 * loud;
              x = x * amp + Math.sin(S.t * 2.3 + p.phase) * loud * 12 * D;
              y = y * amp - (S.low * 26 + S.onset * 22) * D * (0.6 + 0.4 * Math.sin(p.phase));
              r = r * amp + side * (S.onset * 11 + S.low * 4) * D;
              s = s + (S.onset * 0.14 + S.low * 0.07 + loud * 0.05) * D;
            }
          }
          const k = still ? 1 : Math.min(1, dt * (9 + S.onset * 30 * A.drama));   // hits land fast, then ease back
          p.cur.x += (x - p.cur.x) * k; p.cur.y += (y - p.cur.y) * k; p.cur.r += (r - p.cur.r) * k; p.cur.s += (s - p.cur.s) * k;
          p.img.style.translate = (p.cur.x + p.drag.x).toFixed(1) + 'px ' + (p.cur.y + p.drag.y).toFixed(1) + 'px';
          p.img.style.rotate = p.cur.r.toFixed(2) + 'deg';
          p.img.style.scale = (1 + p.cur.s).toFixed(3);
        });
      },
      applyStill() { room.classList.toggle('is-still', A.isStill()); },
      detach() {
        rooms.delete(self); off.forEach(f => f()); added.forEach(e => e.remove());
        pieces.forEach(p => { ['translate', 'rotate', 'scale'].forEach(k => p.img.style.removeProperty(k)); p.img.classList.remove('alive-piece'); });
        room.classList.remove('is-alive', 'is-still');
      },
    };
    rooms.add(self); self.applyStill();
    requestAnimationFrame(measure);
    on(window, 'resize', measure, { passive: true });
    let lastY = window.scrollY;
    on(window, 'scroll', () => { const dy = Math.abs(window.scrollY - lastY); lastY = window.scrollY; S.idle = 0; S.energy = Math.min(1, S.energy + Math.min(0.05, dy / 4000)); wake(); }, { passive: true });
    wake();
    return self;
  };

  // ---------- 6. ONE LOOP for everything, asleep when nothing is happening ----------
  let running = false, prev = 0;
  function wake() { if (!running && !document.hidden) { running = true; prev = performance.now(); requestAnimationFrame(frame); } }
  A.wake = wake;
  function frame(now) {
    const dt = Math.min(0.1, (now - prev) / 1000); prev = now;
    S.t += dt; S.idle += dt;
    readAudio();
    S.keys *= Math.pow(0.25, dt); S.tap *= Math.pow(0.02, dt); S.speed *= Math.pow(0.05, dt);
    S.energy = Math.max(S.energy * Math.pow(0.35, dt), S.audio * 0.8, S.onset * 0.9);
    rooms.forEach(r => r.step(dt));
    emit();
    // Keep breathing gently for a few seconds after the last input, then sleep (battery).
    const busy = S.hearing || S.tilting || S.energy > 0.01 || S.idle < 8;
    if (busy && !document.hidden && rooms.size) requestAnimationFrame(frame); else running = false;
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) wake(); });
})();
