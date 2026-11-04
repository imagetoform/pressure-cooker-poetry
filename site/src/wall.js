/* =====================================================================
   PRESSURE COOKER POETRY — THE DRAWING WALL
   ---------------------------------------------------------------------
   A visitor draws a mark in the margin. A small point-cloud recognizer
   ($P, Vatavu/Anthony/Wobbrock 2012) guesses which of ~15 shapes it is,
   entirely in the browser, no API. The shape + how it was drawn (speed,
   size, number of strokes) becomes a reading on the four hidden dials.
   Every line of the piece is scored on the same dials automatically
   from its words, and the wall answers with one of the closest lines.
   A little seeded randomness keeps it loose: the same drawing always
   gets the same answer, a slightly different drawing may not.
   The writing itself is never changed, only pointed at.
   ===================================================================== */
(function () {
  "use strict";
  var PCP = (window.PCP = window.PCP || {});
  var h = PCP.h;

  /* ---------------- $P point-cloud recognizer ---------------- */
  var N = 32;
  function pathLength(pts) {
    var d = 0;
    for (var i = 1; i < pts.length; i++) if (pts[i].id === pts[i - 1].id) d += dist(pts[i - 1], pts[i]);
    return d;
  }
  function dist(a, b) { var dx = b.x - a.x, dy = b.y - a.y; return Math.sqrt(dx * dx + dy * dy); }
  function resample(pts, n) {
    var I = pathLength(pts) / (n - 1), D = 0, out = [{ x: pts[0].x, y: pts[0].y, id: pts[0].id }];
    pts = pts.slice();
    for (var i = 1; i < pts.length; i++) {
      if (pts[i].id === pts[i - 1].id) {
        var d = dist(pts[i - 1], pts[i]);
        if (D + d >= I && I > 0) {
          var q = { x: pts[i - 1].x + ((I - D) / d) * (pts[i].x - pts[i - 1].x), y: pts[i - 1].y + ((I - D) / d) * (pts[i].y - pts[i - 1].y), id: pts[i].id };
          out.push(q); pts.splice(i, 0, q); D = 0;
        } else D += d;
      }
    }
    while (out.length < n) out.push({ x: pts[pts.length - 1].x, y: pts[pts.length - 1].y, id: pts[pts.length - 1].id });
    return out.slice(0, n);
  }
  function normalize(pts) {
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    pts.forEach(function (p) { minX = Math.min(minX, p.x); minY = Math.min(minY, p.y); maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y); });
    var size = Math.max(maxX - minX, maxY - minY) || 1;
    var s = pts.map(function (p) { return { x: (p.x - minX) / size, y: (p.y - minY) / size, id: p.id }; });
    var cx = 0, cy = 0;
    s.forEach(function (p) { cx += p.x; cy += p.y; }); cx /= s.length; cy /= s.length;
    return s.map(function (p) { return { x: p.x - cx, y: p.y - cy, id: p.id }; });
  }
  function prep(pts) { return normalize(resample(pts, N)); }
  function cloudDistance(a, b, start) {
    var matched = new Array(a.length), sum = 0, i = start, w;
    do {
      var idx = -1, min = Infinity;
      for (var j = 0; j < matched.length; j++) if (!matched[j]) { var d = dist(a[i], b[j]); if (d < min) { min = d; idx = j; } }
      matched[idx] = true;
      w = 1 - ((i - start + a.length) % a.length) / a.length;
      sum += w * min;
      i = (i + 1) % a.length;
    } while (i !== start);
    return sum;
  }
  function greedyMatch(a, b) {
    var step = Math.floor(Math.pow(a.length, 0.5)), min = Infinity;
    for (var i = 0; i < a.length; i += step) min = Math.min(min, cloudDistance(a, b, i), cloudDistance(b, a, i));
    return min;
  }

  /* ---------------- templates, drawn by code ---------------- */
  function poly(xy, id) { return xy.map(function (p) { return { x: p[0], y: p[1], id: id || 0 }; }); }
  function arc(cx, cy, r, a0, a1, n, id) {
    var out = [];
    for (var k = 0; k <= n; k++) { var a = a0 + (a1 - a0) * k / n; out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    return poly(out, id);
  }
  function lineAt(angle) {
    var c = Math.cos(angle), s = Math.sin(angle), out = [];
    for (var k = 0; k <= 10; k++) { var t = k / 10 - 0.5; out.push([c * t, s * t]); }
    return poly(out);
  }
  var T = [];
  function add(name, pts) { T.push({ name: name, pts: prep(pts) }); }
  add("circle", arc(0, 0, 1, 0, Math.PI * 2, 40));
  add("circle", arc(0, 0, 1, Math.PI, Math.PI * 3, 40));
  [0, Math.PI / 4, Math.PI / 2, 3 * Math.PI / 4].forEach(function (a) { add("line", lineAt(a)); });
  add("zigzag", poly([[0, 0], [1, 2], [2, 0], [3, 2], [4, 0], [5, 2], [6, 0]]));
  add("zigzag", poly([[0, 2], [1, 0], [2, 2], [3, 0], [4, 2], [5, 0]]));
  (function () { var o = []; for (var k = 0; k <= 60; k++) { var x = k / 60 * 4 * Math.PI; o.push([x / 4, Math.sin(x) * 0.45]); } add("wave", poly(o)); })();
  (function () { var o = []; for (var k = 0; k <= 80; k++) { var a = k / 80 * 5 * Math.PI, r = 0.1 + a / (5 * Math.PI); o.push([r * Math.cos(a), r * Math.sin(a)]); } add("spiral", poly(o)); })();
  (function () { var o = []; for (var k = 0; k <= 80; k++) { var a = k / 80 * 5 * Math.PI, r = 1.1 - a / (5 * Math.PI); o.push([r * Math.cos(a), r * Math.sin(a)]); } add("spiral", poly(o)); })();
  add("square", poly([[0, 0], [1, 0], [1, 1], [0, 1], [0, 0]]));
  add("square", poly([[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]));
  add("triangle", poly([[0.5, 0], [1, 1], [0, 1], [0.5, 0]]));
  add("triangle", poly([[0, 1], [0.5, 0], [1, 1], [0, 1]]));
  (function () { var o = []; for (var k = 0; k <= 5; k++) { var a = -Math.PI / 2 + k * 4 * Math.PI / 5; o.push([Math.cos(a), Math.sin(a)]); } add("star", poly(o)); })();
  add("x", poly([[0, 0], [1, 1]], 0).concat(poly([[1, 0], [0, 1]], 1)));
  add("x", poly([[1, 0], [0, 1]], 0).concat(poly([[0, 0], [1, 1]], 1)));
  add("plus", poly([[0.5, 0], [0.5, 1]], 0).concat(poly([[0, 0.5], [1, 0.5]], 1)));
  add("plus", poly([[0, 0.5], [1, 0.5]], 0).concat(poly([[0.5, 0], [0.5, 1]], 1)));
  (function () {
    var o = [];
    for (var k = 0; k <= 60; k++) { var t = k / 60 * Math.PI * 2; o.push([16 * Math.pow(Math.sin(t), 3), -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]); }
    add("heart", poly(o));
  })();
  add("arrow", poly([[0, 0.5], [1, 0.5]], 0).concat(poly([[0.7, 0.2], [1, 0.5], [0.7, 0.8]], 1)));
  add("arrow", poly([[0, 0.5], [1, 0.5], [0.7, 0.2], [1, 0.5], [0.7, 0.8]]));
  add("check", poly([[0, 0.55], [0.35, 1], [1, 0]]));

  function recognize(strokes) {
    var pts = [];
    strokes.forEach(function (s, id) { s.forEach(function (p) { pts.push({ x: p.x, y: p.y, id: id }); }); });
    if (pts.length < 2) return { name: "dot", score: 1 };
    var c = prep(pts), best = null, bestD = Infinity;
    T.forEach(function (t) { var d = greedyMatch(c, t.pts); if (d < bestD) { bestD = d; best = t.name; } });
    return { name: best, score: Math.max(0, (2 - bestD) / 2) };
  }

  /* ---------------- shape -> hidden dials ---------------- */
  var SHAPES = {
    circle:   { word: "a circle",    v: [40, 60, 80, 25] },
    line:     { word: "a line",      v: [45, 85, 40, 15] },
    zigzag:   { word: "a zigzag",    v: [85, 55, 30, 70] },
    wave:     { word: "a wave",      v: [45, 45, 70, 45] },
    spiral:   { word: "a spiral",    v: [55, 25, 60, 80] },
    square:   { word: "a box",       v: [35, 80, 35, 10] },
    triangle: { word: "a triangle",  v: [60, 75, 35, 35] },
    star:     { word: "a star",      v: [80, 60, 55, 55] },
    x:        { word: "an X",        v: [75, 40, 20, 75] },
    plus:     { word: "a cross",     v: [45, 70, 50, 30] },
    heart:    { word: "a heart",     v: [45, 50, 95, 30] },
    arrow:    { word: "an arrow",    v: [75, 70, 30, 45] },
    check:    { word: "a check mark", v: [55, 80, 50, 25] },
    scribble: { word: "a scribble",  v: [85, 15, 40, 95] },
    dot:      { word: "a dot",       v: [15, 70, 85, 10] }
  };

  function readMark(strokes, box, ms) {
    var all = [];
    strokes.forEach(function (s) { all = all.concat(s); });
    var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity, ink = 0;
    all.forEach(function (p) { minX = Math.min(minX, p.x); minY = Math.min(minY, p.y); maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y); });
    strokes.forEach(function (s) { for (var i = 1; i < s.length; i++) ink += dist(s[i - 1], s[i]); });
    var w = maxX - minX, ht = maxY - minY, size = Math.max(w, ht) / box; // 0..1 of the wall
    var shape;
    if (all.length < 3 || size < 0.06) shape = { name: "dot", score: 1 };
    else {
      var density = ink / (Math.max(w, ht) || 1);
      shape = density > 9 ? { name: "scribble", score: 1 } : recognize(strokes);
      if (shape.score < 0.12) shape = { name: "scribble", score: shape.score };
    }
    var base = SHAPES[shape.name] || SHAPES.scribble;
    var speed = ms > 0 ? ink / ms : 0.5;                 // px per ms
    var pres = 0, np = 0;
    all.forEach(function (p) { if (p.p) { pres += p.p; np++; } });
    pres = np ? pres / np : 0.5;
    var e = base.v[0] + (speed - 0.6) * 25 + (pres - 0.5) * 20;
    var c = base.v[1] - (strokes.length - 1) * 4;
    var i = base.v[2] + (0.5 - size) * 30;
    var x = base.v[3] + (strokes.length - 1) * 5 + (speed - 0.6) * 10;
    function cl(v) { return Math.max(3, Math.min(97, Math.round(v))); }
    return { shape: shape.name, word: base.word, dials: { energy: cl(e), clarity: cl(c), intimacy: cl(i), chaos: cl(x) } };
  }

  /* ---------------- automatic line scoring ---------------- */
  function set(s) { var o = {}; s.split(" ").forEach(function (w) { o[w] = 1; }); return o; }
  var LEX = {
    eHi: set("burn burning burned fire flame flames scream screaming run running break broke breaking rage war strike blood storm fast loud ember embers explode crash hammer riot shout howl roar fist fists fight kick smash thunder sprint spark sparks blaze rush race hit punch tear torn rip bang engine gun guns knife lightning wild"),
    eLo: set("still quiet sleep sleeping slow slowly rest silence silent soft softly dust wait waiting hush calm lull stillness dormant settle settled linger lingering float idle"),
    cHi: set("clear clearly light glass plain true truth name named know knew see seen bright sharp count line lines simple exactly fact facts mirror window sun noon open written word words because"),
    cLo: set("fog dark darkness shadow shadows maybe dream dreams dreaming blur blurred smoke haze ghost ghosts mist mystery unknown perhaps somewhere almost vague dim murk hidden secret secrets"),
    iHi: set("i me my mine you your yours we our us hand hands skin mouth breath heart bone bones mother father kitchen bed home hold holding touch kiss tongue lips chest blood body grandmother child love sister brother friend whisper face eyes"),
    iLo: set("system systems market markets nation state they them crowd public corporate empire machine machines institution institutions office board shareholders capital economy government policy quarterly profit brand algorithm"),
    xHi: set("broken scattered fracture fractured shatter shattered riot wild storm collapse chaos static noise fragments fragment split spill spilled tangle tangled crack cracked unravel ruin ruins burst swarm dizzy spin spinning"),
    xLo: set("order line row rows still pattern rule rules structure plan grid neat straight measured steady even level balance aligned")
  };
  function words(text) { return (text.toLowerCase().match(/[a-z']+/g) || []).map(function (w) { return w.replace(/'s$/, "").replace(/'/g, ""); }); }
  function scoreText(text) {
    var ws = words(text), n = Math.max(1, ws.length);
    var c = { eHi: 0, eLo: 0, cHi: 0, cLo: 0, iHi: 0, iLo: 0, xHi: 0, xLo: 0 };
    ws.forEach(function (w) { Object.keys(LEX).forEach(function (k) { if (LEX[k][w]) c[k]++; }); });
    var bang = (text.match(/!/g) || []).length, q = (text.match(/\?/g) || []).length;
    var dash = (text.match(/—|--|…|\.\.\./g) || []).length;
    var caps = (text.match(/\b[A-Z]{3,}\b/g) || []).length;
    var damp = 1 / Math.sqrt(n / 6 + 0.5);
    function sc(hi, lo, extra) { return Math.max(4, Math.min(96, Math.round(50 + (18 * (hi - lo) + extra) * damp))); }
    return {
      energy: sc(c.eHi + bang + caps, c.eLo, 0),
      clarity: sc(c.cHi, c.cLo + q, n <= 7 ? 6 : -4),
      intimacy: sc(c.iHi, c.iLo, 0),
      chaos: sc(c.xHi + dash, c.xLo, 0)
    };
  }

  function answer(items, mark, seedKey) {
    var pool = items.filter(function (it) { return words(it.text).length >= 4; });
    if (pool.length < 8) pool = items.filter(function (it) { return words(it.text).length >= 2; });
    if (!pool.length) pool = items.slice();
    var m = mark.dials;
    var scored = pool.map(function (it) {
      if (!it.score) it.score = scoreText(it.text);
      var s = it.score;
      var d = Math.sqrt(Math.pow(s.energy - m.energy, 2) + Math.pow(s.clarity - m.clarity, 2) + Math.pow(s.intimacy - m.intimacy, 2) + Math.pow(s.chaos - m.chaos, 2));
      return { it: it, d: d };
    }).sort(function (a, b) { return a.d - b.d; });
    var top = scored.slice(0, 4);
    var rng = PCP.engine.makeRng("wall|" + seedKey);
    var pick = rng.weighted(top, top.map(function (t) { return Math.exp(-(t.d - top[0].d) / 12); }));
    return pick.it;
  }

  /* ---------------- the wall UI ---------------- */
  var current = null;
  function attach(host, items, opts) {
    opts = opts || {};
    if (current && current.cleanup) current.cleanup();
    var cv = h("canvas", { "class": "wall-canvas", width: "600", height: "600", role: "img", "aria-label": "Drawing wall. Draw with a mouse, finger or stylus." });
    var out = h("div", { "class": "wall-out", "aria-live": "polite" });
    var wipe = h("button", { type: "button", "class": "wall-btn", text: "Wipe the wall" });
    var aside = h("aside", { "class": "wall", "aria-label": "The drawing wall" }, [
      h("p", { "class": "wall-kicker", text: "The wall" }),
      h("p", { "class": "wall-note", text: "Draw a mark. The " + (opts.kind || "poem") + " answers with the line that tastes closest." }),
      h("div", { "class": "wall-frame" }, [cv]),
      h("div", { "class": "wall-row" }, [wipe, h("span", { "class": "wall-small", text: "Knows about fifteen shapes. Nothing leaves your browser." })]),
      out
    ]);
    host.appendChild(aside);

    var ctx = cv.getContext("2d");
    var strokes = [], drawing = false, t0 = 0, tMove = 0, timer = null;
    function scale(ev) { var r = cv.getBoundingClientRect(); return { x: (ev.clientX - r.left) * (cv.width / r.width), y: (ev.clientY - r.top) * (cv.height / r.height), p: ev.pressure && ev.pointerType === "pen" ? ev.pressure : 0 }; }
    function paint() {
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = "#111"; ctx.lineWidth = 9;
      strokes.forEach(function (s) {
        ctx.beginPath();
        s.forEach(function (p, k) { if (k) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); });
        if (s.length === 1) ctx.lineTo(s[0].x + 0.1, s[0].y);
        ctx.stroke();
      });
    }
    function down(ev) {
      ev.preventDefault();
      cv.setPointerCapture && cv.setPointerCapture(ev.pointerId);
      clearTimeout(timer);
      if (!strokes.length) t0 = performance.now();
      drawing = true; strokes.push([scale(ev)]); paint();
    }
    function move(ev) { if (!drawing) return; ev.preventDefault(); strokes[strokes.length - 1].push(scale(ev)); tMove = performance.now(); paint(); }
    function up() {
      if (!drawing) return;
      drawing = false; tMove = performance.now();
      clearTimeout(timer); timer = setTimeout(ask, 750);
    }
    function ask() {
      if (!strokes.length) return;
      var mark = readMark(strokes, cv.width, Math.max(1, tMove - t0));
      var key = mark.shape + "|" + strokes.length + "|" + strokes.map(function (s) { return s.length + ":" + Math.round(s[0].x / 40) + "," + Math.round(s[0].y / 40); }).join(";");
      var it = answer(items, mark, (opts.id || "") + "|" + key);
      show(mark, it);
    }
    function show(mark, it) {
      document.querySelectorAll(".wall-hit").forEach(function (el) { el.classList.remove("wall-hit"); });
      out.innerHTML = "";
      var flavor = PCP.tastes ? PCP.tastes.tasteWords(PCP.tastes.flavorOf(mark.dials), 2) : "";
      out.appendChild(h("p", { "class": "wall-guess", text: "Looks like " + mark.word + (flavor ? ". It tastes " + flavor + "." : ".") }));
      out.appendChild(h("blockquote", { "class": "wall-quote", text: it.text }));
      if (it.el) {
        var go = h("button", { type: "button", "class": "wall-btn", text: it.where ? "Find it (" + it.where + ")" : "Find it" });
        go.addEventListener("click", function () { focusLine(it.el); });
        out.appendChild(go);
        it.el.classList.add("wall-hit");
      }
    }
    function focusLine(el) {
      el.classList.remove("wall-hit"); void el.offsetWidth; el.classList.add("wall-hit");
      el.scrollIntoView({ behavior: document.documentElement.classList.contains("no-motion") ? "auto" : "smooth", block: "center" });
    }
    function clear() { clearTimeout(timer); strokes = []; paint(); out.innerHTML = ""; document.querySelectorAll(".wall-hit").forEach(function (el) { el.classList.remove("wall-hit"); }); }
    cv.addEventListener("pointerdown", down);
    cv.addEventListener("pointermove", move);
    cv.addEventListener("pointerup", up);
    cv.addEventListener("pointercancel", up);
    cv.addEventListener("pointerleave", function () { if (drawing) up(); });
    wipe.addEventListener("click", clear);
    paint();
    current = { cleanup: function () { clearTimeout(timer); }, _ask: ask, _strokes: function (s, ms) { strokes = s; t0 = 0; tMove = ms || 900; paint(); ask(); } };
    return aside;
  }

  PCP.wall = { attach: attach, recognize: recognize, readMark: readMark, scoreText: scoreText, answer: answer, get current() { return current; } };
})();
