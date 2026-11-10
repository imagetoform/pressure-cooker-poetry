/* =====================================================================
   PRESSURE COOKER POETRY — THE DARTBOARD (emotion wheel)
   ---------------------------------------------------------------------
   Plutchik's wheel of emotions, laid out as a dartboard. Pure: no DOM.

     8 wedges (clockwise from the top): joy, trust, fear, surprise,
       sadness, disgust, anger, anticipation
     3 rings per wedge, strongest at the center:
       intense (ecstasy, rage...) · core (joy, anger...) · mild (serenity...)
     8 blends in the outer band, between neighbouring wedges:
       love, submission, awe, disapproval, remorse, contempt,
       aggressiveness, optimism
     the bullseye: overwhelm

   DARTS: every ingredient in the pot is one dart. Its tastes aim it:
   each taste pulls in a fixed direction on the wheel, so the dart's
   angle is the pull of all its tastes added together. One strong taste
   flies straight into the middle (rage, grief); a muddle of tastes that
   cancel out lands out at the edge (annoyance, pensiveness). A seeded
   wobble makes it a throw, and the same pot always throws the same darts.
   An empty pot throws one dart for the house stock.

   CUTOUTS carry emotion words only, no numbers:  emo: ["rage", "contempt"]
   Any word on the board works. The wheel's geometry does the rest: a
   cutout tagged "anger" is close to a dart in "rage", a little further
   from "contempt", far from "serenity". Cutouts whose tags sit closest
   to where the darts landed are the ones the kitchen reaches for.
   ===================================================================== */
(function () {
  "use strict";
  var PCP = (window.PCP = window.PCP || {});

  var PETALS = [
    { key: "joy",          color: "#f5c400", ring: ["ecstasy", "joy", "serenity"] },
    { key: "trust",        color: "#7cb342", ring: ["admiration", "trust", "acceptance"] },
    { key: "fear",         color: "#1f7a4d", ring: ["terror", "fear", "apprehension"] },
    { key: "surprise",     color: "#1e9fb0", ring: ["amazement", "surprise", "distraction"] },
    { key: "sadness",      color: "#2a5bd7", ring: ["grief", "sadness", "pensiveness"] },
    { key: "disgust",      color: "#8e44ad", ring: ["loathing", "disgust", "boredom"] },
    { key: "anger",        color: "#c4161c", ring: ["rage", "anger", "annoyance"] },
    { key: "anticipation", color: "#ee7d1c", ring: ["vigilance", "anticipation", "interest"] }
  ];
  // blend i sits between petal i and petal i+1
  var DYADS = ["love", "submission", "awe", "disapproval", "remorse", "contempt", "aggressiveness", "optimism"];
  var RINGS = [
    { name: "intense", from: 0.10, to: 0.42, mid: 0.26 },
    { name: "core",    from: 0.42, to: 0.72, mid: 0.57 },
    { name: "mild",    from: 0.72, to: 1.00, mid: 0.86 }
  ];
  var BULL = 0.10, DYAD_IN = 1.0, DYAD_OUT = 1.2;

  /* which way each taste pulls (degrees, 0 = joy at the top, clockwise) */
  var TASTE_AIM = { sweet: 0, umami: 45, sour: 125, bitter: 200, spicy: 285, salty: 330 };

  /* every word on the board -> a point on the board */
  var TAGS = {};
  PETALS.forEach(function (p, i) {
    TAGS[p.key] = { angle: i * 45, r: RINGS[1].mid, petal: i, ring: 1 };
    p.ring.forEach(function (w, k) { TAGS[w] = { angle: i * 45, r: RINGS[k].mid, petal: i, ring: k }; });
  });
  DYADS.forEach(function (w, i) { TAGS[w] = { angle: i * 45 + 22.5, r: 0.86, dyad: i }; });
  TAGS.overwhelm = { angle: 0, r: 0, bull: true };
  /* a few plain-English aliases so tagging can stay loose */
  var ALIASES = { happiness: "joy", calm: "serenity", peace: "serenity", hope: "optimism", dread: "apprehension", anxiety: "apprehension",
    panic: "terror", shock: "amazement", wonder: "awe", grief: "grief", sorrow: "sadness", melancholy: "pensiveness", nostalgia: "pensiveness",
    revulsion: "loathing", fury: "rage", irritation: "annoyance", defiance: "aggressiveness", resolve: "vigilance", curiosity: "interest",
    tenderness: "love", devotion: "admiration", obedience: "submission", scorn: "contempt", regret: "remorse", guilt: "remorse", chaos: "overwhelm" };
  function resolve(tag) { tag = String(tag || "").toLowerCase().trim(); return TAGS[tag] ? tag : (ALIASES[tag] && TAGS[ALIASES[tag]] ? ALIASES[tag] : null); }

  function rad(a) { return (a - 90) * Math.PI / 180; }           // 0deg = top
  function xy(angle, r) { return { x: Math.cos(rad(angle)) * r, y: Math.sin(rad(angle)) * r }; }
  function norm(a) { return ((a % 360) + 360) % 360; }

  /* where on the board a landing point is, in words */
  function readPoint(angle, r) {
    angle = norm(angle);
    if (r < BULL) return { tags: ["overwhelm"], petal: null, ring: "bull", word: "overwhelm" };
    var petal = Math.round(angle / 45) % 8;
    var ring = r < RINGS[0].to ? 0 : r < RINGS[1].to ? 1 : 2;
    var word = PETALS[petal].ring[ring];
    var tags = [word];
    var off = norm(angle - petal * 45 + 180) - 180;          // -22.5..22.5 from the wedge's centre line
    if (Math.abs(off) > 12 && ring > 0) {                   // close to the seam: the blend bleeds in
      var d = off > 0 ? petal : (petal + 7) % 8;
      tags.push(DYADS[d]);
    }
    return { tags: tags, petal: PETALS[petal].key, ring: RINGS[ring].name, word: word };
  }

  /* ---------- throwing ---------- */
  function seeded(key) { return PCP.engine.makeRng("dart|" + key); }
  function dartFor(t, key, label) {
    var vx = 0, vy = 0, total = 0;
    Object.keys(TASTE_AIM).forEach(function (k) {
      var n = +(t[k] || 0); if (!n) return;
      var p = xy(TASTE_AIM[k], 1);
      vx += p.x * n; vy += p.y * n; total += n;
    });
    if (!total) return null;
    var mag = Math.sqrt(vx * vx + vy * vy);
    var focus = mag / total;                                    // 1 = one clear taste, 0 = tastes cancel out
    var angle = norm(Math.atan2(vy, vx) * 180 / Math.PI + 90);
    // one clear taste flies to the middle; tastes that cancel land at the edge
    var r = 1.25 - focus - 0.3 * (Math.min(1.2, total / 10) - 0.9);
    var rng = seeded(key);
    angle = norm(angle + rng.range(-9, 9));                      // the throw
    r = Math.max(BULL + 0.04, Math.min(0.98, r + rng.range(-0.05, 0.05)));  // only the whole pot can hit the bull
    var spot = readPoint(angle, r);
    var p = xy(angle, r);
    return { label: label, angle: Math.round(angle * 10) / 10, r: Math.round(r * 1000) / 1000, x: p.x, y: p.y, tags: spot.tags, word: spot.word, petal: spot.petal, ring: spot.ring };
  }

  /* recipe ingredients (ids) + the pantry + hidden dials -> darts */
  function throwDarts(ids, pantry, dials, key) {
    var darts = [];
    (ids || []).forEach(function (id, n) {
      var ing = (pantry || []).filter(function (x) { return x.id === id; })[0];
      if (!ing || !ing.t) return;
      var d = dartFor(ing.t, key + "|" + id + "|" + n, ing.text);
      if (d) darts.push(d);
    });
    if (!darts.length && PCP.tastes) {
      var d0 = dartFor(PCP.tastes.flavorOf(dials || {}), key + "|house", "the house stock");
      if (d0) darts.push(d0);
    }
    // BULLSEYE: three darts scattered across the wheel = the pot is everything at once
    if (darts.length >= 3) {
      var spread = 0, petals = {};
      darts.forEach(function (a) { petals[a.petal] = 1; darts.forEach(function (b) { var d = Math.abs(norm(a.angle - b.angle + 180) - 180); spread = Math.max(spread, d); }); });
      if (Object.keys(petals).length >= 3 && spread >= 135) darts.push({ label: "the whole pot at once", bull: true, angle: 0, r: 0, x: 0, y: 0, tags: ["overwhelm"], word: "overwhelm", petal: null, ring: "bull" });
    }
    return darts;
  }

  /* ---------- picking cutouts by emotion ---------- */
  function tagPoint(tag) { var k = resolve(tag); if (!k) return null; var t = TAGS[k]; return xy(t.angle, t.r); }
  function closeness(dart, asset) {
    var best = 0;
    (asset.emo || []).forEach(function (tag) {
      var k = resolve(tag); if (!k) return;
      if (k === "overwhelm" || dart.bull) { if (k === "overwhelm" && dart.bull) best = 1; return; }  // the bull only matches the bull
      var p = tagPoint(k);
      var d = Math.sqrt(Math.pow(p.x - dart.x, 2) + Math.pow(p.y - dart.y, 2));
      best = Math.max(best, Math.exp(-d / 0.16));
    });
    return best;
  }
  function pickAssets(rng, darts, assets, ingredientCats, count) {
    if (!assets || !assets.length || count <= 0) return [];
    var pool = assets.slice(), chosen = [];
    for (var n = 0; n < count && pool.length; n++) {
      var weights = pool.map(function (a) {
        var w = darts.reduce(function (s, d) { return s + closeness(d, a); }, 0);
        if (!(a.emo && a.emo.length)) w = 0.05;                      // untagged fragments stay possible, just unlikely
        var cat = (a.cats || []).reduce(function (s, c) { return s + (ingredientCats.indexOf(c) >= 0 ? 0.15 : 0); }, 0);
        return Math.pow(w, 3) + cat * 0.5 + 0.004;
      });
      var pick = rng.weighted(pool, weights);
      chosen.push(pick.id);
      pool.splice(pool.indexOf(pick), 1);
    }
    return chosen;
  }

  /* ---------- drawing the board (SVG string; the lab uses it) ---------- */
  function mix(hex, amt) { // amt 0 = colour, 1 = paper
    var h = hex.replace("#", ""), c = [0, 2, 4].map(function (i) { return parseInt(h.substr(i, 2), 16); });
    var paper = [244, 244, 242];
    return "#" + c.map(function (v, i) { return Math.round(v + (paper[i] - v) * amt).toString(16).padStart(2, "0"); }).join("");
  }
  function wedgePath(a0, a1, r0, r1) {
    var p0 = xy(a0, r1), p1 = xy(a1, r1), p2 = xy(a1, r0), p3 = xy(a0, r0), s = 100;
    var large = (a1 - a0) > 180 ? 1 : 0;
    return "M" + (p0.x * s).toFixed(2) + " " + (p0.y * s).toFixed(2) +
      " A" + (r1 * s) + " " + (r1 * s) + " 0 " + large + " 1 " + (p1.x * s).toFixed(2) + " " + (p1.y * s).toFixed(2) +
      " L" + (p2.x * s).toFixed(2) + " " + (p2.y * s).toFixed(2) +
      (r0 > 0 ? " A" + (r0 * s) + " " + (r0 * s) + " 0 " + large + " 0 " + (p3.x * s).toFixed(2) + " " + (p3.y * s).toFixed(2) : "") + " Z";
  }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
  function svg(opts) {
    opts = opts || {};
    var on = {}; (opts.selected || []).forEach(function (t) { var k = resolve(t); if (k) on[k] = 1; });
    var out = ['<svg class="board-svg" viewBox="-126 -126 252 252" role="img" aria-label="' + esc(opts.label || "Emotion dartboard") + '">'];
    PETALS.forEach(function (p, i) {
      RINGS.forEach(function (rg, k) {
        var tag = p.ring[k];
        out.push('<path class="bw' + (on[tag] ? " on" : "") + '" data-tag="' + tag + '" d="' + wedgePath(i * 45 - 22.5, i * 45 + 22.5, k ? rg.from : BULL, rg.to) +
          '" fill="' + mix(p.color, [0.05, 0.38, 0.7][k]) + '"><title>' + tag + '</title></path>');
      });
      p.ring.forEach(function (w, k) {           // every cell is labelled, so tagging works by sight on a phone
        var lp = xy(i * 45, k === 0 ? 0.3 : RINGS[k].mid);
        out.push('<text class="bl' + (k === 1 ? "" : " bl-s") + '" x="' + (lp.x * 100).toFixed(1) + '" y="' + (lp.y * 100 + 1.6).toFixed(1) + '">' + w + '</text>');
      });
    });
    DYADS.forEach(function (w, i) {
      out.push('<path class="bw dy' + (on[w] ? " on" : "") + '" data-tag="' + w + '" d="' + wedgePath(i * 45, i * 45 + 45, DYAD_IN, DYAD_OUT) + '" fill="#2b2b2b"><title>' + w + '</title></path>');
      var lp = xy(i * 45 + 22.5, 1.1);
      out.push('<text class="bl dl" x="' + (lp.x * 100).toFixed(1) + '" y="' + (lp.y * 100 + 2).toFixed(1) + '">' + w + '</text>');
    });
    out.push('<circle class="bw bull' + (on.overwhelm ? " on" : "") + '" data-tag="overwhelm" cx="0" cy="0" r="' + BULL * 100 + '"><title>overwhelm</title></circle>');
    (opts.darts || []).forEach(function (d, n) {
      var x = (d.x * 100).toFixed(1), y = (d.y * 100).toFixed(1);
      out.push('<g class="dart"><circle cx="' + x + '" cy="' + y + '" r="5.5"/><text x="' + x + '" y="' + (+y + 2.6).toFixed(1) + '">' + (n + 1) + '</text></g>');
    });
    out.push("</svg>");
    return out.join("");
  }

  PCP.board = {
    PETALS: PETALS, DYADS: DYADS, RINGS: RINGS, TAGS: TAGS, ALIASES: ALIASES, TASTE_AIM: TASTE_AIM,
    resolve: resolve, readPoint: readPoint, throwDarts: throwDarts, pickAssets: pickAssets, closeness: closeness, svg: svg,
    words: function () { return Object.keys(TAGS); }
  };
})();
